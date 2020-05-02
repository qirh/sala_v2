<template>
    <div>
        <div class="home-text">
            <p class="home-title">{{ $t(homeTitle) }}</p>
            <p>{{ $t(homeSubtitle) }}</p>
        </div>
        <div class="home-settings">
            <Corner></Corner>
            <ThemeToggler></ThemeToggler>
            <LanguageSwitcher></LanguageSwitcher>
        </div>
    </div>
</template>

<script>
import Corner from '@/components/Corner';
import ThemeToggler from '@/components/ThemeToggler';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default {
    name: 'Home',
    components: {
        Corner,
        ThemeToggler,
        LanguageSwitcher,
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
