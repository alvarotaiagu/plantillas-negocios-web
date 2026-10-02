# Chocolatería / bombonería

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Chocolatería y bombonería de obrador | Estalo · Chocolatería e bombonería (Ribadeo, Lugo) | «Templado» — un chocolate bien templado brilla, se suelta del molde y cruje; todo depende de una curva 45 → 27 → 31 °C que el cliente no ve | cacao `#1A0F0B` / panel `#24150F` / línea `#3A251C` / leche `#7B4A2E` / crema `#F3E7D6` / apagadas `#BFA894` y `#5E4334` + **turquesa de manteca de cacao** `#31B2A6` (texto sobre crema `#00625A`); alternativas del mando: coral y oro, derivadas en OKLCH | Mona Sans (variable, `wdth` 75–125) + Instrument Serif + Red Hat Mono | **una tableta en canvas** que brilla donde pasa el cursor y se parte onza a onza (física, grieta, sin bucle permanente), y **la curva de templado anclada** con el trazo scrubbeado y temperatura, cristales y brillo en vivo | pendiente de crear | pendiente de publicar |

**Construida la noche del 2026-10-02 sin supervisión**, segunda de la tanda
tras Salseiro (heladería), en la rama `claude/noche-chocolateria`, carpeta
`plantilla-chocolateria-web/`. Sin repo propio ni Pages. Detalle en
`plantilla-chocolateria-web/INFORME-NOCHE.md`.

**Estructura** (8 piezas): cortina «Clac» (tableta que se parte por una grieta
curva) → portada con tableta → curva anclada → doce bombones con corte →
cinta de orígenes → cajas en pila sticky + encargo → horario → visita.

**Dos densidades:** «Templado» / «Sobria». La sobria cambia el molde por el %
de cacao de los doce ordenado, las cajas dibujadas por el **precio por
bombón**, y quita la grieta entre secciones.

**Verificación:** `scripts/verify.js`, 90 comprobaciones en verde; axe sin
violaciones; `longtask`: 2 en escritorio, ninguna tras cargar las fuentes.
