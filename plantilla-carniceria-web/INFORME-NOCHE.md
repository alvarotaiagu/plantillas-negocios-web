# Informe de la noche — 2026-10-02 · Carnicería y charcutería

Agente sin supervisión, de 23:04 a ~01:30 UTC. Rama `claude/noche-carniceria`,
carpeta `plantilla-carniceria-web/`. No se ha creado repo, ni Pages, ni se ha
tocado `main`, `REGISTRO.md` ni `SECTORES.md`. Ficha nueva en
`registro/carniceria.md` (Demo: pendiente de publicar).

## Resumen en una línea

**Carnicería Mouriscal (Vilalba), concepto «Contraveta»**: la portada es la veta
de la carne en WebGL y **el cursor es el cuchillo**. 44/44 comprobaciones del
§7 en verde, axe sin infracciones en 8 casos, sin fotos (todo SVG propio).
**No se hizo la segunda plantilla** (peluquería canina): ver «Decisiones».

## El negocio y por qué no choca con uno real

- **Carnicería Mouriscal** · Rúa dos Coiteleiros, 9 · 27800 Vilalba (Lugo) ·
  982 00 00 00 / 600 00 00 00 · hola@mouriscal.example · desde 1971 (ficticio).
  Personas: Avelino Mouriscal (fundador), Rosa Mouriscal (despiece), Iago Seoane
  y Marta Pena (obrador). Horario L 9–14, M–V 9–14 y 17–20:30, S 8:30–14:30.
- Búsqueda web: «Mouriscal» no aparece como carnicería, charcutería ni negocio
  cárnico. «Contraveta» existe como **maderera** (contraveta.com) y como
  **vajilla argentina**: otros sectores, y aquí solo es el nombre del concepto,
  nunca del negocio. La calle es inventada (Vilalba es real).
- Sin IGP (se cambió «ternera gallega» por «ternera de raza rubia gallega»
  porque la primera suena a la IGP Ternera Gallega), sin registro sanitario,
  sin premios; el aviso legal dice dónde irían los reales. `ButcherShop` sin
  `aggregateRating` ni `review`. Opiniones marcadas como de muestra y precios
  marcados como de muestra en cada sitio donde aparecen.

## Concepto

**«Contraveta»**: el carnicero corta de través a la fibra, nunca siguiéndola.
Es el gesto del oficio que el cliente no ve y que decide si el filete es tierno.
Registro C (producto y textura) sin brasas ni rueda de queso: la textura es la
**veta** (fibra + grasa infiltrada) y el movimiento es **el corte**.

## Paleta — «Azulejo y lomo»

Azulejo `#E4EBE5` · panel `#D5DFD7` · papel `#F8F9F5` · tinta `#241013` ·
tinta-2 `#56403F` · mostrador `#173F35` · hueso `#F3EADF` / `#BFD0C7` ·
acento lomo `#D8573F` (texto `#A0321D`, botón `#8E2A17`, claro `#F49A7F`).
Alternativas del mando de color por rotación de matiz: **Azafrán** y
**Ciruela**. Ninguna plantilla de la biblioteca usa verde azulejo + lomo, y es
distinta de lo que pueden escoger esta noche heladería, ferretería o surf
(no hay forma de saberlo; se eligió a partir del propio oficio).

## Tipografía

**Bodoni Moda** variable (peso + tamaño óptico) · **Onest** · **Red Hat Mono**.
Ninguna estaba en la biblioteca. Comprobados €, ñ, tildes, ¿? y « ».

## Movimiento protagonista

**Hero WebGL interactivo**: fragment shader de fibra y grasa; los últimos 24
puntos del cursor se suben como segmentos y la fibra se separa a ambos lados
del tajo, que se cierra en 1,5 s. Sin cursor (táctil, o quieto) la casa da un
tajo cada ~3 s; en táctil, al tocar. El scroll gira la veta y sube el eje
`wght` del titular de 560 a 900. Debajo, la secuencia **anclada con scrub** de
cinco gestos sobre un solo SVG, con una única función `pintar(p)` para scrub,
movimiento reducido y sin GSAP.

