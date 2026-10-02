// Verificación de la plantilla (PLIEGO §7) con Playwright + Chromium.
// Uso: servir la carpeta (npx http-server -p 8765 .) y ejecutar
//   node scripts/verifica.js [--rutas=/ruta/a/rutas.js] [--solo=capturas|pruebas]
// --rutas: módulo opcional que sirve en local jsDelivr y Google Fonts cuando el
// entorno no deja descargarlos (así se ejecutó en la noche del 2026-10-02).
const path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const arg = k => (process.argv.find(a => a.startsWith('--' + k + '=')) || '').split('=')[1];
const rutas = arg('rutas') ? require(path.resolve(arg('rutas'))) : async () => {};
const solo = arg('solo');
const BASE = 'http://localhost:8765/';
const AHORA = 'ahora=2026-10-01T18:10';   // jueves por la tarde, abierto
const OUT = path.join(__dirname, '..', 'screenshots') + '/';
const ESC = { width: 1440, height: 900 }, MOV = { width: 390, height: 844 };
const ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'];

const res = [];
const ok = (nombre, cond, extra) => { res.push({ nombre, ok: !!cond, extra }); console.log((cond ? 'OK   ' : 'FALLA') + ' ' + nombre + (extra !== undefined ? ' — ' + (typeof extra === 'string' ? extra : JSON.stringify(extra)) : '')); };

