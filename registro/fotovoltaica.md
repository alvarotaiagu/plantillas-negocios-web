# Instaladores de energía solar / fotovoltaica

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Instalación fotovoltaica | GNOMON (Lalín, Pontevedra) | «Sombra» — lo que decide una instalación no es el sol, es la sombra | grafito: fondo #0A0D0C / panel #101413 / panel2 #151A19 / línea #242B29 / acero #39423F / humo #A6B0AC / hueso #EDF2F0 + verde señal #17E08A | Archivo + JetBrains Mono | un día entero pasando sobre el tejado: el scroll son las horas, y las sombras de la chimenea y del castaño del vecino tapan módulos de verdad | [repo](https://github.com/alvarotaiagu/plantilla-fotovoltaica-web) | [demo](https://alvarotaiagu.github.io/plantilla-fotovoltaica-web/) |

**Porqué del concepto:** todas las webs del sector enseñan lo mismo —paneles
azules, cielo despejado y un porcentaje de ahorro en grande—, y además es lo que
menos se puede sostener. El sol se mira en una tabla; lo que no se mira en ninguna
tabla es *tu* chimenea, *tu* castaño y la casa del vecino a las cinco de la tarde
de noviembre. Así que la sección protagonista no es un catálogo: es el **estudio
de sombras**, que es lo que un instalador vende de verdad antes de dar un número.

El giro resuelve además el problema honesto de una empresa inventada: sin clientes
no hay ahorros medidos, luego **no se publica ni un porcentaje**. La pregunta
«¿cuánto voy a ahorrar?» se contesta con «no lo sabemos hasta ver tu consumo por
horas y la sombra de tu tejado, y desconfía de quien te dé un porcentaje por
teléfono», y el sello del pie termina en **«Ninguna cifra de esta página es una
promesa de ahorro»**.

**El recurso protagonista, por dentro:** escena anclada con `scrub`; el progreso
del scroll es la hora, de 08:00 a 20:00. De la hora salen el ángulo del sol y el
largo de la sombra, y de ahí, con geometría, **qué módulos quedan tapados**: banda
para la chimenea, elipse para la copa del castaño. El recuento «N de 20 paneles en
sombra» se recalcula, no está grabado. El día dibuja un arco real: 5 tapados a las
08:00 → 1 a las 11:00 → **0 de 13:45 a 16:30** → 3 a las 19:00.

**El nombre se cambió después de buscarlo.** La primera versión se llamaba
SOLAINA, y la comprobación en la web devolvió un bar «A Solaina» **en el propio
Lalín** y varias sociedades registradas con ese nombre en Galicia. Ninguna es
instaladora, pero un nombre que existe en la misma localidad no cumple la regla de
«negocio inequívocamente inventado», así que se rehízo entero como **GNOMON**, que
no aparece en el sector en España y además dice el concepto: el gnomon es la
varilla del reloj de sol, la pieza que da la sombra. Esa explicación está en la
propia página, en la sección 01.

**Dos trampas que cazó la verificación (las dos, de las que no se ven leyendo el
código):**

1. **La sombra iba al revés de como se dibujaba.** `rotate(θ)` lleva el eje +y
   local a `(-sen θ, cos θ)`, y la comprobación geométrica usaba `(sen θ, -cos θ)`:
   el vector opuesto. Resultado: los módulos se marcaban en el lado contrario al de
   la mancha dibujada, y de las 14:45 en adelante no se tapaba ninguno. Se vio
   porque el arnés apunta hora y recuento en cada paso, no porque se viera raro.
2. **`backdrop-filter` en la cabecera rompía el menú móvil.** Un filtro de fondo
   crea bloque contenedor para los descendientes `position:fixed`, así que el panel
   del menú dejaba de medirse contra la ventana: salía del alto de la cabecera —con
   los dos primeros enlaces cortados y el botón suelto sobre el hero— y metía
   **342 px de desbordamiento horizontal** en el documento. Se quitó el filtro y la
   cabecera va opaca. Queda apuntado en el CSS por si alguien lo reintroduce.

**Sin generador de imágenes:** cero fotografías. Todo SVG a mano —logotipo, icono,
tejado con sus 20 módulos, reloj solar del hero— incluidas las tres personas del
equipo, que en vez de retrato de archivo se presentan con **el aparato que llevan
en la mano** (medidor de irradiancia, pinza amperimétrica, perfil de aluminio).

**Verificación:** seis pasadas (escritorio, cookies, móvil, sin GSAP, movimiento
reducido, 404 y aviso legal), consola limpia salvo los cortes de CDN provocados a
propósito, **0 imágenes rotas**, **0 marcadores pendientes**, **0 px de
desbordamiento horizontal en móvil**, mapa: 0 iframes antes de pulsar y 1 después,
apuntando a la localidad. **axe-core: sin violaciones** en escritorio y móvil sobre
las tres páginas. Tareas largas: **1 al arranque (92 ms)** y **0 recorriendo el
día**; la única es GSAP más las tipografías, no el estudio de sombras.

**Sin movimiento:** el tejado se pinta a las 14:00 —su estado legible, los 20
módulos al sol— y la hora, el recuento y los contadores se escriben igual. Se apaga
el movimiento, no el contenido.

**Datos ficticios:** GNOMON Instalacións Fotovoltaicas, S.L. · Rúa da Corredoira
44, nave 2 · 36500 Lalín (Pontevedra) · 986 00 00 00 · hola@gnomon.example ·
CIF B00000000. Nombre comprobado antes de fijarlo. Mapa a la localidad, nunca a un
portal. Sin `aggregateRating` ni `review`, con `noindex, nofollow` y sello de demo
en el pie, en el README y en el comentario del HTML.
