// Genera la planta (vista cenital) de las cinco tablas a escala real:
// 1 pie = 40 unidades, 1 pulgada = 40/12. Imprime los <path> que van en index.html.
// Uso: node scripts/tablas.js
const IN = 40 / 12;
const tablas = [
  { id: 'espuma', largo: 96, ancho: 23, nariz: .62, cola: 15, pico: 'redonda', cola_t: 'cuadrada' },
  { id: 'minimalibu', largo: 86, ancho: 22, nariz: .5, cola: 14, pico: 'redonda', cola_t: 'redonda' },
  { id: 'evolutiva', largo: 80, ancho: 21, nariz: .38, cola: 13.5, pico: 'media', cola_t: 'squash' },
  { id: 'pez', largo: 70, ancho: 21.25, nariz: .34, cola: 15.5, pico: 'media', cola_t: 'pez' },
  { id: 'longboard', largo: 109, ancho: 22.75, nariz: .6, cola: 14.5, pico: 'redonda', cola_t: 'cuadrada' },
];
const f = n => +n.toFixed(1);
for (const t of tablas) {
  const L = t.largo * IN, W = t.ancho * IN, Tw = t.cola * IN;
  const cx = 60, top = (440 - L) / 2, bot = top + L, ma = top + L * .48;
  const nz = W / 2 * t.nariz;            // anchura del pico a los primeros centímetros
  const half = s => {
    // s = +1 lado derecho, -1 izquierdo; del pico a la cola
    const x = d => f(cx + s * d);
    let p = `C${x(nz * .55)},${f(top)} ${x(W / 2)},${f(top + L * .16)} ${x(W / 2)},${f(ma)} `;
    p += `C${x(W / 2)},${f(ma + L * .3)} ${x(Tw / 2 + 2)},${f(bot - L * .06)} ${x(Tw / 2)},${f(bot - (t.cola_t === 'redonda' ? 6 : 1))} `;
    return p;
  };
  let d = `M${cx},${f(top)} ` + half(1);
  if (t.cola_t === 'pez') d += `L${f(cx + 5)},${f(bot - 22)} L${f(cx - 5)},${f(bot - 22)} L${f(cx - Tw / 2)},${f(bot - 1)} `;
  else if (t.cola_t === 'redonda') d += `Q${cx},${f(bot + 6)} ${f(cx - Tw / 2)},${f(bot - 6)} `;
  else if (t.cola_t === 'squash') d += `Q${f(cx + Tw / 2)},${f(bot + 1)} ${f(cx + Tw / 4)},${f(bot)} L${f(cx - Tw / 4)},${f(bot)} Q${f(cx - Tw / 2)},${f(bot + 1)} ${f(cx - Tw / 2)},${f(bot - 1)} `;
  else d += `L${f(cx - Tw / 2)},${f(bot - 1)} `;
  // vuelta por el lado izquierdo, de la cola al pico (curvas invertidas)
  const xl = dd => f(cx - dd);
  d += `C${xl(Tw / 2 + 2)},${f(bot - L * .06)} ${xl(W / 2)},${f(ma + L * .3)} ${xl(W / 2)},${f(ma)} `;
  d += `C${xl(W / 2)},${f(top + L * .16)} ${xl(nz * .55)},${f(top)} ${cx},${f(top)} Z`;
  console.log(`${t.id}: top=${f(top)} bot=${f(bot)} ancho=${f(W)}\n  ${d}`);
}
