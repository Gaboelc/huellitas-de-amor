/* ==========================================================================
   CATÁLOGO DE PRODUCTOS — Huellitas de Amor
   --------------------------------------------------------------------------
   Para agregar un producto, copien un bloque { ... }, cambien los datos y
   pongan una imagen en img/productos/.
   - categoria: "alimentos" | "juguetes" | "accesorios" | "aseo"
   - mascota:   "perro" | "gato" | "ambos"
   - precio:    precio regular en colones, sin puntos ni símbolos
   Los alimentos muestran automáticamente el descuento de config.js.
   ========================================================================== */

window.HUELLITAS_PRODUCTOS = [
  /* ---------- Alimentos ---------- */
  {
    id: "alimento-perro",
    nombre: "Alimento para perro adulto",
    detalle: "Razas medianas y grandes · 15 kg",
    descripcion: "Croquetas balanceadas con proteínas, vitaminas y minerales para perros activos.",
    categoria: "alimentos", mascota: "perro", precio: 38900,
    img: "img/productos/alimento-perro.svg"
  },
  {
    id: "alimento-cachorro",
    nombre: "Alimento para cachorro",
    detalle: "Croqueta pequeña · 7,5 kg",
    descripcion: "Nutrición completa para acompañar el crecimiento de tu cachorro.",
    categoria: "alimentos", mascota: "perro", precio: 24500,
    img: "img/productos/alimento-cachorro.svg"
  },
  {
    id: "alimento-gato",
    nombre: "Alimento para gato adulto",
    detalle: "Sabor pescado · 7,5 kg",
    descripcion: "Fórmula que ayuda a cuidar el pelaje y las vías urinarias de tu gato.",
    categoria: "alimentos", mascota: "gato", precio: 27900,
    img: "img/productos/alimento-gato.svg"
  },
  {
    id: "snacks-dentales",
    nombre: "Snacks dentales",
    detalle: "Bolsa de 12 unidades",
    descripcion: "Premios que ayudan a limpiar los dientes y refrescar el aliento.",
    categoria: "alimentos", mascota: "perro", precio: 4900,
    img: "img/productos/snacks-dentales.svg"
  },

  /* ---------- Juguetes ---------- */
  {
    id: "pelota",
    nombre: "Pelota con sonido",
    detalle: "Hule resistente · 7 cm",
    descripcion: "Rebota, suena y aguanta mordidas. Ideal para jugar a buscar.",
    categoria: "juguetes", mascota: "perro", precio: 3500,
    img: "img/productos/pelota.svg"
  },
  {
    id: "cuerda",
    nombre: "Cuerda para morder",
    detalle: "Algodón trenzado · 35 cm",
    descripcion: "Perfecta para jalar entre dos y ayudar a limpiar los dientes.",
    categoria: "juguetes", mascota: "perro", precio: 4200,
    img: "img/productos/cuerda.svg"
  },
  {
    id: "raton",
    nombre: "Ratón con catnip",
    detalle: "Peluche suave · 10 cm",
    descripcion: "Relleno con catnip para despertar el instinto de caza de tu gato.",
    categoria: "juguetes", mascota: "gato", precio: 2900,
    img: "img/productos/raton.svg"
  },
  {
    id: "varita-plumas",
    nombre: "Varita con plumas",
    detalle: "Con cascabel · 60 cm",
    descripcion: "Horas de juego y ejercicio para gatos de todas las edades.",
    categoria: "juguetes", mascota: "gato", precio: 3800,
    img: "img/productos/varita-plumas.svg"
  },

  /* ---------- Accesorios ---------- */
  {
    id: "collar",
    nombre: "Collar ajustable con placa",
    detalle: "Talla S a L",
    descripcion: "Collar acolchado con placa para grabar el nombre de tu mascota.",
    categoria: "accesorios", mascota: "ambos", precio: 5500,
    img: "img/productos/collar.svg"
  },
  {
    id: "correa",
    nombre: "Correa reforzada",
    detalle: "Nailon · 1,5 m",
    descripcion: "Mosquetón metálico y agarre cómodo para paseos seguros.",
    categoria: "accesorios", mascota: "perro", precio: 6900,
    img: "img/productos/correa.svg"
  },
  {
    id: "cama",
    nombre: "Cama acolchada",
    detalle: "Tamaño mediano · lavable",
    descripcion: "Bordes altos y relleno suave para que descanse como en casa.",
    categoria: "accesorios", mascota: "ambos", precio: 18900,
    img: "img/productos/cama.svg"
  },
  {
    id: "plato-doble",
    nombre: "Plato doble de acero",
    detalle: "Base antideslizante",
    descripcion: "Un lado para el alimento y otro para el agua. Fácil de lavar.",
    categoria: "accesorios", mascota: "ambos", precio: 7500,
    img: "img/productos/plato-doble.svg"
  },
  {
    id: "rascador",
    nombre: "Rascador para gato",
    detalle: "Poste de sisal · 60 cm",
    descripcion: "Protege tus muebles y mantiene sanas las uñas de tu gato.",
    categoria: "accesorios", mascota: "gato", precio: 21500,
    img: "img/productos/rascador.svg"
  },

  /* ---------- Aseo y cuidado ---------- */
  {
    id: "champu",
    nombre: "Champú suave de avena",
    detalle: "Piel sensible · 500 ml",
    descripcion: "Limpia sin resecar y deja el pelaje suave y con buen olor.",
    categoria: "aseo", mascota: "ambos", precio: 6200,
    img: "img/productos/champu.svg"
  },
  {
    id: "cepillo",
    nombre: "Cepillo deslanador",
    detalle: "Pelo corto y largo",
    descripcion: "Retira el pelo muerto y reduce la caída en casa.",
    categoria: "aseo", mascota: "ambos", precio: 7900,
    img: "img/productos/cepillo.svg"
  },
  {
    id: "arena",
    nombre: "Arena aglomerante",
    detalle: "Control de olores · 10 kg",
    descripcion: "Forma bolitas firmes, fáciles de recoger, y controla los olores.",
    categoria: "aseo", mascota: "gato", precio: 9900,
    img: "img/productos/arena.svg"
  }
];
