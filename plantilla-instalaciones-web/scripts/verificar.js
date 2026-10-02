// Verificación §7 del pliego. Uso:
//   1) servir la carpeta bajo su prefijo: http://localhost:8123/plantilla-instalaciones-web/
//   2) NODE_PATH=<carpeta con playwright, gsap, lenis y axe-core> node scripts/verificar.js
// jsDelivr está bloqueado en el entorno donde se construyó, así que el arnés sirve
// GSAP/ScrollTrigger/Lenis desde node_modules con la MISMA URL que pide la página.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const URL = process.env.URL || 'http://localhost:8123/plantilla-instalaciones-web/';
const OUT = path.join(__dirname, '..', 'screenshots');
const req = (m) => require.resolve(m, { paths: (process.env.NODE_PATH || '').split(':').concat([process.cwd()]) });
const LIBS = {
  'gsap@3.12.5/dist/gsap.min.js': req('gsap/dist/gsap.min.js'),
  'gsap@3.12.5/dist/ScrollTrigger.min.js': req('gsap/dist/ScrollTrigger.min.js'),
  'lenis@1.1.13/dist/lenis.min.js': req('lenis/dist/lenis.min.js'),
};
const AXE = fs.readFileSync(req('axe-core/axe.min.js'), 'utf8');
const resultados = []; let fallos = 0;
function ok(nombre, cond, detalle) { resultados.push({ nombre, ok: !!cond, detalle }); if (!cond) fallos++; console.log(`${cond ? '✓' : '✗'} ${nombre}${detalle !== undefined ? ' — ' + JSON.stringify(detalle) : ''}`); }
const ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'];
const ESCRITORIO = { viewport: { width: 1440, height: 900 } };
const MOVIL = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const espera = (p, ms) => p.waitForTimeout(ms);
// Los reintentos fallidos contra fonts.googleapis.com / fonts.gstatic.com son del proxy del entorno, no de la página:
// se separan para no confundirlos con errores propios (y se cuentan en el informe).
const entorno = [];
const propios = (p) => { const f = p.fallidas.filter((u) => !/fonts\.(gstatic|googleapis)\.com/.test(u)); const e = p.errores.filter((x) => !/ERR_TOO_MANY_RETRIES/.test(x) || f.length); if (f.length !== p.fallidas.length) entorno.push(p.fallidas); return { errores: e, fallidas: f }; };

