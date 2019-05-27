<template>
    <div
        class="corner"
        v-tooltip="{
            content: 'toolTipText',
            classes: ['tooltip', 'info'],
            placement: placement,
            offset: 30,
            delay: {
                show: 500,
                hide: 300,
            },
        }"
    >
        <font-awesome-icon :icon="['far', 'question-circle']">
        </font-awesome-icon>
    </div>
</template>

<script>
export default {
    name: 'corner',
    data: function() {
        return {
            toolTipText: 'this is tooltip',
            placement: this.$store.state.mode == 'ltr' ? 'left' : 'right',
        };
    },
};
</script>
<style lang="scss">
@import '../assets/corner.scss';
</style>
