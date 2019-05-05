<template>
    <v-app>
        <else></else>
        <v-content transition="slide-x-transition">
            <router-view></router-view>
        </v-content>
    </v-app>
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
