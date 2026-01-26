/**
 * ARQUITECTURA DE SOFTWARE - SONORA V2
 * -------------------------------------------------------------------
 * Módulo: Servidor Principal (Entry Point)
 * Descripción: Configuración e inicialización del servidor Express.
 *              Define middlewares globales, rutas y conexión a BD.
 */

import express, { Request, Response } from "express";
import cors from "cors";
import path from "path"; // Añadido para gestionar rutas de archivos
import authRoutes from "./routes/auth_routes";
import archivosRoutes from "./routes/archivo_routes";
import audioRoutes from "./routes/audio_routes";

/**
 * Inicialización de la Aplicación Express
 * -------------------------------------------------------------------
 * Crea la instancia principal del servidor que gestionará las peticiones HTTP.
 */
const app = express();
const PORT = process.env.PORT || 3000;

// -----------------------------------------------------------------
// MIDDLEWARES GLOBALES
// -----------------------------------------------------------------

/**
 * Middleware: CORS
 * Permite que aplicaciones en otros dominios o puertos (como Angular en localhost:4200)
 * realicen peticiones a este servidor.
 */
app.use(cors());

/**
 * Middleware: JSON Body Parser
 * Permite que el servidor entienda y procese datos en formato JSON que vienen en el body de las peticiones.
 */
app.use(express.json());

/**
 * Middleware: Archivos Estáticos
 * Permite acceder a los archivos subidos (audio/video) desde el navegador.
 * Se añade configuración de caché para mejorar el rendimiento.
 */
app.use(
  "/archivos",
  express.static(path.join(__dirname, "archivos"), {
    maxAge: "31536000", // 1 año en milisegundos
    immutable: true,
  }),
);

// -----------------------------------------------------------------
// CONEXIÓN DE RUTAS (ROUTING)
// -----------------------------------------------------------------

// Rutas para gestión de usuarios (Registro, Login)
// Prefijo: /api/usuarios
app.use("/api/usuarios", authRoutes);

// Rutas para gestión de archivos (Subida de canciones)
// Prefijo: /api/archivos
app.use("/api/archivos", archivosRoutes);

// Rutas para gestión de canciones (Listado, etc.)
// Prefijo: /api/canciones
app.use("/api/canciones", audioRoutes);

// -----------------------------------------------------------------
// Rutas de Prueba y Utilidad
// -----------------------------------------------------------------

/**
 * Endpoint Raíz
 * Verifica que el servidor está corriendo correctamente.
 */
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    mensaje: "API de Sonora funcionando. Lista para recibir peticiones.",
    estado: "OK",
    version: "1.0.0",
  });
});

// -----------------------------------------------------------------
// INICIAR EL SERVIDOR
// -----------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express escuchando en http://localhost:${PORT}`);
  console.log(`📡 Esperando peticiones de Angular...`);
});
