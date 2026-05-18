import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 15000,
  expect: { timeout: 3000 },
  fullyParallel: false,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }], ['line']],
  use: {
    baseURL: 'http://localhost:3000',
    browserName: 'chromium',
    headless: !!process.env['CI'],
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env['CI'],
    timeout: 30000,
  },
});
