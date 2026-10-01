// Contraste WCAG de cada pareja texto/fondo y derivación de las dos paletas
// alternativas (rotación de matiz en OKLCH conservando L y C). Uso: node scripts/contraste.js
const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
const lin = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const delin = c => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const lum = h => { const [r, g, b] = hex2rgb(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
function toOklch(h) {
  const [r, g, b] = hex2rgb(h).map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(A, B), (Math.atan2(B, A) * 180 / Math.PI + 360) % 360];
}
function fromOklch([L, C, H]) {
  // reduce el croma hasta que el color cabe en sRGB
  for (let c = C; c >= 0; c -= 0.002) {
    const a = c * Math.cos(H * Math.PI / 180), b = c * Math.sin(H * Math.PI / 180);
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
    if (rgb.every(v => v >= -1e-4 && v <= 1.0001))
      return '#' + rgb.map(v => Math.round(Math.min(1, Math.max(0, delin(v))) * 255).toString(16).padStart(2, '0')).join('');
  }
}
const base = {
  fondo: '#12100E', panel: '#1A1714', panel2: '#221E1A', yeso: '#E9E2D6', yeso2: '#DDD4C5',
  hueso: '#F2ECE3', humo: '#B5AB9E', tinta: '#1B1714', tintaSuave: '#5B5047',
};
const acentos = { quente: '#FF7654', fria: '#4DB8F0', quenteTexto: '#A22C16', friaTexto: '#1A5885' };
const rot = { Circuito: 0, Latón: 32, Brezo: -48 };
const pal = {};
for (const [n, d] of Object.entries(rot)) {
  pal[n] = {};
  for (const [k, v] of Object.entries(acentos)) {
    const o = toOklch(v); pal[n][k] = d === 0 ? v : fromOklch([o[0], o[1], (o[2] + d + 360) % 360]);
  }
}
let fallos = 0;
const check = (n, a, b, min) => { const r = ratio(a, b); if (r < min) fallos++; console.log(`${r < min ? '✗' : '✓'} ${r.toFixed(2).padStart(5)}  ${n} (${a} / ${b}) mín ${min}`); };
console.log('— Neutros (no cambian entre paletas)');
for (const f of ['fondo', 'panel', 'panel2']) { check(`hueso/${f}`, base.hueso, base[f], 4.5); check(`humo/${f}`, base.humo, base[f], 4.5); }
for (const f of ['yeso', 'yeso2']) { check(`tinta/${f}`, base.tinta, base[f], 4.5); check(`tintaSuave/${f}`, base.tintaSuave, base[f], 4.5); }
for (const [n, p] of Object.entries(pal)) {
  console.log(`— Paleta ${n}: ${JSON.stringify(p)}`);
  for (const f of ['fondo', 'panel', 'panel2']) { check(`quente/${f}`, p.quente, base[f], 4.5); check(`fria/${f}`, p.fria, base[f], 4.5); }
  check('botón fondo/quente', base.fondo, p.quente, 7); check('botón fondo/fria', base.fondo, p.fria, 7);
  for (const f of ['yeso', 'yeso2']) { check(`quenteTexto/${f}`, p.quenteTexto, base[f], 4.5); check(`friaTexto/${f}`, p.friaTexto, base[f], 4.5); }
  check('botón yeso/quenteTexto', base.yeso, p.quenteTexto, 4.5);
}
console.log(fallos ? `\n${fallos} parejas por debajo` : '\nTodas las parejas cumplen');
process.exit(fallos ? 1 : 0);
