# Auditoría de accesibilidad — Mouriscal

axe-core 4.13.0 · reglas WCAG 2.0/2.1 A y AA · Chromium (Playwright) ·
2026-10-02. Generado por `scripts/auditar.js`, con el aviso de cookies cerrado y la
página recorrida con la rueda antes de analizar (para que los titulares y bloques que entran con el scroll estén
en su estado final).

| Caso | Infracciones | Reglas superadas | Para revisar a mano |
|---|---|---|---|
| Portada · escritorio | 0 | 34 | 1 |
| Portada · móvil 390 | 0 | 34 | 1 |
| Portada · versión sobria | 0 | 34 | 1 |
| Portada · paleta Azafrán | 0 | 34 | 1 |
| Portada · paleta Ciruela | 0 | 34 | 1 |
| Portada · menú móvil abierto | 0 | 34 | 1 |
| Aviso legal | 0 | 16 | 1 |
| 404 | 0 | 9 | 0 |

**Cero infracciones en los ocho casos.**

«Para revisar a mano» son las comprobaciones que axe no puede decidir solo (sobre todo contraste de texto encima
de degradados o del lienzo WebGL de la portada). El contraste de cada token está calculado aparte con
`scripts/contraste.js` y medido en la página por `scripts/verificar.js`.

Lo que axe no cubre y queda pendiente: lector de pantalla real (NVDA/VoiceOver), Firefox y Safari, y dispositivo
táctil real.
