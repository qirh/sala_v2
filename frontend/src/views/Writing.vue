<template>
    <p>this is writing</p>
</template>

<script>
export default {
    name: 'writing',
    created() {
        // eslint-disable-next-line
        cheet('←', () => {
            this.$router.push('/r');
        });
        // eslint-disable-next-line
        cheet('→', () => {
            this.$router.push('/');
        });
    },
};
</script>
