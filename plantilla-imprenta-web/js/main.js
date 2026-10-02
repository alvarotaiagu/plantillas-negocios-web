/* =====================================================================
   Tres Milímetros · imprenta y copistería (negocio ficticio, demo)
   main.js — GSAP, ScrollTrigger y Lenis por CDN (jsDelivr). Sin ellos la
   página se ve y funciona entera.
   ===================================================================== */
(function () {
  'use strict';
  var html = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var euros = function (n) { return n.toFixed(2).replace('.', ',') + ' €'; };

  /* ---------- banderas separadas: gsapReady y motion ---------- */
  var motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gsapReady = !!(window.gsap && window.ScrollTrigger);
  if (gsapReady) gsap.registerPlugin(ScrollTrigger);
  if (gsapReady && motion) html.classList.add('has-motion');

  /* ---------- tareas largas ---------- */
  window.__tresmm = { longtasks: [] };
  try {
    new PerformanceObserver(function (l) { l.getEntries().forEach(function (e) { window.__tresmm.longtasks.push({ start: Math.round(e.startTime), dur: Math.round(e.duration) }); }); })
      .observe({ type: 'longtask', buffered: true });
  } catch (e) {}
  var guardar = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var leer = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };

  /* =====================================================================
     1. Cookies y mando de demostración
     ===================================================================== */
  var cookies = $('#cookies'), mando = $('#mando');
  var revision = html.classList.contains('es-revision');
  function mostrarMando() { if (mando) mando.hidden = !revision || !cookies.hidden; }
  if (leer('tresmm-cookies') !== 'ok') cookies.hidden = false;
  $('#cookies-ok').addEventListener('click', function () { cookies.hidden = true; guardar('tresmm-cookies', 'ok'); mostrarMando(); });
  $('#cookies-reabrir').addEventListener('click', function () { cookies.hidden = false; mostrarMando(); $('#cookies-ok').focus(); });
  mostrarMando();

  /* MANDO DE DEMOSTRACIÓN — no viaja al sitio de un cliente (README, «Quitar el mando») */
  function marcarMando() {
    $$('[data-maqueta]', mando).forEach(function (b) { b.setAttribute('aria-pressed', String(html.classList.contains('d-' + b.dataset.maqueta))); });
    $$('[data-paleta]', mando).forEach(function (b) { b.setAttribute('aria-pressed', String(html.classList.contains('p-' + b.dataset.paleta))); });
  }
  if (mando) {
    marcarMando();
    mando.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.maqueta) {
        html.classList.remove('d-registro', 'd-sobria'); html.classList.add('d-' + b.dataset.maqueta);
        guardar('tresmm-maqueta', b.dataset.maqueta);
        if (gsapReady) ScrollTrigger.refresh();
      }
      if (b.dataset.paleta) {
        html.classList.remove('p-magenta', 'p-cian', 'p-bermellon'); html.classList.add('p-' + b.dataset.paleta);
        guardar('tresmm-paleta', b.dataset.paleta);
        if (calc) calc.pintar();
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
    menuBoton.setAttribute('aria-expanded', String(abrir)); menu.classList.toggle('es-abierto', abrir);
    if (lenis) { abrir ? lenis.stop() : lenis.start(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('es-abierto')) { cerrarMenu(); menuBoton.focus(); } });

  /* =====================================================================
     3. Horario (hora de Madrid): hoy y abierto/cerrado
     ===================================================================== */
  var T = [[540, 840], [960, 1200]];
  var TRAMOS = { 1: T, 2: T, 3: T, 4: T, 5: T, 6: [[600, 810]], 0: [] };
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  var hhmm = function (m) { return Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0'); };
  function ahora() {
    try {
      var o = {}; new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
      return { dia: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday), min: (+o.hour % 24) * 60 + (+o.minute) };
    } catch (e) { var d = new Date(); return { dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes() }; }
  }
  function horario() {
    var a = ahora(), largo, corto, abierto = false, hoy = TRAMOS[a.dia];
    $$('.horario-tabla tr').forEach(function (tr) { tr.classList.toggle('es-hoy', +tr.dataset.dia === a.dia); });
    for (var i = 0; i < hoy.length; i++) {
      if (a.min >= hoy[i][0] && a.min < hoy[i][1]) { abierto = true; largo = 'Abierto ahora · cierra a las ' + hhmm(hoy[i][1]); corto = 'Abierto hasta las ' + hhmm(hoy[i][1]); break; }
      if (a.min < hoy[i][0]) { largo = 'Cerrado ahora · abre hoy a las ' + hhmm(hoy[i][0]); corto = 'Abre hoy a las ' + hhmm(hoy[i][0]); break; }
    }
    if (!largo) for (var k = 1; k <= 7; k++) { var d = (a.dia + k) % 7; if (TRAMOS[d].length) { var c = k === 1 ? 'mañana' : 'el ' + DIAS[d]; largo = 'Cerrado ahora · abre ' + c + ' a las ' + hhmm(TRAMOS[d][0][0]); corto = 'Abre ' + c + ' a las ' + hhmm(TRAMOS[d][0][0]); break; } }
    html.classList.toggle('es-abierto', abierto);
    $$('[data-estado-largo]').forEach(function (n) { n.textContent = largo; });
    $$('[data-estado-corto]').forEach(function (n) { n.textContent = corto; });
  }
  horario(); setInterval(horario, 60000);

  /* ---------- mapa bajo clic ---------- */
  $('#mapa-boton').addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = 'https://www.google.com/maps?q=Pontevedra&output=embed';
    f.title = 'Mapa de Pontevedra'; f.loading = 'lazy';
    var m = $('#mapa'); $$('.mapa-texto, #mapa-boton', m).forEach(function (n) { n.remove(); });
    m.appendChild(f); f.focus();
  });

  /* ---------- formulario de archivo (demostración) ---------- */
  $('#archivo').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.currentTarget, ok = true, primero = null;
    $$('input[required]', f).forEach(function (i) { var mal = !i.value.trim(); i.setAttribute('aria-invalid', String(mal)); if (mal && !primero) primero = i; ok = ok && !mal; });
    var r = $('#archivo-respuesta');
    if (!ok) { r.textContent = 'Falta algún dato: qué quieres imprimir, tu nombre y cómo te contestamos.'; primero.focus(); return; }
    r.textContent = 'Recibido (de muestra). ' + (f.sangrado.checked ? 'Miraríamos el archivo y te contestaríamos hoy.' : 'Ojo: sin los 3 mm de sangrado el corte puede dejar un filo blanco; te diríamos cómo añadirlos.') + ' No se ha enviado nada.';
    f.reset();
  });

  /* =====================================================================
     4. Lenis
     ===================================================================== */
  var lenis = null, scrollY = window.scrollY, velocidad = 0, oyentes = [];
  function alScroll(fn) { oyentes.push(fn); }
  function emitir() { for (var i = 0; i < oyentes.length; i++) oyentes[i](scrollY, velocidad); }
  if (window.Lenis && motion) {
    lenis = new Lenis({ lerp: 0.16, smoothWheel: true });   // 0,16: el scrub horizontal no «vuelve atrás»
    lenis.on('scroll', function (l) { scrollY = l.scroll; velocidad = l.velocity || 0; emitir(); });
    if (gsapReady) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }
    else (function bucle(t) { lenis.raf(t); requestAnimationFrame(bucle); })(performance.now());
  } else {
    window.addEventListener('scroll', function () { var y = window.scrollY; velocidad = y - scrollY; scrollY = y; emitir(); }, { passive: true });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href'); if (id.length < 2) return;
    var t = document.querySelector(id); if (!t) return;
    e.preventDefault();
    if (menu.classList.contains('es-abierto')) cerrarMenu();
    if (lenis) lenis.scrollTo(t, { offset: id === '#inicio' ? 0 : -40, duration: 1.4 }); else t.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' });
    if (t.tabIndex < 0) t.setAttribute('tabindex', '-1');
    t.focus({ preventScroll: true });
  });

  /* =====================================================================
     5. Char-reveal en desregistro: las letras llegan con las tres tintas
        desplazadas y casan al llegar (la variable --reg de cada titular)
     ===================================================================== */
  function partir(el) {
    var texto = el.textContent.trim(); el.textContent = '';
    var sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = texto; el.appendChild(sr);
    texto.split(/\s+/).forEach(function (p, i, arr) {
      var w = document.createElement('span'); w.className = 'palabra'; w.setAttribute('aria-hidden', 'true');
      Array.from(p).forEach(function (ch) { var s = document.createElement('span'); s.className = 'letra'; s.textContent = ch; w.appendChild(s); });
      el.appendChild(w); if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }
  var reveals = $$('[data-reveal]'); reveals.forEach(partir);
  function revelar(el, retraso) {
    if (el.classList.contains('es-dentro')) return;
    el.classList.add('es-dentro');
    if (!(gsapReady && motion)) return;
    gsap.fromTo($$('.letra', el), { y: '0.45em', opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.028, delay: retraso || 0 });
    gsap.fromTo(el, { '--reg': '0.09em' }, { '--reg': '0em', duration: 1.6, ease: 'expo.inOut', delay: (retraso || 0) + 0.1 });
  }
  var heroTit = $$('.portada-titulo [data-reveal]');
  if ('IntersectionObserver' in window) {
    var ioR = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { revelar(e.target); ioR.unobserve(e.target); } }); }, { rootMargin: '0px 0px -12% 0px' });
    reveals.forEach(function (el) { if (heroTit.indexOf(el) < 0) ioR.observe(el); });
    var ioE = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('es-visible', 'es-abierto'); ioE.unobserve(e.target); } }); }, { rootMargin: '0px 0px -15% 0px' });
    $$('.entra, .abanico').forEach(function (el) { ioE.observe(el); });
    var ioC = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { contar(e.target); ioC.unobserve(e.target); } }); }, { threshold: 0.6 });
    $$('[data-cuenta]').forEach(function (c) { if (motion) c.textContent = '0'; ioC.observe(c); });
  } else { reveals.forEach(function (el) { el.classList.add('es-dentro'); }); $$('.abanico').forEach(function (a) { a.classList.add('es-abierto'); }); }
  function contar(el) {
    var fin = +el.dataset.cuenta; if (!motion) { el.textContent = fin; return; }
    var t0 = performance.now();
    (function paso(t) { var k = clamp((t - t0) / 1300, 0, 1); el.textContent = Math.round(fin * (1 - Math.pow(2, -10 * k)) * (k < 1 ? 1 : 0) + (k === 1 ? fin : 0)); if (k < 1) requestAnimationFrame(paso); })(t0);
  }

  // La máquina se mueve: con el scroll rápido, los titulares se desregistran un pelo
  (function () {
    if (!motion) return;
    var s = 0, raf = 0;
    function bajar() { raf = 0; s *= 0.86; if (s < 0.05) s = 0; html.style.setProperty('--sacudida', s.toFixed(2) + 'px'); if (s > 0) raf = requestAnimationFrame(bajar); }
    alScroll(function (y, v) { if (!html.classList.contains('d-registro')) return; s = Math.max(s, clamp(Math.abs(v) * 0.08, 0, 2.5)); if (!raf) raf = requestAnimationFrame(bajar); });
  })();

  /* =====================================================================
     6. PORTADA: el cartel en trama CMYK (WebGL) con su cuentahílos.
        Cuatro tramas a 15°, 75°, 0° y 45° que forman la roseta; el
        scroll acerca la lineatura y el cursor es una lupa ×3.
     ===================================================================== */
  var trama = (function () {
    var canvas = $('#trama'), hoja = $('.pliego-hoja'), pliego = $('#pliego'), lupaEl = $('.pliego-lupa');
    var gl = null;
    try { gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'high-performance' }); } catch (e) {}
    if (!gl) { html.classList.add('sin-webgl'); return null; }
    var VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var FS = [
      'precision highp float;',
      'uniform vec2 uRes;uniform float uCelda;uniform float uReg;uniform vec3 uLupa;uniform float uDesp;uniform float uIntro;',
      'vec3 fuente(vec2 q){',          // el cartel, en coordenadas de hoja 0..1 (y hacia abajo)
      ' vec3 c=vec3(1.);',
      ' float sol=length((q-vec2(0.56,0.40+uDesp*0.10))*vec2(1.,1.));',
      ' vec3 solc=mix(vec3(0.93,0.10,0.40),vec3(1.0,0.86,0.10),smoothstep(0.12,0.62,q.y+uDesp*0.05));',
      ' c=mix(c,solc,1.-smoothstep(0.30,0.305,sol));',
      ' c=mix(c,c*vec3(1.,.92,.85),smoothstep(0.30,0.0,sol)*0.35);',
      ' float ola=0.66+0.035*sin(q.x*11.+uDesp*5.)+0.02*sin(q.x*23.+1.3);',
      ' vec3 mar=mix(vec3(0.0,0.62,0.88),vec3(0.05,0.18,0.42),smoothstep(ola,1.0,q.y));',
      ' c=mix(c,mar,smoothstep(ola,ola+0.004,q.y));',
      ' float ola2=0.80+0.03*sin(q.x*8.-uDesp*4.+2.);',
      ' c=mix(c,vec3(0.02,0.10,0.28),smoothstep(ola2,ola2+0.004,q.y)*0.85);',
      ' float b1=step(0.07,q.x)*step(q.x,0.62)*step(0.07,q.y)*step(q.y,0.105);',
      ' float b2=step(0.07,q.x)*step(q.x,0.44)*step(0.125,q.y)*step(q.y,0.15);',
      ' float b3=step(0.07,q.x)*step(q.x,0.30)*step(0.165,q.y)*step(q.y,0.18);',
      ' c=mix(c,vec3(0.08),max(max(b1,b2),b3));',
      ' return c;}',
      'vec4 cmyk(vec3 c){float k=1.-max(c.r,max(c.g,c.b));float d=max(1.-k,1e-4);return vec4((1.-c.r-k)/d,(1.-c.g-k)/d,(1.-c.b-k)/d,k);}',
      'float punto(vec2 px,float ang,float canal,float celda){',
      ' float s=sin(ang),co=cos(ang);mat2 R=mat2(co,-s,s,co);mat2 Ri=mat2(co,s,-s,co);',
      ' vec2 r=R*px/celda;vec2 cel=floor(r)+0.5;vec2 cen=Ri*(cel*celda);',
      ' vec4 t=cmyk(fuente(cen/uRes));',
      ' float cov=canal<0.5?t.x:(canal<1.5?t.y:(canal<2.5?t.z:t.w));',
      ' float rad=sqrt(clamp(cov,0.,1.))*0.62;float d=length(r-cel);float aa=1.2/celda;',
      ' return (1.-smoothstep(rad-aa,rad+aa,d))*smoothstep(0.015,0.06,cov);}',
      'void main(){',
      ' vec2 px=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y);float celda=uCelda;',
      ' float dl=length(px-uLupa.xy);bool enLupa=uLupa.z>0.&&dl<uLupa.z;',
      ' if(enLupa){px=uLupa.xy+(px-uLupa.xy)/3.0;celda=uCelda;}',
      ' vec2 o=vec2(uReg);',
      ' float c=punto(px+o*vec2(1.,0.3),0.2618,0.,celda);',
      ' float m=punto(px+o*vec2(-0.8,0.5),1.309,1.,celda);',
      ' float y=punto(px+o*vec2(0.2,-0.9),0.0,2.,celda);',
      ' float k=punto(px,0.7854,3.,celda);',
      ' vec3 col=vec3(0.984,0.98,0.965);',
      ' col*=mix(vec3(1.),vec3(0.0,0.63,0.89),c*uIntro);col*=mix(vec3(1.),vec3(0.90,0.0,0.49),m*uIntro);',
      ' col*=mix(vec3(1.),vec3(1.0,0.90,0.0),y*uIntro);col*=mix(vec3(1.),vec3(0.09,0.09,0.10),k*uIntro);',
      ' if(enLupa){col*=mix(1.0,0.93,smoothstep(uLupa.z*0.7,uLupa.z,dl));}',
      ' gl_FragColor=vec4(col,1.);}'
    ].join('\n');

    var paralelo = gl.getExtension('KHR_parallel_shader_compile');
    var prog = gl.createProgram(), vs = gl.createShader(gl.VERTEX_SHADER), fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vs, VS); gl.compileShader(vs); gl.shaderSource(fs, FS); gl.compileShader(fs);
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    var U = {}, listo = false;
    var calidad = 1;
    try { var dbg = gl.getExtension('WEBGL_debug_renderer_info'); if (dbg && /swiftshader|llvmpipe|software/i.test(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL))) calidad = 0.6; } catch (e) {}
    var est = { reg: motion ? 22 : 0, celda: 1, desp: 0, intro: motion ? 0 : 1, lx: -999, ly: -999, lr: 0 };
    var obj = { reg: 0, celda: 1, desp: 0, lx: -999, ly: -999, lr: 0 };
    var visible = true, raf = 0, escala = 1;

    function preparar() {
      if (paralelo && !gl.getProgramParameter(prog, paralelo.COMPLETION_STATUS_KHR)) { requestAnimationFrame(preparar); return; }
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { html.classList.add('sin-webgl'); return; }
      gl.useProgram(prog);
      var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ['uRes', 'uCelda', 'uReg', 'uLupa', 'uDesp', 'uIntro'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
      listo = true; pedir();
    }
    function medir() {
      var w = hoja.offsetWidth, h = hoja.offsetHeight;
      escala = Math.min(window.devicePixelRatio || 1, 2) * calidad;
      var W = Math.max(2, Math.round(w * escala)), H = Math.max(2, Math.round(h * escala));
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; gl.viewport(0, 0, W, H); pedir(); }
    }
    function pintar() {
      raf = 0; if (!listo) return;
      var k = motion ? 0.12 : 1, sigue = false;
      ['reg', 'celda', 'desp', 'lx', 'ly', 'lr'].forEach(function (c) {
        est[c] = (c === 'lx' || c === 'ly') && est.lr < 1 ? obj[c] : lerp(est[c], obj[c], c === 'lx' || c === 'ly' ? 0.35 : k);
        if (Math.abs(est[c] - obj[c]) > 0.01) sigue = true; else est[c] = obj[c];
      });
      gl.uniform2f(U.uRes, canvas.width, canvas.height);
      gl.uniform1f(U.uCelda, 6.2 * escala * est.celda);
      gl.uniform1f(U.uReg, est.reg * escala);
      gl.uniform3f(U.uLupa, est.lx * escala, est.ly * escala, est.lr * escala);
      gl.uniform1f(U.uDesp, est.desp);
      gl.uniform1f(U.uIntro, est.intro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (sigue && visible) pedir();
    }
    function pedir() { if (!raf && visible) raf = requestAnimationFrame(pintar); }
    if ('ResizeObserver' in window) new ResizeObserver(medir).observe(hoja); else window.addEventListener('resize', medir);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) pedir(); }).observe(canvas);
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); html.classList.add('sin-webgl'); });

    // Cuentahílos: coordenadas locales de la hoja girada (2,2°)
    var ANG = 2.2 * Math.PI / 180, R = 75;
    function local(cx, cy) {
      var r = hoja.getBoundingClientRect(), mx = r.left + r.width / 2, my = r.top + r.height / 2;
      var dx = cx - mx, dy = cy - my, c = Math.cos(-ANG), s = Math.sin(-ANG);
      return { x: dx * c - dy * s + hoja.offsetWidth / 2, y: dx * s + dy * c + hoja.offsetHeight / 2 };
    }
    function lupa(cx, cy, en) {
      var p = local(cx, cy);
      var dentro = en && p.x > 0 && p.y > 0 && p.x < hoja.offsetWidth && p.y < hoja.offsetHeight;
      pliego.classList.toggle('es-lupa', dentro);
      obj.lr = dentro ? R : 0; obj.lx = p.x; obj.ly = p.y;
      lupaEl.style.setProperty('--lx', p.x.toFixed(1) + 'px'); lupaEl.style.setProperty('--ly', p.y.toFixed(1) + 'px');
      lupaEl.style.setProperty('--lupa-d', (R * 2) + 'px');
      pedir();
      return dentro;
    }
    hoja.addEventListener('pointermove', function (e) { lupa(e.clientX, e.clientY, true); });
    hoja.addEventListener('pointerleave', function () { lupa(-9999, -9999, false); });
    medir(); preparar();
    return {
      lupa: lupa,
      scroll: function (f) { obj.celda = 1 + f * 1.6; obj.desp = f; pedir(); return Math.round(150 / obj.celda); },
      sacudir: function (v) { if (!motion) return; obj.reg = 0; est.reg = Math.max(est.reg, clamp(Math.abs(v) * 0.6, 0, 9)); pedir(); },
      intro: function () {
        if (!(gsapReady && motion)) { est.intro = 1; est.reg = 0; pedir(); return; }
        gsap.to(est, { intro: 1, duration: 0.7, ease: 'power2.out', onUpdate: pedir });
        gsap.to(est, { reg: 0, duration: 1.8, ease: 'expo.inOut', onUpdate: pedir });
      }
    };
  })();
  // el scroll acerca la trama (baja la lineatura) y la velocidad desregistra un instante
  var lin = $('#lineatura');
  alScroll(function (y, v) {
    var f = clamp(y / Math.max(1, window.innerHeight), 0, 1.2);
    if (trama) { lin.textContent = trama.scroll(f); trama.sacudir(v); }
    else lin.textContent = Math.round(150 / (1 + f * 1.6));
  });
  // sin ratón (táctil): el cuentahílos cruza el cartel solo, al ritmo del scroll del hero
  if (trama && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    alScroll(function (y) {
      var h = $('.pliego-hoja').getBoundingClientRect(), f = clamp(y / Math.max(1, window.innerHeight * 0.6), 0, 1);
      if (f <= 0 || f >= 1) { trama.lupa(-9999, -9999, false); return; }
      trama.lupa(h.left + h.width * (0.25 + 0.5 * f), h.top + h.height * (0.3 + 0.35 * Math.sin(f * Math.PI)), true);
    });
  }

  /* =====================================================================
     7. CORTINA: las planchas casan y el pliego sale de la máquina
     ===================================================================== */
  var cortina = $('#cortina');
  function quitarCortina() { cortina.classList.add('es-fuera'); }
  function entregar() { if (trama) trama.intro(); heroTit.forEach(function (el, i) { revelar(el, i * 0.12); }); }
  if (gsapReady && motion) {
    var tl = gsap.timeline({ defaults: { ease: 'expo.inOut' }, onComplete: quitarCortina });
    tl.fromTo('.plancha-c', { x: -70, y: -24 }, { x: 0, y: 0, duration: 1.0 }, 0)
      .fromTo('.plancha-m', { x: 60, y: 34 }, { x: 0, y: 0, duration: 1.0 }, 0.05)
      .fromTo('.plancha-y', { x: 18, y: -60 }, { x: 0, y: 0, duration: 1.0 }, 0.1)
      .to('.plancha-k', { opacity: 1, duration: 0.25, ease: 'none' }, 1.05)
      .fromTo('.cortina-texto', { opacity: 0, letterSpacing: '0.6em' }, { opacity: 1, letterSpacing: '0.2em', duration: 0.6, ease: 'expo.out' }, 0.9)
      .to('.cortina-pliego', { yPercent: -102, borderBottomLeftRadius: '50% 22vh', borderBottomRightRadius: '50% 22vh', duration: 1.1 }, 1.35)
      .add(entregar, 1.75);
    setTimeout(quitarCortina, 4200);
  } else {
    cortina.classList.add('es-css');
    setTimeout(quitarCortina, motion ? 1200 : 30);
    entregar();
  }

  /* =====================================================================
     8. 01 · PRESUPUESTADOR (precios de muestra)
     ===================================================================== */
  var PRODUCTOS = [
    { id: 'tarjetas', n: 'Tarjetas', f: '85 × 55 mm', mm: [85, 55], q: [100, 250, 500, 1000, 2500, 5000], e: [19, 26, 34, 49, 95, 165], u: 'tarjetas', plazo: 'en 48 h',
      papel: [['Estucado mate 350 g', 1], ['Verjurado 300 g', 1.35], ['Kraft 350 g', 1.2]] },
    { id: 'flyers', n: 'Flyers A5', f: '148 × 210 mm', mm: [148, 210], q: [100, 250, 500, 1000, 2500, 5000], e: [29, 42, 58, 79, 145, 235], u: 'flyers', plazo: 'en 48 h',
      papel: [['Estucado brillo 135 g', 1], ['Estucado mate 170 g', 1.15], ['Reciclado 120 g', 1.05]] },
    { id: 'carteles', n: 'Carteles A3', f: '297 × 420 mm', mm: [297, 420], q: [10, 25, 50, 100, 250, 500], e: [18, 35, 58, 95, 190, 320], u: 'carteles', plazo: 'en 24 h',
      papel: [['Estucado brillo 170 g', 1], ['Estucado mate 200 g', 1.12]] },
    { id: 'tfg', n: 'TFG tapa dura', f: 'A4 · 210 × 297 mm', mm: [210, 297], q: [1, 2, 3, 5, 10, 20], e: [22, 42, 60, 95, 180, 340], u: 'ejemplares', plazo: 'en el día (antes de las 12)',
      papel: [['Interior 90 g', 1], ['Interior 100 g', 1.08]] }
  ];
  var calc = (function () {
    var sel = 0, papel = 0;
    var cajaP = $('#calc-productos'), cajaPap = $('#calc-papeles'), rango = $('#calc-cantidad'), svg = $('#calc-svg'), curva = $('#curva-svg');
    var NS = 'http://www.w3.org/2000/svg';
    function chips(caja, lista, activo, alPulsar) {
      caja.textContent = '';
      lista.forEach(function (t, i) {
        var b = document.createElement('button'); b.type = 'button'; b.textContent = t; b.setAttribute('aria-pressed', String(i === activo));
        b.addEventListener('click', function () { alPulsar(i); }); caja.appendChild(b);
      });
    }
    function nodo(padre, tag, at, txt) { var n = document.createElementNS(NS, tag); for (var k in at) n.setAttribute(k, at[k]); if (txt != null) n.textContent = txt; padre.appendChild(n); return n; }
    function pintar() {
      var p = PRODUCTOS[sel], i = +rango.value, f = p.papel[papel][1];
      var total = p.e[i] * f, q = p.q[i];
      $('#calc-cantidad-valor').textContent = q.toLocaleString('es-ES'); $('#calc-unidad').textContent = p.u;
      $('#calc-total').textContent = euros(total);
      $('#calc-unitario').textContent = euros(total / q);
      $('#calc-plazo').textContent = p.plazo; $('#calc-formato').textContent = p.f;
      // formatos a escala, apilados desde la esquina inferior izquierda
      svg.textContent = '';
      var marca = getComputedStyle(html).getPropertyValue('--marca').trim();
      var esc = 270 / 420;
      PRODUCTOS.slice().sort(function (a, b) { return b.mm[0] * b.mm[1] - a.mm[0] * a.mm[1]; }).forEach(function (o) {
        var w = o.mm[0] * esc, h = o.mm[1] * esc, es = o === p;
        nodo(svg, 'rect', { x: 14, y: (290 - h).toFixed(1), width: w.toFixed(1), height: h.toFixed(1), fill: es ? marca : '#FBFAF6', 'fill-opacity': es ? 0.9 : 1, stroke: '#16161A', 'stroke-width': es ? 2 : 1 });
        nodo(svg, 'text', { x: (14 + w - 6).toFixed(1), y: (290 - h + 15).toFixed(1), 'text-anchor': 'end', 'font-family': 'Red Hat Mono, monospace', 'font-size': 11, fill: es ? '#FFFFFF' : '#55545C' }, o.n.replace(' tapa dura', ''));
      });
      // curva de precio por unidad (solo se ve en «Sobria»)
      curva.textContent = '';
      var us = p.e.map(function (e, j) { return e * f / p.q[j]; }), max = us[0], X = function (j) { return 40 + j * 70; }, Y = function (u) { return 170 - (u / max) * 140; };
      nodo(curva, 'path', { d: 'M40 170H400M40 30V170', 'class': 'curva-eje' });
      var d = us.map(function (u, j) { return (j ? 'L' : 'M') + X(j) + ' ' + Y(u).toFixed(1); }).join('');
      nodo(curva, 'path', { d: d + 'L' + X(us.length - 1) + ' 170L40 170Z', 'class': 'curva-area' });
      nodo(curva, 'path', { d: d, 'class': 'curva-linea' });
      nodo(curva, 'circle', { cx: X(i), cy: Y(us[i]).toFixed(1), r: 6, 'class': 'curva-punto' });
      us.forEach(function (u, j) { nodo(curva, 'text', { x: X(j), y: 190, 'text-anchor': 'middle', 'class': 'curva-texto' }, p.q[j].toLocaleString('es-ES')); });
      nodo(curva, 'text', { x: 46, y: Y(us[0]) - 8, 'class': 'curva-texto' }, euros(us[0]) + '/ud.');
      nodo(curva, 'text', { x: X(us.length - 1), y: Y(us[us.length - 1]) - 10, 'text-anchor': 'end', 'class': 'curva-texto' }, euros(us[us.length - 1]) + '/ud.');
    }
    function elegirPapel(j) { papel = j; chips(cajaPap, PRODUCTOS[sel].papel.map(function (x) { return x[0]; }), papel, elegirPapel); pintar(); }
    function elegir(i) {
      sel = i; papel = 0;
      chips(cajaP, PRODUCTOS.map(function (p) { return p.n; }), sel, elegir);
      chips(cajaPap, PRODUCTOS[sel].papel.map(function (x) { return x[0]; }), papel, elegirPapel);
      rango.max = PRODUCTOS[sel].q.length - 1; if (+rango.value > +rango.max) rango.value = rango.max;
      pintar();
    }
    rango.addEventListener('input', pintar);
    elegir(0);
    return { pintar: pintar };
  })();

  /* =====================================================================
     9. 02 · PROCESO: anclado con scrub horizontal
     ===================================================================== */
  (function () {
    var pista = $('#proceso-pista'), fila = $('#proceso-fila'), barra = $('#proceso-avance');
    var capas = $$('.etapa-color .capa'), cuchilla = $('.cuchilla');
    function estado(p) {
      barra.style.setProperty('--p', p.toFixed(3));
      capas.forEach(function (c, i) { c.style.opacity = clamp((p - (0.30 + i * 0.05)) / 0.04, 0, 1).toFixed(2); });
      if (cuchilla) cuchilla.style.transform = 'translateY(' + (12 * Math.sin(clamp((p - 0.56) / 0.1, 0, 1) * Math.PI)).toFixed(1) + 'px)';
    }
    if (gsapReady && motion) {
      html.classList.add('has-pin');
      estado(0);
      var dist = function () { return Math.max(0, fila.scrollWidth - pista.clientWidth); };
      gsap.to(fila, {
        x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: { trigger: '#proceso', pin: '.proceso-fijo', start: 'top top', end: function () { return '+=' + Math.round(dist() + window.innerHeight * 0.4); }, scrub: 0.5, invalidateOnRefresh: true, anticipatePin: 1, onUpdate: function (st) { estado(st.progress); } }
      });
    } else {
      // sin anclaje: pista desplazable; focusable solo si de verdad desborda
      barra.style.setProperty('--p', '1');
      var revisar = function () {
        var d = pista.scrollWidth > pista.clientWidth + 1;
        if (d) pista.setAttribute('tabindex', '0'); else pista.removeAttribute('tabindex');
      };
      revisar(); window.addEventListener('resize', revisar);
      pista.addEventListener('scroll', function () { barra.style.setProperty('--p', (pista.scrollLeft / Math.max(1, pista.scrollWidth - pista.clientWidth)).toFixed(3)); }, { passive: true });
    }
  })();

  /* =====================================================================
     10. Cinta «en máquina hoy»
     ===================================================================== */
  (function () {
    var fila = $('#cinta-fila'); if (!fila || !motion) return;
    fila.innerHTML += fila.innerHTML;
    var x = 0, ancho = 0, en = false, ult = 0, extra = 0;
    function medir() { ancho = fila.scrollWidth / 2; }
    medir(); window.addEventListener('resize', medir); if (document.fonts) document.fonts.ready.then(medir);
    new IntersectionObserver(function (es) { en = es[0].isIntersecting; if (en) { ult = performance.now(); requestAnimationFrame(paso); } }).observe(fila);
    alScroll(function (y, v) { extra = clamp(Math.abs(v) * 1.6, 0, 40); });
    function paso(t) {
      if (!en) return;
      var dt = Math.min(64, t - ult); ult = t;
      x -= (0.05 + extra * 0.03) * dt; extra *= 0.94;
      if (x <= -ancho) x += ancho;
      fila.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
      requestAnimationFrame(paso);
    }
  })();

  /* =====================================================================
     11. 03 · ABANICO DE PAPELES
     ===================================================================== */
  var PAPELES = [
    { g: '80 g', n: 'Offset', uso: 'Fotocopias, apuntes y cuadernillos. El de todos los días.', gr: '0,10', bg: '#FDFCF8' },
    { g: '90 g', n: 'Reciclado', uso: 'Cartas y facturas: tacto de papel de verdad, con su motita.', gr: '0,11', bg: '#E8E1D0' },
    { g: '135 g', n: 'Estucado brillo', uso: 'Flyers y folletos: el color salta y la foto brilla.', gr: '0,12', bg: 'linear-gradient(135deg,#FFFFFF 40%,#ECEFF3 50%,#FFFFFF 60%)' },
    { g: '170 g', n: 'Estucado mate', uso: 'Carteles y revistas: no refleja la luz y se lee de lado.', gr: '0,16', bg: '#F6F5F0' },
    { g: '250 g', n: 'Cartulina gráfica', uso: 'Portadas, carpetas y postales que aguantan el buzón.', gr: '0,28', bg: '#F2EEE3' },
    { g: '300 g', n: 'Verjurado', uso: 'Invitaciones: las líneas del verjurado se notan con el dedo.', gr: '0,34', bg: 'repeating-linear-gradient(0deg,#EFE7D2 0 5px,#E6DCC3 5px 6px)' },
    { g: '350 g', n: 'Kraft', uso: 'Etiquetas y tarjetas con aire de taller.', gr: '0,38', bg: '#C9A57A' }
  ];
  (function () {
    var ab = $('#abanico'), n = PAPELES.length;
    function ficha(p) {
      $('#papel-gramaje').textContent = p.g; $('#papel-nombre').textContent = p.n;
      $('#papel-uso').textContent = p.uso; $('#papel-grosor').textContent = 'Grosor aproximado: ' + p.gr + ' mm';
    }
    PAPELES.forEach(function (p, i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'hoja-papel';
      var abierto = (i - (n - 1) / 2) * 12, cerrado = (i - (n - 1) / 2) * 1.6;
      b.style.setProperty('--cerrado', cerrado + 'deg'); b.style.setProperty('--abierto', abierto + 'deg');
      b.style.background = p.bg; b.style.zIndex = i;
      b.setAttribute('aria-pressed', String(i === 3));
      b.innerHTML = '<b>' + p.g + '</b><span>' + p.n + '</span>';
      b.addEventListener('click', function () { $$('.hoja-papel', ab).forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); }); ficha(p); });
      ab.appendChild(b);
    });
    ficha(PAPELES[3]);
    if (!motion) ab.classList.add('es-abierto');
  })();

  /* =====================================================================
     12. Imán y cursor (marca de registro; solo ratón fino)
     ===================================================================== */
  if (motion) $$('[data-iman]').forEach(function (b) {
    b.addEventListener('pointermove', function (e) { if (e.pointerType !== 'mouse') return; var r = b.getBoundingClientRect(); b.style.setProperty('--mx', ((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1) + 'px'); b.style.setProperty('--my', ((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1) + 'px'); });
    b.addEventListener('pointerleave', function () { b.style.setProperty('--mx', '0px'); b.style.setProperty('--my', '0px'); });
  });
  (function () {
    var cur = $('.cursor'), punto = $('.cursor-punto'), aro = $('.cursor-aro');
    var fino = window.matchMedia('(hover: hover) and (pointer: fine)');
    var mx = -100, my = -100, ax = -100, ay = -100, vivo = false, raf = 0;
    function mover() {
      raf = 0; ax = motion ? lerp(ax, mx, 0.22) : mx; ay = motion ? lerp(ay, my, 0.22) : my;
      punto.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      aro.style.transform = 'translate3d(' + ax.toFixed(1) + 'px,' + ay.toFixed(1) + 'px,0)';
      if (Math.abs(ax - mx) > 0.3 || Math.abs(ay - my) > 0.3) raf = requestAnimationFrame(mover);
    }
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || !fino.matches) return;
      if (!vivo) { vivo = true; html.classList.add('cursor-propio'); ax = e.clientX; ay = e.clientY; }
      mx = e.clientX; my = e.clientY;
      var t = e.target;
      var enLupa = !!(t.closest && t.closest('.pliego-hoja'));
      cur.classList.toggle('es-lupa', enLupa);
      cur.classList.toggle('es-enlace', !enLupa && !!(t.closest && t.closest('a, button, input, label')));
      if (!raf) raf = requestAnimationFrame(mover);
    }, { passive: true });
    document.addEventListener('mouseleave', function () { mx = my = ax = ay = -100; mover(); });
  })();

  if (gsapReady) window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  if (document.fonts && gsapReady) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  emitir();
})();
