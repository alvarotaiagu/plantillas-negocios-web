# Arquitectura / reformas

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Arquitectura y reformas | Perpiaño (Lugo) | «Planta» — lo que hay y lo que va a haber, explicado en planta | papel #F6F2E9 / arena #E4DBC8 / tinta grafito #2B2724 / rojo almagre #9C3B2E / salvia #4A5245 | Newsreader + Archivo | comparador de plantas antes/después arrastrable, con los tabiques derribados en almagre y las cifras (salón, habitaciones, pasillo, baño) cambiando de lado | [repo](https://github.com/alvarotaiagu/plantilla-arquitectura-web) | [demo](https://alvarotaiagu.github.io/plantilla-arquitectura-web/) |

**Porqué del concepto:** un estudio no vende fotos, vende el cambio entre lo que hay y
lo que va a haber, y ese cambio se lee en planta. El «antes y después» que pide el sector
se resuelve en dibujo propio y no en dos fotos del mismo sitio que ningún banco de
imágenes puede dar.

**Obra gráfica propia:** las dos plantas del comparador (1978 y 2023) y el croquis
acotado del hero, dibujados en SVG rect a rect; los huecos de ventana se recortan
pintándolos del color del papel y los derribos van en una capa aparte. Logotipo, dibujo
del mapa, icono de la 404 y og:image, también propios. Cinco fotos de Pexels acreditadas
y etiquetadas como ajenas a las obras descritas.

**Recursos de movimiento:** Lenis, char-reveal, cotas del hero que se dibujan
(`stroke-dasharray` + `pathLength`), comparador arrastrable y manejable con teclado
(protagonista), barras de las fases de obra que crecen al entrar, marquee con velocidad
ligada al scroll, botones magnéticos, cursor en cruz de replanteo, máscaras de imagen,
apariciones con IntersectionObserver y contadores.

**Rendimiento:** `PerformanceObserver` de `longtask`: tres tareas largas al cargar
(108, 75 y 59 ms), atribuibles a GSAP y a las dos webfonts; ninguna después. Queda en
`window.__tareasLargas`.

**Línea roja:** sin número de colegiado inventado (dato verificable de profesión
colegiada), obras etiquetadas como inventadas en su propia sección y no solo en el pie,
calle inventada en ciudad real, teléfonos de muestra y correo en dominio `.example`.
Se descartaron los nombres «Cimbra» y «Cerna» porque existen estudios reales así.
