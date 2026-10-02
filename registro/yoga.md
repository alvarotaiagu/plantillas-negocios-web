# Estudio de yoga y pilates — «Apoyos» (tanda de noche, 2026-10-02)

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Estudio de yoga y pilates | Pegada · yoga e pilates (Sanxenxo, Pontevedra) | «Apoyos» — toda postura empieza por lo que toca el suelo: la web es una esterilla que recuerda dónde la has pisado | corcho `#C9A57E` / corcho-2 `#B99268` / espuma `#F3ECE2` / caucho `#1D1A16` / caucho-2 `#2A2520` + **mar** `#16475A` (texto sobre corcho `#0F3A4A`, sobre caucho `#8EC3D3`) + coral `#E2683F` solo de superficie; alternativas del mando: granate `#6A2A35` y musgo `#33491F` | Roboto Serif variable (`wdth` que respira) + Albert Sans + Red Hat Mono | **esterilla en WebGL que se hunde** donde presionas y recupera la forma despacio (simulación de altura en GPU, normales en el shader), con las huellas de la primera postura marcándose solas al entrar y al bajar; y una **postura anclada** con figura articulada y reparto de peso apoyo a apoyo | carpeta `plantilla-yoga-web/` de la rama `claude/noche-yoga` (sin repo propio todavía) | pendiente de publicar |

**Estado: pendiente de aprobación.** Construida en la rama `claude/noche-yoga`
de este repositorio, carpeta `plantilla-yoga-web/`. No se ha creado repositorio
ni activado Pages, y no se ha tocado `REGISTRO.md` ni `SECTORES.md`: publicar
lo decide el usuario.

**Porqué del concepto:** en una clase de yoga o de pilates lo que se corrige no
es la forma, son los apoyos: dónde cae el peso y cuánto en cada punto. Eso sale
del oficio y se puede dibujar sin fotos ni tópicos (ni loto, ni mandala, ni
lila). Registro C, producto y textura: caucho natural y corcho, que son los
materiales reales de una esterilla y de un bloque.

**Diferencia con el balneario (As Caldeiras, «Grados»):** allí manda la
temperatura y un tinte que recorre la página; aquí no hay agua ni calor, hay
materia y presión. Paleta, tipografía y estructura sin nada en común.

**Estructura** (nueve piezas): cortina (la esterilla se enrolla) → portada
WebGL con «siguiente clase» en vivo → la postura (anclada, oscura) → cinta de
respiración → clases por material en pila sticky con los niveles contados en
apoyos → cuadro semanal vivo → equipo ilustrado en zigzag → bonos con vale de
primera clase → antes de venir («Lo que no prometemos» + preguntas) →
contacto.

**Control de maqueta:** «Apoyos» / «Sobria». La sobria deja las huellas solo en
la portada y en la postura, cambia los dibujos de material por los minutos en
grande y **añade** una comparativa ritmo/quietud de las cinco clases. Mando y
paleta solo aparecen con `?revision`. Receta de borrado como script
(`scripts/quita-mandos.js`), probada en las seis combinaciones.

**Datos ficticios:** Pegada · yoga e pilates, Rúa do Cascallo, 9, baixo ·
36960 Sanxenxo · 986 00 00 00 · WhatsApp 600 00 00 00 · hola@pegada.example ·
recepción L–V 7:15–21:45, S 9:15–13:45. Profesorado dibujado: Antía Lourido
(hatha y yin), Uxío Castiñeiras (reformer), Sabela Pazos (pilates suelo),
Martín Oubiña (vinyasa). 41 clases semanales en dos salas. Precios de muestra
marcados (primera clase 8 €, suelta 16 €, bono 10 por 125 €, mensual 69 €,
reformer suelta 24 €). Nombre comprobado por búsqueda web: ningún estudio de
yoga o pilates «Pegada» en Galicia ni en España; «Rúa do Cascallo» no existe en
Sanxenxo.

**Línea roja del sector:** ninguna promesa de salud ni terapéutica; bloque «Lo
que no prometemos» y aviso legal que lo repite; edad mínima 16; sin menores ni
fotos de personas; `schema.org` sin `aggregateRating` ni `review`; la única
opinión está marcada como de muestra.

**Verificación:** `scripts/verifica.js`, **44/44** en verde (Playwright +
Chromium/SwiftShader, 1440×900 y 390×844, rueda con Lenis, cortina a medias y
en `display:none` en los tres casos, sin GSAP, movimiento reducido, cookies,
mando, dos densidades, tres paletas, menú móvil con `100dvh`, mapa bajo clic,
pila sticky en 40 pasos de 90 px, hero en 360×640 y 375×667, domingo, foco de
teclado, 404). axe-core: **0 violaciones** en seis estados (`AUDITORIA.md`).
`longtask` en frío: una tarea de 198 ms al cargar (SwiftShader, sin GPU) y
**ninguna** recorriendo la página entera. 31 parejas de contraste de 4,61:1 a
14,78:1. 65 capturas en `screenshots/`.
