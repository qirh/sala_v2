import {execSync} from 'node:child_process';
import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vite';

function getGitHash() {
    try {
        return execSync('git rev-parse --short HEAD').toString().trim();
    } catch {
        return 'unknown';
    }
}

export default defineConfig({
    plugins: [sveltekit()],
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: [
                    'color-functions',
                    'global-builtin',
                    'import',
                ],
            },
        },
    },
    define: {
        'GIT_DESCRIBE.hash': JSON.stringify(getGitHash()),
    },
});
