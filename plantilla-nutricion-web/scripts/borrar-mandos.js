// Comprueba la receta «Borrar los mandos» del README contra los archivos reales.
// Aplica la receta sobre una COPIA (nunca sobre la carpeta) y verifica que no
// queda rastro de los mandos y que la web sigue cargando sin errores.
//   node scripts/borrar-mandos.js mantel   → el cliente se queda la versión cargada
//   node scripts/borrar-mandos.js sobria   → el cliente se queda la versión sobria
// Con --aplicar <carpeta> escribe el resultado en esa carpeta (para entregar).
const fs = require('fs');
const path = require('path');
const os = require('os');
const queda = process.argv[2] === 'sobria' ? 'sobria' : 'mantel';
const RAIZ = path.join(__dirname, '..');
const destinoArg = process.argv.indexOf('--aplicar');
const DEST = destinoArg > 0 ? path.resolve(process.argv[destinoArg + 1]) : fs.mkdtempSync(path.join(os.tmpdir(), 'fiambreira-'));

// Quita cada tramo entre un marcador de inicio y su fin, sin comodines:
// busca posiciones exactas y se niega si hay un inicio sin fin o anidado.
function quitarTramos(texto, ini, fin, nombre) {
  let out = '', i = 0, n = 0;
  for (;;) {
    const a = texto.indexOf(ini, i);
    if (a < 0) break;
    const b = texto.indexOf(fin, a);
    if (b < 0) throw new Error(`${nombre}: «${ini}» sin «${fin}»`);
    const otro = texto.indexOf(ini, a + ini.length);
    if (otro >= 0 && otro < b) throw new Error(`${nombre}: marcadores anidados`);
    // abarca el comentario completo que contiene cada marcador
    let desde = a, hasta = b + fin.length;
    const abreCom = Math.max(texto.lastIndexOf('<!--', a), texto.lastIndexOf('/*', a));
    if (abreCom >= 0 && texto.slice(abreCom, a).indexOf('\n') < 0) desde = abreCom;
    const cierra = texto.slice(hasta).match(/^[^\n]*?(-->|\*\/)/);
    if (cierra) hasta += cierra[0].length;
    // si el tramo ocupa líneas enteras, se lleva también el salto de línea
    const ini0 = texto.lastIndexOf('\n', desde - 1) + 1;
    if (/^\s*$/.test(texto.slice(ini0, desde)) && texto[hasta] === '\n') { desde = ini0; hasta += 1; }
    out += texto.slice(i, desde); i = hasta; n++;
  }
  return { texto: out + texto.slice(i), n };
}
const quitarLineas = (texto, marca) => texto.split('\n').filter((l) => !l.trimEnd().endsWith(marca)).join('\n');

const archivos = ['index.html', 'legal.html', '404.html', 'css/estilos.css', 'js/main.js'];
const informe = [];
for (const f of archivos) {
  let t = fs.readFileSync(path.join(RAIZ, f), 'utf8');
  const lineas0 = t.split('\n').length;
  const r1 = quitarTramos(t, 'MANDO-INICIO', 'MANDO-FIN', f); t = r1.texto;
  t = quitarLineas(t, '// MANDO');
  let ns = 0;
  if (queda === 'mantel') {
    // el marco de vichy de la carta pasa a ser incondicional
    t = t.split('html:not(.maqueta-sobria) ').join('');
    t = t.split('MANTEL-INICIO · ').join('');
    t = t.split('\n').filter((l) => !/^\s*(<!--|\/\*)\s*MANTEL-FIN\s*(-->|\*\/)\s*$/.test(l)).join('\n');
    const r2 = quitarTramos(t, 'SOBRIA-INICIO', 'SOBRIA-FIN', f); t = r2.texto; ns = r2.n;
  } else {
    t = quitarTramos(t, 'MANTEL-INICIO', 'MANTEL-FIN', f).texto;
    // la sobria pasa a ser incondicional: fuera el prefijo de clase y los marcadores
    t = t.split('html.maqueta-sobria ').join('');
    t = t.split('SOBRIA-INICIO · ').join('');
    t = t.split('\n').filter((l) => !/^\s*(<!--|\/\*)\s*SOBRIA-FIN\s*(-->|\*\/)\s*$/.test(l)).join('\n');
  }
  const lineas1 = t.split('\n').length;
  if (lineas0 - lineas1 > 200) throw new Error(`${f}: la receta se lleva ${lineas0 - lineas1} líneas, demasiadas — revisar marcadores`);
  fs.mkdirSync(path.dirname(path.join(DEST, f)), { recursive: true });
  fs.writeFileSync(path.join(DEST, f), t);
  informe.push(`${f}: ${r1.n} tramos de mando${queda === 'mantel' ? `, ${ns} de sobria` : ''}, ${lineas0} → ${lineas1} líneas`);
}
for (const extra of ['img', 'manifest.json', '.nojekyll']) fs.cpSync(path.join(RAIZ, extra), path.join(DEST, extra), { recursive: true });

// Que no quede rastro
const rastros = /\bmandos?\b|data-maqueta|data-paleta|paleta-loza|paleta-ocre|fiambreira-maqueta|fiambreira-paleta|es-revision|colocarMandos|MANDO-|SOBRIA-|MANTEL-|maqueta-sobria/;
const sobran = [];
for (const f of archivos) fs.readFileSync(path.join(DEST, f), 'utf8').split('\n').forEach((l, i) => { if (rastros.test(l)) sobran.push(`${f}:${i + 1}: ${l.trim().slice(0, 90)}`); });

try { new Function(fs.readFileSync(path.join(DEST, 'js/main.js'), 'utf8')); } catch (e) { sobran.push('js/main.js no compila: ' + e.message); }
console.log(informe.join('\n'));
console.log(sobran.length ? 'QUEDAN RASTROS:\n' + sobran.join('\n') : `Sin rastro de los mandos (queda la versión «${queda}») en ${DEST}`);

// Y que la copia cargue sin errores (si hay Playwright a mano)
(async () => {
  let pw; try { pw = require('playwright'); } catch (e) { console.log('(sin Playwright: no se prueba la carga)'); process.exit(sobran.length ? 1 : 0); }
  const http = require('http');
  const srv = http.createServer((q, s) => { let u = decodeURIComponent(q.url.split('?')[0]); if (u.endsWith('/')) u += 'index.html'; const f = path.join(DEST, u); if (fs.existsSync(f) && fs.statSync(f).isFile()) { s.writeHead(200, { 'content-type': { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' }[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(s); } else { s.writeHead(404); s.end(); } }).listen(0);
  const port = srv.address().port;
  const { rutas } = require('./comun');
  const b = await pw.chromium.launch(); const page = await b.newPage({ ignoreHTTPSErrors: true });
  const errores = []; page.on('pageerror', (e) => errores.push(String(e))); page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
  await rutas(page);
  await page.goto(`http://localhost:${port}/?revision`); await page.waitForTimeout(3500);
  const d = await page.evaluate(() => ({ mandos: !!document.querySelector('.mandos'), sobria: getComputedStyle(document.querySelector('.franja')).display === 'none', marco: getComputedStyle(document.querySelector('.carta'), '::before').content !== 'none', mantel: !!window.__mantel }));
  await b.close(); srv.close();
  const bien = errores.length === 0 && !d.mandos && d.mantel && (queda === 'sobria' ? d.sobria && !d.marco : !d.sobria && d.marco);
  console.log(`Carga de la copia: ${bien ? 'ok' : 'MAL'} ${JSON.stringify({ ...d, errores })}`);
  process.exit(sobran.length || !bien ? 1 : 0);
})();
