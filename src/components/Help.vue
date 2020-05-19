<template>
    <div
        :key="index"
        class="help"
        v-tooltip="{
            content: $t(textTooltip),
            classes: ['tooltip', 'info'],
            placement,
            offset: 10,
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
    name: 'Help',
    computed: {
        placement() {
            return store.state.currentLang.placement;
        },
    },
    watch: {
        placement() {
            this.index++;
        },
    },
    data: () => {
        return {
            index: 1,
            textTooltip: 'helpTooltip',
        };
    },
};
</script>
<style lang="scss">
@import '../assets/styles/help.scss';
</style>
