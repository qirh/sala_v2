// Test harness for saleh.sh. Convention mirrors qirh/blog so Phase 2 can
// collapse both repos' test infra with minimal restructure.
//
// Two suites live here:
//   - tests/features.spec.js + tests/routes.spec.js — functional tests, run
//     by default (`npm test`).
//   - tests/visual.spec.js — visual regression. OS-specific baselines, so
//     excluded from `npm test` (CI is Linux, baselines are macOS). Opt in
//     via `npm run test:visual` (sets VISUAL=1 so testIgnore lets it run).
//
// Baselines are captured against production saleh.sh, committed, and
// re-checked against `vite preview` (auto-spawned via webServer below) on
// every run.

import {defineConfig, devices} from '@playwright/test';

const TARGET = process.env.PARITY_TARGET || 'preview';
const PROD_URL = process.env.PROD_URL || 'https://saleh.sh';
const PREVIEW_URL = process.env.PREVIEW_URL || 'http://127.0.0.1:8080';
const baseURL = TARGET === 'prod' ? PROD_URL : PREVIEW_URL;

export default defineConfig({
    testDir: './tests',
    // Visual specs are OS-specific; skip unless VISUAL=1 is set (the
    // test:visual* npm scripts set it for you).
    testIgnore: process.env.VISUAL ? [] : ['**/visual.spec.js'],
    fullyParallel: false,
    workers: 1,
    forbidOnly: !!process.env.CI,
    retries: 0,
    reporter: 'list',
    timeout: 20000,
    use: {
        baseURL,
        headless: true,
        trace: 'off',
    },
    expect: {
        toHaveScreenshot: {
            // 0.5% tolerance for antialiasing / font hinting noise on the
            // viewport capture. Heights are deterministic (viewport is fixed
            // at 1280×800), so unlike fullPage there's no cascade-shift
            // problem.
            maxDiffPixelRatio: 0.005,
            animations: 'disabled',
        },
    },
    // Auto-spawn the SvelteKit preview server for local runs; reuse if
    // already up. Skip when targeting prod since the suite hits saleh.sh
    // directly and no local server is needed.
    webServer:
        TARGET === 'prod'
            ? undefined
            : {
                  // PUBLIC_BUILD_TIMESTAMP_UTC must be set inline with the
                  // build (env vars don't propagate across npm-script processes),
                  // or `%sveltekit.env.PUBLIC_BUILD_TIMESTAMP_UTC%` in app.html
                  // resolves to an empty string and tests catch it.
                  command: 'PUBLIC_BUILD_TIMESTAMP_UTC=$(date -u +%FT%TZ) npm run build && npm run preview -- --host 127.0.0.1 --port 8080',
                  url: PREVIEW_URL,
                  reuseExistingServer: !process.env.CI,
                  timeout: 120000,
              },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                viewport: {width: 1280, height: 800},
            },
        },
    ],
});
