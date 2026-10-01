# Paso Fino · ferretería de barrio en Narón

> **Sitio de demostración. Paso Fino es un negocio ficticio; los datos,
> fotografías y opiniones son de muestra.** Nombre, dirección (Rúa do
> Parafuso, 7 · 15570 Narón), teléfonos (981 00 00 00 · 600 00 00 00), correo
> (`hola@pasofino.example`), personas, precios y opiniones son inventados.
> Todas las páginas llevan `noindex, nofollow`.

Plantilla de la biblioteca de webs de negocio ficticio, sector **ferretería de
barrio**. Web estática: `index.html` + `css/styles.css` + `js/main.js`, sin
build. GSAP, ScrollTrigger y Lenis por jsDelivr. Se abre con doble clic.

**Modo revisión:** añade `?revision` a la dirección para ver el mando de
demostración (abajo a la izquierda): densidad **Rosca / Sobria** y color
**Minio / Cobalto / Cardenillo**.

---

## Qué hace esta mejor que las anteriores

Antes de diseñar se revisaron las fichas de **Trinquete** (abogacía, mecanismo
en canvas 2D), **Carrexo** (mudanzas, negro + amarillo señal), **Rodadura**
(taller, despiece SVG anclado) y **Contraluz** (penal, foco que sigue al
cursor). Lo que esta hace por encima de ellas, en concreto:

1. **Primer hero en 3D real de la biblioteca.** Las anteriores pintan en
   canvas 2D (Trinquete, Trasfega, Vinte Quilos) o en SVG (Rodadura). Aquí el
   tornillo es un **M10 con su rosca helicoidal calculada en un shader
   (raymarching de una SDF)**: cabeza hexagonal achaflanada, arandela y
   filete en V. Y no es decoración: **el scroll lo aprieta** —giro y avance
   ligados por el paso, como un tornillo de verdad— y **el cursor mueve la
   lámpara del taller** sobre el metal. Una lectura en vivo dice cuántas
   vueltas lleva y cuántos milímetros ha avanzado (1,5 mm por vuelta, el paso
   real de un M10).
2. **Pinta solo cuando algo cambia.** Trinquete y Trasfega dibujan en bucle
   permanente. Aquí el shader se pinta bajo demanda (scroll, cursor, la
   entrada) y se para en cuanto los valores convergen, se apaga fuera de
   pantalla y baja de resolución si detecta un renderizador por software.
   Las tareas largas se miden con `PerformanceObserver` **en frío** y con un
   control que demuestra que el observador está vivo (deuda abierta en 18 de
   las 27 plantillas publicadas).
3. **Una herramienta que funciona de verdad, a tamaño real.** «La galga»
   calibra la pantalla con una tarjeta bancaria (85,6 mm, norma ISO/IEC 7810)
   y dibuja el tornillo elegido **a escala 1:1**, con su paso de rosca, la
   llave que le va y la broca del taco. Es lo que hace un ferretero con el
   tornillo que le traes en la mano; ninguna plantilla anterior tenía un
   utensilio físico.
4. **La secuencia anclada cuenta el oficio entero, no lo ilustra.** Rodadura
   separa piezas y Carrexo carga cajas; aquí el scrub **ejecuta la copia de
   una llave**: la virgen entra, cierran las mordazas, el palpador lee el
   dentado de la original y la fresa lo repite en la virgen (el material se
   va de verdad, con virutas), el cepillo quita la rebaba y la llave gira en
   el bombín, con un cronómetro que llega a los 4:30 reales. El mismo
   `setP(p)` sirve al scrub, al modo sin GSAP y al de movimiento reducido,
   que por eso siguen cambiando de estado sin moverse.
5. **Escala tipográfica que trabaja.** Una sola familia variable (Mona Sans)
   con el eje de **anchura** como gesto: las letras de cada titular llegan
   anchas (`wdth 125`) y **se aprietan** hasta `wdth 75`, como una tuerca.
   Titular de portada a ~19 rem en escritorio y ~38 vw en móvil.
