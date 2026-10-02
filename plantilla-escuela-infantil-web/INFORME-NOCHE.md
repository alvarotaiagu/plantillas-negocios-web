# Informe de la noche — escuela infantil «O Abaneo» (2026-10-02)

> Sitio de demostración. O Abaneo es un negocio ficticio.

Trabajo sin supervisión. Todo lo decidido a solas está en «Decisiones tomadas
solo», y lo que ha quedado flojo, en «Lo flojo».

## Lo primero que hay que saber: dos agentes, mismo encargo

Al empujar la primera fase, la rama `claude/noche-escuela-infantil` **ya
existía en el remoto** con un commit de otro agente (minutos antes que el
mío): otra plantilla del mismo sector y la misma villa, concepto «Colcha»,
negocio «Retallos». Parece una doble ejecución del encargo. Para no pisarle
el trabajo ni forzar un push, **esta plantilla vive en la rama
`claude/noche-escuela-infantil-abaneo`**, con la misma carpeta
`plantilla-escuela-infantil-web/` que pedía el encargo. Por la mañana hay que
elegir una de las dos (o quedarse ambas como variantes del sector) antes de
crear repo y tocar `REGISTRO.md`. No he tocado `main`, ni `REGISTRO.md`, ni
`SECTORES.md`, ni he creado repos ni Pages.

## El negocio

**O Abaneo · escola infantil** — Travesa da Lavandeira, 6 · 36500 Lalín
(calle inventada). 986 00 00 00 · WhatsApp 600 00 00 00 ·
ola@oabaneo.example. Lunes a viernes 7:30–17:30 (jornada 9:00–16:00 y horario
ampliado antes y después). Tres aulas: **Lúa** (4–12 meses, 8 plazas),
**Pera** (1–2 años, 13) y **Barquiño** (2–3 años, 18); 39 plazas, seis
educadoras, una cocinera (Carmiña) y la directora (Iria Bouzas). Cuotas de
muestra **marcadas como ficticias**: matrícula 60 €, media jornada 210 €/mes,
completa 340 €/mes, ampliado 30 €/mes cada franja, comida suelta 6,50 €.
Puertas abiertas los sábados 7 y 21 de noviembre y los martes con cita.

**Por qué no choca con uno real:** búsqueda web del 2026-10-02 de «Abaneo» y
«O Abaneo» con escola/escuela infantil/guardería, en Galicia y en general:
ninguna escuela con ese nombre. Lo más cercano es **«Abanea»**, un festival de
danza y movimiento (Gondomar y Allariz, 2022): otro nombre y otro sector. Las
escuelas reales de Lalín no se parecen ni en nombre ni en dirección. Teléfono
y correo son de muestra (`.example`).

## Concepto, paleta, tipografía, movimiento

- **Concepto «Móvil»**: el móvil de cuna. Pocas piezas de una varilla; cuando
  una se mueve se mueven todas y luego se paran. Todo el movimiento de la web
  cuelga, se mece y se para con la misma curva de péndulo amortiguado.
- **Paleta**: papel `#F5EDE0`, tinta **índigo** `#23264A` (ninguna plantilla
  de la biblioteca usa índigo de tinta), noche `#1B1D3A`, acento **tomate de
  fieltro** `#D9573B` (texto `#A43820`, botón `#9F341B`) y fieltros fijos
  mostaza, salvia, rosa, cielo y madera. Alternativas del mando: **Pino** y
  **Malva**, derivadas por rotación de matiz en OKLCH con ajuste de
  luminosidad hasta 5:1 en texto y 7:1 en botón (`scripts/paleta.js`).
- **Tipografía**: **Playfair 2.0** variable (`opsz` hasta 1200, `wdth`,
  `wght`) + **Atkinson Hyperlegible Next**. Ninguna usada antes.
- **Movimiento protagonista**: el **móvil de la portada en canvas 2D**, cinco
  péndulos amortiguados en dos varillas con giro en profundidad y
  perspectiva; el cursor o el dedo soplan, el clic da un soplido, el scroll
  hace girar la varilla. Segundo: la **adaptación anclada con scrub** (la
  silla de la familia sale por la puerta en seis pasos).

## Verificación (números)

