# Tienda y taller de bicicletas

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Tienda y taller de bicicletas | Sete Curvas | «Perfil de etapa» | papel greige / tinta casi negra / naranja flúor / verde pino | Anybody + Chivo + Azeret Mono | perfil de altimetría fijo abajo que se pinta con el scroll, con ciclista que avanza y lectura en vivo de km, altitud y pendiente | [alvarotaiagu/plantilla-bicicletas-web](https://github.com/alvarotaiagu/plantilla-bicicletas-web) | [demo](https://alvarotaiagu.github.io/plantilla-bicicletas-web/) |

**Porqué del concepto:** una tienda de bicis vive de las salidas, y una salida se cuenta
con su perfil. La web se recorre como una etapa de 42 km: cada sección es un punto
kilométrico (km 3 el taller, km 11 las bicis, km 27 el club), el perfil vive pegado
abajo y se va pintando, y el km, la altitud y la pendiente se calculan **del propio
dibujo del perfil**, no están escritos a mano. La sección que habla de subir está en el
punto más alto.

**Recursos de movimiento:** Lenis, perfil de etapa scrubbeado (protagonista), marcador
de sección con IntersectionObserver, titulares letra a letra, ruedas que giran en el
catálogo (CSS puro), botones magnéticos, cursor en forma de rueda, contadores y horario
en vivo.

**Rendimiento medido:** `PerformanceObserver` de longtask — 1 tarea larga de 92 ms al
arrancar (GSAP + webfont) y **0 mientras se rueda**, con el perfil repintándose en cada
scroll.

**Datos ficticios:** Rúa da Ponte Nova, 5 · Ourense · 988 00 00 15 ·
hola@setecurvas.example. Seis bicicletas dibujadas en SVG desde una geometría común y
tres fotos de Pexels sin caras identificables. Las rutas avisan de que son inventadas y
de que no están señalizadas. Sin `aggregateRating`, con `noindex, nofollow` y sello de
demo en footer, README y comentario HTML.

**Cortina de entrada (añadida el 2026-09-19):** «Perfil de etapa»: se dibuja el perfil, el punto naranja lo recorre leyendo el trazado real con `getPointAtLength`, y después la ladera barre la pantalla hacia la derecha con su borde curvo por delante. Encadenada, con `expo.inOut` y borde curvo, y el hero no entra hasta que la cortina va por la mitad (constante `ESPERA` de `main.js`). **Retirada garantizada**: se quita al terminar, se quita sin GSAP, se quita con movimiento reducido y hay un `setTimeout` de 5 s de red de seguridad; el `display` va en `.cortina:not([hidden])`, nunca en la clase a secas —si fuera a secas ganaría al atributo `hidden` y la página quedaría tapada para siempre.

Trampa cazada: el porcentaje horizontal de `border-radius` es sobre el **ancho del elemento** (172vw), no sobre el viewport. Con 34% la curva se metía 8vw dentro de la pantalla y dejaba ver la página por las esquinas antes de empezar.
