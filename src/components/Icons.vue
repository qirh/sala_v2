<template>
    <div class="icons">
        <a
            href="mailto:saleh@alghusson.com"
            title="saleh@alghusson.com"
            class="icon"
        >
            <font-awesome-icon :icon="['fa', 'envelope']"></font-awesome-icon>
        </a>
        <a
            href="https://github.com/qirh"
            target="_blank"
            rel="noopener noreferrer"
            title="qirh"
            class="icon"
        >
            <font-awesome-icon :icon="['fab', 'github']"></font-awesome-icon>
        </a>
        <a
            href="https://www.goodreads.com/sal7"
            target="_blank"
            rel="noopener noreferrer"
            class="icon"
            :title="$t('reading')"
        >
            <font-awesome-icon :icon="['fab', 'goodreads']"></font-awesome-icon>
        </a>
    </div>
</template>

<script>
export default {
    name: 'Icons',
    data: () => {
        return {
            reading: 'reading',
            writing: 'writing',
        };
    },
};
</script>
<style scoped lang="scss">
@import '../assets/styles/icons.scss';
</style>
