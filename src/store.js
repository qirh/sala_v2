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
        npsFont: false,
        currentLang: 'en',
        langs: [
            {
                code: 'en',
                name: 'English',
                placement: 'left',
                direction: 'ltr',
            },
            {
                code: 'es',
                name: 'Español',
                placement: 'left',
                direction: 'ltr',
            },
            {
                code: 'ar',
                name: 'عربي',
                placement: 'right',
                direction: 'rtl',
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
            state.currentLang = langCode;
        },
    },
    plugins: [vuexPersist.plugin],
});
