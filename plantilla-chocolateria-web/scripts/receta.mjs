// Comprueba la receta de borrado del README contra los archivos reales:
// aplica los cuatro pasos sobre copias en memoria y verifica que no queda
// rastro del mando y que el JS sigue siendo válido. No toca los originales.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const R = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const leer = (f) => readFileSync(path.join(R, f), 'utf8');
const fallos = [];
const entre = (txt, ini, fin, nombre) => {
  const a = txt.indexOf(ini), b = txt.indexOf(fin);
  if (a < 0 || b < 0 || b < a || txt.indexOf(ini, a + 1) > -1) { fallos.push(`${nombre}: marcas no encontradas o repetidas`); return txt; }
  return txt.slice(0, a) + txt.slice(b + fin.length);
};

// Paso 1: index.html
let html = leer('index.html');
html = entre(html, '<!-- MANDO DE DEMOSTRACIÓN: inicio', '<!-- MANDO DE DEMOSTRACIÓN: fin -->', 'index.html');
html = html.split('\n').filter((l) => !l.includes('// MANDO')).join('\n');
// Paso 2: css
let css = entre(leer('css/estilos.css'), '/* MANDO DE DEMOSTRACIÓN: inicio', '/* MANDO DE DEMOSTRACIÓN: fin */', 'estilos.css');
// Paso 3: js
let js = entre(leer('js/main.js'), '// MANDO DE DEMOSTRACIÓN: inicio', '// MANDO DE DEMOSTRACIÓN: fin', 'main.js');
// Paso 4: legal.html
let legal = leer('legal.html').split('\n').filter((l) => !l.includes('id="legal-mando"')).join('\n');

const prohibido = [/id="mando"/, /maq-sobria/, /pal-(coral|oro)/, /estalo-(maqueta|paleta)/, /es-revision/, /MANDO/];
for (const [n, t] of [['index.html', html], ['estilos.css', css], ['main.js', js], ['legal.html', legal]]) {
  for (const re of prohibido) if (re.test(t)) fallos.push(`${n}: queda ${re}`);
}
// El script del <head> tiene que seguir siendo JS válido tras quitar las líneas // MANDO.
const head = html.match(/<script>\s*\/\/ Script bloqueante[\s\S]*?<\/script>/);
const dir = mkdtempSync(path.join(tmpdir(), 'receta-'));
try {
  writeFileSync(path.join(dir, 'main.js'), js); execFileSync(process.execPath, ['--check', path.join(dir, 'main.js')]);
  writeFileSync(path.join(dir, 'head.js'), head[0].replace(/<\/?script>/g, '')); execFileSync(process.execPath, ['--check', path.join(dir, 'head.js')]);
} catch (e) { fallos.push('JS no válido tras la receta: ' + e.message); }
// Las llamadas que quedan fuera del bloque tienen que ser seguras sin él.
if (/[^'"]actualizarMando\(\)/.test(js.replace("typeof actualizarMando === 'function') actualizarMando()", ''))) fallos.push('main.js: llamada directa a actualizarMando fuera del bloque');

console.log(fallos.length ? 'RECETA ROTA:\n- ' + fallos.join('\n- ') : 'Receta comprobada: los 4 pasos dejan los archivos sin mando y con JS válido.');
process.exit(fallos.length ? 1 : 0);
