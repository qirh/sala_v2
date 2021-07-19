<template>
    <div>
        <a style="position: absolute;top: 8px;left: 16px;" href="javascript:history.back()">&lt;-back</a>
        <br>
        commit: <a :href="gitLink">{{ gitHash }}</a>
    </div>
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
