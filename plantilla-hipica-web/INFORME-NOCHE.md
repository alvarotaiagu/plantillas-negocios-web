# Informe de la noche — Picadeiro Brañavella

> Sitio de demostración. Picadeiro Brañavella es un negocio ficticio.

Segunda plantilla de la noche, empezada a las 00:10 del 2026-10-02 tras dejar
la de yoga verificada (44/44, axe a cero) y empujada en `claude/noche-yoga`.
Rama `claude/noche-hipica` desde `main`, carpeta `plantilla-hipica-web/`, un
commit y un push por fase. Sin repositorio, sin Pages, sin tocar `main`,
`REGISTRO.md` ni `SECTORES.md`. Ficha en `registro/hipica.md`.

## El negocio y por qué no choca con uno real

**Picadeiro Brañavella**, centro ecuestre en Camiño das Cancelas, 7 · Insua,
Vilalba (Lugo). «Braña» es prado húmedo en gallego; «Brañavella», la braña
vieja. Buscado: no aparece asociado a ninguna hípica, picadero, cuadra ni
asociación de jinetes. El primer candidato, «A Chousa», se descartó porque un
club de jinetes real de A Coruña tiene «Chousa» en su dirección. Vilalba no la
usaba ninguna plantilla. Teléfonos 982 00 00 00 / 600 00 00 00, correo
`ola@branavella.example`.

## Concepto

**«Aires»**: paso, trote y galope; cada aire suena distinto (4, 2 y 3 golpes
más una suspensión). Y en la Terra Chá, el aire es el viento que peina el
prado. De ahí el hero (el prado al compás de un caballo invisible) y la
secuencia anclada (el diagrama de apoyos).

## Paleta

Nata `#F3EEE1` y avena `#E6DCC3` como fondos, prado `#1D2B1B` para lo oscuro,
heno `#E3CC88` como acento sobre oscuro y **casaca** `#8A2923` como marca (el
rojo de la casaca y de la puerta de cuadra). Distinta de la de yoga de esta
misma noche (corcho y azul atlántico) y de las de la biblioteca: el único
verde oscuro de fondo parecido es el de fotovoltaica, que es grafito con verde
señal. 23 parejas de contraste de 5,77:1 a 15,05:1, botones ≥ 7,48:1.

## Tipografía

**Playfair Display** variable (cursiva 800 para el acento), **DM Sans** y
**Fragment Mono**. Ninguna en la biblioteca.

## Movimiento protagonista

**El prado en canvas 2D**: unas 2 700 briznas a 1440 px (1 000 en móvil),
agrupadas en 12 lotes de color y grosor para dibujar 12 trazos por fotograma;
viento por senos, cursor que aparta la hierba, y ondas que abre cada golpe de
casco de un caballo que cruza sin dibujarse, al periodo y con los golpes reales
del aire elegido. Cielo, colinas y cerca, cacheados en un lienzo aparte. El
bucle duerme fuera de pantalla. Con el scroll del hero se levantan rachas.

## Verificación, con números

- `scripts/verifica.js`: **46/46** en verde (Playwright + Chromium, 1440×900 y
  390×844 con `isMobile`/`hasTouch`, rueda con Lenis).
- Cortina a medias guardada (`cortina-1-mitad`, `cortina-2-mitad`,
  `cortina-sin-gsap-mitad`), de otro color que el fondo y en `display:none` en
  los tres casos.
- Sin GSAP y con movimiento reducido: titular visible, horario vivo, el
  selector de aires cambia nota y golpes, y los botones de la secuencia llevan
  al galope (3 tiempos, 22 km/h, suspensión).
- Cookies, mando escondido mientras está el aviso, dos densidades y tres
  paletas por código (color computado, `aria-pressed`, `localStorage`, clase
  presente en `load` al recargar); sin `?revision` no aparece nada.
- Menú móvil a pantalla completa (`100dvh`) y el mismo botón lo cierra; el
  enlace del menú lleva a su sección y cierra.
- Mapa: cero iframes hasta pulsar.
- La cuadra: arrastrar 400 px con el ratón la desplaza más de 300 px, y es
  focusable porque desborda.
- Pestañas con flechas del teclado.
- Hero en 360×640 y 375×667 sin solapes (incluido el selector de aire).
- Lunes: «Hoy descansan los caballos. Abrimos mañana a las 10:00.»
- `longtask` en frío con la caché deshabilitada: **dos tareas al cargar (73 y 64 ms)** y **ninguna** recorriendo la página entera; el control de 120 ms lanzado con `setTimeout` se detecta.
- axe-core: **0 violaciones** en seis estados (`AUDITORIA.md`).
- Receta de borrado: seis combinaciones sin restos; dos copias cargadas en el
  navegador sin errores.

## Decisiones tomadas sin poder preguntar

1. **Hacer la segunda plantilla.** La de yoga quedó verificada a las 00:08 y
   quedaban más de dos horas, que es lo que el encargo pedía para intentarla.
2. **Mismo utillaje de verificación que yoga, adaptado** (arnés de capturas,
   axe, contraste, receta de borrado): el pliego permite reutilizar utillaje,
   no esqueleto. El esqueleto, la estructura y el movimiento son otros.
3. **Valores de los aires aproximados**: periodos, velocidades y apoyos son los
   de un manual de equitación, redondeados; el README lo dice.
4. **Las mismas limitaciones del entorno que en yoga**: jsDelivr y Google Fonts
   servidos en local desde npm y descargas previas para poder verificar.

## Lo flojo

- **Las cabezas de caballo** son un único dibujo recoloreado: funcionan como
  sistema, pero los ocho caballos tienen la misma cabeza.
- **La columna izquierda de «Escuela y tarifas»** se queda con aire de sobra
  bajo el bautismo en escritorio.
- **El prado** con muchas ondas a la vez (galope) hace más trabajo por
  fotograma; en SwiftShader va bien, pero no se ha medido en un móvil real.
- Un solo navegador y sin lector de pantalla real, como en toda la biblioteca.
