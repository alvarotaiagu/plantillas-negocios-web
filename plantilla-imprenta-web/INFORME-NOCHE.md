# Informe de la noche · Imprenta «Tres Milímetros» (2026-10-02)

> Sitio de demostración. Tres Milímetros es un negocio ficticio; los datos,
> fotografías y opiniones son de muestra.

Segunda plantilla de la noche. La primera, la ferretería **Paso Fino**, quedó
terminada y verificada (58/58) en la rama `claude/noche-ferreteria` antes de
empezar esta; sobraba bastante más de una hora, así que se hizo la segunda
como pedía el encargo. Esta vive en la rama `claude/noche-imprenta`, carpeta
`plantilla-imprenta-web/`, con su ficha en `registro/imprenta.md`. **No** se
ha creado repo, **no** se ha activado Pages, **no** se ha tocado `main`,
`REGISTRO.md` ni `SECTORES.md`. Cada fase se empujó al acabarla.

## El negocio y por qué no choca con uno real

**Tres Milímetros · imprenta e copistería**, Rúa do Prelo, 14 · 36001
Pontevedra (calle inventada: *prelo* es la prensa de imprimir en gallego).
Rosa Quintáns Vidal (preimpresión y color) e Iago Barreiro Outón
(copistería, guillotina, encuadernación). 986 00 00 00 ·
`ola@tresmilimetros.example`. L–V 9:00–14:00 y 16:00–20:00, S 10:00–13:30.

Búsqueda web: **ninguna imprenta, copistería ni gráficas «Tres
Milímetros»**. El primer candidato, «Roseta» (el dibujo que forman las
tramas CMYK), se **descartó** porque existe una imprenta llamada «Códice
Roseta» en Latinoamérica: no es el mismo nombre, pero es del sector y el
pliego no deja margen. Mapa a Pontevedra, no a una calle. JSON-LD
`LocalBusiness` sin `aggregateRating` ni `review`.

## Concepto: «Registro»

Estar en registro es que las cuatro planchas caigan en el mismo sitio. Es la
promesa de la casa (revisamos tu archivo antes de imprimir) y el sistema
gráfico entero: cortina de planchas que casan, titulares que llegan
desregistrados y casan, cursor con forma de marca de registro, marcas de corte
y tira de control, folios con diana. El nombre son los **tres milímetros de
sangrado** que pide toda imprenta.

## Paleta

Papel estucado `#F4F1EA` / `#E9E4D8` / `#FBFAF6`, tinta `#16161A` (16:1),
gris `#55545C` (5,89:1 en el peor fondo), y las **tintas de proceso fijas**
(cian `#00A0E3`, magenta `#E6007E`, amarillo `#FFE500`). Marca magenta con
un tono aparte para texto `#A8005C` (blanco encima 7,45:1). Derivadas del
mando por rotación OKLCH: Cian `#018FAC`/`#00677C` y Bermellón
`#EC1C01`/`#AF0400`. Registro claro, opuesto a la ferretería (oscura).

## Tipografía

Funnel Display (variable) + Funnel Sans + Instrument Serif en cursiva para
los acentos + Red Hat Mono. Ninguna en el registro ni en la ferretería.

## Movimiento protagonista

El **cartel del hero pintado como cuatricromía real** en WebGL: el shader
pasa el cartel a CMYK y lo trama con cuatro retículas de puntos a 15°, 75°,
0° y 45° (la roseta). El cursor es un **cuentahílos ×3**; el scroll **acerca
la trama** y la lineatura baja en vivo (150 → 51 lpi); un scroll brusco
desregistra las planchas un instante. En táctil, el cuentahílos cruza el
cartel solo al hacer scroll. Secuencia anclada: el **proceso en seis pasadas
con scrub horizontal**, con las cuatro tintas superponiéndose y la guillotina
cayendo.

## Verificación (números)

Playwright 1.56 + Chromium headless, `scripts/verify.js`: **55
comprobaciones, 55 en verde** en la última pasada completa. Entre ellas:

