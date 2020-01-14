<template>
    <div>
        <p class="home-header">{{ $t(textHead) }}</p>
        <div data-splitting>{{ $t(textHead) }}</div>
        <p class="home-main" v-html="$t(textMain)"></p>
    </div>
</template>

<script>
export default {
    name: 'home',
    data: () => {
        return {
            textHead: 'hey',
            textMain: 'main',
        };
    },
    created() {
        //eslint-disable-next-line
        /*
        cheet('←', () => {
            this.$router.push('w');
        });
        */
    },
};
</script>
