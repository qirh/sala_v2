<script>
    import {icon as renderIcon, library} from '@fortawesome/fontawesome-svg-core';
    import {faGithub, faGoodreads, faLinkedin} from '@fortawesome/free-brands-svg-icons';
    import {faSmile} from '@fortawesome/free-regular-svg-icons';
    import {faBlog, faEnvelope, faFileAlt} from '@fortawesome/free-solid-svg-icons';

    library.add(
        faGithub,
        faLinkedin,
        faGoodreads,
        faEnvelope,
        faBlog,
        faSmile,
        faFileAlt,
    );

    export let icon;

    const iconDefinitions = {
        'fab:github': faGithub,
        'fab:linkedin': faLinkedin,
        'fab:goodreads': faGoodreads,
        'fas:envelope': faEnvelope,
        'fas:blog': faBlog,
        'fas:file-alt': faFileAlt,
        'far:smile': faSmile,
    };

    function resolveIcon(iconSpec) {
        if (Array.isArray(iconSpec)) {
            return iconDefinitions[`${iconSpec[0]}:${iconSpec[1]}`];
        }

        return iconSpec;
    }

    $: renderedIcon = renderIcon(resolveIcon(icon))?.html.join('') ?? '';
</script>

{@html renderedIcon}
