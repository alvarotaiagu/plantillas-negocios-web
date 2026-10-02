/* Verificación de la plantilla (PLIEGO §7) con Playwright + Chromium.
   Uso: servir la carpeta PADRE en http://127.0.0.1:8080 (para que la web
   cuelgue de /plantilla-escuela-infantil-web/, como en GitHub Pages) y:
     PW=/ruta/a/playwright LIBS=/ruta/con/gsap-y-lenis node scripts/verificar.js
   LIBS: si el entorno no llega a jsDelivr, carpeta con gsap-3.12.5/ y
   lenis-1.1.13/ (paquetes de npm) que se sirven en lugar del CDN. */
const { chromium } = require(process.env.PW || 'playwright');
const fs = require('fs');
const path = require('path');
const BASE = '' + (process.env.BASE || 'http://127.0.0.1:8080/plantilla-academia-idiomas-web/') + '';
const OUT = path.join(__dirname, '..', 'screenshots');
const LIBS = process.env.LIBS;
const MAPA = LIBS ? {
  'gsap@3.12.5/dist/gsap.min.js': LIBS + '/gsap-3.12.5/dist/gsap.min.js',
  'gsap@3.12.5/dist/ScrollTrigger.min.js': LIBS + '/gsap-3.12.5/dist/ScrollTrigger.min.js',
  'lenis@1.1.13/dist/lenis.min.js': LIBS + '/lenis-1.1.13/dist/lenis.min.js',
} : null;

const resultados = [];
const ok = (nombre, cond, detalle = '') => { resultados.push({ nombre, ok: !!cond, detalle }); console.log((cond ? 'OK   ' : 'FALLO') + ' ' + nombre + (detalle ? ' — ' + detalle : '')); };
const espera = ms => new Promise(r => setTimeout(r, ms));

async function abrir(browser, o = {}) {
  const ctx = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: o.vp || { width: 1440, height: 900 },
    isMobile: !!o.movil, hasTouch: !!o.movil,
    reducedMotion: o.reduce ? 'reduce' : 'no-preference',
  });
  if (o.cookiesOk !== false) await ctx.addInitScript(() => { try { localStorage.setItem('desenredo-cookies', '1'); } catch (e) {} });
  if (o.init) await ctx.addInitScript(o.init);
  /* La línea de tiempo de la cortina se congela en cuanto main.js la crea,
     para fotografiarla a medias (la captura tarda más que la cortina). */
  if (o.congelar) await ctx.addInitScript(() => {
    Object.defineProperty(window, '__cortinaLinea', { configurable: true, set(v) { v.pause(); window.__tl = v; }, get() { return window.__tl; } });
  });
  const page = await ctx.newPage();
  const errores = [], fallos = [];
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  page.on('pageerror', e => errores.push('PAGEERROR ' + e.message));
  page.on('response', r => { if (r.status() >= 400) fallos.push(r.status() + ' ' + r.url()); });
  page.on('requestfailed', r => { if (!/jsdelivr/.test(r.url())) fallos.push('FAILED ' + r.url() + ' ' + (r.failure() || {}).errorText); });
  await page.route('https://cdn.jsdelivr.net/npm/**', route => {
    if (o.sinGsap) return route.abort();
    if (!MAPA) return route.continue();
    const k = Object.keys(MAPA).find(k => route.request().url().endsWith(k));
    if (!k) return route.abort();
    route.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(MAPA[k]) });
  });
  return { ctx, page, errores, fallos };
}
async function rueda(page, total, paso = 200, pausa = 40) {
  for (let y = 0; y < total; y += paso) { await page.mouse.wheel(0, paso); await espera(pausa); }
}
async function hasta(page, sel, extra = 0) {
  const y = await page.evaluate(([s, e]) => document.querySelector(s).getBoundingClientRect().top + scrollY + e, [sel, extra]);
  const actual = await page.evaluate(() => scrollY);
  await rueda(page, Math.max(0, y - actual), 240, 35);
  await espera(1400);
}
/* Playwright espera a las fuentes antes de capturar; si el proxy del entorno
   deja colgada una descarga de Google Fonts, la captura no vuelve nunca.
   Tope de 15 s y se anota. */
