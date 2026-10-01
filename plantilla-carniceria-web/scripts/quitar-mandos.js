// Comprueba la receta «Quitar los mandos» del README contra los archivos reales.
// Trabaja sobre una COPIA temporal: no toca la plantilla. node scripts/quitar-mandos.js
// Con --aplicar escribe el resultado en la plantilla (para entregar a un cliente).
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const RAIZ = path.join(__dirname, '..');
const aplicar = process.argv.includes('--aplicar');
const DEST = aplicar ? RAIZ : fs.mkdtempSync(path.join(os.tmpdir(), 'mouriscal-'));
const leer = f => fs.readFileSync(path.join(RAIZ, f), 'utf8');
const errores = [];
// Corta desde la línea que contiene `ini` hasta la que contiene `fin`, ambas incluidas.
// Sin comodines: anclas literales, cada una exactamente una vez.
function cortar(txt, ini, fin, nombre, maxLineas) {
  const l = txt.split(/\r?\n/);
  const a = l.filter(x => x.includes(ini)).length, b = l.filter(x => x.includes(fin)).length;
  if (a !== 1 || b !== 1) { errores.push(`${nombre}: ancla «${ini}» ×${a}, «${fin}» ×${b} (deben ser 1)`); return txt; }
  const i = l.findIndex(x => x.includes(ini)), j = l.findIndex(x => x.includes(fin));
  if (j < i || j - i + 1 > maxLineas) { errores.push(`${nombre}: bloque de ${j - i + 1} líneas, se esperaban ≤${maxLineas}`); return txt; }
  l.splice(i, j - i + 1);
  return l.join('\n');
}
const quitarLinea = (txt, frag, nombre) => { const l = txt.split(/\r?\n/); const n = l.filter(x => x.includes(frag)).length; if (n < 1) errores.push(`${nombre}: no está «${frag}»`); return l.filter(x => !x.includes(frag)).join('\n'); };
const reemplazar = (txt, a, b, nombre) => { if (!txt.includes(a)) { errores.push(`${nombre}: no está «${a}»`); return txt; } return txt.replace(a, b); };

let idx = leer('index.html');
idx = cortar(idx, '<!-- AVISO: mando de DEMOSTRACIÓN', '<!-- /mandos -->', 'index.html (mandos)', 20);
idx = cortar(idx, '// mandos:', '// /mandos', 'index.html (head)', 8);
idx = reemplazar(idx, ' y, si los tocas, los mandos de demostración de maqueta y color', '', 'index.html (cookies)');
let leg = leer('legal.html');
leg = cortar(leg, '// mandos:', '// /mandos', 'legal.html (head)', 8);
leg = quitarLinea(leg, 'mouriscal-maqueta', 'legal.html (lista)');
let js = leer('js/main.js');
js = cortar(js, '/* ---------- AVISO: mandos', '/* /mandos */', 'main.js', 45);
let css = leer('css/estilo.css');
css = cortar(css, '/* ---------- Mandos de demostración', '/* /mandos */', 'estilo.css', 16);
css = quitarLinea(css, '.paleta-azafran {', 'estilo.css'); css = quitarLinea(css, '.paleta-ciruela {', 'estilo.css');

if (!errores.length) {
  fs.mkdirSync(path.join(DEST, 'js'), { recursive: true }); fs.mkdirSync(path.join(DEST, 'css'), { recursive: true });
  fs.writeFileSync(path.join(DEST, 'index.html'), idx); fs.writeFileSync(path.join(DEST, 'legal.html'), leg);
  fs.writeFileSync(path.join(DEST, 'js/main.js'), js); fs.writeFileSync(path.join(DEST, 'css/estilo.css'), css);
  try { execFileSync(process.execPath, ['--check', path.join(DEST, 'js/main.js')]); } catch (e) { errores.push('main.js deja de ser JavaScript válido'); }
  for (const [f, t] of [['index.html', idx], ['legal.html', leg], ['js/main.js', js], ['css/estilo.css', css]]) {
    for (const rastro of ['mandos', 'mouriscal-maqueta', 'mouriscal-paleta', 'paleta-azafran', 'paleta-ciruela', 'data-paleta', 'data-maqueta', 'revision']) {
      if (t.includes(rastro)) errores.push(`${f}: queda «${rastro}»`);
    }
  }
}
if (errores.length) { console.log('✘ La receta no cuadra con los archivos:\n  ' + errores.join('\n  ')); process.exitCode = 1; }
else console.log(`✔ Receta comprobada${aplicar ? ' y aplicada' : ' sobre una copia en ' + DEST}: sin rastro de los mandos y main.js válido.`);
