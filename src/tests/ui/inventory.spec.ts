import { expect } from '@playwright/test';
import { test }    from '../../fixtures/uiFixtures';
import { allure }  from 'allure-playwright';
import { PRODUCTS } from '../../data/products';

test.describe('📦 Inventory Page', () => {

  // ─── TC-UI-11 ────────────────────────────────────────────────────────────────

  test('TC-UI-11 | Agregar 3 artículos al carrito actualiza el badge a 3', async ({ inventoryPage }) => {
    await allure.epic('UI Tests');
    await allure.feature('Inventario');
    await allure.severity('critical');
    await allure.tag('positivo');

    await allure.step('Agregar Sauce Labs Backpack al carrito', async () => {
      await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    });

    await allure.step('Agregar Sauce Labs Bike Light al carrito', async () => {
      await inventoryPage.addProductToCart(PRODUCTS.BIKE_LIGHT);
    });

    await allure.step('Agregar Sauce Labs Bolt T-Shirt al carrito', async () => {
      await inventoryPage.addProductToCart(PRODUCTS.BOLT_TSHIRT);
    });

    await allure.step('Verificar que el badge del carrito muestra 3', async () => {
      await expect(inventoryPage.cartBadge).toHaveText('3');
    });
  });

  // ─── TC-UI-12 ────────────────────────────────────────────────────────────────

  test('TC-UI-12 | Ordenar productos Z→A muestra los nombres en orden descendente', async ({ inventoryPage }) => {
    await allure.epic('UI Tests');
    await allure.feature('Inventario');
    await allure.severity('normal');
    await allure.tag('positivo');

    await allure.step('Seleccionar ordenamiento Z→A en el dropdown', async () => {
      await inventoryPage.sortBy('za');
    });

    await allure.step('Verificar que los nombres están ordenados de Z a A', async () => {
      const names  = await inventoryPage.getProductNames();
      const sorted = [...names].sort((a, b) => b.localeCompare(a));
      expect(names, 'Los productos deben aparecer en orden Z→A').toEqual(sorted);
    });
  });

  // ─── TC-UI-13 ────────────────────────────────────────────────────────────────

  test('TC-UI-13 | Los ítems del inventario tienen dimensiones correctas y no se superponen', async ({ inventoryPage }) => {
    await allure.epic('UI Tests');
    await allure.feature('Inventario');
    await allure.severity('normal');
    await allure.tag('ux');

    type Box = { x: number; y: number; width: number; height: number };
    let boxes: Box[] = [];

    await allure.step('Obtener bounding boxes de todos los ítems y validar que son visibles', async () => {
      const count = await inventoryPage.productList.count();
      expect(count, 'Debe haber al menos un ítem en el inventario').toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const box = await inventoryPage.productList.nth(i).boundingBox();
        expect(box,        `Ítem ${i}: debe ser visible en el viewport`).not.toBeNull();
        expect(box!.width,  `Ítem ${i}: ancho debe ser > 0`).toBeGreaterThan(0);
        expect(box!.height, `Ítem ${i}: alto debe ser > 0`).toBeGreaterThan(0);
        boxes.push(box!);
      }
    });

    await allure.step('Verificar que ningún par de ítems se superpone', async () => {
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i];
          const b = boxes[j];

          // Coordenadas derivadas de { x, y, width, height }
          const aRight  = a.x + a.width;
          const aBottom = a.y + a.height;
          const bRight  = b.x + b.width;
          const bBottom = b.y + b.height;

          const overlaps =
            aRight  > b.x &&
            a.x     < bRight  &&
            aBottom > b.y &&
            a.y     < bBottom;

          expect(
            overlaps,
            `Ítem ${i} {x:${a.x} y:${a.y} w:${a.width} h:${a.height}} ` +
            `se superpone con ítem ${j} {x:${b.x} y:${b.y} w:${b.width} h:${b.height}}`
          ).toBe(false);
        }
      }
    });

    await allure.step('Verificar que el menú y el carrito están dentro del área del header', async () => {
      const headerBox = await inventoryPage.primaryHeader.boundingBox();
      const menuBox   = await inventoryPage.hamburgerMenu.boundingBox();
      const cartBox   = await inventoryPage.cartContainer.boundingBox();

      expect(headerBox, 'El header principal debe ser visible').not.toBeNull();
      expect(menuBox,   'El botón de menú hamburguesa debe ser visible').not.toBeNull();
      expect(cartBox,   'El contenedor del carrito debe ser visible').not.toBeNull();

      const hTop    = headerBox!.y;
      const hBottom = headerBox!.y + headerBox!.height;

      const menuCenterY = menuBox!.y + menuBox!.height / 2;
      expect(menuCenterY, 'El menú hamburguesa debe estar verticalmente dentro del header')
        .toBeGreaterThanOrEqual(hTop);
      expect(menuCenterY, 'El menú hamburguesa debe estar verticalmente dentro del header')
        .toBeLessThanOrEqual(hBottom);

      const cartCenterY = cartBox!.y + cartBox!.height / 2;
      expect(cartCenterY, 'El carrito debe estar verticalmente dentro del header')
        .toBeGreaterThanOrEqual(hTop);
      expect(cartCenterY, 'El carrito debe estar verticalmente dentro del header')
        .toBeLessThanOrEqual(hBottom);

      // El carrito debe estar a la derecha del menú, sin superponerse
      const menuRight = menuBox!.x + menuBox!.width;
      expect(cartBox!.x, 'El carrito no debe superponerse con el menú hamburguesa')
        .toBeGreaterThan(menuRight);
    });

    await allure.step('Verificar que los ítems de la misma fila comparten la misma coordenada Y', async () => {
      // SauceDemo muestra 2 columnas → los tops se repiten de a 2.
      // Tolerancia de 2 px para diferencias de subpíxel.
      const TOLERANCE = 2;
      const rowMap    = new Map<number, number>();

      for (const box of boxes) {
        const roundedY = Math.round(box.y / TOLERANCE) * TOLERANCE;
        rowMap.set(roundedY, (rowMap.get(roundedY) ?? 0) + 1);
      }

      const rowCounts  = [...rowMap.values()];
      const maxPerRow  = Math.max(...rowCounts);
      const fullRows   = rowCounts.filter(c => c === maxPerRow);

      expect(
        fullRows.length,
        'Las filas completas deben tener el mismo número de ítems por columna'
      ).toBeGreaterThan(0);
    });
  });

});
