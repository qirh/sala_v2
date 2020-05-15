<template>
    <div>
        <div class="home-text">
            <p class="home-title">{{ $t('homeTitle') }}</p>
            <p>{{ $t('homeSubOne') }}</p>
            <p>{{ $t('homeSubTwo') }}</p>
        </div>
        <div class="home-settings">
            <Corner></Corner>
            <ThemeToggler></ThemeToggler>
            <LangSwitcher
                @updateLangFromSwitcher="updateLangFromHome"
            ></LangSwitcher>
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
    methods: {
        updateLangFromHome(langCode) {
            this.$emit('updateLangFromHome', langCode);
        },
    },
};
</script>
<style scoped lang="scss">
@import '../assets/styles/home.scss';
</style>
