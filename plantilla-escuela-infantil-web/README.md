# O Abaneo — escola infantil 0-3 · Lalín (plantilla ficticia)

> **Sitio de demostración.** O Abaneo es un negocio **ficticio**: el nombre, la
> dirección, los teléfonos, las cuotas, el menú, las personas y las opiniones
> son de muestra y no corresponden a ninguna escuela infantil real de Lalín ni
> de ningún otro sitio. Las cuotas están marcadas como ficticias en la propia
> página. Todas las páginas llevan `noindex, nofollow`.

Plantilla de la biblioteca de webs de negocio ficticio, sector **escuela
infantil 0-3 años**. Web estática: `index.html` + `css/estilo.css` +
`js/main.js`, sin build ni dependencias locales. GSAP 3.12.5, ScrollTrigger y
Lenis 1.1.13 por CDN (**jsDelivr**). Se abre con doble clic o se publica tal
cual en GitHub Pages.

- `index.html` — la web.
- `aviso-legal.html` — aviso legal, privacidad y cookies.
- `404.html` — «esta pieza se ha caído del móvil» (rutas absolutas con el
  prefijo `/plantilla-escuela-infantil-web/`; si el repo se llama de otra
  forma, cambiarlo ahí).
- `scripts/paleta.js` — calcula las paletas derivadas y su contraste.
- `scripts/verificar.js` — verificación con Playwright (PLIEGO §7).
- `scripts/quitar-mandos.js` — quita los mandos de demostración en una copia.
- `scripts/auditar.js` — auditoría de accesibilidad con axe-core (resultado en `scripts/auditoria.json`).

## Concepto: «Móvil»

El **móvil de cuna**. Lo primero que mira un bebé tumbado es lo que cuelga
encima: unas pocas piezas de fieltro colgadas de una varilla, y cuando una se
mueve se mueven todas un poco y luego se paran. Es la imagen honesta de una
escuela 0-3: poca gente sosteniendo muchas cosas pequeñas en equilibrio, sin
prisa. *Abanear*, en gallego, es mecer; de ahí el nombre.

Del concepto sale todo el movimiento, y por eso **nada entra «subiendo y
apareciendo»**: las letras del titular, las palabras de cada sección, los
pasos de la adaptación y las tarjetas del horario **cuelgan, se mecen y se
paran**, siempre con la misma curva de péndulo amortiguado. El cursor es
viento: en la portada sopla las piezas; en el titular, engorda las letras que
tiene cerca (eje de peso de la fuente variable).

## Qué hace esta mejor que las anteriores

Revisadas antes de diseñar, con sus capturas delante: **Trinquete**
(abogacía), **Ramalleira** (floristería), **Casa Bricaña** (hotel rural) y
**GNOMON** (fotovoltaica), más las fichas de `registro/` de las 34.

1. **La portada es un objeto que responde, no un dibujo que se anima.**
   Ramalleira y Trinquete parten la portada en «titular a la izquierda,
   ilustración a la derecha» al 50 %. Aquí el móvil es una simulación (cinco
   péndulos amortiguados en dos varillas, giro en profundidad con
   perspectiva, sombras en la pared) que **cuelga por detrás del titular** y
   reacciona al cursor, al dedo, al clic y al scroll. La composición es
   asimétrica: titular a sangre abajo a la izquierda, el móvil colgando del
   borde superior.
2. **Escala tipográfica de verdad.** Las anteriores cierran los titulares en
   torno a 5–6 rem en un solo peso. Aquí el titular llega a **17 rem** con
   Playfair 2.0 en su tamaño óptico máximo (`opsz` 1200) y estrechada
   (`wdth` 87,5), y la segunda línea en cursiva a otro cuerpo y desplazada. Las
   cifras grandes usan la misma fuente variable con otros ejes, no otra fuente.
3. **Las transiciones entre secciones no son fade-up.** La sección del
   manifiesto se abre como una manta con borde curvo (`clip-path` en elipse),
   la cocina con una máscara circular, «El día» y «Puertas abiertas» entran con
   el canto redondeado, y cada titular **cuelga palabra a palabra** con un
   balanceo amortiguado.
4. **La secuencia anclada cuenta el oficio con datos, no un adorno.** Seis
   pasos de la adaptación con horas en la escuela, dónde está la familia y una
   escena del aula en la que **la silla de la familia sale por la puerta**,
   aparece la mantita de casa, la percha propia, el plato y la cuna.
