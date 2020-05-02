<template>
    <div class="theme-toggle" v-on:click="$store.commit('toggleTheme')">
        <div class="toggle">
            <div id="subtoggle" type="checkbox"></div>
        </div>
    </div>
</template>

<script>
import store from '@/store';

export default {
    name: 'ThemeToggler',
    data: () => {
        return {
            textTooltip: 'tooltip',
            placement: store.state.direction == 'ltr' ? 'left' : 'right',
        };
    },
};
</script>
<style scoped lang="scss">
@import '../assets/styles/themeToggler.scss';
</style>
