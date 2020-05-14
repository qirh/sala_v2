import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import {mod} from '@/consts';

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
    key: 'sala-0.2',
    storage: localStorage,
});

export default new Vuex.Store({
    state: {
        theme: 'light',
        flip: false,
        flipDirection: 'right',
        fontIndex: 0,
        currentLang: null,
        currentRotate: 0,
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
        rotateRight(state) {
            state.currentRotate = mod(state.currentRotate + 90, 360);
        },
        rotateLeft(state) {
            state.currentRotate = mod(state.currentRotate + 90, 360);
        },
    },
    plugins: [vuexPersist.plugin],
});
