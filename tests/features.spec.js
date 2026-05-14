import {expect, test} from '@playwright/test';

test('language switcher: click AR flips to RTL + Arabic', async ({page}) => {
    await page.goto('/');
    await expect(page.locator('.lang-item.selected-lang')).toHaveText(
        'English',
    );
    await page.locator('.lang-item').filter({hasText: 'عربي'}).click();

    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page).toHaveTitle('صالح الغصون');
    await expect(page.locator('#grid-main')).toHaveClass(/right-to-left/);
    await expect(page.locator('body')).toHaveClass(/font-amiri/);
    await expect(page.locator('.grid-paragraphs p').first()).toContainText(
        'أنا من السعودية',
    );
});

test('language switch triggers slide animation on #grid-main', async ({
    page,
}) => {
    await page.goto('/');
    await page.locator('.lang-item').filter({hasText: 'عربي'}).click();
    // animation class lives on #grid-main for ~500ms
    await expect(page.locator('#grid-main')).toHaveClass(/section-anim-rtl/);
    const animName = await page.evaluate(
        () => getComputedStyle(document.getElementById('grid-main')).animationName,
    );
    expect(animName).toBe('sectionAnimRTL');
});

test('space bar cycles language', async ({page}) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await page.keyboard.press('Space');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await page.keyboard.press('Space');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('t toggles theme on home', async ({page}) => {
    await page.goto('/');
    await expect(page.locator('body')).toHaveClass(/light-theme/);
    await page.keyboard.press('t');
    await expect(page.locator('body')).toHaveClass(/dark-theme/);
    await page.keyboard.press('t');
    await expect(page.locator('body')).toHaveClass(/light-theme/);
});

test('t toggles theme on sub-pages (regression: shortcuts must be global)', async ({
    page,
}) => {
    await page.goto('/');
    await expect(page.locator('body')).toHaveClass(/light-theme/);
    // client-side nav via the 'a b o u t' chord (what a real user does)
    for (const k of ['a', 'b', 'o', 'u', 't']) {
        await page.keyboard.press(k);
    }
    await expect(page).toHaveURL('/about');
    // toggle theme and assert it flips from whatever state it's in
    const before = await page.evaluate(() =>
        document.body.classList.contains('dark-theme') ? 'dark' : 'light',
    );
    await page.keyboard.press('y');
    await page.keyboard.press('t');
    await page.waitForFunction((before) => {
        const isDark = document.body.classList.contains('dark-theme');
        return (before === 'light' && isDark) || (before === 'dark' && !isDark);
    }, before);
});

test('f toggles font on home', async ({page}) => {
    await page.goto('/');
    await expect(page.locator('body')).toHaveClass(/font-rubik/);
    await page.keyboard.press('f');
    await expect(page.locator('body')).toHaveClass(/font-ibm/);
    await page.keyboard.press('f');
    await expect(page.locator('body')).toHaveClass(/font-rubik/);
});

test('"a b o u t" chord navigates to /about', async ({page}) => {
    await page.goto('/');
    for (const k of ['a', 'b', 'o', 'u', 't']) {
        await page.keyboard.press(k);
    }
    await expect(page).toHaveURL('/about');
});

test('"3 0" chord navigates to /30', async ({page}) => {
    await page.goto('/');
    await page.keyboard.press('3');
    await page.keyboard.press('0');
    await expect(page).toHaveURL('/30');
});

test('"2 5" chord navigates to /nycmarathon25', async ({page}) => {
    await page.goto('/');
    await page.keyboard.press('2');
    await page.keyboard.press('5');
    await expect(page).toHaveURL('/nycmarathon25');
});

test('persisted state: theme survives reload', async ({page}) => {
    await page.goto('/');
    await page.keyboard.press('t');
    await expect(page.locator('body')).toHaveClass(/dark-theme/);

    const persisted = await page.evaluate(() =>
        localStorage.getItem('~~saleh~~-1.6'),
    );
    expect(persisted).toContain('"theme":"dark"');

    await page.reload();
    await expect(page.locator('body')).toHaveClass(/dark-theme/);
});

test('lang change on sub-pages does not throw', async ({page}) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
        if (m.type() === 'error') errors.push(m.text());
    });
    await page.goto('/');
    for (const k of ['a', 'b', 'o', 'u', 't']) {
        await page.keyboard.press(k);
    }
    await expect(page).toHaveURL('/about');
    await page.keyboard.press('Space');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    expect(errors).toEqual([]);
});

test('persisted state: language survives reload', async ({page}) => {
    await page.goto('/');
    await page.locator('.lang-item').filter({hasText: 'عربي'}).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('#grid-main')).toHaveClass(/right-to-left/);

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page).toHaveTitle('صالح الغصون');
    await expect(page.locator('body')).toHaveClass(/font-amiri/);
    await expect(page.locator('#grid-main')).toHaveClass(/right-to-left/);
});

