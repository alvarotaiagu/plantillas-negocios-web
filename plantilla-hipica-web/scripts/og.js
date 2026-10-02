// Genera img/og.png (1200×630) e img/icono-192.png / icono-512.png con Playwright.
// Uso: node scripts/og.js [--rutas=/ruta/a/rutas.js]
const path = require('path');
let chromium; try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const arg = k => (process.argv.find(a => a.startsWith('--' + k + '=')) || '').split('=')[1];
const rutas = arg('rutas') ? require(path.resolve(arg('rutas'))) : async () => {};
const R = path.join(__dirname, '..');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ignoreHTTPSErrors: true });
  const p = await ctx.newPage(); await rutas(p);
  await p.setViewportSize({ width: 1200, height: 630 });
  await p.goto('file://' + path.join(__dirname, 'og.html')); await p.waitForTimeout(800);
  await p.screenshot({ path: path.join(R, 'img/og.png') });
  for (const s of [192, 512]) {
    await p.setViewportSize({ width: s, height: s });
    await p.setContent(`<body style="margin:0;background:#C9A57E"><img src="file://${path.join(R, 'img/favicon.svg')}" style="width:${s}px;height:${s}px;display:block"></body>`);
    await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(R, `img/icono-${s}.png`) });
  }
  await b.close();
})();
