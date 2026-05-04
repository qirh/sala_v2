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
- **i18n:** [`svelte-i18n`](https://github.com/kaisermann/svelte-i18n). Keep the existing `src/locales/{en,ar}.json` files.
- **Persistence:** drop `vuex-persist`. Replace with a tiny custom `persistedStore` helper (~15 lines) that syncs a Svelte writable to `localStorage`.
- **Keyboard shortcuts:** drop `vue-mousetrap`. Use [`tinykeys`](https://github.com/jamiebuilds/tinykeys).
- **Icons:** drop `@fortawesome/vue-fontawesome`. Use `@fortawesome/fontawesome-svg-core` directly with a small `<Icon>` Svelte wrapper (~20 lines), referencing the same `faGithub`, `faEnvelope`, etc. that are already imported. No visual change.
- **Git hash injection:** replace `vue-cli-plugin-git-describe` with a small `vite.config.js` `define` block that runs `git describe` at build time.

## End-state file tree

```
sala_v2/
├── package.json                # svelte/sveltekit/vite/sass deps; scripts: dev/build/preview
├── svelte.config.js            # adapter-static, preprocess (sass)
├── vite.config.js              # define GIT_DESCRIBE
├── netlify.toml                # build = "npm run build", publish = "build/"
├── src/
│   ├── app.html                # base HTML shell (replaces public/index.html)
│   ├── lib/
│   │   ├── stores/
│   │   │   ├── theme.js        # writable<'light'|'dark'>, persisted
│   │   │   ├── lang.js         # writable<langObject>, persisted
│   │   │   ├── flipDirection.js
│   │   │   └── funFont.js
│   │   ├── i18n.js             # svelte-i18n setup, loads ./locales/*.json
│   │   ├── consts.js           # langs, getNextLang, getLangObjectFromCode, mod
│   │   ├── persistedStore.js   # generic persisted writable helper
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
| `src/store.js` (Vuex) | `src/lib/stores/{theme,lang,flipDirection,funFont}.js` + `persistedStore.js` | Each Vuex mutation becomes a method on the store (or a `.update()` callback). The `~~saleh~~-1.6` localStorage key stays — read+write same key so existing visitors keep their preference. |
| `src/i18n.js` | `src/lib/i18n.js` (svelte-i18n) | |
| `src/consts.js` | `src/lib/consts.js` | Pure functions, copy verbatim. |
| `src/locales/{en,ar}.json` | `src/locales/{en,ar}.json` | Copy verbatim. |
| `vue.config.js` | `vite.config.js` + `svelte.config.js` | Drop the i18n plugin (not needed with svelte-i18n's runtime loader); preserve git-describe via Vite `define`. |
| `babel.config.js`, `budget.json` | (deleted) | Vue-cli artifacts; no Svelte equivalent needed. |
| `public/*` | `static/*` | SvelteKit serves `static/` at the URL root. Move all current `public/` contents (favicons, `/assets/*.jpg`, `sitemap.xml`, `robots.txt`) to `static/`. |

## Execution order

Each step ends with a verification an agent can run. If verification fails, stop and surface the error — don't continue.

### Step 1: scaffold the SvelteKit project alongside the Vue project
1. Create the new structure in a parallel directory inside the repo: `svelte/`. Run `npm create svelte@latest svelte` (Skeleton project, JS, no TS, no ESLint/Prettier extras yet — we'll add Prettier in step 9).
2. Inside `svelte/`, install `@sveltejs/adapter-static`, `svelte-preprocess`, `sass`, `svelte-i18n`, `tinykeys`, `@fortawesome/fontawesome-svg-core`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-regular-svg-icons`, `@fortawesome/free-brands-svg-icons`.
3. Configure `svelte/svelte.config.js` to use `adapter-static` with `fallback: 'index.html'` (preserves SPA behavior for any client-side route navigation) and `svelte-preprocess` with `scss` enabled.
4. **Verify:** `cd svelte && npm run build` produces a `build/` directory containing an `index.html`.

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

### Step 4: build the persisted-store helper
1. Write `svelte/src/lib/persistedStore.js`. Signature: `persistedStore(key, initialValue)` returns a `writable` whose `.set()` and `.update()` also write to `localStorage`, and which initializes from `localStorage` if SSR-safe (`typeof window !== 'undefined'`).
2. **Use the same localStorage key prefix as today: `~~saleh~~-1.6`.** Bumping it would log every existing visitor out of their saved theme/font/lang.
3. **Verify:** unit test (or manual) — set value, reload page in dev, value persists.

### Step 5: port the Vuex store
1. Replace each piece of state from `src/store.js` with a `writable` using `persistedStore`:
   - `theme` ← `persistedStore('theme', 'light')`
   - `currentLang` ← `persistedStore('currentLang', null)` (the layout will resolve null → browser preference on mount)
   - `funFont` ← `persistedStore('funFont', false)`
   - `flipDirection` ← `persistedStore('flipDirection', true)`
2. Replace each Vuex mutation with the corresponding store update (e.g. `toggleTheme()` → `theme.update(t => t === 'light' ? 'dark' : 'light')`).
3. **Verify:** in `+layout.svelte`, subscribe to `$theme` and apply `class="dark-theme"` or `class="light-theme"` to `<body>` — toggling via a button changes the theme and persists across reload.

### Step 6: port the layout (App.vue equivalent)
1. Translate `src/App.vue` to `svelte/src/routes/+layout.svelte`. Methods to port:
   - `flip()` — class manipulation on `#cuerpo` with a 750ms timeout. Direct port.
   - `goToResume`, `goToAbout`, `goToThirty`, `goToNYCMarathon24`, `goToNYCMarathon25` — these were called from keyboard shortcuts. Migrate to `tinykeys` in `+layout.svelte` `onMount`. `goToResume()` is `window.location.href = '/cv'`. The others use SvelteKit's `goto()` from `$app/navigation`.
   - `applyTheme()`, `applyFont()`, `getBrowserLang()`, `getLangCodeOnInit()` — port to layout module-level helpers, run in `onMount`.
   - `handleKeyUp`, `handleKeyDown` — keep the same animation behavior (add/remove `.keydown` and `._${key}` classes on `#cuerpo`).
2. The `<Home>` component renders inside `+page.svelte`, not the layout — leaving room for the other routes.
3. **Verify:** `npm run dev`, open `/`, hit each keyboard shortcut, observe navigation works; toggle theme; switch language with spacebar; flip animation runs.

### Step 7: port the per-page components
1. For each of `About`, `Thirty`, `NYCMarathon24`, `NYCMarathon25`, `Bday25`: copy template HTML from the Vue `<template>` block into a Svelte page; replace `{{ ... }}` Vue interpolation with `{...}` Svelte; replace `v-if` / `v-for` with `{#if}` / `{#each}`; copy SCSS via `<style lang="scss">`.
2. For `Home.svelte`, `LangSwitcher.svelte`, `ThemeToggler.svelte`, `Icons.svelte`: same translation rules. These live under `src/lib/components/`.
3. **Verify:** visit each of `/`, `/about`, `/30`, `/nycmarathon24`, `/nycmarathon25`, `/bday25` in dev — visually compare against current production. Diff list any visual gaps.

### Step 8: port build-time concerns
1. `vite.config.js`: add a `define: { GIT_DESCRIBE: { hash: JSON.stringify(execSync('git rev-parse --short HEAD').toString().trim()) } }` block. The two consumers in the codebase (`About.vue`, `LangSwitcher.vue`?) reference `GIT_DESCRIBE.hash` — keep the same global name.
2. `svelte.config.js`: confirm `adapter-static` with `pages: 'build'`, `assets: 'build'`, `fallback: 'index.html'`, `precompress: false`.
3. **Verify:** `npm run build && python3 -m http.server -d build 8000` then `curl -s localhost:8000 | grep -i 'commit:'` shows the git hash; visit each route via the static server and confirm it works.

### Step 9: cut over and delete the old code
1. Move `svelte/*` to repo root: `mv svelte/{package.json,svelte.config.js,vite.config.js,src,static} .`. Resolve `package.json` carefully — keep the new SvelteKit one and discard the old.
2. Delete: `babel.config.js`, `budget.json`, `vue.config.js`, `src/App.vue`, `src/main.js`, `src/store.js`, `src/i18n.js`, `src/consts.js`, `src/components/`, `public/`. (`src/assets/styles/` and `src/locales/` stay because they were already moved into `svelte/src/`.)
3. Update `netlify.toml`: `command = "npm run build"`, `publish = "build/"`. Leave `[[redirects]]` and `[[headers]]` blocks **untouched**. Leave the `netlify-plugin-debug-cache` plugin block untouched.
4. **Verify:** `rm -rf node_modules dist build && npm install && npm run build && ls build/index.html build/assets`. All present.

### Step 10: deploy preview QA
1. Push the branch, open a draft PR.
2. Wait for the Netlify deploy preview.
3. Run a checklist against the preview URL:
   - [ ] `/`, `/about`, `/30`, `/nycmarathon24`, `/nycmarathon25`, `/bday25` all load and look right in light + dark themes.
   - [ ] Language switch with spacebar cycles `en` → `ar`. Arabic font + RTL applied.
   - [ ] All keyboard shortcuts work (`r` for resume, `a` for about, etc. — pull from existing key handlers).
   - [ ] Theme toggle persists across reload.
   - [ ] `curl -I <preview>/cv` still returns 302 to Drive (Netlify redirect untouched).
   - [ ] `curl <preview>/sitemap.xml` returns the existing XML.
   - [ ] `curl -I <preview>/` shows the existing `Link: </sitemap.xml>; rel="sitemap"` header.
   - [ ] No console errors on any route in DevTools.
4. Promote draft → ready for review.

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| `vuex-persist` storage key shape doesn't match what `persistedStore` writes — existing users see reset preferences. | Manually inspect the current localStorage shape (open production site, `JSON.parse(localStorage['~~saleh~~-1.6'])`). Match it exactly OR pick a fresh key and accept the one-time reset. |
| Arabic / RTL / font swapping behaves subtly differently after the rewrite. | Step 7 verification explicitly tests `ar`. Diff screenshots side-by-side. |
| SvelteKit route ordering or fallback differs — the SPA catch-all in `netlify.toml` collides with adapter-static's `fallback: 'index.html'`. | `adapter-static` with `fallback` produces a `200.html` (Netlify convention) — Netlify's catch-all rewrite is then redundant but harmless. Verify by hitting an unknown path on the preview. |
| Bundle size regresses meaningfully. | Run `npm run build` and compare `build/_app/immutable/*` total size to current `dist/js/* + dist/css/*` total. Target: same order of magnitude (within 2×). |
| `tinykeys` registers globally and breaks on iOS Safari/keys-with-modifiers. | The Vue version already only handles single ASCII keypresses; `tinykeys` does this fine. Smoke-test on an iOS device or simulator. |

## Notes for the executing agent

- Do **not** modify `netlify.toml`'s redirect or header blocks beyond the `[build]` section. They were carefully assembled across PRs #80, #81, #82.
- Do **not** delete the `docs/` directory.
- Stop and ask if a `vue-cli-plugin-i18n` artifact (e.g. precompiled `.json` → `.js` files) turns out to be referenced at runtime — the existing setup doesn't seem to use the precompile step, but worth confirming if anything looks off.
- This work touches every source file. Expect a large diff. Splitting into multiple PRs (e.g. one PR for steps 1–8 on a parallel `svelte/` dir, second PR for step 9 cutover) is reasonable.
- The dev loop is `npm run dev` (port 5173 by default).
- Existing Netlify project is `musing-rosalind-eedabd`. The `/cv`, `/resume`, `/spider-man`, `/spiderman`, `/address`, `/sunnyside`, `/blog`, `/posts` redirects must continue to work after deploy — they're enforced by `netlify.toml`, not by code.
