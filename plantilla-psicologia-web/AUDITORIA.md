# Auditoría de accesibilidad — Debandoira (demo)

> Sitio de demostración. Debandoira es un negocio ficticio.

Hecha con **axe-core 4** inyectado por Playwright (Chromium), reglas
`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` y `best-practice`, con el aviso de
cookies cerrado y la página recorrida entera con la rueda antes de analizar
(para que estén montados la escena anclada, los titulares partidos y los
contadores). Script: `scripts/auditoria.js`; resultado bruto en
`screenshots/axe.json`.

| Vista | Violaciones | Reglas que pasan |
|---|---|---|
| Portada, escritorio 1440×900 | 0 | 58 |
| Portada, móvil 390×844 | 0 | 58 |
| Portada, versión sobria con `?revision` | 0 | 58 |
| Aviso legal | 0 | 31 |
| 404 | 0 | 18 |

Corregido durante la auditoría: el mando de demostración era un `div` con
`role="group"` fuera de todo *landmark* (regla `region`); pasó a `<aside>` con
`aria-label`.

Además de axe:

- **Contraste calculado** para las tres paletas del mando con
  `scripts/contraste.js` (63 parejas, todas por encima de su mínimo; el menor,
  `tinta-apagada` sobre `panel`, 5,40:1).
- Ningún texto se apaga con `opacity`: «Lo que traes» pasa de `--tinta-apagada`
  a `--tinta` por color.
- Titulares partidos letra a letra: el texto entero va en un `span.sr` y las
  letras en un envoltorio `aria-hidden`.
- Pestañas presencial/en línea con `role="tablist"`, `aria-selected`,
  `aria-controls` y flechas del teclado. Preguntas con `<details>` nativo.
- Pasos ocultos de la escena anclada con `aria-hidden="true"` y `visibility:
  hidden` (no reciben foco).

**Lo que no cubre:** lector de pantalla real (NVDA/VoiceOver), Firefox y
Safari, y dispositivo móvil físico. Ver el informe.
