const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './test',
  testMatch: '**/*.spec.js',
  use: { baseURL: 'http://127.0.0.1:3000' },
  webServer: { command: 'node server.js', port: 3000, reuseExistingServer: !process.env.CI },
});
