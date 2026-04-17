<template>
    <div class="grid">
        <div class="grid-langs-theme">
            <LangSwitcher class="grid-langs"></LangSwitcher>
            <ThemeToggler class="grid-theme"></ThemeToggler>
        </div>
        <div class="grid-icons">
            <Icons></Icons>
        </div>
        <div id="grid-main" :class="[{'right-to-left': isRTL}, animClass]">
            <div class="grid-title">
                <p class="main-title" v-html="$t('title')"></p>
            </div>
            <div class="grid-paragraphs">
                <!-- eslint-disable -->
                <i18n-t keypath="p1" tag="p"></i18n-t>
                <i18n-t keypath="p2" tag="p">
                    <template #smile>
                        <font-awesome-icon
                            :icon="['far', 'smile']"
                        ></font-awesome-icon>
                    </template>
                </i18n-t>
                <i18n-t keypath="p3" tag="p"></i18n-t>
                <i18n-t keypath="p4" tag="p"></i18n-t>
                <i18n-t keypath="p5" tag="p"></i18n-t>
            </div>
            <div class="grid-picture">
                <img
                    class="picture"
                    alt="picture of me"
                    rel="preload"
                    :title="$t('pictureTitle')"
                    src="/assets/moi.jpg"
                />
            </div>
        </div>
        <div class="grid-footer">
            <p>
                {{ $t('footerLastUpdated') }}
                <a :href="gitLink"
                    >{{ this.date
                    }}<span v-if="this.dateSpecial"
                        >~~{{ this.dateSpecial }}</span
                    ></a
                >
            </p>
            <!-- eslint-enable -->
        </div>
    </div>
</template>

<script>
import Icons from '@/components/Icons';
import ThemeToggler from '@/components/ThemeToggler';
import LangSwitcher from '@/components/LangSwitcher';
import store from '@/store';

export default {
    name: 'Home',
    props: ['buildTime', 'gitHash'],
    data: function () {
        return {
            gitLink: 'https://github.com/qirh/sala_v2/commit/' + this.gitHash,
            animClass: '',
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
        currentLangCode() {
            return store.state.currentLang ? store.state.currentLang.code : '';
        },
        isRTL() {
            return store.state.currentLang?.direction === 'rtl';
        },
    },
    components: {
        Icons,
        ThemeToggler,
        LangSwitcher,
    },
    methods: {
        getDate(locale) {
            return new Intl.DateTimeFormat(locale, {
                month: 'long',
                year: 'numeric',
            }).format(new Date(this.buildTime));
        },
        animateLangSwitch() {
            this.animClass =
                store.state.currentLang.direction === 'ltr'
                    ? 'section-anim-ltr'
                    : 'section-anim-rtl';
            setTimeout(() => {
                this.animClass = '';
            }, 500);
        },
    },
    created() {
        store.watch(
            () => {
                return this.$store.state.currentLang;
            },
            () => {
                this.animateLangSwitch();
            },
        );
    },
};
</script>
<style scoped lang="scss">
@import '../assets/styles/home.scss';
</style>
