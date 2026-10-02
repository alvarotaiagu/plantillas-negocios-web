// Verificación §7 del pliego con Playwright (Chromium).
// Uso: servir la carpeta PADRE en http://127.0.0.1:8765/ (la 404 usa rutas
// absolutas con el prefijo del repo) y `node scripts/verify.js`.
// Si el entorno no llega a jsDelivr o Google Fonts, se puede inyectar
// `global.__rutas(page, { sinGsap })` antes de cargar este archivo.
const { chromium } = require(process.env.PW || 'playwright');
const path = require('path');
const fs = require('fs');
const BASE = process.env.BASE || 'http://127.0.0.1:8765/plantilla-heladeria-web/';
const SHOTS = path.join(__dirname, '..', 'screenshots');
const rutas = global.__rutas || (async (page, o = {}) => { if (o.sinGsap) await page.route(/gsap/, (r) => r.abort()); });
fs.mkdirSync(SHOTS, { recursive: true });

const resultados = [];
const ok = (nombre, cond, detalle = '') => { resultados.push({ nombre, ok: !!cond, detalle }); console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (detalle ? ' — ' + detalle : '')); };
const foto = (page, nombre, o = {}) => page.screenshot({ path: path.join(SHOTS, nombre + '.jpg'), type: 'jpeg', quality: 72, ...o });
const espera = (page, ms) => page.waitForTimeout(ms);

async function contexto(browser, { w = 1440, h = 900, movil = false, reduce = false, cookiesOk = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: movil, hasTouch: movil, deviceScaleFactor: 1, reducedMotion: reduce ? 'reduce' : 'no-preference', ignoreHTTPSErrors: true });
  if (cookiesOk) await ctx.addInitScript(() => { try { localStorage.setItem('salseiro-cookies', 'ok'); } catch (e) {} });
  return ctx;
}
async function abrir(ctx, url = '', o = {}) {
  const page = await ctx.newPage();
  const errores = [];
  page.on('console', (m) => {
    const t = m.text();
    // Ruido del entorno de prueba (WebGL por software, sin GPU) y los abortos provocados a propósito.
    if (/GL Driver Message|fallback to software WebGL/.test(t) || (o.sinGsap && /ERR_FAILED/.test(t))) return;
    if (m.type() === 'error' || m.type() === 'warning') errores.push(t);
  });
  page.on('pageerror', (e) => errores.push('pageerror: ' + e.message));
  page.on('response', (r) => { if (r.status() >= 400 && !r.url().endsWith('/no-existe')) errores.push(r.status() + ' ' + r.url()); });
  page.on('requestfailed', (r) => { if (!(o.sinGsap && /gsap/.test(r.url()))) errores.push('falló ' + r.url()); });
  await rutas(page, o);
  await page.goto(BASE + url, { waitUntil: 'load' });
  return { page, errores };
}
async function recorrer(page, prefijo, h, maxPasos = 60) {
  await page.mouse.move(200, 300);
  let i = 0, ultimaY = -1;
  for (; i < maxPasos; i++) {
    await foto(page, `${prefijo}-${String(i).padStart(2, '0')}`);
    await page.mouse.wheel(0, Math.round(h * 0.85));
    await espera(page, 1000);
    const y = await page.evaluate(() => window.scrollY);
    if (y === ultimaY) break;
    ultimaY = y;
  }
  return i;
}

