/* =========================================================================
   Fiambreira (FICTICIA) — main.js
   Sin framework. GSAP + ScrollTrigger + Lenis por CDN (jsDelivr), opcionales:
   si no llegan, la página se lee entera (los estados «vacíos» viven bajo
   html.has-motion, que solo se enciende aquí tras comprobar que existen).
   Banderas separadas: gsapReady (hay librerías) y motion (no se pide
   movimiento reducido). Con movimiento reducido se apaga el movimiento, no
   el contenido: el mes actual, el horario, el mapa y el formulario siguen.
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
    new PerformanceObserver(function (l) { l.getEntries().forEach(function (e) { window.__longtasks.push({ start: Math.round(e.startTime), dur: Math.round(e.duration) }); }); }).observe({ type: 'longtask', buffered: true });
  } catch (e) {}

  if (gsapReady && motion) { gsap.registerPlugin(ScrollTrigger); root.classList.add('has-motion'); }

  /* ---------- Lenis: único motor de scroll (lerp alto por la galería horizontal) ---------- */
  var lenis = null;
  if (motion && window.Lenis) {
    lenis = new Lenis({ lerp: 0.16, smoothWheel: true });
    if (gsapReady) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }
    else (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
  }
  window.__lenis = lenis;
  function alto() { var c = $('.cabecera'); return c ? c.offsetHeight : 0; }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href'), el = id.length > 1 && $(id);
      if (!el) return;
      ev.preventDefault(); cerrarMenu();
      if (lenis) lenis.scrollTo(el, { offset: -alto() + 1, duration: 1.3 }); else el.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' });
      if (history.replaceState) history.replaceState(null, '', id);
      el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true });
    });
  });

  /* ---------- Cortina: la servilleta se dobla dos veces y se retira a la esquina ---------- */
  var cortinaLista;
  (function () {
    var c = $('.cortina');
    var fin = function () { root.classList.add('cortina-fuera'); };
    if (!c || !motion) { fin(); cortinaLista = Promise.resolve(); return; }
    cortinaLista = new Promise(function (resolve) {
      var fuentes = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 1200); })]) : Promise.resolve();
      fuentes.then(function () {
        if (gsapReady) {
          gsap.timeline({ onComplete: fin })
            .fromTo('.cortina-marca', { opacity: 0, scale: .92 }, { opacity: 1, scale: 1, duration: .6, ease: 'power3.out', immediateRender: false })
            .to('.cortina-marca', { opacity: 0, y: -10, duration: .3, ease: 'power1.in' }, '+=.35')
            // primer doblez: en diagonal, de esquina a esquina
            .to('.cortina-pano', { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 100% 100%)', duration: .75, ease: 'expo.inOut' }, '<')
            // segundo doblez: el triángulo se dobla otra vez hacia la esquina
            .to('.cortina-pano', { clipPath: 'polygon(55% 0%, 100% 0%, 100% 45%, 100% 45%)', duration: .6, ease: 'expo.inOut' })
            .add(resolve, '-=.35')
            // y se retira, ya doblada
            .to('.cortina-pano', { clipPath: 'polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)', duration: .45, ease: 'expo.in' });
        } else {
          root.classList.add('cortina-css');
          setTimeout(resolve, 700); setTimeout(fin, 1300);
        }
      });
    });
  })();

  /* ---------- Cookies ---------- */
  var cookies = $('.cookies');
  /* MANDO-INICIO */
  var mandos = $('.mandos');
  function colocarMandos() { if (mandos) mandos.hidden = !root.classList.contains('es-revision') || (cookies && !cookies.hidden); }
  /* MANDO-FIN */
  if (cookies) {
    if (store.get('fiambreira-cookies') !== 'ok') cookies.hidden = false;
    $('button', cookies).addEventListener('click', function () {
      store.set('fiambreira-cookies', 'ok'); cookies.hidden = true;
      colocarMandos(); // MANDO
    });
  }

  /* MANDO-INICIO · MANDO DE DEMOSTRACIÓN (no viaja al sitio de un cliente) */
  if (mandos) {
    var pintarMandos = function () {
      var sobria = root.classList.contains('maqueta-sobria');
      $$('[data-maqueta]', mandos).forEach(function (b) { b.setAttribute('aria-pressed', String((b.dataset.maqueta === 'sobria') === sobria)); });
      var pal = root.classList.contains('paleta-loza') ? 'loza' : root.classList.contains('paleta-ocre') ? 'ocre' : 'albahaca';
      $$('[data-paleta]', mandos).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.paleta === pal)); });
    };
    $$('[data-maqueta]', mandos).forEach(function (b) {
      b.addEventListener('click', function () {
        root.classList.toggle('maqueta-sobria', b.dataset.maqueta === 'sobria');
        store.set('fiambreira-maqueta', b.dataset.maqueta); pintarMandos();
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      });
    });
    $$('[data-paleta]', mandos).forEach(function (b) {
      b.addEventListener('click', function () {
        root.classList.remove('paleta-loza', 'paleta-ocre');
        if (b.dataset.paleta !== 'albahaca') root.classList.add('paleta-' + b.dataset.paleta);
        store.set('fiambreira-paleta', b.dataset.paleta); pintarMandos();
        if (mantel) mantel.leerColores();
      });
    });
    pintarMandos(); colocarMandos();
  }
  /* MANDO-FIN */

  /* ---------- Menú móvil ---------- */
  var menuBoton = $('.menu-boton'), menu = $('#menu');
  function cerrarMenu() {
    if (!menu || !menu.classList.contains('es-abierto')) return;
    menu.classList.remove('es-abierto'); menuBoton.setAttribute('aria-expanded', 'false');
    if (lenis) lenis.start();
  }
  if (menuBoton) {
    menuBoton.addEventListener('click', function () {
      var abrir = !menu.classList.contains('es-abierto');
      menu.classList.toggle('es-abierto', abrir); menuBoton.setAttribute('aria-expanded', String(abrir));
      if (lenis) { if (abrir) lenis.stop(); else lenis.start(); }
      if (abrir) { var a = $('a', menu); if (a) a.focus(); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('es-abierto')) { cerrarMenu(); menuBoton.focus(); } });
  }

  /* ---------- Char-reveal: palabras en bloque, letras dentro ---------- */
  function partir(el) {
    var texto = el.textContent.replace(/\s+/g, ' ').trim(), i = 0;
    (function recorrer(nodo) {
      Array.prototype.slice.call(nodo.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
            var p = document.createElement('span'); p.className = 'palabra';
            Array.from(t).forEach(function (ch) { var l = document.createElement('span'); l.className = 'letra'; l.textContent = ch; l.style.setProperty('--i', i++); p.appendChild(l); });
            frag.appendChild(p);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) recorrer(n);
      });
    })(el);
    var sr = document.createElement('span'); sr.className = 'sr'; sr.textContent = texto;
    var env = document.createElement('span'); env.setAttribute('aria-hidden', 'true');
    while (el.firstChild) env.appendChild(el.firstChild);
    el.appendChild(sr); el.appendChild(env);
    if (el.classList.contains('titulo-portada')) env.style.display = 'block';
  }
  var titulares = $$('[data-letras]');
  if (root.classList.contains('has-motion')) titulares.forEach(partir);

  /* ---------- Apariciones de una vez: IntersectionObserver ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('es-visible'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -14% 0px', threshold: 0.05 });
  $$('.tachados li').forEach(function (li, k) { li.style.transitionDelay = (k % 3) * 0.12 + 's'; $('span', li).style.transitionDelay = (0.15 + k * 0.14) + 's'; });
  cortinaLista.then(function () { titulares.concat($$('.tachados li')).forEach(function (el) { io.observe(el); }); });

  /* ---------- Poner la mesa: escena anclada con scrub ---------- */
  var mesa = $('.mesa-seccion');
  if (mesa && root.classList.contains('has-motion')) {
    mesa.classList.add('es-anclada');
    var piezas = $$('.pieza', mesa), pasos = $$('.mpaso', mesa), num = $('.mesa-num', mesa), activo = -1;
    var poner = function (i) {
      if (i === activo) return;
      var antes = activo; activo = i;
      piezas.forEach(function (p, k) { p.classList.toggle('es-puesta', k <= i); });
      pasos.forEach(function (p, k) { p.classList.toggle('es-activo', k === i); p.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
      if (antes < 0) { num.textContent = i + 1; return; }
      gsap.timeline().to(num, { yPercent: i > antes ? -30 : 30, opacity: 0, duration: .2, ease: 'power2.in' })
        .add(function () { num.textContent = i + 1; })
        .fromTo(num, { yPercent: i > antes ? 30 : -30 }, { yPercent: 0, opacity: 1, duration: .45, ease: 'power3.out', immediateRender: false });
    };
    poner(0);
    ScrollTrigger.create({
      trigger: mesa, pin: '.mesa-escena', start: 'top top', end: function () { return '+=' + Math.round(innerHeight * 3.6); },
      scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: function (st) { poner(Math.min(pasos.length - 1, Math.floor(st.progress * pasos.length * 0.999))); }
    });
  }

  /* ---------- Temporada: galería anclada con desplazamiento horizontal ---------- */
  var temporada = $('.temporada'), meses = $('.meses'), pista = $('.temporada-pista');
  (function () {
    var hoy = new Date().getMonth();
    $$('.mes').forEach(function (m) { var es = +m.dataset.mes === hoy; m.classList.toggle('es-hoy', es); if (es) m.setAttribute('aria-current', 'date'); });
  })();
  if (temporada && root.classList.contains('has-motion')) {
    temporada.classList.add('es-anclada');
    var barra = $('.temporada-barra span');
    var recorrido = function () { return Math.max(0, meses.scrollWidth - pista.clientWidth + parseFloat(getComputedStyle(pista).paddingLeft) * 2); };
    gsap.to(meses, {
      x: function () { return -recorrido(); }, ease: 'none',
      scrollTrigger: { trigger: temporada, pin: '.temporada-escena', start: 'top top', end: function () { return '+=' + recorrido(); }, scrub: true, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: function (st) { barra.style.transform = 'scaleX(' + st.progress.toFixed(4) + ')'; } }
    });
  } else if (pista) {
    // Sin escena anclada: la pista se desplaza a mano y solo es focusable si de verdad desborda
    var revisar = function () { if (pista.scrollWidth > pista.clientWidth + 2) pista.setAttribute('tabindex', '0'); else pista.removeAttribute('tabindex'); };
    revisar(); addEventListener('resize', revisar);
    var actual = $('.mes.es-hoy'); if (actual) pista.scrollLeft = Math.max(0, actual.offsetLeft - 24);
  }

  /* ---------- Cabecera oscura sobre secciones oscuras ---------- */
  var cabecera = $('.cabecera'), oscuras = $$('.mesa-seccion, .contacto, .pie');
  function cabeceraTono() {
    if (!cabecera) return;
    var y = cabecera.offsetHeight - 2;
    cabecera.classList.toggle('es-oscura', oscuras.some(function (o) { var r = o.getBoundingClientRect(); return r.top <= y && r.bottom > y; }));
  }
  var pendiente = true;
  addEventListener('scroll', function () { pendiente = true; }, { passive: true });
  (function bucle() { if (pendiente) { pendiente = false; cabeceraTono(); } requestAnimationFrame(bucle); })();

  /* ---------- Horario: hoy y abierto/cerrado ---------- */
  var tramos = { 1: [[600, 840], [990, 1200]], 2: [[600, 840], [990, 1200]], 3: [[600, 840], [990, 1200]], 4: [[600, 840], [990, 1200]], 5: [[600, 900]], 6: [], 0: [] };
  var nombres = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  function hh(m) { return Math.floor(m / 60) + ':' + ('0' + (m % 60)).slice(-2); }
  function horario() {
    var ahora = new Date(), d = ahora.getDay(), m = ahora.getHours() * 60 + ahora.getMinutes();
    $$('.horario tr').forEach(function (tr) { tr.classList.toggle('es-hoy', +tr.dataset.dia === d); });
    var est = $('.horario-estado'), txt = $('.horario-texto'); if (!est) return;
    var t = tramos[d].filter(function (x) { return m >= x[0] && m < x[1]; })[0];
    est.classList.toggle('es-abierto', !!t);
    if (t) { txt.textContent = 'Abierto ahora · hasta las ' + hh(t[1]); return; }
    for (var k = 0; k < 8; k++) {
      var dd = (d + k) % 7, sig = tramos[dd].filter(function (x) { return k > 0 || x[0] > m; })[0];
      if (sig) { txt.textContent = 'Cerrado · abrimos ' + (k === 0 ? 'hoy' : k === 1 ? 'mañana' : 'el ' + nombres[dd]) + ' a las ' + hh(sig[0]); break; }
    }
  }
  horario(); setInterval(horario, 60000);

  /* ---------- Mapa bajo clic ---------- */
  var mapaBoton = $('.mapa-boton');
  if (mapaBoton) mapaBoton.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Rúa do Pementeiro 7, Ourense') + '&output=embed';
    f.title = 'Mapa de la consulta (Google Maps)'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
    var m = $('.mapa'); m.appendChild(f); mapaBoton.remove(); $('.mapa-dibujo', m).remove();
  });

  /* ---------- Formulario de muestra ---------- */
  var form = $('.formulario');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var est = $('.formulario-estado', form), falta = $$('[required]', form).filter(function (i) { return !i.value.trim(); });
    if (falta.length) { est.textContent = 'Falta tu nombre y un teléfono o correo para poder llamarte.'; falta[0].focus(); return; }
    est.textContent = 'Es un formulario de muestra: no se ha enviado nada. En el sitio real, te llamaríamos en un día laborable.';
    form.reset();
  });

  /* ---------- Botones magnéticos ---------- */
  if (root.classList.contains('has-motion') && finePointer) {
    $$('.iman').forEach(function (b) {
      var qx = gsap.quickTo(b, 'x', { duration: .6, ease: 'power3.out' }), qy = gsap.quickTo(b, 'y', { duration: .6, ease: 'power3.out' });
      b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * 0.25); qy((e.clientY - r.top - r.height / 2) * 0.35); });
      b.addEventListener('pointerleave', function () { qx(0); qy(0); });
    });
  }

  /* ---------- Cursor propio (solo ratón) ---------- */
  (function () {
    var c = $('.cursor'); if (!c) return;
    var punto = $('.cursor-punto', c), aro = $('.cursor-aro', c), texto = $('.cursor-texto', c);
    var x = -100, y = -100, ax = -100, ay = -100, activo = false;
    addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY;
      if (!activo) { activo = true; ax = x; ay = y; root.classList.add('cursor-propio'); requestAnimationFrame(pintar); }
      var t = e.target.closest ? e.target : document.body;
      var et = t.closest('[data-cursor]'), en = t.closest('a, button, summary, label, input, select, textarea');
      c.classList.toggle('es-etiqueta', !!et && !en); c.classList.toggle('es-enlace', !!en);
      texto.textContent = et && !en ? et.dataset.cursor : '';
      c.classList.toggle('es-oscuro', !!t.closest('.mesa-seccion, .contacto, .pie'));
    }, { passive: true });
    function pintar() {
      ax += (x - ax) * (motion ? 0.22 : 1); ay += (y - ay) * (motion ? 0.22 : 1);
      punto.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      aro.style.transform = 'translate3d(' + ax.toFixed(1) + 'px,' + ay.toFixed(1) + 'px,0)';
      requestAnimationFrame(pintar);
    }
  })();

  /* =======================================================================
     EL MANTEL — WebGL, protagonista de la portada
     Un shader de fragmentos pinta el vichy sobre una tela con pliegues
     suaves. Donde apoyas la mano, la tela se hunde y se arruga; al soltar se
     vuelve a alisar. Un toque deja una onda. El scroll tira del mantel hacia
     arriba y lo alisa. Sin WebGL, se ve el vichy en CSS de debajo.
     ======================================================================= */
  var mantel = null;
  (function () {
    var cv = $('.mantel'), sec = $('.portada');
    if (!cv) return;
    var gl = null;
    try { gl = cv.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true, preserveDrawingBuffer: false }); } catch (e) {}
    if (!gl) return;
    var vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var fs = [
      'precision mediump float;',
      'uniform vec2 r;uniform float t;uniform vec2 m;uniform float pr;uniform float rip;uniform vec2 rc;uniform float s;uniform vec3 c1;uniform vec3 c2;uniform float cs;',
      'float h(vec2 q){',
      '  float f=(sin(q.x*2.1+t*.25)+sin(q.y*1.7-q.x*.9+t*.18)+.6*sin(q.x*4.3+q.y*3.1-t*.11))*.016*(1.-s*.7);',
      '  vec2 d=q-m;float dd=dot(d,d);',
      '  f-=pr*.085*exp(-dd*7.);',
      '  f+=pr*.012*sin(atan(d.y,d.x)*6.+dd*30.)*exp(-dd*5.);',
      '  float dr=length(q-rc);f+=rip*.02*sin(dr*24.-t*5.)*exp(-dr*3.2);',
      '  return f;}',
      'void main(){',
      '  vec2 q=gl_FragCoord.xy/r.y;vec2 e=vec2(.003,0.);float h0=h(q);',
      '  vec2 g=vec2(h(q+e.xy)-h0,h(q+e.yx)-h0)/.003;',
      '  vec2 w=q+g*.06+vec2(0.,s*.45);',
      '  vec2 c=w*cs;float aa=cs/r.y*1.2;',
      '  float sx=smoothstep(.25-aa,.25+aa,abs(fract(c.x)-.5));',
      '  float sy=smoothstep(.25-aa,.25+aa,abs(fract(c.y)-.5));',
      '  float k=(sx+sy)*.4;',
      '  float hilo=sin(c.x*50.27)*sin(c.y*50.27)*.035;',
      '  vec3 col=mix(c2,c1,clamp(k+hilo*k,0.,1.));',
      '  vec3 n=normalize(vec3(-g*.9,1.));float l=dot(n,normalize(vec3(-.45,.55,1.)));',
      '  col*=.84+.19*l;',
      '  gl_FragColor=vec4(col,1.);}'
    ].join('\n');
    function sh(tipo, src) { var o = gl.createShader(tipo); gl.shaderSource(o, src); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; }
    var pg;
    try { pg = gl.createProgram(); gl.attachShader(pg, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pg, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pg); } catch (e) { return; }
    gl.useProgram(pg);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pg, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {}; ['r', 't', 'm', 'pr', 'rip', 'rc', 's', 'c1', 'c2', 'cs'].forEach(function (n) { U[n] = gl.getUniformLocation(pg, n); });
    var W = 0, H = 0, dpr = 1;
    function medir() {
      // El búfer va al 70 % del tamaño CSS: la tela es blanda y el vichy lleva su
      // propio antialias en el shader; así el coste por fotograma baja a la mitad.
      var r = sec.getBoundingClientRect(); W = r.width; H = r.height; dpr = 0.7;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); gl.viewport(0, 0, cv.width, cv.height);
      if (!vivo) dibujar(0);
    }
    function rgb(hex) { hex = hex.trim().replace('#', ''); return [0, 2, 4].map(function (i) { return parseInt(hex.slice(i, i + 2), 16) / 255; }); }
    function leerColores() { var cs = getComputedStyle(root); gl.uniform3fv(U.c1, rgb(cs.getPropertyValue('--albahaca'))); gl.uniform3fv(U.c2, rgb(cs.getPropertyValue('--papel'))); if (!vivo) dibujar(0); }
    var cuadro = 0, mx = .7, my = .5, tx = .7, ty = .5, pr = 0, prObj = 0, rip = 0, rcx = 0, rcy = 0, s = 0, vivo = false, visible = true, t0 = performance.now(), tAcum = 0;
    function dibujar(t) {
      gl.uniform2f(U.r, cv.width, cv.height); gl.uniform1f(U.t, t);
      gl.uniform2f(U.m, mx, my); gl.uniform1f(U.pr, pr); gl.uniform1f(U.rip, rip); gl.uniform2f(U.rc, rcx, rcy);
      gl.uniform1f(U.s, s); gl.uniform1f(U.cs, H < 700 ? 9 : 11);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    function frame(now) {
      if (!vivo) return;
      var dt = Math.min(.05, (now - t0) / 1000); t0 = now; tAcum += dt;
      // La mano: sigue al puntero con muelle; la presión sube al moverse y se alisa sola
      mx += (tx - mx) * Math.min(1, dt * 7); my += (ty - my) * Math.min(1, dt * 7);
      pr += (prObj - pr) * Math.min(1, dt * 4); prObj *= Math.pow(.25, dt);
      rip *= Math.pow(.3, dt);
      var r = sec.getBoundingClientRect(), sN = clamp(-r.top / Math.max(1, r.height), 0, 1);
      // En reposo (sin mano, sin onda, sin scroll) los pliegues apenas se mueven: 20 fps bastan
      var quieto = pr < .01 && rip < .01 && Math.abs(sN - s) < .0005;
      s = sN; cuadro = (cuadro + 1) % 3;
      if (!quieto || cuadro === 0) dibujar(tAcum);
      requestAnimationFrame(frame);
    }
    function arrancar() { if (vivo || !visible || document.hidden) return; vivo = true; t0 = performance.now(); requestAnimationFrame(frame); }
    function local(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.height, (r.bottom - e.clientY) / r.height, e.clientY >= r.top && e.clientY <= r.bottom]; }
    sec.addEventListener('pointermove', function (e) { var l = local(e); tx = l[0]; ty = l[1]; prObj = Math.min(1, prObj + .08); }, { passive: true });
    sec.addEventListener('pointerdown', function (e) { var l = local(e); rcx = l[0]; rcy = l[1]; rip = 1; tx = l[0]; ty = l[1]; prObj = 1; });
    if (window.ResizeObserver) new ResizeObserver(medir).observe(sec); else addEventListener('resize', medir);
    medir(); leerColores();
    if (motion) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) arrancar(); else vivo = false; }).observe(sec);
      document.addEventListener('visibilitychange', function () { if (document.hidden) vivo = false; else arrancar(); });
    } else dibujar(0);
    mantel = { leerColores: leerColores, estado: function () { return { pr: +pr.toFixed(3), rip: +rip.toFixed(3), s: +s.toFixed(3), vivo: vivo }; } };
    window.__mantel = mantel; // para el arnés de verificación
  })();
})();
