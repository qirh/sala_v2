import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
    key: '~~saleh~~-1.1',
    storage: localStorage,
});

export default new Vuex.Store({
    state: {
        theme: 'light',
        flipDirection: true,
        funFont: false,
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
        changeLang(state, langObject) {
            state.currentLang = langObject;
        },
        toggleFont(state) {
            state.funFont = !state.funFont;
        },
        switchFlipDirection(state) {
            state.flipDirection = !state.flipDirection;
        },
    },
    plugins: [vuexPersist.plugin],
});