Recursos del §2: 9 (Lenis, WebGL, anclado con scrub, char-reveal, pila sticky,
cinta ligada al scroll, imanes, cursor contextual, contadores y máscaras
«loncheadas»). Cortina: seis lonchas de cortafiambres, color mostrador (verde)
sobre un fondo azulejo y un hero granate.

## Verificación (números de la última pasada)

Entorno: Playwright 1.56 + Chromium 141 headless, WebGL por **SwiftShader**
(software). **jsDelivr está bloqueado por el proxy de este contenedor** (403):
GSAP 3.12.5 y Lenis 1.1.13 se instalaron desde npm y el arnés sirve esas
copias en las mismas URL del CDN (`VEND=…`). El HTML apunta a jsDelivr de
verdad; **falta comprobarlo contra el CDN real** al publicar.

- `scripts/verificar.js`: **44 en verde, 0 en rojo** (`screenshots/verificacion.json`).
  Incluye: recorrido con rueda en 1440×900 y 390×844, consola limpia y cero
  404, sin desbordamiento horizontal, sin GSAP (cortina → `display:none`, página
  entera), movimiento reducido (contadores 55/4/28, el oficio cambia de paso,
  la báscula pesa), cortina a mitad (GSAP ralentizado ×0,12 solo para la foto)
  y de otro color que el fondo, cookies (`:not([hidden])`), menú móvil con
  backdrop-filter (alto 844 = `innerHeight`, se cierra con el mismo botón),
  mapa inexistente hasta el clic, cursor (aparece al primer movimiento de
  ratón, oculta el nativo, es «cuchillo» sobre la portada, nunca en táctil),
  dos densidades, tres paletas (color computado real, `aria-pressed`,
  `localStorage`, aplicada antes de `load` al recargar, logo fijo), pila sticky
  (5 × 433 px iguales, mismo `margin-bottom` 342 px, `::after` 108 px, 60 pasos
  de 90 px sin tarjetas fantasma), portada en 360×640 y 375×667 sin solapes,
  legal y 404, y ningún `[PENDIENTE]`/`TODO`/lorem.
- **Contraste**: `scripts/contraste.js`, 31 parejas, mínimo 4,58:1 en texto y
  7,51:1 en botones; las tres paletas, además, medidas en la página.
- **axe-core 4**: `AUDITORIA.md`, **0 infracciones** en 8 casos (portada
  escritorio, móvil, sobria, Azafrán, Ciruela, menú abierto, legal, 404). La
  primera pasada encontró `aria-label` en `<span>` en el titular partido: se
  cambió por texto oculto a la vista.
- **longtask** (`PerformanceObserver` en el propio `main.js`, carga en frío con
  caché deshabilitada, control con `setTimeout` que demuestra que el observador
  vive): ver tabla abajo. Con WebGL desactivado sigue habiendo una tarea de
  250–360 ms al cargar: es GSAP + fuentes + maquetación en este contenedor,
  no el código propio. El shader en SwiftShader añadía otra de hasta 640 ms; se
  pasó a su propia tarea detrás de la cortina y la peor bajó a ~350 ms.
  En una GPU real el shader cuesta una fracción de esto, pero **no se ha
  podido medir en dispositivo real**.
- `scripts/quitar-mandos.js`: la receta de borrado del README, **ejecutada
  sobre una copia**: sin rastro y `main.js` válido. Cazó un fallo real (el
  aviso del `<head>` quedaba fuera del bloque marcado).

| Pasada (carga en frío + recorrido completo con rueda) | Tareas largas (ms) | Peor |
|---|---|---|
| Escritorio 1440×900, pasada final | 338 · 283 (las dos al cargar, separadas: arranque y shader) | 338 |
| Móvil 390×844, pasada final | 248 · 50 · 156 · 55 · 69 | 248 |
| Escritorio, antes de separar el shader | 626 · 50 · 77 · 101 · 66 | 626 |
| Escritorio, 3 cargas sin WebGL (referencia) | 363 / 282 / 252 al cargar | 363 |

