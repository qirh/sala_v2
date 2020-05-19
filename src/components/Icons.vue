<template>
    <div>
        <div>
            <a
                href="https://t.me/salghusson"
                target="_blank"
                rel="noopener noreferrer"
            >
                <font-awesome-icon
                    :icon="['fab', 'telegram']"
                ></font-awesome-icon>
            </a>
            <a
                href="https://github.com/qirh"
                target="_blank"
                rel="noopener noreferrer"
            >
                <font-awesome-icon
                    :icon="['fab', 'github']"
                ></font-awesome-icon>
            </a>
            <a
                href="https://www.goodreads.com/sal7"
                target="_blank"
                rel="noopener noreferrer"
                :title="$t('reading')"
            >
                <font-awesome-icon
                    :icon="['fab', 'goodreads']"
                ></font-awesome-icon>
            </a>
            <a
                href="https://saleh.soy"
                target="_blank"
                rel="noopener noreferrer"
                :title="$t('writing')"
            >
                <font-awesome-icon :icon="['fa', 'blog']"></font-awesome-icon>
            </a>
        </div>
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
