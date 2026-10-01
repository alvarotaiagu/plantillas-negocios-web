# Ida e Retorno · Instalacións — plantilla de instalador (Ourense)

> **Sitio de demostración.** Ida e Retorno es un negocio **ficticio**: nombre,
> dirección, teléfonos, número de empresa instaladora, precios, horarios,
> equipo y opinión son de muestra y no corresponden a ningún negocio real.
> Todas las páginas llevan `noindex, nofollow` y el sello en el pie.

Plantilla del sector **instalador de fontanería, electricidad y calefacción**
(calderas, aerotermia, reformas de baño, boletines y urgencias). HTML + CSS +
un `main.js`, sin build. GSAP, ScrollTrigger y Lenis desde **jsDelivr**.

- `index.html` · `legal.html` · `404.html` · `manifest.json` · `.nojekyll`
- `css/styles.css` · `js/main.js` · `img/` (favicon, logo, iconos PWA, `og.png` 1200×630)
- `scripts/contraste.js` (paleta y contraste WCAG), `scripts/verificar.js`
  (verificación §7 con Playwright), `scripts/comprobar-borrado.js` (receta de
  borrado de los mandos, aplicada y comprobada)
- `screenshots/` (capturas de la verificación) · `CREDITOS.md` · `INFORME-NOCHE.md`

## Concepto: «Circuito»

Fontanería, electricidad y calefacción parecen tres oficios y son uno: **cerrar
circuitos**. El agua de la calefacción sale de la caldera por la **ida** y
vuelve más fría por el **retorno**; la corriente sale del cuadro y vuelve por
el neutro; el agua de la casa entra por la acometida y sale por el desagüe. Un
circuito que no se cierra es una avería; uno mal cerrado, una factura. Y casi
todo va **por dentro de la pared**, donde el cliente no lo ve.

De ahí cuelga todo:

- **El nombre**: ida y retorno son las dos tuberías de cualquier calefacción.
  El logo son esos dos tubos cerrados en una curva, en caliente y en frío.
- **La paleta** es la pareja térmica —ida coral, retorno azul— sobre hierro
  fundido, con dos secciones en **yeso** (la pared que se abre).
- **La portada es una cámara termográfica.** La pared está a oscuras; el cursor
  (o el dedo) es la lente y enseña el suelo radiante que va por dentro, con el
  agua caliente avanzando desde el colector. La lectura de la esquina da la
  temperatura bajo la lente y qué hay ahí («Ida · suelo radiante»,
  «Empalme caliente · revisar»). Al bajar, la ida termina de calentarse y la
  lente se abre hasta ocupar la pared entera.
- **La cortina es la pared de yeso**: una roza caliente la corta de lado a lado
  y las dos mitades se abren con el borde curvo.
- **La obra** se cuenta como una tubería que se llena válvula a válvula, con un
  manómetro que sube hasta la prueba de estanqueidad.
- **Las zonas** son un colector con doce salidas: el largo de cada salida es la
  distancia por carretera.

## Qué hace esta mejor que las anteriores

Revisadas antes de diseñar las fichas de «Sombra» (fotovoltaica), «Despiece»
(taller), «Secuencia» (seguridad) y «Trinquete» (abogacía): las cuatro de
registro oscuro-técnico o de mecanismo más cercanas a este encargo.

1. **Hero en WebGL con significado, no de fondo.** Las anteriores usan canvas
   2D (Trinquete, Trasfega, Carga) o SVG (Despiece, Sombra). Aquí hay un
   *fragment shader* propio que calcula un campo de temperatura desde una
   textura del trazado real del suelo radiante (doble espiral intercalada, como
   se instala), con el frente de agua caliente avanzando, el pulso del caudal y
   una lente que obedece al cursor. **Sin mover el ratón no ves la
   instalación**, y la lectura numérica sale de la misma fórmula del shader.
2. **La secuencia anclada mide algo.** «Sombra» y «Despiece» anclan una escena;
   aquí la escena anclada es una obra entera, de la llamada al boletín, y cada
   paso mueve un manómetro (0 → 0,6 → 1,2 → 1,5 → **6 bar de prueba** → 1,5 de
   servicio). La tubería se llena con scrub **exactamente hasta la válvula de
   cada paso** (la fracción de cada nodo se calcula sobre el propio trazado), y
   los pasos se relevan con una cortina de recorte, no con un fundido.
3. **Tipografía variable usada como variable.** Una sola familia, Mona Sans
   (ejes `wdth` 75–125 y `wght` 200–900), que **se dilata con el calor**: el
   titular de portada entra de 75 % a 116 % de anchura, y cada titular de
   sección se ensancha con scrub al llegar al centro. Ninguna plantilla anterior
   anima un eje de fuente.
4. **Transiciones entre secciones que no son fade-up**: la roza que abre la
   sección de yeso desde una línea, el cambio de hierro a pared con borde curvo,
   el conducto que baja de una sección a la siguiente y las salidas del colector
   que se llenan una a una.
