@import
url('https://fonts.googleapis.com/css?family=Merriweather+Sans|Muli|Rubik')
@import url('https://cdn.rawgit.com/namuol/cheet.js/master/cheet.min.js')

<template>
    <div id="all" v-bind:class="{flip: doFlip}">
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
        };
    },
    created() {
       cheet('↑ ↑ ↓ ↓ ← → ← → b a', () => { 
           this.doFlip = !this.doFlip;
        });
    },
};
</script>

<style>
* {
    font-family: 'Rubik';
}
.flip {
    background: red;
    overflow: hidden;
    transition-duration: 0.8s;
    transition-property: transform;
}
.flip:hover {
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
}
</style>
