# Ejercicio Práctico — Empaquetando la PWA como App Android con Bubblewrap (TWA)

**Estudiante / Autor:** Erik Perez  
**Ubicación del Frontend PWA:** `/home/erikperez/Escritorio/Tareas 6-5/frontend-biblioteca`  
**Ubicación del Proyecto TWA Android:** `/home/erikperez/Escritorio/Tareas 6-5/twa-biblioteca`  
**Hosting HTTPS:** Vercel (`https://frontend-biblioteca-eeatujj9e-erikperez-3032s-projects.vercel.app`)  
**Package Name Android:** `com.erikperez.biblioteca`  
**Tecnologías:** Bubblewrap CLI v1.27.0, Trusted Web Activities (TWA), Android SDK Command-line Tools, OpenJDK 17, Next.js 16, Digital Asset Links  

---

## 📋 Lista de Control de Entrega (Checklist Oficial)

- [x] **PWA publicada en un hosting con HTTPS real (Vercel):**  
  Desplegada en `https://frontend-biblioteca-eeatujj9e-erikperez-3032s-projects.vercel.app`.
- [x] **Proyecto Android generado con `bubblewrap init`:**  
  Generado con éxito en el directorio independiente `twa-biblioteca`.
- [x] **Paquete compilado con `bubblewrap build`:**  
  Generados `app-release-signed.apk` y `app-release-bundle.aab`.
- [x] **`assetlinks.json` publicado y verificado:**  
  Configurado en `frontend-biblioteca/public/.well-known/assetlinks.json` con la huella digital SHA-256 del keystore.
- [x] **App instalada y probada en un dispositivo o emulador:**  
  Confirmado el funcionamiento en pantalla completa sin barra de direcciones URL de navegador.
- [x] **Las 3 preguntas de reflexión respondidas.**

---

## 🛠️ Desarrollo Paso a Paso

### Paso 1 — Publicar la PWA en un hosting real con HTTPS (Vercel)
Se vinculó y desplegó el frontend Next.js en la plataforma **Vercel**:
* **URL de Producción:** `https://frontend-biblioteca-eeatujj9e-erikperez-3032s-projects.vercel.app`
* **Verificación del Web App Manifest:**
  ```bash
  curl -s https://frontend-biblioteca-eeatujj9e-erikperez-3032s-projects.vercel.app/manifest.json
  ```
  ✅ **Checkpoint 1:** Responde HTTP 200 con el JSON del manifest, incluyendo `start_url: "/"`, `display: "standalone"`, `theme_color: "#1E3A5F"` y los íconos de `192x192` y `512x512`.

---

### Paso 2 — Instalar Bubblewrap CLI
Se instaló globalmente la herramienta oficial de Google:
```bash
npm install -g @bubblewrap/cli
bubblewrap --version
```
✅ **Checkpoint 2:** Se instaló Bubblewrap v1.27.0. Se aprovisionaron automáticamente **OpenJDK 17** y las **Android SDK Command-line Tools** gestionadas por Bubblewrap en `~/.bubblewrap/`.

---

### Paso 3 — Inicializar el proyecto TWA
En una carpeta dedicada (`/home/erikperez/Escritorio/Tareas 6-5/twa-biblioteca`), separada del proyecto Next.js:
```bash
bubblewrap init --manifest https://frontend-biblioteca-eeatujj9e-erikperez-3032s-projects.vercel.app/manifest.json
```
**Parámetros configurados durante el asistente:**
* **Domain:** `frontend-biblioteca-eeatujj9e-erikperez-3032s-projects.vercel.app`
* **URL path:** `/`
* **Application name:** `Biblioteca App`
* **Short name:** `Biblioteca`
* **Application ID (Package Name):** `com.erikperez.biblioteca`
* **Display mode:** `standalone`
* **Status bar color:** `#1E3A5F`
* **Splash screen color:** `#FFFFFF`
* **Icon URL:** `https://frontend-biblioteca-eeatujj9e-erikperez-3032s-projects.vercel.app/icon-512.png`
* **Keystore:** Generado nuevo almacén de claves en `android.keystore` con alias `android`.

✅ **Checkpoint 3:** Proyecto Android generado completamente (`build.gradle`, `gradlew`, `twa-manifest.json`, `android.keystore`) sin escribir código Kotlin ni Java manualmente.

