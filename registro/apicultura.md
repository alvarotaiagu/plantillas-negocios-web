# Apicultura y mielería

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Apicultura y mielería | Mel do Cordal (Mazaricos, A Coruña) | «Tres quilómetros» — una miel es el mapa de lo que florece en el radio en que trabaja la abeja | lino #F2EEE3 / panel #E5DFD0 / crema #FBF9F3 / tinta #22281F / monte #2F5140 / ámbar #B8761B | Vollkorn + Karla | una **lámina comparativa** de cuatro colmenares: cuatro mapas de radio dibujados que se trazan de fuera adentro, con su flora apareciendo escalonada dentro del anillo, y **cuatro tarros que se llenan con el color real de su miel** | [repo](https://github.com/alvarotaiagu/plantilla-apicultura-web) | [demo](https://alvarotaiagu.github.io/plantilla-apicultura-web/) |

**Porqué del concepto:** el riesgo señalado era acabar en el hexágono del panal, que no
aparece en ningún sitio de esta plantilla. La entrada elegida es el **radio de pecoreo**:
tres kilómetros es lo que una abeja recorre antes de gastar más de lo que trae, así que
una miel no la hace el apicultor, la hace lo que florece dentro de ese círculo. De ahí
sale todo lo demás: cuatro colmenares, cuatro mieles, ninguna mezclada, y la explicación
de por qué cuando se acaba la de brezo hay que esperar a octubre.

**Estructura deliberadamente distinta de la de cerámica:** allí había una tarjeta pegada
con tres estados que se recorrían; aquí **no hay estados ni nada escondido**. Los cuatro
colmenares están a la vista a la vez, en lámina comparativa, y lo único que se mueve es el
dibujo al llegar a él. Era el aviso del cuartel general sobre no clonar el esqueleto.

**Obra gráfica propia:** los cuatro mapas de radio (tres anillos + el terreno de cada
sitio: brañas con su agua, curvas de nivel de una loma a 480 m, un souto de castaños en un
valle y el río cruzando), los cuatro símbolos de flora colocados uno a uno —36 marcadores
en total—, los cuatro tarros, el calendario de floración (rejilla CSS de doce columnas,
sin imagen), el logotipo, el mapa de relleno y la abeja fuera del radio de la 404.

**Detalle que sí se ve:** el terreno y la flora van recortados con un `clipPath` al anillo
exterior. Sin él, los caminos y los árboles se salían del círculo, que es exactamente lo
que el dibujo dice que no puede pasar.

**Datos vivos:** qué está floreciendo hoy (calculado con la fecha sobre la misma tabla de
meses del gráfico) y dónde se vende ahora mismo, distinguiendo el puesto del mercado del
martes de la venta en la casa el viernes y el sábado.

**Cortina de entrada:** los tres anillos se dibujan de dentro afuera, la colmena se planta
en el centro, el anillo exterior se abre hasta salirse de la pantalla y la cortina sube
detrás con un arco hondo abajo, el del radio. `expo.inOut`, entrega al hero y retirada
verificada en los tres casos (normal, sin GSAP y con movimiento reducido).

**Trampa cazada, y de las buenas:** GSAP calcula el `transformOrigin` de un elemento SVG
sobre su **bbox**, no sobre el viewBox. Al tuitear `scale` sobre el `<rect>` de la colmena
escribía `transform-origin: 0 0` y lo compensaba con un `translate(-112,-112)`: la colmena
se iba fuera del lienzo y la cortina salía con el centro vacío. **No se ve en la captura
final** —para entonces la cortina ya no está—, solo midiendo el `transform` a mitad de
animación. Los dos gestos SVG pasaron a CSS con una clase, que sí resuelve el origen
contra el viewBox.

**Accesibilidad:** **axe-core, 0 violaciones a la primera pasada**, en ocho pasadas. La
paleta se calculó con el script de razón WCAG antes de escribir el CSS. El ámbar de marca
(2,80 como texto) se queda en rellenos y filetes, con `--ambar-texto` (5,12) y
`--ambar-claro` (6,12) aparte. La cota «3 km», que es texto dentro de SVG y axe no mira,
medida a mano: 5,87. El calendario lleva `role="img"` y un `aria-describedby` que escribe
en texto corrido las siete floraciones y las tres cosechas.

**Rendimiento:** `PerformanceObserver` de `longtask`: **ninguna tarea larga** en tres
cargas en frío con la caché deshabilitada.

**Línea roja del sector:** **ninguna propiedad medicinal atribuida a la miel**, y no por
omisión: hay una sección entera, «La miel es un alimento, no un remedio», que lo dice por
escrito y explica por qué (Reglamento CE 1924/2006, sin declaraciones autorizadas para la
miel). Lo que sí aparece es manejo del alimento —por qué cristaliza, cómo se conserva— y
**la advertencia oficial de no dar miel a menores de doce meses**, que es seguridad
alimentaria, no una promesa. Sin RGSEAA, sin REGA y **sin reclamar la IGP «Mel de
Galicia»**; el aviso legal dice qué iría en cada hueco y que esa parte no debe tocarse al
reskinear. Nombre comprobado en búsqueda antes de usarlo.

**Capturas:** 63 en `screenshots/`, en JPEG de calidad 72.