- Cortina: dos fotogramas a medias capturados (planchas y canto curvo
  saliendo), color `#16161A` frente al papel, `display:none` al final en
  normal, sin GSAP y con movimiento reducido.
- Cuentahílos: la lupa aparece sobre el cartel y el aro del cursor se
  aparta; la lineatura baja con el scroll.
- Presupuestador: producto + cantidad cambian total, formato y el formato
  resaltado a escala.
- Proceso: anclado (pin) y la fila se desplaza en horizontal.
- Abanico: se abre al llegar y la hoja elegida cambia la ficha.
- Cursor: `cursor:none` en `body` y botones tras el primer `pointermove`,
  nada en táctil; menú móvil a 100dvh con `aria-expanded`; cookies que
  cierran de verdad; mapa sin iframe hasta el clic; formulario que valida y
  avisa del sangrado.
- Hero en **360×640 y 375×667** sin solapes y dentro de pantalla (en
  360×640 los botones se salían 11 px en la primera pasada: corregido).
- Sin GSAP: contenido visible, y la pista del proceso desborda y **solo
  entonces** es focusable (`tabindex="0"`).
- Reducido: lineatura, presupuesto, contadores y abanico siguen cambiando.
- Mando: se aparta con las cookies; sobria quita dianas, marcas de corte y
  desregistro y enseña la curva de precio, sin desbordar; vuelve; tres
  paletas que cambian el color **computado** del botón y la cinta y **no**
  el del logo; recarga sin parpadeo.
- **axe-core 4.10.2: 0 violaciones** en escritorio y en móvil.
- Consola limpia, cero 404, sin desbordamiento horizontal, sin marcadores.
- Receta del mando: `scripts/receta-mando.js` la aplica a una copia (9 + 16
  líneas de HTML, 4 + 9 de CSS, 23 de JS) y la copia carga limpia.

**Tareas largas** (en frío, `scripts/longtask.js`):

| Pasada | Carga (n · total · máx) | Recorrido entero |
|---|---|---|
| WebGL (SwiftShader) · escritorio | 2 · 354 ms · 244 ms | **0** |
| WebGL (SwiftShader) · móvil | 2 · 342 ms · 234 ms | **0** |
| Sin WebGL · escritorio | 2 · 189 ms · 120 ms | **0** |
| Sin WebGL · móvil | 2 · 174 ms · 116 ms | **0** |

El shader de trama es mucho más barato que el raymarching de la ferretería:
ni con la GPU por software deja una tarea larga al hacer scroll. Lo de la
carga es GSAP + fuentes + la compilación del shader en software.

**No comprobado** (falta de herramienta): jsDelivr bloqueado por la red del
contenedor (GSAP 3.12.5, ScrollTrigger y Lenis 1.1.13 se sirvieron desde npm,
mismas versiones, interceptando sus URL); sin GPU real, sin Firefox ni
Safari, sin dispositivo físico ni lector de pantalla.

## Decisiones tomadas solo

1. **Segunda plantilla sí**: la ferretería quedó cerrada con más de dos horas
   por delante.
2. **«Tres Milímetros» en vez de «Roseta»** (ver arriba).
3. **Las tintas de proceso no cambian con el mando de paleta**: son el
   oficio, no la marca; cambia solo el color de marca (botones, cinta).
4. **Sin pila sticky**: ya la usa la ferretería de esta misma noche; aquí el
   recorrido largo es horizontal y el catálogo es un abanico.
5. **Cartel abstracto** en el hero para no competir con el titular.

## Lo flojo

- Las **láminas del proceso** son correctas pero esquemáticas; la tercera
  (las cuatro tintas) es la única que se mueve de verdad con el scrub, junto
  con la guillotina.
- La **ilustración del cartel** es sencilla (sol, mar y barras de titular);
  la gracia está en la trama, no en el dibujo.
- La portada pierde algo de tamaño de titular frente a la ferretería porque
  comparte el ancho con el cartel.
- Verificado solo en Chromium con GPU por software: la nitidez real de la
  trama en una pantalla retina no la he visto.
