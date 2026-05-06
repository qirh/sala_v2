import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 20000,
    fullyParallel: false,
    workers: 1,
    reporter: 'list',
    use: {
        baseURL: 'http://127.0.0.1:8080',
        headless: true,
    },
    webServer: {
        command: 'npm run preview -- --host 127.0.0.1 --port 8080',
        url: 'http://127.0.0.1:8080',
        reuseExistingServer: !process.env.CI,
        timeout: 60000,
    },
    projects: [
        {
            name: 'chromium',
            use: {...devices['Desktop Chrome']},
        },
    ],
});
