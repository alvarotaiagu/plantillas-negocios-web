// Captura de la portada con el ratón tirando del cabo: node scripts/portada.js ancho alto salida
const { chromium } = require('playwright');
const { BASE, rutas } = require('./comun');
(async () => {
  const [w, h, out] = process.argv.slice(2);
  const movil = +w < 600;
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: +w, height: +h }, isMobile: movil, hasTouch: movil, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  await rutas(page);
  await page.addInitScript(() => { try { localStorage.setItem('debandoira-cookies', 'ok'); } catch (e) {} });
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(3800);
  await page.screenshot({ path: out + '-a.png' });
  if (!movil) {
    const r = await page.locator('.portada-ovillo').boundingBox();
    for (let i = 0; i < 30; i++) { await page.mouse.move(r.x + r.width * (0.7 + i * 0.012), r.y + r.height * (0.6 + i * 0.01)); await page.waitForTimeout(30); }
    await page.waitForTimeout(400);
    await page.screenshot({ path: out + '-b.png' });
  }
  await b.close();
})();
