# Ejercicio Práctico — Transformando la Aplicación en una Progressive Web App (PWA)

**Proyecto:** `frontend-biblioteca`  
**Ubicación:** `/home/erikperez/Escritorio/Tareas 6-5/frontend-biblioteca`  
**Tecnologías:** Next.js 16, Service Workers API, Web App Manifest, Cache API, TypeScript, Tailwind CSS  

---

## 📋 Lista de Control de Entrega (Checklist Oficial)

- [x] **`manifest.json`** creado y vinculado en `app/layout.tsx`, con los datos del proyecto y ambos íconos generados (`icon-192.png` y `icon-512.png`).
- [x] **Instalabilidad:** El sitio se puede instalar desde el navegador en modo `standalone` abriendo en su propia ventana sin barra de direcciones.
- [x] **`sw.js` registrado y activo:** Visible en la consola con mensajes de ciclo de vida (`instalando...`, `activado`, `registrado`) y en la pestaña *Application → Service Workers*.
- [x] **Prueba del modo Offline documentada:** Se verificó el comportamiento con y sin conexión, detallando qué recursos se mantienen y cuáles no.
- [x] **Desafíos Opcionales Implementados (los 3 resueltos):**
  - [x] **Opción A (Página de fallback offline):** Creación de `app/offline/page.tsx`, cacheada en la instalación del Service Worker y servida ante fallas de navegación.
  - [x] **Opción B (Cacheo inteligente de la API):** Estrategia *Network-First* en `public/sw.js` para `GET /api/libros`, permitiendo visualizar los libros en caché si la API o la red están caídas.
  - [x] **Opción C (Botón de instalación propio en la UI):** Componente `components/BotonInstalarPWA.tsx` que intercepta `beforeinstallprompt` y presenta el botón interactivo *"📲 Instalar App"*.

---

## 🛠️ Implementación Paso a Paso

### Paso 1 — Web App Manifest y Generación de Íconos
En `public/manifest.json`:
```json
{
  "name": "Biblioteca App",
  "short_name": "Biblioteca",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1E3A5F",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```
Se generaron dos íconos PNG profesionales con la identidad visual `#1E3A5F` y el isotipo de un libro abierto:
- `public/icon-192.png` (192x192 px)
- `public/icon-512.png` (512x512 px)

### Paso 2 — Vinculación del Manifest en Next.js App Router
En `app/layout.tsx`:
```tsx
export const metadata: Metadata = {
  title: "Biblioteca App",
  description: "Sistema de gestión y catálogo de libros PWA",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1E3A5F",
};
```
✅ **Checkpoint verificado:** `http://localhost:3000/manifest.json` responde con código 200 OK y la pestaña *Application → Manifest* de DevTools reconoce la configuración e íconos.

### Paso 3 — Ver el prompt de instalación
- Al acceder desde Google Chrome o Microsoft Edge, el navegador habilita el ícono nativo de instalación en la barra de direcciones.
- La aplicación se ejecuta como ventana nativa independiente (`display: standalone`), sin barra de navegación del explorador.

### Paso 4 — Service Worker y Ciclo de Vida (`public/sw.js`)
Se implementó el Service Worker gestionando los eventos `install`, `activate` y `fetch`:
- **`install`:** Abre la caché `biblioteca-v1` y almacena recursos esenciales (`/`, `/manifest.json`, `/offline`, íconos).
- **`activate`:** Depura versiones viejas de la caché y reclama el control de los clientes abiertos (`clients.claim()`).
- **Registro en la App:** Componente de cliente `components/RegistroServiceWorker.tsx` invocado en el `<body>` de `app/layout.tsx`.
- ✅ **Checkpoint:** Registra en la consola:
  - `Service Worker: instalando...`
  - `Service Worker: activado`
  - `Service Worker registrado con éxito`

---

## 📡 Paso 5 — Resultados de la Prueba en Modo Offline

Se realizaron pruebas activando la opción **Offline** en DevTools (*Network → Offline*):

| Componente / Recurso | ¿Carga en Offline? | Explicación Técnica |
|---|:---:|---|
| **Página de Inicio (`/`)** | ✅ **SÍ** | Guardada en la caché estática `biblioteca-v1` durante el evento `install`. |
| **Manifest e Íconos PNG** | ✅ **SÍ** | Pre-cacheados en la instalación. |
| **Página Fallback (`/offline`)** | ✅ **SÍ** | Pre-cacheada; el Service Worker la sirve si la navegación a una ruta no cacheada falla (Opción A). |
| **Catálogo de Libros (`/libros`) consultado previamente** | ✅ **SÍ** | Gracias a la estrategia *Network-First* implementada (Opción B), la última respuesta válida de la API queda en `api-libros-cache-v1`. |
| **Libro nuevo o ruta nunca antes visitada** | ⚠️ **Fallback** | Al no estar en caché ni haber conexión, el Service Worker intercepta la navegación y muestra automáticamente la pantalla de `/offline`. |
| **Crear nuevo libro (`POST /api/libros`)** | ❌ **NO** | Las mutaciones en la base de datos requieren comunicación activa con el servidor Laravel. |

---

## 🚀 Desafíos Opcionales Implementados

### Opción A — Página de Fallback Offline (`app/offline/page.tsx`)
- Página amigable con mensaje *"Estás sin conexión"*, botón para reintentar la conexión y acceso rápido a los datos disponibles en caché local.
- Integrada en el evento `fetch` del Service Worker para todas las peticiones con `event.request.mode === 'navigate'`.

### Opción B — Cacheo Network-First de la API (`public/sw.js`)
- Para las peticiones hacia `/api/libros`:
  1. El Service Worker intenta obtener la versión más fresca desde la red (Laravel).
  2. Si tiene éxito (código 200), guarda una copia clonada en la caché `api-libros-cache-v1`.
  3. Si la red falla o la máquina está desconectada, rescata la copia almacenada en caché y responde a la aplicación sin errores.

### Opción C — Botón de Instalación Personalizado (`components/BotonInstalarPWA.tsx`)
- Captura el evento del navegador `window.addEventListener('beforeinstallprompt')`.
- Previene el banner por defecto (`e.preventDefault()`).
- Muestra en la barra superior de navegación un botón destacado: **`📲 Instalar App`**.
- Al presionarlo, invoca `prompt()` y detecta si el usuario aceptó o canceló la instalación.
- Se oculta automáticamente cuando la app ya está instalada o ejecutándose en modo standalone.

---

## 🏃‍♂️ Cómo Probar Todo el Sistema

1. **Iniciar Laravel:**
   ```bash
   cd "/home/erikperez/Escritorio/Tareas 6-5/api-biblioteca"
   php artisan serve
   ```
2. **Iniciar Next.js:**
   ```bash
   cd "/home/erikperez/Escritorio/Tareas 6-5/frontend-biblioteca"
   npm run dev
   ```
3. Abrir `http://localhost:3000` en Chrome o Edge.
4. Abrir DevTools (F12) y verificar:
   - Pestaña **Application → Manifest:** Ver metadatos, color `#1E3A5F` y los íconos de 192px y 512px.
   - Pestaña **Application → Service Workers:** Estado *Activated and running*.
   - Probar el botón **"📲 Instalar App"** en la barra superior.
   - Activar el modo **Offline** en la pestaña *Network* y recargar.
