// Utilidades de color: sRGB <-> OKLCH y contraste WCAG. Sin dependencias.
const hex2rgb = h => { h = h.replace('#',''); return [0,2,4].map(i => parseInt(h.slice(i,i+2),16)/255); };
const lin = c => c <= 0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4);
const delin = c => c <= 0.0031308 ? 12.92*c : 1.055*Math.pow(c,1/2.4)-0.055;
const lum = h => { const [r,g,b] = hex2rgb(h).map(lin); return 0.2126*r+0.7152*g+0.0722*b; };
const ratio = (a,b) => { const [x,y] = [lum(a),lum(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05); };
function toOklch(h){
  const [r,g,b] = hex2rgb(h).map(lin);
  const l = Math.cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b);
  const m = Math.cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b);
  const s = Math.cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b);
  const L = 0.2104542553*l+0.7936177850*m-0.0040720468*s;
  const A = 1.9779984951*l-2.4285922050*m+0.4505937099*s;
  const B = 0.0259040371*l+0.7827717662*m-0.8086757660*s;
  return [L, Math.hypot(A,B), (Math.atan2(B,A)*180/Math.PI+360)%360];
}
function fromOklch([L,C,H]){
  const A = C*Math.cos(H*Math.PI/180), B = C*Math.sin(H*Math.PI/180);
  const l = (L+0.3963377774*A+0.2158037573*B)**3;
  const m = (L-0.1055613458*A-0.0638541728*B)**3;
  const s = (L-0.0894841775*A-1.2914855480*B)**3;
  let rgb = [4.0767416621*l-3.3077115913*m+0.2309699292*s, -1.2684380046*l+2.6097574011*m-0.3413193965*s, -0.0041960863*l-0.7034186147*m+1.7076147010*s];
  const inGamut = rgb.every(c => c >= -1e-4 && c <= 1+1e-4);
  rgb = rgb.map(c => Math.min(1,Math.max(0,delin(Math.min(1,Math.max(0,c))))));
  return { hex: '#'+rgb.map(c=>Math.round(c*255).toString(16).padStart(2,'0')).join('').toUpperCase(), inGamut };
}
// Rota el matiz conservando L; si se sale de gama, baja el croma hasta que entre.
function rotate(h, deg){
  const [L,C,H] = toOklch(h); let c = C, r;
  while (c > 0) { r = fromOklch([L,c,(H+deg+360)%360]); if (r.inGamut) break; c -= 0.002; }
  return r.hex;
}
module.exports = { ratio, toOklch, fromOklch, rotate, lum };
