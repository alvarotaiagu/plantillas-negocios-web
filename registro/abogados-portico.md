# Abogacía — «Pórtico» (excepción del sector, 2026-09-20)

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Abogacía (mercantil, societario, gran empresa) | Valladares Mendoza Abogados (Vigo) | «Pórtico» — el edificio institucional que hay que atravesar antes de llegar al asunto | piedra `#EDE7D8` / panel `#E3DBC6` / hueso `#F6F2E6` / tinta `#241F18` / fachada `#171310` + bronce `#6B4E22`/`#C79A52` + pátina verdín `#3C5B52`/`#8FBBAC` | Cinzel + Piazzolla + JetBrains Mono | columnata SVG con paralaje de scroll (avanza y se separa mientras el nombre se talla en el arquitrabe) + galería anclada horizontal de las áreas de práctica | [alvarotaiagu/plantilla-abogados-portico-web](https://github.com/alvarotaiagu/plantilla-abogados-portico-web) | [demo](https://alvarotaiagu.github.io/plantilla-abogados-portico-web/) |

**Excepción de sector abierta 2026-09-20**, mismo motivo que la excepción de
asesoría fiscal del 2026-09-18: la abogacía ya ha dado tres clientes reales
en la carpeta (Blanco Regueiro, Castro Pombo, MJ Ramos Castro) y conviene
tener un escaparate de muestra propio del sector para captar más. Añadida a
`SECTORES.md`, fila «Abogacía», solo esa fila.

**Porqué del concepto:** las tres plantillas reales del sector comparten
metáfora de papel/documento — una web que «se subraya» (Blanco Regueiro,
«Titulares»), una maqueta de prensa en blanco y negro (Castro Pombo,
«Escritura»), un pergamino notarial con rotulador que se traza (MJ Ramos
Castro, «Cláusula»). El encargo pedía a propósito un registro mecánicamente
distinto: nada de folios, nada de trazo de rotulador, nada de maquetación de
prensa. Un despacho mercantilista de gran empresa en Vigo (la plaza de
negocio más grande de Galicia, no repetida en ninguna otra plantilla del
sector) se presta a la metáfora contraria: el edificio institucional. Un
**pórtico** es la columnata de entrada de ese tipo de edificio —juzgados,
capitolios, bancos—, la fachada que hay que atravesar antes de llegar al
asunto. Ese recorrido de fuera hacia dentro ordena las diez secciones de la
web: portón → fachada con paralaje → escalinata del método → friso de
máximas latinas → directorio de bronce del vestíbulo → alas del edificio
(áreas de práctica) → cifras grabadas en piedra → testimonios → contacto.

Concepto comprobado contra la lista del PLIEGO §3 y contra `registro/*.md` y
`REGISTRO.md` antes de fijarlo: libre, no repetido.

**Obra gráfica propia:** toda la fachada (columnas, capiteles, frontón,
arquitrabe, patio) es SVG dibujado a mano para este repo, igual que el
emblema de marca y los cuatro iconos de las áreas de práctica. Sin
fotografía de archivo en toda la plantilla: el equipo (6 personas) se
presenta como un panel de bronce grabado con nombre, cargo y área — nunca un
retrato inventado de alguien que no existe, siguiendo la norma del PLIEGO
para negocios ficticios que necesitan mostrar personas.

**Recursos de movimiento** (PLIEGO §2, mínimo 5, aquí 8 + el paralaje del
hero): Lenis como único motor de scroll (`lerp` subido a 0,18 por el scrub
horizontal, trampa conocida del PLIEGO sobre el retardo de Lenis en scrub
perpendicular); char-reveal palabra a palabra en la inscripción del
arquitrabe y en todos los `h2`, con `IntersectionObserver` en vez de
`ScrollTrigger({once:true})`; marquee del friso con velocidad ligada al
scroll, escrito en JS puro sin depender de GSAP; galería anclada con scroll
horizontal scrubbeado para las cuatro áreas de práctica («Alas»), degradada
a carrusel manual con `scroll-snap` si GSAP falla; botones/enlaces
magnéticos; cursor personalizado contextual; contadores de las cifras
grabadas en piedra (JS puro, no depende de GSAP); máscara `clip-path` que
«graba» cada placa del directorio al entrar en viewport. El hero en sí añade
un noveno recurso no listado como obligatorio: el paralaje de la columnata
(`scrollTrigger scrub` sobre `position: sticky`), gesto central del
concepto y explícitamente distinto del canvas/shader orgánico de otras
plantillas.

**Robustez:** doble bandera `html.js-motion` (bloqueante, según
`prefers-reduced-motion`, sin depender de ningún CDN) y `html.gsap-listo`
(la pone `main.js` solo si `window.gsap` y `window.ScrollTrigger` existen).
El char-reveal no depende de CSS en absoluto para su estado oculto — lo pone
y lo quita el propio GSAP (`gsap.set`/`gsap.to`), así que si el CDN falla el
texto sale directamente visible. La cortina lleva una red de seguridad
`setTimeout` de 4,2 s además de la vía normal y la vía sin GSAP.

**Bug real cazado y corregido antes de publicar:** el `<svg
class="defs-compartidas">` que solo contenía símbolos reutilizables para
`<use>` se renderizaba con su tamaño por defecto del navegador (300×150) dos
veces en el flujo del documento (no tenía ningún CSS que lo anulara),
empujando `<main>` unos 157px hacia abajo. En escritorio pasaba
desapercibido; en 390px de ancho eso bastaba para sacar la columnata entera
del hero fuera del viewport inicial (el `getBoundingClientRect()` de la
columnata daba `bottom: 962` con un viewport de 844px de alto). Corregido
con el patrón estándar de sprite SVG oculto
(`position:absolute;width:0;height:0;overflow:hidden`), que no rompe las
referencias `<use>`. Se aprovechó el mismo diagnóstico para acortar la
columnata en móvil, cuyo `viewBox` panorámico (1400×320) se renderiza
diminuto bajo `preserveAspectRatio="meet"` en una pantalla estrecha.

**Accesibilidad:** contraste calculado con `scripts/contraste.js` (WCAG,
luminancia relativa) antes de cerrar el CSS, no a ojo — todos los pares de
texto normal llegan a AA; el único par por debajo de 4,5:1 es el bronce
decorativo (`--bronce`) usado como superficie grande, nunca como fondo de
botón con texto (para eso se usa `--bronce-texto`, 6,2–6,9:1). Foco visible,
landmarks, `aria-expanded`/`aria-hidden` sincronizados en el menú móvil, y
la galería horizontal de «Alas» solo lleva `tabindex="0"` cuando de verdad
desborda (recalculado en `resize`). Con `prefers-reduced-motion: reduce` la
cortina desaparece al instante y las cuatro cifras grabadas siguen llegando
a su valor final (32/480/14/120+), comprobado leyendo el texto tras el
scroll, no solo a ojo.

**Rendimiento:** sin canvas ni WebGL (el hero es SVG + CSS +
`scrollTrigger scrub`, no aplica el riesgo de `ctx.filter`/`shadowBlur` por
fotograma). El marquee del friso y los contadores están en JS puro
(`requestAnimationFrame` + `IntersectionObserver`), así que siguen
funcionando si el CDN de GSAP cae. GSAP y Lenis se sirven desde jsDelivr, no
cdnjs (cdnjs ya no sirve Lenis — 404 silencioso, trampa ya pagada en otra
plantilla de la biblioteca).

**Datos ficticios:** Valladares Mendoza Abogados · Avenida da Concordia, 18,
4º · 36203 Vigo (Pontevedra) · 986 00 00 00 (despacho) / 600 00 00 00
(móvil/WhatsApp) · contacto@valladaresmendoza.example (dominio `.example`,
reservado por IANA) · CIF B36000000. Nombre comprobado por búsqueda web
antes de fijarlo: no existe ningún despacho real con ese nombre en
España/Galicia. Cuatro áreas de práctica con texto completo (mercantil y
societario, M&A, contratación y *compliance*, arbitraje y litigación),
equipo de 6 personas con nombre/cargo/área sin fotografía, 3 testimonios de
empresas clientes ficticias marcados «testimonio de muestra» (nunca
atribuidos a Google/Trustpilot, sin estrellas). `schema.org` de tipo
`LegalService` **sin** `aggregateRating` ni `review`. Sin ningún
`[PENDIENTE]`: todos los datos están completos, de muestra.

**Línea roja del sector (PLIEGO §1):** repasada entera al cerrar la
plantilla — nombre comprobado, dirección y teléfonos de muestra, dominio
`.example`, testimonios sin atribuir a plataforma real, sin
`aggregateRating`, sello de demostración en footer/README/comentario HTML,
`noindex, nofollow` en las tres páginas.

**Verificación:** Playwright (Chromium) en 1440×900 y 390×844
(`isMobile`/`hasTouch` reales), recorrido con `mouse.wheel` y ~1,4 s de
espera por tramo, fotogramas intermedios de la cortina, consola limpia (0
errores/0 peticiones fallidas fuera de la pasada que bloquea el CDN a
propósito), pasada con GSAP y Lenis bloqueados (`route.abort()` sobre
jsDelivr) y pasada con `prefers-reduced-motion: reduce` — en ambas la
página se lee entera. Cookies, menú móvil y mapa bajo clic probados por
código. Ejecutada primero contra un servidor local y **repetida entera
contra el sitio publicado en GitHub Pages**
(`https://alvarotaiagu.github.io/plantilla-abogados-portico-web/`), con el
mismo resultado limpio en ambos pases. 28 capturas en `screenshots/`.

**Pendiente de esta plantilla** (igual que el resto de la biblioteca): sin
medir `longtask` con `PerformanceObserver` (sin canvas/WebGL, riesgo bajo
pero no medido); sin auditoría automática de contraste (axe/Lighthouse) —
calculado a mano con script; solo probado en Chromium, sin lector de
pantalla real.

**Pasada de pulido, 2026-09-20 (mismo día, tras revisión del dueño):**
comparada sección a sección contra `jack-3d-creator-web`/Ceibo/Astrobots y
no estaba a la altura. Corregido de raíz (no parcheado): el hueco vacío de
«alas» (la cabecera vivía fuera del contenedor anclado, así que la caja de
100vh con las tarjetas centradas quedaba reservada antes incluso de que el
pin se enganchara); «método» rediseñado como escalinata con un marcador
que sube peldaño a peldaño (antes era una lista numerada plana que ni
usaba su propia metáfora); «testimonios» con un sello notarial trazado en
SVG + inclinación 3D al puntero, antes sin ningún gesto propio. De paso,
un bug de robustez más serio que los tres ya conocidos: `overflow: clip`
en `<html>` aplicaba a los dos ejes, y sin Lenis disponible (CDN caído)
el eje vertical se quedaba sin caja de scroll — la página entera quedaba
clavada en el hero con el CDN bloqueado, violando el §5 del pliego.
Limitado a `overflow-x`. Verificación repetida entera (Playwright,
1440×900/390×844, recorrido con `mouse.wheel`, pasada con GSAP bloqueado,
pasada con `prefers-reduced-motion`, cookies/menú/mapa) contra local y
contra GitHub Pages ya desplegado, en ambos casos limpia. Commits
intermedios por sección: `bfcf382` (overflow), `1047209` (alas), `248cdaa`
(escalinata), `cc5c995` (testimonios).
