@import
url('https://fonts.googleapis.com/css?family=Merriweather+Sans|Muli|Rubik|Inconsolata')

<template>
    <div
        class="flip-prep cuerpo"
        :class="{
            'flip-actually': $store.state.flip,
        }"
    >
        <NavHeader class="links column"></NavHeader>
        <TransitionPage class="content column">
            <router-view></router-view>
        </TransitionPage>
        <Corner></Corner>
    </div>
</template>

<script>
import NavHeader from '@/components/NavHeader';
import TransitionPage from '@/components/TransitionPage';
import Corner from '@/components/Corner';
import store from '@/store';

import '../node_modules/splitting/dist/splitting.css';
import '../node_modules/splitting/dist/splitting-cells.css';
import Splitting from '../node_modules/splitting/dist/splitting.js';

export default {
    name: 'App',
    components: {
        NavHeader,
        TransitionPage,
        Corner,
    },
    methods: {
        applyTheme: () => {
            if (store.state.theme == 'dark') {
                document.body.classList.add('dark-theme');
                document.body.classList.remove('light-theme');
            } else {
                document.body.classList.remove('dark-theme');
                document.body.classList.add('light-theme');
            }
        },
        applyNPS: () => {
            if (store.state.npsFont) {
                document.body.classList.add('nps-font');
                document.body.classList.remove('regular-font');
            } else {
                document.body.classList.remove('nps-font');
                document.body.classList.add('regular-font');
            }
        },
    },
    created() {
        Splitting();
        this.applyTheme();
        this.applyNPS();
        store.watch(() => {
            this.applyTheme();
            this.applyNPS();
        });
        // eslint-disable-next-line
        cheet('f', () => {
            store.commit('toggleFlip');
            setTimeout(() => store.commit('toggleFlip'), 750);
        });
        // eslint-disable-next-line
        cheet('t', () => {
            store.commit('toggleTheme');
        });
        // eslint-disable-next-line
        cheet('n', () => {
            store.commit('toggleNPS');
        });
        cheet('b', () => {
            Splitting();
        });
    },
};
</script>

<style lang="scss">
@import 'assets/styles/global.scss';
@import 'assets/styles/themes.scss';
</style>
