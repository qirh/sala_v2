import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
    key: 'sala-0.1',
    storage: localStorage,
});

export default new Vuex.Store({
    state: {
        theme: 'light',
        flip: false,
        flipDirection: 'right',
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
        toggleFlip(state, changeDirection) {
            state.flip = !state.flip;
            if (changeDirection) {
                state.flipDirection =
                    state.flipDirection === 'right' ? 'left' : 'right';
            }
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