5. **Lo que en el registro aún es deuda, aquí viene hecho y medido**: `longtask`
   con `PerformanceObserver` en frío (con control positivo), fotogramas del
   shader contados, auditoría **axe** de portada (escritorio y móvil), aviso
   legal y 404, y la pila sticky probada en pasos de 90 px.

## Mapa de secciones

Distinto en orden, número y forma de las anteriores: **la obra va antes que los
servicios** (primero cómo se trabaja, luego qué se vende) y las urgencias
tienen sección propia con estado en vivo.

| # | Sección | Forma |
|---|---|---|
| — | Cortina | pared de yeso cortada por una roza |
| 00 | Portada | cámara termográfica en WebGL + lectura en vivo |
| 01 | Circuito | declaración en grande + tres circuitos en escalera (agua, luz, calor) |
| 02 | La obra | **anclada**: seis pasos, tubería con scrub y manómetro |
| 03 | Servicios | **pila sticky** de cinco fichas (precios «desde» de muestra) |
| — | Cinta | avisos habituales, velocidad ligada al scroll |
| 04 | Urgencias | estado en vivo (oficina / guardia / avisos), horario con `es-hoy`, «mientras llegamos» |
| 05 | Boletines | sección de yeso que se abre por una roza; libro de certificados; nº de empresa de muestra |
| 06 | Zonas | colector con doce salidas: largo = km |
| 07 | Quién va a tu casa | tres personas en escalera + una opinión de muestra |
| 08 | Presupuesto | segunda pared de yeso; formulario de muestra |
| 09 | Contacto | dirección enorme, datos y mapa bajo clic |

## Recursos de movimiento (PLIEGO §2: mínimo cinco; aquí nueve)

Lenis como único motor (`lerp` 0,14) · char-reveal letra a letra en portada y
palabra a palabra con máscara en dos titulares · pila sticky · marquee con
velocidad ligada al scroll y dirección según el sentido · botones magnéticos ·
**hero WebGL interactivo** · cursor propio contextual (punto + aro; se convierte
en solo punto sobre la lente, en «Mapa» sobre el mapa, se oscurece sobre yeso) ·
**escena anclada con scrub** (protagonista) · máscaras que se abren (roza,
salidas del colector, conductos). Además, el eje de anchura de la fuente
scrubbeado.

**Movimiento protagonista:** la obra anclada (tubería + manómetro). El de la
plantilla anterior del mismo registro —«Secuencia»— era un desfile horizontal;
este es vertical y con instrumento.

## Paleta (calculada con `scripts/contraste.js`)

| Token | Valor | Uso |
|---|---|---|
| fondo | `#12100E` | hierro fundido |
| panel / panel2 | `#1A1714` / `#221E1A` | superficies |
| línea / acero | `#332D27` / `#5A5047` | filetes; nunca texto |
| hueso / humo | `#F2ECE3` / `#B5AB9E` | texto / secundario (16,2 y 8,4 : 1 sobre fondo; 7,3 en el peor panel) |
| yeso / yeso2 | `#E9E2D6` / `#DDD4C5` | secciones de pared |
| tinta / tinta suave | `#1B1714` / `#5B5047` | texto sobre yeso (13,8 / 6,1; 5,3 sobre yeso2) |
| **quente** (ida) | `#FF7654` | acento caliente; botón con texto `#12100E` a 7,0:1 |
| **fría** (retorno) | `#4DB8F0` | acento frío (8,5:1 sobre fondo) |
| quente / fría de texto | `#A22C16` / `#1A5885` | **solo texto sobre yeso** (≥ 4,5 en yeso y yeso2) |
| cobre | `#B9764A` | solo dibujo (tubos) |

Ningún texto se apaga con `opacity`: cada fondo tiene su token de texto
secundario. Alternativas del mando de paleta, **derivadas** rotando el matiz en
OKLCH conservando L y C: **Latón** (+32°: `#e68e05` / `#88a9fc`) y **Brezo**
(−48°: `#f172ba` / `#1bc5b9`). El script comprueba las 46 parejas de las tres
paletas; todas pasan. El logo no cambia de color.

## Tipografía

**Mona Sans** variable (`wdth` 75–125, `wght` 200–900) para todo, y **Geist
Mono** para rótulos, datos y números de muestra. Ninguna de las dos estaba en
la biblioteca. Revisados €, ñ, tildes y « » en las dos (se ven en «7.900 €»,
«Ourense, desde 2009», «el boletín»).

## Mandos de demostración (no viajan al cliente)

Ocultos salvo con **`?revision`** en la URL; abajo a la izquierda, y se apartan
mientras está el aviso de cookies.

- **Maqueta: «Circuito» / «Sobria».** La sobria deja el circuito solo donde
  significa algo (logo, cortina, portada, la obra y el colector) y quita los
  conductos entre secciones, los lazos de los tres circuitos, los dibujos de
  las fichas, el tubo de la cinta y las ilustraciones del equipo. **Donde había
  dibujo pone el dato** (los días de obra de cada ficha, a 6 rem) y **añade**
  algo que la otra no tiene: los cinco trabajos medidos con la misma vara en
  barras («Días de obra»), leídos de `data-dias` de cada ficha.
- **Paleta: «Ida y retorno» / «Latón» / «Brezo».**

