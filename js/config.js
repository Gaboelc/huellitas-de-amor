/* ==========================================================================
   CONFIGURACIÓN DEL SITIO — Huellitas de Amor
   --------------------------------------------------------------------------
   Este es el ÚNICO archivo que necesitan editar para poner sus datos reales
   de contacto antes de publicar el sitio o grabar el video.
   ========================================================================== */

window.HUELLITAS_CONFIG = {
  nombre: "Huellitas de Amor",

  // Número de WhatsApp que recibe los pedidos y mensajes del formulario.
  // Escríbanlo con el código de Costa Rica (506) y SOLO números, sin espacios.
  // Ejemplo: "50688889999"
  // Mientras quede vacío, WhatsApp se abre y deja escoger a quién enviar el mensaje.
  whatsapp: "",

  // Cómo se muestra el teléfono en la sección de contacto.
  telefonoVisible: "+506 0000-0000",

  // Correo que recibe los mensajes cuando la persona elige "Enviar por correo".
  correo: "tucorreo@ejemplo.com",

  // Ubicación que se muestra en el sitio y en el mapa.
  direccion: "San José, Costa Rica",
  mapa: "San José, Costa Rica",

  horario: [
    { dias: "Lunes a sábado", horas: "9:00 a. m. – 7:00 p. m." },
    { dias: "Domingo", horas: "10:00 a. m. – 3:00 p. m." }
  ],

  // Redes sociales. Verifiquen que estas cuentas sean del grupo antes de publicar.
  usuarioRedes: "@huellitasdeamor",
  redes: {
    instagram: "https://www.instagram.com/huellitasdeamor",
    facebook: "https://www.facebook.com/huellitasdeamor"
  },

  // Envío a domicilio (montos en colones).
  envio: { costo: 1500, gratisDesde: 25000 },

  // Promoción vigente: 50 % de descuento en todos los alimentos.
  descuentoAlimentos: 0.5
};
