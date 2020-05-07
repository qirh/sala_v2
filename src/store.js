import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import {langs} from '@/consts';

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
        currentLang: '',
        currentPlacement: '',
        currentDirection: '',
        currentTitle: '',
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
            const langObject = langs.find((lang) => lang.code === langCode);
            state.currentLang = langObject.code;
            state.currentPlacement = langObject.placement;
            state.currentDirection = langObject.direction;
            state.currentTitle = langObject.title;
        },
    },
    plugins: [vuexPersist.plugin],
});
