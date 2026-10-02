# Informe de la noche — Debandoira (gabinete de psicología)

> Sitio de demostración. Debandoira es un negocio ficticio; los datos,
> fotografías y opiniones son de muestra.

Rama `claude/noche-psicologia`, carpeta `plantilla-psicologia-web/`. No se ha
creado repo, ni activado Pages, ni tocado `main`, `REGISTRO.md` o
`SECTORES.md`. La ficha va en `registro/psicologia.md` («Demo»: pendiente de
publicar).

## El negocio y por qué no choca con uno real

**Debandoira · gabinete de psicología**, Rúa das Fiadeiras, 14, 1.º · 27001
Lugo · 982 00 00 00 · ola@debandoira.example. Sabela Toimil Corral (adultos y
pareja, «desde 2014») y Breixo Leis Andión (adolescentes y familias, «desde
2019»). Colegiaciones G-00000 y G-00001 y registro sanitario C-27-000000,
marcados «de muestra» en la página, el pie y el aviso legal.

Comprobado con búsqueda web antes de fijarlo:

- «Debandoira» + psicología / psicoloxía / gabinete / Lugo: ningún resultado
  del sector (los gabinetes que salen en Lugo tienen otros nombres).
- «Rúa das Fiadeiras» en Lugo: no existe (solo sale una «Rua das Fiandeiras»
  en São Paulo).
- «Sabela Toimil» y «Breixo Leis» como psicólogos: ningún resultado.
- Teléfono con forma de muestra (982 00 00 00), correo en `.example`.

El único dato real es el **024**, como pedía el encargo.

## Concepto, paleta, tipografía, movimiento

- **Concepto «Ovillo»**: se llega con un ovillo; el trabajo es encontrar el
  cabo y tirar del hilo, sin prisa. Evita a propósito «desenredar» (sería
  prometer un resultado). El nombre es la devanadera gallega.
- **Paleta «tintes de lana»** (rubia, añil, gualda sobre lana cruda). Es mía
  frente a la biblioteca y frente a los otros siete agentes de esta noche:
  el fondo es lana cruda **rosada** (`#F4E9E1`), no hueso ni crema; la tinta es
  **azul noche** (`#1E2235`), no marrón; y el acento es rojo de granza con su
  pareja de añil. Ninguna ficha tiene esa combinación.
- **Tipografía**: Literata variable (opsz + wght, con cursiva) + Albert Sans
  variable. Ninguna de las dos aparece en las 34 fichas.
- **Movimiento protagonista**: el ovillo del hero, en canvas 2D, con física de
  cuerda en el cabo; tira y el titular se tensa (eje `wght`); baja y se devana.

## Verificación, con números

Entorno: Playwright 1.56 + Chromium. Servidor propio (`scripts/servidor.js`)
que imita GitHub Pages bajo el prefijo del repo.

| Qué | Resultado |
|---|---|
| `scripts/verificar.js` | **54/54** en verde |
| Consola y peticiones | 0 errores, 0 respuestas ≥ 400 (escritorio y móvil) |
| Anchura | `scrollWidth == innerWidth` en 1440 y 390 |
| Escena anclada | llega a «06» con los seis nudos encendidos, en escritorio y móvil |
| Cortina | 7 fotogramas guardados (350 → 2900 ms; el de 1950 ms enseña el borde curvo a media subida); `display:none` al final en normal, sin GSAP y con movimiento reducido; color añil distinto del fondo |
| Sin GSAP (CDN abortado) | página entera: 6 pasos visibles, 0 letras ocultas, horario y contador vivos |
| Movimiento reducido | ídem, conmutador funcionando, ovillo quieto pintado una vez |
| Cookies | visible al entrar, el botón la cierra (`display:none`), el mando aparece solo entonces |
| Densidades | Ovillo: 4 dibujos; Sobria: 0 dibujos, 4 bloques de datos, gráfico de 4 barras, sin hilo del margen; vuelta atrás bien; sin desbordamiento |
| Paletas | el color computado del botón cambia en las tres (`rgb(138,54,40)` / `(97,66,138)` / `(15,93,34)`), `aria-pressed` y `localStorage` bien, la clase está ya en `domcontentloaded` tras recargar, el logo no cambia |
| Contraste | 63 parejas (21 × 3 paletas), todas pasan; la más baja, 5,40:1 |
| Mapa | 0 iframes antes del clic, 1 después (`google.com/maps?q=…&output=embed`) |
| Menú móvil | abre con `aria-expanded=true`, `top:0` y alto 844 = `innerHeight` (100dvh), y el mismo botón lo cierra |
| Cursor | `cursor:none` solo tras el primer `pointermove` de ratón; cambia en enlaces; «tira» sobre el ovillo; nada en táctil |
| Tensión | al tirar del cabo, `wght` del titular > 330 (medido 414) |
| Pila sticky | `<li>` sticky, 4 alturas iguales (337 px escritorio, 360 px móvil) = la mayor tarjeta medida por JS, mismo `margin-bottom`, `::after` de reposo; 40 pasos de 90 px sin que ninguna tarjeta quede por encima de la anterior |
| Portada móvil | 360×640 y 375×667: sin solapes entre ovillo, cabecera, antetítulo, titular, entradilla y botones |
| Marcadores | 0 `[PENDIENTE]`, `TODO`, `FIXME`, lorem; `noindex, nofollow`, sello y comentario arriba en las 3 páginas; modo estándar |
| axe-core | **0 violaciones** en portada escritorio, móvil, sobria, aviso legal y 404 |
| `longtask` en frío | escritorio: 91 + 50 ms al cargar, **0** al hacer scroll; móvil con CPU ×4: 552 + 148 ms al cargar, 0 al hacer scroll; control de 120 ms lanzado con `setTimeout`, detectado |
| fps del ovillo | 61 en escritorio; 47–51 en móvil con CPU ×4 |
| Receta de borrado | aplicada sobre copia en las dos direcciones, sin rastro, la copia carga sin errores |

