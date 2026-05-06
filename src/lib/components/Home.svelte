<script>
    import {_} from 'svelte-i18n';
    import {onMount} from 'svelte';
    import {state as appState} from '$lib/stores/state.js';
    import Icon from './Icon.svelte';
    import Icons from './Icons.svelte';
    import LangSwitcher from './LangSwitcher.svelte';
    import ThemeToggler from './ThemeToggler.svelte';

    const gitHash = GIT_DESCRIBE.hash;
    const gitLink = 'https://github.com/qirh/sala_v2/commit/' + gitHash;

    let buildTime = new Date().toISOString();
    let animationClass = '';
    let animationTimeout;
    let previousLangCode;

    $: currentLang = $appState.currentLang;
    $: localeCode = currentLang?.code ?? 'en';
    $: date = getDate(localeCode === 'ar' ? 'ar-EG' : localeCode);
    $: dateSpecial = localeCode === 'ar' ? getDate('ar-SA') : null;

    function getDate(locale) {
        return new Intl.DateTimeFormat(locale, {
            month: 'long',
            year: 'numeric',
        }).format(new Date(buildTime));
    }

    function animateLangChange(nextLang) {
        if (!nextLang || nextLang.code === previousLangCode) {
            return;
        }

        previousLangCode = nextLang.code;
        animationClass =
            nextLang.direction === 'ltr'
                ? 'section-anim-ltr'
                : 'section-anim-rtl';
        clearTimeout(animationTimeout);
        animationTimeout = setTimeout(() => {
            animationClass = '';
        }, 500);
    }

    onMount(() => {
        const htmlBuildTime =
            document.documentElement.dataset.buildTimestampUtc;
        if (htmlBuildTime) {
            buildTime = htmlBuildTime;
        }

        const unsubscribe = appState.subscribe((s) =>
            animateLangChange(s.currentLang),
        );

        return () => {
            clearTimeout(animationTimeout);
            unsubscribe();
        };
    });
</script>

<div class="grid">
    <div class="grid-langs-theme">
        <LangSwitcher class="grid-langs" />
        <ThemeToggler class="grid-theme" />
    </div>
    <div class="grid-icons">
        <Icons />
    </div>
    <div
        id="grid-main"
        class:right-to-left={currentLang?.direction === 'rtl'}
        class:section-anim-ltr={animationClass === 'section-anim-ltr'}
        class:section-anim-rtl={animationClass === 'section-anim-rtl'}
    >
        <div class="grid-title">
            <p class="main-title">{@html $_('title')}</p>
        </div>
        <div class="grid-paragraphs">
            <p>{$_('p1')}</p>
            <p>
                {$_('p2_before_smile')}<Icon icon={['far', 'smile']} />{$_('p2_after_smile')}
            </p>
            <p>{$_('p3')}</p>
            <p>{$_('p4')}</p>
            <p>{$_('p5')}</p>
        </div>
        <div class="grid-picture">
            <img
                class="picture"
                alt="Saleh in running gear"
                rel="preload"
                title={$_('pictureTitle')}
                src="/assets/moi.jpg"
            />
        </div>
    </div>
    <div class="grid-footer">
        <p>
            {$_('footerLastUpdated')}
            <a href={gitLink}
                >{date}{#if dateSpecial}~~{dateSpecial}{/if}</a
            >
        </p>
    </div>
</div>
