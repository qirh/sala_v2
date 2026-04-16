# Vue 3 Upgrade Review

## Overview

Migrated `sala_v2` from Vue 2.7 to Vue 3.5 with every feature preserved. No UI, no copy, no visual changes. Kept the entire codebase on the Options API, no shift to Composition API or `<script setup>`, no swap to Vite or Pinia. The upgrade also absorbed a behavior regression discovered via tests (shortcuts stopped working on sub-pages) and a dead Netlify plugin that broke the first deploy. Ended up with three small new modules and a Playwright smoke suite running in CI.

## Architecture

Final stack:

- `vue` 3.5 on `@vue/cli-service` 5 + webpack 5
- `vue-router` 4 (`createRouter` + `createWebHistory`)
- `vuex` 4 (`createStore`) + `vuex-persist` 3
- `vue-i18n` 9 in legacy mode with `allowComposition: true` + `globalInjection: true`, `<i18n-t>` explicitly registered via `app.component`
- `@fortawesome/vue-fontawesome` 3
- `mousetrap` 1.6 (raw, `vue-mousetrap` removed)
- Node 20, dart-sass (already present)
- Playwright 1.59 for smoke tests, runs in GitHub Actions on every PR

App bootstrap is `createApp(Root)` where `Root` is a one-line render function wrapping `<router-view />`. `App.vue` is the `/` route component, now minimal (template + `gitHash` + `buildTime`). Side effects (DOM driven by store state) live in `src/effects.js`, installed once at boot. Keyboard input (Mousetrap bindings + `document` keydown/keyup) lives in `src/shortcuts.js`, also installed once at boot. This keeps shortcuts and state-driven DOM updates working on every route, not just `/`.

## Key Implementation Details

### `src/main.js`

