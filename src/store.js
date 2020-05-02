import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
    key: 'sala-store',
    storage: localStorage,
});

export default new Vuex.Store({
    state: {
        theme: 'light',
        flip: false,
        direction: 'ltr',
        npsFont: false,
        langs: [
            {
                code: 'en',
                name: 'English',
                selected: true,
            },
            {
                code: 'es',
                name: 'Español',
                selected: false,
            },
            {
                code: 'ar',
                name: 'العربية',
                selected: false,
            },
        ],
    },
    mutations: {
        toggleTheme(state) {
            if (state.theme == 'light') {
                state.theme = 'dark';
            } else {
                state.theme = 'light';
            }
        },
        toggleNPS(state) {
            state.npsFont = !state.npsFont;
        },
        toggleFlip(state) {
            state.flip = !state.flip;
        },
        changeLang(state, langCode) {
            // console.log(langCode);
            langCode == 'a';
        },
    },
    plugins: [vuexPersist.plugin],
});