Herramientas: **Playwright 1.56 + Chromium** (el del entorno), `axe-core`
4.10.2, Node 22. Todo con scripts que quedan en el repo:
`scripts/verificar.js` (salida en `scripts/verificacion.json` y
`scripts/verificacion.log`), `scripts/auditar.js` (`scripts/auditoria.json`),
`scripts/paleta.js` y `scripts/quitar-mandos.js`. **45 capturas** en
`screenshots/`, miradas una a una.

- **Verificación: 45/45 comprobaciones en verde** (última pasada).
- **axe: 0 violaciones** en 8 análisis (portada, aviso legal, 404 y portada
  en versión sobria, cada uno a 1440×900 y 390×844, con la página recorrida).
  La primera pasada dio 3 tipos (un `<dl role=tabpanel>`, `aria-label` en un
  `<span>` genérico del titular partido y los mandos fuera de una región):
  corregidos.
- **Tareas largas** (`PerformanceObserver` desde el `<head>`, control de
  120 ms lanzado con `setTimeout` para demostrar que el observador está vivo):
  en frío con la caché deshabilitada, **2 al arrancar (84 y 80 ms en la última pasada; 89 y 67 en la anterior)** y **0
  recorriendo la página entera** con el canvas vivo; con caché templada, 0 y 0.
- **Canvas**: un contador sobre `CanvasRenderingContext2D` confirma **0**
  asignaciones de `filter`/`shadowBlur` en el canvas visible durante todo el
  recorrido (las sombras se difuminan una vez, en el sprite).
- **Cortina**: fotogramas a medias capturados (hilo bajando y manta
  levantándose con el borde curvo, `escritorio-00*.png` y
  `movil-00-cortina-media.png`); el `stroke-dashoffset` del hilo pasa por
  valores intermedios (0,91 → 0,58…, `autoRound:false`); 58 fotogramas con la
  manta a medias; acaba en `display:none` en los tres casos (normal, sin GSAP
  y con movimiento reducido). Color de la cortina (noche) distinto del fondo.
- **Cursor**: se activa al primer `pointermove` de ratón, `cursor:none` en el
  `body`; con táctil (390×844 con `hasTouch`) no aparece.
- **Pila sticky**: tres `<li>` de 454 px (el alto de la tarjeta más alta,
  medido por JS), `margin-bottom` de 126 px en los tres incluido el último,
  reposo de 306 px por `::after`; recorrida en pasos de 90 px sin que una
  tarjeta adelante a la anterior y llegando las tres a apilarse.
- **Menú móvil**: abre, `aria-expanded`, el panel mide exactamente 844 px
  (`100dvh`, no `inset:0`, pese al `backdrop-filter` de la cabecera); el mismo
  botón lo cierra; un enlace lo cierra y lleva a su sección.
- **Cookies**: `display:flex` solo con `:not([hidden])`; el botón la cierra de
  verdad y los mandos aparecen al cerrarla (con `?revision`), y no existen
  sin `?revision`.
- **Maqueta**: en sobria desaparecen hilos, piezas y dibujos, entra el dato
  (plazas en grande) y el gráfico de ratio; sin desbordamiento; se vuelve.
- **Paleta**: el color computado del botón cambia de verdad
  (`rgb(159,52,27)` → `rgb(0,99,88)` → `rgb(132,58,139)`), `aria-pressed` y
  `localStorage` correctos y la clase está puesta **antes de pintar** al
  recargar. Contrastes de las derivadas: texto 5,0:1 sobre panel, botón 7,0–7,2:1.
- **Portada en 360×640 y 375×667**: cero solapes entre cabecera, antetítulo,
  titular, entradilla, botones y datos, y el móvil del canvas termina justo
  donde empieza el texto (294/294 y 304/304 px). Sin desbordamiento horizontal
  en ningún tamaño.
- **Sin GSAP** (CDN abortado): cortina fuera, ninguna palabra oculta, la
  adaptación cambia de paso con IntersectionObserver. **Reducido**: sin Lenis
  ni `has-motion`, el paso de la adaptación, el estado abierto/cerrado y los
  contadores siguen cambiando.
- **Mapa**: sin iframe antes del clic; con el clic aparece el de Google.
- **Consola**: limpia y sin 404 propios. Lo único que falla es del entorno
  (iframe de Google y alguna fuente cortada por el proxy), separado y contado.
