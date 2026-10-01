# Ida e Retorno · Instalacións — plantilla de instalador (Ourense)

> **Sitio de demostración.** Ida e Retorno es un negocio **ficticio**: nombre,
> dirección, teléfonos, número de empresa instaladora, precios y opiniones son
> de muestra y no corresponden a ningún negocio real. Todas las páginas llevan
> `noindex, nofollow`.

Borrador de la fase 1 (concepto, paleta, tipografía, estructura). El README
completo —mapa de secciones, receta de reskin y recetas de borrado de los
mandos— se escribe al cerrar la plantilla.

## Concepto: «Circuito»

Fontanería, electricidad y calefacción parecen tres oficios y son uno: **cerrar
circuitos**. El agua sale de la caldera por la ida y vuelve más fría por el
retorno; la corriente sale del cuadro y vuelve por el neutro; el agua de la
casa entra por la acometida y sale por el desagüe. Un circuito que no se cierra
es una avería; un circuito mal cerrado es una factura. Y casi todo va **por
dentro de la pared**, donde el cliente no lo ve.

De ahí cuelga todo:

- **La pareja térmica** como paleta: ida caliente (coral) y retorno frío
  (azul), sobre hierro fundido. No es un acento; es la lectura que hace un
  instalador de cualquier tubería.
- **El hero es una cámara termográfica.** La pared está a oscuras; el cursor
  (o el dedo) es la lente y enseña el suelo radiante y las tuberías que van por
  dentro, con el agua caliente avanzando desde la caldera. El scroll abre el
  paso: la ida se calienta conforme bajas.
- **La cortina es la pared de yeso** que se abre por una roza.
- **El nombre**: la ida y el retorno son las dos tuberías de cualquier
  calefacción. Un circuito cerrado.

## Qué hace esta mejor que las anteriores

Revisadas antes de diseñar las fichas de «Sombra» (fotovoltaica), «Despiece»
(taller), «Secuencia» (seguridad) y «Trinquete» (abogacía), que son las cuatro
de registro oscuro-técnico o de mecanismo más cercanas a este encargo:

1. **Hero en WebGL con significado, no de fondo.** Las anteriores usan canvas
   2D (Trinquete, Trasfega, Carga) o SVG (Despiece, Sombra). Aquí hay un
   *fragment shader* propio: un campo de temperatura calculado desde una
   textura del trazado real de las tuberías, con la lente termográfica
   siguiendo al cursor y el frente de agua caliente avanzando con el scroll.
   Interactivo de verdad: sin mover el ratón no ves la instalación.
2. **La narrativa anclada cuenta el oficio y mide algo.** «Sombra» y
   «Despiece» anclan una escena; aquí la escena anclada es una obra entera, de
   la llamada al boletín, y cada paso mueve un **manómetro** que acaba en la
   prueba de presión real de una instalación (de 0 a la presión de prueba y
   aguantando). Los pasos no se cuentan en tarjetas: se *trazan* como una
   tubería con scrub que se va llenando.
3. **Tipografía variable usada como variable.** Una sola familia (Mona Sans,
   ejes de anchura 75–125 y peso 200–900) que **se dilata con el calor**: los
   titulares ganan anchura conforme les llega la ida. Ninguna plantilla anterior
   anima un eje de fuente; todas cargan dos o tres familias estáticas.
4. **Transiciones entre secciones que no son fade-up**: la roza (un corte
   horizontal que abre la sección de yeso), el cambio de pared a hierro con
   borde curvo y la tubería que baja de una sección a otra.
5. **Lo que en el registro aún es deuda, aquí viene hecho**: `longtask` medido
   con `PerformanceObserver` en frío, FPS del shader medidos, y auditoría axe en
   el repo.

## Paleta (calculada con `scripts/contraste.js`)

| Token | Valor | Uso |
|---|---|---|
| fondo | `#12100E` | hierro fundido |
| panel / panel2 | `#1A1714` / `#221E1A` | superficies |
| hueso / humo | `#F2ECE3` / `#B5AB9E` | texto / texto secundario (16,2 y 8,4 : 1) |
| yeso / yeso2 | `#E9E2D6` / `#DDD4C5` | secciones de pared |
| tinta / tinta suave | `#1B1714` / `#5B5047` | texto sobre yeso |
| **quente** (ida) | `#FF7654` | acento caliente; botón con texto `#12100E` a 7,0:1 |
| **fría** (retorno) | `#4DB8F0` | acento frío |
| quente / fría de texto sobre yeso | `#A22C16` / `#1A5885` | solo texto |

Alternativas del mando de paleta, derivadas rotando el matiz en OKLCH
(conservando L y C): **Latón** (+32°) y **Brezo** (−48°). Todas las parejas
pasan (ver script).

## Tipografía

**Mona Sans** (variable: `wdth` 75–125, `wght` 200–900) para todo, y **Geist
Mono** para datos, rótulos y número de muestra. Ninguna de las dos aparece en
la biblioteca.
