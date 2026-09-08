const { expect, test } = require('@playwright/test');

const products = [
  { slug: 'alder-roadster', name: 'Acadia Roadster' },
  { slug: 'bramble-touring', name: 'Yosemite Touring' },
  { slug: 'cinder-track', name: 'Zion Track' },
  { slug: 'field-notes-hybrid', name: 'Shenandoah Hybrid' },
  { slug: 'grove-cargo', name: 'Redwood Cargo' },
  { slug: 'hearth-cruiser', name: 'Olympic Cruiser' },
  { slug: 'juniper-gravel', name: 'Joshua Tree Gravel' },
  { slug: 'meadow-folding', name: 'Glacier Folding' },
  { slug: 'thistle-kids', name: 'Yellowstone Kids' },
];

test('catalog presents nine park-named bicycles with matching detail pages', async ({ page }) => {
  await page.goto('/products');
  await expect(page.getByRole('heading', { name: 'Find your own great outdoors.' })).toBeVisible();
  await expect(page.locator('.product-card')).toHaveCount(9);

  for (const { slug, name } of products) {
    const link = page.locator(`a[href="/products/${slug}"]`);
    await expect(link).toHaveCount(1);
    await expect(link.getByRole('heading', { name, exact: true })).toBeVisible();
    await link.click();
    await expect(page.getByRole('heading', { level: 1, name, exact: true })).toBeVisible();
    await expect(page).toHaveTitle(`${name} | Wheelhouse`);
    await expect(page.getByRole('form', { name: `${name} options` })).toBeVisible();
    await page.getByRole('link', { name: 'All bicycles' }).click();
  }
});
