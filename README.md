# Verdulería Terán

PWA móvil + página administrativa.

## Archivos
- `index.html`: aplicación cliente.
- `app.js`: lógica completa de catálogo, carrito, checkout, pagos, pedidos y WhatsApp.
- `config.js`: URL y publishable key de Supabase.
- `admin.html` / `admin.js`: administración de precios, productos y estados de pedidos.
- `schema.sql`: tablas, RLS, secuencia de pedidos y productos iniciales.
- `manifest.webmanifest` / `sw.js`: instalación como PWA.

## Configuración
1. Crea/abre el proyecto de Supabase.
2. Ejecuta `schema.sql` en SQL Editor.
3. Copia la URL del proyecto y la publishable key en `config.js`.
4. Crea un usuario en Supabase Authentication para entrar a `admin.html`.
5. Publica la carpeta con GitHub Pages, Netlify, Vercel u otro hosting HTTPS.

## Importante
No coloques una `service_role key` en `config.js`. Para navegador se utiliza la publishable/anon key y las políticas RLS.

Si `config.js` todavía tiene valores de ejemplo, la app abre en modo demostración con productos locales y permite probar el catálogo/carrito/checkout; los pedidos no se sincronizan con Supabase hasta configurar las credenciales.