5. **Los mandos de demostración ya no tapan la portada.** En Trinquete el mando
   de maqueta se montaba sobre las cifras de la portada en 1440×900. Aquí solo
   existen con `?revision` en la dirección, se apartan con el aviso de cookies
   y llevan además el contador de **tareas largas** en vivo.
6. **Rendimiento medido, no supuesto** (deuda abierta en 18 de 27 de la
   biblioteca): `PerformanceObserver` de `longtask` desde el `<head>`, medición
   en frío con la caché deshabilitada y un **contador que demuestra que el
   canvas no pone ni un `filter` ni un `shadowBlur` por fotograma**.

## Mapa de secciones

| # | Sección | Qué cuenta | Recurso |
|---|---|---|---|
| 0 | Cortina | la manta de la siesta: la lúa baja por su hilo, se pespunta una costura y la manta se levanta por las esquinas | GSAP, `expo.inOut`, borde curvo; retirada garantizada |
| 1 | Portada | «Empezar despacio.» | **móvil en canvas** + titular que cuelga letra a letra y respira con el cursor |
| 2 | Lo que cuelga | manifiesto y cuatro cifras desalineadas | manta con borde curvo, contadores |
| 3 | Adaptación | diez días, seis pasos | **anclada con scrub** (sin GSAP: sticky + IntersectionObserver) |
| 4 | Aulas | Lúa (4–12 m), Pera (1–2), Barquiño (2–3) | pila sticky |
| 5 | El día | 7:30–17:30, horario ampliado | tendedero: marquesina ligada al scroll, tarjetas que se mecen, franja de ahora |
| 6 | Cocina | cocina propia, menú de la semana | máscara circular, vapor, pestaña `es-hoy` |
| 7 | Cuotas | tabla **ficticia y marcada** + calculadora | contador animado |
| 8 | Voces | cinta y dos opiniones de muestra | marquesina que cambia de sentido con el scroll |
| 9 | Puertas abiertas | dos sábados y los martes con cita | formulario de muestra |
| 10 | Preguntas | `<details>` nativo | — |
| 11 | Contacto | dirección, equipo y mapa bajo clic | — |

Recursos del PLIEGO §2 (mínimo 5, aquí 9): Lenis, char-reveal (letra y
palabra), sticky-stack, marquesina ligada al scroll (dos), botones
magnéticos, cursor contextual, hero de canvas, pin con scrub, contadores y
máscaras.

## Paleta

| Token | Valor | Uso |
|---|---|---|
| `--papel` | `#F5EDE0` | fondo |
| `--panel` | `#EADFCC` | bandas, escena |
| `--crema` | `#FBF7F0` | tarjetas, formulario |
| `--tinta` | `#23264A` | texto (12,5:1 sobre papel) — índigo, ninguna otra plantilla lo usa de tinta |
| `--apagado` | `#565875` | secundario (5,2:1 sobre panel) |
| `--noche` | `#1B1D3A` | cortina, «El día», pie |
| `--acento-sup` | `#D9573B` | **tomate de fieltro**: superficies, nunca texto |
| `--acento-txt` | `#A43820` | texto de acento (5,0:1 sobre panel) |
| `--boton` | `#9F341B` | fondo de botón (7,0:1 con blanco) |
| `--acento-claro` | `#F2A285` | acento sobre noche (8,0:1) |
| fieltros fijos | `#E7B44A` `#8FB3A8` `#E9B7A6` `#9DB4D6` `#B98E5F` | mostaza, salvia, rosa, cielo, madera — solo superficies |

Contrastes calculados con `node scripts/paleta.js` antes de escribir el CSS.

## Tipografía

**Playfair 2.0** (variable: `opsz` 5–1200, `wdth` 87,5–112,5, `wght` 300–900)
para titulares y cifras, y **Atkinson Hyperlegible Next** para el texto.
Ninguna de las dos está en la biblioteca. Revisados €, ñ, tildes y « »: el
euro de Playfair es el de verdad (en las cifras se fuerzan numerales de
caja alta con `lining-nums`, porque los de estilo antiguo bailan en una
tabla de precios).

## Reskinear para una escuela real (lo más valioso del repo)

1. **Datos**: buscar `O Abaneo`, `Travesa da Lavandeira`, `986 00 00 00`,
   `600 00 00 00` y `oabaneo.example` en `index.html`, `aviso-legal.html` y
   `404.html`, y el bloque `application/ld+json` del `<head>`.
