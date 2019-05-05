@import url('https://fonts.googleapis.com/css?family=Merriweather+Sans|Muli')

<template>
    <div id="app">
        <else></else>
        <router-view></router-view>
    </div>
</template>

<script>
import Else from '@/components/Else';

export default {
    name: 'App',
    components: {
        Else,
    },
};
</script>
<style>
* {
    font-family: 'Merriweather Sans';
}
</style>
