/* Ida e Retorno · Instalacións — plantilla «Circuito»
   Sitio de demostración de un negocio ficticio.

   Banderas: `gsapReady` (GSAP + ScrollTrigger cargados) y `motion` (sin
   prefers-reduced-motion) van separadas. Sin GSAP o con movimiento reducido,
   el contenido sigue cambiando (lectura térmica, paso de la obra, manómetro,
   estado del horario): se apaga el movimiento, no el contenido. */
(function () {
  'use strict';

  var d = document, html = d.documentElement;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var gsap = window.gsap, ST = window.ScrollTrigger;
  var gsapReady = !!(gsap && ST);
  var mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  var motion = !mqReduce.matches;
  var mqMovil = matchMedia('(max-width: 900px)');
  var finoRaton = matchMedia('(hover: hover) and (pointer: fine)');
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Medición: tareas largas (para la verificación) ---------- */
  window.__longtasks = window.__longtasks || [];
  try {
    new PerformanceObserver(function (l) {
      l.getEntries().forEach(function (e) { window.__longtasks.push({ t: Math.round(e.startTime), d: Math.round(e.duration) }); });
    }).observe({ type: 'longtask', buffered: true });
  } catch (e) {}

  if (gsapReady && motion) html.classList.add('has-motion');
  if (gsapReady) { gsap.registerPlugin(ST); gsap.config({ autoSleep: 60 }); }

  /* ---------- Lenis: único motor de scroll ---------- */
  var lenis = null;
  if (motion && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.14, smoothWheel: true, wheelMultiplier: 1 });
    if (gsapReady) {
      lenis.on('scroll', ST.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function bucle(t) { lenis.raf(t); requestAnimationFrame(bucle); })(performance.now());
    }
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var t = $(id); if (!t) return;
        e.preventDefault(); cerrarMenu();
        lenis.scrollTo(t, { offset: id === '#inicio' ? 0 : -16, duration: 1.4 });
        history.replaceState(null, '', id);
      });
    });
  }

  /* ---------- Char-reveal: partir en palabras y letras ---------- */
  function partirLetras(el) {
    $$('.linea', el).forEach(function (linea) {
      var nodos = Array.prototype.slice.call(linea.childNodes);
      linea.textContent = '';
      nodos.forEach(function (n) {
        var destino = linea, texto = n.textContent;
        if (n.nodeType === 1) { destino = n.cloneNode(false); linea.appendChild(destino); }
        texto.split(/(\s+)/).forEach(function (w) {
          if (!w) return;
          if (/^\s+$/.test(w)) { destino.appendChild(d.createTextNode(' ')); return; }
          var p = d.createElement('span'); p.className = 'palabra';
          w.split('').forEach(function (ch) { var l = d.createElement('span'); l.className = 'letra'; l.textContent = ch; p.appendChild(l); });
          destino.appendChild(p);
        });
      });
    });
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    $$('.linea', el).forEach(function (l) { l.setAttribute('aria-hidden', 'true'); });
  }
  function partirPalabras(el) {
    var texto = el.textContent.trim();
    el.setAttribute('aria-label', texto);
    el.textContent = '';
    texto.split(/\s+/).forEach(function (w, i) {
      var m = d.createElement('span'); m.className = 'palabra-mascara'; m.setAttribute('aria-hidden', 'true');
      var s = d.createElement('span'); s.textContent = w; m.appendChild(s);
      el.appendChild(m); el.appendChild(d.createTextNode(' '));
    });
  }
  var titular = $('[data-letras]');
  if (gsapReady && motion) {
    partirLetras(titular);
    gsap.set($$('.letra', titular), { yPercent: 115, y: 0 });
    $$('[data-palabras]').forEach(function (el) {
      partirPalabras(el);
      var piezas = $$('.palabra-mascara > span', el);
      gsap.set(piezas, { yPercent: 110, y: 0 });
      alVer(el, function () { gsap.to(piezas, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.035 }); }, '0px 0px -15% 0px');
    });
  }

  /* ---------- Utilidad: «una sola vez» con IntersectionObserver ---------- */
  function alVer(el, fn, margen) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); fn(); } });
    }, { rootMargin: margen || '0px 0px -12% 0px' });
    io.observe(el);
  }
  $$('.conducto, .tc').forEach(function (el) { alVer(el, function () { el.classList.add('es-visible'); }); });
  var colector = $('.colector');
  $$('li', colector).forEach(function (li, i) { li.style.setProperty('--n', i); });
  alVer(colector, function () { colector.classList.add('es-visible'); }, '0px 0px -20% 0px');
  var papeles = $('.papeles');
  alVer(papeles, function () {
    papeles.classList.add('es-cortando');
    setTimeout(function () { papeles.classList.add('es-abierta'); }, motion ? 520 : 0);
  }, '0px 0px -30% 0px');

  /* ---------- Cortina: la pared se abre por la roza ---------- */
  var cortina = $('.cortina');
  function quitarCortina() { cortina.style.display = 'none'; }
  function entradaPortada() {
    termo.arrancar();
    if (!(gsapReady && motion)) return;
    var ancho = mqMovil.matches ? '104%' : '116%';
    gsap.timeline()
      .to($$('.letra', titular), { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.028 }, 0)
      .fromTo(titular, { '--ancho': '75%' }, { '--ancho': ancho, duration: 1.8, ease: 'expo.out', immediateRender: false, clearProps: '--ancho' }, 0)
      .fromTo('.antetitulo, .portada-entrada, .portada-acciones, .lectura', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', stagger: 0.08, immediateRender: false }, 0.35);
  }
  var fuentes = d.fonts && d.fonts.ready ? Promise.race([d.fonts.ready, new Promise(function (r) { setTimeout(r, 1500); })]) : Promise.resolve();
  if (gsapReady && motion) {
    gsap.set('.antetitulo, .portada-entrada, .portada-acciones, .lectura', { autoAlpha: 0 });
    fuentes.then(function () {
      gsap.timeline({ onComplete: quitarCortina })
        .to('.cortina-roza', { scaleX: 1, duration: 0.75, ease: 'expo.inOut' })
        .to('.cortina-texto', { autoAlpha: 0, duration: 0.3 }, 0.2)
        .to('.cortina-arriba', { yPercent: -106, borderBottomLeftRadius: '50% 40%', borderBottomRightRadius: '50% 40%', duration: 1.15, ease: 'expo.inOut' }, 0.7)
        .to('.cortina-abajo', { yPercent: 106, borderTopLeftRadius: '50% 40%', borderTopRightRadius: '50% 40%', duration: 1.15, ease: 'expo.inOut' }, 0.7)
        .to('.cortina-roza', { autoAlpha: 0, duration: 0.25 }, 0.75)
        .add(entradaPortada, 1.15);
    });
  } else {
    fuentes.then(function () {
      cortina.classList.add('cortina-fuera');
      setTimeout(quitarCortina, motion ? 950 : 30);
      entradaPortada();
    });
  }

  /* ---------- Portada: cámara termográfica en WebGL ---------- */
  var termo = (function () {
    var canvas = $('.termo'), portada = $('.portada');
    var lecturaT = $('[data-temp]'), lecturaZ = $('[data-zona]');
    var gl = null, prog, tex, uni = {}, datos = null, TW = 0, TH = 0;
    var W = 0, H = 0, dpr = 1, visible = true, corriendo = false, arrancado = false, t0 = performance.now();
    var lente = { x: 0.72, y: 0.5, tx: 0.72, ty: 0.5 }, ultimoRaton = -1e9, tocando = false;
    var frente = 0, frenteIntro = 0, scrollP = 0, colores = { q: [1, .46, .33], f: [.3, .72, .94] };
    var trazado = null;
    window.__termoFrames = 0;

    function hexRgb(h) { h = h.trim(); if (h[0] !== '#') return null; return [1, 3, 5].map(function (i) { return parseInt(h.slice(i, i + 2), 16) / 255; }); }
    function leerColores() {
      var cs = getComputedStyle(html);
      colores.q = hexRgb(cs.getPropertyValue('--quente')) || colores.q;
      colores.f = hexRgb(cs.getPropertyValue('--fria')) || colores.f;
    }

    // Trazado: suelo radiante en doble espiral (ida hacia dentro, retorno hacia fuera,
    // intercalados como se instala de verdad) con su alimentación desde abajo.
    function generarTrazado(w, h) {
      var movil = w < 900 * 0.5;
      var cx, cy, rx, ry;
      if (movil) { cx = w * 0.5; cy = h * 0.37; rx = w * 0.44; ry = h * 0.24; }
      else { cx = w * 0.7; cy = h * 0.52; rx = w * 0.25; ry = h * 0.36; }
      // ida: r = kθ de fuera adentro; retorno: r = k(θ−π) de dentro afuera. Los dos extremos
      // exteriores quedan juntos y abajo (ángulo π/2), como en un colector de verdad.
      var vueltas = movil ? 3.25 : 4.25, tmax = vueltas * Math.PI * 2, q = 0.55, pts = [];
      function punto(r, a) {
        var c = Math.cos(a), s = Math.sin(a);
        return [cx + rx * r * (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), q), cy + ry * r * (s < 0 ? -1 : 1) * Math.pow(Math.abs(s), q)];
      }
      var paso = 0.03, sep = Math.min(rx, ry) * Math.PI / tmax; // media vuelta de paso: ida y retorno intercalados
      var pa = punto(1, tmax), pb = punto((tmax - Math.PI) / tmax, tmax);
      pts.push([pa[0] + sep * 1.6, h + 10], [pa[0] + sep * 1.6, pa[1] + sep * .8]);
      for (var th = tmax; th > 0; th -= paso) pts.push(punto(th / tmax, th));
      for (th = Math.PI; th <= tmax; th += paso) pts.push(punto((th - Math.PI) / tmax, th));
      pts.push(pb, [pb[0] - sep * 1.6, pb[1] + sep * .8], [pb[0] - sep * 1.6, h + 10]);
      // longitud acumulada → parámetro s (0 en la caldera, 1 al volver)
      var L = [0];
      for (var i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      return { pts: pts, L: L, total: L[L.length - 1], sep: sep, cable: movil ? [w * 0.06, h * 0.1, w * 0.94, h * 0.1] : [w * 0.42, h * 0.1, w * 0.98, h * 0.1], empalme: movil ? [w * 0.8, h * 0.1] : [w * 0.86, h * 0.1] };
    }

    function pintarTextura() {
      TW = Math.max(160, Math.round(W / 2)); TH = Math.max(160, Math.round(H / 2));
      trazado = generarTrazado(TW, TH);
      var c = d.createElement('canvas'); c.width = TW; c.height = TH;
      var x = c.getContext('2d', { willReadFrequently: true });
      function camino() { x.beginPath(); trazado.pts.forEach(function (p, i) { i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]); }); }
      x.lineJoin = 'round'; x.lineCap = 'round';
      var sep = trazado.sep;
      // R: calor difundido alrededor del tubo (varias pasadas, sin filtros: se hace una vez)
      x.fillStyle = '#000'; x.fillRect(0, 0, TW, TH);
      x.globalCompositeOperation = 'lighter';
      [[2.6, .10], [1.8, .15], [1.2, .22], [.7, .4], [.34, .55]].forEach(function (p) { camino(); x.lineWidth = sep * p[0]; x.strokeStyle = 'rgba(255,255,255,' + p[1] + ')'; x.stroke(); });
      var R = x.getImageData(0, 0, TW, TH).data;
      // G: parámetro s a lo largo del tubo
      x.globalCompositeOperation = 'source-over'; x.fillStyle = '#000'; x.fillRect(0, 0, TW, TH);
      // dos pasadas: una ancha que cubre el halo y otra exacta sobre el tubo; tapa redonda, sin rendijas
      x.lineCap = 'round';
      [2.8, 1].forEach(function (ancho) {
        x.lineWidth = sep * ancho;
        for (var i = 1; i < trazado.pts.length; i++) {
          var v = Math.round(trazado.L[i] / trazado.total * 255);
          x.strokeStyle = 'rgb(' + v + ',' + v + ',' + v + ')';
          x.beginPath(); x.moveTo(trazado.pts[i - 1][0], trazado.pts[i - 1][1]); x.lineTo(trazado.pts[i][0], trazado.pts[i][1]); x.stroke();
        }
      });
      var G = x.getImageData(0, 0, TW, TH).data;
      // B: calor fijo — la línea eléctrica templada y un empalme que calienta
      x.fillStyle = '#000'; x.fillRect(0, 0, TW, TH);
      x.lineCap = 'round'; x.strokeStyle = 'rgba(255,255,255,.28)'; x.lineWidth = Math.max(2, sep * .45);
      var cb = trazado.cable; x.beginPath(); x.moveTo(cb[0], cb[1]); x.lineTo(cb[2], cb[3]); x.stroke();
      var e = trazado.empalme, g = x.createRadialGradient(e[0], e[1], 0, e[0], e[1], sep * 2.6);
      g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.fillRect(e[0] - sep * 2.8, e[1] - sep * 2.8, sep * 5.6, sep * 5.6);
      var B = x.getImageData(0, 0, TW, TH).data;
      datos = new Uint8Array(TW * TH * 4);
      for (var k = 0; k < datos.length; k += 4) { datos[k] = R[k]; datos[k + 1] = G[k]; datos[k + 2] = B[k]; datos[k + 3] = 255; }
    }

    var VS = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
    var FS = [
      'precision mediump float;',
      'uniform sampler2D uT;uniform vec2 uRes;uniform vec2 uM;uniform float uR,uTime,uFront,uReveal,uPulso;uniform vec3 uHot,uCold;varying vec2 v;',
      'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+1.),f.x),f.y);}',
      'vec3 pal(float t){t=clamp(t,0.,1.);vec3 c0=vec3(.05,.045,.07),c1=uCold*.42,c2=uCold,c3=uHot,c4=vec3(1.,.95,.82);',
      ' if(t<.22)return mix(c0,c1,t/.22); if(t<.45)return mix(c1,c2,(t-.22)/.23); if(t<.78)return mix(c2,c3,smoothstep(0.,1.,(t-.45)/.33)); return mix(c3,c4,(t-.78)/.22);}',
      'void main(){',
      ' vec2 asp=vec2(uRes.x/uRes.y,1.);',
      ' vec4 tx=texture2D(uT,vec2(v.x,1.-v.y));',
      ' float s=tx.g, calor=tx.r;',
      ' float llega=smoothstep(uFront+.01,uFront-.06,s);',
      ' float agua=mix(.98,.56,s)+uPulso*.05*sin(s*80.-uTime*2.6);',
      ' float T=.15+.06*n(v*asp*5.+vec2(uTime*.02,0.))+calor*(llega*agua+(1.-llega)*.1)+tx.b*.62;',
      ' float dd=length((v-uM)*asp);',
      ' float lente=max(smoothstep(uR,uR-.008,dd),uReveal);',
      ' vec3 term=pal(T)*(.94+.06*sin(v.y*uRes.y*1.1));',
      ' vec3 pared=vec3(.072,.063,.055)+.02*n(v*asp*90.)+calor*llega*.05*uHot+tx.b*.03*uHot;',
      ' vec3 c=mix(pared,term,lente);',
      ' c+=smoothstep(.0035,0.,abs(dd-uR))*(1.-uReveal)*.55;',
      ' c+=smoothstep(.0025,0.,abs(dd-uR*.12))*lente*(1.-uReveal)*.4;',
      ' gl_FragColor=vec4(c,1.);',
      '}'
    ].join('\n');

    function compilar(tipo, src) { var s = gl.createShader(tipo); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
    function iniciarGL() {
      try { gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power', preserveDrawingBuffer: false }); } catch (e) { gl = null; }
      if (!gl) return false;
      try {
        prog = gl.createProgram();
        gl.attachShader(prog, compilar(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, compilar(gl.FRAGMENT_SHADER, FS));
        gl.linkProgram(prog); if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
      } catch (e) { gl = null; return false; }
      gl.useProgram(prog);
      var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ['uT', 'uRes', 'uM', 'uR', 'uTime', 'uFront', 'uReveal', 'uPulso', 'uHot', 'uCold'].forEach(function (u) { uni[u] = gl.getUniformLocation(prog, u); });
      tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); corriendo = false; });
      return true;
    }

    function medir() {
      var r = canvas.getBoundingClientRect();
      var nW = Math.max(1, Math.round(r.width)), nH = Math.max(1, Math.round(r.height));
      if (nW === W && Math.abs(nH - H) < 2 && datos) return;
      W = nW; H = nH; dpr = Math.min(window.devicePixelRatio || 1, mqMovil.matches ? 1.25 : 1.5);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      pintarTextura();
      if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, TW, TH, 0, gl.RGBA, gl.UNSIGNED_BYTE, datos);
      } else pintar2D();
      pedir();
    }

    // Sin WebGL: la instalación dibujada en plano, ida en caliente y retorno en frío
    function pintar2D() {
      var x = canvas.getContext('2d'); if (!x) return;
      x.setTransform(canvas.width / TW, 0, 0, canvas.height / TH, 0, 0);
      x.fillStyle = '#12100E'; x.fillRect(0, 0, TW, TH);
      var mitad = trazado.total / 2;
      x.lineJoin = 'round'; x.lineCap = 'round'; x.lineWidth = Math.max(1.5, trazado.sep * .45);
      [['quente', function (L) { return L <= mitad; }], ['fria', function (L) { return L >= mitad; }]].forEach(function (par) {
        x.strokeStyle = getComputedStyle(html).getPropertyValue('--' + par[0]); x.globalAlpha = .55; x.beginPath();
        var empezado = false;
        trazado.pts.forEach(function (p, i) { if (!par[1](trazado.L[i])) return; empezado ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]); empezado = true; });
        x.stroke();
      });
      x.globalAlpha = 1;
    }

    // Temperatura bajo la lente, con la misma fórmula del shader (sin ruido)
    function leer() {
      if (!datos) return;
      var px = Math.min(TW - 1, Math.max(0, Math.round(lente.x * TW))), py = Math.min(TH - 1, Math.max(0, Math.round((1 - lente.y) * TH)));
      var k = (py * TW + px) * 4, calor = datos[k] / 255, s = datos[k + 1] / 255, b = datos[k + 2] / 255;
      var fr = (gl && motion) ? frente : 1;
      var llega = s < fr - 0.03 ? 1 : (s > fr ? 0 : (fr - s) / 0.03);
      var T = 0.15 + 0.03 + calor * (llega * (0.98 - 0.42 * s) + (1 - llega) * 0.1) + b * 0.62;
      lecturaT.textContent = (18 + T * 52).toFixed(1).replace('.', ',');
      var zona;
      if (b > 0.45) zona = 'Empalme caliente · revisar';
      else if (b > 0.12) zona = 'Línea eléctrica · templada';
      else if (calor > 0.3) zona = llega < 0.5 ? 'Tubería · aún no llega la ida' : (s < 0.5 ? 'Ida · suelo radiante' : 'Retorno · suelo radiante');
      else zona = 'Pared · sin circuito';
      if (lecturaZ.textContent !== zona) lecturaZ.textContent = zona;
    }

    var ultimaLectura = 0;
    function cuadro(ahora) {
      if (!corriendo) return;
      var t = (ahora - t0) / 1000;
      // la lente: el ratón manda; sin ratón (táctil o quieto), pasea sola por la espiral
      if (!tocando && ahora - ultimoRaton > 3500) {
        lente.tx = (mqMovil.matches ? 0.5 : 0.7) + Math.sin(t * 0.37) * (mqMovil.matches ? 0.3 : 0.17);
        lente.ty = (mqMovil.matches ? 0.63 : 0.5) + Math.sin(t * 0.53 + 1) * (mqMovil.matches ? 0.14 : 0.24);
      }
      var k = motion ? 0.14 : 1;
      lente.x += (lente.tx - lente.x) * k; lente.y += (lente.ty - lente.y) * k;
      frente = motion ? Math.min(1.04, frenteIntro * 0.62 + scrollP * 0.5) : 1.04;
      var reveal = motion ? Math.max(0, Math.min(1, (scrollP - 0.3) / 0.6)) : 0;
      reveal = reveal * reveal * (3 - 2 * reveal);
      if (gl) {
        gl.uniform1i(uni.uT, 0);
        gl.uniform2f(uni.uRes, canvas.width, canvas.height);
        gl.uniform2f(uni.uM, lente.x, lente.y);
        gl.uniform1f(uni.uR, mqMovil.matches ? 0.26 : 0.21);
        gl.uniform1f(uni.uTime, motion ? t : 0);
        gl.uniform1f(uni.uFront, frente);
        gl.uniform1f(uni.uReveal, reveal);
        gl.uniform1f(uni.uPulso, motion ? 1 : 0);
        gl.uniform3fv(uni.uHot, colores.q); gl.uniform3fv(uni.uCold, colores.f);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        window.__termoFrames++;
      }
      if (ahora - ultimaLectura > 120) { ultimaLectura = ahora; leer(); }
      if (motion && visible) requestAnimationFrame(cuadro); else corriendo = false;
    }
    function pedir() { if (!arrancado || corriendo || !visible) return; corriendo = true; requestAnimationFrame(cuadro); }

    function iniciar() {
      leerColores();
      var conGL = iniciarGL();
      html.classList.add(conGL ? 'es-webgl' : 'sin-webgl');
      if ('ResizeObserver' in window) new ResizeObserver(function () { medir(); }).observe(canvas);
      else addEventListener('resize', medir);
      medir();
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; pedir(); }).observe(portada);
      d.addEventListener('visibilitychange', function () { visible = !d.hidden; pedir(); });
      portada.addEventListener('pointermove', function (e) {
        var r = canvas.getBoundingClientRect();
        lente.tx = (e.clientX - r.left) / r.width; lente.ty = 1 - (e.clientY - r.top) / r.height;
        if (e.pointerType === 'mouse') ultimoRaton = performance.now(); else tocando = true;
        pedir();
      }, { passive: true });
      portada.addEventListener('pointerup', function () { tocando = false; ultimoRaton = performance.now(); });
      portada.addEventListener('pointercancel', function () { tocando = false; });
    }

    return {
      iniciar: iniciar,
      arrancar: function () {
        arrancado = true; pedir();
        if (gsapReady && motion) gsap.to({ v: 0 }, { v: 1, duration: 3.4, ease: 'power2.inOut', onUpdate: function () { frenteIntro = this.targets()[0].v; } });
        else frenteIntro = 1;
      },
      scroll: function (p) { scrollP = p; pedir(); },
      colores: function () { leerColores(); if (!gl && datos) pintar2D(); pedir(); }
    };
  })();
  termo.iniciar();
  (function () {
    var portada = $('.portada');
    function alScroll() { var h = portada.offsetHeight || 1; termo.scroll(Math.max(0, Math.min(1, scrollY / h))); }
    if (lenis) lenis.on('scroll', alScroll); else addEventListener('scroll', alScroll, { passive: true });
    alScroll();
  })();

  /* ---------- Titulares que se dilatan con el calor (eje de anchura) ---------- */
  if (gsapReady && motion) {
    $$('h2.calor').forEach(function (h) {
      gsap.fromTo(h, { '--ancho': '82%' }, { '--ancho': '112%', ease: 'none', immediateRender: false,
        scrollTrigger: { trigger: h, start: 'top 92%', end: 'top 35%', scrub: 0.6 } });
    });
  }

  /* ---------- 02 · La obra: anclada con scrub ---------- */
  (function () {
    var obra = $('.obra'), pasos = $$('.paso', obra), nodos = $$('.nodo', obra), n = pasos.length;
    var tubo = $('.obra-tubo', obra), aguja = $('.mano-aguja', obra), barTxt = $('[data-bar]', obra);
    var presiones = pasos.map(function (p) { return parseFloat(p.getAttribute('data-presion')); });
    var MAX = 8;
    // fracción del tubo en la que está cada nodo: el llenado llega a cada válvula justo en su paso
    var largo = tubo.getTotalLength(), fr = nodos.map(function (nd) {
      var m = /translate\(([\d.]+)[ ,]+([\d.]+)\)/.exec(nd.getAttribute('transform')), mejor = 0, dmin = 1e9;
      for (var k = 0; k <= 600; k++) { var pt = tubo.getPointAtLength(largo * k / 600), dd = Math.hypot(pt.x - m[1], pt.y - m[2]); if (dd < dmin) { dmin = dd; mejor = k / 600; } }
      return mejor;
    });
    fr.push(1);
    // esfera del manómetro: de -135° (0 bar) a +135° (8 bar)
    var marcas = $('.mano-marcas', obra), svgNS = 'http://www.w3.org/2000/svg';
    for (var b = 0; b <= MAX; b++) {
      var a = (-135 + 270 * b / MAX - 90) * Math.PI / 180;
      var l = d.createElementNS(svgNS, 'line');
      l.setAttribute('x1', 100 + Math.cos(a) * 72); l.setAttribute('y1', 100 + Math.sin(a) * 72);
      l.setAttribute('x2', 100 + Math.cos(a) * 80); l.setAttribute('y2', 100 + Math.sin(a) * 80);
      marcas.appendChild(l);
      var t = d.createElementNS(svgNS, 'text'); t.setAttribute('x', 100 + Math.cos(a) * 58); t.setAttribute('y', 104 + Math.sin(a) * 58); t.textContent = b;
      marcas.appendChild(t);
    }
    function presion(bar) {
      aguja.style.setProperty('--giro', (-135 + 270 * Math.min(bar, MAX) / MAX).toFixed(2) + 'deg');
      barTxt.textContent = bar.toFixed(1).replace('.', ',');
    }
    var actual = -1;
    function marcar(i) {
      if (i === actual) return; actual = i;
      pasos.forEach(function (p, k) { p.classList.toggle('es-actual', k === i); p.setAttribute('aria-hidden', obra.classList.contains('es-anclada') && k !== i ? 'true' : 'false'); });
      nodos.forEach(function (nd, k) { nd.classList.toggle('es-hecho', k <= i); nd.classList.toggle('es-actual', k === i); });
    }

    if (gsapReady && motion) {
      obra.classList.add('es-anclada');
      var prog = d.createElement('div'); prog.className = 'obra-progreso'; prog.setAttribute('aria-hidden', 'true');
      for (var k = 0; k < n; k++) prog.appendChild(d.createElement('i'));
      $('.obra-cabeza', obra).appendChild(prog);
      var barras = $$('i', prog);
      gsap.set(pasos, { autoAlpha: 0, yPercent: 12, clipPath: 'inset(0% 0% 100% 0%)' });
      gsap.set(tubo, { strokeDashoffset: 1 });
      var visibleI = -1;
      function mostrar(i) {
        if (i === visibleI) return;
        var antes = visibleI; visibleI = i;
        if (antes >= 0) gsap.to(pasos[antes], { autoAlpha: 0, yPercent: i > antes ? -10 : 10, clipPath: i > antes ? 'inset(0% 0% 100% 0%)' : 'inset(100% 0% 0% 0%)', duration: 0.5, ease: 'expo.inOut', overwrite: true });
        gsap.fromTo(pasos[i], { autoAlpha: 0, yPercent: i > antes ? 14 : -14, clipPath: i > antes ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' },
          { autoAlpha: 1, yPercent: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.out', delay: antes >= 0 ? 0.12 : 0, overwrite: true });
      }
      ST.create({
        trigger: obra, start: 'top top', end: function () { return '+=' + Math.round(innerHeight * n * 0.85); },
        pin: true, scrub: true, anticipatePin: 1,
        onUpdate: function (self) {
          var p = self.progress, x = p * n, i = Math.min(n - 1, Math.floor(x));
          // el tubo se llena hasta el nodo del paso actual (más un poco hacia el siguiente)
          var lleno = fr[i] + (fr[i + 1] - fr[i]) * Math.min(1, x - i);
          gsap.set(tubo, { strokeDashoffset: 1 - lleno, autoRound: false });
          var f = Math.min(1, (x - i) * 1.6), a0 = presiones[Math.max(0, i - 1)], a1 = presiones[i];
          presion(i === 0 ? a1 * f : a0 + (a1 - a0) * Math.min(1, f));
          barras.forEach(function (bi, k) { bi.style.setProperty('--p', k < i ? 1 : (k === i ? (x - i).toFixed(3) : 0)); });
          marcar(i); mostrar(i);
        }
      });
      marcar(0); mostrar(0); presion(0);
    } else {
      // Sin anclaje: la escena se queda pegada al lado y el paso del centro manda
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          var i = pasos.indexOf(e.target); marcar(i); presion(presiones[i]);
          tubo.style.strokeDashoffset = String(1 - fr[i]);
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      pasos.forEach(function (p) { io.observe(p); });
      marcar(0); presion(presiones[0]); tubo.style.strokeDashoffset = String(1 - fr[0]);
    }
  })();

  /* ---------- 03 · Pila sticky: mismo alto (el de la más alta) ---------- */
  var pila = $('.pila'), itemsPila = $$('.pila-item', pila);
  function medirPila() {
    pila.style.removeProperty('--alto-ficha');
    var max = 0;
    itemsPila.forEach(function (li, i) { li.style.setProperty('--i', i); max = Math.max(max, li.offsetHeight); });
    pila.style.setProperty('--alto-ficha', max + 'px');
  }
  medirPila();
  if (gsapReady && motion) {
    itemsPila.forEach(function (li, i) {
      var sig = itemsPila[i + 1]; if (!sig) return;
      var ficha = $('.ficha', li);
      ST.create({
        trigger: sig, start: 'top bottom', end: function () { return 'top ' + (parseFloat(getComputedStyle(sig).top) || 0) + 'px'; }, scrub: true,
        onUpdate: function (s) { ficha.style.setProperty('--hundir', (1 - s.progress * 0.05).toFixed(4)); ficha.style.setProperty('--sombra', (s.progress * 0.45).toFixed(3)); }
      });
    });
  }
  // Tiempos (versión sobria): leídos de data-dias, no repetidos en el script
  (function () {
    var lista = $('.tiempos-lista'), max = 0;
    itemsPila.forEach(function (li) { max = Math.max(max, parseFloat(li.getAttribute('data-dias'))); });
    itemsPila.forEach(function (li) {
      var dias = parseFloat(li.getAttribute('data-dias'));
      var el = d.createElement('li');
      var nom = d.createElement('span'); nom.textContent = $('h3', li).textContent;
      var bar = d.createElement('span'); bar.className = 'tiempos-barra'; bar.setAttribute('aria-hidden', 'true');
      var i = d.createElement('i'); i.style.setProperty('--v', (dias / max).toFixed(3)); bar.appendChild(i);
      var num = d.createElement('span'); num.textContent = (dias < 1 ? '½' : String(dias).replace('.', ',')) + (dias === 1 ? ' día' : ' días');
      el.appendChild(nom); el.appendChild(bar); el.appendChild(num); lista.appendChild(el);
    });
  })();

  /* ---------- Cinta: velocidad ligada al scroll ---------- */
  (function () {
    var cinta = $('.cinta'), pista = $('.cinta-pista', cinta);
    var originales = $$('li', pista);
    function rellenar() {
      while (pista.scrollWidth < innerWidth * 2.2) originales.forEach(function (li) { var c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); pista.appendChild(c); });
    }
    rellenar();
    if (!motion) return;
    var x = 0, vis = false, ultimo = performance.now(), vel = 0, dir = -1, ultimoY = scrollY;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) { ultimo = performance.now(); requestAnimationFrame(paso); } }).observe(cinta);
    function paso(ahora) {
      if (!vis) return;
      var dt = Math.min(0.05, (ahora - ultimo) / 1000); ultimo = ahora;
      var v = lenis ? lenis.velocity : (scrollY - ultimoY); ultimoY = scrollY;
      if (Math.abs(v) > 0.5) dir = v > 0 ? -1 : 1;
      vel += (Math.min(40, Math.abs(v)) * 18 - vel) * 0.08;
      x += dir * (70 + vel) * dt;
      var mitad = pista.scrollWidth / 2;
      if (x <= -mitad) x += mitad; if (x > 0) x -= mitad;
      pista.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      requestAnimationFrame(paso);
    }
  })();

  /* ---------- 04 · Urgencias: estado y día de hoy (prefijo es-) ---------- */
  (function () {
    var estado = $('[data-estado]'), txt = $('[data-estado-txt]');
    function min(h, m) { return h * 60 + m; }
    function calcular() {
      var ahora = new Date(), dia = ahora.getDay(), m = ahora.getHours() * 60 + ahora.getMinutes();
      $$('.horario tbody tr').forEach(function (tr) { tr.classList.toggle('es-hoy', +tr.getAttribute('data-dia') === dia); });
      var oficina = false, guardia = false;
      if (dia >= 1 && dia <= 5) { oficina = (m >= min(8, 0) && m < min(14, 0)) || (m >= min(15, 30) && m < min(19, 0)); guardia = !oficina && m >= min(14, 0) && m < min(23, 0); }
      else if (dia === 6) { oficina = m >= min(9, 30) && m < min(13, 30); guardia = m >= min(13, 30) && m < min(21, 0); }
      else guardia = m >= min(10, 0) && m < min(21, 0);
      estado.classList.remove('es-oficina', 'es-guardia', 'es-avisos');
      if (oficina) { estado.classList.add('es-oficina'); txt.textContent = 'Ahora: oficina abierta'; }
      else if (guardia) { estado.classList.add('es-guardia'); txt.textContent = 'Ahora: guardia de urgencias activa'; }
      else { estado.classList.add('es-avisos'); txt.textContent = 'Ahora: servicio de avisos, te llamamos a primera hora'; }
    }
    calcular(); setInterval(calcular, 60000);
  })();

  /* ---------- Botones magnéticos ---------- */
  if (motion && finoRaton.matches) {
    $$('.iman').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.setProperty('--bx', ((e.clientX - r.left - r.width / 2) * 0.28).toFixed(1) + 'px');
        b.style.setProperty('--by', ((e.clientY - r.top - r.height / 2) * 0.38).toFixed(1) + 'px');
      });
      b.addEventListener('pointerleave', function () { b.style.setProperty('--bx', '0px'); b.style.setProperty('--by', '0px'); });
    });
  }

  /* ---------- Cursor propio: punto + aro, solo con ratón ---------- */
  (function () {
    var cur = $('.cursor'), punto = $('.cursor-punto', cur), aro = $('.cursor-aro', cur), txt = $('.cursor-txt', cur);
    var x = -100, y = -100, ax = -100, ay = -100, activo = false;
    function bucle() {
      ax += (x - ax) * (motion ? 0.2 : 1); ay += (y - ay) * (motion ? 0.2 : 1);
      punto.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      aro.style.transform = 'translate3d(' + ax.toFixed(1) + 'px,' + ay.toFixed(1) + 'px,0)';
      requestAnimationFrame(bucle);
    }
    addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX; y = e.clientY;
      if (!activo) { activo = true; html.classList.add('es-cursor'); ax = x; ay = y; requestAnimationFrame(bucle); }
    }, { passive: true });
    var estados = ['es-cursor-enlace', 'es-cursor-texto', 'es-cursor-lente', 'es-cursor-claro'];
    d.addEventListener('pointerover', function (e) {
      if (!activo) return;
      var t = e.target, poner = [];
      if (t.closest('.papeles-pared, .presupuesto-pared, .cortina')) poner.push('es-cursor-claro');
      var mapa = t.closest('[data-mapa]');
      if (mapa && !mapa.classList.contains('es-cargado')) { poner.push('es-cursor-texto'); txt.textContent = 'Mapa'; }
      else if (t.closest('a, button, label, select, input, textarea, summary')) poner.push('es-cursor-enlace');
      else if (t.closest('.portada') && !t.closest('.lectura')) poner.push('es-cursor-lente');
      estados.forEach(function (c) { html.classList.toggle(c, poner.indexOf(c) > -1); });
    });
    d.addEventListener('pointerleave', function () { punto.style.opacity = aro.style.opacity = '0'; });
    d.addEventListener('pointerenter', function () { punto.style.opacity = aro.style.opacity = ''; });
  })();

  /* ---------- Menú móvil ---------- */
  var botonMenu = $('.menu-boton'), nav = $('#nav');
  function cerrarMenu() {
    if (!nav.classList.contains('es-abierto')) return;
    nav.classList.remove('es-abierto'); botonMenu.setAttribute('aria-expanded', 'false');
    $('.visual-oculto', botonMenu).textContent = 'Abrir menú';
    if (lenis) lenis.start(); html.style.overflow = '';
  }
  botonMenu.addEventListener('click', function () {
    if (nav.classList.contains('es-abierto')) { cerrarMenu(); return; }
    nav.classList.add('es-abierto'); botonMenu.setAttribute('aria-expanded', 'true');
    $('.visual-oculto', botonMenu).textContent = 'Cerrar menú';
    if (lenis) lenis.stop(); html.style.overflow = 'hidden';
  });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', cerrarMenu); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { cerrarMenu(); botonMenu.focus(); } });

  /* ---------- Enlace activo del menú ---------- */
  (function () {
    var enlaces = $$('.nav a[href^="#"]');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        enlaces.forEach(function (a) { a.classList.toggle('es-actual', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main > section[id]').forEach(function (s) { io.observe(s); });
  })();

  /* ---------- Mapa solo bajo clic ---------- */
  (function () {
    var caja = $('[data-mapa]'), boton = $('.mapa-boton', caja);
    boton.addEventListener('click', function () {
      var f = d.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Ourense, Galicia') + '&output=embed';
      f.title = 'Mapa de Ourense (Google Maps)'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
      caja.appendChild(f); caja.classList.add('es-cargado');
      boton.remove(); var nota = $('.mapa-nota', caja); if (nota) nota.remove();
      html.classList.remove('es-cursor-texto');
    });
  })();

  /* ---------- Formulario de muestra ---------- */
  (function () {
    var f = $('.formulario'), salida = $('.formulario-salida', f);
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var fallos = [];
      $$('[required]', f).forEach(function (c) {
        var ok = c.type === 'checkbox' ? c.checked : c.value.trim() !== '';
        c.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok) fallos.push(c);
      });
      salida.classList.remove('es-ok', 'es-error');
      if (fallos.length) { salida.classList.add('es-error'); salida.textContent = 'Faltan ' + fallos.length + ' campos por rellenar.'; fallos[0].focus(); return; }
      salida.classList.add('es-ok');
      salida.textContent = 'Recibido (de muestra): en esta demo no se envía nada. En un sitio real, te llamaríamos hoy.';
      f.reset();
    });
  })();

  /* ---------- Cookies (y los mandos se apartan mientras están en pantalla) ---------- */
  var cookies = $('.cookies'), mandos = $('.mandos');
  function mostrarMandos() { if (html.classList.contains('es-revision')) mandos.hidden = !cookies.hidden; }
  if (store.get('idaeretorno-cookies') !== 'ok') cookies.hidden = false;
  $('[data-cerrar-cookies]').addEventListener('click', function () { cookies.hidden = true; store.set('idaeretorno-cookies', 'ok'); mostrarMandos(); });
  $('[data-reabrir-cookies]').addEventListener('click', function () { cookies.hidden = false; mostrarMandos(); $('[data-cerrar-cookies]').focus(); });
  mostrarMandos();

  /* ---------- MANDOS DE DEMOSTRACIÓN — NO VIAJAN AL SITIO DE UN CLIENTE ---------- */
  (function () {
    function pulsados() {
      $$('[data-maqueta]').forEach(function (b) { b.setAttribute('aria-pressed', String((b.getAttribute('data-maqueta') === 'sobria') === html.classList.contains('es-sobria'))); });
      var pal = html.classList.contains('pal-laton') ? 'laton' : html.classList.contains('pal-brezo') ? 'brezo' : 'real';
      $$('[data-paleta]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-paleta') === pal)); });
    }
    $$('[data-maqueta]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-maqueta');
        html.classList.toggle('es-sobria', v === 'sobria'); store.set('idaeretorno-maqueta', v);
        pulsados(); medirPila(); if (gsapReady) ST.refresh();
      });
    });
    $$('[data-paleta]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-paleta');
        html.classList.remove('pal-laton', 'pal-brezo'); if (v !== 'real') html.classList.add('pal-' + v);
        store.set('idaeretorno-paleta', v); pulsados(); termo.colores();
      });
    });
    pulsados();
  })();

  /* ---------- Remedir al cambiar de tamaño ---------- */
  var tRes;
  addEventListener('resize', function () { clearTimeout(tRes); tRes = setTimeout(function () { medirPila(); if (gsapReady) ST.refresh(); }, 200); });
  fuentes.then(function () { medirPila(); if (gsapReady) ST.refresh(); });
})();
