/* Estalo · Chocolatería e bombonería — plantilla «Templado»
   Sitio de demostración: negocio ficticio.

   gsapReady (GSAP y ScrollTrigger cargados) y motion (sin movimiento
   reducido) van separados: sin movimiento la curva, los bombones, la
   tableta y el horario siguen funcionando; solo se quita el movimiento. */

(function () {
  'use strict';

  var tareas = window.__estaloLongtasks = [];
  try {
    new PerformanceObserver(function (l) { l.getEntries().forEach(function (e) { tareas.push({ inicio: Math.round(e.startTime), duracion: Math.round(e.duration) }); }); }).observe({ type: 'longtask', buffered: true });
  } catch (e) {}

  var raiz = document.documentElement;
  var gsapReady = !!(window.gsap && window.ScrollTrigger);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var motion = !reduce.matches;
  var punteroFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  if (gsapReady) { raiz.classList.add('has-motion'); gsap.registerPlugin(ScrollTrigger); }
  document.fonts && document.fonts.ready.then(function () { window.__estaloFuentes = Math.round(performance.now()); });

  // ---------- Lenis ----------
  var lenis = null;
  if (motion && window.Lenis) {
    lenis = new Lenis({ lerp: 0.12 });
    if (gsapReady) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }
    else (function b(t) { lenis.raf(t); requestAnimationFrame(b); })(performance.now());
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href'); if (id.length < 2) return;
      var el = document.querySelector(id); if (!el) return;
      e.preventDefault(); cerrarMenu();
      if (lenis) lenis.scrollTo(el, { duration: 1.3 }); else el.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' });
      if (id !== '#portada') { el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); }
    });
  });

  // ---------- Char-reveal palabra a palabra ----------
  function partir(el) {
    var entero = document.createElement('span'); entero.className = 'visualmente-oculto';
    entero.textContent = el.textContent.replace(/\s+/g, ' ').trim();
    var i = 0;
    (function caminar(nodo) {
      Array.prototype.slice.call(nodo.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
            var p = document.createElement('span'); p.className = 'palabra'; p.setAttribute('aria-hidden', 'true');
            var d = document.createElement('span'); d.className = 'palabra-in'; d.style.setProperty('--i', i++); d.textContent = t;
            p.appendChild(d); frag.appendChild(p);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) caminar(n);
      });
    })(el);
    el.insertBefore(entero, el.firstChild);
  }
  var titulares = $$('[data-revelar]'); titulares.forEach(partir);
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('es-revelado'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -12% 0px' });
  titulares.forEach(function (t) { if (!t.classList.contains('portada-titulo')) io.observe(t); });
  function revelarPortada() { $('.portada-titulo').classList.add('es-revelado'); }

  // ---------- Cortina «Clac» (retirada garantizada) ----------
  var cortina = $('#cortina'), fuera = false;
  function quitarCortina() { if (fuera) return; fuera = true; cortina.hidden = true; revelarPortada(); }
  setTimeout(quitarCortina, 5000);
  if (!motion) quitarCortina();
  else if (!gsapReady) { setTimeout(function () { cortina.classList.add('es-saliendo'); revelarPortada(); }, 350); setTimeout(quitarCortina, 1000); }
  else {
    gsap.timeline({ defaults: { ease: 'expo.inOut' }, onComplete: quitarCortina })
      .fromTo('.cortina-marca', { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'expo.out', immediateRender: false })
      .to('.cortina-marca', { x: 6, duration: 0.05, repeat: 3, yoyo: true, ease: 'none' }, '+=0.15') // el clac
      .to('.cortina-marca', { autoAlpha: 0, scale: 1.1, duration: 0.35, ease: 'expo.in' })
      .to('.cortina-rejilla', { autoAlpha: 0, duration: 0.4 }, '<')
      .to('.cortina-mitad--a', { yPercent: -105, xPercent: -6, rotate: -7, duration: 1.15, transformOrigin: '50% 0%' }, '<0.1')
      .to('.cortina-mitad--b', { yPercent: 105, xPercent: 6, rotate: 6, duration: 1.15, transformOrigin: '50% 100%' }, '<')
      .call(revelarPortada, null, '<0.45');
  }

  // ---------- Cabecera y menú ----------
  var cab = $('#cabecera');
  window.addEventListener('scroll', function () { cab.classList.toggle('es-con-borde', window.scrollY > 10); }, { passive: true });
  var menuBoton = $('#menu-boton'), menu = $('#menu');
  function cerrarMenu() { if (!menu.classList.contains('es-abierto')) return; menu.classList.remove('es-abierto'); menuBoton.setAttribute('aria-expanded', 'false'); if (lenis) lenis.start(); }
  menuBoton.addEventListener('click', function () {
    var abrir = menuBoton.getAttribute('aria-expanded') !== 'true';
    menuBoton.setAttribute('aria-expanded', String(abrir)); menu.classList.toggle('es-abierto', abrir);
    if (lenis) { abrir ? lenis.stop() : lenis.start(); }
    if (abrir) setTimeout(function () { $('a', menu).focus(); }, 50);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('es-abierto')) { cerrarMenu(); menuBoton.focus(); } });

  // ---------- Portada: la tableta en canvas ----------
  // Cada onza se dibuja UNA vez en un sprite; por fotograma solo hay drawImage,
  // el brillo es otro sprite compuesto con source-atop. Sin filter ni shadowBlur.
  var tableta = (function () {
    var fig = $('#tableta'), canvas = $('#tableta-canvas'), ctx = canvas.getContext && canvas.getContext('2d');
    var cuenta = $('#onzas-cuenta'), bPartir = $('#partir'), bOtra = $('#otra');
    if (!ctx) return null;
    var COLS = 3, FILAS = 5, W = 0, H = 0, dpr = 1, onza = null, brillo = null;
    var onzas = [], piezas = [], grietas = [];
    var luz = { x: 0.3, y: 0.25, ox: 0.3, oy: 0.25 }, ultimoPuntero = -1e4, corriendo = false, anterior = 0;
    function reiniciar() { onzas = []; for (var f = 0; f < FILAS; f++) for (var c = 0; c < COLS; c++) onzas.push({ c: c, f: f, viva: true }); actualizarCuenta(); }
    function geo(o) {
      var m = W * 0.04, g = W * 0.035, cw = (W - 2 * m - (COLS - 1) * g) / COLS, ch = (H - 2 * m - (FILAS - 1) * g) / FILAS;
      return { x: m + o.c * (cw + g), y: m + o.f * (ch + g), w: cw, h: ch };
    }
    function hacerSprites() {
      var g = geo({ c: 0, f: 0 });
      onza = document.createElement('canvas'); onza.width = Math.ceil(g.w * dpr); onza.height = Math.ceil(g.h * dpr);
      var o = onza.getContext('2d'); o.scale(dpr, dpr);
      var b = Math.min(g.w, g.h) * 0.14;
      o.fillStyle = '#3B2117'; o.fillRect(0, 0, g.w, g.h);
      o.fillStyle = '#5A3523'; o.beginPath(); o.moveTo(0, 0); o.lineTo(g.w, 0); o.lineTo(g.w - b, b); o.lineTo(b, b); o.lineTo(b, g.h - b); o.lineTo(0, g.h); o.closePath(); o.fill();
      o.fillStyle = '#22120C'; o.beginPath(); o.moveTo(g.w, 0); o.lineTo(g.w, g.h); o.lineTo(0, g.h); o.lineTo(b, g.h - b); o.lineTo(g.w - b, g.h - b); o.lineTo(g.w - b, b); o.closePath(); o.fill();
      o.fillStyle = '#42261A'; o.fillRect(b, b, g.w - 2 * b, g.h - 2 * b);
      // la marca grabada: una grieta pequeña, como en el logo
      o.strokeStyle = 'rgba(255,255,255,.10)'; o.lineWidth = 2; o.beginPath();
      o.moveTo(g.w * 0.5, g.h * 0.32); o.lineTo(g.w * 0.46, g.h * 0.45); o.lineTo(g.w * 0.54, g.h * 0.55); o.lineTo(g.w * 0.48, g.h * 0.68); o.stroke();
      var r = Math.max(W, H) * 0.55;
      brillo = document.createElement('canvas'); brillo.width = brillo.height = Math.ceil(r * 2 * dpr);
      var s = brillo.getContext('2d'); s.scale(dpr, dpr);
      var gr = s.createRadialGradient(r, r, 0, r, r, r);
      gr.addColorStop(0, 'rgba(255,236,214,.42)'); gr.addColorStop(0.25, 'rgba(255,236,214,.16)'); gr.addColorStop(1, 'rgba(255,236,214,0)');
      s.fillStyle = gr; s.fillRect(0, 0, r * 2, r * 2);
    }
    function medir() {
      var r = canvas.getBoundingClientRect(); if (!r.width) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2); W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      hacerSprites(); pintar(performance.now());
    }
    function pintar(ahora) {
      var dt = Math.min(0.05, (ahora - anterior) / 1000 || 0); anterior = ahora;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      // inclinación con el scroll: la tableta se ladea al bajar
      var inc = motion ? clamp(window.scrollY / window.innerHeight, 0, 1) * 0.08 : 0;
      ctx.translate(W / 2, H / 2); ctx.rotate(-0.035 + inc); ctx.scale(0.94, 0.94); ctx.translate(-W / 2, -H / 2);
      ctx.fillStyle = '#2E1A12'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(0, 0, W, H, W * 0.03) : ctx.rect(0, 0, W, H); ctx.fill();
      onzas.forEach(function (o) { if (!o.viva) return; var g = geo(o); ctx.drawImage(onza, g.x, g.y, g.w, g.h); });
      // brillo: sigue a la luz (cursor) y solo cae sobre lo pintado
      luz.ox = lerp(luz.ox, luz.x, 1 - Math.pow(0.001, dt)); luz.oy = lerp(luz.oy, luz.y, 1 - Math.pow(0.001, dt));
      var r = Math.max(W, H) * 0.55;
      ctx.globalCompositeOperation = 'source-atop';
      ctx.drawImage(brillo, luz.ox * W - r, luz.oy * H - r, r * 2, r * 2);
      ctx.globalCompositeOperation = 'source-over';
      // grietas recién abiertas
      grietas = grietas.filter(function (g) { g.t -= dt; return g.t > 0; });
      grietas.forEach(function (g) {
        ctx.strokeStyle = 'rgba(243,231,214,' + (g.t / 0.5).toFixed(2) + ')'; ctx.lineWidth = 1.5; ctx.beginPath();
        g.p.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.stroke();
      });
      // onzas que caen
      piezas = piezas.filter(function (p) { return p.y < H + p.h * 2; });
      piezas.forEach(function (p) {
        p.vy += 2600 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.a += p.va * dt;
        ctx.save(); ctx.translate(p.x + p.w / 2, p.y + p.h / 2); ctx.rotate(p.a); ctx.drawImage(onza, -p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      });
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      return piezas.length || grietas.length || Math.abs(luz.ox - luz.x) + Math.abs(luz.oy - luz.y) > 0.002;
    }
    function bucle(t) { if (pintar(t)) requestAnimationFrame(bucle); else corriendo = false; }
    function despertar() { if (corriendo) return; corriendo = true; anterior = performance.now(); requestAnimationFrame(bucle); }
    function actualizarCuenta() {
      var n = onzas.filter(function (o) { return o.viva; }).length;
      cuenta.textContent = n + (n === 1 ? ' onza' : ' onzas');
      bOtra.hidden = n === 15; bPartir.hidden = n === 0;
    }
    function partirOnza(o) {
      if (!o || !o.viva) return;
      o.viva = false; var g = geo(o);
      if (motion) {
        piezas.push({ x: g.x, y: g.y, w: g.w, h: g.h, vx: (o.c - 1) * 160 + (Math.random() - 0.5) * 120, vy: -520 - Math.random() * 200, a: 0, va: (Math.random() - 0.5) * 9 });
        var pts = [], n = 7; for (var i = 0; i <= n; i++) pts.push([g.x - 4 + (g.w + 8) * i / n, g.y + g.h + 3 + (i % 2 ? 4 : -3)]);
        grietas.push({ p: pts, t: 0.5 });
      }
      actualizarCuenta(); despertar(); if (!motion) pintar(performance.now());
    }
    function onzaEn(e) {
      var r = canvas.getBoundingClientRect(), x = (e.clientX - r.left), y = (e.clientY - r.top);
      return onzas.filter(function (o) { if (!o.viva) return false; var g = geo(o); return x >= g.x && x <= g.x + g.w && y >= g.y && y <= g.y + g.h; })[0];
    }
    canvas.addEventListener('pointermove', function (e) {
      var r = canvas.getBoundingClientRect();
      luz.x = (e.clientX - r.left) / r.width; luz.y = (e.clientY - r.top) / r.height; ultimoPuntero = performance.now();
      if (!motion) { luz.ox = luz.x; luz.oy = luz.y; pintar(performance.now()); } else despertar();
    });
    canvas.addEventListener('pointerleave', function () { luz.x = 0.3; luz.y = 0.25; if (motion) despertar(); });
    canvas.addEventListener('click', function (e) { partirOnza(onzaEn(e)); });
    bPartir.addEventListener('click', function () { var vivas = onzas.filter(function (o) { return o.viva; }); partirOnza(vivas[vivas.length - 1]); });
    bOtra.addEventListener('click', function () { reiniciar(); pintar(performance.now()); bPartir.focus(); });
    var pendiente = 0;
    window.addEventListener('scroll', function () { if (!motion || pendiente || corriendo || window.scrollY > window.innerHeight * 1.2) return; pendiente = requestAnimationFrame(function () { pendiente = 0; pintar(performance.now()); }); }, { passive: true });
    new ResizeObserver(medir).observe(fig);
    reiniciar(); medir(); fig.classList.add('es-canvas');
    return { partir: partirOnza };
  })();

  // Ancho variable del titular: el cursor «estira» las palabras anchas.
  if (motion && punteroFino) {
    var anchas = $$('.portada-titulo .t-ancho'), pend = 0, mx = 0, my = 0;
    window.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (pend) return;
      pend = requestAnimationFrame(function () {
        pend = 0;
        anchas.forEach(function (el) { var r = el.getBoundingClientRect(); var d = Math.hypot(r.left + r.width / 2 - mx, r.top + r.height / 2 - my); el.style.setProperty('--wd', Math.round(125 - 40 * Math.exp(-(d * d) / 60000))); });
      });
    }, { passive: true });
  }

  // ---------- La curva del brillo (anclada) ----------
  var linea = $('#curva-linea'), punto = $('#curva-punto'), largo = linea.getTotalLength();
  var cuT = $('#cu-temp'), cuF = $('#cu-forma'), cuB = $('#cu-brillo'), flor = $('#muestra-flor'), brilloM = $('#muestra-brillo');
  var cpasos = $$('.cpaso'), progreso = $('.curva-progreso'), activoC = -1;
  function pintarCurva(p) {
    var pt = linea.getPointAtLength(clamp(p, 0, 1) * largo);
    punto.setAttribute('cx', pt.x.toFixed(1)); punto.setAttribute('cy', pt.y.toFixed(1));
    var t = (362 - pt.y) / 7;
    cuT.textContent = Math.round(t);
    var x = pt.x;
    cuF.textContent = x < 200 ? 'ninguno' : x < 368 ? 'IV y V' : x < 508 ? 'solo V' : 'V, fijados';
    var b = x < 424 ? 0 : x < 508 ? (x - 424) / 84 * 60 : 60 + (x - 508) / 112 * 32;
    cuB.textContent = Math.round(b);
    flor.style.setProperty('--flor', (x < 312 ? clamp((x - 172) / 140, 0, 1) : clamp(1 - (x - 368) / 120, 0, 1)).toFixed(2));
    brilloM.style.setProperty('--brillo', (b / 92).toFixed(2));
    if (progreso) progreso.style.setProperty('--p', p.toFixed(3));
    var act = x < 172 ? 0 : x < 368 ? 1 : x < 508 ? 2 : 3;
    if (act !== activoC) { activoC = act; cpasos.forEach(function (c, i) { c.classList.toggle('es-activo', i === act); c.classList.toggle('es-pasado', i < act); }); }
  }
  if (gsapReady && motion) {
    raiz.classList.add('cu-anclada');
    var tlC = gsap.timeline({
      scrollTrigger: { trigger: '#curva-pin', start: 'top top', end: function () { return '+=' + Math.round(window.innerHeight * 3); }, pin: true, scrub: 0.8, anticipatePin: 1 },
      onUpdate: function () { pintarCurva(tlC.progress()); }
    });
    // trazo con pathLength=1: autoRound:false o GSAP redondea 0,37 a 0 y el trazo salta
    tlC.fromTo(linea, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', duration: 1, autoRound: false, immediateRender: false });
    pintarCurva(0);
  } else {
    pintarCurva(1);
    var ioC = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) pintarCurva(+e.target.dataset.p); }); }, { rootMargin: '-45% 0px -45% 0px' });
    cpasos.forEach(function (c) { ioC.observe(c); });
  }

  // Transición «grieta» entre secciones
  if (gsapReady && motion) $$('.bombones, .cajas').forEach(function (sec) {
    sec.style.setProperty('--g', 1);
    ScrollTrigger.create({ trigger: sec, start: 'top bottom', end: 'top 40%', scrub: 0.5, onUpdate: function (st) { sec.style.setProperty('--g', (1 - st.progress).toFixed(3)); } });
  });

  // ---------- Bombones: el corte ----------
  var bombones = $$('.bombon');
  var corteDib = $('#corte-dib'), NS = 'http://www.w3.org/2000/svg';
  function dibujarCorte(b) {
    var cs = getComputedStyle(b), pintura = cs.getPropertyValue('--p1').trim();
    var capas = b.dataset.capas.split('|').map(function (c) { var x = c.split(':'); return { color: x[0], nombre: x[1] }; });
    var h = 'h' + Math.random().toString(36).slice(2, 7);
    var svg = '<defs><clipPath id="' + h + '"><path d="M34 128A86 80 0 0 1 206 128Z"/></clipPath></defs>';
    svg += '<path d="M20 132A100 94 0 0 1 220 132Z" fill="' + pintura + '"/>';
    svg += '<path d="M24 132A96 90 0 0 1 216 132Z" fill="#4A2A1C"/>';
    var alto = 80 / capas.length;
    svg += '<g clip-path="url(#' + h + ')">';
    capas.forEach(function (c, i) { svg += '<rect x="30" y="' + (128 - alto * (i + 1)).toFixed(1) + '" width="180" height="' + (alto + 0.5).toFixed(1) + '" fill="' + c.color + '"/>'; });
    svg += '</g><rect x="20" y="128" width="200" height="10" rx="2" fill="#4A2A1C"/>';
    svg += '<path d="M60 70c20-26 70-36 100-14" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="5" stroke-linecap="round"/>';
    corteDib.innerHTML = svg;
    $('#corte-nombre').textContent = b.dataset.nombre;
    $('#corte-desc').textContent = b.dataset.desc;
    $('#corte-cacao').textContent = b.dataset.cacao;
    $('#corte-al').textContent = b.dataset.al;
    var ul = $('#corte-capas'); ul.innerHTML = '';
    capas.slice().reverse().forEach(function (c) { var li = document.createElement('li'); var i = document.createElement('i'); i.style.background = c.color; li.appendChild(i); li.appendChild(document.createTextNode(c.nombre)); ul.appendChild(li); });
    if (motion && gsapReady) gsap.fromTo(corteDib, { scaleY: 0.6, autoAlpha: 0.2 }, { scaleY: 1, autoAlpha: 1, duration: 0.6, ease: 'expo.out', transformOrigin: '50% 100%' });
  }
  bombones.forEach(function (b) { b.addEventListener('click', function () { bombones.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); dibujarCorte(b); }); });
  dibujarCorte(bombones[0]);
  // tabla de cacao (versión sobria): los datos salen de los propios bombones
  (function () {
    var lista = $('#cacao-barras');
    bombones.map(function (b) { return { n: b.dataset.nombre, c: +b.dataset.cacao }; }).sort(function (a, b) { return b.c - a.c; }).forEach(function (d) {
      var li = document.createElement('li'); li.innerHTML = '<span></span><span class="barra" aria-hidden="true"></span><span class="num"></span>';
      li.children[0].textContent = d.n; li.children[1].style.setProperty('--r', (d.c / 100).toFixed(2)); li.children[2].textContent = d.c + ' %'; lista.appendChild(li);
    });
  })();

  // ---------- Cajas: huecos dibujados y precio por bombón ----------
  var colores = bombones.map(function (b) { return getComputedStyle(b).getPropertyValue('--p1').trim(); });
  $$('.pila-item').forEach(function (li, k) {
    var n = +li.dataset.n, lado = Math.ceil(Math.sqrt(n)), g = $('.caja-huecos', li), w = 200 / lado, hgt = 100 / Math.ceil(n / lado), r = Math.min(w, hgt) * 0.36, html = '';
    for (var i = 0; i < n; i++) { var cx = 10 + w * (i % lado) + w / 2, cy = 20 + hgt * Math.floor(i / lado) + hgt / 2; html += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + (r + 2).toFixed(1) + '" fill="#1A0F0B"/><circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="' + colores[(i + k * 3) % colores.length] + '"/>'; }
    g.innerHTML = html;
  });
  (function () {
    var ul = $('#por-bombon-barras'), filas = $$('.pila-item').map(function (li) { return { n: +li.dataset.n, e: +li.dataset.precio / +li.dataset.n }; });
    var max = Math.max.apply(null, filas.map(function (f) { return f.e; }));
    filas.forEach(function (f) { var li = document.createElement('li'); li.innerHTML = '<span></span><span class="barra" aria-hidden="true"></span><span class="num"></span>'; li.children[0].textContent = 'Caja de ' + f.n; li.children[1].style.setProperty('--r', (f.e / max).toFixed(3)); li.children[2].textContent = f.e.toFixed(2).replace('.', ',') + ' €'; ul.appendChild(li); });
  })();

  // Pila sticky: mismo alto (el de la más alta, medido) y estado de tapada.
  var pila = $('#pila'), items = $$('.pila-item');
  function medirPila() { pila.style.setProperty('--alto-caja', 'auto'); var a = 0; items.forEach(function (li, i) { li.style.setProperty('--n', i); a = Math.max(a, li.offsetHeight); }); pila.style.setProperty('--alto-caja', a + 'px'); }
  medirPila(); new ResizeObserver(medirPila).observe(pila.parentNode); document.fonts && document.fonts.ready.then(medirPila);
  var pp = 0;
  window.addEventListener('scroll', function () { if (pp) return; pp = requestAnimationFrame(function () { pp = 0; items.forEach(function (li, i) { var s = items[i + 1]; li.classList.toggle('es-tapada', !!s && s.getBoundingClientRect().top - li.getBoundingClientRect().top < li.offsetHeight * 0.5); }); }); }, { passive: true });

  // ---------- Cinta ligada al scroll ----------
  (function () {
    var pista = $('#cinta-pista'); pista.innerHTML += pista.innerHTML;
    if (!motion) return;
    var x = 0, ancho = 0, vel = 0, ultY = window.scrollY, vis = false, ant = 0;
    var m = function () { ancho = pista.scrollWidth / 2; }; m(); window.addEventListener('resize', m); document.fonts && document.fonts.ready.then(m);
    new IntersectionObserver(function (e) { vis = e[0].isIntersecting; if (vis) { ant = performance.now(); requestAnimationFrame(mover); } }).observe(pista);
    function mover(t) {
      if (!vis) return; var dt = Math.min(0.05, (t - ant) / 1000); ant = t;
      var dy = window.scrollY - ultY; ultY = window.scrollY; vel = lerp(vel, dy / Math.max(dt, 0.001), 0.08);
      x -= (45 + Math.abs(vel) * 0.35) * dt * (vel < -5 ? -1 : 1); if (x <= -ancho) x += ancho; if (x > 0) x -= ancho;
      pista.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)'; requestAnimationFrame(mover);
    }
  })();

  // ---------- Horario en vivo ----------
  var HORARIO = { 0: [[660, 870]], 1: [], 2: [[660, 840], [1020, 1230]], 3: [[660, 840], [1020, 1230]], 4: [[660, 840], [1020, 1230]], 5: [[660, 840], [1020, 1260]], 6: [[630, 870], [1020, 1260]] };
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var hm = function (m) { var h = Math.floor(m / 60), n = m % 60; return (h < 10 ? '0' : '') + h + ':' + (n < 10 ? '0' : '') + n; };
  function pintarHorario() {
    var a = new Date(), d = a.getDay(), m = a.getHours() * 60 + a.getMinutes();
    $$('.hor tr').forEach(function (tr) { tr.classList.toggle('es-hoy', +tr.dataset.dia === d); });
    var ab = (HORARIO[d] || []).filter(function (r) { return m >= r[0] && m < r[1]; })[0];
    $('#estado-ahora').classList.toggle('es-abierto', !!ab);
    var tx = $('#estado-texto');
    if (ab) { tx.textContent = 'Abierto ahora · cerramos a las ' + hm(ab[1]); return; }
    for (var i = 0; i < 8; i++) { var dd = (d + i) % 7, rs = HORARIO[dd]; for (var j = 0; j < rs.length; j++) { if (i === 0 && rs[j][0] <= m) continue; tx.textContent = 'Cerrado ahora · abrimos ' + (i === 0 ? 'hoy' : i === 1 ? 'mañana' : 'el ' + DIAS[dd]) + ' a las ' + hm(rs[j][0]); return; } }
  }
  pintarHorario(); setInterval(pintarHorario, 60000);

  // ---------- Mapa bajo clic ----------
  $('#mapa-boton').addEventListener('click', function () {
    var f = document.createElement('iframe'); f.src = 'https://www.google.com/maps?q=Ribadeo,+Lugo&output=embed'; f.title = 'Mapa de Ribadeo'; f.loading = 'lazy';
    $('#mapa').appendChild(f); this.hidden = true; $('.mapa-aviso').hidden = true; f.focus();
  });

  // ---------- Formulario de muestra ----------
  var form = $('#encargo'), fecha = $('#f-fecha'), min = new Date(); min.setDate(min.getDate() + 1);
  fecha.min = min.getFullYear() + '-' + String(min.getMonth() + 1).padStart(2, '0') + '-' + String(min.getDate()).padStart(2, '0');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var malos = ['#f-nombre', '#f-tel', '#f-fecha'].map(function (s) { return $(s); }).filter(function (c) { var ok = c.value.trim() !== '' && c.checkValidity() && !(c === fecha && c.value < c.min); c.classList.toggle('es-error', !ok); c.setAttribute('aria-invalid', String(!ok)); return !ok; });
    var st = $('#encargo-estado');
    if (malos.length) { st.classList.remove('es-ok'); st.textContent = 'Revisa los campos marcados. La fecha, con un día de aviso.'; malos[0].focus(); return; }
    st.classList.add('es-ok'); st.textContent = 'Encargo de muestra anotado: caja de ' + $('#f-caja').value + '. En esta demo no se envía nada.';
  });

  // ---------- Imán ----------
  if (punteroFino && motion) $$('.iman').forEach(function (b) {
    b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(); b.style.setProperty('--bx', ((e.clientX - r.left - r.width / 2) * 0.28).toFixed(1) + 'px'); b.style.setProperty('--by', ((e.clientY - r.top - r.height / 2) * 0.4).toFixed(1) + 'px'); });
    b.addEventListener('pointerleave', function () { b.style.setProperty('--bx', '0px'); b.style.setProperty('--by', '0px'); });
  });

  // ---------- Cursor propio (solo ratón) ----------
  (function () {
    var cur = $('#cursor'), punto = $('.cursor-punto', cur), aro = $('.cursor-aro', cur), rot = $('.cursor-rot', cur);
    var x = -100, y = -100, ax = -100, ay = -100, vivo = false;
    function b() { ax = lerp(ax, x, motion ? 0.2 : 1); ay = lerp(ay, y, motion ? 0.2 : 1); punto.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)'; aro.style.transform = 'translate3d(' + ax.toFixed(1) + 'px,' + ay.toFixed(1) + 'px,0)'; if (vivo) requestAnimationFrame(b); }
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') { raiz.classList.remove('cursor-propio'); vivo = false; return; }
      x = e.clientX; y = e.clientY;
      if (!vivo) { vivo = true; ax = x; ay = y; raiz.classList.add('cursor-propio'); requestAnimationFrame(b); }
      var t = e.target, enTab = !!t.closest('#tableta-canvas'), enMapa = !!t.closest('#mapa') && !t.closest('button'), enl = !!t.closest('a, button, select, input, label');
      cur.classList.toggle('es-partir', enTab); cur.classList.toggle('es-mapa', enMapa && !enl); cur.classList.toggle('es-enlace', enl && !enTab);
      cur.classList.toggle('es-claro', !!t.closest('.bombones, .cinta, .cookies, .mando'));
      rot.textContent = enTab ? 'partir' : enMapa ? 'mapa' : '';
    }, { passive: true });
  })();

  // ---------- Cookies ----------
  var cookies = $('#cookies'), cerradas = false;
  try { cerradas = localStorage.getItem('estalo-cookies') === 'ok'; } catch (e) {}
  cookies.hidden = cerradas;
  $('#cookies-ok').addEventListener('click', function () { try { localStorage.setItem('estalo-cookies', 'ok'); } catch (e) {} cookies.hidden = true; cerradas = true; if (typeof actualizarMando === 'function') actualizarMando(); });

  // MANDO DE DEMOSTRACIÓN: inicio — NUNCA viaja al sitio de un cliente. Ver README.
  var mando = $('#mando');
  function actualizarMando() { mando.hidden = !(raiz.classList.contains('es-revision') && cerradas); }
  function marcar(g, v) { $$('[data-' + g + ']', mando).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset[g] === v)); }); }
  marcar('maqueta', raiz.classList.contains('maq-sobria') ? 'sobria' : 'cargada');
  marcar('paleta', raiz.classList.contains('pal-coral') ? 'coral' : raiz.classList.contains('pal-oro') ? 'oro' : 'turquesa');
  $$('[data-maqueta]', mando).forEach(function (b) { b.addEventListener('click', function () { var v = b.dataset.maqueta; raiz.classList.toggle('maq-sobria', v === 'sobria'); try { localStorage.setItem('estalo-maqueta', v); } catch (e) {} marcar('maqueta', v); medirPila(); if (gsapReady) ScrollTrigger.refresh(); }); });
  $$('[data-paleta]', mando).forEach(function (b) { b.addEventListener('click', function () { var v = b.dataset.paleta; raiz.classList.remove('pal-coral', 'pal-oro'); if (v !== 'turquesa') raiz.classList.add('pal-' + v); try { localStorage.setItem('estalo-paleta', v); } catch (e) {} marcar('paleta', v); }); });
  actualizarMando();
  // MANDO DE DEMOSTRACIÓN: fin

  window.addEventListener('load', function () { if (gsapReady) ScrollTrigger.refresh(); medirPila(); });
  reduce.addEventListener && reduce.addEventListener('change', function () { motion = !reduce.matches; });
})();
