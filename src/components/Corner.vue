<template>
    <div
        :key="index"
        class="corner"
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
    name: 'Corner',
    computed: {
        placement() {
            return store.state.currentPlacement;
        },
    },
    watch: {
        placement(newPlacement, oldPlacement) {
            this.index++;
        },
    },
    data: () => {
        return {
            index: 1,
            textTooltip: 'tooltip',
        };
    },
};
</script>
<style lang="scss">
@import '../assets/styles/corner.scss';
</style>
