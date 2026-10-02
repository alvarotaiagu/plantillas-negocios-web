# Auditoría de accesibilidad — Fiambreira (demo)

> Sitio de demostración. Fiambreira es un negocio ficticio.

**axe-core 4** inyectado con Playwright (Chromium), reglas `wcag2a`,
`wcag2aa`, `wcag21a`, `wcag21aa` y `best-practice`, con el aviso de cookies
cerrado y la página recorrida entera con la rueda antes de analizar. Script:
`scripts/auditoria.js`; resultado bruto en `screenshots/axe.json`.

| Vista | Violaciones | Reglas que pasan |
|---|---|---|
| Portada, escritorio 1440×900 | 0 | 55 |
| Portada, móvil 390×844 | 0 | 55 |
| Portada, versión sobria con `?revision` | 0 | 55 |
| Aviso legal | 0 | 30 |
| 404 | 0 | 18 |

Además:

- **Contraste calculado** para las tres paletas con `scripts/contraste.js`
  (63 parejas, todas por encima de su mínimo; la más baja, el tomate de texto
  sobre el papel, 5,85:1). El tomate de superficie y la albahaca de superficie
  no se usan como texto pequeño.
- Titulares partidos letra a letra con el texto entero en un `span.sr`.
- La mesa anclada esconde los pasos no activos con `visibility: hidden` y
  `aria-hidden`; sin movimiento se ven los seis.
- La pista de la temporada lleva `role="group"` y `aria-label`, y solo es
  focusable (`tabindex="0"`) cuando de verdad desborda; el mes actual lleva
  `aria-current="date"`.

**Lo que no cubre:** lector de pantalla real, Firefox y Safari, móvil físico y
GPU real (el WebGL se ha medido en el Chromium sin GPU del arnés).
