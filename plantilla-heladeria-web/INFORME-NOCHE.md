# Informe de la noche — Salseiro (heladería), 2026-10-02

Agente en la nube, sin supervisión. Rama `claude/noche-heladeria`, carpeta
`plantilla-heladeria-web/`. **No se ha creado repo, ni activado Pages, ni
tocado `main`, `REGISTRO.md` o `SECTORES.md`.** Ficha nueva en
`registro/heladeria.md` (en esta rama), con la demo «pendiente de publicar».

## El negocio, y por qué no choca con uno real

**Salseiro · Xeadaría de obrador**, Rúa do Pairo, 9 · 36300 Baiona
(Pontevedra) · 986 00 00 00 · ola@salseiro.example.

*Salseiro* es la palabra gallega para la rociada fina que levanta el mar al
romper contra las rocas: Baiona es puerto, y el sabor de la casa es caramelo
con sal de la ría. Búsquedas hechas antes de fijarlo:

- «Salseiro» + heladería / helados / gelato: **ningún negocio**. Lo único con
  ese nombre en Baiona es *Salseiro C*, un velero de regatas del RCN Coruña
  (otro sector, no es un negocio).
- Descartado **Lambón**: existe una heladería *Lambón* en Bertamiráns (A Coruña).
- Descartada la calle **Rúa do Abeiro**: hay un restaurante *Abeiro* en Baiona.
  «Rúa do Pairo» es inventada.

Sin `aggregateRating` ni `review` en `schema.org` (`IceCreamShop` a secas),
opiniones marcadas como «opinión de muestra», sin registro sanitario ni
premios inventados (el aviso legal dice dónde irían), `noindex, nofollow` y
sello de demo en las tres páginas, en el README y en un comentario HTML.

## Concepto: «Mantecar»

El verbo del oficio: batir mientras se congela para que entre aire y salga
crema y no hielo. Es lo que una heladería de obrador hace y una de cubo no.
De él salen la bola que se remueve (hero), el día de obrador con sus cifras
(anclada), los bordes de sección que llegan ondulados como nata y se alisan,
el cursor que se vuelve espátula sobre la bola y la cortina «Boleado».
Libre en el registro (los conceptos de comida son «La miga», «Corteza»,
«Trasfega», «Cata a ciegas»).

## Paleta y tipografía

- **Paleta**: leite `#FBF5EE`, nata `#F3E9DC`, barquillo `#E9D3B4`, tinta
  amora negra `#2A1520` y **framboesa** en tres tokens (superficie `#D63368`,
  texto `#A2174A` a 7,03:1, sobre tinta `#F589A1` a 7,32:1). Ninguna plantilla
  usa un rosa-frambuesa de marca ni una tinta ciruela-negra; la floristería
  tiene ciruela `#3B2434` pero como color de texto sobre hueso y con azafrán.
  Alternativas del mando: **pistacho** (`#598000`/`#3F5C00`/`#8FB657`) y
  **arándano** (`#735FEA`/`#5440B3`/`#A4A0FC`), rotando el matiz en OKLCH y
  reajustando la luminosidad hasta el mismo contraste (script, no a ojo).
- **Tipografía**: **Bodoni Moda** variable (`wght` 400–900 + `opsz`) para
  titulares, **Albert Sans** para texto, **Spline Sans Mono** para cifras.
  Ninguna en el registro. Glifos comprobados por medición (ancho propio vs.
  fuente de reserva) en redonda y cursiva: €, ñ, á, í, « », º, −, °, ½, todos
  propios.

## Movimiento protagonista

1. **Hero WebGL**: una bola de helado vista desde arriba. Campo de alturas
   con ruido fractal y deformación de dominio, peinado de espátula, veteado
   del sabor de temporada, normales por derivadas de pantalla y brillo
   especular. El cursor remueve (remolino local) y deja surcos con reborde
   que se cierran en ~4 s; un clic (o el botón «En la pala», para teclado)
   cambia entre seis sabores con transición de color; el scroll hace fluir
   la crema; si nadie la toca, una espátula fantasma la remueve sola.
2. **Día de obrador anclado (pin + scrub)**: seis pasos de 07:30 a 09:40; la
   temperatura (4 → 85 → 4 → −8 → −35 → −12 °C), el aire (0 → 32 %) y las
   horas se interpolan con el scroll, y la cuba dibujada obedece a las
   mismas cifras: nivel, color de la mezcla, burbujas, escarcha, vapor,
   termómetro y la pala que gira solo al mantecar. Los pasos se relevan con
   una barrida (entran por abajo, salen por arriba), no con fundido.

Más (PLIEGO §2, aquí 10): Lenis, char-reveal palabra a palabra, pila sticky
de tartas, cinta con velocidad ligada al scroll, botones magnéticos, cursor
propio, contadores, bordes de nata scrubbeados y peso variable de la letra
ligado al cursor (y a una ola de scroll en táctil).

## Qué hace esta mejor que las anteriores

Está en el README con detalle; en corto: hero que se toca (no que se mira) y
que mide su propio coste, secuencia anclada con tres magnitudes reales,
carta con filtro de alérgenos (ninguna plantilla de comida lo tenía),
tipografía variable que reacciona, transiciones de sección propias del
concepto, y una versión sobria que **añade** un dato (precio por litro).

## Verificación (con números)

Playwright 1.56 + Chromium, `scripts/verify.js`. **88/88 comprobaciones en
verde** (tres pasadas completas durante la noche, la última tras los
últimos cambios). Incluye:

