# Centro ecuestre / hípica — «Aires» (tanda de noche, 2026-10-02)

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Centro ecuestre / hípica | Picadeiro Brañavella (Vilalba, Lugo) | «Aires» — paso, trote y galope: el caballo tiene tres aires y cada uno suena distinto; y en la Terra Chá, el aire es también el viento que peina el prado | nata `#F3EEE1` / avena `#E6DCC3` / prado `#1D2B1B` / prado-2 `#283A25` / heno `#E3CC88` / tinta `#1B1A14` + **casaca** `#8A2923` (claro `#F2A08E` sobre oscuro); alternativas del mando: azul `#22457C` y ocre `#5E4710` | Playfair Display variable + DM Sans + Fragment Mono | **prado de la Chaira en canvas** que el viento mueve, el cursor aparta y **cruza un caballo que no se ve**: cada golpe de casco abre una onda en la hierba al compás del aire elegido; y un **diagrama de apoyos anclado** que pasa del paso al trote y al galope | carpeta `plantilla-hipica-web/` de la rama `claude/noche-hipica` (sin repo propio todavía) | pendiente de publicar |

**Estado: pendiente de aprobación.** Rama `claude/noche-hipica`, carpeta
`plantilla-hipica-web/`. Sin repositorio, sin Pages, sin tocar `REGISTRO.md` ni
`SECTORES.md`.

**Porqué del concepto:** lo que distingue los aires no es la velocidad sino el
compás (4, 2 y 3 golpes más una suspensión), y aprender a montar es aprender a
ir con ese compás. Es un dato del oficio, visual y que nadie publica.

**Vecinos a vigilar:** «Carril» (autoescuela) mueve un coche por un trazado con
scrub; aquí lo que se anima es un diagrama de apoyos, no un objeto por una
ruta. «Orballo» (hotel rural) tiene paisaje en el hero, pero es un cristal
empañado; aquí es hierba que responde a un ritmo.

**Estructura** (siete piezas): cortina (puerta de cuadra de dos hojas) →
portada con prado y selector de aire → cinta de compases → los aires (anclada,
oscura) → la cuadra (fila arrastrable de ocho caballos dibujados) → escuela y
tarifas (bautismo + tablón con pestañas) → seguridad (normas + preguntas) →
visita (horario vivo, mapa bajo clic, formulario).

**Control de maqueta:** «Aires» / «Sobria»; la sobria cambia las cabezas por la
alzada en grande y añade una comparativa de alzadas en barras. Paletas Casaca,
Azul y Ocre. Mando solo con `?revision`; receta de borrado como script,
probada en seis combinaciones.

**Datos ficticios:** Picadeiro Brañavella · Camiño das Cancelas, 7 · Insua ·
27800 Vilalba (Lugo) · 982 00 00 00 · WhatsApp 600 00 00 00 ·
ola@branavella.example · martes a viernes 10–14 y 16:30–21, fines de semana
9:30–14 y 16:30–20, lunes descanso de los caballos. Equipo: Iria Montouto y
Brais Penabad. Ocho caballos dibujados (Faro, Lúa, Trasno, Bruma, Carbón,
Canela, Xeito, Néboa). Precios de muestra marcados (bautismo 20 €, clase 28 €,
pupilaje 380 €/mes, ruta de 2 h 50 €). Nombre comprobado: «Brañavella» no
aparece asociado a ninguna hípica, picadero ni cuadra; se descartó «A Chousa»
porque un club de jinetes real tiene esa palabra en su dirección.

**Línea roja:** ninguna terapia (pregunta «¿Hacéis hipoterapia?» → no) ni
promesa de salud; sin núcleo zoológico ni registro de explotación inventados;
sin reseñas; `schema.org` sin valoraciones; sin menores en imagen.

**Verificación:** `scripts/verifica.js` **46/46**, axe **0 violaciones** en seis
estados, 23 parejas de contraste de 5,77:1 a 15,05:1. Detalle en
`plantilla-hipica-web/INFORME-NOCHE.md`.
