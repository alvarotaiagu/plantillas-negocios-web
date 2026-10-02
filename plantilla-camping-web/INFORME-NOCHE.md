# Informe de la noche — Camping A Piqueta

> Sitio de demostración. Camping A Piqueta es un negocio ficticio.

Segunda plantilla de la noche del 2026-10-02, hecha porque la primera
(escuela de surf, rama `claude/noche-escuela-surf`) quedó verificada en 46/46
con más de una hora por delante. Rama `claude/noche-camping` desde `main`,
carpeta `plantilla-camping-web/`. Sin repo nuevo, sin Pages, sin tocar `main`,
`REGISTRO.md` ni `SECTORES.md`; ficha en `registro/camping.md`.

## El negocio, y por qué no choca con uno real

**Camping A Piqueta**, Camiño das Bidueiras, 3, 27650 Navia de Suarna (Lugo)
· 982 00 00 00 · reservas@apiqueta.example. *A piqueta* es la estaca de la
tienda. Buscado antes de fijarlo: «Camping A Piqueta» / «Camping Piqueta» no
existe (solo salen tiendas que venden piquetas). Descartados por el camino:
**Parada de Sil** (está el Camping Cañón do Sil), **Cervantes** (Camping Os
Ancares, en Mosteiro) y **«Os Ventos»** (demasiado cerca de Fuxan os Ventos
y de un «Camping Torre dos Ventos» brasileño). La calle es inventada.

## Concepto: «Vientos»

Los vientos son las cuerdas que tensan una tienda contra sus piquetas. Una
lona floja aletea toda la noche; una tensa no se oye. Lo que vende un camping
de montaña es dormir bien, y la web lo convierte en física: la portada es una
lona de rayas simulada que **el cursor sopla** y **el scroll tensa**.

## Paleta y tipografía

Lona `#EFE7D6`, tinta verde bosque `#1F2A22`, musgo `#4A5A44` para el texto
secundario y **un acento, cuerda** `#D2502A` (con `#8A2E10` para texto y
botones, `#F2895C` sobre la noche). Alternativas derivadas por script: Xesta
y Lousa. 29 parejas comprobadas con `scripts/contraste.js`. Registro claro y
cálido a propósito, el contrario exacto de la de surf de esta misma noche.
**Instrument Serif + Rethink Sans + Fragment Mono**, ninguna en el registro;
€, ñ, tildes y « » comprobados en las capturas.

## Movimiento protagonista

- **La lona**: malla Verlet en 3D (26×14 en escritorio, 16×10 en móvil),
  cuatro iteraciones de restricciones por fotograma, colgada de una cumbrera
  con cinco puntos fijos y sujeta por dos vientos a sus piquetas. Sombreado
  por normal en cada cuadrilátero, sin `filter` ni `shadowBlur`. El cursor
  empuja las partículas cercanas con su velocidad; el scroll acorta los
  vientos de +12 % a −6 % y la lona deja de aletear. Sin movimiento, se
  asienta 240 pasos y se pinta una vez.
- **Montar** (anclada con scrub): sitio, suelo, varillas que se trazan,
  piquetas a 45° y vientos; la lona pasa de arrugada a tensa y el porcentaje
  sale del mismo cálculo.

## Verificación (números)

Mismo arnés del §7 que la de surf, adaptado: `scripts/verificar.js`, 47
comprobaciones.

- **47/47 en verde** en la segunda pasada; la tercera (tras el arreglo de
  móvil de abajo) en `screenshots/resultado.json`.
- Cortina a medias capturada en escritorio, móvil y sin GSAP; `display:none`
  en los tres casos.
- Portada 360×640 y 375×667 sin solapes; sin desbordamiento en 1440 y 390.
- Plano: filtros 42 → 10 (río) → menos con sombra, ficha por clic y por
  teclado (flechas + Intro). Tarifas: temporada baja y 7 noches → «pagas 6
  de 7».
- Cookies, menú móvil con toques reales, mapa bajo clic, formulario.
- Mandos: dos densidades y tres paletas con contraste medido sobre colores
  computados; guardada aplicada al recargar.
- **Tareas largas: 0** con la lona y el scroll vivos 20 s (61 fps); al
  arranque, 3 (la peor, 109 ms: GSAP + fuentes).
- **axe-core: 0 violaciones** en portada (escritorio, móvil y sobria), aviso
  legal y 404.
- Receta de borrado de mandos comprobada por script: 7 bloques en 4 archivos.

## Fallos cazados

- **La cortina «no se veía a medias»**: el arnés medía `#cortina` y aquí GSAP
  mueve la lona de dentro (las cuerdas se recalculan aparte). Se ajustó la
  medida; la cortina sí se levantaba.
- **La ficha de parcela era un `aside` dentro de una sección** (axe). Pasa a
  `div` con `aria-live`.
- **En móvil la tabla de tarifas se cortaba por la derecha**: la calculadora,
  con dos columnas de inputs, ensanchaba la rejilla (`min-width:auto` de los
  hijos de grid). `min-width:0` y inputs al 100 %. Visto en la captura, no en
  el chequeo de anchura (el `overflow-x: clip` del `html` lo ocultaba).
- **El plano en móvil era ilegible**: ahora mide 640 px y se desplaza en
  horizontal dentro de su caja, que solo es focusable si desborda.

## Lo flojo

- Hecha en la segunda mitad de la noche: el montaje de la tienda es más
  esquemático que el viaje de la ola de la de surf, y la escena deja aire de
  sobra a la izquierda.
- Sin fotografía (proxy bloqueado), solo Chromium, sin lector de pantalla ni
  dispositivo real.
- El número de parcelas por zona y sus atributos están en el script; para un
  cliente real convendría sacarlos a un JSON.
