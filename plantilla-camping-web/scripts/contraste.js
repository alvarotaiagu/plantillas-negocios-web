// Calcula el contraste WCAG de cada pareja de tokens y deriva las dos paletas
// alternativas rotando el matiz del acento (PLIEGO §5, control de paleta).
// Uso: node scripts/contraste.js
const hex2rgb = h => [1,3,5].map(i => parseInt(h.slice(i,i+2),16)/255);
const lin = c => c <= .03928 ? c/12.92 : Math.pow((c+.055)/1.055, 2.4);
const L = h => { const [r,g,b] = hex2rgb(h).map(lin); return .2126*r+.7152*g+.0722*b; };
const ratio = (a,b) => { const x=L(a), y=L(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); };
function rgb2hsl([r,g,b]){const M=Math.max(r,g,b),m=Math.min(r,g,b);let h=0,s=0,l=(M+m)/2;if(M!==m){const d=M-m;s=l>.5?d/(2-M-m):d/(M+m);h=M===r?(g-b)/d+(g<b?6:0):M===g?(b-r)/d+2:(r-g)/d+4;h*=60;}return[h,s,l];}
function hsl2hex(h,s,l){const f=n=>{const k=(n+h/30)%12,a=s*Math.min(l,1-l);return l-a*Math.max(-1,Math.min(k-3,9-k,1));};return '#'+[f(0),f(8),f(4)].map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('').toUpperCase();}
// Rota el matiz y reajusta la luminosidad HSL hasta igualar la luminancia relativa del original.
function derivar(base, giro){const [h,s,l]=rgb2hsl(hex2rgb(base));const objetivo=L(base);let lo=0,hi=1,out;for(let i=0;i<40;i++){const mid=(lo+hi)/2;out=hsl2hex((h+giro+360)%360,s,mid);if(L(out)<objetivo)lo=mid;else hi=mid;}return out;}

const T = {
  lona: '#EFE7D6', lona2: '#E4D9C3', crudo: '#F8F3EA', tinta: '#1F2A22', musgo: '#4A5A44',
  cuerda: '#D2502A', cuerdaTexto: '#8A2E10', noche: '#17211B', noche2: '#202C24', hueso: '#F1ECE2', niebla: '#B4BCAF', cuerdaClara: '#F2895C',
};
const alt = { xesta: derivar(T.cuerdaTexto, 48), lousa: derivar(T.cuerdaTexto, -150) };
const altClara = { xesta: derivar(T.cuerdaClara, 48), lousa: derivar(T.cuerdaClara, -150) };
const altSup = { xesta: derivar(T.cuerda, 48), lousa: derivar(T.cuerda, -150) };
console.log('Derivadas (texto):', alt, '(clara):', altClara, '(superficie):', altSup);
let filas = [];
const chk = (tx, fg, bg, min) => { const r = ratio(fg, bg); filas.push(`${r >= min ? 'ok ' : 'MAL'} ${tx.padEnd(36)} ${r.toFixed(2)}:1 (mín ${min})`); };
for (const f of ['lona', 'lona2', 'crudo']) { chk(`tinta / ${f}`, T.tinta, T[f], 4.5); chk(`musgo / ${f}`, T.musgo, T[f], 4.5); }
for (const [n, c, cc] of [['cuerda', T.cuerdaTexto, T.cuerdaClara], ['xesta', alt.xesta, altClara.xesta], ['lousa', alt.lousa, altClara.lousa]]) {
  for (const f of ['lona', 'lona2', 'crudo']) chk(`${n} texto / ${f}`, c, T[f], 4.5);
  chk(`crudo sobre botón ${n}`, T.crudo, c, 7);
  for (const f of ['noche', 'noche2']) chk(`${n} clara / ${f}`, cc, T[f], 4.5);
}
for (const f of ['noche', 'noche2']) { chk(`hueso / ${f}`, T.hueso, T[f], 4.5); chk(`niebla / ${f}`, T.niebla, T[f], 4.5); }
chk('cortina (cuerda sup.) vs lona: distinta', T.cuerda, T.lona, 1.5);
console.log(filas.join('\n'));
const mal = filas.filter(f => f.startsWith('MAL'));
console.log(mal.length ? `\n${mal.length} parejas por debajo` : `\nTodas las parejas (${filas.length}) cumplen.`);
process.exit(mal.length ? 1 : 0);
