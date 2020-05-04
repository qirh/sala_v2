<template>
    <div
        class="corner"
        v-tooltip="{
            content: $t(textTooltip),
            classes: ['tooltip', 'info'],
            placement: placement,
            offset: 20,
            delay: {
                show: 500,
                hide: 300,
            },
        }"
    >
        <font-awesome-icon
            :icon="['far', 'question-circle']"
        ></font-awesome-icon>
    </div>
</template>

<script>
import store from '@/store';

export default {
    name: 'Corner',
    computed: {
        placement() {
            return store.state.langs.find(
                (lang) => lang.code == store.state.currentLang,
            ).placement;
        },
    },
    data: () => {
        return {
            textTooltip: 'tooltip',
        };
    },
};
</script>
<style lang="scss">
@import '../assets/styles/corner.scss';
</style>
