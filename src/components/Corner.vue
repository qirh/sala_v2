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
        <font-awesome-icon :icon="['far', 'question-circle']">
        </font-awesome-icon>
    </div>
</template>

<script>
export default {
    name: 'corner',
    data: function() {
        return {
            textTooltip: 'tooltip',
            placement: this.$store.state.direction == 'ltr' ? 'left' : 'right',
        };
    },
};
</script>
<style lang="scss">
@import '../assets/styles/corner.scss';
</style>
