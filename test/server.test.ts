import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';
import { createServer } from '../server';

const products = ['alder-roadster', 'bramble-touring', 'cinder-track', 'field-notes-hybrid', 'grove-cargo', 'hearth-cruiser', 'juniper-gravel', 'meadow-folding', 'thistle-kids'];

test('serves the landing page, catalog, and every product page', async () => {
  const server = createServer();
  await new Promise<void>(resolve => server.listen(0, resolve));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const port = address.port;
  const get = (route: string) => new Promise<{ status: number | undefined; body: string }>((resolve, reject) => http.get(`http://localhost:${port}${route}`, response => { let body = ''; response.on('data', chunk => body += chunk); response.on('end', () => resolve({ status: response.statusCode, body })); }).on('error', reject));
  try {
    const home = await get('/');
    assert.match(home.body, /Launch sandbox/);
    assert.doesNotMatch(home.body, /Wheelhouse/);
    assert.doesNotMatch(home.body, /email-signup/);
    const catalog = await get('/products');
    assert.equal(catalog.status, 200);
    assert.equal((catalog.body.match(/class="product-card"/g) || []).length, 9);
    for (const product of products) assert.equal((await get(`/products/${product}`)).status, 200);
    assert.equal((await get('/products/not-a-bicycle')).status, 404);
    await new Promise<void>((resolve, reject) => http.get({ hostname: 'localhost', port, path: '/', headers: { host: 'example:invalid' } }, response => {
      assert.equal(response.statusCode, 200);
      response.resume();
      response.on('end', resolve);
    }).on('error', reject));
  } finally { await new Promise<void>(resolve => server.close(() => resolve())); }
});
