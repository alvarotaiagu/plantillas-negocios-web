// Receta de borrado de los mandos de demostración, ejecutable y comprobada.
// Copia la plantilla a una carpeta nueva y deja el sitio como lo vería un cliente:
//   node scripts/quita-mandos.js --densidad=apoyos|sobria --paleta=mar|granate|musgo --destino=../cliente
// Cada paso se hace con anclas exactas (sin comodines) y el script se niega a seguir
// si un ancla no aparece exactamente una vez o si un archivo pierde más líneas de las previstas.
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const arg = (k, d) => (process.argv.find(a => a.startsWith('--' + k + '=')) || '=' + d).split('=')[1];
const densidad = arg('densidad', 'apoyos'), paleta = arg('paleta', 'mar');
const ORIGEN = path.join(__dirname, '..');
const DESTINO = path.resolve(arg('destino', path.join(require('os').tmpdir(), 'branavella-cliente')));
if (!['apoyos', 'sobria'].includes(densidad) || !['mar', 'granate', 'musgo'].includes(paleta)) throw new Error('densidad o paleta no válidas');

fs.rmSync(DESTINO, { recursive: true, force: true });
fs.cpSync(ORIGEN, DESTINO, { recursive: true, filter: s => !/screenshots|node_modules|\.git$/.test(s) });
const leer = f => fs.readFileSync(path.join(DESTINO, f), 'utf8');
const escribir = (f, s, maxPerdidas) => {
  const antes = leer(f).split('\n').length, despues = s.split('\n').length;
  if (antes - despues > maxPerdidas) throw new Error(`${f}: perdería ${antes - despues} líneas (máximo previsto ${maxPerdidas})`);
  fs.writeFileSync(path.join(DESTINO, f), s);
  console.log(`  ${f}: ${antes} → ${despues} líneas`);
};
const una = (s, ancla, f) => { const n = s.split(ancla).length - 1; if (n !== 1) throw new Error(`${f}: el ancla «${ancla.slice(0, 50)}» aparece ${n} veces`); return s.indexOf(ancla); };
// Quita desde el principio de la línea del ancla inicial hasta el final de la línea del ancla final.
const quitaBloque = (s, ini, fin, f) => {
  const a = s.lastIndexOf('\n', una(s, ini, f)) + 1;
  const bFin = una(s, fin, f) + fin.length;
  const b = s.indexOf('\n', bFin);
  return s.slice(0, a) + s.slice(b + 1);
};
const cambia = (s, de, a, f) => { una(s, de, f); return s.replace(de, a); };

console.log(`Receta: densidad «${densidad}», paleta «${paleta}» → ${DESTINO}`);

// 1. index.html
let h = leer('index.html');
h = quitaBloque(h, '// ── MANDOS DE DEMOSTRACIÓN', '// ── FIN MANDOS DE DEMOSTRACIÓN ──', 'index.html');
h = quitaBloque(h, '<!-- ── MANDO DE DEMOSTRACIÓN', '<!-- ── FIN MANDO DE DEMOSTRACIÓN ── -->', 'index.html');
h = cambia(h, '<span class="cookies-revision"> y, en modo revisión, la maqueta y el color elegidos</span>', '', 'index.html');
if (densidad === 'apoyos') h = quitaBloque(h, '<!-- Solo en la versión sobria', '</figure><!-- fin comparativa -->', 'index.html');
else h = cambia(h, '<html lang="es" class="sin-js">', '<html lang="es" class="sin-js densidad-sobria">', 'index.html');
escribir('index.html', h, densidad === 'apoyos' ? 36 : 30);

// 2. js/main.js
let j = leer('js/main.js');
j = quitaBloque(j, '// ── MANDO DE DEMOSTRACIÓN', '// ── FIN MANDO DE DEMOSTRACIÓN ──', 'js/main.js');
escribir('js/main.js', j, 30);

// 3. css/style.css
let c = leer('css/style.css');
const VALORES = { granate: ['#6A2A35', '#4C1C25', '#5C2230', '#E3A3AE', '#E0C9CD'], musgo: ['#33491F', '#233414', '#283C16', '#B4CE8F', '#D3DCC7'] };
c = quitaBloque(c, '/* ── PALETAS DE DEMOSTRACIÓN', '/* ── FIN PALETAS DE DEMOSTRACIÓN ── */', 'css/style.css');
if (paleta !== 'mar') {
  const v = VALORES[paleta];
  c = cambia(c, '  --mar: #16475A;', '  --mar: ' + v[0] + ';', 'css');
  c = cambia(c, '  --mar-osc: #0E3241;', '  --mar-osc: ' + v[1] + ';', 'css');
  c = cambia(c, '  --mar-texto: #0F3A4A;', '  --mar-texto: ' + v[2] + ';', 'css');
  c = cambia(c, '  --mar-claro: #8EC3D3;', '  --mar-claro: ' + v[3] + ';', 'css');
  c = cambia(c, '  --pasada: #C9D3D6;', '  --pasada: ' + v[4] + ';', 'css');
}
c = quitaBloque(c, '/* ─────────── Mando de demostración', '/* ── fin mando ── */', 'css/style.css');
c = cambia(c, '.cookies-revision { display: none; }\nhtml.en-revision .cookies-revision { display: inline; }\n', '', 'css');
if (densidad === 'apoyos') c = quitaBloque(c, '/* ═════════ Versión SOBRIA', '/* ═════════ fin versión SOBRIA ═════════ */', 'css/style.css');
escribir('css/style.css', c, densidad === 'apoyos' ? 50 : 20);

// 4. legal.html
let l = leer('legal.html');
l = quitaBloque(l, '<li><strong>branavella-densidad</strong>', 'Una web real no los tendría.</li>', 'legal.html');
escribir('legal.html', l, 3);

// 5. Comprobación
execSync('node --check ' + JSON.stringify(path.join(DESTINO, 'js/main.js')));
const todo = ['index.html', 'js/main.js', 'css/style.css', 'legal.html'].map(leer).join('\n');
const restos = ['class="mando"', 'data-paleta', 'data-densidad', 'branavella-paleta', 'branavella-densidad', 'revision', 'paleta-granate', 'paleta-musgo', 'PALETAS DE DEMOSTRACIÓN', '.mando']
  .filter(r => todo.includes(r));
if (densidad === 'apoyos' && (leer('css/style.css') + leer('index.html')).includes('densidad-sobria')) restos.push('densidad-sobria');
if (restos.length) throw new Error('Quedan restos de los mandos: ' + restos.join(', '));
console.log('OK: sin restos de los mandos; main.js compila. El sitio del cliente está en ' + DESTINO);