Capturas en `screenshots/` (64 JPEG): las 14 secciones en escritorio y en
móvil, fotogramas de la cortina, pila cada ~720 px, sin GSAP, reducido,
sobria, paletas, menú abierto, mapa cargado, legal y 404. Las miré todas.

## Decisiones tomadas solo

1. **Mandos ocultos salvo `?revision`**, los dos (versión y color), porque el
   encargo lo pedía así para el de densidad y no tiene sentido enseñar uno sí y
   otro no. La elección guardada se aplica aunque no haya `?revision` (solo
   pudo guardarla quien usó los mandos).
2. **Cuatro áreas, no tres**: añadí «Orientación a familias» (sin el menor
   delante), que es el complemento natural de «Adolescentes» y no necesita
   imagen de nadie.
3. **Sin testimonios**: el encargo permitía alguno sin detalles clínicos; no
   puse ninguno y lo explico en el aviso legal. En un gabinete real tampoco
   conviene, y una plantilla que los traiga invita a rellenarlos.
4. **El 024 en una franja fija de la cabecera**, en todas las páginas, y no
   solo en contacto: «nota visible» tiene que serlo desde la primera pantalla.
   En móvil se acorta a «¿Estás en crisis? Llama al 024 · gratuito, 24 horas».
5. **Musgo oscurecido** fuera de la rotación pura de matiz, porque el verde se
   sale de gama y el botón bajaba a 6,6:1.
6. **Pesos de Literata**: 250–300 en titulares; el eje `wght` se reserva para
   un solo gesto (la tensión del hilo) y no se usa como adorno en más sitios.
7. **Arnés de pruebas**: jsDelivr devolvía 403 desde este entorno y Google
   Fonts fallaba a ratos en Chromium (`ERR_TOO_MANY_RETRIES`). El arnés sirve
   GSAP/Lenis desde npm (mismas versiones que el HTML) y las fuentes desde una
   caché de `curl`. **La web sigue apuntando a jsDelivr y Google Fonts.** No he
   podido comprobar en vivo que las URL de jsDelivr respondan 200 (bloqueadas
   aquí); son las rutas estándar de `gsap@3.12.5` y `lenis@1.1.13`.

## Lo flojo

- **Solo Chromium** y táctil emulado. `backdrop-filter`, `clip-path` animado y
  `100dvh` pueden diferir en Safari.
- **Sin lector de pantalla real**; axe no dice cómo suenan los titulares
  partidos.
- **El hilo suelto en la mesa** se queda bastante recto cuando el ovillo se ha
  devanado mucho: la cuerda tiene 30 nudos y en el suelo solo hay fricción. Más
  nudos o un poco de ruido lateral lo harían más «lana».
- **El dibujo de la consulta** es correcto pero sencillo al lado del ovillo; es
  el sitio donde más ganaría una segunda pasada de ilustración.
- **En móvil, la escena anclada deja aire** entre el paso y el hilo de nudos
  en pantallas altas (844 px).
- **No he podido comprobar jsDelivr en vivo** (bloqueado en el entorno).

## Segunda plantilla

Con esta cerrada y verificada antes de medianoche, se hizo también la de
**dietista-nutricionista**: **Fiambreira** (Ourense, concepto «Mantel», mantel
de vichy en WebGL), en la rama `claude/noche-nutricion`, carpeta
`plantilla-nutricion-web/`, con su propio `INFORME-NOCHE.md`, 55/55
comprobaciones y axe sin violaciones. Ficha en `registro/nutricion.md` de esa
rama.
