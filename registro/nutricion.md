# Dietista-nutricionista — «Mantel» (tanda de noche, 2026-10-02)

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Dietista-nutricionista | Fiambreira (Ourense) | «Mantel» — lo que importa pasa en tu mesa, no en una hoja de dieta | blanco de mantel `#FAF8F1` / panel `#EFEBDD` / loza `#FFFDF8` / tinta verde noche `#172419` / apagada `#4E5A50` / noche `#1C3322` y `#142619` / niebla `#CBD8CC` / **albahaca** de superficie `#3E7A45` y honda `#245A2D` / tomate `#D8462B` (texto `#B1341C`) / limón `#EEC643` | Instrument Serif + Onest variable | **un mantel de vichy en WebGL** que se hunde y se arruga en estrella bajo la mano, vuelve a alisarse solo, deja una onda al tocarlo y se alisa con el scroll | pendiente (rama `claude/noche-nutricion`, carpeta `plantilla-nutricion-web/`) | pendiente de publicar |

**Porqué del concepto:** una consulta de nutrición seria no vende dietas: mira
lo que ya comes y cómo vives. El mantel de cuadros es la mesa de cualquier
casa, y el nombre, *fiambreira*, la tartera gallega. Comprobado contra el
PLIEGO §3 y las fichas: «Mantel» libre; ningún vichy ni WebGL de tela en la
biblioteca.

**Estructura:** cortina de servilleta que se dobla → portada con el texto en un
plato sobre el mantel → «Lo que aquí no vas a encontrar» (lista que se tacha)
→ «Poner la mesa», escena anclada con seis piezas = seis pasos, de la llamada
al alta → «La carta» de consultas con precios de muestra → «Qué hay cada mes»,
galería anclada horizontal con el mes actual marcado → dos personas → preguntas
de sobremesa → contacto.

**Sector sanitario:** sin promesas de peso ni de tallas, sin dietas milagro,
sin suplementos a la venta, sin testimonios ni «antes y después»; digestivo
siempre con diagnóstico médico previo; TCA derivado al médico de cabecera y a
un equipo. Colegiaciones `GAL-0000`/`GAL-0001` y registro `C-32-000000`
marcados «de muestra».

**Mandos (`?revision`):** «Mantel»/«Sobria» (la sobria cambia iconos y marcos
por datos y **añade** una tabla de qué incluye cada consulta) y paleta
Albahaca/Loza/Ocre (OKLCH +100°/−75°; el shader lee el color del CSS). Receta
de borrado comprobada por script en las dos direcciones.

**Verificación:** `scripts/verificar.js` 55/55; axe 0 violaciones en cinco
vistas; 63 parejas de contraste, mínimo 5,85:1; `longtask`: 98 + 52 + 79 ms al
cargar en escritorio, 0 al hacer scroll, 61 fps (CPU ×4 en móvil: 382 + 349 +
76 ms al cargar, 61 fps). Primera versión del shader con tareas largas
continuas de ~55 ms en el Chromium sin GPU: corregido (búfer al 70 % y 20 fps
en reposo). Solo Chromium sin GPU real.
