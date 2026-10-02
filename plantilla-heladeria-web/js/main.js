/* Salseiro · Xeadaría de obrador — plantilla «Mantecar»
   Sitio de demostración: negocio ficticio.

   Dos banderas separadas, como pide el pliego:
   - gsapReady: GSAP y ScrollTrigger han cargado (si no, la página se ve entera).
   - motion: el visitante no ha pedido movimiento reducido.
   Con movimiento reducido se apaga el movimiento, no el contenido: el obrador,
   el filtro, el horario y el sabor de la pala siguen cambiando. */

(function () {
  'use strict';

  // ---------- Medición de tareas largas (desde el arranque) ----------
  var tareas = window.__salseiroLongtasks = [];
  try {
    new PerformanceObserver(function (lista) {
      lista.getEntries().forEach(function (e) { tareas.push({ inicio: Math.round(e.startTime), duracion: Math.round(e.duration) }); });
    }).observe({ type: 'longtask', buffered: true });
  } catch (e) {}

  var raiz = document.documentElement;
  var gsapReady = !!(window.gsap && window.ScrollTrigger);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var motion = !reduce.matches;
  var punteroFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  if (gsapReady) {
    raiz.classList.add('has-motion');
    gsap.registerPlugin(ScrollTrigger);
  }

  document.fonts && document.fonts.ready.then(function () { window.__salseiroFuentes = Math.round(performance.now()); });

  // ---------- Lenis: único motor de scroll ----------
  var lenis = null;
  if (motion && window.Lenis) {
    lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
    if (gsapReady) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function bucle(t) { lenis.raf(t); requestAnimationFrame(bucle); })(performance.now());
    }
  }
  function irA(destino) {
    var el = typeof destino === 'string' ? document.querySelector(destino) : destino;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: el.id === 'portada' ? 0 : -8, duration: 1.4 });
    else el.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' });
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      cerrarMenu();
      irA(el);
      if (id !== '#portada') { el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); }
      history.replaceState(null, '', id);
    });
  });

  // ---------- Char-reveal palabra a palabra ----------
  function partir(el) {
    if (el.dataset.partido) return;
    el.dataset.partido = '1';
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    var i = 0;
    var caminar = function (nodo) {
      Array.prototype.slice.call(nodo.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var trozos = n.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          trozos.forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
            var p = document.createElement('span'); p.className = 'palabra'; p.setAttribute('aria-hidden', 'true');
            var d = document.createElement('span'); d.className = 'palabra-in'; d.style.setProperty('--i', i++);
            if (el.classList.contains('portada-titulo')) {
              t.split('').forEach(function (c) { var l = document.createElement('span'); l.className = 'letra'; l.textContent = c; d.appendChild(l); });
            } else d.textContent = t;
            p.appendChild(d); frag.appendChild(p);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) caminar(n);
      });
    };
    caminar(el);
  }
  var titulares = $$('[data-revelar]');
  titulares.forEach(partir);
  var ioRevelar = new IntersectionObserver(function (ents) {
    ents.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('es-revelado'); ioRevelar.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px' });
  titulares.forEach(function (t) { if (!t.classList.contains('portada-titulo')) ioRevelar.observe(t); });
  var tituloPortada = $('.portada-titulo');
  function revelarPortada() { tituloPortada.classList.add('es-revelado'); }

  // ---------- Cortina «Boleado» (retirada garantizada) ----------
  var cortina = $('#cortina');
  var cortinaFuera = false;
  function quitarCortina() {
    if (cortinaFuera) return;
    cortinaFuera = true;
    cortina.hidden = true;
    revelarPortada();
  }
  setTimeout(quitarCortina, 5000); // red de seguridad, pase lo que pase
  if (!motion) {
    quitarCortina();
  } else if (!gsapReady) {
    setTimeout(function () { cortina.classList.add('es-saliendo'); revelarPortada(); }, 350);
    setTimeout(quitarCortina, 1000);
  } else {
    var hueco = $('#cortina-hueco');
    var aspecto = function () { return window.innerWidth / window.innerHeight; };
    var r = { v: 0 };
    var pintarHueco = function () { hueco.setAttribute('rx', r.v); hueco.setAttribute('ry', r.v * aspecto()); };
    var tl = gsap.timeline({ defaults: { ease: 'expo.inOut' }, onComplete: quitarCortina });
    tl.fromTo('.cortina-logo', { scale: 0.4, rotate: -40, y: 30 }, { scale: 1, rotate: 0, y: 0, duration: 0.8, ease: 'expo.out', immediateRender: false })
      .fromTo('.cortina-nombre', { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out', immediateRender: false }, '<0.15')
      .fromTo('#cortina-rizo-trazo', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.85, autoRound: false, immediateRender: false }, '<0.1')
      .to('.cortina-marca', { scale: 1.25, autoAlpha: 0, duration: 0.7, ease: 'expo.in' }, '+=0.05')
      .to('.cortina-rizo', { scale: 4.2, autoAlpha: 0, duration: 1.0 }, '<0.1')
      .to(r, { v: 74, duration: 1.4, onUpdate: pintarHueco }, '<') // 74 ya despeja las esquinas: el gesto entero se ve
      .call(revelarPortada, null, '<0.45');
  }

  // ---------- Cabecera ----------
  var cabecera = $('#cabecera');
  function alScroll() { cabecera.classList.toggle('es-con-borde', window.scrollY > 10); }
  window.addEventListener('scroll', alScroll, { passive: true }); alScroll();

  // ---------- Menú móvil ----------
  var menuBoton = $('#menu-boton'), menu = $('#menu');
  function cerrarMenu() {
    if (!menu.classList.contains('es-abierto')) return;
    menu.classList.remove('es-abierto'); menuBoton.setAttribute('aria-expanded', 'false');
    if (lenis) lenis.start();
  }
  menuBoton.addEventListener('click', function () {
    var abrir = menuBoton.getAttribute('aria-expanded') !== 'true';
    menuBoton.setAttribute('aria-expanded', String(abrir));
    menu.classList.toggle('es-abierto', abrir);
    if (lenis) { abrir ? lenis.stop() : lenis.start(); }
    if (abrir) { var a = $('a', menu); setTimeout(function () { a.focus(); }, 50); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('es-abierto')) { cerrarMenu(); menuBoton.focus(); } });

  // ---------- Portada: la bola en WebGL ----------
  var SABORES = [
    { nombre: 'Figo e mel', base: '#EFD9C2', veta: '#8C3B5E' },
    { nombre: 'Amora silvestre', base: '#7A3466', veta: '#E9B6CF' },
    { nombre: 'Salseiro', base: '#E8C79A', veta: '#9C4E1E' },
    { nombre: 'Pistacho tostado', base: '#C4C78E', veta: '#6F7D33' },
    { nombre: 'Leite de Valmiñor', base: '#FAF4E6', veta: '#E3CDA6' },
    { nombre: 'Chocolate 70 %', base: '#4A2A22', veta: '#C99B6E' }
  ];
  var hex = function (h) { return [parseInt(h.substr(1, 2), 16) / 255, parseInt(h.substr(3, 2), 16) / 255, parseInt(h.substr(5, 2), 16) / 255]; };
  var saborActual = 0;
  var colorBase = hex(SABORES[0].base), colorVeta = hex(SABORES[0].veta);
  var palaBoton = $('#pala-sabor');
  function cambiarSabor() {
    saborActual = (saborActual + 1) % SABORES.length;
    var s = SABORES[saborActual];
    palaBoton.textContent = s.nombre;
    $('#poster-base').setAttribute('fill', s.base);
    $$('.poster-veta').forEach(function (p) { p.setAttribute('stroke', s.veta); });
    bola.objetivo(hex(s.base), hex(s.veta));
  }
  palaBoton.addEventListener('click', cambiarSabor);

  var bola = (function () {
    var lienzo = $('#portada-lienzo'), canvas = $('#portada-canvas');
    var gl = null, ext = null;
    try { gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'low-power' }); } catch (e) {}
    if (gl) ext = gl.getExtension('OES_standard_derivatives');
    var nulo = { objetivo: function () {} };
    if (!gl || !ext) return nulo;

    var VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
    var FS = [
      '#extension GL_OES_standard_derivatives : enable',
      'precision highp float;',
      'uniform vec2 uRes;uniform float uTime,uScroll,uStir;uniform vec3 uBase,uVeta;uniform vec2 uPtr;uniform vec3 uTrail[24];',
      'float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
      'float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}',
      'float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<4;i++){v+=a*noise(p);p=m*p;a*=.5;}return v;}',
      'void main(){',
      ' vec2 uv=gl_FragCoord.xy/uRes;vec2 p=uv*2.-1.;p.x*=uRes.x/uRes.y;',
      // remolino alrededor del puntero: la espátula arrastra la crema
      ' vec2 d0=p-uPtr;float fall=exp(-dot(d0,d0)*5.);float an=uStir*fall;float c=cos(an),s=sin(an);vec2 ps=uPtr+mat2(c,-s,s,c)*d0;',
      ' float t=uTime*.035+uScroll*.9;vec2 q=ps*1.35;',
      ' vec2 w=vec2(fbm(q+vec2(0.,t)),fbm(q+vec2(5.2,1.3)-t));',
      ' float h=fbm(q*1.3+1.7*w);',
      ' float vt=fbm(q*.8+2.4*w+vec2(7.1,2.3)+t*.5);',
      ' float veta=smoothstep(.47,.5,vt)-smoothstep(.58,.61,vt);',
      // peinado de espátula: crestas paralelas que siguen la masa
      ' float dir=ps.x*.7+ps.y*.7+.9*w.x;h+=.05*sin(dir*24.)*smoothstep(.3,.75,w.y);',
      // surcos del rastro, con su reborde
      ' for(int i=0;i<24;i++){vec3 tr=uTrail[i];if(tr.z>.001){vec2 dd=ps-tr.xy;float r2=dot(dd,dd);h-=.2*tr.z*exp(-r2*420.);h+=.08*tr.z*exp(-r2*120.);}}',
      ' h+=veta*.04;',
      ' float k=uRes.y*.75;vec3 n=normalize(vec3(-dFdx(h)*k,-dFdy(h)*k,1.));',
      ' n=normalize(n+vec3(p*.38,0.));',
      ' vec3 L=normalize(vec3(-.45,.6,.75));float dif=.7+.3*dot(n,L);',
      ' vec3 R=reflect(-L,n);float spec=pow(max(R.z,0.),26.)*.3;',
      ' vec3 col=mix(uBase,uVeta,veta);',
      ' col*=dif;col+=spec*vec3(1.,.98,.95);',
      ' col=mix(col,col*vec3(.9,.84,.84),clamp(.25-h*.5,0.,.25));',
      ' float r=length(uv*2.-1.);col*=1.-smoothstep(.72,1.02,r)*.24;',
      ' gl_FragColor=vec4(col,1.);',
      '}'
    ].join('\n');

    function sombreador(tipo, src) {
      var s = gl.createShader(tipo); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
      return s;
    }
    var vs = sombreador(gl.VERTEX_SHADER, VS), fs = sombreador(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return nulo;
    var prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return nulo;
    gl.useProgram(prog);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var aLoc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(aLoc); gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);
    var U = {};
    ['uRes', 'uTime', 'uScroll', 'uStir', 'uBase', 'uVeta', 'uPtr', 'uTrail'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });

    var rastro = new Float32Array(72), cab = 0;
    var ptr = { x: 5, y: 5, ultimo: -1e4 };
    var stir = 0, base = colorBase.slice(), veta = colorVeta.slice(), objBase = base.slice(), objVeta = veta.slice();
    var visible = true, corriendo = false, t0 = performance.now(), anterior = t0;

    // Calidad adaptativa: si los fotogramas tardan, se baja la resolución interna
    // (la crema es suave y aguanta el reescalado mucho mejor que un tirón).
    var calidad = 1, tiempos = [], aDemanda = false;
    function medir() {
      var r = lienzo.getBoundingClientRect();
      var esc = Math.min(window.devicePixelRatio || 1, 1.5) * 0.7 * calidad;
      var w = Math.max(64, Math.min(760, Math.round(r.width * esc))), h = Math.max(64, Math.min(760, Math.round(r.height * esc)));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); return true; }
    }
    // Redimensionar borra el búfer: se repinta en el acto para que no asome un fotograma negro.
    new ResizeObserver(function () { if (medir()) pintar(performance.now()); }).observe(lienzo);
    medir();

    function anadir(x, y) {
      var u = cab * 3, ult = ((cab + 23) % 24) * 3;
      var dx = x - rastro[ult], dy = y - rastro[ult + 1];
      if (rastro[ult + 2] > 0.05 && dx * dx + dy * dy < 0.0012) return;
      rastro[u] = x; rastro[u + 1] = y; rastro[u + 2] = 1; cab = (cab + 1) % 24;
    }
    function aLienzo(e) {
      var r = lienzo.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width) * 2 - 1, y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      return { x: x * (r.width / r.height), y: y };
    }
    var bajada = null;
    lienzo.addEventListener('pointermove', function (e) {
      var p = aLienzo(e);
      var v = Math.hypot(p.x - ptr.x, p.y - ptr.y);
      ptr.x = p.x; ptr.y = p.y; ptr.ultimo = performance.now();
      stir = clamp(stir + v * 3.2, -1.6, 1.6);
      anadir(p.x, p.y);
      if (!corriendo) pintar(performance.now());
    });
    lienzo.addEventListener('pointerdown', function (e) { bajada = aLienzo(e); });
    lienzo.addEventListener('pointerup', function (e) {
      var p = aLienzo(e);
      if (bajada && Math.hypot(p.x - bajada.x, p.y - bajada.y) < 0.04) cambiarSabor();
      bajada = null;
    });

    function pintar(ahora) {
      var dt = Math.min(0.05, (ahora - anterior) / 1000); anterior = ahora;
      // espátula fantasma: si nadie toca la bola en 2,5 s, se remueve sola
      if (ahora - ptr.ultimo > 2500 && motion) {
        var tt = (ahora - t0) / 1000;
        var gx = 0.62 * Math.sin(tt * 0.55), gy = 0.42 * Math.sin(tt * 0.9 + 1);
        stir = clamp(stir + Math.hypot(gx - ptr.x, gy - ptr.y) * 1.2, -1.2, 1.2);
        ptr.x = gx; ptr.y = gy; anadir(gx, gy);
      }
      for (var i = 0; i < 24; i++) rastro[i * 3 + 2] = Math.max(0, rastro[i * 3 + 2] - dt / 4);
      stir *= Math.pow(0.12, dt);
      for (var c = 0; c < 3; c++) { base[c] = lerp(base[c], objBase[c], 1 - Math.pow(0.02, dt)); veta[c] = lerp(veta[c], objVeta[c], 1 - Math.pow(0.02, dt)); }
      gl.uniform2f(U.uRes, canvas.width, canvas.height);
      gl.uniform1f(U.uTime, (ahora - t0) / 1000);
      gl.uniform1f(U.uScroll, window.scrollY / window.innerHeight);
      gl.uniform1f(U.uStir, stir);
      gl.uniform3fv(U.uBase, base); gl.uniform3fv(U.uVeta, veta);
      gl.uniform2f(U.uPtr, ptr.x, ptr.y);
      gl.uniform3fv(U.uTrail, rastro);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function bucle(ahora) {
      if (!corriendo) return;
      pintar(ahora);
      tiempos.push(ahora - (bucle.ultimo || ahora)); bucle.ultimo = ahora;
      if (tiempos.length === 40) {
        tiempos.sort(function (a, b) { return a - b; });
        var mediana = tiempos[20];
        if (mediana > 26 && calidad > 0.4) { calidad = Math.max(0.4, calidad * 0.7); if (medir()) pintar(performance.now()); }
        // Último escalón: si ni a la resolución mínima va fluido, la bola deja de
        // moverse sola y solo se repinta cuando la tocas o haces scroll.
        else if (mediana > 40) { aDemanda = true; parar(); }
        tiempos = [];
      }
      requestAnimationFrame(bucle);
    }
    function arrancar() { if (aDemanda || corriendo || !motion || !visible || document.hidden) return; corriendo = true; anterior = performance.now(); bucle.ultimo = 0; tiempos = []; requestAnimationFrame(bucle); }
    function parar() { corriendo = false; }
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; visible ? arrancar() : parar(); }).observe(lienzo);
    document.addEventListener('visibilitychange', function () { document.hidden ? parar() : arrancar(); });
    var pedidoScroll = 0;
    window.addEventListener('scroll', function () {
      if (corriendo || !visible || pedidoScroll) return;
      pedidoScroll = requestAnimationFrame(function () { pedidoScroll = 0; pintar(performance.now()); });
    }, { passive: true });
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); parar(); lienzo.classList.remove('es-webgl'); });

    // fotograma inicial: con movimiento reducido es el único, con un surco ya hecho
    for (var k = 0; k < 14; k++) anadir(-0.7 + k * 0.1, 0.25 * Math.sin(k * 0.6));
    for (var j = 0; j < cab; j++) rastro[j * 3 + 2] = 0.35 + 0.65 * (j / cab);
    pintar(performance.now());
    lienzo.classList.add('es-webgl');
    arrancar();
    reduce.addEventListener && reduce.addEventListener('change', function () { motion = !reduce.matches; motion ? arrancar() : parar(); });

    return { objetivo: function (b, v) { objBase = b; objVeta = v; if (!corriendo) { base = b.slice(); veta = v.slice(); pintar(performance.now()); } } };
  })();

  // Anillo de texto alrededor de la bola: gira con el scroll
  var anillo = $('#portada-anillo');
  if (motion && anillo) {
    var giro = 0;
    window.addEventListener('scroll', function () {
      if (giro) return;
      giro = requestAnimationFrame(function () { giro = 0; anillo.style.transform = 'rotate(' + (window.scrollY * 0.06) + 'deg)'; });
    }, { passive: true });
  }

  // ---------- Peso variable ligado al cursor (titular y manifiesto) ----------
  var frase = $('#manifiesto-frase');
  (function partirFrase() {
    var caminar = function (nodo) {
      Array.prototype.slice.call(nodo.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
            var s = document.createElement('span'); s.className = 'mpal'; s.textContent = t; frag.appendChild(s);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) caminar(n);
      });
    };
    caminar(frase);
  })();
  if (motion) {
    var palabrasM = $$('.mpal', frase), letras = $$('.portada-titulo .letra');
    var ultimoPuntero = -1e4, mx = -1e4, my = -1e4, pendiente = 0;
    var pesar = function () {
      pendiente = 0;
      var ahora = performance.now();
      if (ahora - ultimoPuntero < 1500) {
        letras.concat(palabrasM).forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.bottom < -50 || r.top > window.innerHeight + 50) return;
          var d = Math.hypot(r.left + r.width / 2 - mx, r.top + r.height / 2 - my);
          var esLetra = el.classList.contains('letra');
          el.style.setProperty('--w', Math.round((esLetra ? 500 : 420) + (esLetra ? 400 : 430) * Math.exp(-(d * d) / (esLetra ? 16000 : 30000))));
        });
      } else {
        // sin cursor (táctil): una ola de peso recorre la frase con el scroll
        var r = frase.getBoundingClientRect();
        var prog = clamp((window.innerHeight - r.top) / (window.innerHeight + r.height), 0, 1);
        var n = palabrasM.length;
        palabrasM.forEach(function (el, i) { el.style.setProperty('--w', Math.round(420 + 420 * Math.exp(-Math.pow((i / n - (prog * 1.4 - 0.2)) * 7, 2)))); });
      }
    };
    var pedir = function () { if (!pendiente) pendiente = requestAnimationFrame(pesar); };
    window.addEventListener('pointermove', function (e) { if (e.pointerType !== 'mouse') return; ultimoPuntero = performance.now(); mx = e.clientX; my = e.clientY; pedir(); }, { passive: true });
    window.addEventListener('scroll', pedir, { passive: true });
  }

  // ---------- Contadores ----------
  var ioContar = new IntersectionObserver(function (ents) {
    ents.forEach(function (e) {
      if (!e.isIntersecting) return;
      ioContar.unobserve(e.target);
      var el = e.target, hasta = +el.dataset.hasta;
      if (!motion) { el.textContent = hasta; return; }
      var t0 = performance.now();
      (function paso(t) {
        var k = clamp((t - t0) / 1400, 0, 1), ease = 1 - Math.pow(1 - k, 4);
        el.textContent = Math.round(hasta * ease);
        if (k < 1) requestAnimationFrame(paso);
      })(t0);
    });
  }, { threshold: 0.6 });
  $$('.contador').forEach(function (c) { if (motion) c.textContent = '0'; ioContar.observe(c); });

  // ---------- Bordes de nata que se alisan ----------
  function caminoNata(amp, fase) {
    var d = 'M0 80V', N = 40;
    for (var i = 0; i <= N; i++) {
      var x = i / N * 1000;
      var y = 64 - (amp * 46 + 8) * (0.55 * Math.sin(i / N * Math.PI * 3 + fase) + 0.45 * Math.sin(i / N * Math.PI * 7.3 + fase * 1.7)) * 0.5 - amp * 18;
      d += (i === 0 ? '' : 'L' + x.toFixed(1) + ' ') + y.toFixed(1);
    }
    return d + 'V80z';
  }
  if (gsapReady && motion) {
    $$('.borde-nata').forEach(function (sec) {
      var path = $('.borde-nata-svg path', sec);
      if (!path) return;
      path.setAttribute('d', caminoNata(1, 0));
      ScrollTrigger.create({
        trigger: sec, start: 'top bottom', end: 'top 45%', scrub: 0.6,
        onUpdate: function (st) { path.setAttribute('d', caminoNata(1 - st.progress, st.progress * 2.2)); }
      });
    });
  }

  // ---------- Vitrina: filtro de alérgenos ----------
  var cubetas = $$('.cubeta');
  cubetas.forEach(function (c) { c.style.setProperty('--pct', c.dataset.pct); });
  var sinActivos = [];
  var cuenta = $('#filtro-cuenta');
  var NOMBRES = { leche: 'leche', huevo: 'huevo', cascara: 'frutos de cáscara', gluten: 'gluten', soja: 'soja' };
  $$('.chip').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.dataset.sin, on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
      sinActivos = on ? sinActivos.concat(k) : sinActivos.filter(function (x) { return x !== k; });
      var aptos = 0;
      cubetas.forEach(function (c) {
        var al = (c.dataset.alergenos || '').split(' ');
        var no = sinActivos.some(function (s) { return al.indexOf(s) > -1; });
        c.classList.toggle('es-no-apto', no);
        if (!no) aptos++;
      });
      cuenta.textContent = sinActivos.length
        ? aptos + ' de 14 sabores aptos sin ' + sinActivos.map(function (s) { return NOMBRES[s]; }).join(' ni ') + '.'
        : 'Los 14 sabores, sin filtro.';
    });
  });

  // ---------- Obrador: un día de oficio, anclado ----------
  var pasos = $$('.paso');
  var CLAVES = pasos.map(function (p, i) {
    return { t: +p.dataset.t, a: +p.dataset.a, h: +p.dataset.h, nivel: [0.5, 0.5, 0.5, 0.7, 0.7, 0.66][i], crema: [[251, 250, 246], [250, 244, 226], [250, 242, 222], [246, 230, 205], [244, 228, 206], [239, 217, 194]][i] };
  });
  var obT = $('#ob-temp'), obA = $('#ob-aire'), obH = $('#ob-horas');
  var mezcla = $('#ob-mezcla'), superficie = $('#ob-superficie'), burbujas = $('#ob-burbujas'), escarcha = $('#ob-escarcha'), vapor = $('#ob-vapor'), pala = $('#ob-pala'), termo = $('#ob-termo-nivel'), barra = $('#obrador-barra');
  var anguloPala = 0, pasoActivo = -1;
  function pintarObrador(p, dt) {
    var f = clamp(p, 0, 1) * (CLAVES.length - 1), i = Math.min(CLAVES.length - 2, Math.floor(f)), k = f - i;
    var a = CLAVES[i], b = CLAVES[i + 1];
    var e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; // las cifras se asientan en cada paso
    var t = lerp(a.t, b.t, e), aire = lerp(a.a, b.a, e), h = lerp(a.h, b.h, e), nivel = lerp(a.nivel, b.nivel, e);
    obT.textContent = (t < 0 ? '−' : '') + Math.abs(Math.round(t));
    obA.textContent = Math.round(aire);
    var hh = Math.floor(h), mm = Math.round((h - hh) * 60); if (mm === 60) { hh++; mm = 0; }
    obH.textContent = hh + ' h ' + (mm < 10 ? '0' : '') + mm;
    var y = 448 - nivel * 352;
    mezcla.setAttribute('y', y.toFixed(1)); mezcla.setAttribute('height', (460 - y).toFixed(1));
    superficie.setAttribute('transform', 'translate(0 ' + (y - 250).toFixed(1) + ')');
    var col = a.crema.map(function (c, j) { return Math.round(lerp(c, b.crema[j], e)); });
    var rgb = 'rgb(' + col.join(',') + ')';
    mezcla.setAttribute('fill', rgb); superficie.setAttribute('fill', rgb);
    burbujas.setAttribute('opacity', (aire / 32).toFixed(2));
    escarcha.setAttribute('opacity', clamp(-t / 30, 0, 1).toFixed(2));
    vapor.setAttribute('opacity', clamp((t - 30) / 55, 0, 1).toFixed(2));
    var giro = clamp(1 - Math.abs(f - 3) * 1.6, 0, 1); // la pala gira alrededor del paso 4
    anguloPala += (dt || 0) * 9 * giro;
    pala.setAttribute('transform', 'translate(210 0) scale(' + Math.cos(anguloPala).toFixed(3) + ' 1) translate(-210 0)');
    var ty = 440 - (clamp(t, -35, 85) + 35) / 120 * 336;
    termo.setAttribute('y', ty.toFixed(1)); termo.setAttribute('height', (446 - ty).toFixed(1));
    if (barra) barra.parentNode.style.setProperty('--p', p.toFixed(3));
    var act = Math.round(f);
    if (act !== pasoActivo) {
      pasoActivo = act;
      pasos.forEach(function (ps, j) { ps.classList.toggle('es-paso-activo', j === act); ps.classList.toggle('es-paso-pasado', j < act); ps.setAttribute('aria-current', j === act ? 'step' : 'false'); });
    }
  }
  if (gsapReady && motion) {
    raiz.classList.add('ob-anclado');
    var objetivoOb = 0, actualOb = 0;
    ScrollTrigger.create({
      trigger: '#obrador-pin', start: 'top top', end: function () { return '+=' + Math.round(window.innerHeight * 4.2); },
      pin: true, anticipatePin: 1,
      onUpdate: function (st) { objetivoOb = st.progress; }
    });
    gsap.ticker.add(function (t, dtms) {
      var dt = dtms / 1000;
      var antes = actualOb;
      actualOb = lerp(actualOb, objetivoOb, 1 - Math.pow(0.0008, dt));
      if (Math.abs(actualOb - antes) > 1e-5 || Math.abs(objetivoOb - 0.6) < 0.2) pintarObrador(actualOb, dt);
    });
    pintarObrador(0, 0);
  } else {
    // Sin anclaje: el paso que tienes delante manda en las cifras (también con movimiento reducido).
    pintarObrador(1, 0);
    var ioPaso = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) { if (e.isIntersecting) pintarObrador(pasos.indexOf(e.target) / (pasos.length - 1), 0); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    pasos.forEach(function (p) { ioPaso.observe(p); });
  }

  // ---------- Calendario de fruta ----------
  var hoy = new Date(), mes = hoy.getMonth();
  var cal = $('.cal');
  var thMes = $('.cal thead th[data-mes="' + mes + '"]');
  if (thMes) { thMes.classList.add('es-mes-actual'); thMes.setAttribute('aria-current', 'date'); }
  $$('.cal td').forEach(function (td) { td.style.setProperty('--mes', mes); });
  $$('.cal-banda').forEach(function (b, i) { b.style.setProperty('--i', i); });
  var calPie = $('#cal-pie');
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var enTemporada = $$('.cal tbody tr').filter(function (tr) {
    var b = $('.cal-banda', tr); var de = +b.style.getPropertyValue('--de'), a = +b.style.getPropertyValue('--a');
    return mes + 1 >= de && mes + 1 <= a;
  }).map(function (tr) { return $('th', tr).textContent.toLowerCase(); });
  if (enTemporada.length) calPie.textContent = 'En ' + MESES[mes] + ' entra en la vitrina: ' + enTemporada.join(', ') + '. En enero cerramos la vitrina; el obrador sigue con las tartas de encargo.';

  // Contenedores que desbordan: focusables solo cuando desbordan de verdad.
  function revisarDesborde() {
    $$('.cal-marco').forEach(function (m) {
      if (m.scrollWidth > m.clientWidth + 1) m.setAttribute('tabindex', '0'); else m.removeAttribute('tabindex');
    });
  }
  revisarDesborde();
  window.addEventListener('resize', revisarDesborde);

  // ---------- Apariciones (una sola vez: IntersectionObserver) ----------
  var ioVer = new IntersectionObserver(function (ents) {
    ents.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('es-visible'); ioVer.unobserve(e.target); } });
  }, { threshold: 0.25 });
  [cal, $('#tallas')].forEach(function (el) { if (el) ioVer.observe(el); });

  // ---------- Precio por litro (dato de la versión sobria) ----------
  (function () {
    var lista = $('#litro-barras');
    var filas = $$('.talla').map(function (t) {
      var ml = +t.dataset.ml, pr = +t.dataset.precio;
      return { nombre: $('h3', t).textContent, eurL: pr / ml * 1000 };
    });
    var max = Math.max.apply(null, filas.map(function (f) { return f.eurL; }));
    filas.forEach(function (f) {
      var li = document.createElement('li');
      li.innerHTML = '<span></span><span class="barra" aria-hidden="true"></span><span class="eur"></span>';
      li.children[0].textContent = f.nombre;
      li.children[1].style.setProperty('--r', (f.eurL / max).toFixed(3));
      li.children[2].textContent = f.eurL.toFixed(2).replace('.', ',') + ' €/L';
      lista.appendChild(li);
    });
  })();

  // ---------- Cinta con la velocidad ligada al scroll ----------
  (function () {
    var pista = $('#cinta-pista');
    if (!pista) return;
    pista.innerHTML += pista.innerHTML; // segunda copia para el bucle
    if (!motion) return;
    var x = 0, ancho = 0, vel = 0, ultY = window.scrollY, vis = false, anterior = performance.now();
    var medirC = function () { ancho = pista.scrollWidth / 2; };
    medirC(); window.addEventListener('resize', medirC);
    document.fonts && document.fonts.ready.then(medirC);
    new IntersectionObserver(function (e) { vis = e[0].isIntersecting; if (vis) { anterior = performance.now(); requestAnimationFrame(mover); } }).observe(pista);
    function mover(t) {
      if (!vis) return;
      var dt = Math.min(0.05, (t - anterior) / 1000); anterior = t;
      var dy = window.scrollY - ultY; ultY = window.scrollY;
      vel = lerp(vel, dy / Math.max(dt, 0.001), 0.08);
      x -= (50 + Math.abs(vel) * 0.35) * dt * (vel < -5 ? -1 : 1);
      if (x <= -ancho) x += ancho; if (x > 0) x -= ancho;
      pista.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
      requestAnimationFrame(mover);
    }
  })();

  // ---------- Pila sticky de tartas ----------
  var pila = $('#pila'), itemsPila = $$('.pila-item');
  function medirPila() {
    pila.style.setProperty('--alto-tarta', 'auto');
    var alto = 0;
    itemsPila.forEach(function (li, i) { li.style.setProperty('--n', i); alto = Math.max(alto, li.offsetHeight); });
    pila.style.setProperty('--alto-tarta', alto + 'px');
  }
  medirPila();
  new ResizeObserver(function () { medirPila(); }).observe(pila.parentNode);
  document.fonts && document.fonts.ready.then(medirPila);
  var pendientePila = 0;
  window.addEventListener('scroll', function () {
    if (pendientePila) return;
    pendientePila = requestAnimationFrame(function () {
      pendientePila = 0;
      itemsPila.forEach(function (li, i) {
        var sig = itemsPila[i + 1];
        var tapada = !!sig && sig.getBoundingClientRect().top - li.getBoundingClientRect().top < li.offsetHeight * 0.5;
        li.classList.toggle('es-tapada', tapada);
      });
    });
  }, { passive: true });

  // ---------- Horario en vivo (siempre: no es movimiento, es dato) ----------
  // Minutos desde las 00:00; un cierre por encima de 1440 es pasada la medianoche.
  var HORARIO = {
    verano: { 0: [[720, 1470]], 1: [[720, 1470]], 2: [[720, 1470]], 3: [[720, 1470]], 4: [[720, 1470]], 5: [[720, 1500]], 6: [[720, 1500]] },
    invierno: { 0: [[720, 870], [990, 1260]], 1: [], 2: [[990, 1230]], 3: [[990, 1230]], 4: [[990, 1230]], 5: [[990, 1290]], 6: [[720, 870], [990, 1290]] }
  };
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  function temporadaDe(f) {
    var m = f.getMonth() + 1, d = f.getDate();
    if ((m === 6 && d >= 15) || m === 7 || m === 8 || (m === 9 && d <= 15)) return 'verano';
    return 'invierno';
  }
  var hm = function (min) { min = min % 1440; var h = Math.floor(min / 60), m = min % 60; return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; };
  function pintarHorario() {
    var ahora = new Date();
    var temp = temporadaDe(ahora), dia = ahora.getDay(), min = ahora.getHours() * 60 + ahora.getMinutes();
    $$('.temporada').forEach(function (t) { t.classList.toggle('es-temporada-activa', t.dataset.temporada === temp); });
    $$('.hor tr').forEach(function (tr) { tr.classList.remove('es-hoy'); });
    var fila = $('#temp-' + temp + ' tr[data-dia="' + dia + '"]'); if (fila) fila.classList.add('es-hoy');
    var estado = $('#estado-ahora'), texto = $('#estado-texto');
    var enEnero = ahora.getMonth() === 0;
    var abierto = null;
    if (!enEnero) {
      (HORARIO[temp][dia] || []).forEach(function (r) { if (min >= r[0] && min < r[1]) abierto = r; });
      var ayer = new Date(ahora.getTime() - 864e5);
      (HORARIO[temporadaDe(ayer)][ayer.getDay()] || []).forEach(function (r) { if (r[1] > 1440 && min < r[1] - 1440) abierto = r; });
    }
    estado.classList.toggle('es-abierto', !!abierto);
    if (enEnero) { texto.textContent = 'Enero: vitrina cerrada. Los encargos de tartas, sí.'; return; }
    if (abierto) { texto.textContent = 'Abierto ahora · cerramos a las ' + hm(abierto[1]); return; }
    for (var i = 0; i < 8; i++) {
      var f = new Date(ahora.getTime() + i * 864e5);
      if (f.getMonth() === 0) continue;
      var rs = HORARIO[temporadaDe(f)][f.getDay()] || [];
      for (var j = 0; j < rs.length; j++) {
        if (i === 0 && rs[j][0] <= min) continue;
        texto.textContent = 'Cerrado ahora · abrimos ' + (i === 0 ? 'hoy' : i === 1 ? 'mañana' : 'el ' + DIAS[f.getDay()]) + ' a las ' + hm(rs[j][0]);
        return;
      }
    }
  }
  pintarHorario();
  setInterval(pintarHorario, 60000);

  // ---------- Mapa bajo clic ----------
  $('#mapa-boton').addEventListener('click', function () {
    var mapa = $('#mapa');
    var f = document.createElement('iframe');
    f.src = 'https://www.google.com/maps?q=Baiona,+Pontevedra&output=embed';
    f.title = 'Mapa de Baiona con la zona del puerto';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    mapa.appendChild(f);
    this.hidden = true; $('.mapa-aviso', mapa).hidden = true;
    f.focus();
  });

  // ---------- Formulario de encargo (muestra) ----------
  var form = $('#encargo'), fecha = $('#f-fecha');
  var minimo = new Date(); minimo.setDate(minimo.getDate() + 2);
  var iso = function (d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  fecha.min = iso(minimo);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var malos = [];
    ['#f-nombre', '#f-tel', '#f-fecha'].forEach(function (s) {
      var c = $(s, form);
      var ok = c.value.trim() !== '' && c.checkValidity() && !(s === '#f-fecha' && c.value < c.min);
      c.classList.toggle('es-error', !ok); c.setAttribute('aria-invalid', String(!ok));
      if (!ok) malos.push(c);
    });
    var estado = $('#encargo-estado');
    if (malos.length) {
      estado.classList.remove('es-ok');
      estado.textContent = 'Revisa ' + malos.map(function (c) { return $('label[for="' + c.id + '"]', form).textContent.toLowerCase(); }).join(', ') + '. La fecha, con 48 horas de aviso.';
      malos[0].focus();
      return;
    }
    var d = new Date(fecha.value + 'T12:00');
    estado.classList.add('es-ok');
    estado.textContent = 'Encargo de muestra anotado: ' + $('#f-tarta').value + ', ' + $('#f-rac').value.split(' ')[0] + ' raciones, para el ' + d.getDate() + ' de ' + MESES[d.getMonth()] + '. En esta demo no se envía nada.';
  });

  // ---------- Botones magnéticos ----------
  if (punteroFino && motion) {
    $$('.iman').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.setProperty('--bx', ((e.clientX - r.left - r.width / 2) * 0.28).toFixed(1) + 'px');
        b.style.setProperty('--by', ((e.clientY - r.top - r.height / 2) * 0.4).toFixed(1) + 'px');
      });
      b.addEventListener('pointerleave', function () { b.style.setProperty('--bx', '0px'); b.style.setProperty('--by', '0px'); });
    });
  }

  // ---------- Cursor propio (solo ratón) ----------
  (function () {
    var cur = $('#cursor'), punto = $('.cursor-punto', cur), aro = $('.cursor-aro', cur), rot = $('.cursor-rot', cur);
    var x = -100, y = -100, ax = -100, ay = -100, vivo = false;
    function bucle() {
      ax = lerp(ax, x, motion ? 0.2 : 1); ay = lerp(ay, y, motion ? 0.2 : 1);
      punto.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      aro.style.transform = 'translate3d(' + ax.toFixed(1) + 'px,' + ay.toFixed(1) + 'px,0)';
      if (vivo) requestAnimationFrame(bucle);
    }
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') { raiz.classList.remove('cursor-propio'); vivo = false; return; }
      x = e.clientX; y = e.clientY;
      if (!vivo) { vivo = true; ax = x; ay = y; raiz.classList.add('cursor-propio'); requestAnimationFrame(bucle); }
      var t = e.target;
      var enPala = !!t.closest('#portada-lienzo'), enMapa = !!t.closest('#mapa') && !t.closest('iframe');
      var enEnlace = !!t.closest('a, button, select, input, textarea, label');
      var oscuro = !!t.closest('.vitrina, .pie, .encargo, .menu.es-abierto, .cinta');
      cur.classList.toggle('es-pala', enPala);
      cur.classList.toggle('es-mapa', enMapa && !enEnlace);
      cur.classList.toggle('es-enlace', enEnlace && !enPala);
      cur.classList.toggle('es-oscuro', oscuro);
      rot.textContent = enPala ? 'remover' : (enMapa ? 'mapa' : '');
    }, { passive: true });
    document.addEventListener('pointerleave', function () { punto.style.transform = aro.style.transform = 'translate3d(-100px,-100px,0)'; });
    window.addEventListener('blur', function () { x = y = -100; });
  })();

  // ---------- Aviso de cookies ----------
  var cookies = $('#cookies');
  var cookiesCerrado = false;
  try { cookiesCerrado = localStorage.getItem('salseiro-cookies') === 'ok'; } catch (e) {}
  cookies.hidden = cookiesCerrado;
  $('#cookies-ok').addEventListener('click', function () {
    try { localStorage.setItem('salseiro-cookies', 'ok'); } catch (e) {}
    cookies.hidden = true; cookiesCerrado = true;
    if (typeof actualizarMando === 'function') actualizarMando();
  });

  // MANDO DE DEMOSTRACIÓN: inicio — NUNCA viaja al sitio de un cliente. Ver README.
  var mando = $('#mando');
  function actualizarMando() {
    if (!mando) return;
    // Se aparta mientras el aviso de cookies está en pantalla (en móvil ocupa todo el ancho).
    mando.hidden = !(raiz.classList.contains('es-revision') && cookiesCerrado);
  }
  function marcar(grupo, valor) { $$('[data-' + grupo + ']', mando).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset[grupo] === valor)); }); }
  if (mando) {
    marcar('maqueta', raiz.classList.contains('maq-sobria') ? 'sobria' : 'cargada');
    marcar('paleta', raiz.classList.contains('pal-pistacho') ? 'pistacho' : raiz.classList.contains('pal-arandano') ? 'arandano' : 'framboesa');
    $$('[data-maqueta]', mando).forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.dataset.maqueta;
        raiz.classList.toggle('maq-sobria', v === 'sobria');
        try { localStorage.setItem('salseiro-maqueta', v); } catch (e) {}
        marcar('maqueta', v);
        medirPila();
        if (gsapReady) ScrollTrigger.refresh();
      });
    });
    $$('[data-paleta]', mando).forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.dataset.paleta;
        raiz.classList.remove('pal-pistacho', 'pal-arandano');
        if (v !== 'framboesa') raiz.classList.add('pal-' + v);
        try { localStorage.setItem('salseiro-paleta', v); } catch (e) {}
        marcar('paleta', v);
      });
    });
    actualizarMando();
  }
  // MANDO DE DEMOSTRACIÓN: fin

  window.addEventListener('load', function () { if (gsapReady) ScrollTrigger.refresh(); medirPila(); });
})();
