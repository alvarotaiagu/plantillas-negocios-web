# Pliego de construcción — plantillas de negocio ficticio

Este documento manda sobre cualquier costumbre general. Se lee entero antes de
empezar CADA plantilla, no solo la primera.

---

## 0. Qué se está construyendo y para qué

Webs completas de negocios **inventados**. No son encargos: son piezas de
muestra que luego se reskinean para clientes reales de un sector parecido.

De ahí dos consecuencias que lo cambian todo respecto a un encargo normal:

1. **Los datos se inventan a propósito.** Nombre, dirección, horario, carta,
   precios, reseñas, equipo: todo ficticio y todo *completo*. Aquí NO se usan
   marcadores `[PENDIENTE]`. Una plantilla con huecos no se puede enseñar.
2. **A cambio, no puede parecerse a un negocio real.** Ver §1.

El entregable es una web estática que se abre con doble clic y funciona:
HTML + CSS + un `main.js`. Sin framework, sin build, sin backend, sin npm.
GSAP/ScrollTrigger/Lenis por CDN. Se publica tal cual en GitHub Pages.

---

## 1. Línea roja: ficticio de verdad

El negocio tiene que ser **inequívocamente inventado**. Antes de fijar el
nombre, buscarlo en la web. Si existe un negocio real con ese nombre en ese
sector, se cambia.

- Nada de nombres, logos, rótulos, marcas ni eslóganes de negocios reales.
- Direcciones: calle inventada o genérica en una ciudad real está bien
  (`Rúa do Areal, 12 · Carballo`). Nunca la dirección exacta de un local real.
- Teléfonos: prefijo real + número claramente de muestra (`981 00 00 00`).
  Nunca un número que pueda sonar en casa de alguien.
- Emails y dominios: `@ejemplo.com` o el propio nombre ficticio.
- **Reseñas, valoraciones y premios: inventados sí, pero nunca atribuidos a una
  plataforma real como si fueran verificables.** Nada de «4,9 ★ en Google con
  637 reseñas» ni sellos de TripAdvisor/Michelin. Se escriben como testimonios
  con nombre de pila ficticio, y se marcan (ver abajo).
- `schema.org`: se puede usar `LocalBusiness` etc., pero **sin `aggregateRating`
  ni `review`**. No se siembran datos estructurados falsos en el índice.

Y el sello, obligatorio en las tres partes:

- En el `<footer>`, visible, con el resto de avisos legales:
  «Sitio de demostración. [Nombre] es un negocio ficticio; los datos,
  fotografías y opiniones son de muestra.»
- En el `README.md` del repo, en la primera pantalla.
- En un comentario HTML arriba del todo en `index.html`.

Y en el `<head>`: `<meta name="robots" content="noindex, nofollow">`.
Una demo no compite en Google con los clientes reales.

---

## 2. Qué significa «súper inmersiva y moderna» aquí

El listón NO es el kit ligero de fades con GSAP. Es densidad de movimiento tipo
motionsites.ai. Una plantilla que no lleve **al menos cinco** de estos recursos,
bien integrados (no pegados encima), está por debajo del listón:

- **Lenis** (smooth scroll) como único motor de scroll de la página.
- **Char-reveal**: titulares que entran letra a letra o palabra a palabra.
- **Sticky-stack**: tarjetas que se apilan y se relevan al hacer scroll.
- **Marquee** infinito, idealmente con la velocidad ligada al scroll.
- **Botones/elementos magnéticos** que persiguen el cursor.
- **Galería anclada (pin) con desplazamiento horizontal** scrubbeado.
- **Cursor personalizado** contextual (cambia sobre enlaces, fotos, mapa).
- **Hero con canvas o WebGL** propio del concepto (partículas, shader, líneas,
  trama, humo, agua, brasas…).
- **Contadores y máscaras** de imagen que se abren con el scroll.

La **cortina de entrada** no cuenta para ese mínimo porque no es opcional: ver §5.

Regla de oro: **el movimiento sale del concepto, no de una lista.** Si la
plantilla es de panadería, la masa sube, la harina cae y el horno da calor; no
se mueve «porque toca». Un movimiento que no signifique nada, fuera.

---

## 3. Cada plantilla distinta de las demás

El valor de la biblioteca es que **no son la misma web reskineada**. Se reutiliza
el *utillaje* (funciones, patrones, trucos de rendimiento); **no se reutiliza el
esqueleto**.

Antes de escribir una línea, se decide y se escribe en el README:

