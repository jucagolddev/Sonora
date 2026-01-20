# 🎵 SONORA V2 - Plataforma de Gestión y Streaming de Audio

> **Versión del Proyecto**: 2.1.0  
> **Estado**: Estable / Producción Académica  
> **Fecha de Actualización**: Enero 2026

## 📖 Visión del Proyecto

**Sonora V2** es una aplicación web moderna y robusta diseñada para la gestión, subida y reproducción de archivos de audio. Desarrollada con una arquitectura separada (Backend/Frontend), cumple con los más altos estándares académicos y profesionales, ofreciendo una experiencia de usuario fluida, un diseño responsivo de alta gama y una gestión segura de contenidos multimedia.

El proyecto simula una plataforma profesional de tipo "SoundCloud" o "Spotify" simplificado, permitiendo a los usuarios registrarse, subir sus propias creaciones (MP3/MP4) y explorar una biblioteca de sonidos categorizados dinámicamente.

---

## 🛠️ Stack Tecnológico

El proyecto utiliza tecnologías de vanguardia, asegurando escalabilidad y mantenibilidad.

### 🎨 Frontend (Interfaz de Usuario)

- **Framework**: [Angular 16.2.0](https://angular.io/)
- **Lenguaje**: TypeScript 5.1
- **Estilos**: SCSS (Sass) con arquitectura modular BEM y diseño responsivo.
- **Diseño**: Material Design Icons, paleta de colores personalizada (Dark Theme con acentos Naranja).
- **Comunicación**: HttpClient (RxJS) para consumo de API REST.

### ⚙️ Backend (Servidor y API)

- **Entorno**: [Node.js](https://nodejs.org/) (v20+)
- **Framework Web**: [Express.js 5.2.1](https://expressjs.com/)
- **Lenguaje**: TypeScript 5.9 (Compilado a JS vía `ts-node` en desarrollo).
- **Base de Datos Driver**: `mysql2` con soporte de Promesas.
- **Seguridad y Utilidades**:
  - `jsonwebtoken` (JWT) para Autenticación.
  - `bcryptjs` para Hashing de contraseñas.
  - `multer` para gestión de subida de archivos (Multipart/Form-Data).
  - `cors` y `dotenv` para configuración y seguridad.

### 💾 Base de Datos

- **Motor**: MySQL 8.0 (vía XAMPP/MariaDB).
- **Nombre de BD**: `Sonora`.
- **Tablas Principales**:
  - `usuarios`: Gestión de cuentas y roles.
  - `canciones`: Catálogo de audios.
  - `autor`: Perfiles artísticos.
  - `categorias`: **[NUEVO]** Clasificación dinámica de sonidos.

---

## 🚀 Instalación y Configuración

Sigue estos pasos para desplegar el proyecto en un entorno local.

### Prerrequisitos

1.  **Node.js** instalado (v16 o superior).
2.  **XAMPP** (o servidor MySQL equivalente) instalado y corriendo.
3.  **Angular CLI** instalado globalmente (`npm install -g @angular/cli`).

### Paso 1: Configuración de Base de Datos

1.  Inicia el módulo **MySQL** en XAMPP.
2.  Crea la base de datos `sonora` (si no existe).
3.  **IMPORTANTE**: Importa el script `sonora.sql` ubicado en la carpeta `Backend/` para crear todas las tablas, incluyendo la nueva tabla de `categorias` y los datos de ejemplo.
4.  Verifica que el usuario `root` no tenga contraseña (o configura `.env` en el Backend).

### Paso 2: Configuración del Backend

```bash
cd Backend
# Instalar dependencias
npm install

# Crear archivo .env (si no existe) con:
# PORT=3000
# DB_HOST=127.0.0.1
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=Sonora
# SECRET_KEY=tu_clave_secreta_super_segura

# Iniciar servidor en modo desarrollo
npx ts-node server.ts
```

_El servidor escuchará en `http://localhost:3000`._

### Paso 3: Configuración del Frontend

```bash
cd Frontend
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
ng serve
```

_La aplicación estará disponible en `http://localhost:4200`._

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una estructura limpia y modular.

### 🌳 Árbol de Directorios (Resumido)

```
c:/xampp/htdocs/Sonora/
├── 📂 Backend                 # Lógica del Servidor (API REST)
│   ├── 📂 config              # Configuración de BD (db.ts)
│   ├── 📂 controllers         # Lógica de negocio (controladores)
│   │   ├── archivo_controller.ts  # Subida de ficheros con categorías
│   │   ├── audio_controller.ts    # Gestión de canciones y categorías
│   │   └── auth_controller.ts     # Login/Registro
│   ├── 📂 middleware          # Intermediarios (Auth JWT)
│   ├── 📂 routes              # Definición de Endpoints
│   ├── 📂 archivos            # Almacenamiento físico de MP3/MP4
│   ├── sonora.sql             # Script de Base de Datos (Estructura + Datos)
│   └── server.ts              # Punto de entrada (Entry Point)
│
├── 📂 Frontend                # Aplicación Cliente (SPA)
│   ├── 📂 src
│   │   ├── 📂 app
│   │   │   ├── 📂 core        # Servicios Singleton
│   │   │   │   ├── 📂 services
│   │   │   │   │   ├── auth.service.ts  # Cliente HTTP Auth
│   │   │   │   │   └── sound.service.ts # Cliente HTTP Audio y Categorías
│   │   │   ├── 📂 features    # Módulos Funcionales
│   │   │   │   ├── 📂 auth    # Vistas de Auth (Login/Register)
│   │   │   │   ├── 📂 home    # Página principal con categorías dinámicas
│   │   │   │   ├── 📂 category # Vista de detalle por categoría
│   │   │   │   └── 📂 projects # Subida de archivos (Upload)
│   │   │   ├── 📂 layout      # Estructura Base (Header/Footer)
│   │   │   └── 📂 shared      # Componentes Reutilizables
│   │   ├── 📂 styles          # Arquitectura SCSS (Variables, Mixins)
│   │   │   ├── _variables.scss
│   │   │   └── styles.scss    # Estilo Global
│   └── angular.json           # Configuración del CLI
│
└── README.md                  # Documentación Maestra (Este archivo)
```

---

## 🧭 Guía de Páginas y Funcionalidad

### 1. Home (Página Principal)

- **Ruta**: `/`
- **Funcionalidad**:
  - Listado de canciones destacadas ("Tops Download").
  - **[NUEVO]** Carrusel y botones de categorías cargados dinámicamente desde la BD.
  - Barra de búsqueda global.
- **Componentes Clave**: `HomeComponent`, `SoundCardComponent`.

### 2. Navegación por Categorías

- **Ruta**: `/categoria/:nombre`
- **Funcionalidad**: Muestra todas las canciones pertenecientes a una categoría específica (ej. "Naturaleza", "Coches").
- **Backend**: Filtra la consulta SQL optimizando el rendimiento.

### 3. Login / Registro

- **Rutas**: `/login`, `/register`
- **Funcionalidad**: Autenticación segura de usuarios. Genera un Token JWT que se almacena en `localStorage` para persistir la sesión.

### 4. Subida de Archivos (Upload)

- **Ruta**: `/subir` (Protegida - Requiere Login)
- **Funcionalidad**: Formulario reactivo para subir nuevas pistas.
  - **Soporte**: MP3, MP4, WAV.
  - **[NUEVO]** Selección de categoría dinámica desde la base de datos.
  - **Validación**: Verifica tipo de archivo antes de subir.
  - **Progreso**: Muestra barra de carga en tiempo real.

---

**Desarrollado con ❤️ y TypeScript.**
