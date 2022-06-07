<template>
    <div>
        <a
            style="position: absolute; top: 8px; left: 16px"
            href="javascript:history.back()"
        >
            &lt;-back
        </a>
        <h4>Soft invite (weather and mood pending)</h4>
        <img
            class="rotate"
            width="200px"
            height="auto"
            rel="preload"
            src="/assets/moi_30.jpg"
        />

        <br />
        Welcome to birthday festivities expectacular. The plan is to bike
        <b>30</b>! loops around prospect park (the big loop not the small one).
        <br />
        Feel free to join the misery by doing part or all of it. Also feel free
        to bring me foods and other nourishment items or just show up. 0
        pressure.

        <h4>
            Where?
            <a
                style="display: inline"
                href="https://www.openstreetmap.org/#map=15/40.6619/-73.9708"
                >Prospect park</a
            >
        </h4>
        (i don't know where exactly yet, we'll decide when the date is closer)
        <h4>When?</h4>
        june 26 2022
        <h4>Why?</h4>
        1992 + (-2022) = 30
        <h4>More info?</h4>
        text me a few days before
    </div>
</template>

<script>
export default {
    name: 'Thirty',
};
</script>
<style scoped lang="scss">
.rotate {
    animation: rotation 8s infinite linear;
}

@keyframes rotation {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(359deg);
    }
}
</style>
