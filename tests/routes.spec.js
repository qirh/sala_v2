const {test, expect} = require('@playwright/test');

test('home renders', async ({page}) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Saleh Alghusson');
    await expect(page.locator('.main-title')).toContainText("I'm");
    await expect(page.locator('.main-title')).toContainText('Saleh');
    await expect(page.locator('.grid-paragraphs p').first()).toContainText(
        'I am from Saudi Arabia',
    );
    await expect(page.locator('img.picture')).toBeVisible();
    await expect(page.locator('.grid-footer')).toContainText('updated');
});

test('about renders with back link and git hash', async ({page}) => {
    await page.goto('/about');
    await expect(page.locator('body')).toContainText('-back');
    await expect(page.locator('body')).toContainText('commit:');
});

test('/30 renders the Thirty page', async ({page}) => {
    await page.goto('/30');
    await expect(page.locator('body')).toContainText('Soft invite');
    await expect(page.locator('body')).toContainText('Prospect park');
});

test('/nycmarathon24 renders', async ({page}) => {
    await page.goto('/nycmarathon24');
    await expect(page.locator('body')).toContainText('2024 NYC Marathon');
});

test('/nycmarathon25 renders', async ({page}) => {
    await page.goto('/nycmarathon25');
    await expect(page.locator('body')).toContainText('Letter to Shareholders');
    await expect(page.locator('body')).toContainText('27769');
});

test('/bday25 renders', async ({page}) => {
    await page.goto('/bday25');
    await expect(page.locator('body')).toContainText('celebrate my birthday');
});

test('unknown path redirects to home', async ({page}) => {
    await page.goto('/this-does-not-exist');
    await expect(page).toHaveURL('/');
    await expect(page.locator('.main-title')).toBeVisible();
});

test('smile icon renders inside p2 via i18n-t slot', async ({page}) => {
    await page.goto('/');
    const p2 = page.locator('.grid-paragraphs p').nth(1);
    await expect(p2).toContainText('Away from the keyboard');
    await expect(p2.locator('svg[data-icon="face-smile"]')).toBeVisible();
});

test('no console errors on home', async ({page}) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
        if (m.type() === 'error') errors.push(m.text());
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
});
