<template>
    <div v-if="langs.length" class="langs-list">
        <div v-for="lang in langs" v-bind:key="lang.code">
            <div
                v-on:click="changeLang(lang.code)"
                :title="lang.code"
                :disabled="$store.state.currentLang === lang.code"
                class="lang-item"
                :class="{
                    'selected-lang': $store.state.currentLang === lang.code,
                }"
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
            this.$emit('updateLangFromSwitcher', langCode);
        },
    },
};
</script>
<style scoped lang="scss">
@import '../assets/styles/LangSwitcher.scss';
</style>
