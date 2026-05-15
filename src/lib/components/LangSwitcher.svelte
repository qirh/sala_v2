<script>
    import {getLangObjectFromCode, langs} from '$lib/consts.js';
    import {changeLang, state as appState} from '$lib/stores/state.js';

    let {class: cls = ''} = $props();

    function selectLang(langCode) {
        changeLang(getLangObjectFromCode(langCode));
    }
</script>

{#if langs.length}
    <ul class={`langs-list ${cls}`}>
        {#each langs as lang (lang.code)}
            <li>
                <button
                    type="button"
                    onclick={() => selectLang(lang.code)}
                    title={lang.code}
                    class="lang-item {lang.fonts[0]}"
                    class:selected-lang={$appState.currentLang?.code === lang.code}
                    disabled={$appState.currentLang?.code === lang.code}
                >
                    {lang.name}
                </button>
            </li>
        {/each}
    </ul>
{/if}