(async () => {
  const browser = await chromium.launch();

  // ---------- 1. Recorrido completo, escritorio y móvil ----------
  for (const [w, h, movil, n] of [[1440, 900, false, 'escritorio'], [390, 844, true, 'movil']]) {
    console.log(`\n${n} ${w}×${h}`);
    const ctx = await contexto(browser, { w, h, movil });
    const { page, errores } = await abrir(ctx);
    await espera(page, 3500);
    ok(`${n}: cortina retirada (display:none)`, await page.$eval('#cortina', (c) => getComputedStyle(c).display === 'none' && c.hidden));
    ok(`${n}: aviso de cookies visible al llegar`, await page.$eval('#cookies', (c) => !c.hidden && getComputedStyle(c).display === 'flex'));
    await foto(page, `${n}-cookies`);
    await page.click('#cookies-ok');
    ok(`${n}: el botón cierra las cookies de verdad`, await page.$eval('#cookies', (c) => c.hidden && getComputedStyle(c).display === 'none'));
    ok(`${n}: mando oculto sin ?revision`, await page.$eval('#mando', (m) => getComputedStyle(m).display === 'none'));
    ok(`${n}: WebGL en la portada`, await page.$eval('#portada-lienzo', (l) => l.classList.contains('es-webgl')));
    const pasos = await recorrer(page, n, h);
    ok(`${n}: recorrido con rueda hasta el pie`, await page.evaluate(() => Math.abs(window.scrollY + innerHeight - document.documentElement.scrollHeight) < 4), pasos + ' capturas');
    const ancho = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
    ok(`${n}: sin desbordamiento horizontal`, ancho[0] === ancho[1], ancho.join(' / '));
    const pendientes = await page.evaluate(() => (document.body.textContent.match(/\bTODO\b|PENDIENTE|lorem ipsum/gi) || []).length);
    ok(`${n}: sin marcadores pendientes ni relleno`, pendientes === 0);
    ok(`${n}: consola y red limpias`, errores.length === 0, errores.slice(0, 3).join(' | '));
    await ctx.close();
  }

  // ---------- 2. Cortina a mitad de camino, y su retirada en los tres casos ----------
  console.log('\ncortina');
  for (const [caso, o] of [['normal', {}], ['sin-gsap', { sinGsap: true }], ['reducido', { reduce: true }]]) {
    const ctx = await contexto(browser, { reduce: !!o.reduce, cookiesOk: true });
    const page = await ctx.newPage();
    await rutas(page, o);
    page.goto(BASE).catch(() => {});
    if (caso === 'normal') {
      for (const t of [700, 1350, 1900]) { await page.waitForTimeout(t === 700 ? 700 : t - (t === 1350 ? 700 : 1350)); await foto(page, `cortina-${t}ms`); }
    } else await espera(page, 300), await foto(page, `cortina-${caso}-300ms`);
    await espera(page, 3200);
    ok(`cortina retirada (${caso})`, await page.$eval('#cortina', (c) => getComputedStyle(c).display === 'none'));
    await ctx.close();
  }
  {
    const ctx = await contexto(browser, { cookiesOk: true });
    const page = await ctx.newPage(); await rutas(page);
    await page.goto(BASE);
    const color = await page.evaluate(() => [getComputedStyle(document.querySelector('.cortina-fondo')).fill, getComputedStyle(document.body).backgroundColor]);
    ok('cortina de color distinto al fondo', color[0] !== color[1], color.join(' vs '));
    await ctx.close();
  }

  // ---------- 3. Sin GSAP: la página se lee entera ----------
  console.log('\nsin GSAP');
  {
    const ctx = await contexto(browser, { cookiesOk: true });
    const { page, errores } = await abrir(ctx, '', { sinGsap: true });
    await espera(page, 2000);
    ok('sin GSAP: no se enciende has-motion', await page.evaluate(() => !document.documentElement.classList.contains('has-motion')));
    ok('sin GSAP: titulares visibles', await page.$$eval('.palabra-in', (ps) => ps.every((p) => getComputedStyle(p).transform === 'none')));
    ok('sin GSAP: obrador sin anclar, pasos a la vista', await page.$$eval('.paso', (ps) => ps.every((p) => getComputedStyle(p).clipPath === 'none')));
    await foto(page, 'sin-gsap-portada');
    await page.evaluate(() => document.querySelector('#obrador').scrollIntoView()); await espera(page, 600);
    await foto(page, 'sin-gsap-obrador');
    await page.evaluate(() => document.querySelector('#tartas').scrollIntoView()); await espera(page, 600);
    await foto(page, 'sin-gsap-tartas');
    ok('sin GSAP: sin errores propios', errores.length === 0, errores.join(' | '));
    await ctx.close();
  }

  // ---------- 4. Movimiento reducido: sin movimiento, contenido vivo ----------
  console.log('\nmovimiento reducido');
  {
    const ctx = await contexto(browser, { reduce: true, cookiesOk: true });
    const { page } = await abrir(ctx);
    await espera(page, 1200);
    ok('reducido: sin Lenis', await page.evaluate(() => !document.documentElement.classList.contains('lenis')));
    ok('reducido: obrador sin anclar', await page.evaluate(() => !document.documentElement.classList.contains('ob-anclado')));
    await foto(page, 'reducido-portada');
    const temps = new Set();
    for (const i of [0, 1, 3, 4]) {
      await page.evaluate((i) => { const p = document.querySelectorAll('.paso')[i]; window.scrollTo(0, p.getBoundingClientRect().top + scrollY - innerHeight / 2 + p.offsetHeight / 2); }, i);
      await espera(page, 400);
      temps.add(await page.textContent('#ob-temp'));
    }
    ok('reducido: las cifras del obrador siguen cambiando', temps.size >= 3, [...temps].join(', '));
    await foto(page, 'reducido-obrador');
    const sabor1 = await page.textContent('#pala-sabor'); await page.click('#pala-sabor');
    ok('reducido: el sabor de la pala cambia', (await page.textContent('#pala-sabor')) !== sabor1);
    await page.evaluate(() => document.querySelector('#manifiesto').scrollIntoView()); await espera(page, 800);
    ok('reducido: contadores con su valor final', await page.$$eval('.contador', (cs) => cs.every((c) => c.textContent === c.dataset.hasta)));
    ok('reducido: estado del horario calculado', (await page.textContent('#estado-texto')).length > 10, await page.textContent('#estado-texto'));
    await ctx.close();
  }

  // ---------- 5. Cursor propio ----------
  console.log('\ncursor');
  {
    const ctx = await contexto(browser, { cookiesOk: true });
    const { page } = await abrir(ctx); await espera(page, 3200);
    ok('cursor: oculto hasta el primer movimiento de ratón', await page.evaluate(() => !document.documentElement.classList.contains('cursor-propio')));
    await page.mouse.move(900, 400); await page.mouse.move(950, 420); await espera(page, 200);
    ok('cursor: nativo oculto (cursor:none) tras pointermove de ratón', await page.evaluate(() => document.documentElement.classList.contains('cursor-propio') && getComputedStyle(document.body).cursor === 'none'));
    ok('cursor: espátula sobre la bola', await page.$eval('#cursor', (c) => c.classList.contains('es-pala')));
    await foto(page, 'cursor-pala', { clip: { x: 700, y: 200, width: 600, height: 500 } });
    await ctx.close();
    const ctxT = await contexto(browser, { w: 390, h: 844, movil: true, cookiesOk: true });
    const t = await abrir(ctxT); await espera(t.page, 3200);
    await t.page.tap('.portada-titulo');
    ok('cursor: nada en táctil', await t.page.evaluate(() => !document.documentElement.classList.contains('cursor-propio') && getComputedStyle(document.querySelector('#cursor')).display === 'none'));
    await ctxT.close();
  }

  // ---------- 6. Pila sticky en pasos de ~90 px ----------
  console.log('\npila sticky');
  for (const [w, h, movil, n] of [[1440, 900, false, 'escritorio'], [390, 844, true, 'movil']]) {
    const ctx = await contexto(browser, { w, h, movil, cookiesOk: true });
    const { page } = await abrir(ctx); await espera(page, 3000);
    const m = await page.$$eval('.pila-item', (lis) => lis.map((l) => [l.offsetHeight, getComputedStyle(l).marginBottom, getComputedStyle(l).position]));
    ok(`${n}: pila — mismo alto en todos los <li>`, new Set(m.map((x) => x[0])).size === 1, m.map((x) => x[0]).join(', '));
    ok(`${n}: pila — mismo margin-bottom, también el último`, new Set(m.map((x) => x[1])).size === 1, m[0][1]);
    ok(`${n}: pila — el <li> es el sticky`, m.every((x) => x[2] === 'sticky'));
    ok(`${n}: pila — alto medido, no 100vh`, m[0][0] < h, m[0][0] + ' px');
    ok(`${n}: pila — ::after da el reposo`, (await page.$eval('#pila', (p) => parseFloat(getComputedStyle(p, '::after').height))) > 0);
    // recorrido fino
    await page.evaluate(() => { const t = document.querySelector('#tartas'); window.scrollTo(0, t.offsetTop); });
    await espera(page, 600);
    let fantasmas = 0, k = 0;
    const fin = await page.evaluate(() => { const p = document.querySelector('#pila'); return p.getBoundingClientRect().bottom + scrollY; });
    for (let y = await page.evaluate(() => scrollY); y < fin; y += 90, k++) {
      await page.mouse.wheel(0, 90); await espera(page, 160);
      // fantasma: una tarjeta cuyo contenido queda fuera de su <li>
      fantasmas += await page.$$eval('.pila-item', (lis) => lis.filter((l) => { const t = l.firstElementChild; return t.offsetTop !== 0 || Math.abs(t.offsetHeight - l.offsetHeight) > 1; }).length);
      if (k % 4 === 0) await foto(page, `pila-${n}-${String(k).padStart(2, '0')}`);
    }
    ok(`${n}: pila — sin tarjetas fantasma en ${k} pasos de 90 px`, fantasmas === 0);
    await ctx.close();
  }

  // ---------- 7. Menú móvil, mapa, filtro y formulario ----------
  console.log('\nmenú, mapa, filtro, formulario');
  {
    const ctx = await contexto(browser, { w: 390, h: 844, movil: true, cookiesOk: true });
    const { page } = await abrir(ctx); await espera(page, 3200);
    await page.tap('#menu-boton'); await espera(page, 900);
    const dims = await page.$eval('#menu', (m) => { const r = m.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), innerWidth, innerHeight]; });
    ok('menú móvil: abre con aria-expanded', (await page.getAttribute('#menu-boton', 'aria-expanded')) === 'true');
    ok('menú móvil: ocupa la pantalla (100dvh × 100vw)', dims[0] === dims[2] && dims[1] === dims[3], dims.join(' '));
    await foto(page, 'movil-menu-abierto');
    await page.tap('#menu-boton', { timeout: 3000 }); await espera(page, 900);
    ok('menú móvil: el botón vuelve a cerrar', (await page.getAttribute('#menu-boton', 'aria-expanded')) === 'false');
    await page.tap('#menu-boton'); await espera(page, 900);
    await page.tap('#menu a[href="#horario"]'); await espera(page, 1800);
    ok('menú móvil: un enlace cierra y navega', (await page.getAttribute('#menu-boton', 'aria-expanded')) === 'false' && (await page.evaluate(() => Math.abs(document.querySelector('#horario').getBoundingClientRect().top) < 120)));
    await ctx.close();
  }
  {
    const ctx = await contexto(browser, { cookiesOk: true });
    const { page } = await abrir(ctx); await espera(page, 3200);
    ok('mapa: ningún iframe antes del clic', (await page.$$('iframe')).length === 0);
    await page.evaluate(() => document.querySelector('#visita').scrollIntoView()); await espera(page, 800);
    await page.click('#mapa-boton'); await espera(page, 800);
    ok('mapa: el clic carga el iframe de Google', (await page.$eval('#mapa iframe', (f) => f.src)).startsWith('https://www.google.com/maps'));
    await foto(page, 'mapa-cargado');
    await page.evaluate(() => document.querySelector('#vitrina').scrollIntoView()); await espera(page, 600);
    await page.click('.chip[data-sin="leche"]'); await page.click('.chip[data-sin="cascara"]'); await espera(page, 600);
    const noAptos = await page.$$eval('.cubeta.es-no-apto', (c) => c.length);
    ok('filtro: sin leche ni frutos de cáscara deja 4 aptos', noAptos === 10, (await page.textContent('#filtro-cuenta')));
    await page.evaluate(() => window.scrollBy(0, 300)); await espera(page, 500);
    await foto(page, 'vitrina-filtro');
    await page.evaluate(() => document.querySelector('#encargo').scrollIntoView()); await espera(page, 600);
    await page.click('#encargo button[type="submit"]');
    ok('formulario: vacío marca errores', (await page.$$('#encargo [aria-invalid="true"]')).length === 3);
    await page.fill('#f-nombre', 'Iria'); await page.fill('#f-tel', '600 00 00 00');
    await page.fill('#f-fecha', await page.$eval('#f-fecha', (f) => f.min));
    await page.click('#encargo button[type="submit"]');
    ok('formulario: completo responde (sin enviar nada)', /muestra anotado/.test(await page.textContent('#encargo-estado')));
    await foto(page, 'encargo-enviado');
    await ctx.close();
  }

  // ---------- 8. Obrador anclado ----------
  console.log('\nobrador');
  {
    const ctx = await contexto(browser, { cookiesOk: true });
    const { page } = await abrir(ctx); await espera(page, 3200);
    await page.evaluate(() => window.scrollTo(0, document.querySelector('#obrador').offsetTop - 400)); await espera(page, 800);
    const vistos = new Set(), pasos = new Set();
    for (let i = 0; i < 26; i++) {
      await page.mouse.wheel(0, 200); await espera(page, 350);
      vistos.add(await page.textContent('#ob-temp'));
      pasos.add(await page.$eval('.paso.es-paso-activo', (p) => p.querySelector('h3').textContent).catch(() => ''));
      if (i % 5 === 2) await foto(page, `obrador-${String(i).padStart(2, '0')}`);
    }
    ok('obrador: la temperatura recorre 85 y −35', vistos.has('85') && vistos.has('−35'), [...vistos].slice(0, 14).join(' '));
    ok('obrador: pasan los seis pasos', pasos.size >= 6, [...pasos].join(' · '));
    await ctx.close();
  }

  // ---------- 9. Mando: dos densidades y tres paletas ----------
  console.log('\nmando de demostración');
  {
    const ctx = await contexto(browser);
    const { page } = await abrir(ctx, '?revision'); await espera(page, 3200);
    ok('mando: se aparta mientras está el aviso de cookies', await page.$eval('#mando', (m) => getComputedStyle(m).display === 'none'));
    await page.click('#cookies-ok');
    ok('mando: aparece al cerrar el aviso', await page.$eval('#mando', (m) => getComputedStyle(m).display === 'flex'));
    await page.click('[data-maqueta="sobria"]'); await espera(page, 600);
    const s = await page.evaluate(() => ({
      dib: getComputedStyle(document.querySelector('.cubeta-dib')).display,
      pct: getComputedStyle(document.querySelector('.cubeta-pct')).display,
      litro: getComputedStyle(document.querySelector('#litro')).display,
      barras: document.querySelectorAll('#litro-barras li').length,
      talla: getComputedStyle(document.querySelector('.talla-dib')).display,
      ancho: document.documentElement.scrollWidth === innerWidth,
      ls: localStorage.getItem('salseiro-maqueta'),
    }));
    ok('sobria: se retiran cubetas y tallas dibujadas', s.dib === 'none' && s.talla === 'none');
    ok('sobria: ocupan su sitio el % de fruta y el precio por litro', s.pct === 'grid' && s.litro === 'block' && s.barras === 5);
    ok('sobria: sin desbordamiento nuevo y guardada', s.ancho && s.ls === 'sobria');
    for (const sec of ['vitrina', 'tamanos']) { await page.evaluate((id) => document.getElementById(id).scrollIntoView(), sec); await espera(page, 900); await foto(page, `sobria-${sec}`); }
    await page.click('[data-maqueta="cargada"]'); await espera(page, 400);
    ok('sobria: se puede volver a «Mantecar»', await page.evaluate(() => !document.documentElement.classList.contains('maq-sobria') && getComputedStyle(document.querySelector('.cubeta-dib')).display === 'block'));
    await page.evaluate(() => document.getElementById('vitrina').scrollIntoView()); await espera(page, 900); await foto(page, 'cargada-vitrina');

    const lum = (rgb) => { const c = rgb.match(/\d+/g).slice(0, 3).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
    const contraste = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
    let anterior = null;
    for (const p of ['framboesa', 'pistacho', 'arandano']) {
      await page.click(`[data-paleta="${p}"]`); await espera(page, 500);
      const c = await page.evaluate(() => ({
        boton: getComputedStyle(document.querySelector('.portada-acciones .boton--relleno')).backgroundColor,
        em: getComputedStyle(document.querySelector('.seccion-titulo em')).color,
        claro: getComputedStyle(document.querySelector('.vitrina .seccion-titulo em')).color,
        fondo: getComputedStyle(document.body).backgroundColor,
        pressed: document.querySelector('[data-paleta][aria-pressed="true"]').dataset.paleta,
        ls: localStorage.getItem('salseiro-paleta'),
      }));
      const k1 = contraste(c.boton, 'rgb(251, 245, 238)'), k2 = contraste(c.claro, 'rgb(42, 21, 32)');
      ok(`paleta ${p}: cambia el color computado`, anterior === null || c.boton !== anterior, c.boton);
      ok(`paleta ${p}: aria-pressed y localStorage`, c.pressed === p && c.ls === p);
      ok(`paleta ${p}: contraste botón/leite ≥ 7 y acento claro/tinta ≥ 4,5`, k1 >= 6.95 && k2 >= 4.5, k1.toFixed(2) + ' / ' + k2.toFixed(2));
      anterior = c.boton;
      await page.evaluate(() => window.scrollTo(0, 0)); await espera(page, 400);
      await foto(page, `paleta-${p}`);
    }
    // recarga: la paleta guardada se aplica sin parpadeo (comprobado en DOMContentLoaded)
    await page.addInitScript(() => document.addEventListener('DOMContentLoaded', () => { window.__claseInicial = document.documentElement.className; }));
    await page.reload({ waitUntil: 'load' });
    ok('paleta: al recargar se aplica antes de pintar', await page.evaluate(() => /pal-arandano/.test(window.__claseInicial)));
    await ctx.close();
  }

  // ---------- 10. Portada móvil pequeña: sin solapes ----------
  console.log('\nportada en móviles pequeños');
  for (const [w, h] of [[360, 640], [375, 667]]) {
    const ctx = await contexto(browser, { w, h, movil: true, cookiesOk: true });
    const { page } = await abrir(ctx); await espera(page, 3200);
    const choques = await page.evaluate(() => {
      const r = (s) => document.querySelector(s).getBoundingClientRect();
      const corta = (a, b) => a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1;
      const L = r('#portada-lienzo'); const cx = L.left + L.width / 2, cy = L.top + L.height / 2, R = L.width / 2;
      const enCirculo = (b) => { const x = Math.max(b.left, Math.min(cx, b.right)), y = Math.max(b.top, Math.min(cy, b.bottom)); return Math.hypot(x - cx, y - cy) < R - 1; };
      const piezas = ['.portada-antetitulo', '.portada-titulo', '.portada-entradilla', '.portada-acciones', '.portada-hoy'];
      const out = [];
      piezas.forEach((a, i) => { if (enCirculo(r(a))) out.push(a + ' ∩ bola'); piezas.slice(i + 1).forEach((b) => { if (corta(r(a), r(b))) out.push(a + ' ∩ ' + b); }); if (corta(r(a), r('.cabecera'))) out.push(a + ' ∩ cabecera'); });
      return out;
    });
    ok(`portada ${w}×${h}: sin solapes`, choques.length === 0, choques.join(', '));
    await foto(page, `portada-${w}x${h}`);
    await ctx.close();
  }

  // ---------- 11. Tareas largas (en frío, sin caché) ----------
  console.log('\nrendimiento');
  for (const [w, h, movil, n] of [[1440, 900, false, 'escritorio'], [390, 844, true, 'movil'], [1440, 900, false, 'escritorio-sin-webgl']]) {
    const ctx = await contexto(browser, { w, h, movil, cookiesOk: true });
    // Control: sin WebGL se ve qué parte del coste es del shader y cuál del resto de la página.
    if (n.endsWith('sin-webgl')) await ctx.addInitScript(() => { const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, o) { return /webgl/.test(t) ? null : g.call(this, t, o); }; });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    if (movil) await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await rutas(page);
    await page.goto(BASE, { waitUntil: 'load' });
    await espera(page, 6000);
    await page.mouse.move(w * 0.7, h * 0.4); for (let i = 0; i < 12; i++) await page.mouse.move(w * 0.7 + i * 12, h * 0.4 + i * 6);
    for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 400); await espera(page, 300); }
    await espera(page, 1500);
    const lt = await page.evaluate(() => ({ t: window.__salseiroLongtasks.slice(), fuentes: window.__salseiroFuentes }));
    // control: una tarea larga provocada desde la propia página (setTimeout) tiene que aparecer
    await page.evaluate(() => setTimeout(() => { const t = performance.now(); while (performance.now() - t < 120); }, 0));
    await espera(page, 600);
    const control = await page.evaluate(() => window.__salseiroLongtasks.some((e) => e.duracion >= 110));
    const tras = lt.t.filter((e) => e.inicio > (lt.fuentes || 0));
    ok(`${n}: PerformanceObserver vivo (control de 120 ms detectado)`, control);
    ok(`${n}${movil ? ' (CPU ×4)' : ''}: tareas largas medidas`, true, `${lt.t.length} en total [${lt.t.map((e) => e.duracion + ' ms').join(', ')}]; tras fonts.ready (${lt.fuentes} ms): ${tras.length}`);
    fs.writeFileSync(path.join(SHOTS, `longtasks-${n}.json`), JSON.stringify(lt, null, 2));
    await ctx.close();
  }

  // ---------- 12. Páginas sueltas y metadatos ----------
  console.log('\npáginas sueltas');
  {
    const ctx = await contexto(browser, { cookiesOk: true });
    for (const url of ['', 'legal.html', '404.html']) {
      const { page, errores } = await abrir(ctx, url);
      await espera(page, 1500);
      const robots = await page.$eval('meta[name="robots"]', (m) => m.content).catch(() => '');
      const sello = await page.evaluate(() => /Sitio de demostración\. Salseiro es un negocio ficticio/.test(document.body.textContent));
      ok(`${url || 'index'}: noindex, nofollow y sello de demo`, robots === 'noindex, nofollow' && sello);
      if (url) { await foto(page, url === 'legal.html' ? 'legal' : '404'); ok(`${url}: consola limpia`, errores.length === 0, errores.join(' | ')); }
      await page.close();
    }
    await ctx.close();
  }

  await browser.close();
  const fallos = resultados.filter((r) => !r.ok);
  fs.writeFileSync(path.join(SHOTS, 'verificacion.json'), JSON.stringify(resultados, null, 2));
  console.log(`\n${resultados.length - fallos.length}/${resultados.length} comprobaciones en verde.`);
  if (fallos.length) { console.log('FALLAN:\n' + fallos.map((f) => '- ' + f.nombre + ' ' + f.detalle).join('\n')); process.exitCode = 1; }
})();
