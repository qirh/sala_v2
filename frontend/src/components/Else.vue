<template>
    <div>
        <v-btn flat to="/">/home</v-btn>
        <v-btn flat to="/blog">/blog</v-btn>
        <!-- add languages here -->
    </div>
</template>

<script>
export default {
    name: 'AppNavigation',
    data: () => ({
        languages: ['English', 'العربية', 'Fizz', 'Buzz'],
    }),
};
</script>

<style scoped>
* {
    text-transform: none !important;
}
</style>
