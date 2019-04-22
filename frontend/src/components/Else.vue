<template>
    <v-toolbar app flat color="grey lighten-5" dense="true">
        
            <v-btn flat to="/">/home</v-btn>
            <v-btn flat to="/blog">/blog</v-btn>
        
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-select flat :items="languages" single-line="true" label="Change Language"></v-select>
        
    </v-toolbar>
</template>

<script>
export default {
    name: 'AppNavigation',
    data: () => ({
        languages: ['English', 'العربية', 'Fizz', 'Buzz'],
    })
};
</script>

<style scoped>
* {
    text-transform: none !important;
}
</style>
