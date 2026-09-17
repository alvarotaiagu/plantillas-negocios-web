# Librería

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Librería | Librería Cuadratín | «Lomos» | pared verde tinta / crema / cantos saturados (rojo, mostaza, azul, verde, morado) | Familjen Grotesk + Karla + Courier Prime | la balda: 46 lomos que salen a saludar al pasar el dedo y arrastran a los vecinos, y titulares que suben desde detrás del canto | [alvarotaiagu/plantilla-libreria-web](https://github.com/alvarotaiagu/plantilla-libreria-web) | [demo](https://alvarotaiagu.github.io/plantilla-libreria-web/) |

**Porqué del concepto:** nadie entra en una librería pidiendo un ISBN: se entra, se pasa
el dedo por la balda y se para donde se para. Lo único que se ve de un libro en una
estantería es el lomo. El hero **es** una estantería de 46 cantos con el título en
vertical; al pasar por encima el lomo sale y los dos vecinos se inclinan, como pasa de
verdad. Los titulares suben desde detrás del canto, con la línea recortada.

**Recursos de movimiento:** Lenis, la balda reactiva (protagonista, funciona con ratón,
teclado y dedo), llenado de la balda al cargar, titulares con línea recortada, plano de
la tienda que empareja dibujo y lista, botones magnéticos, cursor en forma de
marcapáginas, club de lectura y horario en vivo.

**Rendimiento medido:** longtask — 1 tarea larga de 113 ms al arrancar, 0 recorriendo.

**Contenido vivo:** el calendario del club son los **primeros jueves reales** de los
próximos seis meses, calculados al cargar.

**Datos ficticios:** Praza do Cuadrante, 2 · Lugo · 982 00 00 18 · hola@cuadratin.example.
**Los libros tampoco existen**: títulos, autores y sellos inventados, y las portadas
dibujadas en SVG para la plantilla (nada de portadas reales). Testimonios con aviso de
muestra. Sin `aggregateRating`, con `noindex, nofollow` y sello de demo en footer,
README y comentario HTML.

**Trampa nueva que costó una sesión:** la fila de lomos es más ancha que la pantalla a
propósito; sin `overflow: clip` en `html` (y `hidden` en el contenedor), **el móvil
ensancha el viewport entero** para que quepa y descoloca la página completa. Se detectó
porque el clic de Playwright caía siempre sobre el hero.
