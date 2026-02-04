/**
 * PROYECTO SONORA - ARQUITECTURA DE SOFTWARE
 * -------------------------------------------------------------------
 * Módulo: Rutas de Autenticación
 * Descripción: En este archivo definimos los puntos de entrada (endpoints) 
 *              relacionados con la gestión de cuentas de usuario.
 */

import express from 'express';
import * as authController from '../controllers/auth_controller';

const router = express.Router();

/**
 * DEFINICIÓN DE ENDPOINTS: AUTENTICACIÓN
 * -------------------------------------
 * Aquí conectamos las rutas que nuestra aplicación frontend utilizará
 * con la lógica que hemos programado en el controlador de usuarios.
 */

// REGISTRO: Permite crear un nuevo perfil en Sonora
// POST /api/usuarios/registro
router.post('/registro', authController.registro);

// ACCESO: Permite validar credenciales e iniciar sesión
// POST /api/usuarios/login
router.post('/login', authController.login);

// Exportamos nuestro enrutador para que sea integrado en el servidor principal
export default router;


