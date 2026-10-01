// Genera el HTML del cuadro semanal a partir de una sola tabla de datos.
// Uso: node scripts/cuadro.js > /tmp/cuadro.html  (y se pega entre las marcas CUADRO del index).
// El index.html es la fuente que lee main.js (data-*), así que el cuadro se ve también sin JS.
const T = {
  hatha:   { n:'Hatha',            sala:'Sala Area',   prof:'Antía' },
  vinyasa: { n:'Vinyasa',          sala:'Sala Area',   prof:'Martín' },
  yin:     { n:'Yin',              sala:'Sala Area',   prof:'Antía' },
  suelo:   { n:'Pilates suelo',    sala:'Sala Area',   prof:'Sabela' },
  reformer:{ n:'Pilates reformer', sala:'Sala Muelle', prof:'Uxío' },
};
const D = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
// [hora, minutos, tipo, nivel]
const S = {
 1:[['07:30',60,'vinyasa',2],['09:30',50,'suelo',1],['10:00',50,'reformer',1],['13:30',50,'reformer',2],['18:00',60,'hatha',1],['19:15',50,'reformer',2],['19:30',50,'suelo',2],['20:30',75,'yin',1]],
 2:[['07:30',50,'suelo',2],['09:30',60,'hatha',1],['10:00',50,'reformer',1],['18:00',50,'reformer',1],['18:30',60,'vinyasa',2],['19:15',50,'reformer',3],['19:45',60,'hatha',2]],
 3:[['07:30',60,'vinyasa',2],['09:30',50,'suelo',1],['10:00',50,'reformer',2],['13:30',50,'reformer',1],['18:00',60,'hatha',1],['19:15',50,'reformer',2],['19:30',50,'suelo',3],['20:30',75,'yin',1]],
 4:[['07:30',50,'suelo',2],['09:30',60,'hatha',1],['10:00',50,'reformer',1],['18:00',50,'reformer',2],['18:30',60,'vinyasa',3],['19:15',50,'reformer',1],['19:45',60,'hatha',2]],
 5:[['07:30',60,'vinyasa',2],['09:30',50,'suelo',1],['10:00',50,'reformer',1],['17:30',50,'reformer',2],['18:30',60,'hatha',1],['19:45',75,'yin',1]],
 6:[['09:30',60,'vinyasa',2],['10:00',50,'reformer',1],['11:15',60,'hatha',1],['11:15',50,'reformer',2],['12:30',75,'yin',1]],
};
const fin = (h,m) => { let [a,b] = h.split(':').map(Number); b += m; a += Math.floor(b/60); b %= 60; return `${String(a).padStart(2,'0')}:${String(b).padStart(2,'0')}`; };
let out = '', total = 0;
for (const d of [1,2,3,4,5,6]) {
  out += `          <li class="cuadro-dia" data-dia="${d}">\n            <h3 class="cuadro-dia-nombre"><span class="cuadro-dia-largo">${D[d-1]}</span><span class="cuadro-dia-corto" aria-hidden="true">${D[d-1].slice(0,3)}</span><span class="cuadro-hoy-marca">hoy</span></h3>\n            <ol class="cuadro-sesiones">\n`;
  for (const [h,m,t,n] of S[d]) {
    total++;
    out += `              <li class="sesion" data-tipo="${t}" data-inicio="${h}" data-fin="${fin(h,m)}" data-nivel="${n}"><span class="sesion-hora">${h}<span class="sesion-fin">–${fin(h,m)}</span></span><span class="sesion-nombre">${T[t].n}</span><span class="sesion-datos">${T[t].prof} · ${T[t].sala} · nivel ${n}</span><span class="sesion-estado" aria-live="off"></span></li>\n`;
  }
  out += `            </ol>\n          </li>\n`;
}
process.stdout.write(out);
console.error('sesiones semanales:', total);
