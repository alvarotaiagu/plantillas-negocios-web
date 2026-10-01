// Contraste WCAG de cada pareja texto/fondo de la paleta. Se ejecuta con: node scripts/contraste.js
// Las cifras se calculan antes de escribir el CSS, no se suponen.
const hex = h => h.replace('#','').match(/../g).map(x => parseInt(x,16)/255);
const lin = c => c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4);
const L = h => { const [r,g,b] = hex(h).map(lin); return 0.2126*r + 0.7152*g + 0.0722*b; };
const ratio = (a,b) => { const [x,y] = [L(a),L(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05); };

const P = {
  corcho:'#C9A57E', corcho2:'#B99268', espuma:'#F3ECE2', caucho:'#1D1A16', caucho2:'#2A2520',
  apagadoCorcho:'#3E2D1E', apagadoEspuma:'#5E4E3E', apagadoCaucho:'#BDAF9C',
  mar:'#16475A', marTexto:'#0F3A4A', granateTexto:'#5C2230', musgoTexto:'#283C16', marClaro:'#8EC3D3', coral:'#E2683F',
  // alternativas derivadas: mismo L que «mar», matiz rotado
  granate:'#6A2A35', granateClaro:'#E3A3AE', musgo:'#33491F', musgoClaro:'#B4CE8F',
};
const parejas = [
  ['caucho','corcho',7],['caucho','corcho2',4.5],['caucho','espuma',7],['apagadoCorcho','corcho',4.5],['apagadoCorcho','corcho2',4.5],
  ['apagadoEspuma','espuma',4.5],['espuma','caucho',7],['apagadoCaucho','caucho',4.5],['apagadoCaucho','caucho2',4.5],
  ['espuma','mar',7],['mar','espuma',7],['marTexto','corcho',4.5],['marClaro','caucho',4.5],['caucho','coral',4.5],
  ['espuma','granate',7],['granateTexto','corcho',4.5],['granate','espuma',7],['granateClaro','caucho',4.5],
  ['espuma','musgo',7],['musgoTexto','corcho',4.5],['musgo','espuma',7],['musgoClaro','caucho',4.5],
];
let mal = 0;
for (const [t,f,min] of parejas) {
  const r = ratio(P[t],P[f]); const ok = r >= min; if(!ok) mal++;
  console.log(`${ok?'ok ':'MAL'} ${t.padEnd(14)} sobre ${f.padEnd(9)} ${r.toFixed(2)}:1 (mín ${min})`);
}
process.exit(mal?1:0);
