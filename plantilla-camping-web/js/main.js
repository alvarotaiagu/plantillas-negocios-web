/* Camping A Piqueta — plantilla de demostración (negocio ficticio).
   Concepto «Vientos». Un solo archivo, sin build.
   Banderas separadas (PLIEGO §5): `gsapReady` y `motion`; los estados vacíos
   del CSS solo existen bajo html.has-motion, que exige las dos. */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const html = document.documentElement;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const fmt = (n, d = 0) => n.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d });

  const gsapReady = !!(window.gsap && window.ScrollTrigger);
  const motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const revision = html.classList.contains('es-revision');
  if (gsapReady) gsap.registerPlugin(ScrollTrigger);
  if (gsapReady && motion) html.classList.add('has-motion');
  html.classList.add('cortina-js');
  const sobria = () => html.classList.contains('maqueta-sobria');
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };
  const css = n => getComputedStyle(html).getPropertyValue(n).trim();
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));

  /* ————————————————— Lenis ————————————————— */
  let lenis = null;
  if (window.Lenis && motion) {
    lenis = new Lenis({ lerp: 0.14, smoothWheel: true });
    if (gsapReady) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }
  const velocidad = () => (lenis ? lenis.velocity : 0);
  function irA(d) {
    if (typeof d === 'number') { if (lenis) lenis.scrollTo(d, { duration: 1.3 }); else scrollTo({ top: d, behavior: motion ? 'smooth' : 'auto' }); return; }
    const el = $(d); if (!el) return;
    if (lenis) lenis.scrollTo(el, { duration: 1.3 }); else el.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' });
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2 || !$(id)) return;
    e.preventDefault(); cerrarMenu(); irA(id);
    const t = $(id); t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true });
  }));

  /* ————————————————— Cortina «izar»: la lona sube tirada por sus vientos ————————————————— */
  const cortina = $('#cortina');
  let cortinaFuera = false, cortinaSaliendo = !motion;
  const alSalir = [];
  function retirarCortina() {
    if (cortinaFuera) return;
    cortinaFuera = true; cortinaSaliendo = true;
    cortina.classList.add('es-fuera'); cortina.style.display = 'none';
    alSalir.forEach(f => f());
  }
  const panza = $('#cortina-panza'), cuerdaI = $('#cuerda-i'), cuerdaD = $('#cuerda-d');
  function dibujaCortina(subida, comba) {
    // subida 0..1 (fracción de pantalla); las cuerdas van de la polea central a las esquinas de abajo
    const yb = (1 - subida) * 900;
    cuerdaI.setAttribute('d', `M720 -10 L0 ${yb.toFixed(1)}`);
    cuerdaD.setAttribute('d', `M720 -10 L1440 ${yb.toFixed(1)}`);
    panza.setAttribute('d', `M0 0 L1440 0 L1440 4 Q720 ${(4 + comba).toFixed(1)} 0 4 Z`);
  }
  setTimeout(retirarCortina, 4500);
  if (!motion) {
    cortina.style.transition = 'opacity .35s linear';
    requestAnimationFrame(() => { cortina.style.opacity = '0'; });
    setTimeout(retirarCortina, 420);
  } else if (gsapReady) {
    const marca = $('.cortina-marca');
    const e = { s: 0, c: 70 };
    const lonaC = $('.cortina-lona'), borde = $('.cortina-borde');
    dibujaCortina(0, 70);
    const tl = gsap.timeline({ onComplete: retirarCortina, delay: 0.15 });
    tl.from(marca.children, { y: 24, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'expo.out' })
      .to(e, { c: 10, duration: 0.5, ease: 'power2.out', onUpdate: () => dibujaCortina(e.s, e.c) }, 0.6) // se tensa
      .add(() => { cortinaSaliendo = true; }, 1.0)
      .to([lonaC, borde], { yPercent: -100, y: -100, duration: 1.1, ease: 'expo.inOut' }, 1.05)
      .to(e, { s: 1.12, c: 60, duration: 1.1, ease: 'expo.inOut', onUpdate: () => dibujaCortina(e.s, e.c) }, 1.05);
  } else {
    cortina.style.transition = 'transform 1.1s cubic-bezier(.87,0,.13,1)';
    setTimeout(() => { cortinaSaliendo = true; cortina.style.transform = 'translate3d(0, calc(-100% - 100px), 0)'; }, 700);
    cortina.addEventListener('transitionend', retirarCortina, { once: true });
    setTimeout(retirarCortina, 2200);
  }

  /* ————————————————— Reveal por palabras (IntersectionObserver) ————————————————— */
  $$('[data-reveal]').forEach(el => {
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    let w = 0;
    const recorrer = nodo => Array.from(nodo.childNodes).forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
          const p = document.createElement('span'); p.className = 'palabra'; p.textContent = t; p.setAttribute('aria-hidden', 'true'); p.style.setProperty('--w', w++); frag.appendChild(p);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) recorrer(n);
    });
    recorrer(el);
  });
  const ioR = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('es-visible'); ioR.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
  $$('[data-reveal]').forEach(el => ioR.observe(el));

  /* ————————————————— Portada: la lona (Verlet en 3D) ————————————————— */
  const lona = $('#lona');
  const ctx = lona.getContext('2d');
  const tensionTxt = $('#tension');
  const viento = { x: -9999, y: -9999, vx: 0, vy: 0, activo: 0 };
  let tension = motion ? 0 : 1;
  const sim = { pts: [], cons: [], C: 0, R: 0, W: 0, H: 0, anclas: [], piquetas: [] };
  let colores = { a: [210, 80, 42], b: [248, 243, 234], tinta: [31, 42, 34] };
  const leerColores = () => { const c = css('--cuerda'); if (/^#[0-9a-f]{6}$/i.test(c)) colores.a = hex(c); };
  leerColores();
  function montarLona() {
    const r = lona.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    lona.width = Math.round(r.width * dpr); lona.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const W = r.width, H = r.height, movil = W < 760;
    const C = movil ? 16 : 26, R = movil ? 10 : 14;
    const x0 = W * 0.09, x1 = W * 0.91, y0 = H * 0.1, alto = H * 0.62;
    const sx = (x1 - x0) / (C - 1), sy = alto / (R - 1);
    const pts = [];
    for (let j = 0; j < R; j++) for (let i = 0; i < C; i++) {
      const x = x0 + i * sx, y = y0 + j * sy;
      pts.push({ x, y, z: 0, px: x, py: y, pz: 0, fijo: j === 0 && (i === 0 || i === C - 1 || i === Math.floor(C / 2) || i === Math.floor(C / 4) || i === Math.floor(3 * C / 4)) });
    }
    const cons = [];
    const idx = (i, j) => j * C + i;
    for (let j = 0; j < R; j++) for (let i = 0; i < C; i++) {
      if (i < C - 1) cons.push([idx(i, j), idx(i + 1, j), sx]);
      if (j < R - 1) cons.push([idx(i, j), idx(i, j + 1), sy]);
    }
    // los vientos: de las dos esquinas de abajo a sus piquetas, en el suelo
    const piquetas = [{ x: W * 0.015, y: H * 0.98 }, { x: W * 0.985, y: H * 0.98 }];
    const esquinas = [idx(0, R - 1), idx(C - 1, R - 1)];
    Object.assign(sim, { pts, cons, C, R, W, H, sx, sy, piquetas, esquinas, lv: esquinas.map((e, k) => Math.hypot(pts[e].x - piquetas[k].x, pts[e].y - piquetas[k].y)) });
  }
  function paso(dt, t) {
    const { pts, cons, piquetas, esquinas, lv } = sim;
    const flojo = 1 - tension;
    // viento de valle: ráfagas lentas, menos cuanto más tensa
    const rafaga = (Math.sin(t * 0.7) * 0.6 + Math.sin(t * 1.9 + 1) * 0.3 + Math.sin(t * 3.1) * 0.15) * (0.35 + 0.65 * flojo);
    const g = 900, amort = 0.985;
    for (const p of pts) {
      if (p.fijo) continue;
      let fx = 0, fy = g, fz = rafaga * 260 * Math.sin(p.x * 0.01 + t * 1.3);
      if (viento.activo > 0.01) {
        const dx = p.x - viento.x, dy = p.y - viento.y, d2 = dx * dx + dy * dy;
        const k = Math.exp(-d2 / 9000) * viento.activo;
        fx += viento.vx * 60 * k; fy += viento.vy * 60 * k; fz += 1400 * k;
      }
      const nx = p.x + (p.x - p.px) * amort + fx * dt * dt;
      const ny = p.y + (p.y - p.py) * amort + fy * dt * dt;
      const nz = p.z + (p.z - p.pz) * amort + fz * dt * dt;
      p.px = p.x; p.py = p.y; p.pz = p.z; p.x = nx; p.y = ny; p.z = nz;
    }
    // la tensión acorta los vientos: de flojos (un 12 % más largos) a tensos (un 6 % más cortos)
    const factor = lerp(1.12, 0.94, tension);
    for (let it = 0; it < 4; it++) {
      for (const [a, b, L] of cons) {
        const p = pts[a], q = pts[b];
        const dx = q.x - p.x, dy = q.y - p.y, dz = q.z - p.z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
        const k = (d - L) / d * 0.5;
        if (!p.fijo) { p.x += dx * k; p.y += dy * k; p.z += dz * k; }
        if (!q.fijo) { q.x -= dx * k; q.y -= dy * k; q.z -= dz * k; }
      }
      esquinas.forEach((e, n) => {
        const p = pts[e], pq = piquetas[n];
        const dx = p.x - pq.x, dy = p.y - pq.y, dz = p.z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1, L = lv[n] * factor;
        if (d > L) { const k = (d - L) / d; p.x -= dx * k; p.y -= dy * k; p.z -= dz * k; }
      });
    }
  }
  function pintarLona() {
    const { pts, C, R, W, H, piquetas, esquinas } = sim;
    ctx.clearRect(0, 0, W, H);
    // los vientos y sus piquetas
    ctx.lineWidth = 2; ctx.strokeStyle = `rgb(${colores.a.join(',')})`;
    esquinas.forEach((e, n) => { const p = pts[e], q = piquetas[n]; ctx.beginPath(); ctx.moveTo(p.x + p.z * 0.12, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); });
    ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.strokeStyle = `rgb(${colores.tinta.join(',')})`;
    piquetas.forEach((q, n) => { ctx.beginPath(); ctx.moveTo(q.x, q.y + 4); ctx.lineTo(q.x + (n ? 10 : -10), q.y - 18); ctx.stroke(); });
    // la cumbrera: la cuerda de la que cuelga la lona
    ctx.lineWidth = 2.5; ctx.strokeStyle = `rgb(${colores.tinta.join(',')})`;
    ctx.beginPath(); ctx.moveTo(0, pts[0].y - 2); ctx.lineTo(W, pts[0].y - 2); ctx.stroke();
    ctx.lineWidth = 0.6;
    const L = [-0.35, -0.55, 0.76];
    for (let j = 0; j < R - 1; j++) for (let i = 0; i < C - 1; i++) {
      const a = pts[j * C + i], b = pts[j * C + i + 1], c = pts[(j + 1) * C + i + 1], d = pts[(j + 1) * C + i];
      const ux = b.x - a.x, uy = b.y - a.y, uz = b.z - a.z, vx = d.x - a.x, vy = d.y - a.y, vz = d.z - a.z;
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      const n = Math.hypot(nx, ny, nz) || 1; nx /= n; ny /= n; nz /= n;
      const luz = 0.62 + 0.38 * Math.abs(nx * L[0] + ny * L[1] + nz * L[2]);
      const base = Math.floor(i / 2) % 2 ? colores.b : colores.a;
      const col = `rgb(${(base[0] * luz) | 0},${(base[1] * luz) | 0},${(base[2] * luz) | 0})`;
      ctx.fillStyle = col; ctx.strokeStyle = col;
      ctx.beginPath();
      ctx.moveTo(a.x + a.z * 0.12, a.y - a.z * 0.05); ctx.lineTo(b.x + b.z * 0.12, b.y - b.z * 0.05);
      ctx.lineTo(c.x + c.z * 0.12, c.y - c.z * 0.05); ctx.lineTo(d.x + d.z * 0.12, d.y - d.z * 0.05);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    // el dobladillo de abajo
    ctx.lineWidth = 2; ctx.strokeStyle = `rgb(${colores.tinta.join(',')})`; ctx.beginPath();
    for (let i = 0; i < C; i++) { const p = pts[(R - 1) * C + i]; i ? ctx.lineTo(p.x + p.z * 0.12, p.y - p.z * 0.05) : ctx.moveTo(p.x + p.z * 0.12, p.y - p.z * 0.05); }
    ctx.stroke();
  }
  montarLona();
  html.classList.add('lona-viva');
  new ResizeObserver(() => { montarLona(); if (!motion) { for (let k = 0; k < 240; k++) paso(1 / 60, k / 60); pintarLona(); } }).observe(lona);
  html.addEventListener('paleta', () => { leerColores(); if (!motion) pintarLona(); });
  const portada = $('#portada');
  let ult = null;
  portada.addEventListener('pointermove', e => {
    const r = lona.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (ult) { viento.vx = clamp(x - ult.x, -40, 40); viento.vy = clamp(y - ult.y, -40, 40); }
    ult = { x, y }; viento.x = x; viento.y = y; viento.activo = 1;
  });
  portada.addEventListener('pointerleave', () => { ult = null; });
  const etiquetaTension = () => { tensionTxt.textContent = tension < 0.33 ? 'floja' : tension < 0.8 ? 'a medias' : 'tensa'; };
  if (motion) {
    let vivo = true, t = 0, prev = 0;
    new IntersectionObserver(([e]) => { vivo = e.isIntersecting; }).observe(lona);
    const bucle = now => {
      requestAnimationFrame(bucle);
      if (!vivo || document.hidden || !cortinaSaliendo) { prev = 0; return; }
      const dt = prev ? Math.min(0.033, (now - prev) / 1000) : 1 / 60; prev = now; t += dt;
      tension = lerp(tension, clamp(scrollY / (innerHeight * 0.55), 0, 1), 0.08);
      viento.activo *= 0.94; viento.vx *= 0.9; viento.vy *= 0.9;
      paso(1 / 60, t);
      pintarLona();
      etiquetaTension();
    };
    requestAnimationFrame(bucle);
  } else { for (let k = 0; k < 240; k++) paso(1 / 60, k / 60); pintarLona(); etiquetaTension(); }

  /* ————————————————— Cabecera y menú ————————————————— */
  const menuBoton = $('#menu-boton'), menu = $('#menu');
  function cerrarMenu() {
    if (menuBoton.getAttribute('aria-expanded') !== 'true') return;
    menuBoton.setAttribute('aria-expanded', 'false'); menu.classList.remove('es-abierto'); $('.menu-boton-texto').textContent = 'Menú';
    if (lenis) lenis.start();
  }
  menuBoton.addEventListener('click', () => {
    if (menuBoton.getAttribute('aria-expanded') === 'true') { cerrarMenu(); return; }
    menuBoton.setAttribute('aria-expanded', 'true'); menu.classList.add('es-abierto'); $('.menu-boton-texto').textContent = 'Cerrar';
    if (lenis) lenis.stop();
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') cerrarMenu(); });
  const enlaces = $$('.menu a');
  const ioM = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) enlaces.forEach(a => a.classList.toggle('es-activo', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
  ['montar', 'parcelas', 'tarifas', 'noche', 'rutas', 'reserva'].forEach(id => ioM.observe($('#' + id)));

  /* ————————————————— Cinta ligada al scroll ————————————————— */
  const cinta = $('#cinta'), grupo = $('.cinta-grupo', cinta);
  for (let i = 0; i < 2; i++) { const c = grupo.cloneNode(true); c.setAttribute('aria-hidden', 'true'); cinta.appendChild(c); }
  if (motion) {
    let x = 0, v = 0, vis = true;
    new IntersectionObserver(([e]) => { vis = e.isIntersecting; }).observe(cinta);
    const f = () => { requestAnimationFrame(f); if (!vis) return; v = lerp(v, 0.5 + Math.min(12, Math.abs(velocidad()) * 0.45), 0.08); x -= v; const w = grupo.offsetWidth; if (-x >= w) x += w; cinta.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`; };
    requestAnimationFrame(f);
  }

  /* ————————————————— Montar la tienda (anclada, scrub) ————————————————— */
  const T = id => $('#' + id);
  const pasos = $$('.paso');
  const lonaT = T('t-lona'), tensionDato = T('tension-dato'), barraM = T('montar-barra');
  const varillas = [T('t-varilla-1'), T('t-varilla-2')], vientosT = [T('t-viento-1'), T('t-viento-2')];
  let pasoAct = -1;
  function lonaPath(arrugas) {
    // de arrugada (bolsas entre varillas) a tensa (la curva limpia de las varillas)
    let d = 'M240 438 ';
    for (let k = 1; k <= 24; k++) {
      const u = k / 24;
      const x = lerp(240, 620, u);
      const yArco = 438 - Math.sin(Math.PI * u) * 198 + (u < 0.5 ? 0 : 0);
      const bolsa = arrugas * (12 * Math.sin(u * Math.PI * 7) + 10 * Math.sin(Math.PI * u));
      d += `L${x.toFixed(1)} ${(yArco + bolsa).toFixed(1)} `;
    }
    return d + 'Z';
  }
  function dibujarMontar(p) {
    const s1 = smooth(0, 0.18, p), s2 = smooth(0.2, 0.36, p), s3 = smooth(0.4, 0.58, p), s4 = smooth(0.6, 0.76, p), s5 = smooth(0.8, 0.96, p);
    const paso0 = 1 - smooth(0.18, 0.26, p);
    T('t-sol').style.opacity = (0.3 + 0.7 * paso0).toFixed(2);
    T('t-flecha').style.opacity = paso0.toFixed(2); T('t-r1').style.opacity = paso0.toFixed(2);
    T('t-huella').style.opacity = s2.toFixed(2);
    T('t-huella').setAttribute('transform', `translate(430 438) scale(${(0.3 + 0.7 * s2).toFixed(3)} 1) translate(-430 -438)`);
    varillas.forEach(v => { v.style.strokeDashoffset = (1 - s3).toFixed(3); });
    lonaT.style.opacity = s3.toFixed(2); T('t-puerta').style.opacity = s3.toFixed(2);
    T('t-piquetas').style.opacity = s4.toFixed(2);
    T('t-piquetas').setAttribute('transform', `translate(0 ${(-14 * (1 - s4)).toFixed(1)})`);
    T('t-r4').style.opacity = s4.toFixed(2);
    vientosT.forEach(v => { v.style.strokeDashoffset = (1 - s5).toFixed(3); });
    T('t-piquetas-v').style.opacity = s5.toFixed(2);
    const tens = clamp(0.35 * s4 + 0.65 * s5, 0, 1);
    lonaT.setAttribute('d', lonaPath(1 - tens));
    tensionDato.textContent = Math.round(tens * 100) + ' %';
    barraM.style.setProperty('--p', p.toFixed(3));
    const i = Math.min(4, Math.floor(p * 5));
    if (i !== pasoAct) { pasoAct = i; pasos.forEach((li, k) => { li.classList.toggle('es-activo', k === i); $('.paso-boton', li).setAttribute('aria-current', k === i ? 'step' : 'false'); }); }
  }
  if (gsapReady && motion) {
    html.classList.add('montar-vivo');
    const st = ScrollTrigger.create({ trigger: '#montar', start: 'top top', end: () => '+=' + Math.round(innerHeight * 3), pin: '.montar-pin', scrub: 0.6, onUpdate: s => dibujarMontar(s.progress) });
    pasos.forEach((li, k) => $('.paso-boton', li).addEventListener('click', () => irA(st.start + (k + 0.6) / 5 * (st.end - st.start))));
    dibujarMontar(0);
  } else {
    pasos.forEach((li, k) => $('.paso-boton', li).addEventListener('click', () => dibujarMontar((k + 0.9) / 5)));
    dibujarMontar(1);
  }

  /* ————————————————— Plano de parcelas ————————————————— */
  const NS = 'http://www.w3.org/2000/svg';
  const duchas = [[478, 64], [828, 324]];
  const parcelas = [];
  const zona = (n, cols, filas, x0, y0, w, h, gap, extra) => {
    for (let f = 0; f < filas; f++) for (let c = 0; c < cols; c++) parcelas.push({ x: x0 + c * (w + gap), y: y0 + f * (h + gap), w, h, ...extra(c, f) });
  };
  zona('prado', 4, 3, 170, 110, 58, 40, 8, (c, f) => ({ zona: 'Prado', tipo: 'tienda', sombra: c === 3 ? 'de 18:00 a 21:00' : 'casi ninguna', s: c === 3, rio: false, luz: f === 2, calma: f < 2, m2: 80, nota: 'Sol de mañana y vistas al valle. Para quien madruga.' }));
  zona('carballeira', 4, 3, 580, 110, 54, 38, 8, (c, f) => ({ zona: 'Carballeira', tipo: 'tienda', sombra: 'de 13:00 a 21:00', s: true, rio: false, luz: false, calma: true, m2: c === 0 && f === 1 ? 90 : 75, nota: 'Bajo los robles: suelo de hoja, fresca en agosto. Sin coches.' }));
  zona('caravanas', 4, 1, 180, 300, 70, 46, 10, () => ({ zona: 'Caravanas', tipo: 'caravana', sombra: 'de 17:00 a 21:00', s: true, rio: false, luz: true, calma: false, m2: 110, nota: 'Con toma de agua, enchufe y acceso en coche. Llana.' }));
  zona('cabanas', 4, 1, 540, 300, 50, 40, 12, () => ({ zona: 'Cabañas', tipo: 'cabana', sombra: 'porche cubierto', s: true, rio: false, luz: true, calma: true, m2: 24, nota: 'Madera, dos literas y una cama, porche y luz. Hasta cuatro personas.' }));
  zona('ribeira', 10, 1, 40, 410, 62, 40, 9, c => ({ zona: 'Ribeira', tipo: 'tienda', sombra: c % 3 === 0 ? 'de 15:00 a 21:00' : 'de 19:00 a 21:00', s: c % 3 === 0, rio: true, luz: c < 2, calma: c > 3, m2: 70, nota: 'Se duerme con el río. Ojo: algo de relente por la mañana.' }));
  const gp = $('#p-parcelas');
  parcelas.forEach((p, i) => {
    p.n = i + 1;
    const dist = Math.min(...duchas.map(([dx, dy]) => Math.hypot(p.x + p.w / 2 - dx, p.y + p.h / 2 - dy))) * 0.5;
    p.duchas = Math.round(dist / 5) * 5;
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', `parcela t-${p.tipo}`);
    g.setAttribute('role', 'button'); g.setAttribute('tabindex', i === 0 ? '0' : '-1');
    g.setAttribute('aria-label', `Parcela ${p.n}, ${p.zona}, ${p.tipo === 'cabana' ? 'cabaña' : p.tipo}`);
    g.innerHTML = `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="3"/><text x="${p.x + p.w / 2}" y="${p.y + p.h / 2 + 4}" text-anchor="middle">${p.n}</text>`;
    g.addEventListener('click', () => elegir(i, false));
    g.addEventListener('keydown', e => {
      const mover = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (mover) { e.preventDefault(); const k = (i + mover + parcelas.length) % parcelas.length; enfocar(k); }
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); elegir(i, false); }
    });
    p.g = g; gp.appendChild(g);
  });
  const arboles = $('#p-arboles');
  [[600, 100], [660, 160], [730, 105], [800, 170], [850, 120], [620, 250], [760, 250], [70, 470], [210, 480], [380, 470], [560, 478], [720, 470]].forEach(([x, y], k) => {
    const c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 22 + (k % 3) * 6); arboles.appendChild(c);
  });
  function enfocar(k) { parcelas.forEach((p, j) => p.g.setAttribute('tabindex', j === k ? '0' : '-1')); parcelas[k].g.focus(); }
  function elegir(i) {
    const p = parcelas[i];
    parcelas.forEach((q, j) => { q.g.classList.toggle('es-elegida', j === i); q.g.setAttribute('aria-pressed', String(j === i)); });
    $('#ficha-num').textContent = `Parcela ${p.n} · ${p.zona}`;
    $('#ficha-titulo').textContent = p.tipo === 'cabana' ? 'Cabaña de madera' : p.tipo === 'caravana' ? 'Parcela de caravana' : p.rio ? 'Junto al río' : p.zona === 'Carballeira' ? 'Bajo los robles' : 'En el prado';
    $('#ficha-datos').innerHTML = `<div><dt>Superficie</dt><dd>${p.m2} m²</dd></div><div><dt>Sombra</dt><dd>${p.sombra}</dd></div><div><dt>A las duchas</dt><dd>${p.duchas} m</dd></div><div><dt>Enchufe</dt><dd>${p.luz ? 'sí, 6 A' : 'no'}</dd></div>`;
    $('#ficha-nota').textContent = p.nota;
  }
  elegir(16);
  const filtros = $$('.filtro');
  const aplicar = () => {
    const act = filtros.filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.dataset.filtro);
    let n = 0;
    parcelas.forEach(p => {
      const ok = act.every(f => (f === 'sombra' ? p.s : f === 'rio' ? p.rio : f === 'luz' ? p.luz : p.calma));
      p.g.classList.toggle('es-apagada', !ok); if (ok) n++;
    });
    $('#filtros-cuenta').textContent = n === 1 ? '1 parcela' : `${n} parcelas`;
  };
  filtros.forEach(b => b.addEventListener('click', () => { b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); aplicar(); }));
  aplicar();

  /* ————————————————— Tarifas y calculadora ————————————————— */
  let temp = 2;
  const filas = $$('#tabla-precios tr');
  const precio = (k) => filas[k].dataset.p.split(',').map(Number)[temp];
  const calculo = $('#calculo');
  function tarifas() {
    $$('.temporada').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.temp === temp)));
    filas.forEach(tr => {
      const v = tr.dataset.p.split(',').map(Number)[temp];
      const td = $('td', tr); const nuevo = v ? fmt(v, 2) + ' €' : 'gratis';
      if (td.textContent !== nuevo) { td.textContent = nuevo; td.classList.remove('es-cambia'); void td.offsetWidth; td.classList.add('es-cambia'); }
    });
    calcular();
  }
  function calcular() {
    const f = new FormData(calculo);
    const noches = clamp(+f.get('noches') || 1, 1, 30), ad = clamp(+f.get('adultos') || 0, 0, 8), me = clamp(+f.get('menores') || 0, 0, 8), tipo = f.get('tipo'), luz = f.get('luz') === 'on';
    let noche = tipo === 'cabana' ? precio(6) : ad * precio(0) + me * precio(1) + (tipo === 'caravana' ? precio(3) : precio(2)) + (luz ? precio(4) : 0);
    let cobradas = noches;
    if (temp === 0 && noches >= 7) cobradas -= Math.floor(noches / 7);
    const total = noche * cobradas;
    $('strong', $('#calculo-total')).textContent = fmt(total, 2) + ' €';
    $('#calculo-nota').textContent = temp === 0 && noches >= 7 ? `En temporada baja, una de cada siete noches no se cobra: pagas ${cobradas} de ${noches}.` : tipo === 'cabana' ? 'La cabaña lleva la luz incluida y admite hasta cuatro personas.' : 'Siete noches o más en temporada baja: la séptima no se cobra.';
  }
  $$('.temporada').forEach(b => b.addEventListener('click', () => { temp = +b.dataset.temp; tarifas(); }));
  calculo.addEventListener('input', calcular); calculo.addEventListener('change', calcular);
  calculo.addEventListener('submit', e => e.preventDefault());
  tarifas();
  // comparativa de la sobria: sale de los data-p de la tabla
  const comp = $('#comparativa');
  const noche2 = k => { const p = i => filas[i].dataset.p.split(',').map(Number)[k]; return 2 * p(0) + p(2); };
  const vals = [0, 1, 2].map(noche2), max = Math.max(...vals);
  comp.innerHTML = ['Baja', 'Media', 'Alta'].map((n, k) => `<li><span>${n}</span><span class="barra" role="img" aria-label="${fmt(vals[k], 2)} euros"><i style="--v:${(vals[k] / max).toFixed(3)}"></i></span><b>${fmt(vals[k], 2)} €</b></li>`).join('');

  /* ————————————————— De noche: cielo y hora de silencio ————————————————— */
  const cielo = $('#cielo');
  const pintarCielo = () => {
    const r = cielo.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    cielo.width = Math.round(r.width * dpr); cielo.height = Math.round(r.height * dpr);
    const c = cielo.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    let s = 7; const az = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    for (let k = 0; k < Math.round(r.width * r.height / 2600); k++) {
      const x = az() * r.width, y = az() * r.height * 0.9, m = az();
      c.fillStyle = `rgba(241,236,226,${(0.25 + m * 0.6).toFixed(2)})`;
      c.beginPath(); c.arc(x, y, m > 0.97 ? 1.6 : 0.7 + m * 0.5, 0, 6.283); c.fill();
    }
    // el perfil del monte, recortado contra el cielo
    c.fillStyle = '#101812'; c.beginPath(); c.moveTo(0, r.height);
    for (let x = 0; x <= r.width; x += 20) c.lineTo(x, r.height * 0.82 - 60 * Math.sin(x / r.width * 3.2 + 1) - 30 * Math.sin(x / r.width * 9));
    c.lineTo(r.width, r.height); c.fill();
  };
  new ResizeObserver(pintarCielo).observe(cielo);
  const estado = $('#noche-estado'), estadoTxt = $('#noche-texto');
  const silencio = () => {
    const d = new Date(), h = d.getHours() + d.getMinutes() / 60;
    const es = h >= 23 || h < 8;
    estado.classList.toggle('es-silencio', es);
    if (es) estadoTxt.textContent = 'Ahora mismo: hora de silencio, hasta las 8:00.';
    else { const falta = 23 - h, hh = Math.floor(falta), mm = Math.round((falta - hh) * 60); estadoTxt.textContent = `Ahora mismo: horario normal. El silencio empieza en ${hh} h ${String(mm).padStart(2, '0')} min.`; }
  };
  silencio(); setInterval(silencio, 30000);

  /* ————————————————— Contadores ————————————————— */
  const ioC = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; ioC.unobserve(e.target);
    const el = e.target, fin = +el.dataset.contador, dec = +(el.dataset.dec || 0);
    if (!motion) { el.textContent = fmt(fin, dec); return; }
    const t0 = performance.now();
    const f = now => { const p = clamp((now - t0) / 1300, 0, 1); el.textContent = fmt(fin * (1 - Math.pow(1 - p, 4)), dec); if (p < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }), { threshold: 0.6 });
  $$('[data-contador]').forEach(el => ioC.observe(el));

  /* ————————————————— Horario, mapa y formulario ————————————————— */
  const hoyDia = new Date().getDay();
  $$('#horario tr').forEach(tr => tr.classList.toggle('es-hoy', tr.dataset.dias.split(',').map(Number).includes(hoyDia)));
  $('#mapa-boton').addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Navia de Suarna, Lugo') + '&output=embed';
    f.title = 'Mapa de Navia de Suarna'; f.loading = 'lazy';
    $('#mapa').replaceChildren(f);
  });
  const form = $('#formulario');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const est = $('#reserva-estado');
    const falta = $$('[required]', form).find(i => !i.value.trim());
    if (falta) { est.textContent = 'Falta «' + falta.parentElement.firstChild.textContent.trim() + '».'; falta.focus(); return; }
    est.textContent = `Gracias, ${form.nombre.value.trim()}. Es una demostración: no se ha enviado nada. En la web real te confirmaríamos la parcela hoy mismo.`;
    form.reset();
  });

  /* ————————————————— Aviso de cookies ————————————————— */
  const cookies = $('#cookies');
  let mostrarMandos = () => {};
  if (store.get('piqueta-cookies') !== 'ok') cookies.hidden = false;
  $('#cookies-ok').addEventListener('click', () => { store.set('piqueta-cookies', 'ok'); cookies.hidden = true; mostrarMandos(); });

  /* MANDOS:INICIO — mandos de demostración. NO VIAJAN AL SITIO DE UN CLIENTE (ver README). */
  const mandos = $('#mandos');
  mostrarMandos = () => { if (revision) mandos.hidden = false; };
  if (store.get('piqueta-cookies') === 'ok') mostrarMandos();
  const marcar = () => {
    $$('[data-maqueta]', mandos).forEach(b => b.setAttribute('aria-pressed', String((b.dataset.maqueta === 'sobria') === sobria())));
    const pal = ['xesta', 'lousa'].find(p => html.classList.contains('paleta-' + p)) || 'cuerda';
    $$('[data-paleta]', mandos).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.paleta === pal)));
  };
  $$('[data-maqueta]', mandos).forEach(b => b.addEventListener('click', () => {
    html.classList.toggle('maqueta-sobria', b.dataset.maqueta === 'sobria');
    store.set('piqueta-maqueta', b.dataset.maqueta); marcar();
    if (gsapReady) ScrollTrigger.refresh();
  }));
  $$('[data-paleta]', mandos).forEach(b => b.addEventListener('click', () => {
    html.classList.remove('paleta-xesta', 'paleta-lousa');
    if (b.dataset.paleta !== 'cuerda') html.classList.add('paleta-' + b.dataset.paleta);
    store.set('piqueta-paleta', b.dataset.paleta); marcar(); html.dispatchEvent(new Event('paleta'));
  }));
  marcar();
  /* MANDOS:FIN */

  /* ————————————————— Cursor y botones magnéticos (solo ratón) ————————————————— */
  const cursor = $('.cursor'), aro = $('.cursor-aro'), punto = $('.cursor-punto'), texto = $('.cursor-texto');
  let cx = -100, cy = -100, ax = -100, ay = -100, vivoC = false;
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    if (!vivoC) { vivoC = true; html.classList.add('cursor-propio'); ax = e.clientX; ay = e.clientY; requestAnimationFrame(sigue); }
    cx = e.clientX; cy = e.clientY; cursor.classList.remove('es-oculto');
    const t = e.target, et = t.closest && t.closest('[data-cursor]'), en = t.closest && t.closest('a, button, label, summary, select, input, .parcela');
    cursor.classList.toggle('es-texto', !!et); cursor.classList.toggle('es-enlace', !!en && !et);
    cursor.classList.toggle('es-viento', !!(t.closest && t.closest('.portada')) && !en);
    texto.textContent = et ? et.dataset.cursor : '';
  }, { passive: true });
  document.addEventListener('pointerleave', () => cursor.classList.add('es-oculto'));
  function sigue() { requestAnimationFrame(sigue); const k = motion ? 0.2 : 1; ax = lerp(ax, cx, k); ay = lerp(ay, cy, k); punto.style.transform = `translate3d(${cx}px,${cy}px,0)`; aro.style.transform = `translate3d(${ax.toFixed(1)}px,${ay.toFixed(1)}px,0)`; }
  if (finePointer && motion) $$('.iman').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.setProperty('--x', ((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1) + 'px'); b.style.setProperty('--y', ((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1) + 'px'); });
    b.addEventListener('pointerleave', () => { b.style.setProperty('--x', '0px'); b.style.setProperty('--y', '0px'); });
  });

  const listo = () => { if (gsapReady) ScrollTrigger.refresh(); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(listo);
  addEventListener('load', listo);
})();
