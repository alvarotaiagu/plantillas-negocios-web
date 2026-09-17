# Estudio de fotografía

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Estudio de fotografía | CHINAGRAPH (Vigo) | «Hoja de contactos» — una web de fotógrafo sin ni una fotografía, a propósito | cuarto oscuro: fondo #0C0A0A / panel #15100F / línea #2A2220 / acero #4A403D / humo #B0A7A3 + rojo de lápiz graso #FF2D2D | Archivo Narrow + Azeret Mono + Public Sans | la marca de lápiz rojo que elige la toma buena, trazada fotograma a fotograma | [repo](https://github.com/alvarotaiagu/plantilla-fotografia-web) | [demo](https://alvarotaiagu.github.io/plantilla-fotografia-web/) |

**Porqué del concepto:** el sector tenía un problema obvio —un fotógrafo vende
fotos y aquí no se puede enseñar ninguna— y la plantilla lo convierte en su
argumento. Un estudio ficticio no tiene obra; rellenar su portfolio con fotos de
archivo o con el trabajo de otro sería justo lo que no debe hacer nadie que viva
de la imagen. Así que se enseña **todo lo que rodea a la foto menos la foto**: la
hoja de contactos con doce fotogramas vacíos («sin exponer») y su ficha técnica,
los cuatro círculos de lápiz rojo que marcan los elegidos, el visor del hero con
la retícula de tercios y el encuadre en blanco, el esquema de luz del plató
dibujado en SVG, el proceso y los derechos.

**Ventaja para el reskin:** los doce huecos ya tienen proporción (3:2) y recorte
decididos. Meter las fotos del estudio real es sustituir el `<span>sin
exponer</span>` por un `<img>` y borrar el aviso de la cabecera de la sección.

**Aviso de contenido cumplido:** cero fotografías y dicho seis veces (titular,
aviso de la hoja, preguntas, pie, aviso legal y créditos). Ninguna imagen de
personas, ni de archivo ni generada, para no fingir autorizaciones de derechos de
imagen. Se dice expresamente que no se fotografía a menores. Y hay una sección
entera de **derechos** —autoría frente a uso cedido, permiso de las personas que
salen, permiso para publicar el trabajo del cliente— que es lo que falta en casi
todas las webs del sector, con su aviso de que no sustituye a un contrato.

**Verificación:** seis pasadas de siempre, consola limpia, **0 imágenes en la
página** (comprobado en la verificación, no de palabra) y **axe-core sin
violaciones** en escritorio y móvil sobre las tres páginas.

**Datos ficticios:** Rúa do Fotograma 6, baixo · 36202 Vigo (Pontevedra) ·
986 00 00 00 · hola@chinagraph.example. Mapa a la ciudad, nunca a un portal. Sin
`aggregateRating`, con `noindex, nofollow` y sello de demo en footer, README y
comentario HTML.
