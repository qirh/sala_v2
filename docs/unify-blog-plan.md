# Unify saleh.soy into saleh.sh

> **⚠️ Superseded.** The architecture recommended below (subdirectory build, blog stays on pandoc, Vue 2 SPA stays as-is) is **not** the path being taken. Saleh chose to rewrite both saleh.sh and saleh.soy in SvelteKit instead, then merge them. Live plans:
>
> - `qirh/sala_v2` PR #84 — Phase 1A, rewrite saleh.sh in SvelteKit.
> - `qirh/blog` PR #10 — Phase 1B, rewrite saleh.soy in SvelteKit.
> - Phase 2 (merge) and Phase 3 (domain forwarder) are deferred; will get their own plan docs when work starts.
>
> This doc is preserved as historical record of the alternative scoping. Effort estimates and architectural arguments below describe a path that won't be taken.

## Goal
Collapse the two-repo / two-domain personal-site setup into a single repo (`sala_v2`) and a single canonical domain (`saleh.sh`), with the blog living at `saleh.sh/blog/...`.

## Current state

| | saleh.sh | saleh.soy |
|---|---|---|
| Repo | `qirh/sala_v2` (~/src/sala_v2) | `qirh/blog` (~/src/blog) |
| Stack | Vue 2 + vue-router SPA, vue-cli build | pandoc + Makefile, plain HTML |
| Netlify project | `musing-rosalind-eedabd` | `salehsoy` |
| Build time (CI) | ~10s | ~30–60s (downloads pandoc 3.5 each build) |
| Content | 6 hand-written Vue components, no markdown | 8 published posts + 17 drafts in `in_progress/`, 1 page |
| Theme system | SCSS + Vuex store + `data-theme` body class | 123-line `style.css` + 22-line `theme.js` (CSS vars + `data-theme` html attr) |
| Routes | `/`, `/about`, `/30`, `/nycmarathonNN`, `/bdayNN`, plus 8 redirects | `/`, `/{slug}`, `/about`, `/rss.xml`, `/sitemap.xml` |
| Commit history | many | 75 commits |

The two sites share nothing in terms of code, styling, or build pipeline. The only operational link today is the new `saleh.sh/blog` 302 redirect (#82).

## Recommended architecture: subdirectory build, single repo

Bring the blog source into `sala_v2` as a top-level `blog/` directory. Keep its pandoc + Makefile build untouched. Wire it into the Vue build so `npm run build` produces:

```
dist/
  index.html              ← Vue SPA entry
  js/, css/, assets/      ← Vue build output
  blog/
    index.html            ← pandoc-built post list
    funny-week.html
    spider-man-in-sunnyside-1.html
    ...
    rss.xml
    sitemap.xml
    style.css, theme.js, moi.jpg, ...
```

Configure Netlify's SPA catch-all to **exclude** `/blog/*`, so static blog HTML is served directly while every other unknown path still falls back to the Vue SPA.

### Why this over alternatives

- **Reimplementing the blog inside Vue** (route per post, markdown loader). Larger rewrite, throws away pandoc's templating, breaks RSS/sitemap generation, gains nothing the user wants.
- **Keep two repos, just unify domains**. Doesn't solve the "two repos to maintain" problem — only the DNS one. The repo split is the bigger ongoing tax.
- **Keep two builds, two Netlify projects, just with `saleh.sh/blog` proxying**. Adds a network hop for every blog page-view and keeps both maintenance streams alive.

## URL strategy

Two viable options. **Option 1 is recommended.**

### Option 1: `saleh.sh/blog/{slug}` (recommended)
- New canonical: `saleh.sh/blog/funny-week`.
- saleh.soy keeps existing URLs (`saleh.soy/funny-week`) and 301s every path to `saleh.sh/blog/:splat`.
- Update internal blog links (`<a href="/">`, `/about`, `/rss.xml`, `/style.css`, etc.) in the three pandoc templates to use `/blog/...` prefix.
- **Pros:** Clean separation between the SPA and the blog. Easy to mentally model.
- **Cons:** Inbound saleh.soy links rely on the 301 chain forever. Anyone bookmarking a post URL gets the new path.

### Option 2: `saleh.sh/{slug}` (flat)
- Posts live at `saleh.sh/funny-week`, mirroring saleh.soy's flat layout.
- saleh.soy 301s `/{slug}` to `saleh.sh/{slug}` 1:1 — no path remapping.
- **Pros:** Bookmark/inbound URLs survive without rewriting (just the host changes).
- **Cons:** Post slugs collide with the SPA's route namespace (e.g., a future `saleh.sh/about` already exists in the SPA — and there's an `/about` page in the blog!). Need conflict rules. Catch-all rewrite logic gets gnarlier (have to enumerate which paths are blog vs SPA).

