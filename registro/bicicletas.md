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
