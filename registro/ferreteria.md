# Ferretería de barrio — «Rosca» (tanda nocturna del 2026-10-02)

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Ferretería de barrio | Ferraxaría Paso Fino (Narón, A Coruña) | «Rosca» — cada vuelta, un paso: ni más, ni menos; la tienda trabaja como un tornillo, y las secciones se numeran por métrica (M3 → M12) | verde de máquina: fondo `#0E1411` / panel `#151D19` / panel2 `#1C2621` / línea `#2C3832` / acero `#4A5951` / humo `#A4B1A9` / hueso `#EDF0EA` / cinta `#E9DFC3` + **dos minios**: superficie `#E2552B` y texto/botón `#FF8C66` (derivadas del mando: cobalto `#0A8BF4`/`#76B4FE`, cardenillo `#06A36F`/`#32CD97`) | Mona Sans variable (eje `wdth` 75–125 como gesto) + Geist Mono + Permanent Marker (solo portaetiquetas) | **un M10 en WebGL** (raymarching de la rosca helicoidal) que **el scroll aprieta** —giro y avance ligados por el paso— y cuya lámpara mueve el cursor; más la **copiadora de llaves anclada con scrub** en cinco pasos | pendiente (rama `claude/noche-ferreteria`, carpeta `plantilla-ferreteria-web/`) | pendiente de publicar |

**Construida sin supervisión** en la tanda nocturna del 2026-10-02, junto con
otros siete agentes (escuela infantil, yoga/pilates, heladería, escuela de
surf, fontanería-electricidad, psicología, carnicería). Por encargo expreso:
no se creó repo, no se activó Pages y no se tocó `REGISTRO.md` ni
`SECTORES.md`; la web vive en la carpeta `plantilla-ferreteria-web/` de la
rama `claude/noche-ferreteria` hasta que el usuario apruebe publicarla.

**Porqué del concepto:** lo que hace una ferretería de barrio que no hace una
gran superficie es **encontrar la pieza que encaja**: el tornillo de ese
paso, la llave de ese dentado, la junta de ese grifo. Un tornillo avanza
exactamente su paso en cada vuelta; de ahí «Rosca», la numeración métrica de
las secciones y la voz («Aquí no nos pasamos de rosca»). Registro B, oscuro
industrial, pero apartado de los tres vecinos: ni negro + amarillo señal
(Carrexo), ni azul acero + ámbar (Rodadura), ni engranajes ni latón
(Trinquete). Fondo **verde de máquina-herramienta** y acento **minio**, la
imprimación antióxido de toda la vida.

**Estructura** (nueve piezas): cortina (tuerca que se desenrosca + chapa de
minio con el filete en el canto) → portada con el tornillo → M3 mostrador
(manifiesto + cuatro cifras) → M4 copiadora de llaves anclada → M5 seis
cajones en pila sticky → cinta de encargos → M6 panel de alquiler con
siluetas pintadas → M8 la galga (tornillo a tamaño real, calibrado con una
tarjeta) → M10 tarifa en ticket → M12 horario/mapa/encargo/opiniones/equipo.

**Recursos de movimiento** (§2, 9): Lenis, char-reveal con el eje de anchura,
pila sticky, marquesina ligada al scroll, imán, scrub anclado, cursor punto +
aro (tuerca sobre la herramienta), hero WebGL, contadores.

**Mando** (`?revision`): «Rosca» / «Sobria» — la sobria quita filetes,
cabezas de tornillo y tiradores, pone la métrica en cifra grande y **añade**
un gráfico de precio por unidad según cómo compres el tornillo. Paletas
Minio / Cobalto / Cardenillo por rotación de matiz en OKLCH.

**Datos ficticios:** Ferraxaría Paso Fino · Rúa do Parafuso, 7 · 15570 Narón ·
981 00 00 00 · WhatsApp 600 00 00 00 · hola@pasofino.example · L–V 9:00–13:30
y 16:30–20:00, S 9:30–13:30. Celia Fraga Lamas y Xurxo Pita Seoane. Nombre
buscado en la web: no hay ninguna ferretería «Paso Fino» (existe
«Ferretería Paso» en Argentina, nombre distinto y en otro país; «paso fino»
es además un término de tornillería). Las ferreterías reales de Narón
(Concepción Arenal, Río Miño) no se tocan. Mapa a Narón, no a una calle.

**Verificación:** `scripts/verify.js` en Chromium (Playwright), axe dentro del
repo, longtask en frío. Detalle y números en
`plantilla-ferreteria-web/INFORME-NOCHE.md`.