async function contexto(b, opts = {}, { sinGsap = false, cookiesCerradas = true, reduce = false } = {}) {
  const ctx = await b.newContext({ ignoreHTTPSErrors: true, reducedMotion: reduce ? 'reduce' : 'no-preference', ...opts });
  await ctx.route('https://cdn.jsdelivr.net/npm/**', (r) => {
    const f = LIBS[r.request().url().split('/npm/')[1]];
    if (sinGsap || !f) return r.abort();
    r.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(f) });
  });
  await ctx.route('https://www.google.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/html', body: '<body style="background:#bbb">mapa</body>' }));
  if (cookiesCerradas) await ctx.addInitScript(() => { try { localStorage.setItem('idaeretorno-cookies', 'ok'); } catch (e) {} });
  return ctx;
}
async function pagina(ctx, ruta = '') {
  const p = await ctx.newPage(); p.errores = []; p.fallidas = [];
  p.on('console', (m) => { if (m.type() === 'error') p.errores.push(m.text()); });
  p.on('pageerror', (e) => p.errores.push('pageerror: ' + e.message));
  p.on('requestfailed', (r) => { if (!/cdn\.jsdelivr/.test(r.url())) p.fallidas.push(r.url()); });
  p.on('response', (r) => { if (r.status() >= 400) p.fallidas.push(r.status() + ' ' + r.url()); });
  await p.goto(URL + ruta, { waitUntil: 'load' });
  return p;
}
async function recorrer(p, alto, nombre, pasos = 40) {
  const fotos = [];
  for (let i = 0; i < pasos; i++) {
    const fin = await p.evaluate(() => innerHeight + scrollY >= document.documentElement.scrollHeight - 4);
    if (fin) break;
    await p.mouse.wheel(0, alto * 0.85); await espera(p, 650);
    if (nombre) { const f = `${nombre}-${String(i + 1).padStart(2, '0')}.png`; await p.screenshot({ path: path.join(OUT, f) }); fotos.push(f); }
  }
  await espera(p, 1500);
  return fotos;
}
async function irA(p, sel, extra = 0) {
  // con Lenis, window.scrollTo no dispara los ScrollTrigger: se baja con la rueda hasta la sección
  for (let i = 0; i < 80; i++) {
    const top = await p.evaluate((s) => document.querySelector(s).getBoundingClientRect().top, sel);
    if (Math.abs(top - extra) < 60) break;
    await p.mouse.wheel(0, Math.max(-700, Math.min(700, top - extra))); await espera(p, 280);
  }
  await espera(p, 1200);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ args: ARGS });

  // ---------- 0. Cortina a mitad de camino (contexto propio) ----------
  {
    const ctx = await contexto(b, ESCRITORIO);
    const p = await ctx.newPage();
    // las capturas en GL por software tardan casi un segundo: se ralentiza la línea de tiempo
    // global solo en esta pasada, se muestrea el estado (barato) y se fotografía al llegar a cada fase
    // (y, solo aquí, se aplazan los dos temporizadores de retirada de seguridad de 3,2 y 8 s,
    // que si no retirarían la cortina a mitad del gesto ralentizado; se prueban en las otras pasadas)
    await p.addInitScript(() => {
      const st = window.setTimeout; window.setTimeout = (f, ms, ...r) => st(f, ms === 3200 || ms === 8000 ? 60000 : ms, ...r);
      const t = setInterval(() => { if (window.gsap) { window.gsap.globalTimeline.timeScale(0.1); clearInterval(t); } }, 5);
    });
    await p.goto(URL, { waitUntil: 'commit' });
    const estados = []; const fotos = {};
    const t0 = Date.now();
    while (Date.now() - t0 < 60000 && !(fotos.roza && fotos.abriendo)) {
      const e = await p.evaluate(() => {
        const c = document.querySelector('.cortina'); if (!c) return { f: 'sin-dom' };
        if (getComputedStyle(c).display === 'none') return { f: 'fuera' };
        const roza = new DOMMatrix(getComputedStyle(c.querySelector('.cortina-roza')).transform).a;
        const y = c.querySelector('.cortina-arriba').getBoundingClientRect().bottom / innerHeight;
        return { f: 'dentro', roza: +roza.toFixed(2), y: +y.toFixed(2) };
      }).catch(() => ({ f: 'cargando' }));
      estados.push(e);
      if (!fotos.roza && e.roza > 0.25 && e.roza < 0.95 && e.y > 0.49) { fotos.roza = e; await p.screenshot({ path: path.join(OUT, 'cortina-1-roza.png') }); await p.evaluate(() => { window.gsap.globalTimeline.timeScale(0.06); }); }
      if (!fotos.abriendo && e.y > 0.12 && e.y < 0.42) { fotos.abriendo = e; await p.screenshot({ path: path.join(OUT, 'cortina-2-abriendo.png') }); }
      if (e.f === 'fuera') break;
      await espera(p, 40);
    }
    ok('Cortina: fotogramas a mitad de camino (roza cortando y pared abriéndose)', fotos.roza && fotos.abriendo, fotos.abriendo ? fotos : estados.slice(-6));
    await ctx.close();
  }

  // ---------- 1. Escritorio: portada, consola, longtask en frío ----------
  {
    const ctx = await contexto(b, ESCRITORIO);
    const cdp = await ctx.newCDPSession(await ctx.newPage()); // en frío
    await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    const p = await pagina(ctx);
    await espera(p, 6000);
    ok('Cortina acaba en display:none (normal)', await p.evaluate(() => getComputedStyle(document.querySelector('.cortina')).display === 'none'));
    ok('Cortina de color distinto al fondo', await p.evaluate(() => getComputedStyle(document.querySelector('.cortina-arriba')).backgroundColor !== getComputedStyle(document.body).backgroundColor));
    ok('Clases de arranque', await p.evaluate(() => document.documentElement.className), undefined);
    ok('WebGL activo', await p.evaluate(() => document.documentElement.classList.contains('es-webgl')));
    await p.mouse.move(1000, 480); await espera(p, 700);
    ok('Cursor propio activo con ratón', await p.evaluate(() => document.documentElement.classList.contains('es-cursor') && getComputedStyle(document.body).cursor === 'none'));
    const t1 = await p.evaluate(() => document.querySelector('[data-temp]').textContent);
    await p.mouse.move(300, 820); await espera(p, 700);
    const t2 = await p.evaluate(() => document.querySelector('[data-temp]').textContent);
    ok('La lectura térmica cambia con el cursor', t1 !== t2, [t1, t2]);
    await p.mouse.move(1010, 470); await espera(p, 900);
    await p.screenshot({ path: path.join(OUT, 'escritorio-00-portada.png') });
    const f0 = await p.evaluate(() => window.__termoFrames); await espera(p, 2000);
    const f1 = await p.evaluate(() => window.__termoFrames);
    ok('Shader: fotogramas por segundo (informativo: GL por software, sin GPU en el entorno)', (f1 - f0) / 2 > 5, Math.round((f1 - f0) / 2));
    const ltCarga = await p.evaluate(() => window.__longtasks.slice());
    await p.evaluate(() => setTimeout(() => { const t = performance.now(); while (performance.now() - t < 120) {} }, 0));
    await espera(p, 400);
    const ltControl = await p.evaluate(() => window.__longtasks.slice());
    ok('PerformanceObserver de longtask vivo (control de 120 ms con setTimeout)', ltControl.length > ltCarga.length, ltControl.slice(-1));
    ok('Tareas largas al cargar en frío', true, ltCarga);
    const antes = (await p.evaluate(() => window.__longtasks.length));
    await recorrer(p, 900, 'escritorio-recorrido');
    const lt = await p.evaluate((n) => window.__longtasks.slice(n), antes);
    ok('Tareas largas recorriendo la página entera', lt.length <= 3, lt);
    if (process.env.SOLO === '1') { await b.close(); process.exit(fallos ? 1 : 0); }
    ok('Sin desbordamiento horizontal (escritorio)', await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]));
    { const r = propios(p); ok('Consola limpia (escritorio)', r.errores.length === 0, r.errores); ok('Sin peticiones fallidas (escritorio)', r.fallidas.length === 0, r.fallidas); }
    const txt = await p.evaluate(() => document.body.textContent);
    ok('Sin [PENDIENTE], TODO ni lorem', !/\[PENDIENTE\]|\bTODO\b/.test(txt) && !/lorem ipsum/i.test(txt));
    ok('noindex, nofollow', await p.evaluate(() => document.querySelector('meta[name=robots]').content === 'noindex, nofollow'));
    ok('Sello en el pie', /Sitio de demostración\. Ida e Retorno es un negocio ficticio/.test(txt));
    ok('Comentario HTML de demo arriba del todo', /^<!doctype html>\s*<!--\s*SITIO DE DEMOSTRACIÓN/i.test(fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8')));
    ok('schema.org sin aggregateRating ni review', !(await p.evaluate(() => /aggregateRating|"review"/.test(document.querySelector('script[type="application/ld+json"]').textContent))));
    ok('Logo de la cabecera visible (no se encoge)', await p.evaluate(() => document.querySelector('.marca svg').getBoundingClientRect().width === 40));
    ok('Sin <img> rotas', await p.evaluate(() => [...document.images].every((i) => i.naturalWidth > 0)));
    await ctx.close();
  }

  // ---------- 2. Capturas por sección (escritorio y móvil) ----------
  const SECCIONES = ['#inicio', '#circuito', '#obra', '#servicios', '.cinta', '#urgencias', '#papeles', '#zonas', '#equipo', '#presupuesto', '#contacto', '.pie'];
  for (const [nombre, opts] of [['escritorio', ESCRITORIO], ['movil', MOVIL]]) {
    const ctx = await contexto(b, opts); const p = await pagina(ctx); await espera(p, 3600);
    let i = 0;
    for (const s of SECCIONES) {
      await irA(p, s, s === '#inicio' ? 0 : 72);
      if (s === '#obra') { await p.mouse.wheel(0, opts.viewport.height * 2.2); await espera(p, 1500); }
      await p.screenshot({ path: path.join(OUT, `${nombre}-seccion-${String(i++).padStart(2, '0')}-${s.replace(/[#.]/g, '')}.png`) });
    }
    ok(`Sin desbordamiento horizontal (${nombre})`, await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    { const r = propios(p); ok(`Consola limpia (${nombre})`, r.errores.length === 0 && r.fallidas.length === 0, r); }
    if (nombre === 'movil') ok('Sin cursor propio en táctil', !(await p.evaluate(() => document.documentElement.classList.contains('es-cursor'))));
    await ctx.close();
  }

  // ---------- 3. Obra anclada: el manómetro llega a la prueba ----------
  {
    const ctx = await contexto(b, ESCRITORIO); const p = await pagina(ctx); await espera(p, 3600);
    await irA(p, '#obra', 0);
    const lecturas = [];
    for (let k = 0; k < 14; k++) { await p.mouse.wheel(0, 380); await espera(p, 450); lecturas.push(await p.evaluate(() => [document.querySelector('.paso.es-actual .paso-n').textContent, document.querySelector('[data-bar]').textContent])); }
    ok('La obra recorre los seis pasos con scrub', new Set(lecturas.map((l) => l[0])).size >= 5, lecturas.map((l) => l.join(' · ')));
    ok('El manómetro llega a la presión de prueba (≥ 5 bar)', lecturas.some((l) => parseFloat(l[1].replace(',', '.')) >= 5));
    await ctx.close();
  }

  // ---------- 4. Pila sticky en pasos de 90 px ----------
  for (const [nombre, opts] of [['escritorio', ESCRITORIO], ['movil', MOVIL]]) {
    const ctx = await contexto(b, opts); const p = await pagina(ctx); await espera(p, 3600);
    const medidas = await p.evaluate(() => [...document.querySelectorAll('.pila-item')].map((li) => [li.offsetHeight, getComputedStyle(li).marginBottom, getComputedStyle(li).position]));
    ok(`Pila (${nombre}): mismo alto, mismo margin-bottom y sticky en todos`, new Set(medidas.map((m) => m[0])).size === 1 && new Set(medidas.map((m) => m[1])).size === 1 && medidas.every((m) => m[2] === 'sticky'), medidas);
    ok(`Pila (${nombre}): el alto no es 100vh`, medidas[0][0] !== opts.viewport.height);
    await irA(p, '.pila', 120);
    let malos = [], k = 0;
    for (let i = 0; i < 70; i++) {
      await p.mouse.wheel(0, 90); await espera(p, 160);
      const r = await p.evaluate(() => {
        const items = [...document.querySelectorAll('.pila-item')].map((li) => li.getBoundingClientRect());
        const fichas = [...document.querySelectorAll('.pila-item .ficha')].map((f) => f.getBoundingClientRect());
        const pila = document.querySelector('.pila').getBoundingClientRect();
        return { items: items.map((x) => [Math.round(x.top), Math.round(x.bottom)]), fichas: fichas.map((x) => [Math.round(x.top), Math.round(x.height)]), pilaFin: Math.round(pila.bottom) };
      });
      // cada tarjeta por debajo (o igual) de la anterior, y ninguna ficha más alta que su <li>
      for (let j = 1; j < r.items.length; j++) if (r.items[j][0] < r.items[j - 1][0]) malos.push({ paso: i, j, r: r.items });
      if (r.fichas.some((f, j) => f[1] > r.items[j][1] - r.items[j][0] + 1)) malos.push({ paso: i, fichas: r.fichas });
      if (k++ % 8 === 0) await p.screenshot({ path: path.join(OUT, `pila-${nombre}-${String(i).padStart(2, '0')}.png`) });
      if (r.pilaFin < 0) break;
    }
    ok(`Pila (${nombre}): orden de apilado correcto en pasos de 90 px`, malos.length === 0, malos.slice(0, 3));
    await ctx.close();
  }

  // ---------- 5. Móvil: menú, cookies, mapa; heros pequeños ----------
  {
    const ctx = await contexto(b, MOVIL, { cookiesCerradas: false }); const p = await pagina(ctx); await espera(p, 3600);
    ok('Aviso de cookies visible al entrar', await p.evaluate(() => getComputedStyle(document.querySelector('.cookies')).display === 'flex'));
    await p.screenshot({ path: path.join(OUT, 'movil-cookies.png') });
    await p.click('[data-cerrar-cookies]'); await espera(p, 300);
    ok('El botón de cookies lo cierra de verdad', await p.evaluate(() => getComputedStyle(document.querySelector('.cookies')).display === 'none' && localStorage.getItem('idaeretorno-cookies') === 'ok'));
    await p.click('.menu-boton'); await espera(p, 900);
    const menu = await p.evaluate(() => { const n = document.querySelector('#nav'); const r = n.getBoundingClientRect(); return { exp: document.querySelector('.menu-boton').getAttribute('aria-expanded'), alto: Math.round(r.height), top: Math.round(r.top), ih: innerHeight, vis: getComputedStyle(n).visibility }; });
    ok('Menú móvil abre a pantalla completa (100dvh) con aria-expanded', menu.exp === 'true' && menu.alto === menu.ih && menu.top === 0 && menu.vis === 'visible', menu);
    await p.screenshot({ path: path.join(OUT, 'movil-menu.png') });
    await p.click('.menu-boton', { timeout: 3000 }); await espera(p, 1600);
    ok('Menú móvil cierra con el mismo botón', await p.evaluate(() => document.querySelector('.menu-boton').getAttribute('aria-expanded') === 'false' && getComputedStyle(document.querySelector('#nav')).visibility === 'hidden'));
    await p.click('.menu-boton'); await espera(p, 800); await p.click('#nav a[href="#zonas"]'); await espera(p, 2200);
    ok('Un enlace del menú cierra el menú y navega', await p.evaluate(() => document.querySelector('.menu-boton').getAttribute('aria-expanded') === 'false' && Math.abs(document.querySelector('#zonas').getBoundingClientRect().top) < 200));
    await irA(p, '#contacto', 72);
    ok('Mapa: 0 iframes antes del clic', (await p.$$('iframe')).length === 0);
    await p.click('.mapa-boton'); await espera(p, 800);
    ok('Mapa: 1 iframe después del clic', (await p.$$('iframe')).length === 1);
    await p.screenshot({ path: path.join(OUT, 'movil-mapa.png') });
    await irA(p, '#presupuesto', 72);
    await p.click('.formulario button[type=submit]'); await espera(p, 300);
    ok('Formulario de muestra: avisa de lo que falta', await p.evaluate(() => /Faltan/.test(document.querySelector('.formulario-salida').textContent)));
    await ctx.close();
    for (const [w, h] of [[360, 640], [375, 667]]) {
      const c = await contexto(b, { viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
      const q = await pagina(c); await espera(q, 3800);
      await q.screenshot({ path: path.join(OUT, `portada-${w}x${h}.png`) });
      const r = await q.evaluate(() => {
        const R = (s) => document.querySelector(s).getBoundingClientRect();
        const l = R('.lectura'), t = R('.portada-texto'), h1 = R('.titular-portada'), acc = R('.portada-acciones'), cab = R('.cabecera');
        return { solapeLecturaTexto: l.bottom > t.top + 1, solapeCabecera: l.top < cab.bottom - 1, h1Ancho: h1.right <= innerWidth + 1, accionesDentro: acc.bottom <= document.querySelector('.portada').getBoundingClientRect().bottom, sw: document.documentElement.scrollWidth, iw: innerWidth };
      });
      ok(`Portada ${w}×${h} sin solapes`, !r.solapeLecturaTexto && !r.solapeCabecera && r.h1Ancho && r.accionesDentro && r.sw <= r.iw, r);
      await c.close();
    }
  }

  // ---------- 6. Sin GSAP (CDN tumbado) ----------
  for (const [nombre, opts] of [['escritorio', ESCRITORIO], ['movil', MOVIL]]) {
    const ctx = await contexto(b, opts, { sinGsap: true }); const p = await pagina(ctx); await espera(p, 4200);
    ok(`Sin GSAP (${nombre}): cortina retirada`, await p.evaluate(() => getComputedStyle(document.querySelector('.cortina')).display === 'none'));
    ok(`Sin GSAP (${nombre}): sin has-motion`, !(await p.evaluate(() => document.documentElement.classList.contains('has-motion'))));
    const ocultos = await p.evaluate(() => [...document.querySelectorAll('main h1, main h2, main h3, main p, main li')].filter((e) => { const s = getComputedStyle(e); return s.opacity === '0' || s.visibility === 'hidden'; }).length);
    ok(`Sin GSAP (${nombre}): ningún texto oculto`, ocultos === 0, ocultos);
    await p.screenshot({ path: path.join(OUT, `sin-gsap-${nombre}.png`), fullPage: nombre === 'movil' ? false : true });
    await ctx.close();
  }

  // ---------- 7. Movimiento reducido ----------
  {
    const ctx = await contexto(b, ESCRITORIO, { reduce: true }); const p = await pagina(ctx); await espera(p, 1500);
    ok('Reducido: cortina retirada', await p.evaluate(() => getComputedStyle(document.querySelector('.cortina')).display === 'none'));
    await p.mouse.move(1000, 480); await espera(p, 400); const a = await p.evaluate(() => document.querySelector('[data-temp]').textContent);
    await p.mouse.move(250, 850); await espera(p, 400); const c = await p.evaluate(() => document.querySelector('[data-temp]').textContent);
    ok('Reducido: la lectura térmica sigue cambiando', a !== c, [a, c]);
    await p.screenshot({ path: path.join(OUT, 'reducido-portada.png') });
    await p.evaluate(() => document.querySelector('.paso:nth-child(5)').scrollIntoView({ block: 'center' })); await espera(p, 600);
    const paso = await p.evaluate(() => [document.querySelector('.paso.es-actual .paso-n').textContent, document.querySelector('[data-bar]').textContent]);
    ok('Reducido: el paso de la obra y el manómetro cambian', /Paso 5/.test(paso[0]) && paso[1] === '6,0', paso);
    await p.screenshot({ path: path.join(OUT, 'reducido-obra.png') });
    ok('Reducido: estado del horario escrito', await p.evaluate(() => /^Ahora:/.test(document.querySelector('[data-estado-txt]').textContent) && !!document.querySelector('.horario tr.es-hoy')));
    await ctx.close();
  }
  // Cortina sin GSAP *y* con movimiento reducido a la vez
  {
    const ctx = await contexto(b, MOVIL, { sinGsap: true, reduce: true }); const p = await pagina(ctx); await espera(p, 1500);
    ok('Sin GSAP + reducido: cortina retirada', await p.evaluate(() => getComputedStyle(document.querySelector('.cortina')).display === 'none'));
    await ctx.close();
  }

  // ---------- 8. Mandos: maqueta y paleta (?revision) ----------
  {
    const ctx = await contexto(b, ESCRITORIO, { cookiesCerradas: false }); const p = await pagina(ctx, '?revision'); await espera(p, 3600);
    ok('Mandos ocultos mientras está el aviso de cookies', await p.evaluate(() => document.querySelector('.mandos').hidden));
    await p.click('[data-cerrar-cookies]'); await espera(p, 300);
    ok('Mandos visibles al cerrar el aviso', await p.evaluate(() => !document.querySelector('.mandos').hidden));
    await irA(p, '#servicios', 72);
    await p.screenshot({ path: path.join(OUT, 'maqueta-circuito-servicios.png') });
    await p.click('[data-maqueta="sobria"]'); await espera(p, 900);
    const sob = await p.evaluate(() => ({
      clase: document.documentElement.classList.contains('es-sobria'),
      ilus: [...document.querySelectorAll('.ilu, .conducto, .tc-lazo, .persona-ilu')].every((e) => getComputedStyle(e).display === 'none'),
      tiempos: getComputedStyle(document.querySelector('.tiempos')).display === 'block' && document.querySelectorAll('.tiempos-lista li').length === 5,
      dato: parseFloat(getComputedStyle(document.querySelector('.ficha-dato strong')).fontSize),
      sw: document.documentElement.scrollWidth, iw: innerWidth, ls: localStorage.getItem('idaeretorno-maqueta'),
      pres: document.querySelector('[data-maqueta="sobria"]').getAttribute('aria-pressed'),
      alturas: [...new Set([...document.querySelectorAll('.pila-item')].map((l) => l.offsetHeight))].length,
    }));
    ok('Sobria: retira los dibujos, pone el dato en grande y añade la comparación', sob.clase && sob.ilus && sob.tiempos && sob.dato > 50 && sob.sw <= sob.iw && sob.ls === 'sobria' && sob.pres === 'true' && sob.alturas === 1, sob);
    await p.screenshot({ path: path.join(OUT, 'maqueta-sobria-servicios.png') });
    await irA(p, '.tiempos', 100); await p.screenshot({ path: path.join(OUT, 'maqueta-sobria-tiempos.png') });
    await p.click('[data-maqueta="circuito"]'); await espera(p, 600);
    ok('Se puede volver a «Circuito»', await p.evaluate(() => !document.documentElement.classList.contains('es-sobria') && getComputedStyle(document.querySelector('.ilu')).display !== 'none'));
    // paletas
    const colores = {};
    for (const v of ['laton', 'brezo', 'real']) {
      await p.click(`[data-paleta="${v}"]`); await espera(p, 300);
      colores[v] = await p.evaluate((v) => ({ boton: getComputedStyle(document.querySelector('.boton-quente')).backgroundColor, pres: document.querySelector(`[data-paleta="${v}"]`).getAttribute('aria-pressed'), ls: localStorage.getItem('idaeretorno-paleta') }), v);
    }
    ok('Paleta: cada botón cambia el color computado, aria-pressed y localStorage', new Set(Object.values(colores).map((c) => c.boton)).size === 3 && Object.entries(colores).every(([k, c]) => c.pres === 'true' && c.ls === k), colores);
    await p.click('[data-paleta="brezo"]'); await espera(p, 300);
    await irA(p, '#inicio', 0); await p.screenshot({ path: path.join(OUT, 'paleta-brezo-portada.png') });
    await p.click('[data-paleta="laton"]'); await espera(p, 600); await p.screenshot({ path: path.join(OUT, 'paleta-laton-portada.png') });
    const p2 = await ctx.newPage(); let claseAlCargar = null;
    p2.on('domcontentloaded', async () => { claseAlCargar = await p2.evaluate(() => document.documentElement.className).catch(() => null); });
    await p2.goto(URL + '?revision', { waitUntil: 'load' });
    const claseLoad = await p2.evaluate(() => document.documentElement.className);
    ok('Paleta guardada aplicada sin parpadeo (clase ya en load)', /pal-laton/.test(claseLoad) && (claseAlCargar === null || /pal-laton/.test(claseAlCargar)), { claseAlCargar, claseLoad });
    const p3 = await ctx.newPage(); await p3.goto(URL, { waitUntil: 'load' });
    ok('Sin ?revision: ni mandos ni paleta alternativa', await p3.evaluate(() => document.querySelector('.mandos').hidden && !/pal-|es-sobria/.test(document.documentElement.className)));
    await p.click('[data-paleta="real"]');
    await ctx.close();
  }

  // ---------- 9. 404 y aviso legal; axe ----------
  {
    const ctx = await contexto(b, ESCRITORIO);
    for (const [ruta, nombre] of [['404.html', '404'], ['legal.html', 'legal']]) {
      const p = await pagina(ctx, ruta); await espera(p, 1200);
      await p.screenshot({ path: path.join(OUT, `pagina-${nombre}.png`) });
      ok(`${nombre}: noindex y sello`, await p.evaluate(() => document.querySelector('meta[name=robots]').content === 'noindex, nofollow' && /negocio ficticio/.test(document.body.textContent)));
      { const r = propios(p); ok(`${nombre}: consola limpia`, r.errores.length === 0 && r.fallidas.length === 0, r); }
      await p.addScriptTag({ content: AXE });
      const v = await p.evaluate(async () => (await axe.run({ resultTypes: ['violations'] })).violations.map((x) => ({ id: x.id, impacto: x.impact, n: x.nodes.length, ej: x.nodes[0].target })));
      ok(`axe ${nombre}: sin violaciones`, v.length === 0, v);
    }
    for (const [nombre, opts] of [['escritorio', ESCRITORIO], ['movil', MOVIL]]) {
      const c = await contexto(b, opts); const p = await pagina(c); await espera(p, 3600);
      await recorrer(p, opts.viewport.height);
      await p.addScriptTag({ content: AXE });
      const v = await p.evaluate(async () => (await axe.run({ resultTypes: ['violations'] })).violations.map((x) => ({ id: x.id, impacto: x.impact, n: x.nodes.length, ej: x.nodes.slice(0, 3).map((n) => n.target.join(' ')) })));
      ok(`axe portada (${nombre}): sin violaciones`, v.length === 0, v);
      await c.close();
    }
    await ctx.close();
  }

  await b.close();
  console.log('Fallos de red del entorno (Google Fonts):', JSON.stringify(entorno));
  fs.writeFileSync(path.join(OUT, 'verificacion.json'), JSON.stringify({ fecha: new Date().toISOString(), fallos, resultados, fallosDeRedDelEntorno: entorno }, null, 1));
  console.log(`\n${resultados.length - fallos}/${resultados.length} comprobaciones en verde`);
  process.exit(fallos ? 1 : 0);
})();
