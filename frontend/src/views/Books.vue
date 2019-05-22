<template>
    <p>this is books</p>
</template>

<script>
export default {
    name: 'books',
    created() {
        // eslint-disable-next-line
        cheet('←', () => {
            this.$router.push('/p');
        });
        // eslint-disable-next-line
        cheet('→', () => {
            this.$router.push('/r');
        });
    },
};
</script>
