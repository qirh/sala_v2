<template>
    <div v-if="langs.length">
        <div v-for="lang in langs" v-bind:key="lang.code">
            <div
                v-if="lang.code != currentLang"
                v-on:click="changeLanguage(lang.code)"
                :title="lang.code"
                class="lang-item"
            >
                {{ lang.name }}
            </div>
        </div>
    </div>
</template>

<script>
import store from '@/store';

export default {
    name: 'LanguageSwitcher',

    computed: {
        currentLang() {
            return store.state.currentLang;
        },
        langs() {
            return store.state.langs;
        },
    },
    methods: {
        changeLanguage(langCode) {
            store.commit('changeLang', langCode);
            this.$i18n.locale = langCode;
        },
    },
};
</script>
<style scoped lang="scss">
@import '../assets/styles/LanguageSwitcher.scss';
</style>