6. **Auditoría con axe dentro del propio repo**, en escritorio y móvil, y
   verificación con 58 comprobaciones por código (`scripts/verify.js`).

## El concepto: «Rosca»

**Cada vuelta, un paso: ni más, ni menos.** Un tornillo avanza exactamente su
paso en cada vuelta; una ferretería de barrio trabaja igual: tráenos la
pieza, salimos con la que encaja, y si no la hay, mañana a mediodía. De ahí
cuelga todo:

- La **numeración de secciones es métrica de tornillo**: M3, M4, M5, M6, M8,
  M10, M12 (y M404 en la página de error). La página «crece de diámetro»
  conforme bajas.
- El **tornillo de la portada** se aprieta con el scroll.
- Los **filetes** entre secciones son un perfil de rosca en V que gira con
  el scroll y se va pintando de minio.
- La **cortina** es una tuerca que se desenrosca y una chapa de minio con el
  filete en el canto (sobre una curva) que corre de lado mientras sube.
- La **entrada de secciones** no es un fade: se descubren en diagonal, al
  ángulo del flanco de una rosca.
- El **cursor** se vuelve tuerca sobre la herramienta y la copiadora.
- La **voz**: «Aquí no nos pasamos de rosca», «Esto se ha pasado de rosca»
  (404), «Paso Fino. Ni más, ni menos».

Comprobado contra `REGISTRO.md` y las 34 fichas de `registro/`: «Rosca» no
está usado; ningún concepto de tornillería. Vecinos vigilados: **Trinquete**
(engranajes, relojería, fondo claro + latón), **Despiece** (rueda, ámbar sobre
azul acero) e **Inventario** (negro + amarillo señal). Aquí no hay ni una
rueda dentada ni amarillo.

## Mapa de secciones

| # | Sección | Qué es | Forma |
|---|---|---|---|
| — | Cortina | tuerca + chapa de minio con filete | `expo.inOut`, canto curvo dentado |
| — | Portada | «PASO / FINO» + tornillo en WebGL + lectura en vivo | asimétrica: texto abajo-izquierda, tornillo sangrando por la derecha, regla milimetrada en el margen |
| M3 | El mostrador | manifiesto + cuatro promesas con su cifra | titular a todo ancho, cuerpo desplazado a la derecha |
| M4 | Copia de llaves | la copiadora, anclada con scrub | 5 pasos, cronómetro 00:00 → 04:30 |
| M5 | Cajones | catálogo por familias (6) con precios de muestra | pila sticky de frentes de cajón con portaetiquetas a rotulador; intro fija a la izquierda |
| — | Cinta | lo que pidieron esta semana | marquesina con la velocidad del scroll, sobre minio |
| M6 | Panel de alquiler | 8 herramientas sobre su silueta pintada | tablero perforado; la alquilada deja solo la sombra; ficha con precio/fianza |
| M8 | La galga | identificador de tornillo a escala real | mandos a la izquierda, mesa de dibujo a la derecha |
| M10 | Tarifa | llaves, mandos y afilado | texto a la izquierda, ticket de mostrador que se imprime |
| M12 | Dónde | horario con «hoy» y abierto/cerrado, mapa bajo clic, encargo 24 h, opiniones, equipo | rejilla de 12 columnas, irregular |
| — | Pie | sello de demo, aviso legal, reabrir cookies | — |

Estructura distinta de las registradas: es la primera que pone **una
herramienta física (la galga) y un servicio ejecutado en pantalla (la llave)**
como secciones propias, y la primera numerada por métrica.

## Paleta (verde de máquina + minio)

