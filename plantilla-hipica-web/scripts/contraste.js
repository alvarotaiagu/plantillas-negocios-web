// Contraste WCAG de cada pareja texto/fondo de la paleta. node scripts/contraste.js
const hex = h => h.replace('#','').match(/../g).map(x => parseInt(x,16)/255);
const lin = c => c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4);
const L = h => { const [r,g,b] = hex(h).map(lin); return 0.2126*r + 0.7152*g + 0.0722*b; };
const ratio = (a,b) => { const [x,y] = [L(a),L(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05); };
const P = {
  prado:'#1D2B1B', prado2:'#283A25', heno:'#E3CC88', nata:'#F3EEE1', avena:'#E6DCC3', tinta:'#1B1A14',
  apagadoNata:'#585141', apagadoAvena:'#4F4839', apagadoPrado:'#B7C1A6',
  casaca:'#8A2923', casacaClaro:'#F2A08E',
  azul:'#22457C', azulClaro:'#A9C2F0', ocre:'#5E4710', ocreClaro:'#E9C97A',
};
const parejas = [
  ['tinta','nata',7],['tinta','avena',7],['apagadoNata','nata',4.5],['apagadoAvena','avena',4.5],['apagadoNata','avena',4.5],
  ['nata','prado',7],['heno','prado',4.5],['heno','prado2',4.5],['apagadoPrado','prado',4.5],['apagadoPrado','prado2',4.5],
  ['nata','casaca',7],['casaca','nata',7],['casaca','avena',4.5],['casacaClaro','prado',4.5],
  ['nata','azul',7],['azul','nata',7],['azul','avena',4.5],['azulClaro','prado',4.5],
  ['nata','ocre',7],['ocre','nata',7],['ocre','avena',4.5],['ocreClaro','prado',4.5],
  ['tinta','heno',7],
];
let mal = 0;
for (const [t,f,min] of parejas) { const r = ratio(P[t],P[f]); if (r < min) mal++; console.log(`${r>=min?'ok ':'MAL'} ${t.padEnd(13)} sobre ${f.padEnd(8)} ${r.toFixed(2)}:1 (mín ${min})`); }
process.exit(mal?1:0);
