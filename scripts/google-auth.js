#!/usr/bin/env node
/**
 * google-auth.js — Ejecución local ONE-TIME
 *
 * Abre un navegador visible para que inicies sesión en Google Drive.
 * Cuando confirmas, guarda la sesión en google-auth.json.
 *
 * Ese archivo lo copias como secret en GitHub:
 *   Settings → Secrets and variables → Actions
 *   → New repository secret → GOOGLE_STORAGE_STATE → pegar el contenido
 *
 * NUNCA commitees google-auth.json (ya está en .gitignore).
 *
 * Uso:
 *   node scripts/google-auth.js
 */

'use strict';

const { chromium } = require('@playwright/test');
const fs           = require('fs');
const readline     = require('readline');

const OUTPUT = 'google-auth.json';

async function main() {
  console.log('\n🔐 VMetrix — Captura de sesión Google Drive\n');
  console.log('   Se abrirá un navegador Chrome. Inicia sesión en tu cuenta de Google.');
  console.log('   Asegúrate de que puedas ver la carpeta de Drive de destino.\n');

  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized'],
  });
  const context = await browser.newContext({ viewport: null });
  const page    = await context.newPage();

  await page.goto('https://drive.google.com', { waitUntil: 'domcontentloaded' });

  // Esperar a que el usuario inicie sesión y confirme
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  await new Promise(resolve =>
    rl.question(
      '📌 Cuando estés dentro de Google Drive y puedas ver tus archivos, presiona ENTER...\n',
      () => { rl.close(); resolve(); }
    )
  );

  // Capturar cookies + localStorage
  const state = await context.storageState();
  fs.writeFileSync(OUTPUT, JSON.stringify(state, null, 2));

  await browser.close();

  const sizeKB = Math.round(fs.statSync(OUTPUT).size / 1024);
  console.log(`\n✅ Sesión guardada en ${OUTPUT} (${sizeKB} KB)`);
  console.log('\n📋 Próximo paso — agrega el secret en GitHub:');
  console.log('   1. Abre: https://github.com/TU_REPO/settings/secrets/actions/new');
  console.log('   2. Name:  GOOGLE_STORAGE_STATE');
  console.log(`   3. Value: contenido de ${OUTPUT} (Ctrl+A, Ctrl+C en el archivo)\n`);
  console.log('⚠️  El secret dura ~30 días. Cuando expire, vuelve a correr este script.\n');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
