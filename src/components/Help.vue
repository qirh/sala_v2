<template>
    <div
        class="help"
        :class="{
            shown: $store.state.showHelp,
        }"
        v-tooltip="{
            content: $t('helpTooltip'),
            classes: ['help-tooltip', 'info'],
            placement: 'left',
            offset: 10,
            delay: {
                show: 500,
                hide: 300,
            },
        }"
    >
        <font-awesome-icon
            :icon="['far', 'question-circle']"
            class="help-icon"
        ></font-awesome-icon>
    </div>
</template>

<script>
import store from '@/store';

export default {
    name: 'Help',
    mounted() {
        this.$mousetrap.bind('h e l p', this.toggleHelp);
    },
    methods: {
        toggleHelp() {
            store.commit('toggleShowHelp');
        },
    },
};
</script>
<style lang="scss">
@import '../assets/styles/help.scss';
</style>
