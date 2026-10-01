// Verificación §7 del PLIEGO con Playwright (Chromium).
// Uso: servir la carpeta padre en :8123 y
//   VEND=/ruta/a/node_modules node scripts/verificar.js
// VEND sirve copias locales de GSAP y Lenis cuando el entorno no llega a jsDelivr
// (en la noche de construcción el proxy lo bloqueaba). Sin VEND se usa el CDN real.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const BASE = process.env.BASE || 'http://localhost:8123/plantilla-carniceria-web/';
const OUT = path.join(__dirname, '..', 'screenshots');
const V = process.env.VEND;
const MAP = V && { 'gsap.min.js': V + '/gsap/dist/gsap.min.js', 'ScrollTrigger.min.js': V + '/gsap/dist/ScrollTrigger.min.js', 'lenis.min.js': V + '/lenis/dist/lenis.min.js' };
const R = {}; const ok = (k, v, info) => { R[k] = { ok: !!v, info }; console.log((v ? '✔' : '✘') + ' ' + k + (info !== undefined ? ' · ' + JSON.stringify(info) : '')); };
fs.mkdirSync(OUT, { recursive: true });
// SOLO=cortina,pila … para repetir solo algunos bloques
const corre = n => !process.env.SOLO || process.env.SOLO.split(',').includes(n);
const paso = n => console.log('— ' + n);

async function nueva(b, o = {}) {
  const ctx = await b.newContext({ viewport: o.vp || { width: 1440, height: 900 }, isMobile: !!o.movil, hasTouch: !!o.movil, reducedMotion: o.reducido ? 'reduce' : 'no-preference', ignoreHTTPSErrors: true });
  if (o.cookiesOk) await ctx.addInitScript(() => { try { localStorage.setItem('mouriscal-cookies', '1'); } catch (e) {} });
  const p = await ctx.newPage();
  p.err = []; p.f404 = [];
  p.on('console', m => { if (m.type() === 'error' && !/ERR_FAILED|jsdelivr/.test(m.text())) p.err.push(m.text()); });
  p.on('pageerror', e => p.err.push(e.message));
  p.on('response', r => { if (r.status() >= 400) p.f404.push(r.status() + ' ' + r.url()); });
  await p.route('https://cdn.jsdelivr.net/**', route => {
    if (o.sinGsap) return route.abort();
    if (!MAP) return route.continue();
    const f = Object.keys(MAP).find(k => route.request().url().endsWith(k));
    return f ? route.fulfill({ path: MAP[f], contentType: 'application/javascript' }) : route.abort();
  });
  return p;
}
const rueda = async (p, total, paso = 300, espera = 60) => { for (let y = 0; y < total; y += paso) { await p.mouse.wheel(0, paso); await p.waitForTimeout(espera); } };
const shot = (p, n) => p.screenshot({ path: path.join(OUT, n + '.jpg'), type: 'jpeg', quality: 72 });

