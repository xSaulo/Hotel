# Hotel Tama Lodge — sitio web (React + TypeScript + Vite)

Sitio estático para **GitHub Pages** en https://www.hoteltamalodge.com

## Cómo publicarlo
1. Sube **todo el contenido de esta carpeta** a tu repositorio de GitHub (rama `main`).
   No subas las carpetas `node_modules` ni `dist` (ya están en `.gitignore`).
2. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Cada vez que subas cambios, GitHub compila y publica el sitio solo
   (pestaña **Actions** → "Publicar sitio"). Tarda 1–2 minutos.
4. El dominio se mantiene gracias a `public/CNAME` (`www.hoteltamalodge.com`).

## Editar contenido
- Teléfono, correo, enlaces y textos: `src/data/site.ts`
- Textos de las páginas de búsqueda (surf, piscina, habitaciones, Guanacaste) y preguntas frecuentes: `src/data/copy.json`
- Páginas: `src/App.tsx` · Secciones: `src/components/Sections.tsx` · Encabezado, menú, barra de reserva y pie: `src/components/Layout.tsx`
- Estilos: `src/styles.css`
- Fotos y videos: `public/assets/img` y `public/assets/video`

## Para probar en tu computadora (opcional)
```
npm install
npm run dev        # vista previa mientras editas
npm run build      # genera la carpeta dist/ con las 14 páginas
```

## Qué genera el build
- 14 páginas con HTML completo (español en `/`, inglés en `/en/`) para que Google las lea.
- `sitemap.xml` con las versiones en ambos idiomas y `404.html`.
