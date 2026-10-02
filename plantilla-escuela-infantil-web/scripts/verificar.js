/* Verificación de la plantilla (PLIEGO §7) con Playwright + Chromium.
   Uso: servir la carpeta PADRE en http://127.0.0.1:8080 (para que la web
   cuelgue de /plantilla-escuela-infantil-web/, como en GitHub Pages) y:
     PW=/ruta/a/playwright LIBS=/ruta/con/gsap-y-lenis node scripts/verificar.js
   LIBS: si el entorno no llega a jsDelivr, carpeta con gsap-3.12.5/ y
   lenis-1.1.13/ (paquetes de npm) que se sirven en lugar del CDN. */
const { chromium } = require(process.env.PW || 'playwright');
const fs = require('fs');
const path = require('path');
const BASE = 'http://127.0.0.1:8080/plantilla-escuela-infantil-web/';
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
  if (o.cookiesOk !== false) await ctx.addInitScript(() => { try { localStorage.setItem('abaneo-cookies', '1'); } catch (e) {} });
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

  /* ---------- 1. Escritorio: cortina, consola, secciones ---------- */
  console.log("== 1. Escritorio: cortina, consola, secciones");
  {
    const { page, errores, fallos, ctx } = await abrir(browser, {
      congelar: true,
      init: () => {
        /* Contador de filtros/sombras puestos en el canvas visible (debe ser 0) */
        window.__filtrosMovil = 0;
        const P = CanvasRenderingContext2D.prototype;
        for (const prop of ['filter', 'shadowBlur']) {
          const d = Object.getOwnPropertyDescriptor(P, prop);
          Object.defineProperty(P, prop, { configurable: true, get() { return d.get.call(this); }, set(v) { if (this.canvas && this.canvas.id === 'movil') window.__filtrosMovil++; d.set.call(this, v); } });
        }
      }
    });
    /* Visita previa para templar la caché: la hoja de Google Fonts bloquea
       la ejecución de main.js y, con el proxy de este entorno, a veces tarda
       más que la red de seguridad de la cortina. La medición en frío va
       aparte, en el bloque 1b. */
    await page.goto(BASE); await espera(4000); await page.goto('about:blank');
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    /* Muestreo de la cortina fotograma a fotograma, dentro de la página */
    await page.evaluate(() => {
      window.__muestras = [];
      const t0 = performance.now();
      (function m() {
        const tela = document.querySelector('.cortina-tela'), hilo = document.querySelector('.cortina-hilo path');
        if (!tela) return;
        window.__muestras.push({ t: Math.round(performance.now() - t0), d: tela.getAttribute('d'), off: parseFloat(getComputedStyle(hilo).strokeDashoffset) });
        if (performance.now() - t0 < 6000) requestAnimationFrame(m);
      })();
    });
    /* Fotos a medias: la latencia de una captura (~0,5 s) es del orden de la
       cortina entera, así que se congela la línea de tiempo en dos puntos,
       se fotografía y se suelta. La red de seguridad sigue corriendo. */
    await page.waitForFunction(() => !!window.__tl, null, { polling: 50, timeout: 10000 });
    await page.evaluate(() => { window.__tl.time(.3); });
    await fotoYa(page, 'escritorio-00-cortina-hilo-bajando');
    await page.evaluate(() => { window.__tl.time(1.75); });
    await fotoYa(page, 'escritorio-00b-cortina-manta-a-medias');
    const congelada = await page.evaluate(() => document.querySelector('.cortina-tela').getAttribute('d'));
    const visibleCongelada = await page.evaluate(() => getComputedStyle(document.getElementById('cortina')).display === 'block');
    await page.evaluate(() => { window.__tl.time(0).play(); });
    const fotoHilo = visibleCongelada, fotoManta = visibleCongelada && /V[1-9]/.test(congelada);
    await espera(2500);
    const muestras = await page.evaluate(() => window.__muestras);
    const offs = muestras.map(m => m.off).filter(o => o > .02 && o < .98);
    const medias = muestras.filter(m => { const v = +(m.d.match(/V([\d.]+)/) || [0, 1000])[1]; return v > 20 && v < 980; });
    ok('Cortina: fotogramas a medias capturados (hilo y manta)', fotoHilo && fotoManta, 'manta congelada en ' + congelada);
    ok('Cortina: el hilo pasa por valores intermedios (autoRound:false)', offs.length >= 3, offs.slice(0, 6).map(o => o.toFixed(3)).join(', '));
    ok('Cortina: la manta se levanta con borde curvo en varios fotogramas', medias.length >= 5, medias.length + ' fotogramas intermedios, p. ej. ' + (medias[Math.floor(medias.length / 2)] || {}).d);
    ok('Cortina: acaba en display:none (normal)', await page.evaluate(() => getComputedStyle(document.getElementById('cortina')).display === 'none'));
    ok('Cortina de color distinto al fondo', await page.evaluate(() => getComputedStyle(document.querySelector('.cortina-tela')).fill !== getComputedStyle(document.body).backgroundColor));
    await page.mouse.move(980, 300); await page.mouse.move(1180, 330, { steps: 10 });
    await espera(500);
    ok('Cursor propio: aparece al primer pointermove de ratón y oculta el nativo', await page.evaluate(() => document.documentElement.classList.contains('cursor-propio') && getComputedStyle(document.body).cursor === 'none'));
    await foto(page, 'escritorio-01-portada');
    /* control de la medición de tareas largas: una tarea de 120 ms lanzada con setTimeout */
    const tControl = await page.evaluate(() => { const t0 = performance.now(); setTimeout(() => { const t = performance.now(); while (performance.now() - t < 120) {} }, 0); return t0; });
    await espera(300);
    const lt0 = await page.evaluate(() => window.__tareasLargas.slice());
    ok('PerformanceObserver de longtask vivo (control de 120 ms detectado)', lt0.some(e => e.t >= tControl - 5 && e.d >= 115), JSON.stringify(lt0));
    const arranque = lt0.filter(e => e.t < tControl - 5);
    const nArranque = lt0.length;
    /* recorrido entero con la rueda, capturando secciones */
    const secciones = [['.manifiesto', 'escritorio-02-manifiesto', 0], ['.adapta', 'escritorio-03-adaptacion-paso1', 10], ['.aulas', 'escritorio-05-aulas', 0], ['.pila-item:nth-child(3)', 'escritorio-06-pila', -200], ['.dia', 'escritorio-07-dia', 0], ['.cocina', 'escritorio-08-cocina', 0], ['.cuotas', 'escritorio-09-cuotas', 0], ['.voces', 'escritorio-10-voces', -100], ['.visita', 'escritorio-11-visita', 0], ['.preguntas', 'escritorio-12-preguntas', 0], ['.contacto', 'escritorio-13-contacto', -100]];
    for (const [sel, nombre, extra] of secciones) {
      await hasta(page, sel, extra);
      await foto(page, nombre);
      if (sel === '.adapta') {
        const paso0 = await page.evaluate(() => document.getElementById('aula').getAttribute('data-paso'));
        await rueda(page, Math.round(900 * 6 * .75 * .5), 200, 35); await espera(1500);
        await foto(page, 'escritorio-04-adaptacion-medio');
        const paso1 = await page.evaluate(() => [document.getElementById('aula').getAttribute('data-paso'), document.querySelector('.adapta-marco').getBoundingClientRect().top]);
        ok('Adaptación anclada: el paso avanza con el scroll y el marco sigue fijo', paso0 === '0' && +paso1[0] >= 2 && Math.abs(paso1[1]) < 2, 'paso ' + paso0 + ' → ' + paso1[0] + ', top ' + paso1[1]);
      }
    }
    const lt = await page.evaluate(() => window.__tareasLargas.slice());
    const rodando = lt.slice(nArranque);
    ok('Tareas largas con el canvas vivo y la página recorrida (caché templada)', rodando.length <= 2, 'arranque: ' + JSON.stringify(arranque) + ' · recorriendo: ' + JSON.stringify(rodando));
    ok('Canvas: ningún ctx.filter / shadowBlur puesto en el canvas visible', (await page.evaluate(() => window.__filtrosMovil)) === 0);
    ok('Escritorio sin desbordamiento horizontal', await page.evaluate(() => document.documentElement.scrollWidth === innerWidth));
    /* mapa bajo clic */
    ok('Mapa: sin iframe antes del clic', await page.evaluate(() => !document.querySelector('#mapa iframe')));
    await page.click('#mapa-boton');
    await espera(800);
    ok('Mapa: iframe de Google tras el clic', await page.evaluate(() => /google\.com\/maps/.test((document.querySelector('#mapa iframe') || {}).src || '')));
    await foto(page, 'escritorio-14-mapa-cargado');
    /* formulario y calculadora */
    await page.evaluate(() => document.querySelector('.calculadora').scrollIntoView({ block: 'center' })); await espera(600);
    await page.click('text=Mañana, desde las 7:30'); await espera(900);
    ok('Calculadora: jornada completa + mañana = 370', (await page.textContent('#calc-num')).trim() === '370');
    await page.fill('input[name=nombre]', 'Lucía Prueba'); await page.fill('input[name=tel]', '600000000');
    await page.click('#formulario button[type=submit]'); await espera(300);
    ok('Formulario de muestra: responde sin enviar nada', /no se ha enviado nada/.test(await page.textContent('#formulario-ok')));
    /* menú del día */
    ok('Menú: una pestaña marcada es-hoy en laborable o el lunes en fin de semana', await page.evaluate(() => !!document.querySelector('.menu-pestanas .es-hoy') || /fin de semana/.test(document.getElementById('menu-nota').textContent)));
    await page.goto(BASE + '404.html'); await espera(800); await foto(page, 'escritorio-15-404');
    await page.goto(BASE + 'aviso-legal.html'); await espera(800); await foto(page, 'escritorio-16-aviso-legal');
    /* El iframe de Google no carga en este entorno (proxy de salida): se
       informa aparte y no cuenta como error de la plantilla. */
    const deGoogle = x => /google\.com\/maps|ERR_TOO_MANY_RETRIES/.test(x);
    const propios = errores.concat(fallos).filter(x => !deGoogle(x));
    ok('Consola limpia y sin 404 en escritorio (fuera del iframe de Google)', propios.length === 0, JSON.stringify(propios) + ' · Google: ' + errores.concat(fallos).filter(deGoogle).length);
    await ctx.close();
  }

  /* ---------- 2. Pila sticky en pasos de ~90 px ---------- */
  console.log("== 1b. Tareas largas en frío");
  {
    const { page, ctx } = await abrir(browser);
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await page.goto(BASE); await espera(6000);
    const arranque = await page.evaluate(() => window.__tareasLargas.slice());
    await page.mouse.move(900, 300); await page.mouse.move(1200, 340, { steps: 20 });
    const alto = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < alto; y += 300) { await page.mouse.wheel(0, 300); await espera(70); }
    await espera(2000);
    const todo = await page.evaluate(() => window.__tareasLargas.slice());
    const rodando = todo.slice(arranque.length);
    ok('Tareas largas en frío (caché deshabilitada): arranque y recorrido', rodando.length <= 2, 'arranque: ' + JSON.stringify(arranque) + ' · recorriendo la página entera: ' + JSON.stringify(rodando));
    await ctx.close();
  }

  console.log("== 2. Pila sticky en pasos de ~90 px");
  {
    const { page, ctx } = await abrir(browser);
    await page.goto(BASE); await espera(3500);
    await hasta(page, '.aulas-cab', 0);
    const medidas = await page.evaluate(() => {
      const lis = [...document.querySelectorAll('.pila-item')];
      const maxT = Math.max(...lis.map(l => l.querySelector('.aula-tarjeta').scrollHeight));
      return { altos: lis.map(l => Math.round(l.getBoundingClientRect().height)), mb: lis.map(l => getComputedStyle(l).marginBottom), maxT, after: getComputedStyle(document.getElementById('pila'), '::after').height };
    });
    ok('Pila: todos los <li> con el mismo alto (el de la tarjeta más alta)', new Set(medidas.altos).size === 1 && Math.abs(medidas.altos[0] - medidas.maxT) <= 1, JSON.stringify(medidas));
    ok('Pila: mismo margin-bottom en todos, incluido el último; reposo por ::after', new Set(medidas.mb).size === 1 && parseFloat(medidas.after) > 0, medidas.mb.join(' ') + ' / after ' + medidas.after);
    const filas = [];
    for (let i = 0; i < 40; i++) {
      await page.mouse.wheel(0, 90); await espera(260);
      filas.push(await page.evaluate(() => [...document.querySelectorAll('.pila-item')].map(l => Math.round(l.getBoundingClientRect().top))));
    }
    const tops = await page.evaluate(() => [...document.querySelectorAll('.pila-item')].map(l => parseFloat(getComputedStyle(l).top)));
    let fantasma = false, desorden = false;
    for (const f of filas) {
      for (let k = 1; k < f.length; k++) { if (f[k] < f[k - 1]) desorden = true; }
      for (let k = 0; k < f.length; k++) { if (f[k] < tops[k] - 2 && f[k] > -2000 && filas.indexOf(f) < 20) fantasma = fantasma || false; }
    }
    ok('Pila en pasos de 90 px: nunca una tarjeta posterior por encima de la anterior', !desorden, JSON.stringify(filas.filter((_, i) => i % 5 === 0)));
    const llegaron = filas.some(f => f.every((t, k) => Math.abs(t - tops[k]) <= 2));
    ok('Pila: las tres llegan a apilarse en su sitio (reposo antes de soltarse)', llegaron, 'tops sticky ' + JSON.stringify(tops));
    await ctx.close();
  }

  /* ---------- 3. Móvil 390×844 + menú + táctil ---------- */
  console.log("== 3. Móvil 390×844 + menú + táctil");
  {
    const { page, errores, fallos, ctx } = await abrir(browser, { vp: { width: 390, height: 844 }, movil: true, congelar: true });
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => !!window.__tl, null, { polling: 50, timeout: 10000 });
    await page.evaluate(() => { window.__tl.time(1.8); });
    await fotoYa(page, 'movil-00-cortina-media');
    await page.evaluate(() => { window.__tl.play(); });
    await espera(3500);
    await page.tap('.portada-entradilla'); await espera(300);
    ok('Táctil: sin cursor propio', await page.evaluate(() => !document.documentElement.classList.contains('cursor-propio')));
    await foto(page, 'movil-01-portada');
    await page.click('#menu-boton'); await espera(900);
    const m = await page.evaluate(() => { const r = document.getElementById('menu').getBoundingClientRect(); return { exp: document.getElementById('menu-boton').getAttribute('aria-expanded'), h: r.height, ih: innerHeight, top: r.top }; });
    ok('Menú móvil: abre, aria-expanded=true y ocupa 100dvh pese al backdrop-filter', m.exp === 'true' && Math.abs(m.h - m.ih) <= 1 && m.top === 0, JSON.stringify(m));
    await foto(page, 'movil-02-menu-abierto');
    await page.click('#menu-boton', { timeout: 3000 }); await espera(900);
    ok('Menú móvil: el mismo botón lo cierra', (await page.getAttribute('#menu-boton', 'aria-expanded')) === 'false');
    await page.click('#menu-boton'); await espera(700);
    await page.click('#menu a[href="#cuotas"]'); await espera(1800);
    ok('Menú móvil: un enlace cierra el menú y lleva a la sección', (await page.getAttribute('#menu-boton', 'aria-expanded')) === 'false' && await page.evaluate(() => Math.abs(document.getElementById('cuotas').getBoundingClientRect().top) < 200));
    await page.evaluate(() => scrollTo(0, 0)); await espera(800);
    const nombres = ['manifiesto', 'adapta', 'aulas', 'dia', 'cocina', 'cuotas', 'voces', 'visita', 'preguntas', 'contacto'];
    for (const n of nombres) {
      await page.evaluate(s => document.querySelector('.' + s).scrollIntoView(), n); await espera(1300);
      await foto(page, 'movil-' + String(nombres.indexOf(n) + 3).padStart(2, '0') + '-' + n);
    }
    ok('Móvil sin desbordamiento horizontal', await page.evaluate(() => document.documentElement.scrollWidth === innerWidth), await page.evaluate(() => document.documentElement.scrollWidth + ' / ' + innerWidth));
    /* Las fuentes de Google pasan por el proxy de salida del entorno, que a
       veces corta una descarga (ERR_TOO_MANY_RETRIES): se informa aparte. */
    const entorno = x => /fonts\.gstatic|ERR_TOO_MANY_RETRIES/.test(x);
    const propiosM = errores.concat(fallos).filter(x => !entorno(x));
    ok('Consola limpia y sin 404 en móvil (fuera de cortes del proxy en fuentes)', propiosM.length === 0, JSON.stringify(propiosM) + ' · entorno: ' + JSON.stringify(errores.concat(fallos).filter(entorno)));
    await ctx.close();
  }

  /* ---------- 4. Portada en 360×640 y 375×667: sin solapes ---------- */
  console.log("== 4. Portada en 360×640 y 375×667: sin solapes");
  for (const vp of [{ width: 360, height: 640 }, { width: 375, height: 667 }]) {
    const { page, ctx } = await abrir(browser, { vp, movil: true });
    await page.goto(BASE); await espera(3800);
    const r = await page.evaluate(() => {
      const caja = s => { const b = document.querySelector(s).getBoundingClientRect(); return { s, t: b.top, b: b.bottom, l: b.left, r: b.right }; };
      const cajas = ['.cab', '.antetitulo', '.portada-titulo', '.portada-entradilla', '.portada-acciones', '.portada-datos'].map(caja);
      const choques = [];
      for (let i = 0; i < cajas.length; i++) for (let j = i + 1; j < cajas.length; j++) {
        const a = cajas[i], b = cajas[j];
        if (a.t < b.b - 1 && b.t < a.b - 1 && a.l < b.r - 1 && b.l < a.r - 1) choques.push(a.s + ' × ' + b.s);
      }
      const movil = document.querySelector('.portada-movil').getBoundingClientRect();
      const ante = document.querySelector('.antetitulo').getBoundingClientRect();
      return { choques, movilAbajo: Math.round(movil.bottom), anteArriba: Math.round(ante.top), sw: document.documentElement.scrollWidth, iw: innerWidth };
    });
    ok(`Portada ${vp.width}×${vp.height}: sin solapes entre bloques ni con el móvil`, r.choques.length === 0 && r.anteArriba >= r.movilAbajo - 1 && r.sw === r.iw, JSON.stringify(r));
    await foto(page, `movil-${vp.width}x${vp.height}-portada`);
    await ctx.close();
  }

  /* ---------- 5. Sin GSAP (CDN caído) ---------- */
  console.log("== 5. Sin GSAP (CDN caído)");
  {
    const { page, errores, ctx } = await abrir(browser, { sinGsap: true });
    await page.goto(BASE); await espera(1500);
    const r = await page.evaluate(() => ({ motion: document.documentElement.classList.contains('has-motion'), cortina: getComputedStyle(document.getElementById('cortina')).display, ocultas: [...document.querySelectorAll('.palabra, .letra')].filter(e => getComputedStyle(e).opacity !== '1').length }));
    ok('Sin GSAP: cortina fuera, sin has-motion y ninguna palabra oculta', !r.motion && r.cortina === 'none' && r.ocultas === 0, JSON.stringify(r));
    await foto(page, 'sin-gsap-01-portada');
    await page.evaluate(() => document.querySelector('.adapta-pasos li:nth-child(4)').scrollIntoView({ block: 'center' })); await espera(900);
    ok('Sin GSAP: la adaptación cambia de paso con IntersectionObserver', (await page.getAttribute('#aula', 'data-paso')) === '3');
    await foto(page, 'sin-gsap-02-adaptacion');
    await foto(page, 'sin-gsap-03-pagina-entera', { fullPage: true });
    ok('Sin GSAP: sin errores de JS propios', errores.filter(e => !/ERR_FAILED|Failed to load/.test(e)).length === 0, JSON.stringify(errores));
    await ctx.close();
  }

  /* ---------- 6. Movimiento reducido ---------- */
  console.log("== 6. Movimiento reducido");
  {
    const { page, ctx } = await abrir(browser, { reduce: true });
    await page.goto(BASE); await espera(1200);
    const r = await page.evaluate(() => ({ motion: document.documentElement.classList.contains('has-motion'), cortina: getComputedStyle(document.getElementById('cortina')).display, estado: document.querySelector('[data-estado]').textContent, lenis: document.documentElement.classList.contains('lenis') }));
    ok('Reducido: cortina fuera, sin has-motion ni Lenis, estado vivo', !r.motion && r.cortina === 'none' && !r.lenis && /Abierto|Cerrado/.test(r.estado), JSON.stringify(r));
    await foto(page, 'reducido-01-portada');
    await page.evaluate(() => document.querySelector('.adapta-pasos li:nth-child(5)').scrollIntoView({ block: 'center' })); await espera(700);
    ok('Reducido: la adaptación sigue cambiando de paso', (await page.getAttribute('#aula', 'data-paso')) === '4' && (await page.textContent('#adapta-dia')) === '7–8');
    await foto(page, 'reducido-02-adaptacion');
    await page.evaluate(() => document.querySelector('.cifras').scrollIntoView({ block: 'center' })); await espera(500);
    ok('Reducido: los contadores muestran su cifra final', (await page.textContent('.cifras dd .contador')).trim() === '39');
    await ctx.close();
  }

  /* ---------- 7. Cookies + mandos (maqueta y paleta) con ?revision ---------- */
  console.log("== 7. Cookies + mandos (maqueta y paleta) con ?revision");
  {
    const { page, ctx } = await abrir(browser, { cookiesOk: false });
    await page.goto(BASE + '?revision'); await espera(3500);
    const antes = await page.evaluate(() => ({ cookies: getComputedStyle(document.getElementById('cookies')).display, mandos: document.getElementById('mandos').hidden }));
    ok('Cookies: visible con display:flex y los mandos apartados mientras tanto', antes.cookies === 'flex' && antes.mandos === true, JSON.stringify(antes));
    await foto(page, 'escritorio-17-cookies');
    await page.click('#cookies-ok'); await espera(300);
    const despues = await page.evaluate(() => ({ cookies: getComputedStyle(document.getElementById('cookies')).display, mandos: document.getElementById('mandos').hidden, ls: localStorage.getItem('abaneo-cookies') }));
    ok('Cookies: el botón la cierra de verdad (display:none) y aparecen los mandos', despues.cookies === 'none' && despues.mandos === false && despues.ls === '1', JSON.stringify(despues));
    /* sin ?revision no hay mandos */
    const p2 = await ctx.newPage(); await p2.route('https://cdn.jsdelivr.net/npm/**', r => r.abort()); await p2.goto(BASE); await espera(800);
    ok('Mandos ocultos sin ?revision', await p2.evaluate(() => document.getElementById('mandos').hidden));
    await p2.close();
    /* maqueta */
    await hasta(page, '.aulas-cab', 0);
    await foto(page, 'escritorio-18-movil-aulas');
    await page.click('[data-maqueta="sobria"]'); await espera(1200);
    const s = await page.evaluate(() => ({
      clase: document.documentElement.classList.contains('maqueta-sobria'),
      ratio: getComputedStyle(document.querySelector('.ratio')).display,
      svg: getComputedStyle(document.querySelector('.aula-tarjeta-dibujo svg')).display,
      dato: getComputedStyle(document.querySelector('.aula-tarjeta-dibujo'), '::before').content,
      piezas: [...document.querySelectorAll('.pieza')].filter(p => getComputedStyle(p).display !== 'none').length,
      ls: localStorage.getItem('abaneo-maqueta'), sw: document.documentElement.scrollWidth, iw: innerWidth,
      pressed: document.querySelector('[data-maqueta="sobria"]').getAttribute('aria-pressed')
    }));
    ok('Maqueta sobria: fuera piezas y dibujos, entra el gráfico de ratio y el dato', s.clase && s.ratio === 'block' && s.svg === 'none' && /8/.test(s.dato) && s.piezas === 0 && s.ls === 'sobria' && s.pressed === 'true' && s.sw === s.iw, JSON.stringify(s));
    await foto(page, 'escritorio-19-sobria-aulas');
    await page.evaluate(() => document.querySelector('.ratio').scrollIntoView({ block: 'center' })); await espera(800);
    await foto(page, 'escritorio-20-sobria-ratio');
    await page.click('[data-maqueta="movil"]'); await espera(500);
    ok('Maqueta: se puede volver a «Móvil»', await page.evaluate(() => !document.documentElement.classList.contains('maqueta-sobria') && getComputedStyle(document.querySelector('.ratio')).display === 'none'));
    /* paleta */
    const colorBoton = () => page.evaluate(() => getComputedStyle(document.querySelector('.boton-lleno')).backgroundColor);
    const c0 = await colorBoton();
    await page.click('[data-paleta="pino"]'); await espera(500);
    const c1 = await colorBoton();
    await page.click('[data-paleta="malva"]'); await espera(500);
    const c2 = await colorBoton();
    const pal = await page.evaluate(() => ({ ls: localStorage.getItem('abaneo-paleta'), pressed: document.querySelector('[data-paleta="malva"]').getAttribute('aria-pressed'), otro: document.querySelector('[data-paleta="tomate"]').getAttribute('aria-pressed') }));
    ok('Paleta: cada botón cambia el color computado de verdad', c0 !== c1 && c1 !== c2 && c0 !== c2, [c0, c1, c2].join(' | '));
    ok('Paleta: aria-pressed y localStorage correctos', pal.ls === 'malva' && pal.pressed === 'true' && pal.otro === 'false', JSON.stringify(pal));
    await page.evaluate(() => scrollTo(0, 0)); await espera(600); await foto(page, 'escritorio-21-paleta-malva');
    /* recarga: la clase tiene que estar en cuanto hay DOM, sin parpadeo */
    await page.goto(BASE + '?revision', { waitUntil: 'commit' });
    await page.waitForSelector('#cortina', { state: 'attached' });
    const temprano = await page.evaluate(() => document.documentElement.className);
    ok('Paleta guardada aplicada antes de pintar (script bloqueante del head)', /paleta-malva/.test(temprano), temprano);
    await espera(3500); await foto(page, 'escritorio-22-paleta-malva-recarga');
    await page.click('[data-paleta="pino"]'); await espera(400); await foto(page, 'escritorio-23-paleta-pino');
    await page.click('[data-paleta="tomate"]');
    await ctx.close();
  }

  /* ---------- 8. Marcadores pendientes en las tres páginas ---------- */
  console.log("== 8. Marcadores pendientes en las tres páginas");
  {
    const { page, ctx } = await abrir(browser);
    let malos = [];
    for (const u of ['', 'aviso-legal.html', '404.html']) {
      await page.goto(BASE + u); await espera(400);
      const t = await page.evaluate(() => document.body.textContent);
      if (/\[PENDIENTE\]|\bTODO\b/.test(t) || /lorem ipsum/i.test(t)) malos.push(u || 'index');
      const robots = await page.evaluate(() => (document.querySelector('meta[name=robots]') || {}).content);
      const sello = /Sitio de demostración/.test(t);
      if (robots !== 'noindex, nofollow' || !sello) malos.push((u || 'index') + ': robots/sello');
    }
    ok('Sin marcadores pendientes; noindex y sello en las tres páginas', malos.length === 0, malos.join(', '));
    await ctx.close();
  }

  if (fotosFallidas.length) console.log('Capturas que no salieron: ' + fotosFallidas.join(', '));
  await browser.close();
  const fallidos = resultados.filter(r => !r.ok);
  console.log(`\n${resultados.length - fallidos.length}/${resultados.length} comprobaciones en verde`);
  fs.writeFileSync(path.join(__dirname, 'verificacion.json'), JSON.stringify(resultados, null, 1));
  process.exit(fallidos.length ? 1 : 0);
})();
