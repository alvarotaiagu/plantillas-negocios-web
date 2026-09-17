# Quesería artesanal / obrador de queso

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Quesería artesanal | Queixería Bardanca (Palas de Rei, Lugo) | «Corteza» — la corteza es el diario del queso: ahí está escrito el tiempo | fondo paja #F2E9D6 / crema #FBF6EA / panel #E7DAC0 / tinta #33271B / paja #D9A41F / musgo #6E7A52 / cera #8E2B24 | Petrona + Figtree | selector de curación (20/90/180/400 días) que **transforma la rueda dibujada**: corteza, pasta, moho, ojos y cristales cambian con la ficha entera | [repo](https://github.com/alvarotaiagu/plantilla-queseria-web) | [demo](https://alvarotaiagu.github.io/plantilla-queseria-web/) |

**Porqué del concepto (y cómo esquiva la colisión con «Trasfega»):** el aviso era no
acabar en «las cinco fases del proceso ancladas». Aquí no hay proceso ni anclaje: la
entrada es **el tiempo de cura**, una sola variable continua que el visitante mueve y
que cambia el dibujo y los datos a la vez. La leche estacional y la cava sostienen el
mismo argumento desde otro ángulo.

**Obra gráfica propia:** dos ruedas de queso en SVG (la del hero, vista de arriba, con
la cuña que se separa al entrar; y la de la sección, de canto y con la cuña suelta, cara
cortada a la vista). Los colores de corteza, pasta, moho y cristales son variables CSS
que conmuta la clase `.cura--n`. Más el gráfico de la leche (grasa contra hierba),
logotipo, dibujo del mapa, icono de la 404 y og:image. Seis fotos de Pexels acreditadas.

**Recursos de movimiento:** Lenis, char-reveal, selector de cura que transforma la rueda
(protagonista), cuña del hero que se separa, curvas del gráfico que se dibujan solas,
marquee con velocidad ligada al scroll, botones magnéticos, cursor propio, máscaras de
imagen, apariciones con IntersectionObserver, contadores y horario en vivo.

**Rendimiento:** `PerformanceObserver` de `longtask`: **una sola tarea larga de 79 ms** al
cargar (GSAP + webfonts), ninguna después.

**Línea roja del sector:** ni DOP, ni IGP, ni premios, ni número de registro sanitario
inventados — y se dice expresamente en el aviso legal y en la ficha de contacto. Nombre
comprobado, calle inventada en municipio real, teléfonos de muestra y correo `.example`.

**Capturas:** 64 en `screenshots/` (recorrido completo en escritorio y móvil, sin GSAP,
movimiento reducido y páginas sueltas), en JPEG de calidad 72 para no engordar el repo.
