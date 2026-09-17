# Balneario / casa de baños termal

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Balneario / casa de baños | As Caldeiras (Allariz, Ourense) | «Grados» — el circuito es una escalera de temperaturas, y la página se templa contigo | fondo piedra #F1ECE3 (frío #EAEEEC ↔ cálido #F8E6D7) / panel #E3DCD0 / tinta #33302C / frío #46545C / cálido #C2663C / cobre #B4703A | Cormorant Garamond + Jost | la estación del circuito que tienes en el centro **tiñe la página entera** (fondo, acento, barras) y mueve el termómetro fijo: de 12° gris verdoso a 45° melocotón | [repo](https://github.com/alvarotaiagu/plantilla-balneario-web) | [demo](https://alvarotaiagu.github.io/plantilla-balneario-web/) |

**Porqué del concepto (y cómo esquiva el canvas de líquido):** el aviso era no volver al
canvas de agua. Aquí el agua no se dibuja: se **mide**. Una casa de baños se explica en
grados y en minutos, y el único modo de que una pantalla transmita una temperatura es el
color. El tinte se calcula desde el mismo `data-grados` que se lee en el texto, así que
es dato, no efecto.

**Decisión técnica que lo sostiene:** el tinte y el termómetro van con
`IntersectionObserver`, **no con GSAP**, porque son contenido (qué temperatura estás
leyendo). Comprobado: funcionan igual sin CDN y con `prefers-reduced-motion`.

**Obra gráfica propia:** el termómetro fijo (mercurio que sube, baja y cambia de color),
la escala de las siete temperaturas del hero, el logotipo, el dibujo del mapa, el icono
de la 404 y la og:image. Siete fotos de Pexels acreditadas.

**Recursos de movimiento:** Lenis, char-reveal, tinte + termómetro por temperatura
(protagonista), barras de minutos que crecen al entrar, marquee con velocidad ligada al
scroll, botones magnéticos, cursor propio, máscaras de imagen, apariciones con IO,
contadores y estado abierto/cerrado en vivo.

**Rendimiento:** `PerformanceObserver` de `longtask`: **una sola tarea larga de 90 ms** al
cargar, ninguna después.

**Aviso de sector cumplido:** ni una promesa terapéutica. Hay una sección entera,
«Lo que esto no es», que dice que no es un centro sanitario, que no hace fisioterapia y
que no sustituye al médico; el párrafo del agua dice literalmente que no se le atribuye
ninguna propiedad curativa; y el aviso legal explica que un balneario medicinal necesita
declaración de agua mineromedicinal y autorización sanitaria, que aquí no se inventan.
Entrada a partir de 16 años, lo que además resuelve el asunto de los menores en imagen.

**Capturas:** 64 en `screenshots/`, en JPEG de calidad 72.