- **El concepto**, en una o dos palabras, con su porqué. Es la idea visual de la
  que cuelga todo. Conceptos ya usados en la biblioteca, NO repetibles:
  «Escaparate», «Recortables», «Plomada», «Balance», «Cuenta atrás»,
  «Titulares», «Escritura», «Cláusula», «Territorio», «Ceibo en flor»,
  «Pluma», «Capa fina», «Traza», «Cartucho», «Piezas», «Burbullas»,
  «Trazo en movimiento», «Sintoniza», «Día y noche».
- **La estructura de secciones**, que debe diferir de las anteriores en orden,
  número y forma. Si la última fue hero → servicios → equipo → horario →
  contacto, esta no puede serlo.
- **La paleta**, distinta de las últimas tres plantillas.
- **La tipografía**, distinta de las últimas tres. Google Fonts.
- **El recurso de movimiento protagonista**, distinto del de la plantilla
  anterior.

Una plantilla que sea la anterior con otros colores se descarta y se rehace.

---

## 4. Imágenes e iconos: lo que hay y lo que no

**No hay generador de imágenes.** Nunca se referencia un archivo que no se haya
creado o descargado de verdad. Un `<img>` roto es un fallo de entrega.

Por orden de preferencia:

1. **SVG dibujado a mano en el propio repo.** Es la mejor opción y la que da
   personalidad: ilustraciones planas, tramas, siluetas, logotipos, iconos.
   Todas las plantillas deben tener obra gráfica propia en SVG.
2. **Foto de archivo de Pexels/Unsplash**, si el sector la exige (comida,
   interiores, textiles). Se descarga al repo, nunca hotlink. Se guarda la
   procedencia en `CREDITOS.md`: URL, autor y licencia.
3. Si no se consigue foto decente, se resuelve en SVG. Antes ilustración que
   foto mala o `<img>` roto.

Notas de sourcing: la búsqueda de Unsplash bloquea en headless, pero la descarga
por ID sigue funcionando. Pexels necesita navegador nuevo por consulta, UA
realista y ~9 s de espera.

**Logotipo**: se diseña uno en SVG para el negocio ficticio. Es una ventaja de
inventar el negocio; aprovéchala y hazlo bueno.

**Personas**: nada de menores, ni siquiera de archivo. Si hace falta gente, va
en ilustración plana propia.

Toda imagen: `width`/`height` en el atributo + `height:auto` en CSS,
`loading="lazy"` salvo el hero, y versiones a dos anchos con `srcset`.

---

## 5. Obligatorio en todas, sin preguntar

- **Cortina de entrada.** Obligatoria en todas, sin preguntar, y con acabado
  premium: encadenado, `expo.inOut`, borde curvo, entrega limpia al hero y
  **retirada garantizada** — se quita siempre, también sin GSAP y con movimiento
  reducido, o la página queda tapada. El gesto tiene que ser **distinto en cada
  sitio** y salir del concepto, no ser la misma cortina repintada.
- **Control de maqueta: dos densidades visuales, siempre.** Cada plantilla se
  entrega con un mando de demostración (abajo a la izquierda) que cambia en
  vivo entre dos versiones: la **cargada**, con el recurso protagonista en
  todas partes, y la **sobria**, el mismo sitio con ese recurso solo donde
  significa algo. Es una clase en el `<html>` y un bloque de reglas CSS, no
  dos webs. El botón de la cargada **se llama como el concepto de esa
  plantilla** («Mecanismo», «Ramo», «Calco»…), no «Normal»: así el mando
  también explica de qué va el sitio. El otro, «Sobria», en todas.
  - **Por qué.** El cliente no sabe cuánto adorno quiere hasta que ve las dos,
    y un «modo sobrio» escrito solo en el README no se puede enseñar en una
    reunión. Además obliga a separar lo que el recurso *significa* de lo que
    es el mismo dibujo repetido: si un motivo sale en diez sitios, nueve son
    decoración.
  - **La sobria no es la pobre.** No quita secciones ni datos: **intercambia
    dibujo por dato** (donde había un icono, el número en grande). Y conviene
    que *añada* algo que la densa no tenga —un gráfico, una comparación—, o no
    hay elección de verdad, solo una versión mutilada.
  - **El mando NUNCA viaja al sitio de un cliente.** Va con comentario de
    aviso en los tres archivos que toca y el README lleva la receta de borrado
    paso a paso, **comprobada por script contra los archivos**, no escrita de
    memoria.
  - Detalles que ya costaron una pasada: va con `[hidden]` y lo enseña el JS
    (sin JS no haría nada); la clase se aplica en el **script bloqueante del
    `<head>`** o la página arranca en una versión y salta a la otra; se
    **esconde mientras el aviso de cookies está en pantalla**, que en móvil
    ocupa todo el ancho; y si recuerda la elección en `localStorage`, hay que
    **actualizar el aviso de cookies y el aviso legal**, o el sitio se
    contradice a sí mismo.
