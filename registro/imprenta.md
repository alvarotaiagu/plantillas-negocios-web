# Imprenta y copistería — «Registro» (tanda nocturna del 2026-10-02)

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Imprenta y copistería | Tres Milímetros · imprenta e copistería (Pontevedra) | «Registro» — las cuatro planchas tienen que caer en el mismo sitio; el nombre son los 3 mm de sangrado que pide toda imprenta | papel `#F4F1EA` / panel `#E9E4D8` / crema `#FBFAF6` / tinta `#16161A` / gris `#55545C` / línea `#D3CCBC` + tintas de proceso fijas (cian `#00A0E3`, magenta `#E6007E`, amarillo `#FFE500`) + marca magenta `#E6007E` y su tono de texto `#A8005C` (derivadas del mando: cian `#018FAC`/`#00677C`, bermellón `#EC1C01`/`#AF0400`) | Funnel Display + Funnel Sans + Instrument Serif (cursiva) + Red Hat Mono | **cartel en cuatricromía real en WebGL**: cuatro tramas a 15°/75°/0°/45° que forman la roseta, cuentahílos ×3 bajo el cursor y lineatura que baja con el scroll; titulares que llegan desregistrados y casan | pendiente (rama `claude/noche-imprenta`, carpeta `plantilla-imprenta-web/`) | pendiente de publicar |

**Construida sin supervisión** en la tanda nocturna del 2026-10-02, como
segunda plantilla del mismo agente (la primera fue la ferretería «Paso Fino»,
rama `claude/noche-ferreteria`). Por encargo: sin repo, sin Pages, sin tocar
`main`, `REGISTRO.md` ni `SECTORES.md`.

**Estructura** (siete piezas): cortina (planchas que casan y pliego que sale
con canto curvo) → portada con el cartel en trama → 01 presupuestador →
02 proceso anclado con scrub **horizontal** (seis pasadas) → cinta «en
máquina hoy» → 03 abanico de papeles → 04 copistería con tarifa → 05 archivo,
horario, mapa, opiniones y equipo.

**Recursos de movimiento** (§2, 9): Lenis, char-reveal en desregistro,
galería horizontal anclada, marquesina ligada al scroll, imán, cursor marca de
registro, hero WebGL interactivo, contadores, entrada de bloques «impresa».

**Mando** (`?revision`): «Registro» / «Sobria» — la sobria quita
desregistro, marcas de corte y dianas, pone el folio en grande y **añade** la
curva de precio por unidad según cantidad. Paletas Magenta / Cian /
Bermellón; las tintas de proceso y el logo no cambian.

**Datos ficticios:** Tres Milímetros · Rúa do Prelo, 14 (calle inventada;
*prelo* es la prensa de imprimir) · 36001 Pontevedra · 986 00 00 00 ·
ola@tresmilimetros.example · L–V 9:00–14:00 y 16:00–20:00, S 10:00–13:30 ·
Rosa Quintáns Vidal e Iago Barreiro Outón. Nombre buscado: ninguna imprenta,
copistería ni gráficas «Tres Milímetros». Se descartó **Roseta** porque
existe una imprenta «Códice Roseta» (Latinoamérica). Mapa a Pontevedra, no a
una calle.

**Verificación:** `scripts/verify.js`, 55/55; axe 0 violaciones; longtask en
frío con 0 tareas largas en el recorrido. Detalle en
`plantilla-imprenta-web/INFORME-NOCHE.md`.
