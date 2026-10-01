// Tareas largas medidas con PerformanceObserver (window.__longtasks, que llena main.js),
// en frío (caché deshabilitada), sin capturas por medio. node scripts/rendimiento.js [ancho alto]
const { chromium } = require('playwright');
const { BASE, rutas, rueda } = require('./comun');
(async () => {
  const [w = 1440, h = 900] = process.argv.slice(2);
  const movil = +w < 600;
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: +w, height: +h }, isMobile: movil, hasTouch: movil, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  if (movil) await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await rutas(page);
  await page.addInitScript(() => { localStorage.setItem('debandoira-cookies', 'ok'); });
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(5000);
  const carga = await page.evaluate(() => window.__longtasks.slice());
  // fps del ovillo durante 3 s con el ratón tirando del cabo
  const fps = await page.evaluate(() => new Promise((r) => { let n = 0; const t0 = performance.now(); (function f() { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(f); else r(Math.round(n / 3)); })(); }));
  await page.evaluate(() => { window.__longtasks.length = 0; });
  if (!movil) await page.mouse.move(+w * 0.8, +h * 0.6);
  await rueda(page, 14000, 200, 60);
  await page.waitForTimeout(1500);
  const scroll = await page.evaluate(() => window.__longtasks.slice());
  // control: una tarea larga de verdad, lanzada con setTimeout (desde evaluate no cuenta)
  await page.evaluate(() => { setTimeout(() => { const t = performance.now(); while (performance.now() - t < 120) {} }, 0); });
  await page.waitForTimeout(600);
  const control = await page.evaluate(() => window.__longtasks.slice(-1));
  console.log(JSON.stringify({ viewport: `${w}x${h}`, cpu: movil ? 'x4' : 'x1', carga, fps, scroll, control }));
  await b.close();
})();
