import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: 'line',
  use: { baseURL: 'http://localhost:4329' },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4329',
    port: 4329,
    reuseExistingServer: false,
    timeout: 180_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      grepInvert: /@nojs/,
    },
    {
      name: 'no-js',
      use: { ...devices['Desktop Chrome'], javaScriptEnabled: false },
      grep: /@nojs/,
    },
  ],
});
