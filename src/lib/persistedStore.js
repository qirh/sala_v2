import {browser} from '$app/environment';
import {writable} from 'svelte/store';

function readStoredValue(key, defaults) {
    if (!browser) {
        return defaults;
    }

    const stored = localStorage.getItem(key);
    if (!stored) {
        return defaults;
    }

    try {
        const parsed = JSON.parse(stored);
        return {...defaults, ...parsed};
    } catch {
        return defaults;
    }
}

export function persistedStore(key, defaults) {
    const store = writable(readStoredValue(key, defaults));

    if (browser) {
        store.subscribe((value) => {
            localStorage.setItem(key, JSON.stringify(value));
        });
    }

    return store;
}
