# Abogacía de plazos — «Trinquete» (3ª plantilla de la excepción del sector, 2026-09-20)

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Abogacía (laboral, extranjería, sucesiones y administrativo) | Ouzande Abogados (Ferrol, A Coruña) | «Trinquete» — la pieza que deja avanzar la rueda diente a diente y le impide volver atrás, que es exactamente lo que es un plazo | esfera `#EFECE4` / panel `#E4E0D5` / placa `#F8F6F1` / línea `#CDC7B7` / canto `#B3AA95` / acero `#23272E` / acero medio `#4F5762` + **dos latones**: de texto `#7E5A0B` y de superficie `#C08F2E`, rubí `#94202E`, y una caja oscura `#14171C`/`#1D2129`/hueso `#F4F1EA`/niebla `#A9B1BD`/latón claro `#D8A94A` para las dos secciones en negativo | Prata (solo el nombre) + Instrument Sans + Martian Mono | un **movimiento de relojería en canvas** que engrana de verdad —módulo compartido, distancia entre centros igual a la suma de radios primitivos y fase resuelta rueda a rueda— visto por una esfera calada, y que **acelera con el scroll**: el scroll le da cuerda | [alvarotaiagu/plantilla-abogados-trinquete-web](https://github.com/alvarotaiagu/plantilla-abogados-trinquete-web) | [demo](https://alvarotaiagu.github.io/plantilla-abogados-trinquete-web/) |

**Tercera plantilla de la excepción de abogacía** abierta en `SECTORES.md` el
2026-09-20 y ampliada de 2 a 3 en la misma fila, sin tocar ninguna otra. Las
tres son **especialidades distintas y no intercambiables**: (1) «Pórtico»,
mercantil de empresa; (2) «Contraluz», defensa penal; (3) «Trinquete»,
laboral + extranjería + sucesiones, es decir el despacho de calle al que se
llega con un papel en la mano y una fecha encima. Un escaparate mercantilista
no sirve para captar a ese cliente, ni al revés.

**Porqué del concepto:** las tres webs reales del sector (Blanco Regueiro
«Titulares», Castro Pombo «Escritura», MJ Ramos Castro «Cláusula») comparten
metáfora de **papel**; «Pórtico» es arquitectónica y «Contraluz» es penumbra.
«Trinquete» se aleja de las cinco: **metal**. La ley no como texto sino como
mecanismo — precisión y puntualidad en vez de solemnidad. Un trinquete es una
rueda de dientes de sierra con una uñeta que solo la deja girar en un sentido:
la imagen exacta de la preclusión. El indicador de avance de página es, en
consecuencia, **una manecilla que recorre un dial** en la cabecera, con su
arco de latón y su porcentaje, no una barra ni un folio.

Comprobado contra `REGISTRO.md` y las 33 fichas de `registro/` antes de
fijarlo: «Trinquete» está libre, y no hay ningún concepto de engranaje ni de
relojería en la biblioteca. **Vecino a vigilar:** «Cuenta atrás» (Rivand
Asesores) usa un dial de trimestres, pero es un cliente real de otro sector y
de otra carpeta, y allí el dial es un calendario fiscal, no un mecanismo.

**Estructura de secciones** (nueve piezas, distinta en orden y forma de la de
«Contraluz» —portada → derechos → primeras horas → asuntos → quién → honorarios
→ preguntas → contacto— y de la de «Pórtico»): cortina dentada → portada con
esfera calada → **el cuadrante de plazos** (una calculadora, lo primero de
todo, antes de hablar del despacho) → el tren de rodaje (anclado, oscuro) →
cinta de latón con los ocho plazos habituales → cuatro materias en pila sticky
→ tres personas y cuatro cifras → honorarios → preguntas → contacto. La
decisión de forma más fuerte es poner **la herramienta antes que la
presentación**: la sección 01 no cuenta nada del despacho, calcula tu plazo.

**La pieza que la distingue: el cuadrante.** Seis supuestos reales (despido,
sanción, reclamación de cantidad, resolución administrativa, tarjeta de
residencia caducada, fallecimiento), tres formas de contar (días hábiles
descontando fines de semana, días naturales y meses **de fecha a fecha** con
la regla de «si ese día no existe, el último del mes»), y salida con estado
—en plazo / apura / fuera de plazo—, día de inicio del cómputo, último día y
días restantes. El dial pinta el tiempo gastado y la aguja lo recorre. Lleva
un aviso fijo: descuenta sábados y domingos pero **no conoce los festivos**,
ni suspensiones ni interrupciones. Es la única concesión de la plantilla: una
web de abogados con una calculadora sin advertencia sería irresponsable
aunque sea de muestra.

**El mecanismo engrana de verdad, no está dibujado.** Cada rueda declara sus
dientes y su ángulo respecto a la anterior; el radio primitivo sale de
`módulo · N / 2` y el centro, de la suma de los dos radios. La fase de cada
hija se resuelve con la condición de engrane
`Nᵢ(θᵢ−αᵢⱼ) + Nⱼ(θⱼ−αⱼᵢ) ≡ π`, que **es constante en el tiempo** si la
relación de dientes es exacta: por eso las ruedas no se despegan por mucho que
giren ni por mucho que el scroll las acelere. Las velocidades se derivan hacia
atrás desde la rueda de escape, que avanza **un diente por segundo**. Sin
`ctx.filter` ni `shadowBlur`: cada rueda es un `Path2D` construido una sola vez
y por fotograma solo hay translate, rotate y fill/stroke.

**Obra gráfica propia, cero fotografía:** el logotipo (rueda de trinquete de 14
dientes de sierra con su uñeta apoyada y su rubí, generada con la misma función
que el mecanismo), la esfera con su minutería de 60 trazos y sus ocho rubíes,
las cuatro ruedas del canvas con el trinquete de la cuerda y el áncora del
escape, las cinco ruedas del tren, las cuatro complicaciones de las materias,
las tres piezas de las personas (volante con espiral, corona y trinquete), el
favicon, los PNG de la PWA y el `og.png` de 1200×630. Por eso no hay
`CREDITOS.md`. La decisión de no usar foto es deliberada: un despacho no tiene
producto, y un retrato de archivo le pondría la cara de alguien real a
personas que no existen.

**Recursos de movimiento** (PLIEGO §2, mínimo 5, aquí 9): Lenis como único
motor (`lerp` 0,17 por el scrub horizontal); char-reveal palabra a palabra con
`IntersectionObserver`; pila sticky de materias con el `<li>` como pegajoso;
marquesina de plazos en JS puro con la velocidad ligada a la rueda; botones
magnéticos; galería anclada con scrub horizontal para las cinco fases, con las
ruedas girando en sentidos alternos según el recorrido; cursor personalizado
(una rueda dentada que gira según lo que corre el ratón); hero de canvas con el
mecanismo, que **acelera con el scroll y vuelve solo a su marcha**; y
contadores. La cortina —dos medias platinas con los cantos dentados y
engranados, el segundero da una vuelta y las mitades se separan girando— no
cuenta para el mínimo porque es obligatoria.

**Accesibilidad:** ningún texto apagado con `opacity`; las **22 parejas** se
calcularon con `scripts/contraste.js` antes de cerrar el CSS y van de 4,75:1 a
15,92:1. Dos parejas se corrigieron ahí: el latón de texto sobre el panel
salía a 4,07:1 y subió a 4,75:1 oscureciéndolo de `#8A6412` a `#7E5A0B`, y el
marcador de los campos salía a 4,49:1 y subió a 5,12:1. De ahí sale la regla de
la casa de esta plantilla: **hay dos latones**, el de texto y el de superficie,
y no se intercambian. El acordeón de preguntas es `<details>` nativo, así que
funciona sin JS; la pista horizontal solo recibe `tabindex="0"` cuando de
verdad desborda.

**Cuatro fallos reales cazados mirando las capturas, no el código:**
1. **La cortina no se retiraba nunca del DOM.** `.cortina.oculta` (0,2,0)
   perdía por especificidad contra `html.js-si .cortina` (0,2,1), que la
   muestra. Con GSAP no se notaba —la línea de tiempo apartaba las dos mitades
   con un `yPercent`— y solo salió en la pasada con el CDN tumbado, donde la
   página se quedaba tapada. Se arregla repitiendo el `html.js-si` en la regla
   de retirada.
2. **La altura de diente estaba atada al radio** (`rp * 0.3`), así que dos
   ruedas engranadas tenían dientes de distinto tamaño aunque los radios
   cuadrasen. Va atada al **módulo** (`MODULO * 2.2`), que es lo que comparten.
3. **El logotipo tenía los dientes sueltos.** Eran diez triangulitos dibujados
   alrededor de un círculo: a 34 px en la cabecera colaba, y a 300 px en el
   `og.png` se veía que no tocaban la rueda. Se rehízo con la misma geometría
   que el mecanismo, y hizo falta una tercera pasada porque con 12 dientes
   altos y el hueco a r=10 la llanta era más fina que el diente y la marca se
   leía como un sol; se cerró con 14 dientes bajos, llanta gruesa y la uñeta
   apoyada, que es lo que la convierte en trinquete y no en engranaje.
4. **En móvil la lectura de la hora se montaba encima del reloj.** El
   `<figure>` era `position: relative` con el canvas y la esfera en `inset: 0`,
   así que al pasar el `figcaption` a estático caía dentro de la misma caja. Se
   separó: el reloj tiene ahora su propio `div` cuadrado y la lectura vive
   fuera.

Y dos trampas del pliego que se pagaron aquí en la propia verificación: el
buscador de marcadores pendientes daba **falso positivo con «MÉTODO»** del
menú, porque `innerText` aplica `text-transform` y ahí dentro está «TODO»
(se cambió a `textContent` con `\bTODO\b`); y el servidor local hay que
montarlo **bajo el prefijo del repo**, porque el `404.html` de una project
page necesita rutas absolutas y en la raíz daban 404 que no existen en
producción.

**Datos ficticios:** Ouzande Abogados, de la abogada Uxía Ouzande Brión, con
Brais Folgueira Recouso (sucesiones y administrativo) y Noa Cimadevila Rei
(responsable de plazos y notificaciones) · Rúa da Áncora, 21, 1º izq. · 15402
Ferrol (A Coruña) · 981 00 00 00 y 600 00 00 00 (aviso de plazo) ·
contacto@ouzandeabogados.example · L-J 9–14 y 16–19, V 9–14. Honorarios de
muestra en seis filas (50 € primera consulta, 750 € demanda por despido, 450 €
expediente de extranjería, 350 € recurso administrativo, 900 € tramitación de
herencia, 180 €/mes de iguala). Nombre comprobado por búsqueda web antes de
fijarlo: «Ouzande» no aparece como despacho ni como abogado en ninguna parte
(es una parroquia de A Estrada). En el camino se descartaron **Nogareda**
(existe J. Nogareda Abogados, Santiago y A Coruña), **Riobó** (Fidel Riobó
Soaxe, Caldas, y Rioboó Abogados), **Carnota** (José Manuel Carnota García, A
Coruña), **Amenedo** (Catarina Capeáns Amenedo, laboralista en A Coruña),
**Tasende** (Platas Tasende, decano del ICA Coruña) y **Verdía** (Verdía
Asesores y Verdía Legal Advice). Ferrol no lo usaba ninguna otra plantilla de
la biblioteca.

**Línea roja del sector (PLIEGO §1):** repasada al cerrar. `LegalService` a
secas, **sin `aggregateRating` ni `review`**; **sin testimonios y sin
porcentaje de asuntos ganados**, y la ausencia se explica en la propia página;
**sin número de colegiación inventado** (el aviso legal dice expresamente
dónde iría el real y por qué aquí no se fabrica: es una inscripción en un
registro público que existe). Sello de demostración en el pie de las tres
páginas, en el README y en un comentario HTML arriba del `index.html`, y
`noindex, nofollow` en las tres. Los **plazos legales sí son reales** —los
generales del ordenamiento español— y por eso llevan aviso de orientativos en
el cuadrante, en el pie y en el aviso legal.

**Verificación:** `scripts/verify.js`, 22 comprobaciones, todas en verde.
Playwright (Chromium) en 1440×900 y 390×844 (`isMobile` y `hasTouch` reales),
recorrido con `mouse.wheel`, fotogramas intermedios de la cortina y
comprobación de que acaba en `display:none` en los **tres** casos (normal, sin
GSAP y con movimiento reducido), pasada con jsDelivr tumbado (`route.abort`),
pasada con `prefers-reduced-motion: reduce` comprobando que el reloj y el
cuadrante siguen funcionando, y prueba por código de cookies, menú móvil,
mapa bajo clic, formulario, las dos ramas del cuadrante (vencido y en plazo),
anchura real del documento (`scrollWidth == innerWidth` en los dos tamaños) y
ausencia de marcadores. 37 capturas en `screenshots/`.

**Pendiente de esta plantilla:** sin auditoría automática de accesibilidad
(axe/Lighthouse) —el contraste está calculado con script, no auditado—, sin
medición de `longtask` ni de fps del canvas del hero, solo probada en Chromium
y sin lector de pantalla real.