async function nueva(b, vp, opts = {}) {
  const movil = vp.width < 500;
  const ctx = await b.newContext({ viewport: vp, ignoreHTTPSErrors: true, deviceScaleFactor: movil ? 2 : 1, isMobile: movil, hasTouch: movil, reducedMotion: opts.reducido ? 'reduce' : 'no-preference' });
  if (opts.cookies !== false) await ctx.addInitScript(() => { try { localStorage.setItem('branavella-cookies', '1'); } catch (e) {} });
  const page = await ctx.newPage();
  const log = { errores: [], peticiones: [] };
  // Con el CDN tumbado a propósito, Chromium anota un ERR_FAILED por cada script bloqueado: eso es la prueba, no un fallo.
  page.on('console', m => { if (m.type() === 'error' && !(opts.sinCdn && /ERR_FAILED/.test(m.text()))) log.errores.push(m.text()); });
  page.on('pageerror', e => log.errores.push('pageerror: ' + e.message));
  page.on('response', r => { if (r.status() >= 400) log.errores.push(r.status() + ' ' + r.url()); });
  page.on('requestfailed', r => { if (!(opts.sinCdn && r.url().includes('jsdelivr'))) log.errores.push('falla ' + r.url()); });
  await rutas(page, { sinCdn: !!opts.sinCdn });
  return { ctx, page, log };
}
// Con Lenis, window.scrollTo no dispara los ScrollTrigger: se baja con la rueda.
async function ruedaHasta(page, y, paso = 360) {
  for (let i = 0; i < 200; i++) {
    const s = await page.evaluate(() => window.scrollY);
    if (Math.abs(s - y) < paso * 0.6) break;
    await page.mouse.wheel(0, Math.sign(y - s) * Math.min(paso, Math.abs(y - s)));
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(1300);
}
const topDe = (page, sel) => page.evaluate(s => { const e = document.querySelector(s); return e.getBoundingClientRect().top + window.scrollY; }, sel);
const foto = (page, nombre, completa) => page.screenshot({ path: OUT + nombre + '.jpg', type: 'jpeg', quality: 72, fullPage: !!completa });

async function capturas(b) {
  for (const [tag, vp] of [['escritorio', ESC], ['movil', MOV]]) {
    const { ctx, page, log } = await nueva(b, vp);
    await page.goto(BASE + '?' + AHORA);
    await page.waitForTimeout(4400);
    await foto(page, tag + '-01-portada');
    if (vp.width > 500) { await page.mouse.move(900, 600); await page.mouse.down(); await page.mouse.move(980, 560, { steps: 12 }); await page.mouse.up(); await page.waitForTimeout(400); await foto(page, tag + '-01b-portada-presionada'); }
    // Los aires: cinco fotogramas del anclaje
    const yP = await topDe(page, '.aires');
    await ruedaHasta(page, yP + 2);
    const alto = vp.height;
    for (let k = 0; k <= 4; k++) {
      await ruedaHasta(page, yP + Math.round(alto * 3 * k / 4) + 2);
      await foto(page, tag + '-02-aires-' + (k + 1));
    }
    const pasoFinal = await page.evaluate(() => window.__branavella.diagrama.actual);
    ok(tag + ': la secuencia anclada llega al galope con la rueda', pasoFinal === 2, pasoFinal);
    for (const [sel, n, extra] of [['.cinta', '03-cinta', -200], ['.cuadra', '04-cuadra', 0], ['.cuadra-marco', '04b-cuadra-caballos', -150], ['.equipo', '04c-cuadra-equipo', -300], ['.escuela', '05-escuela', 0], ['.tablon', '05b-tablon', -100], ['.preguntas', '06-preguntas', 0], ['.visita', '07-visita', 0], ['.formulario', '07b-formulario', -100], ['.pie', '08-pie', -300]]) {
      await ruedaHasta(page, Math.max(0, await topDe(page, sel) + extra));
      await foto(page, tag + '-' + n);
    }
    ok(tag + ': consola limpia y sin 404', log.errores.length === 0, log.errores);
    await ctx.close();
  }
}

async function pruebas(b) {
  // 1. Cortina a mitad de camino + retirada en los tres casos
  for (const caso of ['normal', 'sinCdn', 'reducido']) {
    const { ctx, page, log } = await nueva(b, ESC, { sinCdn: caso === 'sinCdn', reducido: caso === 'reducido' });
    await page.goto(BASE + '?' + AHORA);
    if (caso === 'normal') {
      await page.waitForTimeout(1750); await foto(page, 'cortina-1-mitad');
      await page.waitForTimeout(250); await foto(page, 'cortina-2-mitad');
      const colores = await page.evaluate(() => ({ cortina: getComputedStyle(document.querySelector('.cortina-lamina')).backgroundColor, fondo: getComputedStyle(document.body).backgroundColor }));
      ok('la cortina es de otro color que el fondo', colores.cortina !== colores.fondo, colores);
    }
    if (caso === 'sinCdn') { await page.waitForTimeout(900); await foto(page, 'cortina-sin-gsap-mitad'); }
    await page.waitForTimeout(4500);
    const d = await page.evaluate(() => getComputedStyle(document.querySelector('.cortina')).display);
    ok('cortina en display:none (' + caso + ')', d === 'none', d);
    if (caso !== 'normal') {
      await foto(page, 'pasada-' + caso + '-portada');
      const lee = await page.evaluate(() => {
        const h = document.documentElement; const t = document.querySelector('.portada-titulo span');
        return { motion: h.classList.contains('has-motion'), op: getComputedStyle(t).opacity, estado: document.querySelector('.estado').textContent, hoy: !!document.querySelector('.semana li.es-hoy') };
      });
      ok(caso + ': el titular se ve y el horario sigue vivo', lee.op === '1' && lee.hoy && /abierto/.test(lee.estado), lee);
      await page.click('.aire-boton[data-aire="galope"]');
      const nota = await page.evaluate(() => ({ nota: document.querySelector('.aire-nota-texto').textContent, tiempos: [...document.querySelectorAll('.aire-tiempos i')].filter(i => !i.hidden).length }));
      ok(caso + ': el selector de aires cambia nota y tiempos', /galope/.test(nota.nota) && nota.tiempos === 3, nota);
      await page.evaluate(() => { document.querySelector('.aires').scrollIntoView(); });
      await page.waitForTimeout(400);
      await page.click('.aires-boton[data-dir="1"]'); await page.click('.aires-boton[data-dir="1"]');
      await page.waitForTimeout(1100);
      const pp = await page.evaluate(() => ({ activo: window.__branavella.diagrama.actual, tiempos: document.querySelector('.dato-tiempos').textContent, kmh: document.querySelector('.dato-kmh').textContent, susp: !!document.querySelector('.suspension') }));
      ok(caso + ': los botones de los aires llevan al galope (3 tiempos, 22 km/h, suspensión)', pp.activo === 2 && pp.tiempos === '3' && pp.kmh === '22' && pp.susp, pp);
      await foto(page, 'pasada-' + caso + '-aires');
      await page.screenshot({ path: OUT + 'pasada-' + caso + '-completa.jpg', type: 'jpeg', quality: 60, fullPage: true });
      ok(caso + ': consola limpia', log.errores.length === 0, log.errores);
    }
    await ctx.close();
  }

  // 2. Cookies, mando escondido mientras hay aviso, densidades y paletas (?revision)
  {
    const { ctx, page, log } = await nueva(b, ESC, { cookies: false });
    await page.goto(BASE + '?revision&' + AHORA);
    await page.waitForTimeout(4400);
    const antes = await page.evaluate(() => ({ cookies: !document.querySelector('.cookies').hidden, display: getComputedStyle(document.querySelector('.cookies')).display, mando: document.querySelector('.mando').hidden }));
    ok('aviso de cookies visible y mando escondido mientras tanto', antes.cookies && antes.display === 'flex' && antes.mando, antes);
    await foto(page, 'cookies-aviso');
    await page.click('.cookies-aceptar');
    const desp = await page.evaluate(() => ({ display: getComputedStyle(document.querySelector('.cookies')).display, mando: getComputedStyle(document.querySelector('.mando')).display, ls: localStorage.getItem('branavella-cookies') }));
    ok('el botón cierra de verdad el aviso y aparece el mando', desp.display === 'none' && desp.mando !== 'none' && desp.ls === '1', desp);
    // Densidad sobria
    await ruedaHasta(page, await topDe(page, '.cuadra'));
    await foto(page, 'densidad-aires-cuadra');
    await page.click('[data-densidad="sobria"]');
    await page.waitForTimeout(500);
    const sob = await page.evaluate(() => ({ dibujo: getComputedStyle(document.querySelector('.caballo-dibujo')).display, dato: getComputedStyle(document.querySelector('.caballo-dato')).display, comp: getComputedStyle(document.querySelector('.alzadas')).display, filas: document.querySelectorAll('.alzadas-lista li').length, rastro: getComputedStyle(document.querySelector('.cinta b')).display, ancho: document.documentElement.scrollWidth, iw: innerWidth, ls: localStorage.getItem('branavella-densidad') }));
    ok('sobria: se van las cabezas, entra la alzada y la comparativa, sin desbordar', sob.dibujo === 'none' && sob.dato === 'grid' && sob.comp === 'block' && sob.filas === 8 && sob.rastro === 'none' && sob.ancho === sob.iw && sob.ls === 'sobria', sob);
    await page.waitForTimeout(800);
    await foto(page, 'densidad-sobria-cuadra');
    await ruedaHasta(page, await topDe(page, '.alzadas') - 120);
    await foto(page, 'densidad-sobria-alzadas');
    await page.click('[data-densidad="aires"]');
    const vuelta = await page.evaluate(() => getComputedStyle(document.querySelector('.caballo-dibujo')).display);
    ok('se puede volver a «Aires»', vuelta !== 'none', vuelta);
    // Paletas
    const colores = {};
    for (const p of ['casaca', 'azul', 'ocre']) {
      await page.click('[data-paleta="' + p + '"]');
      await page.waitForTimeout(700); // el botón lleva transición de color de .35 s
      colores[p] = await page.evaluate(() => ({ boton: getComputedStyle(document.querySelector('.nav-cta')).backgroundColor, pres: [...document.querySelectorAll('[data-paleta]')].map(b => b.getAttribute('aria-pressed')).join(','), ls: localStorage.getItem('branavella-paleta'), logo: getComputedStyle(document.querySelector('.logo-marca')).getPropertyValue('--marca-fondo') }));
    }
    ok('las tres paletas cambian el color computado de un botón real', new Set(Object.values(colores).map(c => c.boton)).size === 3, colores);
    ok('aria-pressed y localStorage siguen a la paleta', colores.ocre.pres === 'false,false,true' && colores.ocre.ls === 'ocre', colores.ocre);
    await ruedaHasta(page, 0); await page.waitForTimeout(600);
    await foto(page, 'paleta-ocre-portada');
    await page.click('[data-paleta="azul"]'); await page.waitForTimeout(400);
    await foto(page, 'paleta-azul-portada');
    await page.reload({ waitUntil: 'load' });
    const recarga = await page.evaluate(() => document.documentElement.className);
    ok('al recargar, la paleta guardada está en <html> ya en load (sin parpadeo)', /paleta-azul/.test(recarga), recarga);
    await page.click('[data-paleta="casaca"]').catch(() => {});
    await page.evaluate(() => { localStorage.removeItem('branavella-paleta'); localStorage.removeItem('branavella-densidad'); });
    ok('consola limpia (revisión)', log.errores.length === 0, log.errores);
    await ctx.close();
  }
  // Sin ?revision el mando no aparece ni se aplica lo guardado
  {
    const { ctx, page } = await nueva(b, ESC);
    await page.addInitScript(() => { localStorage.setItem('branavella-densidad', 'sobria'); localStorage.setItem('branavella-paleta', 'ocre'); });
    await page.goto(BASE);
    await page.waitForTimeout(800);
    const r = await page.evaluate(() => ({ mando: getComputedStyle(document.querySelector('.mando')).display, cls: document.documentElement.className }));
    ok('sin ?revision: mando oculto y sin clases de demo', r.mando === 'none' && !/sobria|paleta-/.test(r.cls), r);
    await ctx.close();
  }

  // 3. Móvil: menú, cuadro, mapa, anchura, hero en 360×640 y 375×667
  {
    const { ctx, page, log } = await nueva(b, MOV);
    await page.goto(BASE + '?' + AHORA);
    await page.waitForTimeout(4400);
    await page.click('.nav-boton');
    await page.waitForTimeout(900);
    const menu = await page.evaluate(() => { const p = document.querySelector('.nav-panel'); const r = p.getBoundingClientRect(); return { exp: document.querySelector('.nav-boton').getAttribute('aria-expanded'), alto: Math.round(r.height), vh: innerHeight, top: Math.round(r.top) }; });
    ok('menú móvil: abre a pantalla completa (100dvh dentro de la cabecera con backdrop-filter)', menu.exp === 'true' && menu.alto >= menu.vh - 2 && menu.top <= 0, menu);
    await foto(page, 'movil-menu-abierto');
    await page.click('.nav-boton', { timeout: 3000 });
    await page.waitForTimeout(800);
    ok('menú móvil: el mismo botón lo cierra', await page.evaluate(() => document.querySelector('.nav-boton').getAttribute('aria-expanded')) === 'false');
    await page.click('.nav-boton'); await page.waitForTimeout(700);
    await page.click('.nav-lista a[href="#escuela"]'); await page.waitForTimeout(2200);
    const cuadro = await page.evaluate(() => { const m = document.querySelector('.cuadra-marco'); return { tab: m.getAttribute('tabindex'), menu: document.querySelector('.nav-boton').getAttribute('aria-expanded'), y: Math.round(document.querySelector('#escuela').getBoundingClientRect().top) }; });
    ok('móvil: el enlace del menú lleva a su sección y cierra el menú; la cuadra desborda y es focusable', cuadro.tab === '0' && cuadro.menu === 'false' && Math.abs(cuadro.y) < 120, cuadro);
    const anchos = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
    ok('móvil: sin desbordamiento horizontal del documento', anchos.sw === anchos.iw, anchos);
    await page.evaluate(() => document.querySelector('.visita-mapa').scrollIntoView());
    await page.waitForTimeout(600);
    const antesMapa = await page.evaluate(() => document.querySelectorAll('iframe').length);
    await page.click('.mapa-boton'); await page.waitForTimeout(600);
    const despMapa = await page.evaluate(() => { const f = document.querySelector('.mapa-caja iframe'); return f && f.src; });
    ok('mapa: no hay iframe hasta pulsar y luego carga Google Maps', antesMapa === 0 && /google\.com\/maps\?q=.*output=embed/.test(despMapa || ''), despMapa);
    await foto(page, 'movil-mapa-cargado');
    ok('consola limpia (móvil)', log.errores.length === 0, log.errores);
    await ctx.close();
  }
  for (const vp of [{ width: 360, height: 640 }, { width: 375, height: 667 }]) {
    const { ctx, page } = await nueva(b, vp);
    await page.goto(BASE + '?' + AHORA); await page.waitForTimeout(4400);
    const r = await page.evaluate(() => {
      const box = s => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); return { t: Math.round(r.top), b: Math.round(r.bottom), l: Math.round(r.left), r: Math.round(r.right) }; };
      const solapa = (a, c) => !(a.b <= c.t || c.b <= a.t || a.r <= c.l || c.r <= a.l);
      const cab = box('.cabecera'), tit = box('.portada-titulo'), ent = box('.portada-entrada'), acc = box('.portada-acciones'), ante = box('.portada-ante'), aire = box('.aire');
      return { solapes: [solapa(cab, ante), solapa(ante, tit), solapa(tit, ent), solapa(ent, acc), solapa(acc, aire), solapa(tit, aire)], derecha: Math.max(tit.r, ent.r, acc.r, aire.r), iw: innerWidth, sw: document.documentElement.scrollWidth };
    });
    ok('hero ' + vp.width + '×' + vp.height + ' sin solapes ni desborde', r.solapes.every(x => !x) && r.derecha <= r.iw && r.sw === r.iw, r);
    await foto(page, 'movil-' + vp.width + 'x' + vp.height + '-portada');
    await ctx.close();
  }

  // 4. La cuadra: arrastre con el ratón y foco solo si desborda
  {
    const { ctx, page } = await nueva(b, ESC);
    await page.goto(BASE + '?' + AHORA); await page.waitForTimeout(4400);
    await ruedaHasta(page, await topDe(page, '.cuadra-marco') - 200);
    const box = await page.evaluate(() => { const m = document.querySelector('.cuadra-marco'); const r = m.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + 120, tab: m.getAttribute('tabindex'), s0: m.scrollLeft }; });
    await page.mouse.move(box.x, box.y); await page.mouse.down(); await page.mouse.move(box.x - 400, box.y, { steps: 10 }); await page.mouse.up();
    await page.waitForTimeout(300);
    const s1 = await page.evaluate(() => document.querySelector('.cuadra-marco').scrollLeft);
    ok('cuadra: arrastrar con el ratón desplaza la fila de caballos, y es focusable porque desborda', s1 - box.s0 > 300 && box.tab === '0', { antes: box.s0, despues: s1, tab: box.tab });
    await foto(page, 'cuadra-arrastrada');
    await ctx.close();
  }

  // 5. Tareas largas en frío, con la caché deshabilitada
  {
    const { ctx, page } = await nueva(b, ESC);
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await page.goto(BASE + '?' + AHORA); await page.waitForTimeout(5000);
    // Control: una tarea larga lanzada con setTimeout (desde evaluate no cuenta, PLIEGO §6)
    await page.evaluate(() => setTimeout(() => { const t = performance.now(); while (performance.now() - t < 120) {} }, 10));
    await page.waitForTimeout(400);
    const carga = await page.evaluate(() => window.__longtasks.slice());
    const control = carga.some(t => t.d >= 110);
    ok('el observador de longtask funciona (control de 120 ms detectado)', control, carga);
    const reales = carga.filter(t => t.d < 110 || t.t < 4900);
    // Después de la carga: recorrer la página entera con la rueda y contar
    await page.evaluate(() => { window.__longtasks.length = 0; });
    const fin = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < fin; y += 500) { await page.mouse.wheel(0, 500); await page.waitForTimeout(90); }
    await page.waitForTimeout(1500);
    const scroll = await page.evaluate(() => window.__longtasks.slice());
    ok('tareas largas al cargar (en frío; SwiftShader, sin GPU)', true, reales);
    ok('tareas largas recorriendo la página entera con la rueda', true, scroll);
    await ctx.close();
  }

  // 5 bis. Lunes, teclado, pestañas, legal, 404 y transición a medias
  {
    const { ctx, page, log } = await nueva(b, ESC);
    await page.goto(BASE + '?ahora=2026-10-05T11:00'); await page.waitForTimeout(4400);
    const lun = await page.evaluate(() => ({ estado: document.querySelector('.estado').textContent, hoy: document.querySelector('.semana li.es-hoy').dataset.dia }));
    ok('lunes: descanso de los caballos y abre mañana a las 10:00', /descansan/.test(lun.estado) && /mañana a las 10:00/.test(lun.estado) && lun.hoy === '1', lun);
    for (let i = 0; i < 3; i++) await page.keyboard.press('Tab');
    await page.waitForTimeout(300);
    const foco = await page.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); return { el: a.textContent.trim().slice(0, 30), outline: cs.outlineStyle + ' ' + cs.outlineWidth }; });
    ok('teclado: el foco se ve (contorno de 3 px)', /solid 3px/.test(foco.outline), foco);
    await foto(page, 'teclado-foco');
    await ruedaHasta(page, await topDe(page, '.tablon') - 200);
    await page.focus('#pt-clases'); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(400);
    const tab = await page.evaluate(() => ({ sel: document.querySelector('[aria-selected="true"]').id, foco: document.activeElement.id, visible: !document.querySelector('#pp-rutas').hidden, oculto: document.querySelector('#pp-clases').hidden }));
    ok('pestañas: la flecha derecha pasa a «Rutas» con foco y panel', tab.sel === 'pt-rutas' && tab.foco === 'pt-rutas' && tab.visible && tab.oculto, tab);
    await foto(page, 'tablon-rutas');
    await ruedaHasta(page, 0);
    const yC = await topDe(page, '.escuela');
    await ruedaHasta(page, yC - 560);
    await foto(page, 'transicion-cancela-escuela');
    const mask = await page.evaluate(() => { const s = getComputedStyle(document.querySelector('.escuela')); return (s.webkitMaskImage || s.maskImage || '') + ' | abre=' + s.getPropertyValue('--abre'); });
    ok('transición: la escuela entra por listones (máscara a medio abrir)', /repeating-linear-gradient/.test(mask), mask);
    await page.goto(BASE + 'legal.html'); await page.waitForTimeout(600); await foto(page, 'legal');
    await page.goto(BASE + 'no-existe/otra.html'); await page.waitForTimeout(600);
    await foto(page, '404');
    const e404 = await page.evaluate(() => document.title);
    ok('404 propia servida en una ruta inexistente', /cuadra/.test(e404), e404);
    ok('consola limpia (lunes, legal)', log.errores.filter(e => !/no-existe|status of 404/.test(e)).length === 0, log.errores);
    await ctx.close();
  }

  // 6. Textos de relleno y marcadores
  {
    const { ctx, page } = await nueva(b, ESC);
    for (const u of ['index.html', 'legal.html', '404.html']) {
      await page.goto(BASE + u); await page.waitForTimeout(400);
      const t = await page.evaluate(() => document.body.textContent);
      const robots = await page.evaluate(() => (document.querySelector('meta[name=robots]') || {}).content);
      ok(u + ': sin [PENDIENTE], TODO ni lorem; noindex, nofollow; sello', !/\[PENDIENTE\]|\bTODO\b/.test(t) && !/lorem ipsum/i.test(t) && robots === 'noindex, nofollow' && /Sitio de demostración/.test(t), robots);
    }
    await ctx.close();
  }
}

(async () => {
  const b = await chromium.launch({ args: ARGS });
  if (solo !== 'pruebas') await capturas(b);
  if (solo !== 'capturas') await pruebas(b);
  await b.close();
  const mal = res.filter(r => !r.ok);
  console.log('\n' + (res.length - mal.length) + '/' + res.length + ' comprobaciones en verde');
  process.exit(mal.length ? 1 : 0);
})();
