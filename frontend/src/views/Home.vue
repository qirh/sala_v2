<template>
    <div>
        <p class="cabeza">{{ $t('hey') }}</p>
        <p>{{ $t('me') }}</p>
        <p>{{ $t('work') }}</p>
    </div>
</template>

<script>
export default {
    name: 'home',
    components: {},
};
</script>
<style scoped>
.cabeza {
    font-weight: bold;
}
</style>