const fotosFallidas = [];
/* Captura inmediata por CDP: no espera a las fuentes, para los fotogramas de
   la cortina, que dura menos que lo que tarda una captura normal aquí. */
const fotoYa = async (page, nombre) => {
  const cdp = await page.context().newCDPSession(page);
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT, nombre + '.png'), Buffer.from(data, 'base64'));
  await cdp.detach();
};
const foto = async (page, nombre, o = {}) => {
  try { await page.screenshot({ path: path.join(OUT, nombre + '.png'), timeout: 15000, ...o }); }
  catch (e) { fotosFallidas.push(nombre); console.log('  (captura ' + nombre + ' no salió: ' + e.message.split('\n')[0] + ')'); }
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  console.log('== 1. Escritorio: cortina, consola, secciones');
  {
    const { page, errores, fallos, ctx } = await abrir(browser, {
      congelar: true,
      init: () => {
        window.__filtros = 0;
        const P = CanvasRenderingContext2D.prototype;
        for (const prop of ['filter', 'shadowBlur']) {
          const d = Object.getOwnPropertyDescriptor(P, prop);
          Object.defineProperty(P, prop, { configurable: true, get() { return d.get.call(this); }, set(v) { if (this.canvas && this.canvas.id === 'saludo') window.__filtros++; d.set.call(this, v); } });
        }
      }
    });
    await page.goto(BASE); await espera(4000); await page.goto('about:blank');
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => !!window.__tl, null, { polling: 50, timeout: 10000 });
    await page.evaluate(() => { window.__tl.time(.5); });
    const off = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.cortina-subrayado path')).strokeDashoffset));
    await fotoYa(page, 'escritorio-00-cortina-subrayado');
    await page.evaluate(() => { window.__tl.time(1.62); });
    const d = await page.evaluate(() => document.querySelector('.cortina-papel').getAttribute('d'));
    const visible = await page.evaluate(() => getComputedStyle(document.getElementById('cortina')).display === 'block');
    await fotoYa(page, 'escritorio-00b-cortina-hoja-pasando');
    await page.evaluate(() => { window.__tl.play(); });
    ok('Cortina: subrayado a medias con autoRound:false (dashoffset intermedio)', off > .02 && off < .98, 'dashoffset ' + off);
    ok('Cortina: fotograma con la hoja pasando, canto curvo', visible && !/^M0 0H1000Q1000 500/.test(d) && !/H0Q-200/.test(d), d);
    await espera(3500);
    ok('Cortina: acaba en display:none (normal)', await page.evaluate(() => getComputedStyle(document.getElementById('cortina')).display === 'none'));
    ok('Cortina de color distinto al fondo', await page.evaluate(() => getComputedStyle(document.querySelector('.cortina-papel')).fill !== getComputedStyle(document.body).backgroundColor));
    await page.mouse.move(700, 400); await page.mouse.move(900, 420, { steps: 10 }); await espera(500);
    ok('Cursor propio: aparece con el ratón y oculta el nativo', await page.evaluate(() => document.documentElement.classList.contains('cursor-propio') && getComputedStyle(document.body).cursor === 'none'));
    await foto(page, 'escritorio-01-portada');
    const tC = await page.evaluate(() => { const t0 = performance.now(); setTimeout(() => { const t = performance.now(); while (performance.now() - t < 120) {} }, 0); return t0; });
    await espera(300);
    const lt0 = await page.evaluate(() => window.__tareasLargas.slice());
    ok('PerformanceObserver de longtask vivo (control de 120 ms)', lt0.some(e => e.t >= tC - 5 && e.d >= 115), JSON.stringify(lt0));
    const n0 = lt0.length;
    await hasta(page, '.descifrar', 10);
    await foto(page, 'escritorio-02-descifrar-A1');
    const n1 = await page.evaluate(() => document.getElementById('nivel').textContent);
    await rueda(page, Math.round(900 * 3.2 * .65), 200, 35); await espera(1500);
    const r = await page.evaluate(() => [document.getElementById('nivel').textContent, +document.getElementById('porcentaje').textContent, document.querySelector('.descifrar-marco').getBoundingClientRect().top, document.querySelectorAll('#texto-ingles .es-ruido').length]);
    await foto(page, 'escritorio-03-descifrar-avanzado');
    ok('Descifrar anclado: el nivel sube con el scroll, el porcentaje también y el marco sigue fijo', n1 === 'A1' && /B1|B2/.test(r[0]) && r[1] > 54 && Math.abs(r[2]) < 2, JSON.stringify([n1, r]));
    for (const [sel, nombre] of [['.idiomas', 'escritorio-04-idiomas'], ['.reglas', 'escritorio-05-reglas'], ['.prueba', 'escritorio-06-prueba'], ['.precios', 'escritorio-07-precios'], ['.voces', 'escritorio-08-voces'], ['.preguntas', 'escritorio-09-preguntas'], ['.contacto', 'escritorio-10-contacto']]) {
      await hasta(page, sel, sel === '.reglas' ? -300 : 0); await foto(page, nombre);
    }
    const lt = await page.evaluate(() => window.__tareasLargas.slice());
    ok('Tareas largas recorriendo la página con el canvas vivo (caché templada)', lt.slice(n0 + 1).length <= 2, 'arranque: ' + JSON.stringify(lt0.slice(0, -1)) + ' · recorriendo: ' + JSON.stringify(lt.slice(n0 + 1)));
    ok('Canvas: ningún filter/shadowBlur en el canvas visible', (await page.evaluate(() => window.__filtros)) === 0);
    ok('Escritorio sin desbordamiento horizontal', await page.evaluate(() => document.documentElement.scrollWidth === innerWidth));
    /* prueba de nivel */
    await page.evaluate(() => document.getElementById('test').scrollIntoView({ block: 'center' })); await espera(800);
    await page.click('input[name=p1][value=b]'); await page.click('input[name=p2][value=a]'); await page.click('input[name=p3][value=a]');
    await page.click('#test button[type=submit]'); await espera(400);
    const t = await page.evaluate(() => [document.getElementById('test-resultado').textContent, document.querySelectorAll('#test .es-bien').length, document.querySelectorAll('#test .es-mal').length]);
    ok('Prueba de nivel: corrige 2 bien y 1 mal, con la corrección escrita', /^2 de 3/.test(t[0]) && t[1] === 2 && t[2] === 1, JSON.stringify(t));
    await foto(page, 'escritorio-11-prueba-corregida');
    ok('Mapa: sin iframe antes del clic', await page.evaluate(() => !document.querySelector('#mapa iframe')));
    await page.click('#mapa-boton'); await espera(600);
    ok('Mapa: iframe de Google tras el clic', await page.evaluate(() => /google\.com\/maps/.test((document.querySelector('#mapa iframe') || {}).src || '')));
    await page.goto(BASE + '404.html'); await espera(800); await foto(page, 'escritorio-12-404');
    await page.goto(BASE + 'aviso-legal.html'); await espera(800); await foto(page, 'escritorio-13-aviso-legal');
    const entorno = x => /google\.com\/maps|ERR_TOO_MANY_RETRIES|fonts\.gstatic/.test(x);
    const propios = errores.concat(fallos).filter(x => !entorno(x));
    ok('Consola limpia y sin 404 propios (escritorio)', propios.length === 0, JSON.stringify(propios) + ' · entorno: ' + errores.concat(fallos).filter(entorno).length);
    await ctx.close();
  }

  console.log('== 1b. Tareas largas en frío');
  {
    const { page, ctx } = await abrir(browser);
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await page.goto(BASE); await espera(6000);
    const a = await page.evaluate(() => window.__tareasLargas.slice());
    await page.mouse.move(700, 300); await page.mouse.move(1000, 340, { steps: 20 });
    const alto = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < alto; y += 300) { await page.mouse.wheel(0, 300); await espera(70); }
    await espera(2000);
    const b = (await page.evaluate(() => window.__tareasLargas.slice())).slice(a.length);
    ok('Tareas largas en frío: arranque y recorrido entero', b.length <= 2, 'arranque: ' + JSON.stringify(a) + ' · recorriendo: ' + JSON.stringify(b));
    await ctx.close();
  }

  console.log('== 2. Móvil 390×844 + menú + táctil');
  {
    const { page, errores, fallos, ctx } = await abrir(browser, { vp: { width: 390, height: 844 }, movil: true, congelar: true });
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => !!window.__tl, null, { polling: 50, timeout: 10000 });
    await page.evaluate(() => { window.__tl.time(1.62); });
    await fotoYa(page, 'movil-00-cortina-media');
    await page.evaluate(() => { window.__tl.play(); });
    await espera(3500);
    await page.tap('.portada-entradilla'); await espera(300);
    ok('Táctil: sin cursor propio', await page.evaluate(() => !document.documentElement.classList.contains('cursor-propio')));
    await foto(page, 'movil-01-portada');
    await page.click('#menu-boton'); await espera(900);
    const m = await page.evaluate(() => { const r = document.getElementById('menu').getBoundingClientRect(); return { exp: document.getElementById('menu-boton').getAttribute('aria-expanded'), h: r.height, ih: innerHeight, top: r.top }; });
    ok('Menú móvil: abre, aria-expanded y 100dvh pese al backdrop-filter', m.exp === 'true' && Math.abs(m.h - m.ih) <= 1 && m.top === 0, JSON.stringify(m));
    await foto(page, 'movil-02-menu-abierto');
    await page.click('#menu-boton', { timeout: 3000 }); await espera(800);
    ok('Menú móvil: el mismo botón lo cierra', (await page.getAttribute('#menu-boton', 'aria-expanded')) === 'false');
    await page.click('#menu-boton'); await espera(700); await page.click('#menu a[href="#precios"]'); await espera(1800);
    ok('Menú móvil: un enlace lo cierra y lleva a la sección', (await page.getAttribute('#menu-boton', 'aria-expanded')) === 'false' && await page.evaluate(() => Math.abs(document.getElementById('precios').getBoundingClientRect().top) < 200));
    await page.evaluate(() => scrollTo(0, 0)); await espera(600);
    const ns = ['descifrar', 'idiomas', 'prueba', 'precios', 'voces', 'contacto'];
    for (const n of ns) { await page.evaluate(s => document.querySelector('.' + s).scrollIntoView(), n); await espera(1300); await foto(page, 'movil-' + String(ns.indexOf(n) + 3).padStart(2, '0') + '-' + n); }
    ok('Móvil sin desbordamiento horizontal', await page.evaluate(() => document.documentElement.scrollWidth === innerWidth));
    const ent = x => /ERR_TOO_MANY_RETRIES|fonts\.gstatic/.test(x);
    const pr = errores.concat(fallos).filter(x => !ent(x));
    ok('Consola limpia y sin 404 propios (móvil)', pr.length === 0, JSON.stringify(pr));
    await ctx.close();
  }

  console.log('== 3. Portada en 360×640 y 375×667');
  for (const vp of [{ width: 360, height: 640 }, { width: 375, height: 667 }]) {
    const { page, ctx } = await abrir(browser, { vp, movil: true });
    await page.goto(BASE); await espera(4000);
    const r = await page.evaluate(() => {
      const caja = s => { const b = document.querySelector(s).getBoundingClientRect(); return { s, t: b.top, b: b.bottom, l: b.left, r: b.right }; };
      const c = ['.cab', '.antetitulo', '.portada-titulo', '.portada-entradilla', '.portada-acciones', '.portada-idioma'].map(caja), ch = [];
      for (let i = 0; i < c.length; i++) for (let j = i + 1; j < c.length; j++) { const a = c[i], b = c[j]; if (a.t < b.b - 1 && b.t < a.b - 1 && a.l < b.r - 1 && b.l < a.r - 1) ch.push(a.s + ' × ' + b.s); }
      return { ch, lienzo: Math.round(document.querySelector('.portada-lienzo').getBoundingClientRect().bottom), ante: Math.round(document.querySelector('.antetitulo').getBoundingClientRect().top), sw: document.documentElement.scrollWidth, iw: innerWidth };
    });
    ok(`Portada ${vp.width}×${vp.height}: sin solapes y el saludo por encima del texto`, r.ch.length === 0 && r.ante >= r.lienzo - 1 && r.sw === r.iw, JSON.stringify(r));
    await foto(page, `movil-${vp.width}x${vp.height}-portada`);
    await ctx.close();
  }

  console.log('== 4. Sin GSAP');
  {
    const { page, errores, ctx } = await abrir(browser, { sinGsap: true });
    await page.goto(BASE); await espera(1500);
    const r = await page.evaluate(() => ({ motion: document.documentElement.classList.contains('has-motion'), cortina: getComputedStyle(document.getElementById('cortina')).display }));
    ok('Sin GSAP: cortina fuera y sin has-motion', !r.motion && r.cortina === 'none', JSON.stringify(r));
    await foto(page, 'sin-gsap-01-portada');
    await page.evaluate(() => { const h = document.querySelector('.descifrar-hoja'); scrollTo(0, h.getBoundingClientRect().top + scrollY - innerHeight * .1); }); await espera(800);
    const nv = await page.textContent('#nivel');
    ok('Sin GSAP: el nivel del texto cambia con la posición', nv !== 'A1', nv);
    await foto(page, 'sin-gsap-02-descifrar');
    ok('Sin GSAP: sin errores de JS propios', errores.filter(e => !/ERR_FAILED|Failed to load/.test(e)).length === 0, JSON.stringify(errores));
    await ctx.close();
  }

  console.log('== 5. Movimiento reducido');
  {
    const { page, ctx } = await abrir(browser, { reduce: true });
    await page.goto(BASE); await espera(1500);
    const r = await page.evaluate(() => ({ motion: document.documentElement.classList.contains('has-motion'), cortina: getComputedStyle(document.getElementById('cortina')).display, lenis: document.documentElement.classList.contains('lenis'), estado: document.querySelector('[data-estado]').textContent }));
    ok('Reducido: cortina fuera, sin has-motion ni Lenis, estado vivo', !r.motion && r.cortina === 'none' && !r.lenis && /Abierto|Cerrado/.test(r.estado), JSON.stringify(r));
    await foto(page, 'reducido-01-portada');
    await page.evaluate(() => { const h = document.querySelector('.descifrar-hoja'); scrollTo(0, h.getBoundingClientRect().top + scrollY - innerHeight * .05); }); await espera(600);
    const nv = await page.textContent('#nivel');
    ok('Reducido: el nivel y el porcentaje siguen cambiando', nv !== 'A1' && +(await page.textContent('#porcentaje')) > 54, nv);
    await foto(page, 'reducido-02-descifrar');
    await ctx.close();
  }

  console.log('== 6. Cookies + mandos con ?revision');
  {
    const { page, ctx } = await abrir(browser, { cookiesOk: false });
    await page.goto(BASE + '?revision'); await espera(4000);
    const a = await page.evaluate(() => ({ c: getComputedStyle(document.getElementById('cookies')).display, m: document.getElementById('mandos').hidden }));
    ok('Cookies visibles (flex) y mandos apartados', a.c === 'flex' && a.m === true, JSON.stringify(a));
    await foto(page, 'escritorio-14-cookies');
    await page.click('#cookies-ok'); await espera(300);
    const b = await page.evaluate(() => ({ c: getComputedStyle(document.getElementById('cookies')).display, m: document.getElementById('mandos').hidden, ls: localStorage.getItem('desenredo-cookies') }));
    ok('Cookies: el botón la cierra de verdad y aparecen los mandos', b.c === 'none' && b.m === false && b.ls === '1', JSON.stringify(b));
    const p2 = await ctx.newPage(); await p2.route('https://cdn.jsdelivr.net/npm/**', r => r.abort()); await p2.goto(BASE); await espera(800);
    ok('Mandos ocultos sin ?revision', await p2.evaluate(() => document.getElementById('mandos').hidden)); await p2.close();
    await hasta(page, '.idiomas', 0);
    await page.click('[data-maqueta="sobria"]'); await espera(1000);
    const s = await page.evaluate(() => ({ cl: document.documentElement.classList.contains('maqueta-sobria'), horas: getComputedStyle(document.querySelector('.horas')).display, cinta: getComputedStyle(document.querySelector('.cinta')).display, margen: getComputedStyle(document.body, '::before').display, sw: document.documentElement.scrollWidth, iw: innerWidth, ls: localStorage.getItem('desenredo-maqueta') }));
    ok('Maqueta sobria: fuera el margen rojo y la cinta, entra el gráfico de horas', s.cl && s.horas === 'block' && s.cinta === 'none' && s.margen === 'none' && s.sw === s.iw && s.ls === 'sobria', JSON.stringify(s));
    await page.evaluate(() => document.querySelector('.horas').scrollIntoView({ block: 'center' })); await espera(700);
    await foto(page, 'escritorio-15-sobria-horas');
    await page.click('[data-maqueta="descifrar"]'); await espera(400);
    ok('Maqueta: se vuelve a «Descifrar»', await page.evaluate(() => !document.documentElement.classList.contains('maqueta-sobria')));
    const col = () => page.evaluate(() => getComputedStyle(document.querySelector('.boton-lleno')).backgroundColor);
    const c0 = await col(); await page.click('[data-paleta="azul"]'); await espera(300); const c1 = await col(); await page.click('[data-paleta="verde"]'); await espera(300); const c2 = await col();
    const pal = await page.evaluate(() => ({ ls: localStorage.getItem('desenredo-paleta'), p: document.querySelector('[data-paleta="verde"]').getAttribute('aria-pressed'), o: document.querySelector('[data-paleta="rojo"]').getAttribute('aria-pressed') }));
    ok('Paleta: cambia el color computado de verdad', c0 !== c1 && c1 !== c2 && c0 !== c2, [c0, c1, c2].join(' | '));
    ok('Paleta: aria-pressed y localStorage', pal.ls === 'verde' && pal.p === 'true' && pal.o === 'false', JSON.stringify(pal));
    await page.evaluate(() => scrollTo(0, 0)); await espera(800); await foto(page, 'escritorio-16-paleta-verde');
    await page.goto(BASE + '?revision', { waitUntil: 'commit' }); await page.waitForSelector('#cortina', { state: 'attached' });
    const cls = await page.evaluate(() => document.documentElement.className);
    ok('Paleta guardada aplicada antes de pintar', /paleta-verde/.test(cls), cls);
    await espera(4000); await page.click('[data-paleta="azul"]'); await espera(400); await foto(page, 'escritorio-17-paleta-azul');
    await ctx.close();
  }

  console.log('== 7. Marcadores, noindex y sello');
  {
    const { page, ctx } = await abrir(browser);
    const malos = [];
    for (const u of ['', 'aviso-legal.html', '404.html']) {
      await page.goto(BASE + u); await espera(400);
      const t = await page.evaluate(() => document.body.textContent);
      if (/\[PENDIENTE\]|\bTODO\b/.test(t) || /lorem ipsum/i.test(t)) malos.push(u || 'index');
      const rb = await page.evaluate(() => (document.querySelector('meta[name=robots]') || {}).content);
      if (rb !== 'noindex, nofollow' || !/Sitio de demostración/.test(t)) malos.push((u || 'index') + ': robots/sello');
    }
    ok('Sin marcadores; noindex y sello en las tres páginas', malos.length === 0, malos.join(', '));
    await ctx.close();
  }

  if (fotosFallidas.length) console.log('Capturas que no salieron: ' + fotosFallidas.join(', '));
  await browser.close();
  const f = resultados.filter(r => !r.ok);
  console.log(`\n${resultados.length - f.length}/${resultados.length} comprobaciones en verde`);
  fs.writeFileSync(path.join(__dirname, 'verificacion.json'), JSON.stringify(resultados, null, 1));
  process.exit(f.length ? 1 : 0);
})();
