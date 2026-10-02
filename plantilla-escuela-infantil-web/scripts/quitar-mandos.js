/* Quita los mandos de demostración (maqueta y paleta) para entregar a un
   cliente. Trabaja sobre una COPIA: node scripts/quitar-mandos.js <destino>
   Borra todo lo que hay entre cada «MANDOS-INICIO» y su «MANDOS-FIN»
   (marcas incluidas) en los cuatro archivos que los llevan, sin comodines:
   busca las marcas por posición, exige que estén emparejadas y se niega a
   escribir si un archivo pierde más líneas de las esperadas. Después
   comprueba que no queda rastro y que main.js sigue siendo JavaScript válido. */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ORIGEN = path.join(__dirname, '..');
const DESTINO = process.argv[2];
if (!DESTINO) { console.error('Uso: node scripts/quitar-mandos.js <carpeta-destino>'); process.exit(1); }
fs.cpSync(ORIGEN, DESTINO, { recursive: true, filter: s => !/[\\/](screenshots|\.git)([\\/]|$)/.test(s) });

/* Archivo → máximo de líneas que puede perder (salvaguarda, PLIEGO §6) */
const ARCHIVOS = { 'index.html': 50, 'aviso-legal.html': 8, 'css/estilo.css': 70, 'js/main.js': 50 };
const INI = 'MANDOS-INICIO', FIN = 'MANDOS-FIN';

for (const [rel, maxLineas] of Object.entries(ARCHIVOS)) {
  const ruta = path.join(DESTINO, rel);
  const texto = fs.readFileSync(ruta, 'utf8');
  if (texto.includes('\r\n')) throw new Error(rel + ': finales de línea CRLF; normalizar antes');
  let s = texto, n = 0;
  while (s.includes(INI)) {
    const i = s.indexOf(INI);
    const f = s.indexOf(FIN, i);
    const otro = s.indexOf(INI, i + INI.length);
    if (f < 0) throw new Error(rel + ': MANDOS-INICIO sin su MANDOS-FIN');
    if (otro >= 0 && otro < f) throw new Error(rel + ': marcas anidadas o desparejadas');
    /* El bloque empieza al principio del comentario que contiene la marca y
       acaba al final del comentario de cierre (o de la línea, si es bloque) */
    const antes = s.slice(s.lastIndexOf('\n', i) + 1, i).trimEnd();
    const esHtml = antes.endsWith('<!--');
    const abre = s.lastIndexOf(esHtml ? '<!--' : '/*', i);
    const cierraComentario = s.indexOf(esHtml ? '-->' : '*/', f) + (esHtml ? 3 : 2);
    let desde = abre, hasta = cierraComentario;
    const iniLinea = s.lastIndexOf('\n', desde) + 1;
    const finLinea = s.indexOf('\n', hasta);
    /* Si las marcas ocupan líneas enteras, se lleva también la línea */
    if (s.slice(iniLinea, desde).trim() === '' && s.slice(hasta, finLinea).trim() === '') { desde = iniLinea; hasta = finLinea + 1; }
    s = s.slice(0, desde) + s.slice(hasta);
    n++;
  }
  const perdidas = texto.split('\n').length - s.split('\n').length;
  if (perdidas > maxLineas) throw new Error(`${rel}: perdería ${perdidas} líneas (máximo ${maxLineas}); no se escribe`);
  fs.writeFileSync(ruta, s);
  if (fs.readFileSync(ruta, 'utf8') !== s) throw new Error(rel + ': la escritura no coincide');
  console.log(`${rel}: ${n} bloques fuera, ${perdidas} líneas menos`);
}

/* Comprobaciones */
const rastro = [];
for (const rel of Object.keys(ARCHIVOS)) {
  const s = fs.readFileSync(path.join(DESTINO, rel), 'utf8');
  for (const p of ['MANDOS', 'id="mandos"', 'maqueta-sobria', 'paleta-pino', 'paleta-malva', 'abaneo-maqueta', 'abaneo-paleta', 'data-maqueta', 'data-paleta', 'versión de revisión', 'class="ratio"']) {
    if (s.includes(p)) rastro.push(rel + ' → ' + p);
  }
}
execFileSync(process.execPath, ['--check', path.join(DESTINO, 'js/main.js')]);
if (rastro.length) { console.error('Queda rastro:\n  ' + rastro.join('\n  ')); process.exit(1); }
console.log('Sin rastro de los mandos y main.js válido. Copia limpia en ' + DESTINO);
