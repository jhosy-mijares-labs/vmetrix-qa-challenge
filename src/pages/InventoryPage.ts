import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly productList   = this.page.locator('.inventory_item');
  readonly cartIcon      = this.page.locator('.shopping_cart_link');
  readonly cartBadge     = this.page.locator('.shopping_cart_badge');
  readonly sortDropdown  = this.page.locator('[data-test="product-sort-container"]');
  readonly productNames  = this.page.locator('.inventory_item_name');
  readonly productPrices = this.page.locator('.inventory_item_price');

  async addProductToCart(productName: string) {
    const slug = productName.toLowerCase().replace(/ /g, '-');
    await this.page.locator(`[data-test="add-to-cart-${slug}"]`).click();
  }

  async removeProductFromCart(productName: string) {
    const slug = productName.toLowerCase().replace(/ /g, '-');
    await this.page.locator(`[data-test="remove-${slug}"]`).click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async goToCart() {
    await this.cartIcon.click();
    await this.page.waitForURL('**/cart.html');
  }

  async getProductNames(): Promise<string[]> {
    return await this.productNames.allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const texts = await this.productPrices.allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }
}
