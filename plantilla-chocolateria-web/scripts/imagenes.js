// Genera img/og.png (1200×630), img/icono-192.png e img/icono-512.png con Playwright.
// Uso: servir la carpeta padre en http://127.0.0.1:8765/ y `node scripts/imagenes.js`.
// La bola del og es un fotograma real del shader de la portada.
const { chromium } = require(process.env.PW || 'playwright');
const path = require('path');
const IMG = path.join(__dirname, '..', 'img');
const BASE = process.env.BASE || 'http://127.0.0.1:8765/plantilla-chocolateria-web/';
const prep = global.__rutas || (async () => {});
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, ignoreHTTPSErrors: true, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await prep(p);
  await p.goto(BASE, { waitUntil: 'load' });
  await p.waitForTimeout(2500);
  await p.addStyleTag({ content: '.cabecera,.cookies,.portada-texto,.cursor,.tableta-pie{display:none!important}' });
  const bola = await p.locator('#tableta-canvas').screenshot({ omitBackground: true });
  const logo = require('fs').readFileSync(path.join(IMG, 'logo.svg'), 'utf8');
  await p.setViewportSize({ width: 1200, height: 630 });
  await p.setContent(`<!doctype html><html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Mona+Sans:wdth,wght@75..125,200..900&family=Red+Hat+Mono:wght@500&display=swap"><style>
    body{margin:0;width:1200px;height:630px;background:#1A0F0B;color:#F3E7D6;font-family:'Mona Sans';overflow:hidden;position:relative}
    .b{position:absolute;right:70px;top:40px;width:420px;height:560px;transform:rotate(-4deg);background:url(data:image/png;base64,${bola.toString('base64')}) center/contain no-repeat}
    h1{position:absolute;left:64px;top:160px;margin:0;font-weight:850;font-variation-settings:'wdth' 125;font-size:104px;line-height:.9;letter-spacing:-.04em}
    h1 em{color:#31B2A6;font:italic 400 1.02em 'Instrument Serif'}
    .l{position:absolute;left:64px;top:52px;display:flex;align-items:center;gap:16px;font:800 44px 'Mona Sans';font-variation-settings:'wdth' 125}
    .l svg{width:64px;height:64px}
    p{position:absolute;left:64px;bottom:44px;margin:0;font:500 20px 'Red Hat Mono';color:#BFA894}
  </style></head><body><div class="b"></div><div class="l">${logo}Estalo</div><h1>Si cruje,<br><em>está bien</em><br>templado.</h1><p>Chocolatería e bombonería · Ribadeo · sitio de demostración</p></body></html>`);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(IMG, 'og.png') });
  for (const n of [192, 512]) {
    await p.setViewportSize({ width: n, height: n });
    await p.setContent(`<body style="margin:0;background:#F3E7D6;display:grid;place-items:center;width:${n}px;height:${n}px"><div style="width:${n * 0.78}px;height:${n * 0.78}px">${logo.replace('width="64" height="64"', 'width="100%" height="100%"')}</div></body>`);
    await p.screenshot({ path: path.join(IMG, `icono-${n}.png`) });
  }
  await b.close();
})();
