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
        fontIndex: 0,
        currentLang: null,
    },
    mutations: {
        toggleTheme(state) {
            if (state.theme == 'light') {
                state.theme = 'dark';
            } else {
                state.theme = 'light';
            }
        },
        toggleFlip(state) {
            state.flip = !state.flip;
        },
        changeLang(state, langObject) {
            state.currentLang = langObject;
        },
        changeFontIndex(state, newFontIndex) {
            state.fontIndex = newFontIndex;
        },
    },
    plugins: [vuexPersist.plugin],
});