(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const secciones = ['portada', 'mostrador', 'oficio', 'despiece', 'curados', 'preparados', 'encargos', 'casa', 'visita'];

  // 1-4 · Recorrido completo en escritorio y móvil, consola y peticiones
  if (corre('recorrido')) for (const [nom, vp, movil] of [['escritorio', { width: 1440, height: 900 }, false], ['movil', { width: 390, height: 844 }, true]]) {
    const p = await nueva(b, { vp, movil, cookiesOk: true });
    const cdp = await p.context().newCDPSession(p); await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await p.goto(BASE + 'index.html'); await p.waitForTimeout(3800);
    await shot(p, `${nom}-01-portada`);
    let i = 1;
    for (const s of secciones.slice(1)) {
      const y = await p.evaluate(id => document.getElementById(id).getBoundingClientRect().top + scrollY, s);
      const ahora = await p.evaluate(() => scrollY);
      await rueda(p, Math.max(0, y - ahora - 40), 250, 45);
      await p.waitForTimeout(1600);
      await shot(p, `${nom}-${String(++i).padStart(2, '0')}-${s}`);
      if (s === 'oficio') { for (let k = 1; k <= 4; k++) { await rueda(p, vp.height * 1.05, 250, 45); await p.waitForTimeout(1200); await shot(p, `${nom}-03-oficio-paso${k + 1}`); } }
    }
    await rueda(p, 4000, 400, 40); await p.waitForTimeout(1500); await shot(p, `${nom}-99-pie`);
    const m = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, largas: window.mouriscalLongtasks.slice() }));
    ok(`${nom}: sin desbordamiento horizontal`, m.sw === m.iw, m);
    ok(`${nom}: consola limpia`, p.err.length === 0, p.err);
    ok(`${nom}: cero 404`, p.f404.length === 0, p.f404);
    R[`${nom}-longtasks`] = m.largas;
    // Control del observador: una tarea larga lanzada con setTimeout (desde evaluate no cuenta)
    await p.evaluate(() => setTimeout(() => { const t = performance.now(); while (performance.now() - t < 120); }, 0));
    await p.waitForTimeout(400);
    const ctrl = await p.evaluate(() => window.mouriscalLongtasks.length);
    ok(`${nom}: el observador de longtask funciona (control)`, ctrl > m.largas.length, { antes: m.largas.length, despues: ctrl });
    await p.context().close();
  }

  // 5 · Sin GSAP
  if (corre('singsap')) {
    const p = await nueva(b, { sinGsap: true, cookiesOk: true });
    await p.goto(BASE + 'index.html'); await p.waitForTimeout(400); await shot(p, 'singsap-00-cortina-saliendo');
    await p.waitForTimeout(2200);
    const c = await p.evaluate(() => ({ cortina: getComputedStyle(document.getElementById('cortina')).display, motion: document.documentElement.classList.contains('has-motion'), titulo: getComputedStyle(document.querySelector('#mostrador-titulo')).opacity }));
    ok('sin GSAP: la cortina acaba en display:none', c.cortina === 'none', c);
    ok('sin GSAP: no se enciende has-motion', !c.motion);
    await shot(p, 'singsap-01-portada');
    for (const s of ['oficio', 'curados', 'encargos']) { await p.evaluate(id => document.getElementById(id).scrollIntoView(), s); await p.waitForTimeout(500); await shot(p, 'singsap-' + s); }
    ok('sin GSAP: consola limpia (salvo el CDN tumbado)', p.err.length === 0, p.err);
    await p.context().close();
  }

  // 6 · Movimiento reducido
  if (corre('reducido')) {
    const p = await nueva(b, { reducido: true, cookiesOk: true });
    await p.goto(BASE + 'index.html'); await p.waitForTimeout(600);
    const c = await p.evaluate(() => getComputedStyle(document.getElementById('cortina')).display);
    ok('reducido: la cortina acaba en display:none', c === 'none', c);
    await shot(p, 'reducido-01-portada');
    await p.evaluate(() => document.querySelector('.cifras').scrollIntoView()); await p.waitForTimeout(500);
    const cif = await p.evaluate(() => [...document.querySelectorAll('[data-contar]')].map(e => e.textContent));
    ok('reducido: los contadores llegan a su valor', cif.join() === '55,4,28', cif);
    await p.evaluate(() => document.querySelector('.oficio-paso[data-paso="4"]').scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
    const paso = await p.evaluate(() => document.querySelector('.oficio-paso.es-activo')?.dataset.paso);
    ok('reducido: el oficio cambia de paso sin animar', paso === '4', paso);
    await shot(p, 'reducido-02-oficio-paso4');
    await p.click('.dia[data-dia="2"]'); await p.click('.pizarra[data-dia="2"] .pieza');
    const tot = await p.textContent('#bascula-total');
    ok('reducido: la báscula sigue pesando', tot === '7,25', tot);
    await p.context().close();
  }

  // 6 bis · Cortina a mitad (GSAP ralentizado desde fuera, solo para la foto)
  if (corre('cortina')) {
    const p = await nueva(b, { cookiesOk: true });
    await p.goto(BASE + 'index.html', { waitUntil: 'commit' });
    await p.waitForFunction(() => window.gsap && document.documentElement.classList.contains('has-motion'));
    await p.evaluate(() => { gsap.globalTimeline.timeScale(0.12); });
    for (const [t, n] of [[2200, 'a'], [6000, 'b'], [11000, 'c'], [14500, 'd']]) { await p.waitForTimeout(t - (n === 'a' ? 0 : { b: 2200, c: 6000, d: 11000 }[n])); await shot(p, 'cortina-mitad-' + n); }
    await p.evaluate(() => { gsap.globalTimeline.timeScale(1); }); await p.waitForTimeout(1500);
    const c = await p.evaluate(() => getComputedStyle(document.getElementById('cortina')).display);
    ok('normal: la cortina acaba en display:none', c === 'none', c);
    const colores = await p.evaluate(() => [getComputedStyle(document.querySelector('.cortina-lonchas span')).backgroundColor, getComputedStyle(document.body).backgroundColor]);
    ok('la cortina es de otro color que el fondo', colores[0] !== colores[1], colores);
    await p.context().close();
  }

  // 7 · Cookies, menú móvil, mapa, cursor
  if (corre('interaccion')) {
    const p = await nueva(b, { vp: { width: 390, height: 844 }, movil: true });
    await p.goto(BASE + 'index.html?revision'); await p.waitForTimeout(2600);
    const antes = await p.evaluate(() => ({ cookies: getComputedStyle(document.getElementById('cookies')).display, mandos: getComputedStyle(document.getElementById('mandos')).display }));
    ok('cookies: visible al entrar y el mando se aparta', antes.cookies === 'flex' && antes.mandos === 'none', antes);
    await shot(p, 'movil-cookies');
    await p.click('#cookies-ok');
    const desp = await p.evaluate(() => ({ cookies: getComputedStyle(document.getElementById('cookies')).display, mandos: getComputedStyle(document.getElementById('mandos')).display, ls: localStorage.getItem('mouriscal-cookies') }));
    ok('cookies: el botón lo cierra de verdad y aparece el mando', desp.cookies === 'none' && desp.mandos === 'flex' && desp.ls === '1', desp);
    await p.click('#menu-boton'); await p.waitForTimeout(1000);
    const menu = await p.evaluate(() => { const r = document.getElementById('menu').getBoundingClientRect(); return { exp: document.getElementById('menu-boton').getAttribute('aria-expanded'), h: Math.round(r.height), top: Math.round(r.top), ih: innerHeight }; });
    ok('menú móvil: abre, aria-expanded y alto de pantalla entera', menu.exp === 'true' && menu.h === menu.ih && menu.top === 0, menu);
    await shot(p, 'movil-menu-abierto');
    await p.click('#menu-boton', { timeout: 3000 }); await p.waitForTimeout(900);
    ok('menú móvil: el mismo botón lo cierra', await p.getAttribute('#menu-boton', 'aria-expanded') === 'false');
    await p.click('#menu-boton'); await p.waitForTimeout(900); await p.click('#menu a[href="#visita"]'); await p.waitForTimeout(2200);
    ok('menú móvil: un enlace navega y cierra', await p.getAttribute('#menu-boton', 'aria-expanded') === 'false' && await p.evaluate(() => document.getElementById('visita').getBoundingClientRect().top < 120));
    const iframeAntes = await p.$$eval('iframe', l => l.length);
    await p.click('#mapa-boton'); await p.waitForTimeout(300);
    const iframe = await p.$eval('#mapa iframe', f => f.src).catch(() => null);
    ok('mapa: no existe hasta el clic y luego sí', iframeAntes === 0 && /google\.com\/maps/.test(iframe || ''), iframe);
    const cur = await p.evaluate(() => document.documentElement.classList.contains('cursor-on'));
    ok('cursor propio: nunca en táctil', !cur);
    await p.context().close();

    const q = await nueva(b, { cookiesOk: true });
    await q.goto(BASE + 'index.html'); await q.waitForTimeout(3200);
    const c0 = await q.evaluate(() => document.documentElement.classList.contains('cursor-on'));
    await q.mouse.move(600, 500); await q.mouse.move(640, 520, { steps: 4 }); await q.waitForTimeout(200);
    const c1 = await q.evaluate(() => ({ on: document.documentElement.classList.contains('cursor-on'), nativo: getComputedStyle(document.body).cursor, clase: document.querySelector('.cursor').className }));
    ok('cursor propio: aparece con el primer movimiento de ratón y oculta el nativo', !c0 && c1.on && c1.nativo === 'none', c1);
    ok('cursor propio: sobre la portada es el cuchillo', /es-cuchillo/.test(c1.clase), c1.clase);
    await q.mouse.move(1100, 735, { steps: 6 }); await q.waitForTimeout(500); await shot(q, 'escritorio-cursor-cuchillo');
    await q.context().close();
  }

  // 7 bis · Dos densidades
  if (corre('densidades')) {
    const p = await nueva(b, { cookiesOk: true });
    await p.goto(BASE + 'index.html?revision'); await p.waitForTimeout(3000);
    const sw0 = await p.evaluate(() => document.documentElement.scrollWidth);
    await p.click('[data-maqueta="sobria"]'); await p.waitForTimeout(300);
    const s = await p.evaluate(() => ({
      clase: document.documentElement.classList.contains('maqueta-sobria'),
      dibujos: [...document.querySelectorAll('.curado-dibujo')].filter(e => getComputedStyle(e).display !== 'none').length,
      num: parseFloat(getComputedStyle(document.querySelector('.curado-dias-num')).fontSize),
      comparador: getComputedStyle(document.querySelector('.comparador')).display, filas: document.querySelectorAll('#comparador-barras li').length,
      sw: document.documentElement.scrollWidth, ls: localStorage.getItem('mouriscal-maqueta'), pressed: document.querySelector('[data-maqueta="sobria"]').getAttribute('aria-pressed')
    }));
    ok('sobria: retira los dibujos de curados y pone el dato en grande', s.clase && s.dibujos === 0 && s.num > 50, s);
    ok('sobria: añade el comparador de precios (18 filas)', s.comparador === 'block' && s.filas === 18, s.filas);
    ok('sobria: sin desbordamiento nuevo, aria-pressed y localStorage', s.sw === sw0 && s.pressed === 'true' && s.ls === 'sobria', s);
    await p.evaluate(() => document.getElementById('mostrador').scrollIntoView()); await p.waitForTimeout(400);
    await p.evaluate(() => document.querySelector('.comparador').scrollIntoView({ block: 'center' })); await p.waitForTimeout(1200); await shot(p, 'sobria-comparador');
    await p.evaluate(() => document.querySelector('.pila-item').scrollIntoView()); await p.waitForTimeout(1200); await shot(p, 'sobria-curados');
    await p.click('[data-maqueta="contraveta"]'); await p.waitForTimeout(300);
    ok('sobria: se puede volver a Contraveta', await p.evaluate(() => !document.documentElement.classList.contains('maqueta-sobria') && [...document.querySelectorAll('.curado-dibujo')].every(e => getComputedStyle(e).display !== 'none')));
    await p.context().close();
  }

  // 7 ter · Tres paletas
  if (corre('paletas')) {
    const p = await nueva(b, { cookiesOk: true });
    await p.goto(BASE + 'index.html?revision'); await p.waitForTimeout(3000);
    const leerColor = () => p.evaluate(() => ({ precio: getComputedStyle(document.querySelector('.pieza-precio')).color, boton: getComputedStyle(document.querySelector('.boton-lleno')).backgroundColor, logo: getComputedStyle(document.querySelector('.marca-sello path[stroke="#D8573F"]')).stroke }));
    const c = { lomo: await leerColor() };
    for (const pal of ['azafran', 'ciruela']) {
      await p.click(`[data-paleta="${pal}"]`); await p.waitForTimeout(200);
      c[pal] = await leerColor();
      const st = await p.evaluate(x => ({ pressed: document.querySelector(`[data-paleta="${x}"]`).getAttribute('aria-pressed'), ls: localStorage.getItem('mouriscal-paleta') }), pal);
      ok(`paleta ${pal}: cambia el color real, aria-pressed y localStorage`, c[pal].precio !== c.lomo.precio && c[pal].boton !== c.lomo.boton && st.pressed === 'true' && st.ls === pal, { ...c[pal], ...st });
      ok(`paleta ${pal}: el logo no cambia`, c[pal].logo === c.lomo.logo);
      await p.evaluate(() => document.getElementById('mostrador').scrollIntoView()); await p.waitForTimeout(1300); await shot(p, 'paleta-' + pal);
    }
    // Contraste medido en la página: texto de acento sobre los tres fondos y botón
    const con = await p.evaluate(() => {
      const lum = c => { const v = c.match(/\d+/g).slice(0, 3).map(x => x / 255).map(x => x <= .03928 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4); return .2126 * v[0] + .7152 * v[1] + .0722 * v[2]; };
      const r = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return +((x + .05) / (y + .05)).toFixed(2); };
      const out = {};
      for (const pal of ['', 'paleta-azafran', 'paleta-ciruela']) {
        document.documentElement.classList.remove('paleta-azafran', 'paleta-ciruela'); if (pal) document.documentElement.classList.add(pal);
        const cs = getComputedStyle(document.documentElement), v = k => cs.getPropertyValue(k).trim();
        const hx = h => 'rgb(' + [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16)).join(',') + ')';
        out[pal || 'lomo'] = { textoAzulejo: r(hx(v('--acento-texto')), hx(v('--azulejo'))), textoPanel: r(hx(v('--acento-texto')), hx(v('--panel'))), boton: r(hx(v('--papel')), hx(v('--acento-boton'))), claroMostrador: r(hx(v('--acento-claro')), hx(v('--mostrador-2'))) };
      }
      return out;
    });
    ok('paletas: contraste ≥4,5 en texto y ≥7 en botón', Object.values(con).every(o => o.textoAzulejo >= 4.5 && o.textoPanel >= 4.5 && o.claroMostrador >= 4.5 && o.boton >= 7), con);
    R.contrastePaletas = con;
    await p.click('[data-paleta="ciruela"]');
    await p.reload({ waitUntil: 'load' });
    const tras = await p.evaluate(() => document.documentElement.classList.contains('paleta-ciruela'));
    ok('paleta: al recargar se aplica antes del load (sin parpadeo)', tras);
    await p.click('[data-paleta="lomo"]');
    await p.context().close();
  }

  // Pila sticky en pasos de 90 px
  if (corre('pila')) {
    const p = await nueva(b, { cookiesOk: true });
    await p.goto(BASE + 'index.html'); await p.waitForTimeout(3000);
    const m = await p.evaluate(() => { const l = [...document.querySelectorAll('.pila-item')]; return { altos: l.map(e => e.offsetHeight), mb: l.map(e => getComputedStyle(e).marginBottom), after: getComputedStyle(document.querySelector('.pila'), '::after').height, art: l.map(e => e.querySelector('.curado').offsetHeight) }; });
    ok('pila: mismo alto en todos (el de la más alta)', new Set(m.altos).size === 1 && m.altos[0] === Math.max(...m.art), m);
    ok('pila: mismo margin-bottom en todos, incluido el último, y ::after de reposo', new Set(m.mb).size === 1 && parseFloat(m.after) > 0, m);
    const y0 = await p.evaluate(() => document.getElementById('curados').getBoundingClientRect().top + scrollY);
    await p.evaluate(y => window.scrollTo(0, y), y0); await p.waitForTimeout(500);
    let fantasmas = 0, pasos = 0;
    for (let k = 0; k < 60; k++) {
      await p.mouse.wheel(0, 90); await p.waitForTimeout(110); pasos++;
      const f = await p.evaluate(() => [...document.querySelectorAll('.pila-item')].filter(li => { const a = li.querySelector('.curado').getBoundingClientRect(), r = li.getBoundingClientRect(); return a.height > r.height + 1; }).length);
      fantasmas += f;
      if (k % 12 === 6) await shot(p, 'pila-90px-' + String(k).padStart(2, '0'));
    }
    ok('pila: 60 pasos de 90 px sin tarjetas fantasma', fantasmas === 0, { pasos });
    await p.context().close();
  }

  // Hero móvil sin solapes
  if (corre('heromovil')) for (const vp of [{ width: 360, height: 640 }, { width: 375, height: 667 }]) {
    const p = await nueva(b, { vp, movil: true, cookiesOk: true });
    await p.goto(BASE + 'index.html'); await p.waitForTimeout(3600);
    const s = await p.evaluate(() => { const q = s => document.querySelector(s).getBoundingClientRect(); const a = ['.cabecera', '.portada-antetitulo', '.portada-titulo', '.portada-entradilla', '.portada-botones']; const R = a.map(q); const o = []; for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) { const x = R[i], y = R[j]; if (x.left < y.right - 1 && y.left < x.right - 1 && x.top < y.bottom - 1 && y.top < x.bottom - 1) o.push(a[i] + '×' + a[j]); } const t = document.querySelector('.t-cursiva'); return { o, dentro: q('.portada-botones').bottom <= innerHeight, cursiva: t.scrollWidth <= t.clientWidth + 1, sw: document.documentElement.scrollWidth }; });
    ok(`portada ${vp.width}×${vp.height}: sin solapes, cabe y sin desbordar`, s.o.length === 0 && s.dentro && s.sw === vp.width, s);
    await shot(p, `movil-portada-${vp.width}x${vp.height}`);
    await p.context().close();
  }

  // Legal y 404
  if (corre('paginas')) for (const pg of ['legal.html', '404.html']) {
    const p = await nueva(b, {});
    await p.goto(BASE + pg); await p.waitForTimeout(1200);
    const s = await p.evaluate(() => ({ robots: document.querySelector('meta[name=robots]')?.content, sello: /negocio ficticio/.test(document.body.textContent) }));
    ok(`${pg}: noindex, sello y consola limpia`, s.robots === 'noindex, nofollow' && s.sello && p.err.length === 0 && p.f404.length === 0, { ...s, err: p.err, f404: p.f404 });
    await shot(p, pg.replace('.html', ''));
    await p.context().close();
  }

  // 8 · Marcadores pendientes (textContent, no innerText: «MÉTODO» lleva «TODO» dentro en mayúsculas)
  if (corre('marcadores')) {
    const txt = ['index.html', 'legal.html', '404.html', 'README.md'].map(f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8')).join('\n');
    const m = txt.match(/\[PENDIENTE\]|\bTODO\b|lorem ipsum/gi);
    ok('sin [PENDIENTE], TODO ni lorem', !m, m);
  }

  const prev = process.env.SOLO && fs.existsSync(path.join(OUT, 'verificacion.json')) ? JSON.parse(fs.readFileSync(path.join(OUT, 'verificacion.json'), 'utf8')) : {};
  Object.assign(prev, R); Object.assign(R, prev);
  fs.writeFileSync(path.join(OUT, 'verificacion.json'), JSON.stringify(R, null, 2));
  const fallos = Object.entries(R).filter(([k, v]) => v && v.ok === false);
  console.log(`\n${Object.values(R).filter(v => v && v.ok !== undefined).length - fallos.length} en verde, ${fallos.length} en rojo`);
  await b.close();
  process.exitCode = fallos.length ? 1 : 0;
})();
