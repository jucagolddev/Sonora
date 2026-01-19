/**
 * ARQUITECTURA DE SOFTWARE - SONORA V2
 * -------------------------------------------------------------------
 * Módulo: Rutas de Audio
 * Descripción: Endpoints públicos para consultar el catálogo de música.
 */

import express from 'express';
import * as audioController from '../controllers/audio_controller';

const router = express.Router();

/**
 * RUTAS DE AUDIOS
 * ------------------------------------------------------------------
 * Prefijo: /api/canciones
 */

// GET /api/canciones
// Devuelve el listado completo de audios
router.get('/', audioController.obtenerTodos);

export default router;
