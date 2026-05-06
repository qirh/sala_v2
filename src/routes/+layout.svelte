<script>
    import {goto} from '$app/navigation';
    import {onMount} from 'svelte';
    import {get} from 'svelte/store';
    import {getLangObjectFromCode, getNextLang, langs} from '$lib/consts.js';
    import {createKeybindingMatcher} from '$lib/keybindings.js';
    import {locale} from '$lib/i18n.js';
    import {
        changeLang,
        state as appState,
        switchFlipDirection,
        toggleFont,
        toggleTheme,
    } from '$lib/stores/state.js';

    import '../assets/styles/global.scss';
    import '../assets/styles/fonts.scss';
    import '../assets/styles/themes.scss';
    import '../assets/styles/bidi.scss';
    import '../assets/styles/home.scss';
    import '../assets/styles/LangSwitcher.scss';
    import '../assets/styles/themeToggler.scss';
    import '../assets/styles/icons.scss';

    let cuerpo;

    const keysSpecial = [
        'Tab',
        'CapsLock',
        'Shift',
        'Control',
        'Alt',
        'Meta',
        ' ',
        'Space',
        'Spacebar',
        'Backspace',
        'Enter',
    ];
    const allFontClasses = langs.flatMap((lang) => lang.fonts);

    function isSpaceKey(key) {
        return key === ' ' || key === 'Space' || key === 'Spacebar';
    }

    function flip() {
        if (!cuerpo) {
            return false;
        }

        const {flipDirection} = get(appState);
        cuerpo.classList.add(flipDirection ? 'flip-right' : 'flip-left');
        setTimeout(() => {
            cuerpo.classList.remove('flip-right');
            cuerpo.classList.remove('flip-left');
            switchFlipDirection();
        }, 750);
        return false;
    }

    function goToResume() {
        window.location.href = '/cv';
    }

    function goToAbout() {
        goto('/about');
    }

    function goToThirty() {
        goto('/30');
    }

    function goToNYCMarathon25() {
        goto('/nycmarathon25');
    }

    function applyTheme(theme) {
        document.body.classList.toggle('dark-theme', theme === 'dark');
        document.body.classList.toggle('light-theme', theme !== 'dark');
    }

    function applyFont(funFont, currentLang) {
        if (!currentLang) {
            return;
        }

        allFontClasses.forEach((fontClass) => {
            document.body.classList.remove(fontClass);
        });
        document.body.classList.add(
            funFont ? currentLang.fonts[1] : currentLang.fonts[0],
        );
    }

    function updateLangUI(currentLang) {
        if (!currentLang) {
            return;
        }

        locale.set(currentLang.code);
        document.documentElement.setAttribute('lang', currentLang.code);
        document.documentElement.setAttribute('dir', currentLang.direction);
        document.title = currentLang.title;

        document
            .querySelectorAll("link[rel='apple-touch-icon'][sizes]")
            .forEach((appleLink) => {
                appleLink.href = `/assets/${currentLang.code}/icon-${appleLink.sizes.value}.png`;
            });

        const shortcutLink = document.querySelector(
            "link[rel*='shortcut icon']",
        );
        if (shortcutLink) {
            shortcutLink.href = `/assets/${currentLang.code}/icon-192x192.png`;
        }
    }

    function getBrowserLang() {
        if (!navigator.languages) {
            return undefined;
        }

        for (const lang of navigator.languages) {
            const twoLetterChar = lang.substring(0, 2);
            const supportedLang = langs.find((l) => l.code === twoLetterChar);
            if (supportedLang) {
                return twoLetterChar;
            }
        }

        return undefined;
    }

    function getLangCodeOnInit() {
        const {currentLang} = get(appState);
        return currentLang ? currentLang.code : getBrowserLang();
    }

    function firstHelpMessage() {
        // eslint-disable-next-line no-console
        console.log(
            '%chello there! the website reacts to ' + '%chelp',
            'background: #222; color: #bada55',
            'color: #1569cf',
        );
    }

    function secondHelpMessage() {
        // eslint-disable-next-line no-console
        console.log(
            '%calso~~ ' +
                '%ckonami code' +
                '%c || ' +
                '%ct' +
                '%c || ' +
                '%cf' +
                '%c || ' +
                '%cspace bar',
            'background: #222; color: #bada55',
            'color: #831376',
            'background: #222; color: #bada55',
            'color: #88e49a',
            'background: #222; color: #bada55',
            'color: #e02988',
            'background: #222; color: #bada55',
            'color: #2ab30f',
        );
    }

    function handleKeyDown(event) {
        if (isSpaceKey(event.key)) {
            event.preventDefault();
            cycleLang();
            return;
        }

        if (keysSpecial.includes(event.key) || !cuerpo) {
            return;
        }

        cuerpo.classList.add('keydown');
        cuerpo.classList.add(`_${event.key}`);
    }

    function cycleLang() {
        const currentLangCode = get(appState).currentLang?.code ?? 'en';
        changeLang(getNextLang(currentLangCode));
    }

    function processKeyUp(key, matchKeybinding) {
        if (!keysSpecial.includes(key)) {
            matchKeybinding(key);
        }
    }

    function handleKeyUp(event, matchKeybinding) {
        try {
            cuerpo?.classList.remove('keydown');
            cuerpo?.classList.remove(`_${event.key}`);
        } catch {
            return;
        }

        processKeyUp(event.key, matchKeybinding);
    }

    onMount(() => {
        const matchKeybinding = createKeybindingMatcher({
            secondHelpMessage,
            goToResume,
            goToAbout,
            goToThirty,
            goToNYCMarathon25,
            toggleFont,
            toggleTheme,
            flip,
        });
        const keydown = (event) => handleKeyDown(event);
        const keyup = (event) => handleKeyUp(event, matchKeybinding);
        const unsubscribe = appState.subscribe((s) => {
            applyTheme(s.theme);
            updateLangUI(s.currentLang);
            applyFont(s.funFont, s.currentLang);
        });

        const keyBuffer = window.__salehKeyBuffer;
        if (keyBuffer) {
            window.removeEventListener('keyup', keyBuffer.capture, true);
            keyBuffer.pending.forEach((key) => processKeyUp(key, matchKeybinding));
            keyBuffer.pending.length = 0;
        }

        document.addEventListener('keydown', keydown);
        document.addEventListener('keyup', keyup);
        firstHelpMessage();

        const langObject = getLangObjectFromCode(getLangCodeOnInit());
        if (get(appState).currentLang?.code !== langObject.code) {
            changeLang(langObject);
        } else {
            updateLangUI(langObject);
            applyFont(get(appState).funFont, langObject);
        }

        return () => {
            unsubscribe();
            document.removeEventListener('keydown', keydown);
            document.removeEventListener('keyup', keyup);
        };
    });
</script>

<div id="cuerpo" class="flip-prep" bind:this={cuerpo}>
    <slot />
</div>
