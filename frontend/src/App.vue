@import
url('https://fonts.googleapis.com/css?family=Merriweather+Sans|Muli|Rubik|Inconsolata')
@import url('https://cdn.rawgit.com/namuol/cheet.js/master/cheet.min.js')

<template>
    <div
        class="flip-prep cuerpo"
        :class="{
            'flip-actually': this.$store.state.flip,
            'left-to-right': leftToRight,
            'right-to-left': !leftToRight,
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
    data: () => {
        return {
            leftToRight: 1,
        };
    },
    methods: {
        applyMode: function() {
            if (store.state.mode == 'dark') {
                document.body.classList.add('dark-theme');
                document.body.classList.remove('light-theme');
            } else {
                document.body.classList.remove('dark-theme');
                document.body.classList.add('light-theme');
            }
        },
    },
    created() {
        this.applyMode();
        store.watch(() => {
            this.applyMode();
        });
        // eslint-disable-next-line
        cheet('f', () => {
            store.commit('toggleFlip');
        });
        // eslint-disable-next-line
        cheet('d', () => {
            store.commit('toggleMode');
        });
        // eslint-disable-next-line
        cheet('h', () => {
            this.$router.push('/');
        });
        // eslint-disable-next-line
        cheet('p', () => {
            this.$router.push('/p');
        });
        // eslint-disable-next-line
        cheet('b', () => {
            this.$router.push('/b');
        });
        // eslint-disable-next-line
        cheet('r', () => {
            this.$router.push('/r');
        });
        // eslint-disable-next-line
        cheet('w', () => {
            this.$router.push('/w');
        });
    },
};
</script>

<style lang="scss">
@import 'assets/global.scss';
@import 'assets/themes.scss';
</style>
