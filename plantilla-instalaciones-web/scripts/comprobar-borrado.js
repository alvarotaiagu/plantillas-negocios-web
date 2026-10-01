// Aplica a una copia temporal la receta «Borrar los mandos» del README y comprueba
// que no queda rastro de los mandos y que el JavaScript sigue compilando.
// Uso: node scripts/comprobar-borrado.js   (no toca los archivos de la plantilla)
// Reglas (PLIEGO §6): anclas exactas, sin comodines, cada ancla única, y negarse a
// escribir si un archivo pierde más líneas de las previstas.
const fs = require('fs'), path = require('path'), os = require('os'), vm = require('vm');
const RAIZ = path.join(__dirname, '..');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'borrado-'));
let fallos = 0;
const ok = (n, c, d) => { if (!c) fallos++; console.log(`${c ? '✓' : '✗'} ${n}${d ? ' — ' + d : ''}`); };

function cortar(texto, desde, hasta, incluirHasta, archivo) {
  const i = texto.indexOf(desde);
  if (i < 0 || texto.indexOf(desde, i + 1) >= 0) throw new Error(`${archivo}: ancla de inicio ausente o repetida: ${desde.slice(0, 50)}`);
  const j = texto.indexOf(hasta, i + desde.length);
  if (j < 0) throw new Error(`${archivo}: ancla de fin ausente: ${hasta.slice(0, 50)}`);
  return texto.slice(0, i) + texto.slice(incluirHasta ? j + hasta.length : j);
}
function quitar(texto, literal, archivo, veces = 1) {
  const n = texto.split(literal).length - 1;
  if (n !== veces) throw new Error(`${archivo}: «${literal.slice(0, 60)}» aparece ${n} veces, se esperaban ${veces}`);
  return texto.split(literal).join('');
}
const pasos = {
  'index.html': [
    (t) => cortar(t, '<!-- MANDOS DE DEMOSTRACIÓN — NO VIAJAN', '<div class="cursor"', false, 'index.html'),
    (t) => cortar(t, "    try {\n      if (/[?&]revision\\b/", '    } catch (e) {}\n', true, 'index.html'),
    (t) => quitar(t, '  // MANDOS DE DEMOSTRACIÓN (maqueta y paleta): NO VIAJAN AL SITIO DE UN CLIENTE.\n  // Ver «Borrar los mandos» en el README. Solo se aplican con ?revision en la URL.\n', 'index.html'),
  ],
  'css/styles.css': [
    (t) => cortar(t, '/* MANDO DE PALETA — NO VIAJA', 'html.pal-brezo', false, 'styles.css'),
    (t) => cortar(t, 'html.pal-brezo', '\n', true, 'styles.css'),
    (t) => cortar(t, '/* ---------- Mandos de demostración', '/* ---------- Cursor propio', false, 'styles.css'),
  ],
  'js/main.js': [
    (t) => cortar(t, '  /* ---------- MANDOS DE DEMOSTRACIÓN', '  /* ---------- Remedir al cambiar de tamaño', false, 'main.js'),
    (t) => quitar(t, "  function mostrarMandos() { if (html.classList.contains('es-revision')) mandos.hidden = !cookies.hidden; }\n", 'main.js'),
    (t) => quitar(t, '  mostrarMandos();\n', 'main.js'),
    (t) => quitar(t, ' mostrarMandos();', 'main.js', 2),
    (t) => quitar(t, ", mandos = $('.mandos')", 'main.js'),
    (t) => quitar(t, ' (y los mandos se apartan mientras están en pantalla)', 'main.js'),
  ],
  'legal.html': [
    (t) => cortar(t, '    <li><code>idaeretorno-maqueta</code>', '</li>\n', true, 'legal.html'),
  ],
};
const MAX_PERDIDAS = { 'index.html': 30, 'css/styles.css': 14, 'js/main.js': 32, 'legal.html': 1 };

for (const [archivo, fs_] of Object.entries(pasos)) {
  const original = fs.readFileSync(path.join(RAIZ, archivo), 'utf8').replace(/\r\n/g, '\n');
  let t = original;
  try { fs_.forEach((f) => { t = f(t); }); } catch (e) { ok(`${archivo}: receta aplicable`, false, e.message); continue; }
  const perdidas = original.split('\n').length - t.split('\n').length;
  if (perdidas > MAX_PERDIDAS[archivo] || perdidas <= 0) { ok(`${archivo}: líneas borradas dentro de lo previsto`, false, `${perdidas} (máx. ${MAX_PERDIDAS[archivo]})`); continue; }
  ok(`${archivo}: receta aplicada`, true, `${perdidas} líneas menos`);
  const destino = path.join(TMP, archivo);
  fs.mkdirSync(path.dirname(destino), { recursive: true }); fs.writeFileSync(destino, t);
  const restos = (t.match(/class="mandos|\.mandos|\.mando\b|mostrarMandos|data-maqueta|data-paleta|idaeretorno-(maqueta|paleta)|pal-laton|pal-brezo|es-revision|\?revision/gi) || []);
  ok(`${archivo}: sin rastro de los mandos`, restos.length === 0, restos.join(', '));
  if (archivo.endsWith('.js')) { try { new vm.Script(t); ok('main.js compila tras el borrado', true); } catch (e) { ok('main.js compila tras el borrado', false, e.message); } }
  if (archivo === 'index.html') {
    const head = t.slice(t.indexOf('<script>'), t.indexOf('</script>'));
    try { new vm.Script(head.replace('<script>', '')); ok('script del <head> compila tras el borrado', true); } catch (e) { ok('script del <head> compila tras el borrado', false, e.message); }
  }
}
console.log(`\nCopia en ${TMP}`);
process.exit(fallos ? 1 : 0);
