# Informe de la noche — Pegada · yoga e pilates

> Sitio de demostración. Pegada es un negocio ficticio.

Trabajo sin supervisión, 2026-10-01 23:07 → 2026-10-02, rama
`claude/noche-yoga`, carpeta `plantilla-yoga-web/`. Un commit y un push por fase.
No se ha creado repositorio, ni activado Pages, ni tocado `main`, `REGISTRO.md`
o `SECTORES.md`. La ficha va en `registro/yoga.md` («Demo: pendiente de
publicar»).

## El negocio y por qué no choca con uno real

**Pegada · yoga e pilates**, Rúa do Cascallo, 9, baixo, Sanxenxo. «Pegada» es
«huella» en gallego. Buscado antes de fijarlo: no aparece ningún estudio de
yoga ni de pilates con ese nombre en Galicia ni en España (sí sale la palabra
en portugués, sin relación con el sector). «Rúa do Cascallo» no aparece en el
callejero de Sanxenxo. Teléfonos 986 00 00 00 y 600 00 00 00, correo
`hola@pegada.example`. Profesorado dibujado, con nombres inventados.

## Concepto

**«Apoyos»: toda postura empieza por lo que toca el suelo.** La web es una
esterilla que recuerda dónde la has pisado. Sale del oficio (lo que se corrige
en clase son los apoyos y el reparto del peso) y del registro C: caucho natural
y corcho, que se tocan con la vista.

## Paleta

Corcho `#C9A57E` de fondo con grano procedural, espuma `#F3ECE2`, caucho
`#1D1A16`, y un solo acento de marca, **mar** `#16475A` (el color de la
esterilla), con tokens aparte para texto sobre corcho (`#0F3A4A`) y sobre
caucho (`#8EC3D3`). Coral `#E2683F` solo como superficie para «en vivo» y los
apoyos. Nada de cremas de papel como fondo principal (la mitad de la biblioteca
las usa) ni de lila. Las otras siete plantillas de la noche (escuela infantil,
heladería, ferretería, surf, fontanería, psicología, carnicería) difícilmente
caerán en un fondo de corcho con acento azul atlántico oscuro, pero no lo he
podido comprobar: no veo sus ramas. 31 parejas de contraste calculadas por
script: de 4,61:1 a 14,78:1.

## Tipografía

**Roboto Serif** variable para titulares, con el eje de anchura (`wdth`)
respirando en el titular de la portada: 4 s se ensancha, 6 s se estrecha.
**Albert Sans** para texto y **Red Hat Mono** para horas y porcentajes.
Ninguna se usa en la biblioteca. Revisados €, ñ, tildes y « ».

## Movimiento protagonista

**La esterilla de la portada, en WebGL.** Simulación de altura en GPU con dos
texturas en ping-pong (coma flotante de 16 bits si la tarjeta deja renderizar
en ella; si no, 8 bits con un decaimiento por resta para que no se quede
clavada), recuperación lenta como la espuma, normales calculadas en el shader,
grano de caucho y corcho procedurales, sombra de la esterilla sobre el corcho.
El ratón roza, el clic hunde, el dedo también; al entrar se marcan los dos pies
y al bajar las dos manos. Un ciclo de respiración hincha la superficie. El
color se lee de las variables CSS, así que el mando de paleta recolorea también
el WebGL. Se duerme fuera de pantalla.

Y, anclada, **la postura apoyo a apoyo**: figura articulada con cinemática
directa (cinco posturas, ángulos interpolados por el camino corto, la figura se
posa sola en el suelo en cada fotograma), la esterilla de perfil que cede bajo
cada apoyo según el peso, la vista desde arriba con el porcentaje de cada apoyo
y el reparto por zonas.

## Verificación, con números

- `scripts/verifica.js`: **44/44** comprobaciones en verde. Playwright 1.56 +
  Chromium (WebGL por SwiftShader, sin GPU), 1440×900 y 390×844 con `isMobile`
  y `hasTouch`, recorrido con `mouse.wheel`.
- Cortina: fotogramas a medias guardados (`cortina-1-mitad`, `cortina-2-mitad`,
  `cortina-sin-gsap-mitad`), de otro color que el fondo, y en `display:none` en
  los tres casos (normal, sin GSAP, movimiento reducido).