Fuera de la carga, durante el recorrido completo (anclado, pila, cinta), ninguna tarea pasa de 160 ms en este contenedor de CPU lenta y WebGL por software.

## Fallos cazados mirando, no leyendo código

1. **«contrarela»**: la Bodoni a `opsz 96` pierde los perfiles finos de la
   cursiva sobre la textura; «t» y «v» se leían «l» y «r». Portada a `opsz 28`.
2. Las letras del char-reveal con `will-change` recortaban la tinta fuera de su
   caja (la «C» y el asta de la «t»): fuera `will-change`, `clearProps` al
   terminar y holgura en `.palabra`.
3. El rótulo del anclado decía «05 Papel» con el dibujo aún en el gesto 4.
4. El borde redondo de la cortina enseñaba la portada por las esquinas desde
   el primer fotograma (alargadas 64 px por ese lado).
5. En movimiento reducido el oficio se quedaba en el paso que no era.
6. En emulación táctil un clic sintético de tipo «mouse» encendía el cursor:
   ahora exige además `(hover: hover) and (pointer: fine)`.
7. `evaluate(() => gsap.globalTimeline.timeScale(…))` colgaba el arnés 10 min
   (intentaba serializar la línea de tiempo devuelta). Anotado para el pliego.

## Decisiones tomadas solo

- **Sin fotografías.** «Nada sangriento» + registro de textura: una foto de
  archivo de carne cruda es lo que había que evitar, y el shader da la textura
  mejor que cualquier foto. Por eso `CREDITOS.md` solo acredita librerías y
  tipografías.
- **Los dos mandos (maqueta y color) en un solo panel**, oculto salvo con
  `?revision`. Las elecciones guardadas se aplican también sin `?revision`
  (si alguien las tocó en revisión, la navegación es coherente); el aviso de
  cookies y el legal lo dicen.
- **Nombres de producto en gallego** (androlla, botelo, unto, raxo, lacón) y
  todo lo demás en castellano.
- **No se hizo la segunda plantilla.** La primera quedó verificada hacia la
  01:00 UTC; quedaban ~1 h 30 min, pero una plantilla a este nivel ha llevado
  casi dos horas de construcción más una hora larga de verificación (cada
  pasada completa con WebGL por software tarda ~15 min). Una peluquería canina
  a medias habría ido contra «mejor una excelente que dos a medias».

## Lo flojo (honesto)

- **Solo Chromium**, WebGL por software y táctil emulado. Sin Firefox/Safari
  ni dispositivo real; sin lector de pantalla real.
- **jsDelivr no se ha probado de verdad** (bloqueado en este contenedor).
- La tarea larga de arranque (~250–350 ms en frío en este contenedor) no se ha
  podido atribuir con más precisión que «GSAP + fuentes + maquetación».
- Las siluetas de los animales son esquemáticas (estilo de cartel de despiece);
  un ilustrador podría darles más carácter. La cabeza de la ternera es lo más
  flojo del dibujo.
- La 404 no tiene el shader (a propósito: página ligera), solo el motivo en SVG.
- La sección «La casa» es la menos ambiciosa: «1971» gigante, contadores y dos
  opiniones; correcta pero convencional.

## Para publicar (lo aprueba el usuario)

1. Crear `alvarotaiagu/plantilla-carniceria-web` con el contenido de la carpeta.
2. Activar Pages y comprobar que GSAP/Lenis cargan desde jsDelivr.
3. Pasar `scripts/verificar.js` sin `VEND` contra la URL publicada
   (`BASE=https://…/plantilla-carniceria-web/`).
4. Rellenar repo y demo en `registro/carniceria.md` y consolidar en `REGISTRO.md`.