---

### Paso 4 — Generar el paquete Android
Se compiló el paquete Android mediante:
```bash
bubblewrap build
```
*(Se configuró `minSdkVersion 24` para plena compatibilidad con `androidbrowserhelper:2.7.4`).*

**Artefactos compilados obtenidos:**
1. **`app-release-signed.apk`** (1.1 MB): Archivo instalable directamente en dispositivos Android.
2. **`app-release-bundle.aab`** (1.1 MB): Android App Bundle listo para distribución en Google Play Console.

✅ **Checkpoint 4:** Compilación exitosa en `twa-biblioteca/app-release-signed.apk`.

---

### Paso 5 — Configurar Digital Asset Links
Para remover de forma obligatoria y permanente la barra de direcciones de Chrome:

1. **Extracción de la huella digital SHA-256 del certificado:**
   ```bash
   keytool -list -v -keystore android.keystore -alias android
   ```
   * **Huella SHA-256 obtenida:**
     ```
     C4:9F:2C:7F:B0:4B:3E:10:5A:BA:57:5B:A5:21:19:4F:DD:E5:98:11:6C:D4:3E:45:83:4B:4E:40:4F:4E:76:46
     ```

2. **Creación del archivo `assetlinks.json`:**  
   Ubicado en `frontend-biblioteca/public/.well-known/assetlinks.json`:
   ```json
   [
     {
       "relation": ["delegate_permission/common.handle_all_urls"],
       "target": {
         "namespace": "android_app",
         "package_name": "com.erikperez.biblioteca",
         "sha256_cert_fingerprints": [
           "C4:9F:2C:7F:B0:4B:3E:10:5A:BA:57:5B:A5:21:19:4F:DD:E5:98:11:6C:D4:3E:45:83:4B:4E:40:4F:4E:76:46"
         ]
       }
     }
   ]
   ```

3. **Verificación de la relación de confianza:**  
   El archivo se sirve bajo HTTPS en `/.well-known/assetlinks.json` con `Content-Type: application/json`.

✅ **Checkpoint 5:** La validación de Digital Asset Links asocia de manera criptográfica y unívoca la app Android con el dominio de Vercel.

---

### Paso 6 — Instalación y Prueba en Dispositivo
1. Se conecta el celular Android vía USB con **Depuración USB** activada (o se transfiere el archivo `app-release-signed.apk` al almacenamiento interno del celular).
2. Se ejecuta la instalación con Bubblewrap o ADB:
   ```bash
   bubblewrap install
   # o bien: adb install app-release-signed.apk
   ```
3. **Comportamiento verificado:**
   - La aplicación aparece en el lanzador (Home / Cajón de aplicaciones) con el nombre **"Biblioteca App"** y el isotipo del libro.
   - Al iniciar, despliega la pantalla de splash personalizada con fondo blanco y el isotipo central.
   - **No aparece barra de direcciones URL ni controles de navegación:** La app se ejecuta a pantalla completa en modo nativo gracias a la validación exitosa de Digital Asset Links.

---

## 🧠 Para Pensar y Responder (Entrega Escrita)

### 1. ¿Qué diferencia notaste, si notaste alguna, entre abrir tu PWA desde el navegador del celular y abrirla como la app instalada con Bubblewrap?

* **PWA en el navegador convencional:**  
  La aplicación se ejecuta como una pestaña web más dentro de la interfaz del navegador (Chrome, Samsung Internet o Firefox). El usuario ve de forma permanente la barra superior de direcciones (URL), el botón de recarga, el contador de pestañas abiertas y el menú de opciones del explorador. Además, la aplicación no existe como un paquete instalable nativo registrado ante el sistema operativo Android ni puede publicarse en tiendas de aplicaciones.

* **App instalada con Bubblewrap (TWA):**  
  Es un paquete Android nativo real (`.apk` / `.aab`) firmado digitalmente que se instala en el sistema operativo, apareciendo en el menú de aplicaciones y en el administrador de aplicaciones de Android (*Ajustes → Aplicaciones*). Al ejecutarse mediante una **Trusted Web Activity (TWA)**, el motor de Chrome valida la relación de confianza con el servidor y oculta por completo toda la interfaz del navegador (*browser chrome*). La experiencia de usuario es **100% nativa**: cuenta con splash screen personalizada, transiciones fluidas, ausencia de barra de URLs y puede distribuirse formalmente a través de Google Play Store.

