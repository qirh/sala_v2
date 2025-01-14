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
                <p class="main-title" v-html="$t('title')"></p>
            </div>
            <div class="grid-paragraphs">
                <!-- eslint-disable -->
                <i18n path="p1" tag="p"></i18n>
                <i18n path="p2" tag="p">
                    <template v-slot:laugh>
                        <p class="toolTip" :title="$t('laughToolTip')" v-html="$t('laugh')"></p>
                    </template>
                    <template v-slot:smile>
                        <font-awesome-icon
                            :icon="['far', 'smile']"
                        ></font-awesome-icon>
                    </template>
                </i18n>
                <i18n path="p3" tag="p">
                </i18n>
                <i18n path="p4" tag="p">
                  <template v-slot:hobbies>
                        <p class="toolTip" :title="$t('hobbiesToolTip')" v-html="$t('hobbies')"></p>
                    </template>
                    <template v-slot:wink>
                        <font-awesome-icon
                            :icon="['far', 'smile-wink']"
                        ></font-awesome-icon>
                    </template>
                </i18n>
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
