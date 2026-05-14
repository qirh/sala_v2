# saleh.sh test suite

This repo and `qirh/blog` (saleh.soy) share **identical test infrastructure**: same `playwright.config.js` shape, same `scripts/parity_test.mjs` interface, same npm scripts, same `testIgnore` + `VISUAL=1` gate. Phase 2 (when the two sites merge into this repo under `/blog/*`) collapses both suites into one with no paradigm reconciliation.

But the **coverage** differs — this suite has more tests than the blog's, because saleh.sh has more interactive surface to break.

## What's tested here

| Suite | File | Count |
|---|---|---|
| Functional | `features.spec.js` | 19 tests (1 fixme'd) |
| Routes | `routes.spec.js` | 9 tests |
| Visual regression | `visual.spec.js` | 24 baselines (route × theme × lang) |
| HTTP + content parity | `../scripts/parity_test.mjs` | 17 HTTP, 6 content |

## Why this repo has tests the blog doesn't

The asymmetry isn't accidental — it tracks the asymmetric surface of each site.

| Surface | saleh.sh | saleh.soy |
|---|---|---|
| Keyboard shortcuts | 8 chord bindings (English + Arabic + Konami) | None |
| Languages | 2 (en + RTL ar) | 1 |
| Theme system | Vuex composite store, 4 slots, persists `~~saleh~~-1.6` | One CSS-var attribute, persists `theme` key |
| Build-time HTML injection | 2 values (`data-build-timestamp-utc`, `GIT_DESCRIBE.hash`) | None |
| Netlify redirects | 8 (`/cv`, `/resume`, `/spider-man`, `/spiderman`, `/address`, `/sunnyside`, `/blog`, `/posts`) | 1 (trailing-slash rewrite) |
| Content nature | 6 hand-built interactive routes | ~10 static posts/pages |

Concretely, this suite has tests the blog doesn't need:

- **Chord navigation tests** (`a b o u t`, `3 0`, `2 5`, `c v`, Konami, `h e l p`, Arabic equivalents). The blog has no keyboard nav.
- **Lang-switcher round-trips**. The blog is English-only.
- **RTL + Arabic font swap**. Same.
- **Vuex-persist composite-key tests** (theme survives reload, lang survives reload, sub-page navigation doesn't tear down watchers). The blog has a single localStorage key with a flat value.
- **Build-time substitution checks** (`data-build-timestamp-utc` ISO date, `GIT_DESCRIBE.hash` as a GitHub commit link on `/about`). The blog template doesn't interpolate any build-time values into HTML.
- **8 Netlify redirect checks**. The blog has 1, covered by its single trailing-slash test.

Conversely, the blog's suite has things this one doesn't need:

- **Post auto-discovery** via `readdirSync('posts/*.md')`. This repo has hand-coded route components, no fs-glob.
- **RSS `<item>` parity**. No RSS feed here.
- **Sitemap `<loc>` list parity**. Our sitemap is hand-maintained with one entry; the blog's grows with each post.
- **`<article>` body-text parity**. Our routes aren't text-heavy; the blog's are.

## What's intentionally NOT tested in this suite

- **Mobile viewport.** Tests run at 1280×800 only. Manual responsive checks remain a deploy-preview pass.
- **Cross-browser** (Firefox/WebKit). Chromium-only. Cost-benefit doesn't pay off for a single-developer site.
- **End-to-end resume navigation through to Drive.** We assert that `c v` initiates `/cv` navigation and that `/cv` 302s to Drive (separately), but not the full chain into Drive. Drive's response is out of our control.

## How to run

```sh
npm test                    # functional + routes (28 + fixme, ~10s)
npm run test:visual         # visual regression vs committed baselines (~30s)
npm run test:visual:update  # re-baseline against the local build (for your OS)
npm run test:parity         # HTTP + content parity vs PREVIEW_URL (~5s)
PREVIEW_URL=https://deploy-preview-XX--musing-rosalind-eedabd.netlify.app npm run test:parity
```

## Visual baselines: macOS + Linux

`tests/visual.spec.js-snapshots/` contains **both** `*-chromium-darwin.png` (for local dev on macOS) **and** `*-chromium-linux.png` (for CI on Ubuntu). Same content, different OS-suffixed filenames — Playwright picks the right one automatically based on `runner.os`.

Re-baseline after a deliberate visual change:

```sh
# Your OS (writes only the matching set):
npm run test:visual:update

# Linux baselines for CI (run in Docker so the renderer matches the runner):
docker run --rm -v "$PWD:/work" -w /work \
  mcr.microsoft.com/playwright:v1.59.1-jammy \
  bash -c "npm ci && npx playwright install chromium && \
           VISUAL=1 npx playwright test --update-snapshots"
```

Commit both sets together.

## Phase 2 merge

After the SvelteKit rewrite (#84) ships and the blog merges into this repo under `/blog/*`:

1. Concatenate the two `parity_test.mjs` URL lists. The blog brings its content-mode signal extraction (article text, RSS items, sitemap locs). This repo brings the 8-redirect HTTP coverage. Both already use the same `--mode=http|content|all` interface.
2. Union the visual baselines under one snapshot dir. The blog's are viewport-only single-language; this repo's are viewport-only theme × lang. Both share the same 1280×800 / 0.5% threshold.
3. Single `playwright.config.js` and `package.json` scripts block. Already identical-shape in both repos.
4. Single `tests/` directory with the union of files. The blog's `tests/visual.spec.js` and this one would consolidate; the functional tests (this repo only) stay.

No design decisions left. Just a routing/config combine.
