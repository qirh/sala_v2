@import
url('https://fonts.googleapis.com/css?family=Merriweather+Sans|Muli|Rubik|Inconsolata')
@import url('https://cdn.rawgit.com/namuol/cheet.js/master/cheet.min.js')

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
    },
    created() {
        this.applyTheme();
        store.watch(() => {
            this.applyTheme();
        });
        // eslint-disable-next-line
        cheet('f l i p', () => {
            store.commit('toggleFlip');
            setTimeout(() => store.commit('toggleFlip'), 750);
        });
        // eslint-disable-next-line
        cheet('t h e m e', () => {
            store.commit('toggleTheme');
        });
        // eslint-disable-next-line
        cheet('n p s', () => {
            store.commit('toggleNPS');
        });
    },
};
</script>

<style lang="scss">
@import 'assets/styles/global.scss';
@import 'assets/styles/themes.scss';
</style>
