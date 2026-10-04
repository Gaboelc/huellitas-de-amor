/* ==========================================================================
   Huellitas de Amor — Funcionalidad del sitio
   - Menú (móvil y escritorio) y resaltado de la sección visible
   - Tienda: filtros por categoría y mascota, búsqueda y orden
   - Carrito con cantidades, envío y pedido por WhatsApp
   - Servicios y formulario de contacto (WhatsApp o correo)
   - Galería con visor de imágenes y videos
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.HUELLITAS_CONFIG || {};
  var PRODUCTOS = window.HUELLITAS_PRODUCTOS || [];
  CFG.envio = CFG.envio || { costo: 0, gratisDesde: Infinity };

  /* ---------- Utilidades ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  var CATEGORIAS = { alimentos: "Alimentos", juguetes: "Juguetes", accesorios: "Accesorios", aseo: "Aseo y cuidado" };
  var MASCOTAS = {
    perro: { texto: "Perro", icono: "i-dog" },
    gato: { texto: "Gato", icono: "i-cat" },
    ambos: { texto: "Perro y gato", icono: "i-paw" }
  };

  var formatoColones = new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 });
  function colones(n) { return formatoColones.format(n); }

  function icono(id) { return '<svg class="icon" aria-hidden="true"><use href="#' + id + '"/></svg>'; }

  function escapar(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function sinTildes(s) { return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }

  function precioFinal(p) {
    if (p.categoria === "alimentos" && CFG.descuentoAlimentos) {
      return Math.round((p.precio * (1 - CFG.descuentoAlimentos)) / 50) * 50;
    }
    return p.precio;
  }

  /* ---------- WhatsApp ---------- */
  function urlWhatsApp(mensaje) {
    var numero = String(CFG.whatsapp || "").replace(/\D/g, "");
    var texto = encodeURIComponent(mensaje);
    // Sin número configurado, WhatsApp abre el mensaje y deja escoger el chat.
    return numero ? "https://wa.me/" + numero + "?text=" + texto : "https://wa.me/?text=" + texto;
  }

  function abrirWhatsApp(mensaje) {
    var url = urlWhatsApp(mensaje);
    var ventana = window.open(url, "_blank");
    if (ventana) { ventana.opener = null; } else { window.location.href = url; }
    if (!CFG.whatsapp && window.console) {
      console.info("Huellitas de Amor: escriban el número de WhatsApp de la tienda en js/config.js");
    }
  }

  /* ---------- Aviso emergente ---------- */
  var toastTimer1, toastTimer2;
  function toast(texto) {
    var t = $("#toast");
    clearTimeout(toastTimer1); clearTimeout(toastTimer2);
    t.innerHTML = icono("i-check") + "<span>" + escapar(texto) + "</span>";
    t.hidden = false;
    void t.offsetWidth; // reinicia la animación
    t.classList.add("is-visible");
    toastTimer1 = setTimeout(function () {
      t.classList.remove("is-visible");
      toastTimer2 = setTimeout(function () { t.hidden = true; }, 300);
    }, 2600);
  }

  /* ---------- Mantener el foco dentro de un panel abierto ---------- */
  function atraparFoco(e, contenedor) {
    var enfocables = $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, video[controls], [tabindex]:not([tabindex="-1"])', contenedor)
      .filter(function (el) { return !el.closest("[hidden]") && el.getClientRects().length > 0; });
    if (!enfocables.length) return;
    var primero = enfocables[0], ultimo = enfocables[enfocables.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  }

  /* ---------- Datos de contacto desde config.js ---------- */
  function aplicarConfig() {
    $$(".js-direccion").forEach(function (el) { if (CFG.direccion) el.textContent = CFG.direccion; });
    $$(".js-telefono").forEach(function (el) { if (CFG.telefonoVisible) el.textContent = CFG.telefonoVisible; });
    $$(".js-correo").forEach(function (el) {
      if (!CFG.correo) return;
      el.textContent = CFG.correo;
      el.href = "mailto:" + CFG.correo;
    });
    $$(".js-usuario").forEach(function (el) { if (CFG.usuarioRedes) el.textContent = CFG.usuarioRedes; });
    $$(".js-horario").forEach(function (ul) {
      ul.innerHTML = (CFG.horario || []).map(function (h) {
        return "<li><span>" + escapar(h.dias) + "</span> <span>" + escapar(h.horas) + "</span></li>";
      }).join("");
    });
    $$("[data-red]").forEach(function (a) {
      var url = CFG.redes && CFG.redes[a.getAttribute("data-red")];
      if (url) a.href = url;
    });
    $$("[data-wa-mensaje]").forEach(function (a) {
      a.href = urlWhatsApp(a.getAttribute("data-wa-mensaje"));
      a.target = "_blank";
      a.rel = "noopener";
    });
    var mapa = $(".js-mapa");
    if (mapa && CFG.mapa) {
      var src = "https://www.google.com/maps?q=" + encodeURIComponent(CFG.mapa) + "&output=embed";
      if (mapa.getAttribute("src") !== src) mapa.setAttribute("src", src);
    }
    var anio = $("#anio");
    if (anio) anio.textContent = new Date().getFullYear();
  }

  /* ---------- Encabezado y menú ---------- */
  function initEncabezado() {
    var header = $("#header");
    function alHacerScroll() { header.classList.toggle("is-scrolled", window.scrollY > 10); }
    alHacerScroll();
    window.addEventListener("scroll", alHacerScroll, { passive: true });

    var btnMenu = $("#btnMenu"), nav = $("#nav");
    function cerrarMenu() {
      nav.classList.remove("is-open");
      btnMenu.setAttribute("aria-expanded", "false");
      btnMenu.setAttribute("aria-label", "Abrir menú");
    }
    btnMenu.addEventListener("click", function () {
      var abierto = nav.classList.toggle("is-open");
      btnMenu.setAttribute("aria-expanded", String(abierto));
      btnMenu.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });
    $$(".nav__link").forEach(function (a) { a.addEventListener("click", cerrarMenu); });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !nav.contains(e.target) && !btnMenu.contains(e.target)) cerrarMenu();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") cerrarMenu(); });

    // Resalta en el menú la sección que se está viendo
    var enlaces = $$(".nav__link");
    if ("IntersectionObserver" in window) {
      var observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (en) {
          if (!en.isIntersecting) return;
          enlaces.forEach(function (a) {
            var activo = a.getAttribute("href") === "#" + en.target.id;
            a.classList.toggle("is-active", activo);
            if (activo) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      enlaces.forEach(function (a) {
        var seccion = $(a.getAttribute("href"));
        if (seccion) observador.observe(seccion);
      });
    }

    $("#btnBuscar").addEventListener("click", function () {
      $("#tienda").scrollIntoView({ behavior: "smooth" });
      setTimeout(function () { $("#buscar").focus({ preventScroll: true }); }, 600);
    });
  }

  /* ---------- Tienda ---------- */
  var filtros = { categoria: "todos", mascota: "todas", texto: "", orden: "destacados" };

  function productosFiltrados() {
    var palabras = sinTildes(filtros.texto.trim()).split(/\s+/).filter(Boolean);
    var lista = PRODUCTOS.filter(function (p) {
      var okCategoria = filtros.categoria === "todos" || p.categoria === filtros.categoria;
      var okMascota = filtros.mascota === "todas" || p.mascota === filtros.mascota || p.mascota === "ambos";
      var texto = sinTildes([p.nombre, p.detalle, p.descripcion, CATEGORIAS[p.categoria], MASCOTAS[p.mascota] ? MASCOTAS[p.mascota].texto : ""].join(" "));
      var okTexto = palabras.every(function (w) { return texto.indexOf(w) !== -1; });
      return okCategoria && okMascota && okTexto;
    });
    if (filtros.orden === "precio-asc") lista.sort(function (a, b) { return precioFinal(a) - precioFinal(b); });
    else if (filtros.orden === "precio-desc") lista.sort(function (a, b) { return precioFinal(b) - precioFinal(a); });
    else if (filtros.orden === "nombre") lista.sort(function (a, b) { return a.nombre.localeCompare(b.nombre, "es"); });
    return lista;
  }

  function tarjetaProducto(p) {
    var final = precioFinal(p);
    var oferta = final < p.precio;
    var pct = Math.round((1 - final / p.precio) * 100);
    var m = MASCOTAS[p.mascota] || MASCOTAS.ambos;
    return '' +
      '<article class="prod prod--' + p.categoria + '">' +
        '<div class="prod__media">' +
          (oferta ? '<span class="prod__off">−' + pct + '&nbsp;%</span>' : '') +
          '<span class="prod__pet">' + icono(m.icono) + m.texto + '</span>' +
          '<img src="' + escapar(p.img) + '" alt="' + escapar(p.nombre) + '" width="240" height="240" loading="lazy">' +
        '</div>' +
        '<div class="prod__body">' +
          '<p class="prod__cat">' + CATEGORIAS[p.categoria] + '</p>' +
          '<h3 class="prod__name">' + escapar(p.nombre) + '</h3>' +
          '<p class="prod__det">' + escapar(p.detalle) + '</p>' +
          '<p class="prod__desc">' + escapar(p.descripcion) + '</p>' +
          '<div class="prod__foot">' +
            '<p class="price">' +
              '<span class="price__now' + (oferta ? ' is-oferta' : '') + '">' + colones(final) + '</span>' +
              (oferta ? '<s class="price__old"><span class="sr-only">Precio regular: </span>' + colones(p.precio) + '</s>' : '') +
            '</p>' +
            '<button class="btn btn-add" type="button" data-agregar="' + escapar(p.id) + '" aria-label="Agregar ' + escapar(p.nombre) + ' al carrito">' +
              icono("i-plus") + ' Agregar</button>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function mostrarProductos() {
    var lista = productosFiltrados();
    $("#productos").innerHTML = lista.map(tarjetaProducto).join("");
    $("#sinResultados").hidden = lista.length > 0;
    var enCategoria = filtros.categoria === "todos" ? "" : " en " + CATEGORIAS[filtros.categoria];
    $("#resultados").textContent = "Mostrando " + lista.length + (lista.length === 1 ? " producto" : " productos") + enCategoria;
  }

  function elegirCategoria(cat) {
    filtros.categoria = cat;
    $$(".chip").forEach(function (ch) {
      var activo = ch.getAttribute("data-filtro") === cat;
      ch.classList.toggle("is-active", activo);
      ch.setAttribute("aria-pressed", String(activo));
    });
    mostrarProductos();
  }

  function limpiarBusqueda() {
    filtros.texto = ""; $("#buscar").value = "";
    filtros.mascota = "todas"; $("#filtroMascota").value = "todas";
  }

  function initTienda() {
    $$(".chip").forEach(function (ch) {
      ch.addEventListener("click", function () { elegirCategoria(ch.getAttribute("data-filtro")); });
    });
    $$("[data-ir-categoria]").forEach(function (b) {
      b.addEventListener("click", function () {
        limpiarBusqueda();
        elegirCategoria(b.getAttribute("data-ir-categoria"));
        $("#tienda").scrollIntoView({ behavior: "smooth" });
      });
    });
    $("#buscar").addEventListener("input", function (e) { filtros.texto = e.target.value; mostrarProductos(); });
    $("#filtroMascota").addEventListener("change", function (e) { filtros.mascota = e.target.value; mostrarProductos(); });
    $("#orden").addEventListener("change", function (e) { filtros.orden = e.target.value; mostrarProductos(); });
    $("#limpiarFiltros").addEventListener("click", function () { limpiarBusqueda(); elegirCategoria("todos"); });

    $("#productos").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-agregar]");
      if (!btn) return;
      agregarAlCarrito(btn.getAttribute("data-agregar"));
      btn.classList.add("is-added");
      btn.innerHTML = icono("i-check") + " Agregado";
      setTimeout(function () {
        btn.classList.remove("is-added");
        btn.innerHTML = icono("i-plus") + " Agregar";
      }, 1300);
    });

    mostrarProductos();
  }

  /* ---------- Carrito ---------- */
  var CLAVE_CARRITO = "huellitas-carrito-v1";
  var productoPorId = {};
  PRODUCTOS.forEach(function (p) { productoPorId[p.id] = p; });
  var carrito = leerCarrito();

  function leerCarrito() {
    try {
      var datos = JSON.parse(localStorage.getItem(CLAVE_CARRITO) || "{}");
      return datos && typeof datos === "object" ? datos : {};
    } catch (err) { return {}; }
  }
  function guardarCarrito() {
    try { localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito)); } catch (err) { /* sin almacenamiento: el carrito vive solo en esta visita */ }
  }

  function entregaElegida() {
    var r = document.querySelector('input[name="entrega"]:checked');
    return r ? r.value : "retiro";
  }

  function calcularTotales() {
    var items = Object.keys(carrito)
      .filter(function (id) { return productoPorId[id] && carrito[id] > 0; })
      .map(function (id) { return { p: productoPorId[id], n: carrito[id] }; });
    var subtotal = items.reduce(function (s, it) { return s + precioFinal(it.p) * it.n; }, 0);
    var cantidad = items.reduce(function (s, it) { return s + it.n; }, 0);
    var domicilio = entregaElegida() === "domicilio";
    var envioGratis = subtotal >= CFG.envio.gratisDesde;
    var envio = domicilio && subtotal > 0 && !envioGratis ? CFG.envio.costo : 0;
    return { items: items, subtotal: subtotal, cantidad: cantidad, domicilio: domicilio, envio: envio, total: subtotal + envio };
  }

  function mostrarCarrito() {
    var t = calcularTotales();
    $("#cartCount").textContent = t.cantidad;
    $("#btnCarrito").setAttribute("aria-label", "Abrir carrito (" + t.cantidad + (t.cantidad === 1 ? " producto)" : " productos)"));
    $("#cartEmpty").hidden = t.items.length > 0;
    $("#cartSummary").hidden = t.items.length === 0;

    $("#cartList").innerHTML = t.items.map(function (it) {
      var p = it.p, unit = precioFinal(p);
      return '' +
        '<li class="cart-item prod--' + p.categoria + '">' +
          '<span class="cart-item__img"><img src="' + escapar(p.img) + '" alt="" width="52" height="52"></span>' +
          '<div>' +
            '<p class="cart-item__name">' + escapar(p.nombre) + '</p>' +
            '<p class="cart-item__price">' + colones(unit) + ' c/u</p>' +
            '<div class="qty" role="group" aria-label="Cantidad de ' + escapar(p.nombre) + '">' +
              '<button type="button" data-menos="' + p.id + '" aria-label="Quitar una unidad">' + icono("i-minus") + '</button>' +
              '<output>' + it.n + '</output>' +
              '<button type="button" data-mas="' + p.id + '" aria-label="Agregar una unidad">' + icono("i-plus") + '</button>' +
            '</div>' +
          '</div>' +
          '<div class="cart-item__right">' +
            '<span class="cart-item__total">' + colones(unit * it.n) + '</span>' +
            '<button class="icon-btn cart-item__remove" type="button" data-quitar="' + p.id + '" aria-label="Eliminar ' + escapar(p.nombre) + ' del carrito">' + icono("i-trash") + '</button>' +
          '</div>' +
        '</li>';
    }).join("");

    $("#cartSubtotal").textContent = colones(t.subtotal);
    $("#cartEnvio").textContent = !t.domicilio ? "Retiro en tienda" : (t.envio === 0 ? "¡Gratis!" : colones(t.envio));
    $("#cartTotal").textContent = colones(t.total);

    var falta = CFG.envio.gratisDesde - t.subtotal;
    var pista = "";
    if (t.items.length) {
      pista = falta > 0
        ? "Te faltan " + colones(falta) + " para tener envío gratis a domicilio."
        : "¡Tu pedido tiene envío gratis a domicilio!";
    }
    $("#cartHint").textContent = pista;
  }

  function animarContador() {
    var b = $("#cartCount");
    b.classList.remove("is-bump");
    void b.offsetWidth;
    b.classList.add("is-bump");
  }

  function agregarAlCarrito(id) {
    if (!productoPorId[id]) return;
    carrito[id] = Math.min((carrito[id] || 0) + 1, 99);
    guardarCarrito(); mostrarCarrito(); animarContador();
    toast(productoPorId[id].nombre + " se agregó al carrito");
  }
  function cambiarCantidad(id, delta) {
    var n = (carrito[id] || 0) + delta;
    if (n <= 0) delete carrito[id]; else carrito[id] = Math.min(n, 99);
    guardarCarrito(); mostrarCarrito();
  }

  var focoAnterior = null;
  function abrirCarrito() {
    focoAnterior = document.activeElement;
    var panel = $("#carrito"), fondo = $("#overlay");
    panel.hidden = false; fondo.hidden = false;
    void panel.offsetWidth;
    panel.classList.add("is-open"); fondo.classList.add("is-open");
    document.body.classList.add("sin-scroll");
    setTimeout(function () { $(".drawer__head .icon-btn").focus(); }, 60);
  }
  function cerrarCarrito(destino) {
    var panel = $("#carrito"), fondo = $("#overlay");
    if (panel.hidden) return;
    panel.classList.remove("is-open"); fondo.classList.remove("is-open");
    document.body.classList.remove("sin-scroll");
    setTimeout(function () { panel.hidden = true; fondo.hidden = true; }, 280);
    if (destino) {
      var el = $(destino);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (focoAnterior) {
      focoAnterior.focus();
    }
  }

  function initCarrito() {
    $("#btnCarrito").addEventListener("click", abrirCarrito);
    $("#overlay").addEventListener("click", function () { cerrarCarrito(); });
    $$("[data-cerrar-carrito]").forEach(function (b) {
      b.addEventListener("click", function () { cerrarCarrito(b.getAttribute("data-ir")); });
    });
    document.addEventListener("keydown", function (e) {
      if ($("#carrito").hidden) return;
      if (e.key === "Escape") cerrarCarrito();
      else if (e.key === "Tab") atraparFoco(e, $("#carrito"));
    });

    $("#cartList").addEventListener("click", function (e) {
      var mas = e.target.closest("[data-mas]"), menos = e.target.closest("[data-menos]"), quitar = e.target.closest("[data-quitar]");
      if (mas) cambiarCantidad(mas.getAttribute("data-mas"), 1);
      else if (menos) cambiarCantidad(menos.getAttribute("data-menos"), -1);
      else if (quitar) cambiarCantidad(quitar.getAttribute("data-quitar"), -Infinity);
      else return;
      if (!calcularTotales().items.length) $(".drawer__head .icon-btn").focus();
    });

    $("#vaciarCarrito").addEventListener("click", function () {
      carrito = {}; guardarCarrito(); mostrarCarrito();
      toast("Se vació el carrito");
      $(".drawer__head .icon-btn").focus();
    });

    $$('input[name="entrega"]').forEach(function (r) {
      r.addEventListener("change", function () {
        $("#ckDireccionWrap").hidden = entregaElegida() !== "domicilio";
        mostrarCarrito();
      });
    });

    $("#checkout").addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = $("#ckNombre").value.trim();
      var direccion = $("#ckDireccion").value.trim();
      var t = calcularTotales();
      if (!t.items.length) return;

      var ok = validarCampo($("#ckNombre"), nombre.length >= 2, "Escribe tu nombre para el pedido.");
      if (t.domicilio) {
        ok = validarCampo($("#ckDireccion"), direccion.length >= 8, "Escribe la dirección de entrega con algunas señas.") && ok;
      } else {
        validarCampo($("#ckDireccion"), true, "");
      }
      if (!ok) { enfocarPrimerError($("#checkout")); return; }

      var lineas = t.items.map(function (it) {
        return "• " + it.n + " × " + it.p.nombre + " (" + it.p.detalle + ") — " + colones(precioFinal(it.p) * it.n);
      });
      var mensaje = ["¡Hola, " + (CFG.nombre || "Huellitas de Amor") + "! 🐾 Quiero hacer este pedido:", ""]
        .concat(lineas)
        .concat([
          "",
          "Subtotal: " + colones(t.subtotal),
          t.domicilio ? "Envío a domicilio: " + (t.envio ? colones(t.envio) : "gratis") : "Entrega: retiro en tienda",
          "Total: " + colones(t.total),
          "",
          "Nombre: " + nombre,
          t.domicilio ? "Dirección: " + direccion : null,
          "Forma de pago: " + $("#ckPago").value
        ])
        .filter(function (l) { return l !== null; })
        .join("\n");

      abrirWhatsApp(mensaje);
      toast("¡Listo! Se abrió WhatsApp con tu pedido.");
    });

    mostrarCarrito();
  }

  /* ---------- Validación de formularios ---------- */
  function validarCampo(input, valido, mensaje) {
    var campo = input.closest(".field");
    var error = document.getElementById(input.getAttribute("aria-describedby"));
    if (campo) campo.classList.toggle("has-error", !valido);
    input.setAttribute("aria-invalid", String(!valido));
    if (error) error.textContent = valido ? "" : mensaje;
    return valido;
  }
  function enfocarPrimerError(form) {
    var primero = form.querySelector('[aria-invalid="true"]');
    if (primero) primero.focus();
  }
  function limpiarErrorAlEscribir(form) {
    form.addEventListener("input", function (e) {
      var campo = e.target.closest(".field.has-error");
      if (!campo) return;
      campo.classList.remove("has-error");
      e.target.removeAttribute("aria-invalid");
      var error = document.getElementById(e.target.getAttribute("aria-describedby"));
      if (error) error.textContent = "";
    });
  }

  /* ---------- Servicios y formulario de contacto ---------- */
  function initContacto() {
    $$("[data-wa-servicio]").forEach(function (b) {
      b.addEventListener("click", function () {
        abrirWhatsApp("¡Hola, " + (CFG.nombre || "Huellitas de Amor") + "! Quisiera reservar el servicio de " +
          b.getAttribute("data-wa-servicio") + ". ¿Qué espacios tienen disponibles?");
      });
    });

    var form = $("#formContacto");
    var estado = $("#formEstado");
    var canal = "whatsapp";
    $$('button[type="submit"]', form).forEach(function (b) {
      b.addEventListener("click", function () { canal = b.value; });
    });
    limpiarErrorAlEscribir(form);
    limpiarErrorAlEscribir($("#checkout"));

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (e.submitter && e.submitter.value) canal = e.submitter.value;
      var nombre = form.nombre.value.trim();
      var telefono = form.telefono.value.trim();
      var correo = form.correo.value.trim();
      var motivo = form.motivo.value;
      var mascota = form.mascota.value.trim();
      var mensaje = form.mensaje.value.trim();

      var v1 = validarCampo(form.nombre, nombre.length >= 3, "Escribe tu nombre completo.");
      var v2 = validarCampo(form.telefono, /^(?:\+?506[\s-]?)?\d{4}[\s-]?\d{4}$/.test(telefono), "Escribe un número de 8 dígitos, por ejemplo 8888-8888.");
      var v3 = validarCampo(form.correo, !correo || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo), "Revisa el correo: parece incompleto.");
      var v4 = validarCampo(form.mensaje, mensaje.length >= 10, "Cuéntanos un poco más (mínimo 10 caracteres).");

      estado.className = "form__status";
      if (!(v1 && v2 && v3 && v4)) {
        estado.textContent = "Revisa los campos marcados en rojo.";
        estado.classList.add("is-error");
        enfocarPrimerError(form);
        return;
      }

      var cuerpo = [
        "Nombre: " + nombre,
        "Teléfono: " + telefono,
        correo ? "Correo: " + correo : null,
        "Motivo: " + motivo,
        mascota ? "Mascota: " + mascota : null,
        "",
        mensaje
      ].filter(function (l) { return l !== null; }).join("\n");

      if (canal === "correo") {
        window.location.href = "mailto:" + (CFG.correo || "") +
          "?subject=" + encodeURIComponent("Consulta desde el sitio web: " + motivo) +
          "&body=" + encodeURIComponent(cuerpo);
        estado.textContent = "Se abrió tu aplicación de correo con el mensaje listo para enviar.";
      } else {
        abrirWhatsApp("¡Hola, " + (CFG.nombre || "Huellitas de Amor") + "! Les escribo desde el sitio web.\n\n" + cuerpo);
        estado.textContent = "¡Gracias! Se abrió WhatsApp con tu mensaje listo para enviar.";
      }
      estado.classList.add("is-ok");
    });
  }

  /* ---------- Galería ---------- */
  function initGaleria() {
    var items = $$("#galeriaGrid .g-item");
    var visor = $("#lightbox"), medio = $("#lbMedia"), leyenda = $("#lbCaption");
    var actual = 0, focoPrevio = null;

    function mostrar(i) {
      actual = (i + items.length) % items.length;
      var it = items[actual];
      var tipo = it.getAttribute("data-tipo"), src = it.getAttribute("data-src");
      if (tipo === "video") {
        medio.innerHTML = '<video src="' + escapar(src) + '" poster="' + escapar(it.getAttribute("data-poster") || "") +
          '" controls autoplay playsinline></video>';
      } else {
        var alt = it.querySelector("img") ? it.querySelector("img").alt : "";
        medio.innerHTML = '<img src="' + escapar(src) + '" alt="' + escapar(alt) + '">';
      }
      leyenda.textContent = it.getAttribute("data-titulo") || "";
    }
    function abrir(i) {
      focoPrevio = document.activeElement;
      mostrar(i);
      visor.hidden = false;
      document.body.classList.add("sin-scroll");
      $(".lightbox__close").focus();
    }
    function cerrar() {
      visor.hidden = true;
      medio.innerHTML = "";
      document.body.classList.remove("sin-scroll");
      if (focoPrevio) focoPrevio.focus();
    }

    items.forEach(function (it, i) { it.addEventListener("click", function () { abrir(i); }); });
    visor.addEventListener("click", function (e) {
      var boton = e.target.closest("[data-lb]");
      var accion = boton ? boton.getAttribute("data-lb") : null;
      if (accion === "cerrar") cerrar();
      else if (accion === "anterior") mostrar(actual - 1);
      else if (accion === "siguiente") mostrar(actual + 1);
      else if (e.target === visor) cerrar();
    });
    document.addEventListener("keydown", function (e) {
      if (visor.hidden) return;
      if (e.key === "Escape") cerrar();
      else if (e.key === "ArrowLeft") mostrar(actual - 1);
      else if (e.key === "ArrowRight") mostrar(actual + 1);
      else if (e.key === "Tab") atraparFoco(e, visor);
    });
    var x0 = null;
    visor.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    visor.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) mostrar(actual + (dx < 0 ? 1 : -1));
      x0 = null;
    }, { passive: true });
  }

  /* ---------- Inicio ---------- */
  aplicarConfig();
  initEncabezado();
  initTienda();
  initCarrito();
  initContacto();
  initGaleria();
})();
