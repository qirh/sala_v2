<template>
    <div>
        <p class="home-header">{{ $t('hey') }}</p>
        <p class="home-main">{{ $t('main') }}</p>
    </div>
</template>

<script>
export default {
    name: 'home',
    created() {
        // eslint-disable-next-line
        cheet('←', () => {
            this.$router.push('w');
        });
        // eslint-disable-next-line
        cheet('→', () => {
            this.$router.push('p');
        });
    },
};
</script>
