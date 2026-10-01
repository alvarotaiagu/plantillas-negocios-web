// Capturas de la versión sobria y de una paleta: node scripts/sobria.js salida [paleta]
const { chromium } = require('playwright');
const { BASE, rutas, rueda } = require('./comun');
(async () => {
  const [out, paleta = 'rubia', w = 1440, h = 900] = process.argv.slice(2);
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: +w, height: +h }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  await rutas(page);
  await page.addInitScript((p) => { localStorage.setItem('debandoira-cookies', 'ok'); localStorage.setItem('debandoira-maqueta', 'sobria'); localStorage.setItem('debandoira-paleta', p); }, paleta);
  await page.goto(BASE + '?revision', { waitUntil: 'load' });
  await page.waitForTimeout(3800);
  await page.screenshot({ path: out + '-0.png' });
  for (const sel of ['.pila-item:nth-child(2)', '#consulta', '#equipo']) {
    await page.evaluate((s) => window.__lenis ? window.__lenis.scrollTo(document.querySelector(s), { immediate: true, offset: -110 }) : document.querySelector(s).scrollIntoView(), sel);
    await rueda(page, 200, 100, 50);
    await page.waitForTimeout(1800);
    await page.screenshot({ path: out + '-' + sel.replace(/[^a-z]/g, '') + '.png' });
  }
  await b.close();
})();
