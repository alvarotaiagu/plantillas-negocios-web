# Informe de la noche · Ferretería «Paso Fino» (2026-10-02)

> Sitio de demostración. Paso Fino es un negocio ficticio; los datos,
> fotografías y opiniones son de muestra.

Trabajo hecho sin supervisión. Rama `claude/noche-ferreteria`, carpeta
`plantilla-ferreteria-web/`. **No** se ha creado repo, **no** se ha activado
Pages, **no** se ha tocado `main`, `REGISTRO.md` ni `SECTORES.md`. Ficha nueva
en `registro/ferreteria.md` (con «Demo: pendiente de publicar»). Cada fase se
empujó a la rama al acabarla.

## El negocio y por qué no choca con uno real

**Ferraxaría Paso Fino**, ferretería de barrio en **Rúa do Parafuso, 7 · 15570
Narón** (calle inventada; *parafuso* es «tornillo» en gallego). Celia Fraga
Lamas (segunda generación) y Xurxo Pita Seoane (llaves, mandos y afilado).
981 00 00 00 · WhatsApp 600 00 00 00 · `hola@pasofino.example`. L–V
9:00–13:30 y 16:30–20:00, S 9:30–13:30.

Búsqueda web antes de fijar el nombre: **no existe ninguna ferretería «Paso
Fino»**. Sale «Ferretería Paso» (Maipú y Mar del Plata, Argentina): otro
nombre y otro país. «Paso fino» es, además, un término de tornillería (rosca
de paso fino) y una raza de caballos; ninguna tienda del sector. Las
ferreterías reales de Narón que salieron en la búsqueda (en Concepción
Arenal y en Río Miño) no se usan ni se parecen: calle inventada y mapa a la
localidad, no a una dirección. Sin `aggregateRating` ni `review` en el
JSON-LD; opiniones con nombre de pila y marcadas «de muestra».

## Concepto: «Rosca»

Cada vuelta, un paso: ni más, ni menos. Una ferretería de barrio encuentra la
pieza que encaja, como un tornillo que avanza justo su paso. De ahí:
secciones numeradas por **métrica de tornillo** (M3 → M12, y M404 en el
error), tornillo que **el scroll aprieta**, filetes de rosca entre secciones,
cortina que **se desenrosca**, entradas en diagonal al ángulo del flanco y la
voz («Aquí no nos pasamos de rosca», «Esto se ha pasado de rosca»).

## Paleta

**Verde de máquina-herramienta + minio**, registro B oscuro industrial.
Fondo `#0E1411`, paneles `#151D19`/`#1C2621`, texto `#EDF0EA` (13,5:1 en el
peor fondo), secundario `#A4B1A9` (7,0:1), portaetiquetas `#E9DFC3` con tinta
`#2A2619` (11,4:1). Dos minios: superficie `#E2552B` y texto/botón `#FF8C66`
(8,2:1). Derivadas del mando por rotación de matiz en OKLCH (misma L y C):
**Cobalto** `#0A8BF4`/`#76B4FE` y **Cardenillo** `#06A36F`/`#32CD97`, con
contraste medido por script. Distinta de los tres vecinos que pedía el
encargo: Carrexo (negro + amarillo señal), Rodadura (azul acero + ámbar) y
Trinquete (claro + latón y engranajes).

## Tipografía

**Mona Sans** variable (eje de anchura 75–125) para todo, con titulares a
`wdth 75 / wght 860`; **Geist Mono** para etiquetas, precios y lecturas;
**Permanent Marker** solo en los portaetiquetas de los cajones. Ninguna de
las tres está en el registro. Glifos revisados en captura: €, ñ, tildes,
¿?, « », ×, ⅜, ¾, ″.

## Movimiento protagonista

