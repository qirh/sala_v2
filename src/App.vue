<template>
    <div
        id="cuerpo"
        class="flip-prep"
        :class="{
            'flip-actually': $store.state.flip,
            'flip-left': $store.state.flipDirection === 'left',
            'flip-right': $store.state.flipDirection === 'right',
            'right-to-left': $store.state.currentLang.direction === 'rtl',
        }"
    >
        <!-- <NavHeader class="links column"></NavHeader> -->
        <Home @updateLangFromHome="updateLangStuff"></Home>
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
    mounted() {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    },
    methods: {
        handleKeyUp() {
            document.getElementById('cuerpo').classList.remove('keydown');
            document
                .getElementById('cuerpo')
                .classList.remove(`_${event.keyCode}`);
        },
        handleKeyDown() {
            const keysAssigned = [70, 78, 83, 84, 87];

            if (!keysAssigned.includes(event.keyCode)) {
                document.getElementById('cuerpo').classList.add('keydown');
                document
                    .getElementById('cuerpo')
                    .classList.add(`_${event.keyCode}`);
                return;
            }

            if (event.keyCode === 70) {
                // f
                store.commit('toggleFlip', true);
                setTimeout(() => store.commit('toggleFlip', false), 1000);
            } else if (event.keyCode === 84) {
                // t
                store.commit('toggleTheme');
            } else if (event.keyCode === 78) {
                // n
                const newFontIndex =
                    (store.state.fontIndex + 1) %
                    store.state.currentLang.fonts.length;
                store.commit('changeFontIndex', newFontIndex);
            } else if (event.keyCode === 87) {
                // w
                const lang = this.getPrevLang();
                this.updateLangStuff(lang.code);
            } else if (event.keyCode === 83) {
                // s
                const lang = this.getNextLang();
                this.updateLangStuff(lang.code);
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

            // if nothing in storage (new app) || lang is changed
            if (!oldLangObject || oldLangObject.code !== newLangObject.code) {
                //change fonts
                const oldIndex = store.state.fontIndex;
                store.commit('changeFontIndex', 0);
                this.applyNewFont(oldLangObject, oldIndex);

                // if lang is changed && direction is chnaged --> transition animation
                if (
                    oldLangObject &&
                    oldLangObject.direction !== newLangObject.direction
                ) {
                    let className = null;
                    if (newLangObject.direction === 'ltr') {
                        className = 'section-anim-ltr';
                    } else {
                        className = 'section-anim-rtl';
                    }
                    document.body.classList.add(className);
                    setTimeout(
                        () => document.body.classList.remove(className),
                        500,
                    );
                }
            }
        },
    },
    created() {
        // eslint-disable-next-line
        console.dir(GIT_DESCRIBE.hash);
        // eslint-disable-next-line
        console.log(`${this.buildTime}`);

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
