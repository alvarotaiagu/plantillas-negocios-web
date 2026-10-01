# Salseiro · Xeadaría de obrador (Baiona)

> **Sitio de demostración.** Salseiro es un negocio **ficticio**; los datos,
> sabores, precios, horarios, ilustraciones y opiniones son de muestra y no
> corresponden a ninguna heladería real. Todas las páginas llevan
> `noindex, nofollow`.

Plantilla de la biblioteca de negocios ficticios para el sector **heladería
artesanal con obrador propio**. Web estática: `index.html` + `css/estilos.css`
+ `js/main.js`, sin build. GSAP, ScrollTrigger y Lenis desde jsDelivr.

---

## Concepto: «Mantecar»

*Mantecar* es el verbo del oficio: batir la mezcla mientras se congela para
que entre aire y salga crema en vez de hielo. Es lo único que una heladería de
obrador hace y una de cubo industrial no, y es **un gesto**: la pala que da
vueltas, la espátula que peina la vitrina. De ahí cuelga todo:

- **La portada es la vitrina vista desde arriba**, un shader WebGL de crema
  con su veteado de temporada. El cursor es la espátula: arrastrarlo abre
  surcos y remueve el veteado; un clic cambia de sabor. El scroll hace que la
  crema «ceda» y fluya, como la que lleva un rato fuera.
- **La secuencia anclada** cuenta un día de obrador de 07:30 a 09:40 con
  scrub: leche → pasteurizar → madurar → mantecar → abatir → vitrina, y el
  termómetro, el aire incorporado (*overrun*) y la hora corren con el dedo.
- **Las transiciones entre secciones** no son fundidos: el borde superior de
  cada bloque llega ondulado, como nata recién echada, y la espátula lo alisa
  mientras entra.
- **La cortina de entrada («Boleado»)** es la bola: el telón de color se
  vacía con un golpe de boleadora que deja el rizo en el borde.

Registro visual **C — producto y textura**: color de temporada y cremosidad.
Sin fotografía (ver «Imágenes»), todo es obra propia en SVG y shader.

## Qué hace esta mejor que las anteriores

Antes de diseñar se repasaron las fichas de **Milmigas** (panadería),
**Queixería Bardanca** (quesería), **Ramalleira** (floristería) y
**Ouzande/Trinquete** (abogacía) en `registro/`. Lo que esta plantilla mejora,
en concreto:

1. **El hero se toca, no se mira.** Milmigas tenía un canvas de burbujas que
   sube solo y Casa Bricaña un vaho que se limpia; aquí es un **shader WebGL
   con iluminación** (normales calculadas de un campo de alturas, brillo
   especular de crema) que responde al cursor con surcos que persisten y se
   cierran despacio, al clic cambiando de sabor, y al scroll. Y mide su coste:
   resolución interna limitada, pausa fuera de pantalla y en pestaña oculta,
   `longtask` contado con `PerformanceObserver` desde `document.fonts.ready`.
2. **La secuencia anclada enseña cifras que cambian de verdad**, no tarjetas
   que pasan: temperatura de 4 → 85 → 4 → −8 → −35 → −12 °C, aire de 0 → 32 %
   y reloj del obrador, interpolados con el scrub. Ramalleira montaba un ramo
   con contador de tallos; aquí son **tres magnitudes del oficio a la vez**,
   y el dibujo (nivel, burbujas, escarcha) obedece a las mismas cifras.
3. **La carta es herramienta**: catorce sabores con sus alérgenos y un filtro
   que marca al momento lo que no es apto («sin leche», «sin frutos de
   cáscara»…), dicho con texto y no apagado con opacidad. Ninguna plantilla de
   comida de la biblioteca filtra por alérgenos.
4. **Escala tipográfica variable de verdad**: Bodoni Moda con ejes de peso y
   tamaño óptico; los titulares engordan con el cursor y con el scroll (la
   letra «se empasta» como la crema). Las anteriores usaban pesos fijos.
5. **Transiciones de sección propias del concepto** (el borde de nata que se
   alisa, scrubbeado) en vez del `fade-up` común a casi toda la biblioteca.
6. **Dos densidades que cambian el dato, no solo el adorno**: la sobria
   sustituye las cubetas dibujadas por una lista con el % de fruta en barras,
   y las tallas dibujadas a escala por una comparación de **precio por litro**
   (que la cargada no tiene).

## Mapa de secciones

Orden y forma deliberadamente distintos de las plantillas registradas (ninguna
abre con el oficio contado en cifras antes de la carta, y ninguna tiene
filtro de alérgenos):

0. Cortina «Boleado».
1. **Portada** — vitrina en shader + titular + «hoy» (hora de mantecado,
   sabores en vitrina, sabor en la pala).
2. **Manifiesto** — composición tipográfica asimétrica, una sola frase larga.
3. **La vitrina de esta semana** — 14 sabores en cubetas de distintos anchos
   (como una vitrina de verdad), con alérgenos y filtro.
4. **El obrador, paso a paso** — anclada con scrub (6 pasos).
5. **Calendario de fruta** — cinta del año: qué fruta entra en cada mes, con
   el mes actual marcado.
6. **Cinta** de sabores que vuelven, con la velocidad ligada al scroll.
7. **Tamaños y precios** — tallas dibujadas a la misma escala.
8. **Tartas heladas por encargo** — pila sticky de cuatro tartas en corte,
   y formulario de encargo de muestra.
