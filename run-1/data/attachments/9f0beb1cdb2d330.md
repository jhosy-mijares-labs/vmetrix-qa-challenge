# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/inventory.spec.ts >> 📦 Inventory Page >> TC-UI-12 | Ordenar productos Z→A muestra los nombres en orden descendente
- Location: src/tests/ui/inventory.spec.ts:35:7

# Error details

```
Error: Los productos deben aparecer en orden Z→A

expect(received).toEqual(expected) // deep equality

- Expected  - 5
+ Received  + 5

  Array [
-   "Test.allTheThings() T-Shirt (Red)",
-   "Sauce Labs Onesie",
-   "Sauce Labs Fleece Jacket",
-   "Sauce Labs Bolt T-Shirt",
-   "Sauce Labs Bike Light",
    "Sauce Labs Backpack",
+   "Sauce Labs Bike Light",
+   "Sauce Labs Bolt T-Shirt",
+   "Sauce Labs Fleece Jacket",
+   "Sauce Labs Onesie",
+   "Test.allTheThings() T-Shirt (Red)",
  ]
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - generic:
          - generic:
            - generic [ref=e7]:
              - button "Open Menu" [ref=e8] [cursor=pointer]
              - img "Open Menu" [ref=e9]
            - generic [ref=e10]:
              - navigation [ref=e12]:
                - link [ref=e13] [cursor=pointer]:
                  - /url: "#"
                  - text: All Items
                - link [ref=e14] [cursor=pointer]:
                  - /url: https://saucelabs.com/
                  - text: About
                - link [ref=e15] [cursor=pointer]:
                  - /url: "#"
                  - text: Logout
                - link [ref=e16] [cursor=pointer]:
                  - /url: "#"
                  - text: Reset App State
              - generic [ref=e17]:
                - button [ref=e18] [cursor=pointer]: Close Menu
                - img [ref=e19]
        - generic [ref=e21]: Swag Labs
      - generic [ref=e24]:
        - generic [ref=e25]: Products
        - generic [ref=e27] [cursor=pointer]:
          - generic [ref=e28]: Name (A to Z)
          - combobox [ref=e29]:
            - option "Name (A to Z)" [selected]
            - option "Name (Z to A)"
            - option "Price (low to high)"
            - option "Price (high to low)"
    - generic [ref=e33]:
      - generic [ref=e34]:
        - link "Sauce Labs Backpack" [ref=e36] [cursor=pointer]:
          - /url: "#"
          - img "Sauce Labs Backpack" [ref=e37]
        - generic [ref=e38]:
          - generic [ref=e39]:
            - link "Sauce Labs Backpack" [ref=e40] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e41]: Sauce Labs Backpack
            - generic [ref=e42]: carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.
          - generic [ref=e43]:
            - generic [ref=e44]: $29.99
            - button "Add to cart" [ref=e45] [cursor=pointer]
      - generic [ref=e46]:
        - link "Sauce Labs Bike Light" [ref=e48] [cursor=pointer]:
          - /url: "#"
          - img "Sauce Labs Bike Light" [ref=e49]
        - generic [ref=e50]:
          - generic [ref=e51]:
            - link "Sauce Labs Bike Light" [ref=e52] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e53]: Sauce Labs Bike Light
            - generic [ref=e54]: A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.
          - generic [ref=e55]:
            - generic [ref=e56]: $9.99
            - button "Add to cart" [ref=e57] [cursor=pointer]
      - generic [ref=e58]:
        - link "Sauce Labs Bolt T-Shirt" [ref=e60] [cursor=pointer]:
          - /url: "#"
          - img "Sauce Labs Bolt T-Shirt" [ref=e61]
        - generic [ref=e62]:
          - generic [ref=e63]:
            - link "Sauce Labs Bolt T-Shirt" [ref=e64] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e65]: Sauce Labs Bolt T-Shirt
            - generic [ref=e66]: Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.
          - generic [ref=e67]:
            - generic [ref=e68]: $15.99
            - button "Add to cart" [ref=e69] [cursor=pointer]
      - generic [ref=e70]:
        - link "Sauce Labs Fleece Jacket" [ref=e72] [cursor=pointer]:
          - /url: "#"
          - img "Sauce Labs Fleece Jacket" [ref=e73]
        - generic [ref=e74]:
          - generic [ref=e75]:
            - link "Sauce Labs Fleece Jacket" [ref=e76] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e77]: Sauce Labs Fleece Jacket
            - generic [ref=e78]: It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.
          - generic [ref=e79]:
            - generic [ref=e80]: $49.99
            - button "Add to cart" [ref=e81] [cursor=pointer]
      - generic [ref=e82]:
        - link "Sauce Labs Onesie" [ref=e84] [cursor=pointer]:
          - /url: "#"
          - img "Sauce Labs Onesie" [ref=e85]
        - generic [ref=e86]:
          - generic [ref=e87]:
            - link "Sauce Labs Onesie" [ref=e88] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e89]: Sauce Labs Onesie
            - generic [ref=e90]: Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.
          - generic [ref=e91]:
            - generic [ref=e92]: $7.99
            - button "Add to cart" [ref=e93] [cursor=pointer]
      - generic [ref=e94]:
        - link "Test.allTheThings() T-Shirt (Red)" [ref=e96] [cursor=pointer]:
          - /url: "#"
          - img "Test.allTheThings() T-Shirt (Red)" [ref=e97]
        - generic [ref=e98]:
          - generic [ref=e99]:
            - link "Test.allTheThings() T-Shirt (Red)" [ref=e100] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e101]: Test.allTheThings() T-Shirt (Red)
            - generic [ref=e102]: This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.
          - generic [ref=e103]:
            - generic [ref=e104]: $15.99
            - button "Add to cart" [ref=e105] [cursor=pointer]
  - contentinfo [ref=e106]:
    - list [ref=e107]:
      - listitem [ref=e108]:
        - link "Twitter" [ref=e109] [cursor=pointer]:
          - /url: https://twitter.com/saucelabs
      - listitem [ref=e110]:
        - link "Facebook" [ref=e111] [cursor=pointer]:
          - /url: https://www.facebook.com/saucelabs
      - listitem [ref=e112]:
        - link "LinkedIn" [ref=e113] [cursor=pointer]:
          - /url: https://www.linkedin.com/company/sauce-labs/
    - generic [ref=e114]: © 2026 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy
```

