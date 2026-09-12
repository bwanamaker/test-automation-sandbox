const { expect, test } = require('@playwright/test');

test('homepage links to the bike shop and keeps its distinct theme and shared font', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Your next great test starts here.' })).toBeVisible();
  const homeStyle = await page.locator('body').evaluate(body => ({
    background: getComputedStyle(body).backgroundColor,
    font: getComputedStyle(body).fontFamily,
  }));
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Bike Shop' }).click();
  await expect(page).toHaveURL('/products');
  const storeStyle = await page.locator('body').evaluate(body => ({
    background: getComputedStyle(body).backgroundColor,
    font: getComputedStyle(body).fontFamily,
  }));
  expect(homeStyle.background).not.toBe(storeStyle.background);
  expect(homeStyle.font).toBe(storeStyle.font);
  expect(homeStyle.font).toContain('Futura');
  await page.getByRole('link', { name: 'Home' }).click();
  await expect(page).toHaveURL('/');
});

test('headers keep the same geometry across playground destinations', async ({ page }) => {
  for (const viewport of [{ width: 1280, height: 900 }, { width: 375, height: 812 }]) {
    await page.setViewportSize(viewport);
    const headers = [];
    for (const route of ['/', '/products', '/astronaut-application']) {
      await page.goto(route);
      headers.push(await page.locator('.site-header').evaluate(header => {
        const { height, left, width } = header.getBoundingClientRect();
        return { height, left, width };
      }));
    }
    expect(headers).toEqual([headers[0], headers[0], headers[0]]);
  }
});

test('mobile visitors can reach and configure a bicycle without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const route of ['/', '/products', '/products/joshua-tree-gravel']) {
    await page.goto(route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.getByLabel('Product variant').selectOption('Frame set only');
  await page.getByLabel('Quantity').fill('2');
  await page.getByRole('button', { name: 'Add to basket' }).click();
  await expect(page.getByRole('dialog')).toContainText('Added to basket');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
});
