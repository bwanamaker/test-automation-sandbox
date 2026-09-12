const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { buildStaticSite } = require('../scripts/build-static');

const products = ['acadia-roadster', 'yosemite-touring', 'zion-track', 'shenandoah-hybrid', 'redwood-cargo', 'olympic-cruiser', 'joshua-tree-gravel', 'glacier-folding', 'yellowstone-kids'];
const basePath = '/test-automation-sandbox';

test('builds GitHub Pages routes and prefixes internal URLs with the base path', async () => {
  const outputDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test-automation-sandbox-static-'));
  try {
    await buildStaticSite({ basePath, outputDir });

    for (const file of [
      'index.html',
      'astronaut-application/index.html',
      'products/index.html',
      ...products.map(product => `products/${product}/index.html`),
      'styles.css',
      'signup.js',
      'astronaut-application.js',
      'bicycle.svg',
      'park-scenes.svg',
    ]) {
      await fs.access(path.join(outputDir, file));
    }

    const catalog = await fs.readFile(path.join(outputDir, 'products', 'index.html'), 'utf8');
    assert.match(catalog, new RegExp(`href="${basePath}/products/acadia-roadster"`));
    assert.match(catalog, new RegExp(`src="${basePath}/bicycle\\.svg"`));

    const product = await fs.readFile(path.join(outputDir, 'products', 'acadia-roadster', 'index.html'), 'utf8');
    assert.match(product, new RegExp(`href="${basePath}/styles\\.css"`));
    assert.match(product, new RegExp(`href="${basePath}/park-scenes\\.svg#coast"`));

    const htmlFiles = (await Promise.all([
      'index.html',
      'astronaut-application/index.html',
      'products/index.html',
      ...products.map(product => `products/${product}/index.html`),
    ].map(file => fs.readFile(path.join(outputDir, file), 'utf8')))).join('\n');
    assert.doesNotMatch(htmlFiles, new RegExp(`(?:href|src)="/(?!${basePath.slice(1)}(?:/|")).*?"`));
  } finally {
    await fs.rm(outputDir, { recursive: true, force: true });
  }
});
