# Auditoría automática de accesibilidad

> Sitio de demostración. Pegada es un negocio ficticio.

axe-core 4.10.2 inyectado con Playwright (Chromium), reglas `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` y `best-practice`. Antes de analizar se cierra el aviso de cookies y se recorre la página entera con la rueda, para que las apariciones y el anclaje estén en su estado final. Generado con `scripts/axe.js`.

| Caso | Dirección | Violaciones | Reglas pasadas |
|---|---|---|---|
| Portada, escritorio 1440×900 | `index.html?ahora=2026-10-01T18:10` | **0** | 49 |
| Portada, móvil 390×844 | `index.html?ahora=2026-10-01T18:10` | **0** | 49 |
| Portada, versión sobria + paleta azul | `index.html?revision&ahora=2026-10-01T18:10` | **0** | 49 |
| Portada, lunes (descanso) | `index.html?ahora=2026-10-05T11:00` | **0** | 49 |
| Aviso legal | `legal.html` | **0** | 29 |
| 404 | `404.html` | **0** | 19 |

Limitaciones: axe es un analizador estático; no sustituye una pasada con lector de pantalla real (NVDA, VoiceOver), que no se ha hecho. El contraste de los tokens de color se calcula además con `scripts/contraste.js`.
