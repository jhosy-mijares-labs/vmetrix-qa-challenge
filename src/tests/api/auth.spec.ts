import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';
import { ENV } from '../../config/env';

test.describe('🔐 Auth API', () => {

  test('TC-API-01 | Login con credenciales válidas retorna token', async () => {
    await allure.epic('API Tests');
    await allure.feature('Autenticación');
    await allure.severity('blocker');
    await allure.tag('positivo');

    const ctx = await request.newContext();

    await allure.step('Enviar POST /auth/login con credenciales válidas', async () => {
      const response = await ctx.post(`${ENV.API_BASE_URL}/auth/login`, {
        data: { username: ENV.API_USER, password: ENV.API_PASSWORD },
      });

      await allure.step('Verificar status 200', async () => {
        expect(response.status()).toBe(200);
      });

      await allure.step('Verificar que el body contiene accessToken', async () => {
        const body = await response.json();
        expect(body).toHaveProperty('accessToken');
        expect(body).toHaveProperty('refreshToken');
        expect(body.username).toBe(ENV.API_USER);
      });
    });
  });

  test('TC-API-02 | Login con contraseña incorrecta retorna error', async () => {
    await allure.epic('API Tests');
    await allure.feature('Autenticación');
    await allure.severity('critical');
    await allure.tag('negativo');

    const ctx = await request.newContext();

    await allure.step('Enviar POST /auth/login con contraseña incorrecta', async () => {
      const response = await ctx.post(`${ENV.API_BASE_URL}/auth/login`, {
        data: { username: ENV.API_USER, password: 'wrongpassword' },
      });

      await allure.step('Verificar status 400', async () => {
        expect(response.status()).toBe(400);
      });

      await allure.step('Verificar que el body contiene mensaje de error', async () => {
        const body = await response.json();
        expect(body).toHaveProperty('message');
      });
    });
  });

});
