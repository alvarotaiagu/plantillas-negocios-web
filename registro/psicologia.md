# Gabinete de psicología — «Ovillo» (tanda de noche, 2026-10-02)

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Gabinete de psicología (adultos, pareja, adolescentes, familias) | Debandoira (Lugo) | «Ovillo» — se llega a consulta con un ovillo, no con un índice: el trabajo es encontrar el cabo y tirar del hilo, sin prisa | tintes de lana: lana cruda `#F4E9E1` / panel `#EADBD0` / crema `#FBF5F0` / tinta azul noche `#1E2235` / apagada `#585467` / añil `#283463` y `#1D2650` / niebla `#C9CCE0` / gualda `#D9A84E` / **rubia** de superficie `#B4533F` y de texto/botón `#8A3628` | Literata variable (opsz + wght) + Albert Sans variable | **un ovillo en canvas con física**: el cabo (cuerda de verlet) sigue al cursor; si tiras, el ovillo gira, suelta hilo y **el titular se tensa** (eje `wght` 250→~480); el scroll lo devana y el hilo suelto se apoya en la mesa | pendiente (rama `claude/noche-psicologia`, carpeta `plantilla-psicologia-web/`) | pendiente de publicar |

**Porqué del concepto:** el sector pide calma y prohíbe prometer resultados.
«Desenredar» sería una promesa; «tirar del hilo» no: describe una
conversación. El nombre sale del mismo oficio —la *debandoira* es la
devanadera gallega, donde se pone la madeja para hacer el ovillo— y la paleta
también: rubia, añil y gualda son los tres tintes clásicos de la lana.
Comprobado contra el PLIEGO §3 y las 34 fichas: «Ovillo» está libre. Vecinos:
«Traza» y «Trazo en movimiento»; aquí el hilo no se dibuja, **pesa** (gravedad,
tensión, suelo).

**Estructura** (distinta de las registradas): cortina de telón añil con hilo
→ franja fija del 024 → portada con ovillo → «Lo que traes» (párrafo que se
tiñe al leerlo) → «Cómo es empezar», escena anclada con seis nudos de la
primera llamada a la revisión → cinta → «Con quién», pila sticky de cuatro →
«Dónde», conmutador presencial/en línea sobre el dibujo de la consulta →
«Quiénes» en diagonal → tarifas pegajosas + preguntas → contacto con bloque
024, horario vivo, mapa bajo clic y formulario.

**Sector sanitario:** sin diagnósticos, sin promesas, sin «cura», **sin
testimonios** (explicado en el aviso legal). Colegiaciones `G-00000` y
`G-00001` y registro sanitario `C-27-000000` marcados «de muestra» por encargo
expreso. El **024** es el único dato real y aparece en la cabecera de las tres
páginas, el menú móvil, las preguntas y el contacto. Adolescentes sin
imágenes: dibujos abstractos de hilo.

**Mandos (`?revision`):** «Ovillo»/«Sobria» (la sobria cambia dibujos por
datos y **añade** «la primera sesión, minuto a minuto») y paleta
Rubia/Brezo/Musgo (OKLCH −90°/+115°; Musgo oscurecido en L a `#0F5D22` para
mantener 7,4:1). Receta de borrado comprobada por `scripts/borrar-mandos.js`
en las dos direcciones.

**Verificación:** `scripts/verificar.js`, 54/54 en verde; axe 0 violaciones
en cinco vistas; contraste de 63 parejas en tres paletas; `longtask` en frío:
91 + 50 ms al cargar en escritorio, 0 al hacer scroll, 61 fps (47–51 fps con
CPU ×4 en móvil). Se cazó y quitó una tarea larga de 2,1 s
(`getPointAtLength` en bucle). Solo Chromium; sin lector de pantalla real.