2. **Aulas**: los nombres (Lúa, Pera, Barquiño) salen de las piezas del logo.
   Si la escuela tiene otros nombres, cambiar también `data-dato` (plazas) y,
   en la versión sobria, las filas de `.ratio` (`--v` = niños por adulto / 20).
3. **Horario**: el abierto/cerrado se calcula en `pintarEstado()` de
   `main.js` (7:30–17:30, L–V, hora de Madrid). Las franjas del tendedero
   llevan `data-desde` y `data-hasta` en horas decimales.
4. **Adaptación**: cada `<li class="adapta-paso">` lleva `data-dia`,
   `data-horas`, `data-familia` y `data-x` (posición de la silla en el SVG:
   330 en el aula, 640 en la puerta, 900 fuera). La escena muestra mantita,
   percha, plato y cuna según el número de paso (`.aula[data-paso]` en CSS).
5. **Cuotas**: la tabla y los `value` de la calculadora. **Quitar el sello
   «Cuotas de muestra, ficticias»** solo cuando sean las reales.
6. **Menú**: los cinco `<dl role="tabpanel">`. La pestaña de hoy se marca sola.
7. **Color**: cambiar los cuatro tokens de acento de `:root` (o elegir Pino o
   Malva, ya calculadas) y pasar `scripts/paleta.js` para comprobar contraste.
   El móvil de la portada lee `--acento-sup` para la lúa.
8. **Logo**: `img/marca.svg` y `favicon.svg`; regenerar `img/og.png` e iconos.
9. **Aviso legal**: poner razón social, NIF e inscripción real del centro (en
   la demo no se inventan, ver el propio aviso).
10. **Quitar los mandos** (abajo) antes de entregar.

## Quitar los mandos (maqueta y paleta)

Los mandos de demostración **nunca viajan al sitio de un cliente**. Todo lo
que les pertenece está entre marcas `MANDOS-INICIO` / `MANDOS-FIN` en cuatro
archivos: `index.html` (script del `<head>`, el propio mando, el gráfico de
ratio de la versión sobria y una frase del aviso de cookies),
`aviso-legal.html` (script de paleta y la línea de `localStorage`),
`css/estilo.css` (paletas derivadas, gráfico de ratio, mandos y reglas de la
versión sobria) y `js/main.js` (lógica de los mandos).

Receta, **comprobada por script contra los archivos**:

```sh
node scripts/quitar-mandos.js ../o-abaneo-cliente
```

Escribe una copia limpia (nunca toca el original), se niega a escribir si
las marcas están desparejadas o si un archivo pierde más líneas de las
esperadas, y al final verifica que no queda ni `MANDOS`, ni `maqueta-sobria`,
ni `paleta-pino/malva`, ni `abaneo-maqueta/paleta`, ni la frase de la versión
de revisión, y que `main.js` sigue siendo JavaScript válido (`node --check`).
Resultado de la última pasada: 4 bloques fuera de `index.html` (42 líneas), 3
de `aviso-legal.html`, 3 de `estilo.css` (50 líneas) y 1 de `main.js` (36).

Si se hace a mano: borrar cada bloque entre `MANDOS-INICIO` y `MANDOS-FIN`
(marcas incluidas) en esos cuatro archivos, y nada más.

## Créditos

Ninguna fotografía (ver `CREDITOS.md`): todo es dibujo propio en SVG o canvas.
Fuentes de Google Fonts (OFL) y GSAP/Lenis por jsDelivr.

## Decisiones

- **Ni un niño, ni en dibujo.** El sector lo pedía para las fotos; se ha
  llevado también a la ilustración: la adaptación se cuenta con **objetos**
  (la silla de la familia, la mantita, la percha, el plato, la cuna).
- **Nada de promesas pedagógicas.** El manifiesto lo dice expresamente («No
  prometemos que vaya a leer antes»). Lo único medible que se enseña son
  plazas, educadoras y ratio frente al máximo de la normativa gallega.
- **Cuotas ficticias y marcadas** en la tabla y en la calculadora, y sin cifras
  de ayudas públicas concretas (cambian cada curso).
- **Sin fotos al móvil de las familias**: está en las preguntas como decisión
  de la casa; es un rasgo plausible y diferencia de las webs del sector.
- **Mandos solo con `?revision`**, para que la demo pública se vea como la vería
  un cliente.
