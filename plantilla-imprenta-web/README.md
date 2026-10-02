# Tres Milímetros · imprenta y copistería en Pontevedra

> **Sitio de demostración. Tres Milímetros es un negocio ficticio; los datos,
> fotografías y opiniones son de muestra.** Nombre, dirección (Rúa do Prelo,
> 14 · 36001 Pontevedra), teléfono (986 00 00 00), correo
> (`ola@tresmilimetros.example`), personas, precios y opiniones son inventados.
> Todas las páginas llevan `noindex, nofollow`.

Plantilla de la biblioteca de webs de negocio ficticio, sector **imprenta y
copistería**. Web estática: `index.html` + `css/styles.css` + `js/main.js`,
sin build. GSAP, ScrollTrigger y Lenis por jsDelivr.

**Modo revisión:** añade `?revision` a la dirección para ver el mando de
demostración: densidad **Registro / Sobria** y color **Magenta / Cian /
Bermellón**.

---

## Qué hace esta mejor que las anteriores

Revisadas antes de diseñar las fichas de **Chinagraph** (fotografía, hoja de
contactos), **Papel Vegetal** (tatuajes, calco), **Sellos** (viajes) y
**Paso Fino** (ferretería, hecha esta misma noche). Lo que esta añade:

1. **El hero es una cuatricromía de verdad, no una ilustración de una.** Un
   shader convierte un cartel en CMYK y lo pinta con **cuatro tramas de
   puntos a 15°, 75°, 0° y 45°**, que es exactamente lo que forma la roseta
   de una imprenta offset. El cursor es un **cuentahílos ×3** (la lupa con la
   que el impresor mira la trama) y el scroll **acerca la trama**: la
   lineatura baja en vivo de 150 lpi hacia 51. Ninguna plantilla anterior
   enseñaba el material del oficio a la escala del oficio.
2. **El concepto actúa sobre la tipografía.** Los titulares llegan
   **desregistrados** —las tres tintas desplazadas en `text-shadow`— y casan
   al entrar; si haces scroll rápido, la máquina «se mueve» y se desregistran
   un pelo. Es barato (solo pintura, sin reflujo) y se apaga en la versión
   sobria y con movimiento reducido.
3. **Rendimiento medido, no supuesto:** con la GPU por software del
   contenedor, el recorrido entero de la página da **cero tareas largas** en
   escritorio y en móvil (`scripts/longtask.js`). El shader se pinta solo
   cuando algo cambia y se compila sin bloquear.
4. **Una herramienta de verdad arriba del todo**: el presupuestador da
   precio total, por unidad y plazo, dibuja los formatos **a la misma
   escala** y, en la versión sobria, la **curva de precio por cantidad** con
   tu pedido marcado.
5. **Auditoría con axe en el repo** (0 violaciones en escritorio y móvil) y
   55 comprobaciones por código.

## El concepto: «Registro»

En una imprenta, **estar en registro** es que las cuatro planchas —cian,
magenta, amarillo y negro— caigan en el mismo sitio, con una décima de
milímetro de margen. Fuera de registro, todo sale con fantasmas de color. Es
la promesa de la casa (todo cuadra antes de imprimir) y el sistema gráfico:

- **Cortina**: tres «3» de cian, magenta y amarillo llegan desplazados,
  casan, entra el negro («en registro») y el pliego sale hacia arriba con el
  canto curvo, como sale de la máquina.
- **Titulares** desregistrados que casan al entrar.
- **Cursor** = marca de registro (círculo con cruz).
- **Marcas de corte** en las esquinas de cada sección y del cartel, con su
  **tira de control** de color.
- **Folios** con diana de registro.
- El nombre: **los tres milímetros de sangrado** que pide toda imprenta.

Comprobado contra `REGISTRO.md` y las fichas de `registro/`: «Registro» no
está usado. Vecinos vigilados: «Hoja de contactos» (Chinagraph, rojo de
lápiz graso sobre cuarto oscuro) y «Calco» (Papel Vegetal). Aquí es papel
claro y tintas de proceso.

## Mapa de secciones

| # | Sección | Forma |
|---|---|---|
| — | Cortina | planchas que casan + pliego que sale con canto curvo |
| — | Portada | titular a la izquierda; a la derecha el cartel en trama CMYK, girado 2,2°, con marcas de corte, tira de control y lectura de lineatura |
| 01 | Presupuesto | presupuestador: producto, cantidad y papel → total, por unidad, plazo; formatos a escala; (sobria) curva de precio |
| 02 | Cómo trabajamos | **anclada con scrub horizontal**: seis pasadas (revisión, imposición, color, guillotina, encuadernado, entrega); las cuatro tintas se superponen y la cuchilla cae con el scroll |
| — | En máquina hoy | marquesina sobre el color de marca, velocidad ligada al scroll |
| 03 | Papeles | abanico de siete papeles que se abre al llegar; la hoja elegida sube y rellena la ficha |
| 04 | Copistería | dos cifras grandes + tabla de tarifa con dos tramos |
| 05 | Dónde | formulario «mándanos el archivo» (avisa del sangrado), horario con «hoy», mapa bajo clic, opiniones, equipo |

Distinta de Paso Fino (la otra de esta noche): claro frente a oscuro, pin
horizontal frente a vertical, herramienta arriba frente a manifiesto arriba,
abanico en vez de pila sticky.

## Paleta

