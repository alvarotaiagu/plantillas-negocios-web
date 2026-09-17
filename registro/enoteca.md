# Enoteca

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Enoteca | Trasfega | «Cata a ciegas» | papel crudo / granate de vino / oro viejo / verde botella | Gabarito + Public Sans + Overpass Mono | la funda que tapa la etiqueta y se levanta al pasar el dedo, al enfocar con el teclado o sola en el hero | [alvarotaiagu/plantilla-enoteca-web](https://github.com/alvarotaiagu/plantilla-enoteca-web) | [demo](https://alvarotaiagu.github.io/plantilla-enoteca-web/) |

**Porqué del concepto:** en una cata a ciegas la botella lleva funda: pruebas el vino y
solo al final ves qué era y cuánto costaba. Es la mejor manera de quitarse los
prejuicios de encima y el argumento de una enoteca pequeña que no compite en catálogo.
Toda la web está tapada: las ocho botellas salen con la funda y un «¿?», las tres del
hero se destapan solas al llegar, y la cuarta fase de «Cómo se cata» es, literalmente,
«La etiqueta».

**Recursos de movimiento:** Lenis, la funda (protagonista, CSS puro: hover,
`:focus-within` y toque), destapado en cadena del hero, titulares letra a letra, botones
magnéticos, cursor en forma de gota, calendario de catas y horario en vivo.

**Rendimiento medido:** longtask — 1 tarea larga de 69 ms al arrancar, 0 recorriendo.

**Contenido vivo:** las catas son los **jueves reales** que vienen, con cuenta atrás en
días; y el estado del horario.

**Aviso de contenido:** es alcohol. Mayoría de edad en cinco sitios (portada, catas,
caja, formulario con casilla que bloquea el envío, y pie), no se anima a beber (agua,
escupidera, quien conduce no traga) y el aviso legal dice que una web real de venta de
alcohol debería comprobar la edad de verdad, no solo pedir una casilla.

**Datos ficticios:** Rúa da Barrica, 4 · Ferrol · 981 00 00 46 · hola@trasfega.example.
**Los ocho vinos no existen**: bodegas y añadas inventadas, botellas dibujadas en SVG
desde cuatro perfiles, y «viño inventado» impreso dentro de la propia etiqueta para que
se vea incluso en una captura. Las comarcas citadas son lugares, no denominaciones ni
marcas. Sin `aggregateRating`, con `noindex, nofollow` y sello de demo en footer, README
y comentario HTML.
