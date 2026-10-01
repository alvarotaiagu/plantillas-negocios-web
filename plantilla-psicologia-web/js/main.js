/* =========================================================================
   Debandoira (FICTICIO) — main.js
   Sin framework. GSAP + ScrollTrigger + Lenis por CDN (jsDelivr), opcionales:
   si no llegan, la página se lee entera (los estados «vacíos» viven bajo
   html.has-motion, que solo se enciende aquí tras comprobar que existen).
   Dos banderas separadas: gsapReady (hay librerías) y motion (el usuario no
   pide movimiento reducido). Con movimiento reducido se apaga el movimiento,
   no el contenido: horario, conmutador, contadores y mapa siguen funcionando.
   ========================================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsapReady = !!(window.gsap && window.ScrollTrigger);
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Tareas largas: se miden, no se suponen ---------- */
  window.__longtasks = [];
  try {
    new PerformanceObserver(function (list) {
      list.getEntries().forEach(function (e) { window.__longtasks.push({ start: Math.round(e.startTime), dur: Math.round(e.duration) }); });
    }).observe({ type: 'longtask', buffered: true });
  } catch (e) {}

  if (gsapReady && motion) {
    gsap.registerPlugin(ScrollTrigger);
    root.classList.add('has-motion');
  }

  /* ---------- Lenis: único motor de scroll ---------- */
  var lenis = null;
  if (motion && window.Lenis) {
    lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
    if (gsapReady) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    }
  }
  window.__lenis = lenis;
  function alto(sel) { var c = $('.cabecera'); return c ? c.offsetHeight : 0; }
  function irA(destino) {
    var el = typeof destino === 'string' ? $(destino) : destino;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -alto() + 1, duration: 1.4 });
    else el.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' });
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href');
      if (id.length < 2 || !$(id)) return;
      ev.preventDefault();
      cerrarMenu();
      irA(id);
      if (history.replaceState) history.replaceState(null, '', id);
      var dest = $(id); dest.setAttribute('tabindex', '-1'); dest.focus({ preventScroll: true });
    });
  });

  /* ---------- Cortina: el hilo cruza y tira del telón ---------- */
  var cortinaLista;
  (function cortina() {
    var c = $('.cortina');
    var fin = function () { root.classList.add('cortina-fuera'); };
    if (!c) { cortinaLista = Promise.resolve(); return; }
    if (!motion) { fin(); cortinaLista = Promise.resolve(); return; }
    cortinaLista = new Promise(function (resolve) {
      var listo = function () { fin(); resolve(); };
      var fuentes = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 1200); })]) : Promise.resolve();
      fuentes.then(function () {
        if (gsapReady) {
          var borde = $('.cortina-borde path');
          var tl = gsap.timeline({ onComplete: listo });
          tl.fromTo('.cortina-marca', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .6, ease: 'power2.out', immediateRender: false })
            .fromTo('.cortina-hilo path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', autoRound: false, immediateRender: false }, '<.1')
            .to('.cortina-marca, .cortina-hilo', { opacity: 0, duration: .35, ease: 'power1.in' }, '+=.1')
            .to('.cortina-telon', { yPercent: -118, duration: 1.15, ease: 'expo.inOut' }, '<.05')
            .to(borde, { attr: { d: 'M0 0 H1440 V0 Q720 120 0 0 Z' }, duration: .55, ease: 'power2.in' }, '<')
            .to(borde, { attr: { d: 'M0 0 H1440 V0 Q720 0 0 0 Z' }, duration: .6, ease: 'power2.out' }, '>');
        } else {
          root.classList.add('cortina-css');
          setTimeout(listo, 1700);
        }
      });
    });
  })();

  /* ---------- Cookies ---------- */
  var cookies = $('.cookies');
  var mandos = $('.mandos');
  function colocarMandos() {
    if (!mandos) return;
    var revision = root.classList.contains('es-revision');
    mandos.hidden = !revision || (cookies && !cookies.hidden);
  }
  if (cookies) {
    if (store.get('debandoira-cookies') !== 'ok') cookies.hidden = false;
    $('button', cookies).addEventListener('click', function () {
      store.set('debandoira-cookies', 'ok');
      cookies.hidden = true;
      colocarMandos();
    });
  }

  /* ---------- MANDO DE DEMOSTRACIÓN (no viaja al sitio de un cliente) ---------- */
  if (mandos) {
    var pintarMandos = function () {
      var sobria = root.classList.contains('maqueta-sobria');
      $$('[data-maqueta]', mandos).forEach(function (b) { b.setAttribute('aria-pressed', String((b.dataset.maqueta === 'sobria') === sobria)); });
      var pal = root.classList.contains('paleta-brezo') ? 'brezo' : root.classList.contains('paleta-musgo') ? 'musgo' : 'rubia';
      $$('[data-paleta]', mandos).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.paleta === pal)); });
    };
    $$('[data-maqueta]', mandos).forEach(function (b) {
      b.addEventListener('click', function () {
        root.classList.toggle('maqueta-sobria', b.dataset.maqueta === 'sobria');
        store.set('debandoira-maqueta', b.dataset.maqueta);
        pintarMandos();
        medirPila();
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      });
    });
    $$('[data-paleta]', mandos).forEach(function (b) {
      b.addEventListener('click', function () {
        root.classList.remove('paleta-brezo', 'paleta-musgo');
        if (b.dataset.paleta !== 'rubia') root.classList.add('paleta-' + b.dataset.paleta);
        store.set('debandoira-paleta', b.dataset.paleta);
        pintarMandos();
        if (ovillo) ovillo.leerColores();
      });
    });
    pintarMandos();
    colocarMandos();
  }

  /* ---------- Menú móvil ---------- */
  var menuBoton = $('.menu-boton'), menu = $('#menu');
  function cerrarMenu() {
    if (!menu || !menu.classList.contains('es-abierto')) return;
    menu.classList.remove('es-abierto');
    menuBoton.setAttribute('aria-expanded', 'false');
    if (lenis) lenis.start();
  }
  if (menuBoton) {
    menuBoton.addEventListener('click', function () {
      var abrir = !menu.classList.contains('es-abierto');
      menu.classList.toggle('es-abierto', abrir);
      menuBoton.setAttribute('aria-expanded', String(abrir));
      if (lenis) { if (abrir) lenis.stop(); else lenis.start(); }
      if (abrir) { var a = $('a', menu); if (a) a.focus(); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('es-abierto')) { cerrarMenu(); menuBoton.focus(); } });
  }

  /* ---------- Char-reveal: palabras en bloque, letras dentro ---------- */
  function partir(el) {
    var texto = el.textContent.replace(/\s+/g, ' ').trim();
    var i = 0;
    (function recorrer(nodo) {
      Array.prototype.slice.call(nodo.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (trozo) {
            if (!trozo) return;
            if (/^\s+$/.test(trozo)) { frag.appendChild(document.createTextNode(' ')); return; }
            var p = document.createElement('span'); p.className = 'palabra';
            Array.from(trozo).forEach(function (ch) {
              var l = document.createElement('span'); l.className = 'letra'; l.textContent = ch; l.style.setProperty('--i', i++); p.appendChild(l);
            });
            frag.appendChild(p);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) recorrer(n);
      });
    })(el);
    // Lectores de pantalla: el texto entero, no letra a letra
    var sr = document.createElement('span'); sr.className = 'sr'; sr.textContent = texto;
    var envoltorio = document.createElement('span'); envoltorio.setAttribute('aria-hidden', 'true');
    while (el.firstChild) envoltorio.appendChild(el.firstChild);
    // conserva los bloques .tl del titular de portada
    el.appendChild(sr); el.appendChild(envoltorio);
    if (el.classList.contains('titulo-portada')) envoltorio.style.display = 'block';
  }
  var titulares = $$('[data-letras]');
  if (root.classList.contains('has-motion')) titulares.forEach(partir);

  /* ---------- Apariciones de una sola vez: IntersectionObserver ---------- */
  var io = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('es-visible');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
  cortinaLista.then(function () {
    titulares.concat($$('.mascara, .tarjeta, .persona, .trazo')).forEach(function (el) { io.observe(el); });
  });

  /* ---------- Contadores (también con movimiento reducido: el valor final está en el HTML) ---------- */
  if (motion) {
    var ioC = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        ioC.unobserve(e.target);
        var el = e.target, hasta = +el.dataset.hasta, desde = +(el.dataset.desde || 0), t0 = performance.now(), dur = 1600;
        (function paso(t) {
          var k = clamp((t - t0) / dur, 0, 1), v = desde + (hasta - desde) * (1 - Math.pow(1 - k, 3));
          el.textContent = Math.round(v);
          if (k < 1) requestAnimationFrame(paso);
        })(t0);
      });
    }, { threshold: 0.6 });
    $$('.contador').forEach(function (c) { c.textContent = c.dataset.desde || '0'; ioC.observe(c); });
  }

  /* ---------- «Lo que traes»: las palabras se tiñen al leerlas (scrub) ---------- */
  var tinte = $('[data-tinte]'), palabrasT = [];
  if (tinte && root.classList.contains('has-motion')) {
    (function envolver(nodo) {
      Array.prototype.slice.call(nodo.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(t)); return; }
            var s = document.createElement('span'); s.className = 'pt'; s.textContent = t; frag.appendChild(s); palabrasT.push(s);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) envolver(n);
      });
    })(tinte);
  }
  function tintar() {
    if (!palabrasT.length) return;
    var r = tinte.getBoundingClientRect(), vh = innerHeight;
    var p = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.25), 0, 1);
    var n = Math.round(p * palabrasT.length);
    for (var i = 0; i < palabrasT.length; i++) palabrasT[i].classList.toggle('es-leida', i < n);
  }

  /* ---------- Proceso: escena anclada con scrub ---------- */
  var proceso = $('.proceso');
  if (proceso && root.classList.contains('has-motion')) {
    proceso.classList.add('es-anclado');
    var pasos = $$('.paso', proceso), num = $('.proceso-num', proceso);
    var nudos = $$('.ph-nudos circle', proceso), hilo = $('.ph-avance', proceso), guia = $('.ph-fondo', proceso);
    // Dónde cae cada nudo a lo largo del hilo (fracción de su longitud)
    var total = guia.getTotalLength(), fr = nudos.map(function (n) {
      var x = +n.getAttribute('cx'), mejor = 0, d = 1e9;
      for (var l = 0; l <= total; l += 4) { var pt = guia.getPointAtLength(l); var dd = Math.abs(pt.x - x) + Math.abs(pt.y - 62); if (dd < d) { d = dd; mejor = l; } }
      return mejor / total;
    });
    var activo = -1;
    var ponerPaso = function (i) {
      if (i === activo) return;
      var antes = activo; activo = i;
      pasos.forEach(function (p, k) { p.classList.toggle('es-activo', k === i); p.classList.toggle('es-pasado', k < i); p.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
      var texto = (i + 1 < 10 ? '0' : '') + (i + 1);
      if (antes < 0) { num.textContent = texto; return; }
      gsap.timeline()
        .to(num, { yPercent: i > antes ? -40 : 40, opacity: 0, duration: .22, ease: 'power2.in' })
        .add(function () { num.textContent = texto; })
        .fromTo(num, { yPercent: i > antes ? 40 : -40 }, { yPercent: 0, opacity: 1, duration: .5, ease: 'power3.out', immediateRender: false });
    };
    ponerPaso(0);
    gsap.set(hilo, { strokeDashoffset: 1 });
    ScrollTrigger.create({
      trigger: proceso,
      pin: '.proceso-escena',
      start: 'top top',
      end: function () { return '+=' + Math.round(innerHeight * 4.2); },
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: function (st) {
        var p = st.progress;
        gsap.set(hilo, { strokeDashoffset: 1 - p, autoRound: false });
        var pasados = 0;
        nudos.forEach(function (n, k) { var ya = p >= fr[k] - 0.01; n.classList.toggle('es-activo', ya); if (ya && k > 0) pasados = k; });
        ponerPaso(Math.min(pasos.length - 1, pasados));
      }
    });
  }

  /* ---------- La ola: el borde del añil se tensa al llegar ---------- */
  var ola = $('.ola path');
  function ondular() {
    if (!ola) return;
    var r = proceso.getBoundingClientRect(), vh = innerHeight;
    var p = clamp((vh - r.top) / (vh * 0.9), 0, 1);
    var y = motion ? 120 - 150 * Math.sin(Math.PI * p) * (1 - p * 0.35) : 0;
    if (p >= 1) y = 120;
    ola.setAttribute('d', 'M0 120 Q 720 ' + y.toFixed(1) + ' 1440 120 Z');
  }

  /* ---------- Pila sticky: mismo alto para todas (el de la más alta) ---------- */
  var pila = $('.pila');
  function medirPila() {
    if (!pila) return;
    pila.style.setProperty('--alto-tarjeta', 'auto');
    var max = 0;
    $$('.pila-item', pila).forEach(function (li, i) { li.style.setProperty('--i', i); max = Math.max(max, $('.tarjeta', li).offsetHeight); });
    pila.style.setProperty('--alto-tarjeta', Math.ceil(max) + 'px');
  }
  medirPila();
  if (window.ResizeObserver && pila) { var anchoPila = 0; new ResizeObserver(function (e) { var w = e[0].contentRect.width; if (Math.abs(w - anchoPila) > 1) { anchoPila = w; medirPila(); } }).observe(pila); }
  if (document.fonts) document.fonts.ready.then(function () { medirPila(); if (window.ScrollTrigger) ScrollTrigger.refresh(); });
  function apilar() {
    if (!pila || !motion) return;
    var items = $$('.pila-item', pila);
    items.forEach(function (li, i) {
      var sig = items[i + 1], t = $('.tarjeta', li);
      if (!sig) { t.style.transform = ''; return; }
      var a = li.getBoundingClientRect(), b = sig.getBoundingClientRect();
      var k = clamp(1 - (b.top - a.top) / a.height, 0, 1);
      t.style.transform = k > 0 ? 'scale(' + (1 - k * 0.045).toFixed(4) + ')' : '';
    });
  }

  /* ---------- Marquesina: lenta, y la acelera (un poco) el scroll ---------- */
  var cinta = $('.cinta-pista'), cintaX = 0, cintaVis = false, ultimoY = scrollY, vel = 0;
  if (cinta && motion) {
    new IntersectionObserver(function (e) { cintaVis = e[0].isIntersecting; }).observe(cinta);
  }
  function moverCinta(dt) {
    if (!cinta || !motion || !cintaVis) return;
    var mitad = cinta.scrollWidth / 2;
    cintaX -= (28 + Math.min(Math.abs(vel), 2400) * 0.12) * dt;
    if (cintaX <= -mitad) cintaX += mitad;
    cinta.style.transform = 'translate3d(' + cintaX.toFixed(2) + 'px,0,0)';
  }

  /* ---------- Hilo conductor del margen ---------- */
  var hc = $('.hc-avance');
  function conducir() {
    if (!hc) return;
    var max = document.documentElement.scrollHeight - innerHeight;
    hc.style.strokeDashoffset = (1 - clamp(scrollY / max, 0, 1)).toFixed(4);
  }

  /* ---------- Bucle común ligado al scroll ---------- */
  var pendiente = true, tPrev = performance.now();
  function alScroll() { pendiente = true; }
  addEventListener('scroll', alScroll, { passive: true });
  addEventListener('resize', alScroll);
  (function bucle(t) {
    var dt = Math.min(0.05, (t - tPrev) / 1000); tPrev = t;
    var y = scrollY; vel = vel * 0.9 + ((y - ultimoY) / Math.max(dt, 0.001)) * 0.1; ultimoY = y;
    if (pendiente) { pendiente = false; tintar(); ondular(); apilar(); conducir(); }
    moverCinta(dt);
    requestAnimationFrame(bucle);
  })(tPrev);

  /* ---------- Conmutador presencial / en línea (pestañas accesibles) ---------- */
  var tabs = $$('.conmutador [role="tab"]'), dibujo = $('.consulta-dibujo'), conm = $('.conmutador');
  function elegir(i, foco) {
    tabs.forEach(function (t, k) {
      var sel = k === i;
      t.setAttribute('aria-selected', String(sel));
      t.tabIndex = sel ? 0 : -1;
      $('#' + t.getAttribute('aria-controls')).hidden = !sel;
    });
    conm.classList.toggle('es-linea', i === 1);
    dibujo.dataset.formato = i === 1 ? 'linea' : 'presencial';
    if (foco) tabs[i].focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { elegir(i); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); elegir((i + 1) % 2, true); }
    });
  });

  /* ---------- Horario: hoy y abierto/cerrado (contenido, no movimiento) ---------- */
  var tramos = { 1: [[540, 840], [960, 1230]], 2: [[540, 840], [960, 1230]], 3: [[540, 840], [960, 1230]], 4: [[540, 840], [960, 1230]], 5: [[540, 900]], 6: [], 0: [] };
  var nombres = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  function hh(m) { return Math.floor(m / 60) + ':' + ('0' + (m % 60)).slice(-2); }
  function horario() {
    var ahora = new Date(), d = ahora.getDay(), m = ahora.getHours() * 60 + ahora.getMinutes();
    $$('.horario tr').forEach(function (tr) { tr.classList.toggle('es-hoy', +tr.dataset.dia === d); });
    var est = $('.horario-estado'), txt = $('.horario-texto');
    if (!est) return;
    var abierto = tramos[d].some(function (t) { return m >= t[0] && m < t[1]; });
    est.classList.toggle('es-abierto', abierto);
    if (abierto) {
      var fin = tramos[d].filter(function (t) { return m >= t[0] && m < t[1]; })[0][1];
      txt.textContent = 'Abierto ahora · hasta las ' + hh(fin);
    } else {
      for (var k = 0; k < 8; k++) {
        var dd = (d + k) % 7, sig = tramos[dd].filter(function (t) { return k > 0 || t[0] > m; })[0];
        if (sig) { txt.textContent = 'Cerrado · abrimos ' + (k === 0 ? 'hoy' : k === 1 ? 'mañana' : 'el ' + nombres[dd]) + ' a las ' + hh(sig[0]); break; }
      }
    }
  }
  horario(); setInterval(horario, 60000);

  /* ---------- Mapa: el iframe no existe hasta que se pide ---------- */
  var mapaBoton = $('.mapa-boton');
  if (mapaBoton) mapaBoton.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Rúa das Fiadeiras 14, Lugo') + '&output=embed';
    f.title = 'Mapa de la consulta (Google Maps)';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    var m = $('.mapa'); m.appendChild(f); mapaBoton.remove(); $('.mapa-dibujo', m).remove();
  });

  /* ---------- Formulario de muestra ---------- */
  var form = $('.formulario');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var est = $('.formulario-estado', form);
    var falta = $$('[required]', form).filter(function (i) { return !i.value.trim(); });
    if (falta.length) { est.textContent = 'Falta tu nombre y un teléfono o correo para poder llamarte.'; falta[0].focus(); return; }
    est.textContent = 'Es un formulario de muestra: no se ha enviado nada. En el sitio real, te llamaríamos en un día laborable.';
    form.reset();
  });

  /* ---------- Botones magnéticos ---------- */
  if (root.classList.contains('has-motion') && finePointer) {
    $$('.iman').forEach(function (b) {
      var qx = gsap.quickTo(b, 'x', { duration: .6, ease: 'power3.out' }), qy = gsap.quickTo(b, 'y', { duration: .6, ease: 'power3.out' });
      b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * 0.28); qy((e.clientY - r.top - r.height / 2) * 0.35); });
      b.addEventListener('pointerleave', function () { qx(0); qy(0); });
    });
  }

  /* ---------- Cursor propio: punto + aro, y una hebra detrás (solo ratón) ---------- */
  (function cursor() {
    var c = $('.cursor'); if (!c) return;
    var punto = $('.cursor-punto', c), aro = $('.cursor-aro', c), texto = $('.cursor-texto', c), cola = $('.cursor-cola polyline', c);
    var x = -100, y = -100, ax = -100, ay = -100, activo = false, rastro = [];
    addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY;
      if (!activo) { activo = true; ax = x; ay = y; root.classList.add('cursor-propio'); requestAnimationFrame(pintar); }
      var t = e.target.closest ? e.target : document.body;
      var etiqueta = t.closest('[data-cursor]');
      var enlace = t.closest('a, button, summary, label, input, textarea, [role="tab"]');
      c.classList.toggle('es-etiqueta', !!etiqueta && !enlace);
      c.classList.toggle('es-enlace', !!enlace);
      texto.textContent = etiqueta && !enlace ? etiqueta.dataset.cursor : '';
      c.classList.toggle('es-oscuro', !!t.closest('.proceso, .cinta, .contacto, .pie, .aviso-crisis-barra'));
    }, { passive: true });
    document.addEventListener('pointerleave', function () { x = y = ax = ay = -100; });
    function pintar() {
      ax += (x - ax) * (motion ? 0.2 : 1); ay += (y - ay) * (motion ? 0.2 : 1);
      punto.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      aro.style.transform = 'translate3d(' + ax.toFixed(1) + 'px,' + ay.toFixed(1) + 'px,0)';
      if (motion && !root.classList.contains('maqueta-sobria')) {
        rastro.unshift(x + ',' + y); if (rastro.length > 16) rastro.pop();
        cola.setAttribute('points', rastro.join(' '));
      }
      requestAnimationFrame(pintar);
    }
  })();

  /* =======================================================================
     EL OVILLO — canvas 2D, protagonista de la portada
     Un ovillo de 34 vueltas (círculos máximos de una esfera con normales
     aleatorias de semilla fija), proyectado con perspectiva suave y pintado
     por capas de profundidad (9 trazos por fotograma, sin blur ni sombras).
     Del ovillo sale el cabo: una cuerda de verlet que sigue al cursor. Si
     tiras de ella, el ovillo gira y suelta hilo; el scroll también lo devana.
     ======================================================================= */
  var ovillo = null;
  (function () {
    var fig = $('.portada-ovillo'), cv = $('.ovillo-canvas');
    if (!fig || !cv || !cv.getContext) return;
    var ctx = cv.getContext('2d');
    var W = 0, H = 0, dpr = 1, R = 100, cx = 0, cy = 0;
    // Generador con semilla: el ovillo es siempre el mismo
    var s = 7;
    var rnd = function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    var K = 34, M = 72, vueltas = [];
    for (var k = 0; k < K; k++) {
      var u1 = rnd() * 2 - 1, th = rnd() * Math.PI * 2, rr = Math.sqrt(1 - u1 * u1);
      var n = [rr * Math.cos(th), rr * Math.sin(th), u1];
      var a = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
      var u = norm(cross(n, a)), v = cross(n, u);
      var pts = [];
      for (var j = 0; j <= M; j++) { var t = j / M * Math.PI * 2; pts.push([u[0] * Math.cos(t) + v[0] * Math.sin(t), u[1] * Math.cos(t) + v[1] * Math.sin(t), u[2] * Math.cos(t) + v[2] * Math.sin(t)]); }
      vueltas.push({ pts: pts, color: k % 7 === 3 ? 2 : (k % 5 === 1 ? 1 : 0) });
    }
    function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
    function norm(a) { var l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; }

    var colores = ['#283463', '#B4533F', '#D9A84E'], papel = '#F4E9E1';
    function leerColores() {
      var cs = getComputedStyle(root);
      colores = [cs.getPropertyValue('--anil').trim(), cs.getPropertyValue('--rubia').trim(), cs.getPropertyValue('--gualda').trim()];
      papel = cs.getPropertyValue('--papel').trim();
      if (!vivo) dibujar(0);
    }

    // Cuerda (el cabo suelto)
    var NC = 30, cuerda = [], extra = 0;
    function medir() {
      var r = fig.getBoundingClientRect();
      W = r.width; H = r.height; dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      R = Math.min(W, H) * 0.3; cx = W * 0.46; cy = H * 0.44;
      var an = ancla();
      cuerda = [];
      for (var i = 0; i < NC; i++) cuerda.push({ x: an.x + i * 3, y: an.y + i * 6, px: an.x + i * 3, py: an.y + i * 6 });
      if (!vivo) dibujar(0);
    }
    var radioActual = function () { return R * (1 - 0.22 * devanado); };
    function ancla() { var r = radioActual(); return { x: cx + r * 0.94, y: cy + r * 0.34 }; }

    var rotY = 0.6, rotX = -0.35, velY = 0.16, inclX = -0.35, devanado = 0;
    var puntero = { x: 0, y: 0, dentro: false, abajo: false };
    var vivo = false, visible = true, t0 = performance.now();

    function dibujar(t) {
      var r = radioActual();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      var cY = Math.cos(rotY), sY = Math.sin(rotY), cX = Math.cos(rotX), sX = Math.sin(rotX), f = 3.2;
      var visibles = Math.round(K * (1 - 0.5 * devanado));
      // 3 colores × 3 capas de profundidad = 9 trazos
      for (var capa = 0; capa < 3; capa++) {
        for (var col = 0; col < 3; col++) {
          ctx.beginPath();
          var hay = false;
          for (var k = 0; k < visibles; k++) {
            var vu = vueltas[k]; if (vu.color !== col) continue;
            var prevIn = false, px = 0, py = 0;
            for (var j = 0; j < vu.pts.length; j++) {
              var p = vu.pts[j];
              var x1 = p[0] * cY + p[2] * sY, z1 = -p[0] * sY + p[2] * cY;
              var y2 = p[1] * cX - z1 * sX, z2 = p[1] * sX + z1 * cX;
              var esc = f / (f - z2), X = cx + x1 * r * esc, Y = cy + y2 * r * esc;
              var cp = z2 < -0.33 ? 0 : z2 < 0.33 ? 1 : 2;
              if (cp === capa) {
                if (!prevIn) ctx.moveTo(px || X, py || Y);
                ctx.lineTo(X, Y); hay = true; prevIn = true;
              } else prevIn = false;
              px = X; py = Y;
            }
          }
          if (!hay) continue;
          ctx.strokeStyle = colores[col];
          ctx.globalAlpha = capa === 0 ? 0.22 : capa === 1 ? 0.55 : 0.95;
          ctx.lineWidth = capa === 0 ? 0.9 : capa === 1 ? 1.2 : 1.6;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      // contorno
      ctx.beginPath(); ctx.arc(cx, cy, r * 1.003, 0, Math.PI * 2);
      ctx.strokeStyle = colores[0]; ctx.globalAlpha = 0.35; ctx.lineWidth = 1; ctx.stroke(); ctx.globalAlpha = 1;
      // cabo
      ctx.beginPath(); ctx.moveTo(cuerda[0].x, cuerda[0].y);
      for (var i = 1; i < NC - 1; i++) { var mx = (cuerda[i].x + cuerda[i + 1].x) / 2, my = (cuerda[i].y + cuerda[i + 1].y) / 2; ctx.quadraticCurveTo(cuerda[i].x, cuerda[i].y, mx, my); }
      ctx.lineTo(cuerda[NC - 1].x, cuerda[NC - 1].y);
      ctx.strokeStyle = colores[1]; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
      ctx.beginPath(); ctx.arc(cuerda[NC - 1].x, cuerda[NC - 1].y, 3.2, 0, Math.PI * 2); ctx.fillStyle = colores[1]; ctx.fill();
    }

    function fisica(dt, t) {
      var an = ancla();
      var largo = R * (1.5 + 2.2 * devanado) + extra, seg = largo / (NC - 1);
      var objetivo;
      if (puntero.dentro) objetivo = { x: puntero.x, y: puntero.y };
      else objetivo = { x: an.x + R * 0.35 + Math.sin(t * 0.0006) * R * 0.18, y: an.y + largo * 0.72 };
      for (var i = 1; i < NC; i++) {
        var p = cuerda[i], vx = (p.x - p.px) * 0.96, vy = (p.y - p.py) * 0.96;
        p.px = p.x; p.py = p.y;
        p.x += vx; p.y += vy + 0.18; // un poco de gravedad: el hilo cae, no flota
      }
      var fin = cuerda[NC - 1];
      fin.x += (objetivo.x - fin.x) * (puntero.dentro ? 0.12 : 0.03);
      fin.y += (objetivo.y - fin.y) * (puntero.dentro ? 0.12 : 0.03);
      cuerda[0].x = an.x; cuerda[0].y = an.y;
      var tension = 0;
      for (var it = 0; it < 8; it++) {
        for (var j = 0; j < NC - 1; j++) {
          var a = cuerda[j], b = cuerda[j + 1], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 0.001;
          var dif = (d - seg) / d;
          if (j === 0) { b.x -= dx * dif; b.y -= dy * dif; }
          else { a.x += dx * dif * 0.5; a.y += dy * dif * 0.5; b.x -= dx * dif * 0.5; b.y -= dy * dif * 0.5; }
        }
        cuerda[0].x = an.x; cuerda[0].y = an.y;
      }
      // Tirar: si el extremo se aleja más que el largo, el ovillo gira y suelta hilo
      var dist = Math.hypot(objetivo.x - an.x, objetivo.y - an.y);
      if (puntero.dentro && dist > largo * 0.92) {
        tension = clamp((dist - largo * 0.92) / R, 0, 1);
        velY += tension * 2.2 * dt;
        extra = Math.min(R * 1.6, extra + tension * R * 0.5 * dt);
      }
      return tension;
    }

    function frame(t) {
      if (!vivo) return;
      var dt = Math.min(0.05, (t - t0) / 1000); t0 = t;
      // Calma: la velocidad vuelve sola a su marcha de reposo
      velY += (0.16 - velY) * Math.min(1, dt * 1.2);
      rotY += velY * dt;
      var objX = puntero.dentro ? -0.35 + ((puntero.y - cy) / H) * 0.6 : -0.35;
      inclX += (objX - inclX) * Math.min(1, dt * 2);
      rotX = inclX;
      var r = fig.getBoundingClientRect();
      devanado = clamp(-r.top / (r.height * 0.9), 0, 1);
      fisica(dt, t);
      dibujar(t);
      requestAnimationFrame(frame);
    }
    function arrancar() { if (vivo || !visible || document.hidden) return; vivo = true; t0 = performance.now(); requestAnimationFrame(frame); }
    function parar() { vivo = false; }

    function local(e) { var r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, r: r }; }
    addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' && !puntero.abajo) return;
      var l = local(e), m = 80;
      puntero.dentro = l.x > -m && l.y > -m && l.x < l.r.width + m && l.y < l.r.height + m;
      puntero.x = l.x; puntero.y = l.y;
    }, { passive: true });
    cv.addEventListener('pointerdown', function (e) { var l = local(e); puntero.abajo = true; puntero.dentro = true; puntero.x = l.x; puntero.y = l.y; });
    addEventListener('pointerup', function (e) { puntero.abajo = false; if (e.pointerType !== 'mouse') puntero.dentro = false; });
    addEventListener('pointercancel', function () { puntero.abajo = false; puntero.dentro = false; });
    document.addEventListener('mouseleave', function () { puntero.dentro = false; });

    if (window.ResizeObserver) new ResizeObserver(medir).observe(fig); else addEventListener('resize', medir);
    medir();
    leerColores();
    root.classList.add('ovillo-vivo');
    if (motion) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) arrancar(); else parar(); }).observe(fig);
      document.addEventListener('visibilitychange', function () { if (document.hidden) parar(); else arrancar(); });
    } else {
      // Movimiento reducido: el ovillo se queda quieto, con el cabo en reposo
      for (var i = 0; i < 240; i++) fisica(1 / 60, i * 16);
      dibujar(0);
    }
    ovillo = { leerColores: leerColores };
  })();
})();
