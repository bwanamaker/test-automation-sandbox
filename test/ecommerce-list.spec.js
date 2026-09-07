const { expect, test } = require('@playwright/test');

const products = ['alder-roadster', 'bramble-touring', 'cinder-track', 'field-notes-hybrid', 'grove-cargo', 'hearth-cruiser', 'juniper-gravel', 'meadow-folding', 'thistle-kids'];

test('catalog presents nine linked bicycle products', async ({ page }) => {
  await page.goto('/products');

  await expect(page.getByRole('heading', { name: 'Bicycles for ordinary adventures.' })).toBeVisible();
  await expect(page.locator('.product-card')).toHaveCount(9);
  for (const product of products) await expect(page.locator(`a[href="/products/${product}"]`)).toHaveCount(1);
});