- Recorrido con `mouse.wheel` en 1440×900 y 390×844: consola y red limpias,
  `scrollWidth == innerWidth`, cero `TODO`/`PENDIENTE`/lorem.
- Cortina: fotogramas intermedios guardados (`screenshots/cortina-1…5`,
  capturados a 0,5× de velocidad porque una captura en este entorno tarda
  más que el gesto) — marca, rizo, golpe de boleadora, **vaciado a medias**
  y entrega. Color framboesa sobre fondo leite (distinto). `display:none`
  comprobado en los tres casos: normal, sin GSAP y con movimiento reducido.
- Sin GSAP (`route.abort`): sin `has-motion`, titulares a la vista, obrador
  sin anclar con los seis pasos legibles.
- Movimiento reducido: sin Lenis ni anclaje, pero las cifras del obrador
  cambian al pasar por cada paso (4, 85, −8, −35), el sabor cambia,
  contadores en su valor final y horario calculado.
- Cursor: nativo oculto (`cursor:none`) solo tras el primer `pointermove`
  de ratón, espátula sobre la bola, nada en táctil.
- Pila sticky: los cuatro `<li>` con el mismo alto medido por JS (473 px en
  escritorio, 476 en móvil, nunca 100vh), mismo `margin-bottom` (48 px)
  también en el último, `::after` con alto, y **cero tarjetas fantasma** en
  26 y 29 pasos de 90 px.
- Menú móvil: 390×844 exactos (100dvh × 100vw pese al `backdrop-filter` de
  la cabecera), abre, cierra con el mismo botón y un enlace cierra y navega.
- Cookies (`.cookies:not([hidden]){display:flex}`), mapa (cero iframes antes
  del clic), filtro (sin leche ni cáscara → 4 de 14), formulario.
- Mando: se aparta con las cookies, aparece al cerrarlas; sobria retira
  cubetas y tallas y pone % de fruta y €/litro, sin desbordamiento, y se
  puede volver. Tres paletas: cambia el color computado, `aria-pressed` y
  `localStorage` correctos, contraste medido (7,03 / 7,07 / 7,02 botón sobre
  leite; 7,32 / 7,33 / 7,35 acento claro sobre tinta) y la paleta guardada
  ya está en la clase de `<html>` en `DOMContentLoaded` (sin parpadeo).
- Portada a 360×640 y 375×667: cero solapes (incluida la intersección con
  el círculo de la bola, no con su caja).
- axe-core: **cero violaciones** en seis estados (`AUDITORIA.md`); cuatro
  hallazgos de la primera pasada corregidos.
- `longtask` en frío (caché deshabilitada por CDP), observador verificado
  con un control de 120 ms lanzado con `setTimeout`. Ver «Lo flojo».

## Decisiones tomadas solo

1. **Sin fotografía.** Pexels y Unsplash devolvían 403 desde la red del
   entorno; además, la foto de archivo de helado es lo más genérico del
   sector. Todo es shader y SVG propio.
2. **jsDelivr bloqueado en el entorno.** La web enlaza GSAP 3.12.5,
   ScrollTrigger y Lenis 1.1.20 en jsDelivr (como pide el encargo); para
   verificar, el arnés sirve esas **mismas versiones** instaladas desde npm
   interceptando las URL. Google Fonts se sirvió igual (con `curl`), porque
   Chromium tropezaba con el proxy.
3. **Mandos ocultos salvo `?revision`**, y la elección guardada solo se
   aplica en ese modo: la demo por defecto siempre se enseña limpia.
4. **Calidad adaptativa del shader** y repintado a demanda como último
   escalón: la medición de `longtask` lo pidió.
5. **Cortina**: radio final del hueco 74 (no 140) y 1,4 s; con 140 el
   `expo.inOut` dejaba todo el vaciado en ~0,2 s y el gesto no se veía. El
   logo va sobre un plato de leche porque su bola es del color de la cortina.
6. Las bandas raras que salían en las primeras capturas eran un artefacto de
   los *flags* de SwiftShader que puse al arnés, no de la web: con Chromium
   por defecto desaparecieron (comprobado ocultando elementos uno a uno).

## Lo flojo (honesto)

- **Rendimiento del shader medido en software.** El entorno no tiene GPU:
  Chromium pinta WebGL con SwiftShader en CPU. Ahí cada fotograma de la bola
  es una tarea larga (~90 ms de mediana); la calidad adaptativa baja la
  resolución (cada 16 fotogramas) y en escritorio las tareas largas paran a los **3 s** (28 en total, la última a 3 002 ms). En móvil
  con CPU ×4 siguen apareciendo cuando se toca o se hace scroll (modo a
  demanda; 42 en 10,7 s de prueba con ratón y rueda, mediana 88 ms). **Sin WebGL, la página entera deja solo 4 tareas largas, todas en
  los primeros 400 ms** (GSAP + fuentes), y ninguna al hacer scroll. En un móvil real con GPU no está
  medido: es lo primero que hay que probar por la mañana.
- Solo Chromium; sin lector de pantalla real; táctil emulado.
- El veteado de la bola se ve pixelado en las capturas tras la bajada de
  calidad: es el modo de emergencia del entorno sin GPU, no el normal.
- `screenshots/` pesa ~5,7 MB (JPEG 72, más de cien capturas).
- Los textos están revisados, pero no por un hablante de gallego: «Xeadaría»,
  «Leite de Valmiñor», «Figo e mel», «Marmelo e requeixo» conviene que los
  mire alguien antes de enseñarlos.
