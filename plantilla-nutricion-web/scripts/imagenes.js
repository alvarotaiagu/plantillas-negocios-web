// Genera img/og.png (1200×630) e img/icon-192.png / icon-512.png desde fuentes propias.
const { chromium } = require('playwright');
const path = require('path');
const { rutas } = require('./comun');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, ignoreHTTPSErrors: true });
  await rutas(p);
  await p.goto((process.env.BASE || 'http://localhost:8765/plantilla-nutricion-web/') + 'scripts/og.html');
  await p.waitForFunction(() => document.fonts.check('400 40px "Instrument Serif"') && document.fonts.check('400 20px Onest') && [...document.fonts].filter(f => f.status === 'loaded').length >= 2, null, { timeout: 15000 });
  console.log(await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight + ' ' + f.style).join(' | ')));
  await p.waitForTimeout(2500);
  await p.screenshot({ path: path.join(__dirname, '..', 'img', 'og.png') });
  for (const s of [192, 512]) {
    await p.setViewportSize({ width: s, height: s });
    const svg = require('fs').readFileSync(path.join(__dirname, '..', 'img', 'favicon.svg'), 'utf8').replace('<svg ', `<svg width="${s}" height="${s}" `);
    await p.goto('about:blank'); await p.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block}</style>${svg}`);
    await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(__dirname, '..', 'img', `icon-${s}.png`), omitBackground: true });
  }
  await b.close();
})();
