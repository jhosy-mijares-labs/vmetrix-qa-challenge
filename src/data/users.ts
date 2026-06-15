/**
 * Perfiles de usuario del sistema.
 *
 * Cada usuario agrupa sus credenciales + sus datos personales (nombre, zip)
 * porque esos datos son propios del usuario, no del flujo de checkout.
 *
 * Para correr los mismos tests con múltiples usuarios:
 *
 *   import { UI_USERS } from '../../data/users';
 *
 *   for (const user of Object.values(UI_USERS).filter(u => u.canLogin)) {
 *     test.describe(`[${user.role}]`, () => {
 *       test.use({ storageState: `.auth/${user.role}.json` });
 *       // mismo bloque de tests para cada usuario
 *     });
 *   }
 */

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type UiUser = {
  username:  string;
  password:  string;
  role:      string;
  canLogin:  boolean;   // false para usuarios que deben fallar el login (e.g. locked_out)
  // Datos personales usados en formularios (checkout, perfil, etc.)
  firstName: string;
  lastName:  string;
  zip:       string;
};

export type ApiUser = {
  username: string;
  password: string;
  role:     string;
};

// ─── Usuarios UI (SauceDemo) ─────────────────────────────────────────────────

export const UI_USERS: Record<string, UiUser> = {
  STANDARD: {
    username:  'standard_user',
    password:  'secret_sauce',
    role:      'standard',
    canLogin:  true,
    firstName: 'Ana',
    lastName:  'García',
    zip:       '10001',
  },
  LOCKED_OUT: {
    username:  'locked_out_user',
    password:  'secret_sauce',
    role:      'locked_out',
    canLogin:  false,        // login bloqueado — solo válido para tests negativos de auth
    firstName: 'Ana',
    lastName:  'García',
    zip:       '10001',
  },
  PROBLEM: {
    username:  'problem_user',
    password:  'secret_sauce',
    role:      'problem',
    canLogin:  true,
    firstName: 'Ana',
    lastName:  'García',
    zip:       '10001',
  },
  PERFORMANCE_GLITCH: {
    username:  'performance_glitch_user',
    password:  'secret_sauce',
    role:      'performance_glitch',
    canLogin:  true,
    firstName: 'Ana',
    lastName:  'García',
    zip:       '10001',
  },
  ERROR: {
    username:  'error_user',
    password:  'secret_sauce',
    role:      'error',
    canLogin:  true,
    firstName: 'Ana',
    lastName:  'García',
    zip:       '10001',
  },
  VISUAL: {
    username:  'visual_user',
    password:  'secret_sauce',
    role:      'visual',
    canLogin:  true,
    firstName: 'Ana',
    lastName:  'García',
    zip:       '10001',
  },
};

// ─── Usuarios API (DummyJSON) ─────────────────────────────────────────────────

export const API_USERS: Record<string, ApiUser> = {
  EMILY: {
    username: 'emilys',
    password: 'emilyspass',
    role:     'admin',
  },
};

// ─── Defaults para tests de usuario único ────────────────────────────────────

/** Usuario UI por defecto para tests que no requieren variación de rol */
export const DEFAULT_UI_USER  = UI_USERS.STANDARD;

/** Usuario API por defecto */
export const DEFAULT_API_USER = API_USERS.EMILY;
