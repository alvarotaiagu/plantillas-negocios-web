// Genera img/og.png (1200×630) e img/icon-192/512.png a partir del SVG propio.
const fs = require('fs'), path = require('path');
const { servidor, navegador, contexto, URL } = require('./arnes');
(async () => {
  const s = await servidor(); const nav = await navegador();
  const ctx = await contexto(nav, { ctx: { viewport: { width: 1200, height: 630 } } });
  const p = await ctx.newPage();
  await p.goto(URL + 'legal.html');
  const logo = fs.readFileSync(path.join(__dirname, '../img/favicon.svg'), 'utf8');
  const tornillo = fs.readFileSync(path.join(__dirname, '../img/tornillo.svg'), 'utf8');
  await p.setContent(`<!doctype html><html><head>
  <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;600&family=Mona+Sans:wdth,wght@75..125,300..900&display=swap" rel="stylesheet">
  <style>body{margin:0;width:1200px;height:630px;background:#0E1411;color:#EDF0EA;font-family:'Mona Sans';position:relative;overflow:hidden}
  .t{position:absolute;right:-40px;top:-60px;width:520px;opacity:.95}
  .l{position:absolute;left:70px;top:64px;width:84px}
  h1{position:absolute;left:66px;top:150px;margin:0;font-weight:860;font-variation-settings:"wdth" 75;font-size:230px;line-height:.8;text-transform:uppercase}
  h1 span{display:block;color:#FF8C66;padding-left:.55em}
  p{position:absolute;left:72px;bottom:56px;margin:0;font-family:'Geist Mono';font-size:22px;letter-spacing:.06em;text-transform:uppercase;color:#A4B1A9}
  .f{position:absolute;left:0;right:0;bottom:0;height:12px;background:#E2552B}</style></head>
  <body><div class="t">${tornillo}</div><div class="l">${logo}</div><h1>Paso<span>Fino</span></h1>
  <p>Ferretería de barrio · Narón · sitio de demostración</p><div class="f"></div></body></html>`);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(__dirname, '../img/og.png') });
  for (const n of [192, 512]) {
    await p.setViewportSize({ width: n, height: n });
    await p.setContent(`<body style="margin:0">${logo.replace('<svg ', `<svg width="${n}" height="${n}" `)}</body>`);
    await p.screenshot({ path: path.join(__dirname, `../img/icon-${n}.png`), omitBackground: true });
  }
  await nav.close(); s.close();
})();
