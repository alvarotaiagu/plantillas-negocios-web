// Calcula las paletas derivadas (rotación de matiz en OKLCH conservando L y C)
// y el contraste WCAG de cada pareja texto/fondo. Uso: node scripts/paleta.js
const hex2rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);
const lin=c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4;
const delin=c=>c<=0.0031308?12.92*c:1.055*c**(1/2.4)-0.055;
const lum=h=>{const[r,g,b]=hex2rgb(h).map(lin);return .2126*r+.7152*g+.0722*b};
const cr=(a,b)=>{const[x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return (x+.05)/(y+.05)};
function toOklch(h){const[r,g,b]=hex2rgb(h).map(lin);
 const l=Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b),m=Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b),s=Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);
 const L=.2104542553*l+.793617785*m-.0040720468*s,A=1.9779984951*l-2.428592205*m+.4505937099*s,B=.0259040371*l+.7827717662*m-.808675766*s;
 return [L,Math.hypot(A,B),Math.atan2(B,A)*180/Math.PI]}
function fromOklch([L,C,H]){const A=C*Math.cos(H*Math.PI/180),B=C*Math.sin(H*Math.PI/180);
 const l=(L+.3963377774*A+.2158037573*B)**3,m=(L-.1055613458*A-.0638541728*B)**3,s=(L-.0894841775*A-1.291485548*B)**3;
 let rgb=[4.0767416621*l-3.3077115913*m+.2309699292*s,-1.2684380046*l+2.6097574011*m-.3413193965*s,-.0041960863*l-.7034186147*m+1.707614701*s];
 return '#'+rgb.map(c=>Math.round(Math.min(1,Math.max(0,delin(c)))*255).toString(16).padStart(2,'0')).join('').toUpperCase()}
// Fit chroma into gamut by reducing C until round-trip is close
function rot(h,d){let[L,C,H]=toOklch(h);for(let k=0;k<40;k++){const o=fromOklch([L,C,H+d]);const back=toOklch(o);if(Math.abs(back[1]-C)<.01&&Math.abs(back[0]-L)<.01)return o;C*=.97}return fromOklch([L,C,H+d])}
const base={papel:'#F5EDE0',panel:'#EADFCC',crema:'#FBF7F0',tinta:'#23264A',apagado:'#565875',noche:'#1B1D3A',lunaTxt:'#F3ECDF',nocheApag:'#B9B7C9'};
const acentos={sup:'#D9573B',txt:'#A63A22',btnTxt:'#FFFFFF'};
const ROT={tomate:0,pino:+150,malva:-70};
const out={};
for(const [n,d] of Object.entries(ROT)){out[n]={sup:d?rot(acentos.sup,d):acentos.sup,txt:d?rot(acentos.txt,d):acentos.txt,claro:d?rot('#F2A285',d):'#F2A285'}}
console.log(JSON.stringify(out,null,1));
const pares=[['tinta','papel'],['tinta','panel'],['apagado','papel'],['apagado','panel'],['apagado','crema'],['lunaTxt','noche'],['nocheApag','noche']];
for(const[a,b]of pares)console.log(a.padEnd(10),'/',b.padEnd(6),cr(base[a],base[b]).toFixed(2));
for(const[n,p]of Object.entries(out)){console.log('--',n,'txt/papel',cr(p.txt,base.papel).toFixed(2),'txt/panel',cr(p.txt,base.panel).toFixed(2),'btn blanco/sup',cr('#FFFFFF',p.sup).toFixed(2),'tinta/sup',cr(base.tinta,p.sup).toFixed(2),'claro/noche',cr(p.claro,base.noche).toFixed(2),'noche/sup',cr(base.noche,p.sup).toFixed(2))}

// Ajuste: misma L para las tres (la del original) salvo que no llegue al
// objetivo; entonces se baja L en pasos de 0,005 hasta llegar.
function ajusta(h,fondo,obj,claro=false){let[L,C,H]=toOklch(h);let o=h;for(let k=0;k<80&&cr(o,fondo)<obj;k++){L+=claro?.005:-.005;o=fromOklch([L,C,H]);let b=toOklch(o);while(Math.abs(b[1]-C)>.01&&C>0){C*=.97;o=fromOklch([L,C,H]);b=toOklch(o)}}return o}
console.log('\n== tokens finales');
const fin={};
for(const[n,p]of Object.entries(out)){
  fin[n]={sup:p.sup,txt:ajusta(p.txt,base.panel,5),boton:ajusta(p.txt,'#FFFFFF',7),claro:ajusta(p.claro,base.noche,7.5,true)};
}
// la referencia de L es el original: las derivadas usan la misma L del tomate
for(const[n,t]of Object.entries(fin))console.log(n,JSON.stringify(t),'txt/panel',cr(t.txt,base.panel).toFixed(2),'txt/papel',cr(t.txt,base.papel).toFixed(2),'blanco/boton',cr('#FFFFFF',t.boton).toFixed(2),'claro/noche',cr(t.claro,base.noche).toFixed(2),'sup/papel(no texto)',cr(t.sup,base.papel).toFixed(2));
