# Auditoría de accesibilidad — Salseiro

Hecha el 2026-10-02 con **axe-core 4** inyectado por Playwright (Chromium),
reglas `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` y `best-practice`, con el
aviso de cookies cerrado y movimiento reducido (para auditar el estado final,
no un fotograma de animación).

| Página / estado | Violaciones | Reglas que pasan | A revisar |
|---|---|---|---|
| Portada, escritorio 1440×900 | **0** | 53 | contraste sobre fondos con textura (163 nodos) |
| Portada, móvil 390×844 | **0** | 55 | contraste sobre fondos con textura (145) |
| Portada, versión sobria (`?revision`) | **0** | 53 | contraste sobre fondos con textura (187) |
| Vitrina con el filtro «sin leche» activo | **0** | 53 | contraste sobre fondos con textura (154) |
| Aviso legal | **0** | 29 | contraste (24) |
| 404 | **0** | 29 | contraste (3) |

**Lo que axe dejó «a revisar»** es contraste sobre un `background-image` (el
grano del papel del `body`): axe no puede resolver el color de fondo y lo
marca como dudoso. El contraste de cada pareja de tokens está **calculado con
script** (`scripts/contraste.mjs` y la comprobación de las tres paletas en
`scripts/verify.js`): el peor caso de texto es `--tinta-apagada` sobre
`--nata`, 6,05:1.

## Lo que axe encontró en la primera pasada y se corrigió

1. **`<dl>` mal formado** en los tres datos del manifiesto: la nota iba en un
   `<p>` dentro del `<div>`. Pasa a ser un segundo `<dd>`.
2. **Subtítulo de la marca a 4,24:1** cuando la cabecera translúcida pasaba
   por encima de la vitrina oscura (la mezcla del 78 % dejaba un gris). La
   cabecera sube al 92 % de opacidad y vuelve a superar 4,5:1 en el peor caso.
3. **El mando de demostración fuera de un landmark**: lleva
   `role="region"` con nombre.
4. **`aria-label` en `<span>` sin rol** (las bandas del calendario y los
   titulares partidos): se cambia por texto oculto visualmente, que sí lee
   el lector de pantalla y no infringe ARIA.

## Lo que esta auditoría NO cubre

- Lector de pantalla real (NVDA/VoiceOver): no disponible en el entorno.
- Firefox y Safari: solo Chromium.
- Dispositivo táctil real: el táctil está emulado.
