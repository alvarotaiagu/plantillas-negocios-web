# Informe de la noche — Estalo (chocolatería), 2026-10-02

Segunda plantilla de la noche, hecha porque la primera (Salseiro, heladería,
rama `claude/noche-heladeria`) quedó verificada y empujada a las 00:12 y
quedaban más de dos horas. Rama `claude/noche-chocolateria` desde `main`,
carpeta `plantilla-chocolateria-web/`. **Sin repo, sin Pages, sin tocar
`main`, `REGISTRO.md` ni `SECTORES.md`.** Ficha en `registro/chocolateria.md`.

## El negocio, y por qué no choca con uno real

**Estalo · Chocolatería e bombonería**, Rúa do Mármore Vello, 4 · 27700
Ribadeo (Lugo) · 982 00 00 00 · ola@estalo.example. *Estalo* es el chasquido
en gallego: el sonido de un chocolate bien templado al partirse.

- «Estalo» + chocolatería / bombonería / chocolate: **ningún negocio**.
- «Treboada» y «Lousa» también salieron libres, pero no hablaban del oficio.
- «Rúa do Mármore Vello» es inventada (el mármol es donde se templa).
- `schema.org` `Store` sin `aggregateRating` ni `review`; opinión marcada
  «de muestra»; sin registro sanitario ni premios; un bombón con alcohol lo
  dice en la ficha y en el aviso legal.

## Concepto, paleta, tipografía

- **«Templado»** (libre en el registro): brillo + chasquido + curva.
- **Paleta oscura cálida** (cacao, no grafito industrial) con una sección
  clara de crema para los bombones y **un solo acento turquesa**, el color
  clásico de la manteca de cacao pintada en las cáscaras. Contrastes con
  script: crema sobre cacao 15,41; turquesa sobre cacao 7,21; turquesa
  oscuro sobre crema 5,95. Alternativas coral (`#E0897B`/`#913A2F`) y oro
  (`#C09B49`/`#6E5200`) con el mismo contraste. Distinta de Salseiro (clara,
  framboesa) y de las tres oscuras industriales del registro.
- **Mona Sans** variable con eje de anchura (`wdth` 125 en titulares, que el
  cursor estrecha), **Instrument Serif** cursiva para los acentos, **Red Hat
  Mono** para cifras. Distinta de Salseiro (Bodoni Moda) y del registro.

## Movimiento protagonista

1. **Tableta en canvas 2D**: 15 onzas dibujadas una vez como sprite
   (biselado, marca grabada); el brillo es un sprite radial compuesto con
   `source-atop` que sigue al cursor con inercia; al pulsar, la onza salta
   con gravedad y giro y deja la grieta medio segundo. Se ladea con el
   scroll. **Sin bucle permanente**: pinta solo mientras algo se mueve.
2. **Curva anclada (pin + scrub)**: gráfico con eje lineal de verdad; el
   trazo se dibuja con un tween de GSAP sobre `strokeDashoffset` con
   `pathLength=1` y **`autoRound:false`**; el punto, la temperatura, los
   cristales (ninguno → IV y V → solo V → V fijados) y el brillo salen de la
   misma posición en el trazo; una onza de muestra pasa de mate con flor a
   brillante. Pasos que entran y salen con desplazamiento y sesgo, no fundido.
3. **Cortina «Clac»** (grieta curva, cada mitad por su lado, `expo.inOut`) y
   **transición «grieta»** scrubbeada en dos secciones.

Más: Lenis, char-reveal, pila sticky de cajas, cinta con velocidad ligada al
scroll, imán, cursor propio con «partir» sobre la tableta.

## Verificación (con números)

`scripts/verify.js` (el mismo arnés que Salseiro, adaptado): **90/90 en
verde**.

- Recorrido con rueda en 1440×900 y 390×844, consola y red limpias, sin
  desbordamiento ni marcadores.
- Cortina: fotogramas intermedios en `screenshots/cortina-1…5` (marca,
  grieta, se abre, **a medias**, entrega), de color chocolate con leche sobre
  fondo cacao; `display:none` en normal, sin GSAP y con movimiento reducido.
- Sin GSAP: página entera, curva sin anclar con sus cuatro pasos.
- Reducido: sin Lenis ni anclaje, pero la curva cambia de cifras por paso
  (45, 31, 17), partir una onza cambia la cuenta sin vuelo y el corte del
  bombón cambia.
- Cursor: nativo oculto tras el primer `pointermove` de ratón, «partir» sobre
  la tableta, nada en táctil; el clic parte una onza (15 → 14).
- Pila sticky: mismo alto medido en los cuatro `<li>`, mismo
  `margin-bottom` también el último, `::after`, cero fantasmas en pasos de
  90 px en escritorio y móvil.
- Menú móvil 100dvh × 100vw, mapa bajo clic, formulario, bombones.
- Curva: la temperatura pasa por 45, 27, 31 y 17; los cuatro pasos;
  `stroke-dashoffset` < 0,05 al final (el trazo completo).
- Mando: sobria retira molde y cajas y pone 12 + 4 barras; tres paletas con
  contraste medido; sin parpadeo al recargar.
- Portada a 360×640 y 375×667 sin solapes ni desbordamiento.
- `longtask` en frío: **2 en escritorio (96 y 81 ms), ninguna tras
  `document.fonts.ready`**; en móvil con CPU ×4, 5 (todas del arranque menos
  una). Igual sin canvas: el canvas no cuesta tareas largas.
- axe: **cero violaciones** en seis estados (`AUDITORIA.md`).

## Decisiones tomadas solo

1. **Hacer la segunda**: el encargo la pedía si sobraba más de una hora; la
   primera ya estaba excelente y empujada.
2. **Canvas 2D y no otro shader**: la heladería ya tiene WebGL; aquí el gesto
   es mecánico (partir), y un 2D con sprites cuesta casi cero, como mostró la
   medición.
3. **Utillaje reutilizado, esqueleto no**: cookies, mandos, menú, cursor,
   cinta, pila y horario vienen del mismo código que Salseiro; estructura,
   paleta, tipografía, cortina y protagonistas son otros.
4. **El logo sobre plato de cacao en la cortina**: es del mismo marrón que la
   cortina y desaparecía (cazado en la captura a 700 ms).
5. jsDelivr, Google Fonts, Pexels y Unsplash bloqueados en el entorno: mismo
   tratamiento que en la primera (las librerías se sirvieron desde npm con la
   misma versión solo para verificar; sin fotos).

## Lo flojo

- Hecha en ~40 minutos de reloj: el copy es correcto pero más corto que el de
  Salseiro, y el mapa dibujado es esquemático.
- La portada en móvil deja la tableta por debajo del primer pantallazo
  (el titular manda); se ve al primer gesto de scroll.
- Solo Chromium, sin lector de pantalla real, táctil emulado.
- Gallego de los nombres («Avelá», «Laranxa», «Xenxibre», «Augardente de
  herbas») sin revisar por un hablante.
