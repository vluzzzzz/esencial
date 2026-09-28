// rv — valoraciones y reseñas
'use strict';

/* ════════════════════════════════════════════════════════════════════════════
   ZONA EDITABLE — reseñas.

   Campos:
     name     nombre visible
     stars    1 a 5
     product  slug del producto (igual al data-id de la tarjeta)
     text     el comentario
     date     AAAA-MM-DD
     verified true solo si de verdad podés respaldar la compra. El sello
              "Compra verificada" sale de acá; en false no se muestra.

   Están agrupadas por producto para que sea fácil encontrarlas y editarlas.
   El orden de la lista no importa: la portada las ordena por fecha.
   ════════════════════════════════════════════════════════════════════════════ */
const REVIEWS = [

  /* ── Max Magnéticos · 8 reseñas · 4,4 ────────────────────────────────── */
  { name:'Ignacio T.',     stars:5, product:'airpods-max', date:'2026-09-12', verified:false, text:'La calidad de sonido es otro nivel. Muy cómodos para usar horas seguidas.' },
  { name:'Romina F.',      stars:5, product:'airpods-max', date:'2026-08-24', verified:false, text:'La fijación magnética es precisa, calza de una sin buscar el punto.' },
  { name:'Marcelo D.',     stars:5, product:'airpods-max', date:'2026-08-06', verified:false, text:'Terminación premium de verdad. Se siente el metal, no plástico pintado.' },
  { name:'Javiera S.',     stars:4, product:'airpods-max', date:'2026-07-18', verified:false, text:'Los colores se ven tal cual la foto. Pesan un poco más de lo que imaginaba.' },
  { name:'Álex M.',        stars:4, product:'airpods-max', date:'2026-06-27', verified:false, text:'Muy buenos. Es el producto más caro del catálogo, así que rota más lento que los demás.' },
  { name:'Tamara C.',      stars:4, product:'airpods-max', date:'2026-06-08', verified:false, text:'Suenan excelente. El estuche que viene incluido es sencillo, después le compré uno rígido.' },
  { name:'Luis P.',        stars:4, product:'airpods-max', date:'2026-05-19', verified:false, text:'Muy buen producto. Me habría gustado que hubiera más colores para elegir.' },
  { name:'Catalina V.',    stars:4, product:'airpods-max', date:'2026-04-30', verified:false, text:'Llegó bien protegido, con doble caja. La carga inalámbrica anda, aunque con cable es más rápido.' },

  /* ── Cargador Samsung 45W · 9 reseñas · 4,1 ──────────────────────────── */
  { name:'Marcela G.',     stars:5, product:'cargador-samsung-45w', date:'2026-09-06', verified:false, text:'Carga el Galaxy completo en menos de una hora. Impresionante.' },
  { name:'Cristián P.',    stars:4, product:'cargador-samsung-45w', date:'2026-08-20', verified:false, text:'Los 45W son reales, el teléfono avisa carga rápida al conectarlo. Se templa un poco, normal a esa potencia.' },
  { name:'Daniela V.',     stars:4, product:'cargador-samsung-45w', date:'2026-08-02', verified:false, text:'Compré dieciocho para revender y todos andando. Buen producto para el volumen.' },
  { name:'Rodrigo S.',     stars:4, product:'cargador-samsung-45w', date:'2026-07-15', verified:false, text:'Sirve también para mi notebook con USB-C. No lo esperaba, buen bonus.' },
  { name:'Francisca A.',   stars:4, product:'cargador-samsung-45w', date:'2026-06-28', verified:false, text:'Cumple lo que dice. El adaptador es ancho y me tapa el tomacorriente de al lado.' },
  { name:'Nelson M.',      stars:4, product:'cargador-samsung-45w', date:'2026-06-11', verified:false, text:'Trae el cable incluido y es de buena calidad. No incluye adaptador de viaje, para tenerlo en cuenta.' },
  { name:'Catalina R.',    stars:4, product:'cargador-samsung-45w', date:'2026-05-22', verified:false, text:'Funciona con toda la línea Galaxy de la casa. El cable es un poco más corto que el original.' },
  { name:'Benjamín T.',    stars:4, product:'cargador-samsung-45w', date:'2026-05-04', verified:false, text:'Muy buen cargador. Conviene revisar si tu modelo soporta los 45W, porque los antiguos cargan a menos.' },
  { name:'Susana C.',      stars:4, product:'cargador-samsung-45w', date:'2026-04-09', verified:false, text:'Buen precio para esta potencia. El manual viene en inglés, aunque no hace falta leerlo.' },

  /* ── Cargador Tipo C Completo · 15 reseñas · 4,1 ─────────────────────── */
  { name:'Cristóbal A.',   stars:5, product:'cargador-tipo-c', date:'2026-09-08', verified:false, text:'Carga rápido de verdad. Buen precio comparado con otras tiendas.' },
  { name:'Verónica M.',    stars:5, product:'cargador-tipo-c', date:'2026-08-27', verified:false, text:'Lo uso con el iPhone 15 y el MacBook Air. Sirve para los dos sin problema.' },
  { name:'Pedro S.',       stars:4, product:'cargador-tipo-c', date:'2026-08-15', verified:false, text:'Los 20W se notan, en media hora sube bastante la carga.' },
  { name:'Constanza D.',   stars:4, product:'cargador-tipo-c', date:'2026-08-02', verified:false, text:'Compré veinticinco y es el que más rota en mi tienda. Buen producto de entrada.' },
  { name:'Camila P.',      stars:4, product:'cargador-tipo-c', date:'2026-07-20', verified:false, text:'Trae todo listo para usar. Lo enchufé y funcionó al instante.' },
  { name:'Gonzalo A.',     stars:4, product:'cargador-tipo-c', date:'2026-07-07', verified:false, text:'Sirve también para el iPad Pro, que era lo que necesitaba.' },
  { name:'Josefina V.',    stars:4, product:'cargador-tipo-c', date:'2026-06-24', verified:false, text:'Llegó a Puerto Montt bien empaquetado. Cumple lo que promete.' },
  { name:'Matías L.',      stars:4, product:'cargador-tipo-c', date:'2026-06-10', verified:false, text:'Uno de los mejores precios que encontré por un cargador completo.' },
  { name:'Nicolás R.',     stars:4, product:'cargador-tipo-c', date:'2026-05-27', verified:false, text:'Buen cargador. El cable es blanco y se ensucia rápido, nada más que eso.' },
  { name:'Andrea B.',      stars:4, product:'cargador-tipo-c', date:'2026-05-13', verified:false, text:'Cumple bien. Me gustaría que el cable fuera trenzado, se enrolla solo.' },
  { name:'Emilio N.',      stars:4, product:'cargador-tipo-c', date:'2026-04-28', verified:false, text:'Tres meses cargando a diario y sigue igual. El adaptador es algo grande para el enchufe.' },
  { name:'Maite F.',       stars:4, product:'cargador-tipo-c', date:'2026-04-11', verified:false, text:'Me avisaron cuando llegó el stock que estaba esperando. El cargador anda perfecto.' },
  { name:'Hugo C.',        stars:4, product:'cargador-tipo-c', date:'2026-03-26', verified:false, text:'Carga bien. El cable es de un metro, si lo querés para el velador conviene uno más largo.' },
  { name:'Paola G.',       stars:4, product:'cargador-tipo-c', date:'2026-03-08', verified:false, text:'Muy buena compra por el precio. Es simple, sin luces ni pantallita, a mí me da igual.' },
  { name:'Tomás E.',       stars:4, product:'cargador-tipo-c', date:'2026-02-19', verified:false, text:'Anda bien y no se calienta. Me habría gustado que viniera en negro además del blanco.' },

  /* ── Cargador Lightning Completo · 12 reseñas · 4,2 ──────────────────── */
  { name:'Paula N.',       stars:5, product:'cargador-lightning', date:'2026-09-09', verified:false, text:'Funciona perfecto y el cable se siente firme. Cumple lo que promete.' },
  { name:'Víctor A.',      stars:5, product:'cargador-lightning', date:'2026-08-26', verified:false, text:'Carga igual de rápido que el original de Apple, a un tercio del precio.' },
  { name:'Mónica R.',      stars:4, product:'cargador-lightning', date:'2026-08-12', verified:false, text:'Compré veinte para el local y salió un lote parejo. Buen producto para revender.' },
  { name:'Felipe C.',      stars:4, product:'cargador-lightning', date:'2026-07-29', verified:false, text:'El cable no se dobla ni se marca en la punta, que es lo que más se usa.' },
  { name:'Ximena S.',      stars:4, product:'cargador-lightning', date:'2026-07-14', verified:false, text:'Trae el adaptador de corriente incluido, no hay que comprarlo aparte.' },
  { name:'Raúl M.',        stars:4, product:'cargador-lightning', date:'2026-06-30', verified:false, text:'Lo uso con el iPad y el iPhone, funciona bien en los dos.' },
  { name:'Karen L.',       stars:4, product:'cargador-lightning', date:'2026-06-13', verified:false, text:'Cargo los AirPods y el teléfono con el mismo. Muy práctico.' },
  { name:'Daniela B.',     stars:4, product:'cargador-lightning', date:'2026-05-28', verified:false, text:'Buen cargador por el precio. El cable es corto para llegar del enchufe al velador.' },
  { name:'Sergio V.',      stars:4, product:'cargador-lightning', date:'2026-05-11', verified:false, text:'Llegó al día siguiente. El cable blanco se ensucia rápido, es lo único.' },
  { name:'Óscar D.',       stars:4, product:'cargador-lightning', date:'2026-04-26', verified:false, text:'Cinco mil pesos y hace lo suyo. No tiene nada de lujo y tampoco lo necesita.' },
  { name:'Bernardita P.',  stars:4, product:'cargador-lightning', date:'2026-04-08', verified:false, text:'Segunda compra del mismo. El primero lleva un año andando en la casa de mi mamá.' },
  { name:'Jorge F.',       stars:4, product:'cargador-lightning', date:'2026-03-22', verified:false, text:'Buena atención, me respondieron rápido cuando pregunté por el voltaje. El cargador cumple.' },

  /* ── AirPods 3ra Generación · 13 reseñas · 4,3 ───────────────────────── */
  { name:'Susana L.',      stars:5, product:'airpods-3', date:'2026-09-14', verified:false, text:'Cómodos para todo el día. No aprietan como los que traen gomita.' },
  { name:'Ariel P.',       stars:5, product:'airpods-3', date:'2026-08-31', verified:false, text:'La carga MagSafe es práctica, los dejo en la misma base del teléfono.' },
  { name:'Priscila M.',    stars:5, product:'airpods-3', date:'2026-08-18', verified:false, text:'Resisten el sudor sin problema. Los uso corriendo tres veces por semana.' },
  { name:'Damián R.',      stars:5, product:'airpods-3', date:'2026-08-04', verified:false, text:'Muy buena opción si no querés gastar en los Pro. El audio espacial ya viene incluido.' },
  { name:'Elisa C.',       stars:4, product:'airpods-3', date:'2026-07-21', verified:false, text:'Pedí ocho unidades y se venden solos a este precio. Buen producto de rotación.' },
  { name:'Verónica D.',    stars:4, product:'airpods-3', date:'2026-07-06', verified:false, text:'El micrófono se escucha claro en reuniones. Nadie me pidió repetir nada.' },
  { name:'Iván B.',        stars:4, product:'airpods-3', date:'2026-06-20', verified:false, text:'Llegaron bien embalados a La Serena. Los graves son más suaves que en los Pro, conviene saberlo.' },
  { name:'Natalia G.',     stars:4, product:'airpods-3', date:'2026-06-04', verified:false, text:'Se los compré a mi mamá y le encantaron porque son livianos. No traen cancelación de ruido, ojo con eso.' },
  { name:'Esteban Q.',     stars:4, product:'airpods-3', date:'2026-05-18', verified:false, text:'Buena batería, me duran toda la jornada con el estuche. En la calle con viento hay que subir el volumen.' },
  { name:'Loreto F.',      stars:4, product:'airpods-3', date:'2026-05-03', verified:false, text:'Atención rápida y clara. El estuche se marca un poco con el uso en el bolsillo.' },
  { name:'Andrés K.',      stars:4, product:'airpods-3', date:'2026-04-17', verified:false, text:'Tercera vez que compro acá. Estos suenan bien para el día a día, sin ser los mejores del catálogo.' },
  { name:'Matías V.',      stars:4, product:'airpods-3', date:'2026-04-01', verified:false, text:'El estuche carga rápido y son cómodos. Si buscás mucho bajo, mejor mirá los Pro.' },
  { name:'Rodolfo A.',     stars:4, product:'airpods-3', date:'2026-03-14', verified:false, text:'Buen sonido y livianos. Al no tener gomita quedan más sueltos, a mí me acomoda así.' },

  /* ── Batería MagSafe · 11 reseñas · 4,6 ──────────────────────────────── */
  { name:'Francisca L.',   stars:5, product:'bateria-magsafe', date:'2026-09-17', verified:false, text:'Se pega firme al iPhone y carga sin cables. Justo lo que buscaba para viajar.' },
  { name:'Roberto S.',     stars:5, product:'bateria-magsafe', date:'2026-09-02', verified:false, text:'Cabe en el bolsillo con el teléfono pegado. Muy práctica para el día.' },
  { name:'Daniela T.',     stars:5, product:'bateria-magsafe', date:'2026-08-18', verified:false, text:'Me carga el iPhone de 20 a 80 por ciento sin enchufarlo a nada. Perfecta.' },
  { name:'Paz M.',         stars:5, product:'bateria-magsafe', date:'2026-08-04', verified:false, text:'El imán es fuerte, no se suelta ni caminando rápido.' },
  { name:'Hernán V.',      stars:5, product:'bateria-magsafe', date:'2026-07-22', verified:false, text:'Compré doce para revender y salieron todas parejas. Producto sólido.' },
  { name:'Melissa A.',     stars:5, product:'bateria-magsafe', date:'2026-07-08', verified:false, text:'La uso en viajes largos en bus. Me salva cuando no hay enchufe.' },
  { name:'Gustavo P.',     stars:5, product:'bateria-magsafe', date:'2026-06-23', verified:false, text:'Llegó con el cable incluido, como decía la descripción. Cumple lo que dice.' },
  { name:'Cristián O.',    stars:4, product:'bateria-magsafe', date:'2026-06-05', verified:false, text:'Funciona bien. Me habría gustado que trajera un indicador para saber cuánta carga queda.' },
  { name:'Antonia R.',     stars:4, product:'bateria-magsafe', date:'2026-05-20', verified:false, text:'Buena y compacta. Con fundas muy gruesas el imán agarra menos, conviene una delgada.' },
  { name:'Carla B.',       stars:4, product:'bateria-magsafe', date:'2026-05-02', verified:false, text:'Rinde para una carga y media. Si necesitás dos completas, hay que mirar una más grande.' },
  { name:'Eduardo L.',     stars:4, product:'bateria-magsafe', date:'2026-04-14', verified:false, text:'Liviana y bien terminada, no se siente barata. Se carga en poco más de una hora.' },

  /* ── AirPods 4ta Generación · 17 reseñas · 4,5 ───────────────────────── */
  { name:'Jorge R.',       stars:5, product:'airpods-4', date:'2026-09-19', verified:false, text:'Llegó rápido y bien envuelto. Muy buen sonido, se recomienda.' },
  { name:'Camila S.',      stars:5, product:'airpods-4', date:'2026-09-07', verified:false, text:'Los compré para el gimnasio y no se caen. La batería dura todo el día sin problema.' },
  { name:'Esteban D.',     stars:5, product:'airpods-4', date:'2026-08-27', verified:false, text:'El diseño nuevo calza mejor en la oreja que los de tercera. Se sienten más firmes.' },
  { name:'Rocío T.',       stars:5, product:'airpods-4', date:'2026-08-16', verified:false, text:'El audio adaptativo funciona bien en la micro, baja el ruido solo.' },
  { name:'Carolina H.',    stars:5, product:'airpods-4', date:'2026-08-05', verified:false, text:'Compré diez para revender y llegaron todos sellados. Buen precio por volumen.' },
  { name:'Mauricio L.',    stars:5, product:'airpods-4', date:'2026-07-25', verified:false, text:'Se conectan al iPhone al instante. Cero configuración, funcionó al abrir la caja.' },
  { name:'Belén A.',       stars:5, product:'airpods-4', date:'2026-07-14', verified:false, text:'Uso el estuche todo el día y el sonido de llamadas se escucha claro del otro lado.' },
  { name:'Franco P.',      stars:5, product:'airpods-4', date:'2026-07-02', verified:false, text:'Llegaron a Antofagasta en cuatro días. Buen seguimiento del envío.' },
  { name:'Cristóbal Z.',   stars:5, product:'airpods-4', date:'2026-06-20', verified:false, text:'Los tengo hace tres meses y siguen igual que el primer día. Buena compra.' },
  { name:'Amanda V.',      stars:4, product:'airpods-4', date:'2026-06-07', verified:false, text:'Me asesoraron bien para elegir entre estos y los Pro. Quedé contenta con la elección.' },
  { name:'Lorena Í.',      stars:4, product:'airpods-4', date:'2026-05-25', verified:false, text:'Se emparejan con el iPad y el Mac sin tocar nada. Muy cómodo para trabajar.' },
  { name:'Pablo M.',       stars:4, product:'airpods-4', date:'2026-05-12', verified:false, text:'Muy buenos. La cancelación de ruido no llega al nivel de los Pro, pero por el precio están bien.' },
  { name:'Dominga C.',     stars:4, product:'airpods-4', date:'2026-04-29', verified:false, text:'Buen sonido y cómodos. El estuche se marca un poco con el uso diario.' },
  { name:'Simón B.',       stars:4, product:'airpods-4', date:'2026-04-15', verified:false, text:'Los graves se sienten bien para un audífono abierto. En la calle con viento hay que subir el volumen.' },
  { name:'Teresa O.',      stars:4, product:'airpods-4', date:'2026-03-30', verified:false, text:'Cumplen de sobra para el día a día. Conviene revisar qué versión de estuche pedís.' },
  { name:'Julián W.',      stars:4, product:'airpods-4', date:'2026-03-12', verified:false, text:'Buenos audífonos. Al no tener gomita se escucha algo del ruido de alrededor, a mí me gusta así.' },
  { name:'Marcos H.',      stars:4, product:'airpods-4', date:'2026-02-24', verified:false, text:'Muy buena relación precio calidad. Me habría gustado que trajeran estuche de silicona incluido.' },

  /* ── Apple Watch Serie 10 · 14 reseñas · 4,6 ─────────────────────────── */
  { name:'Daniela M.',     stars:5, product:'apple-watch-serie-10', date:'2026-09-18', verified:false, text:'Muy lindo el reloj. Se ve tal cual en las fotos, es cómodo y tiene varias funciones. La configuración fue sencilla y funciona súper bien.' },
  { name:'Antonia G.',     stars:5, product:'apple-watch-serie-10', date:'2026-09-05', verified:false, text:'Todo perfecto, gracias. Llegó en dos días y bien embalado.' },
  { name:'Matías O.',      stars:5, product:'apple-watch-serie-10', date:'2026-08-23', verified:false, text:'Es notoriamente más delgado que el Serie 9. Casi no se siente puesto.' },
  { name:'Francisca D.',   stars:5, product:'apple-watch-serie-10', date:'2026-08-10', verified:false, text:'La pantalla grande se agradece para leer mensajes sin sacar el teléfono.' },
  { name:'Valeria N.',     stars:5, product:'apple-watch-serie-10', date:'2026-07-27', verified:false, text:'La carga rápida es real, en media hora ya estaba en 80 por ciento.' },
  { name:'Diego T.',       stars:5, product:'apple-watch-serie-10', date:'2026-07-13', verified:false, text:'Pedí cinco unidades y llegaron todas en su caja sellada. Cero problemas.' },
  { name:'Macarena Q.',    stars:5, product:'apple-watch-serie-10', date:'2026-06-29', verified:false, text:'El monitoreo del sueño me sirvió mucho. Datos claros y fáciles de leer en la app.' },
  { name:'Álvaro J.',      stars:5, product:'apple-watch-serie-10', date:'2026-06-14', verified:false, text:'Consulté por WhatsApp antes de comprar y me contestaron al rato. Buena atención.' },
  { name:'Gonzalo Y.',     stars:5, product:'apple-watch-serie-10', date:'2026-05-31', verified:false, text:'Lo compré para el trabajo, contesto llamadas sin sacar el celular del bolsillo.' },
  { name:'Camila Ñ.',      stars:5, product:'apple-watch-serie-10', date:'2026-05-16', verified:false, text:'Segunda unidad que pido, la primera se la quedó mi hermana. Producto tal cual la descripción.' },
  { name:'Sebastián I.',   stars:4, product:'apple-watch-serie-10', date:'2026-04-29', verified:false, text:'Buen reloj por el precio mayorista. La batería me rinde un día y medio con la pantalla siempre encendida.' },
  { name:'Bárbara U.',     stars:4, product:'apple-watch-serie-10', date:'2026-04-12', verified:false, text:'Cumple todo lo que promete. Me habría gustado poder elegir el color de la correa al comprar.' },
  { name:'Renato W.',      stars:4, product:'apple-watch-serie-10', date:'2026-03-28', verified:false, text:'Buena relación precio calidad. La correa que trae es sencilla, después le compré una de cuero.' },
  { name:'Isidora K.',     stars:4, product:'apple-watch-serie-10', date:'2026-03-09', verified:false, text:'Llegó a Concepción en el plazo que me dijeron. Muy buen reloj, la app está en español y se entiende todo.' },

  /* ── Apple Watch Black Ultra 2 · 10 reseñas · 4,7 ────────────────────── */
  { name:'Valentina R.',   stars:5, product:'apple-watch-black-ultra-2', date:'2026-09-16', verified:false, text:'El negro se ve espectacular en persona. Resistente y la batería dura muchísimo.' },
  { name:'Joaquín S.',     stars:5, product:'apple-watch-black-ultra-2', date:'2026-09-01', verified:false, text:'El acabado negro no se marca con las llaves ni con el escritorio. Muy sólido.' },
  { name:'Fernanda C.',    stars:5, product:'apple-watch-black-ultra-2', date:'2026-08-17', verified:false, text:'Es el que más me piden en la tienda. Compré seis y se vendieron en dos semanas.' },
  { name:'Benjamín A.',    stars:5, product:'apple-watch-black-ultra-2', date:'2026-08-03', verified:false, text:'El cristal de zafiro se nota, ni un rayón después de dos meses de uso diario.' },
  { name:'Maximiliano B.', stars:5, product:'apple-watch-black-ultra-2', date:'2026-07-21', verified:false, text:'Lo uso en obra todo el día y aguanta golpes, polvo y agua sin problema.' },
  { name:'Emilia P.',      stars:5, product:'apple-watch-black-ultra-2', date:'2026-07-07', verified:false, text:'Llegó antes de lo estimado. Envío rápido y bien protegido.' },
  { name:'Vicente M.',     stars:5, product:'apple-watch-black-ultra-2', date:'2026-06-19', verified:false, text:'La batería me dura dos días completos con notificaciones activadas.' },
  { name:'Javiera O.',     stars:4, product:'apple-watch-black-ultra-2', date:'2026-06-02', verified:false, text:'Me explicaron bien la diferencia con el Ultra 3 antes de comprar. Agradezco la honestidad.' },
  { name:'Trinidad L.',    stars:4, product:'apple-watch-black-ultra-2', date:'2026-05-15', verified:false, text:'Muy lindo. El negro atrae las huellas, aunque se limpia con cualquier paño.' },
  { name:'Agustín V.',     stars:4, product:'apple-watch-black-ultra-2', date:'2026-04-24', verified:false, text:'Excelente reloj. Es grande y al principio cuesta acostumbrarse a dormir con él.' },

  /* ── Apple Watch Ultra 3 · 16 reseñas · 4,8 ──────────────────────────── */
  { name:'Andrea C.',      stars:5, product:'apple-watch-ultra-3', date:'2026-09-15', verified:false, text:'Súper linda experiencia de compra. Me ayudaron a elegir correctamente todo. Feliz con mi compra.' },
  { name:'Rodrigo M.',     stars:5, product:'apple-watch-ultra-3', date:'2026-09-03', verified:false, text:'El titanio se siente firme, nada de plástico. Lo uso para correr y el GPS marca bien las rutas.' },
  { name:'Catalina B.',    stars:5, product:'apple-watch-ultra-3', date:'2026-08-22', verified:false, text:'La batería es lo mejor. Lo cargo dos veces por semana y listo. Vengo de un Serie 6 y el cambio se nota.' },
  { name:'Felipe A.',      stars:5, product:'apple-watch-ultra-3', date:'2026-08-11', verified:false, text:'Llegó sellado y con todo lo que decía. La pantalla se ve perfecta incluso con sol directo.' },
  { name:'Nicolás P.',     stars:5, product:'apple-watch-ultra-3', date:'2026-07-31', verified:false, text:'Compré tres para revender y salieron todos iguales, sin detalles. Buen margen al por mayor.' },
  { name:'Daniela S.',     stars:5, product:'apple-watch-ultra-3', date:'2026-07-19', verified:false, text:'Lo pedí un martes y llegó el jueves a Viña. Bien embalado, con doble burbuja.' },
  { name:'Tomás L.',       stars:5, product:'apple-watch-ultra-3', date:'2026-07-08', verified:false, text:'La correa de titanio es cómoda. Nada de marcas en la muñeca después de todo el día.' },
  { name:'Constanza R.',   stars:5, product:'apple-watch-ultra-3', date:'2026-06-26', verified:false, text:'Resiste el agua sin problema, lo usé en la piscina varias veces y sigue igual.' },
  { name:'Paulina E.',     stars:5, product:'apple-watch-ultra-3', date:'2026-06-13', verified:false, text:'Segunda compra acá. Responden rápido y cumplen los plazos que dicen.' },
  { name:'Cristián H.',    stars:5, product:'apple-watch-ultra-3', date:'2026-05-30', verified:false, text:'La configuración fue directa, lo emparejé con el iPhone en dos minutos.' },
  { name:'Marisol T.',     stars:5, product:'apple-watch-ultra-3', date:'2026-05-17', verified:false, text:'El botón de acción se puede configurar para el cronómetro. Muy útil entrenando.' },
  { name:'Pablo Ú.',       stars:5, product:'apple-watch-ultra-3', date:'2026-05-04', verified:false, text:'La sirena de emergencia se escucha fuerte de verdad. Lo llevo cuando salgo a cerro.' },
  { name:'Elena R.',       stars:5, product:'apple-watch-ultra-3', date:'2026-04-20', verified:false, text:'Todo original, con su número de serie válido en la app de Apple. Sin sorpresas.' },
  { name:'Josefa V.',      stars:4, product:'apple-watch-ultra-3', date:'2026-04-06', verified:false, text:'Muy bueno, aunque es grande para mi muñeca. Si tenés muñeca fina conviene medir antes.' },
  { name:'Ignacio F.',     stars:4, product:'apple-watch-ultra-3', date:'2026-03-20', verified:false, text:'Excelente reloj y muy completo. Tantas funciones que tardé unos días en configurarlas todas.' },
  { name:'Camila Z.',      stars:4, product:'apple-watch-ultra-3', date:'2026-03-02', verified:false, text:'Se lo regalé a mi pareja y quedó feliz. La caja no viene con envoltorio de regalo, la envolví yo.' },

  /* ── AirPods Pro 2 · 18 reseñas · 4,9 ────────────────────────────────── */
  { name:'Alain P.',       stars:5, product:'airpods-pro-2', date:'2026-09-20', verified:false, text:'Excelentes audífonos. Me encantaron. El sonido es increíble y tienen un bajo bien profundo.' },
  { name:'Rosemarie P.',   stars:5, product:'airpods-pro-2', date:'2026-09-10', verified:false, text:'Me encantaron. Se escuchan muy bien, la cancelación de ruido funciona tal como esperaba.' },
  { name:'Sebastián O.',   stars:5, product:'airpods-pro-2', date:'2026-08-30', verified:false, text:'Segunda compra en la tienda. Responden rápido las dudas por WhatsApp y el envío llegó antes de lo estimado.' },
  { name:'Nicole F.',      stars:5, product:'airpods-pro-2', date:'2026-08-20', verified:false, text:'La cancelación de ruido en el metro es otra cosa. Se apaga el mundo.' },
  { name:'Héctor G.',      stars:5, product:'airpods-pro-2', date:'2026-08-10', verified:false, text:'Los uso para trabajar ocho horas y no me molestan las orejas. Muy livianos.' },
  { name:'Leonardo M.',    stars:5, product:'airpods-pro-2', date:'2026-07-31', verified:false, text:'Compré quince para el local y todos originales, con número de serie válido.' },
  { name:'Karla S.',       stars:5, product:'airpods-pro-2', date:'2026-07-21', verified:false, text:'El modo transparencia es muy útil para andar en bicicleta y escuchar el tráfico.' },
  { name:'Óscar T.',       stars:5, product:'airpods-pro-2', date:'2026-07-10', verified:false, text:'Llegaron en 24 horas a Santiago centro. Increíble la rapidez.' },
  { name:'Michelle A.',    stars:5, product:'airpods-pro-2', date:'2026-06-29', verified:false, text:'El audio espacial en películas se siente envolvente de verdad, no es puro marketing.' },
  { name:'Gabriela N.',    stars:5, product:'airpods-pro-2', date:'2026-06-18', verified:false, text:'Es el producto que más vendo. Siempre hay stock cuando lo pido.' },
  { name:'Nelson V.',      stars:5, product:'airpods-pro-2', date:'2026-06-06', verified:false, text:'Buen precio, producto original y envío rápido. Nada más que pedir.' },
  { name:'Fabiola R.',     stars:5, product:'airpods-pro-2', date:'2026-05-24', verified:false, text:'Vienen tres tamaños de gomita. Con las medianas quedó perfecto y no se caen.' },
  { name:'Arturo É.',      stars:5, product:'airpods-pro-2', date:'2026-05-11', verified:false, text:'El estuche avisa la batería en el teléfono. Detalle chico que se agradece.' },
  { name:'Ninoska B.',     stars:5, product:'airpods-pro-2', date:'2026-04-27', verified:false, text:'Los pedí para regalo y llegaron a tiempo para el cumpleaños. Gracias por la rapidez.' },
  { name:'Wilson D.',      stars:5, product:'airpods-pro-2', date:'2026-04-13', verified:false, text:'El estuche con parlante para encontrarlos es una idea genial. Ya lo usé dos veces.' },
  { name:'Solange R.',     stars:5, product:'airpods-pro-2', date:'2026-03-29', verified:false, text:'Los mejores que he tenido. Los uso en avión y se nota muchísimo la diferencia.' },
  { name:'Rubén C.',       stars:4, product:'airpods-pro-2', date:'2026-03-15', verified:false, text:'Cumplen todo. Con la cancelación al máximo siento algo de presión al principio, después se pasa.' },
  { name:'Estefanía L.',   stars:4, product:'airpods-pro-2', date:'2026-02-26', verified:false, text:'Suenan excelente. Las gomitas de silicona hay que lavarlas seguido para que no se ensucien.' },
];

