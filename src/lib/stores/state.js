import {persistedStore} from '../persistedStore.js';

export const state = persistedStore('~~saleh~~-1.6', {
    theme: 'light',
    flipDirection: true,
    funFont: false,
    currentLang: null,
});

export const toggleTheme = () =>
    state.update((s) => ({
        ...s,
        theme: s.theme === 'light' ? 'dark' : 'light',
    }));

export const changeLang = (currentLang) =>
    state.update((s) => ({...s, currentLang}));

export const toggleFont = () =>
    state.update((s) => ({...s, funFont: !s.funFont}));

export const switchFlipDirection = () =>
    state.update((s) => ({...s, flipDirection: !s.flipDirection}));
