import { expect }          from '@playwright/test';
import { test }             from '../../fixtures/uiFixtures';
import { allure }           from 'allure-playwright';
import { PRODUCTS }         from '../../data/products';
import { CHECKOUT_INVALID } from '../../data/checkout';
import { DEFAULT_UI_USER }  from '../../data/users';

test.describe('💳 Checkout Flow', () => {

  test('TC-UI-04 | Checkout completo con datos válidos muestra confirmación', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await allure.epic('UI Tests');
    await allure.feature('Checkout');
    await allure.severity('blocker');
    await allure.tag('positivo');

    await allure.step('Agregar producto al carrito', async () => {
      await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    });

    await allure.step('Ir al carrito e iniciar checkout', async () => {
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
    });

    await allure.step('Completar información de envío', async () => {
      const { firstName, lastName, zip } = DEFAULT_UI_USER;
      await checkoutPage.fillInfo(firstName, lastName, zip);
      await checkoutPage.continue();
    });

    await allure.step('Finalizar la orden', async () => {
      await checkoutPage.finish();
    });

    await allure.step('Verificar mensaje de confirmación', async () => {
      await expect(checkoutPage.orderConfirmation).toHaveText('Thank you for your order!');
    });
  });

  test('TC-UI-07 | Carrito vacío no tiene ítems para procesar en checkout', async ({ cartPage, page }) => {
    await allure.epic('UI Tests');
    await allure.feature('Checkout');
    await allure.severity('normal');
    await allure.tag('negativo');

    await allure.step('Ir al carrito sin agregar productos', async () => {
      await page.goto('/cart.html');
    });

    await allure.step('Verificar que el carrito está vacío', async () => {
      await expect(cartPage.cartItems).toHaveCount(0);
    });

    await allure.step('Verificar que el botón Checkout está visible', async () => {
      await expect(cartPage.checkoutButton).toBeVisible();
    });
  });

  test('TC-UI-08 | Checkout sin First Name muestra mensaje de error', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await allure.epic('UI Tests');
    await allure.feature('Checkout');
    await allure.severity('normal');
    await allure.tag('negativo');

    const { noFirstName } = CHECKOUT_INVALID;

    await allure.step('Agregar producto y navegar al checkout', async () => {
      await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
    });

    await allure.step('Intentar continuar sin ingresar First Name', async () => {
      await checkoutPage.fillInfo(noFirstName.firstName, noFirstName.lastName, noFirstName.zip);
      await checkoutPage.continue();
    });

    await allure.step('Verificar que aparece mensaje de error', async () => {
      await expect(checkoutPage.errorMessage).toBeVisible();
      await expect(checkoutPage.errorMessage).toContainText('First Name is required');
    });
  });

  test('TC-UI-10 | El total en resumen = subtotal + tax', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await allure.epic('UI Tests');
    await allure.feature('Checkout');
    await allure.severity('critical');
    await allure.tag('positivo');

    await allure.step('Agregar producto y navegar al resumen', async () => {
      const { firstName, lastName, zip } = DEFAULT_UI_USER;
      await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.fillInfo(firstName, lastName, zip);
      await checkoutPage.continue();
    });

    await allure.step('Verificar que total = subtotal + tax', async () => {
      const subtotal = await checkoutPage.getItemSubtotal();
      const tax      = await checkoutPage.getTaxAmount();
      const total    = await checkoutPage.getTotalAmount();
      const expected = parseFloat((subtotal + tax).toFixed(2));
      expect(total).toBe(expected);
    });
  });

});
