# Verdulería Terán — versión corregida

Esta versión utiliza el diseño aprobado y corrige el problema de caché de GitHub Pages/Safari.

## Archivos principales
- `index.html`
- `app.js`
- `config.js`
- `sw.js`
- `admin.html` / `admin.js`
- `schema.sql`
- `manifest.webmanifest`

## Publicación en GitHub Pages
1. Reemplaza los archivos del repositorio por los de este ZIP.
2. Haz **Commit changes** en la rama `main`.
3. Espera a que GitHub Pages publique el cambio.
4. Abre el sitio agregando `?reset=7` al final de la dirección una sola vez.
5. Luego puedes abrir normalmente el sitio.

## Supabase
Conserva tus datos reales en `config.js`. Debes usar la URL de tu proyecto y la publishable/anon key, nunca una `service_role` key en el navegador.

Si todavía no configuras Supabase, la página muestra un catálogo de respaldo para que puedas comprobar el diseño y la navegación.
