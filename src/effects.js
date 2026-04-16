import store from './store';
import {langs, getLangObjectFromCode} from './consts';

function applyTheme() {
    if (store.state.theme == 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    }
}

function applyFont(oldLangObject) {
    if (!store.state.currentLang) {
        return;
    }
    if (oldLangObject != undefined) {
        document.body.classList.remove(
            store.state.funFont
                ? oldLangObject.fonts[1]
                : oldLangObject.fonts[0],
        );
    } else {
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
}

function updateLangUI(i18n) {
    const code = store.state.currentLang.code;
    i18n.global.locale = code;
    document.documentElement.setAttribute('lang', code);
    document.title = store.state.currentLang.title;

    document
        .querySelectorAll("link[rel='apple-touch-icon'][sizes]")
        .forEach((link) => {
            // eslint-disable-next-line
            link.href = `/assets/${code}/icon-${link.sizes.value}.png`;
        });
    const shortcut = document.querySelector("link[rel*='shortcut icon']");
    if (shortcut) {
        // eslint-disable-next-line
        shortcut.href = `/assets/${code}/icon-192x192.png`;
    }
}

function getBrowserLang() {
    if (navigator.languages) {
        for (const lang of navigator.languages) {
            const code = lang.substring(0, 2);
            if (langs.find((l) => l.code === code)) return code;
        }
    }
    return undefined;
}

export function installEffects(i18n) {
    store.watch(
        (state) => state.theme,
        () => applyTheme(),
    );
    store.watch(
        (state) => state.funFont,
        () => applyFont(),
    );
    store.watch(
        (state) => state.currentLang,
        (newValue, oldValue) => {
            updateLangUI(i18n);
            applyFont(oldValue);
        },
    );

    // initial apply
    applyTheme();
    applyFont();

    // lang init: pick up persisted lang or fall back to browser
    const langCode = store.state.currentLang
        ? store.state.currentLang.code
        : getBrowserLang();
    const langObject = getLangObjectFromCode(langCode);
    if (store.state.currentLang !== langObject) {
        store.commit('changeLang', langObject);
    } else {
        updateLangUI(i18n);
    }
}
