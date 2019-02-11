<template>
    <v-toolbar app color="grey lighten-5">
        <v-toolbar-items>
            <v-btn flat to="/">/home</v-btn>
            <v-btn flat to="/blog">/blog</v-btn>
        </v-toolbar-items>
    </v-toolbar>
</template>

<script>
export default {
    name: 'AppNavigation',
};
</script>

<style scoped>
* {
    text-transform: none !important;
}
</style>
