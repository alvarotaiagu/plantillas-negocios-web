# Informe de la noche — academia de idiomas «Desenredo» (2026-10-02)

> Sitio de demostración. Desenredo es un negocio ficticio.

Segunda plantilla de la noche. La primera (escuela infantil «O Abaneo»,
rama `claude/noche-escuela-infantil-abaneo`) quedó verificada (45/45, axe a
cero) a la hora y media de empezar, así que el encargo pedía hacer esta.
Rama `claude/noche-academia-idiomas`, desde `main`. No he tocado `main`,
`REGISTRO.md` ni `SECTORES.md`, ni he creado repos ni Pages.

## El negocio

**Desenredo · academia de idiomas** — Rúa do Tinteiro, 9, baixo · 32005
Ourense (calle inventada). 988 00 00 00 · WhatsApp 600 00 00 00 ·
ola@desenredo.example. L–J 9:30–13:30 y 16:00–21:30, V 9:30–14:00. Inglés,
francés, alemán, portugués y español para extranjeros; grupos de ocho como
máximo; dirige Sabela Outeiro, con Jonas, Inês y Daniel. Precios de muestra
**marcados como ficticios** (65 y 85 €/mes en grupo, 95 € preparación de
examen, 26 €/hora individual, 190 € intensivo, 30 € matrícula).

**Por qué no choca con uno real:** búsqueda web del 2026-10-02 de
«Desenredo» con academia/idiomas/escuela y Ourense: ninguna. Las academias
reales de Ourense que salen tienen otros nombres. *Desenredo* (desenredo, en
gallego) es una palabra común; no hay marca del sector con ella.

## Concepto, paleta, tipografía, movimiento

- **«Descifrar»**: un idioma nuevo empieza siendo ruido; aprender es ir
  ordenándolo. El mismo gesto en tres escalas: partículas (portada), letras
  (titulares) y palabras (el párrafo de la sección anclada).
- **Paleta** de papelería de clase: papel `#F3F2EC`, tinta `#1A1C1F`, pizarra
  `#1F2B27`, pauta azul y subrayador amarillo como superficies, y **rojo de
  corregir** `#E0402B` de acento. Alternativas Azul y Verde derivadas por
  script. Distinta de las otras siete de la noche y de la biblioteca: nadie
  usa el rojo de boli con la pauta y la pizarra.
- **Tipografía**: Instrument Serif + Onest + Caveat (nuevas en la biblioteca).
- **Movimiento protagonista**: el párrafo de A1 a C1 **anclado con scrub**;
  segundo, el saludo en partículas de la portada.

## Verificación (números)

RESULTADOS

## Decisiones tomadas solo

1. **Ourense** como ciudad (el encargo no la fijaba; ninguna plantilla de la
   biblioteca la usa).
2. **El texto de ejemplo en inglés**, aunque la academia enseñe cinco idiomas:
   es el idioma que más gente estudia y los falsos amigos con el español
   (*actually*, *embarrassed*) son los más conocidos. Para un cliente que
   enseñe sobre todo otro idioma, se cambia el párrafo (README, paso 4).
3. **Cifras en Onest**: el «1» de Instrument Serif se lee como una «l» y
   «A1» parecía «Al»; cazado en la captura, no en el código.
4. **Partículas como capa detrás del titular**, no al lado: la primera
   versión ponía el saludo a la derecha y competía con el titular; ahora es la
   pauta azul de la libreta por detrás.
5. **Accesibilidad del revuelto**: el párrafo revuelto es `aria-hidden` y el
   texto entero está en un párrafo oculto a la vista; los titulares llevan su
   texto completo para lectores de pantalla.
6. Mandos solo con `?revision`, como en la primera.

## Lo flojo

- Lo mismo del entorno que en la primera: jsDelivr bloqueado (se sirvieron los
  mismos paquetes de npm interceptando la URL), mapa de Google sin cargar y
  fuentes con cortes del proxy. **Solo Chromium**; sin dispositivo real ni
  lector de pantalla.
- **Hecha más deprisa que la primera** (aprox. una hora frente a hora y
  media): menos obra gráfica propia (no hay ilustración, solo tipografía,
  partículas e isotipo) y la sección de idiomas es una tabla bien compuesta,
  no una pieza memorable.
- El párrafo revuelto cambia letras cada 140 ms mientras se ve: con
  movimiento reducido se queda quieto (revuelto pero fijo), que es lo correcto,
  pero conviene que alguien lo vea con lector de pantalla real.
- Las horas por nivel de la versión sobria son de referencia y redondeadas;
  revisar antes de enseñarlas a un cliente.
