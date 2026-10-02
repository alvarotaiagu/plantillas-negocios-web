# Informe de la noche — 2026-10-02

> Sitio de demostración. Ida e Retorno es un negocio ficticio.

Agente sin supervisión, de 23:05 a ~01:45 UTC. **Una plantilla**, la de
instaladores, verificada. No hice la segunda (jardinería): ver «Decisiones».

Todo está en la rama **`claude/noche-instalaciones`**, carpeta
`plantilla-instalaciones-web/`, más la ficha `registro/instalaciones.md`.
**No** se creó repositorio, **no** se activó Pages, **no** se tocó `main`,
`REGISTRO.md` ni `SECTORES.md`.

## El negocio

**Ida e Retorno · Instalacións, S.L.** — fontanería, electricidad y
calefacción en Ourense. Rúa da Billa Vella, 9 (calle inventada) · 32005
Ourense · 988 00 00 00 / urgencias 600 00 00 00 · `ola@idaeretorno.example` ·
CIF B00000000 · **empresa instaladora nº `EI-32-0000-MUESTRA`** (lleva la
palabra MUESTRA dentro y una nota de dónde iría el real).

**Por qué no choca con uno real:** búsquedas web de «Ida e Retorno» e «Ida y
Retorno» con instalaciones, fontanería y calefacción en Ourense, Galicia y
España: solo salen preguntas técnicas sobre la ida y el retorno de la
calefacción y empresas brasileñas sin relación. Antes descarté **Billa**
(«grifo» en gallego) por coincidir con una cadena de supermercados conocida.
Equipo con nombres inventados; una sola opinión, con nombre de pila y
«(opinión de muestra)». `schema.org` `HVACBusiness` sin `aggregateRating` ni
`review`. Sello en el pie, en el README y en un comentario HTML arriba;
`noindex, nofollow` en las tres páginas.

## Concepto: «Circuito»

Los tres oficios del encargo son el mismo: **cerrar circuitos** (el agua entra
por la acometida y sale por el desagüe; la luz sale del cuadro y vuelve por el
neutro; la calefacción sale por la ida y vuelve por el retorno), y casi todos
van **por dentro de la pared**. De ahí el nombre, el logo (dos tubos, caliente
y frío, cerrados en una curva), la paleta y cada gesto:

- **Portada: cámara termográfica en WebGL.** La pared está a oscuras; el
  cursor (o el dedo) es la lente y enseña el suelo radiante —una doble espiral
  intercalada, como se instala de verdad— con el agua caliente avanzando desde
  el colector. Una lectura en vivo da la temperatura bajo la lente y qué hay
  («Ida · suelo radiante», «Empalme caliente · revisar»). Al bajar, la ida
  termina de calentarse y la lente se abre hasta ocupar la pared.
- **Cortina: la pared de yeso** cortada por una roza caliente; las dos mitades
  se abren con borde curvo y las letras del titular suben por el hueco.
- **La obra (anclada):** de la llamada al boletín en seis pasos; una tubería se
  llena con scrub válvula a válvula y un manómetro sube a **6 bar** en la
  prueba de estanqueidad y baja a 1,5 de servicio.
- **Zonas:** un colector con doce salidas; el largo de cada una es la
  distancia por carretera.

## Paleta y tipografía

Hierro fundido cálido (`#12100E`, paneles `#1A1714`/`#221E1A`) con **pareja
térmica**: ida `#FF7654` y retorno `#4DB8F0`, y dos secciones claras de **yeso**
(`#E9E2D6`) con tokens de texto propios (`#A22C16`, `#1A5885`). Es distinta de
las nueve oscuras de la biblioteca (todas con un solo acento sobre grafito o
negro azulado) y, por encargo, de mudanzas (negro + amarillo) y fotovoltaica
(grafito + verde). Alternativas del mando derivadas en OKLCH: **Latón** (+32°)
y **Brezo** (−48°). `scripts/contraste.js`: **46 parejas, todas ≥ 4,5:1**, el
botón principal a 7,0:1.

**Mona Sans** variable (`wdth` 75–125 animado: el titular de portada entra de
75 % a 116 % y los de sección se ensanchan con scrub) + **Geist Mono**. Ninguna
de las dos estaba en la biblioteca.

## Movimiento protagonista

