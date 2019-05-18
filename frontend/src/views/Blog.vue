<template>
    <p>this is blog</p>
</template>

<script>
export default {
    name: 'blog',
    components: {},
    created() {
        // eslint-disable-next-line
        cheet('←', () => {
            this.$router.push('/');
        });
        // eslint-disable-next-line
        cheet('→', () => {
            this.$router.push('/');
        });
    },
};
</script>
