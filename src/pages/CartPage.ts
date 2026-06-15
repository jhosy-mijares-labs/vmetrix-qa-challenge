import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems             = this.page.locator('.cart_item');
  readonly checkoutButton        = this.page.locator('[data-test="checkout"]');
  readonly continueShoppingButton = this.page.locator('[data-test="continue-shopping"]');
  readonly cartItemNames         = this.page.locator('.inventory_item_name');

  async removeItem(productName: string) {
    const slug = productName.toLowerCase().replace(/ /g, '-');
    await this.page.locator(`[data-test="remove-${slug}"]`).click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
    await this.page.waitForURL('**/checkout-step-one.html');
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }
}
