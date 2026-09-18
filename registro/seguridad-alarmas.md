# Empresa de seguridad y alarmas

| # | Sector | Negocio ficticio | Concepto | Paleta | Tipografía | Movimiento protagonista | Repo | Demo |
|---|---|---|---|---|---|---|---|---|
| — | Seguridad y alarmas | ALDRABA Seguridad (Ferrol, A Coruña) | «Secuencia» — lo que contratas no es una sirena, es lo que pasa en los dos minutos siguientes | casi negro azulado: fondo #07080C / panel #0D1016 / panel2 #131722 / línea #1F2534 / acero #39425A / humo #A2AABE / hueso #EAEEF7 + azul señal #3D5AFE (y #6E82FF para texto) | Khand + Space Mono + Sora | el reloj de un salto de alarma: el scroll son los segundos, de 00:00 a 02:00, y los ocho pasos del procedimiento desfilan en horizontal | [repo](https://github.com/alvarotaiagu/plantilla-seguridad-alarmas-web) | [demo](https://alvarotaiagu.github.io/plantilla-seguridad-alarmas-web/) |

**Porqué del concepto:** el sector vende con miedo casi sin excepción —la sombra
en la ventana, el porcentaje de robos de tu provincia, el «cada X minutos entran
en una casa»—, y es eficaz precisamente porque saca la conversación del sitio
donde debería estar. Lo que una empresa de alarmas vende de verdad es un
**procedimiento**: quién recibe la señal, quién la verifica, a quién llama, en qué
orden, qué queda por escrito y qué no puede hacer. Así que el recurso protagonista
no es la recreación de un robo: es la secuencia entera, segundo a segundo,
**incluido el paso en el que resulta que era el gato**.

**Los dos avisos del encargo, cumplidos y verificables:**

1. **Nada que juegue con el miedo.** El hero dice, en su tercera línea, que en
   esta web no hay ninguna estadística de robos y por qué. Hay una sección entera
   —la 04, «Límites»— dedicada a **lo que una empresa de alarmas NO puede hacer**:
   no detiene a nadie, no garantiza que venga la policía, no avisa sin verificar,
   una alarma no impide que entren, y no se miran tus cámaras «por si acaso».
2. **Ninguna estadística inventada.** Cero cifras de delincuencia. El arnés de
   verificación lo comprueba a propósito: recoge **todas** las líneas de la página
   que hablen de robos, delitos, allanamientos o asaltos y se mira una por una;
   las seis que salen son frases que explican por qué no hay datos, ninguna lleva
   un número. Las únicas cifras con contador —11 años, 9 municipios, 24 h, 7
   personas— son de la empresa ficticia y llevan su propia nota diciéndolo.

**Las dos secciones que el sector no publica** y que son el argumento de venta
honesto: **falsas alarmas** (la causa cotidiana real de que la gente acabe con el
sistema apagado, con las cuatro causas más comunes en pila de tarjetas y qué se
hace con cada una — sin un solo porcentaje, y dicho: los nuestros serían
inventados) y **cámaras y privacidad**, con un plano SVG de dónde puede mirar una
cámara y dónde no: la vía pública y la ventana del vecino salen tachadas en rojo.

**El nombre, comprobado y cambiado.** La primera idea era VIXÍA. La búsqueda
devolvió **Vixia 10 A, S.L.**, una sociedad real en Lalín dedicada a «servicios de
vigilancia y venta e instalación de cámaras de seguridad»: el mismo sector. Se
descartó. **ALDRABA** no aparece en el sector en España y además dice el concepto:
una aldraba es la argolla de llamar a una puerta, el aparato más viejo del oficio,
que no impide entrar a nadie —solo avisa de que hay alguien—, que es exactamente
lo que hace una alarma.

**Cortina de entrada:** la ventana de entrada, contada hacia atrás. La argolla se
dibuja, la señal sale en ondas, el reloj va de 00:03 a 00:00 y, al llegar a cero
sin incidencia, pone «DESARMADO» y la hoja se levanta con el canto curvado.

**Sin generador de imágenes:** cero fotografías, que aquí además es de fondo —las
imágenes de archivo del ramo (la sombra en la ventana, la mano con la palanca) son
justo el argumento que se evita—. Todo SVG a mano.

**Verificación:** seis pasadas (escritorio, cookies, móvil, sin GSAP, movimiento
reducido, 404 y aviso legal), consola limpia salvo los cortes de CDN provocados a
propósito, **0 imágenes rotas**, **0 marcadores pendientes**, **0 px de
desbordamiento horizontal en móvil**, mapa: 0 iframes antes de pulsar y 1 después
apuntando a la localidad, y las preguntas abriendo con `<details>` nativos.
Capturas en `screenshots/`.

**Accesibilidad:** axe-core encontró **7 nodos** —el hueso `#EAEEF7` sobre el azul
de marca `#3D5AFE` se queda en **4,41**, justo por debajo de 4,5, en los botones y
en los números de sección—. Como manda el pliego, **no se tocó el color de marca**:
se añadió el token `--sobre-azul` en blanco puro (5,13) para el texto que va
encima. Después, **sin violaciones** en escritorio y móvil sobre las tres páginas.
Ya de partida el azul de marca no se usaba nunca como color de texto sobre el
fondo (ahí se queda en 3,9): para eso está `--azul-claro`, que da 5,99.

**Sin movimiento:** el carril de la secuencia deja de anclarse y vuelve a ser una
lista con scroll horizontal que se recorre con el dedo o con el teclado; los ocho
pasos se leen igual, el reloj marca 00:00 y los contadores muestran su cifra final.

**Datos ficticios:** ALDRABA Seguridad, S.L. · Rúa das Mareas 21, baixo · 15401
Ferrol (A Coruña) · 981 00 00 00 · hola@aldraba.example · CIF B00000000. Mapa a la
localidad, nunca a un portal. Sin `aggregateRating` ni `review`, con
`noindex, nofollow` y sello de demo en el pie, en el README y en el comentario del
HTML. **El número de inscripción en el Registro Nacional de Empresas de Seguridad
se ha dejado a propósito sin inventar**, con su hueco marcado y explicado en el
aviso legal: es un dato verificable y obligatorio para una empresa real, y
falsificarlo sería grave.
