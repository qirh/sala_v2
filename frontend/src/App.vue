@import url('https://fonts.googleapis.com/css?family=Merriweather+Sans|Muli')
@import url('https://cdn.rawgit.com/namuol/cheet.js/master/cheet.min.js')

<template>
    <div id="app">
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
};
cheet('↑ ↑ ↓ ↓ ← → ← → b a', () => {
    alert('Voilà!');
});
</script>

<style>
* {
    font-family: 'Merriweather Sans';
}
.flip {
    overflow: hidden;
    transition-duration: 0.8s;
    transition-property: transform;
}
.flip:hover {
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
}
</style>
