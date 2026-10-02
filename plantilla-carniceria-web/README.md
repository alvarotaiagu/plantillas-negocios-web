# Mouriscal · carnicería y charcutería — plantilla «Contraveta»

> **Sitio de demostración.** Carnicería Mouriscal es un negocio **ficticio**; los
> datos, precios, ilustraciones y opiniones son de muestra. No existe ningún
> local en la Rúa dos Coiteleiros de Vilalba. Todas las páginas llevan
> `noindex, nofollow`.

Web estática (HTML + CSS + un `main.js`), sin build. GSAP 3.12.5, ScrollTrigger
y Lenis 1.1.13 por **jsDelivr**. Se abre con doble clic o se publica tal cual
en GitHub Pages.

---

## El concepto: «Contraveta»

**A contraveta** es como corta un carnicero que sabe lo que hace: de través a
la fibra del músculo, nunca siguiéndola. Fibra corta en el plato es carne que
se deja masticar, y es lo único que no se puede arreglar después en la cocina.
Es el gesto del oficio que el cliente no ve y que decide si el filete es bueno.

De ahí cuelga todo:

- **La portada es la veta.** Un shader WebGL pinta la fibra del músculo con su
  grasa infiltrada (no una foto: textura de producto, registro C). **El cursor
  es el cuchillo**: por donde pasa, la fibra se abre a los dos lados y queda el
  tajo limpio, que se cierra solo. Si nadie corta, corta la casa cada pocos
  segundos (y en táctil, al tocar). El scroll gira la veta y aprieta el peso
  del titular en el eje variable de la Bodoni.
- **La cortina es el cortafiambres**: seis lonchas que salen una a una, en
  sentidos alternos y con el borde redondeado, después de que el tajo cruce el
  sello.
- **Las transiciones entre secciones también son lonchas**: los bloques
  grandes se destapan en cinco tiras, y las dos secciones oscuras entran con
  el borde **en sesgo** y se enderezan con el scroll (llegan *cortadas*, no
  fundidas).
- **El oficio, anclado**, en cinco gestos sobre un solo dibujo: origen →
  despiece → maduración (contador de 28 días) → a contraveta (el cuchillo
  cruza el filete dos veces y salen tres lonchas) → papel, cordel y etiqueta.

## Qué hace esta plantilla mejor que las anteriores

Antes de diseñar se revisaron las fichas y decisiones de **Trinquete**
(abogacía), **Corteza** (quesería), **La miga** (panadería) y **Trasfega**
(cervecería), que son las más cercanas en ambición o en sector.

1. **El hero es interactivo de verdad, no un fondo.** La miga tiene burbujas
   que suben y Trinquete un mecanismo que acelera con el scroll: los dos se
   *miran*. Aquí el visitante **hace el gesto del oficio** con el cursor, y el
   dibujo responde con el resultado del oficio (la fibra se separa). El
   concepto se entiende en los primeros dos segundos sin leer nada.
2. **Herramientas que contestan preguntas reales del mostrador, no
   decoración.** Trinquete metió una calculadora de plazos; esta mete **tres**:
   la báscula (pieza del día × gramos = importe), el despiece inverso (eliges
   *el plato* y se encienden las piezas que sirven, en ternera, cerdo y pollo)
   y la calculadora de cocido (comensales y apetito → lote con pesos e
   importe, que **se copia sola al formulario de encargo**).
3. **El anclado cuenta una transformación continua con un único dibujo.**
   Trasfega y Ramo anclan escenas por pasos; aquí la misma ilustración se
   *convierte* (res → despiece → lomo madurando → filete → paquete) con un
   progreso continuo, y la misma función `pintar(p)` sirve para el scrub, para
   el movimiento reducido (salta al paso que se lee) y para la versión sin
   GSAP. No hay dos implementaciones que se desincronicen.
4. **Tipografía variable usada como material, no solo cargada.** Bodoni Moda
   con su eje de peso ligado al scroll en la portada y el eje óptico decidido
   a mano (a `opsz 96` los perfiles finos de la cursiva desaparecían sobre la
   textura y «contraveta» se leía «contrarela»: se bajó a 28 tras verlo en la
   captura).
5. **Medido, no supuesto:** `PerformanceObserver` de `longtask` dentro del
   propio `main.js` (expuesto en `window.mouriscalLongtasks`), con control de
   que el observador vive; 44 comprobaciones automáticas en
   `scripts/verificar.js` (incluida la pila sticky en pasos de 90 px y el
   contraste de las tres paletas medido en la página) y auditoría axe sin
   infracciones en ocho casos (`AUDITORIA.md`), que en la biblioteca solo
   tienen 6 de 27.

