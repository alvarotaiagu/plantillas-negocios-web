# Auditoría de accesibilidad — Estalo

Hecha el 2026-10-02 con **axe-core 4** inyectado por Playwright (Chromium),
reglas `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` y `best-practice`, aviso de
cookies cerrado y movimiento reducido.

| Página / estado | Violaciones | Reglas que pasan | A revisar |
|---|---|---|---|
| Portada, escritorio 1440×900 | **0** | 51 | contraste (39 nodos) |
| Portada, móvil 390×844 | **0** | 51 | contraste (33) |
| Versión sobria (`?revision`) | **0** | 51 | contraste (37) |
| Con un bombón elegido | **0** | 51 | contraste (35) |
| Aviso legal | **0** | 29 | — |
| 404 | **0** | 29 | — |

Cero violaciones a la primera: esta plantilla nació con las correcciones que
axe pidió en Salseiro la misma noche (texto oculto en vez de `aria-label` en
`<span>`, `<dl>` bien formados, mando con `role="region"`, cabecera casi
opaca).

**«A revisar»** son textos sobre el `clip-path` de la transición «grieta» y
sobre el canvas, cuyo fondo axe no puede resolver. Los contrastes de cada
pareja de tokens están calculados con `scripts/contraste.mjs` (peor caso de
texto: `--acento-osc` sobre crema, 5,95:1) y los de las tres paletas se
miden en `scripts/verify.js`.

Glifos comprobados por medición en Mona Sans 800, Instrument Serif cursiva y
Red Hat Mono: €, ñ, á, í, ó, « », °, %, ·, – — ninguno sustituido.

**No cubre**: lector de pantalla real, Firefox/Safari, táctil real.