- **Sin marcadores** `[PENDIENTE]`/`TODO`/lorem; `noindex, nofollow` y sello en
  las tres páginas.
- **Receta de quitar los mandos**, ejecutada sobre una copia: 4 + 3 + 3 + 1
  bloques fuera, sin rastro y `main.js` válido.

## Decisiones tomadas solo

1. **Rama aparte** por la colisión con el otro agente (arriba).
2. **Mandos solo con `?revision`**: el encargo lo pedía para la maqueta; lo he
   extendido al mando de paleta para que la demo pública se vea limpia. El
   aviso de cookies y el legal mencionan lo que guardan solo en esa versión.
3. **Canvas 2D y no WebGL** para el hero: el concepto es un objeto colgado con
   física, no un campo de color; con sprites cacheados el canvas 2D da cero
   tareas largas recorriendo la página y funciona en cualquier móvil.
4. **Ningún niño, tampoco en dibujo**: la adaptación se cuenta con objetos.
5. **Ratio frente al máximo legal gallego** (1:8, 1:13, 1:20 por tramo de
   edad, Decreto 329/2005) como dato añadido de la versión sobria. Es el único
   dato normativo real de la página; conviene que alguien lo revise antes de
   enseñarlo a un cliente.
6. **Logo rehecho**: la primera versión, a 500 px en el `og.png`, se leía como
   una balanza (varilla recta, poste central). Varilla de madera combada,
   anilla e hilos finos.
7. **Hilo de la cortina con GSAP y `autoRound:false`**: no hacía falta para el
   gesto, pero el encargo pedía probar esa trampa; se mide que el
   `stroke-dashoffset` pasa por valores intermedios.
8. **Red de seguridad de la cortina en dos tiempos**: 6 s desde el `<head>`
   (si `main.js` no corre) y, en cuanto arranca la animación, duración + 1,2 s.
   La primera versión la retiraba a los 4 s desde la carga y, con fuentes
   lentas, la habría cortado a medias.

## Lo flojo

- **El entorno de esta noche no llega a jsDelivr** (el proxy de salida lo
  bloquea). La web carga GSAP y Lenis desde jsDelivr, como pide el pliego, y
  en las pruebas se sirvieron **los mismos paquetes de npm** (gsap 3.12.5,
  lenis 1.1.13) interceptando esas URL. No he podido comprobar el CDN real:
  conviene abrir la demo publicada y mirar la consola una vez.
- **El mapa de Google no carga aquí** por el mismo proxy: se verifica que el
  iframe no existe antes del clic y que aparece con la URL de embed después,
  pero no he visto el mapa pintado.
- **Las fuentes de Google llegan a trompicones por el proxy** (alguna descarga
  corta con `ERR_TOO_MANY_RETRIES`, alguna captura tarda en salir porque
  Playwright espera a las fuentes). Se separan en la verificación como fallo
  del entorno; en una red normal no debería pasar.
- **Solo Chromium**, sin Firefox ni Safari (`ctx.filter` para difuminar las
  sombras del móvil una vez: Safari no lo soporta y pintaría la sombra nítida,
  no rota). Sin dispositivo real ni lector de pantalla real.
- **La escena del aula** de la adaptación es correcta pero sencilla; con más
  tiempo le daría más oficio (textura de suelo, la puerta abriéndose de
  verdad, la luz de la ventana cambiando con las horas).
- **El dato de ratio legal** (Decreto 329/2005) está puesto de memoria y
  marcado en las decisiones para revisarlo.

## Segunda plantilla

Con esta verificada (45/45 y axe a cero) a la hora y media de empezar,
quedaba margen y se hizo la segunda del encargo, **academia de idiomas**, en
la rama `claude/noche-academia-idiomas` (carpeta
`plantilla-academia-idiomas-web/`), con su propio `INFORME-NOCHE.md`.

## El otro agente

La rama `claude/noche-escuela-infantil` («Colcha», Retallos) no ha recibido
ningún commit más desde el primero (00:57 hora peninsular): solo tiene el
esqueleto (README, isotipo y manifest). Si nadie la retoma, esta es la
plantilla de escuela infantil de la noche.
