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

<style></style>