9. **Horario** — invierno y verano, con «abierto ahora» en vivo.
10. **Visita** — dirección, mapa bajo clic, contacto. Pie con sello de demo.

## Paleta

| Token | Hex | Uso |
|---|---|---|
| `--leite` | `#FBF5EE` | fondo |
| `--nata` | `#F3E9DC` | paneles |
| `--barquillo` | `#E9D3B4` | superficies cálidas, cucurucho |
| `--tinta` | `#2A1520` | texto, secciones en negativo (amora negra) |
| `--tinta-apagada` | `#6B4F5A` | secundario sobre leite/nata (6,71 / 6,05) |
| `--leite-apagada` | `#CDB8C0` | secundario sobre tinta (9,14) |
| `--acento` | `#D63368` | framboesa, superficies y cortina |
| `--acento-txt` | `#A2174A` | framboesa para texto y botones (7,03 sobre leite) |
| `--acento-claro` | `#F589A1` | framboesa sobre tinta (7,32) |

Paletas alternativas del mando (derivadas rotando el matiz en OKLCH y
reajustando la luminosidad hasta el mismo contraste, con
`scripts/contraste.mjs`): **Pistacho** `#598000` / `#3F5C00` / `#8FB657` y
**Arándano** `#735FEA` / `#5440B3` / `#A4A0FC`. Tinta, leite, nata y el logo
no cambian.

## Tipografía

**Bodoni Moda** (variable: `wght` 400–900, `opsz` 6–96, con cursiva) para
titulares; **Albert Sans** (variable) para texto; **Spline Sans Mono** para
cifras de obrador. Ninguna está en el registro. Comprobados €, ñ, tildes, « »
y º en la cursiva de Bodoni Moda (ver `INFORME-NOCHE.md`).

## Movimiento (PLIEGO §2)

Protagonista: **la crema que se remueve** (shader del hero) y **el día de
obrador anclado** con scrub. Además: Lenis como único motor, char-reveal
palabra a palabra, pila sticky de tartas, cinta con velocidad ligada al
scroll, botones magnéticos, cursor propio (punto + aro, que se vuelve espátula
sobre la vitrina), contadores, bordes de sección que se alisan con scrub y
peso tipográfico variable ligado al cursor.

## Reskinear para un cliente real

Lo que hay que tocar, en este orden:

1. **Datos del negocio**: buscar `Salseiro`, `Rúa do Pairo`, `986 00 00`,
   `salseiro.example` en `index.html`, `legal.html`, `404.html`,
   `manifest.json` y el bloque `application/ld+json`.
2. **Sabores**: cada `<li class="cubeta">` de `#vitrina` lleva sus alérgenos
   en `data-alergenos` (claves: `leche`, `huevo`, `cascara`, `gluten`, `soja`,
   `sulfitos`) y su % de ingrediente principal en `data-pct`. El color de la
   cubeta es `--c1`/`--c2` en el `style`.
3. **Horario**: el objeto `HORARIO` al principio de `js/main.js` manda sobre
   el texto: hay que cambiar las dos cosas (la tabla del HTML es la versión
   sin JS).
4. **Precios**: sección `#tamanos` (los `data-ml` y `data-precio` alimentan la
   comparación de €/litro de la versión sobria).
5. **Paleta**: tokens de `:root` en `css/estilos.css`. Recalcular contrastes
   con `node scripts/contraste.mjs` (necesita `culori`).
6. **Logo**: `img/logo.svg` y el `<symbol id="logo">` inline del `index.html`.
7. **Sello de demo**: quitar el comentario de arriba del HTML, el párrafo
   `.sello` del pie, el `noindex` de las tres páginas y este aviso.
8. **Quitar los mandos de demostración** (receta abajo).

### Receta de borrado de los mandos (comprobada con `scripts/receta.mjs`)

Los mandos solo aparecen con `?revision` en la URL. **Nunca viajan al sitio de
un cliente.** Para quitarlos:

1. `index.html`: borrar el bloque entre `<!-- MANDO DE DEMOSTRACIÓN: inicio -->`
   y `<!-- MANDO DE DEMOSTRACIÓN: fin -->`, y en el script del `<head>` las
   líneas marcadas `// MANDO`.
2. `css/estilos.css`: borrar el bloque entre `/* MANDO DE DEMOSTRACIÓN: inicio */`
   y `/* MANDO DE DEMOSTRACIÓN: fin */`. Si el cliente elige la versión sobria
   o una paleta alternativa, antes copiar sus reglas (`html.maq-sobria …`,
   `html.pal-…`) a la raíz sin el prefijo.
3. `js/main.js`: borrar el bloque entre `// MANDO DE DEMOSTRACIÓN: inicio` y
   `// MANDO DE DEMOSTRACIÓN: fin`.
4. `legal.html`: borrar el párrafo con `id="legal-mando"` (habla de las dos
   claves de `localStorage` que el mando guarda).

## Imágenes

Ninguna fotografía. Pexels y Unsplash estaban bloqueados por la red del
entorno de construcción, y además una foto de archivo de helado es
justamente lo que hace parecer genérica una web de heladería: la crema del
hero es un shader y las cubetas, tartas y tallas son SVG propios. Por eso
`CREDITOS.md` solo lista tipografías y librerías.

## Decisiones

Ver `INFORME-NOCHE.md`.
