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

**Nueve plantillas auditadas, ocho terminan sin ninguna violación.** La única que
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
