<template>
    <div>
        <p class="hey">{{ $t('hey') }}</p>
        <p>{{ $t('me') }}</p>
        <p>{{ $t('work') }}</p>
        <p>{{ $t('extra') }}</p>
        <p>{{ $t('future') }}</p>
    </div>
</template>

<script>
export default {
    name: 'home',
    components: {},
    created() {
        // eslint-disable-next-line
        cheet('←', () => {
            this.$router.push('blog');
        });
        // eslint-disable-next-line
        cheet('→', () => {
            this.$router.push('blog');
        });
    },
};
</script>
