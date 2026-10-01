# Pegada · yoga e pilates — plantilla de demostración

> **Sitio de demostración. Pegada es un negocio ficticio; los datos,
> ilustraciones y opiniones son de muestra.** No existe ningún estudio con este
> nombre en Sanxenxo ni en la calle que figura en la web (Rúa do Cascallo, 9 es
> inventada). Todas las páginas llevan `noindex, nofollow`.

Plantilla de la biblioteca de negocios ficticios para el sector **estudio de
yoga y pilates**, registro visual **C — producto y textura**.

## Concepto: «Apoyos»

> Toda postura empieza por lo que toca el suelo.

Lo que de verdad se enseña en una clase de yoga o de pilates no es una forma
bonita: es **dónde apoyas y cuánto peso dejas en cada apoyo**. Manos y pies en el
perro boca abajo, cuatro puntos en cuadrupedia, uno solo en el árbol. El
profesor corrige apoyos; la esterilla los recibe.

Así que la web es **una esterilla que recuerda dónde la has pisado**: un material
blando (caucho natural sobre corcho) que se hunde donde presionas y recupera la
forma despacio, como la espuma de verdad. Y todo lo demás cuelga de ahí:

- el **hero** es esa superficie, en WebGL, y responde al cursor (o al dedo);
- la **secuencia anclada** monta una postura apoyo a apoyo y enseña el reparto
  de peso en cifras;
- el **cuadro de clases** marca la de hoy y la siguiente en vivo;
- los **tipos de clase** se explican por el material con el que se trabaja
  (esterilla, bloque de corcho, aro, muelle del reformer, manta);
- el **cursor** deja una pequeña huella al pulsar.

La respiración marca el tiempo: la superficie se hincha y se vacía en un ciclo
de 4 s de inhalación y 6 s de exhalación, el mismo que se usa en clase.

**Por qué no es el balneario.** «Grados» (As Caldeiras) trabaja la temperatura
y el color que tiñe la página; aquí no hay agua ni calor: hay **materia y
presión**. Paleta de corcho y caucho, no de piedra y cobre; tipografía ancha
que respira, no Cormorant.

**Por qué no es el tópico zen.** Ni loto, ni mandala, ni degradado lila, ni
piedras apiladas, ni promesas de «sanar». Corcho, caucho, lana y cifras.

## Qué hace esta mejor que las anteriores

Revisadas antes de diseñar las fichas de **As Caldeiras** (balneario),
**VINTE QUILOS** (gimnasio), **Ouzande** (abogacía, «Trinquete») y **Olería
Rañal** (cerámica, «Merma»):

1. **El hero es un material, no un fondo.** VINTE QUILOS lleva magnesio en
   suspensión y una barra; Trinquete un mecanismo que gira solo. Aquí el
   visitante **deforma** la superficie: una simulación de altura en GPU
   (ping-pong de texturas) con recuperación viscoelástica, iluminada en tiempo
   real con normales calculadas en el shader. Lo que hace el cursor se queda
   un rato, como en una esterilla de verdad. Y con el scroll se marcan solas
   las huellas de la primera postura.
2. **La secuencia anclada cuenta el oficio con datos, no con fotos.** Una
   figura articulada (esqueleto con longitudes de segmento fijas, ángulos
   interpolados) pasa por cinco posturas con scrub, y bajo ella la esterilla
   vista desde arriba enciende los apoyos con **el porcentaje de peso en cada
   uno**. Ninguna plantilla anterior usa cinemática: Ramalleira monta un ramo,
   RODADURA separa piezas.
3. **El cuadro de clases está vivo de verdad.** No solo marca el día: calcula
   la clase en curso y la siguiente con cuenta atrás, cambia sola al pasar la
   hora y **sigue funcionando sin GSAP y con movimiento reducido** (es
   contenido, no adorno). VINTE QUILOS tenía cuadro semanal, pero estático.
4. **Rendimiento medido desde el primer día**, no al final: `longtask` con
   `PerformanceObserver` en la propia página (se puede leer en
   `window.__longtasks`) y el bucle de WebGL se duerme cuando el hero sale de
   pantalla o la pestaña se oculta.
5. **Tipografía variable que respira**: el titular del hero cambia el eje de
   anchura (`wdth`) al ritmo del ciclo de respiración. La escala va de 0,8 rem a
   casi 20 vw.

## Paleta «corcho e caucho»

| Token | Valor | Uso |
|---|---|---|
| `--corcho` | `#C9A57E` | fondo principal (con grano de corcho procedural) |
| `--corcho-2` | `#B99268` | paneles sobre corcho |
| `--espuma` | `#F3ECE2` | superficies claras |
| `--caucho` | `#1D1A16` | tinta y secciones oscuras |
| `--caucho-2` | `#2A2520` | paneles oscuros |
| `--mar` | `#16475A` | acento de marca: la esterilla (superficie, botones) |
| `--mar-texto` | `#0F3A4A` | el acento cuando es texto sobre corcho |
| `--mar-claro` | `#8EC3D3` | el acento cuando es texto sobre caucho |
| `--coral` | `#E2683F` | «en vivo» (solo superficie, con texto caucho encima) |

Contrastes calculados con `scripts/contraste.js` antes de escribir el CSS: de
4,61:1 a 14,78:1, botones ≥ 8,47:1. Alternativas del control de paleta
(granate y musgo) derivadas rotando el matiz del acento con la misma
luminosidad; tinta, corcho y espuma no cambian, ni el logo.

## Tipografía

- **Roboto Serif** variable (ejes `wdth` 50–150, `wght`, `opsz`) para titulares:
  ancha, blanda, con mucho tacto en tamaños grandes, y con un eje de anchura
  que permite que el titular respire.
- **Albert Sans** para el texto.
- **Red Hat Mono** para horas, cifras del cuadro y porcentajes de apoyo.

Ninguna de las tres sale en la biblioteca.
