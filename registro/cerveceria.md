# Cervecería artesanal / obrador

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Cervecería artesanal (obrador) | TRASFEGA (Betanzos) | «Trasfega» — la cerveza cambia cinco veces de recipiente y la web hace lo mismo con el líquido | fondo #0C0D0F / panel #15171A / línea #262A2F / acero #3A4048 / humo #A9AFB8 + magenta #FF2E8A | Antonio + Chivo Mono + Chivo | escena anclada del obrador: el líquido se llena y se vacía de recipiente en recipiente con scrub (hero de canvas con malta cayendo) | [repo](https://github.com/alvarotaiagu/plantilla-cerveceria-web) | [demo](https://alvarotaiagu.github.io/plantilla-cerveceria-web/) |

**Porqué del concepto:** trasfegar es pasar el líquido de un recipiente a otro
dejando atrás lo que sobra, y entre el saco de malta y la lata una cerveza lo
hace cinco veces. La sección central ancla la página y recorre ese camino real
—molino, macerador, caldera, fermentador, envasado— mientras el paso activo se
escribe al lado. Es fábrica, no bar, y la estructura lo dice: proceso, lotes,
obrador, visitas y dónde encontrarla.

**Aviso de contenido cumplido:** aviso de +18 en el hero, al pie de la sección de
cervezas y en el pie de página; casilla de mayoría de edad en el formulario; una
modalidad de visita **sin cata** para quien conduce; ninguna frase que sugiera
que la cerveza sea saludable, y ningún premio ni medalla inventados. Tampoco hay
lista de bares clientes: ni reales (no se puede) ni inventados (parecen reales).

**Rendimiento medido (deuda técnica de la tanda 1, saldada aquí):** montado el
`PerformanceObserver` de `longtask` en la propia página. Medida en Chromium
1440×900: **2 tareas largas en el arranque (peor 126 ms**, GSAP y webfonts, que
es lo que el pliego ya avisa**) y 0 tareas largas en 25 s con el canvas vivo y
scroll arriba y abajo**. Validado con una tarea de control de 220 ms lanzada con
`setTimeout`: ojo, una tarea lanzada desde el protocolo de depuración de
Playwright **no** cuenta como longtask de la página y da un cero falso.

**Datos ficticios:** Rúa do Bocoi 4 · 15300 Betanzos (A Coruña) · 981 00 00 00 ·
obrador@trasfega.example. Cero fotografía: cinco SVG propios, un canvas y el
equipo presentado por su herramienta. Mapa a la localidad, nunca a una calle.
Sin `aggregateRating`, con `noindex, nofollow` y sello de demo en footer, README
y comentario HTML.
