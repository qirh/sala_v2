<template>
    <ul v-if="langs.length" class="langs-list">
        <li
            v-for="lang in langs"
            :key="lang.code"
            @click="changeLang(lang.code)"
            :title="lang.code"
            :disabled="$store.state.currentLang.code === lang.code"
            class="lang-item"
            :class="[
                `${lang.fonts[0]}`,
                {
                    'selected-lang':
                        $store.state.currentLang.code === lang.code,
                },
            ]"
        >
            {{ lang.name }}
        </li>
    </ul>
</template>

<script>
import {langs} from '@/consts';

export default {
    name: 'LangSwitcher',

    computed: {
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
