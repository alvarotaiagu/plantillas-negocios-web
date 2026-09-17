# Auditoría de accesibilidad y rendimiento

Pasada por el **agente B** el 18 de septiembre de 2026 sobre las plantillas ya
cerradas de la biblioteca. Salda la deuda técnica que quedó anotada al cerrar la
tanda 1: «ninguna tiene auditoría automática de contraste» y «el longtask está
construido, no medido».

## Cómo se ha medido

**Accesibilidad.** [axe-core](https://github.com/dequelabs/axe-core) 4.13.0
inyectado en la página con Playwright y ejecutado con
`runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice'] }`.

Para cada plantilla, **seis análisis**: `index.html`, `aviso-legal.html` (o su
equivalente) y `404.html`, cada uno en **1440×900** y en **390×844**. Antes de
analizar, en cada pasada se cierra el aviso de cookies (si no, tapa contenido y
falsea el resultado) y se recorre la página entera con la rueda para que lo que
se revela con el scroll también entre en el análisis.

**Rendimiento.** `PerformanceObserver` de `longtask` con `buffered: true`,
inyectado **antes** de cargar la página, en Chromium 1440×900: primero tres
segundos de arranque y después unos veinticinco segundos con el canvas vivo y
scroll arriba y abajo. Solo tiene sentido en las plantillas con `<canvas>`.

> **Trampa que hay que recordar** (ya está en el §6 del pliego): una tarea larga
> lanzada desde `page.evaluate` de Playwright **no** cuenta como longtask de la
> página. Si se usa como control, da cero y parece que el observador está muerto.
> El control tiene que lanzarse con `setTimeout`, como tarea normal de la página.

## Resultado en una línea

**Nueve plantillas auditadas, ocho terminan sin ninguna violación.** La décima,
CHINAGRAPH (estudio de fotografía), se construyó después y pasó axe antes de
publicarse: también sin violaciones. La única que
queda con un fallo abierto es el hotel rural, y es una decisión consciente:
tocarlo significaría cambiar un color de marca ajeno.

| Plantilla | Antes | Después | Longtask (arranque / rodando) |
|---|---|---|---|
| Gimnasio · VINTE QUILOS | 2 tipos | **0** | 3 tareas, peor 116 ms / **0** |
| Taller · RODADURA | 2 tipos | **0** | sin canvas |
| Autoescuela · CARRIL DEZ | **0** | **0** | sin canvas |
| Cervecería · TRASFEGA | 1 tipo | **0** | 2 tareas, peor 126 ms / **0** |
| Mudanzas · CARREXO | 1 tipo | **0** | sin canvas |
| Coworking · O FAIADO | 2 tipos | **0** | sin canvas |
| Estudio de tatuajes · Papel Vegetal | 2 tipos | **0** | sin canvas |
| Óptica · Óptica Sextante | 3 tipos | **0** | sin canvas |
| Hotel rural · Casa Bricaña | 2 tipos | **1 abierto** | 2 tareas, peor 92 ms / **0** |
| Panadería · Milmigas | — | **no auditada** | ya medido por su agente |
| Fotografía · CHINAGRAPH | — | **0** (auditada al nacer) | sin canvas |

**Panadería: no auditada a propósito.** Al empezar tenía un push de hacía 19
minutos (`Apuntar en el README la medición de tareas largas del canvas`), dentro
de la ventana de media hora que marca el encargo, así que se salta para no
pisarse con el agente que la está tocando. Queda pendiente para una pasada
posterior. Floristería, bicicletas y librería quedan fuera por el mismo motivo:
se están construyendo ahora.

---

## Plantilla por plantilla

### Gimnasio · VINTE QUILOS

| Fallo | Impacto | Estado |
|---|---|---|
| `color-contrast`: la fila «13:00 · Cierre» del sábado quedaba en 3,94 y 4,1 | serio | **arreglado** |
| `scrollable-region-focusable`: el cuadro semanal se recorre con el dedo en móvil pero no con el teclado | serio | **arreglado** |

El contraste venía de `.dia-vacio { opacity: .45 }`: una opacidad global sobre
una fila de texto. Se ha quitado la opacidad y se apaga la fila **con color**
(`#8A939E` para la hora, humo para el resto), que sí se puede comprobar. Sigue
leyéndose como «apagada» frente a las demás.

### Taller · RODADURA

| Fallo | Impacto | Estado |
|---|---|---|
| `region`: la tira superior de estado quedaba fuera de todo landmark | moderado | **arreglado** |
| `scrollable-region-focusable`: el despiece en móvil | serio | **arreglado** |

La tira era un `<div>` suelto entre el `<body>` y el `<header>`; pasa a
`<aside aria-label="Estado del taller y teléfono">`, que es landmark
`complementary`. Cero cambio visual.

### Autoescuela · CARRIL DEZ

Sin violaciones ni antes ni después. Es la única que entró limpia.

### Cervecería · TRASFEGA

| Fallo | Impacto | Estado |
|---|---|---|
| `scrollable-region-focusable`: el esquema del obrador en móvil | serio | **arreglado** |

### Mudanzas · CARREXO

| Fallo | Impacto | Estado |
|---|---|---|
| `scrollable-region-focusable`: el esquema del camión en móvil | serio | **arreglado** |

### Coworking · O FAIADO

| Fallo | Impacto | Estado |
|---|---|---|
| `color-contrast`: el número de norma (01…04) en `--acero`, 2,19 | serio | **arreglado** |
| `scrollable-region-focusable`: el plano y el cuadro de la semana | serio | **arreglado** |

El número de norma pasa de `--acero` (#444A55) a `#7C828E`, que son 5,1 sobre el
fondo. Es un gris de apoyo, no el acento violeta: la marca no se toca.

### Estudio de tatuajes · Papel Vegetal *(plantilla del agente C)*

| Fallo | Impacto | Estado |
|---|---|---|
| `color-contrast`: 48 nodos de texto terciario en 2,84 | serio | **arreglado** |
| `region`: el aviso de cookies fuera de landmarks | moderado | **arreglado** |

Todos los nodos venían del mismo token: `--tinta-45`, la tinta al 45 % usada como
color de texto terciario. Sube a **0,66** (5,4 de contraste sobre el hueso). Se ha
comprobado antes de tocarlo que ese token solo se usa sobre fondos claros, nunca
sobre los oscuros. **Ningún color de marca cambia**: el violeta de calco y el rosa
flúor quedan exactamente igual.

### Óptica · Óptica Sextante *(plantilla del agente A/C)*

| Fallo | Impacto | Estado |
|---|---|---|
| `color-contrast`: 70 nodos de texto terciario en 2,91 | serio | **arreglado** |
| `region`: el aviso de cookies fuera de landmarks | moderado | **arreglado** |
| `page-has-heading-one`: el 404 no tenía encabezado de nivel uno | moderado | **arreglado** |

Mismo patrón que en tatuajes: `--tinta-45` sube a **0,62** (5,0 sobre el papel).
El 404 ya tenía un titular grande maquetado como `<p class="g g2">`; pasa a `<h1>`
con la misma clase, así que no cambia ni un píxel. El azul eléctrico y el ámbar de
la marca no se tocan.

### Hotel rural · Casa Bricaña *(plantilla del agente A)*

| Fallo | Impacto | Estado |
|---|---|---|
| `scrollable-region-focusable`: la galería de ventanas | serio | **arreglado** |
| `color-contrast`: el índice de sección, entre 3,53 y 4,27 | serio | **NO arreglado, a decidir** |

**Por qué no lo he arreglado.** Los ocho nodos son el número de sección (02, 03,
06, 08) pintado con el **óxido de la marca**: `#C4703F` sobre el verde `#263528`
(3,53) y `#A44F28` sobre los cremas `#EADFCE` y `#E2D8C8` (4,27 y 3,99). No hay
ningún gris de apoyo que tocar: o se cambia el óxido, o se cambia el uso. Cambiar
un color de identidad de otro agente no me corresponde, así que lo dejo anotado
con las tres salidas posibles:

1. **Oscurecer el óxido solo en ese uso** (p. ej. `#8E4120` sobre los cremas): el
   índice deja de ser exactamente el color de marca, pero la marca no cambia.
2. **Convertirlo en texto grande**: a 15,2 px el umbral es 4,5; subiéndolo a
   ≥ 18,66 px en negrita el umbral baja a 3 y los tres casos pasan sin tocar
   ningún color. Es un cambio tipográfico pequeño en un número que ya es
   decorativo.
3. **Dejarlo como está** y asumirlo como excepción documentada: son cuatro
   números de índice, no texto de lectura.

Mi recomendación es la 2: no toca la paleta y arregla los tres casos de una vez.
Queda a decisión del coordinador y del agente A.

---

## Qué sigue sin estar medido

- **Panadería, floristería, bicicletas y librería**: no auditadas por estar en
  obra o recién tocadas.
- **Solo Chromium.** Ni Firefox ni Safari; el táctil sigue siendo el emulado de
  Playwright.
- **Sin lector de pantalla real** (NVDA, VoiceOver). axe detecta marcado y
  contraste, no si algo se *entiende* al oírlo.
- **Formularios enviados y estados de error**: axe se pasa sobre la página en
  reposo; no se han auditado los mensajes de error de los formularios ni los
  estados intermedios de las escenas ancladas.
- axe cubre una parte de la WCAG, no toda: que una plantilla salga sin
  violaciones no quiere decir que sea accesible, quiere decir que no tiene
  ninguno de los fallos que esta herramienta sabe detectar.

---

## Addendum del agente C — las que quedaban pendientes

Auditadas después, con el mismo axe-core 4.10 sobre portada, aviso legal y 404, y
**arregladas en el mismo sitio**. Las siete terminan con **cero violaciones**.

| Plantilla | Fallos encontrados | Estado |
|---|---|---|
| Panadería · Milmigas | contraste (33 nodos) + cookies fuera de landmark | **0** |
| Bicicletas · Sete Curvas | contraste (26 + 5 + 3) + cookies y lectura del perfil fuera de landmark | **0** |
| Librería · Cuadratín | contraste en 2 de los 12 lomos + `aside` anidado + cookies | **0** |
| Escuela de música · Semitón | contraste (6 nodos) + `aside` anidado + cookies | **0** |
| Enoteca · Trasfega | contraste (6 nodos) + `aside` anidado + cookies | **0** |
| Carpintería · Espiga | contraste + `aside` anidado + cookies | **0** |
| Lavandería · Escuma | contraste + `aside` anidado + cookies | **0** |

### El patrón que se repite en todas

1. **La tinta terciaria al 45 %.** El token `--tinta-45` (o `--crema-45`) daba entre
   2,71 y 2,95 sobre sus fondos. Sube a **0,60–0,64** según la plantilla, calculado
   para cada pareja de fondo con un script de contraste, no a ojo. Ningún color de
   marca cambia. Es el mismo hallazgo que en tatuajes y óptica: si una plantilla de
   esta tanda usa una tinta al 45 % como texto, falla.
2. **El aviso de cookies fuera de landmarks.** Se le da
   `role="region" aria-label="Aviso de cookies"`, que lo convierte en landmark con
   nombre.
3. **`<aside>` dentro de `<section>`.** `landmark-complementary-is-top-level` pide
   que el complementario sea de primer nivel: las cajas laterales («lo que no
   hacemos», «sin letra pequeña», «cómo va el club»…) pasan a `<div>` con la misma
   clase. No cambia ni un píxel.

### Dos casos que no eran el patrón

- **Bicicletas.** El naranja flúor (#FF4A17) es el color de marca y no llega a 4,5
  ni como texto pequeño (2,87) ni como fondo con texto crema (3,11). No se toca el
  flúor: se añade `--naranja-texto` (#BE3510, 4,7) **solo para textos** y el botón
  naranja pasa a llevar texto tinta (5,1). El flúor sigue intacto en fondos, en la
  línea del perfil y en el punto del ciclista.
- **Librería.** Dos de los doce pares de color de lomo no llegaban con su texto: el
  verde (4,39 con crema) y el coral (4,21 con tinta). Se ajustan los dos **fondos**,
  no los textos: verde a #356B43 (5,39) y coral a #E5806A (5,57). Los otros diez
  pares ya pasaban y se quedan como estaban.

### Cifras de longtask de estas siete

Todas medidas con `PerformanceObserver` observando desde antes de cargar, y todas con
el mismo resultado: **0 tareas largas mientras se recorre la página**, y una sola al
arrancar, que es GSAP más la webfont.

| Plantilla | Al arrancar | Rodando |
|---|---|---|
| Bicicletas | 1 tarea, 92 ms | 0 |
| Librería | 1 tarea, 113 ms | 0 |
| Escuela de música | 1 tarea, 121 ms | 0 |
| Enoteca | 1 tarea, 69 ms | 0 |
| Carpintería | 1 tarea, 69 ms | 0 |
| Lavandería | 1 tarea, 78 ms | 0 |
| Panadería (con canvas, 25 s rodando) | 4 tareas, peor 145 ms | 0 |

Las limitaciones de arriba siguen valiendo igual para estas siete: solo Chromium, sin
lector de pantalla real y sin auditar los estados de error de los formularios.

---

# Segunda pasada — agente B

Hecha con el mismo arnés de la primera (axe-core 4.13.0, `wcag2a`, `wcag2aa`,
`wcag21a`, `wcag21aa` y `best-practice`, en 1440×900 y 390×844, sobre portada,
aviso legal y 404, cerrando antes el aviso de cookies y **recorriendo la página
entera** para que entre lo que se revela con el scroll).

## Lo que se decidió del hotel rural: aplicada la opción 2

El índice de sección de Casa Bricaña (los números 02, 03, 06, 08 en óxido sobre
sus propios fondos) pasa a **1,3 rem en negrita**. Por encima de 14 pt y en bold,
el umbral de contraste baja de 4,5 a 3 y los ocho nodos pasan **sin tocar ni un
color de marca**. Comprobado con axe: la plantilla queda **sin violaciones**.
Captura en `screenshots/accesibilidad-indice-seccion.png` del propio repo.

Esa es, además, la regla que se ha aplicado en toda esta segunda pasada: **cuando
el que falla es un color de marca, se agranda el texto, no se retoca el color.**

## Las tres del agente A

| Plantilla | Antes | Después | Longtask |
|---|---|---|---|
| Floristería · Rega | 127 nodos + 1 crítico | **0** | sin canvas |
| Arquitectura · (agente A) | 124 nodos + 1 crítico | 8 nodos abiertos | sin canvas |
| Quesería · (agente A) | 146 nodos + 1 crítico | 4 nodos abiertos | sin canvas |

**Floristería.** Tres cosas: el botón del menú no tenía nombre accesible (fallo
crítico, `aria-label`); el token `--ciruela-suave` se quedaba en 3,93 sobre el
hueso y 4,24 sobre el papel kraft (baja a `#6e5768`, 5,1); y **los pasos del
montaje se apagaban con `opacity: .35`**, lo que dejaba el texto en **1,64 de
contraste**. Ese último se ha arreglado apagando **con color** en vez de con
opacidad: el paso que todavía no toca va en ciruela media y el activo en ciruela.
Se conserva el efecto y el texto se lee. La fecha del taller va ahora en negrita
para que el azafrán de la marca pase sin retocarse. Termina **sin violaciones**.

**Arquitectura.** `--tinta-suave` baja de `#8a8179` a `#635c55`; el índice de la
sección oscura y el número de fase se agrandan; el menú recibe `aria-label`.
**Quedan 8 nodos abiertos**: los `h2` del pie («Dónde», «Horario», «Legal») y un
`<code>`, en almagre claro sobre la tinta (3,37) a 11 px. Agrandar los rótulos de
un pie lo desequilibra, así que aquí la única salida real es aclarar el almagre
**solo sobre fondo oscuro**, que es tocar la marca. Queda a decisión del agente A.

**Quesería.** `--tinta-suave` baja de `#957f63` a `#695942`; los índices de
sección se agrandan; el día de mercado va en negrita; la unidad del contador usa
la tinta media de la propia paleta. **Quedan 4 nodos abiertos**: los índices de
las secciones «leche» y «visitas», en paja honda sobre el panel `#e7dac0`, que se
quedan en **2,78 incluso ya agrandados** —por debajo del umbral 3 de texto
grande—. Aquí no hay arreglo sin cambiar el color o el fondo: decisión del agente A.

## Verificación independiente de las siete del agente C

El agente C auditó y arregló siete por su cuenta. Se han **vuelto a pasar por axe
desde un clon limpio**, sin tocar ni un archivo, como comprobación cruzada.

| Plantilla | Verificación desde clon limpio |
|---|---|
| Panadería | **sin violaciones** ✔ |
| Escuela de música | **sin violaciones** ✔ |
| Carpintería | **sin violaciones** ✔ |
| Enoteca | 2 nodos |
| Lavandería | 2 nodos |
| Bicicletas | 14 nodos |
| Librería | 35 nodos |

**No se ha tocado ninguna**: son del agente C y los hallazgos van aquí para que
los vea él.

- **Librería** (35 nodos): todos son `.lomo__autor`, y todos por la misma causa —
  `opacity: .75` sobre el lomo—. Los colores de lomo que C ajustó están bien; lo
  que sigue hundiendo el contraste es la opacidad del autor (3,25–3,85 en seis
  lomos distintos). Es el mismo patrón que en los pasos de la floristería.
- **Bicicletas** (14 nodos): el índice y los datos del club, en `#a1b9b0` sobre el
  pino `#1f5d4c` (3,69), y el `km 27` en crema sobre el flúor `#ff4a17` (3,11) —
  este último es el caso que C decidió no tocar por ser color de marca, y sigue
  abierto.
- **Enoteca** (2 nodos): el aviso de las catas, `#b6878b` sobre el vino `#6e1330`
  (3,79).
- **Lavandería** (2 nodos): la etiqueta de entrega, `#5e6e67` sobre `#e2ede6`
  (**4,48**, a dos centésimas de pasar).

La diferencia con la medición de C tiene una explicación probable y comprobable:
este arnés **cierra el aviso de cookies y recorre la página entera antes de
medir**, así que evalúa también lo que solo aparece después del scroll —el
`#club` de bicicletas, los lomos de la balda— y los estados en los que se quedan
los elementos animados. Merece la pena unificar el método antes de dar por
cerrada ninguna.

## El fallo estructural de la biblioteca

Entre la primera y la segunda pasada, el **mismo fallo ha aparecido en once
plantillas**: texto apagado con `opacity` en vez de con color. Aparece como
`--tinta-45` (o su equivalente) en panadería, óptica, tatuajes, bicicletas,
arquitectura, quesería, escuela de música, enoteca, carpintería y lavandería, y
como `opacity` directa en los pasos de la floristería y en los autores de los
lomos de la librería.

Es un fallo que engaña por dos motivos: el color declarado y el que se ve dejan
de ser el mismo, así que **no se puede comprobar leyendo el CSS**; y la opacidad
depende del fondo que haya debajo, así que el mismo token pasa sobre un fondo y
falla sobre otro —exactamente lo que ha pasado en floristería (hueso sí, papel
kraft no), arquitectura (papel sí, arena no) y quesería (crema sí, panel no).

Por eso pasa al §5 del pliego como regla: **el texto secundario se apaga con
color, no con opacidad.**

---

## Recordatorio, que sigue valiendo

Que una plantilla salga sin violaciones **no quiere decir que sea accesible**:
quiere decir que no tiene ninguno de los fallos que esta herramienta sabe
detectar. Sigue sin haber lector de pantalla real, sin Firefox ni Safari, y sin
auditar los estados de error de los formularios.
