<template>
    <div id="cuerpo" class="flip-prep">
        <Home :buildTime="buildTime" :gitHash="gitHash"></Home>
    </div>
</template>

<script>
import {langs, getLangObjectFromCode, getNextLang} from '@/consts';
import Home from '@/components/Home';
import store from '@/store';

export default {
    name: 'App',
    components: {
        Home,
    },
    methods: {
        flip() {
            const cuerpo = document.getElementById('cuerpo');
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
            return false;
        },
        changeFont() {
            store.commit('toggleFont');
        },
        changeTheme() {
            store.commit('toggleTheme');
        },

        handleKeyUp() {
            if (event.key === ' ') {
                const nextLang = getNextLang(store.state.currentLang.code);
                store.commit('changeLang', nextLang);
            }
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
            if (!keysSpecial.includes(event.key)) {
                cuerpo.classList.add('keydown');
                cuerpo.classList.add(`_${event.key}`);
                return;
            }
            if (event.key === ' ') {
                event.preventDefault();
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
        applyFont: (oldLangObject = undefined) => {
            if (!store.state.currentLang) {
                return;
            }
            // if new language --> remove old language font
            if (oldLangObject != undefined) {
                document.body.classList.remove(
                    store.state.funFont
                        ? oldLangObject.fonts[1]
                        : oldLangObject.fonts[0],
                );
            } // if same language --> remove previous font
            else if (oldLangObject == undefined) {
                document.body.classList.remove(
                    store.state.funFont
                        ? store.state.currentLang.fonts[0]
                        : store.state.currentLang.fonts[1],
                );
            }
            document.body.classList.add(
                store.state.funFont
                    ? store.state.currentLang.fonts[1]
                    : store.state.currentLang.fonts[0],
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
        getLangCodeOnInit: function() {
            if (!store.state.currentLang) {
                return this.getBrowserLang();
            }
            return store.state.currentLang.code;
        },
        updateLangUI: function() {
            // change locale
            this.$i18n.locale = store.state.currentLang.code;

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
        },
        firstHelpMessage() {
            // eslint-disable-next-line
            console.log(
                '%chello there! the website reacts to ' + '%chelp',
                'background: #222; color: #bada55',
                'background: #333; color: #1954b8',
            );
        },
        secondHelpMessage() {
            // eslint-disable-next-line
            console.log(
                '%calso~~ ' +
                    '%ckonami code' +
                    '%c || ' +
                    '%ctheme' +
                    '%c || ' +
                    '%cfont' +
                    '%c || ' +
                    '%cspace bar',
                'background: #222; color: #bada55',
                'background: #333; color: #1954b8',
                'background: #222; color: #bada55',
                'background: #333; color: #1954b8',
                'background: #222; color: #bada55',
                'background: #333; color: #1954b8',
                'background: #222; color: #bada55',
                'background: #333; color: #1954b8',
            );
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
        this.$mousetrap.bind('h e l p', this.secondHelpMessage);
        this.$mousetrap.bind(
            ['م س ا ع د ه', 'م س ا ع د ة'],
            this.secondHelpMessage,
        );
        this.$mousetrap.bind('f o n t', this.changeFont);
        this.$mousetrap.bind('خ ط', this.changeFont);
        this.$mousetrap.bind('t h e m e', this.changeTheme);
        this.$mousetrap.bind('ل و ن', this.changeTheme);
        this.$mousetrap.bind(
            [
                'up up down down left right left right b a',
                'i d d q d',
                'up up down down left right left right ز ش',
            ],
            this.flip,
        );
        this.firstHelpMessage();
        this.applyTheme();
        this.applyFont();

        const langCode = this.getLangCodeOnInit();
        const LangObject = getLangObjectFromCode(langCode);
        if (this.$store.state.currentLang != LangObject) {
            store.commit('changeLang', LangObject);
        } else {
            this.updateLangUI();
        }
    },
    created() {
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
                return this.$store.state.funFont;
            },
            () => {
                this.applyFont();
            },
        );
        store.watch(
            () => {
                return this.$store.state.currentLang;
            },
            (newValue, oldValue) => {
                this.updateLangUI(oldValue);
                this.applyFont(oldValue);
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
