// Verificación del PLIEGO §7 y de las trampas del encargo. Playwright + Chromium.
// Servidor local bajo el prefijo del repo (el 404 usa rutas absolutas):
//   cd .. && python3 -m http.server 8765
//   node scripts/verificar.js
// Deja capturas en screenshots/ y un resumen en screenshots/verificacion.json.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { BASE, rutas, rueda } = require('./comun');

const OUT = path.join(__dirname, '..', 'screenshots');
fs.mkdirSync(OUT, { recursive: true });
const resultados = [];
function ok(nombre, cond, detalle) {
  resultados.push({ nombre, ok: !!cond, detalle });
  console.log(`${cond ? 'ok ' : 'MAL'} ${nombre}${detalle !== undefined ? ' — ' + (typeof detalle === 'string' ? detalle : JSON.stringify(detalle)) : ''}`);
}
const foto = (page, nombre, opts = {}) => page.screenshot({ path: path.join(OUT, nombre + '.jpg'), type: 'jpeg', quality: 72, ...opts });

async function nuevo(b, { w = 1440, h = 900, movil = false, reducido = false, sinGsap = false, cookies = true, init } = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: movil, hasTouch: movil, ignoreHTTPSErrors: true, reducedMotion: reducido ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  const errores = [], peticiones = [];
  page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
  page.on('pageerror', (e) => errores.push(String(e)));
  page.on('response', (r) => { peticiones.push(r.status() + ' ' + r.url()); if (r.status() >= 400) errores.push(r.status() + ' ' + r.url()); });
  await rutas(page, { sinGsap });
  if (!cookies) await page.addInitScript(() => { try { localStorage.setItem('debandoira-cookies', 'ok'); } catch (e) {} });
  if (init) await page.addInitScript(init);
  return { ctx, page, errores, peticiones };
}
async function ir(page, sel, extra = 0) {
  await page.evaluate(([s, e]) => {
    const el = document.querySelector(s);
    const y = el.getBoundingClientRect().top + scrollY - (document.querySelector('.cabecera')?.offsetHeight || 0) + e;
    if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true }); else scrollTo(0, y);
  }, [sel, extra]);
  await rueda(page, 120, 60, 60); // Lenis + ScrollTrigger: mover la rueda de verdad
  await page.waitForTimeout(1600);
}
const solapan = (a, b) => a && b && a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