| Token | Valor | Uso |
|---|---|---|
| `--fondo` | `#0E1411` | fondo, verde casi negro de máquina-herramienta |
| `--panel` / `--panel2` | `#151D19` / `#1C2621` | bandas y tarjetas |
| `--linea` / `--acero` | `#2C3832` / `#4A5951` | filetes y bordes (nunca texto) |
| `--humo` | `#A4B1A9` | texto secundario — **7,00:1** en el peor fondo |
| `--hueso` | `#EDF0EA` | texto — **13,53:1** en el peor fondo |
| `--cinta` / `--cinta-tinta` | `#E9DFC3` / `#2A2619` | portaetiquetas y ticket — 11,37:1 |
| `--acento` | `#E2552B` **minio** | superficies: cortina, cinta, filetes |
| `--acento-claro` | `#FF8C66` | texto y botones — 8,16:1 sobre el fondo |

Hay **dos minios** y no se intercambian: el de superficie (`--acento`, 4,94:1
con el fondo) no llega al ~7:1 de botón, así que botones y texto usan
`--acento-claro`. Todo calculado con `node scripts/contraste.js`.

**Paletas derivadas del mando** (rotación de matiz en OKLCH, misma L y C):
Cobalto (`#0A8BF4` / texto `#76B4FE`, 8,63:1 y 5,34:1) y Cardenillo
(`#06A36F` / `#32CD97`, 9,15:1 y 5,75:1). Tinta, fondos y logo no cambian.

## Tipografía

- **Mona Sans** variable (`wdth` 75–125, `wght` 200–900): titulares a
  `wdth 75 / wght 860` en mayúsculas, cuerpo a `wdth 100`. El eje de anchura
  es el gesto del char-reveal.
- **Geist Mono**: etiquetas, precios, lecturas, ticket.
- **Permanent Marker**: solo los portaetiquetas de los cajones (rotulador).

Glifos revisados en captura: €, ñ, tildes, ¿?, « », ×, ½ ⅜ ¾ y ″.

## Movimiento (PLIEGO §2: 9 recursos)

1. **Lenis** como único motor (`lerp` 0,14).
2. **Char-reveal** letra a letra con el eje de anchura (125 → 75).
3. **Pila sticky** de cajones (el `<li>` es el sticky; mismo alto medido por JS).
4. **Marquesina** con velocidad ligada al scroll.
5. **Botones magnéticos**.
6. **Secuencia anclada con scrub** (la copiadora de llaves).
7. **Cursor propio** punto + aro, que se hace tuerca (solo ratón).
8. **Hero WebGL** interactivo (scroll aprieta, cursor ilumina).
9. **Contadores** + ticket que se imprime + entrada en diagonal de flanco.

**Protagonista:** el tornillo que se aprieta con el scroll. Distinto del de la
plantilla anterior (Trinquete: mecanismo que acelera).

## Las dos densidades (mando «Rosca» / «Sobria»)

- **Rosca**: la rosca en todas partes — filetes entre secciones, cabeza de
  tornillo en cada número de sección, regla milimetrada, tiradores de cajón,
  tuercas en la marquesina y en las listas, cursor-tuerca.
- **Sobria**: la rosca solo donde significa algo (logo, cortina, tornillo de
  la portada, copiadora y galga). **Intercambia dibujo por dato**: la
  numeración M3…M12 pasa a cifra grande; el rotulador de los cajones pasa a
  mono. Y **añade** lo que la otra no tiene: un gráfico de **precio por
  unidad según cómo compres el tornillo** (blíster, caja de 25, suelto aquí,
  caja de 200), que es el argumento de venta de la tienda contado con una
  sola vara.

## Para reskinear a un cliente real

Lo más valioso del repo. En orden:

1. **Datos** (`index.html`): nombre, dirección, teléfonos, WhatsApp, correo,
   horario (tabla `.horario-tabla` **y** la constante `TRAMOS` de
   `js/main.js`, en minutos desde medianoche), JSON-LD `HardwareStore` (sin
   `aggregateRating` ni `review`), equipo y opiniones (con permiso del
   cliente, o quitar el bloque `.voces`).
2. **Mapa**: la `q=` del iframe en `js/main.js` (§4 «Mapa bajo clic»).
   Para un negocio real, la dirección exacta.
3. **Catálogo**: las seis `.pila-item`. Se pueden poner más o menos: la
   altura de la pila se mide sola. Los precios son de muestra: o se ponen
   los reales o se quita la columna.
