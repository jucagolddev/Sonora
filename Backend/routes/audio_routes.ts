/**
 * PROYECTO SONORA - ARQUITECTURA DE SOFTWARE
 * -------------------------------------------------------------------
 * Módulo: Rutas de Audio (Catálogo)
 * Descripción: En este archivo configuramos las rutas públicas que nuestra 
 *              aplicación utiliza para mostrar la biblioteca de sonidos.
 */

import express from "express";
import * as audioController from "../controllers/audio_controller";

const router = express.Router();

/**
 * ACCESO AL CATÁLOGO MUSICAL
 * --------------------------
 * Hemos establecido estos puntos de acceso para que cualquier usuario pueda
 * explorar las categorías y escuchar los sonidos de Sonora sin restricciones.
 */

// CATEGORÍAS: Devuelve la lista de géneros o tipos de sonido disponibles en nuestra app
// GET /api/canciones/categorias
router.get("/categorias", audioController.obtenerCategorias);

// COLECCIÓN: Devuelve todos los sonidos registrados en Sonora
// GET /api/canciones
router.get("/", audioController.obtenerTodos);

export default router;

