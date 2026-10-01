import {oklch, formatHex, wcagContrast, clampChroma} from 'culori';
const L='#FBF5EE',N='#F3E9DC',T='#2A1520';
const fit=(h,c,target,bg,dir)=>{let lo=0,hi=1,best;for(let i=0;i<40;i++){const m=(lo+hi)/2;const col=formatHex(clampChroma({mode:'oklch',l:m,c,h},'oklch'));const k=wcagContrast(col,bg);if((k>target)===(dir<0)){lo=m}else{hi=m};best=col}return best};
const o=oklch('#A3184A'), os=oklch('#D6336C');
const ol=oklch('#F28AAE');
for (const [name,h] of [['framboesa',o.h],['pistacho',128],['arandano',285],['mandarina',45]]) {
  const t=fit(h,o.c,7.0,L,-1); const s=fit(h,os.c,wcagContrast('#D6336C',L),L,-1); const l=fit(h,ol.c,wcagContrast('#F28AAE',T),T,1);
  console.log(name,'text',t,wcagContrast(t,L).toFixed(2),wcagContrast(t,N).toFixed(2),'| surf',s,wcagContrast(s,L).toFixed(2),'| light',l,wcagContrast(l,T).toFixed(2));
}
console.log('F28AAE on T', wcagContrast('#F28AAE',T).toFixed(2));
