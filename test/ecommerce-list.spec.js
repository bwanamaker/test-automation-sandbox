const { expect, test } = require('@playwright/test');

const products = [
  { slug: 'acadia-roadster', name: 'Acadia Roadster' },
  { slug: 'yosemite-touring', name: 'Yosemite Touring' },
  { slug: 'zion-track', name: 'Zion Track' },
  { slug: 'shenandoah-hybrid', name: 'Shenandoah Hybrid' },
  { slug: 'redwood-cargo', name: 'Redwood Cargo' },
  { slug: 'olympic-cruiser', name: 'Olympic Cruiser' },
  { slug: 'joshua-tree-gravel', name: 'Joshua Tree Gravel' },
  { slug: 'glacier-folding', name: 'Glacier Folding' },
  { slug: 'yellowstone-kids', name: 'Yellowstone Kids' },
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
    await expect(page).toHaveURL(`/products/${slug}`);
    await expect(page.getByRole('heading', { level: 1, name, exact: true })).toBeVisible();
    await expect(page).toHaveTitle(`${name} | Wheelhouse`);
    await expect(page.getByRole('form', { name: `${name} options` })).toBeVisible();
    await page.getByRole('link', { name: 'All bicycles' }).click();
  }
});