// --- Konami code -----------------------------------------------------------
// Mousetrap-bound to `flip()` (App.vue), which toggles `.flip-left` /
// `.flip-right` on `#cuerpo` for 750ms. The animation is one of the site's
// distinctive bits — easy to silently regress.
test('Konami code triggers flip animation on #cuerpo', async ({page}) => {
    await page.goto('/');
    const konami = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'b', 'a',
    ];
    for (const key of konami) await page.keyboard.press(key);
    await expect(page.locator('#cuerpo')).toHaveClass(/flip-(left|right)/, {
        timeout: 1000,
    });
});

// --- `c v` chord → /cv → Drive --------------------------------------------
// goToResume() does `window.location.href = '/cv'` (full nav so Netlify can
// intercept). In dev/test there's no Netlify, but the chord still causes the
// browser to navigate to /cv — we assert on that request.
test('"c v" chord initiates navigation to /cv', async ({page}) => {
    await page.goto('/');
    const reqPromise = page.waitForRequest(
        (r) => r.url().endsWith('/cv'),
        {timeout: 2000},
    );
    await page.keyboard.press('c');
    await page.keyboard.press('v');
    await reqPromise; // throws if no /cv request happens
});

// --- help chord -----------------------------------------------------------
// secondHelpMessage() console.logs the keyboard-shortcut hints. This is the
// only discoverability for the shortcuts; if it stops firing nobody notices.
test('"h e l p" chord logs the help message', async ({page}) => {
    const logs = [];
    page.on('console', (m) => {
        if (m.type() === 'log') logs.push(m.text());
    });
    await page.goto('/');
    // Wait a beat for firstHelpMessage on mount to settle, then snapshot count.
    await page.waitForTimeout(200);
    const before = logs.length;
    for (const k of ['h', 'e', 'l', 'p']) await page.keyboard.press(k);
    await expect
        .poll(() => logs.length, {timeout: 1000})
        .toBeGreaterThan(before);
    // The actual message contains "konami code" — pretty stable string.
    expect(logs.slice(before).some((l) => /konami code/i.test(l))).toBe(true);
});

// --- Arabic chords --------------------------------------------------------
// Same shortcuts as their ASCII equivalents but bound to Arabic letters.
// Mousetrap (Vue 2 today) binds on `keypress` and matches against the char.
// Playwright's `keyboard.press('خ')` doesn't always produce a keypress with
// charCode 1582 in chromium without a matching keyboard layout, so we
// dispatch a synthetic keypress event from JS instead. The SvelteKit rewrite
// (#84) uses a custom sequence matcher that reads `KeyboardEvent.key` — this
// approach exercises both implementations.
async function pressAr(page, char) {
    await page.evaluate((c) => {
        const e = new KeyboardEvent('keypress', {
            key: c,
            keyCode: c.charCodeAt(0),
            charCode: c.charCodeAt(0),
            which: c.charCodeAt(0),
            bubbles: true,
        });
        document.dispatchEvent(e);
    }, char);
}

test('Arabic "خ" toggles font (mirror of `f`)', async ({page}) => {
    await page.goto('/');
    await expect(page.locator('body')).toHaveClass(/font-rubik/);
    await pressAr(page, 'خ');
    await expect(page.locator('body')).toHaveClass(/font-ibm/);
});

test('Arabic "ل" toggles theme (mirror of `t`)', async ({page}) => {
    await page.goto('/');
    await expect(page.locator('body')).toHaveClass(/light-theme/);
    await pressAr(page, 'ل');
    await expect(page.locator('body')).toHaveClass(/dark-theme/);
});

test('Arabic chord "س ي ر ه" initiates navigation to /cv', async ({page}) => {
    await page.goto('/');
    const reqPromise = page.waitForRequest(
        (r) => r.url().endsWith('/cv'),
        {timeout: 2000},
    );
    for (const c of ['س', 'ي', 'ر', 'ه']) await pressAr(page, c);
    await reqPromise;
});

// --- Build-time substitutions --------------------------------------------
// Exactly the failure mode #84's Step 8/9 was designed to prevent: if the
// PUBLIC_BUILD_TIMESTAMP_UTC env var isn't set during build (or the Vue 2
// EJS interpolation breaks), `data-build-timestamp-utc` ends up empty and
// the footer "updated" date silently breaks.
test('html has a non-empty data-build-timestamp-utc ISO date', async ({page}) => {
    await page.goto('/');
    const ts = await page.getAttribute('html', 'data-build-timestamp-utc');
    expect(ts).toMatch(/^20\d\d-\d\d-\d\dT/);
});

test('about page renders GIT_DESCRIBE.hash as a GitHub commit link', async ({
    page,
}) => {
    await page.goto('/about');
    const link = page.locator('a[href*="github.com/qirh/sala_v2/commit/"]');
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    // Hex commit hash, at least 7 chars, no trailing quote-like noise (the
    // double-stringify bug from #84 round 2 produced `"abc123"` with literal
    // quotes — this regex would catch that).
    expect(href).toMatch(/\/commit\/[a-f0-9]{7,}$/);
});
