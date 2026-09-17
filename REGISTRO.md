# Registro de plantillas publicadas

Consolidado a partir de los archivos de `registro/`, que es donde escribe cada
agente (un archivo por plantilla, para que varios agentes en paralelo no se
pisen al editar este mismo documento).

## Tanda 1 — 17 de septiembre de 2026

Siete plantillas publicadas y vivas. Las tres detenidas al final de la tanda lo
fueron por el límite mensual de gasto, no por ningún problema de las webs.

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| 1 | Hotel rural | Casa Bricaña (Boimorto) | «Orballo» — el cristal empañado que hay que despejar para ver el valle | lino / arena / verde fento / óxido | Fraunces + Karla | canvas de vaho con gotas que resbalan; se limpia con el dedo y se despeja con el scroll | [repo](https://github.com/alvarotaiagu/plantilla-hotel-rural-web) | [demo](https://alvarotaiagu.github.io/plantilla-hotel-rural-web/) |
| 2 | Panadería / obrador | Milmigas (A Coruña) | «La miga» — un pan se juzga cuando se parte | crema de harina / tinta marrón / rojo hornada / amarillo maíz | Bricolage Grotesque + Instrument Sans + Martian Mono | canvas de fermentación + galería anclada de seis cortes de pan en SVG | [repo](https://github.com/alvarotaiagu/plantilla-panaderia-web) | [demo](https://alvarotaiagu.github.io/plantilla-panaderia-web/) |
| 3 | Estudio de tatuajes | Papel Vegetal (Santiago) | «Calco» — el dibujo aparece como trazo y después se entinta | papel hueso / tinta casi negra / violeta de calco / rosa flúor | Syne + Space Grotesk + DM Mono | trazado de línea SVG (`stroke-dasharray` + `pathLength`) | [repo](https://github.com/alvarotaiagu/plantilla-tatuajes-web) | [demo](https://alvarotaiagu.github.io/plantilla-tatuajes-web/) |
| 4 | Óptica | Óptica Sextante (Pontevedra) | «Optotipo» — el mensaje escrito en las filas de la carta de letras | blanco clínico / nube / tinta azulada / azul eléctrico + ámbar | Outfit + IBM Plex Sans + IBM Plex Mono | la carta con la regleta del examinador saltando de fila; el enfoque como transición | [repo](https://github.com/alvarotaiagu/plantilla-optica-web) | [demo](https://alvarotaiagu.github.io/plantilla-optica-web/) |
| 5 | Gimnasio / box | VINTE QUILOS (A Coruña) | «Carga» — todo se mide en kilos, no en porcentajes | negro / carbón / grafito / acero / humo + lima #C6FF3D | Anton + Barlow Condensed + Barlow | cuadro semanal anclado con scrub horizontal; hero de canvas con magnesio en suspensión | [repo](https://github.com/alvarotaiagu/plantilla-gimnasio-web) | [demo](https://alvarotaiagu.github.io/plantilla-gimnasio-web/) |
| 6 | Taller mecánico | RODADURA (Culleredo) | «Despiece» — el taller honesto es el que te enseña la pieza | fondo #0D0F12 / panel / línea / acero / humo + ámbar señal #FF7A1A | Oswald + IBM Plex Mono + IBM Plex Sans | despiece anclado: siete piezas de una rueda que se separan con scrub | [repo](https://github.com/alvarotaiagu/plantilla-taller-web) | [demo](https://alvarotaiagu.github.io/plantilla-taller-web/) |
| 7 | Autoescuela | CARRIL DEZ (Arteixo) | «Carril» — el camino hasta el carné, en seis tramos | fondo #0B0D10 / panel / línea / acero / humo + cian #23E5FF | Saira Condensed + Space Grotesk | un coche recorriendo el trazado SVG con scrub, pintando el camino hecho | [repo](https://github.com/alvarotaiagu/plantilla-autoescuela-web) | [demo](https://alvarotaiagu.github.io/plantilla-autoescuela-web/) |

### Pendiente de la tanda 1

Tres repos creados y **vacíos**, cortados antes de construir nada. Se retoman
desde cero; no hay trabajo que rescatar.

| Sector | Repo vacío | Estado al cortarse |
|---|---|---|
| Floristería | `plantilla-floristeria-web` | recién creado |
| Tienda de bicicletas | `plantilla-bicicletas-web` | recién creado, auxiliares a medias |
| Cervecería artesanal | `plantilla-cerveceria-web` | recién creado, nombre elegido: TRASFEGA |

### Deuda técnica común a las siete

- **Ninguna tiene medido el `longtask` con `PerformanceObserver`.** Las que
  llevan canvas siguen la regla preventiva (sprite cacheado, DPR capado, pausa
  por `IntersectionObserver`), pero está construido, no medido.
- **Sin auditoría automática de contraste** (axe/Lighthouse). Calculado a mano.
- **Solo Chromium.** Nada probado en Firefox ni Safari; el táctil es emulado.
- **Sin lector de pantalla real** (NVDA/VoiceOver).
