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
const paletas = { rubia: base, brezo: { ...base, ...tokens(bloque('html.paleta-brezo')) }, musgo: { ...base, ...tokens(bloque('html.paleta-musgo')) } };
const parejas = [
  ['tinta', 'papel', 4.5], ['tinta', 'panel', 4.5], ['tinta', 'crema', 4.5],
  ['tinta-apagada', 'papel', 4.5], ['tinta-apagada', 'panel', 4.5], ['tinta-apagada', 'crema', 4.5],
  ['rubia-hondo', 'papel', 4.5], ['rubia-hondo', 'panel', 4.5], ['rubia-hondo', 'crema', 4.5],
  ['crema', 'rubia-hondo', 7, 'botón'], ['crema', 'tinta', 7, 'botón'], ['tinta', 'crema', 7, 'botón claro'],
  ['crema', 'anil', 4.5], ['niebla', 'anil', 4.5], ['gualda', 'anil', 4.5], ['rubia-claro', 'anil', 3, 'texto grande'],
  ['niebla', 'anil-hondo', 4.5], ['crema', 'anil-hondo', 4.5], ['gualda', 'anil-hondo', 4.5],
  ['tinta', 'rubia-claro', 4.5, 'barras sobria'], ['tinta', 'gualda', 4.5],
];
let fallos = 0;
for (const [nombre, t] of Object.entries(paletas)) {
  console.log(`\n== ${nombre} (marca ${t.rubia}, hondo ${t['rubia-hondo']})`);
  for (const [a, b, min, nota] of parejas) {
    const r = ratio(t[a], t[b]);
    const ok = r >= min;
    if (!ok) fallos++;
    console.log(`${ok ? 'ok ' : 'MAL'} ${a.padEnd(14)} sobre ${b.padEnd(12)} ${r.toFixed(2).padStart(5)}:1  (mín ${min}${nota ? ', ' + nota : ''})`);
  }
}
// Comprobación de la derivación: las alternativas salen de rotar el matiz
console.log('\nDerivación OKLCH: brezo = rubia −90°, musgo = rubia +115°');
console.log('  rubia', base.rubia, '→', rotate(base.rubia, -90), rotate(base.rubia, 115));
console.log('  hondo', base['rubia-hondo'], '→', rotate(base['rubia-hondo'], -90), rotate(base['rubia-hondo'], 115), '(el verde se sale de gama y pierde croma: musgo-hondo se oscurece en L hasta #0F5D22 para recuperar el mismo 7,4:1 del botón original)');
console.log(fallos ? `\n${fallos} parejas por debajo del mínimo` : '\nTodas las parejas pasan');
process.exit(fallos ? 1 : 0);
