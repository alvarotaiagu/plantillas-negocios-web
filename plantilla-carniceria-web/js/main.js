/* Mouriscal · carnicería y charcutería (ficticia) — concepto «Contraveta».
   Un solo archivo, sin build. GSAP, ScrollTrigger y Lenis llegan por jsDelivr;
   si no llegan, la página se lee entera igual (los estados vacíos viven bajo
   html.has-motion, que solo se enciende aquí tras comprobar que GSAP existe). */
(function () {
  'use strict';

  var html = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var euros = function (n) { return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var guardar = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var leer = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };

  /* ---------- Tareas largas: se miden siempre, también en producción ---------- */
  var largas = [];
  window.mouriscalLongtasks = largas;
  try {
    new PerformanceObserver(function (lista) {
      lista.getEntries().forEach(function (e) { largas.push({ inicio: Math.round(e.startTime), ms: Math.round(e.duration) }); });
    }).observe({ type: 'longtask', buffered: true });
  } catch (e) {}

  /* ---------- Banderas: GSAP listo ≠ movimiento permitido ---------- */
  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsapReady = !!(window.gsap && window.ScrollTrigger);
  var motion = gsapReady && !reducido;
  var ratonFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (motion) { html.classList.add('has-motion'); gsap.registerPlugin(ScrollTrigger); }
  if (!ratonFino) html.classList.add('no-hover');

  /* ---------- Lenis: único motor de scroll ---------- */
  var lenis = null;
  if (motion && window.Lenis) {
    lenis = new Lenis({ lerp: 0.14, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  var cabH = function () { return $('#cabecera').offsetHeight; };
  function irA(destino) {
    if (!destino) return;
    if (lenis) lenis.scrollTo(destino, { offset: destino.id === 'portada' ? 0 : -cabH() + 1, duration: 1.4 });
    else destino.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth' });
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var d = document.getElementById(id.slice(1));
      if (!d) return;
      ev.preventDefault();
      cerrarMenu();
      irA(d);
      if (id !== '#portada') { d.setAttribute('tabindex', '-1'); d.focus({ preventScroll: true }); }
    });
  });

  /* ---------- Cortina «loncheado»: retirada garantizada en los tres casos ---------- */
  var cortina = $('#cortina');
  var heroEntregado = false;
  function retirarCortina() { if (cortina) cortina.hidden = true; }
  setTimeout(retirarCortina, 5000); // red de seguridad, pase lo que pase
  function entregarHero() {
    if (heroEntregado) return;
    heroEntregado = true;
    if (!motion) return;
    var letras = $$('.portada-titulo .letra');
    gsap.fromTo(letras, { yPercent: 110 }, { yPercent: 0, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.03, immediateRender: false, clearProps: 'transform' });
    gsap.fromTo('.portada-antetitulo, .portada-lado, .portada-pista', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.35, immediateRender: false });
    gsap.fromTo('.portada-ticket', { yPercent: -160, rotate: -10 }, { yPercent: 0, rotate: 3, duration: 1.4, ease: 'elastic.out(1, .55)', delay: 0.5, immediateRender: false, clearProps: 'transform' });
  }
  if (cortina) {
    if (motion) {
      var lonchas = $$('.cortina-lonchas span');
      var tl = gsap.timeline({ defaults: { ease: 'expo.inOut' }, onComplete: retirarCortina });
      tl.fromTo('.cortina-aro', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut', autoRound: false }, 0)
        .fromTo('.cortina-veta', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out', autoRound: false }, 0.2)
        .fromTo('.cortina-corte', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.32, ease: 'power3.in', autoRound: false }, 0.72)
        .to('.cortina-marca', { y: -18, autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, 1.12)
        .to(lonchas, { xPercent: function (i) { return i % 2 ? -106 : 106; }, duration: 0.95, stagger: 0.065 }, 1.2)
        .add(entregarHero, 1.55);
    } else if (reducido) {
      retirarCortina();
      entregarHero();
    } else {
      // Sin GSAP: la misma salida en CSS por clase
      setTimeout(function () { cortina.classList.add('es-fuera'); }, 250);
      setTimeout(function () { retirarCortina(); entregarHero(); }, 1500);
    }
  }

  /* ---------- Char-reveal: letra a letra (portada) y palabra a palabra (resto) ---------- */
  function partir(el, porLetra) {
    var texto = el.textContent.trim();
    // aria-label no vale en un <span>: el texto entero va oculto a la vista y las letras, ocultas al lector
    el.textContent = '';
    var sr = document.createElement('span'); sr.className = 'visually-hidden'; sr.textContent = texto; el.appendChild(sr);
    texto.split(/\s+/).forEach(function (pal, i, arr) {
      var w = document.createElement('span'); w.className = 'palabra'; w.setAttribute('aria-hidden', 'true');
      if (porLetra) {
        Array.prototype.forEach.call(pal, function (ch) { var l = document.createElement('span'); l.className = 'letra'; l.textContent = ch; w.appendChild(l); });
      } else {
        var l = document.createElement('span'); l.className = 'letra'; l.textContent = pal; w.appendChild(l);
      }
      el.appendChild(w);
      if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
    });
    return $$('.letra', el);
  }
  if (motion) {
    $$('.portada-titulo [data-revelar]').forEach(function (el) { gsap.set(partir(el, true), { yPercent: 110, y: 0 }); });
    var titulos = $$('main [data-revelar]').filter(function (el) { return !el.closest('.portada'); });
    var ioTit = new IntersectionObserver(function (ent) {
      ent.forEach(function (e) {
        if (!e.isIntersecting) return;
        ioTit.unobserve(e.target);
        gsap.to($$('.letra', e.target), { yPercent: 0, y: 0, duration: 1, ease: 'expo.out', stagger: 0.045, clearProps: 'transform' });
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    titulos.forEach(function (el) { gsap.set(partir(el, false), { yPercent: 105, y: 0 }); ioTit.observe(el); });
  }

  /* ---------- Transición «loncheado» de bloques (IntersectionObserver + CSS) ---------- */
  var ioVista = new IntersectionObserver(function (ent) {
    ent.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('es-vista'); ioVista.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -15% 0px' });
  if (motion) {
    $$('.carta, .bascula, .calculadora, .mapa, .pizarras').forEach(function (el) {
      var t = document.createElement('span'); t.className = 'tapa'; t.setAttribute('aria-hidden', 'true');
      t.innerHTML = '<i></i><i></i><i></i><i></i><i></i>';
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.appendChild(t);
      ioVista.observe(el);
    });
  }
  $$('.pila-item').forEach(function (el) { ioVista.observe(el); });

  /* ---------- Horario: hoy, abierto o cerrado ---------- */
  var HORARIO = { 0: [], 1: [[540, 840]], 2: [[540, 840], [1020, 1230]], 3: [[540, 840], [1020, 1230]], 4: [[540, 840], [1020, 1230]], 5: [[540, 840], [1020, 1230]], 6: [[510, 870]] };
  var NOMBRES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var hora = function (m) { return Math.floor(m / 60) + ':' + ('0' + (m % 60)).slice(-2); };
  function estadoHorario() {
    var ahora = new Date(), d = ahora.getDay(), m = ahora.getHours() * 60 + ahora.getMinutes();
    var tramo = HORARIO[d].filter(function (t) { return m >= t[0] && m < t[1]; })[0];
    if (tramo) return { abierto: true, texto: 'Abierto ahora · cerramos a las ' + hora(tramo[1]) };
    var luego = HORARIO[d].filter(function (t) { return m < t[0]; })[0];
    if (luego) return { abierto: false, texto: 'Cerrado ahora · abrimos hoy a las ' + hora(luego[0]) };
    for (var i = 1; i <= 7; i++) {
      var dd = (d + i) % 7;
      if (HORARIO[dd].length) return { abierto: false, texto: 'Cerrado ahora · abrimos ' + (i === 1 ? 'mañana' : 'el ' + NOMBRES[dd]) + ' a las ' + hora(HORARIO[dd][0][0]) };
    }
  }
  function pintarHorario() {
    var hoy = new Date().getDay(), e = estadoHorario();
    $$('#horario tr').forEach(function (tr) { tr.classList.toggle('es-hoy', +tr.dataset.dia === hoy); });
    var ve = $('#visita-estado'); ve.textContent = e.texto; ve.classList.toggle('es-abierto', e.abierto);
    $('#portada-estado').textContent = e.texto;
    $('.punto-vivo').classList.toggle('es-cerrado', !e.abierto);
  }
  pintarHorario();
  setInterval(pintarHorario, 60000);

  /* ---------- Mostrador del día + báscula ---------- */
  var diaHoy = new Date().getDay();
  var diaMostrador = diaHoy === 0 ? 1 : diaHoy;
  var tabs = $$('.dia');
  var mostrador = $('#mostrador');
  mostrador.classList.add('tabs-listas');
  function elegirDia(n, enfocar) {
    tabs.forEach(function (t) {
      var si = +t.dataset.dia === n;
      t.setAttribute('aria-selected', si); t.tabIndex = si ? 0 : -1;
      if (si && enfocar) t.focus();
    });
    $$('.pizarra').forEach(function (p) { p.classList.toggle('es-activa', +p.dataset.dia === n); });
  }
  tabs.forEach(function (t, i) {
    if (+t.dataset.dia === diaHoy) t.classList.add('es-hoy');
    t.addEventListener('click', function () { elegirDia(+t.dataset.dia); });
    t.addEventListener('keydown', function (ev) {
      var k = ev.key, j = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') j = (i + 1) % tabs.length;
      if (k === 'ArrowUp' || k === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (k === 'Home') j = 0; if (k === 'End') j = tabs.length - 1;
      if (j !== null) { ev.preventDefault(); elegirDia(+tabs[j].dataset.dia, true); }
    });
  });
  elegirDia(diaMostrador);
  if (diaHoy === 0) $('#pizarra-domingo').hidden = false;

  var primera = $('.pizarra[data-dia="' + diaMostrador + '"] .pieza');
  $('#ticket-dia').textContent = diaHoy === 0 ? 'el lunes' : NOMBRES[diaHoy];
  $('#ticket-linea').textContent = primera.dataset.nombre;
  $('#ticket-precio').textContent = euros(+primera.dataset.precio) + ' €/kg';

  var bascula = { precio: 0 };
  var gramos = $('#bascula-gramos');
  function pesar() {
    var g = +gramos.value;
    $('#bascula-peso').textContent = g.toLocaleString('es-ES');
    var tot = $('#bascula-total');
    tot.textContent = euros(bascula.precio * g / 1000);
    tot.classList.remove('es-salto'); void tot.offsetWidth; tot.classList.add('es-salto');
  }
  function elegirPieza(b) {
    $$('.pieza.es-elegida').forEach(function (x) { x.classList.remove('es-elegida'); x.removeAttribute('aria-pressed'); });
    b.classList.add('es-elegida'); b.setAttribute('aria-pressed', 'true');
    bascula.precio = +b.dataset.precio;
    $('#bascula-pieza').textContent = b.dataset.nombre + ' · ' + euros(bascula.precio) + ' €/kg';
    pesar();
  }
  $$('.pieza').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); b.addEventListener('click', function () { elegirPieza(b); }); });
  gramos.addEventListener('input', pesar);
  $$('.bascula-atajos button').forEach(function (b) { b.addEventListener('click', function () { gramos.value = b.dataset.g; pesar(); }); });
  elegirPieza(primera);

  // Comparador (solo versión sobria): todo el mostrador en una vara
  (function () {
    var filas = $$('.pieza').map(function (b) { return { n: b.dataset.nombre, p: +b.dataset.precio, hoy: +b.closest('.pizarra').dataset.dia === diaMostrador }; });
    filas.sort(function (a, b) { return a.p - b.p; });
    var max = filas[filas.length - 1].p;
    $('#comparador-barras').innerHTML = filas.map(function (f) {
      return '<li class="' + (f.hoy ? 'es-hoy' : '') + '"><span>' + f.n + (f.hoy ? ' <small>(hoy)</small>' : '') + '</span><span class="barra" aria-hidden="true"><span style="--v:' + (f.p / max).toFixed(3) + '"></span></span><span class="valor">' + euros(f.p) + ' €/kg</span></li>';
    }).join('');
  })();

  /* ---------- Portada: la veta en WebGL, y el cursor es el cuchillo ---------- */
  // El shader se compila en su propia tarea, detrás de la cortina: así no se suma a la
  // tarea larga del arranque (GSAP + fuentes), y la cortina tapa la portada de todos modos.
  var veta = { colores: function () {} };
  setTimeout(function () { veta = iniciarVeta(); }, 30);
  function iniciarVeta() {
    var canvas = $('#veta');
    var gl = canvas && (canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' }) || canvas.getContext('experimental-webgl'));
    if (!gl) { html.classList.add('sin-webgl'); return { colores: function () {} }; }
    var VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
    var FS = [
      'precision highp float;',
      'uniform vec2 uRes;uniform float uT;uniform float uS;uniform vec3 uP[24];',
      'uniform vec3 uFondo;uniform vec3 uFibra;uniform vec3 uGrasa;',
      'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),u.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),u.x),u.y);}',
      'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}',
      'void main(){',
      ' vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;',
      ' float an=-.14-uS*.5;float c=cos(an),s=sin(an);mat2 R=mat2(c,s,-s,c);',
      ' vec2 q=R*p/(1.+uS*.7);',
      // el tajo: distancia a cada segmento del recorrido del cuchillo
      ' float disp=0.,tajo=0.;',
      ' for(int i=0;i<23;i++){vec3 A=uP[i];vec3 B=uP[i+1];float vida=1.-max(A.z,B.z);',
      '  if(vida>0.&&distance(A.xy,B.xy)<.25){vec2 pa=p-A.xy,ba=B.xy-A.xy;float k=clamp(dot(pa,ba)/max(dot(ba,ba),1e-6),0.,1.);vec2 d=pa-ba*k;float dd=dot(d,d);',
      '   disp+=sign((R*d).y+1e-5)*exp(-dd*140.)*vida;tajo=max(tajo,exp(-dd*5200.)*vida);}}',
      ' float t=uT*.025;',
      ' float w=fbm(q*vec2(1.1,2.6)+vec2(t,-t*.5));',
      ' float v=q.y+.16*w+disp*.022;',
      ' float b=v*46.;float id=floor(b);float f=fract(b);',
      ' float fib=smoothstep(0.,.2,f)*smoothstep(1.,.6,f);',
      ' float tono=.5+.5*h(vec2(id,3.1));',
      ' float g=fract(v*5.5+.35*fbm(q*3.));float sep=smoothstep(0.,.06,g)*smoothstep(1.,.94,g);',
      ' float m=fbm(q*vec2(2.2,6.5)+vec2(w*1.8-t*.6,0.));float vena=smoothstep(.935,.99,1.-abs(m*2.-1.));',
      ' float mota=smoothstep(.8,.86,fbm(q*vec2(9.,22.)+9.));',
      ' vec3 col=uFondo;',
      ' col=mix(col,mix(uFibra*.55,uFibra,tono),fib*sep*.9);',
      ' col=mix(col,uGrasa,clamp(vena+mota*.5,0.,1.)*.88);',
      ' col=mix(col,uGrasa,clamp(tajo,0.,1.));',
      ' float vig=smoothstep(1.3,.2,length(p*vec2(.75,1.)));',
      ' col*=mix(.5,1.,vig);',
      ' gl_FragColor=vec4(col,1.);',
      '}'
    ].join('\n');
    function sh(tipo, src) { var s = gl.createShader(tipo); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { throw new Error(gl.getShaderInfoLog(s)); } return s; }
    var prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (e) { html.classList.add('sin-webgl'); return { colores: function () {} }; }
    gl.useProgram(prog);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {}; ['uRes', 'uT', 'uS', 'uP', 'uFondo', 'uFibra', 'uGrasa'].forEach(function (k) { U[k] = gl.getUniformLocation(prog, k); });

    var N = 24, pts = new Float32Array(N * 3), vidaMs = 1500;
    var lista = []; // [{x, y, t}] lo más nuevo primero
    for (var i = 0; i < N; i++) pts[i * 3 + 2] = 1;
    var hex = function (h) { h = h.trim().replace('#', ''); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16) / 255; }); };
    function colores() {
      var cs = getComputedStyle(html);
      var f = hex(cs.getPropertyValue('--tinta')); f = f.map(function (v) { return v * 1.08; });
      gl.uniform3fv(U.uFondo, f);
      gl.uniform3fv(U.uFibra, hex(cs.getPropertyValue('--acento')));
      gl.uniform3fv(U.uGrasa, hex(cs.getPropertyValue('--grasa')));
      pintarUnaVez();
    }
    var W = 0, H = 0, dpr = 1;
    function medir() {
      dpr = Math.min(window.devicePixelRatio || 1, ratonFino ? 1.5 : 1.25);
      var r = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width * dpr)); H = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; gl.viewport(0, 0, W, H); }
      gl.uniform2f(U.uRes, W, H);
      pintarUnaVez();
    }
    // ResizeObserver: el 100svh del móvil cambia sin evento resize
    new ResizeObserver(medir).observe(canvas);

    var portada = $('#portada');
    function aShader(cx, cy) {
      var r = canvas.getBoundingClientRect();
      var x = (cx - r.left) * dpr, y = H - (cy - r.top) * dpr;
      return [(x - 0.5 * W) / H, (y - 0.5 * H) / H];
    }
    var ultimoMov = 0;
    function apuntar(cx, cy) {
      var p = aShader(cx, cy), ahora = performance.now();
      if (lista.length && ahora - lista[0].t < 16) { lista[0].x = p[0]; lista[0].y = p[1]; return; }
      lista.unshift({ x: p[0], y: p[1], t: ahora });
      if (lista.length > N) lista.length = N;
      ultimoMov = ahora;
    }
    portada.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' || e.buttons) apuntar(e.clientX, e.clientY); });
    portada.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') tajoAutomatico(e.clientX); });

    // Tajo automático: si nadie corta, corta la casa (y en táctil, al tocar)
    var auto = null;
    function tajoAutomatico(cx) {
      var r = canvas.getBoundingClientRect();
      var x0 = cx != null ? cx : r.left + r.width * (0.45 + Math.random() * 0.4);
      auto = { x0: x0 - r.width * 0.05, x1: x0 + r.width * 0.06, y0: r.top + r.height * 0.08, y1: r.top + r.height * 0.92, t0: performance.now(), d: 750 };
    }

    var S = 0, visible = true, t0 = performance.now(), ultimoAuto = performance.now();
    function subir() {
      var ahora = performance.now();
      for (var i = 0; i < N; i++) {
        var p = lista[i];
        if (p) { pts[i * 3] = p.x; pts[i * 3 + 1] = p.y; pts[i * 3 + 2] = Math.min(1, (ahora - p.t) / vidaMs); }
        else pts[i * 3 + 2] = 1;
      }
      gl.uniform3fv(U.uP, pts);
    }
    function pintarUnaVez() {
      subir();
      gl.uniform1f(U.uT, motion ? (performance.now() - t0) / 1000 : 12);
      gl.uniform1f(U.uS, S);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function fotograma() {
      if (!visible || document.hidden) return;
      var ahora = performance.now();
      if (auto) {
        var k = clamp((ahora - auto.t0) / auto.d, 0, 1), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        apuntar(auto.x0 + (auto.x1 - auto.x0) * e, auto.y0 + (auto.y1 - auto.y0) * e);
        if (k >= 1) { auto = null; ultimoAuto = ahora; }
      } else if (ahora - ultimoMov > 3200 && ahora - ultimoAuto > 3200) {
        tajoAutomatico();
      }
      pintarUnaVez();
    }
    if (motion) gsap.ticker.add(fotograma);
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(portada);

    // El scroll gira la veta y aprieta el titular (eje de peso de la variable)
    var titular = $('.portada-titulo');
    function alScroll() {
      S = clamp(window.scrollY / Math.max(1, portada.offsetHeight), 0, 1);
      titular.style.setProperty('--wght', Math.round(560 + S * 340));
      if (!motion) pintarUnaVez();
    }
    window.addEventListener('scroll', alScroll, { passive: true });
    alScroll();
    colores();
    if (!motion) {
      // Movimiento reducido: un solo fotograma con un tajo quieto ya hecho
      var r = canvas.getBoundingClientRect();
      for (var j = 0; j < 12; j++) lista.push({ x: aShader(r.left + r.width * (0.66 + j * 0.006), 0)[0], y: aShader(0, r.top + r.height * (0.85 - j * 0.065))[1], t: performance.now() - 700 });
      pintarUnaVez();
    }
    return { colores: colores };
  }

  /* ---------- Oficio: cinco gestos, un solo dibujo, progreso continuo ---------- */
  var oficio = (function () {
    var sec = $('#oficio'), escena = $('#oficio-escena');
    var res = $('#of-res'), linea = $('.of-res-linea'), relleno = $('.of-res-relleno');
    var cortes = $$('.of-cortes path'), nombres = $('.of-nombres'), lomo = $('.of-lomo'), grasa = $('.of-lomo-grasa');
    var dias = $('.of-dias'), diasNum = $('#of-dias-num');
    var filete = $('#of-filete'), lonchasF = $$('.of-loncha'), cuchillo = $('#of-cuchillo');
    var papel = $('#of-papel'), fondoP = $('.of-papel-fondo'), solA = $('.of-solapa-a'), solB = $('.of-solapa-b'), cordel = $('.of-cordel'), etiqueta = $('.of-etiqueta');
    var pasos = $$('.oficio-paso'), num = $('#oficio-num');
    var tramo = function (v, a, b) { return clamp((v - a) / (b - a), 0, 1); };
    var suave = function (k) { return k * k * (3 - 2 * k); };
    [linea, cordel].concat(cortes).forEach(function (p) { p.style.strokeDasharray = '1'; });
    var pasoActual = 0;
    function pintar(p) {
      var s1 = tramo(p, 0, 1), s2 = tramo(p, 1, 2), s3 = tramo(p, 2, 3), s4 = tramo(p, 3, 4), s5 = tramo(p, 4, 5);
      linea.style.strokeDashoffset = 1 - s1;
      relleno.style.opacity = suave(tramo(s1, 0.4, 1));
      cortes.forEach(function (c, i) { c.style.strokeDashoffset = 1 - tramo(s2, i * 0.1, i * 0.1 + 0.5); });
      nombres.style.opacity = tramo(s2, 0.5, 1);
      lomo.style.opacity = suave(s3); grasa.style.opacity = suave(tramo(s3, 0.3, 1));
      dias.style.opacity = tramo(s3, 0, 0.15) * (1 - tramo(s4, 0, 0.2));
      diasNum.textContent = Math.round(28 * s3);
      // 4: la res se retira, entra el filete y el cuchillo lo cruza dos veces
      var fuera = suave(tramo(s4, 0, 0.3));
      res.setAttribute('transform', 'translate(100 120) translate(300 160) scale(' + (1 - fuera * 0.35) + ') translate(-300 -160) translate(' + (-fuera * 260) + ' 0)');
      res.style.opacity = 1 - fuera;
      filete.style.opacity = suave(tramo(s4, 0.12, 0.35));
      var c1 = tramo(s4, 0.3, 0.52), c2 = tramo(s4, 0.55, 0.77);
      var cx = c2 > 0 ? 466 : 336, cy = -150 + (c2 > 0 ? c2 : c1) * 560;
      cuchillo.setAttribute('transform', 'translate(' + cx + ' ' + cy + ')');
      cuchillo.style.opacity = (c1 > 0 && (c2 < 1)) ? 1 : 0;
      var abre = suave(tramo(s4, 0.78, 1));
      lonchasF.forEach(function (l, i) {
        var dx = (i - 1) * 30 * abre, rot = (i - 1) * 4 * abre;
        l.setAttribute('transform', 'translate(' + dx + ' ' + (Math.abs(i - 1) * 6 * abre) + ') rotate(' + rot + ' 405 300)');
      });
      // 5: papel, solapas, cordel y etiqueta
      papel.style.opacity = s5 > 0 ? 1 : 0;
      fondoP.setAttribute('transform', 'translate(0 ' + (1 - suave(tramo(s5, 0, 0.35))) * 420 + ')');
      var sa = suave(tramo(s5, 0.3, 0.55)), sb = suave(tramo(s5, 0.42, 0.67));
      solA.setAttribute('transform', 'translate(190 0) scale(' + sa + ' 1) translate(-190 0)');
      solB.setAttribute('transform', 'translate(620 0) scale(' + sb + ' 1) translate(-620 0)');
      cordel.style.strokeDashoffset = 1 - tramo(s5, 0.62, 0.86);
      var se = suave(tramo(s5, 0.84, 1));
      etiqueta.style.opacity = se;
      etiqueta.setAttribute('transform', 'rotate(' + (-8 * (1 - se)) + ' 515 320) translate(0 ' + (1 - se) * -20 + ')');
      filete.style.visibility = s5 >= 0.4 ? 'hidden' : 'visible';
      // el paso n se dibuja entre n-1 y n: el rótulo acompaña al dibujo que se está haciendo
      var paso = clamp(Math.ceil(p - 0.02), 1, 5);
      if (paso !== pasoActual) {
        pasoActual = paso;
        pasos.forEach(function (li) { li.classList.toggle('es-activo', +li.dataset.paso === paso); });
        num.textContent = '0' + paso;
      }
    }
    if (motion) {
      sec.classList.add('oficio-anclado');
      var proxy = { p: 0 };
      gsap.to(proxy, {
        p: 5, ease: 'none',
        scrollTrigger: { trigger: escena, pin: true, start: 'top top', end: function () { return '+=' + window.innerHeight * 4.2; }, scrub: 0.7, anticipatePin: 1 },
        onUpdate: function () { pintar(proxy.p); }
      });
      pintar(0.0001);
    } else {
      // Sin anclar: manda el paso más cercano al centro de la pantalla, sin animación
      var elegir = function () {
        var c = window.innerHeight / 2, mejor = null, d = Infinity;
        pasos.forEach(function (li) { var r = li.getBoundingClientRect(), x = Math.abs(r.top + r.height / 2 - c); if (x < d) { d = x; mejor = li; } });
        if (mejor) pintar(+mejor.dataset.paso);
      };
      var pend = false;
      var io = new IntersectionObserver(function (ent) {
        if (ent.some(function (e) { return e.isIntersecting; })) { window.addEventListener('scroll', alMover, { passive: true }); elegir(); }
        else window.removeEventListener('scroll', alMover);
      });
      var alMover = function () { if (!pend) { pend = true; requestAnimationFrame(function () { pend = false; elegir(); }); } };
      io.observe(sec);
      pintar(2);
    }
    return { pintar: pintar };
  })();

  // Bordes en sesgo que se enderezan al entrar: la sección llega cortada, no fundida
  if (motion) {
    [['.oficio', 'top bottom', 'top 25%'], ['.curados', 'top bottom', 'top 25%']].forEach(function (c) {
      gsap.fromTo(c[0], { '--sesgo': function () { return Math.round(window.innerWidth * 0.09) + 'px'; } }, {
        '--sesgo': '0px', ease: 'none', scrollTrigger: { trigger: c[0], start: c[1], end: c[2], scrub: true }
      });
    });
  }

  /* ---------- Despiece: plato → pieza ---------- */
  (function () {
    var P = {
      ternera: {
        nombre: 'Ternera',
        carrillera: ['Carrillera', 'La mejilla: músculo que trabaja todo el día y por eso pide horas de guiso. Se deshace.', ['guiso'], 16.90],
        pescuezo: ['Pescuezo', 'Carne de mucho trabajo y mucho sabor. La de los caldos serios y la picada para albóndigas.', ['guiso', 'cocido'], 11.90],
        aguja: ['Aguja', 'Lomo alto delantero, veteado. Guisada queda melosa; en filete grueso, a la plancha.', ['guiso', 'plancha'], 13.20],
        lomo: ['Lomo', 'El lomo bajo: entrecot y chuletón. Es la pieza que madura 28 días en cámara.', ['plancha', 'horno'], 26.50],
        cadera: ['Cadera', 'Magra y tierna sin ser solomillo. Filetes para la plancha y la mejor carne para tartar.', ['plancha', 'filetes'], 19.80],
        tapa: ['Tapa y redondo', 'Pieza grande y magra de la pierna. Filetes para empanar y el redondo para el horno.', ['filetes', 'horno'], 17.40],
        falda: ['Falda', 'Fibra larga y grasa que se funde. Al cocido o en guiso largo; cortada a contraveta, sorprende.', ['cocido', 'guiso'], 10.90],
        pecho: ['Pecho y costilla', 'Hueso, cartílago y sabor. La pieza que da cuerpo al caldo del cocido.', ['cocido', 'guiso'], 11.50],
        morcillo: ['Morcillo y jarrete', 'Gelatina por dentro: el guiso de los martes y el osobuco.', ['cocido', 'guiso'], 14.50]
      },
      cerdo: {
        nombre: 'Cerdo',
        oreja: ['Cabeza y oreja', 'Cachucha, oreja y morro: lo que no puede faltar en un cocido de la Terra Chá.', ['cocido'], 5.90],
        lacon: ['Lacón', 'La pata delantera. Salado para el cocido con grelos, fresco para el horno.', ['cocido', 'horno'], 7.20],
        cinta: ['Cinta de lomo', 'Magra y limpia. En filetes, en raxo adobado o asada entera.', ['plancha', 'horno', 'filetes'], 9.90],
        'solomillo-cerdo': ['Solomillo', 'La pieza más tierna del cerdo. Entero al horno o en medallones a la plancha.', ['plancha', 'horno'], 12.80],
        costilla: ['Costilla', 'Adobada al horno o salgada para el cocido. Se corta en tiras o en trozos.', ['horno', 'cocido'], 8.90],
        panceta: ['Panceta', 'Capas de magro y grasa. Fresca a la plancha, curada al cocido.', ['plancha', 'cocido'], 8.20],
        jamon: ['Pierna', 'Magra. Asada entera en las fiestas o en filetes finos para empanar.', ['horno', 'filetes'], 8.60],
        manos: ['Manos', 'Pura gelatina. Al cocido o guisadas con garbanzos.', ['cocido', 'guiso'], 4.80]
      },
      ave: {
        nombre: 'Pollo de corral',
        carcasa: ['Carcasa', 'Hueso y lo que queda pegado: el mejor caldo, el del cocido y el de los enfermos.', ['cocido'], 2.90],
        pechuga: ['Pechuga', 'Magra y fina. Fileteada para la plancha o empanada.', ['plancha', 'filetes'], 11.40],
        ala: ['Alas', 'Al horno con limón y ajo, hasta que la piel cruje.', ['horno'], 5.90],
        contramuslo: ['Contramuslo', 'Deshuesado, la pieza más agradecida del pollo: horno, guiso o plancha.', ['horno', 'guiso', 'plancha'], 8.90],
        muslo: ['Muslo', 'Con hueso, para el horno o para el pollo guisado de los domingos.', ['horno', 'guiso'], 7.60]
      }
    };
    var estado = { animal: 'ternera', plato: null, pieza: 'lomo' };
    var lista = $('#ficha-lista');
    function ficha() {
      var a = P[estado.animal], d = a[estado.pieza];
      $('#ficha-animal').textContent = a.nombre;
      $('#ficha-nombre').textContent = d[0];
      $('#ficha-texto').textContent = d[1];
      $('#ficha-platos').textContent = d[2].join(', ');
      $('#ficha-precio').textContent = euros(d[3]) + ' €/kg';
      $$('.carta-svg .region').forEach(function (r) { r.classList.toggle('es-sel', r.dataset.pieza === estado.pieza); r.setAttribute('aria-pressed', r.dataset.pieza === estado.pieza); });
      $$('button', lista).forEach(function (b) { b.setAttribute('aria-current', b.dataset.pieza === estado.pieza); });
    }
    function platos() {
      var a = P[estado.animal];
      $$('.region').forEach(function (r) {
        var d = (P[r.closest('svg').dataset.animal] || {})[r.dataset.pieza];
        r.classList.toggle('es-plato', !!(estado.plato && d && d[2].indexOf(estado.plato) > -1));
      });
      $$('button', lista).forEach(function (b) { b.classList.toggle('es-plato', !!(estado.plato && a[b.dataset.pieza][2].indexOf(estado.plato) > -1)); });
      $$('.plato').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.plato === estado.plato); });
    }
    function animal(n) {
      estado.animal = n;
      var a = P[n];
      $$('.animal').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.animal === n); });
      $$('.carta-svg').forEach(function (s) { s.hidden = s.dataset.animal !== n; });
      var claves = Object.keys(a).filter(function (k) { return k !== 'nombre'; });
      var conPlato = estado.plato && claves.filter(function (k) { return a[k][2].indexOf(estado.plato) > -1; })[0];
      estado.pieza = conPlato || (n === 'ternera' ? 'lomo' : n === 'cerdo' ? 'lacon' : 'pechuga');
      lista.innerHTML = claves.map(function (k) { return '<li><button type="button" data-pieza="' + k + '">' + a[k][0] + '</button></li>'; }).join('');
      $$('button', lista).forEach(function (b) { b.addEventListener('click', function () { estado.pieza = b.dataset.pieza; ficha(); }); });
      ficha(); platos();
      var svg = $('.carta-svg[data-animal="' + n + '"]');
      if (motion) gsap.fromTo($$('.region', svg), { scale: 0.92, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.7, ease: 'expo.out', stagger: 0.03, clearProps: 'transform' });
    }
    $$('.region').forEach(function (r) {
      var an = r.closest('svg').dataset.animal;
      r.setAttribute('aria-label', P[an][r.dataset.pieza][0]);
      var elegir = function () { estado.pieza = r.dataset.pieza; ficha(); };
      r.addEventListener('click', elegir);
      r.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); elegir(); } });
    });
    $$('.animal').forEach(function (b) { b.addEventListener('click', function () { animal(b.dataset.animal); }); });
    $$('.plato').forEach(function (b) {
      b.addEventListener('click', function () {
        estado.plato = estado.plato === b.dataset.plato ? null : b.dataset.plato;
        var a = P[estado.animal];
        var primera = estado.plato && Object.keys(a).filter(function (k) { return k !== 'nombre' && a[k][2].indexOf(estado.plato) > -1; })[0];
        if (primera) estado.pieza = primera;
        ficha(); platos();
      });
    });
    animal('ternera');
  })();

  /* ---------- Curados: pila sticky. Mismo alto (el de la más alta) para todas ---------- */
  var pila = $('#pila');
  function medirPila() {
    var items = $$('.pila-item', pila);
    pila.style.removeProperty('--alto-pila');
    var max = 0;
    items.forEach(function (li, i) { li.style.setProperty('--i', i); max = Math.max(max, $('.curado', li).offsetHeight); });
    pila.style.setProperty('--alto-pila', max + 'px');
    // el reposo del último: lo que falta para que se vea entera antes de soltarse
    pila.style.setProperty('--reposo', Math.max(0, window.innerHeight * 0.12) + 'px');
  }
  medirPila();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { medirPila(); if (gsapReady) ScrollTrigger.refresh(); });
  var anchoPila = pila.offsetWidth;
  new ResizeObserver(function () { if (pila.offsetWidth !== anchoPila) { anchoPila = pila.offsetWidth; medirPila(); } }).observe(pila);
  if (motion) {
    $$('.pila-item', pila).forEach(function (li, i, arr) {
      if (i === arr.length - 1) return;
      gsap.to($('.curado', li), {
        scale: 0.93, ease: 'none',
        scrollTrigger: { trigger: arr[i + 1], start: 'top bottom', end: function () { return 'top ' + (cabH() + 20) + 'px'; }, scrub: true }
      });
    });
  }

  /* ---------- Cinta de preparados: velocidad ligada al scroll ---------- */
  (function () {
    var pista = $('#cinta-pista');
    if (!pista || !motion) return;
    var x = 0, mitad = pista.scrollWidth / 2, ultimoY = window.scrollY, vel = 0;
    window.addEventListener('resize', function () { mitad = pista.scrollWidth / 2; });
    gsap.ticker.add(function (t, dt) {
      var y = window.scrollY, dy = y - ultimoY; ultimoY = y;
      vel += (dy - vel) * 0.1;
      x -= (0.6 + Math.abs(vel) * 0.35) * (dt / 16.67) * (vel < -0.5 ? -1 : 1);
      if (x <= -mitad) x += mitad; if (x > 0) x -= mitad;
      pista.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0) skewX(' + clamp(-vel * 0.25, -8, 8).toFixed(2) + 'deg)';
    });
  })();

  /* ---------- Calculadora de cocido ---------- */
  (function () {
    var LOTE = [
      ['Lacón salado', 180, 7.20], ['Costilla salgada', 90, 8.40], ['Chorizo de la casa', 60, 16.80],
      ['Morcillo de ternera', 80, 14.50], ['Gallina para caldo', 120, 6.20], ['Oreja y cachucha', 40, 5.90], ['Unto curado', 8, 9.00]
    ];
    var n = $('#calc-n'), rango = $('#calc-rango'), filas = $('#calc-filas'), total = $('#calc-total'), nota = $('#encargo-nota');
    var notaAuto = true;
    nota.addEventListener('input', function () { notaAuto = false; });
    var peso = function (g) { return g >= 1000 ? (g / 1000).toLocaleString('es-ES', { maximumFractionDigits: 2 }) + ' kg' : Math.round(g) + ' g'; };
    function calc() {
      var personas = +rango.value, k = +$('input[name="apetito"]:checked').value, suma = 0, resumen = [];
      n.textContent = personas;
      filas.innerHTML = LOTE.map(function (l) {
        var g = Math.ceil(l[1] * personas * k / 10) * 10, eur = g / 1000 * l[2]; suma += eur;
        resumen.push(l[0].toLowerCase() + ' ' + peso(g));
        return '<tr><th scope="row">' + l[0] + '</th><td>' + peso(g) + '</td><td>' + euros(eur) + ' €</td></tr>';
      }).join('');
      total.textContent = euros(suma) + ' €';
      if (notaAuto) nota.value = 'Lote de cocido para ' + personas + ': ' + resumen.join(', ') + '.';
    }
    rango.addEventListener('input', calc);
    $$('input[name="apetito"]').forEach(function (r) { r.addEventListener('change', calc); });
    $('.calc-menos').addEventListener('click', function () { rango.value = Math.max(2, +rango.value - 1); calc(); });
    $('.calc-mas').addEventListener('click', function () { rango.value = Math.min(24, +rango.value + 1); calc(); });
    $('#calculadora').addEventListener('submit', function (e) { e.preventDefault(); });
    calc();

    var form = $('#encargo'), resp = $('#encargo-respuesta');
    var hoy = new Date(); hoy.setDate(hoy.getDate() + 3);
    form.dia.min = hoy.toISOString().slice(0, 10);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var malos = ['nombre', 'tel', 'dia'].filter(function (k) { var c = form[k]; var ok = c.value.trim() !== '' && c.checkValidity(); c.setAttribute('aria-invalid', !ok); return !ok; });
      if (malos.length) { resp.hidden = false; resp.textContent = 'Falta rellenar: ' + malos.map(function (k) { return { nombre: 'nombre', tel: 'teléfono', dia: 'día de recogida (con tres días de margen)' }[k]; }).join(', ') + '.'; form[malos[0]].focus(); return; }
      var f = new Date(form.dia.value + 'T12:00');
      resp.hidden = false;
      resp.textContent = 'Encargo de muestra anotado para ' + form.nombre.value.trim() + ', recogida el ' + f.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) + '. Es una demostración: no se ha enviado nada a nadie.';
    });
  })();

  /* ---------- Contadores (cambian también con movimiento reducido) ---------- */
  var ioCifras = new IntersectionObserver(function (ent) {
    ent.forEach(function (e) {
      if (!e.isIntersecting) return;
      ioCifras.unobserve(e.target);
      var el = e.target, fin = +el.dataset.contar;
      if (!motion) { el.textContent = fin; return; }
      var t0 = performance.now(), d = 1600;
      (function paso(t) {
        var k = clamp((t - t0) / d, 0, 1), ease = 1 - Math.pow(1 - k, 4);
        el.textContent = Math.round(fin * ease);
        if (k < 1) requestAnimationFrame(paso);
      })(t0);
    });
  }, { threshold: 0.6 });
  $$('[data-contar]').forEach(function (el) { ioCifras.observe(el); });

  /* ---------- Cabecera clara/oscura según lo que tenga debajo ---------- */
  var cab = $('#cabecera'), oscuras = $$('.portada, .oficio, .curados, .pie');
  var pend = false;
  function tonoCabecera() {
    pend = false;
    var y = cab.offsetHeight / 2;
    cab.classList.toggle('sobre-oscuro', oscuras.some(function (s) { var r = s.getBoundingClientRect(); return r.top <= y && r.bottom >= y; }));
  }
  window.addEventListener('scroll', function () { if (!pend) { pend = true; requestAnimationFrame(tonoCabecera); } }, { passive: true });
  tonoCabecera();

  /* ---------- Menú móvil ---------- */
  var menuBtn = $('#menu-boton'), menu = $('#menu');
  function cerrarMenu() {
    if (menuBtn.getAttribute('aria-expanded') !== 'true') return;
    menuBtn.setAttribute('aria-expanded', 'false'); menu.classList.remove('es-abierto'); html.classList.remove('menu-abierto');
    if (lenis) lenis.start();
  }
  menuBtn.addEventListener('click', function () {
    var abrir = menuBtn.getAttribute('aria-expanded') !== 'true';
    if (!abrir) { cerrarMenu(); return; }
    menuBtn.setAttribute('aria-expanded', 'true'); menu.classList.add('es-abierto'); html.classList.add('menu-abierto');
    if (lenis) lenis.stop();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { cerrarMenu(); } });

  /* ---------- Mapa solo bajo clic ---------- */
  $('#mapa-boton').addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Rúa dos Coiteleiros 9, 27800 Vilalba, Lugo') + '&output=embed';
    f.title = 'Mapa de Vilalba'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
    var mapa = $('#mapa'); mapa.innerHTML = ''; mapa.appendChild(f);
  });

  /* ---------- Aviso de cookies ---------- */
  var cookies = $('#cookies');
  if (!leer('mouriscal-cookies')) { cookies.hidden = false; html.classList.add('cookies-visible'); }
  $('#cookies-ok').addEventListener('click', function () {
    guardar('mouriscal-cookies', '1'); cookies.hidden = true; html.classList.remove('cookies-visible');
  });

  /* ---------- AVISO: mandos de DEMOSTRACIÓN (maqueta y color). No viajan al cliente ---------- */
  (function () {
    var mandos = $('#mandos');
    if (!/[?&]revision\b/.test(location.search)) return;
    mandos.hidden = false;
    function marcar() {
      var sobria = html.classList.contains('maqueta-sobria');
      $$('[data-maqueta]', mandos).forEach(function (b) { b.setAttribute('aria-pressed', (b.dataset.maqueta === 'sobria') === sobria); });
      var pal = html.classList.contains('paleta-azafran') ? 'azafran' : html.classList.contains('paleta-ciruela') ? 'ciruela' : 'lomo';
      $$('[data-paleta]', mandos).forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.paleta === pal); });
    }
    $$('[data-maqueta]', mandos).forEach(function (b) {
      b.addEventListener('click', function () {
        html.classList.toggle('maqueta-sobria', b.dataset.maqueta === 'sobria');
        guardar('mouriscal-maqueta', b.dataset.maqueta);
        marcar(); medirPila(); if (gsapReady) ScrollTrigger.refresh();
      });
    });
    $$('[data-paleta]', mandos).forEach(function (b) {
      b.addEventListener('click', function () {
        html.classList.remove('paleta-azafran', 'paleta-ciruela');
        if (b.dataset.paleta !== 'lomo') html.classList.add('paleta-' + b.dataset.paleta);
        guardar('mouriscal-paleta', b.dataset.paleta);
        marcar(); veta.colores();
      });
    });
    marcar();
  })();
  /* /mandos */

  /* ---------- Imán ---------- */
  if (motion && ratonFino) {
    $$('[data-iman]').forEach(function (el) {
      var qx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' }), qy = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        qx((e.clientX - (r.left + r.width / 2)) * 0.28); qy((e.clientY - (r.top + r.height / 2)) * 0.38);
      });
      el.addEventListener('pointerleave', function () { gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, .4)' }); });
    });
  }

  /* ---------- Cursor propio: punto + aro, solo con ratón y nunca en táctil ---------- */
  (function () {
    var cur = $('.cursor');
    if (!cur || reducido || !ratonFino) return; // en táctil nunca, aunque llegue un evento «mouse» sintético
    var punto = $('.cursor-punto'), aro = $('.cursor-aro'), txt = $('.cursor-texto');
    var ax = 0, ay = 0, mx = 0, my = 0, encendido = false;
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      if (!encendido) { encendido = true; html.classList.add('cursor-on'); ax = e.clientX; ay = e.clientY; }
      mx = e.clientX; my = e.clientY;
      punto.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      var t = e.target, clase = '', texto = '';
      if (t.closest && t.closest('.pieza')) { clase = 'es-texto'; texto = 'pesar'; }
      else if (t.closest && t.closest('.region')) { clase = 'es-texto'; texto = 'ver'; }
      else if (t.closest && t.closest('a, button, input, label, select, textarea, summary')) clase = 'es-enlace';
      else if (t.closest && t.closest('.portada')) clase = 'es-cuchillo';
      cur.className = 'cursor ' + clase; txt.textContent = texto;
    }, { passive: true });
    document.addEventListener('pointerleave', function () { html.classList.remove('cursor-on'); encendido = false; });
    (function bucle() {
      ax += (mx - ax) * 0.2; ay += (my - ay) * 0.2;
      aro.style.transform = 'translate3d(' + ax.toFixed(1) + 'px,' + ay.toFixed(1) + 'px,0)';
      requestAnimationFrame(bucle);
    })();
  })();

  if (gsapReady) window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
