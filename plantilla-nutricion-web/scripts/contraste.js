// Contraste WCAG de cada pareja texto/fondo que existe en la web, en las tres
// paletas del mando. Lee los tokens del propio CSS (no de memoria).
// node scripts/contraste.js
const fs = require('fs');
const path = require('path');
const { ratio, rotate } = require('./color');
const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'estilos.css'), 'utf8');
const bloque = (sel) => { const m = css.match(new RegExp(sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\{([^}]*)\\}')); return m ? m[1] : ''; };
const tokens = (txt) => Object.fromEntries([...txt.matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{6})/g)].map((m) => [m[1], m[2].toUpperCase()]));
const base = tokens(bloque(':root'));
const paletas = { albahaca: base, loza: { ...base, ...tokens(bloque('html.paleta-loza')) }, ocre: { ...base, ...tokens(bloque('html.paleta-ocre')) } };
const parejas = [
  ['tinta', 'papel', 4.5], ['tinta', 'panel', 4.5], ['tinta', 'crema', 4.5],
  ['tinta-apagada', 'papel', 4.5], ['tinta-apagada', 'panel', 4.5], ['tinta-apagada', 'crema', 4.5],
  ['albahaca-honda', 'papel', 4.5], ['albahaca-honda', 'panel', 4.5], ['albahaca-honda', 'crema', 4.5],
  ['tomate-texto', 'papel', 4.5], ['tomate-texto', 'crema', 4.5],
  ['crema', 'albahaca-honda', 7, 'botón'], ['crema', 'tinta', 7, 'botón'], ['tinta', 'crema', 7, 'botón claro'],
  ['crema', 'noche', 4.5], ['niebla', 'noche', 4.5], ['limon', 'noche', 4.5], ['niebla', 'noche-2', 4.5], ['limon', 'noche-2', 4.5],
  ['crema', 'tomate-texto', 4.5, 'sello «este mes»'], ['tinta', 'albahaca-clara', 4.5],
];
let fallos = 0;
for (const [nombre, t] of Object.entries(paletas)) {
  console.log(`\n== ${nombre} (marca ${t.albahaca}, honda ${t['albahaca-honda']})`);
  for (const [a, b, min, nota] of parejas) {
    const r = ratio(t[a], t[b]);
    const ok = r >= min;
    if (!ok) fallos++;
    console.log(`${ok ? 'ok ' : 'MAL'} ${a.padEnd(14)} sobre ${b.padEnd(12)} ${r.toFixed(2).padStart(5)}:1  (mín ${min}${nota ? ', ' + nota : ''})`);
  }
}
// Comprobación de la derivación: las alternativas salen de rotar el matiz
console.log('\nDerivación OKLCH: loza = albahaca +100°, ocre = albahaca −75°');
console.log('  albahaca', base.albahaca, '→', rotate(base.albahaca, 100), rotate(base.albahaca, -75));
console.log('  honda', base['albahaca-honda'], '→', rotate(base['albahaca-honda'], 100), rotate(base['albahaca-honda'], -75));
console.log(fallos ? `\n${fallos} parejas por debajo del mínimo` : '\nTodas las parejas pasan');
process.exit(fallos ? 1 : 0);
