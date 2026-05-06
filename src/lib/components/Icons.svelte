<script>
    import {_} from 'svelte-i18n';
    import Icon from './Icon.svelte';
</script>

<div class="icons">
    <a
        href="mailto:saleh@alghusson.com"
        title="saleh@alghusson.com"
        class="icon"
    >
        <Icon icon={['fas', 'envelope']} />
    </a>
    <a
        href="https://github.com/qirh"
        rel="noopener noreferrer"
        class="icon"
        title={$_('github')}
    >
        <Icon icon={['fab', 'github']} />
    </a>
    <a
        href="https://linkedin.com/in/qirh"
        rel="noopener noreferrer"
        class="icon"
        title={$_('linkedin')}
    >
        <Icon icon={['fab', 'linkedin']} />
    </a>
    <a
        href="https://drive.google.com/file/d/1pGKRrs6UCesvZulALOYSpMilfb0njTHL/view?usp=sharing"
        rel="noopener noreferrer"
        class="icon"
        title={$_('resume')}
    >
        <Icon icon={['fas', 'file-alt']} />
    </a>
    <a
        href="https://www.goodreads.com/sal7"
        rel="noopener noreferrer"
        class="icon"
        title={$_('reading')}
    >
        <Icon icon={['fab', 'goodreads']} />
    </a>
    <a
        href="https://noiseless-flame-9a6.notion.site/Knowledge-Bar-58e31b613bf4493fa3ba3539e66ff8f2"
        rel="noopener noreferrer"
        class="icon"
        target="_blank"
        title={$_('notion')}
    >
        <img
            class="notion svg-inline--fa fa-w-16"
            alt=""
            src="/assets/notion_light.svg"
        />
    </a>
    <a
        class="icon"
        title={$_('recurse webring')}
        href="https://webring.recurse.com"
    >
        <img
            class="recurse svg-inline--fa"
            alt=""
            src="/assets/notion_light.svg"
        />
    </a>
</div>
