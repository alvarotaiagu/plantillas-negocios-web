# Estalo · Chocolatería e bombonería (Ribadeo)

> **Sitio de demostración.** Estalo es un negocio **ficticio**; los datos,
> bombones, precios, horarios, ilustraciones y opiniones son de muestra y no
> corresponden a ninguna chocolatería real. Todas las páginas llevan
> `noindex, nofollow`.

Plantilla de la biblioteca de negocios ficticios para el sector
**chocolatería / bombonería con obrador**. Web estática: `index.html` +
`css/estilos.css` + `js/main.js`, sin build. GSAP, ScrollTrigger y Lenis
desde jsDelivr.

---

## Concepto: «Templado»

*Estalo* es el chasquido en gallego. Un chocolate bien templado brilla, se
suelta solo del molde y **cruje** al partirlo; uno mal templado sale mate, con
flor grisácea, y se dobla. Toda la diferencia está en una curva de
temperaturas (45 → 27 → 31 °C) que el cliente nunca ve. La web la enseña:

- **La portada es una tableta en canvas** que brilla donde pasas el cursor
  (la prueba del templado es el brillo) y que se parte onza a onza al pulsarla
  (la otra prueba es el chasquido). Se ladea con el scroll.
- **La sección anclada traza la curva** con scrub: el punto recorre la
  gráfica, la temperatura, los cristales que mandan (ninguno → IV y V → solo
  V) y el brillo se leen en vivo, y una onza de muestra pasa de mate con flor
  a brillante.
- **Los bombones se parten por la mitad** al elegirlos: el corte dibujado
  enseña cáscara pintada, chocolate y rellenos por capas.
- **La cortina «Clac»** es una tableta que se parte por una grieta curva y
  cada mitad cae por su lado. La sección clara de bombones y la de cajas
  llegan con **el borde quebrado de una onza partida**, que se cierra con el
  scroll.

## Qué hace esta mejor que las anteriores

Revisadas las fichas de **Milmigas** (panadería), **Queixería Bardanca**,
**Trasfega** (cervecería) y **Salseiro** (heladería, de esta misma noche):

1. **El hero se rompe de verdad.** Ninguna plantilla deja al visitante
   destruir el producto: aquí cada onza se parte, sale volando con física
   propia (gravedad, giro) y deja la grieta un instante. Con teclado,
   «Partir una onza»; con movimiento reducido, la onza desaparece sin vuelo.
2. **Canvas sin coste muerto.** La tableta no tiene bucle permanente: pinta
   solo mientras algo se mueve (brillo que se asienta, onzas cayendo, scroll)
   y se duerme sola. Cada onza es un sprite dibujado una vez; el brillo es
   otro sprite compuesto con `source-atop`. Ni `filter` ni `shadowBlur`.
3. **La anclada es un gráfico real** (eje lineal, °C de verdad) con el trazo
   scrubbeado por GSAP (`pathLength=1`, `autoRound:false`), no una sucesión de
   tarjetas.
4. **Registro oscuro con una sección clara que rompe**: la biblioteca tiene
   oscuros industriales (taller, gimnasio, cervecería); este es cálido, de
   cacao, con un único acento de manteca de cacao pintada.
5. **Tipografía variable con eje de anchura** (Mona Sans, `wdth` 75–125): los
   titulares van ensanchados y el cursor los estrecha al acercarse.
6. **La sobria añade datos**: % de cacao de los doce bombones ordenado y
   precio por bombón de cada caja.

## Mapa de secciones

Distinto de Salseiro y de las registradas: la técnica va **antes** que el
producto, y no hay manifiesto ni calendario.

0. Cortina «Clac».
1. **Portada** — titular + tableta en canvas.
2. **La curva del brillo** — anclada con scrub (4 pasos).
3. **Doce bombones, por dentro** — molde de 12 + corte del elegido.
4. **Cinta** de orígenes del cacao, velocidad ligada al scroll.
5. **Cajas** — pila sticky de 4 cajas + formulario de encargo.
6. **Horario** en vivo.
7. **Visita** — dirección, opinión de muestra, mapa bajo clic. Pie con sello.

## Paleta

