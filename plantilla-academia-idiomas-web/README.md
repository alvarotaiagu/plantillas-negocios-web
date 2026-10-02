# Desenredo — academia de idiomas · Ourense (plantilla ficticia)

> **Sitio de demostración.** Desenredo es un negocio **ficticio**: el nombre,
> la dirección, los teléfonos, los precios, las personas y las opiniones son
> de muestra y no corresponden a ninguna academia real. Los precios están
> marcados como ficticios en la página. Todas las páginas llevan
> `noindex, nofollow`.

Web estática (`index.html` + `css/estilo.css` + `js/main.js`), sin build.
GSAP 3.12.5, ScrollTrigger y Lenis 1.1.13 por **jsDelivr**. `aviso-legal.html`
y `404.html` (rutas absolutas con el prefijo `/plantilla-academia-idiomas-web/`).
Scripts: `paleta.js` (paletas y contraste), `verificar.js` (Playwright),
`auditar.js` (axe) y `quitar-mandos.js`.

## Concepto: «Descifrar»

Un idioma nuevo empieza siendo **ruido**: letras que no forman nada, palabras
que se parecen a otras y no son. Aprender es ir **ordenándolo**. De ahí:

- la **portada**: un saludo hecho de puntos de tinta que se ordena en gallego,
  inglés, francés, alemán, portugués y español; el cursor lo enreda, el clic
  cambia de idioma, el scroll lo sacude;
- los **titulares** llegan con las letras revueltas y se ordenan de izquierda
  a derecha (el char-reveal de esta plantilla);
- la sección protagonista, **anclada con scrub**: el mismo párrafo en inglés
  de A1 a C1; cada nivel desenreda las palabras que se entienden en ese punto,
  con el porcentaje entendido y las correcciones del profesor a boli rojo
  (falsos amigos incluidos: *actually*, *embarrassed*).

La papelería del oficio hace el resto: margen rojo de libreta fijo a lo largo
de la página, pauta azul, subrayador amarillo detrás de las cursivas, pizarra
en la prueba de nivel y anotaciones a mano (Caveat).

## Qué hace esta mejor que las anteriores

Revisadas: **Semitón** (escuela de música, la más cercana en oficio),
**Trinquete**, **Ramalleira** y la propia **O Abaneo** de esta noche.

1. **La sección protagonista enseña el producto, no lo describe.** Semitón
   explicaba sus cursos en tarjetas; aquí el visitante *vive* el progreso:
   baja y el mismo texto pasa del 54 % al 100 % entendido.
2. **Un mismo gesto en tres escalas**: partículas (portada), letras
   (titulares) y palabras (el párrafo). En las anteriores, el char-reveal era
   un fade de letras sin relación con el concepto.
3. **Herramienta útil en la página**: una prueba de nivel de muestra que
   corrige en rojo con la explicación del error, sin backend.
4. **Cifras legibles por decisión tipográfica**: el «1» de Instrument Serif se
   lee «l» (A1 → «Al»): todas las cifras van en Onest.
5. Mandos solo con `?revision`, tareas largas medidas y axe en el repo.

## Mapa de secciones

1. Cortina: la hoja de libreta; el boli subraya el nombre y la hoja pasa con
   el canto curvo. 2. Portada con el saludo en partículas. 3. **Descifrar**
   (anclada). 4. Idiomas y niveles en una pauta + cuatro reglas de la casa con
   cifras grandes. 5. Prueba de nivel en la pizarra. 6. Precios (ficticios).
7. Cinta de saludos + opiniones de muestra. 8. Preguntas. 9. Contacto y mapa
   bajo clic.

Recursos del PLIEGO §2 (8): Lenis, char-reveal (descifrado), marquesina
ligada al scroll, botones magnéticos, cursor contextual («enreda», «lee»),
hero de canvas, pin con scrub, contador de porcentaje.

## Paleta y tipografía

Papel `#F3F2EC`, panel `#E4E5DC`, tinta `#1A1C1F` (15,2:1), apagado `#52565F`,
pizarra `#1F2B27` con tiza `#EDEFE8` (12,6:1), pauta `#B9CCE0` y subrayador
`#F5E35A` (solo superficies), acento **rojo de corregir** `#E0402B` (texto
`#B42B1A` 5,0:1 sobre panel, botón `#AB2110` 7,1:1). Alternativas del mando:
**Azul** y **Verde**, derivadas con `scripts/paleta.js`.
Tipografía: Instrument Serif + Onest + Caveat (ninguna usada antes).

## Reskinear para una academia real

1. Datos: `Desenredo`, `Rúa do Tinteiro`, `988 00 00 00`, `600 00 00 00`,
   `desenredo.example` en las tres páginas y el `ld+json`.
2. Horario: `pintarEstado()` en `main.js`.
3. Idiomas y niveles: la tabla `.pauta` (clase `si`/`no` por celda).
4. El párrafo de «Descifrar»: cada palabra lleva `data-n` (1 = A1 … 5 = C1);
   las notas, `data-n` del nivel en que aparecen. Cambiar el texto al idioma
   estrella de la academia.
5. Prueba de nivel: `data-correcta` en cada `fieldset`, textos en
   `data-ok`/`data-ko`.
6. Precios: la lista `.tarifas`; quitar el sello de «ficticios» solo con los reales.
7. Color: tokens de acento en `:root`; pasar `scripts/paleta.js`.
8. Logo y `og.png`. 9. Aviso legal con datos reales. 10. Quitar los mandos.

## Quitar los mandos (maqueta y paleta)

Todo lo suyo está entre marcas `MANDOS-INICIO` / `MANDOS-FIN` en `index.html`,
`aviso-legal.html`, `css/estilo.css` y `js/main.js` (incluida una condición
en línea dentro de `descifrar()`). Receta comprobada por script:

```sh
node scripts/quitar-mandos.js ../desenredo-cliente
```

Última pasada: 4 bloques fuera de `index.html` (40 líneas), 2 de
`aviso-legal.html`, 2 de `estilo.css` (26) y 2 de `main.js` (12); sin rastro y
`main.js` válido. La primera pasada **encontró una fuga** (una comprobación de
`maqueta-sobria` fuera de las marcas) y se negó a dar por buena la copia.

## Decisiones

- **Sin ningún «centro examinador oficial»**: se preparan exámenes, se dice
  expresamente que no se examina aquí.
- **Horas por nivel** en la versión sobria: cifras orientativas de referencia
  para el inglés, redondeadas y marcadas como orientativas.
- **Nada para menores de doce**: coherente con no enseñar niños en ninguna
  imagen y con un público adulto.
