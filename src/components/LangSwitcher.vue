<template>
    <div v-if="langs.length">
        <div v-for="lang in langs" v-bind:key="lang.code">
            <div
                v-if="lang.code != currentLang"
                v-on:click="changeLang(lang.code)"
                :title="lang.code"
                class="lang-item"
            >
                {{ lang.name }}
            </div>
        </div>
    </div>
</template>

<script>
import {langs} from '@/consts';
import store from '@/store';

export default {
    name: 'LangSwitcher',

    computed: {
        currentLang() {
            return store.state.currentLang;
        },
        langs() {
            return langs;
        },
    },
    methods: {
        changeLang(langCode) {
            store.commit('changeLang', langCode);
            this.$i18n.locale = langCode;
        },
    },
};
</script>
<style scoped lang="scss">
@import '../assets/styles/LangSwitcher.scss';
</style>
