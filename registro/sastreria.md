# Sastrería a medida

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Sastrería a medida | Sastrería Arume (Betanzos, A Coruña) | «El revés» — lo que se ve de una chaqueta es la mitad; la otra mitad está por dentro | hueso #EFE9E1 / topo #E1D9CD / crema #FBF8F4 / tinta #2B2622 / burdeos #7D2B32 / forro #6B4F3A | EB Garamond + Inter Tight | **la chaqueta se gira de verdad** (rotateY en 3D con las dos caras dibujadas) y enseña entretela, hombrera, sisa, bolsillo interior, ojal a mano y el bajo, con resaltado cruzado entre el dibujo y la lista | [repo](https://github.com/alvarotaiagu/plantilla-sastreria-web) | [demo](https://alvarotaiagu.github.io/plantilla-sastreria-web/) |

**Porqué del concepto:** las dos imágenes evidentes estaban descartadas de antemano —la
balda de lomos de la librería y el escaparate con percha de BeCool—, y además las dos
enseñan el exterior, que es justo lo que no distingue una prenda a medida. La entrada es
la contraria: **lo que decide cómo cae una chaqueta a los cinco años no se ve al
probártela**. Así que la prenda del hero, presentada con un pie que dice «aquí no hay nada
que mirar: todas las chaquetas se parecen por fuera», es la misma que en la sección
siguiente se da la vuelta.

**Estructura distinta de las dos anteriores:** cerámica tenía una tarjeta pegada con tres
estados; apicultura, una lámina comparativa de cuatro sin nada escondido; aquí hay **un
solo objeto con dos caras** y una lista que dialoga con él. Al enfocar una pieza de la
lista, la chaqueta **se gira sola**: señalar una pieza de la cara que no se ve no sirve de
nada.

**Segundo recurso, «Sesenta horas»:** un cuadrado por hora de trabajo repartido en nueve
tareas, que aparecen escalonados. Es un recuento, no un gráfico —se cuentan con el dedo— y
sostiene el precio sin discurso: 60 cuadrados, 26 a mano.

**Obra gráfica propia:** las dos caras de la chaqueta (derecho con solapas, cuello, botón,
bolsillo de pecho y dos de cadera; revés con sombra del hueco, forro, entretela con su
trama, hombreras, sisas, bolsillo interior, ojal y bajo hilvanado), los seis números, la
aguja enhebrada del logotipo, la cortina, los cuadrados y la chaqueta hilvanada del 404.

**Tres fallos del dibujo que solo se ven mirándolo** (y que se corrigieron): la entretela
se salía de los paneles y tapaba la abertura del delantero, con lo que el centro de la
chaqueta salía blanco —era el fondo de la página colándose por el hueco de la V—; detrás
de esa abertura no había nada, un agujero en vez de una sombra; y el bolsillo interior, el
ojal y los números caían fuera de lo que decían señalar.

**Cortina de entrada:** se cose una puntada, la aguja la remata, una costura de hilván
recorre el borde de abajo y **la cortina se levanta por esa costura**, con el borde
curvado. `expo.inOut`, entrega al hero y retirada verificada en los tres casos.

**Accesibilidad:** **axe-core, 0 violaciones**, en nueve pasadas, incluidas **las dos caras
de la chaqueta por separado** (la que queda de espaldas lleva `aria-hidden="true"`, y se
verifica que se intercambian al girar). Los dos botones son un par con `aria-pressed` y el
estado se dice también en palabras. Único sitio donde esta plantilla atenúa con `opacity`:
los números del dibujo que no están señalados, y está anotado en `AUDITORIA.md` por qué se
acepta ahí (el número no es contenido, es un puntero, y está escrito en la lista a
contraste completo).

**Hallazgo que merece la pena anotar:** el burdeos de marca **pasa AA como texto** (6,63),
al contrario que el celadón de la cerámica (2,56) y el ámbar de la apicultura (2,80), que
hubo que derivar. No todo color de marca hay que corregirlo: hay que medirlo, y a veces la
medida sale bien.

**Rendimiento:** `PerformanceObserver` de `longtask`: **ninguna tarea larga** en tres
cargas en frío con la caché deshabilitada.

**Línea roja del sector:** aquí no es sanitaria, es **de credenciales y de vocabulario**.
No se cuelga ningún título, escuela, premio ni taller famoso por el que se haya pasado, y
el aviso legal explica qué iría ahí y que tiene que ser comprobable. Y hay una sección,
«Qué se hace aquí y qué no», que dice por escrito que **«a medida», «semi-medida» y
«confección» no son sinónimos**, admite que también se hace semi-medida y que se vende como
tal, y niega los trajes en cuarenta y ocho horas. Las tres fotos son de archivo y **lo
dicen en su pie dentro de la página**, no solo en los créditos: enseñar como propio el
trabajo de otro es el clásico de este oficio. Nombre comprobado en búsqueda antes de
usarlo.

**Capturas:** 73 en `screenshots/`, en JPEG de calidad 72, incluidos ocho fotogramas de la cortina a mitad de camino y su retirada sin GSAP y con movimiento reducido.
