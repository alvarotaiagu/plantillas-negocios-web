// Verificación de la plantilla (PLIEGO §7 + trampas del encargo).
// Uso: PF_LIBS=<carpeta con gsap/lenis/axe> node scripts/verify.js
// Escribe las capturas en screenshots/ y el resumen en scripts/verify-resultado.json
const fs = require('fs'), path = require('path');
const { servidor, navegador, contexto, URL } = require('./arnes');
const SHOTS = path.resolve(__dirname, '../screenshots');
fs.mkdirSync(SHOTS, { recursive: true });
const LIBS = process.env.PF_LIBS;
const resultados = [];
function ok(nombre, cond, detalle) { resultados.push({ nombre, ok: !!cond, detalle }); console.log((cond ? '✔' : '✘') + ' ' + nombre + (detalle !== undefined ? ' — ' + JSON.stringify(detalle) : '')); }
const espera = ms => new Promise(r => setTimeout(r, ms));

async function abrir(nav, o = {}) {
  const ctx = await contexto(nav, { sinCdn: o.sinCdn, ctx: Object.assign({ viewport: o.vp || { width: 1440, height: 900 }, isMobile: !!o.movil, hasTouch: !!o.movil, reducedMotion: o.reducido ? 'reduce' : 'no-preference' }, o.ctx || {}) });
  const p = await ctx.newPage();
  p.errores = [];
  p.on('console', m => { if (m.type() === 'error') p.errores.push(m.text()); });
  p.on('pageerror', e => p.errores.push(String(e)));
  p.on('response', r => { if (r.status() >= 400 && !/fonts\.g/.test(r.url())) p.errores.push(r.status() + ' ' + r.url()); });
  if (o.antes) await o.antes(p);
  await p.goto(URL + (o.ruta || ''), { waitUntil: 'load' });
  return { ctx, p };
}
async function cerrarCookies(p) { const b = await p.$('#cookies-ok'); if (b && await b.isVisible()) await b.click(); }
async function bajar(p, hasta, paso = 300, pausa = 60) {
  for (let i = 0; i < 400; i++) {
    const y = await p.evaluate(() => window.scrollY);
    if (hasta !== undefined && y >= hasta) break;
    const fin = await p.evaluate(() => window.scrollY + innerHeight >= document.documentElement.scrollHeight - 2);
    if (fin) break;
    await p.mouse.wheel(0, paso); await espera(pausa);
  }
}
async function irA(p, sel, desfase = 0) {
  const y = await p.evaluate(([s, d]) => { const el = document.querySelector(s); return el.getBoundingClientRect().top + window.scrollY + d; }, [sel, desfase]);
  const actual = await p.evaluate(() => window.scrollY);
  const dist = y - actual, pasos = Math.ceil(Math.abs(dist) / 400);
  for (let i = 0; i < pasos; i++) { await p.mouse.wheel(0, dist / pasos); await espera(70); }
  await espera(1600);
}

