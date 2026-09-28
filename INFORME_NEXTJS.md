# Ejercicio Práctico — Consumiendo la API de Biblioteca desde Next.js

**Ubicación del Frontend:** `/home/erikperez/Escritorio/Tareas 6-5/frontend-biblioteca`  
**Ubicación de la API (Laravel):** `/home/erikperez/Escritorio/Tareas 6-5/api-biblioteca`  
**Stack Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS  
**Stack Backend:** Laravel 12, PHP 8.5, SQLite, Eloquent ORM  

---

## 📋 Lista de Control de Entrega (Checklist Oficial)

- [x] **`app/libros/page.tsx`** funcionando y mostrando datos reales de la API de Laravel (Server Component async).
- [x] **Manejo de errores** cuando la API no responde (`No se pudieron cargar los libros. Intentá nuevamente más tarde.`).
- [x] **`app/libros/[id]/page.tsx`** funcionando con la ruta dinámica y el detalle completo del libro (título, autor, año de publicación, disponibilidad).
- [x] **Navegación con `Link`** de `next/link` entre el catálogo y las vistas de detalle sin recargas completas (SPA).
- [x] **Desafíos Opcionales Implementados:**
  - [x] **Opción A (Botón de Favorito):** Componente de cliente (`BotonFavorito.tsx`) con `'use client'` y `useState` que conmuta entre `"☆ Marcar como favorito"` y `"★ Favorito"`.
  - [x] **Opción B (Formulario de alta):** Ruta `/libros/nuevo` con formulario y Server Action que envía un `POST` a la API de Laravel y redirige al catálogo.
  - [x] **Opción C (Filtrar/Identificar disponibilidad):** Indicador visual en `/libros` destacando con badge rojo los libros que tienen `disponible: false` mostrando `(No disponible)`.

---

## 🚀 Cómo Iniciar los Proyectos

### 1. Iniciar la API en Laravel (Backend)
En una terminal:
```bash
cd "/home/erikperez/Escritorio/Tareas 6-5/api-biblioteca"
php artisan serve
```
> La API estará activa en: `http://127.0.0.1:8000`

### 2. Iniciar el Frontend en Next.js
En otra terminal:
```bash
cd "/home/erikperez/Escritorio/Tareas 6-5/frontend-biblioteca"
npm run dev
```
> La aplicación web estará disponible en: `http://localhost:3000`

---

## 🔍 Detalle Paso a Paso de lo Realizado

### Paso 1 — Crear el proyecto Next.js
Se generó la estructura utilizando `create-next-app` con TypeScript, Tailwind CSS y App Router:
```bash
npx create-next-app@latest frontend-biblioteca --ts --tailwind --eslint --app --no-src-dir
```

### Paso 2 y 3 — Catálogo de libros y Manejo de Errores (`app/libros/page.tsx`)
- Implementado como **Server Component asíncrono** (`async function LibrosPage()`).
- Realiza la petición `fetch` directamente a `http://127.0.0.1:8000/api/libros` con `{ cache: 'no-store' }`.
- Si el servidor de Laravel no responde o devuelve un código de error, captura la excepción y muestra el mensaje solicitado:
  > **"No se pudieron cargar los libros. Intentá nuevamente más tarde."**
- Si la petición es exitosa, itera sobre los libros usando `.map()`.
- Incorpora la **Opción C**: si `disponible` es falso, muestra la etiqueta `(No disponible)`.

### Paso 4 — Ruta dinámica (`app/libros/[id]/page.tsx`)
- Carpeta creada bajo `app/libros/[id]/page.tsx`.
- Extrae el parámetro dinámico `id` desde `params`.
- Consulta a `http://127.0.0.1:8000/api/libros/{id}`.
- Muestra el detalle exhaustivo del libro:
  - Título
  - Autor
  - Año de publicación
  - Estado de disponibilidad
  - Fechas de auditoría
- Si se ingresa un ID inexistente (ej. `/libros/999`), muestra una interfaz limpia de *"Libro no encontrado"* con botón de retorno, sin romper la aplicación.

### Paso 5 — Navegación fluida con `Link`
- En el catálogo (`/libros`), cada tarjeta de libro contiene un `<Link href={'/libros/' + libro.id}>Ver detalle →</Link>`.
- En la página de detalle (`/libros/[id]`), se incluye `<Link href="/libros">← Volver al catálogo</Link>`.
- La transición entre vistas es instantánea al ejecutarse del lado cliente sin recargar la ventana del navegador.

---

## 🌟 Desafíos Opcionales Desarrollados

### Desafío A: Botón de Favorito (`app/libros/[id]/BotonFavorito.tsx`)
- Declarado con directiva `'use client'`.
- Maneja estado local con `useState<boolean>(false)`.
- Alterna interactivamente entre:
  - Estado inicial: `☆ Marcar como favorito` (estilo neutro)
  - Estado activo: `★ Favorito` (estilo ámbar destacado)

### Desafío B: Formulario de Alta con Server Actions (`app/libros/nuevo/page.tsx`)
- Página accesible desde el catálogo vía `+ Nuevo libro`.
- Formulario con campos: Título, Autor, Año de publicación y Checkbox de disponibilidad.
- Utiliza una **Server Action** nativa (`async function crearLibro(formData: FormData)`):
  - Procesa los datos en el servidor Next.js.
  - Ejecuta un `POST` contra `http://127.0.0.1:8000/api/libros`.
  - Revalida la caché con `revalidatePath('/libros')`.
  - Redirige inmediatamente al catálogo con `redirect('/libros')`.

### Desafío C: Diferenciación visual de disponibilidad
- En el listado `/libros`, los libros no disponibles exhiben una insignia distintiva:
  - `(No disponible)` en tono rojo/rosa suave (`bg-rose-100 text-rose-800`).
  - `Disponible` en tono verde esmeralda (`bg-emerald-100 text-emerald-800`).
