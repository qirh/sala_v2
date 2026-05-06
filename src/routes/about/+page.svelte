<script>
    const gitHash = GIT_DESCRIBE.hash;
    const gitLink = 'https://github.com/qirh/sala_v2/commit/' + gitHash;
</script>

<div>
    <a style="position: absolute; top: 8px; left: 16px" href="/">
        &lt;-back
    </a>
    commit: <a href={gitLink}>{gitHash}</a>
</div>
