/**
 * Barrel de fixtures.
 *
 * Cada capa importa desde su archivo específico — no se combinan en un
 * solo `test` porque page objects y API contexts son independientes:
 *
 *   UI specs:   import { test, expect } from '../../fixtures/uiFixtures';
 *   API specs:  import { test, expect } from '../../fixtures/apiFixtures';
 *
 * Re-exports con alias por si alguna utilidad necesita ambos en el mismo archivo:
 */
export { test as uiTest, expect } from './uiFixtures';
export { test as apiTest }        from './apiFixtures';
