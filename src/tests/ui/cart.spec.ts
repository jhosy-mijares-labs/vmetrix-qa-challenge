import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { ENV } from '../../config/env';

async function doLogin(page: any) {
  await page.goto(ENV.UI_BASE_URL);
  await page.fill('[data-test="username"]', ENV.UI_USER);
  await page.fill('[data-test="password"]', ENV.UI_PASSWORD);
  await page.click('[data-test="login-button"]');
  await page.waitForURL('**/inventory.html');
}

test.describe('🛒 Cart Management', () => {
  test.beforeEach(async ({ page }) => {
    await doLogin(page);
  });

  test('TC-UI-01 | Agregar producto al carrito actualiza el badge', async ({ page }) => {
    await allure.epic('UI Tests');
    await allure.feature('Carrito');
    await allure.severity('critical');
    await allure.tag('positivo');

    const inventory = new InventoryPage(page);

    await allure.step('Agregar Sauce Labs Backpack al carrito', async () => {
      await inventory.addProductToCart('Sauce Labs Backpack');
    });

    await allure.step('Verificar que el badge del carrito muestra 1', async () => {
      await expect(inventory.cartBadge).toHaveText('1');
    });
  });

  test('TC-UI-02 | Eliminar producto del carrito lo remueve de la lista', async ({ page }) => {
    await allure.epic('UI Tests');
    await allure.feature('Carrito');
    await allure.severity('normal');
    await allure.tag('positivo');

    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await allure.step('Agregar producto al carrito', async () => {
      await inventory.addProductToCart('Sauce Labs Backpack');
    });

    await allure.step('Navegar al carrito', async () => {
      await inventory.goToCart();
    });

    await allure.step('Eliminar el producto', async () => {
      await cart.removeItem('Sauce Labs Backpack');
    });

    await allure.step('Verificar que el carrito queda vacío', async () => {
      await expect(cart.cartItems).toHaveCount(0);
    });
  });

  test('TC-UI-03 | Contador se actualiza al agregar múltiples productos', async ({ page }) => {
    await allure.epic('UI Tests');
    await allure.feature('Carrito');
    await allure.severity('normal');
    await allure.tag('positivo');

    const inventory = new InventoryPage(page);

    await allure.step('Agregar primer producto', async () => {
      await inventory.addProductToCart('Sauce Labs Backpack');
    });

    await allure.step('Agregar segundo producto', async () => {
      await inventory.addProductToCart('Sauce Labs Bike Light');
    });

    await allure.step('Verificar badge muestra 2', async () => {
      await expect(inventory.cartBadge).toHaveText('2');
    });
  });
});
