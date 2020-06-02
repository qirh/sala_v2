<template>
    <ul v-if="langs.length" class="langs-list">
        <li
            v-for="lang in langs"
            :key="lang.code"
            @click="changeLang(lang.code)"
            :title="lang.code"
            :disabled="currentLangCode === lang.code"
            class="lang-item"
            :class="[
                `${lang.fonts[0]}`,
                {
                    'selected-lang': currentLangCode === lang.code,
                },
            ]"
        >
            {{ lang.name }}
        </li>
    </ul>
</template>

<script>
import {langs, getLangObjectFromCode} from '@/consts';
import store from '@/store';

export default {
    name: 'LangSwitcher',

    computed: {
        langs() {
            return langs;
        },
        currentLangCode() {
            return store.state.currentLang ? store.state.currentLang.code : '';
        },
    },
    methods: {
        changeLang(langCode) {
            const LangObject = getLangObjectFromCode(langCode);
            store.commit('changeLang', LangObject);
        },
    },
};
</script>
<style scoped lang="scss">
@import '../assets/styles/LangSwitcher.scss';
</style>
