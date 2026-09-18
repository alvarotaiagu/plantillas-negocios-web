# Óptica

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Óptica | Óptica Sextante | «Optotipo» | blanco clínico / nube / tinta azulada / azul eléctrico + ámbar | Outfit + IBM Plex Sans + IBM Plex Mono | la carta de optotipos que se lee sola, con la regleta del examinador saltando de fila, y el enfoque (`blur` → nítido) como transición de todo lo que entra | [alvarotaiagu/plantilla-optica-web](https://github.com/alvarotaiagu/plantilla-optica-web) | [demo](https://alvarotaiagu.github.io/plantilla-optica-web/) |

**Porqué del concepto:** la carta de letras de la pared es el objeto más reconocible de
una óptica y, además, una rejilla tipográfica perfecta: filas que menguan, escala de
agudeza al margen y una regleta que señala la línea que toca. El mensaje del negocio
está escrito *en* esa carta, de la fila más grande a la más pequeña. Y el desenfoque,
que es el estado previo a ver bien, se usa dos veces: como transición de entrada de los
titulares y como herramienta en el simulador de dioptrías.

**Recursos de movimiento:** Lenis, carta de optotipos animada con regleta (protagonista),
titulares que se enfocan, catálogo filtrable con entrada animada, simulador de
desenfoque manejado por el visitante, botones magnéticos, cursor en forma de lente,
contadores y horario en vivo.

**Aviso de contenido cumplido:** ni un diagnóstico ni una promesa médica. Hay una
sección entera titulada «Lo que no hacemos» que deja claro que una óptica no es una
consulta médica y que se deriva al oftalmólogo; el simulador avisa de que nadie se
gradúa la vista con una pantalla; y no se inventa ningún número de colegiado.

**Datos ficticios:** Rúa Nova do Faro, 14 · Pontevedra · 986 00 00 21 ·
hola@opticasextante.example. Ocho monturas dibujadas en SVG (no reproducen ninguna marca
real) y dos fotos de Pexels sin personas identificables. Sin `aggregateRating`, con
`noindex, nofollow` y sello de demo en footer, README y comentario HTML.

**Cortina de entrada (añadida el 2026-09-19):** «Optotipo»: la letra E entra desenfocada, se enfoca, y entonces se abre la pupila —un círculo que crece desde el centro. El círculo es un `box-shadow` de 110vmax al que se le anima el **tamaño**: con `transform: scale` la sombra escalaría con él y al principio dejaría de cubrir. Encadenada, con `expo.inOut` y borde curvo, y el hero no entra hasta que la cortina va por la mitad (constante `ESPERA` de `main.js`). **Retirada garantizada**: se quita al terminar, se quita sin GSAP, se quita con movimiento reducido y hay un `setTimeout` de 5 s de red de seguridad; el `display` va en `.cortina:not([hidden])`, nunca en la clase a secas —si fuera a secas ganaría al atributo `hidden` y la página quedaría tapada para siempre.
