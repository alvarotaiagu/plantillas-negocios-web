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
