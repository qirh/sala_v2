<template>
    <p>this is projects</p>
</template>

<script>
export default {
    name: 'projects',
    components: {},
    created() {
        // eslint-disable-next-line
        cheet('←', () => {
            this.$router.push('/');
        });
        // eslint-disable-next-line
        cheet('→', () => {
            this.$router.push('/b');
        });
    },
};
</script>
