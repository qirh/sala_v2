<template>
    <div class="nav-header">
        <div class="nav-items" style="display: block">
            <router-link class="link" tag="li" to="/">
                <a>Home</a>
            </router-link>
            <router-link class="link" tag="li" to="/blog">
                <a>Blog</a>
            </router-link>
        </div>
        <!-- // eslint-disable-next-line -->
        <hr>
        <!-- add languages here -->
    </div>
</template>

<script>
export default {
    name: 'navheader',
    components: {},
};
</script>
<style scoped lang="scss">
@import '../assets/nav-header.scss';
@import '../assets/themes.scss';
@import '../assets/bidi.scss';
</style>
