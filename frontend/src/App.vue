@import
url('https://fonts.googleapis.com/css?family=Merriweather+Sans|Muli|Rubik|Inconsolata')
@import url('https://cdn.rawgit.com/namuol/cheet.js/master/cheet.min.js')

<template>
    <div
        class="flip cuerpo row"
        v-bind:class="{
            'flip-v2': doFlip,
            'dark-theme': darkMode,
            'normal-theme': !darkMode,
        }"
    >
        <NavHeader class="links column"></NavHeader>
        <TransitionPage name="fade" mode="out-in" class="content column">
            <router-view></router-view>
        </TransitionPage>
    </div>
</template>

<script>
import NavHeader from '@/components/NavHeader';
import TransitionPage from '@/components/TransitionPage';

export default {
    name: 'App',
    components: {
        NavHeader,
        TransitionPage,
    },
    data: () => {
        return {
            doFlip: 0,
            darkMode: 0,
        };
    },
    methods: {
        changeDarkState: function() {
            if (this.darkMode) {
                this.darkMode = 0;
            } else {
                this.darkMode = 1;
            }
            localStorage.darkMode = this.darkMode;
        },
        changeFlipState: function() {
            this.doFlip = !this.doFlip;
        },
    },
    created() {
        if (localStorage.darkMode > 0) {
            this.darkMode = localStorage.darkMode;
        }
        // eslint-disable-next-line
        cheet('↑ ↑ ↓ ↓ ← → ← →', () => {
            this.changeFlipState();
        });
        // eslint-disable-next-line
        cheet('f', () => {
            this.changeFlipState();
        });
        // eslint-disable-next-line
        cheet('d', () => {
            this.changeDarkState();
        });
    },
};
</script>

<style lang="scss">
@import 'assets/global.scss';
</style>
