// Quita los mandos de demostración (maqueta y paleta) antes de entregar a un cliente.
// Borra cada región entre «MANDOS:INICIO» y «MANDOS:FIN» (las dos marcas incluidas,
// con el comentario que las envuelve) en index.html, legal.html, css y js.
//
//   node scripts/borrar-mandos.js --comprobar   → lo hace sobre una copia temporal y verifica
//   node scripts/borrar-mandos.js --aplicar     → lo hace en los archivos de verdad
//
// Sin comodines: cada marca se busca con indexOf, se cuentan antes las parejas y se
// niega a escribir si el archivo pierde más líneas de las que suman los bloques.
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const RAIZ = path.join(__dirname, '..');
const ARCHIVOS = ['index.html', 'legal.html', 'css/estilos.css', 'js/main.js'];
// cada formato de comentario, con lo que abre y lo que cierra la marca
const ENVOLTORIOS = [['<!--', '-->'], ['/*', '*/']];

function quitar(texto, nombre) {
  let out = texto, bloques = 0, lineasBloques = 0;
  for (;;) {
    const i = out.indexOf('MANDOS:INICIO');
    if (i < 0) break;
    const f = out.indexOf('MANDOS:FIN', i);
    if (f < 0) throw new Error(`${nombre}: MANDOS:INICIO sin su MANDOS:FIN`);
    const abre = ENVOLTORIOS.find(([a]) => out.lastIndexOf(a, i) >= 0 && out.lastIndexOf(a, i) > out.lastIndexOf('\n', i) - 1);
    if (!abre) throw new Error(`${nombre}: no encuentro el comentario que abre la marca`);
    let ini = out.lastIndexOf(abre[0], i);
    let fin = out.indexOf(abre[1], f);
    if (fin < 0) throw new Error(`${nombre}: no encuentro el cierre del comentario de MANDOS:FIN`);
    fin += abre[1].length;
    // si la región ocupa líneas enteras, se lleva también la sangría y el salto
    const inicioLinea = out.lastIndexOf('\n', ini - 1) + 1;
    const soloBlancoAntes = /^[ \t]*$/.test(out.slice(inicioLinea, ini));
    const finLinea = out.indexOf('\n', fin);
    const soloBlancoDespues = /^[ \t\r]*$/.test(out.slice(fin, finLinea < 0 ? out.length : finLinea));
    if (soloBlancoAntes && soloBlancoDespues) { ini = inicioLinea; fin = finLinea < 0 ? out.length : finLinea + 1; }
    const trozo = out.slice(ini, fin);
    lineasBloques += (trozo.match(/\n/g) || []).length;
    out = out.slice(0, ini) + out.slice(fin);
    bloques++;
  }
  const perdidas = (texto.match(/\n/g) || []).length - (out.match(/\n/g) || []).length;
  if (perdidas !== lineasBloques) throw new Error(`${nombre}: pierde ${perdidas} líneas y los bloques suman ${lineasBloques}; no escribo`);
  if (/mandos|paleta-xesta|paleta-lousa|piqueta-maqueta|piqueta-paleta/i.test(out.replace(/mostrarMandos/g, ''))) throw new Error(`${nombre}: queda alguna referencia a los mandos`);
  return { out, bloques, perdidas };
}

const modo = process.argv[2];
if (modo !== '--comprobar' && modo !== '--aplicar') { console.log('Uso: --comprobar | --aplicar'); process.exit(1); }
const destino = modo === '--aplicar' ? RAIZ : fs.mkdtempSync(path.join(os.tmpdir(), 'piqueta-sin-mandos-'));
if (modo === '--comprobar') fs.cpSync(RAIZ, destino, { recursive: true, filter: s => !s.includes('screenshots') });
let total = 0;
for (const a of ARCHIVOS) {
  const ruta = path.join(destino, a);
  const { out, bloques, perdidas } = quitar(fs.readFileSync(ruta, 'utf8'), a);
  fs.writeFileSync(ruta, out);
  if (fs.readFileSync(ruta, 'utf8') !== out) throw new Error(`${a}: la escritura no coincide`);
  console.log(`${a}: ${bloques} bloque(s), ${perdidas} línea(s) fuera`);
  total += bloques;
}
execFileSync(process.execPath, ['--check', path.join(destino, 'js/main.js')]);
console.log(`main.js sigue siendo JavaScript válido. ${total} bloques quitados en ${destino}`);