La **obra anclada con scrub** (tubería + manómetro). Con la portada WebGL como
segundo gran recurso. En total nueve del §2: Lenis, char-reveal (letras y
palabras con máscara), pila sticky, marquee ligado al scroll, botones
magnéticos, hero WebGL interactivo, cursor contextual, escena anclada, máscaras
(roza, colector, conductos).

## Verificación (Playwright + Chromium, `scripts/verificar.js`)

Pasada final completa: **70 de 70 comprobaciones en verde**. Durante la
pasada, el proxy del entorno volvió a fallar dos veces contra Google Fonts
(`ERR_TOO_MANY_RETRIES`); el arnés separa esos fallos de red de los de la
página y los anota en `screenshots/verificacion.json`
(`fallosDeRedDelEntorno`). En la pasada anterior, antes de separarlos, eran
las únicas 3 rojas de 70. Los números:

- **Cortina**: fotografiada **a mitad de camino** en las dos fases (la roza
  cortando y la pared abriéndose con el titular subiendo:
  `cortina-1-roza.png`, `cortina-2-abriendo.png`); color distinto del fondo;
  acaba en `display:none` en normal, **sin GSAP**, con **movimiento reducido**
  y con las dos cosas a la vez.
- **Tareas largas** (`PerformanceObserver`, carga **en frío** con la caché
  desactivada por CDP, control positivo de 120 ms lanzado con `setTimeout`
  que sí se registra): **5 en los primeros segundos, de 58 a 114 ms** (ninguna pasa de 120 ms; en la pasada previa, 3 de 86–119 ms); **0 recorriendo la
  página entera** con la rueda.
- **Shader**: 10–11 fotogramas/s **con WebGL por software** (SwiftShader: el
  entorno no tiene GPU). No es representativo de un equipo real y lo marco
  como informativo; no he podido medirlo en GPU.
- **Pila sticky**: los cinco `<li>` sticky con **el mismo alto** (506 px en
  escritorio, 665 en móvil; medido por JS, no 100vh) y **el mismo
  margin-bottom** (88 / 56 px) incluido el último; reposo con `::after`;
  recorrida en **pasos de 90 px** (70 pasos) sin una sola inversión de orden ni
  ficha más alta que su `<li>`.
- **Portada 360×640 y 375×667**: sin solapes (lectura, cabecera, titular,
  botones dentro) y sin desbordamiento.
- **Móvil**: cookies cierran de verdad (`:not([hidden])`), menú a pantalla
  completa (alto = `innerHeight`, `top` 0, con `100dvh` bajo la cabecera con
  `backdrop-filter`), **cierra con el mismo botón**, un enlace lo cierra y
  navega; mapa **0 iframes antes, 1 después**; formulario avisa de lo que falta.
- **Sin cursor propio en táctil**; con ratón, `cursor:none` desde el primer
  `pointermove`.
- **Sin GSAP**: cortina fuera, sin `has-motion`, **0 textos ocultos**.
- **Reducido**: la lectura térmica sigue cambiando con el puntero (62,7 →
  27,4 °C), el paso de la obra y el manómetro cambian (Paso 5 → 6,0 bar), el
  estado del horario se escribe y la fila `es-hoy` se marca.
- **Mandos** (`?revision`): ocultos con el aviso de cookies y visibles al
  cerrarlo; la sobria retira dibujos, pone el dato a 100 px y añade la
  comparación de 5 barras sin desbordar; se puede volver; las tres paletas
  cambian el color computado del botón (`rgb(255,118,86)` / `rgb(230,142,5)` /
  `rgb(240,116,173)`), `aria-pressed` y `localStorage`; al recargar la clase
  ya está en `domcontentloaded`; sin `?revision` no hay mandos ni paleta
  alternativa.
- **axe-core 4.10**: **0 violaciones** en portada (escritorio y móvil, tras
  recorrerla), aviso legal y 404.
- Sin `[PENDIENTE]`, `TODO` ni lorem; 0 `<img>` rotas (no hay fotos);
  `scrollWidth == innerWidth` en todos los tamaños; logo visible a 1200 px.
- **Receta de borrado de los mandos**: `scripts/comprobar-borrado.js` la aplica
  a una copia y comprueba que no queda rastro y que todo el JS compila: verde.