The blog's existing `/about` actively conflicts with the SPA's `/about`. Option 1 avoids it; Option 2 forces a rename.

## Implementation steps (recommended path: Option 1)

### Step 1: Bring the blog source into sala_v2
Use `git subtree add --prefix=blog https://github.com/qirh/blog.git main` to preserve the 75-commit history under a `blog/` prefix. Alternative: copy files in cleanly with no history (smaller commit, loses provenance).

### Step 2: Update pandoc templates for the `/blog/` prefix
In `blog/templates/{index,page,post}.html`:
- `<a class="site" href="/">` → `href="/blog/"`
- `<a href="/about">` → `href="/blog/about"`
- `<link rel="stylesheet" href="/style.css">` → `href="/blog/style.css"`
- `<link rel="icon" href="/alien_blue.ico">` → `href="/blog/alien_blue.ico"`
- `<link rel="alternate" ... href="/rss.xml">` → `href="/blog/rss.xml"`
- `<script src="/theme.js">` → `src="/blog/theme.js"`
- `og:url` and similar → `https://saleh.sh/blog/...`

In `blog/scripts/build_*.sh`:
- `SITE_URL="https://saleh.soy"` → `SITE_URL="https://saleh.sh/blog"`
- `--metadata url="/$$slug"` → `--metadata url="/blog/$$slug"` (in Makefile)

In `blog/posts/*.md`, search for any hardcoded `saleh.soy` references in body text and update.

### Step 3: Wire blog build into the Vue build
Add an npm script that runs the blog's `make` step and copies output into a temp dir, then have the existing Vue build (or a postbuild step) drop those files into `dist/blog/`.

```json
"scripts": {
  "build:blog": "make -C blog && mkdir -p dist/blog && cp -R blog/public/. dist/blog/",
  "build": "vue-cli-service build && npm run build:blog"
}
```

In `netlify.toml` build command: install pandoc the same way the blog repo does today (curl + tar), then `npm run build`.

### Step 4: Configure Netlify routing
The current SPA catch-all `from = "/*", to = "/", status = 200` rewrites every unknown path to the Vue SPA. We need it to *not* rewrite `/blog/*`.

Netlify processes redirects top-down with first-match-wins, so just add a higher-priority rule:

```toml
[[redirects]]
from = "/blog/*"
to = "/blog/:splat"
status = 200
force = false   # let real files win first
```

Then the existing `/* → /` SPA catch-all stays for everything else. Verify on the deploy preview that `/blog/funny-week` serves the blog HTML, not the SPA.

Also: the existing `/blog → https://saleh.soy/` 302 from #82 needs to be removed (or changed to point at `/blog/`) once the new path is live.

### Step 5: Migrate sitemap and rss
- `dist/sitemap.xml` from sala_v2 already lists `/`. Decide whether to expand it to include blog posts directly, or to keep two separate sitemaps and reference both from `robots.txt`.
- Recommend a separate `dist/blog/sitemap.xml` (already generated by the blog build) plus a top-level sitemap index file `dist/sitemap-index.xml` referencing both.

### Step 6: Make saleh.soy a forwarder
On the saleh.soy Netlify project, replace the existing `netlify.toml` with one that 301s every path:

