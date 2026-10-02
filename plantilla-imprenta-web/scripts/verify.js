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
    await p.waitForFunction(() => document.querySelector('.cortina-pliego').getBoundingClientRect().top < -20, null, { polling: 16, timeout: 8000 }).catch(() => {});
    const medio = await p.evaluate(() => { const c = document.querySelector('.cortina-pliego'); const r = c.getBoundingClientRect(); return { top: Math.round(r.top), fondoCortina: getComputedStyle(c).backgroundColor, fondoBody: getComputedStyle(document.body).backgroundColor }; });
    await p.screenshot({ path: path.join(SHOTS, 'cortina-a-medias-escritorio.png') });
    ok('Cortina: fotograma a medias capturado con la chapa en movimiento', medio.top < -20 && medio.top > -1100, medio);
    ok('Cortina de color distinto al fondo', medio.fondoCortina !== medio.fondoBody, medio);
    // segundo fotograma: en otra carga, para que la captura anterior no se lo coma
    {
      const c2 = await contexto(nav, { ctx: { viewport: { width: 1440, height: 900 } } });
      const p2 = await c2.newPage(); await p2.goto(URL, { waitUntil: 'load' });
      await p2.waitForFunction(() => { const b = document.querySelector('.cortina-pliego').getBoundingClientRect().bottom; return b < 650; }, null, { polling: 16, timeout: 8000 }).catch(() => {});
      const medio2 = await p2.evaluate(() => Math.round(document.querySelector('.cortina-pliego').getBoundingClientRect().bottom));
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
    const ck2 = await p.evaluate(() => ({ d: getComputedStyle(document.getElementById('cookies')).display, ls: localStorage.getItem('tresmm-cookies') }));
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
    const gl = await p.evaluate(() => !document.documentElement.classList.contains('sin-webgl') && document.getElementById('trama').width > 0);
    ok('Hero WebGL activo (trama CMYK con búfer)', gl);
    // cuentahílos: el cursor sobre el cartel enciende la lupa y apaga el aro
    const hb = await p.$eval('.pliego-hoja', e => { const r = e.getBoundingClientRect(); return [r.x + r.width * .5, r.y + r.height * .45]; });
    await p.mouse.move(hb[0] - 30, hb[1]); await p.mouse.move(hb[0], hb[1]); await espera(500);
    const lupa = await p.evaluate(() => ({ pliego: document.getElementById('pliego').classList.contains('es-lupa'), cursor: document.querySelector('.cursor').classList.contains('es-lupa'), op: getComputedStyle(document.querySelector('.pliego-lupa')).opacity }));
    ok('Cuentahílos: la lupa aparece sobre el cartel y el aro del cursor se aparta', lupa.pliego && lupa.cursor && +lupa.op > 0.5, lupa);
    await p.screenshot({ path: path.join(SHOTS, 'escritorio-02-cuentahilos.png') });
    await p.mouse.move(200, 600);
    const lin0 = await p.textContent('#lineatura');
    await p.mouse.wheel(0, 500); await espera(1000);
    const lin1 = await p.textContent('#lineatura');
    ok('El scroll acerca la trama (la lineatura baja en vivo)', +lin1 < +lin0, { antes: lin0, despues: lin1 });

    // Presupuestador
    await irA(p, '#presupuesto', -40);
    const t0 = await p.textContent('#calc-total');
    await p.click('#calc-productos button:nth-child(3)'); await espera(200);
    await p.$eval('#calc-cantidad', e => { e.value = 4; e.dispatchEvent(new Event('input', { bubbles: true })); }); await espera(200);
    const calc = await p.evaluate(() => ({ total: document.getElementById('calc-total').textContent, q: document.getElementById('calc-cantidad-valor').textContent, formato: document.getElementById('calc-formato').textContent, sel: document.querySelectorAll('#calc-svg rect[stroke-width="2"]').length }));
    ok('Presupuestador: producto y cantidad cambian total, formato y el formato resaltado a escala', calc.total !== t0 && calc.q === '250' && /297/.test(calc.formato) && calc.sel === 1, { t0, calc });
    await p.screenshot({ path: path.join(SHOTS, 'escritorio-03-presupuesto.png') });

    // Proceso anclado con scrub horizontal
    await irA(p, '#proceso', 0);
    const pin = await p.evaluate(() => ({ pinned: !!document.querySelector('.proceso-fijo').closest('.pin-spacer'), x: getComputedStyle(document.getElementById('proceso-fila')).transform }));
    await p.screenshot({ path: path.join(SHOTS, 'escritorio-04-proceso-inicio.png') });
    for (let i = 0; i < 10; i++) { await p.mouse.wheel(0, 160); await espera(80); }
    await espera(1400);
    const pin2 = await p.evaluate(() => ({ x: getComputedStyle(document.getElementById('proceso-fila')).transform, capa: getComputedStyle(document.querySelector('.capa-m')).opacity, p: getComputedStyle(document.getElementById('proceso-avance')).getPropertyValue('--p') }));
    await p.screenshot({ path: path.join(SHOTS, 'escritorio-05-proceso-color.png') });
    for (let i = 0; i < 10; i++) { await p.mouse.wheel(0, 160); await espera(80); }
    await espera(1400);
    await p.screenshot({ path: path.join(SHOTS, 'escritorio-06-proceso-final.png') });
    ok('Proceso: anclado (pin) y la fila se desplaza en horizontal con el scroll', pin.pinned && pin.x !== pin2.x, { pin, pin2 });

    await irA(p, '.cinta', -200); await p.screenshot({ path: path.join(SHOTS, 'escritorio-07-cinta.png') });
    const cinta0 = await p.$eval('#cinta-fila', e => e.style.transform); await espera(500);
    const cinta1 = await p.$eval('#cinta-fila', e => e.style.transform);
    ok('Marquesina en movimiento', cinta0 !== cinta1, [cinta0, cinta1]);

    await irA(p, '#papeles', -40); await espera(900);
    const ab = await p.evaluate(() => ({ abierto: document.getElementById('abanico').classList.contains('es-abierto'), a0: getComputedStyle(document.querySelector('.hoja-papel')).transform }));
    await p.click('.hoja-papel:nth-child(7)'); await espera(400);
    const ab2 = await p.evaluate(() => ({ g: document.getElementById('papel-gramaje').textContent, pressed: document.querySelector('.hoja-papel:nth-child(7)').getAttribute('aria-pressed') }));
    ok('Abanico: se abre al llegar y la hoja elegida cambia la ficha', ab.abierto && ab2.g === '350 g' && ab2.pressed === 'true', { ab, ab2 });
    await p.screenshot({ path: path.join(SHOTS, 'escritorio-08-papeles.png') });

    await irA(p, '#copias', -40); await espera(600); await p.screenshot({ path: path.join(SHOTS, 'escritorio-09-copias.png') });
    await irA(p, '#mostrador', -20); await p.screenshot({ path: path.join(SHOTS, 'escritorio-10-mostrador.png') });
    const hoy = await p.evaluate(() => ({ filas: document.querySelectorAll('.horario-tabla tr.es-hoy').length, estado: document.querySelector('[data-estado-largo]').textContent }));
    ok('Horario: fila de hoy con clase prefijada es-hoy y estado calculado', hoy.filas === 1 && hoy.estado.length > 10, hoy);
    const antes = await p.evaluate(() => document.querySelectorAll('#mapa iframe').length);
    await p.route('https://www.google.com/**', r => r.fulfill({ status: 200, contentType: 'text/html', body: '<p>mapa</p>' }));
    await p.click('#mapa-boton'); await espera(400);
    const despues = await p.evaluate(() => { const f = document.querySelector('#mapa iframe'); return f ? f.src : null; });
    ok('Mapa: sin iframe hasta el clic, con iframe después', antes === 0 && /output=embed/.test(despues || ''), { antes, despues });
    await p.click('#archivo button[type=submit]'); await espera(100);
    const inval = await p.evaluate(() => document.querySelectorAll('#archivo [aria-invalid=true]').length);
    await p.fill('#archivo [name=trabajo]', '200 flyers A5'); await p.fill('#archivo [name=nombre]', 'Uxía'); await p.fill('#archivo [name=contacto]', 'uxia@ejemplo.com');
    await p.click('#archivo button[type=submit]'); await espera(100);
    const resp = await p.textContent('#archivo-respuesta');
    ok('Formulario: valida y responde (sin enviar), y avisa del sangrado', inval === 3 && /sangrado/.test(resp) && /No se ha enviado/.test(resp), { inval, resp });
    await bajar(p); await espera(1200); await p.screenshot({ path: path.join(SHOTS, 'escritorio-11-pie.png') });

    // Anchura real y marcadores
    const anch = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
    ok('Sin desbordamiento horizontal (escritorio)', anch.sw <= anch.iw, anch);
    const txt = await p.evaluate(() => document.body.textContent + document.head.innerHTML);
    ok('Sin [PENDIENTE], TODO ni lorem', !/\[PENDIENTE\]|\bTODO\b/.test(txt) && !/lorem ipsum/i.test(txt));
    ok('noindex, nofollow en la portada', await p.evaluate(() => document.querySelector('meta[name=robots]').content === 'noindex, nofollow'));
    ok('Sello de demo en el pie', /Sitio de demostración\. Tres Milímetros es un negocio ficticio/.test(txt));

    // Tareas largas: control con setTimeout (el de page.evaluate no cuenta)
    const lt = await p.evaluate(() => window.__tresmm.longtasks.slice());
    await p.evaluate(() => setTimeout(() => { const t = performance.now(); while (performance.now() - t < 120); }, 0)); await espera(600);
    const lt2 = await p.evaluate(() => window.__tresmm.longtasks.length);
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
    await p.waitForFunction(() => { const b = document.querySelector('.cortina-pliego').getBoundingClientRect().bottom; return b < 600; }, null, { polling: 16, timeout: 8000 }).catch(() => {});
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
    await p.click('#menu a[href="#papeles"]'); await espera(2200);
    const tras = await p.evaluate(() => ({ exp: document.getElementById('menu-boton').getAttribute('aria-expanded'), top: Math.round(document.getElementById('papeles').getBoundingClientRect().top) }));
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
    const lt = await p.evaluate(() => window.__tresmm.longtasks.slice());
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
    const { ctx, p } = await abrir(nav, { vp, movil: true, antes: async pg => { await pg.addInitScript(() => { try { localStorage.setItem('tresmm-cookies', 'ok'); } catch (e) {} }); } });
    await espera(3800);
    await p.screenshot({ path: path.join(SHOTS, `movil-hero-${vp.width}x${vp.height}.png`) });
    const cajas = await p.evaluate(() => ['.portada .etiqueta', '.portada-titulo', '.portada-lema', '.portada-acciones', '.pliego', '.cabecera'].map(s => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); return { s, vis: getComputedStyle(e).display !== 'none', t: Math.round(r.top), b: Math.round(r.bottom), l: Math.round(r.left), r: Math.round(r.right) }; }).filter(c => c.vis));
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
    const r = await p.evaluate(() => ({ cort: getComputedStyle(document.getElementById('cortina')).display, motion: document.documentElement.classList.contains('has-motion'), letras: getComputedStyle(document.querySelector('.portada-titulo .letra')).opacity, entra: getComputedStyle(document.querySelector('.calc')).clipPath }));
    ok('Sin GSAP: cortina en display:none y contenido visible', r.cort === 'none' && !r.motion && r.letras === '1' && r.entra === 'none', r);
    await cerrarCookies(p);
    await p.screenshot({ path: path.join(SHOTS, 'sin-gsap-01-portada.png') });
    await irA(p, '#proceso', 0); await p.screenshot({ path: path.join(SHOTS, 'sin-gsap-02-proceso.png') });
    const foco = await p.evaluate(() => ({ tab: document.getElementById('proceso-pista').getAttribute('tabindex'), desborda: document.getElementById('proceso-pista').scrollWidth > document.getElementById('proceso-pista').clientWidth }));
    ok('Sin GSAP: la pista del proceso desborda y solo entonces es focusable', foco.desborda && foco.tab === '0', foco);
    await irA(p, '#papeles', 0); await p.screenshot({ path: path.join(SHOTS, 'sin-gsap-03-papeles.png') });
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
    // El contenido sigue cambiando: la lineatura, el presupuesto y los contadores
    await p.evaluate(() => window.scrollTo(0, 500)); await espera(300);
    const v = await p.textContent('#lineatura');
    await p.evaluate(() => document.getElementById('presupuesto').scrollIntoView()); await espera(300);
    await p.click('#calc-productos button:nth-child(2)'); await espera(200);
    const f = await p.textContent('#calc-formato');
    await p.evaluate(() => document.querySelector('[data-cuenta="12"]').scrollIntoView({ block: 'center' })); await espera(400);
    const c = await p.textContent('[data-cuenta="12"]');
    const ab = await p.evaluate(() => document.getElementById('abanico').classList.contains('es-abierto'));
    await p.screenshot({ path: path.join(SHOTS, 'reducido-02-copias.png') });
    ok('Reducido: el contenido cambia (lineatura, presupuesto, contador, abanico abierto)', v !== '150' && /148/.test(f) && c === '12' && ab, { v, f, c, ab });
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
    await p.screenshot({ path: path.join(SHOTS, 'mando-01-registro.png') });
    const antes = await p.evaluate(() => ({ diana: getComputedStyle(document.querySelector('.folio-reg')).display, curva: getComputedStyle(document.querySelector('.curva')).display, sombra: getComputedStyle(document.querySelector('.portada-titulo')).textShadow, esquina: getComputedStyle(document.querySelector('.seccion'), '::before').content }));
    await p.click('[data-maqueta="sobria"]'); await espera(500);
    const desp = await p.evaluate(() => ({ diana: getComputedStyle(document.querySelector('.folio-reg')).display, curva: getComputedStyle(document.querySelector('.curva')).display, sombra: getComputedStyle(document.querySelector('.portada-titulo')).textShadow, esquina: getComputedStyle(document.querySelector('.seccion'), '::before').content, num: getComputedStyle(document.querySelector('.folio-num')).fontSize, puntos: document.querySelectorAll('#curva-svg circle').length, sw: document.documentElement.scrollWidth, iw: innerWidth, ls: localStorage.getItem('tresmm-maqueta'), pressed: document.querySelector('[data-maqueta="sobria"]').getAttribute('aria-pressed') }));
    ok('Sobria: fuera dianas, marcas de corte y desregistro; entra el folio en grande y la curva de precio, sin desbordar', antes.diana !== 'none' && antes.curva === 'none' && antes.sombra !== 'none' && antes.esquina !== 'none' && desp.diana === 'none' && desp.curva === 'block' && desp.sombra === 'none' && desp.esquina === 'none' && parseFloat(desp.num) > 40 && desp.puntos === 1 && desp.sw <= desp.iw && desp.ls === 'sobria' && desp.pressed === 'true', { antes, desp });
    await irA(p, '#presupuesto', -60); await p.screenshot({ path: path.join(SHOTS, 'mando-02-sobria-presupuesto.png') });
    await p.click('[data-maqueta="registro"]'); await espera(300);
    ok('Mando: se puede volver a «Registro»', await p.evaluate(() => document.documentElement.classList.contains('d-registro') && getComputedStyle(document.querySelector('.folio-reg')).display !== 'none'));
    const col = () => p.evaluate(() => ({ boton: getComputedStyle(document.querySelector('.boton-lleno')).backgroundColor, cinta: getComputedStyle(document.querySelector('.cinta')).backgroundColor, logo: getComputedStyle(document.querySelector('.marca-signo path[stroke="#E6007E"]')).stroke }));
    const c0 = await col();
    await p.click('[data-paleta="cian"]'); await espera(300);
    const c1 = await col();
    const c1b = await p.evaluate(() => ({ ls: localStorage.getItem('tresmm-paleta'), pressed: document.querySelector('[data-paleta="cian"]').getAttribute('aria-pressed'), otro: document.querySelector('[data-paleta="magenta"]').getAttribute('aria-pressed') }));
    await irA(p, '.cinta', -200); await p.screenshot({ path: path.join(SHOTS, 'paleta-cian-cinta.png') });
    await p.click('[data-paleta="bermellon"]'); await espera(300);
    const c2 = await col();
    await p.screenshot({ path: path.join(SHOTS, 'paleta-bermellon-cinta.png') });
    ok('Paletas: cada botón cambia el color computado (botón y cinta) y el logo NO cambia', c0.boton !== c1.boton && c1.boton !== c2.boton && c0.cinta !== c1.cinta && c0.logo === c1.logo && c1.logo === c2.logo, { c0, c1, c2 });
    ok('Paletas: aria-pressed y localStorage', c1b.ls === 'cian' && c1b.pressed === 'true' && c1b.otro === 'false', c1b);
    // Recarga: la paleta guardada se aplica antes del primer pintado
    const cls = await new Promise(async res => {
      p.once('domcontentloaded', async () => res(await p.evaluate(() => document.documentElement.className)));
      p.reload();
    });
    ok('Recarga: la paleta guardada está en <html> desde el script bloqueante', /p-bermellon/.test(cls), cls);
    await espera(3500);
    await p.evaluate(() => { localStorage.removeItem('tresmm-paleta'); localStorage.removeItem('tresmm-maqueta'); });
    await ctx.close();
  }

  /* ---------- 7. Aviso legal y 404 ---------- */
  {
    const { ctx, p } = await abrir(nav, { ruta: 'legal.html' });
    await espera(800);
    await p.screenshot({ path: path.join(SHOTS, 'legal.png'), fullPage: true });
    ok('Aviso legal: noindex, sello y menciona las claves de localStorage', await p.evaluate(() => document.querySelector('meta[name=robots]').content === 'noindex, nofollow' && /tresmm-maqueta/.test(document.body.textContent) && /negocio ficticio/.test(document.body.textContent)));
    ok('Aviso legal: consola limpia', p.errores.length === 0, p.errores);
    await p.goto(URL + 'no-existe', { waitUntil: 'load' }); await espera(600);
    await p.screenshot({ path: path.join(SHOTS, '404.png') });
    ok('404 con el mismo lenguaje visual y noindex', await p.evaluate(() => /no casa/i.test(document.body.textContent) && getComputedStyle(document.body).backgroundColor === 'rgb(244, 241, 234)' && document.querySelector('meta[name=robots]').content === 'noindex, nofollow'));
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
    ok('Menú móvil con height:100dvh', /\.menu \{ position: fixed; top: 0; left: 0; right: 0; height: 100dvh;/.test(css));
    ok('Clases de estado con prefijo es-', !/classList\.(add|toggle)\('(activo|abierto|visible|hoy|dentro)'/.test(js));
  }

  fs.writeFileSync(path.join(__dirname, 'verify-resultado.json'), JSON.stringify(resultados, null, 1));
  const mal = resultados.filter(r => !r.ok);
  console.log(`\n${resultados.length - mal.length}/${resultados.length} en verde`);
  await nav.close(); s.close();
  process.exit(mal.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
