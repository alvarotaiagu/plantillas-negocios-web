// Capturas rápidas de trabajo: node scripts/ojeada.js [ancho] [alto] [prefijo]
const { chromium } = require('playwright');
const { BASE, rutas, rueda } = require('./comun');
(async () => {
  const [w = 1440, h = 900, pre = 'o'] = process.argv.slice(2);
  const movil = +w < 600;
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: +w, height: +h }, isMobile: movil, hasTouch: movil, deviceScaleFactor: 1, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  const errores = [];
  page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
  page.on('pageerror', (e) => errores.push(String(e)));
  page.on('response', (r) => { if (r.status() >= 400) errores.push(r.status() + ' ' + r.url()); });
  await rutas(page);
  await page.goto(BASE + (process.env.Q || ''), { waitUntil: 'load' });
  await page.waitForTimeout(3600);
  const out = process.env.OUT || '/tmp/ojeada';
  require('fs').mkdirSync(out, { recursive: true });
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  let i = 0;
  await page.screenshot({ path: `${out}/${pre}-${String(i++).padStart(2, '0')}.png` });
  for (let y = 0; y < H; y += +h * 0.9) {
    await rueda(page, +h * 0.9, 150, 30);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${out}/${pre}-${String(i++).padStart(2, '0')}.png` });
    const fin = await page.evaluate(() => scrollY + innerHeight >= document.documentElement.scrollHeight - 2);
    if (fin) break;
  }
  console.log('capturas', i, 'alto', H, 'errores', JSON.stringify(errores), 'longtasks', JSON.stringify(await page.evaluate(() => window.__longtasks)));
  console.log('ancho', await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]));
  await b.close();
})();
