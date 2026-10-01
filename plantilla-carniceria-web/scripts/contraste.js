// Contraste WCAG de cada pareja texto/fondo de la paleta. node scripts/contraste.js
const lum = h => { const c = h.match(/\w\w/g).map(x => parseInt(x, 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + .05) / (y + .05); };
const base = { azulejo: '#E4EBE5', panel: '#D5DFD7', papel: '#F8F9F5', tinta: '#241013', tinta2: '#56403F', mostrador: '#173F35', mostrador2: '#1E4B40', hueso: '#F3EADF', hueso2: '#BFD0C7' };
const paletas = {
  lomo:    { acento: '#D8573F', texto: '#A0321D', boton: '#8E2A17', claro: '#F49A7F' },
  azafran: { acento: '#C98A1E', texto: '#7F5608', boton: '#6E4A05', claro: '#EDC067' },
  ciruela: { acento: '#D2588F', texto: '#9A2C5E', boton: '#86244F', claro: '#F09BC0' },
};
const filas = [];
const chk = (n, a, b, min) => { const r = ratio(a, b); filas.push([n, a, b, r.toFixed(2), r >= min ? 'ok' : 'FALLA']); };
for (const f of ['azulejo', 'panel', 'papel']) { chk(`tinta/${f}`, base.tinta, base[f], 4.5); chk(`tinta2/${f}`, base.tinta2, base[f], 4.5); }
for (const f of ['mostrador', 'mostrador2']) { chk(`hueso/${f}`, base.hueso, base[f], 4.5); chk(`hueso2/${f}`, base.hueso2, base[f], 4.5); }
for (const [n, p] of Object.entries(paletas)) {
  for (const f of ['azulejo', 'panel', 'papel']) chk(`${n}.texto/${f}`, p.texto, base[f], 4.5);
  chk(`${n}.papel/boton`, base.papel, p.boton, 7);
  chk(`${n}.tinta/acento`, base.tinta, p.acento, 4.5);
  for (const f of ['mostrador', 'mostrador2']) chk(`${n}.claro/${f}`, p.claro, base[f], 4.5);
}
console.table(filas.map(([n, a, b, r, e]) => ({ pareja: n, texto: a, fondo: b, ratio: r, estado: e })));
process.exitCode = filas.some(f => f[4] === 'FALLA') ? 1 : 0;