(async () => {
  const b = await chromium.launch();

  /* ---------- 1. Escritorio y móvil: carga, consola, anchura, capturas ---------- */
  for (const [w, h, movil, pre] of [[1440, 900, false, 'escritorio'], [390, 844, true, 'movil']]) {
    const { ctx, page, errores } = await nuevo(b, { w, h, movil, cookies: false });
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(3800);
    await foto(page, `${pre}-01-portada`);
    const secciones = [['#traes', '02-lo-que-traes', 0], ['#proceso', '03-proceso-paso1', 40], ['#proceso', '04-proceso-paso3', h * 1.7], ['#proceso', '05-proceso-paso6', h * 4.1],
      ['.cinta', '06-cinta', -200], ['#areas', '07-areas', 0], ['.pila-item:nth-child(3)', '08-areas-pila', 0], ['#consulta', '09-consulta', 0], ['#equipo', '10-equipo', 0],
      ['#tarifas', '11-tarifas', 0], ['#preguntas', '12-preguntas', 0], ['#contacto', '13-contacto', 0], ['.pie', '14-pie', -300]];
    for (const [sel, nombre, extra] of secciones) { await ir(page, sel, extra); await foto(page, `${pre}-${nombre}`); }
    const paso = await page.evaluate(() => document.querySelector('.proceso-num')?.textContent);
    await ir(page, '#proceso', h * 4.1);
    const pasoFinal = await page.evaluate(() => [document.querySelector('.proceso-num')?.textContent, document.querySelectorAll('.ph-nudos .es-activo').length]);
    ok(`[${pre}] la escena anclada llega al paso 06 con los seis nudos encendidos`, pasoFinal[0] === '06' && pasoFinal[1] === 6, pasoFinal);
    const ancho = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
    ok(`[${pre}] sin desbordamiento horizontal`, ancho[0] === ancho[1], ancho);
    ok(`[${pre}] consola limpia y sin 404`, errores.length === 0, errores);
    await ctx.close();
  }

  /* ---------- 2. Cortina: fotogramas a mitad y retirada en los tres casos ---------- */
  {
    const { ctx, page } = await nuevo(b, { cookies: false });
    await page.goto(BASE, { waitUntil: 'commit' });
    const t0 = Date.now();
    const marcas = [350, 1100, 1750, 1950, 2150, 2400, 2900];
    for (const m of marcas) { await page.waitForTimeout(Math.max(0, m - (Date.now() - t0))); await foto(page, `cortina-${String(m).padStart(4, '0')}ms`); }
    await page.waitForTimeout(2500);
    const d = await page.evaluate(() => [getComputedStyle(document.querySelector('.cortina')).display, getComputedStyle(document.querySelector('.cortina-telon')).backgroundColor, getComputedStyle(document.body).backgroundColor]);
    ok('cortina: acaba en display:none (normal)', d[0] === 'none', d[0]);
    ok('cortina: color distinto del fondo', d[1] !== d[2], d.slice(1));
    await ctx.close();
  }
  for (const caso of ['sinGsap', 'reducido']) {
    const { ctx, page, errores } = await nuevo(b, { [caso]: true, cookies: false });
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(caso === 'reducido' ? 400 : 2600);
    const d = await page.evaluate(() => getComputedStyle(document.querySelector('.cortina')).display);
    ok(`cortina: display:none ${caso === 'sinGsap' ? 'sin GSAP' : 'con movimiento reducido'}`, d === 'none', d);
    await ir(page, '.equipo-cifras', -300);
    await page.waitForTimeout(1800);
    const estado = await page.evaluate(() => ({
      hasMotion: document.documentElement.classList.contains('has-motion'),
      pasosVisibles: [...document.querySelectorAll('.paso')].filter((p) => { const r = p.getBoundingClientRect(); const s = getComputedStyle(p); return r.height > 0 && s.visibility !== 'hidden' && s.opacity !== '0'; }).length,
      letrasOcultas: [...document.querySelectorAll('.letra')].filter((l) => getComputedStyle(l).opacity === '0').length,
      hoy: document.querySelectorAll('.horario tr.es-hoy').length,
      horario: document.querySelector('.horario-texto').textContent,
      contador: document.querySelector('.contador[data-hasta="2014"]').textContent,
    }));
    ok(`${caso}: sin has-motion, los seis pasos y todos los titulares visibles`, !estado.hasMotion && estado.pasosVisibles === 6 && estado.letrasOcultas === 0, estado);
    ok(`${caso}: el contenido vivo sigue cambiando (hoy, abierto/cerrado, contador)`, estado.hoy === 1 && /Abierto|Cerrado/.test(estado.horario) && estado.contador === '2014', estado);
    // el conmutador sigue funcionando
    await ir(page, '#consulta');
    await page.click('#tab-linea');
    const f = await page.evaluate(() => [document.querySelector('.consulta-dibujo').dataset.formato, document.getElementById('panel-linea').hidden]);
    ok(`${caso}: el conmutador presencial/en línea funciona`, f[0] === 'linea' && f[1] === false, f);
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(300);
    await foto(page, `${caso}-portada`);
    await ir(page, '#proceso');
    await foto(page, `${caso}-proceso`);
    await ir(page, '#areas');
    await foto(page, `${caso}-areas`);
    // Con el CDN tumbado, Chromium anota un ERR_FAILED por cada script abortado (gsap, ScrollTrigger, lenis)
    const errs = caso === 'sinGsap' ? errores.filter((e) => !/ERR_FAILED/.test(e)) : errores;
    if (caso === 'sinGsap') ok('sinGsap: exactamente los 3 scripts del CDN abortados', errores.length - errs.length === 3, errores.length - errs.length);
    ok(`${caso}: consola limpia (salvo el CDN tumbado a propósito)`, errs.length === 0, errs);
    await ctx.close();
  }

  /* ---------- 3. Cookies, mandos, densidades y paletas ---------- */
  {
    const { ctx, page, errores } = await nuevo(b, { cookies: true });
    await page.goto(BASE + '?revision', { waitUntil: 'load' });
    await page.waitForTimeout(3500);
    let st = await page.evaluate(() => [document.querySelector('.cookies').hidden, document.querySelector('.mandos').hidden, getComputedStyle(document.querySelector('.cookies')).display]);
    ok('cookies visible al entrar y mando apartado mientras tanto', st[0] === false && st[1] === true && st[2] === 'flex', st);
    await page.click('.cookies button');
    await page.waitForTimeout(200);
    st = await page.evaluate(() => [document.querySelector('.cookies').hidden, getComputedStyle(document.querySelector('.cookies')).display, document.querySelector('.mandos').hidden, getComputedStyle(document.querySelector('.mandos')).display, localStorage.getItem('debandoira-cookies')]);
    ok('el botón de cookies cierra de verdad y aparece el mando', st[0] === true && st[1] === 'none' && st[2] === false && st[3] === 'flex' && st[4] === 'ok', st);
    // Densidades
    const medir = () => page.evaluate(() => ({
      dibujos: [...document.querySelectorAll('.tarjeta-dibujo')].filter((e) => getComputedStyle(e).display !== 'none').length,
      datos: [...document.querySelectorAll('.tarjeta-datos')].filter((e) => getComputedStyle(e).display === 'grid').length,
      minutos: getComputedStyle(document.querySelector('.minutos')).display,
      barras: document.querySelectorAll('.minutos-barras li').length,
      hilo: getComputedStyle(document.querySelector('.hilo-conductor')).display,
      ovillos: [...document.querySelectorAll('.persona-ovillo')].filter((e) => getComputedStyle(e).display !== 'none').length,
      ancho: document.documentElement.scrollWidth === innerWidth,
      pulsado: document.querySelector('[data-maqueta="sobria"]').getAttribute('aria-pressed'),
    }));
    const antes = await medir();
    await page.click('[data-maqueta="sobria"]');
    await page.waitForTimeout(400);
    const sobria = await medir();
    ok('Ovillo: cuatro dibujos, sin datos ni gráfico de minutos', antes.dibujos === 4 && antes.datos === 0 && antes.minutos === 'none', antes);
    ok('Sobria: fuera los dibujos y el hilo del margen, dentro los datos y el gráfico de minutos', sobria.dibujos === 0 && sobria.datos === 4 && sobria.minutos === 'block' && sobria.barras === 4 && sobria.hilo === 'none' && sobria.ovillos === 0 && sobria.pulsado === 'true', sobria);
    ok('Sobria: sin desbordamiento horizontal nuevo', sobria.ancho, sobria.ancho);
    await ir(page, '.pila-item:nth-child(2)'); await foto(page, 'sobria-areas');
    await ir(page, '#consulta', 300); await foto(page, 'sobria-consulta-minutos');
    await ir(page, '#equipo'); await foto(page, 'sobria-equipo');
    await page.click('[data-maqueta="ovillo"]');
    await page.waitForTimeout(400);
    const vuelta = await medir();
    ok('se puede volver a Ovillo', vuelta.dibujos === 4 && vuelta.datos === 0 && vuelta.minutos === 'none', vuelta);
    await ir(page, '.pila-item:nth-child(2)'); await foto(page, 'ovillo-areas');
    // Paletas: color computado real, aria-pressed, localStorage
    await page.evaluate(() => { if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true }); else scrollTo(0, 0); });
    await page.waitForTimeout(600);
    const colores = {};
    for (const p of ['brezo', 'musgo', 'rubia']) {
      await page.click(`[data-paleta="${p}"]`);
      await page.waitForTimeout(500);
      colores[p] = await page.evaluate(() => ({ boton: getComputedStyle(document.querySelector('.portada .boton')).backgroundColor, em: getComputedStyle(document.querySelector('.titulo-portada em')).color, logo: document.querySelector('.marca img').getAttribute('src'), pulsado: document.querySelector('[data-paleta][aria-pressed="true"]').dataset.paleta, guardado: localStorage.getItem('debandoira-paleta') }));
      ok(`paleta ${p}: aria-pressed y localStorage`, colores[p].pulsado === p && colores[p].guardado === p, colores[p]);
      if (p !== 'rubia') await foto(page, `paleta-${p}`);
    }
    ok('las tres paletas cambian el color computado del botón', new Set(Object.values(colores).map((c) => c.boton)).size === 3, Object.fromEntries(Object.entries(colores).map(([k, v]) => [k, v.boton])));
    ok('el logo no cambia con la paleta (es un SVG con colores fijos)', new Set(Object.values(colores).map((c) => c.logo)).size === 1);
    // Recarga con paleta guardada: la clase está ya al cargar (script bloqueante)
    await page.click('[data-paleta="musgo"]');
    await page.reload({ waitUntil: 'domcontentloaded' });
    const alCargar = await page.evaluate(() => [document.documentElement.classList.contains('paleta-musgo'), getComputedStyle(document.documentElement).getPropertyValue('--rubia-hondo').trim()]);
    ok('al recargar, la paleta guardada se aplica sin parpadeo', alCargar[0] && alCargar[1].toUpperCase() === '#0F5D22', alCargar);
    await page.evaluate(() => { localStorage.setItem('debandoira-paleta', 'rubia'); localStorage.setItem('debandoira-maqueta', 'ovillo'); });
    // Sin ?revision, el mando no aparece
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(800);
    const sinRev = await page.evaluate(() => getComputedStyle(document.querySelector('.mandos')).display);
    ok('sin ?revision el mando no se ve', sinRev === 'none', sinRev);
    // Mapa bajo clic
    const antesMapa = await page.evaluate(() => document.querySelectorAll('iframe').length);
    await ir(page, '#contacto', 500);
    await page.click('.mapa-boton');
    await page.waitForTimeout(500);
    const despues = await page.evaluate(() => [...document.querySelectorAll('iframe')].map((f) => f.src));
    ok('el iframe del mapa no existe hasta pulsar, y aparece al pulsar', antesMapa === 0 && despues.length === 1 && /google\.com\/maps\?q=.*output=embed/.test(despues[0]), despues);
    await foto(page, 'mapa-cargado');
    // Formulario de muestra
    await page.click('.formulario button[type="submit"]');
    const msg1 = await page.textContent('.formulario-estado');
    await page.fill('input[name="nombre"]', 'Ana'); await page.fill('input[name="contacto"]', 'ana@ejemplo.com');
    await page.click('.formulario button[type="submit"]');
    const msg2 = await page.textContent('.formulario-estado');
    ok('formulario: avisa si falta algo y dice que es de muestra', /Falta/.test(msg1) && /muestra/.test(msg2), [msg1, msg2]);
    ok('consola limpia en la pasada de mandos', errores.length === 0, errores);
    await ctx.close();
  }

  /* ---------- 4. Cursor propio: ratón sí, táctil no ---------- */
  {
    const { ctx, page } = await nuevo(b, { cookies: false });
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(3500);
    const antes = await page.evaluate(() => document.documentElement.classList.contains('cursor-propio'));
    await page.mouse.move(400, 400); await page.mouse.move(420, 410);
    await page.waitForTimeout(200);
    const despues = await page.evaluate(() => [document.documentElement.classList.contains('cursor-propio'), getComputedStyle(document.body).cursor, getComputedStyle(document.querySelector('.cursor')).display]);
    ok('cursor: el nativo se oculta solo tras el primer pointermove de ratón (cursor:none + punto y aro)', !antes && despues[0] && despues[1] === 'none' && despues[2] === 'block', { antes, despues });
    const r = await page.locator('.portada .boton').boundingBox();
    await page.mouse.move(r.x + r.width / 2, r.y + r.height / 2); await page.waitForTimeout(500);
    const enlace = await page.evaluate(() => document.querySelector('.cursor').classList.contains('es-enlace'));
    ok('cursor: cambia sobre enlaces y botones', enlace);
    // el cabo del ovillo sigue al ratón
    const fig = await page.locator('.portada-ovillo').boundingBox();
    for (let i = 0; i < 25; i++) { await page.mouse.move(fig.x + fig.width * 0.95, fig.y + fig.height * (0.2 + i * 0.02)); await page.waitForTimeout(25); }
    await page.waitForTimeout(400);
    // Tirar de verdad: el ovillo se tensa y el titular gana peso (eje wght)
    for (let i = 0; i < 40; i++) { await page.mouse.move(Math.min(1430, fig.x + fig.width * (0.75 + i * 0.006)), Math.min(890, fig.y + fig.height * (0.55 + i * 0.01))); await page.waitForTimeout(30); }
    await page.waitForTimeout(300);
    const tens = await page.evaluate(() => [document.querySelector('.titulo-portada').style.fontVariationSettings, window.__ovillo.estado().tension]);
    const wght = +(/wght" (\d+)/.exec(tens[0]) || [0, 0])[1];
    ok('ovillo: al tirar del cabo el titular se tensa (wght > 330)', wght > 330, tens);
    await foto(page, 'portada-tirando-del-cabo');
    const et = await page.evaluate(() => [document.querySelector('.cursor').classList.contains('es-etiqueta'), document.querySelector('.cursor-texto').textContent]);
    ok('cursor: sobre el ovillo dice «tira»', et[0] && et[1] === 'tira', et);
    await ctx.close();
    const m = await nuevo(b, { w: 390, h: 844, movil: true, cookies: false });
    await m.page.goto(BASE, { waitUntil: 'load' });
    await m.page.waitForTimeout(3500);
    await m.page.tap('.portada-datos');
    await m.page.waitForTimeout(200);
    const tactil = await m.page.evaluate(() => [document.documentElement.classList.contains('cursor-propio'), getComputedStyle(document.querySelector('.cursor')).display]);
    ok('cursor: nada en táctil', !tactil[0] && tactil[1] === 'none', tactil);
    /* ---------- 5. Menú móvil (cabecera con backdrop-filter) ---------- */
    await m.page.click('.menu-boton');
    await m.page.waitForTimeout(900);
    const ab = await m.page.evaluate(() => { const r = document.getElementById('menu').getBoundingClientRect(); return [document.querySelector('.menu-boton').getAttribute('aria-expanded'), Math.round(r.top), Math.round(r.height), innerHeight, getComputedStyle(document.getElementById('menu')).visibility]; });
    ok('menú móvil: abre, aria-expanded=true y ocupa el alto entero (100dvh, no inset:0)', ab[0] === 'true' && ab[1] === 0 && Math.abs(ab[2] - ab[3]) <= 1 && ab[4] === 'visible', ab);
    await foto(m.page, 'movil-menu-abierto');
    await m.page.click('.menu-boton', { timeout: 3000 });
    await m.page.waitForTimeout(900);
    const ce = await m.page.evaluate(() => [document.querySelector('.menu-boton').getAttribute('aria-expanded'), getComputedStyle(document.getElementById('menu')).visibility]);
    ok('menú móvil: el mismo botón lo cierra (no queda debajo de la cortina del menú)', ce[0] === 'false' && ce[1] === 'hidden', ce);
    await m.ctx.close();
  }

  /* ---------- 6. Portada móvil sin solapes en 360×640 y 375×667 ---------- */
  for (const [w, h] of [[360, 640], [375, 667]]) {
    const { ctx, page } = await nuevo(b, { w, h, movil: true, cookies: false });
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(3800);
    const cajas = await page.evaluate(() => {
      const bb = (s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
      return { fig: bb('.portada-ovillo'), pie: bb('.ovillo-pie'), ante: bb('.portada .antetitulo'), h1: bb('.titulo-portada'), entr: bb('.entradilla'), acc: bb('.portada-acciones'), cab: bb('.cabecera') };
    });
    const textos = ['ante', 'h1', 'entr', 'acc'];
    const choques = [];
    textos.forEach((t) => { if (solapan(cajas[t], cajas.fig)) choques.push(t + '×ovillo'); if (solapan(cajas[t], cajas.cab)) choques.push(t + '×cabecera'); });
    for (let i = 0; i < textos.length; i++) for (let j = i + 1; j < textos.length; j++) if (solapan(cajas[textos[i]], cajas[textos[j]])) choques.push(textos[i] + '×' + textos[j]);
    ok(`portada ${w}×${h}: sin solapes entre ovillo, cabecera y textos`, choques.length === 0, choques.length ? choques : 'ninguno');
    await foto(page, `movil-${w}x${h}-portada`);
    await ctx.close();
  }

  /* ---------- 7. Pila sticky en pasos de ~90 px ---------- */
  for (const [w, h, pre] of [[1440, 900, 'escritorio'], [390, 844, 'movil']]) {
    const { ctx, page } = await nuevo(b, { w, h, movil: w < 600, cookies: false });
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(3500);
    const info = await page.evaluate(() => {
      const lis = [...document.querySelectorAll('.pila-item')];
      return { altos: lis.map((l) => l.offsetHeight), margenes: lis.map((l) => getComputedStyle(l).marginBottom), tarjetas: lis.map((l) => l.querySelector('.tarjeta').scrollHeight), posicion: getComputedStyle(lis[0]).position, despues: getComputedStyle(document.querySelector('.pila'), '::after').height, vh: innerHeight };
    });
    ok(`[${pre}] pila: <li> sticky, todos del mismo alto (el de la más alta) y mismo margin-bottom`, info.posicion === 'sticky' && new Set(info.altos).size === 1 && new Set(info.margenes).size === 1 && Math.max(...info.tarjetas) <= info.altos[0] + 1 && info.altos[0] < info.vh, info);
    await ir(page, '#areas', 200);
    const tops = [];
    for (let k = 0; k < 40; k++) {
      await page.mouse.wheel(0, 90);
      await page.waitForTimeout(110);
      const t = await page.evaluate(() => [...document.querySelectorAll('.pila-item')].map((l) => Math.round(l.getBoundingClientRect().top)));
      tops.push(t);
      if (k % 8 === 4) await foto(page, `${pre}-pila-paso-${String(k).padStart(2, '0')}`);
    }
    // Cada tarjeta se queda arriba (sticky) y las siguientes se le apilan encima, nunca por debajo de la anterior
    const malos = tops.filter((t) => t.some((v, i) => i > 0 && v < t[i - 1] - 1));
    ok(`[${pre}] pila: en 40 pasos de 90 px ninguna tarjeta queda por encima de la anterior`, malos.length === 0, { pasos: tops.length, malos: malos.length, ultimo: tops[tops.length - 1] });
    await ctx.close();
  }

  /* ---------- 8. Marcadores, sello y noindex en las tres páginas ---------- */
  for (const p of ['', 'legal.html', 'no-existe-esta-ruta']) {
    const { ctx, page, errores } = await nuevo(b, { cookies: false });
    const res = await page.goto(BASE + p, { waitUntil: 'load' });
    await page.waitForTimeout(800);
    const d = await page.evaluate(() => ({
      robots: document.querySelector('meta[name="robots"]')?.content,
      sello: /Sitio de demostración\.[\s\S]*negocio ficticio/.test(document.body.textContent),
      // TODO en mayúsculas y sin /i: en castellano «todo» es una palabra normal
      marcadores: (document.body.textContent.match(/\[PENDIENTE\]|\bTODO\b|\bFIXME\b/g) || []).concat(document.body.textContent.match(/lorem|ipsum/gi) || []),
      comentario: document.firstChild && document.firstChild.nodeType === 8 && /DEMOSTRACIÓN/.test(document.firstChild.textContent),
      crisis: /024/.test(document.body.textContent),
      modo: document.compatMode,
    }));
    const nombre = p || 'index.html';
    ok(`${nombre}: noindex, sello, comentario arriba, 024 visible, sin marcadores, modo estándar`, d.robots === 'noindex, nofollow' && d.sello && d.comentario && d.crisis && d.marcadores.length === 0 && d.modo === 'CSS1Compat', d);
    // En la ruta inexistente, el único error permitido es el 404 del propio documento
    const errs = p === 'no-existe-esta-ruta' ? errores.filter((e) => !/status of 404|^404 .*no-existe-esta-ruta/.test(e)) : errores;
    ok(`${nombre}: consola limpia${p === 'no-existe-esta-ruta' ? ' (salvo el propio 404)' : ''}`, errs.length === 0, errs);
    if (p) await foto(page, p === 'legal.html' ? 'legal' : '404', { fullPage: p === 'legal.html' });
    await ctx.close();
  }

  fs.writeFileSync(path.join(OUT, 'verificacion.json'), JSON.stringify(resultados, null, 2));
  const mal = resultados.filter((r) => !r.ok);
  console.log(`\n${resultados.length - mal.length}/${resultados.length} comprobaciones en verde`);
  await b.close();
  process.exit(mal.length ? 1 : 0);
})();
