<template>
    <div class="nav-header">
        <div class="nav-items" v-if="langs.length">
            <div  v-for="lang in langs" v-bind:key="lang.code">
                <div
                    v-if="!lang.selected"
                    v-on:click="$store.commit('changeLang', lang.code)"
                    :title="lang.code"
                    class="langCode"
                >
                    {{ lang.name }}
                </div>
            </div>
        </div>

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
import store from '@/store';

export default {
    name: 'navheader',
    data: () => {
        return {
            reading: 'reading',
            writing: 'writing',
            langs: store.state.langs,
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
