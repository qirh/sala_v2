// Prod-vs-preview parity: takes a fresh screenshot of every route on
// production (saleh.sh) and on the deploy preview, then asserts they
// match within a small threshold.
//
// Unlike tests/visual.spec.js (which compares preview against committed
// baselines that I captured FROM preview — so it can't catch prod-vs-
// preview drift), this spec gates the rewrite on parity with the live
// site. The only failures should be regressions the rewrite introduces.
//
// Gated by PREVIEW_URL — the spec skips entirely if PREVIEW_URL isn't
// set. CI sets it to the deploy-preview URL; locally:
//
//   PREVIEW_URL=https://deploy-preview-84--musing-rosalind-eedabd.netlify.app npx playwright test tests/prod-parity.spec.js
//
// Diffs above the threshold are saved as PNG triples (prod / preview /
// diff) under test-results/ so failures are inspectable.

import {test, expect} from '@playwright/test';
import {PNG} from 'pngjs';
import pixelmatch from 'pixelmatch';
import {mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const PROD_URL = (process.env.PROD_URL || 'https://saleh.sh').replace(
    /\/$/,
    '',
);
const PREVIEW_URL = (process.env.PREVIEW_URL || '').replace(/\/$/, '');

const PERSIST_KEY = '~~saleh~~-1.6';

// 0.5% — same threshold as tests/visual.spec.js. Tight enough to catch
// real layout regressions; loose enough to tolerate antialiasing noise.
const MAX_DIFF_RATIO = 0.005;

// pixelmatch per-pixel threshold (0-1). 0.1 is fairly forgiving of
// per-channel anti-aliasing differences; tighter values produce more
// false positives.
const PIXEL_THRESHOLD = 0.1;

const routes = [
    '/',
    '/about',
    '/30',
    '/nycmarathon24',
    '/nycmarathon25',
    '/bday25',
];

const themes = ['light', 'dark'];

const langs = {
    en: {
        code: 'en',
        name: 'English',
        direction: 'ltr',
        title: 'Saleh Alghusson',
        fonts: ['font-rubik', 'font-ibm'],
    },
    ar: {
        code: 'ar',
        name: 'عربي',
        direction: 'rtl',
        title: 'صالح الغصون',
        fonts: ['font-amiri', 'font-aref-ruqaa'],
    },
};

function slugify(route) {
    return route === '/' ? 'home' : route.slice(1);
}

async function seedState(page, theme, lang) {
    await page.addInitScript(
        ({theme, lang, key}) => {
            localStorage.setItem(
                key,
                JSON.stringify({
                    theme,
                    flipDirection: true,
                    funFont: false,
                    currentLang: lang,
                }),
            );
        },
        {theme, lang, key: PERSIST_KEY},
    );
}

async function captureRoute(browser, browserContextOptions, base, route, theme, lang) {
    // Inherit viewport + device emulation from the active project so a
    // single spec covers chromium / chromium-laptop / chromium-phone.
    const ctx = await browser.newContext(browserContextOptions);
    const page = await ctx.newPage();
    await seedState(page, theme, lang);
    await page.goto(base + route, {waitUntil: 'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    // Strip the Netlify deploy-preview widget injected on previews so it
    // doesn't show up in screenshots and falsely flag a diff.
    await page.evaluate(() => {
        document
            .querySelectorAll('[data-netlify-deploy-id]')
            .forEach((e) => e.remove());
    });
    const buf = await page.screenshot({fullPage: false, animations: 'disabled'});
    await ctx.close();
    return buf;
}

test.describe('prod parity', () => {
    test.skip(!PREVIEW_URL, 'PREVIEW_URL not set');

    for (const route of routes) {
        for (const theme of themes) {
            for (const langCode of Object.keys(langs)) {
                test(`${slugify(route)} [${langCode}, ${theme}]`, async ({
                    browser,
                    browserName,
                    contextOptions,
                }, testInfo) => {
                    const opts = {
                        ...contextOptions,
                        viewport: testInfo.project.use.viewport,
                        deviceScaleFactor:
                            testInfo.project.use.deviceScaleFactor,
                        isMobile: testInfo.project.use.isMobile,
                        hasTouch: testInfo.project.use.hasTouch,
                    };
                    const prodBuf = await captureRoute(
                        browser,
                        opts,
                        PROD_URL,
                        route,
                        theme,
                        langs[langCode],
                    );
                    const prevBuf = await captureRoute(
                        browser,
                        opts,
                        PREVIEW_URL,
                        route,
                        theme,
                        langs[langCode],
                    );

                    const prod = PNG.sync.read(prodBuf);
                    const preview = PNG.sync.read(prevBuf);

                    const diff = new PNG({
                        width: prod.width,
                        height: prod.height,
                    });
                    const diffPx = pixelmatch(
                        prod.data,
                        preview.data,
                        diff.data,
                        prod.width,
                        prod.height,
                        {threshold: PIXEL_THRESHOLD},
                    );
                    const ratio = diffPx / (prod.width * prod.height);

                    if (ratio > MAX_DIFF_RATIO) {
                        const outDir = join(
                            testInfo.outputDir,
                            'parity-diff',
                        );
                        mkdirSync(outDir, {recursive: true});
                        writeFileSync(
                            join(outDir, 'prod.png'),
                            PNG.sync.write(prod),
                        );
                        writeFileSync(
                            join(outDir, 'preview.png'),
                            PNG.sync.write(preview),
                        );
                        writeFileSync(
                            join(outDir, 'diff.png'),
                            PNG.sync.write(diff),
                        );
                    }

                    expect(
                        ratio,
                        `pixel-diff ratio ${ratio.toFixed(4)} exceeds ${MAX_DIFF_RATIO}`,
                    ).toBeLessThanOrEqual(MAX_DIFF_RATIO);
                });
            }
        }
    }
});
