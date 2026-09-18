# Lavandería

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Lavandería | Escuma | «Etiqueta» | blanco verdoso / tinta verde oscura / verde jabón / amarillo de autoservicio | Schibsted Grotesk + Figtree + Fira Mono | el descifrador de etiquetas: doce símbolos de cuidado dibujados que son a la vez el sistema visual y la herramienta útil de la página | [alvarotaiagu/plantilla-lavanderia-web](https://github.com/alvarotaiagu/plantilla-lavanderia-web) | [demo](https://alvarotaiagu.github.io/plantilla-lavanderia-web/) |

**Porqué del concepto:** toda la información que una lavandería necesita ya está escrita
en la etiqueta que pica en el cuello; el problema es que nadie sabe leerla. La etiqueta
es aquí el sistema visual entero —el hero **es** una etiqueta cosida, con sus pespuntes—
y la primera sección es un descifrador de verdad: pulsas el símbolo que tienes delante y
te dice qué significa, sin tecnicismos.

**Recursos de movimiento:** Lenis, el descifrador (protagonista, funciona también sin
GSAP), titulares letra a letra, entradas escalonadas, botones magnéticos, cursor en
forma de burbuja, fecha de entrega y horario en vivo.

**Rendimiento medido:** longtask — 1 tarea larga de 78 ms al arrancar, 0 recorriendo.

**Contenido vivo:** el «si lo dejas ahora…» calcula la entrega contando 24 horas desde
este momento y esperando al primer tramo de mostrador; más el estado del autoservicio.

**Obra gráfica:** los doce símbolos se generan por script desde cinco formas base
(cubeta, triángulo, cuadrado, plancha, círculo) con sus modificadores (grados, puntos,
mano, aspa). El mismo script escribe el HTML del descifrador con su texto, así que
dibujo y explicación no se desincronizan. Cero fotografías.

**Datos ficticios:** Rúa do Pozo, 6 · Vilagarcía de Arousa · 986 00 00 73 ·
hola@escuma.example. Sin `aggregateRating`, sin testimonios, con `noindex, nofollow` y
sello de demo en footer, README y comentario HTML.

**Cortina de entrada (añadida el 2026-09-19):** «Etiqueta»: salen los cuatro símbolos de cuidado uno a uno y el agua se va por abajo; el borde de arriba de la cortina es una onda. Encadenada, con `expo.inOut` y borde curvo, y el hero no entra hasta que la cortina va por la mitad (constante `ESPERA` de `main.js`). **Retirada garantizada**: se quita al terminar, se quita sin GSAP, se quita con movimiento reducido y hay un `setTimeout` de 5 s de red de seguridad; el `display` va en `.cortina:not([hidden])`, nunca en la clase a secas —si fuera a secas ganaría al atributo `hidden` y la página quedaría tapada para siempre.