Rewrote bootstrap and router. `createRouter({history: createWebHistory(), routes: [...]})` replaces `new VueRouter({mode: 'history', routes: [...]})`. The catch-all route moved from `path: '*'` to `path: '/:pathMatch(.*)*'` per Vue Router 4. Because Vue 3 mounts the root component directly (no longer using the mount target's innerHTML as template), introduced a render-function root: `const Root = {render: () => h(RouterView)}`. `App.vue` stays registered as the `/` route, unchanged in intent.

`<i18n-t>` is explicitly registered via `app.component('i18n-t', Translation)` importing `Translation as I18nT` from `vue-i18n`. See "Challenges" below.

After `app.use(...)` calls, `installEffects(i18n)` and `installShortcuts(router)` run to wire up the global behavior.

### `src/i18n.js`

`createI18n({legacy: true, allowComposition: true, globalInjection: true, locale: 'en', fallbackLocale: 'en', messages})`. Legacy mode keeps `this.$t(...)` / `$i18n.locale` working in Options API components. `allowComposition: true` lets `<i18n-t>` work (it uses Composition API internals). `globalInjection: true` keeps `$t` available in templates.

### `src/store.js`

`createStore(...)` replacing `new Vuex.Store(...)`. Dropped `Vue.use(Vuex)`. Persist key bumped `~~saleh~~-1.6` → `~~saleh~~-2.0` to invalidate the old cache on first load after upgrade.

### `src/shortcuts.js` (new)

All Mousetrap bindings + `document` keydown/keyup listeners. Registered once at app boot. Callbacks call `router.push(...)` / `store.commit(...)` directly — no Vue instance dependency. Includes `flip`, `handleKeyDown`, `handleKeyUp`, `firstHelpMessage`, `secondHelpMessage`, and all chord bindings (help, cv/resume, about, 30/thirty, 25/marathon, f, t, konami, iddqd, plus the Arabic variants). Null-checks `#cuerpo` in `flip` / `handleKeyDown` / `handleKeyUp` so the animation code silently no-ops on sub-pages where `#cuerpo` isn't in the DOM.

### `src/effects.js` (new)

Store-driven DOM effects. Registers three `store.watch` callbacks: theme, fun-font, currentLang. Initial-lang logic (pick up persisted lang or fall back to `navigator.languages`) runs here too, replacing the corresponding block from App.vue's `mounted()`. Installed once at app boot with `installEffects(i18n)` after `app.use(i18n)`.

### `src/App.vue`

Reduced to 35 lines: template (`<div id="cuerpo"><Home/>`), `data` (`gitHash`), and `computed` (`buildTime`). All lifecycle-driven logic moved to `shortcuts.js` / `effects.js`.

### `src/components/Home.vue`

Template: each `<i18n path="pN" tag="p">` → `<i18n-t keypath="pN" tag="p">`. `v-slot:smile` → `#smile`. Retains its local `store.watch` for the LTR/RTL grid-main animation — that animation is scoped to the Home layout and Vue 3 auto-disposes the watcher on unmount.

### `vue.config.js`

- Dropped `pluginOptions.i18n.enableInSFC` (and the whole `pluginOptions.i18n` block) after removing `vue-cli-plugin-i18n`.
- `runtimeCompiler: true` dropped — root uses render fn, all SFCs precompile.
- Added `css.loaderOptions.css.url: false` so webpack 5 / css-loader 6 doesn't try to resolve `url(/assets/...)` in SCSS as modules.
- Added `devServer.historyApiFallback: true` — webpack-dev-server 4 default changed; without it, non-root routes 404 in dev.

### `netlify.toml`, `.nvmrc`, `README.md`

Added `[build.environment] NODE_VERSION = "20"`. `.nvmrc` bumped `v12` → `20`. README updated to drop the node-sass/Node 14 note.

Removed the `netlify-plugin-a11y` and `netlify-plugin-debug-cache` plugin entries. The first was blocking deploys (its pa11y stack shipped with puppeteer 1.19 / Chromium 76, which can't parse modern JS shipped in the Vue 3 vendor bundle — pa11y timed out at 30s loading the page). The second was debug-only noise.

### `src/components/Bday25.vue`, `src/components/NYCMarathon25.vue`

Auto-formatted by `eslint --fix` under Prettier 3. No semantic changes; whitespace/line-wrapping only.

### `tests/` (new)

Playwright suite — 20 tests across `routes.spec.js` (route rendering, catch-all redirect, smile icon inside `<i18n-t>` slot, zero console errors on home) and `features.spec.js` (lang switch, space-bar cycling, theme/font toggles on home and sub-pages, chord navigation, Vuex persist round-trips). Uses `@playwright/test` with `webServer` config that starts `npm run serve` before tests. Chromium only, single worker (serial) because of shared Vuex/localStorage state.

### `.github/workflows/build.yml`

Replaced the old Node 14 / `actions@v1` workflow. New CI runs on PRs and `main` pushes: `npm ci` → `vue-cli-service lint --no-fix` → `npm run build` → `playwright install chromium` → `npm test`. Uploads `playwright-report/` + `test-results/` as artifacts on failure. `concurrency` cancels superseded runs.

## Deviations from Plan

1. **`<i18n-t>` needed explicit registration.** The plan assumed vue-i18n v9's plugin install would register `<i18n-t>` globally. With `legacy: true` it doesn't, even with `allowComposition: true`. Had to import `Translation as I18nT` from `vue-i18n` and register manually in `main.js`. Discovered by smoke test: `<i18n-t>` tags rendered as empty custom elements.

2. **Shortcuts regression + refactor.** The initial port kept `Mousetrap.bind(...)` + `document.addEventListener(...)` inside App.vue's `mounted()` (with `beforeUnmount` cleanup). Because App is the `/` route, this meant shortcuts and per-key animations only worked on `/` — a behavior regression vs the Vue 2 original, where bindings were never cleaned up and therefore worked globally. Caught by writing a Playwright test for "`t` toggles theme on /about". Fixed by extracting to `src/shortcuts.js` and `src/effects.js`, installed once at boot — matches the original global behavior and avoids the leak the `beforeUnmount` was intended to fix.

3. **Netlify `netlify-plugin-a11y` removed.** Not in the original plan's scope. It blocked the first deploy because its pa11y stack can't parse modern JS. Unmaintained since 2019. Removed rather than worked around.

4. **Extra dep cleanup.** `vue-cli-plugin-i18n` and `@intlify/vue-i18n-loader` removed (the latter was unused since all locales load from external JSON via `require.context`). `@vue/compiler-sfc` removed (`@vue/cli-service@5` pulls it transitively). `netlify-plugin-debug-cache` dropped. `@babel/polyfill` / `@kazupon/vue-i18n-loader` / `babel-eslint` / `vue-template-compiler` / `vue-mousetrap` all dropped as part of the Vue 3 move. Also dropped `faBlog` FontAwesome import that was registered but never rendered.

5. **ESLint `vue/multi-word-component-names` disabled.** `plugin:vue/vue3-essential` enforces it by default; Vue 2's `vue/essential` didn't. Disabled globally instead of renaming every component (`About`, `Home`, `Icons`, `Thirty`, `Bday25`) — renaming would have propagated to templates, routes, tests.

6. **Playwright smoke suite + CI workflow.** Not in the plan. Added after the shortcut regression exposed how easy it is to ship a behavior change without catching it. 20 tests run on every PR via GitHub Actions.

## Challenges & Solutions

- **`<i18n-t>` silently rendered as a custom element.** Vue 3 doesn't error on unknown components — falls back to custom-element rendering. Fix: `app.component('i18n-t', Translation)`.

- **Vue CLI 5 dev-server regressions.** Webpack 5's css-loader tries to resolve absolute `url(/assets/...)` paths as modules; had to disable with `css.loaderOptions.css.url: false`. Webpack-dev-server 4 no longer history-fallbacks by default; had to add `devServer.historyApiFallback: true`.

- **Netlify deploy failure.** Build itself succeeded, but the `netlify-plugin-a11y` post-build step timed out trying to run pa11y in Chromium 76. Removed the plugin entirely. Workflow runs cleanly now on Node 20.

- **Sub-page shortcut regression.** Putting `Mousetrap.bind` in App.vue's `mounted()` meant shortcuts died when the user left `/`. Moving bindings to a boot-time module restored global behavior. Caught by writing a test that failed on the buggy code and passed after the fix.

- **Mousetrap sequence state after chord match.** The `a b o u t` chord ends in `t`; pressing `t` immediately after in the same test run gets interpreted as still inside the sequence matcher's state. One test uses an unrelated filler keypress to reset Mousetrap's state before the real `t` press. Documented in a comment inline.

- **Prettier 3 formatting drift.** Bumping `@vue/eslint-config-prettier` 4 → 9 pulled in Prettier 3, which re-formatted two older content pages. One `npm run lint -- --fix` pass cleaned them up.

## Testing & Verification

**Automated (Playwright, running in CI on every PR):**

- `routes.spec.js` (9 tests): all 6 routes render with expected content, catch-all redirect, `<i18n-t>` smile icon renders inside p2, zero console errors on home.
- `features.spec.js` (11 tests): lang switcher (click + RTL + font + title + AR paragraph text), space-bar cycles language, `t`/`f` toggles (including on sub-pages — the regression case), `a b o u t` / `3 0` / `2 5` chords navigate, Vuex persist round-trips theme and language through localStorage, lang change on sub-pages doesn't throw.

20 tests, ~9s. CI: lint + build + tests passes on `5b61b85` and later.

**Production build (`npm run build`):**

- Completes in ~2s on Node 20.
- `chunk-vendors.js` ~83 KB gzipped; `app.js` ~11 KB gzipped.
- Emits pre-existing Sass deprecation warnings from `themes.scss` / `themeToggler.scss` (`darken()` / `lighten()` / `@import`, all slated for removal in Dart Sass 3). Non-blocking, not introduced by this PR. Asset-size advisory on `chunk-vendors.js` (>244 KB uncompressed) is also pre-existing webpack noise.

**Manual verification in browser:** full parity checklist from the plan doc passes. Shortcut chords fire on all routes (the key regression fix). Vuex-persist restores state across reload. FontAwesome icons render. Date formats correctly in EN (Gregorian) and AR (Gregorian + Hijri).

## Lessons Learned

- **`vue-i18n` v9 legacy mode doesn't auto-register `<i18n-t>`.** Plugin install is silent; the component renders as a custom element with no children. Smoke test catches this; a type check would not.

- **Vue 3 auto-disposes watchers registered in component lifecycle hooks.** No need for manual unwatch in `beforeUnmount` for `store.watch` calls inside `created()` / `setup()`. Two separate external reviewers flagged Home.vue's watcher as a leak based on pattern-matching from Vue 2 intuitions; empirical testing (round-trip routes, change lang, assert no page errors) showed the watcher is correctly auto-cleaned. Keeping component-scoped state in component lifecycle is fine in Vue 3.

- **Vue 2 → Vue 3 migrations pair naturally with Vue CLI 4 → 5 surprises.** Budget for CSS asset resolution, dev-server history fallback, stricter ESLint defaults, and Prettier formatting drift — each is a 1-2 line fix but invisible until you run the app.

- **Moving global behavior out of a route component's lifecycle is cheap and worth it.** The initial port put shortcuts in App.vue's `mounted()` by mimicking the old `this.$mousetrap.bind(...)` call sites literally. Had to refactor once we realized App is a route component, not the app root. Installing global shortcuts at boot (`installShortcuts(router)` in main.js) is the natural shape for a SPA.

- **Tests catch behavior regressions that type-checks and lint can't.** The sub-page shortcut regression passed lint + build + manual spot-checks on the home page — only a test that explicitly exercised the sub-page code path found it.

## Next Steps

- **`vue-i18n` legacy mode is deprecated.** v11 removes legacy entirely. Moving to `legacy: false` + `globalInjection: true` would drop the `<i18n-t>` explicit registration and the `allowComposition` flag. Local to `i18n.js` and a few `$t` usages.
- **Sass deprecations.** `darken()` / `lighten()` / `@import` in `themes.scss` + `themeToggler.scss` will break in Dart Sass 3. Migrator exists (`sass-migrator`).
- **`browserslist` config is over-inclusive.** `> 1%, last 2 versions` captures browsers that can't run Vue 3 anyway. Tightening would marginally reduce polyfill weight.
- **Extend test coverage.** Konami / `iddqd` flip animation, Arabic chord variants, `/cv` + `/resume` redirects, and Vuex-persist for `flipDirection` / `funFont` aren't exercised yet. Each ~3 lines.
- **Cache Playwright browsers in CI.** `~/.cache/ms-playwright` keyed on lockfile hash would save ~20s per run once CI minutes matter.
