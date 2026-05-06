<script>
    import {toggleTheme} from '$lib/stores/state.js';
</script>

<button type="button" class="theme-toggle" aria-label="Toggle theme" onclick={toggleTheme}>
    <div class="toggle">
        <div id="subtoggle"></div>
    </div>
</button>
