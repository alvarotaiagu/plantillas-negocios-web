# Retallos · Escola Infantil (Lalín) — plantilla

> **Sitio de demostración.** Retallos es un negocio ficticio; los datos,
> ilustraciones y opiniones son de muestra. No hay ninguna escuela infantil
> real con este nombre (comprobado por búsqueda web el 2026-10-02: en Lalín
> existen Pontiñas, Polígono y Donramiro; «Retallos» solo aparece como título
> de libros de texto de gallego y de una revista escolar de un CEIP).

En construcción en la rama `claude/noche-escuela-infantil`. Este README se
completa al final de la tanda.

## Concepto: «Colcha»

Una escuela de 0 a 3 años es un sitio donde llegan treinta y nueve criaturas
que no se parecen en nada: una duerme a las diez, otra no quiere el puré, otra
llega en brazos y otra corriendo. **Retallos** (retales, en gallego) es eso:
la escuela no recorta los retales para que encajen, **los cose como vienen**.
De ahí sale todo: una colcha de retales tendida en la portada que se puede
empujar, costuras (pespunte) que se cosen al bajar, bordes cortados a tijera
de picos, y el periodo de adaptación contado como una colcha que gana un
retal cada día.

El concepto sale del **nombre de la marca**, no de un ángulo de nicho, y el
segundo motivo sale del oficio: **en 0–3 nadie lee todavía**, así que la
percha, el vaso, el cajón y la cama de cada criatura llevan el mismo dibujo.
El equipo se presenta igual: cada persona es su percha y su símbolo.

## Qué hace esta mejor que las anteriores

Mirado contra «Semitón» (escuela de música), «Ramalleira» (floristería),
«Espazo Bilitroque» y «Trinquete», con sus capturas delante:

1. **La portada es un objeto físico, no una ilustración.** La colcha es una
   tela simulada (Verlet en 3D, 26×20 nudos) pintada en WebGL con luz, que
   cae de cinco pinzas, se mueve con el viento y se deja **empujar con el
   cursor o el dedo**. Las portadas anteriores eran dibujos que se animan
   solos (afinador, ramo); esta responde.
2. **La narrativa anclada cuenta un proceso real del oficio con datos**: los
   diez días de la adaptación, con horas en el centro, dónde está la familia
   (dentro del aula, en el pasillo, fuera) y la colcha creciendo un retal por
   día. Ramalleira montaba un ramo; aquí cada paso es una regla de la casa.
3. **Datos vivos en tres sitios a la vez** (abierto/cerrado, la franja del día
   que está pasando ahora mismo sobre la cuerda del horario, y el menú de hoy
   marcado), más una calculadora de cuota mensual. Semitón tenía una tabla de
   precios estática.
4. **Escala tipográfica variable de verdad**: Literata con eje óptico a 72 en
   titulares de hasta 9 rem y el peso que respira con el cursor; las
   plantillas anteriores usaban titulares a 4–5 rem en un solo peso.
5. **El aviso de cookies no tapa la portada**: es una tira compacta que deja
   leer el titular y las llamadas (en Semitón y Ramalleira el aviso tapaba el
   texto del hero en 1440×900).

## Paleta

| Token | Valor | Uso |
|---|---|---|
| papel | `#F4EDE2` | fondo |
| panel | `#EADFCC` | bandas |
| crema | `#FBF7F0` | tarjetas |
| tinta | `#2A221E` | texto (13,4:1 sobre papel) |
| apagado | `#5F544C` | secundario (6,3:1 sobre papel) |
| acento «Vichy» | `#2B4F8E` | botones y enlaces |
| cereza / mostaza / salvia / rosa | `#B23A2E` / `#D99A2B` / `#6F8C72` / `#E3A598` | solo retales y superficies |

## Tipografía

Literata (variable, `opsz` 7–72) para titulares y cuerpo largo, Albert Sans
para interfaz, Shantell Sans solo para las etiquetas escritas a rotulador
(perchas, notas al margen).
