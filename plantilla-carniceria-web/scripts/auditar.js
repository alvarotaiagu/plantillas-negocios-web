// Auditoría automática de accesibilidad con axe-core (WCAG 2.1 A/AA).
// Uso: AXE=/ruta/axe.min.js VEND=/ruta/node_modules node scripts/auditar.js  → escribe AUDITORIA.md
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const BASE = process.env.BASE || 'http://localhost:8123/plantilla-carniceria-web/';
const AXE = fs.readFileSync(process.env.AXE, 'utf8');
const V = process.env.VEND;
const MAP = V && { 'gsap.min.js': V + '/gsap/dist/gsap.min.js', 'ScrollTrigger.min.js': V + '/gsap/dist/ScrollTrigger.min.js', 'lenis.min.js': V + '/lenis/dist/lenis.min.js' };
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const casos = [
    ['Portada · escritorio', 'index.html', { width: 1440, height: 900 }, false, null],
    ['Portada · móvil 390', 'index.html', { width: 390, height: 844 }, true, null],
    ['Portada · versión sobria', 'index.html?revision', { width: 1440, height: 900 }, false, 'sobria'],
    ['Portada · paleta Azafrán', 'index.html?revision', { width: 1440, height: 900 }, false, 'azafran'],
    ['Portada · paleta Ciruela', 'index.html?revision', { width: 1440, height: 900 }, false, 'ciruela'],
    ['Portada · menú móvil abierto', 'index.html', { width: 390, height: 844 }, true, 'menu'],
    ['Aviso legal', 'legal.html', { width: 1440, height: 900 }, false, null],
    ['404', '404.html', { width: 1440, height: 900 }, false, null]
  ];
  const filas = [], detalle = [];
  for (const [nombre, url, vp, movil, extra] of casos) {
    const ctx = await b.newContext({ viewport: vp, isMobile: movil, hasTouch: movil, ignoreHTTPSErrors: true });
    await ctx.addInitScript(() => { try { localStorage.setItem('mouriscal-cookies', '1'); } catch (e) {} });
    const p = await ctx.newPage();
    await p.route('https://cdn.jsdelivr.net/**', r => { if (!MAP) return r.continue(); const f = Object.keys(MAP).find(k => r.request().url().endsWith(k)); return f ? r.fulfill({ path: MAP[f], contentType: 'application/javascript' }) : r.abort(); });
    await p.goto(BASE + url); await p.waitForTimeout(3500);
    if (extra === 'sobria') await p.click('[data-maqueta="sobria"]');
    if (extra === 'azafran' || extra === 'ciruela') await p.click(`[data-paleta="${extra}"]`);
    if (extra === 'menu') { await p.click('#menu-boton'); await p.waitForTimeout(1000); }
    // recorrer para que todo lo que entra con el scroll esté en su estado final
    if (url.startsWith('index')) { for (let i = 0; i < 80; i++) { await p.mouse.wheel(0, 400); await p.waitForTimeout(25); } await p.waitForTimeout(1500); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(800); }
    await p.addScriptTag({ content: AXE });
    const r = await p.evaluate(async () => { const res = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } }); return { v: res.violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, ej: v.nodes.slice(0, 3).map(n => n.target.join(' ')) })), pases: res.passes.length, inc: res.incomplete.length }; });
    filas.push(`| ${nombre} | ${r.v.length} | ${r.pases} | ${r.inc} |`);
    r.v.forEach(v => detalle.push(`- **${nombre}** · \`${v.id}\` (${v.impact}, ${v.n} nodos): ${v.ej.join(' · ')}`));
    console.log(nombre, r.v.length ? JSON.stringify(r.v) : 'sin infracciones', r.pases, r.inc);
    await ctx.close();
  }
  await b.close();
  const md = `# Auditoría de accesibilidad — Mouriscal

axe-core ${require(path.join(path.dirname(process.env.AXE), 'package.json')).version} · reglas WCAG 2.0/2.1 A y AA · Chromium (Playwright) ·
${new Date().toISOString().slice(0, 10)}. Generado por \`scripts/auditar.js\`, con el aviso de cookies cerrado y la
página recorrida con la rueda antes de analizar (para que los titulares y bloques que entran con el scroll estén
en su estado final).

| Caso | Infracciones | Reglas superadas | Para revisar a mano |
|---|---|---|---|
${filas.join('\n')}

${detalle.length ? '## Infracciones\n\n' + detalle.join('\n') : '**Cero infracciones en los ocho casos.**'}

«Para revisar a mano» son las comprobaciones que axe no puede decidir solo (sobre todo contraste de texto encima
de degradados o del lienzo WebGL de la portada). El contraste de cada token está calculado aparte con
\`scripts/contraste.js\` y medido en la página por \`scripts/verificar.js\`.

Lo que axe no cubre y queda pendiente: lector de pantalla real (NVDA/VoiceOver), Firefox y Safari, y dispositivo
táctil real.
`;
  fs.writeFileSync(path.join(__dirname, '..', 'AUDITORIA.md'), md);
})();
