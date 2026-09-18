# Panadería / obrador

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Panadería / obrador | Milmigas | «La miga» | crema de harina / tinta marrón / rojo hornada / amarillo maíz | Bricolage Grotesque + Instrument Sans + Martian Mono | canvas de fermentación en el hero (burbujas que nacen, crecen y suben) + galería anclada de seis cortes de pan | [alvarotaiagu/plantilla-panaderia-web](https://github.com/alvarotaiagu/plantilla-panaderia-web) | [demo](https://alvarotaiagu.github.io/plantilla-panaderia-web/) |

**Porqué del concepto:** una panadería se juzga cuando el pan se parte. La miga
—los alvéolos, su tamaño, su irregularidad— es la prueba de todo lo anterior, así
que se usa como sistema visual completo: el hero es la fermentación vista por
dentro, el símbolo de marca es un corte de pan, y la sección protagonista es una
galería de seis panes en sección transversal dibujados en SVG.

**Recursos de movimiento:** Lenis, canvas de fermentación, char-reveal, marquesina
con velocidad ligada al scroll, galería anclada con scrub horizontal, sticky-stack
de cinco pasos, botones magnéticos, cursor contextual y contadores.

**Datos ficticios:** Rúa da Fornalla, 7 · A Coruña · 981 00 00 12 ·
hola@milmigas.example. Sin `aggregateRating`, con `noindex, nofollow` y sello de
demo en footer, README y comentario HTML.

**Cortina de entrada (añadida el 2026-09-19):** «Greña»: la marca sube como la masa, se le da el corte encima y el pan se abre en dos, cada mitad hacia un lado con su borde curvo de hogaza. Encadenada, con `expo.inOut` y borde curvo, y el hero no entra hasta que la cortina va por la mitad (constante `ESPERA` de `main.js`). **Retirada garantizada**: se quita al terminar, se quita sin GSAP, se quita con movimiento reducido y hay un `setTimeout` de 5 s de red de seguridad; el `display` va en `.cortina:not([hidden])`, nunca en la clase a secas —si fuera a secas ganaría al atributo `hidden` y la página quedaría tapada para siempre.

Aparte: a 1440×900 el reloj de la próxima hornada, absoluto abajo a la izquierda, caía justo encima del segundo botón del hero —fallo que ya estaba en la demo publicada. Arreglado dándole hueco al pie del hero.
