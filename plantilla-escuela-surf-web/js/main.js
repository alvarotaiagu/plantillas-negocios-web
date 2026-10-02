/* Treboada · Escola de Surf — plantilla de demostración (negocio ficticio).
   Concepto «Mar de fondo». Un solo archivo, sin build.
   Banderas separadas (PLIEGO §5): `gsapReady` (hay GSAP + ScrollTrigger) y
   `motion` (el usuario no pide movimiento reducido). Los estados «vacíos»
   del CSS solo existen bajo html.has-motion, que exige las dos. */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const html = document.documentElement;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const fmt = (n, d = 0) => n.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d });

  const gsapReady = !!(window.gsap && window.ScrollTrigger);
  const motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const revision = html.classList.contains('es-revision');
  if (gsapReady) gsap.registerPlugin(ScrollTrigger);
  if (gsapReady && motion) html.classList.add('has-motion');
  html.classList.add('cortina-js');
  const sobria = () => html.classList.contains('maqueta-sobria');
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  /* ————————————————— Lenis: único motor de scroll ————————————————— */
  let lenis = null;
  if (window.Lenis && motion) {
    // lerp alto: con la galería horizontal scrubbeada, el asentamiento de Lenis
    // se lee como «el contenido va al revés» (PLIEGO §6).
    lenis = new Lenis({ lerp: 0.16, smoothWheel: true });
    if (gsapReady) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  const velocidad = () => (lenis ? lenis.velocity : 0);
  const cab = () => $('#cabecera').offsetHeight;
  function irA(destino) {
    const el = typeof destino === 'string' ? $(destino) : destino;
    if (typeof destino === 'number') {
      if (lenis) lenis.scrollTo(destino, { duration: 1.4 }); else scrollTo({ top: destino, behavior: motion ? 'smooth' : 'auto' });
      return;
    }
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: el.id === 'portada' ? 0 : 0, duration: 1.4 });
    else el.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' });
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2 || !$(id)) return;
    e.preventDefault();
    cerrarMenu();
    irA(id);
    const t = $(id); t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true });
  }));

  /* ————————————————— Cortina «resaca» ————————————————— */
  const cortina = $('#cortina');
  const olaCortina = $('#cortina-ola');
  let cortinaFuera = false;
  let cortinaSaliendo = !motion;   // mientras la espuma tapa la pantalla, el shader no pinta
  const arrancaPortada = [];
  function retirarCortina() {
    if (cortinaFuera) return;
    cortinaFuera = true; cortinaSaliendo = true;
    cortina.classList.add('es-fuera');
    cortina.style.display = 'none';
    arrancaPortada.forEach(f => f());
  }
  function bordeCortina(fase, amp) {
    let d = 'M0,0 L1440,0 L1440,40 ';
    for (let i = 24; i >= 0; i--) {
      const x = i * 60;
      const y = 40 + amp * Math.sin(x * 0.006 + fase) + amp * 0.45 * Math.sin(x * 0.013 - fase * 1.7);
      d += `L${x},${y.toFixed(1)} `;
    }
    olaCortina.setAttribute('d', d + 'Z');
  }
  // Seguro: pase lo que pase, a los 4,5 s la cortina no está.
  setTimeout(retirarCortina, 4500);
  if (!motion) {
    cortina.style.transition = 'opacity .35s linear';
    requestAnimationFrame(() => { cortina.style.opacity = '0'; });
    setTimeout(retirarCortina, 420);
  } else if (gsapReady) {
    const marca = $('.cortina-marca');
    const estado = { fase: 0, amp: 8 };
    const tl = gsap.timeline({ onComplete: retirarCortina, delay: 0.15 });
    tl.from(marca.children, { y: 26, opacity: 0, duration: 0.8, stagger: 0.09, ease: 'expo.out' })
      .to(estado, { fase: 9, duration: 2.3, ease: 'none', onUpdate: () => bordeCortina(estado.fase, estado.amp) }, 0)
      .to(estado, { amp: 34, duration: 1.1, ease: 'expo.inOut' }, 0.8)
      .to(marca, { y: -40, opacity: 0, duration: 0.6, ease: 'expo.in' }, 0.95)
      .add(() => { cortinaSaliendo = true; }, 0.95)
      .to(cortina, { yPercent: -100, y: -140, duration: 1.15, ease: 'expo.inOut' }, 1.05)
      .add(() => arrancaPortada.forEach(f => f()), 1.5);
  } else {
    // Sin GSAP: la misma retirada con una transición CSS.
    cortina.style.transition = 'transform 1.1s cubic-bezier(.87,0,.13,1)';
    setTimeout(() => { cortinaSaliendo = true; cortina.style.transform = 'translate3d(0, calc(-100% - 140px), 0)'; }, 700);
    cortina.addEventListener('transitionend', retirarCortina, { once: true });
    setTimeout(retirarCortina, 2200);
  }

  /* ————————————————— Char-reveal (IntersectionObserver, no once:true) ————————————————— */
  function partir(el) {
    let i = 0;
    const recorrer = nodo => {
      Array.from(nodo.childNodes).forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(trozo => {
            if (!trozo) return;
            if (/^\s+$/.test(trozo)) { frag.appendChild(document.createTextNode(' ')); return; }
            const p = document.createElement('span'); p.className = 'palabra';
            for (const ch of trozo) {
              const l = document.createElement('span'); l.className = 'letra'; l.textContent = ch;
              l.style.setProperty('--i', i++); p.appendChild(l);
            }
            frag.appendChild(p);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) recorrer(n);
      });
    };
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    recorrer(el);
    $$('.palabra', el).forEach(p => p.setAttribute('aria-hidden', 'true'));
  }
  $$('[data-reveal]').forEach(partir);
  const titulo = $('#portada-titulo');
  partir(titulo);
  const ioReveal = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('es-visible'); ioReveal.unobserve(e.target); }
  }), { rootMargin: '0px 0px -12% 0px' });
  $$('[data-reveal]').forEach(el => ioReveal.observe(el));

  /* ————————————————— Titular de portada: la ola pasa por las letras ————————————————— */
  const letrasTitulo = $$('.letra', titulo);
  // la cursiva de «antes» lleva su propia variación: se respeta
  $$('em .letra', titulo).forEach(l => l.classList.add('letra-em'));
  let raton = { x: -9999, y: -9999, dentro: false, ultimo: 0 };
  if (motion) {
    let t0 = null;
    let centros = [];
    const medirLetras = () => {
      const r = titulo.getBoundingClientRect();
      centros = letrasTitulo.map(l => { const b = l.getBoundingClientRect(); return { x: (b.left + b.width / 2 - r.left) / r.width, cx: b.left + b.width / 2, cy: b.top + b.height / 2 - r.top, em: l.classList.contains('letra-em') }; });
    };
    letrasTitulo.forEach(l => { l.style.opacity = '0'; });
    arrancaPortada.push(() => { if (t0 === null) { t0 = performance.now(); medirLetras(); } });
    addEventListener('resize', () => { if (t0 !== null) medirLetras(); });
    let visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(titulo);
    const base = 25;
    const bucle = now => {
      requestAnimationFrame(bucle);
      if (t0 === null || !visible) return;
      const t = (now - t0) / 1000;
      const rTop = raton.dentro ? titulo.getBoundingClientRect().top : 0;
      const sb = sobria();
      letrasTitulo.forEach((l, i) => {
        const c = centros[i] || { x: 0, cx: 0, cy: 0 };
        const p = clamp((t - i * 0.035) / 0.95, 0, 1);
        const e = 1 - Math.pow(1 - p, 4);
        // ola de mar de fondo: un pulso cada 6,5 s que cruza el titular
        let ola = sb ? 0 : Math.pow(Math.max(0, Math.sin(Math.PI * 2 * (c.x * 0.45 - t / 6.5))), 8) * 26;
        if (!sb && raton.dentro && finePointer) {
          const dx = raton.x - c.cx, dy = raton.y - (rTop + c.cy);
          ola += 30 * Math.exp(-(dx * dx + dy * dy * 0.3) / 26000);
        }
        const w = base + (1 - e) * 110 + ola;
        const peso = c.em ? 300 : 900 - (1 - e) * 500;
        if (Math.abs(w - (l._w || 0)) < 0.4 && e === 1 && l._e === 1) return;
        l._w = w; l._e = e;
        l.style.fontVariationSettings = `"wdth" ${w.toFixed(1)}, "wght" ${peso.toFixed(0)}, "opsz" 144${c.em ? ', "slnt" -10' : ''}`;
        l.style.opacity = e.toFixed(3);
        l.style.transform = e < 1 ? `translate3d(0, ${((1 - e) * 0.5).toFixed(3)}em, 0)` : '';
      });
    };
    requestAnimationFrame(bucle);
  }

  /* ————————————————— Hero WebGL: líneas de mar de fondo ————————————————— */
  const canvas = $('#mar');
  const mar = (() => {
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl || !gl.getExtension('OES_standard_derivatives')) return null;
    const vs = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
    const fs = `#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec3 uMouse; uniform float uScroll; uniform vec3 uAcento;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  float hz = 1.04 - uScroll * 0.2;
  float d = max(hz - uv.y, 0.002);
  float z = 1.0 / (d + 0.42);
  vec2 mar = vec2((uv.x - 0.5) * asp * z, z);
  vec2 p = vec2(uv.x * asp, uv.y);
  vec2 m = uMouse.xy / uRes.y;
  float dm = length((p - m) * vec2(1.0, 1.25));
  float bajo = uMouse.z * exp(-dm * dm / 0.016);
  vec2 isla = vec2(0.66 * asp, 0.62);
  vec2 q = (p - isla) * vec2(1.0, 1.7);
  float di = length(q);
  float ang = atan(q.y, q.x);
  float radio = 0.034 * mix(0.6, 1.0, clamp(asp, 0.0, 1.0)) * (1.0 + 0.2 * sin(3.0 * ang + 0.6) + 0.1 * sin(5.0 * ang + 2.0));
  // a sotavento de la isla (hacia la orilla) el mar de fondo llega doblado
  float estela = exp(-q.x * q.x / (0.012 + 0.03 * max(-q.y, 0.0))) * smoothstep(0.02, -0.25, q.y) * smoothstep(-0.9, -0.2, q.y);
  // fase del mar de fondo: avanza hacia la orilla; la costa la curva un poco
  float ph = z * 21.0 + 0.6 * sin(mar.x * 0.9 + 1.3);
  // refracción: sobre el bajo y junto a la isla la ola va más despacio y la línea se dobla
  ph += bajo * 2.6 + estela * 1.6 + exp(-di * di / 0.006) * 2.2;
  float t = uTime * 0.5;
  float f = fract(ph - t);
  float w = fwidth(ph);
  float dist = min(f, 1.0 - f);
  float linea = 1.0 - smoothstep(w * 0.55, w * 1.7, dist);
  float cara = exp(-f * 8.0) * 0.16;
  float niebla = smoothstep(0.0, 0.3, d);
  float densidad = 1.0 - smoothstep(0.16, 0.45, w);
  float serie = 0.5 + 0.5 * sin(mar.x * 0.8 - floor(ph - t) * 1.7 + t * 0.2);
  float intensidad = (linea * (0.45 + 0.55 * serie) + cara) * niebla * densidad;
  intensidad *= 1.0 + bajo * 1.6;
  intensidad *= smoothstep(radio, radio + 0.012, di);
  vec3 hondo = vec3(0.016, 0.043, 0.059);
  vec3 medio = vec3(0.043, 0.106, 0.133);
  vec3 col = mix(medio, hondo, smoothstep(0.05, 0.95, uv.y));
  vec3 cLinea = mix(uAcento, vec3(0.90, 0.94, 0.94), 0.25 + 0.55 * bajo);
  col = mix(col, cLinea, clamp(intensidad, 0.0, 1.0) * 0.8);
  // la isla: roca oscura con su anillo de espuma que respira
  float roca = smoothstep(radio, radio - 0.004, di);
  float anillo = (1.0 - smoothstep(0.0, 0.006, abs(di - radio - 0.008 - 0.004 * sin(uTime * 1.3 + ang * 2.0)))) * 0.5;
  col = mix(col, vec3(0.90, 0.94, 0.94), anillo * (1.0 - roca));
  col = mix(col, vec3(0.012, 0.03, 0.04), roca);
  // espuma de orilla abajo
  float orilla = smoothstep(0.16, 0.0, uv.y) * (0.5 + 0.5 * sin(uv.x * 40.0 + uTime * 1.2 + sin(uv.x * 9.0)));
  col += vec3(0.05, 0.08, 0.08) * orilla * 0.6;
  col += (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) * 0.022;
  gl_FragColor = vec4(col, 1.0);
}`;
    const sh = (tipo, src) => { const s = gl.createShader(tipo); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; } return s; };
    const v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return null;
    const prog = gl.createProgram(); gl.attachShader(prog, v); gl.attachShader(prog, f); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = n => gl.getUniformLocation(prog, n);
    const u = { res: U('uRes'), time: U('uTime'), mouse: U('uMouse'), scroll: U('uScroll'), acento: U('uAcento') };
    html.classList.add('webgl-si');
    return { gl, u };
  })();
  if (mar) {
    const { gl, u } = mar;
    // Resolución adaptativa: si el fotograma pasa de ~22 ms de media, el búfer baja
    // un 25 % (hasta un mínimo). Un móvil flojo, o una GPU por software, pinta menos
    // píxeles en vez de tartamudear. El escalado lo absorbe el propio dibujo de líneas.
    let factor = 1;
    const escala = () => Math.min(devicePixelRatio || 1, 1.5) * (innerWidth < 760 ? 0.6 : 0.75) * factor;
    let media = 16, cuenta = 0, previo = 0;
    const vigilar = now => {
      if (previo) { media = media * 0.8 + (now - previo) * 0.2; cuenta++; }
      previo = now;
      // suelo: en móvil el búfer ya parte de 0,6 y más abajo las líneas se pixelan
      const suelo = innerWidth < 760 ? 0.5 : 0.22;
      if (cuenta > 8 && media > 22 && factor > suelo) { factor = Math.max(suelo, factor * (media > 40 ? 0.55 : 0.75)); cuenta = 0; media = 16; ajustar(); html.dataset.marEscala = factor.toFixed(2); }
    };
    const ajustar = () => {
      const r = canvas.getBoundingClientRect(), k = escala();
      const w = Math.max(1, Math.round(r.width * k)), h = Math.max(1, Math.round(r.height * k));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
      pintar(performance.now());
    };
    // un búfer más pequeño que su caja se estira en bandas: se remide con ResizeObserver
    new ResizeObserver(ajustar).observe(canvas);
    const bajo = { x: 0, y: 0, z: 0, tx: 0, ty: 0, tz: 0 };
    let acento = [0.55, 0.88, 0.8];
    const leerAcento = () => {
      const c = getComputedStyle(html).getPropertyValue('--vidrio').trim();
      if (/^#[0-9a-f]{6}$/i.test(c)) acento = [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16) / 255);
    };
    leerAcento();
    html.addEventListener('paleta', () => { leerAcento(); pintar(performance.now()); });
    const portada = $('#portada');
    const mover = (x, y) => {
      const r = canvas.getBoundingClientRect(), k = canvas.width / r.width;
      bajo.tx = (x - r.left) * k; bajo.ty = (r.bottom - y) * k; bajo.tz = 1; raton.ultimo = performance.now();
    };
    portada.addEventListener('pointermove', e => { mover(e.clientX, e.clientY); raton.x = e.clientX; raton.y = e.clientY; raton.dentro = true; if (!motion) pintar(performance.now()); });
    portada.addEventListener('pointerleave', () => { raton.dentro = false; });
    let scrollHero = 0, t0 = performance.now();
    function pintar(now) {
      const t = motion ? (now - t0) / 1000 : 4;
      if (motion && now - raton.ultimo > 2500) {
        // sin nadie que lo mueva, el bajo deriva despacio por la ensenada
        const w = canvas.width, h = canvas.height;
        bajo.tx = w * (0.3 + 0.18 * Math.sin(t * 0.21)); bajo.ty = h * (0.42 + 0.12 * Math.sin(t * 0.33 + 1)); bajo.tz = 0.75;
      }
      const k = motion ? 0.08 : 1;
      bajo.x = lerp(bajo.x || bajo.tx, bajo.tx, k); bajo.y = lerp(bajo.y || bajo.ty, bajo.ty, k); bajo.z = lerp(bajo.z, bajo.tz, k * 0.6);
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, t);
      gl.uniform3f(u.mouse, bajo.x, bajo.y, bajo.z);
      gl.uniform1f(u.scroll, scrollHero);
      gl.uniform3f(u.acento, acento[0], acento[1], acento[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    if (!motion) { bajo.tx = canvas.width * 0.32; bajo.ty = canvas.height * 0.45; bajo.tz = 0.8; }
    let vivo = true;
    new IntersectionObserver(([e]) => { vivo = e.isIntersecting; }).observe(canvas);
    const bucle = now => {
      requestAnimationFrame(bucle);
      if (!vivo || document.hidden || !cortinaSaliendo) { previo = 0; return; }
      scrollHero = clamp(scrollY / innerHeight, 0, 1);
      pintar(now);
      vigilar(now);
    };
    if (motion) requestAnimationFrame(bucle); else ajustar();
  }

  /* ————————————————— Cabecera: progreso, menú, sección activa ————————————————— */
  const progreso = $('#progreso-ola');
  const alScroll = [];
  const tickScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progreso.style.setProperty('--p', (scrollY / Math.max(1, max)).toFixed(4));
    alScroll.forEach(f => f());
  };
  if (lenis) lenis.on('scroll', tickScroll); else addEventListener('scroll', tickScroll, { passive: true });
  tickScroll();

  const menuBoton = $('#menu-boton'), menu = $('#menu');
  function cerrarMenu() {
    if (menuBoton.getAttribute('aria-expanded') !== 'true') return;
    menuBoton.setAttribute('aria-expanded', 'false'); menu.classList.remove('es-abierto');
    $('.menu-boton-texto').textContent = 'Menú';
    if (lenis) lenis.start();
  }
  menuBoton.addEventListener('click', () => {
    const abrir = menuBoton.getAttribute('aria-expanded') !== 'true';
    if (!abrir) { cerrarMenu(); return; }
    menuBoton.setAttribute('aria-expanded', 'true'); menu.classList.add('es-abierto');
    $('.menu-boton-texto').textContent = 'Cerrar';
    if (lenis) lenis.stop();
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') cerrarMenu(); });
  const enlaces = $$('.menu a');
  const ioMenu = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    enlaces.forEach(a => a.classList.toggle('es-activo', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['viaje', 'niveles', 'parte', 'material', 'seguridad', 'campamento', 'contacto'].forEach(id => ioMenu.observe($('#' + id)));

  /* ————————————————— Marquesina ligada al scroll ————————————————— */
  const cinta = $('#cinta');
  const grupo = $('.cinta-grupo', cinta);
  for (let i = 0; i < 2; i++) { const c = grupo.cloneNode(true); c.setAttribute('aria-hidden', 'true'); cinta.appendChild(c); }
  if (motion) {
    let x = 0, vel = 0, visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(cinta);
    const paso = () => {
      requestAnimationFrame(paso);
      if (!visible) return;
      vel = lerp(vel, 0.6 + Math.min(14, Math.abs(velocidad()) * 0.5), 0.08);
      x -= vel;
      const w = grupo.offsetWidth;
      if (-x >= w) x += w;
      cinta.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    };
    requestAnimationFrame(paso);
  }

  /* ————————————————— 1 · El viaje de una ola (física de verdad) ————————————————— */
  const g = 9.81, T = 13, w0 = 2 * Math.PI / T, H0 = 1.2;
  const perfil = [[0, 4000], [700, 3800], [960, 120], [1150, 18], [1240, 4], [1280, 2.0], [1320, 1.5], [1360, 1.9], [1430, 0.9], [1470, 0.3], [1600, 0.1]];
  const profundidad = x => {
    for (let i = 1; i < perfil.length; i++) {
      if (x <= perfil[i][0]) {
        const [x0, h0] = perfil[i - 1], [x1, h1] = perfil[i];
        const t = (x - x0) / (x1 - x0);
        return Math.exp(lerp(Math.log(h0), Math.log(h1), t));
      }
    }
    return 0.1;
  };
  const ola = h => {
    const k0h = w0 * w0 * h / g;
    const kh = k0h / Math.sqrt(Math.tanh(k0h));              // aproximación de Eckart
    const k = kh / h, c = w0 / k;
    const n = kh > 20 ? 0.5 : 0.5 * (1 + 2 * kh / Math.sinh(2 * kh));
    const cg = n * c, cg0 = g / (2 * w0);
    let H = H0 * Math.sqrt(cg0 / cg);                         // asomeramiento
    const rompe = H >= 0.78 * h;
    if (rompe) H = 0.78 * h;
    return { c, L: c * T, H, rompe };
  };
  const corte = $('#corte');
  const agua = $('#corte-agua'), escena = $('.viaje-escena');
  const pathOla = $('#corte-ola'), espuma = $('#corte-espuma'), surfista = $('#surfista'), borrasca = $('#borrasca'), marca = $('#corte-marca');
  const dProf = $('#d-prof'), dAlt = $('#d-altura'), dVel = $('#d-vel');
  const pasos = $$('.paso');
  // lecho: tabla x → y a partir del propio path dibujado
  const lecho = (() => {
    const p = $('#corte-lecho'); const L = p.getTotalLength(); const tabla = new Float32Array(1601).fill(600);
    for (let s = 0; s <= L; s += 2) { const pt = p.getPointAtLength(s); const x = Math.round(pt.x); if (x >= 0 && x <= 1600 && pt.y < 615) tabla[x] = Math.min(tabla[x] === 600 ? 999 : tabla[x], pt.y); }
    for (let x = 0; x <= 1600; x++) if (tabla[x] === 999 || tabla[x] === 600) tabla[x] = x > 0 ? tabla[x - 1] : 600;
    return x => tabla[clamp(Math.round(x), 0, 1600)];
  })();
  const tramos = [[0, 180], [0.2, 330], [0.4, 900], [0.6, 1236], [0.8, 1318], [1, 1420]];
  const crestaEn = p => { for (let i = 1; i < tramos.length; i++) if (p <= tramos[i][0]) { const [p0, x0] = tramos[i - 1], [p1, x1] = tramos[i]; return lerp(x0, x1, (p - p0) / (p1 - p0)); } return 1420; };
  const espumas = Array.from({ length: 26 }, (_, i) => { const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('r', (1.5 + (i % 4)).toString()); espuma.appendChild(c); return { c, a: Math.random() * 6.28, r: Math.random() }; });
  let pasoActual = -1;
  const barraViaje = $('#viaje-barra'), rotuloBorrasca = $('#borrasca-rotulo');
  const medidaCorte = { W: 0, vw: 0 };
  const medirCorte = () => { medidaCorte.W = corte.getBoundingClientRect().width; medidaCorte.vw = escena.clientWidth; };
  medirCorte();
  new ResizeObserver(medirCorte).observe(escena);
  function dibujarViaje(p, tiempo = 0) {
    const xc = crestaEn(p);
    const h = profundidad(xc);
    const o = ola(h);
    const Hpx = clamp(o.H * 58, 16, 140);
    const Lpx = clamp(36 + o.L * 0.9, 70, 300);
    const roto = o.rompe && xc > 1250;
    const sesgo = clamp(o.H / (0.78 * h), 0, 1) * 0.62;
    const ancho = Lpx * 0.24;
    const caos = 1 - smooth(0.08, 0.3, p);
    const y0 = 300;
    const sup = x => {
      let y = 0;
      for (let j = 0; j < 3; j++) {
        const cx = xc - j * Lpx;
        const A = Hpx * [1, 0.78, 0.6][j] * (j === 0 && roto ? lerp(1, 0.55, smooth(1250, 1400, xc)) : 1);
        const dx = x - cx;
        const wl = dx > 0 ? ancho * (1 - sesgo) : ancho * (1 + sesgo * 0.4);
        const s = 1 / Math.cosh(dx / Math.max(6, wl));
        y += A * s * s;
      }
      if (caos > 0) {
        const env = Math.exp(-Math.pow((x - 200) / 260, 2));
        y += caos * env * (14 * Math.sin(x * 0.05 + tiempo * 2.1) + 9 * Math.sin(x * 0.13 - tiempo * 3.3) + 6 * Math.sin(x * 0.31 + tiempo * 1.3));
      }
      return y0 - y;
    };
    let d = '';
    for (let x = 0; x <= 1600; x += 8) {
      const y = Math.min(sup(x), lecho(x) - 1);
      d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(1) + ' ';
    }
    agua.setAttribute('d', d + 'L1600 620 L0 620 Z');
    const yc = sup(xc);
    // labio: cuando rompe, la cresta se cae hacia delante
    if (o.rompe) {
      const k = smooth(1230, 1290, xc) * (1 - smooth(1330, 1400, xc));
      d += `M${xc - 4} ${yc.toFixed(1)} C ${(xc + ancho * 0.9).toFixed(1)} ${(yc - 6 * k).toFixed(1)} ${(xc + ancho * 1.5 * k).toFixed(1)} ${(yc + Hpx * 0.4 * k).toFixed(1)} ${(xc + ancho * 1.2 * k).toFixed(1)} ${(yc + Hpx * 0.75 * k).toFixed(1)}`;
    }
    pathOla.setAttribute('d', d);
    // espuma: nace con la rotura y se queda detrás de la cresta
    const nEsp = o.rompe ? smooth(1240, 1320, xc) : 0;
    espumas.forEach((e, i) => {
      const on = i / espumas.length < nEsp;
      const ex = xc - e.r * ancho * 2.4 + Math.cos(e.a + tiempo * 2) * 4;
      const ey = sup(ex) - 2 + Math.sin(e.a + tiempo * 3) * 3 * e.r;
      e.c.setAttribute('cx', ex.toFixed(1)); e.c.setAttribute('cy', ey.toFixed(1));
      e.c.setAttribute('opacity', on ? (0.5 + e.r * 0.5).toFixed(2) : '0');
    });
    // surfista en la cara de la ola, de tumbada a de pie
    const sv = smooth(0.79, 0.84, p);
    if (sv > 0) {
      const sx = xc + ancho * 0.55, sy = sup(sx);
      const pend = Math.atan2(sup(sx + 6) - sup(sx - 6), 12) * 180 / Math.PI;
      // el surfista vive fuera del grupo exagerado: se lleva su punto a la misma escala
      const pendV = Math.atan(Math.tan(pend * Math.PI / 180) * 1.6) * 180 / Math.PI;
      surfista.setAttribute('transform', `translate(${sx.toFixed(1)} ${(sy * 1.6 - 180 - 3).toFixed(1)}) rotate(${pendV.toFixed(1)}) scale(1.25)`);
    }
    surfista.setAttribute('opacity', sv.toFixed(2));
    surfista.classList.toggle('de-pie', p > 0.88);
    const bv = 1 - smooth(0.18, 0.32, p);
    borrasca.setAttribute('opacity', bv.toFixed(2));
    rotuloBorrasca.setAttribute('opacity', bv.toFixed(2));
    borrasca.setAttribute('transform', `translate(190 215) rotate(${(-tiempo * 12 - p * 200).toFixed(1)})`);
    marca.setAttribute('x1', xc.toFixed(1)); marca.setAttribute('x2', xc.toFixed(1));
    marca.setAttribute('y1', yc.toFixed(1)); marca.setAttribute('y2', lecho(xc).toFixed(1));
    dProf.textContent = h >= 100 ? fmt(Math.round(h / 10) * 10) + ' m' : h >= 10 ? fmt(h) + ' m' : fmt(h, 1) + ' m';
    dAlt.textContent = fmt(o.H, 1) + ' m' + (o.rompe ? ' · rompe' : '');
    dVel.textContent = fmt(o.c * 3.6) + ' km/h';
    const i = Math.min(4, Math.floor(p * 5));
    if (i !== pasoActual) {
      pasoActual = i;
      pasos.forEach((li, k) => { li.classList.toggle('es-activo', k === i); $('.paso-boton', li).setAttribute('aria-current', k === i ? 'step' : 'false'); });
    }
    barraViaje.style.setProperty('--p', p.toFixed(3));
    // en móvil el corte es más ancho que la pantalla: la cámara sigue a la cresta.
    // Medidas cacheadas: leer el layout en cada fotograma, con el pin, da tareas largas.
    const W = medidaCorte.W, vw = medidaCorte.vw;
    if (W > vw + 4) {
      const tx = clamp(vw * 0.55 - xc / 1600 * W, vw - W, 0);
      corte.style.transform = `translate3d(${tx.toFixed(1)}px,0,0)`;
    } else if (corte.style.transform) corte.style.transform = '';
  }
  let progViaje = gsapReady && motion ? 0 : 0.9;
  let stViaje = null;
  if (gsapReady && motion) {
    html.classList.add('viaje-vivo');
    stViaje = ScrollTrigger.create({
      trigger: '#viaje', start: 'top top', end: () => '+=' + Math.round(innerHeight * 3.2), pin: '.viaje-pin', scrub: 0.7,
      onUpdate: s => { progViaje = s.progress; },
    });
    let vis = false;
    new IntersectionObserver(([e]) => { vis = e.isIntersecting; }).observe($('#viaje'));
    let tv = 0;
    gsap.ticker.add((time) => { if (vis) { tv = time; dibujarViaje(progViaje, tv); } });
    pasos.forEach((li, k) => $('.paso-boton', li).addEventListener('click', () => {
      irA(stViaje.start + (k + 0.55) / 5 * (stViaje.end - stViaje.start));
    }));
    dibujarViaje(0, 0);
  } else {
    // Sin movimiento (o sin GSAP): los cinco pasos se eligen a mano; el dibujo cambia igual.
    pasos.forEach((li, k) => $('.paso-boton', li).addEventListener('click', () => dibujarViaje((k + 0.6) / 5, 0)));
    dibujarViaje(progViaje, 0);
  }

  /* ————————————————— 2 · Pila sticky de niveles ————————————————— */
  const pila = $('#pila');
  const items = $$('.pila-item', pila);
  items.forEach((li, i) => li.style.setProperty('--n', i));
  function medirPila() {
    pila.style.setProperty('--alto', 'auto');
    html.classList.remove('pila-plana');
    const alto = Math.max(...items.map(li => li.firstElementChild.offsetHeight));
    pila.style.setProperty('--alto', alto + 'px');
    // si la más alta no cabe bajo la cabecera, la pila no se ancla (se vería cortada)
    const hueco = innerHeight - cab() - 24 - (items.length - 1) * 14;
    html.classList.toggle('pila-plana', alto > hueco);
  }
  medirPila();
  new ResizeObserver(() => { medirPila(); }).observe(pila.parentElement);
  // comparativa de la versión sobria: sale de los data-* de cada nivel, no se repite la cifra
  const comp = $('#comparativa');
  const filasComp = items.map(li => ({ n: $('.nivel-num', li).textContent + ' · ' + $('.nivel-nombre', li).textContent, h: +li.dataset.horas, eur: +li.dataset.precio }));
  // barras: horas reales en el agua (ahí está la diferencia); el €/h va como cifra,
  // porque solo varía de 11 a 13 y en barras se exageraría o no se vería
  const maxH = Math.max(...filasComp.map(f => f.h));
  comp.innerHTML = filasComp.map(f => `<li><span>${f.n}</span><span class="barra" role="img" aria-label="${f.h} horas en el agua"><i style="--v:${(f.h / maxH).toFixed(3)}"></i></span><b>${f.h} h · ${fmt(f.eur / f.h, 2)} €/h</b></li>`).join('');

  /* ————————————————— 3 · Parte de MUESTRA (generado a partir de la fecha) ————————————————— */
  const hoy = new Date();
  const semilla = hoy.getFullYear() * 10000 + (hoy.getMonth() + 1) * 100 + hoy.getDate();
  const azar = (() => { let a = semilla; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; })();
  const dias = Math.floor(Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()) / 864e5);
  const marea = hora => { const t = dias * 24 + hora; return 2.05 + 1.25 * Math.cos(2 * Math.PI * t / 12.4206 + 0.7) + 0.42 * Math.cos(2 * Math.PI * t / 12 + 2.1); };
  const hhmm = h => { const m = Math.round(h * 60); return String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
  const ahora = hoy.getHours() + hoy.getMinutes() / 60;
  const X = h => 40 + h / 24 * 660, Y = m => 225 - m / 4 * 200;
  let dm = '';
  for (let h = 0; h <= 24.001; h += 0.25) dm += (h ? 'L' : 'M') + X(h).toFixed(1) + ' ' + Y(marea(h)).toFixed(1) + ' ';
  $('#marea-curva').setAttribute('d', dm);
  $('#marea-area').setAttribute('d', dm + `L${X(24)} 225 L${X(0)} 225 Z`);
  let rej = '';
  for (let h = 0; h <= 24; h += 6) rej += `<line x1="${X(h)}" x2="${X(h)}" y1="20" y2="225"/><text x="${X(h)}" y="248" text-anchor="middle">${String(h).padStart(2, '0')}:00</text>`;
  for (let m = 0; m <= 4; m++) rej += `<line x1="40" x2="700" y1="${Y(m)}" y2="${Y(m)}" stroke-opacity=".6"/><text x="30" y="${Y(m) + 4}" text-anchor="end">${m}</text>`;
  $('#marea-rejilla').innerHTML = rej;
  const extremos = [];
  for (let h = 0.05; h < 24; h += 0.05) { const a = marea(h - 0.05), b = marea(h), c = marea(h + 0.05); if (b > a && b >= c) extremos.push(['Pleamar', h, b]); if (b < a && b <= c) extremos.push(['Bajamar', h, b]); }
  $('#marea-extremos').innerHTML = extremos.map(([n, h, m]) => `<li>${n} <b>${hhmm(h)}</b> · ${fmt(m, 1)} m</li>`).join('');
  const ma = $('#marea-ahora');
  ma.setAttribute('transform', `translate(${X(ahora).toFixed(1)} 0)`);
  $('circle', ma).setAttribute('cy', Y(marea(ahora)).toFixed(1));
  const Hdia = 0.6 + azar() * 1.9, Tdia = Math.round(9 + azar() * 6), dirDia = Math.round(285 + azar() * 40);
  const vientoBase = 5 + azar() * 24, terral = azar() > 0.4;
  const franjas = [0, 3, 6, 9, 12, 15, 18, 21].map((h, i) => {
    const H = Math.max(0.3, Hdia * (0.85 + 0.25 * Math.sin(i * 0.7 + azar() * 2)));
    const v = Math.max(3, vientoBase * (0.6 + 0.5 * Math.sin(Math.PI * (h - 4) / 16)));
    const dir = terral && h < 14 ? 160 : 330;
    return { h, H, v, dir };
  });
  const hAhora = Math.floor(ahora / 3) * 3;
  $('#horas').innerHTML = franjas.map(f => `<li class="hora${f.h === hAhora ? ' es-ahora' : ''}"><span class="hora-barra" title="${fmt(f.H, 1)} m"><i style="--h:${clamp(f.H / 3, 0.05, 1).toFixed(3)}"></i></span><b>${fmt(f.H, 1)} m</b><span>${String(f.h).padStart(2, '0')}h</span><span class="hora-viento" style="--dir:${f.dir + 180}deg" aria-label="viento ${Math.round(f.v)} km/h">↑</span><span>${Math.round(f.v)}</span></li>`).join('');
  const peor = franjas.filter(f => f.h >= 9 && f.h <= 18).reduce((a, f) => ({ H: Math.max(a.H, f.H), v: Math.max(a.v, f.v) }), { H: 0, v: 0 });
  const bandera = peor.H > 2.2 || peor.v > 30 ? 'roja' : peor.H > 1.5 || peor.v > 22 ? 'amarilla' : 'verde';
  const subida = (() => { for (let h = 9.5; h <= 18; h += 0.5) if (marea(h + 0.5) > marea(h) && marea(h) > 1.2 && marea(h) < 3) return h; return 11; })();
  $('#bandera').className = 'bandera es-' + bandera;
  $('#bandera-texto').textContent = 'Bandera ' + bandera;
  $('#veredicto-texto').textContent = bandera === 'roja' ? 'Hoy no hay clase.' : bandera === 'amarilla' ? 'Hay clase, solo niveles 0 y 1.' : 'Hoy hay clase para todos.';
  $('#veredicto-clase').textContent = bandera === 'roja'
    ? 'Se mueve sin coste: te avisamos ayer a las 20:00.'
    : `Primera clase a las ${hhmm(Math.round(subida * 2) / 2)}, con la marea subiendo${bandera === 'amarilla' ? ', en la ensenada' : ''}.`;
  $('#parte-fecha').textContent = hoy.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + ' · generado para la demo';
  // la misma muestra alimenta la lectura de la portada y la cinta
  const mes = hoy.getMonth();
  const mesesLi = $$('#agua-meses li');
  mesesLi[mes].classList.add('es-mes');
  const tAgua = +mesesLi[mes].dataset.t;
  const neo = tAgua < 14 ? '5/4' : tAgua < 18 ? '4/3' : '3/2';
  const lect = { periodo: Tdia, dir: dirDia, altura: fmt(Hdia, 1), agua: fmt(tAgua, tAgua % 1 ? 1 : 0) };
  Object.entries(lect).forEach(([k, v]) => $$(`[data-lectura="${k}"]`).forEach(el => { el.textContent = v; }));
  const textosCinta = [`Período ${Tdia} s`, `Mar de fondo del NO ${dirDia}°`, `${fmt(Hdia, 1)} m en serie`, `Viento ${terral ? 'terral' : 'del mar'} ${Math.round(vientoBase)} km/h`, `Agua ${lect.agua} °C · neopreno ${neo}`, `Bandera ${bandera}`, 'Datos de muestra'];
  $$('.cinta-grupo').forEach(gr => $$('span', gr).forEach((s, i) => { if (textosCinta[i]) s.textContent = textosCinta[i]; }));

  /* ————————————————— 4 · Galería anclada horizontal de tablas ————————————————— */
  const ventana = $('#tablas-ventana'), pista = $('#tablas');
  if (gsapReady && motion) {
    html.classList.add('galeria-viva');
    const dist = () => Math.max(0, pista.scrollWidth - innerWidth);
    gsap.to(pista, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '#material-pin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: true, invalidateOnRefresh: true },
    });
  } else {
    // contenedor que desborda: focusable SOLO si de verdad desborda
    const revisar = () => {
      const desborda = ventana.scrollWidth > ventana.clientWidth + 2;
      if (desborda) ventana.setAttribute('tabindex', '0'); else ventana.removeAttribute('tabindex');
    };
    revisar(); addEventListener('resize', revisar);
  }

  // calculadora de alquiler
  const talon = $('#talon');
  const calcular = () => {
    const f = new FormData(talon);
    const i = +f.get('tiempo');
    const tabla = +f.get('tabla').split(',')[i], neop = +f.get('neo').split(',')[i];
    let total = tabla + neop;
    const pack = tabla > 0 && neop > 0;
    if (pack) total *= 0.85;
    $('strong', $('#talon-total')).textContent = total ? fmt(total, total % 1 ? 2 : 0) + ' €' : '0 €';
    $('#talon-nota').textContent = pack ? 'Con tabla y neopreno juntos ya va descontado el 15 %. Se paga al recoger, con DNI.' : 'Tabla y neopreno juntos llevan un 15 % menos. Se paga al recoger, con DNI.';
  };
  talon.addEventListener('change', calcular); calcular();
  talon.addEventListener('submit', e => e.preventDefault());

  /* ————————————————— Contadores ————————————————— */
  const ioCont = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    ioCont.unobserve(e.target);
    const el = e.target, fin = +el.dataset.contador;
    if (!motion) { el.textContent = fmt(fin); return; }
    const t0 = performance.now();
    const paso = now => { const p = clamp((now - t0) / 1400, 0, 1); el.textContent = fmt(Math.round(fin * (1 - Math.pow(1 - p, 4)))); if (p < 1) requestAnimationFrame(paso); };
    requestAnimationFrame(paso);
  }), { threshold: 0.6 });
  $$('[data-contador]').forEach(el => ioCont.observe(el));

  /* ————————————————— Bordes de ola: se agitan con la velocidad del scroll ————————————————— */
  const bordes = $$('.borde-ola path');
  if (motion) {
    const vivos = new Set();
    const ioB = new IntersectionObserver(es => es.forEach(e => (e.isIntersecting ? vivos.add(e.target) : vivos.delete(e.target))));
    bordes.forEach(p => ioB.observe(p.ownerSVGElement));
    let amp = 0;
    const pintaBorde = now => {
      requestAnimationFrame(pintaBorde);
      const objetivo = sobria() ? 0 : 5 + Math.min(30, Math.abs(velocidad()) * 0.9);
      amp = lerp(amp, objetivo, 0.06);
      const t = now / 1000;
      bordes.forEach((p, k) => {
        if (!vivos.has(p.ownerSVGElement)) return;
        let d = '';
        for (let x = 0; x <= 1440; x += 48) {
          const y = 40 + amp * Math.sin(x * 0.0045 + t * 0.9 + k) + amp * 0.35 * Math.sin(x * 0.011 - t * 1.4);
          d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(1) + ' ';
        }
        p.setAttribute('d', d + 'L1440 80 L0 80 Z');
      });
    };
    requestAnimationFrame(pintaBorde);
  }

  /* ————————————————— Horario: hoy ————————————————— */
  const fila = $(`#horario tr[data-dias="${hoy.getDay()}"]`);
  if (fila) fila.classList.add('es-hoy');

  /* ————————————————— Mapa solo bajo clic ————————————————— */
  $('#mapa-boton').addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Malpica de Bergantiños, A Coruña') + '&output=embed';
    f.title = 'Mapa de Malpica de Bergantiños';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    $('#mapa').replaceChildren(f);
  });

  /* ————————————————— Formulario de muestra ————————————————— */
  const reserva = $('#reserva');
  reserva.addEventListener('submit', e => {
    e.preventDefault();
    const est = $('#reserva-estado');
    const falta = $$('[required]', reserva).find(i => !i.value.trim());
    if (falta) { est.textContent = 'Falta «' + falta.parentElement.firstChild.textContent.trim() + '».'; falta.focus(); return; }
    est.textContent = `Gracias, ${reserva.nombre.value.trim()}. Es una demostración: no se ha enviado nada. En la web real te escribiríamos hoy mismo.`;
    reserva.reset();
  });

  /* ————————————————— Aviso de cookies ————————————————— */
  const cookies = $('#cookies');
  let mostrarMandos = () => {};
  if (store.get('treboada-cookies') !== 'ok') cookies.hidden = false;
  $('#cookies-ok').addEventListener('click', () => { store.set('treboada-cookies', 'ok'); cookies.hidden = true; mostrarMandos(); });

  /* MANDOS:INICIO — mandos de demostración. NO VIAJAN AL SITIO DE UN CLIENTE (ver README). */
  const mandos = $('#mandos');
  mostrarMandos = () => { if (revision) mandos.hidden = false; };
  if (store.get('treboada-cookies') === 'ok') mostrarMandos();
  const refrescar = () => { medirPila(); if (gsapReady) ScrollTrigger.refresh(); };
  const marcar = () => {
    $$('[data-maqueta]', mandos).forEach(b => b.setAttribute('aria-pressed', String((b.dataset.maqueta === 'sobria') === sobria())));
    const pal = ['xeo', 'liquen'].find(p => html.classList.contains('paleta-' + p)) || 'vidrio';
    $$('[data-paleta]', mandos).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.paleta === pal)));
  };
  $$('[data-maqueta]', mandos).forEach(b => b.addEventListener('click', () => {
    html.classList.toggle('maqueta-sobria', b.dataset.maqueta === 'sobria');
    store.set('treboada-maqueta', b.dataset.maqueta);
    marcar(); refrescar();
  }));
  $$('[data-paleta]', mandos).forEach(b => b.addEventListener('click', () => {
    html.classList.remove('paleta-xeo', 'paleta-liquen');
    if (b.dataset.paleta !== 'vidrio') html.classList.add('paleta-' + b.dataset.paleta);
    store.set('treboada-paleta', b.dataset.paleta);
    marcar(); html.dispatchEvent(new Event('paleta'));
  }));
  marcar();
  /* MANDOS:FIN */

  /* ————————————————— Cursor propio y botones magnéticos (solo ratón) ————————————————— */
  const cursor = $('.cursor'), aro = $('.cursor-aro'), punto = $('.cursor-punto'), texto = $('.cursor-texto');
  let cx = -100, cy = -100, ax = -100, ay = -100, cursorVivo = false;
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    if (!cursorVivo) { cursorVivo = true; html.classList.add('cursor-propio'); ax = e.clientX; ay = e.clientY; requestAnimationFrame(sigue); }
    cx = e.clientX; cy = e.clientY;
    cursor.classList.remove('es-oculto');
    const t = e.target;
    const etiqueta = t.closest && t.closest('[data-cursor]');
    const enlace = t.closest && t.closest('a, button, label, summary, select, input, textarea');
    const enPortada = t.closest && t.closest('.portada') && !enlace;
    cursor.classList.toggle('es-texto', !!etiqueta);
    cursor.classList.toggle('es-enlace', !!enlace && !etiqueta);
    cursor.classList.toggle('es-bajo', !!enPortada);
    texto.textContent = etiqueta ? etiqueta.dataset.cursor : '';
  }, { passive: true });
  document.addEventListener('pointerleave', () => cursor.classList.add('es-oculto'));
  function sigue() {
    requestAnimationFrame(sigue);
    const k = motion ? 0.2 : 1;
    ax = lerp(ax, cx, k); ay = lerp(ay, cy, k);
    punto.style.transform = `translate3d(${cx}px,${cy}px,0)`;
    aro.style.transform = `translate3d(${ax.toFixed(1)}px,${ay.toFixed(1)}px,0)`;
  }
  if (finePointer && motion) {
    $$('.iman').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        b.style.setProperty('--x', ((e.clientX - r.left - r.width / 2) * 0.28).toFixed(1) + 'px');
        b.style.setProperty('--y', ((e.clientY - r.top - r.height / 2) * 0.38).toFixed(1) + 'px');
      });
      b.addEventListener('pointerleave', () => { b.style.setProperty('--x', '0px'); b.style.setProperty('--y', '0px'); });
    });
  }

  /* ————————————————— Refrescos tras tipografías ————————————————— */
  const listo = () => { medirPila(); if (gsapReady) ScrollTrigger.refresh(); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(listo);
  addEventListener('load', listo);
})();
