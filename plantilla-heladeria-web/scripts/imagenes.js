// Genera img/og.png (1200×630), img/icono-192.png e img/icono-512.png con Playwright.
// Uso: servir la carpeta padre en http://127.0.0.1:8765/ y `node scripts/imagenes.js`.
// La bola del og es un fotograma real del shader de la portada.
const { chromium } = require(process.env.PW || 'playwright');
const path = require('path');
const IMG = path.join(__dirname, '..', 'img');
const BASE = process.env.BASE || 'http://127.0.0.1:8765/plantilla-heladeria-web/';
const prep = global.__rutas || (async () => {});
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await prep(p);
  await p.goto(BASE, { waitUntil: 'load' });
  await p.waitForTimeout(2500);
  await p.addStyleTag({ content: '.portada-anillo,.portada-hoy,.cabecera,.cookies,.portada-texto,.cursor{display:none!important}' });
  const bola = await p.locator('#portada-lienzo').screenshot({ omitBackground: true });
  const logo = require('fs').readFileSync(path.join(IMG, 'logo.svg'), 'utf8');
  await p.setViewportSize({ width: 1200, height: 630 });
  await p.setContent(`<!doctype html><html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Spline+Sans+Mono:wght@500&display=swap"><style>
    body{margin:0;width:1200px;height:630px;background:#2A1520;color:#FBF5EE;font-family:'Bodoni Moda';overflow:hidden;position:relative}
    .b{position:absolute;right:-90px;top:40px;width:640px;height:640px;border-radius:50%;background:url(data:image/png;base64,${bola.toString('base64')}) center/cover}
    h1{position:absolute;left:64px;top:150px;margin:0;font-weight:500;font-size:112px;line-height:.86;letter-spacing:-.03em}
    h1 em{color:#F589A1;font-weight:400}
    .l{position:absolute;left:64px;top:52px;display:flex;align-items:center;gap:16px;font:italic 700 44px 'Bodoni Moda'}
    .l svg{width:64px;height:64px}
    p{position:absolute;left:64px;bottom:44px;margin:0;font:500 20px 'Spline Sans Mono';color:#CDB8C0}
  </style></head><body><div class="b"></div><div class="l">${logo}Salseiro</div><h1>Helado<br><em>de hoy,</em><br>mantecado<br><em>a la vista.</em></h1><p>Xeadaría de obrador · Baiona · sitio de demostración</p></body></html>`);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(IMG, 'og.png') });
  for (const n of [192, 512]) {
    await p.setViewportSize({ width: n, height: n });
    await p.setContent(`<body style="margin:0;background:#FBF5EE;display:grid;place-items:center;width:${n}px;height:${n}px"><div style="width:${n * 0.78}px;height:${n * 0.78}px">${logo.replace('width="64" height="64"', 'width="100%" height="100%"')}</div></body>`);
    await p.screenshot({ path: path.join(IMG, `icono-${n}.png`) });
  }
  await b.close();
})();
