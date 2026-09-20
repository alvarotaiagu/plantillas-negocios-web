# Asesoría fiscal, laboral y contable — «Cinta sumadora»

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Asesoría fiscal, laboral, contable y constitución de empresas | Refoxo Xestión (Noia, A Coruña) | «Cinta sumadora» — la calculadora mecánica de despacho: el rollo de papel que suma línea a línea hasta cuadrar la cuenta | crema envejecida #F0E6D2 / crema-panel #E8DBC2 / azul prusia #1B3A4B / prusia-hondo #14303F + bronce-mostaza #C9962C (único acento) | Courier Prime + Work Sans | el rollo de papel fijo en el margen (barra de progreso que además «imprime» el nombre de la sección) y las cifras que se imprimen dígito a dígito, con el golpe de la sumadora | `C:\Users\alvar\Desktop\WEBS NEGOCIOS\plantilla-asesoria-cinta-sumadora-web` (repo local, sin remoto) | pendiente de publicar (no autorizado aún) |

**Excepción de sector:** una de las cuatro plantillas ficticias autorizadas el
2026-09-18 para el sector de asesoría fiscal (junto a los conceptos «Sello»,
«Casillas» y «Expediente», construidos en paralelo por otros agentes).

**El nombre se comprobó y se cambió antes de fijarlo.** La idea de partida
era «Pardo Gestión», pero la búsqueda en la web devolvió negocios reales con
ese nombre exacto en el mismo sector («Pardo Gestió» en Lleida, «Pardo
Centro de Gestión» en Barcelona, «J. M. Pardo» en Zaragoza, «Gestoría
Pardo» en Huércal-Overa, «Pardo Bertolín» en Barcelona), así que no cumplía
la regla de «negocio inequívocamente inventado» del pliego. Se rehízo como
**Refoxo Xestión**: «refoxo» es raposo en gallego, y el logotipo juega con
esa idea —la cola del raposo se dibuja como el rizo de un rollo de papel de
sumar—. Se comprobó también que «Refoxo Xestión» y variantes cercanas
(«Cotón Xestión», «Refoxo Asesores») no tienen presencia real en el sector.

**Datos ficticios:** Refoxo Xestión · Rúa do Curro, 14, entresuelo · 15200
Noia (A Coruña) · 981 00 00 47 (despacho) · 600 00 00 47 (WhatsApp) ·
hola@refoxoxestion.example · CIF de muestra B00000000. Equipo de dos
personas (Xoán Refoxo Lens, Antía Seixo Bugallo) con bio completa. Tres
testimonios con nombre de pila, nunca atribuidos a ninguna plataforma, y una
valoración media (9,7/10) marcada explícitamente como anotada a mano por el
propio despacho. Sin `aggregateRating` ni `review` en el `schema.org`
(`AccountingService`).

**Estructura (8 secciones, orden propio del lote):** portada con el rollo
fijo → marquee de áreas de servicio → servicios como cinta que se suma (con
contador lateral) → confianza/por qué elegirnos (ticket con un total
simbólico, «CONFIANZA», no una cifra de facturación) → equipo como tickets
impresos → calendario fiscal (líneas de cinta con el trámite «próximo»
resaltado y los días recalculados con la fecha real del sistema) → reseñas
(valoración subrayada con doble raya, como un total) → contacto + pie.

**Movimiento** (5 recursos del §2 del pliego, más uno propio del concepto):
Lenis como único motor de scroll, char-reveal con un rebote tipo «golpe de
sumadora» (`back.out`), marquee con la velocidad ligada al scroll, botones
magnéticos (CTA principal y WhatsApp flotante) y contadores que se imprimen
cifra a cifra (`ease: steps(n)`) para la valoración de reseñas y los días
del próximo trámite. Además, el rollo-barra de progreso fijo: no cuenta
para el mínimo, pero es contenido (el nombre de sección), así que se monta
con `IntersectionObserver` **fuera** de la rama de movimiento y sigue
actualizándose igual con `prefers-reduced-motion` o sin GSAP.

**Cortina de entrada propia:** la sumadora teclea cifras al azar, imprime
«1.247,50» a modo de flourish y se retira de un tirón hacia arriba
(`yPercent:-100`, `expo.inOut`), como si arrancaran el recibo. Retirada
garantizada por CSS (`html:not(.has-motion) .cortina{display:none}`) y por
un `setTimeout` de seguridad de 4,5 s.

**Accesibilidad:** ningún texto se apaga con `opacity`. Los tokens de texto
(`--apagado`, `--apagado-claro`, `--bronce-texto`, `--bronce-boton`) se
calcularon con un script de contraste WCAG (`node`, fórmula de luminancia
relativa) antes de escribir el CSS. El bronce de marca puro (2,15:1 sobre
crema) se quedó en rellenos, bordes, iconos y subrayados dobles — nunca
como texto; el detalle completo está en el README del repo.

**Tipografía:** se comprobó con una captura dedicada que Courier Prime
(400 y 700) y Work Sans (400 y 800) tienen glifos de €, ñ, tildes y
comillas angulares antes de cerrar la elección — ninguna caja vacía.

**Sin generador de imágenes:** toda la obra gráfica es SVG propio (logotipo,
favicon, rollo de papel, seis iconos de servicios, imagen social generada
desde `og-fuente.html`). No se ha usado ninguna fotografía: el sector no lo
exige y evita cualquier problema de personas de archivo, así que no hay
`CREDITOS.md`.

**Verificación (pliego §7):** Playwright a 1440×900 y 390×844, recorrido
con `mouse.wheel` (Lenis no dispara con `scrollTo`), capturas de las 8
secciones en escritorio y móvil más 404/aviso legal/privacidad en
`screenshots/` — se miraron una a una. Pasada con el CDN de GSAP y de Lenis
bloqueados: la cortina se retira igual y la página se lee entera. Pasada
con `prefers-reduced-motion: reduce`: sin animación pero con el contenido
vivo (se comprobó que los días del calendario cambiaron de 32 a 31 entre
dos ejecuciones en días distintos, prueba de que se calculan de verdad).
Consola limpia y cero peticiones fallidas en las dos pasadas normales.
Botones de cookies, menú móvil y mapa probados uno a uno. Sin
`[PENDIENTE]`, `TODO` ni *lorem ipsum*.

**Trampa del §6 que mordió de verdad:** al escribir el `<script>` de Lenis
con la sintaxis `paquete@versión` de un CDN, un filtro de la herramienta de
escritura confundió `lenis@1.x` con una dirección de correo y lo sustituyó
por `[email protected]` — la petición fallaba en silencio (404) y Lenis
nunca llegaba a cargar. Se detectó por la petición fallida en la pasada de
verificación con Playwright, no a simple vista, y se corrigió apuntando al
CDN de jsDelivr (mismo patrón que usan las plantillas hermanas del lote).
Queda anotado por si a otro agente del lote le pasa lo mismo al escribir
`unpkg.com/paquete@version`.

**Estado de publicación:** repositorio local únicamente, con commit hecho.
**No se ha creado repositorio remoto ni se ha publicado en GitHub Pages** —
queda pendiente de aprobación explícita del usuario.
