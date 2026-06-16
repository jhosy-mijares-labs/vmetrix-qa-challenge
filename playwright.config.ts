import { defineConfig, devices } from '@playwright/test';
import { UI_USERS } from './src/data/users';

// Un proyecto UI por cada usuario que puede hacer login.
// Playwright corre los mismos specs N veces, una por usuario.
// Para agregar un nuevo usuario basta con añadirlo en src/data/users.ts.
const uiProjects = Object.values(UI_USERS)
  .filter(u => u.canLogin)
  .map(u => ({
    name: `UI [${u.role}]`,
    testMatch: '**/ui/**/*.spec.ts',
    use: {
      ...devices['Desktop Chrome'],
      storageState: `.auth/${u.role}.json`,
    },
  }));

export default defineConfig({
  globalSetup: './global-setup',
  testDir: './src/tests',
  timeout: 30000,
  retries: 1,
  workers: 3,
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
    baseURL: 'https://www.saucedemo.com',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    ...uiProjects,
    {
      name: 'API Tests',
      testMatch: '**/api/**/*.spec.ts',
    },
  ],
});
