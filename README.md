# VMetrix QA Automation Challenge

Framework de automatización de pruebas UI y API usando **Playwright + TypeScript + Allure**.

[![Allure Report](https://img.shields.io/badge/Allure%20Report-live-brightgreen)](https://jhosy-mijares-labs.github.io/vmetrix-qa-challenge/)

---

## 🧰 Stack Tecnológico

| Herramienta | Versión | Uso |
|---|---|---|
| Node.js | 24 | Runtime |
| TypeScript | ^5.4 | Lenguaje principal |
| JavaScript | ES2022 | Scripts de automatización (bug report) |
| Playwright | ^1.61 | UI & API Testing |
| Allure | ^3.10 | Reportes |
| Java | ≥ 17 | Requerido por Allure CLI |

---

## 📁 Estructura del Proyecto

```
vmetrix-qa-challenge/
├── .github/
│   └── workflows/
│       ├── run-ui-tests.yml        # 🎭 UI Tests + Allure Report
│       └── run-api-tests.yml       # 🎭 API Tests + Allure Report
├── playwright.config.ts            # Configuración global + proyectos por usuario
├── global-setup.ts                 # Login previo → genera .auth/<role>.json
├── tsconfig.json
├── package.json
├── scripts/
│   └── generate-bug-report.js      # Lee allure-results y genera .docx con fallos (solo UI)
└── src/
    ├── config/
    │   └── env.ts
    ├── data/
    │   ├── users.ts                # Perfiles UI y API
    │   ├── products.ts             # Constantes de productos
    │   └── checkout.ts             # Datos de formularios
    ├── fixtures/
    │   ├── uiFixtures.ts           # Fixtures de UI (InventoryPage, CartPage, CheckoutPage)
    │   ├── apiFixtures.ts          # Fixtures de API
    │   └── index.ts
    ├── pages/                      # Page Object Model
    │   ├── BasePage.ts
    │   ├── LoginPage.ts
    │   ├── InventoryPage.ts
    │   ├── CartPage.ts
    │   └── CheckoutPage.ts
    └── tests/
        ├── ui/
        │   ├── cart.spec.ts        # TC-UI-01, 02, 03
        │   ├── checkout.spec.ts    # TC-UI-04, 07, 08, 10
        │   └── inventory.spec.ts   # TC-UI-11, 12, 13
        └── api/
            ├── auth.spec.ts        # TC-API-01, 02
            ├── products.spec.ts    # TC-API-04, 06, 07
            └── users.spec.ts       # TC-API-08
```

---

## ⚙️ Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/jhosy-mijares-labs/vmetrix-qa-challenge.git
cd vmetrix-qa-challenge

# 2. Instalar dependencias
npm install

# 3. Instalar browsers de Playwright
npx playwright install chromium

# 4. Instalar Allure CLI (requiere Java 17+)
npm install -g allure-commandline
```

---

## 👤 Usuarios

### UI — SauceDemo

El framework genera un proyecto Playwright por cada usuario con `canLogin: true`. Los tests UI se ejecutan una vez por usuario de forma automática.

| Clave | Username | Comportamiento |
|---|---|---|
| `STANDARD` | `standard_user` | Flujo normal, sin errores |
| `LOCKED_OUT` | `locked_out_user` | Login bloqueado — solo para tests negativos de auth |
| `PROBLEM` | `problem_user` | Imágenes rotas, comportamiento errático |
| `PERFORMANCE_GLITCH` | `performance_glitch_user` | Respuestas lentas en todas las acciones |
| `ERROR` | `error_user` | Botones que no responden, sort sin efecto |
| `VISUAL` | `visual_user` | Elementos del header fuera de posición |

> Para agregar un nuevo usuario basta con añadirlo en `src/data/users.ts`. El `global-setup` y el config lo detectan automáticamente.

### API — DummyJSON

| Clave | Username | Rol |
|---|---|---|
| `EMILY` | `emilys` | admin |

---

## ▶️ Ejecución de Tests

### Todos los tests

```bash
npm run test:all
```

### Solo API

```bash
npm run test:api
```

### UI — todos los usuarios

```bash
npm run test:ui
```

### UI — por usuario específico

```bash
npm run test:ui:standard
npm run test:ui:problem
npm run test:ui:performance
npm run test:ui:error
npm run test:ui:visual
```

### UI — por feature

**Cart** — usuarios `standard`, `problem` y `performance_glitch`

```bash
npm run test:cart
```

**Checkout** — usuarios `standard`, `problem` y `performance_glitch`

```bash
npm run test:checkout
```

**Inventory** — usuarios `standard`, `error` y `visual`

```bash
npm run test:inventory
```

---

## 🚀 GitHub Actions

El repositorio tiene dos workflows independientes que se ejecutan manualmente desde la pestaña **Actions**:

| Workflow | Archivo | Inputs |
|---|---|---|
| 🎭 UI Tests + Allure Report | `run-ui-tests.yml` | `run_by` (feature / user), `feature`, `user` |
| 🎭 API Tests + Allure Report | `run-api-tests.yml` | `feature` (all, auth, products, users) |

Ambos publican el reporte Allure en GitHub Pages al finalizar.

---

## 📊 Reportes Allure

### 🌐 Reporte en vivo (CI)

Cada ejecución en GitHub Actions publica automáticamente el reporte en GitHub Pages:

**[👉 Ver último reporte](https://jhosy-mijares-labs.github.io/vmetrix-qa-challenge/)**

> Cada run se despliega en su propia URL versionada (`/run-N/`). La URL raíz siempre redirige al reporte más reciente, sin problemas de caché para ningún visitante. El historial de tendencias se mantiene entre ejecuciones.

### 💻 Local

Para generar y abrir el reporte después de cualquier ejecución:

```bash
npm run report
```

O paso a paso:

```bash
npm run report:generate   # Genera el HTML en allure-report/
npm run report:open       # Abre en el navegador
```

> ⚠️ Siempre usar los scripts `npm run test:*` en lugar de `npx playwright test` directamente: los scripts incluyen `clean:results` para evitar que resultados de runs anteriores contaminen el reporte.

---

## 📋 Referencia completa de scripts

| Script | Descripción |
|---|---|
| `test:all` | Todos los tests (UI + API, todos los usuarios) |
| `test:ui` | UI tests con todos los usuarios |
| `test:ui:standard` | UI tests solo con `standard_user` |
| `test:ui:problem` | UI tests solo con `problem_user` |
| `test:ui:performance` | UI tests solo con `performance_glitch_user` |
| `test:ui:error` | UI tests solo con `error_user` |
| `test:ui:visual` | UI tests solo con `visual_user` |
| `test:cart` | Solo `cart.spec.ts` con `standard`, `problem` y `performance_glitch` |
| `test:checkout` | Solo `checkout.spec.ts` con `standard`, `problem` y `performance_glitch` |
| `test:inventory` | Solo `inventory.spec.ts` con standard, error y visual |
| `test:api` | Todos los tests de API |
| `test:api:auth` | Solo `api/auth.spec.ts` |
| `test:api:products` | Solo `api/products.spec.ts` |
| `test:api:users` | Solo `api/users.spec.ts` |
| `test:report` | `test:all` + genera y abre reporte |
| `report` | Genera y abre el reporte desde resultados existentes |
| `report:generate` | Solo genera el HTML de Allure |
| `report:open` | Solo abre el reporte generado |

---

## 🐞 Bug Report automático

Al finalizar cada ejecución del workflow **🎭 UI Tests + Allure Report**, se genera automáticamente un reporte de bugs en `.docx` con los tests fallidos y se publica como artifact del run.

### Cómo funciona

`scripts/generate-bug-report.js` lee los archivos `allure-results/*.json`, detecta los tests fallidos y genera un archivo `BugReport_<timestamp>.docx`. El workflow lo sube como artifact `bug-report-run-N` con 30 días de retención.

### Dónde descargarlo

En la página del workflow run → sección **Artifacts** → `bug-report-run-N`. No requiere ninguna configuración adicional.

---

## 🌐 Aplicaciones bajo prueba

| App | URL |
|---|---|
| SauceDemo (UI) | https://www.saucedemo.com |
| DummyJSON (API) | https://dummyjson.com |

---

## 📋 Casos de Prueba

La documentación completa de casos de prueba (diseñados y automatizados) está en Google Sheets:

**[📊 Ver Test Cases — VMetrix QA Challenge](https://docs.google.com/spreadsheets/d/1nQJZk9mkvMKX5m_l_f-S1XRM-0rxE3ty/edit?gid=636645568#gid=636645568)**

El documento incluye:
- **🖥️ UI Test Cases** — 13 casos (Carrito, Checkout, Inventario) con usuarios asignados por test
- **🔌 API Test Cases** — 10 casos (Auth, Productos, Usuarios) con usuario API y contexto de autenticación
- **📊 Resumen** — cobertura total, distribución por módulo y cobertura por usuario UI

### Resumen rápido

| Suite | Total | Automatizados | Pendientes |
|---|---|---|---|
| 🖥️ UI Tests | 13 | 10 | 3 |
| 🔌 API Tests | 10 | 6 | 4 |
| **Total** | **23** | **16** | **7** |
