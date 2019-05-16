@import url('https://fonts.googleapis.com/css?family=Merriweather+Sans|Muli')
@import url('https://cdn.rawgit.com/namuol/cheet.js/master/cheet.min.js')

<template>
    <div id="app">
        <Main></Main>
        <router-view></router-view>
    </div>
</template>
<script>
import Main from '@/components/Main';
export default {
    name: 'App',
    components: {
        Main,
    },
};
</script>
<script>
cheet('↑ ↑ ↓ ↓ ← → ← → b a', () => {
    alert('Voilà!');
});
</script>
<style>
* {
    font-family: 'Merriweather Sans';
}
</style>