# Test source

```ts
  1   | import { expect } from '@playwright/test';
  2   | import { test }    from '../../fixtures/uiFixtures';
  3   | import { allure }  from 'allure-playwright';
  4   | import { PRODUCTS } from '../../data/products';
  5   | 
  6   | test.describe('📦 Inventory Page', () => {
  7   | 
  8   |   // ─── TC-UI-11 ────────────────────────────────────────────────────────────────
  9   | 
  10  |   test('TC-UI-11 | Agregar 3 artículos al carrito actualiza el badge a 3', async ({ inventoryPage }) => {
  11  |     await allure.epic('UI Tests');
  12  |     await allure.feature('Inventario');
  13  |     await allure.severity('critical');
  14  |     await allure.tag('positivo');
  15  | 
  16  |     await allure.step('Agregar Sauce Labs Backpack al carrito', async () => {
  17  |       await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
  18  |     });
  19  | 
  20  |     await allure.step('Agregar Sauce Labs Bike Light al carrito', async () => {
  21  |       await inventoryPage.addProductToCart(PRODUCTS.BIKE_LIGHT);
  22  |     });
  23  | 
  24  |     await allure.step('Agregar Sauce Labs Bolt T-Shirt al carrito', async () => {
  25  |       await inventoryPage.addProductToCart(PRODUCTS.BOLT_TSHIRT);
  26  |     });
  27  | 
  28  |     await allure.step('Verificar que el badge del carrito muestra 3', async () => {
  29  |       await expect(inventoryPage.cartBadge).toHaveText('3');
  30  |     });
  31  |   });
  32  | 
  33  |   // ─── TC-UI-12 ────────────────────────────────────────────────────────────────
  34  | 
  35  |   test('TC-UI-12 | Ordenar productos Z→A muestra los nombres en orden descendente', async ({ inventoryPage }) => {
  36  |     await allure.epic('UI Tests');
  37  |     await allure.feature('Inventario');
  38  |     await allure.severity('normal');
  39  |     await allure.tag('positivo');
  40  | 
  41  |     await allure.step('Seleccionar ordenamiento Z→A en el dropdown', async () => {
  42  |       await inventoryPage.sortBy('za');
  43  |     });
  44  | 
  45  |     await allure.step('Verificar que los nombres están ordenados de Z a A', async () => {
  46  |       const names  = await inventoryPage.getProductNames();
  47  |       const sorted = [...names].sort((a, b) => b.localeCompare(a));
> 48  |       expect(names, 'Los productos deben aparecer en orden Z→A').toEqual(sorted);
      |                                                                  ^ Error: Los productos deben aparecer en orden Z→A
  49  |     });
  50  |   });
  51  | 
  52  |   // ─── TC-UI-13 ────────────────────────────────────────────────────────────────
  53  | 
  54  |   test('TC-UI-13 | Los ítems del inventario tienen dimensiones correctas y no se superponen', async ({ inventoryPage }) => {
  55  |     await allure.epic('UI Tests');
  56  |     await allure.feature('Inventario');
  57  |     await allure.severity('normal');
  58  |     await allure.tag('ux');
  59  | 
  60  |     type Box = { x: number; y: number; width: number; height: number };
  61  |     let boxes: Box[] = [];
  62  | 
  63  |     await allure.step('Obtener bounding boxes de todos los ítems y validar que son visibles', async () => {
  64  |       const count = await inventoryPage.productList.count();
  65  |       expect(count, 'Debe haber al menos un ítem en el inventario').toBeGreaterThan(0);
  66  | 
  67  |       for (let i = 0; i < count; i++) {
  68  |         const box = await inventoryPage.productList.nth(i).boundingBox();
  69  |         expect(box,        `Ítem ${i}: debe ser visible en el viewport`).not.toBeNull();
  70  |         expect(box!.width,  `Ítem ${i}: ancho debe ser > 0`).toBeGreaterThan(0);
  71  |         expect(box!.height, `Ítem ${i}: alto debe ser > 0`).toBeGreaterThan(0);
  72  |         boxes.push(box!);
  73  |       }
  74  |     });
  75  | 
  76  |     await allure.step('Verificar que ningún par de ítems se superpone', async () => {
  77  |       for (let i = 0; i < boxes.length; i++) {
  78  |         for (let j = i + 1; j < boxes.length; j++) {
  79  |           const a = boxes[i];
  80  |           const b = boxes[j];
  81  | 
  82  |           // Coordenadas derivadas de { x, y, width, height }
  83  |           const aRight  = a.x + a.width;
  84  |           const aBottom = a.y + a.height;
  85  |           const bRight  = b.x + b.width;
  86  |           const bBottom = b.y + b.height;
  87  | 
  88  |           const overlaps =
  89  |             aRight  > b.x &&
  90  |             a.x     < bRight  &&
  91  |             aBottom > b.y &&
  92  |             a.y     < bBottom;
  93  | 
  94  |           expect(
  95  |             overlaps,
  96  |             `Ítem ${i} {x:${a.x} y:${a.y} w:${a.width} h:${a.height}} ` +
  97  |             `se superpone con ítem ${j} {x:${b.x} y:${b.y} w:${b.width} h:${b.height}}`
  98  |           ).toBe(false);
  99  |         }
  100 |       }
  101 |     });
  102 | 
  103 |     await allure.step('Verificar que el menú y el carrito están dentro del área del header', async () => {
  104 |       const headerBox = await inventoryPage.primaryHeader.boundingBox();
  105 |       const menuBox   = await inventoryPage.hamburgerMenu.boundingBox();
  106 |       const cartBox   = await inventoryPage.cartContainer.boundingBox();
  107 | 
  108 |       expect(headerBox, 'El header principal debe ser visible').not.toBeNull();
  109 |       expect(menuBox,   'El botón de menú hamburguesa debe ser visible').not.toBeNull();
  110 |       expect(cartBox,   'El contenedor del carrito debe ser visible').not.toBeNull();
  111 | 
  112 |       const hTop    = headerBox!.y;
  113 |       const hBottom = headerBox!.y + headerBox!.height;
  114 | 
  115 |       const menuCenterY = menuBox!.y + menuBox!.height / 2;
  116 |       expect(menuCenterY, 'El menú hamburguesa debe estar verticalmente dentro del header')
  117 |         .toBeGreaterThanOrEqual(hTop);
  118 |       expect(menuCenterY, 'El menú hamburguesa debe estar verticalmente dentro del header')
  119 |         .toBeLessThanOrEqual(hBottom);
  120 | 
  121 |       const cartCenterY = cartBox!.y + cartBox!.height / 2;
  122 |       expect(cartCenterY, 'El carrito debe estar verticalmente dentro del header')
  123 |         .toBeGreaterThanOrEqual(hTop);
  124 |       expect(cartCenterY, 'El carrito debe estar verticalmente dentro del header')
  125 |         .toBeLessThanOrEqual(hBottom);
  126 | 
  127 |       // El carrito debe estar a la derecha del menú, sin superponerse
  128 |       const menuRight = menuBox!.x + menuBox!.width;
  129 |       expect(cartBox!.x, 'El carrito no debe superponerse con el menú hamburguesa')
  130 |         .toBeGreaterThan(menuRight);
  131 |     });
  132 | 
  133 |     await allure.step('Verificar que los ítems de la misma fila comparten la misma coordenada Y', async () => {
  134 |       // SauceDemo muestra 2 columnas → los tops se repiten de a 2.
  135 |       // Tolerancia de 2 px para diferencias de subpíxel.
  136 |       const TOLERANCE = 2;
  137 |       const rowMap    = new Map<number, number>();
  138 | 
  139 |       for (const box of boxes) {
  140 |         const roundedY = Math.round(box.y / TOLERANCE) * TOLERANCE;
  141 |         rowMap.set(roundedY, (rowMap.get(roundedY) ?? 0) + 1);
  142 |       }
  143 | 
  144 |       const rowCounts  = [...rowMap.values()];
  145 |       const maxPerRow  = Math.max(...rowCounts);
  146 |       const fullRows   = rowCounts.filter(c => c === maxPerRow);
  147 | 
  148 |       expect(
```