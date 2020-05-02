<template>
    <div>
        <p class="home-header">{{ $t(textHead) }}</p>
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
};
</script>
