<template>
    <div
        class="help"
        :class="{
            shown: $store.state.showHelp,
        }"
        v-tooltip="{
            content: $t('helpTooltip'),
            classes: ['help-tooltip', 'info'],
            placement: 'right',
            offset: 10,
            delay: {
                show: 200,
                hide: 300,
            },
        }"
    >
        <font-awesome-icon
            :icon="['far', 'question-circle']"
            class="help-icon"
        ></font-awesome-icon>
    </div>
</template>

<script>
import store from '@/store';

export default {
    name: 'Help',
    mounted() {
        this.$mousetrap.bind('h e l p', this.toggleHelp);
        this.$mousetrap.bind(['م س ا ع د ه', 'م س ا ع د ة'], this.toggleHelp);
    },
    created() {
        this.logHelpMessage();
    },
    methods: {
        toggleHelp() {
            store.commit('toggleShowHelp');
            this.logHelpMessage();
        },
        logHelpMessage() {
            if (store.state.showHelp) {
                // eslint-disable-next-line
                console.log(
                    '%cyou can also type ' + '%cthe konami code',
                    'background: #222; color: #bada55',
                    'background: #333; color: #1954b8',
                );
            }
        },
    },
};
</script>
<style lang="scss">
@import '../assets/styles/help.scss';
</style>
