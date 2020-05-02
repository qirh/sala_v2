<template>
    <div>
        <div>
            <p class="home-title">{{ $t(homeTitle) }}</p>
            <p>{{ $t(homeSubtitle) }}</p>
        </div>
        <Corner></Corner>
    </div>
</template>

<script>
import Corner from '@/components/Corner';

export default {
    name: 'home',
    components: {
        Corner,
    },
    data: () => {
        return {
            homeTitle: 'homeTitle',
            homeSubtitle: 'homeSubtitle',
        };
    },
};
</script>