| Token | Hex | Uso |
|---|---|---|
| `--cacao` | `#1A0F0B` | fondo |
| `--panel` | `#24150F` | paneles |
| `--linea` | `#3A251C` | filetes |
| `--leche` | `#7B4A2E` | chocolate con leche: cortina, cajas |
| `--crema` | `#F3E7D6` | texto sobre cacao (15,41) y fondo de bombones |
| `--crema-apagada` | `#BFA894` | secundario sobre cacao (8,28) y panel (7,77) |
| `--tinta-apagada` | `#5E4334` | secundario sobre crema (7,39) |
| `--acento` | `#31B2A6` | turquesa de manteca de cacao: 7,21 sobre cacao |
| `--acento-osc` | `#00625A` | el mismo para texto sobre crema (5,95) |

Alternativas del mando, derivadas en OKLCH con el mismo contraste
(`scripts/contraste.mjs`): **Coral** `#E0897B` / `#913A2F` y **Oro**
`#C09B49` / `#6E5200`. Cacao, crema y logo no cambian.

## Tipografía

**Mona Sans** (variable, `wdth` + `wght`) para titulares y texto, **Instrument
Serif** en cursiva para los acentos, **Red Hat Mono** para cifras. Ninguna
en el registro.

## Movimiento (PLIEGO §2)

Protagonista: **la tableta que brilla y se parte** y **la curva anclada**.
Además: Lenis, char-reveal palabra a palabra, pila sticky de cajas, cinta con
velocidad ligada al scroll, botones magnéticos, cursor propio («partir» sobre
la tableta), transición de sección «grieta» con scrub y anchura variable
ligada al cursor.

## Reskinear para un cliente real

1. **Datos**: buscar `Estalo`, `Mármore Vello`, `982 00 00`, `estalo.example`
   en `index.html`, `legal.html`, `404.html`, `manifest.json` y el
   `application/ld+json`.
2. **Bombones**: cada `<button class="bombon">` lleva nombre, descripción,
   capas (`color:nombre|color:nombre`), alérgenos y % de cacao en `data-*`;
   la pintura de la cáscara es `--p1`/`--p2`. El corte, la tabla de cacao y los
   huecos de las cajas se generan de ahí.
3. **Cajas**: `data-n` y `data-precio` de cada `.pila-item` alimentan los
   huecos dibujados y el precio por bombón.
4. **Horario**: el objeto `HORARIO` de `js/main.js` manda; la tabla del HTML
   es la versión sin JS.
5. **Paleta**: tokens de `:root`; recalcular con `node scripts/contraste.mjs`.
6. **Logo**: `img/logo.svg` y el `<symbol id="logo">` del `index.html`.
7. **Sello de demo**: comentario HTML, `.sello` del pie, `noindex` y este aviso.
8. **Quitar los mandos** (abajo).

### Receta de borrado de los mandos (comprobada con `scripts/receta.mjs`)

Los mandos solo aparecen con `?revision`. **Nunca viajan al sitio de un cliente.**

1. `index.html`: borrar entre `<!-- MANDO DE DEMOSTRACIÓN: inicio -->` y
   `<!-- MANDO DE DEMOSTRACIÓN: fin -->`, y las líneas `// MANDO` del script
   del `<head>`.
2. `css/estilos.css`: borrar entre `/* MANDO DE DEMOSTRACIÓN: inicio */` y
   `/* MANDO DE DEMOSTRACIÓN: fin */` (si el cliente elige la sobria o otra
   paleta, copiar antes esas reglas a la raíz sin el prefijo).
3. `js/main.js`: borrar entre `// MANDO DE DEMOSTRACIÓN: inicio` y
   `// MANDO DE DEMOSTRACIÓN: fin`.
4. `legal.html`: borrar el párrafo `id="legal-mando"`.

## Imágenes

Ninguna fotografía (Pexels y Unsplash bloqueados desde el entorno, y una
tableta dibujada que se puede partir dice más que una foto de bombones de
archivo). `img/og.png` e `img/icono-*.png` salen de `scripts/imagenes.js`,
con un fotograma real del canvas.

## Verificación

`node scripts/verify.js` (Playwright, servir la carpeta **padre** en
`http://127.0.0.1:8765/`), `node scripts/receta.mjs` y `AUDITORIA.md`.
Resultados y decisiones en `INFORME-NOCHE.md`.
