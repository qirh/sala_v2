<template>
    <v-app>
        <v-content transition="slide-x-transition">
            <router-view></router-view>
        </v-content>
        <else></else>
    </v-app>
</template>

<script>
import Else from '@/components/Else';

export default {
    name: 'App',
    components: {
        AppNavigation,
    },
};
</script>

<style></style>
