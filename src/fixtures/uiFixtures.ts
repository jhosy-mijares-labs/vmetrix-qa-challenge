import { test as base } from '@playwright/test';
import { allure }        from 'allure-playwright';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage }      from '../pages/CartPage';
import { CheckoutPage }  from '../pages/CheckoutPage';

type UiFixtures = {
  inventoryPage: InventoryPage;
  cartPage:      CartPage;
  checkoutPage:  CheckoutPage;
  _userLabel:    void;   // fixture interno — se ejecuta automáticamente en cada test
};

export const test = base.extend<UiFixtures>({
  /**
   * Etiqueta automática: inyecta el nombre del proyecto Playwright
   * como parámetro "Usuario" en cada test de Allure.
   * Con { auto: true } corre sin necesidad de declararlo en la firma del test.
   *
   * Resultado en Allure: parámetro "Usuario = standard / problem / performance_glitch"
   * visible en el detalle de cada test y como filtro en el reporte.
   */
  _userLabel: [async ({}, use, testInfo) => {
    const role = testInfo.project.name.replace('UI [', '').replace(']', '');
    await allure.parameter('Usuario', role);
    await use();
  }, { auto: true }],

  inventoryPage: async ({ page }, use) => {
    await page.goto('/inventory.html');
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});
