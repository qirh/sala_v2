@import
url('https://fonts.googleapis.com/css?family=Merriweather+Sans|Muli|Rubik|Inconsolata')
@import url('https://cdn.rawgit.com/namuol/cheet.js/master/cheet.min.js')

<template>
    <div id="all" class="flip" v-bind:class="{flipv2: doFlip, dark: darkMode}">
        <NavHeader></NavHeader>
        <router-view></router-view>
    </div>
</template>

<script>
import NavHeader from '@/components/NavHeader';

export default {
    name: 'App',
    components: {
        NavHeader,
    },
    data: () => {
        return {
            doFlip: false,
            darkMode: false,
        };
    },
    created() {
        if (localStorage.darkMode) {
            this.darkMode = localStorage.darkMode
        }
        cheet('↑ ↑ ↓ ↓ ← → ← → b a', () => { 
            this.doFlip = !this.doFlip;
        });
        cheet('d a r k', () => { 
            this.darkMode = !this.darkMode;
            localStorage.darkMode = this.darkMode
        });
    },
};
</script>

<style>
* {
    font-family: 'Inconsolata';
}
.flip {
    overflow: hidden;
    transition-duration: 1s;
    transition-property: transform;
}
.flipv2 {
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
}
.normal {
    color: rgba(23, 23, 23, 0.8) !important;
    background-color: rgba(247, 247, 247, 0.8);
}
.dark {
    color: rgba(247, 247, 247, 0.8) !important;
    background-color: rgba(23, 23, 23, 0.8);
}
</style>
