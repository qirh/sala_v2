<template>
    <div class="theme-toggle" @click="$store.commit('toggleTheme')">
        <div class="toggle">
            <div id="subtoggle" type="checkbox"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ThemeToggler',
};
</script>
<style scoped lang="scss">
@import '../assets/styles/themeToggler.scss';
</style>
