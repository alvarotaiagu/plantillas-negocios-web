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
  if (!cookies) await page.addInitScript(() => { try { localStorage.setItem('fiambreira-cookies', 'ok'); } catch (e) {} });
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
    const secciones = [['#no', '02-lo-que-no', 0], ['#no', '03-tachados', 400], ['#mesa', '04-mesa-paso1', 40], ['#mesa', '05-mesa-paso3', h * 1.4], ['#mesa', '06-mesa-paso6', h * 3.5],
      ['#carta', '07-carta', 0], ['#carta', '08-carta-platos', 500], ['#temporada', '09-temporada', 40], ['#temporada', '10-temporada-mitad', 900], ['#equipo', '11-equipo', 0],
      ['#preguntas', '12-preguntas', 0], ['#contacto', '13-contacto', 0], ['.pie', '14-pie', -300]];
    for (const [sel, nombre, extra] of secciones) { await ir(page, sel, extra); await foto(page, `${pre}-${nombre}`); }
    await ir(page, '#mesa', h * 3.5);
    const pasoFinal = await page.evaluate(() => [document.querySelector('.mesa-num')?.textContent, document.querySelectorAll('.pieza.es-puesta').length, document.querySelector('.mpaso.es-activo')?.dataset.paso]);
    ok(`[${pre}] la mesa anclada llega al paso 6 con las seis piezas puestas`, pasoFinal[0] === '6' && pasoFinal[1] === 6 && pasoFinal[2] === '6', pasoFinal);
    await ir(page, '#temporada', 20000);
    const mesHoy = await page.evaluate(() => [document.querySelectorAll('.mes.es-hoy').length, +document.querySelector('.mes.es-hoy').dataset.mes === new Date().getMonth()]);
    ok(`[${pre}] temporada: el mes actual marcado`, mesHoy[0] === 1 && mesHoy[1], mesHoy);
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
    const marcas = [350, 900, 1250, 1450, 1700, 1950, 2400];
    for (const m of marcas) { await page.waitForTimeout(Math.max(0, m - (Date.now() - t0))); await foto(page, `cortina-${String(m).padStart(4, '0')}ms`); }
    await page.waitForTimeout(2500);
    const d = await page.evaluate(() => [getComputedStyle(document.querySelector('.cortina')).display, getComputedStyle(document.querySelector('.cortina-pano')).backgroundImage.slice(0, 40), getComputedStyle(document.body).backgroundImage]);
    ok('cortina: acaba en display:none (normal)', d[0] === 'none', d[0]);
    ok('cortina: distinta del fondo (vichy sobre un fondo liso)', d[1] !== d[2] && d[1].includes('gradient'), d.slice(1));
    await ctx.close();
  }
  for (const caso of ['sinGsap', 'reducido']) {
    const { ctx, page, errores } = await nuevo(b, { [caso]: true, cookies: false });
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(caso === 'reducido' ? 400 : 2600);
    const d = await page.evaluate(() => getComputedStyle(document.querySelector('.cortina')).display);
    ok(`cortina: display:none ${caso === 'sinGsap' ? 'sin GSAP' : 'con movimiento reducido'}`, d === 'none', d);
    const estado = await page.evaluate(() => ({
      hasMotion: document.documentElement.classList.contains('has-motion'),
      pasosVisibles: [...document.querySelectorAll('.mpaso')].filter((p) => { const r = p.getBoundingClientRect(); const s = getComputedStyle(p); return r.height > 0 && s.visibility !== 'hidden' && s.opacity !== '0'; }).length,
      piezasVisibles: [...document.querySelectorAll('.pieza')].filter((p) => getComputedStyle(p).opacity !== '0').length,
      letrasOcultas: [...document.querySelectorAll('.letra')].filter((l) => getComputedStyle(l).opacity === '0').length,
      tachados: [...document.querySelectorAll('.tachados span')].filter((t) => getComputedStyle(t).backgroundSize.startsWith('100%')).length,
      hoy: document.querySelectorAll('.horario tr.es-hoy').length,
      mes: document.querySelectorAll('.mes.es-hoy').length,
      horario: document.querySelector('.horario-texto').textContent,
    }));
    ok(`${caso}: sin has-motion, los seis pasos y las seis piezas visibles, titulares enteros y los seis tachados hechos`, !estado.hasMotion && estado.pasosVisibles === 6 && estado.piezasVisibles === 6 && estado.letrasOcultas === 0 && estado.tachados === 6, estado);
    ok(`${caso}: el contenido vivo sigue (hoy, mes actual, abierto/cerrado)`, estado.hoy === 1 && estado.mes === 1 && /Abierto|Cerrado/.test(estado.horario), estado);
    const pista = await page.evaluate(() => { const p = document.querySelector('.temporada-pista'); return [p.scrollWidth > p.clientWidth, p.getAttribute('tabindex'), p.getAttribute('role'), !!p.getAttribute('aria-label')]; });
    ok(`${caso}: la pista de temporada desborda y es focusable con role=group y aria-label`, pista[0] && pista[1] === '0' && pista[2] === 'group' && pista[3], pista);
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(300);
    await foto(page, `${caso}-portada`);
    await ir(page, '#mesa');
    await foto(page, `${caso}-mesa`);
    await ir(page, '#temporada');
    await foto(page, `${caso}-temporada`);
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
    st = await page.evaluate(() => [document.querySelector('.cookies').hidden, getComputedStyle(document.querySelector('.cookies')).display, document.querySelector('.mandos').hidden, getComputedStyle(document.querySelector('.mandos')).display, localStorage.getItem('fiambreira-cookies')]);
    ok('el botón de cookies cierra de verdad y aparece el mando', st[0] === true && st[1] === 'none' && st[2] === false && st[3] === 'flex' && st[4] === 'ok', st);
    // Densidades
    const medir = () => page.evaluate(() => ({
      franjas: [...document.querySelectorAll('.franja')].filter((e) => getComputedStyle(e).display !== 'none').length,
      iconos: [...document.querySelectorAll('.mes-icono')].filter((e) => getComputedStyle(e).display !== 'none').length,
      comparativa: getComputedStyle(document.querySelector('.comparativa')).display,
      filas: document.querySelectorAll('.comparativa tbody tr').length,
      marco: getComputedStyle(document.querySelector('.carta'), '::before').content,
      ancho: document.documentElement.scrollWidth === innerWidth,
      pulsado: document.querySelector('[data-maqueta="sobria"]').getAttribute('aria-pressed'),
    }));
    const antes = await medir();
    await page.click('[data-maqueta="sobria"]');
    await page.waitForTimeout(400);
    const sobria = await medir();
    ok('Mantel: franjas de vichy, 12 iconos y marco de la carta; sin comparativa', antes.franjas === 2 && antes.iconos === 12 && antes.marco !== 'none' && antes.comparativa === 'none', antes);
    ok('Sobria: fuera franjas, iconos y marco; dentro la comparativa de consultas', sobria.franjas === 0 && sobria.iconos === 0 && sobria.marco === 'none' && sobria.comparativa === 'block' && sobria.filas === 3 && sobria.pulsado === 'true', sobria);
    ok('Sobria: sin desbordamiento horizontal nuevo', sobria.ancho, sobria.ancho);
    await ir(page, '#carta', 300); await foto(page, 'sobria-carta');
    await ir(page, '.comparativa', -200); await foto(page, 'sobria-comparativa');
    await page.click('[data-maqueta="mantel"]');
    await page.waitForTimeout(400);
    const vuelta = await medir();
    ok('se puede volver a Mantel', vuelta.franjas === 2 && vuelta.iconos === 12 && vuelta.comparativa === 'none', vuelta);
    await ir(page, '#carta', 300); await foto(page, 'mantel-carta');
    // Paletas: color computado real, aria-pressed, localStorage
    await page.evaluate(() => { if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true }); else scrollTo(0, 0); });
    await page.waitForTimeout(600);
    const colores = {};
    for (const p of ['loza', 'ocre', 'albahaca']) {
      await page.click(`[data-paleta="${p}"]`);
      await page.waitForTimeout(500);
      colores[p] = await page.evaluate(() => ({ boton: getComputedStyle(document.querySelector('.portada .boton')).backgroundColor, em: getComputedStyle(document.querySelector('.antetitulo')).color, logo: document.querySelector('.marca img').getAttribute('src'), pulsado: document.querySelector('[data-paleta][aria-pressed="true"]').dataset.paleta, guardado: localStorage.getItem('fiambreira-paleta') }));
      ok(`paleta ${p}: aria-pressed y localStorage`, colores[p].pulsado === p && colores[p].guardado === p, colores[p]);
      if (p !== 'albahaca') await foto(page, `paleta-${p}`);
    }
    ok('las tres paletas cambian el color computado del botón', new Set(Object.values(colores).map((c) => c.boton)).size === 3, Object.fromEntries(Object.entries(colores).map(([k, v]) => [k, v.boton])));
    ok('el logo no cambia con la paleta (es un SVG con colores fijos)', new Set(Object.values(colores).map((c) => c.logo)).size === 1);
    // Recarga con paleta guardada: la clase está ya al cargar (script bloqueante)
    await page.click('[data-paleta="ocre"]');
    await page.reload({ waitUntil: 'domcontentloaded' });
    const alCargar = await page.evaluate(() => [document.documentElement.classList.contains('paleta-ocre'), getComputedStyle(document.documentElement).getPropertyValue('--albahaca-honda').trim()]);
    ok('al recargar, la paleta guardada se aplica sin parpadeo', alCargar[0] && alCargar[1].toUpperCase() === '#6A4301', alCargar);
    await page.evaluate(() => { localStorage.setItem('fiambreira-paleta', 'albahaca'); localStorage.setItem('fiambreira-maqueta', 'mantel'); });
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
    // la mano sobre el mantel: el cursor dice «alisa» y la tela se hunde y se arruga
    const sec = await page.locator('.portada').boundingBox();
    for (let i = 0; i < 30; i++) { await page.mouse.move(sec.x + sec.width * (0.62 + i * 0.008), sec.y + sec.height * (0.3 + i * 0.01)); await page.waitForTimeout(25); }
    await page.waitForTimeout(150);
    const est = await page.evaluate(() => [window.__mantel && window.__mantel.estado(), document.querySelector('.cursor').classList.contains('es-etiqueta'), document.querySelector('.cursor-texto').textContent]);
    ok('mantel (WebGL): al pasar la mano la tela se hunde (presión > 0,3) y el cursor dice «alisa»', est[0] && est[0].pr > 0.3 && est[1] && est[2] === 'alisa', est);
    await foto(page, 'portada-mano-sobre-el-mantel');
    await page.mouse.down(); await page.mouse.up();
    await page.waitForTimeout(250);
    const onda = await page.evaluate(() => window.__mantel.estado().rip);
    ok('mantel: un toque deja una onda', onda > 0.3, onda);
    await page.waitForTimeout(3500);
    const reposo = await page.evaluate(() => window.__mantel.estado());
    ok('mantel: sin mano, la tela se vuelve a alisar sola', reposo.pr < 0.15 && reposo.rip < 0.1, reposo);
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
      return { fig: bb('.portada-pie'), datos: bb('.portada-datos'), ante: bb('.portada .antetitulo'), h1: bb('.titulo-portada'), entr: bb('.entradilla'), acc: bb('.portada-acciones'), cab: bb('.cabecera'), plato: bb('.portada-plato') };
    });
    const textos = ['ante', 'h1', 'entr', 'acc'];
    const choques = [];
    textos.forEach((t) => { if (solapan(cajas[t], cajas.fig)) choques.push(t + '×aviso'); if (solapan(cajas[t], cajas.cab)) choques.push(t + '×cabecera'); if (solapan(cajas[t], cajas.datos)) choques.push(t + '×datos'); });
    if (solapan(cajas.plato, cajas.fig)) choques.push('plato×aviso'); if (solapan(cajas.plato, cajas.datos)) choques.push('plato×datos');
    for (let i = 0; i < textos.length; i++) for (let j = i + 1; j < textos.length; j++) if (solapan(cajas[textos[i]], cajas[textos[j]])) choques.push(textos[i] + '×' + textos[j]);
    ok(`portada ${w}×${h}: sin solapes entre plato, aviso, datos, cabecera y textos`, choques.length === 0, choques.length ? choques : 'ninguno');
    await foto(page, `movil-${w}x${h}-portada`);
    await ctx.close();
  }

  /* ---------- 7. Galería anclada horizontal de la temporada, en pasos de ~90 px ---------- */
  for (const [w, h, pre] of [[1440, 900, 'escritorio'], [390, 844, 'movil']]) {
    const { ctx, page } = await nuevo(b, { w, h, movil: w < 600, cookies: false });
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(3500);
    await ir(page, '#temporada', 0);
    const xs = [];
    for (let k = 0; k < 120; k++) {
      await page.mouse.wheel(0, 90);
      await page.waitForTimeout(60);
      const d = await page.evaluate(() => { const t = document.querySelector('.temporada').getBoundingClientRect(); const m = [...document.querySelectorAll('.mes')]; return [Math.round(m[0].getBoundingClientRect().left), Math.round(m[11].getBoundingClientRect().right), Math.round(t.bottom)]; });
      xs.push(d);
      if (k % 20 === 10) await foto(page, `${pre}-temporada-paso-${String(k).padStart(3, '0')}`);
      if (d[2] < 0) break;
    }
    const retrocesos = xs.filter((d, i) => i > 0 && d[0] > xs[i - 1][0] + 2).length;
    const llega = xs.some((d) => d[1] <= w + 2);
    ok(`[${pre}] temporada: avanza en horizontal sin retrocesos y llega a diciembre`, retrocesos === 0 && llega, { pasos: xs.length, retrocesos, primero: xs[0], ultimo: xs[xs.length - 1] });
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
      modo: document.compatMode,
    }));
    const nombre = p || 'index.html';
    ok(`${nombre}: noindex, sello, comentario arriba, sin marcadores, modo estándar`, d.robots === 'noindex, nofollow' && d.sello && d.comentario && d.marcadores.length === 0 && d.modo === 'CSS1Compat', d);
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
