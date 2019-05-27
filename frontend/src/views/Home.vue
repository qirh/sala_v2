<template>
    <div>
        <p class="home-header">{{ $t(textHead) }}</p>
        <p class="home-main">{{ $t(textMain) }}</p>
    </div>
</template>

<script>
export default {
    name: 'home',
    data: function() {
        return {
            textHead: 'hey',
            textMain: 'main',
        };
    },
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
