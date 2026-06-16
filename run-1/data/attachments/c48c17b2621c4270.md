# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/checkout.spec.ts >> 💳 Checkout Flow >> TC-UI-08 | Checkout sin First Name muestra mensaje de error
- Location: src/tests/ui/checkout.spec.ts:59:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('[data-test="error"]')
Expected substring: "First Name is required"
Received string:    "Error: Last Name is required"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('[data-test="error"]')
    14 × locator resolved to <h3 data-test="error">…</h3>
       - unexpected value "Error: Last Name is required"

```

```yaml
- 'heading "Error: Last Name is required" [level=3]':
  - button
  - text: "Error: Last Name is required"
```

# Test source

```ts
  1   | import { expect }          from '@playwright/test';
  2   | import { test }             from '../../fixtures/uiFixtures';
  3   | import { allure }           from 'allure-playwright';
  4   | import { PRODUCTS }         from '../../data/products';
  5   | import { CHECKOUT_INVALID } from '../../data/checkout';
  6   | import { DEFAULT_UI_USER }  from '../../data/users';
  7   | 
  8   | test.describe('💳 Checkout Flow', () => {
  9   | 
  10  |   test('TC-UI-04 | Checkout completo con datos válidos muestra confirmación', async ({ inventoryPage, cartPage, checkoutPage }) => {
  11  |     await allure.epic('UI Tests');
  12  |     await allure.feature('Checkout');
  13  |     await allure.severity('blocker');
  14  |     await allure.tag('positivo');
  15  | 
  16  |     await allure.step('Agregar producto al carrito', async () => {
  17  |       await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
  18  |     });
  19  | 
  20  |     await allure.step('Ir al carrito e iniciar checkout', async () => {
  21  |       await inventoryPage.goToCart();
  22  |       await cartPage.proceedToCheckout();
  23  |     });
  24  | 
  25  |     await allure.step('Completar información de envío', async () => {
  26  |       const { firstName, lastName, zip } = DEFAULT_UI_USER;
  27  |       await checkoutPage.fillInfo(firstName, lastName, zip);
  28  |       await checkoutPage.continue();
  29  |     });
  30  | 
  31  |     await allure.step('Finalizar la orden', async () => {
  32  |       await checkoutPage.finish();
  33  |     });
  34  | 
  35  |     await allure.step('Verificar mensaje de confirmación', async () => {
  36  |       await expect(checkoutPage.orderConfirmation).toHaveText('Thank you for your order!');
  37  |     });
  38  |   });
  39  | 
  40  |   test('TC-UI-07 | Carrito vacío no tiene ítems para procesar en checkout', async ({ cartPage, page }) => {
  41  |     await allure.epic('UI Tests');
  42  |     await allure.feature('Checkout');
  43  |     await allure.severity('normal');
  44  |     await allure.tag('negativo');
  45  | 
  46  |     await allure.step('Ir al carrito sin agregar productos', async () => {
  47  |       await page.goto('/cart.html');
  48  |     });
  49  | 
  50  |     await allure.step('Verificar que el carrito está vacío', async () => {
  51  |       await expect(cartPage.cartItems).toHaveCount(0);
  52  |     });
  53  | 
  54  |     await allure.step('Verificar que el botón Checkout está visible', async () => {
  55  |       await expect(cartPage.checkoutButton).toBeVisible();
  56  |     });
  57  |   });
  58  | 
  59  |   test('TC-UI-08 | Checkout sin First Name muestra mensaje de error', async ({ inventoryPage, cartPage, checkoutPage }) => {
  60  |     await allure.epic('UI Tests');
  61  |     await allure.feature('Checkout');
  62  |     await allure.severity('normal');
  63  |     await allure.tag('negativo');
  64  | 
  65  |     const { noFirstName } = CHECKOUT_INVALID;
  66  | 
  67  |     await allure.step('Agregar producto y navegar al checkout', async () => {
  68  |       await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
  69  |       await inventoryPage.goToCart();
  70  |       await cartPage.proceedToCheckout();
  71  |     });
  72  | 
  73  |     await allure.step('Intentar continuar sin ingresar First Name', async () => {
  74  |       await checkoutPage.fillInfo(noFirstName.firstName, noFirstName.lastName, noFirstName.zip);
  75  |       await checkoutPage.continue();
  76  |     });
  77  | 
  78  |     await allure.step('Verificar que aparece mensaje de error', async () => {
  79  |       await expect(checkoutPage.errorMessage).toBeVisible();
> 80  |       await expect(checkoutPage.errorMessage).toContainText('First Name is required');
      |                                               ^ Error: expect(locator).toContainText(expected) failed
  81  |     });
  82  |   });
  83  | 
  84  |   test('TC-UI-10 | El total en resumen = subtotal + tax', async ({ inventoryPage, cartPage, checkoutPage }) => {
  85  |     await allure.epic('UI Tests');
  86  |     await allure.feature('Checkout');
  87  |     await allure.severity('critical');
  88  |     await allure.tag('positivo');
  89  | 
  90  |     await allure.step('Agregar producto y navegar al resumen', async () => {
  91  |       const { firstName, lastName, zip } = DEFAULT_UI_USER;
  92  |       await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
  93  |       await inventoryPage.goToCart();
  94  |       await cartPage.proceedToCheckout();
  95  |       await checkoutPage.fillInfo(firstName, lastName, zip);
  96  |       await checkoutPage.continue();
  97  |     });
  98  | 
  99  |     await allure.step('Verificar que total = subtotal + tax', async () => {
  100 |       const subtotal = await checkoutPage.getItemSubtotal();
  101 |       const tax      = await checkoutPage.getTaxAmount();
  102 |       const total    = await checkoutPage.getTotalAmount();
  103 |       const expected = parseFloat((subtotal + tax).toFixed(2));
  104 |       expect(total).toBe(expected);
  105 |     });
  106 |   });
  107 | 
  108 | });
  109 | 
```