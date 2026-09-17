# Floristería

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Floristería | Ramalleira (Betanzos, A Coruña) | «Ramo» — el ramo se monta delante de ti, tallo a tallo | hueso #FBF5EC / papel kraft #EFE2CE / ciruela #3B2434 / azafrán #D98A28 / rosa #C15A6A / salvia #6F8560 | Gloock + Hanken Grotesk | sección anclada en la que el ramo dibujado se completa grupo a grupo mientras pasan los cinco pasos, con contador de tallos (0 → 13) | [repo](https://github.com/alvarotaiagu/plantilla-floristeria-web) | [demo](https://alvarotaiagu.github.io/plantilla-floristeria-web/) |

**Porqué del concepto:** en una floristería de barrio lo que se compra no es un producto
de estantería, es un rato de mostrador. La página hace lo mismo que la florista: primero
el verde, después las flores que mandan, el relleno, el atado y el papel.

**Obra gráfica propia:** ocho especies dibujadas en SVG (rosa, ranúnculo, tulipán, clavel,
eucalipto, helecho, paniculata y espiga) en un `<defs>` y colocadas con `<use>` +
`transform` + atributo `color`. El mismo ramo se monta dos veces (hero y sección anclada)
sin repetir dibujo. Seis fotos de Pexels, acreditadas.

**Recursos de movimiento:** Lenis, char-reveal, ramo que se monta en la intro, sección
anclada con los cinco pasos (protagonista), marquee con velocidad ligada al scroll,
botones magnéticos, cursor propio, máscaras de imagen, apariciones con
IntersectionObserver, contador de tallos, «el cubo» que rota por semana y estado
abierto/cerrado en vivo.

**Rendimiento:** medido con `PerformanceObserver` de `longtask`: una sola tarea larga de
~100 ms al cargar (GSAP + webfont), ninguna después. Queda en `window.__tareasLargas` y
se imprime en consola a los 10 s.

**Dos trampas evitadas y una caída:** las apariciones de una sola vez van con
IntersectionObserver (no `once:true`); el char-reveal anima `y: 0` en píxeles. La caída
fue animar `clip-path` con GSAP: dos tweens sobre la misma propiedad se pisaban y la foto
del hero se quedaba a medio abrir. Ahora las máscaras son transición CSS + una clase.