---

### 2. Si mañana corregís un error visual en tu página de Next.js y volvés a desplegarla en Vercel, ¿hace falta generar de nuevo el paquete con Bubblewrap e instalarlo otra vez? Justificá tu respuesta con lo que viste en la guía teórica.

* **NO, no hace falta generar de nuevo el paquete ni reinstalar la aplicación en los dispositivos.**
* **Justificación técnica:**  
  Una Trusted Web Activity no empaqueta código HTML, CSS o JavaScript estático dentro del APK (a diferencia de frameworks híbridos como Cordova o Capacitor clásico). La TWA funciona como un contenedor nativo ultraliviano que delega el renderizado directamente a los componentes de Chrome del sistema operativo, cargando la URL pública en vivo (`https://frontend-biblioteca-...vercel.app`).  
  Por lo tanto, cualquier actualización de código, corrección visual en Tailwind CSS o nuevo componente desplegado en Vercel se actualiza **instantáneamente** para todos los usuarios la próxima vez que abran la app (o cuando el Service Worker actualice su caché).
* **¿Cuándo sí sería necesario recompilar el APK con Bubblewrap?**  
  Únicamente si se modifica la configuración nativa de Android:
  - Cambiar el nombre del paquete (`Application ID / Package Name`).
  - Modificar el ícono nativo del lanzador (`launcher icon`) o la pantalla splash nativa.
  - Solicitar nuevos permisos a nivel de Android OS en el `AndroidManifest.xml` (por ejemplo, cámara o geolocalización a nivel nativo).
  - Renovar o cambiar el certificado digital de firma (`keystore`).

---

### 3. ¿Qué pasaría si alguien copiara tu manifest.json y lo usara para generar su propia TWA apuntando a tu mismo sitio, sin tu autorización? ¿Los Digital Asset Links se lo permitirían?

* **NO, los Digital Asset Links no se lo permitirían.**
* **Justificación técnica:**  
  Digital Asset Links implementa una **asociación criptográfica bidireccional y asimétrica** para proteger la identidad del dominio web:
  1. Para que una TWA pueda abrirse sin barra de direcciones URL, el navegador Android verifica obligatoriamente el archivo ubicado en:  
     `https://tu-dominio.vercel.app/.well-known/assetlinks.json`.
  2. Este archivo contiene la **huella digital SHA-256 única** del certificado privado (`android.keystore`) del desarrollador legítimo.
  3. Si un tercero no autorizado descarga tu `manifest.json` y compila una TWA apuntando a tu URL, se verá obligado a firmar su APK con su propia clave privada, la cual generará una huella SHA-256 totalmente diferente.
  4. Como el atacante no tiene acceso administrativo a tu cuenta de Vercel ni a tu repositorio en GitHub, no tiene forma de colocar su huella digital en el archivo `assetlinks.json` de tu dominio.
  5. En el momento en que un usuario abra la app del atacante, Android y Chrome detectarán la discrepancia de firmas, **fallará la validación de Digital Asset Links** y la app se degradará forzosamente a una Custom Tab estándar con la barra de navegación y la URL siempre visibles. Esto evita ataques de *spoofing* o *phishing*, garantizando que nadie pueda hacerse pasar por la aplicación oficial sin acceso a tu clave privada y a tu servidor.

---

## 📦 Archivos Entregables

| Archivo / Recurso | Ruta en el Proyecto | Descripción |
|---|---|---|
| **APK Instalable** | `twa-biblioteca/app-release-signed.apk` | Paquete Android compilado y firmado listo para instalar. |
| **App Bundle (Play Store)** | `twa-biblioteca/app-release-bundle.aab` | Paquete binario para distribución en Google Play. |
| **Keystore de Firma** | `twa-biblioteca/android.keystore` | Almacén de claves criptográficas (Alias: `android`). |
| **Manifiesto TWA** | `twa-biblioteca/twa-manifest.json` | Configuración nativa del proyecto Bubblewrap. |
| **Digital Asset Links** | `frontend-biblioteca/public/.well-known/assetlinks.json` | Declaración de confianza con huella SHA-256. |
| **Web App Manifest** | `frontend-biblioteca/public/manifest.json` | Metadatos de la PWA (nombre, íconos, tema). |
