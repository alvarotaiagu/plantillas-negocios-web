// Utilidades del arnés de verificación (Playwright). El CDN se sirve desde
// copias locales de npm porque jsDelivr está bloqueado en el entorno de prueba.
const path = require('path');
const fs = require('fs');
const VENDOR = process.env.VENDOR || path.join(__dirname, '..', '..', 'node_modules');
const BASE = process.env.BASE || 'http://localhost:8765/plantilla-psicologia-web/';
const LOCAL = {
  'gsap.min.js': path.join(VENDOR, 'gsap/dist/gsap.min.js'),
  'ScrollTrigger.min.js': path.join(VENDOR, 'gsap/dist/ScrollTrigger.min.js'),
  'lenis.min.js': path.join(VENDOR, 'lenis/dist/lenis.min.js'),
};
// Google Fonts a través del proxy del entorno de prueba falla a ratos en
// Chromium (ERR_TOO_MANY_RETRIES): se descarga con curl y se cachea en disco.
const { execFileSync } = require('child_process');
const CACHE = process.env.FONT_CACHE || '/tmp/debandoira-fuentes';
fs.mkdirSync(CACHE, { recursive: true });
function traer(url) {
  const f = path.join(CACHE, Buffer.from(url).toString('base64url').slice(0, 200));
  if (!fs.existsSync(f)) execFileSync('curl', ['-sSL', '--retry', '3', '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36', '-o', f, url]);
  return fs.readFileSync(f);
}
async function rutas(page, { sinGsap = false } = {}) {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => {
    const url = route.request().url();
    try {
      const body = traer(url);
      route.fulfill({ status: 200, contentType: url.includes('googleapis') ? 'text/css' : 'font/woff2', body, headers: { 'access-control-allow-origin': '*' } });
    } catch (e) { route.abort(); }
  });
  await page.route(/cdn\.jsdelivr\.net/, (route) => {
    const url = route.request().url();
    if (sinGsap) return route.abort();
    const f = Object.keys(LOCAL).find((k) => url.endsWith(k));
    if (!f) return route.abort();
    route.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(LOCAL[f]) });
  });
  await page.route(/google\.com\/maps/, (r) => r.fulfill({ status: 200, contentType: 'text/html', body: '<html><body style="background:#ddd">mapa</body></html>' }));
}
async function rueda(page, total, paso = 300, espera = 40) {
  for (let y = 0; y < total; y += paso) { await page.mouse.wheel(0, paso); await page.waitForTimeout(espera); }
}
module.exports = { BASE, rutas, rueda };
