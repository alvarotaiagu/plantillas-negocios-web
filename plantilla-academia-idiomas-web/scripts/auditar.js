/* Auditoría automática de accesibilidad con axe-core (wcag2a/aa, 21a/aa y
   best-practice): portada, aviso legal y 404, en 1440×900 y 390×844, con el
   aviso de cookies cerrado y la página recorrida (lo que se revela con el
   scroll también entra), más la portada en versión sobria.
   Uso: PW=/ruta/playwright AXE=/ruta/axe.min.js LIBS=… node scripts/auditar.js */
const { chromium } = require(process.env.PW || 'playwright');
const fs = require('fs');
const BASE = '' + (process.env.BASE || 'http://127.0.0.1:8080/plantilla-academia-idiomas-web/') + '';
const AXE = fs.readFileSync(process.env.AXE, 'utf8');
const LIBS = process.env.LIBS;
const MAPA = LIBS ? {
  'gsap@3.12.5/dist/gsap.min.js': LIBS + '/gsap-3.12.5/dist/gsap.min.js',
  'gsap@3.12.5/dist/ScrollTrigger.min.js': LIBS + '/gsap-3.12.5/dist/ScrollTrigger.min.js',
  'lenis@1.1.13/dist/lenis.min.js': LIBS + '/lenis-1.1.13/dist/lenis.min.js',
} : null;
const espera = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const b = await chromium.launch();
  const filas = [];
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    for (const [pagina, extra] of [['', ''], ['aviso-legal.html', ''], ['404.html', ''], ['?revision', 'sobria']]) {
      const ctx = await b.newContext({ ignoreHTTPSErrors: true, viewport: vp, isMobile: vp.width < 500, hasTouch: vp.width < 500 });
      await ctx.addInitScript(s => { try { localStorage.setItem('desenredo-cookies', '1'); if (s) localStorage.setItem('desenredo-maqueta', s); } catch (e) {} }, extra);
      const page = await ctx.newPage();
      await page.route('https://cdn.jsdelivr.net/npm/**', route => {
        if (!MAPA) return route.continue();
        const k = Object.keys(MAPA).find(k => route.request().url().endsWith(k));
        if (!k) return route.abort();
        route.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(MAPA[k]) });
      });
      await page.goto(BASE + pagina); await espera(3500);
      const alto = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < alto; y += 400) { await page.mouse.wheel(0, 400); await espera(60); }
      await espera(1500);
      await page.evaluate(AXE);
      const r = await page.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } }));
      const nombre = (pagina || 'index') + (extra ? ' (' + extra + ')' : '') + ' · ' + vp.width;
      filas.push({ nombre, violaciones: r.violations.map(v => ({ id: v.id, impacto: v.impact, nodos: v.nodes.length, ejemplo: v.nodes[0] && v.nodes[0].target.join(' ') })) });
      console.log(nombre + ': ' + r.violations.length + ' tipos' + (r.violations.length ? ' → ' + r.violations.map(v => v.id + '×' + v.nodes.length + ' [' + (v.nodes[0] && v.nodes[0].target.join(' ')) + ']').join(', ') : ''));
      await ctx.close();
    }
  }
  fs.writeFileSync(__dirname + '/auditoria.json', JSON.stringify(filas, null, 1));
  await b.close();
})();
