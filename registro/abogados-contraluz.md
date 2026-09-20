# Abogacía penal — «Contraluz» (2ª plantilla de la excepción del sector, 2026-09-20)

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Abogacía penal (defensa criminal, despacho individual) | Ferradás Vilar · Defensa Penal (Santiago de Compostela) | «Contraluz» — en un procedimiento penal nadie ve el asunto entero: se ve lo que alguien decide iluminar | negro `#060505` / panel `#0D0B09` / tarjeta `#14110E` / ficha `#0A0807` / línea `#221D18` / acero `#3A322A` / humo `#A79C8E` / hueso `#F3EEE5` + **un solo acento**: ámbar de lámpara `#E8A33A` (y `#FFD79A` para foco y hover) | Bodoni Moda (900) + Plus Jakarta Sans + Spline Sans Mono | el **foco**: una capa de luz fija que sigue al cursor (y al scroll si no hay ratón) y decide qué está iluminado y qué queda en penumbra, con la portada a contraluz —puerta entreabierta, silueta en el umbral y polvo en el haz— como escena de partida | [alvarotaiagu/plantilla-abogados-contraluz-web](https://github.com/alvarotaiagu/plantilla-abogados-contraluz-web) | [demo](https://alvarotaiagu.github.io/plantilla-abogados-contraluz-web/) |

**Segunda plantilla de la excepción de abogacía** abierta en `SECTORES.md` el
2026-09-20 (la primera fue «Pórtico», despacho mercantilista en Vigo). La
excepción se amplía de 1 a 2 plantillas en la misma fila, sin tocar ninguna
otra: **defensa penal es un encargo distinto del mercantil**, con otro cliente,
otra urgencia y otro tono, y un despacho de empresa no sirve de escaparate para
un penalista ni al revés.

**Porqué del concepto:** las tres webs reales del sector (Blanco Regueiro
«Titulares», Castro Pombo «Escritura», MJ Ramos Castro «Cláusula») comparten
metáfora de **papel**, y «Pórtico» es **arquitectónica**. Ninguna vale para un
penalista individual, que no vende solemnidad sino amparo a una hora mala.
«Contraluz» es el dramatismo de sala de interrogatorio puesto del revés: el
foco no está encima del cliente, está enseñándole el camino. Modo oscuro
permanente, negro casi puro y **un único acento** (ámbar de lámpara, elegido
frente al rojo de alerta precisamente para no chocar con el rojo de prensa de
«Titulares»).

Comprobado contra `REGISTRO.md` y las fichas de `registro/` antes de fijarlo:
«Contraluz» está libre. Ojo con dos vecinos: **«Expediente»** (asesoría, Lombo
Consultores) y **«Sombra»** (fotovoltaica, GNOMON) ya estaban cogidos, así que
aquí ni el expediente ni la sombra dan nombre a nada, aunque el encargo
sugería «expediente que se ilumina» como imagen de partida.

**Estructura de secciones** (ocho, distinta en orden y forma de las de
«Pórtico», que iba portón → fachada → escalinata → friso → directorio → alas →
cifras → testimonios → contacto): portada a contraluz → cinta con los nueve
derechos de la persona detenida → las primeras horas (llamada, comisaría,
juzgado de guardia, vista) → los cinco asuntos que lleva → quién te defiende →
honorarios → preguntas → contacto con guardia 24 h. **Sin sección de
testimonios y sin cifras de éxito**, a propósito: en penal, quien pasa por un
despacho no tiene por qué aparecer citado en ninguna parte. Esa ausencia se
explica en la propia página y en el README.

**Obra gráfica propia:** todo SVG dibujado para este repo — la puerta
entreabierta con su hoja y su marco, la silueta a contraluz (con el filo de
luz en degradado `userSpaceOnUse`, no sobre el bbox del trazo), el retrato de
la abogada como silueta sin rasgos, las cuatro escenas del procedimiento, los
cinco iconos de materias, el logotipo (cono de luz con su bombilla), el
favicon y el `og.png` de 1200×630. **Cero fotografía**: no hay generador de
imágenes y un retrato de archivo le pondría la cara de alguien real a una
persona que no existe. Por eso este repo no lleva `CREDITOS.md`: no hay nada
que acreditar.

**Recursos de movimiento** (PLIEGO §2, mínimo 5, aquí 9): Lenis como único
motor (`lerp` 0,18 por el scrub horizontal); char-reveal palabra a palabra con
`IntersectionObserver`, no con `ScrollTrigger({once:true})`; pila de fichas
sticky con el `<li>` como elemento pegajoso; marquesina de derechos en JS puro
con la velocidad ligada a la rueda; botones magnéticos; galería anclada con
scrub horizontal para las cuatro fases del procedimiento; cursor personalizado
(un halo de luz que crece sobre los enlaces); canvas de polvo en suspensión
dentro del haz; y el **foco** de toda la página, que es el gesto propio del
concepto. La cortina —filamento que se enciende, parpadea dos veces y abre el
haz, cerrándose después **sobre el punto de luz** con `clip-path: circle()`—
no cuenta para el mínimo porque es obligatoria.

**Accesibilidad, con el clavo del pliego bien mirado:** un sitio oscuro de
arriba abajo invita a apagar texto con `opacity`, y aquí no se apaga ninguno.
La luz cambia fondos, filetes y siluetas; el texto está siempre a su color. Los
17 pares se calcularon con `scripts/contraste.js` antes de cerrar el CSS: el
marcador de los campos salía a 4,41:1 y subió a 5,15:1; el resto va de 6,98:1 a
17,61:1, incluido el ámbar (9,43:1 sobre negro), que por eso puede usarse como
texto y no solo como superficie. Foco visible, landmarks, `aria-expanded`
sincronizado, y la pista horizontal solo recibe `tabindex="0"` cuando de verdad
desborda (es decir, cuando no está anclada).

**Robustez:** doble bandera (`js-motion` bloqueante en el `<head>`,
`gsap-listo` solo si las librerías existen); el estado oculto del char-reveal
lo pone GSAP y no el CSS, así que sin CDN el titular sale visible; la cortina
se retira por tres vías (timeline, vía sin GSAP y red de seguridad de 4,6 s);
`overflow-x: clip` y nunca `overflow: clip`; y el anclaje horizontal solo se
activa si cabe (`innerHeight >= 700`), degradando a carrusel con `scroll-snap`.

**Tres fallos reales cazados mirando las capturas, no el código:**
1. **La ficha de materia activa no se marcaba nunca en móvil.** Con
   `IntersectionObserver` y `threshold: .5`, una tarjeta más alta que la
   ventana no llega a cumplir el umbral. Se cambió por «la ficha cuyo centro
   está más cerca del centro de la pantalla», que además es contenido y por
   tanto sigue funcionando con `prefers-reduced-motion`.
2. **El hero perdía 15 fps medidos** (46 en vez de 60). No era el canvas: era
   que el canvas llevaba `mix-blend-mode: screen` y debajo de la capa del foco
   —que también mezcla, a pantalla completa— componer las dos mezclas cada
   fotograma sale caro. Aislado a base de quitar una capa cada vez (canvas
   solo: 61; foco solo: 60; las dos: 46). Quitada la mezcla del canvas: 61.
3. **`.escena > p` casaba también con el número de la escena**, que es un
   `<p class="escena-num">`, y le robaba su celda del grid: el «01» salía
   impreso encima del primer renglón del texto. Cada trozo lleva ahora su
   clase.

Y una decisión de composición que salió de una captura: en móvil el titular
caía encima del haz y la puerta se quedaba fuera del recorte de `slice`. Por
debajo de 760 px el `viewBox` se reencuadra sobre el umbral y la escena pasa a
ser una banda superior con el texto debajo, sobre negro.

**Rendimiento:** 61 fps en el hero (escritorio y móvil) y **una sola tarea
larga de 98 ms al cargar**, medida con `PerformanceObserver` y con una tarea
de control lanzada por `setTimeout` para comprobar que el observador está vivo
(un `page.evaluate` no cuenta como longtask de la página y daría un cero
falso). Es de las pocas plantillas de la biblioteca con `longtask` medido de
verdad.

**Datos ficticios:** Ferradás Vilar · Defensa Penal, de la abogada Antía
Ferradás Vilar · Rúa do Ameneiral, 9, 2º · 15704 Santiago de Compostela (A
Coruña) · 981 00 00 00 (despacho) y 600 00 00 00 (guardia 24 h) ·
contacto@ferradasvilar.example (dominio `.example`, reservado por la IANA) ·
horario L-J 9–14 y 16–19, V 9–14. Honorarios de muestra en seis filas (60 €
primera consulta, 350 € asistencia al detenido, 600 € juicio rápido, 1.800 €
procedimiento abreviado, 900 € recurso de apelación, 450 € ejecución), con
aviso de que no son orientativos de ningún mercado real. Nombre comprobado por
búsqueda web antes de fijarlo: no aparece ningún despacho ni abogada real con
ese nombre. Santiago de Compostela no lo usaba ninguna otra plantilla de la
biblioteca.

**Línea roja del sector (PLIEGO §1):** repasada al cerrar. Sin
`aggregateRating` ni `review` en el `schema.org` (`LegalService` a secas), sin
valoraciones ni premios, **sin número de colegiación inventado** (el aviso
legal dice expresamente que ahí va el real y que aquí no se inventa), sin
testimonios, sello de demostración en el pie, en el README y en un comentario
HTML arriba del `index.html`, y `noindex, nofollow` en las tres páginas.

**Verificación:** Playwright (Chromium) en 1440×900 y 390×844 (`isMobile` y
`hasTouch` reales), recorrido con `mouse.wheel` y 1,5 s de espera por tramo,
fotogramas intermedios de la cortina, pasada con GSAP y Lenis bloqueados
(`route.abort()` sobre jsDelivr), pasada con `prefers-reduced-motion: reduce`,
y comprobación por código de cookies, menú móvil, mapa bajo clic, formulario,
anchura real del documento (`scrollWidth == innerWidth` en los dos tamaños) y
ausencia de marcadores pendientes. Ejecutada contra un servidor local y
**repetida entera contra GitHub Pages**, con el mismo resultado limpio: cero
errores de consola salvo los tres provocados a propósito al tumbar el CDN. 31
capturas en `screenshots/`.

**Pendiente de esta plantilla:** sin auditoría automática de accesibilidad
(axe/Lighthouse) —el contraste está calculado con script, no auditado—, solo
probada en Chromium y sin lector de pantalla real.
