# Vue 3 Upgrade Plan

## Goal

Upgrade `sala_v2` from Vue 2.7 to the latest Vue 3, with minimal code churn and full feature parity.

## Current State

- Vue 2.7 SPA built with `@vue/cli-service` 4, Node 14.19.3, hosted on Netlify.
- Vue ecosystem deps: `vue-router` 3, `vuex` 3, `vuex-persist` 2, `vue-i18n` 8, `vue-mousetrap` 1, `@fortawesome/vue-fontawesome` 0.1.
- Features in use (must all survive): bilingual EN/AR with RTL, Vuex-persisted theme/font/language/flip state, FontAwesome icons, `<i18n>` template component with named slot in `Home.vue`, global keyboard shortcuts (help, cv/resume, about, 30, 25, f, t, Konami code, space-to-cycle-lang), per-key CSS animations, router routes incl. external redirects for `/cv` and `/resume`, `GIT_DESCRIBE` build-time inject, Netlify build.

## Upgrade Target

| Dep | From | To | Notes |
| --- | --- | --- | --- |
| `vue` | 2.7.x | 3.5.x | core |
| `vue-router` | 3 | 4 | `createRouter` + `createWebHistory` |
| `vuex` | 3 | 4 | `createStore`; API otherwise identical |
| `vuex-persist` | 2 | 3 | Vue 3 / Vuex 4 compat release |
| `vue-i18n` | 8 | 9 (or 10) | legacy mode on to keep `$t` / options-API style |
| `@fortawesome/vue-fontawesome` | 0.1 (v2) | 3.x | Vue 3 build; icon packs unchanged |
| `vue-mousetrap` | 1 | — | **remove**. No Vue 3 version. Use raw `mousetrap` inline in `App.vue`. |
| `@vue/cli-service` | 4 | 5 | Vue 3 + webpack 5 |
| `eslint-plugin-vue` | 5 | 9 | Vue 3 rules |
| `@vue/eslint-config-prettier` | 4 | 9 | |
| `babel-eslint` | 10 | — | replace with `@babel/eslint-parser` |
| `vue-template-compiler` | 2 | — | remove (Vue 3 uses `@vue/compiler-sfc`, bundled) |

Node: bump engines from 14.19.3 to 20.x (Vue 3 toolchain requires ≥18). Update `README.md` and add `.nvmrc` / Netlify `NODE_VERSION` env. Dart `sass` is already in devDeps (the README note about `node-sass` is already stale).

## Design / Approach

Keep the existing Options API everywhere. No switch to Composition API, no switch to `<script setup>`, no switch to Pinia or Vite. This keeps the diff small and preserves the shape of every file.

Key migration shape:

- `main.js`: replace `new Vue({...}).$mount('#app')` with `createApp(App).use(router).use(store).use(i18n).component('font-awesome-icon', FontAwesomeIcon).mount('#app')`. Register the `<i18n-t>` component globally.
- `store.js`: `new Vuex.Store` → `createStore`. Drop `Vue.use(Vuex)`.
- `i18n.js`: `new VueI18n({...})` → `createI18n({ legacy: true, allowComposition: false, messages })`. Keep `loadLocaleMessages` with `require.context` (CLI 5 / webpack 5 still supports it).
- `App.vue`: remove `$mousetrap` plugin; import `mousetrap` directly, bind the same chord list in `mounted`, unbind in `beforeUnmount`. Everything else (store watchers, lifecycle hooks, `$i18n.locale` assignment) is unchanged.
- `Home.vue`: rewrite the `<i18n path="p2">` block to `<i18n-t keypath="p2" tag="p">` with `<template #smile>` — the renamed component and keypath prop are the only breaking change for this file.
- Other components (`LangSwitcher`, `Icons`, `ThemeToggler`, `About`, `Thirty`, `NYCMarathon24/25`, `Bday25`): templates stay as-is; verify none rely on removed features (filters, `$listeners`, `$children`, `.sync`). Quick scan says none do.
- `vue.config.js`: drop `@kazupon/vue-i18n-loader` option, keep `gitDescribe` and `runtimeCompiler` (kept because `i18n.js` uses `require.context` and some templates may be compiled at runtime).
- `netlify.toml`: add `[build.environment] NODE_VERSION = "20"`.

