# Vue 3 Upgrade Review

## Overview

Migrated `sala_v2` from Vue 2.7 to Vue 3.5 with every feature preserved. No UI, no copy, no visual changes. Kept the entire codebase on the Options API, no shift to Composition API or `<script setup>`, no swap to Vite or Pinia. Diff is confined to dependency versions, five wiring files (`main.js`, `store.js`, `i18n.js`, `App.vue`, `Home.vue`), and config (`vue.config.js`, `netlify.toml`, `README.md`, `.nvmrc`).

## Architecture

The final stack:

- `vue` 3.5 on `@vue/cli-service` 5 + webpack 5
- `vue-router` 4 (`createRouter` + `createWebHistory`)
- `vuex` 4 (`createStore`) + `vuex-persist` 3
- `vue-i18n` 9 in legacy mode with `allowComposition: true` + `globalInjection: true`
- `@fortawesome/vue-fontawesome` 3 (Vue 3 build)
- `mousetrap` 1.6 (raw, wrapping plugin removed)
- Node 20, dart-sass (already present)

App bootstrap shape changed from `new Vue({router, store, i18n}).$mount('#app')` to `createApp(Root).use(router).use(store).use(i18n).component(...).mount('#app')`. Because Vue 3 no longer uses a mount-target's innerHTML as template, I introduced a one-liner root render function — `{render: () => h(RouterView)}` — to replace the `<router-view>` that used to live inline in `index.html`. The App component stays registered as the `/` route component, unchanged.

## Key Implementation Details

### `src/main.js`

Rewrote bootstrap and router creation. `createRouter({history: createWebHistory(), routes: [...]})` replaces `new VueRouter({mode: 'history', routes: [...]})`. The catch-all route moved from `path: '*'` to `path: '/:pathMatch(.*)*'` per Vue Router 4.

`<i18n-t>` is registered explicitly via `app.component('i18n-t', I18nT)` importing `Translation as I18nT` from `vue-i18n`. See "Challenges" below.

### `src/i18n.js`

`createI18n({legacy: true, allowComposition: true, globalInjection: true, messages})`. Legacy mode keeps `this.$t(...)` and `$i18n.locale` working in Options API components without touching them. `allowComposition: true` lets the `<i18n-t>` component work (it uses Composition API internals). `globalInjection: true` keeps `$t` / `$i18n` available in templates.

### `src/store.js`

`createStore({state, mutations, plugins})` replacing `new Vuex.Store(...)`. Dropped `Vue.use(Vuex)`. Persist key bumped `~~saleh~~-1.6` → `~~saleh~~-2.0` to invalidate the old cache — the README already calls out doing this on breaking changes, and swapping the state manager qualifies.

### `src/App.vue`

Replaced `this.$mousetrap.bind(...)` with direct `Mousetrap.bind(...)` calls. Same eight chord groups, identical arrays. All other options-API methods (`flip`, `applyTheme`, `applyFont`, `updateLangUI`, `handleKeyDown/Up`, `firstHelpMessage`, `secondHelpMessage`) are unchanged. `store.watch` continues to work with Vuex 4.

### `src/components/Home.vue`

Renamed each `<i18n path="pN" tag="p">` → `<i18n-t keypath="pN" tag="p">`. `v-slot:smile` → `#smile` shorthand (equivalent). No script changes.

### `vue.config.js`

Three changes:

- `runtimeCompiler: true` dropped — no runtime-compiled templates anymore (root uses render fn; all SFCs precompile).
- `pluginOptions.i18n.enableInSFC` kept (as `false`) because `vue-cli-plugin-i18n@2.3.2` destructures it unconditionally and will throw without it.
- Added `css.loaderOptions.css.url: false` — webpack 5 / css-loader 6 tries to resolve `url(/assets/...)` as modules by default; this preserves Vue 2's behavior of leaving absolute public-path URLs alone. Added `devServer.historyApiFallback: true` — Vue CLI 4 enabled this by default, 5 does not; without it, dev-server 404s on non-root routes.

### `netlify.toml`, `.nvmrc`, `README.md`

Added `[build.environment] NODE_VERSION = "20"` so Netlify builds on Node 20. `.nvmrc` bumped from `v12` to `20`. README note about node-sass/Node 14 deleted.

## Deviations from Plan

1. **`<i18n-t>` needed explicit registration.** The plan assumed vue-i18n v9's plugin install would globally register `<i18n-t>`. With `legacy: true` it doesn't, even with `allowComposition: true`. Had to add `app.component('i18n-t', Translation)` in `main.js` and import `Translation as I18nT` from `vue-i18n`. Discovered by headless-browser smoke test: `<i18n-t>` tags were rendering as literal custom elements with no children.

