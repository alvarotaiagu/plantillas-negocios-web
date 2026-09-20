# Asesoría fiscal/laboral/contable/sociedades — concepto «Expediente»

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Asesoría fiscal, laboral, contable y de sociedades | Lombo Consultores (Cambre, A Coruña) | «Expediente» — la carpeta de despacho con una pestaña de color por área; el gesto que firma la web es abrir una pestaña, no sumar ni sellar | manila `#E8DFC8` / crema `#F4EEE0` / papel `#FBF8F1` / tinta `#2B241C` + fiscal verde botella `#33473C`, laboral azul grisáceo `#5C6B72`, contable terracota `#9C5A42`, sociedades ciruela `#5C3A4E` | Special Elite (máquina de escribir, etiquetas y sello) + Source Serif 4 (cuerpo y titulares) | expediente anclado con **scrub horizontal**: el scroll pasa las cuatro páginas del expediente como si fueran hojas, con la pestaña activa adelantada y las otras tres recedidas | `C:\Users\alvar\Desktop\WEBS NEGOCIOS\plantilla-asesoria-expediente-web` (repo local, `git init`, sin remoto) | demo: pendiente de publicar (no autorizado aún) |

**Cuarta plantilla ficticia de la excepción abierta 2026-09-18** en el
sector asesoría (junto a «Sello», «Casillas» y «Cinta sumadora», construidas
en paralelo por otros tres agentes sin coordinación entre sí). No repite
ninguno de esos tres conceptos ni los de la biblioteca general.

**El nombre se cambió después de buscarlo.** El candidato de partida,
"Souto Consultores", se descartó al encontrar "Souto Asesores"
(soutoasesores.com) y "Asesoría Morán y Souto", ambas gestorías reales en
A Coruña — demasiado cerca del mismo apellido, sector y provincia. Se
comprobaron además "Lombo Consultores"/"Lombo Asesores" y "Pestana
Consultores" (este último descartado por colisión real: "Pestaña Asesores
SL", Fuenlabrada) antes de fijar **Lombo**, que además encaja con el
concepto: el lomo es la pieza que sujeta las pestañas de una carpeta.

**Estructura de secciones** (5, deliberadamente más grandes y menos
numerosas que las otras tres del lote, porque el contenido vive dentro del
cambio de pestaña): 1) portada con la carpeta ya abierta mostrando las
cuatro pestañas, 2) navegación por pestañas — el expediente, con servicios
y trámite clave fusionados dentro de cada página, 3) confianza como
documento aparte con clip metálico dibujado en SVG, 4) equipo — dos fichas
de personal, 5) contacto + pie como la última "pestaña", con WhatsApp
flotante y sello legal.

**Datos ficticios completos, sin `[PENDIENTE]`:** dirección genérica en
Cambre (Rúa do Mercado 9, 1º), teléfono de muestra 981 00 00 47 (prefijo
gallego real + número claramente de ejemplo), dos personas de equipo con
bio completa, tres testimonios con nombre de pila (nunca atribuidos a
Google/TripAdvisor) y una valoración interna (4,8/5, encuesta propia
declarada como tal). `schema.org` tipo `AccountingService`, sin
`aggregateRating` ni `review`. `noindex, nofollow` y sello de demostración
en el pie, el README y un comentario HTML sobre `index.html`.

**Tres trampas reales cazadas en la verificación con Playwright** (no solo
leyendo el código):

1. El `xPercent` del scrub horizontal se calculó al principio como
   `-100 * (n-1)`, asumiendo que el porcentaje era relativo al ancho de una
   sola página; GSAP lo aplica sobre el ancho propio de la tira completa
   (400 %), así que con n=4 el expediente quedaba **en blanco** durante
   medio recorrido del scrub. Fórmula correcta: `-100 * (n-1) / n`.
2. La cabecera sticky (mismo `top:0` que el pin) tapaba las etiquetas de
   las cuatro pestañas físicas durante el anclaje. Se ancla ahora con
   `start: "top " + altoCabecera`, medido en tiempo de ejecución.
3. La trampa de z-index que avisa el pliego §6, de verdad: `.nav` del menú
   móvil llevaba z-index y `.hamburguesa` no, así que el menú abría pero no
   cerraba (el propio panel tapaba el botón). Cazado con un clic de
   Playwright que agotaba el timeout.

También se corrigió que el contenedor `.cortina` pintaba su propio fondo
además de las dos tapas, así que aunque las tapas giraran hacia fuera la
apertura no se veía nunca (el fondo del contenedor seguía tapando el hero).

**Verificación §7:** Playwright/Chromium real en 1440×900 y 390×844,
recorrida con `mouse.wheel` (nunca `window.scrollTo`, que con Lenis activo
no dispara los ScrollTrigger). Capturas de cada sección en `screenshots/`
(pasada normal escritorio y móvil, sin GSAP con `route.abort` del CDN,
`prefers-reduced-motion: reduce`, botones de cookies/menú móvil/mapa, la
cortina de entrada en tres fotogramas, 404 y aviso legal). Consola limpia y
cero peticiones fallidas en las tres pasadas. Special Elite y Source
Serif 4 verificadas con una captura ampliada de €, ñ, tildes y « »
(`screenshots/fuente-glifos.png`): ambas completas.
