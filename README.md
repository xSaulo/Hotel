# Hotel Tama Lodge — sitio web

Sitio estático (HTML + CSS + JS) para GitHub Pages en https://www.hoteltamalodge.com

## Estructura
- `index.html` — página principal
- `la-zona.html` — página "Playa Tamarindo" (se abre como /la-zona, la URL que Google ya conoce)
- `404.html` — página de error que regresa al inicio
- `assets/css/styles.css` — estilos
- `assets/js/main.js` — idioma ES/EN, reserva por WhatsApp, mapa
- `assets/img/`, `assets/video/` — fotos y videos
- `CNAME`, `robots.txt`, `sitemap.xml`

## Cambiar número de WhatsApp o correo
Edita el bloque `CONFIG` al inicio de `assets/js/main.js`.

## Textos en inglés
El español está en el HTML. Las traducciones al inglés están en el objeto `EN` de `assets/js/main.js`
(cada texto del HTML tiene `data-i18n="clave"`).
