@import
url('https://fonts.googleapis.com/css?family=Merriweather+Sans|Muli|Rubik|Inconsolata')
@import url('https://cdn.rawgit.com/namuol/cheet.js/master/cheet.min.js')

<template>
    <div
        class="flip cuerpo"
        :class="{
            'flip-v2': doFlip,
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

export default {
    name: 'App',
    components: {
        NavHeader,
        TransitionPage,
        Corner,
    },
    data: () => {
        return {
            doFlip: 0,
            darkMode: 0,
            leftToRight: 1,
        };
    },
    methods: {
        registerDarkState: function(darkState) {
            localStorage.darkMode = darkState;
            if (darkState) {
                document.body.classList.add('dark-theme');
                document.body.classList.remove('light-theme');
            } else {
                document.body.classList.remove('dark-theme');
                document.body.classList.add('light-theme');
            }
        },
        flipDarkState: function() {
            if (this.darkMode) {
                this.darkMode = 0;
            } else {
                this.darkMode = 1;
            }
            this.registerDarkState(this.darkMode);
        },
        changeDarkState: function(darkState) {
            this.darkMode = darkState;
            this.registerDarkState(this.darkMode);
        },
        changeFlipState: function() {
            this.doFlip = !this.doFlip;
        },
    },
    created() {
        if (isNaN(localStorage.darkMode)) {
            if (matchMedia('(prefers-color-scheme: dark)').matches) {
                this.changeDarkState(1);
            } else {
                this.changeDarkState(0);
            }
        } else {
            this.changeDarkState(localStorage.darkMode);
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
            this.flipDarkState();
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