- **Control de paleta: mando de color, siempre, desde 2026-09-21.** Mismo
  mecanismo que el de arriba (mando de demostración, clase en `<html>`,
  resuelto en el script bloqueante del `<head>`, nunca viaja al cliente,
  receta de borrado en el README) pero para el **color de marca**, no la
  densidad: tres botones — la paleta real y **dos alternativas derivadas**,
  no inventadas a ojo. Deriva las alternativas rotando el matiz del acento y
  conservando la estructura de luminosidad/contraste del original (objetivo
  ~7:1 en botones, ~4,5:1 mínimo en texto sobre el fondo — comprobar, no
  suponer); el resto de la paleta (tinta, papel, grises neutros) **no
  cambia** entre las tres, y **el logo real tampoco cambia de color** — es
  el elemento fijo de la identidad, no parte del experimento. Nace de un
  caso real: un cliente (Dourado & Fernández) dijo en la reunión que el
  verde no le convencía, y hubiera sido mejor poder probarle otro color ahí
  mismo en vez de improvisar la respuesta o esperar a la siguiente entrega.
  Motivo de más para plantillas ficticias: un prospecto de sector nuevo
  puede decidir el color viendo la propia demo, no una paleta impuesta.
- **Aviso de cookies.** Siempre. Y el botón tiene que cerrarlo de verdad:
  el `display:flex` va en `.cookie-banner:not([hidden])`, **nunca** en
  `.cookie-banner` a secas — si no, gana al atributo `[hidden]` y el botón
  «no hace nada». Estado en `localStorage`.
- **Mapa solo bajo clic.** El `<iframe>` de Google no existe en el DOM hasta que
  se pulsa el botón; si no, contradice el aviso de «sin cookies de terceros».
  `https://www.google.com/maps?q=<nombre+direccion>&output=embed`, sin API key.
- **Página `404.html`** con el mismo lenguaje visual.
- **`.nojekyll`**, `manifest.json`, favicon SVG, `og:image` de 1200×630 real.
- **Menú móvil** que funciona, con `aria-expanded`.
- **Aviso legal / privacidad**, aunque sea escueto, coherente con lo ficticio.
- **`README.md`** con: el sello de demo, el concepto y su porqué, el mapa de
  secciones, qué hay que tocar para reskinearlo a un cliente real (esto es lo
  más valioso del repo), créditos de fotos y decisiones tomadas.
- **Accesibilidad**: contraste AA, foco visible, landmarks, `alt` con sentido,
  navegación completa por teclado.
- **Nunca apagar un texto con `opacity`; apagarlo con color.** Un secundario a
  `opacity: .45` sobre el color de tinta da 2,7–3,9 de contraste y **no se puede
  auditar**: la herramienta ve el color declarado, no el resultado. Fue el fallo
  estructural de las once primeras plantillas de la biblioteca. Se define un
  token de color apagado por cada pareja de fondo y **se calcula el contraste
  con un script**, no a ojo.
- Si un color de marca no llega a AA como texto, **no se cambia el color de
  marca**: se añade un token aparte solo para texto y la marca se queda donde
  aporta (fondos, filetes, superficies grandes).
- **Contenedores que desbordan en horizontal**: hacerlos focusables **solo
  cuando de verdad desbordan** (y revisarlo al redimensionar), con `role="group"`
  y `aria-label`. Un `tabindex="0"` fijo mete una parada de tabulación inútil en
  escritorio, donde no desbordan.
- **Sin GSAP tampoco se rompe.** Los estados «vacíos» (opacidad 0, desplazados)
  viven bajo `html.has-motion`, clase que solo enciende `main.js` tras comprobar
  que GSAP y ScrollTrigger existen. Con el CDN caído, la página se ve entera.
- **`prefers-reduced-motion`**: se apaga el *movimiento*, no el *contenido*.
  Contadores, imagen activa de una galería, índices y estados de horario tienen
  que seguir cambiando. Separar la bandera `gsapReady` de la bandera `motion`.

---

## 6. Trampas ya pagadas — no volver a caer

Cada una de estas costó una sesión de depuración. Leerlas.

**Rendimiento**

- Nunca `ctx.filter = "blur()"` ni `shadowBlur` por fotograma en un canvas,
  menos aún a pantalla completa. Se cachea como sprite fuera de pantalla y se
  pinta con `drawImage`. Verificar con `PerformanceObserver` de `longtask`,
  no solo mirando los FPS.
