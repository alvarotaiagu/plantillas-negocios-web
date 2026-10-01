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
  abismo:'#040B0F', fondo:'#07141A', panel:'#0C1D24', panel2:'#12262F', linea:'#1E3843',
  pizarra:'#3D5965', humo:'#98B0B8', espuma:'#E6F0EF', vidrio:'#8CE0CC',
  cortina:'#D9E6E4', tintaClara:'#0A1A20', humoClaro:'#3F5761',
};
const alt = { xeo: derivar(T.vidrio, 42), liquen: derivar(T.vidrio, -95) };
console.log('Acento original', T.vidrio, '· derivadas:', alt);
const fondos = ['abismo','fondo','panel','panel2'];
let peor = 99, filas = [];
const chk = (tx, fg, bg, min) => { const r = ratio(fg, bg); peor = Math.min(peor, r/min); filas.push(`${r >= min ? 'ok ' : 'MAL'} ${tx.padEnd(34)} ${r.toFixed(2)}:1 (mín ${min})`); };
for (const f of fondos) { chk(`espuma / ${f}`, T.espuma, T[f], 4.5); chk(`humo / ${f}`, T.humo, T[f], 4.5); }
for (const [n, a] of [['vidrio', T.vidrio], ['xeo', alt.xeo], ['liquen', alt.liquen]]) {
  for (const f of fondos) chk(`${n} (texto) / ${f}`, a, T[f], 4.5);
  chk(`fondo sobre botón ${n}`, T.fondo, a, 7);
}
chk('tinta / cortina', T.tintaClara, T.cortina, 4.5);
chk('humo claro / cortina', T.humoClaro, T.cortina, 4.5);
chk('pizarra / fondo (filete, no texto)', T.pizarra, T.fondo, 1.9);
console.log(filas.join('\n'));
const mal = filas.filter(f => f.startsWith('MAL'));
console.log(mal.length ? `\n${mal.length} parejas por debajo` : `\nTodas las parejas (${filas.length}) cumplen.`);
process.exit(mal.length ? 1 : 0);
