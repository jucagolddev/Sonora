/**
 * ARQUITECTURA DE SOFTWARE - SONORA V2
 * -------------------------------------------------------------------
 * Módulo: Rutas de Archivos
 * Descripción: Define los endpoints relacionados con la gestión multimedia (subidas).
 *              Protege las rutas mediante middlewares de autenticación.
 */

import express from 'express';
import * as archivoController from '../controllers/archivo_controller';
import { verificarToken } from '../middleware/auth_middleware';

const router = express.Router();

/**
 * Endpoint de Subida de Archivos
 * RUTA: POST /api/archivos/subir
 *
 * Middleware: verificarToken (Requiere Estar Logueado)
 * Función: Permite a un usuario autenticado subir un archivo de audio.
 */
router.post('/subir', verificarToken, archivoController.subirArchivo);

export default router;