## Mapa de secciones

Distinto de las anteriores en orden y forma: **el mostrador va antes que la
historia de la casa**, que está casi al final, y la herramienta de despiece
ocupa el centro.

| # | Sección | Forma |
|---|---|---|
| — | Cortina | seis lonchas de cortafiambres |
| 0 | Portada | shader de veta a pantalla completa, titular de 15 rem, ticket colgado con la pieza del día |
| 1 | El mostrador de hoy | pestañas verticales por día (`es-hoy`), pizarra con leaders, báscula pegajosa |
| 2 | El oficio | **anclado con scrub**: cinco gestos sobre un solo SVG |
| 3 | Despiece | carta del animal (3 animales, 22 piezas) + platos → piezas |
| 4 | Curados de la casa | **pila sticky** de cinco embutidos, fondo oscuro |
| 5 | Listos para cocinar | cinta con velocidad ligada al scroll + lista escalonada |
| 6 | Encargos | calculadora de cocido + formulario |
| 7 | La casa | «1971» gigante, contadores, opiniones marcadas de muestra |
| 8 | Visita | horario con el día de hoy, abierto/cerrado en vivo, mapa bajo clic |

## Paleta — «Azulejo y lomo»

Sale de la carnicería gallega de siempre: azulejo verde pálido en la pared,
mármol, el verde oscuro del zócalo y el color del lomo.

| Token | Hex | Uso |
|---|---|---|
| `--azulejo` | `#E4EBE5` | fondo |
| `--panel` | `#D5DFD7` | encargos, superficies |
| `--papel` | `#F8F9F5` | tarjetas, ticket |
| `--tinta` | `#241013` | texto, portada, curados, pie |
| `--tinta-2` | `#56403F` | texto secundario (7,0–9,0:1) |
| `--mostrador` | `#173F35` | oficio, menú móvil, **cortina** |
| `--hueso` / `--hueso-2` | `#F3EADF` / `#BFD0C7` | texto sobre oscuro |
| `--acento` | `#D8573F` | superficie de marca (cinta, barras, fibra del shader) |
| `--acento-texto` | `#A0321D` | acento como texto (5,2–6,7:1) |
| `--acento-boton` | `#8E2A17` | botones (8,0:1 con papel) |
| `--acento-claro` | `#F49A7F` | acento sobre oscuro |

Paletas alternativas del mando de color, derivadas rotando el matiz del
acento (~9° → ~38° y ~333°) y manteniendo la estructura de luminosidad:
**Azafrán** (`#C98A1E` / `#7F5608` / `#6E4A05` / `#EDC067`) y **Ciruela**
(`#D2588F` / `#9A2C5E` / `#86244F` / `#F09BC0`). La tinta, el papel, los
neutros y **el logo** no cambian. Todas las parejas pasan por
`node scripts/contraste.js` (31 parejas, mínimo 4,58:1 en texto, ≥7,5:1 en
botones).

## Tipografía

- **Bodoni Moda** (variable: `wght` 400–900, `opsz` 6–96, con cursiva) para
  titulares: el Bodoni de los rótulos de comercio de toda la vida, a escala
  de cartel. Comprobados €, ñ, tildes, ¿? y « ».
- **Onest** (variable) para el texto.
- **Red Hat Mono** para precios, pesos, básculas y etiquetas: lo que en el
  mostrador sale impreso.

Ninguna de las tres está en la biblioteca.

## Recursos de movimiento (§2: mínimo 5, aquí 9)

Lenis como único motor · hero WebGL interactivo (protagonista) · secuencia
**anclada con scrub** · char-reveal (letra a letra en la portada, palabra a
palabra en el resto) · pila sticky con escala de las tarjetas que quedan
debajo · cinta con velocidad y sesgo ligados al scroll · botones magnéticos ·
cursor propio contextual (cuchillo sobre la portada, «pesar» sobre el
mostrador, «ver» sobre el despiece) · contadores y máscaras «loncheadas».
Easing único: `expo` para entradas y lonchas, `cubic-bezier(.76,0,.24,1)` para
estados de interfaz.

## Las dos densidades (mando de maqueta)

- **Contraveta**: la veta aparece como fondo de las secciones oscuras, cada
  embutido tiene su dibujo y el mostrador es pizarra.
- **Sobria**: la veta se queda solo donde significa algo (portada, cortina,
  logo y el gesto 4 del oficio). Los dibujos de los curados dejan sitio a **los
  días de curación en grande** (dato en lugar de dibujo), y se **añade** un
  gráfico que la otra no tiene: los 18 precios por kilo de la semana en la
  misma vara, con los del día marcados.

