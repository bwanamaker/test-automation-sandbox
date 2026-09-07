const { expect, test } = require('@playwright/test');

test('product options and basket confirmation work', async ({ page }) => {
  await page.goto('/products/alder-roadster');

  await page.getByLabel('Product variant').selectOption('Step-through frame');
  await page.getByLabel('Quantity').fill('3');
  await expect(page.getByLabel('Product variant')).toHaveValue('Step-through frame');
  await expect(page.getByLabel('Quantity')).toHaveValue('3');

  await page.getByRole('button', { name: 'Add to basket' }).click();
  const basketModal = page.getByRole('dialog');
  await expect(basketModal).toContainText('Added to basket');
  await basketModal.getByRole('button', { name: 'Close confirmation' }).click();
  await expect(basketModal).toBeHidden();

  await page.getByRole('button', { name: 'Add to basket' }).click();
  await expect(basketModal).toBeHidden({ timeout: 6000 });
});

test('product footer reports invalid and valid email submissions', async ({ page }) => {
  await page.goto('/products/alder-roadster');

  await page.getByLabel('Email address').fill('not-an-email');
  await page.getByRole('button', { name: 'Sign up' }).click();
  await expect(page.getByRole('dialog')).toContainText('Subscription not confirmed');
  await page.getByRole('button', { name: 'Close' }).click();

  await page.getByLabel('Email address').fill('rider@example.com');
  await page.getByRole('button', { name: 'Sign up' }).click();
  await expect(page.getByRole('dialog')).toContainText('Subscription confirmed');
});
