# Taller de cerámica / alfarería

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Taller de cerámica | Olería Rañal (Ponteceso, A Coruña) | «Merma» — todo lo que sale del horno es más pequeño de lo que hiciste, y la plantilla lo mide | barro seco #EDE6DC / panel #DFD5C7 / crema #FAF6EF / tinta #332B24 / hierro #8A4B2A / celadón #6E8C74 | Lora + Public Sans | una **regla graduada que no se mueve** y, contra ella, **la misma jarra dibujada a sus tres tamaños reales** (22,0 → 20,5 → 19,4 cm), con la línea de altura y los cuatro datos bajando a la vez | [repo](https://github.com/alvarotaiagu/plantilla-ceramica-web) | [demo](https://alvarotaiagu.github.io/plantilla-ceramica-web/) |

**Porqué del concepto:** el sector tiene una imagen evidente —el torno girando— y ese era
justo el riesgo señalado. La entrada elegida es un hecho físico que ningún cliente conoce
y que lo explica todo de golpe: el barro encoge en torno a un 12 % entre el torno y la
mesa. De ahí sale el plazo de ocho semanas, la variación entre piezas y el mínimo de
veinticuatro unidades por encargo. El movimiento no ilustra el oficio: **es el dato**.

**Decisión técnica (la que más costó):** el dibujo de la jarra se rehízo para que la tinta
llene el `viewBox` de arriba abajo; si no, al escalarla contra la regla el 0 y la altura
no coincidían. La escala vive en una variable CSS (`--escala`, 1 / .93 / .88) que cambia
con la clase `.merma--N`, y la línea de puntos se posiciona con
`calc(var(--esc) * (.0375 + .83647 * var(--escala)))`, de modo que regla, pieza y línea
salen de la misma unidad.

**El botón y la rueda no se pelean:** en escritorio la tarjeta es `sticky` y el estado lo
pinta el recorrido del scroll; pulsar una pestaña **lleva el scroll al punto que le
corresponde** en vez de pintar el estado a mano. En móvil no hay recorrido —la pieza
encoge sola una vez al entrar— y mandan los botones. Sin GSAP y con movimiento reducido,
los botones pintan directamente: verificado en las dos pasadas.

**Cortina de entrada:** el perfil de la jarra se dibuja solo, el nombre encoge hasta su
tamaño y después la cortina, en tinta oscura, sube **encogiendo un 6 %** con el borde de
abajo curvado. Con `expo.inOut`, entrega al hero (el titular y los contadores los arranca la
línea de tiempo de la cortina, no un retardo fijo) y retirada verificada en los tres casos:
normal, sin GSAP y con movimiento reducido.

**Obra gráfica propia:** la jarra (hero, escena de la merma y partida en dos en la 404),
la regla graduada, las **ocho chapas de esmalte** —degradado CSS con motas y un goterón
que crece, ocho goteos distintos—, el logotipo, el `favicon`, el mapa de relleno y la
`og:image`. Tres fotos de Pexels acreditadas y rotuladas «foto de archivo» en la página.

**Recursos de movimiento:** la escena de la merma (protagonista), la jarra del hero que
encoge con `scrub`, las chapas que gotean escalonadas al entrar, la intro que dibuja el
perfil de la jarra y encoge el nombre, char-reveal, cinta, cursor con etiqueta, botones
magnéticos, máscaras de foto por IO y contadores.

**Accesibilidad:** **axe-core, 0 violaciones a la primera pasada**, en ocho pasadas
(portada escritorio y móvil, la merma en sus dos extremos, el menú móvil abierto, aviso
legal y 404). Es la primera de mis plantillas en la que la paleta **se calculó con el
script de razón WCAG antes de escribir el CSS**, no después de que axe cazara el fallo.
El celadón de marca (2,56 como texto) se queda en rellenos y filetes, con `--celadon-texto`
(4,55) y `--celadon-claro` (6,82) aparte. Los números de la regla, que son texto dentro de
SVG y axe no mira, se midieron a mano: 7,16. Detalle en `AUDITORIA.md`.

**Rendimiento:** `PerformanceObserver` de `longtask`: **ninguna tarea larga** en tres cargas
en frío medidas con la caché deshabilitada (`Network.setCacheDisabled`). En la primerísima
carga del día, con el CDN sin resolver, se registraron 96, 61 y 81 ms.

**Línea roja del sector:** **sin número del Registro de Artesanía de Galicia**. Es una
acreditación pública y aparece en la marca «Artesanía de Galicia», así que el hueco se
queda vacío a propósito y el aviso legal explica qué dato iría ahí. Precios y notas del
cuaderno rotulados como de muestra; las dos opiniones dicen en la propia página que no
vienen de ninguna plataforma. Correo en dominio `.example`.

**Capturas:** 65 en `screenshots/`, en JPEG de calidad 72.
