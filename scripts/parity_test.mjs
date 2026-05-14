#!/usr/bin/env node
// Production-vs-preview parity check for saleh.sh. Two modes, both run by
// default:
//
//   - http     : status code, Location header (for 3xx), Content-Type.
//                Covers every page route, every Netlify redirect (/cv,
//                /resume, /spider*, /address, /sunnyside, /blog, /posts),
//                static text resources (sitemap.xml, robots.txt), and a
//                known-404 sanity check. Intended for deploy-preview
//                comparison through Netlify's edge.
//   - content  : structured HTML signals — <title>, key og:* / twitter
//                meta tags, and the first chunk of body text. Catches
//                rendering drift across stacks.
//
//                NOTE: when current saleh.sh prod is Vue 2 (JS-rendered)
//                and the preview is prerendered SvelteKit, prod fetches
//                return only the noscript shell. Content-mode against
//                that pair will mostly flag known-stack drift, not real
//                regressions. The mode becomes meaningfully useful
//                AFTER the SvelteKit cutover, when both sides are
//                prerendered. Run with --mode=http until then.
//
// Convention mirrors qirh/blog PR #11 (its sister parity script) so
// Phase 2 can collapse both repos' test infra with minimal restructure.
//
// Usage:
//   npm run test:parity                                          # default --mode=all
//   npm run test:parity -- --mode=http                           # routing/redirects only
//   npm run test:parity -- --mode=content                        # rendered content only
//   PREVIEW_URL=https://deploy-preview-92--musing-rosalind-eedabd.netlify.app npm run test:parity
//   PROD_URL=https://saleh.sh PREVIEW_URL=... npm run test:parity

const PROD_URL = (process.env.PROD_URL || 'https://saleh.sh').replace(/\/$/, '');
const PREVIEW_URL = (process.env.PREVIEW_URL || '').replace(/\/$/, '');

if (!PREVIEW_URL) {
    console.error(
        'error: PREVIEW_URL is required.\n' +
            'usage: PREVIEW_URL=https://deploy-preview-XX--musing-rosalind-eedabd.netlify.app npm run test:parity',
    );
    process.exit(2);
}

const argMode = (
    process.argv.find((a) => a.startsWith('--mode=')) || '--mode=all'
).split('=')[1];
const runHttp = argMode === 'all' || argMode === 'http';
const runContent = argMode === 'all' || argMode === 'content';

// Every page route + every Netlify-handled path. Order matches a reader's
// likely mental model: real pages first, then redirects, then static
// resources, then a known-404.
const httpTargets = [
    {path: '/', kind: 'page', expect: 200},
    {path: '/about', kind: 'page', expect: 200},
    {path: '/30', kind: 'page', expect: 200},
    {path: '/nycmarathon24', kind: 'page', expect: 200},
    {path: '/nycmarathon25', kind: 'page', expect: 200},
    {path: '/bday25', kind: 'page', expect: 200},
    {path: '/cv', kind: 'redirect', expect: 302},
    {path: '/resume', kind: 'redirect', expect: 302},
    {path: '/spiderman', kind: 'redirect', expect: 302},
    {path: '/spider-man', kind: 'redirect', expect: 302},
    {path: '/address', kind: 'redirect', expect: 302},
    {path: '/sunnyside', kind: 'redirect', expect: 302},
    {path: '/blog', kind: 'redirect', expect: 302},
    {path: '/posts', kind: 'redirect', expect: 302},
    {path: '/sitemap.xml', kind: 'static', expect: 200},
    {path: '/robots.txt', kind: 'static', expect: 200},
    {path: '/this-route-should-never-exist', kind: 'fallback', expect: 200},
];

// HTML page routes that have meaningful structured content. The five sub-
// routes are minimal-text pages, but they still have <title> and OG tags
// worth comparing.
const contentTargets = [
    '/',
    '/about',
    '/30',
    '/nycmarathon24',
    '/nycmarathon25',
    '/bday25',
];

async function fetchHead(url) {
    const res = await fetch(url, {method: 'GET', redirect: 'manual'});
    const ct = res.headers.get('content-type') || '';
    return {
        status: res.status,
        location: res.headers.get('location') || '',
        contentType: ct.split(';')[0].trim(),
        // The `Link: </sitemap.xml>; rel="sitemap"` header was added in #81
        // for agent-readiness. It applies to every path via `[[headers]]
        // for = "/*"` in netlify.toml. If that block ever gets dropped the
        // site silently loses agent discoverability.
        link: res.headers.get('link') || '',
    };
}

async function fetchHtml(url) {
    const res = await fetch(url, {redirect: 'follow'});
    if (!res.ok) throw new Error(`${url} -> ${res.status}`);
    return res.text();
}

