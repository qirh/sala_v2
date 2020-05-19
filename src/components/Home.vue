<template>
    <div class="grid">
        <div class="grid-langs">
            <LangSwitcher
                @updateLangFromSwitcher="updateLangFromHome"
            ></LangSwitcher>
        </div>
        <div class="grid-theme">
            <ThemeToggler></ThemeToggler>
        </div>
        <div class="grid-icons">
            <Corner></Corner>
            <Icons></Icons>
        </div>
        <div class="grid-main">
            <p class="main-greet">{{ $t('homeGreet') }}</p>
            <p class="main-title" v-html="$t('homeTitleOne')"></p>
            <p class="main-title" v-html="$t('homeTitleTwo')"></p>
            <p v-html="$t('homeSubOne')"></p>
            <p v-html="$t('homeSubTwo')"></p>
        </div>
        <div class="grid-picture">
            <img class="picture" src="/assets/moi.jpg" />
        </div>
        <div class="grid-footer">
            <p>FOOOOTER</p>
        </div>
    </div>
</template>

<script>
import Corner from '@/components/Corner';
import Icons from '@/components/Icons';
import ThemeToggler from '@/components/ThemeToggler';
import LangSwitcher from '@/components/LangSwitcher';

export default {
    name: 'Home',
    components: {
        Corner,
        Icons,
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
