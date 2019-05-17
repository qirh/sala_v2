@import
url('https://fonts.googleapis.com/css?family=Merriweather+Sans|Muli|Rubik|Inconsolata')
@import url('https://cdn.rawgit.com/namuol/cheet.js/master/cheet.min.js')

<template>
    <div
        id="all"
        class="flip cuerpo"
        v-bind:class="{'flip-v2': doFlip, dark: darkMode}"
    >
        <NavHeader></NavHeader>
        <div>
            <TransitionPage name="fade" mode="out-in">
                <router-view></router-view>
            </TransitionPage>
        </div>
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
        if (localStorage.darkMode) {
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
        // eslint-disable-next-line
        cheet('h', () => {
            this.$router.push('/');
        });
        // eslint-disable-next-line
        cheet('b', () => {
            this.$router.push('blog');
        });
    },
};
</script>

<style lang="scss">
@import 'assets/global.scss';
</style>
