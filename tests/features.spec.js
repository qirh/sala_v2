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
