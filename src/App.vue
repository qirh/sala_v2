@import url('https://fonts.googleapis.com/css?family=Rubik|Inconsolata')

<template>
    <div
        class="flip-prep cuerpo"
        :class="{
            'flip-actually': $store.state.flip,
        }"
    >
        <!-- <NavHeader class="links column"></NavHeader> -->
        <Home @updateLangFromHome="updateLangStuff"></Home>
    </div>
</template>

<script>
import {langs} from '@/consts';
import Home from '@/components/Home';
import store from '@/store';

export default {
    name: 'App',
    components: {
        Home,
    },
    methods: {
        applyTheme: () => {
            if (store.state.theme == 'dark') {
                document.body.classList.add('dark-theme');
                document.body.classList.remove('light-theme');
            } else {
                document.body.classList.remove('dark-theme');
                document.body.classList.add('light-theme');
            }
        },
        applyNPS: () => {
            if (store.state.npsFont) {
                document.body.classList.add('nps-font');
                document.body.classList.remove('regular-font');
            } else {
                document.body.classList.remove('nps-font');
                document.body.classList.add('regular-font');
            }
        },
        getBrowserLang: function() {
            if (navigator.languages) {
                for (let i = 0; i < navigator.languages.length; i++) {
                    const lang = navigator.languages[i];
                    let twoLetterChar = lang.substring(0, 2);
                    let supportedLang = langs.find(
                        (l) => l.code === twoLetterChar,
                    );
                    if (supportedLang) {
                        return twoLetterChar;
                    }
                }
            }
            return null;
        },
        getLangOnInit: function() {
            if (!store.state.currentLang) {
                let browserLang = this.getBrowserLang();
                if (!browserLang) {
                    browserLang = 'en'; //default language
                }
                return browserLang;
            }
            return store.state.currentLang;
        },
        updateLangStuff: function(langCode) {
            store.commit('changeLang', langCode);
            this.$i18n.locale = langCode;
            document.documentElement.setAttribute('lang', langCode);
        },
    },
    created() {
        this.applyTheme();
        this.applyNPS();
        const currentLang = this.getLangOnInit();
        this.updateLangStuff(currentLang);
        store.watch(() => {
            this.applyTheme();
            this.applyNPS();
        });
        // eslint-disable-next-line
        cheet('f', () => {
            store.commit('toggleFlip');
            setTimeout(() => store.commit('toggleFlip'), 750);
        });
        // eslint-disable-next-line
        cheet('t', () => {
            store.commit('toggleTheme');
        });
        // eslint-disable-next-line
        cheet('n', () => {
            store.commit('toggleNPS');
        });
    },
};
</script>

<style lang="scss">
@import 'assets/styles/global.scss';
@import 'assets/styles/fonts.scss';
@import 'assets/styles/themes.scss';
@import 'assets/styles/bidi.scss';
</style>
