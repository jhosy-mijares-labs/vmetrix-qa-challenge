import { expect }  from '@playwright/test';
import { test }     from '../../fixtures/uiFixtures';
import { allure }   from 'allure-playwright';
import { PRODUCTS } from '../../data/products';

test.describe('🛒 Cart Management', () => {

  test('TC-UI-01 | Agregar producto al carrito actualiza el badge', async ({ inventoryPage }) => {
    await allure.epic('UI Tests');
    await allure.feature('Carrito');
    await allure.severity('critical');
    await allure.tag('positivo');

    await allure.step('Agregar Sauce Labs Backpack al carrito', async () => {
      await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    });

    await allure.step('Verificar que el badge del carrito muestra 1', async () => {
      await expect(inventoryPage.cartBadge).toHaveText('1');
    });
  });

  test('TC-UI-02 | Eliminar producto del carrito lo remueve de la lista', async ({ inventoryPage, cartPage }) => {
    await allure.epic('UI Tests');
    await allure.feature('Carrito');
    await allure.severity('normal');
    await allure.tag('positivo');

    await allure.step('Agregar producto al carrito', async () => {
      await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    });

    await allure.step('Navegar al carrito', async () => {
      await inventoryPage.goToCart();
    });

    await allure.step('Eliminar el producto', async () => {
      await cartPage.removeItem(PRODUCTS.BACKPACK);
    });

    await allure.step('Verificar que el carrito queda vacío', async () => {
      await expect(cartPage.cartItems).toHaveCount(0);
    });
  });

  test('TC-UI-03 | Contador se actualiza al agregar múltiples productos', async ({ inventoryPage }) => {
    await allure.epic('UI Tests');
    await allure.feature('Carrito');
    await allure.severity('normal');
    await allure.tag('positivo');

    await allure.step('Agregar primer producto', async () => {
      await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    });

    await allure.step('Agregar segundo producto', async () => {
      await inventoryPage.addProductToCart(PRODUCTS.BIKE_LIGHT);
    });

    await allure.step('Verificar badge muestra 2', async () => {
      await expect(inventoryPage.cartBadge).toHaveText('2');
    });
  });

});
