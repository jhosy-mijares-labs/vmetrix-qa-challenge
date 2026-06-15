import { allure } from 'allure-playwright';
import { test, expect } from '../../fixtures/apiFixtures';
import { DEFAULT_API_USER } from '../../data/users';

// Nota: este spec usa `apiContext` (sin auth) porque su propósito es
// verificar el comportamiento del propio endpoint de login.

test.describe('🔐 Auth API', () => {

  test('TC-API-01 | Login con credenciales válidas retorna token', async ({ apiContext }) => {
    await allure.epic('API Tests');
    await allure.feature('Autenticación');
    await allure.severity('blocker');
    await allure.tag('positivo');

    await allure.step('Enviar POST /auth/login con credenciales válidas', async () => {
      const response = await apiContext.post('/auth/login', {
        data: { username: DEFAULT_API_USER.username, password: DEFAULT_API_USER.password },
      });

      await allure.step('Verificar status 200', async () => {
        expect(response.status()).toBe(200);
      });

      await allure.step('Verificar que el body contiene accessToken', async () => {
        const body = await response.json();
        expect(body).toHaveProperty('accessToken');
        expect(body).toHaveProperty('refreshToken');
        expect(body.username).toBe(DEFAULT_API_USER.username);
      });
    });
  });

  test('TC-API-02 | Login con contraseña incorrecta retorna error', async ({ apiContext }) => {
    await allure.epic('API Tests');
    await allure.feature('Autenticación');
    await allure.severity('critical');
    await allure.tag('negativo');

    await allure.step('Enviar POST /auth/login con contraseña incorrecta', async () => {
      const response = await apiContext.post('/auth/login', {
        data: { username: DEFAULT_API_USER.username, password: 'wrongpassword' },
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
