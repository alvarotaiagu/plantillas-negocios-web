import {oklch, formatHex, wcagContrast, clampChroma} from 'culori';
const F='#1A0F0B', P='#24150F', C='#F3E7D6';
const fit=(h,c,target,bg,dir)=>{let lo=0,hi=1,best;for(let i=0;i<40;i++){const m=(lo+hi)/2;const col=formatHex(clampChroma({mode:'oklch',l:m,c,h},'oklch'));const k=wcagContrast(col,bg);if((k>target)===(dir<0)){lo=m}else{hi=m};best=col}return best};
console.log('crema/F',wcagContrast(C,F).toFixed(2),'crema/P',wcagContrast(C,P).toFixed(2));
for (const m of ['#BFA894','#B8A08B','#C4AE9A']) console.log('apag',m,wcagContrast(m,F).toFixed(2),wcagContrast(m,P).toFixed(2));
const base=oklch('#46C2B5');
for (const [n,h] of [['turquesa',base.h],['coral',30],['oro',85]]) {
  const a=fit(h,base.c,7.2,F,1); console.log(n,a,'onF',wcagContrast(a,F).toFixed(2),'onP',wcagContrast(a,P).toFixed(2),'F-on-a',wcagContrast(F,a).toFixed(2));
}
// claro: sección crema
const Lc='#F3E7D6';
for (const m of ['#6A4B3A','#5E4334']) console.log('apag sobre crema',m,wcagContrast(m,Lc).toFixed(2));
for (const [n,h] of [['turquesa',base.h],['coral',30],['oro',85]]) { const a=fit(h,0.12,6,Lc,-1); console.log('txt sobre crema',n,a,wcagContrast(a,Lc).toFixed(2)); }
