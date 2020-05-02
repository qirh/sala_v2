<template>
    <div v-if="langs.length">
        <div v-for="lang in langs" v-bind:key="lang.code">
            <div
                v-if="!lang.selected"
                v-on:click="$store.commit('changeLang', lang.code)"
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
    data: () => {
        return {
            langs: store.state.langs,
        };
    },
};
</script>
<style scoped lang="scss">
@import '../assets/styles/LanguageSwitcher.scss';
</style>
