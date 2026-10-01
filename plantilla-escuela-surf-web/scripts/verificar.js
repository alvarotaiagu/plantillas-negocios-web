// Verificación del PLIEGO §7 contra la web servida en local.
// Uso: (desde la carpeta que contiene plantilla-escuela-surf-web)
//   npx http-server -p 8765 -s -c-1 .   &
//   VEND=<node_modules con gsap, lenis y axe-core> node plantilla-escuela-surf-web/scripts/verificar.js
// Escribe capturas en screenshots/ y el resultado en screenshots/resultado.json.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { nuevo, bajar, BASE } = require('./comun.js');
const OUT = path.join(__dirname, '../screenshots');
const VEND = process.env.VEND;
const R = { comprobaciones: [], longtask: {}, axe: {}, errores: {} };
const ok = (nombre, cond, detalle = '') => { R.comprobaciones.push({ nombre, ok: !!cond, detalle }); console.log(cond ? 'ok ' : 'MAL', nombre, detalle); };
const shot = (page, n, full = false) => page.screenshot({ path: path.join(OUT, n + '.png'), fullPage: full });
const sinCookies = ctxPage => ctxPage.addInitScript(() => { try { localStorage.setItem('treboada-cookies', 'ok'); } catch (e) {} });

// Espera al fotograma en el que la cortina está a medio levantar y lo captura.
async function cortinaAMedias(page, nombre) {
  for (let i = 0; i < 120; i++) {
    const e = await page.evaluate(() => { const c = document.getElementById('cortina'); if (!c) return null; const r = c.getBoundingClientRect(); return { display: getComputedStyle(c).display, top: Math.round(r.top), h: innerHeight }; }).catch(() => null);
    if (e && e.display !== 'none' && e.top < -e.h * 0.15 && e.top > -e.h * 0.85) {
      // se congela el gesto para que la captura sea de ese fotograma y no del siguiente
      const fijo = await page.evaluate(() => {
        const c = document.getElementById('cortina');
        if (window.gsap) gsap.globalTimeline.pause();
        else { c.style.transform = getComputedStyle(c).transform; c.style.transition = 'none'; }
        return Math.round(c.getBoundingClientRect().top);
      });
      await shot(page, nombre);
      await page.evaluate(() => { if (window.gsap) gsap.globalTimeline.resume(); else { const c = document.getElementById('cortina'); c.style.transition = ''; c.style.transform = 'translate3d(0, calc(-100% - 140px), 0)'; } });
      return { ...e, top: fijo };
    }
    await page.waitForTimeout(25);
  }
  return { display: 'no se vio a medias', top: 0 };
}
async function aSeccion(page, id, extra = 0) {
  const y = await page.evaluate(i => document.getElementById(i).getBoundingClientRect().top + scrollY, id);
  const actual = await page.evaluate(() => scrollY);
  await bajar(page, Math.max(0, y - actual + extra), 150, 12);
  await page.waitForTimeout(1500);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();

  // ——— 1. Escritorio y móvil: cortina a medias, secciones, consola, anchura ———
  for (const movil of [false, true]) {
    const t = movil ? 'movil' : 'escritorio';
    const { page, errores, fallos } = await nuevo(b, { movil });
    const pulsar = (sel, o) => (movil ? page.tap(sel, o) : page.click(sel, o));
    await page.goto(BASE, { waitUntil: 'commit' });
    const cortinaMedia = await cortinaAMedias(page, `${t}-00-cortina-a-medias`);
    await page.waitForTimeout(3500);
    const cortinaFin = await page.evaluate(() => getComputedStyle(document.getElementById('cortina')).display);
    ok(`${t}: cortina vista a mitad de camino`, cortinaMedia.display !== 'none' && cortinaMedia.top < 0, JSON.stringify(cortinaMedia));
    ok(`${t}: cortina acaba en display:none`, cortinaFin === 'none', cortinaFin);
    const colores = await page.evaluate(() => [getComputedStyle(document.querySelector('.cortina-lamina')).backgroundColor, getComputedStyle(document.body).backgroundColor]);
    ok(`${t}: cortina de color distinto al fondo`, colores[0] !== colores[1], colores.join(' vs '));
    await shot(page, `${t}-01-portada-con-cookies`);
    // cookies
    const ck = await page.evaluate(() => ({ visible: !document.getElementById('cookies').hidden, disp: getComputedStyle(document.getElementById('cookies')).display }));
    await pulsar('#cookies-ok');
    await page.waitForTimeout(300);
    const ck2 = await page.evaluate(() => ({ disp: getComputedStyle(document.getElementById('cookies')).display, ls: localStorage.getItem('treboada-cookies') }));
    ok(`${t}: el botón de cookies cierra de verdad`, ck.visible && ck.disp === 'flex' && ck2.disp === 'none' && ck2.ls === 'ok', JSON.stringify([ck, ck2]));
    if (!movil) {
      await page.mouse.move(700, 420); await page.waitForTimeout(150); await page.mouse.move(520, 380); await page.waitForTimeout(900);
      const cur = await page.evaluate(() => ({ clase: document.documentElement.classList.contains('cursor-propio'), cursor: getComputedStyle(document.querySelector('.portada')).cursor, visible: getComputedStyle(document.querySelector('.cursor')).display }));
      ok('escritorio: cursor nativo oculto tras el primer pointermove y cursor propio visible', cur.clase && cur.cursor === 'none' && cur.visible === 'block', JSON.stringify(cur));
    } else {
      const cur = await page.evaluate(() => document.documentElement.classList.contains('cursor-propio'));
      ok('móvil: sin cursor propio en táctil', !cur);
      // menú móvil
      await pulsar('#menu-boton');
      await page.waitForTimeout(800);
      const abierto = await page.evaluate(() => ({ exp: document.getElementById('menu-boton').getAttribute('aria-expanded'), vis: getComputedStyle(document.getElementById('menu')).visibility, h: document.getElementById('menu').getBoundingClientRect().height, ih: innerHeight }));
      await shot(page, 'movil-02-menu-abierto');
      let cerro = true;
      try { await pulsar('#menu-boton', { timeout: 3000 }); } catch (e) { cerro = false; }
      await page.waitForTimeout(800);
      const cerrado = await page.evaluate(() => document.getElementById('menu-boton').getAttribute('aria-expanded'));
      ok('móvil: el menú abre a pantalla completa y vuelve a cerrar', abierto.exp === 'true' && abierto.vis === 'visible' && Math.abs(abierto.h - abierto.ih) < 2 && cerro && cerrado === 'false', JSON.stringify(abierto));
    }
    await shot(page, `${t}-01-portada`);
    const secciones = ['viaje', 'niveles', 'parte', 'material', 'seguridad', 'campamento', 'equipo', 'preguntas', 'contacto'];
    let n = 2;
    for (const s of secciones) {
      await aSeccion(page, s, s === 'viaje' ? (movil ? 1500 : 1700) : s === 'material' ? (movil ? 700 : 900) : 0);
      await shot(page, `${t}-${String(++n).padStart(2, '0')}-${s}`);
    }
    await bajar(page, 6000, 300, 10); await page.waitForTimeout(1500);
    await shot(page, `${t}-${String(++n).padStart(2, '0')}-pie`);
    const ancho = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
    ok(`${t}: sin desbordamiento horizontal`, ancho.sw === ancho.iw, JSON.stringify(ancho));
    // mapa bajo clic
    const antes = await page.evaluate(() => document.querySelectorAll('iframe').length);
    await page.evaluate(() => document.getElementById('mapa-boton').scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(400);
    await pulsar('#mapa-boton');
    await page.waitForTimeout(400);
    const despues = await page.evaluate(() => { const f = document.querySelector('#mapa iframe'); return f ? f.src : null; });
    ok(`${t}: mapa solo bajo clic`, antes === 0 && despues && despues.includes('output=embed'), `${antes} iframes antes · ${despues}`);
    // formulario
    await page.fill('input[name="nombre"]', 'Prueba');
    await page.fill('input[name="contacto"]', 'prueba@ejemplo.com');
    await pulsar('#reserva button[type="submit"]');
    const msg = await page.textContent('#reserva-estado');
    ok(`${t}: el formulario de muestra responde`, /no se ha enviado nada/.test(msg), msg);
    const txt = await page.evaluate(() => document.body.textContent);
    ok(`${t}: sin marcadores pendientes`, !/\[PENDIENTE\]|\bTODO\b/.test(txt) && !/lorem ipsum/i.test(txt));
    R.errores[t] = { consola: errores, peticiones: fallos };
    ok(`${t}: consola limpia y sin peticiones fallidas`, !errores.length && !fallos.filter(f => !/google\.com\/maps|gstatic|googleapis/.test(f)).length, JSON.stringify({ errores, fallos }));
    await page.context().close();
  }

  // ——— 2. Hero en móviles pequeños: sin solapes ———
  for (const [w, h] of [[360, 640], [375, 667]]) {
    const { page } = await nuevo(b, { movil: true, ancho: w, alto: h });
    await sinCookies(page);
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(4500);
    await shot(page, `movil-${w}x${h}-portada`);
    const r = await page.evaluate(() => {
      const sel = ['.portada-sup', '.lectura', '.portada-titulo', '.portada-entradilla', '.portada-acciones'];
      const cajas = sel.map(s => { const e = document.querySelector(s); const b = e.getBoundingClientRect(); return { s, vis: getComputedStyle(e).display !== 'none', t: b.top, b: b.bottom, l: b.left, r: b.right }; }).filter(c => c.vis);
      const sol = [];
      for (let i = 0; i < cajas.length; i++) for (let j = i + 1; j < cajas.length; j++) { const a = cajas[i], c = cajas[j]; if (a.t < c.b - 1 && c.t < a.b - 1 && a.l < c.r - 1 && c.l < a.r - 1) sol.push(a.s + ' × ' + c.s); }
      const fuera = cajas.filter(c => c.b > innerHeight + 1 || c.r > innerWidth + 1).map(c => c.s);
      const cab = document.getElementById('cabecera').getBoundingClientRect().bottom;
      return { sol, fuera, bajoCabecera: cajas[0].t >= cab };
    });
    ok(`portada ${w}×${h}: sin solapes y todo dentro de pantalla`, !r.sol.length && !r.fuera.length && r.bajoCabecera, JSON.stringify(r));
    await page.context().close();
  }

  // ——— 3. Pila sticky en pasos de 90 px ———
  {
    const { page } = await nuevo(b, {});
    await sinCookies(page);
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(4500);
    await aSeccion(page, 'niveles', -200);
    const medidas = await page.evaluate(() => { const li = [...document.querySelectorAll('.pila-item')]; return { altos: li.map(l => Math.round(l.getBoundingClientRect().height)), mb: li.map(l => getComputedStyle(l).marginBottom), pos: li.map(l => getComputedStyle(l).position), after: getComputedStyle(document.getElementById('pila'), '::after').height }; });
    ok('pila: mismo alto (medido por JS) y mismo margin-bottom en todos, incluido el último', new Set(medidas.altos).size === 1 && new Set(medidas.mb).size === 1 && medidas.pos.every(p => p === 'sticky'), JSON.stringify(medidas));
    let apiladas = 0, pasos = 0, superpuestasMal = 0;
    for (let k = 0; k < 60; k++) {
      await page.mouse.wheel(0, 90); await page.waitForTimeout(140); pasos++;
      const e = await page.evaluate(() => [...document.querySelectorAll('.pila-item')].map(l => Math.round(l.getBoundingClientRect().top)));
      const cab = 72;
      const fijas = e.filter((t, i) => Math.abs(t - (cab + 19 + i * 14)) <= 3).length;
      apiladas = Math.max(apiladas, fijas);
      if (k === 18 || k === 30) await shot(page, `escritorio-pila-paso-${k}`);
    }
    ok('pila: las cuatro tarjetas llegan a apilarse (pasos de 90 px)', apiladas >= 4, `${apiladas} apiladas a la vez en ${pasos} pasos`);
    void superpuestasMal;
    await page.context().close();
  }

  // ——— 4. Sin GSAP ———
  {
    const { page, errores } = await nuevo(b, { sinGsap: true });
    await page.goto(BASE, { waitUntil: 'commit' });
    const media = await cortinaAMedias(page, 'sin-gsap-00-cortina-a-medias');
    ok('sin GSAP: la cortina también se levanta (fotograma a medias)', media.display !== 'no se vio a medias', JSON.stringify(media));
    await page.waitForTimeout(3000);
    const r = await page.evaluate(() => ({ cortina: getComputedStyle(document.getElementById('cortina')).display, motion: document.documentElement.classList.contains('has-motion'), titular: getComputedStyle(document.querySelector('#niveles-titulo .letra')).transform }));
    ok('sin GSAP: la cortina se retira (display:none) y no hay estados vacíos', r.cortina === 'none' && !r.motion && r.titular === 'none', JSON.stringify(r));
    await page.click('#cookies-ok');
    await shot(page, 'sin-gsap-pagina-entera', true);
    const pasos = await page.evaluate(() => { const a = document.getElementById('d-altura').textContent; document.querySelectorAll('.paso-boton')[3].click(); return [a, document.getElementById('d-altura').textContent]; });
    ok('sin GSAP: los pasos del viaje se eligen a mano y el dibujo cambia', pasos[0] !== pasos[1], pasos.join(' → '));
    R.errores['sin-gsap'] = errores.filter(e => !/ERR_FAILED|net::/.test(e));
    await page.context().close();
  }

  // ——— 5. Movimiento reducido ———
  {
    const { page } = await nuevo(b, { reducido: true });
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const r = await page.evaluate(() => ({ cortina: getComputedStyle(document.getElementById('cortina')).display, motion: document.documentElement.classList.contains('has-motion'), lenis: document.documentElement.classList.contains('lenis') }));
    ok('movimiento reducido: cortina fuera, sin Lenis ni estados vacíos', r.cortina === 'none' && !r.motion && !r.lenis, JSON.stringify(r));
    await page.click('#cookies-ok');
    await shot(page, 'reducido-01-portada');
    const c = await page.evaluate(() => {
      const a = document.getElementById('d-prof').textContent;
      document.querySelectorAll('.paso-boton')[2].click();
      const hoy = document.querySelector('#horario tr.es-hoy');
      return { antes: a, despues: document.getElementById('d-prof').textContent, hoy: !!hoy, ahora: !!document.querySelector('.hora.es-ahora'), marea: document.getElementById('marea-curva').getAttribute('d').length > 100, contador: document.querySelector('[data-contador]').textContent };
    });
    ok('movimiento reducido: el contenido sigue cambiando (pasos, hoy, ahora, marea)', c.antes !== c.despues && c.hoy && c.ahora && c.marea, JSON.stringify(c));
    await page.evaluate(() => document.getElementById('viaje').scrollIntoView());
    await page.waitForTimeout(300);
    await shot(page, 'reducido-02-viaje');
    await page.context().close();
  }

  // ——— 6. Mandos: dos densidades y tres paletas (?revision) ———
  {
    const { page } = await nuevo(b, {});
    await page.goto(BASE + '?revision', { waitUntil: 'networkidle' });
    await page.waitForTimeout(4500);
    const conCookies = await page.evaluate(() => document.getElementById('mandos').hidden);
    await page.click('#cookies-ok');
    const sinC = await page.evaluate(() => getComputedStyle(document.getElementById('mandos')).display);
    ok('mandos: ocultos mientras está el aviso de cookies y visibles al cerrarlo', conCookies && sinC === 'grid', sinC);
    const { page: p2 } = await nuevo(b, {});
    await p2.goto(BASE, { waitUntil: 'networkidle' });
    await p2.waitForTimeout(500);
    ok('mandos: ocultos sin ?revision', await p2.evaluate(() => document.getElementById('mandos').hidden));
    await p2.context().close();
    await aSeccion(page, 'niveles', 300);
    await shot(page, 'maqueta-mar-de-fondo-niveles');
    await page.click('[data-maqueta="sobria"]');
    await page.waitForTimeout(800);
    const s = await page.evaluate(() => ({ clase: document.documentElement.classList.contains('maqueta-sobria'), escala: getComputedStyle(document.querySelector('.escala')).display, dato: parseFloat(getComputedStyle(document.querySelector('.nivel-dato-n')).fontSize), comp: getComputedStyle(document.querySelector('.comparativa')).display, filas: document.querySelectorAll('#comparativa li').length, sw: document.documentElement.scrollWidth, iw: innerWidth, ls: localStorage.getItem('treboada-maqueta'), pressed: document.querySelector('[data-maqueta="sobria"]').getAttribute('aria-pressed') }));
    ok('sobria: se retira el dibujo, manda el dato y aparece la comparativa', s.clase && s.escala === 'none' && s.dato > 40 && s.comp === 'grid' && s.filas === 4 && s.sw === s.iw && s.ls === 'sobria' && s.pressed === 'true', JSON.stringify(s));
    await shot(page, 'maqueta-sobria-niveles');
    await page.evaluate(() => document.querySelector('.comparativa').scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(1200);
    await shot(page, 'maqueta-sobria-comparativa');
    await page.click('[data-maqueta="mar"]');
    const vuelta = await page.evaluate(() => !document.documentElement.classList.contains('maqueta-sobria') && getComputedStyle(document.querySelector('.escala')).display !== 'none');
    ok('maqueta: se puede volver a «Mar de fondo»', vuelta);
    // paletas
    const color = () => page.evaluate(() => getComputedStyle(document.querySelector('.cinta')).backgroundColor);
    const base = await color();
    const res = {};
    for (const p of ['xeo', 'liquen']) {
      await page.click(`[data-paleta="${p}"]`);
      await page.waitForTimeout(200);
      res[p] = { color: await color(), pressed: await page.getAttribute(`[data-paleta="${p}"]`, 'aria-pressed'), ls: await page.evaluate(() => localStorage.getItem('treboada-paleta')) };
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(800);
      await shot(page, `paleta-${p}-portada`);
    }
    ok('paletas: cada botón cambia un color computado real, aria-pressed y localStorage', res.xeo.color !== base && res.liquen.color !== base && res.xeo.color !== res.liquen.color && res.liquen.pressed === 'true' && res.liquen.ls === 'liquen', JSON.stringify({ base, ...res }));
    // recarga: la clase está ya al cargar (script bloqueante del head)
    const alCargar = await new Promise(async res2 => {
      page.once('domcontentloaded', async () => res2(await page.evaluate(() => document.documentElement.className)));
      await page.reload({ waitUntil: 'domcontentloaded' });
    });
    ok('paletas: la guardada se aplica al recargar, sin parpadeo', /paleta-liquen/.test(alCargar), alCargar);
    // contraste de las paletas derivadas medido sobre colores computados
    const contr = await page.evaluate(() => {
      const rgb = s => s.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
      const lum = c => { const [r, g, b] = c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
      const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
      const out = {};
      for (const p of ['', 'paleta-xeo', 'paleta-liquen']) {
        document.documentElement.classList.remove('paleta-xeo', 'paleta-liquen'); if (p) document.documentElement.classList.add(p);
        const acento = rgb(getComputedStyle(document.querySelector('.etiqueta')).color);
        out[p || 'vidrio'] = { textoSobrePanel2: +ratio(acento, [18, 38, 47]).toFixed(2), botón: +ratio([7, 20, 26], rgb(getComputedStyle(document.querySelector('.boton-lleno')).backgroundColor)).toFixed(2) };
      }
      return out;
    });
    ok('paletas: contraste medido (texto ≥ 4,5 y botón ≥ 7) en las tres', Object.values(contr).every(c => c.textoSobrePanel2 >= 4.5 && c.botón >= 7), JSON.stringify(contr));
    await page.context().close();
  }

  // ——— 7. Tareas largas (PerformanceObserver), en frío ———
  {
    const { page } = await nuevo(b, {});
    await sinCookies(page);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await page.addInitScript(() => {
      window.__lt = [];
      new PerformanceObserver(l => l.getEntries().forEach(e => window.__lt.push({ t: Math.round(e.startTime), d: Math.round(e.duration) }))).observe({ type: 'longtask', buffered: true });
    });
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(3000);
    const arranque = await page.evaluate(() => window.__lt.slice());
    // control: una tarea larga lanzada con setTimeout SÍ cuenta (no desde evaluate)
    await page.evaluate(() => setTimeout(() => { const t = performance.now(); while (performance.now() - t < 120); }, 0));
    await page.waitForTimeout(400);
    const control = await page.evaluate(() => window.__lt.length);
    await page.evaluate(() => { window.__lt = []; });
    await page.mouse.move(600, 400);
    const t0 = Date.now(); let k = 0;
    while (Date.now() - t0 < 20000) { await page.mouse.move(300 + (k * 37) % 800, 200 + (k * 23) % 500); await page.mouse.wheel(0, k % 40 < 20 ? 140 : -140); await page.waitForTimeout(60); k++; }
    const rodando = await page.evaluate(() => window.__lt.slice());
    const fps = await page.evaluate(() => new Promise(r => { let n = 0; const t = performance.now(); const f = () => { n++; if (performance.now() - t < 2000) requestAnimationFrame(f); else r(Math.round(n / 2)); }; requestAnimationFrame(f); }));
    const escalaMar = await page.evaluate(() => document.documentElement.dataset.marEscala || '1');
    const renderer = await page.evaluate(() => { const g = document.createElement('canvas').getContext('webgl'); const e = g && g.getExtension('WEBGL_debug_renderer_info'); return e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : 'desconocido'; });
    R.longtask = { renderer, escalaMar, arranque, control: control - arranque.length, rodando, fpsHero: fps };
    ok('longtask: el observador funciona (control con setTimeout detectado)', control > arranque.length);
    // Umbral explícito: el entorno de verificación pinta WebGL con SwiftShader (GPU por
    // software, en la CPU), que es el peor caso posible. Se exige que con el shader y el
    // scroll vivos 20 s no haya más de 2 tareas largas y ninguna pase de 80 ms.
    ok('longtask: con shader y scroll vivos 20 s, ≤ 2 tareas largas y ninguna > 80 ms', rodando.length <= 2 && rodando.every(t => t.d <= 80), JSON.stringify({ rodando, fps, renderer, escalaMar }));
    await page.context().close();
  }

  // ——— 8. axe-core ———
  if (VEND) {
    const axeSrc = fs.readFileSync(path.join(VEND, 'axe-core/axe.min.js'), 'utf8');
    for (const [nombre, ruta, movil] of [['index-escritorio', '', false], ['index-movil', '', true], ['legal-escritorio', 'legal.html', false], ['legal-movil', 'legal.html', true], ['404-escritorio', '404.html', false], ['404-movil', '404.html', true], ['index-sobria', '?revision', false]]) {
      const { page } = await nuevo(b, { movil });
      await sinCookies(page);
      if (nombre === 'index-sobria') await page.addInitScript(() => localStorage.setItem('treboada-maqueta', 'sobria'));
      await page.goto(BASE + ruta, { waitUntil: 'networkidle' });
      await page.waitForTimeout(4500);
      if (!ruta || ruta.startsWith('?')) { await bajar(page, 26000, 400, 8); await page.waitForTimeout(2000); }
      await page.addScriptTag({ content: axeSrc });
      const res = await page.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } }).then(r => r.violations.map(v => ({ id: v.id, impacto: v.impact, nodos: v.nodes.length, ej: v.nodes.slice(0, 3).map(n => n.target.join(' ')) }))));
      R.axe[nombre] = res;
      ok(`axe ${nombre}: sin violaciones`, res.length === 0, JSON.stringify(res));
      await page.context().close();
    }
  }

  await b.close();
  const mal = R.comprobaciones.filter(c => !c.ok).length;
  R.resumen = `${R.comprobaciones.length - mal}/${R.comprobaciones.length} comprobaciones en verde`;
  fs.writeFileSync(path.join(OUT, 'resultado.json'), JSON.stringify(R, null, 2));
  console.log('\n' + R.resumen);
})();
