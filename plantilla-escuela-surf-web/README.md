# Treboada · Escola de Surf — plantilla de escuela de surf

> **Sitio de demostración.** Treboada es un negocio **ficticio**; los datos,
> el parte de olas, las ilustraciones y las opiniones son de muestra. Ningún
> dato corresponde a una escuela real. Todas las páginas llevan
> `noindex, nofollow`.

Web estática (HTML + CSS + un `main.js`, sin build) de una escuela de surf
inventada en **Malpica de Bergantiños** (Costa da Morte, A Coruña). Se abre
con doble clic y se publica tal cual en GitHub Pages.

## El concepto: «Mar de fondo»

Lo que rompe un martes en la playa de Malpica nació tres días antes en una
borrasca a dos mil kilómetros, al oeste de Irlanda. El viento lo levantó
desordenado; el viaje lo ha ido ordenando en **líneas** separadas por su
período, y el fondo de la costa lo dobla, lo frena y lo levanta justo antes de
romper. Eso es el *mar de fondo*, y es lo único que de verdad hay que aprender
en una escuela de surf: **leer el mar antes de entrar en él**.

De ahí cuelga todo:

- **El dibujo** son las líneas de mar de fondo vistas desde el acantilado:
  crestas paralelas que se curvan al pasar por un bajo. No hay palmeras, ni
  sol, ni atardecer naranja: hay un Atlántico frío a 13 °C en marzo.
- **El hero** es un *shader* WebGL con esas líneas. El cursor (o el dedo) es
  **un bajo de arena**: las crestas se frenan y se doblan a su alrededor, que
  es exactamente la refracción que hace buena una playa. La isla fija a la
  derecha hace lo mismo que las Sisargas.
- **La secuencia anclada** cuenta el viaje de una ola en cinco pasos con la
  física de verdad (relación de dispersión, asomeramiento y rotura a
  H ≈ 0,78·h): velocidad, altura y profundidad se calculan, no están
  escritas.
- **La cortina** es la resaca: una lámina de espuma que cubre la pantalla y se
  retira hacia abajo con el borde ondulado, como el agua que vuelve al mar.
- **El nombre**: *treboada* es «tormenta» en gallego. La escuela se llama
  como el sitio donde nace la ola que vas a coger.

## Qué hace esta mejor que las anteriores

Antes de diseñar se revisaron las fichas de **Trinquete** (abogacía),
**Contraluz** (abogacía penal), **GNOMON** (fotovoltaica) y **VINTE QUILOS**
(gimnasio). Lo que esta mejora, en concreto:

1. **Primer hero WebGL de la biblioteca con interacción que significa algo.**
   Los heroes de canvas anteriores (magnesio, malta, burbujas, mecanismo) son
   2D y el cursor, cuando interviene, *ilumina* o *limpia*. Aquí el cursor
   **cambia la física del dibujo**: es un bajo que refracta el mar de fondo, y
   lo que se ve es lo que explica la escuela.
2. **La secuencia anclada calcula, no ilustra.** En «Despiece» o «Inventario»
   el scrub mueve piezas dibujadas. Aquí el scrub mueve una ola cuya altura,
   longitud y velocidad salen de la relación de dispersión en cada fotograma,
   y los números que se leen al lado son el resultado de ese cálculo.
3. **Tipografía variable usada como material.** Roboto Flex se usa con su eje
   de anchura (25–151) como un mar: los titulares se hinchan y se estrechan al
   paso de una ola por las letras. Ninguna plantilla anterior anima ejes.
4. **Rendimiento y accesibilidad medidos al nacer**, no como deuda: tareas
   largas con `PerformanceObserver` (en frío y con el shader vivo) y axe-core
   sobre las tres páginas en escritorio y móvil, con el resultado en el
   `INFORME-NOCHE.md`. Trinquete, Contraluz y VINTE QUILOS los dejaron
   pendientes.
5. **El parte de muestra es una herramienta, no una foto.** Marea con dos
   armónicos reales (M2 y S2) que cambia cada día, altura y período
   generados, bandera y recomendación de nivel derivadas — todo marcado como
   ficticio, y con la hora actual marcada en vivo.

## Mapa de secciones

La estructura no repite ninguna registrada (ni la de Trinquete, que pone la
herramienta primero, ni la de Contraluz):