- Las tareas largas al cargar suelen ser GSAP + webfont, no el código propio.
  Medir la animación desde `document.fonts.ready`.
- **Componer una capa translúcida sobre sí misma en canvas desvía el color
  canal a canal.** Una niebla recompuesta a alfa 0,01 por fotograma acaba gris
  y rosa a los pocos segundos (se ve muestreando con `getImageData`, no a ojo).
  Repintar la capa entera cada fotograma desde el sprite limpio y llevar lo
  borrado en una **máscara aparte**.
- **Un búfer de canvas más pequeño que su caja se estira en bandas.** Con el
  `100svh` del móvil hay que remedir con **`ResizeObserver`**, no solo con el
  evento `resize`.
- **Cuidado con el cero falso al medir `longtask`**: una tarea larga lanzada
  desde el `page.evaluate` de Playwright **no** se contabiliza como longtask de
  la página, así que el control de la medición sale en 0 y parece que el
  observador está muerto. Lanzar el control con `setTimeout`, que sí es una
  tarea normal de la página.

**GSAP**

- `gsap.fromTo` pinta el estado «from» al crearse: `immediateRender: false` o el
  hero se enciende antes de tiempo. Se ve en una captura a mitad de animación,
  no en la final.
- Rotar o **escalar** un SVG: `transformOrigin` mide sobre el **bbox**, no sobre
  el viewBox — usar `svgOrigin`, o sacar el gesto a CSS con una clase, que sí
  resuelve el origen contra el viewBox. Si no, GSAP escribe
  `transform-origin: 0 0` y lo compensa con un `translate` que echa la pieza
  fuera del lienzo. Y cualquier `transform` puesto en CSS pisa el atributo que
  escribe GSAP y deja la animación clavada.
- Los tweens de opacidad scrubbeados pueden dejar una tarjeta sticky invisible.
- **GSAP lee el `translate3d` que venga del CSS como `y` en píxeles, no como
  `yPercent`.** Si el estado «vacío» del char-reveal está en CSS
  (`transform: translate3d(0,120%,0)`), animar `yPercent` a 0 deja las letras
  clavadas abajo y el titular no aparece. Fijar `y: 0` explícito al preparar.
- **Un `ScrollTrigger` con `once: true` no dispara si el elemento ya está en
  pantalla cuando se crea**, así que el hero no se revela nunca. Todo lo de
  «una sola vez» (titulares, apariciones, contadores) va con
  `IntersectionObserver`; ScrollTrigger se reserva para pins y scrubs.
- **Dos tweens de GSAP sobre el mismo `clip-path` se pisan** y dejan la imagen a
  medio abrir. Las máscaras y apariciones salen mejor como transición CSS + una
  clase que pone el `IntersectionObserver`; GSAP se reserva para titulares,
  intro, cinta, imán y anclaje.
- En un `<g>` de SVG, GSAP escribe el `transform` **en el atributo**, así que
  cualquier `transform` en CSS lo pisa, **incluso `transform: none`**. Solución
  limpia: que el estado inicial sea el de por defecto (y así valga sin JS, con
  movimiento reducido y en móvil) y se retire con una clase que ponga el propio
  JS: `#plano:not(.esta-animado) .pieza { transform: … }`.

**Layout**

- Sticky-stack: **el `<li>` es el sticky**, y el recorrido se lo da su
  `margin-bottom`. `min-height` en el `<li>` + tarjeta sticky dentro = tarjetas
  fantasma.
- El recorrido de un sticky lo da el **contenido**: ni el `padding` del
  contenedor ni el `margin` del último hijo sirven. Usar `::after`.
- Char-reveal: con letras en `inline-block`, **la palabra también** tiene que ser
  `inline-block` + `white-space: nowrap`, o parte en «se / mana».
- `background-clip: text` se pelea con los `<span>` del char-reveal.
- Dentro de un grid, cada trozo de texto suelto entre elementos es un item
  anónimo y se va a su propia columna (una palabra por línea): envolver en
  `<span>`.
- Filas `auto` + figura al 100 % + `img{flex:1}` es una restricción circular y
  el navegador estira la foto.
- El `%` dentro de `translate()` es relativo al propio elemento, no al padre:
  para un layout radial, usar `cqw` o px.
- `mask-image` no funciona bajo `file://`, recorta a la caja del elemento (se
  come las tildes) y una máscara clara sobre fondo claro es invisible.
- `stroke-dasharray` + `pathLength` se rompe si el `viewBox` se estira sin
  preservar la proporción: para barras rectas, un `div` con `transform: scaleY`.
