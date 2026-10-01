# Instalador de fontanería, electricidad y calefacción

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Instalador (fontanería, electricidad y calefacción) | Ida e Retorno · Instalacións (Ourense) | «Circuito» — fontanería, electricidad y calefacción son un solo oficio: cerrar circuitos, y casi todos van por dentro de la pared | hierro fundido: fondo #12100E / panel #1A1714 / panel2 #221E1A / línea #332D27 / acero #5A5047 / humo #B5AB9E / hueso #F2ECE3 + yeso #E9E2D6 / yeso2 #DDD4C5 / tinta #1B1714 / tinta suave #5B5047 + **pareja térmica**: ida (quente) #FF7654 y retorno (fría) #4DB8F0, con #A22C16 / #1A5885 solo para texto sobre yeso; cobre #B9764A solo dibujo | Mona Sans (variable, `wdth` 75–125 animado) + Geist Mono | la obra anclada con scrub: una tubería que se llena válvula a válvula de la llamada al boletín, con un manómetro que sube hasta la prueba de estanqueidad (6 bar); y en la portada, una cámara termográfica en WebGL que enseña el suelo radiante bajo el cursor | rama `claude/noche-instalaciones`, carpeta `plantilla-instalaciones-web/` (repo propio pendiente) | pendiente de publicar |

**Construida en la tanda nocturna del 2026-10-02**, sin supervisión. Por
encargo, **no** se creó repositorio ni se activó Pages: la plantilla vive en la
rama `claude/noche-instalaciones` de este cuartel general, en la carpeta
`plantilla-instalaciones-web/`, y se publica cuando el usuario lo apruebe. No se
tocaron `REGISTRO.md` ni `SECTORES.md`.

**Porqué del concepto:** el sector vende con furgonetas, llaves inglesas y «llegamos
en 30 minutos». Lo que de verdad vende un instalador es lo que no se ve: lo que va
por dentro de la pared. «Circuito» une los tres oficios del encargo (el agua entra
por la acometida y sale por el desagüe; la corriente sale del cuadro y vuelve por
el neutro; la calefacción sale por la ida y vuelve por el retorno) y da nombre,
logo y paleta: dos tubos, caliente y frío.

**Distinto de lo oscuro ya registrado** (autoescuela cian, cervecería magenta,
coworking violeta, fotografía rojo, fotovoltaica verde, gimnasio lima, mudanzas
amarillo señal, seguridad azul, taller ámbar): aquí el fondo es **cálido**
(hierro fundido, no grafito ni azulado), el acento es **doble** y con sentido (ida
y retorno), y hay **dos secciones claras de yeso** —la pared que se abre— que
ninguna de las oscuras tenía.

**Nombre comprobado** por búsqueda web: sin instaladora «Ida e Retorno» ni «Ida y
Retorno» en Ourense ni en España. Descartado antes **Billa** (grifo en gallego)
por coincidir con una cadena de supermercados conocida. Calle inventada (Rúa da
Billa Vella, 9 · 32005 Ourense), teléfonos 988 00 00 00 y 600 00 00 00,
`ola@idaeretorno.example`, CIF B00000000, **nº de empresa instaladora
`EI-32-0000-MUESTRA`** con la palabra MUESTRA dentro y la nota de dónde va el
real. Urgencias sin tiempo de llegada prometido («No prometemos minutos.
Prometemos coger el teléfono») y con el servicio de avisos nocturno dicho tal cual.

**Estructura:** cortina (pared de yeso cortada por una roza) → portada
termográfica → 01 circuito (tres circuitos en escalera) → **02 la obra (anclada)**
→ 03 servicios (pila sticky) → cinta de avisos → 04 urgencias (estado en vivo) →
05 boletines (yeso, se abre por una roza) → 06 zonas (colector de doce salidas,
largo = km) → 07 quién va a tu casa → 08 presupuesto (yeso, formulario de muestra)
→ 09 contacto. La obra va **antes** que los servicios.

**Mandos** (solo con `?revision`): maqueta «Circuito» / «Sobria» —la sobria cambia
los dibujos de las fichas por los días de obra en grande y **añade** la comparación
de días con la misma vara— y paleta «Ida y retorno» / «Latón» (+32° OKLCH) /
«Brezo» (−48°). Receta de borrado comprobada por `scripts/comprobar-borrado.js`.

**Verificación:** `scripts/verificar.js` (Playwright, Chromium) — ver
`INFORME-NOCHE.md` de la carpeta para los números. jsDelivr estaba bloqueado por
la política de red del entorno: el arnés sirve GSAP/Lenis desde `node_modules`
con la misma URL que pide la página. Sin GPU en el entorno (WebGL por software):
los fotogramas del shader medidos allí no representan un equipo real.
