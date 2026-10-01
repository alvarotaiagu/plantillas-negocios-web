// Arnés común de verificación: servidor local bajo el prefijo del repo,
// CDN de jsDelivr servido desde copias locales (el entorno de verificación
// no alcanza jsDelivr) y fuentes de Google a través del proxy si existe.
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const RAIZ = path.resolve(__dirname, '..');
const PREFIJO = '/plantilla-imprenta-web';
const LIBS = process.env.PF_LIBS || path.resolve(__dirname, '../../../libs');
const CACHE = path.join(LIBS, '..', 'fuentes'); fs.mkdirSync(CACHE, { recursive: true });
const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.md': 'text/plain' };
function servidor(puerto = 8765) {
  return new Promise(res => {
    const s = http.createServer((req, r) => {
      let u = decodeURIComponent(req.url.split('?')[0]);
      if (!u.startsWith(PREFIJO)) { r.writeHead(404); return r.end(); }
      u = u.slice(PREFIJO.length) || '/';
      if (u.endsWith('/')) u += 'index.html';
      const f = path.join(RAIZ, u);
      fs.readFile(f, (e, d) => {
        if (e) { fs.readFile(path.join(RAIZ, '404.html'), (e2, d2) => { r.writeHead(404, { 'content-type': TIPOS['.html'] }); r.end(d2 || ''); }); return; }
        r.writeHead(200, { 'content-type': TIPOS[path.extname(f)] || 'application/octet-stream' }); r.end(d);
      });
    }).listen(puerto, () => res(s));
  });
}
const CDN = {
  'gsap@3.12.5/dist/gsap.min.js': 'gsap-3.12.5/package/dist/gsap.min.js',
  'gsap@3.12.5/dist/ScrollTrigger.min.js': 'gsap-3.12.5/package/dist/ScrollTrigger.min.js',
  'lenis@1.1.13/dist/lenis.min.js': 'lenis-1.1.13/package/dist/lenis.min.js',
};
async function navegador() {
  const opts = { args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] };
  if (process.env.HTTPS_PROXY) opts.proxy = { server: process.env.HTTPS_PROXY, bypass: '<-loopback>,127.0.0.1,localhost' };
  return chromium.launch(opts);
}
async function contexto(nav, o = {}) {
  const ctx = await nav.newContext(Object.assign({ ignoreHTTPSErrors: true }, o.ctx || {}));
  await ctx.route('https://cdn.jsdelivr.net/npm/**', (route) => {
    if (o.sinCdn) return route.abort();
    const k = route.request().url().split('/npm/')[1];
    const f = CDN[k];
    if (!f) return route.abort();
    route.fulfill({ status: 200, contentType: 'text/javascript', body: fs.readFileSync(path.join(LIBS, f)) });
  });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (route) => {
    const u = route.request().url();
    const f = path.join(CACHE, require('crypto').createHash('md5').update(u).digest('hex'));
    if (!fs.existsSync(f)) {
      try { require('child_process').execFileSync('curl', ['-sSf', '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36', '-o', f, u], { timeout: 30000 }); }
      catch (e) { return route.abort(); }
    }
    const tipo = /googleapis/.test(u) ? 'text/css' : (u.endsWith('.ttf') ? 'font/ttf' : 'font/woff2');
    route.fulfill({ status: 200, contentType: tipo, headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(f) });
  });
  return ctx;
}
module.exports = { servidor, navegador, contexto, URL: 'http://127.0.0.1:8765' + PREFIJO + '/' };