- `<use>` de un sprite SVG sin `width`/`height` escala al viewport del
  contenedor, y `fill` no hereda de `color`.
- Una `url()` dentro de una custom property se resuelve contra la hoja de
  estilos que la usa, no contra el documento.
- Una clase de wrapper con el mismo nombre que un `<g>` de un SVG inline pisa su
  `transform`.
- **Un elemento más ancho que la pantalla ensancha el viewport entero en móvil**
  si a `html` le falta `overflow: clip`: el layout se calcula a 390 px pero
  `innerWidth` sale 1066 y toda la página se descoloca. Se detecta porque los
  clics de Playwright caen sobre el elemento equivocado, no porque se vea mal.
- **El botón del menú móvil se queda por debajo de la cortina del menú** si la
  cortina lleva `z-index` y el botón no: abre pero no cierra. Se caza con un
  `click` de Playwright que da timeout, no mirando la captura.

**Parchear archivos con un script**

- **Un `String.replace` con un literal `\n` no encuentra nada en un archivo con
  finales de línea CRLF, y devuelve la cadena intacta sin avisar.** El script
  escribe archivos «parcheados» que no lo están y nadie se entera.
- **Un comodín `[\s\S]*?` entre dos anclas se come todo lo que haya en medio** si
  la primera ancla aparece antes de lo previsto: en una plantilla se llevó por
  delante 500 líneas de `main.js` porque usaba `document.fonts.ready` también en
  la medición de tareas largas.
- Regla: nada de comodines, comprobar cada escritura, y **negarse a escribir si
  el archivo pierde líneas**.

**Tipografía**

- No todas las tipografías traen todos los glifos: la cursiva de Fraunces no
  tiene el signo del euro y pinta una «C». Revisar €, ñ, tildes y « » en la
  tipografía elegida antes de cerrarla.

**Lenis**

- En una galería anclada con scrub horizontal, el retardo de asentamiento de
  Lenis (invisible en vertical) se lee como «el contenido se va al revés durante
  un segundo». Subir `lerp` a ~0,15–0,2 en esa build.

---

## 7. Verificación antes de dar por buena una plantilla

No se anuncia como terminada sin esto. Si falta una herramienta en el entorno,
se dice claramente en el informe en vez de darlo por hecho.

1. **Abrirla de verdad** (Playwright / Chrome headless) en 1440×900 y 390×844.
2. **Capturas de cada sección**, escritorio y móvil, en `screenshots/`.
   Se miran. Una sección que se ve mal en la captura no está terminada.
3. Con Lenis, `window.scrollTo` **no** dispara los ScrollTrigger del final:
   recorrer con `mouse.wheel` y esperar ~3 s antes de medir.
4. **Consola limpia**: cero errores, cero 404. Comprobar la lista de peticiones.
5. Pasada con **GSAP bloqueado** (`route.abort()` del CDN): la página se lee
   entera. Captura.
6. Pasada con **`prefers-reduced-motion: reduce`**: sin movimiento pero el
   contenido sigue cambiando. Captura.
6 bis. **La cortina, a mitad de camino.** En la captura final ya no está, así que
   hay que guardar fotogramas intermedios y mirarlos: es la única forma de ver
   que se levanta de verdad. Un fallo real ya cazado así: la cortina era **del
   mismo color que el fondo** y se levantaba sin que se viera levantarse. Medir
   además que acaba en `display:none` en los tres casos (normal, sin GSAP y con
   movimiento reducido), o la página queda tapada.
7. Probar el **botón de cookies**, el **menú móvil** y el **botón del mapa**.
7 bis. **Las dos densidades del control de maqueta**, por código: que el mando
   se aparte con el aviso de cookies y aparezca al cerrarlo, que en la versión
   sobria se retire de verdad lo que tiene que retirarse y ocupe su sitio lo
   que lo sustituye, que no aparezca desbordamiento horizontal nuevo y que se
   pueda volver. Y capturas de las dos: la sobria es la que se le enseña a la
   mitad de los clientes.
7 ter. **Las tres paletas del control de paleta**, por código: que pulsar cada
   botón cambie de verdad el color computado de algo real (no solo la clase
   en `<html>`), que `aria-pressed` y el `localStorage` queden bien, y que al
   recargar la paleta guardada se aplique sin parpadeo (comprobar la clase
   justo tras `load`, no solo tras esperar). Medir el contraste texto/fondo
   de las dos paletas derivadas, no darlo por bueno a ojo.
8. Revisar que no queda ningún `[PENDIENTE]`, `TODO` ni texto de relleno tipo
   *lorem ipsum*.
9. Repasar §1 entero: ningún dato puede parecer el de un negocio real.
