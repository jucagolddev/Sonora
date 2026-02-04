/**
 * PROYECTO SONORA - ARQUITECTURA DE SOFTWARE
 * -------------------------------------------------------------------
 * Módulo: Rutas de Archivos
 * Descripción: En este enrutador gestionamos los accesos para la subida
 *              de material multimedia a nuestra plataforma.
 *              Hemos asegurado estas rutas mediante la validación de tokens JWT.
 */

import express from 'express';
import * as archivoController from '../controllers/archivo_controller';
import { verificarToken } from '../middleware/auth_middleware';

const router = express.Router();

/**
 * SUBIDA DE MATERIAL: POST /api/archivos/subir
 * -------------------------------------------
 * Esta ruta permite a los usuarios que han iniciado sesión compartir 
 * sus propios sonidos en Sonora. 
 * El middleware 'verificarToken' nos asegura que solo usuarios 
 * registrados puedan realizar esta acción.
 */
router.post('/subir', verificarToken, archivoController.subirArchivo);

export default router;

