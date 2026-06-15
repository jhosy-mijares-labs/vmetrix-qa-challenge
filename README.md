# VMetrix QA Automation Challenge

Framework de automatización de pruebas UI y API usando **Playwright + TypeScript + Allure**.

---

## 🧰 Stack Tecnológico

| Herramienta | Versión | Uso |
|---|---|---|
| Node.js | ≥ 18.x | Runtime |
| TypeScript | ^5.4 | Lenguaje |
| Playwright | ^1.44 | UI & API Testing |
| Allure | ^2.x | Reportes |
| Java | ≥ 17 | Requerido por Allure CLI |

---

## 📁 Estructura del Proyecto

```
vmetrix-qa-challenge/
├── playwright.config.ts       # Configuración global
├── tsconfig.json
├── package.json
└── src/
    ├── pages/                 # Page Object Model
    │   ├── BasePage.ts
    │   ├── InventoryPage.ts
    │   ├── CartPage.ts
    │   └── CheckoutPage.ts
    └── tests/
        ├── ui/
        │   ├── cart.spec.ts       # TC-UI-01, 02, 03
        │   └── checkout.spec.ts   # TC-UI-04, 07, 08, 10
        └── api/
            ├── auth.spec.ts       # TC-API-01, 02
            ├── products.spec.ts   # TC-API-04, 06, 07
            └── users.spec.ts      # TC-API-08
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

## ▶️ Ejecución de Tests

```bash
# Solo tests UI
npm run test:ui

# Solo tests API
npm run test:api

# Todos los tests
npm run test:all
```

---

## 📊 Ver Reporte Allure

```bash
# Generar y abrir el reporte
npm run report
```

O paso a paso:
```bash
npm run report:generate   # Genera el HTML
npm run report:open       # Abre en el navegador
```

---

## 🌐 Aplicaciones bajo prueba

| App | URL |
|---|---|
| SauceDemo (UI) | https://www.saucedemo.com |
| DummyJSON (API) | https://dummyjson.com |

**Credenciales UI:** `standard_user` / `secret_sauce`  
**Credenciales API:** `emilys` / `emilyspass`

---

## 📋 Cobertura de Tests

| Suite | Total | Positivos | Negativos | Automatizados |
|---|---|---|---|---|
| UI Tests | 10 | 7 | 3 | 5 |
| API Tests | 10 | 7 | 3 | 5 |
| **Total** | **20** | **14** | **6** | **10** |
