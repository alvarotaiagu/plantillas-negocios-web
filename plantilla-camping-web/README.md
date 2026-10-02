# Camping A Piqueta — plantilla de camping

> **Sitio de demostración.** Camping A Piqueta es un negocio **ficticio**; los
> datos, el plano, las tarifas, las ilustraciones y las opiniones son de
> muestra. Ningún dato corresponde a un camping real. Todas las páginas llevan
> `noindex, nofollow`.

Web estática (HTML + CSS + un `main.js`, sin build) de un camping de montaña
inventado en **Navia de Suarna** (Os Ancares, Lugo). Se abre con doble clic y
se publica tal cual en GitHub Pages.

## El concepto: «Vientos»

En una tienda, los *vientos* son las cuerdas que la tensan contra sus
piquetas. Una lona floja aletea toda la noche; una bien tensa no se oye. Eso es
lo que vende un buen camping de montaña —dormir bien— y lo que cuelga de todo:

- **La portada** es una lona de rayas simulada (Verlet en 3D, sombreado por
  normal) que cuelga de su cumbrera y se sujeta con dos vientos. **El cursor
  es el viento** que la sopla; **el scroll tensa los vientos** y la lona deja
  de aletear (la lectura «tensión: floja / a medias / tensa» lo dice).
- **La secuencia anclada** enseña a montar una tienda en cinco pasos —sitio,
  suelo, varillas, piquetas a 45°, vientos— y la lona pasa de arrugada a tensa
  con un porcentaje de tensión que sale del propio dibujo.
- **La cortina** se iza: la lona sube tirada por dos cuerdas desde una polea.
- **El logo** es una piqueta clavada a 45° con su viento tenso.
- **El nombre**: *a piqueta* es la estaca de la tienda.

## Qué hace esta mejor que las anteriores

1. **Una simulación física como hero, no un dibujo animado.** La lona es una
   malla de partículas con restricciones de distancia en 3D; el viento del
   cursor y la tensión del scroll cambian la física, no una animación grabada.
2. **El plano filtrable es la herramienta que un camping necesita**: 42
   parcelas generadas desde datos, filtros que se combinan (sombra de tarde,
   río, enchufe, sin coches), ficha con distancia a las duchas calculada y
   navegación por teclado con *roving tabindex* (una parada de tabulación, no
   cuarenta y dos).
3. **La calculadora de tarifas lee la tabla**: los precios viven en `data-p`
   de cada fila (tres temporadas) y la calculadora, la tabla y la comparativa
   de la versión sobria salen de ahí. Cambiar un precio es tocar un número.
4. **Verificación al nacer**: el mismo arnés del §7 que la plantilla de surf
   de esta noche, adaptado (cortina a medias en los tres casos, filtros,
   teclado, tarifas, longtask y axe).

## Mapa de secciones

| # | Sección | Forma |
|---|---|---|
| — | Cortina «izar» | la lona sube tirada por dos cuerdas |
| 0 | Portada | lona simulada + titular serif enorme |
| — | Cinta | normas del camping, ligada a la velocidad del scroll |
| 1 | Montar | **anclada con scrub**: la tienda en cinco pasos |
| 2 | Parcelas | **plano SVG filtrable** + ficha |
| 3 | Tarifas | temporadas + tabla + calculadora |
| 4 | De noche | cielo en canvas, normas y estado de silencio en vivo |
| 5 | Rutas | tres rutas desde recepción con perfil y contadores, voces |
| 6 | Reserva | formulario de muestra, recepción, mapa bajo clic |

## Paleta

lona `#EFE7D6` · lona2 `#E4D9C3` · crudo `#F8F3EA` · tinta `#1F2A22` · musgo
`#4A5A44` (texto secundario, 5,29:1 en el peor fondo) · **cuerda** `#D2502A`
(superficie) con `#8A2E10` para texto y botones (5,19:1 y 7,66:1) y
`#F2895C` sobre la noche · noche `#17211B` / `#202C24`, hueso `#F1ECE2`,
niebla `#B4BCAF`. Alternativas derivadas por script: **Xesta** (+48°) y
**Lousa** (−150°). `node scripts/contraste.js` comprueba 29 parejas.

## Tipografía

**Instrument Serif** (titulares, con cursiva), **Rethink Sans** (texto) y
**Fragment Mono** (datos). Ninguna en el registro.

## Recursos de movimiento (PLIEGO §2)

Lenis (jsDelivr) · hero canvas con simulación · secuencia anclada con scrub ·
reveal por palabras que «cuelgan y se enderezan» · marquesina ligada al
scroll · botones magnéticos · cursor propio contextual (aro punteado de
«viento» sobre la lona) · contadores.

## Los dos mandos de demostración (solo con `?revision`)

Abajo a la izquierda, ocultos sin `?revision` y mientras el aviso de cookies
está en pantalla. **Maqueta**: «Vientos» y «Sobria» (la sobria retira las
cuerdas decorativas de tarifas y la de la ficha de parcela, y **añade** la
comparativa de la misma noche en las tres temporadas, leída de la tabla).
**Paleta**: Cuerda, Xesta y Lousa (solo cambia el acento; logo fijo).

### Borrar los mandos

1. `node scripts/borrar-mandos.js --comprobar` (copia temporal; salida
   esperada: `index.html 3 bloques, 27 líneas` · `legal.html 1, 1` ·
   `css/estilos.css 2, 14` · `js/main.js 1, 21`).
2. Si sale limpio, `node scripts/borrar-mandos.js --aplicar`.
3. Si el cliente eligió la sobria, `class="maqueta-sobria"` fija en `<html>`;
   si eligió otra paleta, cambiar `--cuerda`, `--cuerda-texto` y
   `--cuerda-clara` en `:root`.

## Reskinear a un camping real

1. **Datos**: `index.html` (cabecera, reserva, pie, JSON-LD `Campground` sin
   `aggregateRating`), `legal.html`, `manifest.json`.
2. **Parcelas**: bloque «Plano de parcelas» de `main.js`; cada `zona(...)`
   define una fila de parcelas (posición, tamaño y atributos). Las duchas, en
   `duchas`. El dibujo base (río, camino, edificios) es el SVG `#plano`.
3. **Precios**: `data-p="baja,media,alta"` de cada fila de `#tabla-precios`.
   La regla de la noche gratis, en `calcular()`.
4. **Rutas**: perfiles SVG a mano y datos en la lista.
5. **Horario de silencio**: función `silencio()`.
6. **404**: rutas absolutas con `/plantilla-camping-web/`.

## Créditos

Ver [`CREDITOS.md`](CREDITOS.md). Informe de la noche en
[`INFORME-NOCHE.md`](INFORME-NOCHE.md).
