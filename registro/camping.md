# Camping — «Vientos» (tanda de noche, 2026-10-02)

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Camping de montaña (parcelas, cabañas, tarifas por temporada) | Camping A Piqueta (Navia de Suarna, Lugo) | «Vientos» — las cuerdas que tensan la tienda: una lona floja aletea toda la noche y una tensa no se oye | lona `#EFE7D6` / lona2 `#E4D9C3` / crudo `#F8F3EA` / tinta `#1F2A22` / musgo `#4A5A44` + **un acento**: cuerda `#D2502A` (texto `#8A2E10`, sobre noche `#F2895C`); noche `#17211B`. Alternativas derivadas por script: Xesta y Lousa | Instrument Serif + Rethink Sans + Fragment Mono | **lona de rayas simulada** (Verlet en 3D) en la portada: el cursor es el viento que la sopla y el scroll tensa sus vientos hasta que deja de aletear; más el montaje anclado de una tienda en cinco pasos | rama `claude/noche-camping` del cuartel general, carpeta `plantilla-camping-web/` | pendiente de publicar |

**Estructura** (ocho piezas): cortina «izar» → portada con la lona → cinta de
normas → montar (anclada) → plano filtrable de 42 parcelas con ficha → tarifas
por temporada con calculadora → de noche (cielo en canvas y estado de
silencio en vivo) → rutas desde recepción y voces → reserva.

**Verificación:** 47 comprobaciones del §7 en verde, 0 tareas largas con la
lona viva, axe sin violaciones en siete páginas/estados. Detalle en
`plantilla-camping-web/INFORME-NOCHE.md`.

**Datos ficticios:** Camping A Piqueta · Camiño das Bidueiras, 3 · 27650
Navia de Suarna · 982 00 00 00 · reservas@apiqueta.example. Nombre buscado:
no existe ningún camping «A Piqueta»; descartados Parada de Sil y Cervantes
por tener campings reales y «Os Ventos» por parecido. Sin `aggregateRating`
ni `review`, `noindex, nofollow` en las tres páginas, sello en pie, README y
comentario del HTML.
