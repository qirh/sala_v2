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
        mode: 'light',
        flip: false,
        direction: 'ltr',
    },
    getters: {
        getMode: (state) => {
            return state.mode;
        },
    },
    mutations: {
        toggleMode(state) {
            if (state.mode == 'light') {
                state.mode = 'dark';
            } else {
                state.mode = 'light';
            }
        },
        toggleFlip(state) {
            state.flip = !state.flip;
        },
    },
    plugins: [vuexPersist.plugin],
});
