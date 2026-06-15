import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import { LoginPage } from './src/pages/LoginPage';
import { UI_USERS } from './src/data/users';

/**
 * Global setup: genera un archivo .auth/<role>.json por cada usuario
 * que puede hacer login (canLogin: true).
 *
 * Playwright inyecta el storageState del usuario por defecto (standard)
 * en todos los tests UI. Para testar con otro usuario, usar en el spec:
 *
 *   test.use({ storageState: '.auth/problem.json' });
 *
 * O iterar sobre varios usuarios en el mismo describe:
 *
 *   for (const user of loginableUsers) {
 *     test.describe(`[${user.role}]`, () => {
 *       test.use({ storageState: `.auth/${user.role}.json` });
 *       // tests...
 *     });
 *   }
 */
async function globalSetup(_config: FullConfig) {
  fs.mkdirSync('.auth', { recursive: true });

  const browser = await chromium.launch();

  const loginableUsers = Object.values(UI_USERS).filter(u => u.canLogin);

  for (const user of loginableUsers) {
    const context = await browser.newContext();
    const page    = await context.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.login(user);

    await context.storageState({ path: `.auth/${user.role}.json` });
    await context.close();
  }

  await browser.close();
}

export default globalSetup;
