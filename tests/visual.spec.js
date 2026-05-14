// Visual regression: viewport-only screenshots of every route × theme ×
// language. Baselines are captured against production saleh.sh and become
// the parity target for any future rewrite.
//
// Capture/refresh baselines:
//   npm run test:visual:update
// Verify against local dev server (auto-spawned by playwright.config.js):
//   npm run test:visual
//
// Viewport (1280×800), not fullPage. Long routes (NYCMarathon25, Bday25)
// would otherwise accumulate sub-pixel paragraph-spacing drift between
// stacks (~0.4% body height) which cascades into massive diff ratios when
// fullPage heights differ even by a few pixels. The viewport captures the
// visible-on-load region — the only place a real regression would be
// obvious to a visitor.
//
// Lang/theme seeded via the vuex-persist composite key BEFORE page load,
// so the app boots already in the target state — no click-to-switch race.

const {test, expect} = require('@playwright/test');

const PERSIST_KEY = '~~saleh~~-1.6';

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

function slugify(route) {
    return route === '/' ? 'home' : route.slice(1);
}

for (const route of routes) {
    for (const theme of themes) {
        for (const langCode of Object.keys(langs)) {
            test(`visual ${slugify(route)} [${langCode}, ${theme}]`, async ({
                page,
            }) => {
                await seedState(page, theme, langs[langCode]);
                await page.goto(route);
                await page.waitForLoadState('networkidle');
                // Ensure fonts have loaded before snapshotting.
                await page.evaluate(() => document.fonts.ready);
                await expect(page).toHaveScreenshot(
                    `${slugify(route)}-${langCode}-${theme}.png`,
                );
            });
        }
    }
}
