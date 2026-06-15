import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly firstNameInput    = this.page.locator('[data-test="firstName"]');
  readonly lastNameInput     = this.page.locator('[data-test="lastName"]');
  readonly zipCodeInput      = this.page.locator('[data-test="postalCode"]');
  readonly continueButton    = this.page.locator('[data-test="continue"]');
  readonly finishButton      = this.page.locator('[data-test="finish"]');
  readonly errorMessage      = this.page.locator('[data-test="error"]');
  readonly orderConfirmation = this.page.locator('.complete-header');
  readonly itemTotal         = this.page.locator('.summary_subtotal_label');
  readonly taxLabel          = this.page.locator('.summary_tax_label');
  readonly totalLabel        = this.page.locator('.summary_total_label');

  async fillInfo(firstName: string, lastName: string, zip: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipCodeInput.fill(zip);
  }

  /**
   * Hace click en Continue. No espera navegación porque el resultado depende
   * del estado del formulario:
   * - Formulario válido   → navega a checkout-step-two.html
   * - Formulario inválido → se queda en step-one mostrando el error
   *
   * El test decide qué verificar después (errorMessage o finishButton).
   * Playwright auto-espera cada locator al momento de interactuar con él.
   */
  async continue() {
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
    await this.page.waitForURL('**/checkout-complete.html');
  }

  async getTotalAmount(): Promise<number> {
    const text = await this.totalLabel.textContent();
    return parseFloat(text!.replace('Total: $', ''));
  }

  async getItemSubtotal(): Promise<number> {
    const text = await this.itemTotal.textContent();
    return parseFloat(text!.replace('Item total: $', ''));
  }

  async getTaxAmount(): Promise<number> {
    const text = await this.taxLabel.textContent();
    return parseFloat(text!.replace('Tax: $', ''));
  }
}
