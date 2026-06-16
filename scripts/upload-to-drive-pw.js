#!/usr/bin/env node
/**
 * upload-to-drive-pw.js
 *
 * Sube el bug report .docx a Google Drive usando Playwright.
 * No requiere Service Account ni credenciales de API — usa la sesión
 * de Google capturada con scripts/google-auth.js.
 *
 * Cómo funciona:
 *   1. Restaura la sesión de Google desde GOOGLE_STORAGE_STATE
 *   2. Navega a drive.google.com para activar los tokens OAuth
 *   3. Intercepta el Authorization Bearer que Drive genera internamente
 *   4. Usa ese token para subir el .docx via Drive API v3
 *   5. Escribe DRIVE_FILE_URL y DRIVE_FILE_NAME en GITHUB_ENV
 *
 * Variables de entorno:
 *   GOOGLE_STORAGE_STATE   JSON del storageState (GitHub Secret)
 *   DRIVE_FOLDER_ID        ID de la carpeta destino (default: carpeta del proyecto)
 *   BUG_REPORT_PATH        Ruta al .docx generado (escrita por generate-bug-report.js)
 */

'use strict';

const { chromium } = require('@playwright/test');
const fs           = require('fs');
const path         = require('path');

const FOLDER_ID    = process.env.DRIVE_FOLDER_ID   || '1owkw8j0LYPf-qql2R8D2WYqZakZyiYt1';
const STORAGE_RAW  = process.env.GOOGLE_STORAGE_STATE || '';
const REPORT_PATH  = process.env.BUG_REPORT_PATH   || '';
const GITHUB_ENV   = process.env.GITHUB_ENV         || '';

function writeGithubEnv(key, value) {
  if (GITHUB_ENV) fs.appendFileSync(GITHUB_ENV, `${key}=${value}\n`);
}

function bail(msg) {
  console.log(msg);
  writeGithubEnv('DRIVE_FILE_URL', '');
  writeGithubEnv('DRIVE_FILE_NAME', '');
}

async function main() {
  // ── Validaciones ──────────────────────────────────────────────────────────
  if (!STORAGE_RAW) {
    bail([
      '⚠️  GOOGLE_STORAGE_STATE no configurado — omitiendo upload a Drive.',
      '   Para activarlo:',
      '   1. Ejecuta localmente: node scripts/google-auth.js',
      '   2. Copia google-auth.json como secret GOOGLE_STORAGE_STATE en GitHub',
    ].join('\n'));
    return;
  }

  if (!REPORT_PATH || !fs.existsSync(REPORT_PATH)) {
    bail(`⚠️  Archivo "${REPORT_PATH}" no encontrado — omitiendo upload.`);
    return;
  }

  let storageState;
  try { storageState = JSON.parse(STORAGE_RAW); }
  catch { bail('❌ GOOGLE_STORAGE_STATE no es JSON válido.'); return; }

  // ── Playwright ────────────────────────────────────────────────────────────
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState });
  const page    = await context.newPage();

  // Interceptar el Authorization Bearer que Drive genera al cargar la página
  let authToken = null;
  page.on('request', req => {
    const auth = req.headers()['authorization'];
    if (auth && auth.startsWith('Bearer ') && !authToken) {
      authToken = auth;
    }
  });

  console.log('🌐 Navegando a Google Drive...');
  try {
    await page.goto(`https://drive.google.com/drive/folders/${FOLDER_ID}`, {
      waitUntil: 'networkidle',
      timeout:   30_000,
    });
  } catch {
    // networkidle puede timeout en Drive; intentar con domcontentloaded
    await page.goto(`https://drive.google.com/drive/folders/${FOLDER_ID}`, {
      waitUntil: 'domcontentloaded',
      timeout:   20_000,
    });
    await page.waitForTimeout(6_000); // Dar tiempo a las llamadas API de Drive
  }

  // Verificar que no fuimos redirigidos al login
  if (page.url().includes('accounts.google.com')) {
    await browser.close();
    bail([
      '❌ La sesión de Google expiró. Renuévala:',
      '   1. Ejecuta localmente: node scripts/google-auth.js',
      '   2. Actualiza el secret GOOGLE_STORAGE_STATE en GitHub',
    ].join('\n'));
    return;
  }

  if (!authToken) {
    // Segundo intento: esperar más llamadas API
    await page.waitForTimeout(5_000);
  }

  if (!authToken) {
    await browser.close();
    bail('❌ No se pudo interceptar el token de Google Drive. Intenta renovar la sesión.');
    return;
  }

  console.log('🔑 Token interceptado — subiendo archivo...');

  // ── Upload via Drive API v3 ───────────────────────────────────────────────
  const fileContent = fs.readFileSync(REPORT_PATH);
  const filename    = path.basename(REPORT_PATH);
  const fileBase64  = fileContent.toString('base64');

  const result = await page.evaluate(
    async ({ authToken, filename, folderId, fileBase64 }) => {
      try {
        // Base64 → Uint8Array → Blob
        const bytes = Uint8Array.from(atob(fileBase64), c => c.charCodeAt(0));
        const blob  = new Blob(
          [bytes],
          { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
        );

        const form = new FormData();
        form.append(
          'metadata',
          new Blob([JSON.stringify({ name: filename, parents: [folderId] })],
            { type: 'application/json' })
        );
        form.append('file', blob);

        const resp = await fetch(
          'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,name',
          { method: 'POST', headers: { Authorization: authToken }, body: form }
        );

        if (!resp.ok) {
          const text = await resp.text();
          return { ok: false, error: `HTTP ${resp.status}: ${text.slice(0, 300)}` };
        }

        return { ok: true, ...(await resp.json()) };
      } catch (err) {
        return { ok: false, error: err.message };
      }
    },
    { authToken, filename, folderId: FOLDER_ID, fileBase64 }
  );

  await browser.close();

  if (!result.ok) {
    bail(`❌ Upload fallido: ${result.error}`);
    return;
  }

  // Hacer el archivo accesible para cualquiera con el link
  // (si el token tiene permisos suficientes)
  const fileUrl  = result.webViewLink || `https://drive.google.com/file/d/${result.id}/view`;
  const fileName = result.name || filename;

  try {
    const browser2 = await chromium.launch({ headless: true });
    const ctx2     = await browser2.newContext({ storageState });
    const pg2      = await ctx2.newPage();

    await pg2.evaluate(
      async ({ authToken, fileId }) => {
        await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
          method:  'POST',
          headers: { Authorization: authToken, 'Content-Type': 'application/json' },
          body:    JSON.stringify({ type: 'anyone', role: 'reader' }),
        });
      },
      { authToken, fileId: result.id }
    );
    await browser2.close();
  } catch {
    // No crítico — el archivo está en la carpeta compartida de todas formas
  }

  console.log(`✅ Subido: ${fileName}`);
  console.log(`   🔗 ${fileUrl}`);

  writeGithubEnv('DRIVE_FILE_URL', fileUrl);
  writeGithubEnv('DRIVE_FILE_NAME', fileName);
}

main().catch(err => {
  console.error('❌ Error inesperado:', err.message);
  // No romper el pipeline
  writeGithubEnv('DRIVE_FILE_URL', '');
  writeGithubEnv('DRIVE_FILE_NAME', '');
  process.exit(0);
});
