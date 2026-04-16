<template>
    <div id="cuerpo" class="flip-prep">
        <Home :buildTime="buildTime" :gitHash="gitHash"></Home>
    </div>
</template>

<script>
import Home from '@/components/Home';

export default {
    name: 'App',
    components: {
        Home,
    },
    data: () => {
        return {
            gitHash: GIT_DESCRIBE.hash,
        };
    },
    computed: {
        buildTime: {
            get: function () {
                return document.documentElement.dataset.buildTimestampUtc;
            },
        },
    },
};
</script>

<style lang="scss">
@import 'assets/styles/global.scss';
@import 'assets/styles/fonts.scss';
@import 'assets/styles/themes.scss';
@import 'assets/styles/bidi.scss';
</style>