// HTML helpers — regex-based on purpose. We're extracting a small set of
// well-formed tags. A DOM parser would be more correct but adds dep weight
// for no real signal gain.
function meta(html, name) {
    const re = new RegExp(
        `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']*)["']`,
        'i',
    );
    const m = html.match(re);
    return m ? m[1].replace(/\s+/g, ' ').trim() : null;
}

function title(html) {
    const m = html.match(/<title>([^<]*)<\/title>/i);
    return m ? m[1].trim() : null;
}

function bodyText(html) {
    const m = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (!m) return null;
    return m[1]
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 400); // first chunk — full diffs are too noisy
}

function pageSignals(html) {
    return {
        title: title(html),
        description: meta(html, 'description'),
        ogType: meta(html, 'og:type'),
        ogTitle: meta(html, 'og:title'),
        ogSiteName: meta(html, 'og:site_name'),
        twitterCard: meta(html, 'twitter:card'),
        bodyTextPrefix: bodyText(html),
    };
}

// Normalize host-specific values so a prod URL compares equal to a preview
// URL with a different host.
function normalize(value, urlBase) {
    if (value == null) return value;
    if (typeof value === 'string') {
        return value.split(urlBase).join(PROD_URL);
    }
    if (Array.isArray(value)) return value.map((v) => normalize(v, urlBase));
    if (typeof value === 'object') {
        const out = {};
        for (const [k, v] of Object.entries(value)) {
            out[k] = normalize(v, urlBase);
        }
        return out;
    }
    return value;
}

function diff(a, b) {
    const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
    const diffs = [];
    for (const k of keys) {
        if (JSON.stringify(a?.[k]) !== JSON.stringify(b?.[k])) {
            diffs.push({key: k, prod: a?.[k], preview: b?.[k]});
        }
    }
    return diffs;
}

function fmtDiff(d) {
    const truncate = (v, n = 80) => {
        const s = JSON.stringify(v);
        return s.length > n ? s.slice(0, n) + '…' : s;
    };
    return d
        .map(
            ({key, prod, preview}) =>
                `    ${key}:\n      prod    = ${truncate(prod)}\n      preview = ${truncate(preview)}`,
        )
        .join('\n');
}

let fails = 0;
let oks = 0;
let total = 0;

async function checkHttp() {
    console.log(`\n=== HTTP parity ===`);
    for (const t of httpTargets) {
        total++;
        let prod, preview;
        try {
            prod = await fetchHead(PROD_URL + t.path);
            preview = await fetchHead(PREVIEW_URL + t.path);
        } catch (e) {
            console.log(`  ${t.path.padEnd(35)} ❌ fetch error: ${e.message}`);
            fails++;
            continue;
        }
        const mismatches = [];
        if (prod.status !== preview.status) {
            mismatches.push(
                `status (prod=${prod.status} preview=${preview.status})`,
            );
        }
        if (prod.location !== preview.location) {
            mismatches.push(
                `location (prod="${prod.location}" preview="${preview.location}")`,
            );
        }
        if (prod.contentType !== preview.contentType) {
            mismatches.push(
                `content-type (prod="${prod.contentType}" preview="${preview.contentType}")`,
            );
        }
        if (prod.link !== preview.link) {
            mismatches.push(
                `link (prod="${prod.link}" preview="${preview.link}")`,
            );
        }
        if (mismatches.length === 0) {
            console.log(`  ${t.path.padEnd(35)} ✓  (${prod.status} ${t.kind})`);
            oks++;
        } else {
            console.log(`  ${t.path.padEnd(35)} ❌ ${mismatches.join('; ')}`);
            fails++;
        }
    }
}

async function checkContent() {
    console.log(`\n=== Content parity ===`);
    for (const path of contentTargets) {
        total++;
        let prodHtml, prevHtml;
        try {
            prodHtml = await fetchHtml(PROD_URL + path);
            prevHtml = await fetchHtml(PREVIEW_URL + path);
        } catch (e) {
            console.log(`  ${path.padEnd(35)} ❌ fetch error: ${e.message}`);
            fails++;
            continue;
        }
        const prodSig = normalize(pageSignals(prodHtml), PROD_URL);
        const prevSig = normalize(pageSignals(prevHtml), PREVIEW_URL);
        const diffs = diff(prodSig, prevSig);
        if (diffs.length === 0) {
            console.log(`  ${path.padEnd(35)} ✓`);
            oks++;
        } else {
            console.log(`  ${path.padEnd(35)} ❌ ${diffs.length} signal(s) differ:`);
            console.log(fmtDiff(diffs));
            fails++;
        }
    }
}

(async () => {
    console.log(`prod    : ${PROD_URL}`);
    console.log(`preview : ${PREVIEW_URL}`);
    console.log(`mode    : ${argMode}`);

    if (runHttp) await checkHttp();
    if (runContent) await checkContent();

    console.log();
    if (fails > 0) {
        console.log(`FAIL: ${fails}/${total} mismatches`);
        process.exit(1);
    }
    console.log(`PASS: ${oks}/${total} paths match`);
})();
