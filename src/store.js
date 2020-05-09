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
        specialFontOn: false,
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
        toggleSpecialFont(state, newSpecialFontState) {
            if (newSpecialFontState === undefined) {
                state.specialFontOn = !state.specialFontOn;
            } else {
                state.specialFontOn = newSpecialFontState;
            }
        },
        toggleFlip(state) {
            state.flip = !state.flip;
        },
        changeLang(state, langObject) {
            state.currentLang = langObject;
        },
    },
    plugins: [vuexPersist.plugin],
});
