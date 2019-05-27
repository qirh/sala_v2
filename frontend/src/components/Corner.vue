<template>
    <div
        class="corner"
        v-tooltip="{
            content: 'bla',
            placement: 'bottom-center',
            classes: ['info'],
            targetClasses: ['it-has-a-tooltip'],
            offset: 100,
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
};
</script>
<style scoped lang="scss">
@import '../assets/corner.scss';
</style>
