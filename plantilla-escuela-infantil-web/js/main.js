/* =========================================================================
   O Abaneo · escola infantil (plantilla ficticia) — main.js
   Concepto «Móvil»: lo que cuelga se mece y se para.

   Dos banderas separadas (PLIEGO §5):
   - gsapListo: GSAP + ScrollTrigger existen (el CDN respondió).
   - movimiento: el usuario no pide movimiento reducido.
   Los estados «vacíos» del CSS solo existen bajo html.has-motion, que se
   enciende aquí y solo si se cumplen las dos. Lo que es contenido (estado
   abierto/cerrado, día de la adaptación, menú de hoy, contadores) cambia
   siempre, con o sin movimiento.
   ========================================================================= */
(function () {
  'use strict';

  var html = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsapListo = !!(window.gsap && window.ScrollTrigger);
  var movimiento = !reduce;
  var conMovimiento = gsapListo && movimiento;
  var ratonFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (conMovimiento) {
    html.classList.add('has-motion');
    gsap.registerPlugin(ScrollTrigger);
  }

  var guardar = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var leer = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };

  /* ---------------------------------------------------------------------
     Hora de Lalín (Europe/Madrid), venga de donde venga el visitante
     --------------------------------------------------------------------- */
  function horaLalin() {
    var partes = {};
    try {
      new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
        .formatToParts(new Date()).forEach(function (p) { partes[p.type] = p.value; });
    } catch (e) {
      var d = new Date();
      partes = { weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()], hour: d.getHours(), minute: d.getMinutes() };
    }
    var dia = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 }[partes.weekday];
    return { dia: dia, h: (+partes.hour % 24) + (+partes.minute) / 60 };
  }

  /* ---------------------------------------------------------------------
     Estado abierto / cerrado y franja del día (datos vivos)
     --------------------------------------------------------------------- */
  function pintarEstado() {
    var t = horaLalin();
    var laborable = t.dia >= 1 && t.dia <= 5;
    var abierto = laborable && t.h >= 7.5 && t.h < 17.5;
    var texto;
    if (abierto) texto = 'Abierto ahora, hasta las 17:30';
    else if (laborable && t.h < 7.5) texto = 'Cerrado · abre hoy a las 7:30';
    else if (t.dia >= 1 && t.dia <= 4) texto = 'Cerrado · abre mañana a las 7:30';
    else texto = 'Cerrado · abre el lunes a las 7:30';
    $$('[data-estado]').forEach(function (el) {
      el.textContent = texto;
      el.classList.toggle('es-abierto', abierto);
    });
    var franja = $('#dia-franja');
    var actual = null;
    $$('#tendedero li').forEach(function (li) {
      var en = abierto && t.h >= +li.dataset.desde && t.h < +li.dataset.hasta;
      li.classList.toggle('es-ahora', en);
      if (en && !li.hasAttribute('aria-hidden')) actual = li;
    });
    if (franja) {
      franja.textContent = actual
        ? '· Ahora mismo toca: ' + actual.childNodes[2].textContent.trim().toLowerCase() + '.'
        : '';
    }
  }

  /* ---------------------------------------------------------------------
     Cortina: la manta de la siesta. Retirada garantizada.
     --------------------------------------------------------------------- */
  var cortina = $('#cortina');
  var portadaRevelada = false;
  function revelarPortada() {
    if (portadaRevelada) return;
    portadaRevelada = true;
    $$('.portada [data-letras]').forEach(function (el) { el.classList.add('es-colgado'); });
    if (movil) movil.soplo(0.9);
  }
  function retirarCortina() {
    if (cortina) cortina.classList.add('es-retirada');
    revelarPortada();
  }
  /* Red de seguridad: pase lo que pase con GSAP, a los 6 s no hay cortina
     (y la del <head> cubre el caso de que este archivo no llegue a correr) */
  var seguroCortina = setTimeout(retirarCortina, 6000);

  function animarCortina() {
    if (!cortina) return;
    if (!conMovimiento) { retirarCortina(); return; }
    var tela = $('.cortina-tela', cortina);
    var lua = $('.cortina-lua', cortina);
    var pespunte = $('.cortina-pespunte', cortina);
    var texto = $('.cortina-texto', cortina);
    var hilo = $('.cortina-hilo path', cortina);
    var tl = gsap.timeline({ onComplete: retirarCortina });
    /* El hilo baja la lúa: trazo con pathLength=1, así que autoRound:false
       o GSAP redondea el dashoffset a 0/1 y el trazo salta en vez de crecer */
    tl.fromTo(hilo, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .6, ease: 'power2.out', autoRound: false, immediateRender: true }, 0)
      .fromTo(lua, { y: -60 }, { y: 0, duration: .6, ease: 'power2.out', immediateRender: false }, 0)
      .fromTo(pespunte, { scaleX: 0 }, { scaleX: 1, transformOrigin: '0% 50%', duration: .7, ease: 'power2.inOut', immediateRender: true }, .25)
      .fromTo(lua, { rotation: -24 }, { rotation: 0, duration: 1.1, ease: 'elastic.out(1, .35)', immediateRender: false }, .3)
      .to([texto, lua, pespunte, hilo.parentNode], { y: -40, opacity: 0, duration: .45, ease: 'power2.in', stagger: .04 }, .85)
      /* Se levanta por las esquinas primero, el centro cuelga: borde curvo */
      .to(tela, { attr: { d: 'M0 0H1000V420Q500 1180 0 420Z' }, duration: .55, ease: 'power2.in' }, 1)
      .to(tela, { attr: { d: 'M0 0H1000V0Q500 0 0 0Z' }, duration: .85, ease: 'expo.inOut' }, 1.45)
      .add(revelarPortada, 1.75);
    /* La animación arranca: la red de seguridad pasa a medirse desde aquí */
    clearTimeout(window.__cortinaSegura);
    clearTimeout(seguroCortina);
    seguroCortina = setTimeout(retirarCortina, (tl.duration() + 1.2) * 1000);
    window.__cortinaLinea = tl; /* solo para fotografiarla a medias en la verificación */
  }

  /* ---------------------------------------------------------------------
     Partir titulares en letras y palabras (sin romper palabras)
     --------------------------------------------------------------------- */
  function partirLetras(el) {
    var i = 0;
    var palabras = el.textContent.trim().split(/\s+/);
    /* El texto entero, para lectores de pantalla; las letras, solo a la vista
       (aria-label no está permitido en un <span> genérico) */
    var paraLeer = document.createElement('span');
    paraLeer.className = 'oculto';
    paraLeer.textContent = el.textContent.trim();
    el.textContent = '';
    el.appendChild(paraLeer);
    palabras.forEach(function (p, n) {
      var w = document.createElement('span');
      w.className = 'palabra-nw';
      w.setAttribute('aria-hidden', 'true');
      Array.prototype.forEach.call(p, function (c) {
        var s = document.createElement('span');
        s.className = 'letra';
        s.textContent = c;
        s.style.setProperty('--i', i++);
        w.appendChild(s);
      });
      el.appendChild(w);
      if (n < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }
  function partirPalabras(el) {
    var i = 0;
    (function recorre(nodo) {
      Array.prototype.slice.call(nodo.childNodes).forEach(function (h) {
        if (h.nodeType === 3) {
          var frag = document.createDocumentFragment();
          h.textContent.split(/(\s+)/).forEach(function (trozo) {
            if (!trozo) return;
            if (/^\s+$/.test(trozo)) { frag.appendChild(document.createTextNode(' ')); return; }
            var s = document.createElement('span');
            s.className = 'palabra';
            s.textContent = trozo;
            s.style.setProperty('--i', i++);
            frag.appendChild(s);
          });
          nodo.replaceChild(frag, h);
        } else if (h.nodeType === 1) {
          recorre(h);
        }
      });
    })(el);
  }
  $$('[data-letras]').forEach(partirLetras);
  $$('[data-palabras]').forEach(partirPalabras);

  /* «Una sola vez» va con IntersectionObserver, nunca con ScrollTrigger once */
  var ioUnaVez = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      if (el.hasAttribute('data-palabras')) el.classList.add('es-colgado');
      else el.classList.add('es-visible');
      if (el.classList.contains('contador')) contar(el);
      ioUnaVez.unobserve(el);
    });
  }, { threshold: .25 });
  /* La máscara se observa por su padre: con clip-path a 0 el
     IntersectionObserver la ve sin área y no dispara nunca. */
  $$('[data-palabras], .manifiesto, .cocina, .contador').forEach(function (el) { ioUnaVez.observe(el); });

  /* Contadores: con movimiento reducido no cuentan, pero el número está */
  function contar(el) {
    var hasta = +el.dataset.hasta;
    if (!movimiento) { el.textContent = hasta; return; }
    var t0 = performance.now(), dur = 1300;
    (function paso(t) {
      var k = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(hasta * e);
      if (k < 1) requestAnimationFrame(paso);
    })(t0);
  }

  /* ---------------------------------------------------------------------
     Lenis: único motor de scroll (solo con movimiento)
     --------------------------------------------------------------------- */
  var lenis = null;
  var velScroll = 0, ultimoY = window.scrollY;
  if (conMovimiento && window.Lenis) {
    lenis = new Lenis({ lerp: .14, wheelMultiplier: .9 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  function leerVelocidad() {
    if (lenis) return lenis.velocity || 0;
    var y = window.scrollY, v = y - ultimoY;
    ultimoY = y;
    return v;
  }

  /* Anclas: con Lenis, con el desfase de la cabecera */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var destino = $(id);
      if (!destino) return;
      ev.preventDefault();
      cerrarMenu();
      if (lenis) lenis.scrollTo(destino, { offset: id === '#inicio' ? 0 : -60 });
      else destino.scrollIntoView({ behavior: movimiento ? 'smooth' : 'auto' });
      if (id !== '#inicio') { destino.setAttribute('tabindex', '-1'); destino.focus({ preventScroll: true }); }
    });
  });

  /* ---------------------------------------------------------------------
     Cabecera y menú móvil
     --------------------------------------------------------------------- */
  var cab = $('#cab');
  function alScroll() { cab.classList.toggle('es-scroll', window.scrollY > 20); }
  window.addEventListener('scroll', alScroll, { passive: true });
  alScroll();

  var menuBoton = $('#menu-boton'), menu = $('#menu');
  function cerrarMenu() {
    if (!menu.classList.contains('es-abierto')) return;
    menu.classList.remove('es-abierto');
    menuBoton.setAttribute('aria-expanded', 'false');
    if (lenis) lenis.start();
  }
  menuBoton.addEventListener('click', function () {
    var abrir = !menu.classList.contains('es-abierto');
    menu.classList.toggle('es-abierto', abrir);
    menuBoton.setAttribute('aria-expanded', String(abrir));
    if (lenis) { if (abrir) lenis.stop(); else lenis.start(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('es-abierto')) { cerrarMenu(); menuBoton.focus(); }
  });

  /* ---------------------------------------------------------------------
     Cursor propio: punto + aro. Solo ratón; en táctil, nada.
     --------------------------------------------------------------------- */
  var cursor = $('.cursor');
  var cx = -100, cy = -100, ax = -100, ay = -100, cursorVivo = false;
  var punto = $('.cursor-punto'), aro = $('.cursor-aro'), cursorTxt = $('.cursor-txt');
  function moverCursor() {
    ax += (cx - ax) * .2; ay += (cy - ay) * .2;
    punto.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
    aro.style.transform = 'translate3d(' + ax + 'px,' + ay + 'px,0)';
    requestAnimationFrame(moverCursor);
  }
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    cx = e.clientX; cy = e.clientY;
    if (!cursorVivo) {
      cursorVivo = true; ax = cx; ay = cy;
      html.classList.add('cursor-propio');
      requestAnimationFrame(moverCursor);
    }
    var t = e.target;
    var enlace = t.closest && t.closest('a, button, summary, label, select, input, [role="tab"]');
    var enMovil = t.closest && t.closest('.portada') && !enlace;
    var enMapa = t.closest && t.closest('.mapa') && !enlace;
    cursor.classList.toggle('es-enlace', !!enlace);
    cursor.classList.toggle('es-texto', !!(enMovil || enMapa));
    cursorTxt.textContent = enMapa ? 'mapa' : 'sopla';
    cursor.classList.toggle('es-oscuro', !!(t.closest && t.closest('.dia, .pie, .calculadora')));
  }, { passive: true });
  window.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse') cursor.classList.add('es-pulsado'); });
  window.addEventListener('pointerup', function () { cursor.classList.remove('es-pulsado'); });
  /* Tras el scroll, el elemento bajo el cursor cambia aunque el ratón no se mueva */
  window.addEventListener('scroll', function () {
    if (!cursorVivo) return;
    var t = document.elementFromPoint(cx, cy);
    if (!t) return;
    var enlace = t.closest('a, button, summary, label, select, input, [role="tab"]');
    cursor.classList.toggle('es-enlace', !!enlace);
    cursor.classList.toggle('es-texto', !enlace && !!t.closest('.portada, .mapa'));
    cursor.classList.toggle('es-oscuro', !!t.closest('.dia, .pie, .calculadora'));
  }, { passive: true });
  document.addEventListener('mouseleave', function () { punto.style.transform = aro.style.transform = 'translate3d(-100px,-100px,0)'; cx = cy = ax = ay = -100; });

  /* Imán: los botones persiguen un poco al cursor */
  if (conMovimiento && ratonFino) {
    $$('.iman').forEach(function (el) {
      var xTo = gsap.quickTo(el, 'x', { duration: .5, ease: 'power3.out' });
      var yTo = gsap.quickTo(el, 'y', { duration: .5, ease: 'power3.out' });
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * .32);
        yTo((e.clientY - r.top - r.height / 2) * .38);
      });
      el.addEventListener('pointerleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, .32)', overwrite: true });
      });
    });
  }

  /* El titular respira con el cursor: el eje de peso de Playfair (variable)
     engorda las letras que tiene cerca, como el fieltro que se hincha. */
  if (conMovimiento && ratonFino) {
    var letrasPortada = $$('.portada-titulo .letra');
    var centros = [], pendiente = false, mx = -9999, my = -9999;
    var medirLetras = function () {
      centros = letrasPortada.map(function (l) { var r = l.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 + window.scrollY }; });
    };
    var respirar = function () {
      pendiente = false;
      if (!centros.length) medirLetras();
      letrasPortada.forEach(function (l, i) {
        var c = centros[i], dx = c.x - mx, dy = c.y - window.scrollY - my;
        var k = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 280);
        var base = l.closest('.t2') ? 400 : 600;
        l.style.fontWeight = k > 0.01 ? Math.round(base + k * k * 300) : '';
      });
    };
    $('.portada').addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!pendiente) { pendiente = true; requestAnimationFrame(respirar); }
    });
    $('.portada').addEventListener('pointerleave', function () { mx = my = -9999; requestAnimationFrame(respirar); });
    window.addEventListener('resize', function () { centros = []; });
  }

  /* ---------------------------------------------------------------------
     EL MÓVIL (portada): péndulos amortiguados en canvas 2D con giro en
     profundidad. El cursor sopla, el scroll da vueltas a la varilla.
     Rendimiento: cada pieza es un sprite precalculado (fieltro, pespunte y
     sombra difuminada UNA vez); por fotograma solo drawImage y líneas.
     Nada de ctx.filter ni shadowBlur por fotograma.
     --------------------------------------------------------------------- */
  var movil = (function () {
    var cv = $('#movil');
    if (!cv || !cv.getContext) { html.classList.add('sin-canvas'); return null; }
    var ctx = cv.getContext('2d');
    var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2), u = 1, ax0 = 0;
    var css = getComputedStyle(html);
    var col = function (v) { return getComputedStyle(html).getPropertyValue(v).trim(); };

    /* Formas en coordenadas unidad (caja ~100), colgando de (0,0) hacia abajo */
    var FORMAS = {
      lua: function (c) {
        c.beginPath(); c.arc(0, 50, 46, 0, Math.PI * 2); c.fill();
        c.globalCompositeOperation = 'destination-out';
        c.beginPath(); c.arc(20, 42, 38, 0, Math.PI * 2); c.fill();
        c.globalCompositeOperation = 'source-over';
      },
      luaPespunte: function (c) { c.beginPath(); c.arc(0, 50, 39, Math.PI * .45, Math.PI * 1.62); c.stroke(); },
      pera: function (c) {
        c.beginPath();
        c.moveTo(0, 12);
        c.bezierCurveTo(16, 12, 22, 28, 24, 42); c.bezierCurveTo(26, 56, 46, 66, 46, 88);
        c.bezierCurveTo(46, 112, 26, 128, 0, 128); c.bezierCurveTo(-26, 128, -46, 112, -46, 88);
        c.bezierCurveTo(-46, 66, -26, 56, -24, 42); c.bezierCurveTo(-22, 28, -16, 12, 0, 12);
        c.closePath(); c.fill();
      },
      peraPespunte: function (c) { c.beginPath(); c.moveTo(-38, 86); c.bezierCurveTo(-38, 106, -22, 118, 0, 118); c.bezierCurveTo(22, 118, 38, 106, 38, 86); c.stroke(); },
      peraExtra: function (c, tinta) { c.strokeStyle = tinta; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 14); c.quadraticCurveTo(6, 2, 18, 0); c.stroke(); },
      nube: function (c) {
        c.beginPath();
        c.arc(-26, 50, 24, 0, Math.PI * 2); c.arc(4, 38, 32, 0, Math.PI * 2); c.arc(32, 54, 22, 0, Math.PI * 2);
        c.fill();
        c.fillRect(-26, 50, 58, 26);
        c.beginPath(); c.arc(-26, 52, 24, Math.PI * .5, Math.PI * 1.5); c.fill();
      },
      nubePespunte: function (c) { c.beginPath(); c.moveTo(-40, 68); c.lineTo(42, 68); c.stroke(); },
      barco: function (c, tinta) {
        c.beginPath(); c.moveTo(0, 6); c.lineTo(0, 74); c.lineTo(40, 66); c.closePath(); c.fill();
        c.beginPath(); c.moveTo(-6, 22); c.lineTo(-6, 72); c.lineTo(-34, 68); c.closePath(); c.globalAlpha = .75; c.fill(); c.globalAlpha = 1;
        c.fillStyle = tinta; c.beginPath(); c.moveTo(-50, 80); c.lineTo(50, 80); c.lineTo(36, 104); c.lineTo(-36, 104); c.closePath(); c.fill();
      },
      barcoPespunte: function (c) { c.beginPath(); c.moveTo(-40, 88); c.lineTo(40, 88); c.stroke(); },
      peixe: function (c, tinta) {
        c.beginPath(); c.ellipse(-6, 54, 36, 24, 0, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.moveTo(24, 54); c.lineTo(48, 36); c.lineTo(48, 72); c.closePath(); c.fill();
        c.fillStyle = tinta; c.beginPath(); c.arc(-24, 48, 4, 0, Math.PI * 2); c.fill();
      },
      peixePespunte: function (c) { c.beginPath(); c.moveTo(8, 34); c.quadraticCurveTo(16, 54, 8, 74); c.stroke(); }
    };

    /* Piezas: varilla principal y una varilla secundaria (como un Calder) */
    var piezas = [
      { forma: 'lua',   color: '--acento-sup', vara: 0, off: -1,    largo: 150, talla: 96 },
      { forma: 'nube',  color: '#9DB4D6',     vara: 0, off: -.18,  largo: 236, talla: 104 },
      { forma: 'pera',  color: '#E7B44A',     vara: 0, off: .42,   largo: 112, talla: 78 },
      { forma: 'barco', color: '#8FB3A8',     vara: 1, off: -1,    largo: 92,  talla: 88 },
      { forma: 'peixe', color: '#E9B7A6',     vara: 1, off: 1,     largo: 150, talla: 90 }
    ];
    piezas.forEach(function (p, i) {
      p.th = 0; p.vth = 0;                 /* balanceo en el plano */
      p.sg = (i * 1.7) % 6.28; p.vsg = 0;  /* giro sobre su hilo */
      p.sg0 = [.2, -.35, .5, -.15, 3.3][i];
    });
    var vara = { L: 118, B: 236, phi: .5, w: 0 };       /* principal */
    var sub = { L: 64, B: 96, psi: -.4, w: 0, th: 0, vth: 0 };

    function hacerSprite(p) {
      var tam = p.talla * u;
      var esc = tam / 100 * DPR;
      var lado = Math.ceil(140 * esc);
      var mk = function () { var c = document.createElement('canvas'); c.width = lado; c.height = lado; return c; };
      var tinta = col('--tinta') || '#23264A';
      var color = p.color.charAt(0) === '-' ? col(p.color) : p.color;
      var dibuja = function (c, oscuro) {
        var x = c.getContext('2d');
        x.setTransform(esc, 0, 0, esc, lado / 2, 10 * esc);
        x.fillStyle = color;
        FORMAS[p.forma](x, tinta);
        /* grano de fieltro, solo sobre lo pintado */
        x.globalCompositeOperation = 'source-atop';
        var n = 260;
        for (var k = 0; k < n; k++) {
          x.fillStyle = (k % 2) ? 'rgba(255,255,255,.10)' : 'rgba(0,0,0,.07)';
          x.fillRect(Math.random() * 120 - 60, Math.random() * 130, 1.6, 1.6);
        }
        if (oscuro) { x.fillStyle = 'rgba(20,20,40,.16)'; x.fillRect(-70, -10, 140, 150); }
        /* pespunte */
        x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 2.2; x.setLineDash([5, 5]); x.lineCap = 'round';
        if (FORMAS[p.forma + 'Pespunte']) FORMAS[p.forma + 'Pespunte'](x);
        x.setLineDash([]);
        x.globalCompositeOperation = 'source-over';
        if (p.forma === 'pera') FORMAS.peraExtra(x, tinta);
      };
      var frente = mk(); dibuja(frente, false);
      var dorso = mk(); dibuja(dorso, true);
      /* sombra: silueta difuminada UNA sola vez, aquí, nunca por fotograma */
      var sombra = mk();
      var sx = sombra.getContext('2d');
      try { sx.filter = 'blur(' + Math.round(7 * DPR) + 'px)'; } catch (e) {}
      sx.globalAlpha = 1;
      sx.drawImage(frente, 0, 0);
      sx.filter = 'none';
      sx.globalCompositeOperation = 'source-in';
      sx.fillStyle = '#23264A';
      sx.fillRect(0, 0, lado, lado);
      p.spr = { frente: frente, dorso: dorso, sombra: sombra, lado: lado / DPR, top: 10 * esc / DPR };
    }

    function medir() {
      var r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      if (!W || !H) return;
      cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
      var estrecho = W < 560;
      u = Math.min(W * .94 / 640, H * .96 / 470);
      ax0 = estrecho ? W * .5 : W * .5;
      piezas.forEach(hacerSprite);
      if (!corriendo) pintar();
    }

    /* Viento del cursor */
    var vx = 0, vy = 0, px = -9999, py = -9999, ultimoT = 0;
    window.addEventListener('pointermove', function (e) {
      var r = cv.getBoundingClientRect();
      var nx = e.clientX - r.left, ny = e.clientY - r.top;
      var t = performance.now(), dt = Math.max(8, t - ultimoT);
      if (px > -9000) { vx = vx * .5 + (nx - px) / dt * .5; vy = vy * .5 + (ny - py) / dt * .5; }
      px = nx; py = ny; ultimoT = t;
    }, { passive: true });
    $('.portada').addEventListener('pointerdown', function (e) {
      if (e.target.closest('a, button')) return;
      var r = cv.getBoundingClientRect();
      soplo(1, e.clientX - r.left);
    });

    function soplo(fuerza, desdeX) {
      piezas.forEach(function (p, i) {
        var lado = desdeX == null ? (i % 2 ? 1 : -1) : (p.x > desdeX ? 1 : -1);
        p.vth += lado * fuerza * (.6 + Math.random() * .4);
        p.vsg += (Math.random() - .5) * fuerza * 3;
      });
      vara.w += fuerza * .9;
      sub.w -= fuerza * 1.4;
    }

    var corriendo = false, visible = true, t0 = 0, reloj = 0;
    function proyecta(r, ang) { return { x: r * Math.cos(ang), z: r * Math.sin(ang) }; }

    function paso(dt) {
      reloj += dt;
      /* scroll: le da vueltas a la varilla */
      var v = leerVelocidad();
      vara.w += Math.max(-40, Math.min(40, v)) * .004;
      /* torsión del hilo: vuelve despacio a una deriva lenta */
      var objetivo = .5 + Math.sin(reloj * .11) * .8;
      vara.w += (-(vara.phi - objetivo) * .9 - vara.w * .55) * dt;
      vara.phi += vara.w * dt;
      sub.w += (-(sub.psi - vara.phi * .3 + .4) * 1.6 - sub.w * .7) * dt;
      sub.psi += sub.w * dt;
      sub.vth += (-Math.sin(sub.th) * 9.8 / (sub.L * u / 60) - sub.vth * 1.4) * dt;
      sub.th += sub.vth * dt;

      var cerca = 150 * u;
      piezas.forEach(function (p) {
        var g = 9.8 / Math.max(.6, p.largo * u / 60);
        var viento = 0;
        if (px > -9000) {
          var dx = p.x - px, dy = p.y - py, d = Math.sqrt(dx * dx + dy * dy);
          if (d < cerca) {
            var k = 1 - d / cerca;
            viento = vx * k * 7;
            p.vsg += vx * k * .9 * dt * 6;
          }
        }
        p.vth += (-g * Math.sin(p.th) - p.vth * 1.1 + viento) * dt;
        p.th += p.vth * dt;
        p.th = Math.max(-.75, Math.min(.75, p.th));
        p.vsg += (-(p.sg - p.sg0 - Math.sin(reloj * .3 + p.sg0 * 4) * .45) * 1.4 - p.vsg * .9) * dt;
        p.sg += p.vsg * dt;
      });
      vx *= .9; vy *= .9;
    }

    function pintar() {
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, W, H);
      var F = 900 * u;
      var tinta = '#23264A', madera = '#B98E5F';
      var ancla = { x: ax0, y: 0 };
      var centro = { x: ax0, y: vara.L * u };
      var inclin = Math.max(-.12, Math.min(.12, vara.w * .03));

      /* puntos de la varilla principal */
      function enVara(r) {
        var q = proyecta(r * vara.B * u, vara.phi);
        var s = F / (F + q.z);
        return { x: centro.x + q.x * s, y: centro.y + q.x * Math.sin(inclin) * s, z: q.z, s: s };
      }
      var izq = enVara(-1), der = enVara(1);
      var subA = { x: der.x, y: der.y };
      var subC = { x: subA.x + Math.sin(sub.th) * sub.L * u * der.s, y: subA.y + Math.cos(sub.th) * sub.L * u * der.s };
      function enSub(r) {
        var q = proyecta(r * sub.B * u, sub.psi);
        var s = F / (F + q.z + der.z);
        return { x: subC.x + q.x * s, y: subC.y, z: q.z + der.z, s: s };
      }
      var sIzq = enSub(-1), sDer = enSub(1);

      /* hilos y varillas (detrás) */
      ctx.lineCap = 'round';
      ctx.strokeStyle = tinta; ctx.globalAlpha = .75; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(ancla.x, ancla.y); ctx.lineTo(centro.x, centro.y); ctx.moveTo(subA.x, subA.y); ctx.lineTo(subC.x, subC.y); ctx.stroke();
      ctx.globalAlpha = 1;

      /* posiciones de las piezas */
      var lista = piezas.map(function (p) {
        var a = p.vara === 0 ? enVara(p.off) : enSub(p.off);
        var l = p.largo * u * a.s;
        p.ax = a.x; p.ay = a.y;
        p.x = a.x + Math.sin(p.th) * l;
        p.y = a.y + Math.cos(p.th) * l;
        p.z = a.z; p.s = a.s;
        return p;
      }).sort(function (a, b) { return b.z - a.z; });

      /* sombras en la pared: luz arriba a la izquierda */
      var dxS = 26 * u, dyS = 34 * u;
      lista.forEach(function (p) {
        var c = Math.cos(p.sg), ancho = Math.max(.1, Math.abs(c));
        ctx.save();
        ctx.globalAlpha = .13;
        ctx.translate(p.x + dxS, p.y + dyS);
        ctx.rotate(-p.th);
        ctx.scale(ancho * p.s * 1.04, p.s * 1.04);
        ctx.drawImage(p.spr.sombra, -p.spr.lado / 2, -p.spr.top, p.spr.lado, p.spr.lado);
        ctx.restore();
      });

      /* varillas de madera */
      ctx.strokeStyle = madera; ctx.lineWidth = Math.max(3, 5 * u);
      ctx.beginPath(); ctx.moveTo(izq.x, izq.y); ctx.lineTo(der.x, der.y); ctx.stroke();
      ctx.lineWidth = Math.max(2.4, 4 * u);
      ctx.beginPath(); ctx.moveTo(sIzq.x, sIzq.y); ctx.lineTo(sDer.x, sDer.y); ctx.stroke();
      ctx.fillStyle = tinta;
      ctx.beginPath(); ctx.arc(centro.x, centro.y, 3.4 * u, 0, Math.PI * 2); ctx.arc(subC.x, subC.y, 2.8 * u, 0, Math.PI * 2); ctx.fill();

      /* hilos de cada pieza y la pieza */
      lista.forEach(function (p) {
        ctx.strokeStyle = tinta; ctx.globalAlpha = .7; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(p.ax, p.ay); ctx.lineTo(p.x, p.y); ctx.stroke();
        ctx.globalAlpha = 1;
        var c = Math.cos(p.sg), ancho = Math.max(.08, Math.abs(c));
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(-p.th);
        ctx.scale((c < 0 ? -1 : 1) * ancho * p.s, p.s);
        ctx.drawImage(c < 0 ? p.spr.dorso : p.spr.frente, -p.spr.lado / 2, -p.spr.top, p.spr.lado, p.spr.lado);
        ctx.restore();
      });
    }

    var ultimo = 0;
    function bucle(t) {
      if (!corriendo) return;
      var dt = Math.min(1 / 30, (t - (ultimo || t)) / 1000) || 1 / 60;
      ultimo = t;
      /* dos subpasos: más estable sin coste apreciable */
      paso(dt / 2); paso(dt / 2);
      pintar();
      requestAnimationFrame(bucle);
    }
    function arrancar() {
      if (corriendo || !movimiento || !visible || document.hidden) return;
      corriendo = true; ultimo = 0;
      requestAnimationFrame(bucle);
    }
    function parar() { corriendo = false; }

    new ResizeObserver(medir).observe(cv);
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) arrancar(); else parar(); }).observe(cv);
    document.addEventListener('visibilitychange', function () { if (document.hidden) parar(); else arrancar(); });
    medir();
    arrancar();

    return {
      soplo: function (f) { if (movimiento) soplo(f); },
      repintarColor: function () { if (!W) return; piezas.forEach(hacerSprite); if (!corriendo) pintar(); }
    };
  })();

  /* ---------------------------------------------------------------------
     La adaptación: anclada con scrub (GSAP) o, sin GSAP / con movimiento
     reducido, escena sticky + IntersectionObserver. El paso cambia siempre.
     --------------------------------------------------------------------- */
  (function adaptacion() {
    var aula = $('#aula');
    var pasos = $$('.adapta-paso');
    if (!aula || !pasos.length) return;
    var silla = $('.aula-silla', aula);
    var dia = $('#adapta-dia'), barra = $('#adapta-barra'), horas = $('#adapta-horas'), familia = $('#adapta-familia');
    var actual = -1, puntos = [];
    var fmtHoras = function (h) { var n = +h; if (!n) return '0 h'; var e = Math.floor(n), m = Math.round((n - e) * 60); return e + ' h' + (m ? ' ' + m : ''); };
    function poner(i) {
      if (i === actual) return;
      actual = i;
      var li = pasos[i];
      aula.setAttribute('data-paso', i);
      silla.style.setProperty('--x', li.dataset.x + 'px');
      dia.textContent = li.dataset.dia;
      barra.style.setProperty('--p', Math.min(1, li.dataset.horas / 6.5));
      horas.textContent = fmtHoras(li.dataset.horas);
      familia.textContent = li.dataset.familia;
      pasos.forEach(function (p, n) { p.classList.toggle('es-activo', n === i); });
      puntos.forEach(function (p, n) { p.classList.toggle('es-activo', n === i); });
    }
    poner(0);

    if (conMovimiento) {
      var marco = $('.adapta-marco');
      var tira = document.createElement('div');
      tira.className = 'adapta-puntos';
      tira.setAttribute('aria-hidden', 'true');
      pasos.forEach(function () { var i = document.createElement('i'); tira.appendChild(i); puntos.push(i); });
      marco.appendChild(tira);
      puntos[0].classList.add('es-activo');
      ScrollTrigger.create({
        trigger: '.adapta',
        start: 'top top',
        end: function () { return '+=' + Math.round(window.innerHeight * pasos.length * .75); },
        pin: '.adapta-marco',
        scrub: true,
        onUpdate: function (st) { poner(Math.min(pasos.length - 1, Math.floor(st.progress * pasos.length * .999))); }
      });
    } else {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) poner(pasos.indexOf(e.target)); });
      }, { rootMargin: '-40% 0px -50% 0px' });
      pasos.forEach(function (p) { io.observe(p); });
    }
  })();

  /* ---------------------------------------------------------------------
     Pila de aulas: mismo alto para todas (el de la más alta), por JS
     --------------------------------------------------------------------- */
  var pila = $('#pila');
  function medirPila() {
    if (!pila) return;
    pila.style.removeProperty('--alto-pila');
    var alto = 0;
    $$('.aula-tarjeta', pila).forEach(function (t) { alto = Math.max(alto, t.getBoundingClientRect().height); });
    pila.style.setProperty('--alto-pila', Math.ceil(alto) + 'px');
  }
  if (pila) new ResizeObserver(function () { medirPila(); }).observe(pila);

  /* ---------------------------------------------------------------------
     Marquesinas: tendedero del horario y cinta de las voces.
     Velocidad ligada al scroll; las tarjetas del tendedero se mecen.
     --------------------------------------------------------------------- */
  function marquesina(pista, opciones) {
    if (!pista) return;
    var originales = Array.prototype.slice.call(pista.children);
    originales.forEach(function (n) {
      var c = n.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      $$('a, button', c).forEach(function (a) { a.tabIndex = -1; });
      pista.appendChild(c);
    });
    var ancho = 0, x = 0, giro = 0, vgiro = 0, vivo = false;
    function medirAncho() { ancho = pista.scrollWidth / 2; }
    medirAncho();
    new ResizeObserver(medirAncho).observe(pista);
    new IntersectionObserver(function (e) { vivo = e[0].isIntersecting; }).observe(pista);
    var ultimo = 0;
    gsap.ticker.add(function (t) {
      var dt = Math.min(.05, t - (ultimo || t)); ultimo = t;
      if (!vivo) return;
      var v = lenis ? lenis.velocity : 0;
      var dir = opciones.sigueScroll && v < -.5 ? -1 : 1;
      x -= dir * (opciones.base + Math.min(900, Math.abs(v) * opciones.factor)) * dt;
      if (x <= -ancho) x += ancho;
      if (x > 0) x -= ancho;
      pista.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      if (opciones.mece) {
        var objetivo = Math.max(-10, Math.min(10, -v * .45));
        vgiro += ((objetivo - giro) * 40 - vgiro * 6) * dt;
        giro += vgiro * dt;
        pista.style.setProperty('--giro', giro.toFixed(2));
      }
    });
  }
  pintarEstado();
  setInterval(pintarEstado, 60000);
  if (conMovimiento) {
    marquesina($('#tendedero'), { base: 38, factor: 9, mece: true, sigueScroll: false });
    marquesina($('#cinta'), { base: 60, factor: 14, mece: false, sigueScroll: true });
    pintarEstado(); /* marca también las copias */
  } else {
    /* Sin marquesina: la pista desborda y se recorre a mano o con teclado */
    var tend = $('.tendedero');
    var revisaDesborde = function () {
      if (tend.scrollWidth > tend.clientWidth + 2) tend.setAttribute('tabindex', '0');
      else tend.removeAttribute('tabindex');
    };
    revisaDesborde();
    window.addEventListener('resize', revisaDesborde);
  }

  /* ---------------------------------------------------------------------
     Menú de la semana: pestañas accesibles y el de hoy marcado
     --------------------------------------------------------------------- */
  (function menuSemana() {
    var tabs = $$('.menu-pestanas [role="tab"]');
    var paneles = $$('.menu-paneles [role="tabpanel"]');
    if (!tabs.length) return;
    function elegir(i, foco) {
      tabs.forEach(function (t, n) {
        var si = n === i;
        t.setAttribute('aria-selected', String(si));
        t.tabIndex = si ? 0 : -1;
        paneles[n].hidden = !si;
      });
      if (foco) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { elegir(i); });
      t.addEventListener('keydown', function (e) {
        var n = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (n) { e.preventDefault(); elegir((i + n + tabs.length) % tabs.length, true); }
        if (e.key === 'Home') { e.preventDefault(); elegir(0, true); }
        if (e.key === 'End') { e.preventDefault(); elegir(tabs.length - 1, true); }
      });
    });
    var hoy = horaLalin().dia;
    var nota = $('#menu-nota');
    if (hoy >= 1 && hoy <= 5) {
      tabs[hoy - 1].classList.add('es-hoy');
      tabs[hoy - 1].setAttribute('aria-label', tabs[hoy - 1].textContent + ' (hoy)');
      elegir(hoy - 1);
    } else {
      elegir(0);
      nota.textContent = 'Hoy es fin de semana: te enseñamos el del lunes. Menú de muestra; los bebés del aula Lúa lo toman en puré.';
    }
  })();

  /* ---------------------------------------------------------------------
     Calculadora de cuota (de muestra)
     --------------------------------------------------------------------- */
  (function calculadora() {
    var f = $('#calculadora'), num = $('#calc-num');
    if (!f) return;
    var mostrado = 340;
    function calcula() {
      var total = 0;
      $$('input:checked', f).forEach(function (i) { total += +i.value; });
      if (!movimiento) { num.textContent = total; mostrado = total; return; }
      var desde = mostrado, t0 = performance.now();
      mostrado = total;
      (function paso(t) {
        var k = Math.min(1, (t - t0) / 600), e = 1 - Math.pow(1 - k, 3);
        num.textContent = Math.round(desde + (total - desde) * e);
        if (k < 1) requestAnimationFrame(paso);
      })(t0);
    }
    f.addEventListener('change', calcula);
    f.addEventListener('submit', function (e) { e.preventDefault(); });
  })();

  /* ---------------------------------------------------------------------
     Formulario de muestra
     --------------------------------------------------------------------- */
  (function formulario() {
    var f = $('#formulario'), ok = $('#formulario-ok');
    if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var vacio = $$('[required]', f).filter(function (i) { return !i.value.trim(); })[0];
      if (vacio) { vacio.setAttribute('aria-invalid', 'true'); vacio.focus(); ok.hidden = false; ok.textContent = 'Falta tu nombre o tu teléfono.'; return; }
      $$('[aria-invalid]', f).forEach(function (i) { i.removeAttribute('aria-invalid'); });
      var nombre = f.nombre.value.trim().split(' ')[0];
      ok.hidden = false;
      ok.textContent = 'Gracias, ' + nombre + '. Esto es una demostración: no se ha enviado nada. En la escuela de verdad te llamaríamos para confirmar la visita (' + f.visita.value.toLowerCase() + ').';
    });
  })();

  /* ---------------------------------------------------------------------
     Mapa bajo clic: el iframe no existe hasta que se pide
     --------------------------------------------------------------------- */
  var mapaBoton = $('#mapa-boton');
  if (mapaBoton) mapaBoton.addEventListener('click', function () {
    var mapa = $('#mapa');
    var f = document.createElement('iframe');
    f.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Travesa da Lavandeira 6, 36500 Lalín, Pontevedra') + '&output=embed';
    f.title = 'Mapa: Travesa da Lavandeira, 6, Lalín';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    mapa.innerHTML = '';
    mapa.appendChild(f);
  });

  /* ---------------------------------------------------------------------
     Cookies + mandos de demostración
     --------------------------------------------------------------------- */
  var cookies = $('#cookies'), mandos = $('#mandos');
  var enRevision = html.classList.contains('es-revision');
  function mostrarMandos() { if (mandos) mandos.hidden = !(enRevision && cookies.hidden); }
  if (!leer('abaneo-cookies')) cookies.hidden = false;
  $('#cookies-ok').addEventListener('click', function () {
    cookies.hidden = true; guardar('abaneo-cookies', '1'); mostrarMandos();
  });
  $('#cookies-reabrir').addEventListener('click', function () { cookies.hidden = false; mostrarMandos(); $('#cookies-ok').focus(); });
  mostrarMandos();

  /* MANDOS-INICIO */
  /* MANDOS DE DEMOSTRACIÓN — no viajan al sitio de un cliente (README) */
  if (mandos && enRevision) {
    var marcar = function (attr, valor) {
      $$('[' + attr + ']', mandos).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute(attr) === valor)); });
    };
    marcar('data-maqueta', html.classList.contains('maqueta-sobria') ? 'sobria' : 'movil');
    marcar('data-paleta', html.classList.contains('paleta-pino') ? 'pino' : html.classList.contains('paleta-malva') ? 'malva' : 'tomate');
    $$('[data-maqueta]', mandos).forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-maqueta');
        html.classList.toggle('maqueta-sobria', v === 'sobria');
        guardar('abaneo-maqueta', v);
        marcar('data-maqueta', v);
        medirPila();
        if (gsapListo) ScrollTrigger.refresh();
      });
    });
    $$('[data-paleta]', mandos).forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-paleta');
        html.classList.remove('paleta-pino', 'paleta-malva');
        if (v !== 'tomate') html.classList.add('paleta-' + v);
        guardar('abaneo-paleta', v);
        marcar('data-paleta', v);
        if (movil) movil.repintarColor();
      });
    });
    var lt = $('#mando-lt');
    setInterval(function () {
      var l = window.__tareasLargas || [];
      var peor = l.reduce(function (m, e) { return Math.max(m, e.d); }, 0);
      lt.textContent = 'tareas largas: ' + l.length + (l.length ? ' · peor ' + peor + ' ms' : '');
    }, 2000);
  }
  /* MANDOS-FIN */

  /* ---------------------------------------------------------------------
     Arranque: medir desde las fuentes (las tareas largas al cargar suelen
     ser GSAP + webfont, no el código propio)
     --------------------------------------------------------------------- */
  var listo = function () {
    medirPila();
    if (gsapListo) ScrollTrigger.refresh();
    animarCortina();
  };
  /* …pero sin esperar indefinidamente: con una red lenta las fuentes pueden
     tardar segundos, y la cortina no puede quedarse quieta mientras tanto
     (ni retirarse por la red de seguridad antes de animarse). */
  var arrancado = false;
  var unaVez = function () { if (!arrancado) { arrancado = true; listo(); } };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(unaVez);
  setTimeout(unaVez, 1500);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { medirPila(); if (gsapListo) ScrollTrigger.refresh(); });
})();
