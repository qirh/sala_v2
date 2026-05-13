// Visual regression: snapshots every route × theme × language.
// Baselines are committed from current Vue 2 main and become the parity
// target for any future rewrite (PR #84 SvelteKit). Any pixel diff above
// the threshold fails CI (when run on the same OS as the baselines).
//
// This spec is NOT run by `npm test` because the baselines are
// OS-specific and CI runs on Linux. Run it with:
//
//   npm run test:visual                                # uses current OS
//   npx playwright test tests/visual.spec.js --update-snapshots  # re-baseline
//
// Lang/theme are seeded via the vuex-persist composite key
// `~~saleh~~-1.6` BEFORE page load so the app boots already in the
// target state — no click-to-switch race.

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
                // Ensure fonts have loaded before snapshotting; otherwise
                // the screenshot can show a font swap mid-render.
                await page.evaluate(() => document.fonts.ready);
                await expect(page).toHaveScreenshot({
                    fullPage: true,
                    animations: 'disabled',
                    maxDiffPixelRatio: 0.01,
                });
            });
        }
    }
}
