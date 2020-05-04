<template>
    <div>
        <div class="home-text">
            <p class="home-title">{{ $t(homeTitle) }}</p>
            <p>{{ $t(homeSubtitle) }}</p>
        </div>
        <div class="home-settings">
            <Corner></Corner>
            <ThemeToggler></ThemeToggler>
            <LangSwitcher></LangSwitcher>
        </div>
    </div>
</template>

<script>
import Corner from '@/components/Corner';
import ThemeToggler from '@/components/ThemeToggler';
import LangSwitcher from '@/components/LangSwitcher';

export default {
    name: 'Home',
    components: {
        Corner,
        ThemeToggler,
        LangSwitcher,
    },
    data: () => {
        return {
            homeTitle: 'homeTitle',
            homeSubtitle: 'homeSubtitle',
        };
    },
};
</script>
<style scoped lang="scss">
@import '../assets/styles/home.scss';
</style>
