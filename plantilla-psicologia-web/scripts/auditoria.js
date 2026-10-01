// Auditoría automática de accesibilidad con axe-core: portada (escritorio y
// móvil, recorrida con la rueda y con el aviso de cookies cerrado), versión
// sobria, aviso legal y 404. Escribe screenshots/axe.json.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { BASE, rutas, rueda } = require('./comun');
const AXE = require.resolve('axe-core/axe.min.js');
(async () => {
  const b = await chromium.launch();
  const casos = [
    ['portada escritorio', '', 1440, 900, null],
    ['portada móvil', '', 390, 844, null],
    ['portada sobria', '?revision', 1440, 900, 'sobria'],
    ['aviso legal', 'legal.html', 1440, 900, null],
    ['404', 'no-existe', 1440, 900, null],
  ];
  const salida = {};
  for (const [nombre, ruta, w, h, maqueta] of casos) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 600, hasTouch: w < 600, ignoreHTTPSErrors: true });
    const page = await ctx.newPage();
    await rutas(page);
    await page.addInitScript((m) => { localStorage.setItem('debandoira-cookies', 'ok'); if (m) localStorage.setItem('debandoira-maqueta', m); }, maqueta);
    await page.goto(BASE + ruta, { waitUntil: 'load' });
    await page.waitForTimeout(3500);
    if (!ruta || ruta === '?revision') { await rueda(page, 16000, 400, 40); await page.waitForTimeout(1500); }
    await page.addScriptTag({ path: AXE });
    const r = await page.evaluate(async () => {
      const res = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } });
      return { violaciones: res.violations.map((v) => ({ id: v.id, impacto: v.impact, nodos: v.nodes.length, ejemplo: v.nodes[0] && v.nodes[0].target.join(' '), resumen: v.nodes[0] && v.nodes[0].failureSummary })), pasan: res.passes.length, incompletas: res.incomplete.map((v) => v.id) };
    });
    salida[nombre] = r;
    console.log(`${nombre}: ${r.violaciones.length} violaciones, ${r.pasan} reglas pasan` + (r.violaciones.length ? '\n  ' + r.violaciones.map((v) => `${v.id} (${v.impacto}, ${v.nodos}) ${v.ejemplo} — ${(v.resumen || '').split('\n').slice(0, 2).join(' ')}`).join('\n  ') : ''));
    await ctx.close();
  }
  fs.writeFileSync(path.join(__dirname, '..', 'screenshots', 'axe.json'), JSON.stringify(salida, null, 2));
  await b.close();
})();
