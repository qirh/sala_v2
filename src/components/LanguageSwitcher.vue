<template>
    <div v-if="langs.length">
        <div v-for="lang in langs" v-bind:key="lang.code">
            <a
                v-if="lang.code != currentLang"
                @click="$store.commit('changeLang', lang.code)"
                :title="lang.code"
                class="lang-item"
            >
                {{ lang.name }}
            </a>
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
        }
    },
};
</script>
<style scoped lang="scss">
@import '../assets/styles/LanguageSwitcher.scss';
</style>
