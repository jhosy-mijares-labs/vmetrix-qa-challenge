import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  timeout: 30000,
  retries: 1,
  fullyParallel: false,

  reporter: [
    ['list'],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: 'allure-results',
        suiteTitle: true,
      },
    ],
  ],

  use: {
    headless: false,
    baseURL: 'https://www.saucedemo.com',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'UI Tests - Chrome',
      testMatch: '**/ui/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'API Tests',
      testMatch: '**/api/**/*.spec.ts',
    },
  ],
});
