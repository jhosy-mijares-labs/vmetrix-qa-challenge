import { test as base, request, APIRequestContext } from '@playwright/test';
import { ENV } from '../config/env';
import { DEFAULT_API_USER } from '../data/users';

type ApiFixtures = {
  /** Contexto público: baseURL pre-configurada, sin autenticación. */
  apiContext: APIRequestContext;
  /**
   * Contexto autenticado: hace login con DEFAULT_API_USER y adjunta
   * el header Authorization: Bearer <token> a todas las requests.
   * Usar para endpoints protegidos.
   */
  authContext: APIRequestContext;
};

export const test = base.extend<ApiFixtures>({
  apiContext: async ({}, use) => {
    const ctx = await request.newContext({ baseURL: ENV.API_BASE_URL });
    await use(ctx);
    await ctx.dispose();
  },

  authContext: async ({}, use) => {
    const loginCtx = await request.newContext({ baseURL: ENV.API_BASE_URL });
    const res = await loginCtx.post('/auth/login', {
      data: { username: DEFAULT_API_USER.username, password: DEFAULT_API_USER.password },
    });
    const { accessToken } = await res.json();
    await loginCtx.dispose();

    const ctx = await request.newContext({
      baseURL: ENV.API_BASE_URL,
      extraHTTPHeaders: { Authorization: `Bearer ${accessToken}` },
    });
    await use(ctx);
    await ctx.dispose();
  },
});

export { expect } from '@playwright/test';
