#!/bin/sh
# Compare HTTP-level behavior between two saleh.sh deployments.
# Catches regressions in routing, redirects, and static text resources
# (sitemap.xml, robots.txt) that the Playwright suite doesn't cover.
#
# Usage:
#   scripts/parity_test.sh [<base-a>] [<base-b>]
#
# Defaults:
#   base-a = https://saleh.sh           (production)
#   base-b = $PREVIEW_URL env var       (override or pass as arg)
#
# Exit codes:
#   0 — all paths match between base-a and base-b
#   1 — at least one mismatch
#   2 — usage error
#
# What it compares per path:
#   - HTTP status code
#   - Location header (for 3xx redirects)
#   - Content-Type header
#   - Byte-for-byte content (only for /sitemap.xml and /robots.txt;
#     HTML content is intentionally NOT diffed because build hashes
#     and FontAwesome SVG markup make that noisy)

set -eu

A="${1:-https://saleh.sh}"
B="${2:-${PREVIEW_URL:-}}"

if [ -z "$B" ]; then
    cat >&2 <<EOF
error: no second URL given. Pass it as the second argument or set PREVIEW_URL.
Usage: $0 [<base-a>] [<base-b>]
EOF
    exit 2
fi

# Strip trailing slash so $URL$PATH always works.
A="${A%/}"
B="${B%/}"

PATHS="
/
/about
/30
/nycmarathon24
/nycmarathon25
/bday25
/cv
/resume
/spiderman
/spider-man
/address
/sunnyside
/blog
/posts
/sitemap.xml
/robots.txt
/nonexistent-path-shouldnt-exist
"

CONTENT_DIFF_PATHS="
/sitemap.xml
/robots.txt
"

green() { printf '\033[32m%s\033[0m' "$1"; }
red()   { printf '\033[31m%s\033[0m' "$1"; }
dim()   { printf '\033[2m%s\033[0m'  "$1"; }

# Fetch with -I (HEAD) once, parse status + location + content-type.
fetch_meta() {
    url="$1"
    # Use GET with -o /dev/null so we follow no redirects but still see them.
    curl -sI --max-time 15 -o /dev/null \
        -w "%{http_code}|%{redirect_url}|%{content_type}\n" \
        "$url"
}

# Fetch body for byte-diff paths.
fetch_body() {
    url="$1"
    curl -sL --max-time 15 "$url"
}

fail=0
total=0
matched=0

for p in $PATHS; do
    total=$((total + 1))
    meta_a=$(fetch_meta "$A$p")
    meta_b=$(fetch_meta "$B$p")

    status_a=$(printf '%s' "$meta_a" | cut -d'|' -f1)
    status_b=$(printf '%s' "$meta_b" | cut -d'|' -f1)
    loc_a=$(printf '%s' "$meta_a" | cut -d'|' -f2)
    loc_b=$(printf '%s' "$meta_b" | cut -d'|' -f2)
    ct_a=$(printf '%s' "$meta_a" | cut -d'|' -f3)
    ct_b=$(printf '%s' "$meta_b" | cut -d'|' -f3)

    mismatch=""
    [ "$status_a" = "$status_b" ] || mismatch="${mismatch}status "
    [ "$loc_a" = "$loc_b" ] || mismatch="${mismatch}location "

    # Content-Type can drift between Netlify versions; only flag when
    # the major part (before ';') differs.
    ct_a_major=$(printf '%s' "$ct_a" | cut -d';' -f1 | tr -d ' ')
    ct_b_major=$(printf '%s' "$ct_b" | cut -d';' -f1 | tr -d ' ')
    [ "$ct_a_major" = "$ct_b_major" ] || mismatch="${mismatch}content-type "

    # Optional byte-for-byte body diff for known-stable paths.
    if echo "$CONTENT_DIFF_PATHS" | grep -qx "$p"; then
        body_a=$(fetch_body "$A$p")
        body_b=$(fetch_body "$B$p")
        if [ "$body_a" != "$body_b" ]; then
            mismatch="${mismatch}body "
        fi
    fi

    printf '  %-35s ' "$p"
    if [ -n "$mismatch" ]; then
        red "MISMATCH"
        printf '  '
        dim "($mismatch)"
        printf '\n'
        printf '    a: status=%s  location=%s  content-type=%s\n' \
            "$status_a" "$loc_a" "$ct_a"
        printf '    b: status=%s  location=%s  content-type=%s\n' \
            "$status_b" "$loc_b" "$ct_b"
        fail=$((fail + 1))
    else
        green "OK"
        printf '  '
        dim "($status_a)"
        printf '\n'
        matched=$((matched + 1))
    fi
done

printf '\n'
printf 'a: %s\n' "$A"
printf 'b: %s\n' "$B"
printf '\n'
if [ "$fail" -gt 0 ]; then
    red "FAIL"
    printf ': %d/%d mismatches\n' "$fail" "$total"
    exit 1
fi
green "PASS"
printf ': %d/%d paths match\n' "$matched" "$total"
