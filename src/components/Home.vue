<template>
    <div class="grid">
        <div class="grid-langs-theme">
            <LangSwitcher class="grid-langs"></LangSwitcher>
            <ThemeToggler class="grid-theme"></ThemeToggler>
        </div>
        <div class="grid-icons">
            <Icons></Icons>
        </div>
        <div id="grid-main">
            <div class="grid-title">
                <p class="main-title" v-html="$t('title1')"></p>
                <p class="main-title" v-html="$t('title2')"></p>
            </div>
            <div class="grid-paragraphs">
                <p v-html="$t('p1')"></p>
                <p>
                    {{ $t('p2') }}
                    <font-awesome-icon
                        v-if="currentLangCode === 'ar'"
                        :icon="['fa', 'mountain']"
                        class="help-icon"
                    ></font-awesome-icon>
                </p>
                <p>
                    {{ $t('p3') }}
                    <font-awesome-icon
                        :icon="['far', 'smile']"
                        class="help-icon"
                    ></font-awesome-icon>
                </p>
            </div>
            <div class="grid-picture">
                <img
                    class="picture"
                    alt="picture of saleh"
                    :title="$t('covidHair')"
                    src="/assets/moi.jpg"
                />
            </div>
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
import Icons from '@/components/Icons';
import ThemeToggler from '@/components/ThemeToggler';
import LangSwitcher from '@/components/LangSwitcher';
import store from '@/store';

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
        currentLangCode() {
            return store.state.currentLang ? store.state.currentLang.code : '';
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
        updateLangUI() {
            // change direction
            const gridMain = document.getElementById('grid-main');
            let animationClass = null;
            if (store.state.currentLang.direction === 'ltr') {
                animationClass = 'section-anim-ltr';
                gridMain.classList.remove('right-to-left');
            } else {
                animationClass = 'section-anim-rtl';
                gridMain.classList.add('right-to-left');
            }
            gridMain.classList.add(animationClass);
            setTimeout(() => gridMain.classList.remove(animationClass), 500);
        },
    },
    created() {
        store.watch(
            () => {
                return this.$store.state.currentLang;
            },
            (newValue, oldValue) => {
                this.updateLangUI(oldValue);
            },
        );
    },
};
</script>
<style scoped lang="scss">
@import '../assets/styles/home.scss';
</style>
