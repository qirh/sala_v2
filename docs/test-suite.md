# Test suite

Reference for the saleh.sh test harness. Five suites live in `tests/`,
all driven by Playwright. The CI workflow (`.github/workflows/test.yml`)
runs them in order on every PR.

## Suites at a glance

| Suite | File | Compares | Catches | Misses |
|---|---|---|---|---|
| Type-check | n/a (`svelte-check`) | static analysis | TS/Svelte type errors, unused props | runtime layout |
| Functional | `tests/features.spec.js`, `tests/routes.spec.js` | preview vs expected behavior | keybindings, routing, lang/theme persistence, redirects | pixel rendering |
| Parity HTTP | `scripts/parity_test.mjs` (`npm run test:parity -- --mode=http`) | deploy preview vs prod, **HTTP layer** | redirects, Link headers, Content-Type, status codes | rendered output |
| Visual | `tests/visual.spec.js` | preview vs **committed PNG baselines** | drift from a previously-blessed preview render | prod-vs-preview drift (baselines came from preview) |
| Prod-parity | `tests/prod-parity.spec.js` | deploy preview vs **live prod (saleh.sh)** pixel-for-pixel | "the rewrite renders a page differently than prod" | below-the-fold content (uses `fullPage: false`), hover/focus states, animations |

The visual and prod-parity suites are complementary. Visual catches
regressions in the preview against its own history. Prod-parity catches
the rewrite drifting from the live site — which is what matters when
you're porting a framework and want zero visible change.

## Viewport matrix

All Playwright projects defined in `playwright.config.js`:

| Project | Viewport | Why |
|---|---|---|
| `chromium` | 1280×800 | default desktop baseline |
| `chromium-laptop` | 2048×1024 | wide desktop / external monitor |
| `chromium-mbp16` | 1728×1117 | 16" MacBook Pro logical resolution |
| `chromium-phone` | 390×844 | iPhone-class, mobile emulation on |

Every spec runs against every project. To target one: `--project=chromium-mbp16`.

## How prod-parity works

`tests/prod-parity.spec.js` enumerates `routes × themes × langs` = 24
cases per project. For each case it:

1. Seeds `localStorage[~~saleh~~-1.6]` with the theme/lang combo so the
   page boots in the correct state. The persist key matches what
   vuex-persist used in the Vue 2 build.
2. Navigates to both `https://saleh.sh<route>` and
   `$PREVIEW_URL<route>` with `waitUntil: 'networkidle'` and waits on
   `document.fonts.ready`.
3. Strips any `[data-netlify-deploy-id]` element so the Netlify
   deploy-preview widget doesn't bleed into the capture.
4. Screenshots both (viewport-only, `animations: 'disabled'`).
5. Asserts equal dimensions, then runs `pixelmatch` with
   `threshold: 0.1` and fails if the diff ratio exceeds `0.005` (0.5%).
6. On failure, writes `prod.png`, `preview.png`, and `diff.png` under
   `test-results/<test>/parity-diff/` for inspection.

Gated on `PREVIEW_URL` — skipped entirely when unset, which is why
`npm test` does not run it.

### Running locally

```sh
# point at the current PR's deploy preview
PREVIEW_URL=https://deploy-preview-84--musing-rosalind-eedabd.netlify.app \
  npx playwright test tests/prod-parity.spec.js

# single project, single test
PREVIEW_URL=... npx playwright test tests/prod-parity.spec.js \
  --project=chromium-mbp16 -g "home \[en, dark\]"
```

### Debugging a failing case

When a case fails, three PNGs land under
`test-results/prod-parity-prod-parity-<slug>-<lang>-<theme>--<project>/parity-diff/`.

The recommended workflow for diagnosing a diff:

1. Open `diff.png` to see *where* the pixels disagree.
2. If the diff is structural (layout shift, missing element, wrong
   colors), inspect the rendered HTML from both sides. Prod is just
   `curl https://saleh.sh<route>`; preview is
   `curl $PREVIEW_URL<route>`. Diff the DOM, then diff the computed
   styles using Playwright's `page.evaluate(() => getComputedStyle(...))`.
3. If the diff is subpixel font noise, check `MAX_DIFF_RATIO` /
   `PIXEL_THRESHOLD` constants at the top of the spec — they're tuned
   for the current state of the rewrite, not a hard physical limit.

The single most useful technique is to **inspect the rendered HTML
of both pages and work backwards from the DOM difference** rather than
guessing from the screenshot. Most visible diffs trace to either:

- a class/attribute the Vue template emitted that the Svelte component
  doesn't (or vice versa),
- whitespace handling (Vue's template compiler stripped inter-element
  whitespace; Svelte preserves it — combined with the global
  `* { white-space: pre-wrap }` this can render newlines as visible
  vertical space), or
- a CSS rule that Vue 2's minifier silently dropped that Vite keeps
  (e.g. `body { font-size: 0; line-height: 0 }` in `global.scss`).

## How visual works

`tests/visual.spec.js` uses Playwright's `toHaveScreenshot()` against
committed baselines under `tests/visual.spec.js-snapshots/`. Baselines
are OS-specific (`darwin` for local macOS, `linux` for CI Ubuntu) and
must be regenerated together when a deliberate visual change lands:

```sh
# local (macOS baselines)
npm run test:visual:update

# CI (linux baselines) — run inside the Playwright Docker image so
# fonts/rendering match the GHA runner
docker run --rm -v "$PWD:/work" -w /work \
  mcr.microsoft.com/playwright:v1.59.1-jammy \
  bash -c "npm ci && npx playwright install chromium \
           && VISUAL=1 npx playwright test --update-snapshots"
```

The visual suite is excluded from default `npm test` runs via
`testIgnore` in `playwright.config.js` — opt in with the `VISUAL=1`
env var (the `test:visual*` npm scripts set it for you).

## How CI uses these

`.github/workflows/test.yml` runs all five suites on every PR. Each
runs with `continue-on-error: true` so the workflow always reaches the
sticky-comment step, then a final guard step fails the job if any
suite failed.

Two suites depend on the Netlify deploy preview (parity-HTTP, visual,
prod-parity). The `Wait for Netlify deploy preview` step polls
`deploy-preview-<PR>--musing-rosalind-eedabd.netlify.app` until it
returns 200 (up to 10 minutes) before those suites run.

Push-to-main runs only the suites that don't need a preview
(type-check + functional), since there's no deploy preview for the
default branch.

On failure, the `playwright-report/` and `test-results/` directories
are uploaded as a workflow artifact (7-day retention) so the PNG
triples are inspectable.

### The sticky comment

`marocchino/sticky-pull-request-comment@v2` posts (and updates in
place) a single comment per PR summarizing each suite's outcome. The
`header: tests` field is the identifier — subsequent runs edit the
existing comment rather than appending.

## Conventions

- **Run output**: `test-results/<spec-name>-<test-name>--<project>/`.
- **Adding a route**: extend the `routes` array in
  `tests/prod-parity.spec.js` and the route table in functional specs.
  Visual baselines auto-generate on the next `--update-snapshots` run.
- **Adding a viewport**: add a `projects[]` entry in
  `playwright.config.js`. All specs pick it up automatically because
  prod-parity reads viewport off `testInfo.project.use`.
- **Lowering noise**: `MAX_DIFF_RATIO` and `PIXEL_THRESHOLD` at the top
  of `prod-parity.spec.js` are the two knobs. Don't loosen them as a
  shortcut to a green CI — fix the underlying diff or document why the
  threshold change is correct.
