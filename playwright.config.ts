import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test',
  testMatch: '**/*.spec.ts',
  use: { baseURL: 'http://127.0.0.1:3000' },
  webServer: { command: 'npm start', port: 3000, reuseExistingServer: !process.env.CI },
});