```toml
[build]
command = "true"
publish = "."

[[redirects]]
from = "/*"
to = "https://saleh.sh/blog/:splat"
status = 301
force = true
```

This preserves all existing inbound links. RSS-feed clients will follow the 301 and update their internal URL. Keep the Netlify project alive indefinitely (or until DNS sunsets — see Step 7).

### Step 7: DNS / domain sunset (optional, later)
Once metrics show traffic to saleh.soy is negligible after some grace period (6–12 months), the domain can be allowed to lapse. Until then, keep it pointed at the forwarder Netlify project.

### Step 8: Smoke tests
The blog has `scripts/smoke_test.sh`. Move it into `blog/scripts/` after the subtree pull, and add a top-level npm script `npm run test:blog` that runs it. Optionally add a smoke test for the unified `dist/`:
- `dist/index.html` exists (Vue)
- `dist/blog/index.html` exists (blog index)
- `dist/blog/funny-week.html` exists (representative post)
- All three serve over `localhost:8000` after `python3 -m http.server -d dist`.

### Step 9: Cleanup
- Archive `qirh/blog` repo on GitHub (read-only, with a README pointing at `qirh/sala_v2`).
- Remove the `/blog` and `/posts` 302 redirects from sala_v2's `netlify.toml` (#82) since `/blog` is now a real path.
- Update memory entries (`personal_sites.md`) to reflect the unified setup.

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Inbound links to `saleh.soy/{slug}` break | Step 6 — saleh.soy 301s everything to the new path; SEO link equity transfers. |
| RSS subscribers stop receiving updates | Step 6 — 301 from old feed URL; most clients follow 301 and update. Manual one-time announcement post on the blog. |
| Pandoc download in CI flakes | Pin the pandoc version (already done, pandoc 3.5) and cache via Netlify's build cache. Fallback: vendor the pandoc binary in the repo (~150MB, not great). |
| Blog `/about` collides with SPA `/about` | Option 1 puts blog at `/blog/about`, no conflict. Confirmed avoidable. |
| Vue catch-all swallows `/blog/*` requests | Step 4's higher-priority redirect rule prevents this — verify on deploy preview. |
| 17 drafts in `in_progress/` — what happens to them | They come along in the subtree pull. Continue ignoring them in the build (already excluded from `posts/`). |

## Effort estimate

**One focused session, ~3–5 hours of coding + testing**, broken down:

| Step | Time |
|---|---|
| 1. Subtree merge + initial diff review | 30 min |
| 2. Template / script / post-body URL rewrites | 60 min |
| 3. Wire build into Vue pipeline | 45 min |
| 4. Netlify routing config + verify on preview | 45 min |
| 5. Sitemap reorganization | 30 min |
| 6. saleh.soy forwarder config | 15 min |
| 8. Smoke test plumbing | 30 min |
| 9. Cleanup + memory updates + docs | 30 min |
| Buffer for surprises | 60 min |

Step 7 (DNS sunset) is later/optional; not on this critical path.

**Ongoing maintenance after:** lower than today — one repo, one CI, one deploy. Adding a new post is `git add blog/posts/x.md && git push`.

## Decisions needed from Saleh

1. **URL strategy** — Option 1 (`/blog/{slug}`, recommended) or Option 2 (flat)?
2. **History preservation** — `git subtree` (preserve 75 blog commits) or clean copy (single commit, smaller diff)?
3. **saleh.soy lifecycle** — keep as a 301 forwarder indefinitely, or set a sunset date?
4. **Single sitemap or sitemap index** — preference for the simpler all-in-one or the more "correct" index-of-sitemaps?

## Open questions / follow-ups

- The blog's CI already disables `netlify-plugin-a11y` implicitly (it doesn't include it). The unified site already disabled it (#80). No conflict.
- Theme systems are unrelated and don't need to merge — the blog's CSS-vars-based theme is scoped to `/blog/*` and won't leak.
- The blog's Netlify build downloads pandoc each time. Worth investigating Netlify's persistent build cache to skip the download on cache hit, but that's an optimization, not a blocker.
