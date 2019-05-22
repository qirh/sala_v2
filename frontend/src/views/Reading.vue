<template>
    <p>this is reading</p>
</template>

<script>
export default {
    name: 'reading',
    created() {
        // eslint-disable-next-line
        cheet('←', () => {
            this.$router.push('/b');
        });
        // eslint-disable-next-line
        cheet('→', () => {
            this.$router.push('/w');
        });
    },
};
</script>