4. **Panel de alquiler**: el array `HERR` de `js/main.js` (nombre, precios
   medio día/día/fin de semana/fianza, qué lleva, `fuera` si está alquilada,
   y el SVG en una caja de 120×120 con clases `cuerpo`, `metal`, `negro`).
5. **Tarifa**: la tabla del ticket.
6. **Color**: `--acento` y `--acento-claro` en `:root`. Recalcular con
   `scripts/contraste.js` (editar `T` y ejecutar). El logo lleva el minio
   escrito a fuego (`#E2552B`): cambiarlo en los SVG de `index.html`,
   `img/favicon.svg` y regenerar `og.png`/iconos con `scripts/imagenes.js`.
7. **Tornillo del hero**: el color del reflejo lateral sale de `--acento`;
   la geometría está en el shader (`P` paso, `R` radio, `H` profundidad del
   filete).
8. **Quitar el mando** (abajo) y el sello de demostración, `noindex` y los
   avisos de «de muestra».

## Quitar el mando de demostración

El mando **nunca viaja al sitio de un cliente**. Receta comprobada por
script contra los archivos (`node scripts/receta-mando.js` la aplica sobre
una copia, abre la copia en Chromium y comprueba que carga limpia):

1. **`index.html`**: en el script del `<head>`, borrar el bloque
   `try { if (/[?&]revision\b/ … } catch (e) {}` (9 líneas). Y borrar el
   `<div class="mando">` entero con su comentario `MANDO DE DEMOSTRACIÓN`
   (16 líneas, hasta antes de `<div class="cursor">`). Si el cliente elige
   la versión sobria, cambiar `d-rosca` por `d-sobria` en ese script.
2. **`css/styles.css`**: borrar de `/* MANDO DE DEMOSTRACIÓN · paletas
   derivadas` a `/* FIN paletas del mando */` (5 líneas) y de
   `/* ---------- MANDO DE DEMOSTRACIÓN (no viaja al cliente)` a
   `/* FIN mando */` (13 líneas). El bloque de la versión sobria se queda
   si se elige sobria; si no, se puede borrar.
3. **`js/main.js`**: borrar de `/* MANDO DE DEMOSTRACIÓN — no viaja` a
   `/* FIN mando */` (28 líneas). El resto del JS ya comprueba si el mando
   existe.
4. **Textos**: en el aviso de cookies quitar «(y, en modo revisión, la
   versión elegida en el mando)», y en `legal.html` la línea de
   `pasofino-maqueta` / `pasofino-paleta`.

## Decisiones tomadas

- **El mando solo aparece con `?revision`**, y las preferencias guardadas
  solo se aplican en ese modo: así quien entra por la dirección normal ve
  siempre la versión de referencia, aunque un revisor haya dejado otra
  guardada en ese navegador.
- **Cero fotografía.** Una ferretería tiene producto fotografiable, pero la
  foto de archivo de estanterías es la imagen más gastada del sector y no
  dice nada de esta tienda; todo es dibujo propio o 3D.
- **El mapa apunta a Narón, no a una calle**: la Rúa do Parafuso no existe.
- **Electricidad sin instalación**: el cajón remite a un electricista
  autorizado (esta noche otra plantilla es de fontanería-electricidad; aquí
  se vende material, no se instala).
- **Llaves de coche con chip solo con documentación** a nombre del cliente.

## Archivos

`index.html`, `legal.html`, `404.html`, `css/styles.css`, `js/main.js`,
`img/` (favicon, iconos, `og.png` 1200×630, respaldo `tornillo.svg`),
`manifest.json`, `.nojekyll`, `CREDITOS.md`, `scripts/` (contraste,
verificación, receta del mando, imágenes) y `screenshots/`.

Créditos completos en [`CREDITOS.md`](CREDITOS.md): sin fotografía; fuentes
OFL de Google Fonts; GSAP, ScrollTrigger y Lenis.
