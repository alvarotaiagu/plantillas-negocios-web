# Asesoría fiscal/laboral/contable — «Casillas»

- **Sector**: asesoría fiscal, laboral, contable y de constitución de
  sociedades (gestoría generalista). Cuarta plantilla ficticia del sector,
  dentro de la excepción abierta el 2026-09-18 en `SECTORES.md` (junto a
  «Sello», «Cinta sumadora» y «Expediente», de otros agentes en paralelo).
- **Negocio ficticio**: **Vilas & Bugallo Asesores**, en Ordes (A Coruña).
  El nombre de partida de la especificación, «Ferreiro & Costas», se
  descartó: existe un despacho real «Ferreiro C. Asesoría Integral» y un
  bufete «Ferreiro Marzoa y Fernández Souto» con sede en Ordes. Se comprobó
  «Vilas & Bugallo» en la web sin encontrar coincidencias antes de fijarlo.
- **Concepto**: «Casillas» — la rejilla de un formulario tributario como
  sistema de diseño completo: recuadros de borde fino, casillas numeradas
  que se marcan al entrar en viewport, marcas de registro en las esquinas
  (como las cruces de alineación de un impreso escaneado), cifras siempre en
  monoespaciada tabular. No reproduce con precisión legal ningún modelo real
  de Hacienda; los números de modelo (303, 130, 111, 200, 202) se usan solo
  como referencia de sector.
- **Estructura de secciones** (orden propio, distinto de Dourado &
  Fernández, Rivand, Cervantes y del resto del lote): portada (impreso de
  muestra que se marca solo) → servicios 01-04 en casillas numeradas →
  confianza/reseñas en su propia casilla grande (antes del calendario, a
  propósito) → calendario fiscal (tabla de casillas con "próxima" y "días"
  calculados con `new Date()` del sistema, no escritos a mano) → equipo
  fusionado con "por qué elegirnos" (sin sección de equipo aparte) →
  contacto + pie.
- **Paleta**: gris papel `#E7E5DF` (base), grafito `#2B2E33` (estructura y
  texto), petróleo `#3E6E6B` (único acento). Sin rojo ni ámbar. Contraste
  de cada combinación calculado con `scripts/contrast.js` (fórmula WCAG),
  nunca a ojo: `--texto-apagado` 4,65:1 sobre papel, `--texto-apagado-sobre-
  grafito` 4,95:1 sobre grafito, `--texto-acento` (petróleo oscurecido)
  6,74:1 sobre papel.
- **Tipografía**: Manrope (titulares y cuerpo) + JetBrains Mono (cifras y
  casillas, `tabular-nums`). Cobertura de `€`, `ñ` y tildes comprobada con
  `document.fonts.check` en `scripts/verify.js`.
- **Movimiento protagonista**: cortina de entrada con gesto propio — una
  rejilla de 32 casillas se marca en oleada y el bloque entero se retira con
  un barrido, como quien completa un impreso y lo aparta de la mesa.
  Además: Lenis como único motor de scroll, char-reveal por
  `IntersectionObserver` (no `ScrollTrigger` con `once`), barra de progreso
  lateral que imita el margen impreso de un formulario, botones magnéticos
  (CTA principal y WhatsApp flotante) y contadores tabulares. Las casillas
  de servicios y el impreso de la portada se rellenan con
  `IntersectionObserver` + transición CSS, sin depender de GSAP.
- **Repo local**: `C:\Users\alvar\Desktop\WEBS NEGOCIOS\plantilla-asesoria-casillas-web\`
  (`git init` local, sin remoto de GitHub).
- **Demo**: pendiente de publicar (no autorizado aún).

## Verificación (§7 del pliego)

Hecha con Playwright en 1440×900 y 390×844 (más 400×900 y 820×1180):
46/46 pruebas automáticas en `scripts/verify.js` (informe en
`scripts/verify-report.json`), capturas de cada sección en `screenshots/`
revisadas a mano, pasada con el CDN de GSAP **y** de Lenis bloqueado
(la página se lee entera, sin `has-motion`, sin la cortina tapando nada),
pasada con `prefers-reduced-motion: reduce` (el contenido —impreso,
contadores, calendario— sigue cambiando aunque no haya coreografía),
botones de cookies/menú móvil/mapa probados uno a uno, consola y peticiones
limpias, sin `[PENDIENTE]`/`TODO`/lorem ipsum, sin `aggregateRating` ni
`review` en el `schema.org`.

## Trampa del §6 que mordió

Ninguna de las trampas ya catalogadas del pliego dio problemas directamente,
pero apareció una nueva variante que merece anotarse: **la librería Lenis ya
no está en cdnjs** (`cdnjs.cloudflare.com/ajax/libs/lenis/...` devuelve 404
para cualquier versión), aunque varias plantillas anteriores del lote
(incluida Cervantes) la referencian ahí. Se cambió a
`cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js`, que sí sirve el
paquete y expone el mismo global `Lenis`. Conviene revisar las plantillas
que aún apuntan a cdnjs para Lenis: si de verdad está caído allí, su Lenis
nunca carga y quedan degradadas a scroll nativo sin que ningún test previo
lo haya detectado (el bloqueo de CDN en sus `verify.js` solo comprobaba
`cdnjs.cloudflare.com`, que en ese caso ya estaba fallando por defecto).
