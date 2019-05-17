@import
url('https://fonts.googleapis.com/css?family=Merriweather+Sans|Muli|Rubik|Inconsolata')
@import url('https://cdn.rawgit.com/namuol/cheet.js/master/cheet.min.js')

<template>
    <div id="all" class="flip" v-bind:class="{'flip-v2': doFlip, dark: darkMode}">
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
import Router from '@/router.js';

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
        switchDark: function(){
            if (this.darkMode) {
                this.darkMode = 0;
            } else {
                this.darkMode = 1;
            }
            localStorage.darkMode = this.darkMode
		}
    },
    created() {
        if (localStorage.darkMode) {
            this.darkMode = localStorage.darkMode
        }
        cheet('↑ ↑ ↓ ↓ ← → ← → b a', () => { 
            this.doFlip = !this.doFlip;
        });
        cheet('d', () => { 
            this.switchDark();
        });
        cheet('l i g h t', () => { 
            this.switchDark();
        });
        cheet('h', () => { 
            this.$router.push('/');
        });
        cheet('b', () => { 
            this.$router.push('blog');
        });
    },
};
</script>

<style>
@import 'assets/global.css';
</style>
