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
        applyNewFont: (oldLangObject = undefined, oldIndex = undefined) => {
            if (!store.state.currentLang) {
                return;
            }
            if (oldLangObject != undefined && oldIndex != undefined) {
                document.body.classList.remove(oldLangObject.fonts[oldIndex]);
            } else if (oldLangObject == undefined && oldIndex != undefined) {
                document.body.classList.remove(
                    store.state.currentLang.fonts[oldIndex],
                );
            }
            document.body.classList.add(
                store.state.currentLang.fonts[store.state.fontIndex],
            );
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
            return undefined;
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
        updateLangStuff: function(langCode = undefined) {
            if (!langCode) {
                langCode = this.getLangCodeOnInit();
            }
            const oldLangObject = store.state.currentLang;
            const newLangObject = this.getLangObjectFromList(langCode);

            if (oldLangObject != newLangObject) {
                store.commit('changeLang', newLangObject);
            }
            //change locale
            this.$i18n.locale = newLangObject.code;

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

            // nothing in storage or new lang
            if (!oldLangObject || oldLangObject.code != newLangObject.code) {
                //change fonts
                const oldIndex = store.state.fontIndex;
                store.commit('changeFontIndex', 0);
                this.applyNewFont(oldLangObject, oldIndex);
            }
        },
    },
    created() {
        this.applyTheme();
        this.applyNewFont();
        this.updateLangStuff();

        store.watch(
            () => {
                return this.$store.state.theme; // could also put a Getter here
            },
            () => {
                this.applyTheme();
            },
        );

        store.watch(
            () => {
                return this.$store.state.fontIndex; // could also put a Getter here
            },
            (newValue, oldValue) => {
                this.applyNewFont(undefined, oldValue);
            },
        );

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
            const newFontIndex =
                (store.state.fontIndex + 1) %
                store.state.currentLang.fonts.length;
            store.commit('changeFontIndex', newFontIndex);
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