(async () => {
  const s = await servidor(); const nav = await navegador();

  /* ---------- 1. Escritorio: carga, cortina a medias, consola, secciones ---------- */
  {
    const { ctx, p } = await abrir(nav, { antes: async (pg) => {
      const cdp = await pg.context().newCDPSession(pg); await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    } });
    // primer fotograma: en cuanto la chapa ha empezado a subir (caché fría: no se fía de un tiempo fijo)
    await p.waitForFunction(() => document.querySelector('.cortina-chapa').getBoundingClientRect().top < -20, null, { polling: 16, timeout: 8000 }).catch(() => {});
    const medio = await p.evaluate(() => { const c = document.querySelector('.cortina-chapa'); const r = c.getBoundingClientRect(); return { top: Math.round(r.top), fondoCortina: getComputedStyle(c).backgroundImage, fondoBody: getComputedStyle(document.body).backgroundColor }; });
    await p.screenshot({ path: path.join(SHOTS, 'cortina-a-medias-escritorio.png') });
    ok('Cortina: fotograma a medias capturado con la chapa en movimiento', medio.top < -10 && medio.top > -1100, medio);
    ok('Cortina de color distinto al fondo', medio.fondoCortina.indexOf(medio.fondoBody) < 0 && /rgb\(226, 85, 43\)/.test(medio.fondoCortina), medio);
    // segundo fotograma: en otra carga, para que la captura anterior no se lo coma
    {
      const c2 = await contexto(nav, { ctx: { viewport: { width: 1440, height: 900 } } });
      const p2 = await c2.newPage(); await p2.goto(URL, { waitUntil: 'load' });
      await p2.waitForFunction(() => { const b = document.querySelector('.cortina-chapa').getBoundingClientRect().bottom; return b < 650; }, null, { polling: 16, timeout: 8000 }).catch(() => {});
      const medio2 = await p2.evaluate(() => Math.round(document.querySelector('.cortina-chapa').getBoundingClientRect().bottom));
      await p2.screenshot({ path: path.join(SHOTS, 'cortina-a-medias-escritorio-2.png') });
      ok('Cortina: segundo fotograma con el canto dentado a la vista', medio2 > 0 && medio2 < 900, medio2);
      await c2.close();
    }
    await espera(2600);
    const cort = await p.evaluate(() => getComputedStyle(document.getElementById('cortina')).display);
    ok('Cortina acaba en display:none (normal)', cort === 'none', cort);
    await p.screenshot({ path: path.join(SHOTS, 'escritorio-01-portada.png') });

    // Mando: oculto sin ?revision
    ok('Mando oculto sin ?revision', await p.evaluate(() => document.getElementById('mando').hidden));
    // Cookies: el display:flex va en :not([hidden])
    const ck = await p.evaluate(() => getComputedStyle(document.getElementById('cookies')).display);
    await cerrarCookies(p);
    const ck2 = await p.evaluate(() => ({ d: getComputedStyle(document.getElementById('cookies')).display, ls: localStorage.getItem('pasofino-cookies') }));
    ok('Cookies: visible y el botón lo cierra de verdad', ck === 'flex' && ck2.d === 'none' && ck2.ls === 'ok', { antes: ck, despues: ck2 });

    // Cursor propio: al primer pointermove de ratón
    await p.mouse.move(700, 400); await p.mouse.move(720, 420); await espera(200);
    const cur = await p.evaluate(() => ({ clase: document.documentElement.classList.contains('cursor-propio'), cursor: getComputedStyle(document.body).cursor, cursorEnlace: getComputedStyle(document.querySelector('.boton')).cursor, visible: getComputedStyle(document.querySelector('.cursor')).display }));
    ok('Cursor propio: nativo oculto (cursor:none !important) y punto+aro visibles', cur.clase && cur.cursor === 'none' && cur.cursorEnlace === 'none' && cur.visible === 'block', cur);
    // sobre un enlace
    const bb = await p.$eval('.portada-acciones .boton', e => { const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    await p.mouse.move(bb[0], bb[1]); await espera(500);
    ok('Cursor contextual sobre enlace', await p.evaluate(() => document.querySelector('.cursor').classList.contains('es-enlace')));

    // WebGL vivo
    const gl = await p.evaluate(() => !document.documentElement.classList.contains('sin-webgl') && document.getElementById('tornillo').width > 0);
    ok('Hero WebGL activo (canvas con búfer)', gl);
    // el scroll aprieta el tornillo: la lectura cambia
    const lect0 = await p.textContent('#lect-vueltas');
    await p.mouse.wheel(0, 400); await espera(900);
    const lect1 = await p.textContent('#lect-vueltas');
    ok('El scroll da vueltas al tornillo (lectura en vivo)', lect0 !== lect1, { antes: lect0, despues: lect1 });
    await p.screenshot({ path: path.join(SHOTS, 'escritorio-02-portada-apretando.png') });

    // Secciones
    const secs = [['#mostrador', 'escritorio-03-mostrador'], ['#cajones', 'escritorio-06-cajones'], ['.cinta', 'escritorio-08-cinta'], ['#panel', 'escritorio-09-panel'], ['#galga', 'escritorio-10-galga'], ['#tarifa', 'escritorio-11-tarifa'], ['#visita', 'escritorio-12-visita'], ['.pie', 'escritorio-14-pie']];
    await irA(p, '#mostrador', -80); await p.screenshot({ path: path.join(SHOTS, 'escritorio-03-mostrador.png') });
    // Llave anclada: tres momentos del scrub
    await irA(p, '#llave', 0);
    const pin = await p.evaluate(() => { const f = document.querySelector('.llave-fija'); return { pinned: !!f.closest('.pin-spacer'), top: Math.round(f.getBoundingClientRect().top) }; });
    ok('Llave: secuencia anclada (pin) con ScrollTrigger', pin.pinned, pin);
    const estados = [];
    for (const [k, nom] of [[0.25, 'escritorio-04-llave-mordazas'], [0.55, 'escritorio-05-llave-corte'], [0.95, 'escritorio-05b-llave-bombin']]) {
      await p.mouse.wheel(0, 900 * 3.2 * (k - (estados.length ? [0.25, 0.55, 0.95][estados.length - 1] : 0))); await espera(1800);
      estados.push(await p.evaluate(() => ({ paso: document.querySelector('.paso.es-activo').dataset.paso, crono: document.getElementById('crono').textContent })));
      await p.screenshot({ path: path.join(SHOTS, nom + '.png') });
    }
    ok('Llave: el scrub avanza paso y cronómetro', new Set(estados.map(e => e.paso)).size === 3, estados);

    // Pila sticky: mismo alto (el de la más alta), mismo margin-bottom, ::after con reposo
    await irA(p, '#cajones', 0);
    const pila = await p.evaluate(() => {
      const lis = [...document.querySelectorAll('.pila-item')];
      const alturas = lis.map(l => Math.round(l.getBoundingClientRect().height));
      const mb = lis.map(l => getComputedStyle(l).marginBottom);
      const max = Math.max(...lis.map(l => l.firstElementChild.offsetHeight));
      return { alturas, mb, max, vh: innerHeight, after: getComputedStyle(document.querySelector('.pila'), '::after').height, sticky: getComputedStyle(lis[0]).position };
    });
    ok('Pila: <li> sticky, todos del alto de la más alta (no 100vh)', pila.sticky === 'sticky' && new Set(pila.alturas).size === 1 && Math.abs(pila.alturas[0] - pila.max) <= 1 && pila.alturas[0] !== pila.vh, pila);
    ok('Pila: mismo margin-bottom en todos, incluido el último, y ::after de reposo', new Set(pila.mb).size === 1 && parseFloat(pila.after) > 0, { mb: pila.mb, after: pila.after });
    // pasos de 90 px: nunca dos tarjetas con la misma cima salvo apiladas en orden
    const muestras = [];
    for (let i = 0; i < 40; i++) {
      await p.mouse.wheel(0, 90); await espera(140);
      muestras.push(await p.evaluate(() => [...document.querySelectorAll('.pila-item')].map(l => Math.round(l.getBoundingClientRect().top))));
      if (i === 8) await p.screenshot({ path: path.join(SHOTS, 'escritorio-06-cajones.png') });
      if (i === 22) await p.screenshot({ path: path.join(SHOTS, 'escritorio-07-cajones-apilados.png') });
    }
    const ordenOk = muestras.every(m => m.every((t, i) => i === 0 || t >= m[i - 1]));
    ok('Pila en pasos de 90 px: el orden de apilado se mantiene en las 40 muestras', ordenOk, muestras[20]);

    await irA(p, '.cinta', -200); await p.screenshot({ path: path.join(SHOTS, 'escritorio-08-cinta.png') });
    const cinta0 = await p.$eval('#cinta-fila', e => e.style.transform); await espera(500);
    const cinta1 = await p.$eval('#cinta-fila', e => e.style.transform);
    ok('Marquesina en movimiento', cinta0 !== cinta1, [cinta0, cinta1]);

    await irA(p, '#panel', -40);
    await p.click('.herramienta:nth-child(2)'); await espera(300);
    const ficha = await p.evaluate(() => ({ estado: document.getElementById('ficha-estado').textContent, nombre: document.getElementById('ficha-nombre').textContent, pressed: document.querySelector('.herramienta:nth-child(2)').getAttribute('aria-pressed') }));
    ok('Panel de alquiler: la ficha cambia y marca la alquilada', /Alquilada/.test(ficha.estado) && ficha.pressed === 'true', ficha);
    const tb = await p.$eval('.herramienta:nth-child(3)', e => { const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    await p.mouse.move(tb[0], tb[1]); await espera(500);
    ok('Cursor tuerca sobre la herramienta', await p.evaluate(() => document.querySelector('.cursor').classList.contains('es-tuerca')));
    await p.screenshot({ path: path.join(SHOTS, 'escritorio-09-panel.png') });

    await irA(p, '#galga', -40);
    await p.click('#galga-m button:nth-child(7)'); await espera(200);
    const gal = await p.evaluate(() => ({ llave: document.getElementById('galga-llave').textContent, ancho: document.getElementById('galga-svg').getAttribute('width'), css: Math.round(document.getElementById('galga-svg').getBoundingClientRect().width) }));
    ok('Galga: M12 → llave del 19 y SVG a escala 1:1 (atributo = px CSS)', gal.llave === 'del 19' && +gal.ancho === gal.css, gal);
    await p.screenshot({ path: path.join(SHOTS, 'escritorio-10-galga.png') });

    await irA(p, '#tarifa', -40); await espera(800); await p.screenshot({ path: path.join(SHOTS, 'escritorio-11-tarifa.png') });
    await irA(p, '#visita', -20); await p.screenshot({ path: path.join(SHOTS, 'escritorio-12-visita.png') });
    const hoy = await p.evaluate(() => ({ filas: document.querySelectorAll('.horario-tabla tr.es-hoy').length, estado: document.querySelector('[data-estado-largo]').textContent }));
    ok('Horario: fila de hoy con clase prefijada es-hoy y estado calculado', hoy.filas === 1 && hoy.estado.length > 10, hoy);
    // Mapa bajo clic
    const antes = await p.evaluate(() => document.querySelectorAll('#mapa iframe').length);
    await p.route('https://www.google.com/**', r => r.fulfill({ status: 200, contentType: 'text/html', body: '<p>mapa</p>' }));
    await p.click('#mapa-boton'); await espera(400);
    const despues = await p.evaluate(() => { const f = document.querySelector('#mapa iframe'); return f ? f.src : null; });
    ok('Mapa: sin iframe hasta el clic, con iframe después', antes === 0 && /output=embed/.test(despues || ''), { antes, despues });
    // Formulario
    await irA(p, '#encargo', -100);
    await p.click('#encargo button[type=submit]'); await espera(100);
    const inval = await p.evaluate(() => document.querySelectorAll('#encargo [aria-invalid=true]').length);
    await p.fill('#encargo [name=pieza]', 'Junta tórica 18×2'); await p.fill('#encargo [name=nombre]', 'Uxía'); await p.fill('#encargo [name=tel]', '600 00 00 00');
    await p.click('#encargo button[type=submit]'); await espera(100);
    const resp = await p.textContent('#encargo-respuesta');
    ok('Formulario de encargo: valida y responde (sin enviar)', inval === 3 && /No se ha enviado/.test(resp), { inval, resp });
    await p.screenshot({ path: path.join(SHOTS, 'escritorio-13-encargo.png') });
    await bajar(p); await espera(1200); await p.screenshot({ path: path.join(SHOTS, 'escritorio-14-pie.png') });

    // Anchura real y marcadores
    const anch = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
    ok('Sin desbordamiento horizontal (escritorio)', anch.sw <= anch.iw, anch);
    const txt = await p.evaluate(() => document.body.textContent + document.head.innerHTML);
    ok('Sin [PENDIENTE], TODO ni lorem', !/\[PENDIENTE\]|\bTODO\b/.test(txt) && !/lorem ipsum/i.test(txt));
    ok('noindex, nofollow en la portada', await p.evaluate(() => document.querySelector('meta[name=robots]').content === 'noindex, nofollow'));
    ok('Sello de demo en el pie', /Sitio de demostración\. Paso Fino es un negocio ficticio/.test(txt));

    // Tareas largas: control con setTimeout (el de page.evaluate no cuenta)
    const lt = await p.evaluate(() => window.__pasofino.longtasks.slice());
    await p.evaluate(() => setTimeout(() => { const t = performance.now(); while (performance.now() - t < 120); }, 0)); await espera(600);
    const lt2 = await p.evaluate(() => window.__pasofino.longtasks.length);
    ok('PerformanceObserver de longtask vivo (control de 120 ms detectado)', lt2 > lt.length, { antes: lt.length, despues: lt2 });
    fs.writeFileSync(path.join(__dirname, 'longtasks-escritorio.json'), JSON.stringify(lt, null, 1));
    resultados.push({ nombre: 'longtasks escritorio (carga en frío + recorrido completo)', ok: true, detalle: { n: lt.length, total: lt.reduce((a, b) => a + b.dur, 0), max: Math.max(0, ...lt.map(x => x.dur)) } });
    console.log('  longtasks escritorio:', lt.length, 'total', lt.reduce((a, b) => a + b.dur, 0), 'ms, máx', Math.max(0, ...lt.map(x => x.dur)));
    ok('Consola limpia y cero 404 (escritorio)', p.errores.length === 0, p.errores);

    // axe
    if (LIBS) {
      await p.addScriptTag({ path: path.join(LIBS, 'axe/package/axe.min.js') });
      const ax = await p.evaluate(async () => { const r = await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] }); return r.violations.map(v => ({ id: v.id, impacto: v.impact, n: v.nodes.length, ej: v.nodes.slice(0, 2).map(n => n.target.join(' ')) })); });
      fs.writeFileSync(path.join(__dirname, 'axe-escritorio.json'), JSON.stringify(ax, null, 1));
      ok('axe (WCAG 2.1 AA + buenas prácticas) en portada de escritorio: 0 violaciones', ax.length === 0, ax);
    }
    await ctx.close();
  }

  /* ---------- 2. Móvil 390×844: menú, hero, secciones ---------- */
  {
    const { ctx, p } = await abrir(nav, { vp: { width: 390, height: 844 }, movil: true });
    await p.waitForFunction(() => { const b = document.querySelector('.cortina-chapa').getBoundingClientRect().bottom; return b < 600; }, null, { polling: 16, timeout: 8000 }).catch(() => {});
    await p.screenshot({ path: path.join(SHOTS, 'cortina-a-medias-movil.png') });
    await espera(2600);
    await p.screenshot({ path: path.join(SHOTS, 'movil-01-portada-con-cookies.png') });
    // Mando no tapa las cookies; cerrar
    await cerrarCookies(p); await espera(300);
    await p.screenshot({ path: path.join(SHOTS, 'movil-02-portada.png') });
    // Táctil: nada de cursor propio
    await p.tap('.portada-lema'); await espera(200);
    ok('Táctil: sin cursor propio', await p.evaluate(() => !document.documentElement.classList.contains('cursor-propio') && getComputedStyle(document.querySelector('.cursor')).display === 'none'));
    // Menú móvil
    await p.click('#menu-boton'); await espera(900);
    const m = await p.evaluate(() => { const n = document.getElementById('menu'); const cs = getComputedStyle(n); return { exp: document.getElementById('menu-boton').getAttribute('aria-expanded'), alto: Math.round(n.getBoundingClientRect().height), vh: innerHeight, vis: cs.visibility, inset: cs.bottom }; });
    await p.screenshot({ path: path.join(SHOTS, 'movil-03-menu.png') });
    ok('Menú móvil: abre, aria-expanded y ocupa la pantalla (100dvh, no inset:0)', m.exp === 'true' && Math.abs(m.alto - m.vh) <= 2 && m.vis === 'visible', m);
    await p.click('#menu-boton', { timeout: 3000 }); await espera(900);
    const m2 = await p.evaluate(() => document.getElementById('menu-boton').getAttribute('aria-expanded'));
    ok('Menú móvil: el botón queda por encima y cierra', m2 === 'false', m2);
    await p.click('#menu-boton'); await espera(800);
    await p.click('#menu a[href="#panel"]'); await espera(2200);
    const tras = await p.evaluate(() => ({ exp: document.getElementById('menu-boton').getAttribute('aria-expanded'), top: Math.round(document.getElementById('panel').getBoundingClientRect().top) }));
    ok('Menú móvil: un enlace cierra el menú y lleva a la sección', tras.exp === 'false' && Math.abs(tras.top) < 200, tras);
    // Recorrido por secciones
    await p.evaluate(() => window.scrollTo(0, 0)); await espera(600);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    let i = 0;
    for (let y = 0; y < H && i < 26; y += 844 * 0.85, i++) {
      await p.mouse.wheel(0, 844 * 0.85); await espera(900);
      await p.screenshot({ path: path.join(SHOTS, `movil-${String(i + 4).padStart(2, '0')}-recorrido.png`) });
    }
    const anch = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
    ok('Sin desbordamiento horizontal (móvil 390)', anch.sw <= anch.iw, anch);
    const lt = await p.evaluate(() => window.__pasofino.longtasks.slice());
    resultados.push({ nombre: 'longtasks móvil 390 (recorrido completo)', ok: true, detalle: { n: lt.length, total: lt.reduce((a, b) => a + b.dur, 0), max: Math.max(0, ...lt.map(x => x.dur)) } });
    console.log('  longtasks móvil:', lt.length, 'total', lt.reduce((a, b) => a + b.dur, 0), 'ms');
    ok('Consola limpia (móvil)', p.errores.length === 0, p.errores);
    if (LIBS) {
      await p.evaluate(() => window.scrollTo(0, 0)); await espera(500);
      await p.addScriptTag({ path: path.join(LIBS, 'axe/package/axe.min.js') });
      const ax = await p.evaluate(async () => { const r = await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa'] }); return r.violations.map(v => ({ id: v.id, n: v.nodes.length, ej: v.nodes.slice(0, 2).map(n => n.target.join(' ')) })); });
      ok('axe en móvil: 0 violaciones', ax.length === 0, ax);
    }
    await ctx.close();
  }

  /* ---------- 3. Hero en móviles pequeños: sin solapes ---------- */
  for (const vp of [{ width: 360, height: 640 }, { width: 375, height: 667 }]) {
    const { ctx, p } = await abrir(nav, { vp, movil: true, antes: async pg => { await pg.addInitScript(() => { try { localStorage.setItem('pasofino-cookies', 'ok'); } catch (e) {} }); } });
    await espera(3800);
    await p.screenshot({ path: path.join(SHOTS, `movil-hero-${vp.width}x${vp.height}.png`) });
    const cajas = await p.evaluate(() => ['.portada .etiqueta', '.portada-titulo', '.portada-lema', '.portada-acciones', '.portada-lectura', '.cabecera'].map(s => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); return { s, vis: getComputedStyle(e).display !== 'none', t: Math.round(r.top), b: Math.round(r.bottom), l: Math.round(r.left), r: Math.round(r.right) }; }).filter(c => c.vis));
    const solapes = [];
    for (let a = 0; a < cajas.length; a++) for (let b = a + 1; b < cajas.length; b++) {
      const A = cajas[a], B = cajas[b];
      if (A.t < B.b - 1 && B.t < A.b - 1 && A.l < B.r - 1 && B.l < A.r - 1) solapes.push(A.s + ' × ' + B.s);
    }
    const dentro = cajas.every(c => c.b <= vp.height && c.r <= vp.width);
    ok(`Hero ${vp.width}×${vp.height}: sin solapes y todo dentro de pantalla`, solapes.length === 0 && dentro, { solapes, cajas: cajas.map(c => c.s + ' ' + c.t + '-' + c.b) });
    await ctx.close();
  }

  /* ---------- 4. Sin GSAP (CDN tumbado) ---------- */
  {
    const { ctx, p } = await abrir(nav, { sinCdn: true });
    await espera(1800);
    const r = await p.evaluate(() => ({ cort: getComputedStyle(document.getElementById('cortina')).display, motion: document.documentElement.classList.contains('has-motion'), letras: getComputedStyle(document.querySelector('.portada-titulo .letra')).opacity, entra: getComputedStyle(document.querySelector('.mostrador-cuerpo')).clipPath }));
    ok('Sin GSAP: cortina en display:none y contenido visible', r.cort === 'none' && !r.motion && r.letras === '1' && r.entra === 'none', r);
    await cerrarCookies(p);
    await p.screenshot({ path: path.join(SHOTS, 'sin-gsap-01-portada.png') });
    await irA(p, '#llave', 0); await p.screenshot({ path: path.join(SHOTS, 'sin-gsap-02-llave.png') });
    await irA(p, '#cajones', 0); await p.screenshot({ path: path.join(SHOTS, 'sin-gsap-03-cajones.png') });
    const errs = p.errores.filter(e => !/jsdelivr|net::ERR_FAILED|Failed to load resource/.test(e));
    ok('Sin GSAP: sin errores de JS propios', errs.length === 0, errs);
    await ctx.close();
  }

  /* ---------- 5. Movimiento reducido ---------- */
  {
    const { ctx, p } = await abrir(nav, { reducido: true });
    await espera(600);
    const r = await p.evaluate(() => ({ cort: getComputedStyle(document.getElementById('cortina')).display, lenis: document.documentElement.classList.contains('lenis'), motion: document.documentElement.classList.contains('has-motion') }));
    ok('Reducido: cortina en display:none, sin Lenis y sin estados vacíos', r.cort === 'none' && !r.lenis && !r.motion, r);
    await cerrarCookies(p);
    await p.screenshot({ path: path.join(SHOTS, 'reducido-01-portada.png') });
    // El contenido sigue cambiando: la lectura del tornillo y el paso de la llave
    await p.evaluate(() => window.scrollTo(0, 500)); await espera(300);
    const v = await p.textContent('#lect-vueltas');
    await p.evaluate(() => document.querySelector('#pasos .paso:nth-child(2)').scrollIntoView({ block: 'center' })); await espera(400);
    const a = await p.evaluate(() => ({ paso: document.querySelector('.paso.es-activo').dataset.paso, crono: document.getElementById('crono').textContent }));
    await p.screenshot({ path: path.join(SHOTS, 'reducido-02-llave-paso2.png') });
    await p.evaluate(() => document.querySelector('[data-cuenta="3200"]').scrollIntoView({ block: 'center' })); await espera(400);
    const c = await p.textContent('[data-cuenta="3200"]');
    ok('Reducido: el contenido cambia (lectura, paso de la llave, contador)', v !== '0,0' && a.paso === '1' && c === '3200', { v, a, c });
    await ctx.close();
  }

  /* ---------- 6. Mando de demostración: densidades y paletas ---------- */
  {
    const { ctx, p } = await abrir(nav, { ruta: '?revision' });
    await espera(3500);
    const conCookies = await p.evaluate(() => document.getElementById('mando').hidden);
    await cerrarCookies(p); await espera(200);
    const sinCookies = await p.evaluate(() => document.getElementById('mando').hidden);
    ok('Mando: se aparta con el aviso de cookies y aparece al cerrarlo', conCookies === true && sinCookies === false, { conCookies, sinCookies });
    await p.screenshot({ path: path.join(SHOTS, 'mando-01-rosca.png') });
    const antes = await p.evaluate(() => ({ filete: getComputedStyle(document.querySelector('.filete')).display, granel: getComputedStyle(document.querySelector('.granel')).display, cabeza: getComputedStyle(document.querySelector('.metrica-cabeza')).display }));
    await p.click('[data-maqueta="sobria"]'); await espera(500);
    const desp = await p.evaluate(() => ({ filete: getComputedStyle(document.querySelector('.filete')).display, granel: getComputedStyle(document.querySelector('.granel')).display, cabeza: getComputedStyle(document.querySelector('.metrica-cabeza')).display, num: getComputedStyle(document.querySelector('.metrica-num')).fontSize, sw: document.documentElement.scrollWidth, iw: innerWidth, ls: localStorage.getItem('pasofino-maqueta'), pressed: document.querySelector('[data-maqueta="sobria"]').getAttribute('aria-pressed') }));
    ok('Sobria: fuera filetes y cabezas, entra el gráfico de granel y la métrica en grande, sin desbordar', antes.filete !== 'none' && antes.granel === 'none' && desp.filete === 'none' && desp.cabeza === 'none' && desp.granel === 'block' && parseFloat(desp.num) > 40 && desp.sw <= desp.iw && desp.ls === 'sobria' && desp.pressed === 'true', { antes, desp });
    await irA(p, '#mostrador', -80); await p.screenshot({ path: path.join(SHOTS, 'mando-02-sobria-mostrador.png') });
    await irA(p, '#cajones', -80); await p.screenshot({ path: path.join(SHOTS, 'mando-03-sobria-granel.png') });
    await p.click('[data-maqueta="rosca"]'); await espera(300);
    ok('Mando: se puede volver a «Rosca»', await p.evaluate(() => document.documentElement.classList.contains('d-rosca') && getComputedStyle(document.querySelector('.filete')).display !== 'none'));
    // Paletas
    const col = () => p.evaluate(() => ({ boton: getComputedStyle(document.querySelector('.boton-lleno')).backgroundColor, cinta: getComputedStyle(document.querySelector('.cinta')).backgroundColor, logo: getComputedStyle(document.querySelector('.marca-signo circle')).fill }));
    const c0 = await col();
    await p.click('[data-paleta="cobalto"]'); await espera(300);
    const c1 = await col();
    const c1b = await p.evaluate(() => ({ ls: localStorage.getItem('pasofino-paleta'), pressed: document.querySelector('[data-paleta="cobalto"]').getAttribute('aria-pressed'), otro: document.querySelector('[data-paleta="minio"]').getAttribute('aria-pressed') }));
    await irA(p, '.cinta', -200); await p.screenshot({ path: path.join(SHOTS, 'paleta-cobalto-cinta.png') });
    await p.click('[data-paleta="cardenillo"]'); await espera(300);
    const c2 = await col();
    await p.screenshot({ path: path.join(SHOTS, 'paleta-cardenillo-cinta.png') });
    ok('Paletas: cada botón cambia el color computado (botón y cinta) y el logo NO cambia', c0.boton !== c1.boton && c1.boton !== c2.boton && c0.cinta !== c1.cinta && c0.logo === c1.logo && c1.logo === c2.logo, { c0, c1, c2 });
    ok('Paletas: aria-pressed y localStorage', c1b.ls === 'cobalto' && c1b.pressed === 'true' && c1b.otro === 'false', c1b);
    // Recarga: la paleta guardada se aplica antes del primer pintado
    const cls = await new Promise(async res => {
      p.once('domcontentloaded', async () => res(await p.evaluate(() => document.documentElement.className)));
      p.reload();
    });
    ok('Recarga: la paleta guardada está en <html> desde el script bloqueante', /p-cardenillo/.test(cls), cls);
    await espera(3500);
    await p.evaluate(() => { localStorage.removeItem('pasofino-paleta'); localStorage.removeItem('pasofino-maqueta'); });
    await ctx.close();
  }

  /* ---------- 7. Aviso legal y 404 ---------- */
  {
    const { ctx, p } = await abrir(nav, { ruta: 'legal.html' });
    await espera(800);
    await p.screenshot({ path: path.join(SHOTS, 'legal.png'), fullPage: true });
    ok('Aviso legal: noindex, sello y menciona las claves de localStorage', await p.evaluate(() => document.querySelector('meta[name=robots]').content === 'noindex, nofollow' && /pasofino-maqueta/.test(document.body.textContent) && /negocio ficticio/.test(document.body.textContent)));
    ok('Aviso legal: consola limpia', p.errores.length === 0, p.errores);
    await p.goto(URL + 'no-existe', { waitUntil: 'load' }); await espera(600);
    await p.screenshot({ path: path.join(SHOTS, '404.png') });
    ok('404 con el mismo lenguaje visual y noindex', await p.evaluate(() => /pasado de rosca/i.test(document.body.textContent) && getComputedStyle(document.body).backgroundColor === 'rgb(14, 20, 17)' && document.querySelector('meta[name=robots]').content === 'noindex, nofollow'));
    await ctx.close();
  }

  /* ---------- 8. Estático: trampas de código ---------- */
  {
    const js = fs.readFileSync(path.join(__dirname, '../js/main.js'), 'utf8');
    const css = fs.readFileSync(path.join(__dirname, '../css/styles.css'), 'utf8');
    const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
    ok('Canvas/WebGL: sin ctx.filter ni shadowBlur', !/\.filter\s*=|shadowBlur/.test(js));
    ok('Cookies: display:flex solo en :not([hidden])', /\.cookies:not\(\[hidden\]\)\s*\{\s*display:\s*flex/.test(css) && !/\.cookies\s*\{[^}]*display:\s*flex/.test(css));
    ok('Lenis desde jsDelivr, nunca cdnjs', /cdn\.jsdelivr\.net\/npm\/lenis@/.test(html) && !/cdnjs/.test(html));
    ok('Menú móvil con height:100dvh', /\.menu \{\s*position: fixed; top: 0; left: 0; right: 0; height: 100dvh;/.test(css));
    ok('Clases de estado con prefijo es-', !/classList\.(add|toggle)\('(activo|abierto|visible|hoy|dentro)'/.test(js));
  }

  fs.writeFileSync(path.join(__dirname, 'verify-resultado.json'), JSON.stringify(resultados, null, 1));
  const mal = resultados.filter(r => !r.ok);
  console.log(`\n${resultados.length - mal.length}/${resultados.length} en verde`);
  await nav.close(); s.close();
  process.exit(mal.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
