# Verdulería Terán — PWA v2

Aplicación web progresiva inicial para la venta de verduras.

## Estructura
- `index.html` — pantalla principal.
- `app.js` — catálogo y carrito.
- `config.js` — configuración pública de Supabase.
- `manifest.webmanifest` — instalación como app.
- `sw.js` — funcionamiento básico offline.
- `icon.svg` — icono.

## Supabase
En `config.js` deben colocarse únicamente:
- URL del proyecto.
- Publishable Key (o clave pública).

**Nunca** coloques la `service_role key` en el navegador.

## Próximo paso
Subir esta carpeta a GitHub y luego conectar el catálogo real de Supabase para que los precios puedan modificarse desde el panel administrativo.