- Sin GSAP (jsDelivr abortado) y con `prefers-reduced-motion`: el titular se ve,
  el cuadro sigue vivo y los botones de la postura cambian paso y reparto.
- Cookies (`.cookies:not([hidden]){display:flex}`): el botón cierra de verdad;
  el mando se esconde mientras está el aviso.
- Dos densidades y tres paletas por código: colores computados distintos en un
  botón real, `aria-pressed`, `localStorage`, clase presente ya en `load` al
  recargar. Sin `?revision` no aparece ni se aplica nada.
- Menú móvil en cabecera con `backdrop-filter`: el panel mide 844 px de 844
  (`height:100dvh`, no `inset:0`) y el mismo botón lo cierra.
- Mapa: cero iframes hasta pulsar.
- Pila sticky: cinco `<li>` de 389 px (el más alto, medido por JS), mismo
  `margin-bottom` de 198 px en todos incluido el último, reposo por `::after`
  (108 px); 40 pasos de rueda de 90 px sin ninguna tarjeta invisible.
- Hero en 360×640 y 375×667: sin solapes entre cabecera, antetítulo, titular,
  entrada y botones, y sin desborde.
- Domingo: «cerrado», ninguna columna de hoy, la siguiente es el lunes 07:30.
- `longtask` en frío con la caché deshabilitada: **una tarea de 198 ms al
  cargar** y **ninguna** recorriendo la página entera; el control de 120 ms
  lanzado con `setTimeout` se detecta, así que el observador funciona.
- axe-core 4.10.2: **0 violaciones** en seis estados (escritorio, móvil, sobria
  + granate, domingo, aviso legal, 404).
- Receta de borrado: seis combinaciones sin restos; dos copias cargadas en el
  navegador sin errores.
- 65 capturas en `screenshots/`, miradas.

## Decisiones tomadas sin poder preguntar

1. **jsDelivr, cdnjs y unpkg están bloqueados por el proxy del entorno.** El
   HTML apunta a jsDelivr como pide el pliego; para verificar, bajé GSAP 3.12.5
   y Lenis 1.1.13 del registro de npm (que sí estaba abierto) y los serví en
   local interceptando las peticiones de Playwright (`--rutas=`). Igual con
   Google Fonts, que Chromium no podía descargar por el certificado del proxy.
   **No he podido comprobar la carga real desde jsDelivr**: conviene abrir la
   demo una vez publicada.
2. **Renombré a Iago → Uxío**: en Albert Sans la «I» mayúscula y la «l» son
   casi iguales y en el cuadro se leía «lago».
3. **El mando solo existe con `?revision`**, y lo guardado solo se aplica con
   el parámetro: así un cliente que abre la demo limpia no ve la versión que
   dejó elegida otra persona.
4. **`?ahora=AAAA-MM-DDTHH:MM`** se queda: fija la hora del cuadro para las
   pruebas y para enseñar en una reunión cómo se ve un lunes a primera hora.
5. **Sin fotografía.** Todo es SVG o shader propio; evita cuerpos de catálogo
   y caras de personas reales para un profesorado inventado.
6. **La 404 es autocontenida** (estilos en línea) y calcula el enlace de vuelta
   desde la ruta: en una project page de GitHub las rutas relativas no valen.
7. **axe a cero cambiando dos `<aside>` por `<div>`**: la tarjeta «siguiente
   clase» y «Lo que no prometemos» estaban dentro de secciones y axe pide que
   los complementarios sean de primer nivel.

## Lo flojo

- **Las huellas automáticas de la portada** se leen como huellas, pero algo
  borrosas: la difusión de la simulación suaviza los dedos. Con más tiempo
  pondría una máscara de forma (un sprite de huella) en lugar de componerlas
  con elipses.
- **Los retratos del profesorado** son correctos pero sencillos, más planos
  que el resto de la obra gráfica.
- **Una tarea larga de ~200 ms al cargar**, medida con SwiftShader (WebGL por
  CPU). En un equipo con GPU debería bajar mucho, pero no lo he podido medir.
- **Un solo navegador** (Chromium) y táctil emulado; sin lector de pantalla
  real. Las deudas 3–5 del `REGISTRO.md` siguen aquí.
- Las capturas pesan 11 MB; si el repo final debe ser ligero, se pueden
  recomprimir.
