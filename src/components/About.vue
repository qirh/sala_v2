<template>
    <a :href="gitLink">{{ gitHash }}</a>
</template>

<script>
export default {
    name: 'About',
    data: () => {
        return {
            gitHash: GIT_DESCRIBE.hash,
            gitLink:
                'https://github.com/qirh/sala_v2/commit/' + GIT_DESCRIBE.hash,
        };
    },
};
</script>
