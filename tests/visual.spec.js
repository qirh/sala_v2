// Visual regression: snapshots every route × theme × language.
// Baselines are committed from current Vue 2 main and become the parity
// target for any future rewrite (PR #84 SvelteKit). Any pixel diff above
// the threshold below fails CI.
//
// To intentionally re-baseline after a deliberate visual change, run:
//   npx playwright test tests/visual.spec.js --update-snapshots
//
// Lang/theme are seeded via the vuex-persist composite key
// `~~saleh~~-1.6` BEFORE page load so the app boots already in the
// target state — no click-to-switch race with animations.

const {test, expect} = require('@playwright/test');

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

const PERSIST_KEY = '~~saleh~~-1.6';

function seedState({theme, lang}) {
    return ({theme: t, lang: l, key}) => {
        localStorage.setItem(
            key,
            JSON.stringify({
                theme: t,
                flipDirection: true,
                funFont: false,
                currentLang: l,
            }),
        );
    };
}

for (const route of routes) {
    for (const theme of themes) {
        for (const langCode of Object.keys(langs)) {
            test(`visual ${route} [${langCode}, ${theme}]`, async ({page}) => {
                await page.addInitScript(
                    seedState({theme, lang: langs[langCode]}),
                    {theme, lang: langs[langCode], key: PERSIST_KEY},
                );
                await page.goto(route);
                await page.waitForLoadState('networkidle');
                // The flip animation runs on initial paint; let it settle.
                await page.waitForTimeout(800);
                await expect(page).toHaveScreenshot({
                    fullPage: true,
                    animations: 'disabled',
                    maxDiffPixelRatio: 0.01,
                });
            });
        }
    }
}
