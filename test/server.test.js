const assert = require('node:assert/strict');
const http = require('node:http');
const test = require('node:test');
const { createServer } = require('../server');

const products = ['acadia-roadster', 'yosemite-touring', 'zion-track', 'shenandoah-hybrid', 'redwood-cargo', 'olympic-cruiser', 'joshua-tree-gravel', 'glacier-folding', 'yellowstone-kids'];

test('serves the landing page, catalog, and every product page', async () => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  const get = path => new Promise((resolve, reject) => http.get(`http://localhost:${port}${path}`, response => { let body = ''; response.on('data', chunk => body += chunk); response.on('end', () => resolve({ status: response.statusCode, body })); }).on('error', reject));
  try {
    const home = await get('/');
    assert.match(home.body, /Bike Shop/);
    assert.doesNotMatch(home.body, /Wheelhouse/);
    assert.doesNotMatch(home.body, /email-signup/);
    const application = await get('/astronaut-application');
    assert.equal(application.status, 200);
    assert.match(application.body, /Astronaut application/);
    const catalog = await get('/products');
    assert.equal(catalog.status, 200);
    assert.equal((catalog.body.match(/class="product-card"/g) || []).length, 9);
    for (const product of products) assert.equal((await get(`/products/${product}`)).status, 200);
    assert.equal((await get('/products/not-a-bicycle')).status, 404);
    await new Promise((resolve, reject) => http.get({ hostname: 'localhost', port, path: '/', headers: { host: 'example:invalid' } }, response => {
      assert.equal(response.statusCode, 200);
      response.resume();
      response.on('end', resolve);
    }).on('error', reject));
  } finally { await new Promise(resolve => server.close(resolve)); }
});
