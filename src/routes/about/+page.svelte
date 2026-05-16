<script>
    const gitHash = GIT_DESCRIBE.hash;
    const gitLink = 'https://github.com/qirh/sala_v2/commit/' + gitHash;
</script>

<svelte:head>
    <title>about — Saleh Alghusson</title>
    <meta name="description" content="tiny about page — a back-link and the current git commit hash." />
    <meta property="og:title" content="about — Saleh Alghusson" />
    <meta property="og:description" content="tiny about page — a back-link and the current git commit hash." />
    <meta property="og:image" content="https://saleh.sh/assets/en/icon-512x512.png" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://saleh.sh/about" />
    <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div>
    <a style="position: absolute; top: 8px; left: 16px" href="/">
        &lt;-back
    </a>
    commit: <a href={gitLink}>{gitHash}</a>
</div>
