// Utillaje de verificación compartido. Las librerías del CDN se sirven desde una
// copia local de npm (el contenedor de verificación no llega a jsDelivr); la web
// publicada las pide a jsDelivr igualmente.
const path = require('path');
const fs = require('fs');
const VEND = process.env.VEND || path.join(__dirname, '../../../vend/node_modules');
const CACHE = process.env.CACHE_FUENTES || path.join(require('os').tmpdir(), 'treboada-fuentes');
const BASE = process.env.BASE || 'http://localhost:8765/plantilla-escuela-surf-web/';
const LIBS = {
  'gsap.min.js': 'gsap/dist/gsap.min.js',
  'ScrollTrigger.min.js': 'gsap/dist/ScrollTrigger.min.js',
  'lenis.min.js': 'lenis/dist/lenis.min.js',
};
async function nuevo(browser, opts = {}) {
  const { sinGsap = false, movil = false, reducido = false, ancho, alto } = opts;
  const ctx = await browser.newContext({
    viewport: { width: ancho || (movil ? 390 : 1440), height: alto || (movil ? 844 : 900) },
    deviceScaleFactor: movil ? 2 : 1, isMobile: movil, hasTouch: movil,
    reducedMotion: reducido ? 'reduce' : 'no-preference', ignoreHTTPSErrors: true,
  });
  const page = await ctx.newPage();
  const errores = [], fallos = [];
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  page.on('pageerror', e => errores.push('pageerror: ' + e.message));
  page.on('requestfailed', r => fallos.push(r.url() + ' ' + (r.failure() || {}).errorText));
  page.on('response', r => { if (r.status() >= 400) fallos.push(r.status() + ' ' + r.url()); });
  await page.route('https://cdn.jsdelivr.net/**', route => {
    const nombre = route.request().url().split('/').pop();
    if (sinGsap && /gsap|ScrollTrigger/.test(nombre)) return route.abort();
    const f = LIBS[nombre];
    if (!f) return route.abort();
    route.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(path.join(VEND, f)) });
  });
  // Tipografías de Google: caché en disco. El proxy del contenedor de verificación
  // corta a veces la conexión (ERR_TOO_MANY_RETRIES) y la captura sale con la
  // tipografía de reserva; con la caché, cada pasada usa las mismas fuentes.
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, async route => {
    const url = route.request().url();
    const f = path.join(CACHE, require('crypto').createHash('md5').update(url).digest('hex'));
    if (fs.existsSync(f)) { const m = JSON.parse(fs.readFileSync(f + '.json')); return route.fulfill({ status: 200, headers: m, body: fs.readFileSync(f) }); }
    for (let i = 0; i < 4; i++) {
      try {
        const r = await route.fetch();
        const body = await r.body();
        const h = { 'content-type': r.headers()['content-type'] || 'application/octet-stream', 'access-control-allow-origin': '*' };
        if (r.status() === 200) { fs.mkdirSync(CACHE, { recursive: true }); fs.writeFileSync(f, body); fs.writeFileSync(f + '.json', JSON.stringify(h)); }
        return route.fulfill({ status: r.status(), headers: h, body });
      } catch (e) { await new Promise(r => setTimeout(r, 800)); }
    }
    return route.abort();
  });
  return { ctx, page, errores, fallos };
}
async function bajar(page, total, paso = 120, espera = 16) {
  let hecho = 0;
  while (hecho < total) { await page.mouse.wheel(0, paso); hecho += paso; await page.waitForTimeout(espera); }
}
module.exports = { nuevo, bajar, BASE };
