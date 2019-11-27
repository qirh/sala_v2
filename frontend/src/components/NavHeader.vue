<template>
    <div class="nav-header">
        <div class="nav-items" style="display: block">
            <router-link class="link" tag="li" to="/">
                <a>Home</a>
            </router-link>
        </div>
        <hr />
        <div class="icons">
            <a
                href="https://t.me/salghusson"
                target="_blank"
                rel="noopener noreferrer"
            >
                <font-awesome-icon
                    :icon="['fab', 'telegram']"
                ></font-awesome-icon>
            </a>
            <a
                href="https://github.com/qirh"
                target="_blank"
                rel="noopener noreferrer"
            >
                <font-awesome-icon
                    :icon="['fab', 'github']"
                ></font-awesome-icon>
            </a>
            <a
                href="https://www.goodreads.com/sal7"
                target="_blank"
                rel="noopener noreferrer"
                :title="$t('reading')"
            >
                <font-awesome-icon
                    :icon="['fab', 'goodreads']"
                ></font-awesome-icon>
            </a>
            <a
                href="https://saleh.soy"
                target="_blank"
                rel="noopener noreferrer"
                :title="$t('writing')"
            >
                <font-awesome-icon :icon="['fa', 'blog']"></font-awesome-icon>
            </a>
        </div>
        <br />
        <div class="icons">
            <div class="theme-toggle" v-on:click="$store.commit('toggleTheme')">
                <div class="toggle">
                    <div id="subtoggle" type="checkbox"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'navheader',
    data: () => {
        return {
            reading: 'reading',
            writing: 'writing',
        };
    },
};
</script>
<style scoped lang="scss">
@import '../assets/styles/navHeader.scss';
//@import '../assets/themes.scss';  delete this?
@import '../assets/styles/bidi.scss';
@import '../assets/styles/toggleTheme.scss';
</style>
