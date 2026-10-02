# Escuela infantil 0-3 — «Móvil» (noche del 2026-10-02, pendiente de publicar)

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Escuela infantil (0-3 años) | O Abaneo · escola infantil (Lalín, Pontevedra) | «Móvil» — el móvil de cuna: pocas piezas colgadas de una varilla; cuando una se mueve se mueven todas un poco y luego se paran | papel `#F5EDE0` / panel `#EADFCC` / crema `#FBF7F0` / tinta índigo `#23264A` / apagado `#565875` / noche `#1B1D3A` + acento **tomate**: superficie `#D9573B`, texto `#A43820`, botón `#9F341B`, claro sobre noche `#F2A285`; fieltros fijos mostaza `#E7B44A`, salvia `#8FB3A8`, rosa `#E9B7A6`, cielo `#9DB4D6`, madera `#B98E5F` | Playfair 2.0 variable (`opsz` hasta 1200, `wdth`, `wght`) + Atkinson Hyperlegible Next | **el móvil de la portada en canvas**: cinco piezas de fieltro en dos varillas, péndulos amortiguados con giro en profundidad; el cursor (o el dedo) sopla, el scroll le da vueltas a la varilla. Segundo protagonista: la **adaptación anclada con scrub** (diez días, la silla de la familia sale por la puerta) | rama `claude/noche-escuela-infantil-abaneo` de este repo, carpeta `plantilla-escuela-infantil-web/` | pendiente de publicar |

**Porqué del concepto:** lo primero que mira un bebé tumbado es lo que cuelga
encima. Un móvil se sostiene con muy poco —una varilla, unos hilos— y es la
imagen honesta de una escuela 0-3: poca gente sosteniendo muchas cosas
pequeñas en equilibrio, sin prisa. De ahí sale todo el movimiento: nada entra
«subiendo y apareciendo»; las cosas **cuelgan, se mecen y se paran** (una
única curva de péndulo amortiguado para letras, palabras, pasos y tarjetas).
*Abanear*, en gallego, es mecer.

**Estructura** (once piezas, con la adaptación —el proceso del oficio— antes
que las aulas y las cuotas con calculadora): cortina (la manta de la siesta,
con la lúa bajando de su hilo) → portada con el móvil → manifiesto «Lo que
cuelga» con cifras desalineadas → **adaptación anclada** (seis pasos, escena
del aula) → aulas en pila sticky → «El día» en un tendedero (marquesina ligada
al scroll, franja de ahora marcada) → cocina propia con el menú de hoy →
cuotas ficticias con calculadora → cinta y opiniones de muestra → puertas
abiertas con formulario de muestra → preguntas → contacto con mapa bajo clic.

**Mandos de demostración**: solo con `?revision` en la URL. Maqueta «Móvil» /
«Sobria» (la sobria quita hilos, piezas y dibujos de las aulas y pone el dato
—plazas en grande— y **añade un gráfico de niños por educadora frente al
máximo de la normativa gallega**). Paleta Tomate / Pino / Malva, derivadas con
`scripts/paleta.js` (rotación de matiz en OKLCH y ajuste de luminosidad hasta
5:1 en texto y 7:1 en botón).

**Nombre comprobado por búsqueda web** (2026-10-02): no aparece ninguna
escuela infantil «Abaneo» ni «O Abaneo». Existe «Abanea», un festival de danza
(Gondomar/Allariz, 2022), de otro sector y otro nombre.

**Ojo, coincidencia de la noche:** en la rama `claude/noche-escuela-infantil`
otro agente arrancó en paralelo otra plantilla del mismo sector y la misma
villa («Colcha», Retallos). Para no pisarla, esta va en su propia rama. Hay que
elegir una de las dos (o publicar ambas como variantes) antes de pasar a
`REGISTRO.md`.

**Verificación:** ver `plantilla-escuela-infantil-web/INFORME-NOCHE.md`.
