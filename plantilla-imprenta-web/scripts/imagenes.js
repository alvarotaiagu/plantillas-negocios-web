// Genera img/og.png (1200×630) e img/icon-192/512.png a partir del SVG propio.
const fs = require('fs'), path = require('path');
const { servidor, navegador, contexto, URL } = require('./arnes');
(async () => {
  const s = await servidor(); const nav = await navegador();
  const ctx = await contexto(nav, { ctx: { viewport: { width: 1200, height: 630 } } });
  const p = await ctx.newPage();
  await p.goto(URL + 'legal.html');
  const logo = fs.readFileSync(path.join(__dirname, '../img/favicon.svg'), 'utf8');
  const cartel = fs.readFileSync(path.join(__dirname, '../img/cartel.svg'), 'utf8');
  await p.setContent(`<!doctype html><html><head>
  <link href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&family=Red+Hat+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>body{margin:0;width:1200px;height:630px;background:#F4F1EA;color:#16161A;font-family:'Funnel Display';position:relative;overflow:hidden}
  .c{position:absolute;right:90px;top:70px;width:360px;transform:rotate(2.2deg);box-shadow:0 30px 50px -30px rgba(40,30,10,.5)}
  .c svg{display:block;width:100%;height:auto}
  .l{position:absolute;left:70px;top:60px;width:74px}
  h1{position:absolute;left:66px;top:170px;margin:0;font-weight:780;font-size:112px;letter-spacing:-.04em;line-height:.9;
     text-shadow:5px 2px 0 rgba(0,160,227,.85),-4px 3px 0 rgba(230,0,126,.85),1px -4px 0 rgba(255,229,0,.95)}
  h1 span{display:block;padding-left:.4em}
  p{position:absolute;left:72px;bottom:64px;margin:0;font-family:'Red Hat Mono';font-size:18px;letter-spacing:.03em;text-transform:uppercase;color:#55545C}
  .t{position:absolute;left:72px;bottom:40px;display:flex}.t i{width:22px;height:10px;display:block}</style></head>
  <body><div class="c">${cartel}</div><div class="l">${logo}</div><h1>Tres<span>Milímetros</span></h1>
  <p>Imprenta y copistería · Pontevedra · sitio de demostración</p>
  <div class="t"><i style="background:#00A0E3"></i><i style="background:#E6007E"></i><i style="background:#FFE500"></i><i style="background:#16161A"></i></div></body></html>`);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(__dirname, '../img/og.png') });
  for (const n of [192, 512]) {
    await p.setViewportSize({ width: n, height: n });
    await p.setContent(`<body style="margin:0">${logo.replace('<svg ', `<svg width="${n}" height="${n}" `)}</body>`);
    await p.screenshot({ path: path.join(__dirname, `../img/icon-${n}.png`), omitBackground: true });
  }
  await nav.close(); s.close();
})();
