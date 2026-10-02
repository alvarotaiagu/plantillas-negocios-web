# Informe de la noche — Fiambreira (dietista-nutricionista)

> Sitio de demostración. Fiambreira es un negocio ficticio; los datos,
> fotografías y opiniones son de muestra.

Segunda plantilla de la noche, hecha porque la primera (Debandoira,
psicología, rama `claude/noche-psicologia`) quedó cerrada y verificada con
tiempo de sobra. Rama `claude/noche-nutricion`, carpeta
`plantilla-nutricion-web/`. Sin repo nuevo, sin Pages, sin tocar `main`,
`REGISTRO.md` ni `SECTORES.md`; ficha en `registro/nutricion.md`.

## El negocio y por qué no choca con uno real

**Fiambreira · consulta de dietética y nutrición**, Rúa do Pementeiro, 7, baixo
· 32005 Ourense · 988 00 00 00 · mesa@fiambreira.example. Lúa Barreiro Doval
y Uxío Penedo Lamela, dietistas-nutricionistas (colegiaciones GAL-0000 y
GAL-0001 y registro sanitario C-32-000000, todos «de muestra»).

Búsquedas hechas antes de fijarlo: «Fiambreira» + nutrición / dietista /
nutricionista: ningún negocio (solo artículos genéricos sobre la profesión);
«Rúa do Pementeiro» en Ourense: no existe; «Lúa Barreiro» y «Uxío Penedo» como
nutricionistas en Ourense: ningún resultado. Ourense no lo usaba ninguna otra
plantilla salvo el balneario (Allariz, provincia).

## Concepto, paleta, tipografía, movimiento

- **«Mantel»**: lo que importa pasa en tu mesa, no en una hoja de dieta.
- **Paleta**: vichy de albahaca sobre blanco de mantel, con tomate, limón y un
  verde noche para las secciones oscuras. Distinta de Debandoira (que es lana
  rosada con añil) y de la biblioteca (ningún verde de mantel).
- **Tipografía**: Instrument Serif (titulares de cartel, cursiva para el
  énfasis) + Onest variable. Ninguna de las dos está en las fichas.
- **Movimiento protagonista**: el mantel WebGL de la portada (se hunde y se
  arruga bajo la mano, onda al tocar, se alisa solo y con el scroll).
- **Estructura**: totalmente distinta de Debandoira (que tiene pila sticky y
  pin vertical): aquí lista que se tacha, mesa anclada con piezas, carta de
  restaurante y galería anclada horizontal.

## Verificación, con números

| Qué | Resultado |
|---|---|
| `scripts/verificar.js` | **55/55** en verde |
| Consola y peticiones | 0 errores, 0 respuestas ≥ 400, en 1440 y 390 |
| Anchura | `scrollWidth == innerWidth` en los dos tamaños |
| Mesa anclada | llega a «6» con las seis piezas puestas y el paso 6 activo, en escritorio y móvil |
| Temporada | mes actual (octubre) marcado; galería recorrida en 44 (escritorio) y 47 (móvil) pasos de 90 px sin retrocesos, hasta diciembre |
| Mantel WebGL | presión 0,915 al pasar la mano, onda 0,71 al tocar, vuelve a 0,008 en reposo; el cursor dice «alisa» |
| Cortina | 7 fotogramas (350 → 2400 ms) con los dos dobleces; `display:none` en normal, sin GSAP y con movimiento reducido; vichy distinto del fondo liso |
| Sin GSAP / reducido | seis pasos y seis piezas visibles, titulares enteros, seis tachados hechos, mes y horario vivos, pista horizontal focusable (`role=group`, `aria-label`, `tabindex` solo si desborda) |
| Cookies, mandos | el botón cierra (`display:none`) y el mando aparece solo entonces y solo con `?revision` |
| Densidades | Mantel: 2 franjas, 12 iconos, marco de la carta; Sobria: 0, 0, sin marco, comparativa de 3 filas; vuelta atrás; sin desbordamiento |
| Paletas | el color computado del botón cambia en las tres, `aria-pressed` y `localStorage` bien, la clase está en `domcontentloaded` tras recargar, el logo no cambia |
| Contraste | 63 parejas en tres paletas, todas pasan; mínimo 5,85:1 |
| Menú móvil | `top:0`, alto = `innerHeight` (100dvh), abre y cierra con el mismo botón |
| Cursor | solo con ratón; nada en táctil |
| Portada móvil | 360×640 y 375×667 sin solapes (plato, aviso, datos, cabecera, textos) |
| Marcadores | ninguno; `noindex, nofollow`, sello y comentario arriba en las 3 páginas |
| axe-core | **0 violaciones** en cinco vistas |
| `longtask` en frío | escritorio: 98 + 52 + 79 ms al cargar, **0** al hacer scroll, 61 fps; móvil con CPU ×4: 382 + 349 + 76 ms al cargar, 0 al hacer scroll, 61 fps |
| Receta de borrado | aplicada sobre copia en las dos direcciones, sin rastro, la copia carga |

57 capturas JPEG en `screenshots/`, miradas.

## Decisiones tomadas solo

1. **Ourense y no Lugo**, para no repetir ciudad con la de psicología.
2. **El texto de la portada va en un plato** (círculo en escritorio, tarjeta de
   loza en móvil): así el WebGL es fondo vivo y el texto nunca pelea con él.
3. **Seis consultas en la carta, con precio** (ficticio y marcado) en vez de
   una tabla de tarifas aparte; la sobria añade la comparativa.
4. **El calendario de temporada es orientativo** y lo dice; son productos
   comunes en Galicia, sin afirmaciones de salud.
5. **Rendimiento del shader**: búfer al 70 % del tamaño CSS y 20 fps en reposo,
   tras ver tareas largas continuas en la primera medición.
6. **Artefacto de captura**: en el Chromium sin GPU del arnés, las capturas
   muestran una franja sin componer en lo alto del mantel aunque el canvas está
   pintado (comprobado con `readPixels`). Se pasó el contexto a `alpha: true`
   para que, si ocurre, se vea el vichy CSS de debajo y no negro.

## Lo flojo

- **WebGL medido sin GPU real**: los números son de SwiftShader. En un móvil
  real con GPU debería ir sobrado, pero no está comprobado.
- **Solo Chromium**; ni Safari (backdrop-filter, `100dvh`) ni Firefox.
- **Sin lector de pantalla real.**
- **Los iconos de temporada son sencillos**; con más tiempo merecerían una
  pasada de ilustración con más carácter.
- **La mesa en móvil** deja poco aire en pantallas de 640 px de alto.
- **No he podido comprobar jsDelivr en vivo** (bloqueado en el entorno).
