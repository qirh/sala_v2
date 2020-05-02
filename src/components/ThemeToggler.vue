<template>
    <div class="theme-toggle" v-on:click="$store.commit('toggleTheme')">
        <div class="toggle">
            <div id="subtoggle" type="checkbox"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'themeToggler',
    data: function() {
        return {
            textTooltip: 'tooltip',
            placement: this.$store.state.direction == 'ltr' ? 'left' : 'right',
        };
    },
};
</script>
<style scoped lang="scss">
@import '../assets/styles/themeToggler.scss';
</style>
