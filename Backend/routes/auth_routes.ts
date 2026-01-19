/**
 * ARQUITECTURA DE SOFTWARE - SONORA V2
 * -------------------------------------------------------------------
 * Módulo: Rutas de Autenticación
 * Descripción: Endpoints relacionados con el ciclo de vida del usuario (Login/Registro).
 */

import express from 'express';
import * as authController from '../controllers/auth_controller';

const router = express.Router();

/**
 * MÓDULO DE RUTAS: AUTENTICACIÓN
 * ------------------------------
 * Define los endpoints relacionados con la gestión de usuarios (Registro y Login).
 */

// POST /api/usuarios/registro
// Llama al controlador para registrar un nuevo usuario en el sistema.
router.post('/registro', authController.registro);

// POST /api/usuarios/login
// Llama al controlador para iniciar sesión y obtener un Token JWT.
router.post('/login', authController.login);

// Exportar el router para ser montado en el servidor principal
export default router;