## Implementation Steps

1. Branch `saleh/vue3-upgrade` off `main`.
2. Update `package.json` deps + engines; delete `package-lock.json`; reinstall under Node 20.
3. Port `store.js` to Vuex 4 `createStore`; confirm `vuex-persist` v3 import.
4. Port `i18n.js` to `createI18n` with `legacy: true`.
5. Port `main.js`: `createApp` wiring + FontAwesome + mousetrap-free router; add the `<i18n-t>` component registration.
6. Port `App.vue`: swap `this.$mousetrap.bind(...)` for `Mousetrap.bind(...)` (same key arrays), add `beforeUnmount` to unbind. No template changes.
7. Port `Home.vue` template for the one `<i18n>` slot block.
8. Touch `vue.config.js`, `README.md`, `netlify.toml`, `.nvmrc` as noted.
9. `npm run serve` locally — verify every feature in the parity checklist below.
10. `npm run build` — verify a clean production build and check `dist/` size hasn't regressed.

### Feature Parity Checklist (manual, in browser)

- [ ] Home renders with photo, paragraphs, footer
- [ ] Lang switcher flips between EN and AR; RTL direction applies; fonts swap
- [ ] Space bar cycles language
- [ ] `f` / `خ` toggles fun font; persists on reload
- [ ] `t` / `ل` toggles theme; persists on reload
- [ ] `help` / `مساعده` prints the console hint
- [ ] `cv` / `resume` / `سيره` redirects to the Drive résumé
- [ ] `about`, `30`/`thirty`, `25`/`marathon` navigate to the sub-pages
- [ ] Konami code / `iddqd` triggers flip animation
- [ ] Per-key CSS animation fires on keydown
- [ ] Footer "last updated" date formats correctly in both locales (Gregorian + Hijri on AR)
- [ ] `/cv`, `/resume` external redirects still work
- [ ] `*` catch-all redirects to `/`
- [ ] Vuex-persist restores theme/font/lang across reload
- [ ] `GIT_DESCRIBE.hash` still injected and links to GitHub commit
- [ ] Netlify build green on the branch

## Success Criteria

- `npm run serve` and `npm run build` succeed on Node 20.
- All checklist items pass in manual browser testing.
- No runtime console warnings from Vue 3 compat layer (we aren't using `@vue/compat`; clean Vue 3).
- Netlify deploy preview is green.
- Diff is limited to deps, four wiring files (`main.js`, `store.js`, `i18n.js`, `App.vue`), one template (`Home.vue`), and config (`vue.config.js`, `netlify.toml`, `README.md`, `.nvmrc`).

## Risks & Mitigations

- **`vuex-persist` v3 Vue 3 compat** — if the v3 release doesn't play nicely with Vuex 4 here, fall back to `pinia-plugin-persistedstate`-style manual persistence via a tiny plugin in `store.js` (≈10 lines). Decide inside step 3.
- **`require.context` removal in webpack 5** — still supported. If CLI 5 config surprises us, inline the two locale imports (`en.json`, `ar.json`) — there are only two, so this is trivial.
- **`vue-i18n` v9 legacy mode quirks** — template-level `<i18n>` component was renamed to `<i18n-t>`. The slot syntax (`<template #smile>`) still works. If we hit any `$t` behaviour delta, toggle `allowComposition: false` and `warnHtmlMessage: false` to match v8 defaults.
- **Netlify node version** — old build cache may cling to Node 14. Bust by setting `NODE_VERSION = "20"` in `netlify.toml` and clearing the cache on first deploy.
- **`vue-mousetrap` removal** — verified `this.$mousetrap` is only referenced in `App.vue`. Swap is localized.
- **FontAwesome v3 icon registration** — same `library.add(...)` pattern; only change is global component registration moves from `Vue.component` to `app.component`.
- **`runtimeCompiler: true`** — kept because nothing obvious depends on it, but worth double-checking after the port; if templates all compile at build time, we can drop it in a follow-up.
