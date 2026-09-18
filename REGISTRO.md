# Registro de plantillas publicadas

Documento consolidado a partir de las fichas de `registro/`, que es donde
escribe cada agente (un archivo por plantilla, para que varios agentes en
paralelo no se pisen al editar este mismo documento). **Las fichas mandan: si
algo se contradice, vale lo que diga `registro/<sector>.md`.**

**27 plantillas publicadas y vivas.** Todas son negocios **ficticios**: datos
completos e inventados, `noindex` en todas las páginas, sello de demostración
en el pie y ninguna acreditación, licencia ni registro público inventado.

Consolidado el 19 de septiembre de 2026 leyendo las 27 fichas una a una. En el
mismo paso se comprobó que **las 27 demos responden 200** y se inventarió qué
hay de verdad dentro de cada repositorio publicado (ver «Estado real», más
abajo): no es un copiar y pegar de las fichas.

## Las 27 plantillas, por sector

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| 1 | Agencia de viajes | Viajes Arroaz (Viveiro, Lugo) | «Sellos» — lo que queda de un viaje es el sello en el pasaporte, y cada viaje de la casa es uno | papel #F4EFE4 / panel #ECE4D4 / crema #FBF8F1 / tinta #241F1C / verde de garita #1F4E4A / mostaza #C89A2B / rojo de tampón #A63D2F | Spectral + Epilogue | seis sellos dibujados que **se estampan** al llegar a ellos (transición CSS con rebote sobre el `<svg>`, disparada por IntersectionObserver), más los tres del pasaporte del hero | [repo](https://github.com/alvarotaiagu/plantilla-viajes-web) | [demo](https://alvarotaiagu.github.io/plantilla-viajes-web/) |
| 2 | Apicultura y mielería | Mel do Cordal (Mazaricos, A Coruña) | «Tres quilómetros» — una miel es el mapa de lo que florece en el radio en que trabaja la abeja | lino #F2EEE3 / panel #E5DFD0 / crema #FBF9F3 / tinta #22281F / monte #2F5140 / ámbar #B8761B | Vollkorn + Karla | una **lámina comparativa** de cuatro colmenares: cuatro mapas de radio dibujados que se trazan de fuera adentro, con su flora apareciendo escalonada dentro del anillo, y **cuatro tarros que se llenan con el color real de su miel** | [repo](https://github.com/alvarotaiagu/plantilla-apicultura-web) | [demo](https://alvarotaiagu.github.io/plantilla-apicultura-web/) |
| 3 | Arquitectura y reformas | Perpiaño (Lugo) | «Planta» — lo que hay y lo que va a haber, explicado en planta | papel #F6F2E9 / arena #E4DBC8 / tinta grafito #2B2724 / rojo almagre #9C3B2E / salvia #4A5245 | Newsreader + Archivo | comparador de plantas antes/después arrastrable, con los tabiques derribados en almagre y las cifras (salón, habitaciones, pasillo, baño) cambiando de lado | [repo](https://github.com/alvarotaiagu/plantilla-arquitectura-web) | [demo](https://alvarotaiagu.github.io/plantilla-arquitectura-web/) |
| 4 | Autoescuela | CARRIL DEZ (Arteixo, A Coruña) | «Carril» — la web es el camino hasta el carné, en seis tramos | fondo #0B0D10 / panel #14181F / línea #262D38 / acero #39414D / humo #A5AEBB / acento cian eléctrico #23E5FF | Saira Condensed + Space Grotesk | un coche recorriendo el trazado SVG de la ruta con scrub, pintando el camino hecho (y test de muestra que corrige de verdad) | [repo](https://github.com/alvarotaiagu/plantilla-autoescuela-web) | [demo](https://alvarotaiagu.github.io/plantilla-autoescuela-web/) |
| 5 | Balneario / casa de baños | As Caldeiras (Allariz, Ourense) | «Grados» — el circuito es una escalera de temperaturas, y la página se templa contigo | fondo piedra #F1ECE3 (frío #EAEEEC ↔ cálido #F8E6D7) / panel #E3DCD0 / tinta #33302C / frío #46545C / cálido #C2663C / cobre #B4703A | Cormorant Garamond + Jost | la estación del circuito que tienes en el centro **tiñe la página entera** (fondo, acento, barras) y mueve el termómetro fijo: de 12° gris verdoso a 45° melocotón | [repo](https://github.com/alvarotaiagu/plantilla-balneario-web) | [demo](https://alvarotaiagu.github.io/plantilla-balneario-web/) |
| 6 | Carpintería a medida | Espiga | «Ensamble» | papel de taller / tinta parda / roble / nogal | Archivo + Sora + Overpass Mono | la espiga entrando en su mortaja: dos piezas de SVG que llegan separadas, encajan solas y se pueden volver a separar con un botón | [alvarotaiagu/plantilla-carpinteria-web](https://github.com/alvarotaiagu/plantilla-carpinteria-web) | [demo](https://alvarotaiagu.github.io/plantilla-carpinteria-web/) |
| 7 | Cervecería artesanal (obrador) | TRASFEGA (Betanzos) | «Trasfega» — la cerveza cambia cinco veces de recipiente y la web hace lo mismo con el líquido | fondo #0C0D0F / panel #15171A / línea #262A2F / acero #3A4048 / humo #A9AFB8 + magenta #FF2E8A | Antonio + Chivo Mono + Chivo | escena anclada del obrador: el líquido se llena y se vacía de recipiente en recipiente con scrub (hero de canvas con malta cayendo) | [repo](https://github.com/alvarotaiagu/plantilla-cerveceria-web) | [demo](https://alvarotaiagu.github.io/plantilla-cerveceria-web/) |
| 8 | Coworking | O FAIADO (A Coruña) | «Ocupación» — el dato que nadie publica: a qué hora hay sitio | fondo #0C0C10 / panel #15161B / línea #24262D / acero #444A55 / humo #A6ABB6 + violeta eléctrico #9B6BFF | Big Shoulders Display + Manrope | el plano de la planta manejable por hora y día: lo mueve el visitante, no el scroll | [repo](https://github.com/alvarotaiagu/plantilla-coworking-web) | [demo](https://alvarotaiagu.github.io/plantilla-coworking-web/) |
| 9 | Enoteca | Trasfega | «Cata a ciegas» | papel crudo / granate de vino / oro viejo / verde botella | Gabarito + Public Sans + Overpass Mono | la funda que tapa la etiqueta y se levanta al pasar el dedo, al enfocar con el teclado o sola en el hero | [alvarotaiagu/plantilla-enoteca-web](https://github.com/alvarotaiagu/plantilla-enoteca-web) | [demo](https://alvarotaiagu.github.io/plantilla-enoteca-web/) |
| 10 | Escuela de música | Semitón | «Afinación» | marfil / negro piano / rojo de fieltro / latón | Unbounded + Manrope + JetBrains Mono | el afinador del hero: eliges cuerda, la aguja se va al desvío y vuelve al centro; y todo lo demás llega girado y se coloca | [alvarotaiagu/plantilla-escuela-musica-web](https://github.com/alvarotaiagu/plantilla-escuela-musica-web) | [demo](https://alvarotaiagu.github.io/plantilla-escuela-musica-web/) |
| 11 | Estudio de fotografía | CHINAGRAPH (Vigo) | «Hoja de contactos» — una web de fotógrafo sin ni una fotografía, a propósito | cuarto oscuro: fondo #0C0A0A / panel #15100F / línea #2A2220 / acero #4A403D / humo #B0A7A3 + rojo de lápiz graso #FF2D2D | Archivo Narrow + Azeret Mono + Public Sans | la marca de lápiz rojo que elige la toma buena, trazada fotograma a fotograma | [repo](https://github.com/alvarotaiagu/plantilla-fotografia-web) | [demo](https://alvarotaiagu.github.io/plantilla-fotografia-web/) |
| 12 | Estudio de tatuajes | Papel Vegetal | «Calco» | papel hueso / tinta casi negra / violeta de calco / rosa flúor | Syne + Space Grotesk + DM Mono | trazado de línea SVG (`stroke-dasharray` + `pathLength`) que se dibuja y después se entinta | [alvarotaiagu/plantilla-tatuajes-web](https://github.com/alvarotaiagu/plantilla-tatuajes-web) | [demo](https://alvarotaiagu.github.io/plantilla-tatuajes-web/) |
| 13 | Floristería | Ramalleira (Betanzos, A Coruña) | «Ramo» — el ramo se monta delante de ti, tallo a tallo | hueso #FBF5EC / papel kraft #EFE2CE / ciruela #3B2434 / azafrán #D98A28 / rosa #C15A6A / salvia #6F8560 | Gloock + Hanken Grotesk | sección anclada en la que el ramo dibujado se completa grupo a grupo mientras pasan los cinco pasos, con contador de tallos (0 → 13) | [repo](https://github.com/alvarotaiagu/plantilla-floristeria-web) | [demo](https://alvarotaiagu.github.io/plantilla-floristeria-web/) |
| 14 | Gimnasio / box de entrenamiento | VINTE QUILOS (A Coruña) | «Carga» — todo se mide en kilos: la página se carga de discos conforme bajas | negro #0A0B0C / carbón #101317 / grafito #171B21 / acero #272E37 / humo #AEB7C1 / acento lima #C6FF3D | Anton + Barlow Condensed + Barlow | cuadro semanal anclado con scrub horizontal (con hero de canvas: magnesio en suspensión y barra que flexiona) | [repo](https://github.com/alvarotaiagu/plantilla-gimnasio-web) | [demo](https://alvarotaiagu.github.io/plantilla-gimnasio-web/) |
| 15 | Hotel rural / casa de turismo | Casa Bricaña (Boimorto, A Coruña) | «Orballo» — el cristal empañado que hay que despejar para ver el valle | lino / arena / verde fento / óxido | Fraunces + Karla | hero de canvas: vaho con gotas que resbalan, se limpia con el dedo y se despeja con el scroll | [repo](https://github.com/alvarotaiagu/plantilla-hotel-rural-web) | [demo](https://alvarotaiagu.github.io/plantilla-hotel-rural-web/) |
| 16 | Instalación fotovoltaica | GNOMON (Lalín, Pontevedra) | «Sombra» — lo que decide una instalación no es el sol, es la sombra | grafito: fondo #0A0D0C / panel #101413 / panel2 #151A19 / línea #242B29 / acero #39423F / humo #A6B0AC / hueso #EDF2F0 + verde señal #17E08A | Archivo + JetBrains Mono | un día entero pasando sobre el tejado: el scroll son las horas, y las sombras de la chimenea y del castaño del vecino tapan módulos de verdad | [repo](https://github.com/alvarotaiagu/plantilla-fotovoltaica-web) | [demo](https://alvarotaiagu.github.io/plantilla-fotovoltaica-web/) |
| 17 | Lavandería | Escuma | «Etiqueta» | blanco verdoso / tinta verde oscura / verde jabón / amarillo de autoservicio | Schibsted Grotesk + Figtree + Fira Mono | el descifrador de etiquetas: doce símbolos de cuidado dibujados que son a la vez el sistema visual y la herramienta útil de la página | [alvarotaiagu/plantilla-lavanderia-web](https://github.com/alvarotaiagu/plantilla-lavanderia-web) | [demo](https://alvarotaiagu.github.io/plantilla-lavanderia-web/) |
| 18 | Librería | Librería Cuadratín | «Lomos» | pared verde tinta / crema / cantos saturados (rojo, mostaza, azul, verde, morado) | Familjen Grotesk + Karla + Courier Prime | la balda: 46 lomos que salen a saludar al pasar el dedo y arrastran a los vecinos, y titulares que suben desde detrás del canto | [alvarotaiagu/plantilla-libreria-web](https://github.com/alvarotaiagu/plantilla-libreria-web) | [demo](https://alvarotaiagu.github.io/plantilla-libreria-web/) |
| 19 | Mudanzas y guardamuebles | CARREXO (Ordes) | «Inventario» — en una mudanza todo lo que importa está numerado | fondo #0B0B0C / panel #141518 / línea #24262A / acero #4E535A / humo #A8AEB6 + amarillo señal #FFD11A | Bebas Neue + Roboto Mono + Work Sans | el camión anclado que se carga caja a caja con scrub | [repo](https://github.com/alvarotaiagu/plantilla-mudanzas-web) | [demo](https://alvarotaiagu.github.io/plantilla-mudanzas-web/) |
| 20 | Óptica | Óptica Sextante | «Optotipo» | blanco clínico / nube / tinta azulada / azul eléctrico + ámbar | Outfit + IBM Plex Sans + IBM Plex Mono | la carta de optotipos que se lee sola, con la regleta del examinador saltando de fila, y el enfoque (`blur` → nítido) como transición de todo lo que entra | [alvarotaiagu/plantilla-optica-web](https://github.com/alvarotaiagu/plantilla-optica-web) | [demo](https://alvarotaiagu.github.io/plantilla-optica-web/) |
| 21 | Panadería / obrador | Milmigas | «La miga» | crema de harina / tinta marrón / rojo hornada / amarillo maíz | Bricolage Grotesque + Instrument Sans + Martian Mono | canvas de fermentación en el hero (burbujas que nacen, crecen y suben) + galería anclada de seis cortes de pan | [alvarotaiagu/plantilla-panaderia-web](https://github.com/alvarotaiagu/plantilla-panaderia-web) | [demo](https://alvarotaiagu.github.io/plantilla-panaderia-web/) |
| 22 | Quesería artesanal | Queixería Bardanca (Palas de Rei, Lugo) | «Corteza» — la corteza es el diario del queso: ahí está escrito el tiempo | fondo paja #F2E9D6 / crema #FBF6EA / panel #E7DAC0 / tinta #33271B / paja #D9A41F / musgo #6E7A52 / cera #8E2B24 | Petrona + Figtree | selector de curación (20/90/180/400 días) que **transforma la rueda dibujada**: corteza, pasta, moho, ojos y cristales cambian con la ficha entera | [repo](https://github.com/alvarotaiagu/plantilla-queseria-web) | [demo](https://alvarotaiagu.github.io/plantilla-queseria-web/) |
| 23 | Sastrería a medida | Sastrería Arume (Betanzos, A Coruña) | «El revés» — lo que se ve de una chaqueta es la mitad; la otra mitad está por dentro | hueso #EFE9E1 / topo #E1D9CD / crema #FBF8F4 / tinta #2B2622 / burdeos #7D2B32 / forro #6B4F3A | EB Garamond + Inter Tight | **la chaqueta se gira de verdad** (rotateY en 3D con las dos caras dibujadas) y enseña entretela, hombrera, sisa, bolsillo interior, ojal a mano y el bajo, con resaltado cruzado entre el dibujo y la lista | [repo](https://github.com/alvarotaiagu/plantilla-sastreria-web) | [demo](https://alvarotaiagu.github.io/plantilla-sastreria-web/) |
| 24 | Seguridad y alarmas | ALDRABA Seguridad (Ferrol, A Coruña) | «Secuencia» — lo que contratas no es una sirena, es lo que pasa en los dos minutos siguientes | casi negro azulado: fondo #07080C / panel #0D1016 / panel2 #131722 / línea #1F2534 / acero #39425A / humo #A2AABE / hueso #EAEEF7 + azul señal #3D5AFE (y #6E82FF para texto) | Khand + Space Mono + Sora | el reloj de un salto de alarma: el scroll son los segundos, de 00:00 a 02:00, y los ocho pasos del procedimiento desfilan en horizontal | [repo](https://github.com/alvarotaiagu/plantilla-seguridad-alarmas-web) | [demo](https://alvarotaiagu.github.io/plantilla-seguridad-alarmas-web/) |
| 25 | Taller de cerámica | Olería Rañal (Ponteceso, A Coruña) | «Merma» — todo lo que sale del horno es más pequeño de lo que hiciste, y la plantilla lo mide | barro seco #EDE6DC / panel #DFD5C7 / crema #FAF6EF / tinta #332B24 / hierro #8A4B2A / celadón #6E8C74 | Lora + Public Sans | una **regla graduada que no se mueve** y, contra ella, **la misma jarra dibujada a sus tres tamaños reales** (22,0 → 20,5 → 19,4 cm), con la línea de altura y los cuatro datos bajando a la vez | [repo](https://github.com/alvarotaiagu/plantilla-ceramica-web) | [demo](https://alvarotaiagu.github.io/plantilla-ceramica-web/) |
| 26 | Taller mecánico | RODADURA (Culleredo, A Coruña) | «Despiece» — el taller se explica separando las piezas de una rueda | fondo #0D0F12 / panel #14181D / línea #242C35 / acero #39424E / humo #A7B0BB / acento ámbar señal #FF7A1A | Oswald + IBM Plex Mono + IBM Plex Sans | despiece anclado: siete piezas de SVG que se separan con scrub (y rueda del hero que se traza sola) | [repo](https://github.com/alvarotaiagu/plantilla-taller-web) | [demo](https://alvarotaiagu.github.io/plantilla-taller-web/) |
| 27 | Tienda y taller de bicicletas | Sete Curvas | «Perfil de etapa» | papel greige / tinta casi negra / naranja flúor / verde pino | Anybody + Chivo + Azeret Mono | perfil de altimetría fijo abajo que se pinta con el scroll, con ciclista que avanza y lectura en vivo de km, altitud y pendiente | [alvarotaiagu/plantilla-bicicletas-web](https://github.com/alvarotaiagu/plantilla-bicicletas-web) | [demo](https://alvarotaiagu.github.io/plantilla-bicicletas-web/) |

## Estado real, medido repo por repo

No es lo que dicen las fichas: es lo que hay en el `main` de cada repositorio,
comprobado el 19 de septiembre de 2026 leyendo `AUDITORIA.md`, `README.md`,
`index.html` y `js/main.js` de los 27.

| Qué | Cuántas | Estado |
|---|---|---|
| Demo que responde 200 | **27/27** | resuelto |
| Cortina de entrada, como elemento real en el `index.html` | **27/27** | resuelto |
| Auditoría con axe documentada en el repo | **6/27** | **sigue siendo deuda** |
| `longtask` medido con `PerformanceObserver` | **9/27** | **sigue siendo deuda** |

## Deuda técnica

### 1. Auditoría automática de accesibilidad — deuda en 21 de 27

Hay `AUDITORIA.md` en 5 repositorios, y otro más deja constancia de axe en
su `README`. En total, **6 de 27**: apicultura, balneario, ceramica, fotografia, sastreria, viajes.

Sin rastro de auditoría en el repositorio (21): arquitectura, autoescuela, bicicletas, carpinteria, cerveceria, coworking, enoteca, escuela-musica, floristeria, fotovoltaica, gimnasio, hotel-rural, lavanderia, libreria, mudanzas, optica, panaderia, queseria, seguridad-alarmas, taller, tatuajes.

*Matiz honesto:* que no haya rastro **no demuestra** que no se auditara; un
agente pudo pasar axe y no dejar el archivo. Pero para un documento que pretende
ser la fuente de verdad, lo que no está escrito en el repositorio no cuenta. La
forma de saldar esto es barata y está resuelta: el arnés de Playwright que
inyecta `axe.min.js`, cierra el aviso de cookies, recorre la página con la rueda
y analiza portada (escritorio y móvil), aviso legal y 404, más los estados
propios de cada plantilla. Sale un `AUDITORIA.md` por repositorio.

### 2. `longtask` con `PerformanceObserver` — deuda en 18 de 27

Medido en **9**: apicultura, arquitectura, balneario, ceramica, cerveceria, floristeria, queseria, sastreria, viajes.

Sin medir (18): autoescuela, bicicletas, carpinteria, coworking, enoteca, escuela-musica, fotografia, fotovoltaica, gimnasio, hotel-rural, lavanderia, libreria, mudanzas, optica, panaderia, seguridad-alarmas, taller, tatuajes.

Es el punto más relevante para las plantillas con canvas o WebGL, que son varias
de las que faltan. Las que lo llevan miden **en frío**, con la caché
deshabilitada (`Network.setCacheDisabled`), porque una carga templada da cero y
no prueba nada.

### 3. Un solo navegador — deuda en las 27

Todo está verificado en **Chromium** y nada más. Ni Firefox ni Safari, y ahí es
donde suelen aparecer las diferencias que importan en estas plantillas:
`backdrop-filter`, `clip-path` animado, `@property`, `transform-box` en SVG,
`100svh` y el comportamiento de `overflow: clip`.

### 4. Sin lector de pantalla real — deuda en las 27

axe es un analizador estático: no dice cómo suena una página. Falta pasar NVDA o
VoiceOver por, al menos, un titular partido en letras, un diagrama con
`role="img"` y una tabla de precios.

### 5. Sin dispositivo real — deuda en las 27

El táctil es emulado. Falta el móvil de verdad: inercia del scroll con Lenis,
barra del navegador que aparece y desaparece contra `100svh`, y el rendimiento
en un teléfono de gama media, que no se parece a un viewport de 390 px en un
portátil.

## Lo que ha salido al consolidar

Dos cosas que solo se ven mirando las 27 juntas y que no están en ninguna ficha:

1. **Dos plantillas distintas con el mismo nombre de negocio.** La cervecería
   artesanal se llama **TRASFEGA** —y su concepto también es «Trasfega»— y la
   enoteca se llama **Trasfega**. Para una biblioteca que se va a revender por
   sectores, dos fichas con el mismo nombre confunden, y da la impresión de que
   el nombre de la enoteca salió por arrastre del concepto de la cervecería.
   Queda señalado, no tocado: no son plantillas mías y las fichas no se tocan.
   Ningún otro nombre de negocio y ningún otro concepto se repite en las 27.
2. **La auditoría con axe no está hecha en todas**, al contrario de lo que se
   daba por supuesto al pedir esta consolidación: hay rastro en 6 de 27 (ver la
   deuda 1). El dato no sale de las fichas —que no lo mencionan ni siquiera
   cuando la auditoría sí se hizo— sino de mirar el contenido de cada
   repositorio publicado.

## Lo que ya no es deuda

- **La cortina de entrada** estaba como opcional en el pliego y dieciséis
  plantillas salieron sin ella. Corregido el pliego y repasadas todas: **27/27**
  la llevan como elemento real, con retirada garantizada también sin GSAP y con
  movimiento reducido.
- **Los tres repositorios vacíos de la tanda 1** (floristería, bicicletas y
  cervecería), que se cortaron antes de construir nada, están **construidos y
  publicados**: son las filas 13, 27 y 7 de la tabla.
- **El contraste a ojo.** Ahora se calcula con un script sobre la fórmula WCAG,
  midiendo cada token contra el peor de los fondos en los que aparece, y
  **antes** de escribir el CSS, no después de que lo cace una herramienta.
