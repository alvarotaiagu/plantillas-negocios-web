// Contraste WCAG de los tokens de la plantilla y derivación de las dos paletas
// alternativas (rotación de matiz en OKLCH conservando L y C). Uso: node scripts/contraste.js
const hex = h => [1,3,5].map(i => parseInt(h.slice(i,i+2),16)/255);
const lin = c => c <= 0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4);
const L = h => { const [r,g,b] = hex(h).map(lin); return 0.2126*r+0.7152*g+0.0722*b; };
const ratio = (a,b) => { const x=L(a), y=L(b); return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05); };
function toOklch(h){ const [r,g,b]=hex(h).map(lin);
  const l=Math.cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b), m=Math.cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b), s=Math.cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b);
  const LL=0.2104542553*l+0.7936177850*m-0.0040720468*s, A=1.9779984951*l-2.4285922050*m+0.4505937099*s, B=0.0259040371*l+0.7827717662*m-0.8086757660*s;
  return [LL, Math.hypot(A,B), Math.atan2(B,A)*180/Math.PI]; }
function fromOklch([LL,C,H]){ const A=C*Math.cos(H*Math.PI/180), B=C*Math.sin(H*Math.PI/180);
  const l=(LL+0.3963377774*A+0.2158037573*B)**3, m=(LL-0.1055613458*A-0.0638541728*B)**3, s=(LL-0.0894841775*A-1.2914855480*B)**3;
  const rgb=[4.0767416621*l-3.3077115913*m+0.2309699292*s, -1.2684380046*l+2.6097574011*m-0.3413193965*s, -0.0041960863*l-0.7034186147*m+1.7076147010*s];
  const g=c=>{c=Math.min(1,Math.max(0,c)); c=c<=0.0031308?12.92*c:1.055*Math.pow(c,1/2.4)-0.055; return Math.round(c*255).toString(16).padStart(2,'0');};
  return '#'+rgb.map(g).join(''); }
// Busca, para un matiz dado, el croma máximo <= C que cabe en sRGB sin recorte
function rot(h, dH){ const [LL,C,H]=toOklch(h); let c=C; let out;
  for(;c>0;c-=0.002){ const A=c*Math.cos((H+dH)*Math.PI/180), B=c*Math.sin((H+dH)*Math.PI/180);
    const l=(LL+0.3963377774*A+0.2158037573*B)**3, m=(LL-0.1055613458*A-0.0638541728*B)**3, s=(LL-0.0894841775*A-1.2914855480*B)**3;
    const rgb=[4.0767416621*l-3.3077115913*m+0.2309699292*s,-1.2684380046*l+2.6097574011*m-0.3413193965*s,-0.0041960863*l-0.7034186147*m+1.7076147010*s];
    if(rgb.every(v=>v>=-0.001&&v<=1.001)){ out=fromOklch([LL,c,H+dH]); break; } }
  return out; }
const T = {
  papel:'#F4F1EA', panel:'#E9E4D8', crema:'#FBFAF6', tinta:'#16161A', gris:'#55545C', linea:'#D3CCBC',
  marca:'#E6007E', marcaTexto:'#A8005C', blanco:'#FFFFFF', negro:'#16161A',
};
const P = process.argv.includes('--paletas');
module.exports = { ratio, toOklch, rot };
if (require.main === module) {
  const pares = [
    ['tinta','papel'],['tinta','panel'],['gris','papel'],['gris','panel'],['gris','crema'],
    ['marcaTexto','papel'],['marcaTexto','panel'],['marcaTexto','crema'],['blanco','marcaTexto'],['tinta','marca'],['blanco','marca'],['crema','tinta'],
  ];
  const out = (t, label) => { console.log('\n== '+label); for (const [a,b] of pares) console.log(`${a.padEnd(11)} ${t[a]} sobre ${b.padEnd(7)} ${t[b]}  ${ratio(t[a],t[b]).toFixed(2)}:1`); };
  out(T,'Magenta (real)');
  for (const [nombre,dH] of [['Cian',-140],['Bermellón',+32]]) {
    const t = {...T, marca: rot(T.marca,dH), marcaTexto: rot(T.marcaTexto,dH)};
    out(t, `${nombre} (h ${dH>0?'+':''}${dH}°) marca=${t.marca} texto=${t.marcaTexto}`);
  }
  console.log('\nOKLCH marca', toOklch(T.marca).map(v=>v.toFixed(3)).join(' '));
}
