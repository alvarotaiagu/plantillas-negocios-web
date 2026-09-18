# Escuela de música

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Escuela de música | Semitón | «Afinación» | marfil / negro piano / rojo de fieltro / latón | Unbounded + Manrope + JetBrains Mono | el afinador del hero: eliges cuerda, la aguja se va al desvío y vuelve al centro; y todo lo demás llega girado y se coloca | [alvarotaiagu/plantilla-escuela-musica-web](https://github.com/alvarotaiagu/plantilla-escuela-musica-web) | [demo](https://alvarotaiagu.github.io/plantilla-escuela-musica-web/) |

**Porqué del concepto:** nadie empieza afinado. La primera semana suena mal y la
segunda un poco menos, y ese es justo el argumento de una escuela que no pide pruebas de
acceso. El hero es un afinador que se puede tocar (seis cuerdas, aguja que se va en rojo
y vuelve al centro en verde), y de ahí sale el resto: cada bloque entra girado un grado
o dos y se coloca con un rebote corto.

**Recursos de movimiento:** Lenis, afinador con aguja (protagonista, `svgOrigin` +
`elastic.out`), entradas «desafinadas» que se corrigen con `back.out`, titulares letra a
letra entrando torcidas, botones magnéticos, cursor, cuenta atrás del curso y horario en
vivo.

**Rendimiento medido:** longtask — 1 tarea larga de 121 ms al arrancar, 0 recorriendo.

**Contenido vivo:** cuenta atrás en días hasta el siguiente hito del curso (calculada de
los `data-fecha`, salta al año siguiente sola) y estado del horario.

**Aviso de contenido cumplido:** **cero fotografías**, y menos de alumnado. Se buscaron
fotos de manos e instrumentos en Pexels y las que devolvió no servían, así que se
resolvió entero en ilustración propia (cinco instrumentos en SVG). **Tampoco hay
testimonios**: un testimonio inventado de una familia hablando de su hijo es justo lo
que no se debe simular, y se explica así en el aviso legal.

**Datos ficticios:** Rúa do Clave, 8 · Vigo · 986 00 00 27 · hola@semiton.example. Sin
`aggregateRating`, con `noindex, nofollow` y sello de demo en footer, README y
comentario HTML.

**Trampa nueva anotada:** la aguja es un `<g>` de SVG y GSAP le escribe el `transform` en
el atributo; cualquier `transform` en CSS sobre ella —incluso `none`— deja la animación
clavada. El CSS no toca `[data-aguja]` a propósito.

**Cortina de entrada (añadida el 2026-09-19):** «Afinación»: la aguja entra desviada, vuelve al centro con rebote elástico y la cortina se va con ella, girando sobre su esquina mientras sube. Encadenada, con `expo.inOut` y borde curvo, y el hero no entra hasta que la cortina va por la mitad (constante `ESPERA` de `main.js`). **Retirada garantizada**: se quita al terminar, se quita sin GSAP, se quita con movimiento reducido y hay un `setTimeout` de 5 s de red de seguridad; el `display` va en `.cortina:not([hidden])`, nunca en la clase a secas —si fuera a secas ganaría al atributo `hidden` y la página quedaría tapada para siempre.

La aguja es un `<g>` de SVG: gira con `svgOrigin`, y ni la cortina ni ese `<g>` llevan `transform` en CSS, porque pisaría el que escribe GSAP. La cortina va sobredimensionada para que el giro no destape las esquinas.
