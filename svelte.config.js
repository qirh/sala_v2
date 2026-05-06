import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const config = {
    preprocess: preprocess({scss: true}),
    kit: {
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: '200.html',
            precompress: false,
        }),
    },
};

export default config;