El **M10 en WebGL**: raymarching de una SDF con rosca helicoidal en V, cabeza
hexagonal achaflanada y arandela. El scroll lo **aprieta** (una pantalla =
tres vueltas; giro y avance ligados por el paso, 1,5 mm/vuelta en la lectura
en vivo) y el cursor **mueve la lámpara** sobre el metal; el reflejo lateral
toma el color de marca, así que el mando de paleta también se ve en el
tornillo. Se pinta **solo cuando algo cambia** y se para al converger.
Segundo gran momento: la **copiadora de llaves anclada con scrub** (cinco
pasos, el material se va de verdad, cronómetro hasta 04:30).

Recursos del §2: 9 (Lenis, char-reveal con eje de anchura, pila sticky,
marquesina ligada al scroll, imán, scrub anclado, cursor punto + aro que se
hace tuerca, hero WebGL, contadores).

## Verificación (números)

Herramienta: **Playwright 1.56 + Chromium headless** (`scripts/verify.js`).
**58 comprobaciones, 58 en verde** en la última pasada. Incluyen:

- 1440×900 y 390×844 (`isMobile` + `hasTouch`), recorrido con `mouse.wheel`.
- **Cortina**: dos fotogramas a medias (chapa ya subiendo, a −27 px, y canto
  dentado a 433 px, en mitad de la pantalla), color `rgb(226,85,43)` frente al fondo `rgb(14,20,17)`, y
  `display:none` al final en los **tres** casos (normal, sin GSAP y reducido).
- **Pila sticky**: seis `<li>` sticky de **400 px** (el alto de la más alta,
  medido por JS; viewport 900), `margin-bottom` de 72 px en los seis incluido
  el último, `::after` de 162 px, y 40 muestras en pasos de **90 px** con el
  orden de apilado siempre correcto.
- **Cursor**: `cursor:none` computado en `body` y en botones tras el primer
  `pointermove` de ratón; contextual sobre enlaces y tuerca sobre la
  herramienta; **nada en táctil** (se enciende solo con
  `(hover:hover) and (pointer:fine)`).
- **Menú móvil**: 844 px de alto = `innerHeight` (100dvh, no `inset:0`),
  `aria-expanded`, el botón cierra por encima y los enlaces cierran y llevan.
- **Cookies**: `display:flex` → `none` al pulsar, `localStorage` guardado;
  regla en `.cookies:not([hidden])`.
- **Mapa**: 0 iframes antes del clic, 1 después.
- **Hero en 360×640 y 375×667**: cajas de etiqueta, titular, lema, botones,
  lectura y cabecera **sin solapes** y dentro de pantalla.
- **Sin GSAP** (jsDelivr abortado): cortina fuera, letras a opacidad 1,
  `clip-path` a `none`, sin errores propios.
- **Movimiento reducido**: sin Lenis ni estados vacíos; la lectura del
  tornillo, el paso de la llave (con su cronómetro) y los contadores siguen
  cambiando.
- **Mando** (`?revision`): se aparta con las cookies y vuelve al cerrarlas;
  sobria quita filetes y cabezas, pone la métrica a 75 px y enseña el gráfico
  de granel, sin desbordar; se puede volver; las tres paletas cambian el color
  **computado** del botón y de la cinta y **no** el del logo; `aria-pressed` y
  `localStorage` correctos; al recargar, la clase está en `<html>` en
  `DOMContentLoaded` (script bloqueante).
- **axe-core 4.10.2** (WCAG 2.1 AA + buenas prácticas): **0 violaciones** en
  escritorio y en móvil. Una corregida por el camino: la ficha del panel era
  `<aside>` dentro de una sección.
- Consola limpia y **cero 404** en escritorio, móvil y aviso legal; sin
  desbordamiento horizontal (`scrollWidth == innerWidth` en 1440 y 390); sin
  `[PENDIENTE]`, `TODO` ni *lorem*.
- Receta del mando comprobada por script (`scripts/receta-mando.js`): aplica
  los cuatro pasos a una copia con anclas exactas, quita 9 + 16 líneas de
  `index.html`, 5 + 13 de CSS y 28 de JS, abre la copia y carga limpia.

