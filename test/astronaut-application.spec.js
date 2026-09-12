const { expect, test } = require('@playwright/test');

test.describe('astronaut application', () => {
  test('uses a distinct five-to-fifteen-second loading sequence for each visit', async ({ page }) => {
    await page.addInitScript(() => { Math.random = () => 0; });
    await page.goto('/astronaut-application');

    const loader = page.getByRole('status', { name: 'Preparing astronaut application' });
    await expect(loader).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Astronaut application' })).toBeHidden();
    const firstDelay = await loader.getAttribute('data-load-delay');
    expect(Number(firstDelay)).toBeGreaterThanOrEqual(5000);
    expect(Number(firstDelay)).toBeLessThanOrEqual(15000);

    await expect(page.getByRole('heading', { name: 'Astronaut application' })).toBeVisible({ timeout: 7000 });
    await expect(loader).toBeHidden();
    await page.reload();
    const secondDelay = await page.getByRole('status', { name: 'Preparing astronaut application' }).getAttribute('data-load-delay');
    expect(secondDelay).not.toBe(firstDelay);
  });

  test('reports validation errors, replaces the form with confirmation, and restarts empty', async ({ page }) => {
    await page.addInitScript(() => { Math.random = () => 0; });
    await page.goto('/astronaut-application');
    await expect(page.getByRole('heading', { name: 'Astronaut application' })).toBeVisible({ timeout: 7000 });

    await page.getByRole('button', { name: 'Transmit application' }).click();
    await expect(page.getByRole('alert')).toContainText('Mission Control needs a few corrections');
    await expect(page.locator('#full-name-error')).toContainText('full name');
    await expect(page.locator('#specialties-error')).toContainText('at least one mission specialty');

    await page.getByLabel('Full name').fill('Avery Orbit');
    await page.getByLabel('Transmission address').fill('avery@example.com');
    await page.getByLabel('Date of birth').fill('1990-06-15');
    await page.getByLabel('Preferred mission role').selectOption('Science specialist');
    await page.getByLabel('Hours piloting anything').fill('42');
    await page.getByLabel('Standard').check();
    await page.getByRole('checkbox', { name: 'Navigation' }).check();
    await page.getByLabel('Emergency contact').fill('Casey Orbit');
    await page.getByLabel('Emergency telephone').fill('+1 555 012 3456');
    await page.getByLabel('Why should we send you skyward?').fill('I can repair a rocket, map the stars, and pack an excellent mission snack.');
    await page.getByLabel(/I accept that space may be cold/).check();
    await page.getByRole('button', { name: 'Transmit application' }).click();

    const confirmation = page.locator('#application-confirmation');
    await expect(confirmation).toContainText('Application aboard!');
    await expect(confirmation).toContainText('Avery Orbit');
    await expect(page.locator('#astronaut-form')).toBeHidden();
    await confirmation.getByRole('button', { name: 'Return to Earth' }).click();
    await expect(page.getByRole('status', { name: 'Preparing astronaut application' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Astronaut application' })).toBeVisible({ timeout: 7000 });
    await expect(page.getByLabel('Full name')).toHaveValue('');
  });

  test('keeps the loading state within a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/astronaut-application');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
});
