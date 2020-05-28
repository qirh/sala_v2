<template>
    <div id="cuerpo" class="flip-prep">
        <Home
            :buildTime="buildTime"
            :gitHash="gitHash"
            @updateLangFromHome="updateLangStuff"
        ></Home>
    </div>
</template>

<script>
import {langs, defaultLangCode, mod} from '@/consts';
import Home from '@/components/Home';
import store from '@/store';

export default {
    name: 'App',
    components: {
        Home,
    },
    methods: {
        handleKeyUp() {
            try {
                document.getElementById('cuerpo').classList.remove('keydown');
                document
                    .getElementById('cuerpo')
                    .classList.remove(`_${event.key}`);
            } catch (error) {
                return;
            }
        },
        handleKeyDown() {
            const keysAssigned = ['f', 'F', 't', 'T', 'n', 'N'];
            const keysSpecial = [
                'Tab',
                'CapsLock',
                'Shift',
                'Control',
                'Alt',
                'Meta',
                ' ',
                'Backspace',
                'Enter',
            ]; // these keys don't produce animations
            const cuerpo = document.getElementById('cuerpo');
            if (
                !keysAssigned.includes(event.key) &&
                !keysSpecial.includes(event.key)
            ) {
                cuerpo.classList.add('keydown');
                cuerpo.classList.add(`_${event.key}`);
                return;
            }
            if (event.key === 'f' || event.key === 'F') {
                if (store.state.flipDirection) {
                    cuerpo.classList.add('flip-right');
                } else {
                    cuerpo.classList.add('flip-left');
                }
                setTimeout(() => {
                    cuerpo.classList.remove('flip-right');
                    cuerpo.classList.remove('flip-left');
                    store.commit('switchFlipDirection');
                }, 750);
            } else if (event.key === 't' || event.key === 'T') {
                store.commit('toggleTheme');
            } else if (event.key === 'n' || event.key === 'N') {
                const newFontIndex =
                    (store.state.fontIndex + 1) %
                    store.state.currentLang.fonts.length;
                store.commit('changeFontIndex', newFontIndex);
            } else if (event.key === ' ') {
                event.preventDefault();
                const nextLang = this.getNextLang();
                this.updateLangStuff(nextLang.code);
            }
        },
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
        getLangObjectFromCode(langCode) {
            const langObject = langs.find((lang) => lang.code === langCode);
            if (langObject) {
                return langObject;
            }
            return this.getLangObjectFromCode(defaultLangCode);
        },
        getNextLang() {
            const langObjectFromList = (lang) =>
                lang.code === store.state.currentLang.code;
            const index = langs.findIndex(langObjectFromList);
            return langs[mod(index + 1, langs.length)];
        },
        getPrevLang() {
            const langObjectFromList = (lang) =>
                lang.code === store.state.currentLang.code;
            const index = langs.findIndex(langObjectFromList);
            return langs[mod(index - 1, langs.length)];
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
            const newLangObject = this.getLangObjectFromCode(langCode);

            if (oldLangObject != newLangObject) {
                store.commit('changeLang', newLangObject);
            }
            // change locale
            this.$i18n.locale = newLangObject.code;

            // change html lang
            document.documentElement.setAttribute(
                'lang',
                store.state.currentLang.code,
            );

            // change html title
            document.title = store.state.currentLang.title;

            // change html icons
            let appleLinks = document.querySelectorAll(
                "link[rel='apple-touch-icon'][sizes]",
            );
            appleLinks.forEach((appleLink) => {
                // eslint-disable-next-line
                appleLink.href = `/assets/${store.state.currentLang.code}/icon-${appleLink.sizes.value}.png`;
            });

            let shortcut_link = document.querySelector(
                "link[rel*='shortcut icon']",
            );
            // eslint-disable-next-line
            shortcut_link.href = `/assets/${store.state.currentLang.code}/icon-192x192.png`;

            // if nothing in storage (new app) || lang is changed
            if (!oldLangObject || oldLangObject.code !== newLangObject.code) {
                //change fonts
                const oldIndex = store.state.fontIndex;
                store.commit('changeFontIndex', 0);
                this.applyNewFont(oldLangObject, oldIndex);

                // change dir and animation if necessary
                if (
                    oldLangObject &&
                    oldLangObject.direction !== newLangObject.direction
                ) {
                    const gridMain = document.getElementById('grid-main');
                    let animationClass = null;
                    if (newLangObject.direction === 'ltr') {
                        animationClass = 'section-anim-ltr';
                        gridMain.classList.remove('right-to-left');
                    } else {
                        animationClass = 'section-anim-rtl';
                        gridMain.classList.add('right-to-left');
                    }
                    gridMain.classList.add(animationClass);
                    setTimeout(
                        () => gridMain.classList.remove(animationClass),
                        500,
                    );
                }
            }
        },
    },
    data: () => {
        return {
            gitHash: GIT_DESCRIBE.hash,
        };
    },
    mounted() {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    },
    created() {
        this.applyTheme();
        this.applyNewFont();
        this.updateLangStuff();

        store.watch(
            () => {
                return this.$store.state.theme;
            },
            () => {
                this.applyTheme();
            },
        );

        store.watch(
            () => {
                return this.$store.state.fontIndex;
            },
            (newValue, oldValue) => {
                this.applyNewFont(undefined, oldValue);
            },
        );
    },
    computed: {
        buildTime: {
            get: function() {
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
