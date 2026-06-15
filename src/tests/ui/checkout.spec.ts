import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { ENV } from '../../config/env';

async function doLogin(page: any) {
  await page.goto(ENV.UI_BASE_URL);
  await page.fill('[data-test="username"]', ENV.UI_USER);
  await page.fill('[data-test="password"]', ENV.UI_PASSWORD);
  await page.click('[data-test="login-button"]');
  await page.waitForURL('**/inventory.html');
}

test.describe('💳 Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await doLogin(page);
  });

  test('TC-UI-04 | Checkout completo con datos válidos muestra confirmación', async ({ page }) => {
    await allure.epic('UI Tests');
    await allure.feature('Checkout');
    await allure.severity('blocker');
    await allure.tag('positivo');

    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await allure.step('Agregar producto al carrito', async () => {
      await inventory.addProductToCart('Sauce Labs Backpack');
    });

    await allure.step('Ir al carrito e iniciar checkout', async () => {
      await inventory.goToCart();
      await cart.proceedToCheckout();
    });

    await allure.step('Completar información de envío', async () => {
      await checkout.fillInfo('Ana', 'García', '10001');
      await checkout.continue();
    });

    await allure.step('Finalizar la orden', async () => {
      await checkout.finish();
    });

    await allure.step('Verificar mensaje de confirmación', async () => {
      await expect(checkout.orderConfirmation).toHaveText('Thank you for your order!');
    });
  });

  test('TC-UI-07 | Carrito vacío no tiene ítems para procesar en checkout', async ({ page }) => {
    await allure.epic('UI Tests');
    await allure.feature('Checkout');
    await allure.severity('normal');
    await allure.tag('negativo');

    const cart = new CartPage(page);

    await allure.step('Ir al carrito sin agregar productos', async () => {
      await page.goto(`${ENV.UI_BASE_URL}/cart.html`);
    });

    await allure.step('Verificar que el carrito está vacío', async () => {
      await expect(cart.cartItems).toHaveCount(0);
    });

    await allure.step('Verificar que el botón Checkout está visible', async () => {
      await expect(cart.checkoutButton).toBeVisible();
    });
  });

  test('TC-UI-08 | Checkout sin First Name muestra mensaje de error', async ({ page }) => {
    await allure.epic('UI Tests');
    await allure.feature('Checkout');
    await allure.severity('normal');
    await allure.tag('negativo');

    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await allure.step('Agregar producto y navegar al checkout', async () => {
      await inventory.addProductToCart('Sauce Labs Backpack');
      await inventory.goToCart();
      await cart.proceedToCheckout();
    });

    await allure.step('Intentar continuar sin ingresar First Name', async () => {
      await checkout.fillInfo('', 'García', '10001');
      await checkout.continue();
    });

    await allure.step('Verificar que aparece mensaje de error', async () => {
      await expect(checkout.errorMessage).toBeVisible();
      await expect(checkout.errorMessage).toContainText('First Name is required');
    });
  });

  test('TC-UI-10 | El total en resumen = subtotal + tax', async ({ page }) => {
    await allure.epic('UI Tests');
    await allure.feature('Checkout');
    await allure.severity('critical');
    await allure.tag('positivo');

    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await allure.step('Agregar producto y navegar al resumen', async () => {
      await inventory.addProductToCart('Sauce Labs Backpack');
      await inventory.goToCart();
      await cart.proceedToCheckout();
      await checkout.fillInfo('Ana', 'García', '10001');
      await checkout.continue();
    });

    await allure.step('Verificar que total = subtotal + tax', async () => {
      const subtotal = await checkout.getItemSubtotal();
      const tax      = await checkout.getTaxAmount();
      const total    = await checkout.getTotalAmount();
      const expected = parseFloat((subtotal + tax).toFixed(2));
      expect(total).toBe(expected);
    });
  });
});
