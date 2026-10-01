// Fotogramas del ovillo devanándose con el scroll y del titular tensándose
const { chromium } = require('playwright');
const { BASE, rutas } = require('./comun');
(async () => {
  const out = process.argv[2];
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true });
  await rutas(page);
  await page.addInitScript(() => localStorage.setItem('debandoira-cookies', 'ok'));
  await page.goto(BASE); await page.waitForTimeout(3800);
  const fig = await page.locator('.portada-ovillo').boundingBox();
  await page.mouse.move(fig.x + fig.width * 0.8, fig.y + fig.height * 0.7);
  for (let i = 0; i < 40; i++) { await page.mouse.move(Math.min(1430, fig.x + fig.width * (0.75 + i * 0.006)), Math.min(890, fig.y + fig.height * (0.55 + i * 0.01))); await page.waitForTimeout(30); }
  await page.waitForTimeout(300);
  await page.screenshot({ path: out + '-tension.png' });
  console.log(await page.evaluate(() => [document.querySelector('.titulo-portada').style.fontVariationSettings, window.__ovillo.estado()]), fig);
  await page.mouse.move(10, 10);
  for (const y of [250, 500]) { await page.mouse.wheel(0, 250); await page.waitForTimeout(1500); await page.screenshot({ path: out + '-scroll' + y + '.png' }); }
  await b.close();
})();