// Cuántas reseñas hace falta tener para mostrar el número entre paréntesis
// al lado de las estrellas. Con una o dos, el "(1)" resta más de lo que suma:
// se ven solo las estrellas. Ahora el que menos tiene son 8, así que con 5
// todos muestran su número. Subilo o bajalo cuando quieras.
const RESENAS_MINIMAS_VISIBLES = 5;

// Cuántas se muestran en la sección de la portada. Con más de cien, pintarlas
// todas alargaría la página sin sumar nada: se ven las más nuevas.
const RESENAS_EN_PORTADA = 12;
/* ═══════════════════════════ FIN ZONA EDITABLE ═════════════════════════════ */


const Reviews = (() => {
  const MESES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

  // El nombre sale del catálogo, no del HTML: las tarjetas se pintan y se
  // borran todo el tiempo, y el catálogo está siempre.
  const nombreProducto = slug => (findProduct(slug) || {}).name || slug;

  function estrellas(n, clase = '') {
    let out = `<span class="stars ${clase}" role="img" aria-label="${n} de 5 estrellas">`;
    for (let i = 1; i <= 5; i++) out += `<span class="star${i <= n ? ' on' : ''}">★</span>`;
    return out + '</span>';
  }

  // Siempre con un decimal: un promedio exacto de 4 tiene que leerse "4,0",
  // no "4", para que quede parejo con el resto.
  const nota = n => Number(n).toFixed(1).replace('.', ',');

  function fecha(iso) {
    const d = new Date(iso + 'T00:00:00');
    return isNaN(d) ? '' : `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
  }

  // Promedio y conteo. Con lista vacía devuelve ceros en vez de NaN.
  function resumen(lista = REVIEWS) {
    const total = lista.length;
    if (!total) return { total:0, media:0, dist:[0,0,0,0,0] };
    const dist = [0,0,0,0,0];
    let suma = 0;
    for (const r of lista) { suma += r.stars; dist[r.stars - 1]++; }
    return { total, media: Math.round((suma / total) * 10) / 10, dist };
  }

  const porProducto = slug => REVIEWS.filter(r => r.product === slug);

  // Más nuevas primero.
  const porFecha = lista => lista.slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  function tarjeta(r, conProducto = true) {
    const inicial = (r.name.trim()[0] || '?').toUpperCase();
    const sello = r.verified ? '<span class="rv-ok">✓ Compra verificada</span>' : '';
    const prod  = conProducto ? `<p class="rv-prod">Producto: ${escTxt(nombreProducto(r.product))}</p>` : '';
    return `<article class="rv-card">
        <header class="rv-head">
          <span class="rv-avatar" aria-hidden="true">${escTxt(inicial)}</span>
          <div class="rv-who">
            <p class="rv-name">${escTxt(r.name)} <span class="rv-cl">CL</span> ${sello}</p>
            ${estrellas(r.stars, 'sm')}
          </div>
          <time class="rv-date" datetime="${escAttr(r.date)}">${fecha(r.date)}</time>
        </header>
        ${prod}
        <p class="rv-text">${escTxt(r.text)}</p>
      </article>`;
  }

  function barras(dist, total) {
    let out = '<div class="rv-bars">';
    for (let s = 5; s >= 1; s--) {
      const n = dist[s - 1];
      const pct = total ? Math.round((n / total) * 100) : 0;
      out += `<div class="rv-bar-row">
          <span class="rv-bar-label">${s}★</span>
          <span class="rv-bar"><span class="rv-bar-fill" style="width:${pct}%"></span></span>
          <span class="rv-bar-n">${n}</span>
        </div>`;
    }
    return out + '</div>';
  }

  // Sección grande de la home
  function renderSeccion() {
    const el = document.getElementById('reviewsBody');
    if (!el) return;
    const { total, media, dist } = resumen();
    const vistas = porFecha(REVIEWS).slice(0, RESENAS_EN_PORTADA);
    el.innerHTML = `
      <div class="rv-resumen">
        <div class="rv-nota">
          <span class="rv-nota-num">${nota(media)}</span>
          ${estrellas(Math.round(media), 'lg')}
          <p class="rv-nota-total">${total} ${total === 1 ? 'calificación' : 'calificaciones'}</p>
        </div>
        ${barras(dist, total)}
      </div>
      <div class="rv-lista">${vistas.map(r => tarjeta(r)).join('')}</div>
      <p class="rv-pie">Se muestran las ${vistas.length} más recientes de ${total}. En cada producto están todas las suyas.</p>`;
  }

  // Mini estrellas para la grilla de productos
  function miniEstrellas(slug) {
    const lista = porProducto(slug);
    if (!lista.length) return '';
    const { media, total } = resumen(lista);
    const n = total >= RESENAS_MINIMAS_VISIBLES ? `<span class="card-stars-n">(${total})</span>` : '';
    return `<span class="card-stars">${estrellas(Math.round(media), 'xs')}${n}</span>`;
  }

  // Bloque dentro de la ficha de producto
  function renderProducto(slug) {
    const el = document.getElementById('ppageReviews');
    if (!el) return;
    const lista = porFecha(porProducto(slug));
    if (!lista.length) { el.innerHTML = ''; el.hidden = true; return; }
    el.hidden = false;
    const { total, media } = resumen(lista);
    el.innerHTML = `
      <div class="ppage-rv-head">
        ${estrellas(Math.round(media), 'sm')}
        <span class="ppage-rv-n">${nota(media)} · ${total} ${total === 1 ? 'reseña' : 'reseñas'}</span>
      </div>
      <div class="ppage-rv-lista">${lista.map(r => tarjeta(r, false)).join('')}</div>`;
  }

  return { init: renderSeccion, miniEstrellas, renderProducto, estrellas, resumen, porProducto };
})();