| # | Sección | Forma |
|---|---|---|
| — | Cortina «resaca» | lámina de espuma que se retira con borde de ola |
| 0 | Portada | shader WebGL a pantalla completa + titular gigante + lectura de la mar |
| 1 | El viaje de una ola | **anclada con scrub**, cinco pasos, física calculada |
| 2 | Niveles | **pila sticky** de cuatro cursos, de la espuma a la serie |
| 3 | Parte de hoy (muestra) | marea del día, altura y período por horas, bandera |
| 4 | Material | **galería anclada horizontal** de tablas + calculadora de alquiler + agua por meses |
| 5 | Seguridad | la corriente de retorno animada y las cinco reglas |
| 6 | Campamento de verano | semanas, horario y precio; sin una sola imagen de menores |
| 7 | Quién te mete en el agua | tres instructores en ilustración propia + voces de muestra |
| 8 | Preguntas | `<details>` nativo |
| 9 | Reserva y contacto | formulario de muestra, horario, mapa bajo clic |

## Paleta

| Token | Color | Uso |
|---|---|---|
| `--abismo` | `#040B0F` | pie, fondo más hondo |
| `--fondo` | `#07141A` | fondo general |
| `--panel` | `#0C1D24` | superficies |
| `--panel2` | `#12262F` | superficies elevadas |
| `--linea` | `#1E3843` | filetes |
| `--pizarra` | `#3D5965` | líneas decorativas (no texto) |
| `--humo` | `#98B0B8` | texto secundario (6,87:1 en el peor fondo) |
| `--espuma` | `#E6F0EF` | texto |
| `--vidrio` | `#8CE0CC` | acento: vidrio de mar (10,16:1 en el peor fondo) |
| cortina | `#D9E6E4` | la lámina de espuma, distinta del fondo a propósito |

Alternativas del control de paleta, **derivadas por script** rotando el matiz
del acento y conservando su luminancia relativa: **Xeo** `#B8D4EC` (+42°) y
**Liquen** `#C7D974` (−95°). `node scripts/contraste.js` comprueba las 26
parejas.

## Tipografía

**Roboto Flex** (variable: `opsz`, `wdth` 25–151, `wght` 100–1000) para
titulares y texto, y **Red Hat Mono** para los datos del mar. Ninguna de las
dos está en el registro.

## Recursos de movimiento (PLIEGO §2)

Lenis (jsDelivr) como único motor de scroll · hero WebGL interactivo ·
secuencia anclada con scrub · pila sticky · galería anclada horizontal ·
char-reveal con la anchura variable · marquesina ligada al scroll · botones
magnéticos · cursor propio contextual · contadores · bordes de sección que
se agitan con la velocidad del scroll.

## Los dos mandos de demostración (solo con `?revision`)

Abajo a la izquierda, **ocultos salvo que la URL lleve `?revision`** y apartados
mientras el aviso de cookies está en pantalla:

- **Maqueta**: «Mar de fondo» (la cargada) y «Sobria». En la sobria las líneas
  de mar de fondo se quedan solo donde significan algo —el shader de la
  portada, el viaje de la ola y el logo— y se retiran las texturas de líneas de
  las tarjetas, las de los retratos y el agitado de los bordes de sección; el
  titular de portada deja de hincharse. Donde había dibujo manda el dato: el
  perfil de ola de cada nivel se cambia por **la altura en grande**. Y la sobria
  **añade** algo que la cargada no tiene: la comparativa de **euros por hora
  real dentro del agua** de los cuatro niveles (sale de los `data-horas` y
  `data-precio` de cada `<li>`, no se repite la cifra en el script).
- **Paleta**: Vidrio (la real), Xeo y Liquen. Solo cambia `--vidrio`; tinta,
  fondos, grises y logo no cambian.

Con `?revision` la elección se recuerda en `localStorage`
(`treboada-maqueta`, `treboada-paleta`) y se aplica en el script bloqueante del
`<head>`, así que al recargar no hay salto. Sin `?revision` la web enseña
siempre la versión real. El aviso de cookies y `legal.html` lo dicen.

### Borrar los mandos (antes de entregar a un cliente)

Todo lo de los mandos vive entre marcas `MANDOS:INICIO` y `MANDOS:FIN`
(7 bloques: 3 en `index.html`, 1 en `legal.html`, 2 en `css/estilos.css`,
1 en `js/main.js`). Paso a paso:

1. `node scripts/borrar-mandos.js --comprobar` — lo hace en una copia
   temporal: cuenta las parejas de marcas, se niega a escribir si un archivo
   pierde más líneas de las que suman sus bloques, comprueba que no queda
   ninguna referencia (`mandos`, `paleta-xeo`, `treboada-maqueta`…) y que
   `main.js` sigue siendo JavaScript válido. Salida esperada:
   `index.html: 3 bloque(s), 27 línea(s)` · `legal.html: 1, 1` ·
   `css/estilos.css: 2, 14` · `js/main.js: 1, 23`.
