<template>
    <div
        class="corner"
        v-tooltip="{
            content: 'toolTipText',
            classes: tooltip,
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
        };
    },
};
</script>
<style lang="scss">
@import '../assets/corner.scss';
</style>
