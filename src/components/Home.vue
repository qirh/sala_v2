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
            <Help></Help>
            <Icons></Icons>
        </div>
        <div class="grid-main">
            <p class="main-greet" v-html="$t('mainGreet')"></p>
            <p class="main-title" v-html="$t('mainTitleOne')"></p>
            <p class="main-title" v-html="$t('mainTitleTwo')"></p>
            <p v-html="$t('mainSubOne')"></p>
            <p v-html="$t('mainSubTwo')"></p>
        </div>
        <div class="grid-picture">
            <img class="picture" src="/assets/moi.jpg" />
        </div>
        <div class="grid-footer">
            <!-- eslint-disable -->
            <p>
                {{ $t('footerLastUpdated') }} <a :href="gitLink">{{this.date}}<span v-if="this.dateSpecial">~~{{this.dateSpecial}}</span></a>
            </p>

            <!-- eslint-enable -->
        </div>
    </div>
</template>

<script>
import Help from '@/components/Help';
import Icons from '@/components/Icons';
import ThemeToggler from '@/components/ThemeToggler';
import LangSwitcher from '@/components/LangSwitcher';

export default {
    name: 'Home',
    props: ['buildTime', 'gitHash'],
    data: function() {
        return {
            gitLink: 'https://github.com/qirh/sala_v2/commit/' + this.gitHash,
        };
    },
    computed: {
        date() {
            let locale = this.$i18n.locale;
            if (locale === 'ar') {
                locale = 'ar-EG';
            }
            return this.getDate(locale);
        },
        dateSpecial() {
            // get hijri date if arabic
            if (this.$i18n.locale !== 'ar') {
                return null;
            }
            let locale = 'ar-SA';
            return this.getDate(locale);
        },
    },
    components: {
        Help,
        Icons,
        ThemeToggler,
        LangSwitcher,
    },
    methods: {
        updateLangFromHome(langCode) {
            this.$emit('updateLangFromHome', langCode);
        },
        getDate(locale) {
            return new Intl.DateTimeFormat(locale, {
                month: 'long',
                year: 'numeric',
            }).format(new Date(this.buildTime));
        },
    },
};
</script>
<style scoped lang="scss">
@import '../assets/styles/home.scss';
</style>
