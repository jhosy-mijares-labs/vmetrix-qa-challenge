import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';
import { ENV } from '../../config/env';

test.describe('📦 Products API', () => {

  test('TC-API-04 | GET /products retorna array con total mayor a 0', async () => {
    await allure.epic('API Tests');
    await allure.feature('Productos');
    await allure.severity('critical');
    await allure.tag('positivo');

    const ctx = await request.newContext();

    await allure.step('Enviar GET /products', async () => {
      const response = await ctx.get(`${ENV.API_BASE_URL}/products`);

      await allure.step('Verificar status 200', async () => {
        expect(response.status()).toBe(200);
      });

      await allure.step('Verificar estructura del body', async () => {
        const body = await response.json();
        expect(body.products).toBeInstanceOf(Array);
        expect(body.total).toBeGreaterThan(0);
      });
    });
  });

  test('TC-API-06 | GET /products/9999 retorna 404 para ID inexistente', async () => {
    await allure.epic('API Tests');
    await allure.feature('Productos');
    await allure.severity('normal');
    await allure.tag('negativo');

    const ctx = await request.newContext();

    await allure.step('Enviar GET /products/9999', async () => {
      const response = await ctx.get(`${ENV.API_BASE_URL}/products/9999`);

      await allure.step('Verificar status 404', async () => {
        expect(response.status()).toBe(404);
      });

      await allure.step('Verificar mensaje de error en body', async () => {
        const body = await response.json();
        expect(body).toHaveProperty('message');
      });
    });
  });

  test('TC-API-07 | Paginación con limit=5&skip=0 retorna exactamente 5 productos', async () => {
    await allure.epic('API Tests');
    await allure.feature('Productos');
    await allure.severity('normal');
    await allure.tag('positivo');

    const ctx = await request.newContext();

    await allure.step('Enviar GET /products?limit=5&skip=0', async () => {
      const response = await ctx.get(`${ENV.API_BASE_URL}/products?limit=5&skip=0`);

      await allure.step('Verificar status 200', async () => {
        expect(response.status()).toBe(200);
      });

      await allure.step('Verificar que retorna exactamente 5 productos', async () => {
        const body = await response.json();
        expect(body.products).toHaveLength(5);
        expect(body.skip).toBe(0);
        expect(body.limit).toBe(5);
      });
    });
  });

});
