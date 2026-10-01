/* ═══════════════════════════════════════════════════════════════════
   Pegada · yoga e pilates — plantilla de demostración (negocio ficticio)
   main.js: un solo archivo, sin build. GSAP + ScrollTrigger + Lenis por CDN,
   pero nada de lo que es contenido depende de ellos.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var html = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // Dos banderas separadas (PLIEGO §5): una dice si hay GSAP, la otra si se puede mover.
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
  var esSobria = function () { return html.classList.contains('densidad-sobria'); };

  /* ─────────── Lenis: único motor de scroll ─────────── */
  var lenis = null;
  if (motion && window.Lenis) {
    lenis = new Lenis({ lerp: 0.14, smoothWheel: true });
    if (gsapReady) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var lenisRaf = function (t) { lenis.raf(t); requestAnimationFrame(lenisRaf); };
      requestAnimationFrame(lenisRaf);
    }
  }
  function irA(destino) {
    var el = typeof destino === 'string' ? $(destino) : destino;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: el.id === 'inicio' ? 0 : -70, duration: 1.4 });
    else el.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' });
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2 || !$(id)) return;
      e.preventDefault();
      cerrarMenu();
      irA(id);
      var destino = $(id);
      if (destino.id !== 'inicio') { destino.setAttribute('tabindex', '-1'); destino.focus({ preventScroll: true }); }
    });
  });

  /* ═════════ Cuadro de clases en vivo (contenido: funciona sin GSAP y sin movimiento) ═════════ */
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  function aMin(hhmm) { var p = hhmm.split(':'); return +p[0] * 60 + +p[1]; }
  function ahora() {
    // ?ahora=2026-10-01T18:10 fija la hora (para revisar la demo y para las pruebas).
    var m = /[?&]ahora=(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)/.exec(location.search);
    if (m) {
      var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
      return { dia: d.getUTCDay(), min: +m[4] * 60 + +m[5] };
    }
    // Hora de Sanxenxo, esté donde esté quien mira.
    try {
      var partes = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
      var o = {}; partes.forEach(function (p) { o[p.type] = p.value; });
      return { dia: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday), min: +o.hour * 60 + +o.minute };
    } catch (e) { var n = new Date(); return { dia: n.getDay(), min: n.getHours() * 60 + n.getMinutes() }; }
  }
  function duracion(min) {
    if (min < 60) return min + ' min';
    var h = Math.floor(min / 60), r = min % 60;
    return h + ' h' + (r ? ' ' + r + ' min' : '');
  }
  var sesiones = $$('.sesion').map(function (el) {
    return {
      el: el, dia: +el.closest('.cuadro-dia').dataset.dia,
      ini: aMin(el.dataset.inicio), fin: aMin(el.dataset.fin),
      nombre: $('.sesion-nombre', el).textContent,
      datos: $('.sesion-datos', el).textContent,
      hora: el.dataset.inicio
    };
  });
  var estadoCuadro = {};
  function actualizarCuadro() {
    var t = ahora();
    $$('.cuadro-dia').forEach(function (d) { d.classList.toggle('es-hoy', +d.dataset.dia === t.dia); });
    var enCurso = null, siguiente = null;
    sesiones.forEach(function (s) {
      s.el.classList.remove('es-pasada', 'es-encurso', 'es-siguiente');
      $('.sesion-estado', s.el).textContent = '';
      if (s.dia !== t.dia) return;
      if (s.fin <= t.min) s.el.classList.add('es-pasada');
      else if (s.ini <= t.min) { s.el.classList.add('es-encurso'); if (!enCurso) enCurso = s; }
    });
    // La siguiente: hoy, más tarde; si no, el próximo día con clases.
    for (var k = 0; k < 7 && !siguiente; k++) {
      var dia = (t.dia + k) % 7;
      for (var i = 0; i < sesiones.length; i++) {
        var s = sesiones[i];
        if (s.dia === dia && (k > 0 || s.ini > t.min)) { siguiente = { s: s, k: k }; break; }
      }
    }
    if (enCurso) $('.sesion-estado', enCurso.el).textContent = 'en curso · termina en ' + duracion(enCurso.fin - t.min);
    var cuando = '';
    if (siguiente) {
      var ss = siguiente.s;
      ss.el.classList.add('es-siguiente');
      if (siguiente.k === 0) cuando = 'empieza en ' + duracion(ss.ini - t.min);
      else if (siguiente.k === 1) cuando = 'mañana a las ' + ss.hora;
      else cuando = 'el ' + DIAS[ss.dia] + ' a las ' + ss.hora;
      $('.sesion-estado', ss.el).textContent = 'siguiente · ' + cuando;
    }
    estadoCuadro = { dia: t.dia, min: t.min, enCurso: enCurso && enCurso.nombre, siguiente: siguiente && siguiente.s.nombre, siguienteDia: siguiente && siguiente.s.dia, siguienteHora: siguiente && siguiente.s.hora };

    // Portada
    var etiqueta = t.dia === 0 ? 'Hoy domingo · cerrado' : 'Hoy, ' + DIAS[t.dia];
    $('.vivo-dia').textContent = etiqueta;
    if (siguiente) {
      $('.vivo-dia').textContent = etiqueta + ' · siguiente clase';
      $('.vivo-clase').textContent = siguiente.s.nombre + ' · ' + siguiente.s.hora;
      $('.vivo-detalle').textContent = siguiente.s.datos + ' · ' + cuando + '.' + (enCurso ? ' Ahora mismo: ' + enCurso.nombre + ', hasta las ' + enCurso.el.dataset.fin + '.' : '');
    }
    // Cabecera del cuadro
    var txt = (enCurso ? 'Ahora: ' + enCurso.nombre + ' (hasta las ' + enCurso.el.dataset.fin + '). ' : '') +
      (siguiente ? 'Siguiente: ' + siguiente.s.nombre + ', ' + siguiente.s.datos.split(' · ')[1] + ', ' + cuando + '.' : '');
    $('.cuadro-vivo-texto').textContent = txt;
  }
  actualizarCuadro();
  setInterval(actualizarCuadro, 30000);

  // Filtros por tipo
  $$('.filtro').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.dataset.filtro;
      $$('.filtro').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      sesiones.forEach(function (s) { s.el.classList.toggle('es-filtrada', f !== 'todas' && s.el.dataset.tipo !== f); });
    });
  });

  // Contenedores que desbordan: focusables solo cuando desbordan de verdad.
  var marco = $('.cuadro-marco');
  function revisarDesborde() {
    if (!marco) return;
    if (marco.scrollWidth > marco.clientWidth + 2) marco.setAttribute('tabindex', '0');
    else marco.removeAttribute('tabindex');
  }
  function centrarHoy() {
    var hoy = $('.cuadro-dia.es-hoy');
    if (hoy && marco && marco.scrollWidth > marco.clientWidth + 2) marco.scrollLeft = hoy.offsetLeft - parseFloat(getComputedStyle(marco).paddingLeft || 0);
  }
  revisarDesborde(); centrarHoy();

  /* ─────────── Tarifas ─────────── */
  $$('.tarifas-boton').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.tarifas-boton').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      $$('.tarifas-lista').forEach(function (l) { l.hidden = l.dataset.lista !== b.dataset.tarifa; });
    });
  });
  $$('.tarifas-lista li').forEach(function (li, i) { li.style.setProperty('--i', i % 4); });

  /* ─────────── Comparativa (versión sobria): sale de los data-* de las tarjetas ─────────── */
  var compLista = $('.comparativa-lista');
  if (compLista) {
    $$('.pila-item').forEach(function (it) {
      var li = document.createElement('li');
      var n = $('.tarjeta-nombre', it).textContent;
      var r = +it.dataset.intensidad, q = +it.dataset.quietud;
      li.innerHTML = '<span>' + n + '</span><span class="c-barra c-ritmo" role="img" aria-label="Ritmo ' + r + ' de 5"><span style="--v:' + r / 5 + '"></span></span><span class="c-barra c-quietud" role="img" aria-label="Quietud ' + q + ' de 5"><span style="--v:' + q / 5 + '"></span></span>';
      compLista.appendChild(li);
    });
    var ley = document.createElement('p');
    ley.className = 'comparativa-leyenda';
    ley.innerHTML = '<span><i style="background:var(--coral)"></i>Ritmo</span><span><i style="background:var(--mar)"></i>Quietud</span>';
    compLista.after(ley);
  }

  /* ─────────── Rastro de huellas entre secciones (versión «Apoyos») ─────────── */
  function rastro(antesDe, haciaDerecha) {
    var dest = $(antesDe); if (!dest) return;
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'rastro'); svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('viewBox', '0 0 1200 90'); svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    for (var i = 0; i < 9; i++) {
      var x = haciaDerecha ? 140 + i * 115 : 1060 - i * 115;
      var y = 45 + (i % 2 ? -14 : 14);
      var g = document.createElementNS(ns, 'g');
      g.setAttribute('transform', 'translate(' + x + ' ' + y + ') rotate(' + (haciaDerecha ? 90 : -90) + ')');
      g.style.setProperty('--i', i);
      g.innerHTML = '<ellipse rx="9" ry="13"/><ellipse rx="4.5" ry="7" cy="1"/><circle class="rastro-nucleo" r="1.8" cy="2"/>';
      svg.appendChild(g);
    }
    dest.parentNode.insertBefore(svg, dest);
  }
  rastro('#equipo', true);
  rastro('#contacto', false);

  /* ═════════ Cookies + mandos de demostración ═════════ */
  var cookies = $('.cookies');
  var mostrarMando = function () {};

  // ── MANDO DE DEMOSTRACIÓN · NO VIAJA AL SITIO DE UN CLIENTE (ver README) ──
  // Se esconde mientras el aviso de cookies está en pantalla (en móvil ocupa todo el ancho).
  var mando = $('.mando');
  if (mando && html.classList.contains('en-revision')) {
    mostrarMando = function () { mando.hidden = !cookies.hidden; };
    var marcar = function () {
      $$('[data-densidad]', mando).forEach(function (b) { b.setAttribute('aria-pressed', String((b.dataset.densidad === 'sobria') === esSobria())); });
      var pal = html.classList.contains('paleta-granate') ? 'granate' : html.classList.contains('paleta-musgo') ? 'musgo' : 'mar';
      $$('[data-paleta]', mando).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.paleta === pal)); });
    };
    $$('[data-densidad]', mando).forEach(function (b) {
      b.addEventListener('click', function () {
        html.classList.toggle('densidad-sobria', b.dataset.densidad === 'sobria');
        store.set('pegada-densidad', b.dataset.densidad);
        marcar(); medirPila();
        if (gsapReady) ScrollTrigger.refresh();
      });
    });
    $$('[data-paleta]', mando).forEach(function (b) {
      b.addEventListener('click', function () {
        html.classList.remove('paleta-granate', 'paleta-musgo');
        if (b.dataset.paleta !== 'mar') html.classList.add('paleta-' + b.dataset.paleta);
        store.set('pegada-paleta', b.dataset.paleta);
        marcar();
      });
    });
    marcar();
  }
  // ── FIN MANDO DE DEMOSTRACIÓN ──

  if (!store.get('pegada-cookies')) cookies.hidden = false;
  $('.cookies-aceptar').addEventListener('click', function () { store.set('pegada-cookies', '1'); cookies.hidden = true; mostrarMando(); });
  $('.pie-cookies').addEventListener('click', function () { cookies.hidden = false; mostrarMando(); $('.cookies-aceptar').focus(); });
  mostrarMando();

  /* ─────────── Mapa solo bajo clic ─────────── */
  var mapaBoton = $('.mapa-boton');
  if (mapaBoton) mapaBoton.addEventListener('click', function () {
    var caja = $('[data-mapa]');
    var f = document.createElement('iframe');
    f.title = 'Mapa: Rúa do Cascallo, 9, Sanxenxo';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    f.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Sanxenxo, Pontevedra') + '&output=embed';
    caja.appendChild(f);
    mapaBoton.remove(); var av = $('.mapa-aviso'); if (av) av.remove();
  });

  /* ─────────── Formulario de muestra ─────────── */
  var form = $('.formulario');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var estado = $('.formulario-estado', form);
    var vacios = $$('input[required]', form).filter(function (i) { return !i.value.trim(); });
    if (vacios.length) { estado.textContent = 'Falta ' + (vacios[0].name === 'nombre' ? 'tu nombre' : 'un teléfono o correo') + '.'; vacios[0].focus(); return; }
    estado.textContent = 'Gracias. Esto es una demo y no se envía nada; en la web real te contestaríamos por WhatsApp en el día.';
    form.reset();
  });

  /* ─────────── Menú móvil ─────────── */
  var navBoton = $('.nav-boton'), navPanel = $('.nav-panel');
  function cerrarMenu() {
    if (!navPanel || !navPanel.classList.contains('abierto')) return;
    navPanel.classList.remove('abierto');
    navBoton.setAttribute('aria-expanded', 'false');
    $('.nav-boton-texto').textContent = 'Menú';
    if (lenis) lenis.start();
  }
  if (navBoton) {
    navBoton.addEventListener('click', function () {
      var abrir = !navPanel.classList.contains('abierto');
      if (!abrir) { cerrarMenu(); navBoton.focus(); return; }
      navPanel.classList.add('abierto');
      navBoton.setAttribute('aria-expanded', 'true');
      $('.nav-boton-texto').textContent = 'Cerrar';
      if (lenis) lenis.stop();
      var primero = $('a', navPanel); if (primero) setTimeout(function () { primero.focus(); }, 60);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && navPanel.classList.contains('abierto')) { cerrarMenu(); navBoton.focus(); } });
  }

  // Cabecera: se aparta al bajar, vuelve al subir.
  var ultimoY = 0;
  function alDesplazar(y) {
    var abajo = y > ultimoY + 4, arriba = y < ultimoY - 4;
    if (y < 120 || arriba) html.classList.remove('cabecera-oculta');
    else if (abajo && !(navPanel && navPanel.classList.contains('abierto'))) html.classList.add('cabecera-oculta');
    if (abajo || arriba) ultimoY = y;
  }
  if (lenis) lenis.on('scroll', function (l) { alDesplazar(l.scroll); });
  else window.addEventListener('scroll', function () { alDesplazar(window.scrollY); }, { passive: true });

  /* ═════════ Char-reveal (IntersectionObserver, no ScrollTrigger once) ═════════ */
  $$('.revela').forEach(function (h) {
    var texto = h.textContent.trim();
    h.setAttribute('aria-label', texto);
    var i = 0;
    h.innerHTML = texto.split(' ').map(function (palabra) {
      return '<span class="p" aria-hidden="true">' + Array.from(palabra).map(function (c) { return '<span class="l" style="--i:' + (i++) + '">' + c + '</span>'; }).join('') + '</span>';
    }).join(' ');
  });
  var ioUnaVez = function (sel, clase, margen) {
    var els = $$(sel); if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add(clase); }); return; }
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add(clase); io.unobserve(en.target); } });
    }, { rootMargin: margen || '0px 0px -12% 0px' });
    els.forEach(function (e) { io.observe(e); });
  };
  ioUnaVez('.revela', 'revelado');

  // Contadores
  $$('.contador').forEach(function (c) {
    var hasta = +c.dataset.hasta;
    if (!(gsapReady && motion)) { c.textContent = hasta; return; }
    c.textContent = '0';
    var io = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return; io.disconnect();
      var o = { v: 0 };
      gsap.to(o, { v: hasta, duration: 1.6, ease: 'power3.out', onUpdate: function () { c.textContent = Math.round(o.v); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    io.observe(c);
  });

  /* ═════════ Pila sticky: mismo alto (el de la más alta, medido), mismo margin-bottom ═════════ */
  var pila = $('[data-pila]');
  function medirPila() {
    if (!pila) return;
    var items = $$('.pila-item', pila);
    pila.style.removeProperty('--alto-tarjeta');
    var max = 0;
    items.forEach(function (it, i) { it.style.setProperty('--n', i); max = Math.max(max, it.getBoundingClientRect().height); });
    pila.style.setProperty('--alto-tarjeta', Math.ceil(max) + 'px');
    // Reposo del último: lo da el ::after del <ul>, no el margin del último hijo.
    pila.style.setProperty('--reposo', Math.round(window.innerHeight * 0.12) + 'px');
  }
  medirPila();
  var anchoPrevio = window.innerWidth;
  var rtimer;
  window.addEventListener('resize', function () {
    clearTimeout(rtimer);
    rtimer = setTimeout(function () {
      revisarDesborde();
      if (Math.abs(window.innerWidth - anchoPrevio) > 2) { anchoPrevio = window.innerWidth; medirPila(); if (gsapReady) ScrollTrigger.refresh(); }
    }, 150);
  });

  /* ═════════ La postura: figura articulada + mapa de apoyos ═════════ */
  var postura = (function () {
    var svg = $('.figura'); if (!svg) return null;
    var L = { tronco: 120, cuello: 41, brazo: 75, antebrazo: 70, muslo: 95, pierna: 95, pie: 34 };
    // Ángulos absolutos en grados (SVG: 0 = derecha, 90 = abajo). C = cerca, L = lejos.
    var P = [
      { tr: -90, cu: -90, bC: 96, aC: 90, bL: 84, aL: 90, mC: 90, pC: 90, fC: 0, mL: 88, pL: 92, fL: 0 },       // de pie
      { tr: -25, cu: -4, bC: 90, aC: 90, bL: 88, aL: 92, mC: 90, pC: 180, fC: 180, mL: 92, pL: 180, fL: 180 }, // cuadrupedia
      { tr: 45, cu: 62, bC: 45, aC: 45, bL: 47, aL: 45, mC: 120, pC: 120, fC: 45, mL: 118, pL: 122, fL: 45 }, // perro
      { tr: 42, cu: 60, bC: 45, aC: 45, bL: 47, aL: 45, mC: 120, pC: 120, fC: 45, mL: -140, pL: -140, fL: -150 }, // tres apoyos
      { tr: 0, cu: 14, bC: 12, aC: 6, bL: 10, aL: 4, mC: 20, pC: 180, fC: 180, mL: 22, pL: 180, fL: 180 }    // niño
    ];
    // Vista desde arriba: posición en la esterilla y % de peso de cada apoyo.
    var A = ['manoI', 'manoD', 'rodI', 'rodD', 'pieI', 'pieD'];
    var ZONA = { manoI: 'manos', manoD: 'manos', rodI: 'rodillas', rodD: 'rodillas', pieI: 'pies', pieD: 'pies' };
    var M = [
      { manoI: [95, 110, 0], manoD: [145, 110, 0], rodI: [100, 260, 0], rodD: [140, 260, 0], pieI: [96, 300, 50], pieD: [144, 300, 50] },
      { manoI: [95, 110, 30], manoD: [145, 110, 30], rodI: [100, 262, 20], rodD: [140, 262, 20], pieI: [100, 330, 0], pieD: [140, 330, 0] },
      { manoI: [92, 90, 22], manoD: [148, 90, 22], rodI: [100, 262, 0], rodD: [140, 262, 0], pieI: [100, 350, 28], pieD: [140, 350, 28] },
      { manoI: [92, 90, 28], manoD: [148, 90, 28], rodI: [100, 262, 0], rodD: [140, 262, 0], pieI: [100, 350, 0], pieD: [140, 350, 44] },
      { manoI: [95, 42, 10], manoD: [145, 42, 10], rodI: [102, 250, 25], rodD: [138, 250, 25], pieI: [104, 345, 15], pieD: [136, 345, 15] }
    ];
    var seg = {}; $$('[data-seg]', svg).forEach(function (p) { seg[p.dataset.seg] = p; });
    var esterillaLado = $('.figura-esterilla', svg), cabeza = $('.cabeza', svg), mono = $('.mono', svg), contactos = $('.figura-contactos', svg);
    var SUELO = 372, ns = 'http://www.w3.org/2000/svg';
    var grupoApoyos = $('.mapa-apoyos');
    var huellas = {};
    A.forEach(function (id) {
      var g = document.createElementNS(ns, 'g');
      g.innerHTML = '<ellipse class="h3"/><ellipse class="h2"/><ellipse class="h1"/><ellipse class="nucleo"/><text text-anchor="middle"></text>';
      grupoApoyos.appendChild(g);
      huellas[id] = { g: g, e: $$('ellipse', g), t: $('text', g) };
    });
    var reparto = {}; $$('.reparto li').forEach(function (li) { reparto[li.dataset.zona] = { barra: $('.reparto-barra span', li), valor: $('.reparto-valor', li) }; });
    var pasos = $$('.paso'), cuenta = $('.pasos-cuenta');
    var botones = $$('.pasos-boton');

    function dif(a, b) { var d = ((b - a + 540) % 360) - 180; return d; }
    function mezcla(a, b, f) { return a + dif(a, b) * f; }
    function dir(g, l) { var r = g * Math.PI / 180; return [Math.cos(r) * l, Math.sin(r) * l]; }
    function suma(p, v) { return [p[0] + v[0], p[1] + v[1]]; }
    function suave(f) { f = Math.min(1, Math.max(0, (f - 0.12) / 0.76)); return f * f * (3 - 2 * f); }

    var actual = -1;
    function pinta(s) {
      s = Math.max(0, Math.min(P.length - 1, s));
      var i = Math.min(P.length - 2, Math.floor(s)), f = suave(s - i);
      var a = P[i], b = P[i + 1], q = {};
      for (var k in a) q[k] = mezcla(a[k], b[k], f);
      var cad = [0, 0];
      var hom = suma(cad, dir(q.tr, L.tronco));
      var cab = suma(hom, dir(q.cu, L.cuello));
      var codoC = suma(hom, dir(q.bC, L.brazo)), munC = suma(codoC, dir(q.aC, L.antebrazo));
      var codoL = suma(hom, dir(q.bL, L.brazo)), munL = suma(codoL, dir(q.aL, L.antebrazo));
      var rodC = suma(cad, dir(q.mC, L.muslo)), tobC = suma(rodC, dir(q.pC, L.pierna)), punC = suma(tobC, dir(q.fC, L.pie));
      var rodL = suma(cad, dir(q.mL, L.muslo)), tobL = suma(rodL, dir(q.pL, L.pierna)), punL = suma(tobL, dir(q.fL, L.pie));
      // Lo más bajo de la figura se posa en la esterilla; la figura se centra.
      var pts = [[munC, 12], [munL, 11], [rodC, 12], [rodL, 11], [tobC, 12], [tobL, 11], [punC, 12], [punL, 11], [cab, 23], [cad, 20], [hom, 20], [codoC, 12]];
      var maxY = -1e9, minX = 1e9, maxX = -1e9;
      pts.forEach(function (p) { maxY = Math.max(maxY, p[0][1] + p[1]); minX = Math.min(minX, p[0][0] - p[1]); maxX = Math.max(maxX, p[0][0] + p[1]); });
      var dx = 320 - (minX + maxX) / 2, dy = SUELO + 4 - maxY; // se hunde 4 px: la esterilla cede
      var T = function (p) { return (p[0] + dx).toFixed(1) + ' ' + (p[1] + dy).toFixed(1); };
      var linea = function (s, a, b) { seg[s].setAttribute('d', 'M' + T(a) + 'L' + T(b)); };
      // El tronco se dibuja un poco más corto para que la cadera y el hombro queden redondos, no cuadrados.
      linea('tronco', suma(cad, dir(q.tr, 6)), suma(hom, dir(q.tr, -4)));
      linea('brazoC1', hom, codoC); linea('brazoC2', codoC, munC);
      linea('brazoL1', hom, codoL); linea('brazoL2', codoL, munL);
      linea('piernaC1', cad, rodC); linea('piernaC2', rodC, tobC); linea('pieC', tobC, punC);
      linea('piernaL1', cad, rodL); linea('piernaL2', rodL, tobL); linea('pieL', tobL, punL);
      cabeza.setAttribute('cx', (cab[0] + dx).toFixed(1)); cabeza.setAttribute('cy', (cab[1] + dy).toFixed(1));
      // Moño en la nuca: dice hacia dónde mira la figura.
      var mo = suma(cab, dir(q.cu + 205, 21));
      mono.setAttribute('cx', (mo[0] + dx).toFixed(1)); mono.setAttribute('cy', (mo[1] + dy).toFixed(1));
      // Puntos de contacto con el suelo, en coral.
      var cont = '', tocan = [];
      [[munC, 12, 'manos'], [munL, 11, 'manos'], [rodC, 12, 'rodillas'], [rodL, 11, 'rodillas'], [tobC, 12, 'pies'], [punC, 12, 'pies'], [punL, 11, 'pies']].forEach(function (p) {
        if (SUELO + 4 - (p[0][1] + dy + p[1]) < 5) { cont += '<circle cx="' + (p[0][0] + dx).toFixed(1) + '" cy="' + (SUELO + 11) + '" r="4.5"/>'; tocan.push([p[0][0] + dx, p[2]]); }
      });
      contactos.innerHTML = cont;

      // Mapa de apoyos
      var zonas = { manos: 0, rodillas: 0, pies: 0 };
      A.forEach(function (id) {
        var m0 = M[i][id], m1 = M[i + 1][id];
        var x = m0[0] + (m1[0] - m0[0]) * f, y = m0[1] + (m1[1] - m0[1]) * f, w = m0[2] + (m1[2] - m0[2]) * f;
        zonas[ZONA[id]] += w;
        var h = huellas[id], r = w > 0.3 ? 5 + Math.sqrt(w) * 3.2 : 0;
        var esPie = ZONA[id] === 'pies', ry = esPie ? 1.45 : 1.15;
        h.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
        [1.0, 0.68, 0.38].forEach(function (k, j) {
          var e = h.e[j];
          e.setAttribute('rx', (r * k).toFixed(2)); e.setAttribute('ry', (r * k * ry).toFixed(2));
          e.setAttribute('stroke-width', j === 0 ? 1.4 : 1.8);
        });
        h.e[3].setAttribute('rx', (r * 0.16).toFixed(2)); h.e[3].setAttribute('ry', (r * 0.16 * ry).toFixed(2));
        h.t.setAttribute('y', (r * ry + 15).toFixed(1));
        h.t.textContent = w > 4 ? Math.round(w) + '%' : '';
      });
      // La esterilla cede bajo cada apoyo, más cuanto más peso carga esa zona.
      var cuenta0 = { manos: 0, rodillas: 0, pies: 0 };
      tocan.forEach(function (t) { cuenta0[t[1]]++; });
      var borde = 'M40 ' + SUELO;
      for (var xs = 40; xs <= 600; xs += 8) {
        var hund = 0;
        tocan.forEach(function (t) { var d = (xs - t[0]) / 26; hund += (1.5 + 9 * zonas[t[1]] / 100 / cuenta0[t[1]]) * Math.exp(-d * d); });
        borde += 'L' + xs + ' ' + (SUELO + Math.min(hund, 7)).toFixed(1);
      }
      esterillaLado.setAttribute('d', borde + 'L600 ' + (SUELO + 12) + 'Q600 ' + (SUELO + 18) + ' 594 ' + (SUELO + 18) + 'L46 ' + (SUELO + 18) + 'Q40 ' + (SUELO + 18) + ' 40 ' + (SUELO + 12) + 'Z');
      for (var z in zonas) {
        reparto[z].barra.style.setProperty('--v', (zonas[z] / 100).toFixed(3));
        reparto[z].valor.textContent = Math.round(zonas[z]) + ' %';
      }
      var activo = Math.round(s);
      if (activo !== actual) {
        actual = activo;
        pasos.forEach(function (p, j) { p.classList.toggle('es-activo', j === activo); });
        if (cuenta) cuenta.textContent = 'Paso ' + (activo + 1) + ' de ' + pasos.length;
        if (botones.length) { botones[0].disabled = activo === 0; botones[1].disabled = activo === pasos.length - 1; }
      }
    }
    pinta(0);
    return { pinta: pinta, total: P.length, get actual() { return actual; } };
  })();
  window.__pegada = { postura: postura, cuadro: function () { return estadoCuadro; } };

  // Botones de paso (sin anclaje, sin GSAP o con movimiento reducido): el contenido sigue cambiando.
  var pasoManual = 0, animPaso = null;
  $$('.pasos-boton').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!postura) return;
      var desde = pasoManual;
      pasoManual = Math.max(0, Math.min(postura.total - 1, pasoManual + +b.dataset.dir));
      if (!motion) { postura.pinta(pasoManual); return; }
      var t0 = performance.now(), hasta = pasoManual;
      cancelAnimationFrame(animPaso);
      (function paso(t) {
        var k = Math.min(1, (t - t0) / 900);
        postura.pinta(desde + (hasta - desde) * (k < 1 ? 0.12 + 0.76 * (1 - Math.pow(1 - k, 3)) : 1));
        if (k < 1) animPaso = requestAnimationFrame(paso);
      })(t0);
    });
  });

  /* ═════════ La esterilla (WebGL) ═════════ */
  var esterilla = (function () {
    var canvas = $('.portada-lienzo'), portada = $('.portada');
    if (!canvas) return null;
    var gl = null;
    try { gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: 'low-power' }); } catch (e) {}
    if (!gl) return null;

    // Altura en textura flotante si se puede; si no, en 8 bits con decaimiento por resta.
    var hf = gl.getExtension('OES_texture_half_float');
    var hfLin = gl.getExtension('OES_texture_half_float_linear');
    gl.getExtension('EXT_color_buffer_half_float');
    var tipo = gl.UNSIGNED_BYTE;
    function prueba(t) {
      var tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 4, 4, 0, gl.RGBA, t, null);
      var fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tx, 0);
      var ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.deleteFramebuffer(fb); gl.deleteTexture(tx);
      return ok;
    }
    if (hf && hfLin && prueba(hf.HALF_FLOAT_OES)) tipo = hf.HALF_FLOAT_OES;
    var ochoBits = tipo === gl.UNSIGNED_BYTE;

    var VS = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
    var SIM = [
      'precision highp float;',
      'uniform sampler2D h;uniform vec2 px;uniform vec2 res;uniform float decae;uniform float resta;',
      'uniform vec4 pr[8];uniform float fr[8];uniform float ang[8];uniform int n;',
      'varying vec2 v;',
      'void main(){',
      ' float c=texture2D(h,v).r;',
      ' float m=(texture2D(h,v+vec2(px.x,0.)).r+texture2D(h,v-vec2(px.x,0.)).r+texture2D(h,v+vec2(0.,px.y)).r+texture2D(h,v-vec2(0.,px.y)).r)*.25;',
      ' float a=max(mix(c,m,.035)*decae-resta,0.);',
      ' for(int i=0;i<8;i++){ if(i>=n) break;',
      '  vec2 d=(v-pr[i].xy)*res; float cs=cos(ang[i]),sn=sin(ang[i]); d=vec2(cs*d.x+sn*d.y,-sn*d.x+cs*d.y);',
      '  d/=pr[i].zw; float g=exp(-dot(d,d)*2.2);',
      '  a+=fr[i]*g*(1.-a);',
      ' }',
      ' gl_FragColor=vec4(min(a,1.),0.,0.,1.);',
      '}'
    ].join('\n');
    var FS = [
      'precision highp float;',
      'uniform sampler2D h;uniform vec2 px;uniform vec2 res;uniform float t;uniform float alien;',
      'uniform vec3 cMat;uniform vec3 cCor;uniform vec4 rect;uniform float rad;uniform float rot;',
      'varying vec2 v;',
      'float hs(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
      'float ns(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hs(i),hs(i+vec2(1,0)),f.x),mix(hs(i+vec2(0,1)),hs(i+vec2(1,1)),f.x),f.y);}',
      'float caja(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}',
      'void main(){',
      ' vec2 fc=v*res;',
      ' vec2 p=fc-rect.xy; float cs=cos(rot),sn=sin(rot); p=vec2(cs*p.x+sn*p.y,-sn*p.x+cs*p.y);',
      ' float d=caja(p,rect.zw,rad);',
      ' float dentro=1.-smoothstep(-1.,1.,d);',
      // altura y gradiente
      ' float hc=texture2D(h,v).r;',
      ' float gx=texture2D(h,v+vec2(px.x,0.)).r-texture2D(h,v-vec2(px.x,0.)).r;',
      ' float gy=texture2D(h,v+vec2(0.,px.y)).r-texture2D(h,v-vec2(0.,px.y)).r;',
      // respiración: una cúpula suave que se hincha con la inhalación
      ' vec2 q=p/(rect.zw*1.1); float dome=exp(-dot(q,q)*1.6);',
      ' vec2 gd=-3.2*q*dome*alien*.55;',
      // grano del caucho
      ' float g1=ns(fc*.55), g2=ns(fc*.55+vec2(.7,0.)), g3=ns(fc*.55+vec2(0.,.7));',
      ' vec3 nrm=normalize(vec3(gx*9.-gd.x*.35-(g2-g1)*.35*(.6+alien*.5), gy*9.-gd.y*.35-(g3-g1)*.35*(.6+alien*.5), 1.));',
      ' vec3 luz=normalize(vec3(-.45,.55,.7));',
      ' float dif=dot(nrm,luz);',
      ' float esp=pow(max(dot(reflect(-luz,nrm),vec3(0.,0.,1.)),0.),18.)*.10;',
      ' vec3 mat=cMat*(.62+.5*dif)*(1.-hc*.22)+esp;',
      ' mat+=cMat*.05*(ns(fc*.012+t*.03)-.5);',
      // canto de la esterilla: el borde alto recoge luz
      ' float canto=smoothstep(-7.,-1.,d)*(1.-smoothstep(-1.,1.,d));',
      ' mat+=canto*.07*(p.y>0.?1.:-.6);',
      // corcho: grano grueso y motas oscuras, con la sombra de la esterilla
      ' float k=ns(fc*.09)*.5+ns(fc*.31)*.35+ns(fc*.9)*.15;',
      ' vec3 cor=cCor*(.86+.22*k); cor*=1.-.32*step(.82,ns(fc*.42+3.));',
      ' vec2 ps=p+vec2(-10.,14.); float ds=caja(ps,rect.zw,rad);',
      ' cor*=1.-.38*(1.-smoothstep(0.,34.,ds));',
      ' gl_FragColor=vec4(mix(cor,mat,dentro),1.);',
      '}'
    ].join('\n');

    function compila(tipoS, src) {
      var s = gl.createShader(tipoS); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
      return s;
    }
    function programa(fs) {
      var pr = gl.createProgram(), a = compila(gl.VERTEX_SHADER, VS), b = compila(gl.FRAGMENT_SHADER, fs);
      if (!a || !b) return null;
      gl.attachShader(pr, a); gl.attachShader(pr, b); gl.bindAttribLocation(pr, 0, 'p'); gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
      var u = {}, nU = gl.getProgramParameter(pr, gl.ACTIVE_UNIFORMS);
      for (var i = 0; i < nU; i++) { var inf = gl.getActiveUniform(pr, i), nom = inf.name.replace('[0]', ''); u[nom] = gl.getUniformLocation(pr, nom); }
      return { p: pr, u: u };
    }
    var pSim = programa(SIM), pDib = programa(FS);
    if (!pSim || !pDib) return null;
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    var W = 0, H = 0, SW = 0, SH = 0, tex = [], fbs = [], cur = 0, dpr = 1;
    var rect = [0, 0, 0, 0], radio = 30, giro = 0;
    function crearSim() {
      tex.forEach(function (t) { gl.deleteTexture(t); }); fbs.forEach(function (f) { gl.deleteFramebuffer(f); });
      tex = []; fbs = [];
      for (var i = 0; i < 2; i++) {
        var t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SW, SH, 0, gl.RGBA, tipo, null);
        var f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
        gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
        tex.push(t); fbs.push(f);
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    // Rectángulo de la esterilla en píxeles del lienzo (origen abajo a la izquierda).
    var movil = false;
    function medir() {
      var r = canvas.getBoundingClientRect();
      var w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
      dpr = Math.min(window.devicePixelRatio || 1, w < 800 ? 2 : 1.5);
      var nW = Math.round(w * dpr), nH = Math.round(h * dpr);
      if (nW === W && nH === H) return;
      W = nW; H = nH; canvas.width = W; canvas.height = H;
      movil = w < 760;
      var esc = Math.min(1, 300 / Math.max(w, h));
      SW = Math.max(64, Math.round(w * esc)); SH = Math.max(64, Math.round(h * esc));
      crearSim();
      var mx = (movil ? 10 : Math.max(16, Math.min(64, w * 0.04))) , top = 80, bot = movil ? 10 : 18;
      var cx = w / 2, cy = (bot + (h - top)) / 2; // en CSS px, y hacia arriba
      rect = [cx * dpr, cy * dpr, (w / 2 - mx) * dpr, ((h - top - bot) / 2) * dpr];
      radio = (movil ? 26 : 34) * dpr;
      giro = 0;
      dibujar(true);
    }
    function color(nombre) {
      var c = getComputedStyle(html).getPropertyValue(nombre).trim().replace('#', '');
      if (c.length === 3) c = c.replace(/./g, '$&$&');
      return [parseInt(c.slice(0, 2), 16) / 255, parseInt(c.slice(2, 4), 16) / 255, parseInt(c.slice(4, 6), 16) / 255];
    }
    var cMat = color('--mar'), cCor = color('--corcho');
    new MutationObserver(function () { cMat = color('--mar'); cCor = color('--corcho'); dibujar(true); }).observe(html, { attributes: true, attributeFilter: ['class'] });

    // Cola de presiones: cada una se aplica varios pasos seguidos (se hunde poco a poco).
    var cola = [];
    function presiona(xCss, yCss, rx, ry, fuerza, angulo, pasos) {
      cola.push({ x: xCss * dpr / W, y: 1 - yCss * dpr / H, rx: rx * dpr / (W / SW), ry: ry * dpr / (W / SW), f: fuerza, a: angulo || 0, n: pasos || 1 });
    }
    // Huellas compuestas: pie y mano, en coordenadas CSS respecto a un centro.
    function huellaPie(x, y, esc, izq, f) {
      var s = izq ? -1 : 1, k = esc;
      presiona(x, y + 26 * k, 11 * k, 14 * k, f, 0, 14);             // talón
      presiona(x + s * 3 * k, y - 4 * k, 9 * k, 16 * k, f * .55, s * .15, 14); // arco externo
      presiona(x + s * 1 * k, y - 26 * k, 14 * k, 10 * k, f, 0, 14);  // metatarsos
      for (var i = 0; i < 4; i++) presiona(x + s * (-12 + i * 8.5) * k, y - (47 - i * 3.2) * k, (i === 0 ? 5.6 : 3.9) * k, (i === 0 ? 6.8 : 4.4) * k, f * .9, 0, 12);
    }
    function huellaMano(x, y, esc, izq, f, giroMano) {
      var s = izq ? -1 : 1, k = esc;
      presiona(x, y, 16 * k, 18 * k, f, 0, 14);
      var dedos = [[-21, -4, -0.9], [-11, -36, -0.2], [0, -41, 0], [11, -37, 0.15], [20, -28, 0.35]];
      dedos.forEach(function (d, i) { presiona(x + s * d[0] * k, y + d[1] * k, 4.2 * k, (i === 0 ? 9 : 11) * k, f * .85, s * d[2] + (giroMano || 0), 12); });
    }

    var acum = 0, tPrev = performance.now(), vivo = true, visible = true, pausa = !motion;
    var DT = 1000 / 60;
    function paso() {
      var lote = cola.splice(0, 8);
      // las presiones de varios pasos vuelven a la cola
      lote.forEach(function (c) { if (--c.n > 0) cola.push(c); });
      gl.useProgram(pSim.p);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbs[1 - cur]); gl.viewport(0, 0, SW, SH);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex[cur]);
      gl.uniform1i(pSim.u.h, 0);
      gl.uniform2f(pSim.u.px, 1 / SW, 1 / SH); gl.uniform2f(pSim.u.res, SW, SH);
      gl.uniform1f(pSim.u.decae, 0.9935); gl.uniform1f(pSim.u.resta, ochoBits ? 0.7 / 255 : 0.00015);
      var pr = new Float32Array(32), fr = new Float32Array(8), an = new Float32Array(8);
      lote.forEach(function (c, i) { pr[i * 4] = c.x; pr[i * 4 + 1] = c.y; pr[i * 4 + 2] = Math.max(.6, c.rx); pr[i * 4 + 3] = Math.max(.6, c.ry); fr[i] = c.f; an[i] = c.a; });
      gl.uniform4fv(pSim.u.pr, pr); gl.uniform1fv(pSim.u.fr, fr); gl.uniform1fv(pSim.u.ang, an); gl.uniform1i(pSim.u.n, lote.length);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      cur = 1 - cur;
    }
    var alientoV = 0.4, t0 = performance.now();
    function dibujar(forzar) {
      if (!W) return;
      gl.useProgram(pDib.p);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, W, H);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex[cur]);
      gl.uniform1i(pDib.u.h, 0);
      gl.uniform2f(pDib.u.px, 1 / SW, 1 / SH); gl.uniform2f(pDib.u.res, W, H);
      gl.uniform1f(pDib.u.t, (performance.now() - t0) / 1000); gl.uniform1f(pDib.u.alien, alientoV);
      gl.uniform3fv(pDib.u.cMat, cMat); gl.uniform3fv(pDib.u.cCor, cCor);
      gl.uniform4fv(pDib.u.rect, rect); gl.uniform1f(pDib.u.rad, radio); gl.uniform1f(pDib.u.rot, giro);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // Respiración: 4 s de inhalación, 6 s de exhalación.
    var faseEl = $('.respira-fase'), faseTxt = '';
    function respiracion(ms) {
      var c = (ms / 1000) % 10, a;
      if (c < 4) a = 0.5 - 0.5 * Math.cos(Math.PI * c / 4); else a = 0.5 + 0.5 * Math.cos(Math.PI * (c - 4) / 6);
      var f = c < 4 ? 'inhala' : 'exhala';
      if (f !== faseTxt && faseEl) { faseTxt = f; faseEl.textContent = f; }
      return a;
    }

    function bucle(ahoraMs) {
      if (!vivo) return;
      requestAnimationFrame(bucle);
      if (!visible || document.hidden) { tPrev = ahoraMs; return; }
      acum += Math.min(100, ahoraMs - tPrev); tPrev = ahoraMs;
      var n = 0;
      while (acum >= DT && n < 4) { paso(); acum -= DT; n++; }
      if (acum > DT) acum = 0;
      alientoV = respiracion(ahoraMs - t0);
      portada.style.setProperty('--aliento', alientoV.toFixed(3));
      dibujar();
    }

    medir();
    if ('ResizeObserver' in window) new ResizeObserver(function () { medir(); }).observe(canvas);
    else window.addEventListener('resize', medir);
    html.classList.add('webgl-ok');

    // Visibilidad: el bucle duerme fuera de pantalla.
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }, { threshold: 0 }).observe(portada);

    // Puntero: pasar roza, pulsar hunde.
    var ultimo = null, pulsado = false;
    function local(e) { var r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
    portada.addEventListener('pointermove', function (e) {
      if (pausa) return;
      var p = local(e);
      var v = ultimo ? Math.hypot(p[0] - ultimo[0], p[1] - ultimo[1]) : 0;
      if (e.pointerType === 'mouse' || pulsado) {
        var f = pulsado ? 0.16 : Math.min(0.05, 0.008 + v * 0.0012);
        presiona(p[0], p[1], pulsado ? 22 : 26, pulsado ? 22 : 26, f, 0, 1);
      }
      ultimo = p;
    });
    portada.addEventListener('pointerdown', function (e) {
      if (e.target.closest('a, button')) return;
      pulsado = true;
      var p = local(e);
      if (pausa) { presionaEstatico(p); return; }
      presiona(p[0], p[1], 30, 34, 0.22, 0, 12);
    });
    window.addEventListener('pointerup', function () { pulsado = false; });
    window.addEventListener('pointercancel', function () { pulsado = false; });

    // Con movimiento reducido no hay bucle: se dibuja un fotograma y se recalcula al pulsar.
    function presionaEstatico(p) {
      presiona(p[0], p[1], 30, 34, 0.22, 0, 12);
      for (var i = 0; i < 14; i++) paso();
      dibujar(true);
    }

    // Huellas de la postura: los pies al entrar, las manos y los pies del perro con el scroll.
    function cssRect() { var r = canvas.getBoundingClientRect(); return { w: r.width, h: r.height }; }
    var marcadas = {};
    function marcaPostura(cual) {
      if (marcadas[cual]) return; marcadas[cual] = true;
      var r = cssRect(), k = movil ? 0.72 : Math.max(0.9, Math.min(1.6, r.w / 950));
      var cx = movil ? r.w * 0.74 : r.w * 0.72, cy = movil ? r.h * 0.17 : r.h * 0.6;
      if (cual === 'pies') { huellaPie(cx - 26 * k, cy, k, true, 0.2); huellaPie(cx + 26 * k, cy, k, false, 0.2); }
      if (cual === 'manos') { huellaMano(cx - 70 * k, cy - 120 * k, k * 0.95, true, 0.2, -0.15); huellaMano(cx + 70 * k, cy - 120 * k, k * 0.95, false, 0.2, 0.15); }
    }
    function arranca() {
      setTimeout(function () { marcaPostura('pies'); }, motion ? 250 : 0);
      if (!motion) {
        marcaPostura('manos');
        for (var i = 0; i < 40; i++) paso();
        alientoV = 0.4; portada.style.setProperty('--aliento', '0.4');
        dibujar(true);
        return;
      }
      requestAnimationFrame(bucle);
    }
    return {
      arranca: arranca,
      scroll: function (p) { if (p > 0.08) marcaPostura('manos'); if (p < 0.02) marcadas.manos = false; },
      estado: function () { return { W: W, H: H, SW: SW, SH: SH, flotante: !ochoBits, visible: visible }; }
    };
  })();
  if (window.__pegada) window.__pegada.esterilla = esterilla;

  /* ═════════ Cortina: la esterilla se enrolla ═════════ */
  function portadaLista() { html.classList.add('portada-lista'); if (esterilla) esterilla.arranca(); }
  var cortina = $('.cortina');
  function quitaCortina() { html.classList.add('cortina-fuera'); }
  if (!motion) {
    portadaLista();
    setTimeout(quitaCortina, 450);
  } else if (!gsapReady) {
    setTimeout(portadaLista, 1000);
    setTimeout(quitaCortina, 1600);
  } else {
    var lamina = $('.cortina-lamina'), rollo = $('.cortina-rollo'), texto = $('.cortina-texto'), marca = $('.cortina-marca');
    var fuentes = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 1200); })]) : Promise.resolve();
    fuentes.then(function () {
      var prog = { p: 0 };
      var tl = gsap.timeline({ onComplete: quitaCortina });
      tl.fromTo(marca, { scale: 0.86 }, { scale: 1.06, duration: 0.9, ease: 'sine.inOut', svgOrigin: '32 32', immediateRender: false })
        .add(function () { texto.textContent = 'exhala'; }, 0.75)
        .to(marca, { scale: 1, duration: 0.5, ease: 'sine.inOut' }, 0.9)
        .to(prog, {
          p: 1, duration: 1.35, ease: 'expo.inOut',
          onUpdate: function () {
            var p = prog.p, alto = window.innerHeight;
            var curva = Math.sin(p * Math.PI) * 18;
            lamina.style.clipPath = 'inset(0 0 ' + (p * 100).toFixed(2) + '% 0 round 0 0 ' + curva.toFixed(1) + 'vw ' + curva.toFixed(1) + 'vw)';
            rollo.style.transform = 'translateY(' + (-(p * (alto + 70))).toFixed(1) + 'px) scaleY(' + (1 + p * 0.7).toFixed(3) + ')';
          }
        }, 1.05)
        .add(portadaLista, 1.75);
    });
  }

  /* ═════════ Todo lo que necesita GSAP + movimiento ═════════ */
  if (gsapReady && motion) {
    // Secuencia anclada de la postura
    var seccionPostura = $('.postura');
    if (postura && seccionPostura) {
      html.classList.add('postura-anclada');
      var barra = document.createElement('div'); barra.className = 'progreso-postura'; barra.setAttribute('aria-hidden', 'true'); barra.innerHTML = '<span></span>';
      $('.postura-fijo').appendChild(barra);
      ScrollTrigger.create({
        trigger: seccionPostura, start: 'top top',
        end: function () { return '+=' + Math.round(window.innerHeight * 3.6); },
        pin: '.postura-fijo', scrub: 0.6, anticipatePin: 1,
        onUpdate: function (st) { postura.pinta(st.progress * (postura.total - 1)); barra.style.setProperty('--p', st.progress.toFixed(3)); }
      });
    }

    // Huellas de la esterilla ligadas al scroll del hero
    ScrollTrigger.create({ trigger: '.portada', start: 'top top', end: 'bottom top', onUpdate: function (st) { if (esterilla) esterilla.scroll(st.progress); } });

    // Pila: la tarjeta de abajo empuja y la de arriba se hunde un poco (sin tocar la opacidad).
    var items = $$('.pila-item');
    items.forEach(function (it, i) {
      if (i === items.length - 1) return;
      gsap.fromTo($('.tarjeta', it), { scale: 1 }, {
        scale: 0.94, ease: 'none', immediateRender: false,
        scrollTrigger: { trigger: items[i + 1], start: 'top bottom', end: 'top top+=' + 140, scrub: true }
      });
    });

    // Transición entre secciones: llegan prensadas y se expanden.
    $$('.cuadro, .bonos, .antes').forEach(function (s) {
      s.classList.add('prensa');
      gsap.fromTo(s, { '--pi': '5%', '--pl': '3.5%', '--pr': '56px' }, {
        '--pi': '0%', '--pl': '0%', '--pr': '0px', ease: 'none', immediateRender: true,
        scrollTrigger: { trigger: s, start: 'top bottom', end: 'top 35%', scrub: 0.4 }
      });
    });

    // Retratos del equipo: suben con parallax suave, distinto en cada uno.
    $$('.persona-retrato').forEach(function (r, i) {
      gsap.fromTo(r, { y: 18 + (i % 2) * 14 }, { y: -18 - (i % 2) * 14, ease: 'none', immediateRender: false, scrollTrigger: { trigger: r, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // Vale: se inclina con el scroll como un papel apoyado
    var vale = $('.vale');
    if (vale) gsap.fromTo(vale, { rotate: -7, y: 60 }, { rotate: -2.5, y: 0, ease: 'none', immediateRender: false, scrollTrigger: { trigger: vale, start: 'top bottom', end: 'center 60%', scrub: 0.5 } });

    // Rastro: las huellas aparecen una tras otra
    $$('.rastro').forEach(function (r) {
      gsap.fromTo($$('g', r), { scale: 0.2, transformOrigin: '50% 50%', autoAlpha: 0 }, {
        scale: 1, autoAlpha: 1, stagger: 0.12, duration: 0.6, ease: 'back.out(2)', immediateRender: true,
        scrollTrigger: { trigger: r, start: 'top 85%', toggleActions: 'play none none reverse' }
      });
    });

    // Imanes
    if (finoRaton) $$('.iman').forEach(function (b) {
      var qx = gsap.quickTo(b, 'x', { duration: 0.6, ease: 'power3.out' }), qy = gsap.quickTo(b, 'y', { duration: 0.6, ease: 'power3.out' });
      b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * 0.32); qy((e.clientY - r.top - r.height / 2) * 0.4); });
      b.addEventListener('pointerleave', function () { qx(0); qy(0); });
    });

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { medirPila(); ScrollTrigger.refresh(); });
    window.addEventListener('load', function () { medirPila(); ScrollTrigger.refresh(); revisarDesborde(); centrarHoy(); });
  } else if (postura) {
    // Sin anclaje: el mismo contenido, con los botones.
    postura.pinta(0);
  }

  /* ─────────── Cinta: velocidad ligada al scroll (solo con movimiento) ─────────── */
  var pista = $('.cinta-pista');
  if (pista && motion) {
    var x = 0, vel = 0, anchoMitad = 0;
    var medirCinta = function () { anchoMitad = pista.scrollWidth / 2; };
    medirCinta(); window.addEventListener('resize', medirCinta);
    if (document.fonts) document.fonts.ready.then(medirCinta);
    var cintaVisible = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { cintaVisible = e[0].isIntersecting; }).observe(pista);
    if (lenis) lenis.on('scroll', function (l) { vel = l.velocity; });
    var tc = performance.now();
    (function cinta(t) {
      requestAnimationFrame(cinta);
      var dt = Math.min(50, t - tc); tc = t;
      if (!cintaVisible || !anchoMitad) return;
      x -= (0.035 + Math.min(1.4, Math.abs(vel) * 0.02)) * dt * (vel < -0.5 ? -1 : 1);
      if (x <= -anchoMitad) x += anchoMitad; if (x > 0) x -= anchoMitad;
      pista.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
      vel *= 0.94;
    })(tc);
  }

  /* ─────────── Cursor propio: punto + aro, nunca en táctil ─────────── */
  var cursor = $('.cursor');
  if (cursor && finoRaton) {
    var punto = $('.cursor-punto'), aro = $('.cursor-aro');
    var mx = -100, my = -100, ax = -100, ay = -100, activo = false;
    var oscuras = '.portada, .postura, .bonos, .pie, .nav-panel.abierto, .cuadro-vivo';
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      if (!activo) { activo = true; html.classList.add('cursor-propio'); ax = e.clientX; ay = e.clientY; requestAnimationFrame(sigue); }
      mx = e.clientX; my = e.clientY;
      var t = e.target;
      html.classList.toggle('cursor-enlace', !!t.closest('a, button, summary, select, input, label'));
      html.classList.toggle('cursor-presiona', !!t.closest('.portada') && !t.closest('a, button, .portada-vivo'));
      html.classList.toggle('cursor-oscuro', !!t.closest(oscuras));
    }, { passive: true });
    document.addEventListener('pointerleave', function () { mx = my = -100; });
    var contexto = function () {
      if (mx < 0) return;
      var t = document.elementFromPoint(mx, my); if (!t) return;
      html.classList.toggle('cursor-enlace', !!t.closest('a, button, summary, select, input, label'));
      html.classList.toggle('cursor-presiona', !!t.closest('.portada') && !t.closest('a, button, .portada-vivo'));
      html.classList.toggle('cursor-oscuro', !!t.closest(oscuras));
    };
    var ctxT = 0;
    window.addEventListener('scroll', function () { var n = performance.now(); if (n - ctxT > 120) { ctxT = n; contexto(); } }, { passive: true });
    window.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || esSobria() || !motion) return;
      if (e.target.closest('.portada')) return; // allí ya se hunde la esterilla
      var h = document.createElement('span'); h.className = 'huella'; h.setAttribute('aria-hidden', 'true');
      h.style.left = e.clientX + 'px'; h.style.top = e.clientY + 'px';
      document.body.appendChild(h);
      h.addEventListener('animationend', function () { h.remove(); });
    });
    var sigue = function () {
      requestAnimationFrame(sigue);
      ax += (mx - ax) * (motion ? 0.2 : 1); ay += (my - ay) * (motion ? 0.2 : 1);
      punto.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      aro.style.transform = 'translate3d(' + ax.toFixed(1) + 'px,' + ay.toFixed(1) + 'px,0)';
    };
  }
})();
