# Escuela de surf — «Mar de fondo» (tanda de noche, 2026-10-02)

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Escuela de surf (cursos por niveles, clases sueltas, alquiler, campamento de verano) | Treboada · Escola de Surf (Malpica de Bergantiños, A Coruña) | «Mar de fondo» — lo que rompe hoy en la playa nació hace tres días en una borrasca a dos mil kilómetros; aprender surf es aprender a leer esas líneas antes de entrar | Atlántico frío: abismo `#040B0F` / fondo `#07141A` / panel `#0C1D24` / panel2 `#12262F` / línea `#1E3843` / pizarra `#3D5965` / humo `#98B0B8` / espuma `#E6F0EF` + **un acento**: vidrio de mar `#8CE0CC`; cortina de espuma `#D9E6E4`. Alternativas derivadas por script: Xeo `#B8D4EC` y Liquen `#C7D974` | Roboto Flex (variable: `wdth` 25–151, `wght`, `opsz`, `slnt`) + Red Hat Mono | **shader WebGL de líneas de mar de fondo** en la portada en el que el cursor es un bajo de arena que **refracta** las crestas (y una isla fija que las dobla a sotavento), más una **secuencia anclada con física de verdad**: la ola viaja de la borrasca a la playa y altura, velocidad y profundidad salen de la relación de dispersión | rama `claude/noche-escuela-surf` del cuartel general, carpeta `plantilla-escuela-surf-web/` | pendiente de publicar |

**Porqué del concepto.** Las webs del sector enseñan lo mismo: foto de
atardecer, tabla en la arena y «vive la experiencia». En la Costa da Morte eso
no es verdad —el agua está a 13 °C en marzo— y no es lo que se aprende. Lo que
separa a quien surfea de quien se cae es saber leer el mar de fondo: período,
dirección, cómo lo dobla el fondo. Así que la web entera es esa lectura, y el
nombre lo dice: *treboada* es tormenta en gallego, el sitio donde nace la ola
que vas a coger. Ningún concepto de la biblioteca toca el agua como física
(«Burbullas» es fermentación, «Orballo» es vaho en un cristal).

**Estructura** (diez piezas): cortina «resaca» → portada WebGL → cinta del
parte → el viaje de una ola (anclada, cinco pasos) → niveles (pila sticky de
cuatro) con clases sueltas → parte de hoy de muestra → material (galería
horizontal anclada de tablas a escala + calculadora de alquiler + agua mes a
mes) → seguridad (corriente de retorno animada) → campamento → equipo y voces →
preguntas → reserva y contacto.

**Lo más difícil de ver a ojo, cazado midiendo:** las tareas largas venían del
shader pintado por SwiftShader (el Chromium de verificación no tiene GPU): 50
ms por fotograma con el canvas, 16 sin él. Se resolvió con **resolución
adaptativa** (si la media pasa de 22 ms, el búfer baja) y sin pintar mientras
la cortina tapa la pantalla: de ~30 tareas largas en 20 s a una de 51 ms.

**Verificación:** `scripts/verificar.js`, 46 comprobaciones (cortina a medias
en los tres casos, pila en pasos de 90 px, hero en 360×640 y 375×667 sin
solapes, sin GSAP, movimiento reducido, cookies, menú móvil con toques reales,
mapa bajo clic, dos densidades, tres paletas con contraste medido, longtask en
frío con control, axe en siete páginas/estados con **0 violaciones**). Receta
de borrado de mandos comprobada por script (`scripts/borrar-mandos.js`).
Detalle y números en `plantilla-escuela-surf-web/INFORME-NOCHE.md`.

**Datos ficticios:** Treboada · Escola de Surf · Rúa das Gaivotas Mansas, 4 ·
15113 Malpica de Bergantiños · 981 00 00 00 · ola@treboada.example · Antía
Vilar Souto (directora), Xurxo Pazos Leis (instructor), Uxía Canosa Rey
(socorrista). Nombre buscado antes de fijarlo: no aparece ninguna escuela,
tienda ni negocio «Treboada» en el sector; las escuelas reales de Malpica son
otras (One Surf Academy, Silfo Surfcamp) y no comparten nombre, dirección ni
estética. Parte de olas y marea **generados** y marcados como ficticios en
cuatro sitios. Sin `aggregateRating` ni `review`, `noindex, nofollow` en las
tres páginas y sello en pie, README y comentario del HTML.
