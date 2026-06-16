#!/usr/bin/env node
/**
 * generate-bug-report.js
 *
 * Lee allure-results/*.json, detecta tests fallidos y genera un .docx
 * con el reporte de bugs incluyendo capturas de pantalla, usuario, y criticidad.
 *
 * Uso:
 *   node scripts/generate-bug-report.js [--output <filename>] [--run-info <string>]
 *
 * El script escribe BUG_REPORT_PATH y BUG_COUNT en GITHUB_ENV si está en CI.
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, AlignmentType, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageBreak, PageNumber, Footer, Header,
} = require('docx');

// ── CLI args ──────────────────────────────────────────────────────────────────
const args    = process.argv.slice(2);
const getArg  = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const NOW     = new Date();
const TS      = NOW.toISOString().replace(/[:.]/g, '_').slice(0, 19);

const RESULTS_DIR = path.resolve(process.cwd(), 'allure-results');
const OUTPUT_FILE = getArg('--output') || `BugReport_${TS}.docx`;
const RUN_INFO    = getArg('--run-info') || 'Ejecución local';
const GENERATED   = NOW.toLocaleString('es-ES', {
  timeZone: 'America/Bogota', dateStyle: 'long', timeStyle: 'short',
});

// ── Paleta ───────────────────────────────────────────────────────────────────
const C = {
  primary:  '1F3864',
  accent:   '2E75B6',
  alto:     'C00000',
  medio:    'C55A00',
  bajo:     '375623',
  row_alt:  'EDF3FB',
  border:   'BDD7EE',
  text:     '1F1F1F',
  gray:     '595959',
  code_bg:  'F2F2F2',
  white:    'FFFFFF',
};

const SEV = {
  blocker:  { label: 'ALTO',  bg: C.alto  },
  critical: { label: 'ALTO',  bg: C.alto  },
  normal:   { label: 'MEDIO', bg: C.medio },
  minor:    { label: 'BAJO',  bg: C.bajo  },
  trivial:  { label: 'BAJO',  bg: C.bajo  },
};

const USERS = {
  standard:           'standard_user',
  problem:            'problem_user',
  performance_glitch: 'performance_glitch_user',
  error:              'error_user',
  visual:             'visual_user',
};

// ── Helpers de estilo ─────────────────────────────────────────────────────────
const b = (color = C.border) => ({ style: BorderStyle.SINGLE, size: 1, color });
const cellBorders = (color) => { const s = b(color); return { top: s, bottom: s, left: s, right: s }; };

function labelCell(text, bg, w = 2200) {
  return new TableCell({
    borders: cellBorders(bg),
    width: { size: w, type: WidthType.DXA },
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 140, right: 140 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: true, color: C.white, size: 18, font: 'Arial' })],
    })],
  });
}

function valueCell(text, w = 2560, bg = C.white) {
  return new TableCell({
    borders: cellBorders(C.border),
    width: { size: w, type: WidthType.DXA },
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 140, right: 140 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      children: [new TextRun({ text, size: 20, font: 'Arial', color: C.text })],
    })],
  });
}

const sectionLabel = (text) => new Paragraph({
  spacing: { before: 160, after: 80 },
  children: [new TextRun({ text, bold: true, color: C.accent, size: 20, font: 'Arial' })],
});

const bodyPara = (text, opts = {}) => new Paragraph({
  spacing: { before: 60, after: 60 },
  children: [new TextRun({ text, size: 20, font: 'Arial', color: C.text, ...opts })],
});

const codeLine = (text) => new Paragraph({
  spacing: { before: 0, after: 0 },
  indent:  { left: 360 },
  shading: { fill: C.code_bg, type: ShadingType.CLEAR },
  children: [new TextRun({ text, font: 'Courier New', size: 16, color: C.text })],
});

const divider = () => new Paragraph({
  spacing: { before: 0, after: 0 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.border, space: 4 } },
  children: [],
});

// ── Leer fallos de allure-results ─────────────────────────────────────────────
function readFailures() {
  if (!fs.existsSync(RESULTS_DIR)) {
    console.warn(`⚠️  No se encontró ${RESULTS_DIR}`);
    return [];
  }

  const files = fs.readdirSync(RESULTS_DIR).filter(f => f.endsWith('-result.json'));
  const seen  = new Set();
  const bugs  = [];

  for (const file of files) {
    let data;
    try { data = JSON.parse(fs.readFileSync(path.join(RESULTS_DIR, file), 'utf8')); }
    catch { continue; }

    if (!['failed', 'broken'].includes(data.status)) continue;

    const labels  = Object.fromEntries((data.labels || []).map(l => [l.name, l.value]));
    const parent  = labels.parentSuite || '';
    const userKey = parent.replace(/^UI \[/, '').replace(/\]$/, '');
    const key     = `${data.name}::${userKey}`;
    if (seen.has(key)) continue;
    seen.add(key);

    // Buscar screenshot en los steps
    let screenshotPath = null;
    for (const step of data.steps || []) {
      for (const att of step.attachments || []) {
        if (att.name === 'screenshot' || /png/i.test(att.type || '')) {
          const p = path.join(RESULTS_DIR, att.source || '');
          if (fs.existsSync(p)) { screenshotPath = p; break; }
        }
      }
      if (screenshotPath) break;
    }

    bugs.push({
      id:             `BUG-UI-${String(bugs.length + 1).padStart(2, '0')}`,
      name:           data.name || '',
      severity:       labels.severity || 'normal',
      feature:        labels.feature  || '',
      userKey,
      message:        (data.statusDetails?.message || '').slice(0, 900),
      screenshotPath,
    });
  }

  return bugs;
}

// ── Sección por bug ───────────────────────────────────────────────────────────
function bugSection(bug, isFirst) {
  const sev      = SEV[bug.severity] || SEV.normal;
  const username = USERS[bug.userKey] || bug.userKey;
  const tcId     = bug.name.match(/^(TC-UI-\d+)/)?.[1] || '';
  const title    = bug.name.replace(/^TC-UI-\d+ \| /, '');

  const items = [];

  // Encabezado
  items.push(
    new Paragraph({
      pageBreakBefore: !isFirst,
      spacing: { before: 0, after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: C.accent, space: 8 } },
      children: [
        new TextRun({ text: `${bug.id}  `, bold: true, size: 30, color: C.primary, font: 'Arial' }),
        new TextRun({ text: title, size: 26, color: C.accent, font: 'Arial' }),
      ],
    }),
    new Paragraph({ spacing: { before: 160, after: 80 }, children: [] }),
  );

  // Tabla de metadatos  (2 cols × 3 filas, 9360 total)
  const W = { label: 2200, value: 2480 }; // 2 pares = 9360
  items.push(new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [W.label, W.value, W.label, W.value],
    rows: [
      new TableRow({ children: [
        labelCell('Criticidad', sev.bg, W.label),
        valueCell(sev.label, W.value, C.row_alt),
        labelCell('Usuario', C.primary, W.label),
        valueCell(username, W.value, C.row_alt),
      ]}),
      new TableRow({ children: [
        labelCell('Módulo', C.accent, W.label),
        valueCell(bug.feature, W.value),
        labelCell('URL', C.accent, W.label),
        valueCell('https://www.saucedemo.com', W.value),
      ]}),
      new TableRow({ children: [
        labelCell('Estado', '375623', W.label),
        valueCell('Abierto', W.value, C.row_alt),
        labelCell('Test ID', '595959', W.label),
        valueCell(tcId, W.value, C.row_alt),
      ]}),
    ],
  }));

  items.push(new Paragraph({ spacing: { before: 200, after: 0 }, children: [] }));

  // Mensaje de error
  items.push(sectionLabel('Mensaje de Error'));
  const lines = (bug.message || 'Sin detalle disponible').split('\n');
  items.push(...lines.map(codeLine));

  items.push(new Paragraph({ spacing: { before: 200, after: 80 }, children: [] }));

  // Screenshot
  items.push(sectionLabel('Captura de Pantalla'));
  if (bug.screenshotPath) {
    try {
      const imgData = fs.readFileSync(bug.screenshotPath);
      items.push(new Paragraph({
        spacing: { before: 80, after: 80 },
        children: [new ImageRun({
          type: 'png',
          data: imgData,
          transformation: { width: 560, height: 336 },
          altText: { title: bug.id, description: title, name: `screenshot-${bug.id}` },
        })],
      }));
    } catch (e) {
      items.push(bodyPara(`[Captura no disponible: ${e.message}]`, { italics: true, color: C.gray }));
    }
  } else {
    items.push(bodyPara('[Sin captura — verificar configuración de screenshot en Playwright]',
      { italics: true, color: C.gray }));
  }

  return items;
}

// ── Portada ───────────────────────────────────────────────────────────────────
function buildCover(bugs) {
  const alto  = bugs.filter(b => (SEV[b.severity] || SEV.normal).label === 'ALTO').length;
  const medio = bugs.filter(b => (SEV[b.severity] || SEV.normal).label === 'MEDIO').length;
  const bajo  = bugs.filter(b => (SEV[b.severity] || SEV.normal).label === 'BAJO').length;

  return [
    new Paragraph({ spacing: { before: 1200, after: 280 }, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Reporte de Bugs — UI Tests', bold: true, size: 56, color: C.primary, font: 'Arial' })] }),
    new Paragraph({ spacing: { before: 0, after: 100 }, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'VMetrix QA Challenge · SauceDemo', size: 32, color: C.accent, font: 'Arial' })] }),
    divider(),
    new Paragraph({ spacing: { before: 200, after: 60 }, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `Generado: ${GENERATED}`, size: 22, color: C.gray, font: 'Arial' })] }),
    new Paragraph({ spacing: { before: 0, after: 60 }, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `Ejecución: ${RUN_INFO}`, size: 22, color: C.gray, font: 'Arial' })] }),
    new Paragraph({ spacing: { before: 0, after: 500 }, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'App: https://www.saucedemo.com', size: 22, color: C.accent, font: 'Arial' })] }),

    // Tabla resumen
    new Paragraph({ spacing: { before: 0, after: 160 }, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Resumen de Ejecución', bold: true, size: 28, color: C.primary, font: 'Arial' })] }),
    new Table({
      width: { size: 5760, type: WidthType.DXA },
      columnWidths: [2880, 2880],
      rows: [
        new TableRow({ children: [labelCell('Total de Bugs', C.primary, 2880), valueCell(String(bugs.length), 2880)] }),
        new TableRow({ children: [labelCell('Criticidad ALTO',  C.alto,  2880), valueCell(String(alto),  2880, C.row_alt)] }),
        new TableRow({ children: [labelCell('Criticidad MEDIO', C.medio, 2880), valueCell(String(medio), 2880)] }),
        new TableRow({ children: [labelCell('Criticidad BAJO',  C.bajo,  2880), valueCell(String(bajo),  2880, C.row_alt)] }),
      ],
    }),

    ...(bugs.length === 0
      ? [new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: '✅ Sin fallos detectados en esta ejecución.', bold: true, size: 26, color: C.bajo, font: 'Arial' })] })]
      : []),

    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const bugs = readFailures();
  console.log(`\n🔍 Fallos encontrados: ${bugs.length}`);
  bugs.forEach(b => console.log(`   [${(SEV[b.severity] || SEV.normal).label}] ${b.id} | ${b.userKey} | ${b.name.slice(0, 60)}`));

  const bugChildren = [];
  for (let i = 0; i < bugs.length; i++) {
    bugChildren.push(...bugSection(bugs[i], i === 0));
  }

  const doc = new Document({
    styles: {
      default: { document: { run: { font: 'Arial', size: 20, color: C.text } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 32, bold: true, font: 'Arial', color: C.primary },
          paragraph: { spacing: { before: 240, after: 180 }, outlineLevel: 0 } },
      ],
    },
    sections: [{
      properties: {
        page: {
          size:   { width: 12240, height: 15840 },
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.border, space: 4 } },
            children: [
              new TextRun({ text: 'VMetrix QA Challenge', size: 16, color: C.gray, font: 'Arial' }),
              new TextRun({ text: '   |   Bug Report — UI Tests', size: 16, color: C.accent, font: 'Arial' }),
            ],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.border, space: 4 } },
            children: [
              new TextRun({ text: `${GENERATED}   |   Página `, size: 16, color: C.gray, font: 'Arial' }),
              new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.gray, font: 'Arial' }),
            ],
          })],
        }),
      },
      children: [...buildCover(bugs), ...bugChildren],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUTPUT_FILE, buffer);

  console.log(`\n✅ Reporte generado: ${OUTPUT_FILE}`);

  // Exportar vars para el workflow
  if (process.env.GITHUB_ENV) {
    fs.appendFileSync(process.env.GITHUB_ENV,
      `BUG_REPORT_PATH=${OUTPUT_FILE}\nBUG_COUNT=${bugs.length}\n`);
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
