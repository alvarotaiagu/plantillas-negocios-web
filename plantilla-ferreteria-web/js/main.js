/* =====================================================================
   Paso Fino · ferretería de barrio (negocio ficticio, sitio de demostración)
   main.js — sin dependencias propias; GSAP, ScrollTrigger y Lenis por CDN
   (jsDelivr). Si el CDN cae, la página se ve y funciona entera.
   ===================================================================== */
(function () {
  'use strict';

  var html = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var coma = function (n, d) { return n.toFixed(d).replace('.', ','); };

  /* ---------- banderas: gsapReady y motion van separadas (PLIEGO §5) ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var motion = !reduce.matches;
  var gsapReady = !!(window.gsap && window.ScrollTrigger);
  if (gsapReady) gsap.registerPlugin(ScrollTrigger);
  if (gsapReady && motion) html.classList.add('has-motion');

  /* ---------- tareas largas: se miden desde el principio ---------- */
  window.__pasofino = { longtasks: [] };
  try {
    new PerformanceObserver(function (list) {
      list.getEntries().forEach(function (e) {
        window.__pasofino.longtasks.push({ start: Math.round(e.startTime), dur: Math.round(e.duration) });
      });
    }).observe({ type: 'longtask', buffered: true });
  } catch (e) {}

  var guardar = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var leer = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };

  /* =====================================================================
     1. Cookies y mando de demostración
     ===================================================================== */
  var cookies = $('#cookies');
  var mando = $('#mando');
  var revision = html.classList.contains('es-revision');

  function mostrarMando() {
    // El mando se esconde mientras el aviso de cookies está en pantalla.
    if (!mando) return;
    mando.hidden = !revision || !cookies.hidden;
  }
  if (leer('pasofino-cookies') !== 'ok') cookies.hidden = false;
  $('#cookies-ok').addEventListener('click', function () {
    cookies.hidden = true; guardar('pasofino-cookies', 'ok'); mostrarMando();
  });
  $('#cookies-reabrir').addEventListener('click', function () { cookies.hidden = false; mostrarMando(); $('#cookies-ok').focus(); });
  mostrarMando();

  /* MANDO DE DEMOSTRACIÓN — no viaja al sitio de un cliente (README, «Quitar el mando») */
  function marcarMando() {
    $$('[data-maqueta]', mando).forEach(function (b) {
      b.setAttribute('aria-pressed', String(html.classList.contains('d-' + b.dataset.maqueta)));
    });
    $$('[data-paleta]', mando).forEach(function (b) {
      b.setAttribute('aria-pressed', String(html.classList.contains('p-' + b.dataset.paleta)));
    });
  }
  if (mando) {
    marcarMando();
    mando.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.maqueta) {
        html.classList.remove('d-rosca', 'd-sobria'); html.classList.add('d-' + b.dataset.maqueta);
        guardar('pasofino-maqueta', b.dataset.maqueta);
        medirPila();
        if (gsapReady) ScrollTrigger.refresh();
      }
      if (b.dataset.paleta) {
        html.classList.remove('p-minio', 'p-cobalto', 'p-cardenillo'); html.classList.add('p-' + b.dataset.paleta);
        guardar('pasofino-paleta', b.dataset.paleta);
        if (tornillo) tornillo.acento();
      }
      marcarMando();
    });
  }
  /* FIN mando */

  /* =====================================================================
     2. Menú móvil
     ===================================================================== */
  var menuBoton = $('#menu-boton'), menu = $('#menu');
  function cerrarMenu() { menu.classList.remove('es-abierto'); menuBoton.setAttribute('aria-expanded', 'false'); if (lenis) lenis.start(); }
  menuBoton.addEventListener('click', function () {
    var abrir = menuBoton.getAttribute('aria-expanded') !== 'true';
    menuBoton.setAttribute('aria-expanded', String(abrir));
    menu.classList.toggle('es-abierto', abrir);
    if (lenis) { abrir ? lenis.stop() : lenis.start(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('es-abierto')) { cerrarMenu(); menuBoton.focus(); } });

  /* =====================================================================
     3. Horario: hoy y abierto/cerrado (hora de Madrid)
     ===================================================================== */
  var TRAMOS = { 1: [[540, 810], [990, 1200]], 2: [[540, 810], [990, 1200]], 3: [[540, 810], [990, 1200]], 4: [[540, 810], [990, 1200]], 5: [[540, 810], [990, 1200]], 6: [[570, 810]], 0: [] };
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var hhmm = function (m) { return Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0'); };
  function ahoraMadrid() {
    try {
      var p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      var o = {}; p.forEach(function (x) { o[x.type] = x.value; });
      return { dia: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday), min: (+o.hour % 24) * 60 + (+o.minute) };
    } catch (e) { var d = new Date(); return { dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes() }; }
  }
  function pintarHorario() {
    var a = ahoraMadrid(), largo, corto, abierto = false;
    $$('.horario-tabla tr').forEach(function (tr) { tr.classList.toggle('es-hoy', +tr.dataset.dia === a.dia); });
    var hoy = TRAMOS[a.dia];
    for (var i = 0; i < hoy.length; i++) {
      if (a.min >= hoy[i][0] && a.min < hoy[i][1]) { abierto = true; largo = 'Abierto ahora · cierra a las ' + hhmm(hoy[i][1]); corto = 'Abierto · hasta las ' + hhmm(hoy[i][1]); break; }
      if (a.min < hoy[i][0]) { largo = 'Cerrado ahora · abre hoy a las ' + hhmm(hoy[i][0]); corto = 'Abre hoy a las ' + hhmm(hoy[i][0]); break; }
    }
    if (!largo) {
      for (var k = 1; k <= 7; k++) {
        var d = (a.dia + k) % 7;
        if (TRAMOS[d].length) { var cuando = k === 1 ? 'mañana' : 'el ' + DIAS[d]; largo = 'Cerrado ahora · abre ' + cuando + ' a las ' + hhmm(TRAMOS[d][0][0]); corto = 'Abre ' + cuando + ' a las ' + hhmm(TRAMOS[d][0][0]); break; }
      }
    }
    html.classList.toggle('es-abierto', abierto);
    $$('[data-estado-largo]').forEach(function (n) { n.textContent = largo; });
    $$('[data-estado-corto]').forEach(function (n) { n.textContent = corto; });
  }
  pintarHorario();
  setInterval(pintarHorario, 60000);

  /* =====================================================================
     4. Mapa bajo clic (sin iframe en el DOM hasta pulsar)
     ===================================================================== */
  $('#mapa-boton').addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = 'https://www.google.com/maps?q=Nar%C3%B3n%2C%20A%20Coru%C3%B1a&output=embed';
    f.title = 'Mapa de Narón (A Coruña)';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    var m = $('#mapa');
    $$('.mapa-texto, #mapa-boton', m).forEach(function (n) { n.remove(); });
    m.appendChild(f);
    f.focus();
  });

  /* =====================================================================
     5. Encargo (formulario de demostración)
     ===================================================================== */
  $('#encargo').addEventListener('submit', function (e) {
    e.preventDefault();
    var form = e.currentTarget, ok = true, primero = null;
    $$('input[required]', form).forEach(function (i) {
      var mal = !i.value.trim();
      i.setAttribute('aria-invalid', String(mal));
      if (mal && !primero) primero = i;
      ok = ok && !mal;
    });
    var r = $('#encargo-respuesta');
    if (!ok) { r.textContent = 'Falta algún dato: qué buscas, tu nombre y un teléfono.'; primero.focus(); return; }
    r.textContent = 'Anotado (de muestra): ' + form.pieza.value.trim() + '. En un sitio real te llamaríamos al ' + form.tel.value.trim() + ' con el precio y el día. No se ha enviado nada.';
    form.reset();
  });

  /* =====================================================================
     6. Lenis: único motor de scroll (si hay movimiento)
     ===================================================================== */
  var lenis = null;
  var scrollY = window.scrollY, velocidad = 0;
  var oyentes = [];
  function alScroll(fn) { oyentes.push(fn); }
  function emitir() { for (var i = 0; i < oyentes.length; i++) oyentes[i](scrollY, velocidad); }

  if (window.Lenis && motion) {
    lenis = new Lenis({ lerp: 0.14, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', function (l) { scrollY = l.scroll; velocidad = l.velocity || 0; emitir(); });
    if (gsapReady) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function bucle(t) { lenis.raf(t); requestAnimationFrame(bucle); })(performance.now());
    }
  } else {
    window.addEventListener('scroll', function () { var y = window.scrollY; velocidad = y - scrollY; scrollY = y; emitir(); }, { passive: true });
  }
  // Anclas: con Lenis y descontando la cabecera
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href'); if (id.length < 2) return;
    var t = document.querySelector(id); if (!t) return;
    e.preventDefault();
    if (menu.classList.contains('es-abierto')) cerrarMenu();
    if (lenis) lenis.scrollTo(t, { offset: id === '#inicio' ? 0 : -60, duration: 1.4 });
    else t.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' });
    if (t.tabIndex < 0 && !/^(A|BUTTON|INPUT)$/.test(t.tagName)) t.setAttribute('tabindex', '-1');
    t.focus({ preventScroll: true });
  });

  /* =====================================================================
     7. Char-reveal: las letras llegan anchas y se aprietan (eje wdth)
     ===================================================================== */
  function partir(el) {
    if (el.dataset.partido) return;
    el.dataset.partido = '1';
    var texto = el.textContent.trim();
    el.textContent = '';
    var sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = texto; el.appendChild(sr);
    texto.split(/\s+/).forEach(function (p, i, arr) {
      var w = document.createElement('span'); w.className = 'palabra'; w.setAttribute('aria-hidden', 'true');
      Array.from(p).forEach(function (ch) { var s = document.createElement('span'); s.className = 'letra'; s.textContent = ch; w.appendChild(s); });
      el.appendChild(w);
      if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }
  var reveals = $$('[data-reveal]');
  reveals.forEach(partir);
  function revelar(el, retraso) {
    if (el.classList.contains('es-dentro')) return;
    el.classList.add('es-dentro');
    if (!(gsapReady && motion)) return;
    gsap.fromTo($$('.letra', el),
      { y: '0.55em', opacity: 0, '--w': 125 },
      { y: 0, opacity: 1, '--w': 75, duration: 1.05, ease: 'expo.out', stagger: 0.022, delay: retraso || 0 });
  }
  var heroTitulo = $$('.portada-titulo [data-reveal]');
  if ('IntersectionObserver' in window) {
    var ioReveal = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { revelar(e.target); ioReveal.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    reveals.forEach(function (el) { if (heroTitulo.indexOf(el) < 0) ioReveal.observe(el); });
  } else reveals.forEach(function (el) { el.classList.add('es-dentro'); });

  /* ---------- apariciones de una vez: IO + clase (nunca ScrollTrigger once) ---------- */
  if ('IntersectionObserver' in window) {
    var ioEntra = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('es-visible'); ioEntra.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    $$('.entra, .ticket').forEach(function (el) { ioEntra.observe(el); });
  } else $$('.entra, .ticket').forEach(function (el) { el.classList.add('es-visible'); });

  /* ---------- contadores (cambian también con movimiento reducido) ---------- */
  var cuentas = $$('[data-cuenta]');
  function contar(el) {
    var fin = +el.dataset.cuenta;
    if (!motion) { el.textContent = fin; return; }
    var t0 = performance.now(), dur = 1400;
    (function paso(t) {
      var k = clamp((t - t0) / dur, 0, 1), e = 1 - Math.pow(2, -10 * k);
      el.textContent = Math.round(fin * (k === 1 ? 1 : e));
      if (k < 1) requestAnimationFrame(paso);
    })(t0);
  }
  if ('IntersectionObserver' in window) {
    var ioCuenta = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { contar(e.target); ioCuenta.unobserve(e.target); } });
    }, { threshold: 0.6 });
    cuentas.forEach(function (c) { if (motion) c.textContent = '0'; ioCuenta.observe(c); });
  }

  /* =====================================================================
     8. PORTADA: el tornillo en WebGL (raymarching de un M10 con su rosca)
        El scroll lo aprieta (giro + avance de un paso por vuelta) y el
        cursor mueve la lámpara del taller. Solo pinta cuando algo cambia.
     ===================================================================== */
  var tornillo = (function () {
    var canvas = $('#tornillo');
    var gl = null;
    try { gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance' }); } catch (e) {}
    if (!gl) { html.classList.add('sin-webgl'); return null; }

    var VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var FS = [
      'precision highp float;',
      'uniform vec2 uRes;uniform float uAng;uniform float uAdv;uniform vec2 uLuz;uniform vec3 uAcento;uniform float uIntro;',
      'const float P=0.21;const float R=0.60;const float H=0.085;',
      'mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}',
      'float sdHex(vec3 p,vec2 h){const vec3 k=vec3(-0.8660254,0.5,0.57735);p=abs(p);p.xy-=2.0*min(dot(k.xy,p.xy),0.0)*k.xy;',
      ' vec2 d=vec2(length(p.xy-vec2(clamp(p.x,-k.z*h.x,k.z*h.x),h.x))*sign(p.y-h.x),p.z-h.y);return min(max(d.x,d.y),0.0)+length(max(d,0.0));}',
      'float sdCil(vec3 p,float r,float h){vec2 d=abs(vec2(length(p.xz),p.y))-vec2(r,h);return min(max(d.x,d.y),0.0)+length(max(d,0.0));}',
      'vec3 local(vec3 p){p.xy=rot(-0.30)*p.xy;p.yz=rot(0.16+uLuz.y*0.05)*p.yz;p.y+=uAdv;p.xz=rot(uAng)*p.xz;return p;}',
      'float rosca(vec3 q){float th=atan(q.z,q.x);float u=(q.y+th/6.2831853*P)/P;float t=abs(fract(u)-0.5)*2.0;return t;}',
      'float mapa(vec3 p,out float mat){vec3 q=local(p);',
      ' float t=rosca(q);float r=R-H+H*clamp(t*1.15-0.05,0.0,1.0);',
      ' float vas=(length(q.xz)-r)*0.5;vas=max(vas,q.y-1.05);vas=max(vas,-q.y-6.0);',
      ' float cuello=sdCil(q-vec3(0.,0.95,0.),R-0.02,0.12);',
      ' float aran=sdCil(q-vec3(0.,1.13,0.),1.12,0.06)-0.015;',
      ' float cab=sdHex(q.xzy-vec3(0.,0.,1.47),vec2(0.88,0.28));cab=max(cab,length(q-vec3(0.,0.62,0.))-1.42);cab-=0.01;',
      ' float d=min(min(vas,cuello),aran);mat=0.;if(aran<d+0.0001){mat=1.;}if(cab<d){d=cab;mat=2.;}return d;}',
      'float mapa(vec3 p){float m;return mapa(p,m);}',
      'vec3 normal(vec3 p){vec2 e=vec2(0.0015,-0.0015);return normalize(e.xyy*mapa(p+e.xyy)+e.yyx*mapa(p+e.yyx)+e.yxy*mapa(p+e.yxy)+e.xxx*mapa(p+e.xxx));}',
      'vec3 entorno(vec3 r){vec3 c=mix(vec3(0.035,0.05,0.045),vec3(0.20,0.24,0.22),smoothstep(-0.6,0.5,r.y));',
      ' c+=vec3(1.0,0.97,0.9)*smoothstep(0.80,0.98,r.y)*1.3;',
      ' c+=vec3(0.9,0.95,0.92)*smoothstep(0.035,0.0,abs(r.y-0.28))*0.9;',
      ' c+=uAcento*smoothstep(0.45,0.95,-r.x)*1.1;return c;}',
      'void main(){vec2 uv=(gl_FragCoord.xy-0.5*uRes)/uRes.y;',
      ' vec3 ro=vec3(0.,0.05,9.4);vec3 rd=normalize(vec3(uv,-2.35));',
      ' float t=4.0,d,mat=0.;bool hit=false;',
      ' for(int i=0;i<110;i++){vec3 p=ro+rd*t;d=mapa(p,mat);if(d<0.0012*t){hit=true;break;}t+=d;if(t>11.)break;}',
      ' if(!hit){gl_FragColor=vec4(0.);return;}',
      ' vec3 p=ro+rd*t;vec3 n=normal(p);vec3 v=-rd;',
      ' vec3 L=normalize(vec3(uLuz.x*3.0,1.6+uLuz.y*1.8,2.2));',
      ' vec3 q=local(p);float tr=rosca(q);float ao=mat<0.5?mix(0.35,1.0,smoothstep(0.0,0.75,tr)):1.0;',
      ' float dif=max(dot(n,L),0.);vec3 hh=normalize(L+v);float esp=pow(max(dot(n,hh),0.),mat>1.5?90.:60.);',
      ' float fr=pow(1.0-max(dot(n,v),0.),4.);vec3 rr=reflect(rd,n);',
      ' vec3 base=mat>1.5?vec3(0.74,0.76,0.73):(mat>0.5?vec3(0.56,0.58,0.56):vec3(0.66,0.69,0.66));',
      ' vec3 col=base*(0.10+0.55*dif)*ao+base*entorno(rr)*0.95*ao+vec3(1.)*esp*1.1+entorno(rr)*fr*0.35;',
      ' float fade=smoothstep(-2.6,-0.6,p.y);col*=mix(0.25,1.0,fade);',
      ' col=col/(1.0+col*0.35);col=pow(col,vec3(0.92));',
      ' gl_FragColor=vec4(col*uIntro,uIntro);}'
    ].join('\n');

    // Compilación sin bloquear: con KHR_parallel_shader_compile se consulta el
    // estado en cada fotograma en vez de esperar al enlace en el hilo principal.
    var paralelo = gl.getExtension('KHR_parallel_shader_compile');
    var prog = gl.createProgram(), vs = gl.createShader(gl.VERTEX_SHADER), fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vs, VS); gl.compileShader(vs); gl.shaderSource(fs, FS); gl.compileShader(fs);
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    var U = {}, listo = false;
    function preparar() {
      if (paralelo && !gl.getProgramParameter(prog, paralelo.COMPLETION_STATUS_KHR)) { requestAnimationFrame(preparar); return; }
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { html.classList.add('sin-webgl'); return; }
      gl.useProgram(prog);
      var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ['uRes', 'uAng', 'uAdv', 'uLuz', 'uAcento', 'uIntro'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
      listo = true; acento(); pedir();
    }

    // Calidad: el renderizador por software (SwiftShader) no aguanta la resolución entera.
    var calidad = 1;
    try {
      var dbg = gl.getExtension('WEBGL_debug_renderer_info');
      var ren = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : '';
      if (/swiftshader|llvmpipe|software/i.test(ren)) calidad = 0.35;
    } catch (e) {}

    var est = { ang: 0, adv: 0, lx: 0.25, ly: 0.2, intro: motion ? 0 : 1 };
    var obj = { ang: 0, adv: 0, lx: 0.25, ly: 0.2 };
    var visible = true, pendiente = true, raf = 0;

    function medir() {
      var r = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, r.width < 600 ? 1.5 : 1.25) * calidad;
      var w = Math.max(2, Math.round(r.width * dpr)), h = Math.max(2, Math.round(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); pedir(); }
    }
    function acento() {
      if (!listo) return;
      var c = getComputedStyle(html).getPropertyValue('--acento').trim();
      var m = /^#?([0-9a-f]{6})$/i.exec(c) || ['', 'E2552B'];
      var n = parseInt(m[1], 16);
      gl.uniform3f(U.uAcento, ((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
      pedir();
    }
    // Calidad adaptativa: si mientras se anima el fotograma pasa de ~24 ms de media,
    // se baja la resolución del búfer (hasta la mitad). Pensado para móviles modestos.
    var ultimoT = 0, tiempos = [];
    function vigilar(t) {
      if (ultimoT && t - ultimoT < 200) { tiempos.push(t - ultimoT); if (tiempos.length > 14) tiempos.shift(); }
      ultimoT = t;
      if (tiempos.length === 14 && calidad > 0.5 * calidadBase) {
        var media = tiempos.reduce(function (a, b) { return a + b; }, 0) / 14;
        if (media > 24) { calidad = Math.max(0.5 * calidadBase, calidad * 0.8); tiempos = []; medir(); }
      }
    }
    function pintar(t) {
      raf = 0;
      if (!listo) return;
      vigilar(t);
      var k = motion ? 0.14 : 1, sigue = false;
      ['ang', 'adv', 'lx', 'ly'].forEach(function (c) {
        est[c] = lerp(est[c], obj[c], k);
        if (Math.abs(est[c] - obj[c]) > 0.0008) sigue = true; else est[c] = obj[c];
      });
      gl.uniform2f(U.uRes, canvas.width, canvas.height);
      gl.uniform1f(U.uAng, est.ang + (1 - est.intro) * -5.5);
      gl.uniform1f(U.uAdv, est.adv + (1 - est.intro) * -1.6 + 0.25);
      gl.uniform2f(U.uLuz, est.lx, est.ly);
      gl.uniform1f(U.uIntro, Math.min(1, est.intro * 1.6));
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if ((sigue || pendiente) && visible) { pendiente = false; pedir(); }
    }
    function pedir() { if (!raf && visible) raf = requestAnimationFrame(pintar); }

    if ('ResizeObserver' in window) new ResizeObserver(medir).observe(canvas); else window.addEventListener('resize', medir);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) pedir(); }).observe(canvas);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) pedir(); });
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); html.classList.add('sin-webgl'); });

    var calidadBase = calidad;
    medir(); preparar();
    return {
      acento: acento,
      vueltas: function (v) { obj.ang = v * Math.PI * 2; obj.adv = v * 0.21; pedir(); },
      luz: function (x, y) { if (!motion) return; obj.lx = x; obj.ly = y; pedir(); },
      intro: function () {
        if (!(gsapReady && motion)) { est.intro = 1; pedir(); return; }
        gsap.to(est, { intro: 1, duration: 2.0, ease: 'expo.out', onUpdate: pedir });
      }
    };
  })();

  // Lectura de la portada y vueltas del tornillo ligadas al scroll:
  // una pantalla de scroll = tres vueltas; M10 avanza 1,5 mm por vuelta.
  var lectV = $('#lect-vueltas'), lectA = $('#lect-avance');
  alScroll(function (y) {
    var v = Math.max(0, y) / Math.max(1, window.innerHeight) * 3;
    if (v > 6) return;
    lectV.textContent = coma(v, 1);
    lectA.textContent = coma(v * 1.5, 1);
    if (tornillo) tornillo.vueltas(v);
  });

  // La lámpara sigue al cursor
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse' || !tornillo) return;
    tornillo.luz((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
  }, { passive: true });

  /* =====================================================================
     9. CORTINA: la tuerca se desenrosca y la chapa sube con el filete
        girando. Retirada garantizada en los tres casos.
     ===================================================================== */
  var cortina = $('#cortina');
  (function dientes() {
    // Filete de rosca sobre una curva: dientes de 40 px que se desplazan
    // en horizontal mientras la chapa sube, como una rosca que gira.
    var d = 'M-200 0', i = 0;
    for (var x = -200; x <= 1800; x += 20, i++) {
      var u = (x - 800) / 1000, base = 30 + 34 * (1 - u * u);
      d += ' L' + x + ' ' + (base + (i % 2 ? 22 : 0)).toFixed(1);
    }
    d += ' L1800 0 Z';
    $('.cortina-dientes').setAttribute('d', d);
  })();
  function quitarCortina() { cortina.classList.add('es-fuera'); }
  function entregarPortada() {
    if (tornillo) tornillo.intro();
    heroTitulo.forEach(function (el, i) { revelar(el, i * 0.12); });
  }
  if (gsapReady && motion) {
    var tl = gsap.timeline({ defaults: { ease: 'expo.inOut' }, onComplete: quitarCortina });
    tl.fromTo('.cortina-tuerca', { rotation: -300, scale: 0.7 }, { rotation: 0, scale: 1, duration: 0.95, ease: 'expo.out' })
      .fromTo('.cortina-texto', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, 0.15)
      .to('.cortina-tuerca', { rotation: 240, y: -50, duration: 0.9 }, 0.95)
      .to('.cortina-texto', { opacity: 0, y: -20, duration: 0.5 }, 0.95)
      .to('.cortina-chapa', { yPercent: -101, duration: 1.15 }, 1.05)
      .to('.cortina-dientes', { x: -160, duration: 1.15 }, 1.05)
      .add(entregarPortada, 1.55);
    setTimeout(quitarCortina, 4200); // por si la pestaña estaba en segundo plano
  } else {
    cortina.classList.add('es-css');
    setTimeout(quitarCortina, motion ? 1200 : 30);
    entregarPortada();
  }

  /* =====================================================================
     10. M4 · LA LLAVE: copiadora con scrub anclado.
         setP(p) deja el dibujo en el estado exacto de p ∈ [0,1]; el scrub,
         el modo reducido y el modo sin GSAP llaman a la misma función.
     ===================================================================== */
  var llave = (function () {
    var svg = $('#copiadora'); if (!svg) return null;
    var DY = 208;                           // de la original a la virgen
    var TOP = 70, BOT = 114, X0 = 186, HOMBRO = 290, PUNTA = 652;
    var CORTES = [[322, 14], [374, 5], [426, 19], [478, 8], [530, 16], [582, 4], [626, 11]];
    // Perfil del canto superior (lista de puntos) para la original
    var pts = [[HOMBRO, TOP]];
    CORTES.forEach(function (c) { pts.push([c[0] - 17, TOP + 2], [c[0] - 6, TOP + c[1]], [c[0] + 6, TOP + c[1]], [c[0] + 17, TOP + 2]); });
    pts.push([PUNTA, TOP]);
    function yEn(x) {
      if (x <= pts[0][0]) return TOP;
      for (var i = 1; i < pts.length; i++) if (x <= pts[i][0]) { var a = pts[i - 1], b = pts[i]; return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); }
      return TOP;
    }
    function hoja(dy, conCortes) {
      var d = 'M' + X0 + ' ' + (TOP + dy) + ' L' + HOMBRO + ' ' + (TOP + dy);
      if (conCortes) pts.forEach(function (p) { d += ' L' + p[0] + ' ' + (p[1] + dy); });
      d += ' L' + PUNTA + ' ' + (TOP + dy) + ' L700 ' + (TOP + 14 + dy) + ' L716 ' + (TOP + 24 + dy) + ' L700 ' + (BOT + dy) + ' L' + X0 + ' ' + (BOT + dy) + ' Z';
      return d;
    }
    $('#perfil-original').setAttribute('d', hoja(0, true));
    $('#perfil-virgen').setAttribute('d', hoja(DY, true));
    // material que la fresa tiene que quitar: entre el canto recto y el perfil
    var sob = 'M' + HOMBRO + ' ' + (TOP + DY);
    pts.forEach(function (p) { sob += ' L' + p[0] + ' ' + (p[1] + DY); });
    sob += ' L' + PUNTA + ' ' + (TOP + DY) + ' Z';
    $('#sobrante').setAttribute('d', sob);
    var reb = 'M' + HOMBRO + ' ' + (TOP + DY - 1);
    pts.forEach(function (p) { reb += ' L' + p[0] + ' ' + (p[1] + DY - 1); });
    $('#rebaba').setAttribute('d', reb);
    // guías (la ranura longitudinal) en las dos llaves
    ['#llave-original', '#llave-virgen'].forEach(function (s, i) {
      var g = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      g.setAttribute('d', 'M214 ' + (98 + i * DY) + ' H690');
      g.setAttribute('stroke', i ? '#8E6A22' : '#7C8982'); g.setAttribute('stroke-width', '5'); g.setAttribute('stroke-linecap', 'round');
      $(s).appendChild(g);
    });
    // dientes de la fresa
    var fd = '';
    for (var k = 0; k < 18; k++) {
      var a0 = k / 18 * Math.PI * 2, a1 = a0 + 0.17;
      fd += 'M' + (Math.cos(a0) * 30).toFixed(1) + ' ' + (Math.sin(a0) * 30).toFixed(1) + ' L' + (Math.cos(a1) * 39).toFixed(1) + ' ' + (Math.sin(a1) * 39).toFixed(1) + ' L' + (Math.cos(a0 + 0.3) * 30).toFixed(1) + ' ' + (Math.sin(a0 + 0.3) * 30).toFixed(1) + 'Z';
    }
    $('#fresa-dientes').setAttribute('d', fd);
    // virutas: posiciones deterministas (el scrub tiene que poder ir hacia atrás)
    var vir = $('#virutas'), VIR = [];
    for (var v = 0; v < 18; v++) {
      var c = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      c.setAttribute('d', 'M0 0 q3 -4 6 0'); c.setAttribute('stroke', '#E7C877'); c.setAttribute('stroke-width', '2'); c.setAttribute('fill', 'none');
      vir.appendChild(c); VIR.push({ el: c, s: (v * 0.618) % 1, ang: -0.3 - (v % 5) * 0.32, vel: 60 + (v % 4) * 26 });
    }
    var el = {
      virgen: $('#llave-virgen'), original: $('#llave-original'), ma: $('#mordaza-a'), mb: $('#mordaza-b'),
      palp: $('#palpador'), fresa: $('#fresa'), carro: $('#carro'), cep: $('#cepillo'), bombin: $('#bombin'),
      ranura: $('#bombin-ranura'), clipS: $('#clip-sobrante-rect'), clipR: $('#clip-rebaba-rect'), crono: $('#crono'),
      num: $('#llave-paso-num')
    };
    var pasos = $$('#pasos .paso');
    var UMBRAL = [0, 0.18, 0.32, 0.70, 0.86];
    var tramo = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
    var suave = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
    var actual = -1;

    function setP(p) {
      // 1 · la virgen entra
      var t1 = suave(tramo(p, 0.02, 0.17));
      var t5a = suave(tramo(p, 0.86, 0.9));
      el.virgen.setAttribute('transform', 'translate(' + ((1 - t1) * 560 + t5a * 36).toFixed(1) + ' 0)');
      // 2 · mordazas
      var t2 = suave(tramo(p, 0.19, 0.31));
      el.ma.setAttribute('y', (24 + 24 * t2).toFixed(1));
      el.mb.setAttribute('y', (232 + 24 * t2).toFixed(1));
      // 3 · palpador y fresa recorren el dentado
      var t3 = tramo(p, 0.33, 0.69);
      var x = lerp(HOMBRO - 20, PUNTA + 10, t3);
      if (p > 0.69) x = lerp(PUNTA + 10, 760, suave(tramo(p, 0.69, 0.74)));
      var yo = yEn(x);
      el.carro.setAttribute('transform', 'translate(' + x.toFixed(1) + ' 0)');
      el.carro.setAttribute('opacity', (1 - tramo(p, 0.70, 0.74)).toFixed(2));
      el.palp.setAttribute('transform', 'translate(0 ' + (yo - 76).toFixed(1) + ')');
      el.fresa.setAttribute('transform', 'translate(0 ' + (yo + DY - 39).toFixed(1) + ') rotate(' + (p * 2600).toFixed(0) + ')');
      el.clipS.setAttribute('x', Math.min(x, 800).toFixed(1));
      // 4 · desbarbado: la rebaba vive entre el cepillo y la fresa
      var t4 = suave(tramo(p, 0.72, 0.85));
      var bx = lerp(HOMBRO - 40, 720, t4);
      el.cep.setAttribute('transform', 'translate(' + (p < 0.71 || p > 0.86 ? 860 : bx).toFixed(1) + ' ' + (TOP + DY + 8) + ') rotate(' + (p * -3000).toFixed(0) + ')');
      var desde = p < 0.71 ? HOMBRO : bx;
      el.clipR.setAttribute('x', desde.toFixed(1));
      el.clipR.setAttribute('width', Math.max(0, Math.min(x, PUNTA + 10) - desde).toFixed(1));
      // virutas solo mientras corta
      var cortando = t3 > 0 && t3 < 1;
      VIR.forEach(function (o) {
        var f = (p * 46 + o.s) % 1;
        var px = x + Math.cos(o.ang) * o.vel * f + 20, py = yo + DY - 6 + Math.sin(o.ang) * o.vel * f + 80 * f * f;
        o.el.setAttribute('transform', 'translate(' + px.toFixed(1) + ' ' + py.toFixed(1) + ') rotate(' + (f * 400).toFixed(0) + ')');
        o.el.setAttribute('opacity', cortando ? (1 - f).toFixed(2) : '0');
      });
      // 5 · prueba en el bombín
      var t5 = suave(tramo(p, 0.87, 0.99));
      el.bombin.setAttribute('opacity', tramo(p, 0.86, 0.9).toFixed(2));
      el.ranura.setAttribute('transform', 'rotate(' + (t5 * 90).toFixed(1) + ')');
      el.original.setAttribute('opacity', (1 - 0.55 * tramo(p, 0.86, 0.92)).toFixed(2));
      // cronómetro: 4 min 30 s de trabajo real
      var s = Math.round(p * 270);
      el.crono.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
      // paso activo
      var i = 0; for (var k = 0; k < UMBRAL.length; k++) if (p >= UMBRAL[k]) i = k;
      if (i !== actual) {
        actual = i;
        pasos.forEach(function (li, j) { li.classList.toggle('es-activo', j === i); });
        el.num.textContent = '0' + (i + 1);
      }
    }
    return { setP: setP, pasos: pasos, UMBRAL: UMBRAL };
  })();

  if (llave) {
    if (gsapReady && motion) {
      html.classList.add('has-pin');
      llave.setP(0);
      ScrollTrigger.create({
        trigger: '#llave', pin: '.llave-fija', start: 'top top',
        end: function () { return '+=' + Math.round(window.innerHeight * 3.2); },
        scrub: 0.6, anticipatePin: 1,
        onUpdate: function (st) { llave.setP(st.progress); }
      });
    } else {
      // Sin GSAP o con movimiento reducido: sin anclaje; el dibujo salta al
      // estado del paso que tienes delante (el contenido cambia, no se mueve).
      llave.setP(1);
      if ('IntersectionObserver' in window) {
        var ioPaso = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            if (!e.isIntersecting) return;
            var j = llave.pasos.indexOf(e.target);
            var fin = j < 4 ? llave.UMBRAL[j + 1] - 0.005 : 1;
            llave.setP(fin);
          });
        }, { rootMargin: '-45% 0px -45% 0px' });
        llave.pasos.forEach(function (li) { ioPaso.observe(li); });
      }
    }
  }

  /* =====================================================================
     11. M5 · pila de cajones: todos del alto del más alto (medido), nunca 100vh
     ===================================================================== */
  var pila = $$('.pila-item');
  function medirPila() {
    pila.forEach(function (li, i) { li.style.setProperty('--i', i); li.style.removeProperty('--alto'); });
    var max = 0;
    pila.forEach(function (li) { max = Math.max(max, li.firstElementChild.offsetHeight); });
    pila.forEach(function (li) { li.style.setProperty('--alto', max + 'px'); });
    tapar();
  }
  function tapar() {
    if (!motion) return;
    for (var i = 0; i < pila.length - 1; i++) {
      var a = pila[i].getBoundingClientRect(), b = pila[i + 1].getBoundingClientRect();
      var t = clamp(1 - (b.top - a.top) / Math.max(1, a.height), 0, 1);
      pila[i].firstElementChild.style.setProperty('--tapado', t.toFixed(3));
    }
  }
  medirPila();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { medirPila(); if (gsapReady) ScrollTrigger.refresh(); });
  window.addEventListener('resize', medirPila);
  alScroll(tapar);

  /* =====================================================================
     12. Cinta de encargos: marquesina en JS, velocidad ligada al scroll
     ===================================================================== */
  (function () {
    var fila = $('#cinta-fila'); if (!fila || !motion) return;
    fila.innerHTML += fila.innerHTML; // dos copias para el bucle
    var x = 0, ancho = 0, en = false, ult = performance.now(), extra = 0;
    function medir() { ancho = fila.scrollWidth / 2; }
    medir(); window.addEventListener('resize', medir);
    if (document.fonts) document.fonts.ready.then(medir);
    new IntersectionObserver(function (es) { en = es[0].isIntersecting; if (en) { ult = performance.now(); requestAnimationFrame(paso); } }).observe(fila);
    alScroll(function (y, v) { extra = clamp(Math.abs(v) * 1.6, 0, 40); });
    function paso(t) {
      if (!en) return;
      var dt = Math.min(64, t - ult); ult = t;
      x -= (0.06 + extra * 0.03) * dt;
      extra *= 0.94;
      if (x <= -ancho) x += ancho;
      fila.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
      requestAnimationFrame(paso);
    }
  })();

  /* =====================================================================
     13. Filetes de rosca y regla de la portada (versión «Rosca»)
     ===================================================================== */
  var filetes = $$('.filete'), regla = $('.portada-regla');
  alScroll(function (y) {
    if (!motion || !html.classList.contains('d-rosca')) return;
    html.style.setProperty('--giro', (-y * 0.4).toFixed(1) + 'px');
    if (regla) regla.style.setProperty('--regla', (-y * 0.6).toFixed(1) + 'px');
    var vh = window.innerHeight;
    for (var i = 0; i < filetes.length; i++) {
      var r = filetes[i].getBoundingClientRect();
      if (r.top > vh || r.bottom < 0) continue;
      filetes[i].style.setProperty('--avance', (clamp(1 - r.top / vh, 0, 1) * 100).toFixed(1) + '%');
    }
  });

  /* =====================================================================
     14. Imán y cursor propio (solo ratón; nada en táctil)
     ===================================================================== */
  if (motion) {
    $$('[data-iman]').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse') return;
        var r = b.getBoundingClientRect();
        b.style.setProperty('--mx', ((e.clientX - r.left - r.width / 2) * 0.28).toFixed(1) + 'px');
        b.style.setProperty('--my', ((e.clientY - r.top - r.height / 2) * 0.4).toFixed(1) + 'px');
      });
      b.addEventListener('pointerleave', function () { b.style.setProperty('--mx', '0px'); b.style.setProperty('--my', '0px'); });
    });
  }
  (function () {
    var cur = $('.cursor'), punto = $('.cursor-punto'), aro = $('.cursor-aro');
    var mx = -100, my = -100, ax = -100, ay = -100, vivo = false, raf = 0;
    function mover() {
      raf = 0;
      ax = motion ? lerp(ax, mx, 0.2) : mx; ay = motion ? lerp(ay, my, 0.2) : my;
      punto.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      aro.style.transform = 'translate3d(' + ax.toFixed(1) + 'px,' + ay.toFixed(1) + 'px,0)';
      if (Math.abs(ax - mx) > 0.3 || Math.abs(ay - my) > 0.3) raf = requestAnimationFrame(mover);
    }
    var fino = window.matchMedia('(hover: hover) and (pointer: fine)');
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || !fino.matches) return;
      if (!vivo) { vivo = true; html.classList.add('cursor-propio'); ax = e.clientX; ay = e.clientY; }
      mx = e.clientX; my = e.clientY;
      var t = e.target.closest ? e.target : null;
      cur.classList.toggle('es-tuerca', !!(t && t.closest('.herramienta, .mapa, .copiadora')));
      cur.classList.toggle('es-enlace', !!(t && !t.closest('.herramienta, .mapa, .copiadora') && t.closest('a, button, input, [data-cursor]')));
      if (!raf) raf = requestAnimationFrame(mover);
    }, { passive: true });
    window.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') { vivo = false; html.classList.remove('cursor-propio'); } });
    document.addEventListener('mouseleave', function () { punto.style.transform = aro.style.transform = 'translate3d(-100px,-100px,0)'; mx = my = ax = ay = -100; });
  })();

  /* =====================================================================
     15. M6 · panel de alquiler: herramienta sobre su silueta pintada
     ===================================================================== */
  var HERR = [
    { id: 'taladro', n: 'Taladro percutor', p: ['8 €', '12 €', '20 €', '50 €'], l: 'Lleva maletín, juego de brocas de pared y gafas.',
      s: '<path class="cuerpo" d="M30 30h50a12 12 0 0 1 12 12v6a12 12 0 0 1-12 12H66l-6 32H30l6-32H30Z"/><rect class="metal" x="14" y="36" width="16" height="18" rx="2"/><rect class="metal" x="0" y="43" width="16" height="4"/><rect class="negro" x="26" y="90" width="42" height="16" rx="3"/>' },
    { id: 'sds', n: 'Martillo perforador', fuera: 'Vuelve el jueves', p: ['12 €', '18 €', '30 €', '100 €'], l: 'Lleva puntero, cincel plano y brocas SDS de 6 a 12.',
      s: '<rect class="cuerpo" x="22" y="34" width="62" height="28" rx="6"/><path class="negro" d="M84 30h16a8 8 0 0 1 8 8v36a8 8 0 0 1-8 8h-8l-8-20Z"/><rect class="negro" x="40" y="60" width="11" height="34" rx="4"/><rect class="metal" x="10" y="38" width="13" height="20" rx="2"/><rect class="metal" x="0" y="45" width="12" height="5"/>' },
    { id: 'lijadora', n: 'Lijadora orbital', p: ['6 €', '9 €', '15 €', '40 €'], l: 'Lleva diez lijas de grano 80 y 120, y bolsa de polvo.',
      s: '<rect class="negro" x="20" y="82" width="80" height="14" rx="3"/><path class="cuerpo" d="M28 82C28 52 92 52 92 82Z"/><rect class="negro" x="42" y="34" width="36" height="14" rx="7"/><rect class="metal" x="56" y="46" width="8" height="14"/>' },
    { id: 'ingletadora', n: 'Ingletadora', p: ['14 €', '20 €', '34 €', '120 €'], l: 'Disco de 48 dientes para madera. Corta hasta 30 cm de ancho.',
      s: '<rect class="negro" x="10" y="92" width="100" height="12" rx="3"/><rect class="metal" x="52" y="82" width="14" height="12"/><circle class="metal" cx="59" cy="62" r="28"/><path class="cuerpo" d="M27 60a32 32 0 0 1 64 0v6H27Z"/><rect class="negro" x="70" y="24" width="36" height="10" rx="5"/>' },
    { id: 'azulejo', n: 'Cortadora de azulejo', p: ['7 €', '10 €', '16 €', '40 €'], l: 'Manual, corta piezas de hasta 62 cm. Rodel de repuesto.',
      s: '<rect class="cuerpo" x="10" y="80" width="100" height="16" rx="3"/><rect class="metal" x="6" y="70" width="108" height="9" rx="2"/><path class="negro" d="M66 72 92 30l9 5-25 41Z"/><circle class="metal" cx="70" cy="68" r="6"/>' },
    { id: 'hidro', n: 'Hidrolimpiadora', p: ['12 €', '18 €', '30 €', '80 €'], l: 'Lanza, boquilla rotativa y cepillo para suelo. 130 bar.',
      s: '<rect class="cuerpo" x="34" y="40" width="50" height="56" rx="10"/><rect class="negro" x="38" y="16" width="42" height="6" rx="3"/><rect class="negro" x="38" y="16" width="6" height="26"/><rect class="negro" x="74" y="16" width="6" height="26"/><circle class="negro" cx="44" cy="100" r="10"/><circle class="negro" cx="76" cy="100" r="10"/><rect class="metal" x="84" y="58" width="30" height="5"/>' },
    { id: 'desbrozadora', n: 'Desbrozadora', fuera: 'Vuelve el lunes', p: ['15 €', '22 €', '38 €', '100 €'], l: 'Casco con visera y arnés. El hilo se cobra aparte, por metros.',
      s: '<path class="metal" d="M16 102 98 20l6 6-82 82Z"/><rect class="cuerpo" x="90" y="6" width="24" height="24" rx="6"/><circle class="negro" cx="18" cy="104" r="11"/><rect class="negro" x="42" y="56" width="40" height="7" rx="3" transform="rotate(45 62 59)"/>' },
    { id: 'escalera', n: 'Escalera telescópica', p: ['5 €', '8 €', '12 €', '30 €'], l: 'Aluminio, 3,8 m extendida y 90 cm plegada. Cabe en un maletero.',
      s: '<rect class="metal" x="32" y="8" width="10" height="104" rx="2"/><rect class="metal" x="78" y="8" width="10" height="104" rx="2"/><rect class="cuerpo" x="42" y="18" width="36" height="5"/><rect class="cuerpo" x="42" y="33" width="36" height="5"/><rect class="cuerpo" x="42" y="48" width="36" height="5"/><rect class="cuerpo" x="42" y="63" width="36" height="5"/><rect class="cuerpo" x="42" y="78" width="36" height="5"/><rect class="cuerpo" x="42" y="93" width="36" height="5"/>' }
  ];
  (function () {
    var tab = $('#tablero'), ficha = $('#ficha');
    HERR.forEach(function (h, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'herramienta' + (h.fuera ? ' es-alquilada' : '');
      b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      b.setAttribute('aria-controls', 'ficha');
      var sombra = h.s.replace(/class="(cuerpo|metal|negro)"/g, 'class="sombra"');
      b.innerHTML = '<svg viewBox="0 -6 120 122" aria-hidden="true"><path class="gancho" d="M54 -2v6h12v-6"/><g class="sombra-g">' + sombra + '</g><g class="pieza">' + h.s + '</g></svg>' +
        '<span class="herramienta-nombre">' + h.n + (h.fuera ? '<span class="sr-only"> (alquilada)</span>' : '') + '</span>';
      b.addEventListener('click', function () {
        $$('.herramienta', tab).forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        ficha.classList.toggle('es-alquilada', !!h.fuera);
        $('#ficha-estado').textContent = h.fuera ? 'Alquilada · ' + h.fuera : 'Disponible hoy';
        $('#ficha-nombre').textContent = h.n;
        $('#ficha-medio').textContent = h.p[0]; $('#ficha-dia').textContent = h.p[1];
        $('#ficha-finde').textContent = h.p[2]; $('#ficha-fianza').textContent = h.p[3];
        $('#ficha-lleva').textContent = h.l;
      });
      tab.appendChild(b);
    });
    $('#ficha-estado').textContent = 'Disponible hoy';
  })();

  /* =====================================================================
     16. M8 · LA GALGA: tornillo a tamaño real, calibrado con una tarjeta
     ===================================================================== */
  (function () {
    // métrica, paso, entrecaras (llave), altura de cabeza, broca de taco (orientativa)
    var M = [[3, 0.5, 5.5, 2, 5], [4, 0.7, 7, 2.8, 6], [5, 0.8, 8, 3.5, 8], [6, 1, 10, 4, 8], [8, 1.25, 13, 5.3, 10], [10, 1.5, 17, 6.4, 12], [12, 1.75, 19, 7.5, 14]];
    var svg = $('#galga-svg'), mesa = $('#galga-mesa'), chips = $('#galga-m');
    var cal = $('#calibre'), largo = $('#largo'), sel = 4;
    var NS = 'http://www.w3.org/2000/svg';
    M.forEach(function (m, i) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = 'M' + m[0];
      b.setAttribute('aria-pressed', String(i === sel));
      b.addEventListener('click', function () { sel = i; $$('button', chips).forEach(function (o, j) { o.setAttribute('aria-pressed', String(j === sel)); }); dibujar(); });
      chips.appendChild(b);
    });
    function nodo(tag, at, txt) { var n = document.createElementNS(NS, tag); for (var k in at) n.setAttribute(k, at[k]); if (txt) n.textContent = txt; svg.appendChild(n); return n; }
    function dibujar() {
      var ppm = +cal.value, L = +largo.value, m = M[sel];
      $('#largo-valor').textContent = L;
      $('#galga-paso').textContent = coma(m[1], m[1] < 1 ? 1 : 2) + ' mm';
      $('#galga-llave').textContent = 'del ' + String(m[2]).replace('.', ',');
      $('#galga-broca').textContent = m[4] + ' mm';
      var pad = 16;
      var tw = 85.6 * ppm, th = 53.98 * ppm;
      var bx = pad, by = pad + th + 34;
      var d = m[0] * ppm, k = m[3] * ppm, s = m[2] * ppm, Lp = L * ppm;
      var e = s * 1.1547, hx = bx + k + Lp + 28 + e / 2;
      var W = Math.ceil(Math.max(tw, k + Lp + 28 + e + 70) + pad * 2 + 10), H = Math.ceil(by + Math.max(s, d) + 46);
      svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      svg.style.width = W + 'px';
      while (svg.lastChild && svg.lastChild.tagName !== 'title') svg.removeChild(svg.lastChild);
      // tarjeta para calibrar
      nodo('rect', { x: pad, y: pad, width: tw.toFixed(1), height: th.toFixed(1), rx: (3 * ppm).toFixed(1), 'class': 'galga-svg-tarjeta' });
      nodo('text', { x: pad + 12, y: pad + 22, 'class': 'galga-svg-texto' }, 'tarjeta · 85,6 × 54 mm');
      // regla milimetrada dentro de la tarjeta, ya calibrada: si cuadra con una regla de verdad, la escala es buena
      var rg = '', ry = pad + th - 10;
      for (var mm = 0; mm <= 80; mm++) { var rx = pad + 2.8 * ppm + mm * ppm; rg += 'M' + rx.toFixed(1) + ' ' + ry + 'v' + (mm % 10 ? (mm % 5 ? -5 : -9) : -15); }
      nodo('path', { d: rg, stroke: '#A4B1A9', 'stroke-width': 1, fill: 'none' });
      for (var cm = 0; cm <= 8; cm++) nodo('text', { x: (pad + 2.8 * ppm + cm * 10 * ppm).toFixed(1), y: ry - 19, 'text-anchor': 'middle', 'class': 'galga-svg-texto' }, String(cm));
      var cy = by + s / 2;
      // cabeza (vista de lado, entrecaras) y caña con la rosca
      nodo('rect', { x: bx, y: by, width: k.toFixed(1), height: s.toFixed(1), rx: 1.5, fill: '#B7C1BB' });
      nodo('rect', { x: (bx + k).toFixed(1), y: (cy - d / 2).toFixed(1), width: Lp.toFixed(1), height: d.toFixed(1), fill: '#8E9C94' });
      var paso = m[1] * ppm, filetes = '';
      for (var x = bx + k + paso; x < bx + k + Lp - 0.5; x += paso) filetes += 'M' + x.toFixed(1) + ' ' + (cy - d / 2).toFixed(1) + 'l' + (paso * 0.5).toFixed(1) + ' ' + d.toFixed(1);
      nodo('path', { d: filetes, stroke: '#4A5951', 'stroke-width': Math.max(0.6, paso * 0.28).toFixed(2), fill: 'none' });
      // la cabeza vista de frente: entrecaras = la llave que le va
      var hex = '';
      for (var a = 0; a < 6; a++) { var an = Math.PI / 3 * a; hex += (a ? 'L' : 'M') + (hx + Math.cos(an) * e / 2).toFixed(1) + ' ' + (cy + Math.sin(an) * e / 2).toFixed(1); }
      nodo('path', { d: hex + 'Z', fill: '#B7C1BB' });
      nodo('circle', { cx: hx.toFixed(1), cy: cy.toFixed(1), r: (d * 0.5).toFixed(1), fill: 'none', stroke: '#4A5951', 'stroke-width': 1.2, 'stroke-dasharray': '3 3' });
      nodo('path', { d: 'M' + (hx + e / 2 + 8).toFixed(1) + ' ' + (cy - s / 2).toFixed(1) + 'h10M' + (hx + e / 2 + 8).toFixed(1) + ' ' + (cy + s / 2).toFixed(1) + 'h10M' + (hx + e / 2 + 13).toFixed(1) + ' ' + (cy - s / 2).toFixed(1) + 'V' + (cy + s / 2).toFixed(1), 'class': 'galga-svg-cota' });
      nodo('text', { x: (hx + e / 2 + 20).toFixed(1), y: (cy + 4).toFixed(1), 'class': 'galga-svg-cota-texto' }, String(m[2]).replace('.', ','));
      // cota de largo
      var yc = by + Math.max(s, d) + 18;
      nodo('path', { d: 'M' + (bx + k).toFixed(1) + ' ' + (yc - 7) + 'v14M' + (bx + k + Lp).toFixed(1) + ' ' + (yc - 7) + 'v14M' + (bx + k).toFixed(1) + ' ' + yc + 'H' + (bx + k + Lp).toFixed(1), 'class': 'galga-svg-cota' });
      nodo('text', { x: (bx + k + Lp / 2).toFixed(1), y: yc + 20, 'text-anchor': 'middle', 'class': 'galga-svg-cota-texto' }, 'M' + m[0] + ' × ' + L);
      // si no cabe, la mesa desborda: entonces (y solo entonces) es focusable
      requestAnimationFrame(function () {
        var desborda = mesa.scrollWidth > mesa.clientWidth + 1;
        if (desborda) { mesa.setAttribute('tabindex', '0'); mesa.setAttribute('role', 'group'); mesa.setAttribute('aria-label', 'Dibujo a escala, desplazable en horizontal'); mesa.style.overflowX = 'auto'; }
        else { mesa.removeAttribute('tabindex'); mesa.removeAttribute('role'); mesa.removeAttribute('aria-label'); mesa.style.overflowX = 'hidden'; }
      });
    }
    cal.addEventListener('input', dibujar); largo.addEventListener('input', dibujar);
    window.addEventListener('resize', dibujar);
    dibujar();
  })();

  /* ---------- ScrollTrigger, cuando ya está todo medido ---------- */
  if (gsapReady) window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  emitir();
})();
