/**
 * PROYECTO SONORA - ARQUITECTURA DE SOFTWARE
 * -------------------------------------------------------------------
 * Módulo: Servidor Principal (Entry Point)
 * Descripción: En este archivo configuramos e inicializamos nuestro servidor Express.
 *              Como equipo de desarrollo, hemos establecido aquí los middlewares globales,
 *              la gestión de rutas principales y la conexión base con nuestro entorno.
 * 
 * Nuestra aplicación actúa como un catálogo musical donde los usuarios pueden
 * explorar, buscar y subir sonidos de libre uso.
 */

import express, { Request, Response } from "express";
import cors from "cors";
import path from "path"; // Utilizamos path para la gestión consistente de rutas de archivos
import authRoutes from "./routes/auth_routes";
import archivosRoutes from "./routes/archivo_routes";
import audioRoutes from "./routes/audio_routes";

/**
 * Inicialización de la Aplicación Express
 * -------------------------------------------------------------------
 * Creamos la instancia principal de nuestro servidor para gestionar las peticiones HTTP
 * que nuestra aplicación frontend (Angular) realizará.
 */
const app = express();
const PORT = process.env.PORT || 3000;

// -----------------------------------------------------------------
// CONFIGURACIÓN DE MIDDLEWARES GLOBALES
// -----------------------------------------------------------------

/**
 * Middleware: CORS (Cross-Origin Resource Sharing)
 * Hemos activado CORS para permitir que nuestra aplicación frontend, que corre normalmente
 * en el puerto 4200, pueda comunicarse sin restricciones con este backend en el puerto 3000.
 */
app.use(cors());

/**
 * Middleware: JSON Body Parser
 * Configuramos Express para que sea capaz de interpretar los cuerpos de las peticiones
 * en formato JSON, lo cual es fundamental para el intercambio de datos en nuestra API REST.
 */
app.use(express.json());

/**
 * Middleware: Archivos Estáticos
 * Exponemos la carpeta 'archivos' para que los sonidos y medios subidos por los usuarios
 * sean accesibles públicamente mediante una URL (ej. http://localhost:3000/archivos/nombre.mp3).
 * Hemos añadido una configuración de caché para optimizar la carga de estos recursos.
 */
app.use(
  "/archivos",
  express.static(path.join(__dirname, "archivos"), {
    maxAge: "31536000", // Definimos un año de caché para recursos inmutables
    immutable: true,
  }),
);

// -----------------------------------------------------------------
// DEFINICIÓN DE RUTAS (ROUTING)
// -----------------------------------------------------------------

/**
 * Gestión de Usuarios y Autenticación
 * Prefijo: /api/usuarios
 * Aquí delegamos toda la lógica de registro, inicio de sesión y validación de credenciales.
 */
app.use("/api/usuarios", authRoutes);

/**
 * Gestión de Subida de Archivos
 * Prefijo: /api/archivos
 * Este módulo se encarga del procesamiento físico de los archivos multimedia que recibimos.
 */
app.use("/api/archivos", archivosRoutes);

/**
 * Catálogo y Listado de Canciones
 * Prefijo: /api/canciones
 * Rutas destinadas a la recuperación de metadatos de los sonidos almacenados.
 */
app.use("/api/canciones", audioRoutes);

// -----------------------------------------------------------------
// CONTROL DE ESTADO DEL SERVIDOR
// -----------------------------------------------------------------

/**
 * Endpoint Raíz: Verificación de Estado (Health Check)
 * Implementamos esta ruta para verificar de forma rápida que nuestro servidor
 * está operativo y listo para recibir tráfico.
 */
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    mensaje: "API de Sonora operativa y funcionando correctamente.",
    estudiantes: "Grupo de Desarrollo de Sonora",
    estado: "Ejecutándose",
    version: "1.0.0",
  });
});

/**
 * Arranque del Servidor
 * Ponemos nuestro servidor a la escucha en el puerto configurado.
 */
app.listen(PORT, () => {
  console.log(`🚀 Nuestro servidor Express está escuchando en http://localhost:${PORT}`);
  console.log(`📡 Preparados para recibir peticiones desde el Frontend.`);
});