Las dos elecciones se guardan en `localStorage` (`idaeretorno-maqueta`,
`idaeretorno-paleta`) **y solo se leen en modo revisión**: un visitante normal
siempre ve la real. Están declaradas en el aviso legal.

### Borrar los mandos (receta comprobada por script)

`node scripts/comprobar-borrado.js` aplica estos pasos a una copia temporal,
con anclas exactas y negándose a escribir si un archivo pierde más líneas de
las previstas, y comprueba que no queda rastro y que el JS sigue compilando.

1. **`index.html`**: borrar el bloque desde
   `<!-- MANDOS DE DEMOSTRACIÓN — NO VIAJAN` hasta su `</div>` de cierre
   (el que precede a `<div class="cursor"`), y en el script del `<head>` el
   bloque `try { if (/[?&]revision\b/ … } catch (e) {}`.
2. **`css/styles.css`**: borrar las dos líneas `html.pal-laton` /
   `html.pal-brezo` (con su comentario) y el bloque «Mandos de demostración».
   Si el cliente elige la versión sobria, **no** borrar el bloque «Versión
   Sobria»: poner `class="no-js es-sobria"` fijo en el `<html>`.
3. **`js/main.js`**: borrar el bloque `MANDOS DE DEMOSTRACIÓN` entero, y en el
   de cookies la función `mostrarMandos` y sus tres llamadas.
4. **`legal.html`**: borrar el `<li>` de `idaeretorno-maqueta`.

## Reskin para un cliente real (lo más valioso de este repo)

1. **Datos** (`index.html`, `legal.html`, `404.html`, `manifest.json`): nombre,
   dirección, teléfonos (oficina y urgencias), correo, CIF, **número real de
   empresa instaladora** (registro de la Xunta; quitar el borde discontinuo
   `.registro-muestra strong` y la nota «de muestra»), horario de oficina y
   de guardia (también en `js/main.js`, función de estado, que replica las
   franjas: si cambian, cambiar las dos), precios, equipo y opinión real
   **con permiso** o sin opinión. `schema.org`: `HVACBusiness`, sin
   `aggregateRating`. Quitar `noindex`, el sello y el comentario de demo.
2. **Zonas**: cada `<li style="--km:N">` del colector; la escala es 40 km a
   ancho completo (`/ 40` en `.salida` y `.zona-nombre`).
3. **Servicios**: cinco `<li class="pila-item" data-dias="N">`. Se pueden
   quitar o añadir: el alto común, el índice de apilado y el gráfico de la
   sobria se recalculan solos.
4. **Obra**: los seis pasos llevan `data-presion` (bar) para el manómetro; los
   nodos del SVG se pueden mover y el llenado se reajusta solo.
5. **Color**: dos acentos en `:root` (`--quente`, `--fria`) y sus versiones de
   texto sobre yeso (`--quente-t`, `--fria-t`). El shader lee los dos acentos
   del CSS. Pasar `scripts/contraste.js` con los nuevos.
6. **Portada**: el trazado de la espiral está en `generarTrazado()`; para un
   electricista puro, cambiar la espiral por el cableado de un cuadro y subir
   el peso de la capa «B» (calor fijo de cables y empalmes).
7. **Mapa**: la consulta del iframe (`maps?q=…&output=embed`) en `main.js`.
8. **Imágenes**: no hay fotografía; todo es SVG propio. Si el cliente tiene
   fotos de obra, el sitio natural es una galería antes/después en la sección
   07 (con `width`/`height`, `srcset` y `loading="lazy"`).
9. Regenerar `img/og.png` (1200×630) y los iconos.

## Decisiones tomadas

- **Nombre comprobado** por búsqueda web: no hay instaladora «Ida e Retorno»
  ni «Ida y Retorno» en Ourense ni en España (solo resultados técnicos sobre
  ida y retorno de calefacción). Se descartó **Billa** (grifo en gallego) por
  coincidir con una cadena de supermercados conocida. La calle, «Rúa da Billa
  Vella», es inventada.
- **Nada de tiempos de llegada prometidos**: la sección de urgencias dice
  «No prometemos minutos. Prometemos coger el teléfono», y de 23:00 a 8:00 hay
  un servicio de avisos, dicho tal cual.
- **Nº de empresa instaladora** `EI-32-0000-MUESTRA`, con la palabra MUESTRA
  dentro y la nota de dónde va el real: es un registro público y no se
  fabrica uno verosímil.
- **Sin testimonios en serie**: una sola opinión, con nombre de pila y la
  etiqueta «(opinión de muestra)».
- **Mandos solo con `?revision`**, para que el enlace que se manda a un
  prospecto no enseñe herramientas de maqueta.
- jsDelivr estaba **bloqueado por la política de red** del entorno de
  construcción: la página lo pide igual (es lo que manda el pliego) y el arnés
  de verificación sirve los mismos ficheros desde `node_modules` con la misma
  URL.

## Créditos

Sin fotografías ni ilustraciones de terceros: todo el SVG es propio. Fuentes:
Mona Sans y Geist Mono (SIL OFL, Google Fonts). Ver `CREDITOS.md`.
