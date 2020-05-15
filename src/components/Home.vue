<template>
    <div>
        <div class="home-text">
            <p class="home-greet">{{ $t('homeGreet') }}</p>
            <p class="home-title" v-html="$t('homeTitleOne')"></p>
            <p class="home-title" v-html="$t('homeTitleTwo')"></p>
            <p v-html="$t('homeSubOne')"></p>
            <p v-html="$t('homeSubTwo')"></p>
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
