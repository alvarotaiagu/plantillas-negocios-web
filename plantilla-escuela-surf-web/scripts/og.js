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
  await page.setContent(`<!doctype html><html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Red+Hat+Mono:wght@500&family=Roboto+Flex:opsz,slnt,wdth,wght@8..144,-10..0,25..151,100..1000&display=swap"></head>
  <body style="margin:0;width:1200px;height:630px;background:#040B0F;color:#E6F0EF;font-family:'Roboto Flex';position:relative;overflow:hidden">
  <svg width="1200" height="630" style="position:absolute;inset:0"><g fill="none" stroke="#8CE0CC" stroke-opacity=".5" stroke-width="2">${lineas(16)}</g>
  <circle cx="790" cy="250" r="22" fill="#040B0F" stroke="#E6F0EF" stroke-width="2"/></svg>
  <img src="${BASE}img/logo-marca.svg" width="84" height="84" style="position:absolute;left:64px;top:60px;border-radius:16px">
  <div style="position:absolute;left:64px;bottom:150px;font-size:150px;line-height:.82;text-transform:uppercase;font-variation-settings:'wdth' 25,'wght' 900,'opsz' 144">Treboada</div>
  <div style="position:absolute;left:66px;bottom:92px;font-size:38px;font-variation-settings:'wdth' 60,'wght' 400,'opsz' 48">Lee el mar <span style="color:#8CE0CC;font-variation-settings:'wdth' 60,'wght' 300,'slnt' -10">antes</span> de entrar.</div>
  <div style="position:absolute;left:66px;bottom:48px;font:500 20px 'Red Hat Mono';color:#98B0B8">Escola de surf · Malpica de Bergantiños · demo, negocio ficticio</div>
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