## Cómo reskinearla para una carnicería real

Lo más valioso del repo. En orden:

1. **Nombre y logo**: `img/logo.svg`, `img/favicon.svg`, el sello inline de
   la cabecera (`.marca-sello` en `index.html` y `legal.html`) y el de la
   cortina. El sello son tres fibras y un tajo: se puede conservar como
   símbolo de oficio y cambiar solo el nombre.
2. **Datos**: dirección, teléfonos y correo en `index.html` (cabecera del menú
   móvil, sección «Visita», JSON-LD) y la consulta del mapa en `main.js`
   (busca `maps?q=`). Horario: tabla `#horario` **y** la constante `HORARIO`
   de `main.js` (minutos desde medianoche), que calcula «abierto ahora».
3. **Mostrador del día**: cada `.pizarra` es un día (1 = lunes … 6 = sábado);
   cada `.pieza` lleva `data-nombre` y `data-precio` (€/kg, con punto). La
   báscula, el ticket de la portada y el comparador de la versión sobria se
   alimentan de ahí: no hay que tocar JS.
4. **Despiece**: el objeto `P` de `main.js` (nombre, texto, platos, precio por
   pieza). Las zonas del dibujo se enlazan por `data-pieza`.
5. **Curados**: cada `<li class="pila-item">` (días en `curado-dias-num` y en
   `--d` de la barra, sobre 180). La altura de la pila se mide sola.
6. **Calculadora de cocido**: la constante `LOTE` de `main.js` (gramos por
   persona y €/kg).
7. **Color**: los tokens `--acento*` de `:root` en `css/estilo.css`. Pasar
   `scripts/contraste.js` con los nuevos valores antes de publicar. El shader
   lee los colores de los tokens: no hay que tocar GLSL.
8. **Fotos**: esta plantilla no usa ninguna. Si el cliente tiene fotos buenas
   de su mostrador, el sitio natural es el bloque `.curado-dibujo` (4:3).
9. **Quitar los mandos de demostración** (siguiente apartado).
10. **Sello y `noindex`**: quitarlos solo cuando sea la web real del cliente.

## Quitar los mandos (maqueta y color) — nunca viajan al cliente

Los mandos solo se ven con `?revision` en la URL, pero el código va dentro. Para
borrarlo, en este orden:

1. `index.html`: borrar el bloque entre `<!-- AVISO: mando de DEMOSTRACIÓN` y
   `<!-- /mandos -->`.
2. `index.html` y `legal.html`: en el script bloqueante del `<head>`, borrar las
   líneas entre `// mandos:` y `// /mandos` (dejan de leerse `mouriscal-maqueta`
   y `mouriscal-paleta`).
3. `js/main.js`: borrar el bloque entre `/* ---------- AVISO: mandos` y
   `/* /mandos */`.
4. `css/estilo.css`: borrar el bloque entre `/* ---------- Mandos de
   demostración` y `/* /mandos */`, y las dos líneas `.paleta-azafran` /
   `.paleta-ciruela`. Si el cliente elige la sobria, convertir las reglas
   `.maqueta-sobria …` en las reglas base y borrar las de la cargada.
5. Aviso de cookies (`index.html`) y `legal.html`: quitar la mención a los
   mandos de demostración.

La receta está **comprobada por script contra los archivos**:
`node scripts/quitar-mandos.js` la ejecuta sobre una copia temporal, comprueba
que no queda ni rastro (`mandos`, `mouriscal-maqueta`, `mouriscal-paleta`,
`paleta-azafran`) y que `main.js` sigue siendo JavaScript válido.

## Verificación

`scripts/verificar.js` (Playwright, Chromium), `scripts/auditar.js` (axe-core →
`AUDITORIA.md`), `scripts/contraste.js` y `scripts/quitar-mandos.js`. Números de
la última pasada en `INFORME-NOCHE.md`; capturas en `screenshots/`.

## Créditos

Todo el material gráfico es SVG propio (ver `CREDITOS.md`). Tipografías de
Google Fonts (OFL).

## Decisiones tomadas

- **Cero fotografías.** Se valoró Pexels/Unsplash para el producto, pero el
  encargo pedía «nada sangriento» y registro de textura; una foto de archivo
  de carne cruda es exactamente lo que se quería evitar, y la búsqueda no
  funciona en headless. La textura la pone el shader y el producto lo ponen
  las ilustraciones.
- **Galego en los nombres de producto** (androlla, botelo, unto, lacón, raxo)
  y **castellano** en todo lo demás, como hablaría el mostrador de Vilalba.
- **Ningún registro sanitario, IGP ni premio inventado**: se dice
  expresamente en el aviso legal dónde iría el real.