2. Si sale limpio: `node scripts/borrar-mandos.js --aplicar`.
3. Si el cliente eligió la **sobria**, añadir `class="maqueta-sobria"` fija al
   `<html>` (las reglas de la sobria no dependen de los mandos). Si eligió
   otra paleta, cambiar el valor de `--vidrio` en `:root`.
4. Quitar de `legal.html` y del aviso de cookies nada más: los textos de los
   mandos ya iban dentro de las marcas.

Comprobado contra los archivos reales con el propio script (ver
`INFORME-NOCHE.md`).

## Reskinear a una escuela real

Lo más valioso del repo. Por orden:

1. **Datos**: nombre, dirección, teléfono y correo en `index.html` (cabecera,
   contacto, pie y el JSON-LD del `<head>`), `legal.html` y `manifest.json`.
   El JSON-LD es `SportsActivityLocation` sin `aggregateRating` ni `review`.
2. **Niveles y precios**: cada `<li class="pila-item">` lleva `data-horas` y
   `data-precio`; la comparativa de la sobria sale de ahí. Los textos y las
   cifras de cada tarjeta, en el propio `<article>`. La altura de la pila se
   mide sola.
3. **Tablas**: las siluetas salen de `node scripts/tablas.js` (largo, ancho,
   anchura de pico y de cola, tipo de cola). Cambiar la lista, ejecutar y
   pegar los `d` en `index.html`.
4. **Agua por meses**: `data-t` y `style="--t:…"` de cada `<li>` en
   `#agua-meses`, más la letra del neopreno. El parte usa la del mes actual.
5. **El parte**: **sigue siendo de muestra**. Para una escuela real hay que
   sustituir el bloque «3 · Parte de MUESTRA» de `main.js` por datos de un
   servicio con licencia (y quitar el aviso) o, mejor, dejar solo la marea
   oficial y el veredicto que publique la escuela cada mañana.
6. **Lugar del shader**: la isla fija está en `vec2 isla = vec2(0.66 * asp, 0.62)`
   del fragment shader. Moverla a donde quede la roca o el espigón real.
7. **Física del viaje**: `perfil` (x del dibujo → profundidad en metros), `T`
   (período) y `H0` (altura en mar abierto) al principio del bloque «1 · El
   viaje de una ola». El dibujo del fondo es el `path#corte-lecho`.
8. **Paleta**: `:root` en `css/estilos.css`; después `node scripts/contraste.js`
   con los valores nuevos (comprueba 26 parejas y deriva las alternativas).
9. **Mapa**: la consulta va a la localidad, no a un local
   (`main.js`, bloque «Mapa solo bajo clic»).
10. **404**: usa rutas absolutas con el prefijo `/plantilla-escuela-surf-web/`
    porque GitHub Pages lo sirve en cualquier profundidad; si el repo cambia
    de nombre, cambiar el prefijo.

## Decisiones tomadas

- **Sin fotografía.** El contenedor de esta noche no llega ni a Unsplash ni a
  Pexels ni a Wikimedia (403 del proxy). El pliego dice «antes ilustración que
  foto mala o `<img>` roto», y aquí la ilustración es mejor que la foto: el
  mar lo pinta el shader. No hay `<img>` de archivo; `CREDITOS.md` lo explica.
- **Personas solo en ilustración propia**: tres retratos planos de adultos y
  una surfista de trazo en el corte. El campamento no tiene ni una figura,
  y la página lo dice: «no publicamos imágenes de menores».
- **El parte de muestra se genera de la fecha** para que la demo esté viva
  cada día, y va marcado como ficticio en cuatro sitios (sección, portada,
  cinta y aviso legal) con una frase que manda a un parte oficial.
- **Resolución adaptativa del shader**: si el fotograma pasa de 22 ms de
  media, el búfer baja hasta un 32 % del tamaño. Ver el informe.
- **Lenis con `lerp` 0,16**, por la galería horizontal (PLIEGO §6).
- **La pila deja de anclarse** si la tarjeta más alta no cabe bajo la
  cabecera (clase `pila-plana`): mejor lista normal que tarjeta cortada.

## Archivos

`index.html` · `legal.html` · `404.html` · `css/estilos.css` · `js/main.js` ·
`img/` (favicon, marca, iconos y `og.png` generados) · `manifest.json` ·
`.nojekyll` · `scripts/` (contraste, tablas, og, verificación, borrado de
mandos) · `screenshots/` (capturas de la verificación) · `CREDITOS.md` ·
`INFORME-NOCHE.md`.

## Créditos

Ver [`CREDITOS.md`](CREDITOS.md).