Capturas de cada sección en escritorio y móvil, pila, cortina, mandos, paletas,
sin GSAP, reducido, 404 y legal en `screenshots/`. Las miré todas; lo que
cazaron está en «Fallos cazados».

## Fallos cazados mirando, no leyendo

1. **El logo de la cabecera medía 0 px** de ancho a 1200 px: el nombre en
   `nowrap` lo aplastaba en el flex. Salió en el `og.png`. `flex: none` y una
   comprobación nueva en el arnés.
2. **La alimentación de la espiral cruzaba el suelo radiante** y pintaba una
   banda fría en diagonal: los extremos de ida y retorno quedaban en lados
   opuestos. Rehecha la espiral como `r = kθ` (ida) y `r = k(θ−π)` (retorno),
   con los dos extremos juntos abajo.
3. **Rendijas en la textura** del parámetro de recorrido (tapa `butt` con
   antialias) daban rayas calientes; tapa redonda y dos pasadas.
4. **670 ms de tarea larga** al arrancar por 3.600 llamadas a
   `getPointAtLength` para situar las válvulas de la obra: una sola pasada de
   160 muestras.
5. **El icono de cerrar del menú no giraba**: `:first-of-type` caía en el texto
   oculto del botón.
6. **El arnés se colgaba** al devolver desde `evaluate` la línea de tiempo de
   GSAP (Playwright intentaba serializarla). Apuntado para la próxima.

## Decisiones tomadas solo

- **jsDelivr está bloqueado** por la política de red del entorno (403 del
  proxy). La página lo pide igualmente, como manda el pliego; el arnés sirve
  GSAP 3.12.5, ScrollTrigger y Lenis 1.1.13 desde `node_modules` (npm sí
  estaba permitido) **con la misma URL**. Google Fonts sí carga, con reintentos.
- **Los mandos solo aparecen con `?revision`** y la elección guardada solo se
  lee en ese modo, para que el enlace que se manda a un prospecto no enseñe
  herramientas ni una paleta probada por otro.
- **Retirada de seguridad de la cortina en dos tiempos**: a los 3,2 s si
  `main.js` no ha tomado el mando (CDN caído) y a los 8 s en cualquier caso.
  En la pasada que fotografía la cortina ralentizada, el arnés aplaza esos dos
  temporizadores (solo allí, y está comentado).
- **El búfer del shader va a 0,75 px por px CSS**: la imagen térmica es blanda
  por naturaleza y así se gana mucho en móvil; la compilación del shader va en
  su propia tarea para no sumarse al arranque.
- **La obra va antes que los servicios**: primero cómo se trabaja, luego qué se
  vende. Es la diferencia de estructura más fuerte con las anteriores.
- **Urgencias honestas**: «No prometemos minutos. Prometemos coger el
  teléfono»; precio de desplazamiento y hora de muestra; servicio de avisos de
  23:00 a 8:00 dicho tal cual; «mientras llegamos» con cuatro pasos útiles.
- **No hice la segunda plantilla (jardinería).** Al cerrar esta quedaba menos de
  una hora y la verificación completa tarda ~20 min por pasada con WebGL por
  software. El encargo prefería una excelente a dos a medias.

## Lo flojo (sincero)

- **Rendimiento del shader en GPU real sin medir.** Solo tengo SwiftShader.
  Conviene abrirlo en un móvil de gama media antes de publicar.
- **Solo Chromium**, sin Safari ni Firefox (`backdrop-filter`, `font-stretch`
  animado, `clip-path` con `round`). Sin lector de pantalla real.
- La **imagen térmica a 0,75** se ve algo blanda en pantallas retina; si en GPU
  real va sobrado, subir a 1.
- El **horario de guardia está duplicado** en el HTML y en la función de estado
  de `main.js` (dicho en el README); lo ideal sería leerlo de `data-` en la
  tabla.
- En móvil, en la escena anclada, el manómetro se monta sobre el último tramo
  de tubería; se lee bien pero no es elegante.
- `og.png` es una captura de la portada, no una composición propia.

## Para publicar (cuando lo apruebes)

1. Crear `alvarotaiagu/plantilla-instalaciones-web` con el contenido de la
   carpeta (las rutas del 404 ya van con `/plantilla-instalaciones-web/`).
2. Activar Pages y comprobar la demo.
3. Cambiar en `registro/instalaciones.md` repo y demo, y consolidar en
   `REGISTRO.md`.
