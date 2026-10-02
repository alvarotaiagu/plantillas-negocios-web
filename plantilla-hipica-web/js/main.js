/* ═══════════════════════════════════════════════════════════════════
   Picadeiro Brañavella — plantilla de demostración (negocio ficticio)
   main.js: sin build. GSAP + ScrollTrigger + Lenis por CDN; el contenido
   (horario, aires, tarifas, cuadra) no depende de ellos.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var html = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var gsapReady = !!(window.gsap && window.ScrollTrigger);
  var motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finoRaton = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (gsapReady) gsap.registerPlugin(ScrollTrigger);
  if (gsapReady && motion) html.classList.add('has-motion');
  if (!gsapReady) html.classList.add('sin-gsap');
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ─────────── Lenis ─────────── */
  var lenis = null;
  if (motion && window.Lenis) {
    lenis = new Lenis({ lerp: 0.13 });
    if (gsapReady) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }
    else { var lr = function (t) { lenis.raf(t); requestAnimationFrame(lr); }; requestAnimationFrame(lr); }
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href'), el = id.length > 1 && $(id);
      if (!el) return;
      e.preventDefault(); cerrarMenu();
      if (lenis) lenis.scrollTo(el, { offset: el.id === 'inicio' ? 0 : -60, duration: 1.4 });
      else el.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' });
      if (el.id !== 'inicio') { el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); }
    });
  });

  /* ─────────── Hora de Vilalba (o la fijada con ?ahora=) ─────────── */
  function ahora() {
    var m = /[?&]ahora=(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)/.exec(location.search);
    if (m) return { dia: new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])).getUTCDay(), min: +m[4] * 60 + +m[5] };
    try {
      var o = {}; new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
      return { dia: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday), min: +o.hour * 60 + +o.minute };
    } catch (e) { var n = new Date(); return { dia: n.getDay(), min: n.getHours() * 60 + n.getMinutes() }; }
  }
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var TURNOS = { 0: [[570, 840], [990, 1200]], 1: [], 2: [[600, 840], [990, 1260]], 3: [[600, 840], [990, 1260]], 4: [[600, 840], [990, 1260]], 5: [[600, 840], [990, 1260]], 6: [[570, 840], [990, 1200]] };
  var hhmm = function (m) { return Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0'); };
  var estadoHorario = '';
  function actualizarHorario() {
    var t = ahora();
    $$('.semana li').forEach(function (li) { li.classList.toggle('es-hoy', +li.dataset.dia === t.dia); });
    var txt = '', abierto = TURNOS[t.dia].filter(function (r) { return t.min >= r[0] && t.min < r[1]; })[0];
    if (abierto) txt = 'Ahora abierto, hasta las ' + hhmm(abierto[1]) + '.';
    else {
      for (var k = 0; k < 8 && !txt; k++) {
        var d = (t.dia + k) % 7, sig = TURNOS[d].filter(function (r) { return k > 0 || r[0] > t.min; })[0];
        if (sig) txt = (t.dia === 1 ? 'Hoy descansan los caballos. ' : 'Ahora cerrado. ') + 'Abrimos ' + (k === 0 ? 'hoy' : k === 1 ? 'mañana' : 'el ' + DIAS[d]) + ' a las ' + hhmm(sig[0]) + '.';
      }
    }
    estadoHorario = txt;
    $('.estado').textContent = txt;
  }
  actualizarHorario(); setInterval(actualizarHorario, 60000);

  /* ─────────── Pestañas de tarifas (con flechas del teclado) ─────────── */
  var tabs = $$('.pestanas [role="tab"]');
  function activa(tab, foco) {
    tabs.forEach(function (t) {
      var si = t === tab;
      t.setAttribute('aria-selected', String(si)); t.tabIndex = si ? 0 : -1;
      $('#' + t.getAttribute('aria-controls')).hidden = !si;
    });
    if (foco) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { activa(t); });
    t.addEventListener('keydown', function (e) {
      var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
      if (j === null) return; e.preventDefault(); activa(tabs[(j + tabs.length) % tabs.length], true);
    });
  });
  $$('.tarifas').forEach(function (ul) { $$('li', ul).forEach(function (li, i) { li.style.setProperty('--i', i); }); });

  /* ─────────── Cuadra: arrastrar con el ratón, foco solo si desborda ─────────── */
  var marco = $('.cuadra-marco');
  function revisarDesborde() { if (marco) { if (marco.scrollWidth > marco.clientWidth + 2) marco.setAttribute('tabindex', '0'); else marco.removeAttribute('tabindex'); } }
  revisarDesborde();
  window.addEventListener('resize', function () { clearTimeout(revisarDesborde.t); revisarDesborde.t = setTimeout(revisarDesborde, 150); });
  if (marco) {
    var arr = null;
    marco.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || e.button !== 0) return; arr = { x: e.clientX, s: marco.scrollLeft, movido: false }; });
    window.addEventListener('pointermove', function (e) {
      if (!arr) return;
      var dx = e.clientX - arr.x;
      if (Math.abs(dx) > 4) { arr.movido = true; marco.classList.add('arrastrando'); }
      marco.scrollLeft = arr.s - dx;
    });
    window.addEventListener('pointerup', function () { if (arr && arr.movido) marco.addEventListener('click', function para(ev) { ev.preventDefault(); ev.stopPropagation(); marco.removeEventListener('click', para, true); }, true); arr = null; marco.classList.remove('arrastrando'); });
    marco.addEventListener('dragstart', function (e) { e.preventDefault(); });
  }
  // Alzadas (versión sobria): los valores salen de data-alto, no se repiten aquí.
  var alzadas = $('.alzadas-lista');
  if (alzadas) $$('.caballo').forEach(function (c) {
    var alto = +c.dataset.alto, li = document.createElement('li');
    li.innerHTML = '<span class="a-valor">' + (alto / 100).toFixed(2).replace('.', ',') + '</span><span class="a-barra" style="--h:' + Math.round((alto - 100) / 70 * 100) + '"></span><span class="a-nombre">' + $('h3', c).textContent + '</span>';
    alzadas.appendChild(li);
  });
  if (alzadas) { var cap = $('.alzadas figcaption'); cap.appendChild(document.createTextNode(' Las barras empiezan en 1 m.')); }

  /* ═════════ Cookies + mandos ═════════ */
  var cookies = $('.cookies');
  var mostrarMando = function () {};

  // ── MANDO DE DEMOSTRACIÓN · NO VIAJA AL SITIO DE UN CLIENTE (ver README) ──
  var mando = $('.mando');
  if (mando && html.classList.contains('en-revision')) {
    mostrarMando = function () { mando.hidden = !cookies.hidden; };
    var marcar = function () {
      var sob = html.classList.contains('densidad-sobria');
      $$('[data-densidad]', mando).forEach(function (b) { b.setAttribute('aria-pressed', String((b.dataset.densidad === 'sobria') === sob)); });
      var pal = html.classList.contains('paleta-azul') ? 'azul' : html.classList.contains('paleta-ocre') ? 'ocre' : 'casaca';
      $$('[data-paleta]', mando).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.paleta === pal)); });
    };
    $$('[data-densidad]', mando).forEach(function (b) {
      b.addEventListener('click', function () {
        html.classList.toggle('densidad-sobria', b.dataset.densidad === 'sobria');
        store.set('branavella-densidad', b.dataset.densidad); marcar(); revisarDesborde();
        if (gsapReady) ScrollTrigger.refresh();
      });
    });
    $$('[data-paleta]', mando).forEach(function (b) {
      b.addEventListener('click', function () {
        html.classList.remove('paleta-azul', 'paleta-ocre');
        if (b.dataset.paleta !== 'casaca') html.classList.add('paleta-' + b.dataset.paleta);
        store.set('branavella-paleta', b.dataset.paleta); marcar();
      });
    });
    marcar();
  }
  // ── FIN MANDO DE DEMOSTRACIÓN ──

  if (!store.get('branavella-cookies')) cookies.hidden = false;
  $('.cookies-aceptar').addEventListener('click', function () { store.set('branavella-cookies', '1'); cookies.hidden = true; mostrarMando(); });
  $('.pie-cookies').addEventListener('click', function () { cookies.hidden = false; mostrarMando(); $('.cookies-aceptar').focus(); });
  mostrarMando();

  /* ─────────── Mapa bajo clic ─────────── */
  var mb = $('.mapa-boton');
  if (mb) mb.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.title = 'Mapa: Vilalba, Lugo'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
    f.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Vilalba, Lugo') + '&output=embed';
    $('[data-mapa]').appendChild(f); mb.remove(); var av = $('.mapa-aviso'); if (av) av.remove();
  });
  /* ─────────── Formulario de muestra ─────────── */
  var form = $('.formulario');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var est = $('.formulario-estado', form), vacio = $$('input[required]', form).filter(function (i) { return !i.value.trim(); })[0];
    if (vacio) { est.textContent = 'Falta ' + (vacio.name === 'nombre' ? 'tu nombre' : 'un teléfono o correo') + '.'; vacio.focus(); return; }
    est.textContent = 'Gracias. Esto es una demo y no se envía nada; en la web real te llamaríamos para darte día.';
    form.reset();
  });

  /* ─────────── Menú móvil ─────────── */
  var navBoton = $('.nav-boton'), navPanel = $('.nav-panel');
  function cerrarMenu() {
    if (!navPanel || !navPanel.classList.contains('abierto')) return;
    navPanel.classList.remove('abierto'); navBoton.setAttribute('aria-expanded', 'false'); $('.nav-boton-texto').textContent = 'Menú';
    if (lenis) lenis.start();
  }
  if (navBoton) {
    navBoton.addEventListener('click', function () {
      if (navPanel.classList.contains('abierto')) { cerrarMenu(); return; }
      navPanel.classList.add('abierto'); navBoton.setAttribute('aria-expanded', 'true'); $('.nav-boton-texto').textContent = 'Cerrar';
      if (lenis) lenis.stop();
      setTimeout(function () { var a = $('a', navPanel); if (a) a.focus(); }, 60);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && navPanel.classList.contains('abierto')) { cerrarMenu(); navBoton.focus(); } });
  }
  var yPrev = 0;
  function alDesplazar(y) {
    html.classList.toggle('cabecera-fondo', y > 40);
    if (y < 140 || y < yPrev - 4) html.classList.remove('cabecera-oculta');
    else if (y > yPrev + 4 && !(navPanel && navPanel.classList.contains('abierto'))) html.classList.add('cabecera-oculta');
    if (Math.abs(y - yPrev) > 4) yPrev = y;
  }
  if (lenis) lenis.on('scroll', function (l) { alDesplazar(l.scroll); });
  else window.addEventListener('scroll', function () { alDesplazar(window.scrollY); }, { passive: true });

  /* ─────────── Char-reveal por trancos ─────────── */
  $$('.revela').forEach(function (h) {
    var texto = h.textContent.trim(), i = 0;
    h.setAttribute('aria-label', texto);
    h.innerHTML = texto.split(' ').map(function (p, w) {
      return '<span class="p" aria-hidden="true" style="--t:' + w + '">' + Array.from(p).map(function (c) { return '<span class="l" style="--i:' + (i++) + '">' + c + '</span>'; }).join('') + '</span>';
    }).join(' ');
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('revelado'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -12% 0px' });
    $$('.revela').forEach(function (h) { io.observe(h); });
  } else $$('.revela').forEach(function (h) { h.classList.add('revelado'); });

  /* ═════════ Los aires: datos de cada uno ═════════ */
  var AIRES = {
    paso:   { t: 4, kmh: 6,  periodo: 1.25, vel: 0.075, golpes: [0, .25, .5, .75], nota: 'Al paso: cuatro tiempos, unos 6 km/h.' },
    trote:  { t: 2, kmh: 14, periodo: 0.72, vel: 0.2,   golpes: [0, .5],           nota: 'Al trote: dos tiempos en diagonal, unos 14 km/h.' },
    galope: { t: 3, kmh: 22, periodo: 0.6,  vel: 0.36,  golpes: [0, .2, .4],       nota: 'Al galope: tres tiempos y un silencio, unos 22 km/h.' }
  };
  var aireActual = 'paso';
  var tiemposHero = $$('.aire-tiempos i');
  function pintaTiempos(lista, n) { lista.forEach(function (el, i) { el.hidden = i >= n; }); }
  function eligeAire(nombre) {
    aireActual = nombre;
    $$('.aire-boton').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.aire === nombre)); });
    $('.aire-nota-texto').textContent = AIRES[nombre].nota;
    pintaTiempos(tiemposHero, AIRES[nombre].t);
  }
  $$('.aire-boton').forEach(function (b) { b.addEventListener('click', function () { eligeAire(b.dataset.aire); }); });
  eligeAire('paso');
  function golpe(lista, i) {
    var el = lista[i]; if (!el) return;
    el.classList.add('golpe'); clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove('golpe'); }, 150);
  }

  /* ═════════ El prado (canvas 2D) ═════════ */
  var prado = (function () {
    var canvas = $('.portada-lienzo'), portada = $('.portada');
    if (!canvas || !canvas.getContext) return null;
    var ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return null;
    var W = 0, H = 0, dpr = 1, horizonte = 0, cielo = null, briznas = [], lotes = [];
    var BANDAS = [
      { ancho: 1, colores: ['#9AA878', '#A7B283', '#B7B88A'] },
      { ancho: 1.5, colores: ['#7D9558', '#8AA062', '#C2B475'] },
      { ancho: 2.3, colores: ['#56733C', '#62803F', '#B9A766'] },
      { ancho: 3.3, colores: ['#38522A', '#43612F', '#A99A5C'] }
    ];
    function sembrar() {
      var r = canvas.getBoundingClientRect();
      var w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      if (Math.round(w * dpr) === W && Math.round(h * dpr) === H) return;
      W = Math.round(w * dpr); H = Math.round(h * dpr); canvas.width = W; canvas.height = H;
      var movil = w < 760;
      horizonte = H * (movil ? 0.6 : 0.64);
      // Cielo, colinas y niebla: se pintan una vez en un lienzo aparte y se copian (nada de filtros por fotograma).
      cielo = document.createElement('canvas'); cielo.width = W; cielo.height = H;
      var c = cielo.getContext('2d');
      var g = c.createLinearGradient(0, 0, 0, horizonte);
      g.addColorStop(0, '#F1ECDD'); g.addColorStop(1, '#E2DAC0');
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.fillStyle = '#C9C7A6';
      c.beginPath(); c.moveTo(0, horizonte);
      for (var x = 0; x <= W; x += W / 24) c.lineTo(x, horizonte - (Math.sin(x / W * 5.1) * 0.5 + Math.sin(x / W * 11.3 + 1) * 0.3 + 1) * H * 0.025);
      c.lineTo(W, horizonte); c.closePath(); c.fill();
      c.fillStyle = '#B4B790';
      c.beginPath(); c.moveTo(0, horizonte);
      for (x = 0; x <= W; x += W / 30) c.lineTo(x, horizonte - (Math.sin(x / W * 7.7 + 2) * 0.5 + 0.8) * H * 0.012);
      c.lineTo(W, horizonte); c.closePath(); c.fill();
      // Postes de la cerca en el horizonte
      c.strokeStyle = '#8E8A6E'; c.lineWidth = 1.2 * dpr;
      var cx0 = movil ? 0.45 : 0.52, cx1 = movil ? 0.97 : 0.94;
      for (x = W * cx0; x < W * cx1; x += W * (movil ? 0.04 : 0.024)) { c.beginPath(); c.moveTo(x, horizonte + H * 0.004); c.lineTo(x, horizonte - H * 0.018); c.stroke(); }
      c.beginPath(); c.moveTo(W * cx0, horizonte - H * 0.012); c.lineTo(W * cx1, horizonte - H * 0.012); c.stroke();
      var suelo = c.createLinearGradient(0, horizonte, 0, H);
      suelo.addColorStop(0, '#A8B07E'); suelo.addColorStop(0.35, '#6F8A4C'); suelo.addColorStop(1, '#2C4222');
      c.fillStyle = suelo; c.fillRect(0, horizonte, W, H - horizonte);
      // Briznas
      var n = Math.round(Math.min(2800, Math.max(900, w * (movil ? 2.6 : 1.9))));
      briznas = [];
      for (var i = 0; i < n; i++) {
        var d = Math.pow(Math.random(), 0.75);
        var y = horizonte + d * (H - horizonte) * 1.04;
        var banda = Math.min(3, Math.floor(d * 4));
        var seco = Math.random() < 0.12 ? 2 : (Math.random() < 0.5 ? 0 : 1);
        briznas.push({ x: Math.random() * W * 1.08 - W * 0.04, y: y, d: d, h: (6 + d * d * 70 + Math.random() * 12 * d) * dpr * (movil ? 0.9 : 1.15), f: Math.random() * 6.283, b: banda, c: seco, rig: 0.6 + Math.random() * 0.5 });
      }
      briznas.sort(function (a, b) { return a.y - b.y; });
      lotes = [];
      BANDAS.forEach(function (bd, bi) { bd.colores.forEach(function (col, ci) { lotes.push({ banda: bi, color: col, ancho: bd.ancho * dpr, idx: [] }); }); });
      briznas.forEach(function (bz, i) { lotes[bz.b * 3 + bz.c].idx.push(i); });
      pinta(performance.now());
    }
    var ondas = [], raton = { x: -9999, y: -9999 }, caballo = { x: 0, fase: 0, ultimo: -1 }, rafaga = 0;
    function pinta(ms) {
      if (!W) return;
      var t = ms / 1000;
      ctx.drawImage(cielo, 0, 0);
      var vivas = ondas.filter(function (o) { return t - o.t0 < 1.4; }); ondas = vivas;
      var amp = 0.16 * (1 + rafaga * 1.6);
      for (var L = 0; L < lotes.length; L++) {
        var lote = lotes[L];
        ctx.strokeStyle = lote.color; ctx.lineWidth = lote.ancho; ctx.lineCap = 'round';
        ctx.beginPath();
        for (var k = 0; k < lote.idx.length; k++) {
          var bz = briznas[lote.idx[k]];
          var flex = amp * Math.sin(bz.x * 0.0035 / dpr + t * 1.1 + bz.f * 0.25) + 0.06 * Math.sin(t * 2.3 + bz.f);
          for (var o = 0; o < ondas.length; o++) {
            var on = ondas[o], edad = t - on.t0, rad = edad * 620 * dpr;
            var dx = bz.x - on.x, dy = (bz.y - on.y) * 2.2, dist = Math.sqrt(dx * dx + dy * dy);
            var e = (dist - rad) / (46 * dpr);
            if (e > -3 && e < 3) flex += on.a * Math.exp(-e * e) * Math.exp(-edad * 2.4) * (dx > 0 ? 1 : -1);
          }
          var rx = bz.x - raton.x, ry = (bz.y - raton.y) * 1.6, rd = rx * rx + ry * ry, rr = 110 * dpr;
          if (rd < rr * rr * 4) flex += 0.85 * Math.exp(-rd / (rr * rr)) * (rx > 0 ? 1 : -1);
          flex = Math.max(-1.1, Math.min(1.1, flex / bz.rig));
          var px = bz.x + flex * bz.h * 0.85, py = bz.y - bz.h * (1 - 0.32 * flex * flex);
          ctx.moveTo(bz.x, bz.y);
          ctx.quadraticCurveTo(bz.x + flex * bz.h * 0.25, bz.y - bz.h * 0.55, px, py);
        }
        ctx.stroke();
      }
    }
    // El caballo que no se ve: cruza el prado y cada golpe de casco abre una onda.
    function cascos(dt, t) {
      var a = AIRES[aireActual];
      caballo.x += a.vel * W * dt;
      if (caballo.x > W * 1.15) caballo.x = -W * 0.15;
      var fasePrev = caballo.fase;
      caballo.fase = (caballo.fase + dt / a.periodo) % 1;
      a.golpes.forEach(function (g, i) {
        var cruza = fasePrev <= caballo.fase ? (g > fasePrev && g <= caballo.fase) : (g > fasePrev || g <= caballo.fase);
        if (cruza) {
          var suelo = horizonte + (H - horizonte) * (0.55 + (i % 2 ? 0.06 : -0.02));
          ondas.push({ x: caballo.x + (i % 2 ? -1 : 1) * 18 * dpr, y: suelo, t0: t, a: aireActual === 'galope' ? 0.75 : aireActual === 'trote' ? 0.6 : 0.45 });
          golpe(tiemposHero, i);
        }
      });
    }
    var visible = true, tPrev = performance.now();
    function bucle(ms) {
      requestAnimationFrame(bucle);
      var dt = Math.min(0.05, (ms - tPrev) / 1000); tPrev = ms;
      if (!visible || document.hidden) return;
      cascos(dt, ms / 1000);
      pinta(ms);
    }
    sembrar();
    if ('ResizeObserver' in window) new ResizeObserver(sembrar).observe(canvas); else window.addEventListener('resize', sembrar);
    html.classList.add('lienzo-ok');
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(portada);
    portada.addEventListener('pointermove', function (e) { var r = canvas.getBoundingClientRect(); raton.x = (e.clientX - r.left) * dpr; raton.y = (e.clientY - r.top) * dpr; if (!motion) pinta(performance.now()); });
    portada.addEventListener('pointerleave', function () { raton.x = raton.y = -9999; if (!motion) pinta(performance.now()); });
    return {
      arranca: function () { caballo.x = W * 0.1; if (motion) requestAnimationFrame(bucle); else pinta(performance.now()); },
      rafaga: function (p) { rafaga = p; },
      estado: function () { return { W: W, H: H, briznas: briznas.length, lotes: lotes.length, ondas: ondas.length }; }
    };
  })();

  /* ═════════ Diagrama de apoyos (anclado) ═════════ */
  var diagrama = (function () {
    var svg = $('.diagrama-svg'); if (!svg) return null;
    var X0 = 120, X1 = 700, ANCHO = X1 - X0, FILAS = { MI: 57, MD: 112, PI: 167, PD: 222 }, ALTO = 30, ns = 'http://www.w3.org/2000/svg';
    var G = [
      { n: 'Paso', t: 4, kmh: 6, periodo: 1.25, p: { MI: [.25, .62], MD: [.75, .62], PI: [0, .62], PD: [.5, .62] } },
      { n: 'Trote', t: 2, kmh: 14, periodo: .72, p: { MI: [.5, .4], MD: [0, .4], PI: [0, .4], PD: [.5, .4] } },
      { n: 'Galope', t: 3, kmh: 22, periodo: .6, p: { MI: [.2, .3], MD: [.38, .3], PI: [0, .3], PD: [.2, .3] }, susp: [.68, 1] }
    ];
    var rej = $('.diagrama-rejilla', svg), barras = $('.diagrama-barras', svg), cursor = $('.diagrama-cursor', svg);
    var r = '';
    Object.keys(FILAS).forEach(function (k) { r += '<rect x="' + X0 + '" y="' + (FILAS[k] - ALTO / 2 - 4) + '" width="' + ANCHO + '" height="' + (ALTO + 8) + '" rx="4"/>'; });
    for (var q = 0; q <= 4; q++) r += '<line x1="' + (X0 + ANCHO * q / 4) + '" y1="28" x2="' + (X0 + ANCHO * q / 4) + '" y2="250"/>';
    rej.innerHTML = r;
    var golpesEl = $$('.aires-golpes i'), datoT = $('.dato-tiempos'), datoK = $('.dato-kmh'), etapas = $$('.etapa'), cuenta = $('.aires-cuenta'), botones = $$('.aires-boton');
    var s = 0, actual = -1, fase = 0, actualPata = {};
    function orden(g) {
      var inicios = []; Object.keys(g.p).forEach(function (k) { if (inicios.indexOf(g.p[k][0]) < 0) inicios.push(g.p[k][0]); });
      inicios.sort(function (a, b) { return a - b; });
      var o = {}; Object.keys(g.p).forEach(function (k) { o[k] = inicios.indexOf(g.p[k][0]) + 1; }); return o;
    }
    function pinta(nuevo) {
      s = Math.max(0, Math.min(2, nuevo));
      var i = Math.min(1, Math.floor(s)), f = s - i, ff = f < 0.2 ? 0 : f > 0.8 ? 1 : (f - 0.2) / 0.6;
      ff = ff * ff * (3 - 2 * ff);
      var a = G[i], b = G[i + 1], cerca = G[Math.round(s)], ord = orden(cerca), h = '';
      actualPata = {};
      Object.keys(FILAS).forEach(function (k) {
        var ini = a.p[k][0] + (b.p[k][0] - a.p[k][0]) * ff, dur = a.p[k][1] + (b.p[k][1] - a.p[k][1]) * ff, y = FILAS[k] - ALTO / 2;
        actualPata[k] = [ini, dur];
        var x = X0 + ini * ANCHO, w = dur * ANCHO;
        if (ini + dur <= 1) h += '<rect x="' + x.toFixed(1) + '" y="' + y + '" width="' + w.toFixed(1) + '" height="' + ALTO + '" rx="3"/>';
        else { var w1 = (1 - ini) * ANCHO; h += '<rect x="' + x.toFixed(1) + '" y="' + y + '" width="' + w1.toFixed(1) + '" height="' + ALTO + '" rx="3"/><rect x="' + X0 + '" y="' + y + '" width="' + (w - w1).toFixed(1) + '" height="' + ALTO + '" rx="3"/>'; }
        h += '<text x="' + (x + 8).toFixed(1) + '" y="' + (FILAS[k] + 5) + '">' + ord[k] + '</text>';
      });
      if (s > 1.5) h += '<rect class="suspension" x="' + (X0 + ANCHO * .68) + '" y="34" width="' + (ANCHO * .32) + '" height="210" rx="4"/><text class="suspension-texto" x="' + (X0 + ANCHO * .84) + '" y="262" text-anchor="middle">en el aire</text>';
      barras.innerHTML = h;
      datoK.textContent = Math.round(a.kmh + (b.kmh - a.kmh) * ff);
      var activo = Math.round(s);
      if (activo !== actual) {
        actual = activo;
        datoT.textContent = cerca.t;
        pintaTiempos(golpesEl, cerca.t);
        etapas.forEach(function (e, j) { e.classList.toggle('es-activa', j === activo); });
        cuenta.textContent = cerca.n + ' · ' + (activo + 1) + ' de 3';
        botones[0].disabled = activo === 0; botones[1].disabled = activo === 2;
      }
    }
    // El cursor recorre la zancada en bucle y enciende el golpe de cada pata al pasar.
    var visible = false, tPrev = performance.now();
    function bucle(ms) {
      requestAnimationFrame(bucle);
      var dt = Math.min(0.05, (ms - tPrev) / 1000); tPrev = ms;
      if (!visible || document.hidden) return;
      var cerca = G[Math.round(s)], periodo = G[0].periodo + (G[2].periodo - G[0].periodo) * (s / 2);
      var prev = fase; fase = (fase + dt / periodo) % 1;
      var ord = orden(cerca);
      Object.keys(actualPata).forEach(function (k) {
        var g = actualPata[k][0];
        if (prev <= fase ? (g > prev && g <= fase) : (g > prev || g <= fase)) golpe(golpesEl, ord[k] - 1);
      });
      var x = X0 + fase * ANCHO;
      cursor.setAttribute('x1', x.toFixed(1)); cursor.setAttribute('x2', x.toFixed(1));
    }
    pinta(0);
    if (motion) {
      if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(svg); else visible = true;
      requestAnimationFrame(bucle);
    }
    return { pinta: pinta, get actual() { return actual; } };
  })();
  window.__branavella = { diagrama: diagrama, prado: prado, horario: function () { return estadoHorario; } };

  // Botones de los aires: sin anclaje, sin GSAP o con movimiento reducido.
  var aireManual = 0;
  $$('.aires-boton').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!diagrama) return;
      var desde = aireManual; aireManual = Math.max(0, Math.min(2, aireManual + +b.dataset.dir));
      if (!motion) { diagrama.pinta(aireManual); return; }
      var t0 = performance.now(), hasta = aireManual;
      (function paso(t) { var k = Math.min(1, (t - t0) / 800), e = 1 - Math.pow(1 - k, 3); diagrama.pinta(desde + (hasta - desde) * e); if (k < 1) requestAnimationFrame(paso); })(t0);
    });
  });

  /* ═════════ Cortina: la puerta de la cuadra ═════════ */
  function portadaLista() { html.classList.add('portada-lista'); if (prado) prado.arranca(); }
  function quitaCortina() { html.classList.add('cortina-fuera'); }
  if (!motion) { portadaLista(); setTimeout(quitaCortina, 400); }
  else if (!gsapReady) { setTimeout(portadaLista, 900); setTimeout(quitaCortina, 1700); }
  else {
    var fuentes = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 1200); })]) : Promise.resolve();
    fuentes.then(function () {
      var tl = gsap.timeline({ onComplete: quitaCortina });
      tl.fromTo('.cortina-texto', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out', immediateRender: false })
        .to('.cortina-texto', { autoAlpha: 0, duration: 0.3 }, 0.95)
        .to('.cortina-arriba', { rotationX: 96, transformPerspective: 1400, duration: 1.1, ease: 'expo.inOut' }, 1.0)
        .to('.cortina-abajo', { rotationX: -96, transformPerspective: 1400, duration: 1.1, ease: 'expo.inOut' }, 1.28)
        .add(portadaLista, 1.55);
    });
  }

  /* ═════════ GSAP + movimiento ═════════ */
  if (gsapReady && motion) {
    var fijo = $('.aires-fijo');
    if (diagrama && fijo) {
      html.classList.add('aires-anclada');
      var barra = document.createElement('div'); barra.className = 'progreso-aires'; barra.setAttribute('aria-hidden', 'true'); barra.innerHTML = '<span></span>';
      fijo.appendChild(barra);
      ScrollTrigger.create({
        trigger: '.aires', start: 'top top', end: function () { return '+=' + Math.round(window.innerHeight * 3); },
        pin: fijo, scrub: 0.6, anticipatePin: 1,
        onUpdate: function (st) { diagrama.pinta(st.progress * 2); barra.style.setProperty('--p', st.progress.toFixed(3)); }
      });
    }
    ScrollTrigger.create({ trigger: '.portada', start: 'top top', end: 'bottom top', onUpdate: function (st) { if (prado) prado.rafaga(st.progress); } });
    // Cancela: las secciones entran por listones.
    $$('.cuadra, .escuela, .preguntas, .visita').forEach(function (s) {
      s.classList.add('listones');
      gsap.fromTo(s, { '--abre': 0 }, {
        '--abre': 1, ease: 'none', immediateRender: true,
        scrollTrigger: { trigger: s, start: 'top bottom', end: 'top 40%', scrub: 0.3, onLeave: function () { s.classList.add('abierta'); }, onEnterBack: function () { s.classList.remove('abierta'); } }
      });
    });
    // Caballos: entran escalonados como al galope (tres y pausa).
    $$('.caballo').forEach(function (c, i) {
      gsap.fromTo(c, { x: 80 + (i % 3) * 30 }, { x: 0, ease: 'none', immediateRender: false, scrollTrigger: { trigger: '.cuadra-marco', start: 'top bottom', end: 'top 35%', scrub: 0.5 } });
    });
    if (finoRaton) $$('.iman').forEach(function (b) {
      var qx = gsap.quickTo(b, 'x', { duration: 0.6, ease: 'power3.out' }), qy = gsap.quickTo(b, 'y', { duration: 0.6, ease: 'power3.out' });
      b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * 0.3); qy((e.clientY - r.top - r.height / 2) * 0.4); });
      b.addEventListener('pointerleave', function () { qx(0); qy(0); });
    });
    if (document.fonts) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); revisarDesborde(); });
  }

  /* ─────────── Cinta con la velocidad del scroll ─────────── */
  var pista = $('.cinta-pista');
  if (pista && motion) {
    var x = 0, vel = 0, mitad = 0, cVis = true;
    var mide = function () { mitad = pista.scrollWidth / 2; }; mide(); window.addEventListener('resize', mide); if (document.fonts) document.fonts.ready.then(mide);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { cVis = e[0].isIntersecting; }).observe(pista);
    if (lenis) lenis.on('scroll', function (l) { vel = l.velocity; });
    var tc = performance.now();
    (function cinta(t) {
      requestAnimationFrame(cinta);
      var dt = Math.min(50, t - tc); tc = t;
      if (!cVis || !mitad) return;
      x -= (0.05 + Math.min(1.6, Math.abs(vel) * 0.025)) * dt * (vel < -0.5 ? -1 : 1);
      if (x <= -mitad) x += mitad; if (x > 0) x -= mitad;
      pista.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)'; vel *= 0.94;
    })(tc);
  }

  /* ─────────── Cursor ─────────── */
  if (finoRaton && $('.cursor')) {
    var punto = $('.cursor-punto'), aro = $('.cursor-aro'), mx = -100, my = -100, ax = -100, ay = -100, on = false;
    var claras = '.aires, .tablon, .pie, .cinta, .aire, .nav-panel.abierto, .cookies';
    var ctxCursor = function (t) {
      if (!t) return;
      html.classList.toggle('cursor-enlace', !!t.closest('a, button, summary, select, input, label, [role="tab"]'));
      html.classList.toggle('cursor-claro', !!t.closest(claras));
      html.classList.toggle('cursor-arrastra', !!t.closest('.cuadra-marco') && !t.closest('a, button'));
    };
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      if (!on) { on = true; html.classList.add('cursor-propio'); ax = e.clientX; ay = e.clientY; requestAnimationFrame(sigue); }
      mx = e.clientX; my = e.clientY; ctxCursor(e.target);
    }, { passive: true });
    var tS = 0;
    window.addEventListener('scroll', function () { var n = performance.now(); if (n - tS > 120 && mx > 0) { tS = n; ctxCursor(document.elementFromPoint(mx, my)); } }, { passive: true });
    document.addEventListener('pointerleave', function () { mx = my = -100; });
    var sigue = function () {
      requestAnimationFrame(sigue);
      ax += (mx - ax) * (motion ? 0.2 : 1); ay += (my - ay) * (motion ? 0.2 : 1);
      punto.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      aro.style.transform = 'translate3d(' + ax.toFixed(1) + 'px,' + ay.toFixed(1) + 'px,0)';
    };
  }
})();
