# Carpintería a medida

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Carpintería a medida | Espiga | «Ensamble» | papel de taller / tinta parda / roble / nogal | Archivo + Sora + Overpass Mono | la espiga entrando en su mortaja: dos piezas de SVG que llegan separadas, encajan solas y se pueden volver a separar con un botón | [alvarotaiagu/plantilla-carpinteria-web](https://github.com/alvarotaiagu/plantilla-carpinteria-web) | [demo](https://alvarotaiagu.github.io/plantilla-carpinteria-web/) |

**Porqué del concepto:** un mueble a medida es, al final, dos piezas que encajan. La
espiga y la mortaja son el ensamble de toda la vida —sin un tornillo— y son también el
argumento: esto no es un mueble de caja, es una pieza hecha para tu hueco. El hero lo
enseña literalmente y el resto de la página entra igual, cada bloque desde su lado,
metiéndose en su sitio.

**Recursos de movimiento:** Lenis, el ensamble (protagonista, con botón para repetirlo),
entradas por el lado alternando izquierda y derecha, titulares letra a letra, botones
magnéticos, cursor con forma de pieza con espiga, contadores y horario en vivo.

**Rendimiento medido:** longtask — 1 tarea larga de 69 ms al arrancar, 0 recorriendo.

**Obra gráfica:** los seis muebles son **alzados generados por script**, con veta
procedural (semilla determinista, con nudos) y **cotas dibujadas** con sus flechas: es el
papel que se le enseña a un cliente. Dos fotos de Pexels sin caras.

**Datos ficticios:** Rúa do Serrín, 12 · Betanzos · 981 00 00 58 · hola@espiga.example.
Sin `aggregateRating`, sin testimonios, con `noindex, nofollow` y sello de demo en
footer, README y comentario HTML.

**Trampa anotada:** la mortaja estaba cortada 20 px a la derecha de la espiga, así que
las piezas se juntaban pero **no encajaban**. Para que un ensamble dibujado funcione, el
hueco tiene que ocupar el mismo rango de coordenadas que la lengüeta. Y las piezas son
`<g>` de SVG: el CSS no puede tocarles el `transform`, ni con `none`.
