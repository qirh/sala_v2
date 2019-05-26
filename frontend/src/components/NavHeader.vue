<template>
    <div class="nav-header">
        <div class="nav-items" style="display: block">
            <router-link class="link" tag="li" to="/">
                <a>Home</a>
            </router-link>
            <router-link class="link" tag="li" to="/p">
                <a>Projects</a>
            </router-link>
            <router-link class="link" tag="li" to="/b">
                <a>Books</a>
            </router-link>
            <router-link class="link" tag="li" to="/r">
                <a>Reading</a>
            </router-link>
            <router-link class="link" tag="li" to="/w">
                <a>Writing</a>
            </router-link>
        </div>
        <hr />
        <div class="icons">
            <font-awesome-icon :icon="['fab', 'github']"></font-awesome-icon>
            <font-awesome-icon :icon="['fab', 'telegram']"></font-awesome-icon>
            <font-awesome-icon :icon="['fab', 'goodreads']"></font-awesome-icon>
            <font-awesome-icon :icon="['fa', 'blog']"></font-awesome-icon>
        </div>
        <hr />
        <div class="icons">
            <font-awesome-icon
                v-on:click="this.$parent.changeDarkState"
                :icon="sunIcon"
            >
            </font-awesome-icon>
        </div>
    </div>
</template>

<script>
export default {
    name: 'navheader',
    computed: {
        sunIcon() {
            if (this.$parent.darkMode) {
                return ['fas', 'sun'];
            } else {
                return ['far', 'sun'];
            }
        },
    },
};
</script>
<style scoped lang="scss">
@import '../assets/nav-header.scss';
@import '../assets/themes.scss';
@import '../assets/bidi.scss';
</style>
