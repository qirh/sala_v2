@import url('https://fonts.googleapis.com/css?family=Rubik|Inconsolata')

<template>
    <div
        class="flip-prep cuerpo"
        :class="{
            'flip-actually': $store.state.flip,
            'right-to-left': $store.state.currentLang.direction === 'rtl',
        }"
    >
        <!-- <NavHeader class="links column"></NavHeader> -->
        <Home @updateLangFromHome="updateLangStuff"></Home>
    </div>
</template>

<script>
import {langs, defaultLangCode} from '@/consts';
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
        applySpecialFont: () => {
            if (!store.state.currentLang.specialFont) {
                return;
            }
            if (store.state.specialFontOn) {
                document.body.classList.add(
                    store.state.currentLang.specialFont,
                );
                document.body.classList.remove(store.state.currentLang.font);
            } else {
                document.body.classList.remove(
                    store.state.currentLang.specialFont,
                );
                document.body.classList.add(store.state.currentLang.font);
            }
        },
        changeFontToNewLanguage: (oldLangObject) => {
            if (store.state.specialFontOn) {
                document.body.classList.remove(oldLangObject.specialFont);
            } else {
                document.body.classList.remove(oldLangObject.font);
            }
            document.body.classList.add(store.state.currentLang.font);
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
        getLangObjectFromList(langCode) {
            const langObject = langs.find((lang) => lang.code === langCode);
            if (langObject) {
                return langObject;
            }
            return this.getLangObjectFromList(defaultLangCode);
        },
        getLangCodeOnInit: function() {
            if (!store.state.currentLang) {
                return this.getBrowserLang();
            }
            return store.state.currentLang.code;
        },
        updateLangStuff: function(langCode = null) {
            if (!langCode) {
                langCode = this.getLangCodeOnInit();
            }
            const oldLangObject = store.state.currentLang;
            const newLangObject = this.getLangObjectFromList(langCode);
            store.commit('changeLang', newLangObject);

            //change locale
            this.$i18n.locale = store.state.currentLang.code;

            //change html lang and dir
            document.documentElement.setAttribute(
                'lang',
                store.state.currentLang.code,
            );
            document.documentElement.setAttribute(
                'dir',
                store.state.currentLang.direction,
            );

            //change html title
            document.title = store.state.currentLang.title;

            //change fonts
            this.changeFontToNewLanguage(oldLangObject);
            store.commit('toggleSpecialFont', false);

            //change html icons
            let apple_link = document.querySelector(
                "link[rel*='apple-touch-icon']",
            );
            apple_link.href = `/assets/${
                store.state.currentLang.code
            }/icon-180x180.png`;

            let shortcut_link = document.querySelector(
                "link[rel*='shortcut icon']",
            );
            shortcut_link.href = `/assets/${
                store.state.currentLang.code
            }/icon-192x192.png`;
        },
    },
    created() {
        this.applyTheme();
        this.applySpecialFont();
        this.updateLangStuff();
        store.watch(() => {
            this.applyTheme();
            this.applySpecialFont();
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
            store.commit('toggleSpecialFont');
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