2. **vue-cli-service 5 dev server regressions.** Two surprises — CSS URL resolution and `historyApiFallback` — both caught by the dev server and fixed in `vue.config.js` (css + devServer blocks). The plan didn't anticipate these.

3. **ESLint `vue/multi-word-component-names` rule.** `plugin:vue/vue3-essential` enforces multi-word component names by default; the Vue 2 `vue/essential` config didn't. Disabled the rule in `package.json` rather than renaming every component (`About`, `Home`, `Icons`, `Thirty`, `Bday25`) — renaming would propagate to templates, routes, and the PR scope.

4. **Kept `vue-cli-plugin-i18n` (v2.3.2)** instead of removing. Still needed for the `i18n:report` script. It carries a transitive `vue-i18n@8` dep (shows as a deprecation warning at install) — benign, not bundled into the app build.

## Challenges & Solutions

- **`<i18n-t>` silently rendered as a custom element.** First iteration showed empty `<i18n-t keypath="p1" tag="p">` nodes with no child text. Vue 3 doesn't error on unknown components — it falls back to custom-element rendering. Explicit `app.component('i18n-t', Translation)` fixed it. Verified via headless Chrome that all five paragraphs render with correct content, and that `<i18n-t>` with the `#smile` slot still injects the FontAwesome icon inline.

- **Dev-server CSS 404s for `/assets/fonts/*.woff2`.** Webpack 5's css-loader defaults to treating absolute `url(...)` references as modules. Since the fonts are served from `public/assets/`, we want absolute paths left as-is. Disabled via `css.loaderOptions.css.url: false`.

- **Non-root routes 404ing on the dev server.** SPA history-fallback is no longer default in `webpack-dev-server` 4. Added `devServer.historyApiFallback: true`.

- **Dev dependency resolution.** The install surfaces deprecation warnings (pa11y stack, old eslint, vue-i18n v9 itself, etc.) but none are fatal and none affect production bundle correctness.

## Testing & Verification

All manual checks in the plan's parity checklist passed. Automated verification was done with a modern headless Chrome (system Chrome 147) driven via puppeteer 23.

End-to-end feature pass (on `localhost:8080` via `npm run serve`):

- Home renders with photo, title (`👋 I'm Saleh`), five paragraphs, footer with build date link.
- Lang switcher click flips EN → AR: `html[lang]` → `ar`, `document.title` → `صالح الغصون`, body class `font-rubik` → `font-amiri`, `#grid-main` picks up `right-to-left` class, all paragraphs render Arabic text.
- Space bar cycles AR → EN.
- `t` toggles body class `light-theme` ↔ `dark-theme`.
- `f` toggles font `font-rubik` ↔ `font-ibm`.
- `a b o u t` chord navigates to `/about`.
- Footer date formats correctly in EN (Gregorian) and AR (Gregorian + Hijri side by side).
- Smile icon renders inline inside p2 via the `<i18n-t>` `#smile` slot.
- `/about`, `/30`, `/nycmarathon24`, `/nycmarathon25`, `/bday25` all render their content.
- `/cv` and `/resume` hit their `beforeEnter` guard and redirect to Drive.
- `*` catch-all redirects to `/`.
- Vuex-persist writes to `localStorage['~~saleh~~-2.0']` with `{theme, flipDirection, funFont, currentLang}`.
- Zero console errors or warnings on any route.

Production build (`npm run build`):

- Completes in ~2s on Node 20.
- `chunk-vendors.js` 82.93 KiB gzipped; `app.js` 11.25 KiB gzipped; `app.css` 2.73 KiB gzipped.
- No errors, standard webpack "consider code splitting" advisory only.

## Lessons Learned

- When migrating to vue-i18n v9 in legacy mode, don't rely on plugin auto-registration for `<i18n-t>` — register it explicitly. This is quietly broken in legacy mode even with `allowComposition: true`, and Vue 3 won't error, just render nothing.
- For any Vue 2 → Vue 3 migration that also bumps Vue CLI 4 → 5, budget for at least one hit on each of: CSS asset resolution, dev-server history fallback, and stricter ESLint defaults. They are cheap to fix but invisible until you actually run the app.
- Headless smoke testing catches these without a browser open. Worth the ten lines of puppeteer.

## Next Steps

- Consider migrating `vue-i18n` off legacy mode in a follow-up. Composition API mode is the long-term target — `vue-i18n@11` removes legacy entirely. The change is local to `i18n.js` and a handful of `$t` → `t` renames inside `<script>` blocks.
- `pa11y` / `netlify-plugin-a11y` pulls in puppeteer 1.19 transitively and throws deprecation warnings at install. Worth revisiting whether the a11y plugin is still used in Netlify deploys.
- The `runtimeCompiler: true` removal dropped a small amount of bundle weight — a future pass could audit whether `vue-cli-plugin-i18n` can be removed too (only `i18n:report` keeps it).
