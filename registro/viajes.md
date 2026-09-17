# Agencia de viajes

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Agencia de viajes | Viajes Arroaz (Viveiro, Lugo) | «Sellos» — lo que queda de un viaje es el sello en el pasaporte, y cada viaje de la casa es uno | papel #F4EFE4 / panel #ECE4D4 / crema #FBF8F1 / tinta #241F1C / verde de garita #1F4E4A / mostaza #C89A2B / rojo de tampón #A63D2F | Spectral + Epilogue | seis sellos dibujados que **se estampan** al llegar a ellos (transición CSS con rebote sobre el `<svg>`, disparada por IntersectionObserver), más los tres del pasaporte del hero | [repo](https://github.com/alvarotaiagu/plantilla-viajes-web) | [demo](https://alvarotaiagu.github.io/plantilla-viajes-web/) |

**Porqué del concepto:** una agencia pequeña no compite en precio ni en catálogo, compite
en criterio. El sello es la prueba de que alguien estuvo allí: por eso cada uno de los
seis viajes propios es un sello distinto —círculo doble, rectángulo, hexágono, escudo,
círculo troquelado y cartela— con su código, su fecha y su tinta.

**Decisión técnica:** el golpe de sello va en el propio `<svg>` con transición CSS
(`cubic-bezier(.2,1.5,.4,1)`) y una clase que pone el IO, **no con un tween de GSAP sobre
un `<g>`** (el atributo `transform` se pelea con el CSS). Resultado: se estampa igual sin
CDN y, con movimiento reducido, aparece ya puesto.

**Obra gráfica propia:** nueve sellos, la página de pasaporte con su pauta, el logotipo
(el arroaz saltando dentro del sello), el dibujo del mapa, el sello de la 404 y la
og:image. Seis fotos de Pexels acreditadas y **rotuladas «foto de archivo»** en la propia
página.

**Recursos de movimiento:** Lenis, char-reveal, sellos que se estampan (protagonista),
marquee con velocidad ligada al scroll, botones magnéticos, cursor propio, máscaras de
imagen, apariciones con IO, contadores y horario en vivo.

**Rendimiento:** `PerformanceObserver` de `longtask`: **una sola tarea larga de 103 ms** al
cargar, ninguna después.

**Línea roja del sector:** sin número de licencia de agencia de viajes inventado (es el
dato que distingue a una agencia legal, y está en un registro público); hay un bloque
dedicado a explicar qué habría que poner ahí. Se descartó el nombre «Viajes Ronsel»
porque existe una agencia real así en Pontevedra. Fotos rotuladas como de archivo para no
vender una playa que no es la que se vende. Sin motor de reservas ni pasarela de pago.

**Capturas:** 63 en `screenshots/`, en JPEG de calidad 72.
