# Huellitas de Amor — sitio web

Sitio web de la empresa ficticia **Huellitas de Amor** (productos para mascotas), creado para el proyecto
"Transformación digital mediante el desarrollo de un sitio web con IA".

## Qué hay en cada carpeta

| Archivo o carpeta | Para qué sirve |
|---|---|
| `index.html` | Estructura y textos de todas las secciones: Inicio, Tienda, Servicios, Nosotros, Galería, Redes y Contacto. |
| `css/styles.css` | Diseño: colores del logo, tipografías, tamaños y versión para celular. |
| `js/config.js` | **Datos de contacto** (WhatsApp, correo, horario, redes). Es el único archivo que deben editar antes de publicar. |
| `js/productos.js` | Catálogo de la tienda (nombre, precio, categoría e imagen de cada producto). |
| `js/app.js` | Funciones: filtros y búsqueda, carrito, pedido por WhatsApp, formulario, galería y menú del celular. |
| `img/` | Logo, imagen principal, ilustraciones de productos y fotos de la galería. |
| `video/` | Videos de Canva que aparecen en la galería. |

## Antes de publicar (5 minutos)

1. Abran `js/config.js` con el Bloc de notas o VS Code.
2. En `whatsapp:` escriban el número de un integrante con el código 506 y sin espacios, por ejemplo `"50688889999"`.
3. Cambien `telefonoVisible`, `correo` y, si quieren, `direccion` y `horario`.
4. Verifiquen que las cuentas de Instagram y Facebook de `redes` sean del grupo. Si no tienen cuentas, pueden dejarlas igual, pero los botones llevarán a esas direcciones.
5. Abran `index.html` con doble clic y prueben: agregar al carrito, enviar el pedido, el formulario y la galería.

## Publicar gratis en Vercel

El plan **Hobby** de Vercel es gratuito y sirve para este proyecto académico (no permite uso comercial; una tienda real necesitaría el plan Pro).

**Opción A: sin usar la terminal**

1. Creen una cuenta en github.com y un repositorio nuevo (por ejemplo `huellitas-de-amor`).
2. En el repositorio: *Add file → Upload files* y arrastren **todo el contenido** de esta carpeta (que `index.html` quede en la raíz).
3. Entren a vercel.com con la cuenta de GitHub → *Add New… → Project* → importen el repositorio.
4. En *Framework Preset* elijan **Other** y presionen **Deploy**.
5. Vercel les da un enlace del tipo `huellitas-de-amor.vercel.app`. Cada cambio que suban a GitHub se publica solo.

**Opción B: con la terminal**

```bash
npm install -g vercel
cd huellitas-de-amor
vercel          # la primera vez pide iniciar sesión y crea el proyecto
vercel --prod   # publica la versión final
```

## Cómo agregar un producto

1. Pongan la imagen en `img/productos/` (SVG, PNG o JPG cuadrada).
2. En `js/productos.js` copien un bloque `{ ... }`, cambien `id`, `nombre`, `detalle`, `descripcion`, `categoria`,
   `mascota`, `precio` e `img`.
3. Los alimentos muestran el 50 % de descuento automáticamente (se cambia en `descuentoAlimentos` de `config.js`).

## Créditos

- Logo, imagen principal y concepto visual: ChatGPT. Misión y visión: Microsoft Copilot. Publicaciones y videos: Canva.
- Estructura, textos, código e ilustraciones de productos: Claude, revisado por el grupo.
- Íconos: Lucide (licencia ISC) y Simple Icons (CC0). Tipografías: Google Fonts (Baloo 2, Nunito, Pacifico, Caveat).
