<script>
    import {toggleTheme} from '$lib/stores/state.js';

    let {class: cls = ''} = $props();
</script>

<button type="button" class={`theme-toggle ${cls}`} aria-label="Toggle theme" onclick={toggleTheme}>
    <div class="toggle">
        <div id="subtoggle"></div>
    </div>
</button>
