# Heladería artesanal con obrador propio

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Heladería artesanal con obrador propio | Salseiro · Xeadaría de obrador (Baiona, Pontevedra) | «Mantecar» — el verbo del oficio: batir mientras se congela para que entre aire y salga crema en vez de hielo | leite `#FBF5EE` / nata `#F3E9DC` / barquillo `#E9D3B4` / tinta amora negra `#2A1520` / apagadas `#6B4F5A` y `#CDB8C0` + **framboesa** en tres tokens: superficie `#D63368`, texto `#A2174A`, sobre tinta `#F589A1` (alternativas del mando: pistacho y arándano, derivadas en OKLCH) | Bodoni Moda (variable, `wght` + `opsz`) + Albert Sans + Spline Sans Mono | **una bola de helado en WebGL** vista desde arriba (normales de un campo de alturas, brillo especular, veteado de temporada) que se remueve con el cursor, cambia de sabor al clic y fluye con el scroll; y **un día de obrador anclado** con scrub: temperatura 4 → 85 → 4 → −8 → −35 → −12 °C, aire 0 → 32 % y horas, con la cuba dibujada obedeciendo a las mismas cifras | pendiente de crear | pendiente de publicar |

**Construida la noche del 2026-10-02 sin supervisión**, en la rama
`claude/noche-heladeria` del cuartel general, carpeta
`plantilla-heladeria-web/`. Sin repo propio ni Pages: publicar lo aprueba el
usuario. Detalle completo en `plantilla-heladeria-web/INFORME-NOCHE.md`.

**Porqué del concepto:** panadería («La miga») y quesería («Corteza») ya
cuentan el producto por dentro y por el tiempo. Una heladería de obrador se
distingue por un gesto —la pala que bate, la espátula que peina la vitrina— y
por tres cifras que el cliente nunca ve: temperatura, aire y horas. La web
enseña el gesto (hero) y las cifras (anclada).

**Estructura** (once piezas): cortina «Boleado» → portada con la bola →
manifiesto tipográfico con datos escalonados → **la vitrina** (14 cubetas
de anchos distintos con filtro de alérgenos) → obrador anclado → calendario
de fruta → cinta → tallas a escala → tartas en pila sticky + encargo →
horario invierno/verano en vivo → visita con mapa bajo clic.

**Dos densidades:** «Mantecar» / «Sobria». La sobria cambia cubetas por % de
fruta en barras y tallas dibujadas por **precio por litro** (dato que la
cargada no tiene), y alisa los bordes de nata. Mandos solo con `?revision`.

**Verificación:** `scripts/verify.js`, 88 comprobaciones en verde en
Chromium (Playwright), con jsDelivr y Google Fonts servidos por el arnés
porque la red del entorno los bloqueaba (mismas versiones desde npm).
`longtask` medido en frío; ver el informe para los números y su matiz
(WebGL por software en el entorno de prueba).
