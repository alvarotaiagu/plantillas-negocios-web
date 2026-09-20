# Asesoría fiscal — «Sello» (2ª tanda, excepción del sector)

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Asesoría fiscal/laboral/contable | Bértola Asesores (Betanzos, A Coruña) | «Sello» — el trámite como aprobación oficial estampada | papel crudo `#F2EDE1` / panel `#EAE3D3` / crema `#F8F4EA` / tinta azul-negra `#1F2A24` / rojo de sello desaturado `#A8503E` | Fraunces + Space Mono | sello de tampón (grano vía filtro SVG `feTurbulence`) que impacta cada sección al resolverse — hero, tarjetas de servicio, filas cerradas del calendario, sello de confianza | `C:\Users\alvar\Desktop\WEBS NEGOCIOS\plantilla-asesoria-sello-web` (repo local, `git init`, sin remoto) | pendiente de publicar (no autorizado aún) |

**Uno de los 4 agentes en paralelo** autorizados en `SECTORES.md`
(2026-09-18) para el sector asesoría fiscal, junto con los conceptos
Casillas, Cinta sumadora y Expediente. Sin coordinación entre agentes.

**Porqué del concepto:** una gestoría vende que el papeleo quede cerrado,
no promesas. El sello estampa ese instante de cierre en cada sección: el
hero («AL DÍA»), cada tarjeta de servicio («Presentado»), cada fila
cerrada del calendario fiscal («Cerrado») y el sello de confianza
(«Garantía»). No hay columnas que cuadran ni cuenta atrás — eso queda para
otra de las plantillas del lote.

**Colisión detectada y resuelta:** al revisar `registro/` antes de
construir se encontró que `plantilla-viajes-web` (Viajes Arroaz, concepto
«Sellos») ya usa el motivo del tampón, con una paleta muy próxima
(papel/tinta/rojo de tampón). Como «Sello» venía asignado explícitamente
en `SECTORES.md` para este lote de 4, se mantuvo el concepto pero se
diferenció la ejecución a propósito: aquí es **un único sello oficial y
burocrático** (estilo Hacienda/notaría — «AL DÍA», «CERRADO», «GARANTÍA»),
no una colección de sellos de viaje decorativos de formas distintas; y los
hexadecimales de rojo/tinta se separaron de los usados en viajes
(`#A8503E`/`#1F2A24` aquí frente a `#A63D2F`/`#241F1C` allí). Queda
anotado para quien revise la biblioteca completa, por si se prefiere
diferenciar más en una revisión posterior.

**Calendario fiscal:** las fechas límite (20 de cada trimestre, 25 de
julio para Sociedades, 30/31 de enero y 28 de febrero para los resúmenes
anuales) están fijas por ser reglas estables de la AEAT; el estado
«cerrado»/«plazo abierto» de cada fila se calcula en JS contra
`new Date()`, no contra una fecha inventada. La campaña de Renta se
muestra como ventana informativa (abril-junio) sin día exacto, porque esa
fecha sí cambia cada año y no se ha inventado ninguna.

**Dos bugs reales cazados en la verificación (PLIEGO §7):**

1. `.hero .container` se declaró `display:grid` sin `grid-template-columns`:
   colapsaba a una columna y la escena del sello se apilaba 1316 px por
   debajo del primer pliegue en 1440×900 — invisible sin scrollear. Se
   detectó capturando el elemento del sello por separado y mirando su
   `getBoundingClientRect()`, no la captura de pantalla completa (que, al
   no llegar hasta ahí, no lo delataba). Corregido con
   `grid-template-columns:1.05fr .95fr` desde 900px.
2. El icono de cerrar del menú móvil (tres `span` en `display:grid;
   gap:5px`) no llevaba las tres barras al mismo centro al rotar, así que
   en vez de una X se veía un «▷». Corregido con `position:absolute` a
   `top:0/7px/14px` dentro de un contenedor de tamaño fijo.

**Verificación:** Playwright en 1440×900 y 390×844 (móvil con
`isMobile`/`hasTouch` reales), recorrido con `mouse.wheel` y ~1,6 s de
espera por tramo, consola limpia (0 errores/0 peticiones fallidas fuera de
la pasada que bloquea el CDN a propósito), pasada con GSAP bloqueado
(`route.abort()`) y pasada con `prefers-reduced-motion: reduce` — en
ambas, el contenido se ve completo y el sello/los titulares aparecen ya en
su posición final. Cookies, menú móvil y mapa bajo clic probados por
código, no solo a ojo. Sin `[PENDIENTE]`, `TODO` ni *lorem ipsum* en el
texto renderizado.

**Robustez del sello:** el estado «sin estampar» de cada sello y del
char-reveal de titulares vive bajo dos banderas separadas —
`html.js-motion` (la pone un script bloqueante mínimo en el `<head>`,
según `prefers-reduced-motion`, sin depender de que GSAP cargue) y
`html.gsap-listo` (la pone `main.js` solo si `window.gsap` existe de
verdad). Sin las dos a la vez, todo se ve ya en su posición final: sin
JS, con el CDN de GSAP caído o con movimiento reducido no hay ningún
estado vacío a medias. El propio sello anima con transición CSS +
`IntersectionObserver`, no con un tween de GSAP.

**Datos ficticios:** Bértola Asesores, S.L. · Rúa do Pombal, 9, 1º dereita
· 15300 Betanzos (A Coruña) · 981 00 00 45 (despacho) / 611 00 00 45
(WhatsApp) · hola@bertolaasesores.example · CIF B15000000. Nombre
comprobado en la web antes de fijarlo: no existe ninguna gestoría real con
ese nombre; se descartó un nombre genérico tipo «Asesores Betanzos» porque
sí existe una empresa real con ese nombre (inactiva) en el mismo Betanzos
y el mismo sector. «Bértola» es el nombre de una parroquia real del propio
concello, usado como recurso de arraigo local sin ser el nombre de un
negocio existente. Cuatro testimonios ficticios con nombre de pila,
ninguno atribuido a Google/TripAdvisor ni con `aggregateRating` en el
`schema.org`. Equipo de dos personas con ilustración plana (no fotografía).
Sin ningún `[PENDIENTE]`: todos los datos están completos, de muestra.

**Pendiente de esta plantilla** (igual que el resto de la biblioteca):
sin medir `longtask` con `PerformanceObserver` (no lleva canvas/WebGL, el
riesgo es bajo pero no está medido); sin auditoría automática de
contraste (axe/Lighthouse) — el contraste se calculó a mano con un script
de razón WCAG antes de escribir el CSS; solo probado en Chromium.

**Capturas:** 19 en `screenshots/` (escritorio y móvil, portada, cada
sección, cookies, menú móvil, mapa cargado, pasada sin GSAP y pasada con
movimiento reducido).
