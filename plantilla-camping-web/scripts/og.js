// Genera img/og.png (1200×630) e img/icono-192.png / icono-512.png con Chromium.
// Uso: node scripts/og.js   (con el servidor local en marcha: ver verificar.js)
const { chromium } = require('playwright');
const path = require('path');
const { nuevo, BASE } = require('./comun.js');
const lineas = n => Array.from({ length: n }, (_, i) => {
  const y = 40 + i * i * 2.6 + i * 8;
  const dob = 34 * Math.exp(-Math.pow((i - 7) / 3.2, 2));
  return `<path d="M0 ${y} C 300 ${y - 6} 560 ${y - 4} 760 ${y + dob} S 1000 ${y - 8} 1200 ${y}"/>`;
}).join('');
(async () => {
  const b = await chromium.launch();
  const { page } = await nuevo(b, { ancho: 1200, alto: 630 });
  await page.goto(BASE + 'legal.html', { waitUntil: 'networkidle' });
  const rayas = Array.from({ length: 12 }, (_, k) => `<path d="M${100 + k * 85} 40 L${185 + k * 85} 40 L${180 + k * 85} ${300 + 30 * Math.sin(k)} L${100 + k * 85} ${310 + 30 * Math.sin(k + 1)} Z" fill="${k % 2 ? '#F8F3EA' : '#D2502A'}"/>`).join('');
  await page.setContent(`<!doctype html><html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fragment+Mono&family=Instrument+Serif:ital@0;1&display=swap"></head>
  <body style="margin:0;width:1200px;height:630px;background:#EFE7D6;color:#1F2A22;position:relative;overflow:hidden">
  <svg width="1200" height="630" style="position:absolute;inset:0"><path d="M0 38 L1200 38" stroke="#1F2A22" stroke-width="3"/>${rayas}
  <path d="M100 310 L20 420" stroke="#D2502A" stroke-width="2"/><path d="M1205 300 L1180 420" stroke="#D2502A" stroke-width="2"/></svg>
  <div style="position:absolute;left:64px;bottom:120px;font:400 150px/0.9 'Instrument Serif'">Una lona <i style="color:#8A2E10">bien</i> tensa.</div>
  <div style="position:absolute;left:66px;bottom:56px;font:20px 'Fragment Mono';color:#4A5A44">Camping A Piqueta · Os Ancares · demo, negocio ficticio</div>
  </body></html>`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(__dirname, '../img/og.png') });
  for (const t of [192, 512]) {
    await page.setViewportSize({ width: t, height: t });
    await page.setContent(`<body style="margin:0"><img src="${BASE}img/favicon.svg" style="width:${t}px;height:${t}px;display:block"></body>`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(__dirname, `../img/icono-${t}.png`) });
  }
  await b.close();
})();
