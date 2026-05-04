# Migrate saleh.sh from Vue 2 SPA to SvelteKit

## Context

This is **Phase 1A** of a three-phase project to unify saleh.sh and saleh.soy onto a single modern stack:

- **Phase 1A** (this doc, this repo): rewrite `saleh.sh` from Vue 2 to SvelteKit. Same domain, same Netlify project. No blog work.
- **Phase 1B** (a parallel doc in `qirh/blog`): rewrite `saleh.soy` from pandoc/Makefile to SvelteKit. Same domain, same Netlify project. No SPA work.
- **Phase 2** (later, this repo): merge the blog source into this repo, route blog under `/blog/*`, retire the `qirh/blog` repo.
- **Phase 3** (later): point `saleh.soy` at the unified site via a 301 forwarder Netlify project.

This document is the blueprint for **Phase 1A only**. An executing agent should not touch the blog or domain config.

Background and rationale for the three-phase decomposition is in `docs/unify-blog-plan.md` (PR #83).

## Goal
Ship a SvelteKit replacement of the existing Vue 2 SPA at `https://saleh.sh`, with full feature parity. Visitors should not be able to tell the rewrite happened.

## Scope

**In:**
- Replace the Vue 2 + vue-cli build with SvelteKit + Vite.
- Port every existing route, component, store, and i18n string.
- Preserve all current `netlify.toml` redirects/headers verbatim.
- Preserve the build artifact location (`dist/` → SvelteKit's adapter-static `build/`, with `netlify.toml` updated to match).

**Out:**
- Adding new pages or content.
- Visual redesign — output should match pixel-for-pixel-ish.
- Anything blog-related.
- Anything domain-related.
- Updating CONTRIBUTING / README beyond what build commands require.

## Target stack

- **SvelteKit** with the `@sveltejs/adapter-static` adapter (the site has no server-side rendering needs; this stays a static build).
- **Svelte 5** (current). Use `runes` mode for state.
- **TypeScript: no.** The current codebase is JS-only — keep it JS-only to minimize the diff and review surface.
- **Styling: keep SCSS.** Reuse `src/assets/styles/*.scss` as-is via `svelte-preprocess` + `sass`.
- **i18n:** [`svelte-i18n`](https://github.com/kaisermann/svelte-i18n). Keep the existing `src/locales/{en,ar}.json` files. **Caveat:** `Home.vue` uses vue-i18n's `<i18n>` *component* with a slotted icon (`{smile}` placeholder in `p2`); see Migration Mapping for handling.
- **Persistence:** drop `vuex-persist` the library, but **preserve its on-disk schema**. Today the entire Vuex state object lives at `localStorage['~~saleh~~-1.6']`:
  ```json
  { "theme": "light", "flipDirection": true, "funFont": false, "currentLang": {...} }
  ```
  The replacement is a single `persistedStore('~~saleh~~-1.6', initial)` that reads/writes this exact composite object. Helper methods (`toggleTheme()`, `changeLang(lo)`, etc.) `update()` named slots inside it. **Do not split into per-key stores** — that would invalidate every existing visitor's saved preferences.
- **Keyboard shortcuts:** drop `vue-mousetrap`. Use [`tinykeys`](https://github.com/jamiebuilds/tinykeys). Bindings are *sequences*, including non-ASCII (Arabic), so verify in Step 6 that tinykeys handles `'م س ا ع د ه'` and similar — fall back to a custom sequence matcher if not.
- **Icons:** drop `@fortawesome/vue-fontawesome`. Use `@fortawesome/fontawesome-svg-core` directly with a small `<Icon>` Svelte wrapper (~20 lines). Copy the existing `library.add(...)` block from `src/main.js:26-34` verbatim:
  ```
  faGithub, faLinkedin, faGoodreads (brands)
  faEnvelope, faBlog, faFileAlt        (solid)
  faSmile                              (regular)
  ```
- **Build-time replacements:** replace both `vue-cli-plugin-git-describe` AND the `<%= new Date().toISOString() %>` EJS expression in `public/index.html`. Both are build-time string substitutions today; in SvelteKit, both go through Vite. Use `vite-plugin-html` (or a `transformIndexHtml` hook) to substitute `%BUILD_TIMESTAMP_UTC%` and `%GIT_DESCRIBE_HASH%` placeholders in `src/app.html` at build time. The existing consumer (`document.documentElement.dataset.buildTimestampUtc` in `App.vue:277`) and `GIT_DESCRIBE.hash` (in `App.vue:205`, `About.vue:18-20`, `Home.vue:64`) move to the new equivalents.

## End-state file tree

```
sala_v2/
├── package.json                # svelte/sveltekit/vite/sass deps; scripts: dev/build/preview
├── svelte.config.js            # adapter-static (fallback: '200.html'), preprocess (sass)
├── vite.config.js              # transformIndexHtml: %BUILD_TIMESTAMP_UTC%, %GIT_DESCRIBE_HASH%
├── netlify.toml                # build = "npm run build", publish = "build/"
├── src/
│   ├── app.html                # base HTML shell (replaces public/index.html); uses %...% placeholders
│   ├── lib/
│   │   ├── stores/
│   │   │   └── state.js        # single persisted composite store + toggleTheme / changeLang / toggleFont / switchFlipDirection helpers
│   │   ├── i18n.js             # svelte-i18n setup, loads ./locales/*.json
│   │   ├── consts.js           # langs, getNextLang, getLangObjectFromCode, mod
│   │   ├── persistedStore.js   # composite-object persisted writable helper
│   │   ├── keybindings.js      # explicit binding table → handlers; uses tinykeys (or custom sequencer)
│   │   └── components/
│   │       ├── Home.svelte
│   │       ├── Icons.svelte
│   │       ├── LangSwitcher.svelte
│   │       └── ThemeToggler.svelte
│   ├── locales/                # COPY of src/locales/{en,ar}.json — unchanged
│   ├── routes/
│   │   ├── +layout.svelte      # global flip animation, theme/lang application, key handlers
│   │   ├── +layout.js          # export const prerender = true
│   │   ├── +page.svelte        # home (replaces App.vue + Home.vue)
│   │   ├── about/+page.svelte
│   │   ├── 30/+page.svelte
│   │   ├── nycmarathon24/+page.svelte
│   │   ├── nycmarathon25/+page.svelte
│   │   └── bday25/+page.svelte
│   └── assets/
│       └── styles/             # COPY of src/assets/styles/*.scss — unchanged
├── static/                     # COPY of public/* (favicon, /assets/*.jpg, sitemap.xml, robots.txt)
└── docs/
    └── svelte-rewrite-plan.md  # this file
```

`docs/unify-blog-plan.md` stays. Old Vue files (`src/main.js`, `src/App.vue`, `src/components/*.vue`, `src/store.js`, `src/i18n.js`, `src/consts.js`, `vue.config.js`, `babel.config.js`, `budget.json`) are deleted in the same PR.

## Migration mapping

| Old (Vue 2) | New (Svelte 5) | Notes |
|---|---|---|
| `public/index.html` | `src/app.html` | SvelteKit owns the shell; preserve `<noscript>` block, fonts preload, `<meta>` tags. |
| `src/main.js` | `src/routes/+layout.svelte` (boot side) + `src/routes/+page.svelte` + `vite.config.js` (git describe) | Routes from `VueRouter` become SvelteKit filesystem routes. |
| `src/App.vue` | `src/routes/+page.svelte` | Top-level page; `flip()` and key handlers move to `+layout.svelte`. |
| `src/components/Home.vue` | `src/lib/components/Home.svelte` | |
| `src/components/About.vue` | `src/routes/about/+page.svelte` | |
| `src/components/Thirty.vue` | `src/routes/30/+page.svelte` | |
| `src/components/NYCMarathon24.vue` | `src/routes/nycmarathon24/+page.svelte` | |
| `src/components/NYCMarathon25.vue` | `src/routes/nycmarathon25/+page.svelte` | |
| `src/components/Bday25.vue` | `src/routes/bday25/+page.svelte` | |
| `src/components/LangSwitcher.vue` | `src/lib/components/LangSwitcher.svelte` | |
| `src/components/ThemeToggler.vue` | `src/lib/components/ThemeToggler.svelte` | |
| `src/components/Icons.vue` | `src/lib/components/Icons.svelte` | |
| `src/store.js` (Vuex + vuex-persist) | `src/lib/stores/state.js` + `src/lib/persistedStore.js` | **Single composite store** keyed at `~~saleh~~-1.6`, schema unchanged. Vuex mutations (`toggleTheme`, `changeLang(lo)`, `toggleFont`, `switchFlipDirection`) become exported helper functions that `state.update(...)` a named slot. Vuex `store.watch(() => state.theme, applyTheme)` translates to a Svelte `$:` reactive block in `+layout.svelte` (or a `state.subscribe` callback). |
| `src/i18n.js` | `src/lib/i18n.js` (svelte-i18n) | |
| `src/consts.js` | `src/lib/consts.js` | Pure functions, copy verbatim. |
| `src/locales/{en,ar}.json` | `src/locales/{en,ar}.json` | Copy verbatim. **But:** `Home.vue` consumes `p1`–`p5` via vue-i18n's `<i18n>` *component* with a slotted FontAwesome smile in `p2` (replacing `{smile}`). svelte-i18n has no slot-based interpolation. Translate by splitting `p2` around `{smile}` in `Home.svelte`: render `{$_('p2_before_smile')}` + `<Icon name="smile" />` + `{$_('p2_after_smile')}`. Add `p2_before_smile` and `p2_after_smile` to both locale JSON files (verbatim split of the existing `p2` value); leave the original `p2` in place for now to allow rollback. |
| `vue.config.js` | `vite.config.js` + `svelte.config.js` | `runtimeCompiler: true` is Vue-specific — drop, no Svelte equivalent. The `vue-cli-plugin-i18n` `enableInSFC` option is for SFC `<i18n>` *blocks* — verified absent (`grep -rn '<i18n>' src/components` shows zero block matches; the matches that exist are `<i18n>` *components*, handled above). Build-time substitutions move to `vite.config.js` `transformIndexHtml` (see Target Stack). |
| `babel.config.js`, `budget.json` | (deleted) | Vue-cli artifacts; no Svelte equivalent needed. |
| `public/index.html` (with EJS `<%= ... %>`) | `src/app.html` (with `%...%` placeholders, substituted by `transformIndexHtml`) | Preserve `data-build-timestamp-utc` and any other build-time substitutions. |
| `public/*` (other files) | `static/*` | SvelteKit serves `static/` at the URL root. Move favicons, `/assets/*.jpg`, `sitemap.xml`, `robots.txt`, etc. to `static/`. |

## Execution order

Each step ends with a verification an agent can run. If verification fails, stop and surface the error — don't continue.

### Step 1: scaffold the SvelteKit project alongside the Vue project
1. Create the new structure in a parallel directory inside the repo: `svelte/`. Run `npm create svelte@latest svelte` (Skeleton project, JS, no TS, no extras).
2. Inside `svelte/`, install `@sveltejs/adapter-static`, `svelte-preprocess`, `sass`, `svelte-i18n`, `tinykeys`, `@fortawesome/fontawesome-svg-core`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-regular-svg-icons`, `@fortawesome/free-brands-svg-icons`.
3. Configure `svelte/svelte.config.js` to use `adapter-static` with **`fallback: '200.html'`** (Netlify auto-uses this for SPA fallback; matches the existing `[[redirects]] /* → /, status 200` rule in `netlify.toml`). Enable `svelte-preprocess` with `scss`.
4. **Verify:** `cd svelte && npm run build` produces `build/200.html`.

The build runs in `svelte/`, alongside the existing Vue setup, so nothing in the live build pipeline changes during steps 1–8.

### Step 2: port styles and static assets
1. Copy `src/assets/styles/*.scss` → `svelte/src/assets/styles/`.
2. Copy `public/*` → `svelte/static/` (everything: `index.html` is overwritten by SvelteKit's app.html, but the fonts, images, favicon, robots, sitemap, manifest, noscript.css, normalize.css must be copied).
3. **Verify:** `ls svelte/static/assets | wc -l` matches `ls public/assets | wc -l`.

### Step 3: port i18n and constants
1. Copy `src/locales/en.json` and `src/locales/ar.json` → `svelte/src/locales/`.
2. Port `src/consts.js` → `svelte/src/lib/consts.js` (verbatim — pure functions).
3. Write `svelte/src/lib/i18n.js`: register `en` and `ar` with `svelte-i18n`, set the active locale from the lang store (Step 5).
4. **Verify:** in `svelte/src/routes/+page.svelte`, render `{$_('greeting')}` (or whatever first key in `en.json` is) and run `npm run dev` — text shows up in English.

### Step 4: build the persisted-store helper (composite-object schema)
1. Write `svelte/src/lib/persistedStore.js`. Signature: `persistedStore(key, defaults)` returns a Svelte `writable` of an *object*. Behavior:
   - On init: if `localStorage[key]` exists, parse it and merge over `defaults` (`{ ...defaults, ...JSON.parse(stored) }`). Else use `defaults`.
   - On `.set()` / `.update()`: serialize the new value with `JSON.stringify` and write to `localStorage[key]`.
   - SSR-guard with `typeof localStorage !== 'undefined'`. SvelteKit prerender executes in Node — the helper must not crash there.
2. **Manually verify the existing on-disk schema before writing the helper.** Open production saleh.sh in a browser, run `JSON.parse(localStorage['~~saleh~~-1.6'])` in DevTools, and copy the resulting object. The shape today is approximately:
   ```js
   { theme: 'light' | 'dark',
     flipDirection: true | false,
     funFont: true | false,
     currentLang: { code, name, direction, title, fonts } | null }
   ```
3. **Verify:** unit test — `localStorage.setItem('~~saleh~~-1.6', '{"theme":"dark"}')`, then `persistedStore('~~saleh~~-1.6', defaults)` returns a writable whose initial value has `theme === 'dark'` (and other slots default).

### Step 5: port the Vuex store as a single composite
1. Write `svelte/src/lib/stores/state.js`:
   ```js
   import { persistedStore } from '../persistedStore.js';
   export const state = persistedStore('~~saleh~~-1.6', {
     theme: 'light',
     flipDirection: true,
     funFont: false,
     currentLang: null,
   });
   export const toggleTheme        = () => state.update(s => ({ ...s, theme: s.theme === 'light' ? 'dark' : 'light' }));
   export const changeLang         = (lo) => state.update(s => ({ ...s, currentLang: lo }));
   export const toggleFont         = () => state.update(s => ({ ...s, funFont: !s.funFont }));
   export const switchFlipDirection= () => state.update(s => ({ ...s, flipDirection: !s.flipDirection }));
   ```
2. **Critical:** all four pieces of state share the **single** `~~saleh~~-1.6` key. Do **not** create separate stores per slot — that would diverge from the vuex-persist on-disk schema and silently reset every existing visitor's preferences.
3. The Vue equivalents of `store.watch(() => state.theme, applyTheme)` are `$:` reactive blocks in `+layout.svelte`:
   ```svelte
   $: if ($state.theme) applyTheme($state.theme);
   $: if ($state.currentLang) updateLangUI($state.currentLang, prevLang);
   $: applyFont($state.funFont, $state.currentLang);
   ```
4. **Verify:** in `+layout.svelte`, subscribe to `$state` and toggle the theme via `toggleTheme()` from a button. Reload — theme persists. Inspect `localStorage['~~saleh~~-1.6']` — value is a single JSON object with all four slots.

### Step 6: port the layout (App.vue equivalent), keyboard bindings, and console messages
1. Translate `src/App.vue` to `svelte/src/routes/+layout.svelte`. Port:
   - `flip()` — class manipulation on `#cuerpo` with a 750ms timeout. Direct port.
   - `applyTheme()`, `applyFont()`, `getBrowserLang()`, `getLangCodeOnInit()`, `updateLangUI()` — port to layout module-level helpers; call from `$:` reactive blocks (Step 5.3) and from `onMount` for the initial paint.
   - `handleKeyUp`, `handleKeyDown` — keep the animation behavior (add/remove `.keydown` and `._${key}` classes on `#cuerpo` for non-special keys; suppress space's default for the lang-cycle).
   - `firstHelpMessage()` and `secondHelpMessage()` — the multi-arg `console.log(..., 'color: #88e49a', ...)` calls (`App.vue:~190–204`). Port verbatim, call `firstHelpMessage()` from `onMount`.
   - `goToResume`, `goToAbout`, `goToThirty`, `goToNYCMarathon25`, `goToNYCMarathon24` — port the methods. `goToResume` is `window.location.href = '/cv'` (full nav so Netlify 302 fires). The others use SvelteKit's `goto()` from `$app/navigation`. **Note:** `goToNYCMarathon24` exists as a method but has *no* keyboard binding in the current code — keep the method as dead code (or drop it) since `/nycmarathon24` is reachable by URL.
2. **Keyboard binding table** (translate `App.vue:208–230` exactly into `src/lib/keybindings.js`):

   | Sequence(s) | Handler |
   |---|---|
   | `'h e l p'`, `'م س ا ع د ه'`, `'م س ا ع د ة'` | `secondHelpMessage` |
   | `'c v'`, `'r e s u m e'`, `'س ي ر ه'`, `'س ي ر ة'` | `goToResume` |
   | `'a b o u t'` | `goToAbout` |
   | `'3 0'`, `'t h i r t y'` | `goToThirty` |
   | `'2 5'`, `'m a r a t h o n'` | `goToNYCMarathon25` |
   | `'f'`, `'خ'` | `toggleFont` |
   | `'t'`, `'ل'` | `toggleTheme` |
   | `'up up down down left right left right b a'`, `'i d d q d'`, `'up up down down left right left right ز ش'` | `flip` |

   **Verify tinykeys handles non-ASCII keys** (`خ`, `ل`, `ز`, `ش`, Arabic words). On a fresh tinykeys install, write a tiny test page that binds `'خ'` and triggers it. If tinykeys doesn't handle it (likely — tinykeys parses on `KeyboardEvent.key` and modifier strings; non-ASCII may work but Arabic *sequences* may not), fall back to a ~30-line custom sequence matcher: track the last N keypresses in a buffer, match against the binding list.
3. The `<Home>` component renders inside `+page.svelte`, not the layout.
4. **Verify:** `npm run dev`. Open `/`. Test each entry in the binding table works — switch keyboard layout to Arabic (or paste keys via dev console) to test those rows. Toggle theme with `t`. Cycle language with spacebar. Flip animation runs on Konami code.

### Step 7: port the per-page components
1. For each of `About`, `Thirty`, `NYCMarathon24`, `NYCMarathon25`, `Bday25`: copy template HTML from the Vue `<template>` block into a Svelte page; replace `{{ ... }}` Vue interpolation with `{...}` Svelte; replace `v-if` / `v-for` with `{#if}` / `{#each}`; copy SCSS via `<style lang="scss">`.
2. For `Home.svelte`, `LangSwitcher.svelte`, `ThemeToggler.svelte`, `Icons.svelte`: same translation rules. These live under `src/lib/components/`.
3. **`Home.svelte` `<i18n>` component handling**. In `src/components/Home.vue:16-26`, vue-i18n's `<i18n>` *component* renders `p2` with a slotted FontAwesome smile icon replacing the `{smile}` placeholder. svelte-i18n has no slot interpolation. Translate by:
   - Adding `p2_before_smile` and `p2_after_smile` to `src/locales/{en,ar}.json`. For `en.json`, the existing `p2` is `"...funny accents) {smile}"` — `p2_before_smile` is everything before `{smile}`, `p2_after_smile` is empty (or the trailing space). Apply the same split for `ar.json`.
   - In `Home.svelte`, render: `<p>{$_('p2_before_smile')}<Icon icon="smile" />{$_('p2_after_smile')}</p>`.
   - Leave the original `p2` key in the JSON files untouched so any rollback is trivial.
4. **Verify:** visit each of `/`, `/about`, `/30`, `/nycmarathon24`, `/nycmarathon25`, `/bday25` in dev. Visually compare against current production in both `en` and `ar`. Diff list any visual gaps. The smile icon must render inline in `p2`.

### Step 8: port build-time concerns (git hash + build timestamp)
1. **Git hash.** Add a `define` block to `vite.config.js`:
   ```js
   import { execSync } from 'node:child_process';
   const gitHash = execSync('git rev-parse --short HEAD').toString().trim();
   // in defineConfig:
   define: { GIT_DESCRIBE: { hash: JSON.stringify(gitHash) } }
   ```
   Three consumers reference `GIT_DESCRIBE.hash` (`App.vue:205`, `Home.vue:64`, `About.vue:18-20`) — keep the same global name in the Svelte components.
2. **Build timestamp.** Add a `transformIndexHtml` hook (or use the `vite-plugin-html` plugin):
   ```js
   {
     name: 'inject-build-timestamp',
     transformIndexHtml(html) {
       return html.replace('%BUILD_TIMESTAMP_UTC%', new Date().toISOString());
     }
   }
   ```
   In `src/app.html`, the `<html>` opening tag is `<html lang="en" dir="ltr" class="color-theme-in-transition" data-build-timestamp-utc="%BUILD_TIMESTAMP_UTC%">`. The runtime consumer (`document.documentElement.dataset.buildTimestampUtc`) reads it as before.
3. `svelte.config.js`: confirm `adapter-static` with `pages: 'build'`, `assets: 'build'`, **`fallback: '200.html'`** (matches Step 1; matches Netlify convention; matches the existing SPA-rewrite intent in `netlify.toml`), `precompress: false`.
4. **Verify:**
   - `npm run build`.
   - `cat build/200.html | grep data-build-timestamp-utc` shows a recent ISO 8601 timestamp (not a literal `%...%` placeholder).
   - `python3 -m http.server -d build 8000` and visit `http://localhost:8000/about` — the page shows a 7-character commit hash linked to GitHub.

### Step 9: cut over and delete the old code
**Order matters here** — `mv svelte/{...} .` collides with the existing `src/`, `package.json`, `package-lock.json`, etc. Delete the old layout first, then move.

1. **Delete the old Vue project files at the repo root:**
   ```sh
   rm -rf src public node_modules dist
   rm  package.json package-lock.json babel.config.js budget.json vue.config.js
   ```
   (`docs/`, `LICENSE`, `README.md`, `netlify.toml` stay. `.claude/` and `.review-pr79/` are untracked and stay.)
2. **Move the new SvelteKit project up:**
   ```sh
   mv svelte/package.json svelte/package-lock.json svelte/svelte.config.js svelte/vite.config.js svelte/src svelte/static .
   rmdir svelte
   ```
3. **Update `netlify.toml`:** change `[build]` to `command = "npm run build"`, `publish = "build/"`. **Leave `[[redirects]]` and `[[headers]]` blocks untouched.** Leave the `netlify-plugin-debug-cache` plugin block untouched.
4. **Verify:**
   ```sh
   npm install
   npm run build
   ls build/200.html build/_app/
   ```
   Both must exist. `build/_app/` contains the bundled JS/CSS.

### Step 10: deploy preview QA
1. Push the branch, open a draft PR.
2. Wait for the Netlify deploy preview.
3. Run a checklist against the preview URL:
   - [ ] `/`, `/about`, `/30`, `/nycmarathon24`, `/nycmarathon25`, `/bday25` all load and look right in light + dark themes.
   - [ ] Language switch with spacebar cycles `en` → `ar`. Arabic font + RTL applied. The `p2` smile icon renders inline in both languages.
   - [ ] **Every** sequence in Step 6's binding table works (test `c v`, `r e s u m e`, `a b o u t`, `3 0`, `2 5`, `f`, `t`, Konami code, etc.). Test the Arabic equivalents (e.g. `خ`, `ل`, `س ي ر ه`) by switching keyboard layouts.
   - [ ] Theme toggle persists across reload. `localStorage['~~saleh~~-1.6']` shows the composite object schema (single key with all four slots).
   - [ ] An existing visitor's preferences carry over: before deploy, in dev tools on production saleh.sh, copy `localStorage['~~saleh~~-1.6']`. After deploy, set the same value on the preview URL — theme/lang/font are honored.
   - [ ] `view-source:<preview>/` shows `data-build-timestamp-utc="2026-...` (real ISO timestamp, not literal `%BUILD_TIMESTAMP_UTC%`). The footer "updated" date is recent.
   - [ ] About page shows a 7-char git hash linked to `https://github.com/qirh/sala_v2/commit/...`.
   - [ ] `curl -I <preview>/cv` still returns 302 to Drive (Netlify redirect untouched).
   - [ ] `curl <preview>/sitemap.xml` returns the existing XML.
   - [ ] `curl -I <preview>/` shows the existing `Link: </sitemap.xml>; rel="sitemap"` header.
   - [ ] DevTools console: `firstHelpMessage` is logged on initial load with multi-color CSS styling.
   - [ ] No console errors on any route.
4. Promote draft → ready for review.

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Arabic / RTL / font swapping behaves subtly differently after the rewrite. | Step 7 verification explicitly tests `ar`. Diff screenshots side-by-side. |
| Bundle size regresses meaningfully. | Run `npm run build` and compare `build/_app/immutable/*` total size to current `dist/js/* + dist/css/*` total. Target: same order of magnitude (within 2×). |
| `tinykeys` doesn't handle non-ASCII (Arabic) characters in sequence bindings. | Step 6 has a built-in fallback: drop in a ~30-line custom sequence matcher that buffers `KeyboardEvent.key` values and matches against the binding table. The current Vue site uses Mousetrap, which *does* handle these — verify behavior parity. |
| Vue mousetrap binds Konami-code-style sequences (`up up down down ...`); tinykeys' arrow-key handling differs. | Same custom-matcher fallback; or transcribe arrow-key bindings to `ArrowUp`/`ArrowDown` notation. |
| `<i18n>` slot interpolation in `Home.vue` (`p2` with `{smile}`) doesn't have a 1:1 svelte-i18n equivalent. | Step 7 splits `p2` into `p2_before_smile` + `p2_after_smile` and renders the icon between them. The original `p2` key stays in JSON for rollback. |
| `vue-cli-plugin-i18n` `enableInSFC: true` was active — losing it might drop translations defined inline as `<i18n>` SFC blocks. | Verified via `grep -rn '<i18n>' src/components`: zero SFC block matches. The `<i18n>` matches in `Home.vue` are the *component*, handled separately. No translations lost. |
| `transformIndexHtml` runs only at build time; running `npm run dev` shows literal `%BUILD_TIMESTAMP_UTC%` in the rendered HTML. | Either also transform on dev requests (most transformIndexHtml plugins do this by default), or accept it as a dev-only quirk and verify only on `npm run build`. |
| Existing visitors' Vuex-persist state shape on disk has more or fewer slots than `defaults`. | Step 4's `persistedStore` merges `{ ...defaults, ...stored }`, so missing slots get defaults and extra slots are preserved. Step 5's helpers always overwrite cleanly. |

## Notes for the executing agent

- Do **not** modify `netlify.toml`'s redirect or header blocks beyond the `[build]` section. They were carefully assembled across PRs #80, #81, #82.
- Do **not** delete the `docs/` directory.
- Do **not** create per-key Svelte stores. The persisted state is **one composite object** at `localStorage['~~saleh~~-1.6']`; splitting it would silently invalidate every existing visitor's saved preferences. (See Step 4–5.)
- The dev loop is `npm run dev` (port 5173 by default). Build timestamp is only injected at build time — in dev, expect the literal `%BUILD_TIMESTAMP_UTC%` placeholder to appear unless you wire transformIndexHtml for the dev server too.
- This work touches every source file. Expect a large diff. Splitting into multiple PRs (e.g. one PR for steps 1–8 on a parallel `svelte/` dir, second PR for step 9 cutover) is reasonable.
- Existing Netlify project is `musing-rosalind-eedabd`. The `/cv`, `/resume`, `/spider-man`, `/spiderman`, `/address`, `/sunnyside`, `/blog`, `/posts` redirects must continue to work after deploy — they're enforced by `netlify.toml`, not by code.