**Tareas largas** (`PerformanceObserver`, carga **en frío** con la caché
deshabilitada, control de 120 ms lanzado con `setTimeout` y detectado):
`scripts/longtask.js` separa carga y recorrido y compara con WebGL apagado.

| Pasada | Carga (n · total · máx) | Recorrido entero |
|---|---|---|
| WebGL (SwiftShader) · escritorio | 4 · 630 ms · 273 ms | 18 · 1089 ms · 134 ms |
| WebGL (SwiftShader) · móvil | 1 · 207 ms · 207 ms | 7 · 390 ms · 69 ms |
| Sin WebGL · escritorio | 2 · 236 ms · 159 ms | 8 · 448 ms · 68 ms |
| Sin WebGL · móvil | 2 · 180 ms · 114 ms | 2 · 104 ms · 54 ms |

Lectura honesta: en este contenedor **no hay GPU**; Chromium pinta el shader
con SwiftShader (GPU por software, en el hilo del navegador), y eso explica
la diferencia entre filas. La carga sin WebGL (≈ 180–240 ms) es GSAP +
webfonts, como ya avisa el pliego. Las cifras varían bastante entre pasadas
en esta máquina (la misma prueba dio entre 1 y 8 tareas en el recorrido sin
WebGL): son orientativas, no un banco de pruebas.

**Lo que no se pudo comprobar** (falta de herramienta en el entorno):
jsDelivr está **bloqueado por la política de red** del contenedor, así que
GSAP 3.12.5, ScrollTrigger y Lenis 1.1.13 se sirvieron en la verificación
desde copias de **npm de las mismas versiones**, interceptando las URL de
jsDelivr (las URL del HTML son las reales). Sin GPU real, sin Firefox ni
Safari, sin dispositivo físico y sin lector de pantalla.

## Decisiones tomadas solo

1. **Nombre**: «Paso Fino» frente a «A Porca» (*porca* = tuerca en gallego,
   pero también lo otro) y «O Parafuso» (demasiado literal para un nombre).
2. **Electricidad sin instalación**: esta noche otro agente hace
   fontanería-electricidad; aquí el cajón vende material y remite a un
   electricista autorizado del barrio.
3. **El mando solo con `?revision`** y las preferencias guardadas solo se
   aplican en ese modo, para que la dirección normal enseñe siempre la versión
   de referencia.
4. **Cero fotografía**: la foto de estanterías es la imagen más gastada del
   sector; todo es SVG o 3D propio.
5. **La galga sin guardar la calibración**: así no hay una tercera clave en
   `localStorage` que explicar en el aviso legal; se recalibra en un segundo.
6. **Shader bajo demanda**, con compilación paralela (`KHR_parallel_shader_compile`)
   y calidad adaptativa (si la media pasa de 24 ms por fotograma, baja la
   resolución hasta la mitad); con SwiftShader arranca al 35 %.
7. **Sin trazos SVG animados con GSAP**: la trampa de `pathLength=1` +
   `autoRound:false` del encargo **no aplica** porque ningún trazo se dibuja
   con GSAP (la copiadora se mueve con atributos escritos por `setP`, y los
   filetes son CSS). Se deja dicho en vez de inventar un trazo para probarla.

## Lo flojo

- **Las capturas no hacen justicia al tornillo**: con SwiftShader se pinta al
  35 % de resolución y sale pixelado; en una GPU real va a resolución completa.
  No he podido verlo en una GPU de verdad.
- El **filete del shader** se lee a ratos como anillos apilados más que como
  hélice cuando el tornillo está quieto; se nota la hélice al girar.
- Las **ocho herramientas del panel** son siluetas correctas pero sencillas;
  con más tiempo merecerían el mismo nivel de detalle que la copiadora.
- La **galga** es útil pero visualmente es la sección más plana.
- El **segundo fotograma de la cortina** hubo que capturarlo en una carga
  aparte: con la GPU por software la captura anterior tarda tanto que la
  cortina ya se había ido.
- Tareas largas medidas sin GPU real: falta repetirlo en un móvil de gama
  media.
