// Auditoría automática con axe-core (WCAG 2.1 A/AA) y escritura de AUDITORIA.md.
// Uso: node scripts/axe.js --axe=/ruta/a/axe.min.js [--rutas=/ruta/a/rutas.js]
const fs = require('fs'), path = require('path');
let chromium; try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const arg = k => (process.argv.find(a => a.startsWith('--' + k + '=')) || '').split('=')[1];
const rutas = arg('rutas') ? require(path.resolve(arg('rutas'))) : async () => {};
const AXE = fs.readFileSync(path.resolve(arg('axe')), 'utf8');
const BASE = 'http://localhost:8765/';
const casos = [
  ['Portada, escritorio 1440×900', 'index.html?ahora=2026-10-01T18:10', { width: 1440, height: 900 }],
  ['Portada, móvil 390×844', 'index.html?ahora=2026-10-01T18:10', { width: 390, height: 844 }],
  ['Portada, versión sobria + paleta granate', 'index.html?revision&ahora=2026-10-01T18:10', { width: 1440, height: 900 }, true],
  ['Portada, domingo (cerrado)', 'index.html?ahora=2026-10-04T11:00', { width: 1440, height: 900 }],
  ['Aviso legal', 'legal.html', { width: 1440, height: 900 }],
  ['404', '404.html', { width: 390, height: 844 }],
];
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const filas = []; let total = 0;
  for (const [nombre, url, vp, demo] of casos) {
    const ctx = await b.newContext({ viewport: vp, ignoreHTTPSErrors: true, isMobile: vp.width < 500, hasTouch: vp.width < 500 });
    await ctx.addInitScript(d => { localStorage.setItem('pegada-cookies', '1'); if (d) { localStorage.setItem('pegada-densidad', 'sobria'); localStorage.setItem('pegada-paleta', 'granate'); } }, !!demo);
    const p = await ctx.newPage(); await rutas(p);
    await p.goto(BASE + url); await p.waitForTimeout(4500);
    const alto = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < alto; y += 600) { await p.mouse.wheel(0, 600); await p.waitForTimeout(80); }
    await p.waitForTimeout(1500);
    await p.addScriptTag({ content: AXE });
    const r = await p.evaluate(async () => { const r = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } }); return { v: r.violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, ej: v.nodes.slice(0, 3).map(n => n.target.join(' ')) })), pases: r.passes.length }; });
    total += r.v.length;
    filas.push({ nombre, url, ...r });
    console.log(nombre, r.v.length ? JSON.stringify(r.v) : 'sin violaciones', '(' + r.pases + ' reglas pasadas)');
    await ctx.close();
  }
  await b.close();
  let md = '# Auditoría automática de accesibilidad\n\n> Sitio de demostración. Pegada es un negocio ficticio.\n\n';
  md += 'axe-core 4.10.2 inyectado con Playwright (Chromium), reglas `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` y `best-practice`. Antes de analizar se cierra el aviso de cookies y se recorre la página entera con la rueda, para que las apariciones y el anclaje estén en su estado final. Generado con `scripts/axe.js`.\n\n';
  md += '| Caso | Dirección | Violaciones | Reglas pasadas |\n|---|---|---|---|\n';
  filas.forEach(f => { md += `| ${f.nombre} | \`${f.url}\` | ${f.v.length ? f.v.map(v => `${v.id} (${v.impact}, ${v.n})`).join('; ') : '**0**'} | ${f.pases} |\n`; });
  md += '\nLimitaciones: axe es un analizador estático; no sustituye una pasada con lector de pantalla real (NVDA, VoiceOver), que no se ha hecho. El contraste de los tokens de color se calcula además con `scripts/contraste.js`.\n';
  fs.writeFileSync(path.join(__dirname, '..', 'AUDITORIA.md'), md);
  process.exit(total ? 1 : 0);
})();
