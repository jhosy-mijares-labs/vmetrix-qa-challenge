import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';
import { ENV } from '../../config/env';

test.describe('👤 Users API', () => {

  test('TC-API-08 | GET /users retorna lista de usuarios con campos básicos', async () => {
    await allure.epic('API Tests');
    await allure.feature('Usuarios');
    await allure.severity('normal');
    await allure.tag('positivo');

    const ctx = await request.newContext();

    await allure.step('Enviar GET /users', async () => {
      const response = await ctx.get(`${ENV.API_BASE_URL}/users`);

      await allure.step('Verificar status 200', async () => {
        expect(response.status()).toBe(200);
      });

      await allure.step('Verificar estructura del primer usuario', async () => {
        const body = await response.json();
        expect(body.users).toBeInstanceOf(Array);
        expect(body.users.length).toBeGreaterThan(0);

        const first = body.users[0];
        expect(first).toHaveProperty('id');
        expect(first).toHaveProperty('firstName');
        expect(first).toHaveProperty('lastName');
        expect(first).toHaveProperty('email');
      });
    });
  });

});