| Token | Valor | Uso |
|---|---|---|
| `--papel` / `--panel` / `--crema` | `#F4F1EA` / `#E9E4D8` / `#FBFAF6` | papel estucado |
| `--tinta` | `#16161A` | texto, 16,00:1 sobre papel |
| `--gris` | `#55545C` | secundario, 5,89:1 en el peor fondo |
| `--linea` | `#D3CCBC` | filetes (nunca texto) |
| `--cian` / `--magenta` / `--amarillo` | `#00A0E3` / `#E6007E` / `#FFE500` | tintas de proceso: **fijas**, son el oficio |
| `--marca` | `#E6007E` | superficies de marca (cinta) |
| `--marca-texto` | `#A8005C` | texto y botones: 5,87:1 en el peor fondo, blanco encima 7,45:1 |

**Paletas del mando** (rotación de matiz en OKLCH, misma L): Cian
`#018FAC`/`#00677C` (blanco encima 6,50:1) y Bermellón `#EC1C01`/`#AF0400`
(7,39:1). Las tintas de proceso del cartel y del logo **no cambian**: son el
oficio, no la marca. `node scripts/contraste.js`.

## Tipografía

- **Funnel Display** (variable 300–800): titulares a 780, interletra −0,035 em.
- **Funnel Sans**: texto.
- **Instrument Serif** cursiva: los acentos («*sangrado*», los nombres de
  papel, las opiniones).
- **Red Hat Mono**: folios, precios, especificaciones.

Ninguna está en el registro. Glifos revisados: €, ñ, tildes, ¿?, « », ×, ⊕.

## Movimiento (§2: 9 recursos)

Lenis (`lerp` 0,16 por el scrub horizontal) · char-reveal en desregistro ·
galería anclada con scrub horizontal · marquesina ligada al scroll · botones
magnéticos · cursor marca de registro (se aparta y deja la lupa sobre el
cartel) · hero WebGL interactivo (cuentahílos y lineatura) · contadores ·
entrada de bloques «impresa» de arriba abajo (`clip-path`, como el pliego
pasando por el cilindro). **Protagonista:** la trama CMYK con el cuentahílos.

## Las dos densidades (mando «Registro» / «Sobria»)

- **Registro**: desregistro en los titulares, marcas de corte en todas las
  secciones, dianas en los folios, ⊕ en la marquesina, cruz en el cursor.
- **Sobria**: el registro solo donde significa algo (logo, cortina, cartel y
  las cuatro pasadas del proceso). El folio pasa a cifra grande y **añade la
  curva de precio por unidad según cantidad**, que la otra no enseña.

## Para reskinear a un cliente real

1. **Datos** en `index.html` (nombre, dirección, teléfono, correo, horario —
   tabla y constante `TRAMOS` de `js/main.js`—, JSON-LD sin
   `aggregateRating`, equipo, opiniones).
2. **Presupuestador**: el array `PRODUCTOS` de `js/main.js` (nombre,
   formato y medidas en mm, cantidades, **totales** por tramo, papeles con su
   factor, plazo). Con precios reales o se quita la sección.
3. **Papeles**: el array `PAPELES` (gramaje, nombre, uso, grosor, fondo CSS).
4. **Tarifa de copistería**: la tabla de `#copias`.
5. **Cartel del hero**: la función `fuente()` del shader dibuja el cartel en
   coordenadas 0–1; cambiar formas y colores ahí. El respaldo sin WebGL es
   `img/cartel.svg`.
6. **Color**: `--marca` y `--marca-texto`; recalcular con
   `scripts/contraste.js`. El logo (tres «3» de proceso) no cambia.
7. **Mapa**: `q=` del iframe en `js/main.js`.
8. **Quitar el mando** (abajo), el sello de demo, `noindex` y «de muestra».

## Quitar el mando de demostración

Comprobado por script (`node scripts/receta-mando.js`: aplica los pasos a una
copia con anclas exactas, la abre en Chromium y comprueba que carga limpia):

1. **`index.html`**: en el script del `<head>`, borrar el bloque
   `try { if (/[?&]revision\b/ … } catch (e) {}` (9 líneas) y el
   `<div class="mando">` con su comentario (16 líneas, hasta antes de
   `<div class="cursor">`). Para quedarse con la sobria, cambiar `d-registro`
   por `d-sobria` en ese script.
2. **`css/styles.css`**: de `/* MANDO DE DEMOSTRACIÓN · paletas derivadas` a
   `/* FIN paletas del mando */` (4 líneas) y de
   `/* ---------- MANDO DE DEMOSTRACIÓN (no viaja al cliente)` a
   `/* FIN mando */` (9 líneas).
3. **`js/main.js`**: de `/* MANDO DE DEMOSTRACIÓN — no viaja` a
   `/* FIN mando */` (23 líneas).
4. **Textos**: en el aviso de cookies, «(y, en modo revisión, la versión
   elegida en el mando)»; en `legal.html`, la línea de `tresmm-maqueta`.

## Decisiones tomadas

- **Pontevedra** porque no la usaba ninguna plantilla como ciudad.
- **El cartel es abstracto** (sol, mar y titulares en barra): un cartel con
  texto real del negocio competiría con el titular de la página.
- **El cuentahílos en táctil** cruza el cartel solo al hacer scroll en la
  portada: sin ratón no hay cursor que lo lleve.
- **Sin pila sticky**: la ferretería de esta noche ya la usa; aquí el
  recorrido largo es horizontal.
- **El formulario no sube archivos**: es una demo y no hay servidor.

Créditos en [`CREDITOS.md`](CREDITOS.md): sin fotografía.
