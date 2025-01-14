<template>
    <div class="icons">
        <a
            href="mailto:saleh@alghusson.com"
            title="saleh@alghusson.com"
            class="icon"
        >
            <font-awesome-icon :icon="['fa', 'envelope']"></font-awesome-icon>
        </a>
        <a
            href="https://github.com/qirh"
            rel="noopener noreferrer"
            class="icon"
            :title="$t('github')"
        >
            <font-awesome-icon :icon="['fab', 'github']"></font-awesome-icon>
        </a>
        <a
            href="https://linkedin.com/in/qirh"
            rel="noopener noreferrer"
            class="icon"
            :title="$t('linkedin')"
        >
            <font-awesome-icon :icon="['fab', 'linkedin']"></font-awesome-icon>
        </a>
        <a
            href="https://drive.google.com/file/d/1pGKRrs6UCesvZulALOYSpMilfb0njTHL/view?usp=sharing"
            rel="noopener noreferrer"
            class="icon"
            :title="$t('resume')"
        >
            <font-awesome-icon :icon="['fa', 'file-alt']"></font-awesome-icon>
        </a>
        <a
            href="https://www.goodreads.com/sal7"
            rel="noopener noreferrer"
            class="icon"
            :title="$t('reading')"
        >
            <font-awesome-icon :icon="['fab', 'goodreads']"></font-awesome-icon>
        </a>
        <a
            href="https://noiseless-flame-9a6.notion.site/Knowledge-Bar-58e31b613bf4493fa3ba3539e66ff8f2"
            rel="noopener noreferrer"
            class="icon"
            target="_blank"
            :title="$t('notion')"
        >
            <img class="notion svg-inline--fa fa-w-16" src="/assets/notion_light.svg">
        </a>
        <a class="icon" href='https://webring.recurse.com'>
            <img class="recurse svg-inline--fa" src="/assets/notion_light.svg"/>
        </a>

    </div>
</template>

<script>
export default {
    name: 'Icons',
    data: () => {
        return {
            reading: 'reading',
            writing: 'writing',
        };
    },
};
</script>
<style scoped lang="scss">
@import '../assets/styles/icons.scss';
</style>
