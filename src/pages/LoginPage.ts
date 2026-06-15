import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENV } from '../config/env';
import { DEFAULT_UI_USER, UiUser } from '../data/users';

export class LoginPage extends BasePage {
  readonly usernameInput = this.page.locator('[data-test="username"]');
  readonly passwordInput = this.page.locator('[data-test="password"]');
  readonly loginButton   = this.page.locator('[data-test="login-button"]');
  readonly errorMessage  = this.page.locator('[data-test="error"]');

  /**
   * Hace login con el usuario dado.
   * Por defecto usa DEFAULT_UI_USER (standard_user).
   * Pasar cualquier UiUser de src/data/users.ts para testar con otro rol.
   */
  async login(user: Pick<UiUser, 'username' | 'password'> = DEFAULT_UI_USER) {
    await this.navigate(ENV.UI_BASE_URL);
    await this.usernameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
    await this.loginButton.click();
    await this.page.waitForURL('**/inventory.html');
  }
}
