/* =========================================================================
   Desenredo · academia de idiomas (plantilla ficticia) — main.js
   Concepto «Descifrar»: lo que todavía no se entiende está revuelto, y
   aprender es ir ordenándolo. Banderas separadas (PLIEGO §5):
   gsapListo (el CDN respondió) y movimiento (sin reduced-motion).
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
  if (conMovimiento) { html.classList.add('has-motion'); gsap.registerPlugin(ScrollTrigger); }
  var guardar = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var leer = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var LETRAS = 'abcdefghijklmnopqrstuvwxyz';
  var azar = function (n) { var s = ''; for (var i = 0; i < n; i++) s += LETRAS[(Math.random() * 26) | 0]; return s; };
  var revolver = function (palabra) { return palabra.replace(/[A-Za-zÁÉÍÓÚáéíóúñÑ]/g, function (c) { var r = LETRAS[(Math.random() * 26) | 0]; return c === c.toUpperCase() ? r.toUpperCase() : r; }); };

  /* ---------------- Estado abierto/cerrado (hora de Ourense) ---------------- */
  function horaOurense() {
    var p = {};
    try { new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; }); }
    catch (e) { var d = new Date(); p = { weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()], hour: d.getHours(), minute: d.getMinutes() }; }
    return { dia: { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 }[p.weekday], h: (+p.hour % 24) + (+p.minute) / 60 };
  }
  function pintarEstado() {
    var t = horaOurense();
    var abierto = (t.dia >= 1 && t.dia <= 4 && ((t.h >= 9.5 && t.h < 13.5) || (t.h >= 16 && t.h < 21.5))) || (t.dia === 5 && t.h >= 9.5 && t.h < 14);
    $$('[data-estado]').forEach(function (el) { el.textContent = abierto ? 'Abierto ahora' : 'Cerrado ahora'; el.classList.toggle('es-abierto', abierto); });
  }
  pintarEstado(); setInterval(pintarEstado, 60000);

  /* ---------------- Cortina: la hoja de libreta ---------------- */
  var cortina = $('#cortina');
  var portadaLista = false;
  function revelarPortada() {
    if (portadaLista) return; portadaLista = true;
    var t = $('.portada-titulo'); if (t) descifrar(t);
  }
  function retirarCortina() { if (cortina) cortina.classList.add('es-retirada'); revelarPortada(); }
  var seguroCortina = setTimeout(retirarCortina, 6000);
  function animarCortina() {
    if (!conMovimiento || !cortina) { retirarCortina(); return; }
    var trazo = $('.cortina-subrayado path', cortina), papel = $('.cortina-papel', cortina), texto = $('.cortina-centro', cortina);
    var tl = gsap.timeline({ onComplete: retirarCortina });
    /* El boli subraya: pathLength=1, así que autoRound:false o salta 1→0 */
    tl.fromTo(trazo, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .7, ease: 'power2.inOut', autoRound: false, immediateRender: true }, .15)
      .add(function () { cortina.classList.add('es-pasando'); }, 1)
      .to(texto, { xPercent: -30, opacity: 0, duration: .5, ease: 'power2.in' }, 1)
      /* La hoja pasa: el canto derecho se curva y barre hacia la izquierda */
      .to(papel, { attr: { d: 'M0 0H620Q380 500 620 1000H0Z' }, duration: .45, ease: 'power2.in' }, 1)
      .to(papel, { attr: { d: 'M0 0H0Q-200 500 0 1000H0Z' }, duration: .8, ease: 'expo.inOut' }, 1.4)
      .add(revelarPortada, 1.6);
    clearTimeout(window.__cortinaSegura); clearTimeout(seguroCortina);
    seguroCortina = setTimeout(retirarCortina, (tl.duration() + 1.2) * 1000);
    window.__cortinaLinea = tl; /* solo para fotografiarla a medias en la verificación */
  }

  /* ---------------- Descifrado de titulares (char-reveal) ----------------
     Cada titular se parte en letras (sin romper palabras) y, al entrar,
     las letras pasan revueltas y se van fijando de izquierda a derecha. */
  function partir(el) {
    var i = 0;
    var paraLeer = document.createElement('span');
    paraLeer.className = 'oculto'; paraLeer.textContent = el.textContent.replace(/\s+/g, ' ').trim();
    (function recorre(nodo) {
      Array.prototype.slice.call(nodo.childNodes).forEach(function (h) {
        if (h.nodeType === 3) {
          var frag = document.createDocumentFragment();
          h.textContent.split(/(\s+)/).forEach(function (trozo) {
            if (!trozo) return;
            if (/^\s+$/.test(trozo)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'pal'; w.setAttribute('aria-hidden', 'true');
            Array.prototype.forEach.call(trozo, function (c) { var s = document.createElement('span'); s.className = 'l'; s.textContent = c; s.dataset.c = c; s.dataset.i = i++; w.appendChild(s); });
            frag.appendChild(w);
          });
          nodo.replaceChild(frag, h);
        } else if (h.nodeType === 1) recorre(h);
      });
    })(el);
    el.insertBefore(paraLeer, el.firstChild);
  }
  function descifrar(el) {
    el.classList.add('es-descifrado');
    /* En la maqueta sobria, el revuelto solo donde significa algo (portada y la sección que lo explica) */
    var sobria = /* MANDOS-INICIO */ html.classList.contains('maqueta-sobria') || /* MANDOS-FIN */ false;
    if (!conMovimiento || (sobria && !el.closest('.descifrar, .portada'))) return;
    var letras = $$('.l', el), t0 = performance.now(), dur = 700 + letras.length * 18;
    (function paso(t) {
      var k = (t - t0) / dur, quedan = 0;
      letras.forEach(function (l, n) {
        var fija = k > (n / letras.length) * .8 + .2;
        if (fija || /[\s.,:;!?«»]/.test(l.dataset.c)) l.textContent = l.dataset.c;
        else { quedan++; l.textContent = Math.random() < .5 ? l.dataset.c : revolver(l.dataset.c); }
      });
      if (quedan && k < 1.2) requestAnimationFrame(paso); else letras.forEach(function (l) { l.textContent = l.dataset.c; });
    })(t0);
  }
  $$('[data-descifra]').forEach(partir);
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      if (e.target.matches('[data-descifra]')) { if (!e.target.closest('.portada')) descifrar(e.target); }
      else e.target.classList.add('es-visible');
      io.unobserve(e.target);
    });
  }, { threshold: .3 });
  $$('[data-descifra], .pauta').forEach(function (el) { io.observe(el); });
  $$('.pauta td.si').forEach(function (td, n) { td.style.setProperty('--d', n); });

  /* ---------------- Lenis ---------------- */
  var lenis = null;
  if (conMovimiento && window.Lenis) {
    lenis = new Lenis({ lerp: .14 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  var ultimoY = window.scrollY;
  function velocidad() { if (lenis) return lenis.velocity || 0; var y = window.scrollY, v = y - ultimoY; ultimoY = y; return v; }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href'), d = id.length > 1 && $(id);
      if (!d) return;
      ev.preventDefault(); cerrarMenu();
      if (lenis) lenis.scrollTo(d, { offset: id === '#inicio' ? 0 : -60 }); else d.scrollIntoView({ behavior: movimiento ? 'smooth' : 'auto' });
      if (id !== '#inicio') { d.setAttribute('tabindex', '-1'); d.focus({ preventScroll: true }); }
    });
  });

  /* ---------------- Cabecera y menú ---------------- */
  var cab = $('#cab');
  var alScroll = function () { cab.classList.toggle('es-scroll', window.scrollY > 20); };
  window.addEventListener('scroll', alScroll, { passive: true }); alScroll();
  var menuBoton = $('#menu-boton'), menu = $('#menu');
  function cerrarMenu() { if (!menu.classList.contains('es-abierto')) return; menu.classList.remove('es-abierto'); menuBoton.setAttribute('aria-expanded', 'false'); if (lenis) lenis.start(); }
  menuBoton.addEventListener('click', function () {
    var abrir = !menu.classList.contains('es-abierto');
    menu.classList.toggle('es-abierto', abrir); menuBoton.setAttribute('aria-expanded', String(abrir));
    if (lenis) { if (abrir) lenis.stop(); else lenis.start(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('es-abierto')) { cerrarMenu(); menuBoton.focus(); } });

  /* ---------------- Cursor propio (solo ratón) ---------------- */
  var cursor = $('.cursor'), punto = $('.cursor-punto'), aro = $('.cursor-aro'), ctxt = $('.cursor-txt');
  var cx = -100, cy = -100, ax = -100, ay = -100, vivo = false;
  function mover() { ax += (cx - ax) * .2; ay += (cy - ay) * .2; punto.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)'; aro.style.transform = 'translate3d(' + ax + 'px,' + ay + 'px,0)'; requestAnimationFrame(mover); }
  function estadoCursor(t) {
    if (!t || !t.closest) return;
    var enlace = t.closest('a, button, summary, label, input');
    cursor.classList.toggle('es-enlace', !!enlace);
    var enPortada = !enlace && t.closest('.portada'), enTexto = !enlace && t.closest('.descifrar-hoja');
    cursor.classList.toggle('es-texto', !!(enPortada || enTexto));
    ctxt.textContent = enTexto ? 'lee' : 'enreda';
    cursor.classList.toggle('es-oscuro', !!t.closest('.prueba, .pie'));
  }
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    cx = e.clientX; cy = e.clientY;
    if (!vivo) { vivo = true; ax = cx; ay = cy; html.classList.add('cursor-propio'); requestAnimationFrame(mover); }
    estadoCursor(e.target);
  }, { passive: true });
  window.addEventListener('scroll', function () { if (vivo) estadoCursor(document.elementFromPoint(cx, cy)); }, { passive: true });

  if (conMovimiento && ratonFino) {
    $$('.iman').forEach(function (el) {
      var xTo = gsap.quickTo(el, 'x', { duration: .5, ease: 'power3.out' }), yTo = gsap.quickTo(el, 'y', { duration: .5, ease: 'power3.out' });
      el.addEventListener('pointermove', function (e) { var r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .3); yTo((e.clientY - r.top - r.height / 2) * .35); });
      el.addEventListener('pointerleave', function () { gsap.to(el, { x: 0, y: 0, duration: .9, ease: 'elastic.out(1, .4)', overwrite: true }); });
    });
  }

  /* ---------------------------------------------------------------------
     PORTADA: el saludo en partículas de tinta. Se escribe «Bos días» y se
     reordena en otro idioma cada pocos segundos; el cursor lo enreda y las
     partículas vuelven solas a su sitio. Puntos con fillRect: sin filtros
     ni sombras por fotograma.
     --------------------------------------------------------------------- */
  var SALUDOS = [['Bos días', 'en gallego'], ['Good morning', 'en inglés'], ['Bonjour', 'en francés'], ['Guten Morgen', 'en alemán'], ['Bom dia', 'en portugués'], ['Buenos días', 'en español']];
  var saludo = (function () {
    var cv = $('#saludo'); if (!cv || !cv.getContext) return null;
    var ctx = cv.getContext('2d'), W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
    var parts = [], destino = 0, corriendo = false, visible = true, mx = -9999, my = -9999, cambio = 0;
    var etiqueta = $('#saludo-texto');
    /* Las partículas son la pauta de la libreta (azul) con alguna gota roja:
       una capa por detrás del titular, no un dibujo al lado */
    var colTinta = '#9AB3CC', colAcento = getComputedStyle(html).getPropertyValue('--acento-sup').trim();
    function puntos(texto) {
      var off = document.createElement('canvas'), o = off.getContext('2d');
      off.width = Math.max(1, Math.round(W)); off.height = Math.max(1, Math.round(H));
      var fs = Math.min(W * .96 / (texto.length * .42), H * .5);
      o.font = 'italic ' + fs + 'px "Instrument Serif", Georgia, serif';
      o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillStyle = '#000';
      o.fillText(texto, W * .5, H * (W < 700 ? .5 : .34));
      var d = o.getImageData(0, 0, off.width, off.height).data, paso = Math.max(3, Math.round(fs / 26)), res = [];
      for (var y = 0; y < off.height; y += paso) for (var x = 0; x < off.width; x += paso) if (d[(y * off.width + x) * 4 + 3] > 128) res.push([x, y]);
      return res;
    }
    var maxN = 0;
    function preparar(i) {
      destino = i;
      var p = puntos(SALUDOS[i][0]);
      maxN = Math.max(maxN, p.length);
      while (parts.length < p.length) parts.push({ x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, tx: 0, ty: 0, r: Math.random() });
      parts.forEach(function (q, n) {
        var t = p[n % p.length];
        q.tx = t[0] + (n >= p.length ? (Math.random() - .5) * 2 : 0); q.ty = t[1]; q.sobra = n >= p.length;
      });
      if (etiqueta) etiqueta.textContent = '«' + SALUDOS[i][0] + '», ' + SALUDOS[i][1];
      cambio = performance.now();
    }
    function medir() {
      var r = cv.getBoundingClientRect(); W = r.width; H = r.height; if (!W || !H) return;
      cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
      parts = []; preparar(destino);
      if (!movimiento) parts.forEach(function (q) { q.x = q.tx; q.y = q.ty; });
      if (!corriendo) pintar();
    }
    function pintar() {
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = colTinta;
      for (var n = 0; n < parts.length; n++) { var q = parts[n]; if (q.sobra) continue; var s = q.r < .06 ? 3.6 : 2.8; if (q.r < .06) { ctx.fillStyle = colAcento; ctx.fillRect(q.x - 1.8, q.y - 1.8, s, s); ctx.fillStyle = colTinta; } else ctx.fillRect(q.x - 1.4, q.y - 1.4, s, s); }
    }
    function paso() {
      var v = Math.max(-30, Math.min(30, velocidad())) * .25, R = Math.min(W, H) * .22;
      for (var n = 0; n < parts.length; n++) {
        var q = parts[n];
        var dx = q.tx - q.x, dy = q.ty - q.y;
        q.vx += dx * .045; q.vy += dy * .045;
        var ex = q.x - mx, ey = q.y - my, d2 = ex * ex + ey * ey;
        if (d2 < R * R) { var d = Math.sqrt(d2) || 1, f = (1 - d / R) * 9; q.vx += ex / d * f; q.vy += ey / d * f; }
        q.vy += v * (q.r - .5);
        q.vx *= .78; q.vy *= .78; q.x += q.vx; q.y += q.vy;
      }
    }
    function bucle(t) {
      if (!corriendo) return;
      if (t - cambio > 3400) preparar((destino + 1) % SALUDOS.length);
      paso(); pintar(); requestAnimationFrame(bucle);
    }
    function arrancar() { if (corriendo || !movimiento || !visible || document.hidden) return; corriendo = true; requestAnimationFrame(bucle); }
    window.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; }, { passive: true });
    $('.portada').addEventListener('pointerleave', function () { mx = my = -9999; });
    $('.portada').addEventListener('click', function (e) { if (!e.target.closest('a, button') && movimiento) preparar((destino + 1) % SALUDOS.length); });
    new ResizeObserver(medir).observe(cv);
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) arrancar(); else corriendo = false; }).observe(cv);
    document.addEventListener('visibilitychange', function () { if (document.hidden) corriendo = false; else arrancar(); });
    var iniciar = function () { medir(); arrancar(); };
    if (document.fonts && document.fonts.load) document.fonts.load('italic 40px "Instrument Serif"').then(iniciar, iniciar); else iniciar();
    return { color: function () { colAcento = getComputedStyle(html).getPropertyValue('--acento-sup').trim(); if (!corriendo) pintar(); } };
  })();

  /* ---------------------------------------------------------------------
     DESCIFRAR: el mismo texto de A1 a C1. Anclado con scrub (GSAP); sin
     GSAP o con movimiento reducido, el nivel lo da la posición de la hoja en
     la pantalla. El nivel cambia siempre, haya movimiento o no.
     --------------------------------------------------------------------- */
  (function niveles() {
    var palabras = $$('#texto-ingles span'), notas = $$('#notas li'), nivelEl = $('#nivel'), pctEl = $('#porcentaje');
    if (!palabras.length) return;
    var NOMBRES = ['A1', 'A2', 'B1', 'B2', 'C1'], actual = -1, ruido = null, pct = 0;
    palabras.forEach(function (s) { s.dataset.w = s.textContent; });
    function poner(i) {
      if (i === actual) return;
      var antes = actual; actual = i;
      var n = i + 1, entendidas = 0;
      palabras.forEach(function (s) {
        var ok = +s.dataset.n <= n;
        s.classList.toggle('es-ruido', !ok);
        s.classList.toggle('es-nuevo', ok && +s.dataset.n === n && antes !== -1);
        if (ok) { s.textContent = s.dataset.w; entendidas++; } else s.textContent = revolver(s.dataset.w);
      });
      nivelEl.textContent = NOMBRES[i];
      var meta = Math.round(entendidas / palabras.length * 100);
      if (movimiento) { var desde = pct, t0 = performance.now(); (function p(t) { var k = Math.min(1, (t - t0) / 500); pctEl.textContent = Math.round(desde + (meta - desde) * k); if (k < 1) requestAnimationFrame(p); })(t0); }
      else pctEl.textContent = meta;
      pct = meta;
      notas.forEach(function (li) { var m = +li.dataset.n; li.classList.toggle('es-pendiente', m > n); li.classList.toggle('es-ultima', m === n); });
    }
    poner(0);
    /* El ruido se mueve (letras que cambian) solo mientras se ve y con movimiento */
    if (movimiento) {
      var hoja = $('.descifrar-hoja'), enVista = false;
      new IntersectionObserver(function (e) { enVista = e[0].isIntersecting; }).observe(hoja);
      ruido = setInterval(function () { if (!enVista) return; palabras.forEach(function (s) { if (s.classList.contains('es-ruido') && Math.random() < .35) s.textContent = revolver(s.dataset.w); }); }, 140);
    }
    if (conMovimiento) {
      ScrollTrigger.create({
        trigger: '.descifrar', start: 'top top',
        end: function () { return '+=' + Math.round(window.innerHeight * 3.2); },
        pin: '.descifrar-marco', scrub: true,
        onUpdate: function (st) { poner(Math.min(4, Math.floor(st.progress * 5 * .999))); }
      });
    } else {
      /* Sin anclaje: el nivel avanza conforme la hoja recorre la pantalla */
      var hojaB = $('.descifrar-hoja');
      var calc = function () { var r = hojaB.getBoundingClientRect(), k = 1 - (r.top + r.height / 2) / window.innerHeight; poner(Math.max(0, Math.min(4, Math.floor((k + .1) * 5)))); };
      window.addEventListener('scroll', calc, { passive: true }); calc();
    }
  })();

  /* ---------------- Cinta de saludos (ligada al scroll) ---------------- */
  if (conMovimiento) {
    var pista = $('#cinta');
    Array.prototype.slice.call(pista.children).forEach(function (n) { var c = n.cloneNode(true); c.setAttribute('aria-hidden', 'true'); pista.appendChild(c); });
    var x = 0, ancho = 0, enVista = false, ult = 0;
    var medirC = function () { ancho = pista.scrollWidth / 2; }; medirC(); new ResizeObserver(medirC).observe(pista);
    new IntersectionObserver(function (e) { enVista = e[0].isIntersecting; }).observe(pista);
    gsap.ticker.add(function (t) {
      var dt = Math.min(.05, t - (ult || t)); ult = t; if (!enVista || !ancho) return;
      var v = lenis ? lenis.velocity : 0, dir = v < -.5 ? -1 : 1;
      x -= dir * (55 + Math.min(900, Math.abs(v) * 14)) * dt;
      if (x <= -ancho) x += ancho; if (x > 0) x -= ancho;
      pista.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
    });
  }

  /* ---------------- Prueba de nivel: se corrige en rojo ---------------- */
  (function test() {
    var f = $('#test'), res = $('#test-resultado'); if (!f) return;
    f.addEventListener('change', function (e) { var fs = e.target.closest('fieldset'); $$('label', fs).forEach(function (l) { l.classList.toggle('es-elegida', l.contains(e.target)); }); fs.classList.remove('es-bien', 'es-mal'); $('.correccion', fs).textContent = ''; });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var bien = 0, contestadas = 0;
      $$('fieldset', f).forEach(function (fs) {
        var el = $('input:checked', fs), c = $('.correccion', fs);
        if (!el) { c.textContent = 'Sin contestar.'; fs.classList.remove('es-bien', 'es-mal'); return; }
        contestadas++;
        var ok = el.value === fs.dataset.correcta; if (ok) bien++;
        fs.classList.toggle('es-bien', ok); fs.classList.toggle('es-mal', !ok);
        c.textContent = ok ? fs.dataset.ok || c.dataset.ok : c.dataset.ko;
      });
      res.textContent = contestadas < 3 ? 'Contesta las tres y vuelve a corregir.' : (bien + ' de 3. ' + (bien === 3 ? 'Apunta alto: B1 o más. Lo confirmamos en la prueba oral.' : bien === 2 ? 'Rondas el A2–B1. La prueba oral lo afina.' : 'Empezaríamos por A1–A2, sin prisa.'));
    });
  })();

  /* ---------------- Mapa bajo clic ---------------- */
  $('#mapa-boton').addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Rúa do Tinteiro 9, 32005 Ourense') + '&output=embed';
    f.title = 'Mapa: Rúa do Tinteiro, 9, Ourense'; f.loading = 'lazy';
    var m = $('#mapa'); m.innerHTML = ''; m.appendChild(f);
  });

  /* ---------------- Cookies + mandos ---------------- */
  var cookies = $('#cookies'), mandos = $('#mandos'), enRevision = html.classList.contains('es-revision');
  function mostrarMandos() { if (mandos) mandos.hidden = !(enRevision && cookies.hidden); }
  if (!leer('desenredo-cookies')) cookies.hidden = false;
  $('#cookies-ok').addEventListener('click', function () { cookies.hidden = true; guardar('desenredo-cookies', '1'); mostrarMandos(); });
  $('#cookies-reabrir').addEventListener('click', function () { cookies.hidden = false; mostrarMandos(); $('#cookies-ok').focus(); });
  mostrarMandos();
  /* MANDOS-INICIO */
  /* MANDOS DE DEMOSTRACIÓN — no viajan al sitio de un cliente (README) */
  if (mandos && enRevision) {
    var marcar = function (attr, v) { $$('[' + attr + ']', mandos).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute(attr) === v)); }); };
    marcar('data-maqueta', html.classList.contains('maqueta-sobria') ? 'sobria' : 'descifrar');
    marcar('data-paleta', html.classList.contains('paleta-azul') ? 'azul' : html.classList.contains('paleta-verde') ? 'verde' : 'rojo');
    $$('[data-maqueta]', mandos).forEach(function (b) { b.addEventListener('click', function () { var v = b.getAttribute('data-maqueta'); html.classList.toggle('maqueta-sobria', v === 'sobria'); guardar('desenredo-maqueta', v); marcar('data-maqueta', v); if (gsapListo) ScrollTrigger.refresh(); }); });
    $$('[data-paleta]', mandos).forEach(function (b) { b.addEventListener('click', function () { var v = b.getAttribute('data-paleta'); html.classList.remove('paleta-azul', 'paleta-verde'); if (v !== 'rojo') html.classList.add('paleta-' + v); guardar('desenredo-paleta', v); marcar('data-paleta', v); if (saludo) saludo.color(); }); });
    var lt = $('#mando-lt');
    setInterval(function () { var l = window.__tareasLargas || [], peor = l.reduce(function (m, e) { return Math.max(m, e.d); }, 0); lt.textContent = 'tareas largas: ' + l.length + (l.length ? ' · peor ' + peor + ' ms' : ''); }, 2000);
  }
  /* MANDOS-FIN */

  /* ---------------- Arranque: con las fuentes o a los 1,5 s ---------------- */
  var arrancado = false;
  var listo = function () { if (arrancado) return; arrancado = true; if (gsapListo) ScrollTrigger.refresh(); animarCortina(); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(listo);
  setTimeout(listo, 1500);
})();
