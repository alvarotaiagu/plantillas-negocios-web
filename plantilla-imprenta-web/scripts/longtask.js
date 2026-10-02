// Tareas largas (PerformanceObserver 'longtask'), en frío (caché deshabilitada),
// separando carga (0–4 s) y recorrido entero con la rueda. Dos pasadas:
// con WebGL (en este entorno, SwiftShader: GPU por software) y con WebGL
// desactivado, para aislar cuánto pesa el shader frente a GSAP + fuentes.
const { chromium } = require('playwright');
const { servidor, contexto, URL } = require('./arnes');
const espera = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const s = await servidor();
  const salida = {};
  for (const [nombre, args] of [['webgl-swiftshader', ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']], ['sin-webgl', ['--disable-webgl', '--disable-3d-apis']]]) {
    for (const [disp, vp, movil] of [['escritorio', { width: 1440, height: 900 }, false], ['movil', { width: 390, height: 844 }, true]]) {
      const opts = { args }; if (process.env.HTTPS_PROXY) opts.proxy = { server: process.env.HTTPS_PROXY, bypass: '<-loopback>,127.0.0.1,localhost' };
      const nav = await chromium.launch(opts);
      const ctx = await contexto(nav, { ctx: { viewport: vp, isMobile: movil, hasTouch: movil } });
      const p = await ctx.newPage();
      const cdp = await ctx.newCDPSession(p); await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
      await p.goto(URL, { waitUntil: 'load' });
      await espera(4000);
      const carga = await p.evaluate(() => window.__tresmm.longtasks.slice());
      if (await p.$('#cookies-ok:visible')) await p.click('#cookies-ok');
      const n0 = carga.length;
      for (let i = 0; i < 90; i++) { await p.mouse.wheel(0, 240); await espera(70); }
      await espera(1500);
      const todo = await p.evaluate(() => window.__tresmm.longtasks.slice());
      const rec = todo.slice(n0);
      const res = (l) => ({ n: l.length, total: l.reduce((a, b) => a + b.dur, 0), max: Math.max(0, ...l.map(x => x.dur)) });
      const webgl = await p.evaluate(() => !document.documentElement.classList.contains('sin-webgl'));
      salida[nombre + ' · ' + disp] = { webgl, carga: res(carga), recorrido: res(rec) };
      console.log(nombre, disp, JSON.stringify(salida[nombre + ' · ' + disp]));
      await nav.close();
    }
  }
  require('fs').writeFileSync(require('path').join(__dirname, 'longtask-resultado.json'), JSON.stringify(salida, null, 1));
  s.close();
})();
