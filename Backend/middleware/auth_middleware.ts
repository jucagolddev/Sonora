/**
 * PROYECTO SONORA - ARQUITECTURA DE SOFTWARE
 * -------------------------------------------------------------------
 * Módulo: Middleware de Seguridad (Autenticación)
 * Descripción: En este archivo hemos programado la capa de seguridad que protege
 *              nuestra aplicación. Su función es actuar como un "guardián" que 
 *              verifica los tokens JWT antes de permitir el acceso a rutas privadas.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Extensión de la Interfaz Request
 * -------------------------------------------------------------------
 * Hemos definido esta interfaz para añadir la propiedad 'usuario' al objeto de 
 * petición de Express. Esto nos permite pasar la información del usuario
 * autenticado hacia los controladores de forma segura.
 */
export interface AuthRequest extends Request {
    usuario?: any;
}

/**
 * Middleware: Verificación de Token (JWT)
 * ------------------------------------------------------------------
 * Este proceso es vital para nuestra arquitectura de seguridad:
 * 1. Analizamos las cabeceras de la petición buscando el campo 'Authorization'.
 * 2. Extraemos el token que el frontend nos envía (formato Bearer).
 * 3. Utilizamos nuestra clave secreta para validar que el token no ha sido manipulado.
 * 4. Si todo es correcto, permitimos que la petición continúe su curso.
 */
export const verificarToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Capturamos la cabecera de autorización de nuestra petición
    const authHeader = req.headers['authorization'];
    
    // El token suele venir como 'Bearer <JWT>', por lo que extraemos la segunda parte
    const token = authHeader && authHeader.split(' ')[1];

    // Si no recibimos un token, nosotros cerramos el acceso inmediatamente
    if (!token) {
        return res.status(401).json({ mensaje: 'Para realizar esta acción en Sonora, primero debes iniciar sesión.' });
    }

    try {
        // Obtenemos nuestra clave maestra desde el archivo de configuración .env
        const secret = process.env.SECRET_KEY || 'secreto_universitario_sonora';
        
        // Comprobamos la autenticidad del token
        const decodificado = jwt.verify(token, secret);

        // Almacenamos los datos del usuario en el request para que el controlador pueda usarlos
        req.usuario = decodificado;

        // Autorizamos el paso al siguiente paso en nuestra cadena de ejecución
        next();

    } catch (error) {
        // Si el token es falso o ha caducado, informamos al usuario
        return res.status(403).json({ mensaje: 'Tu sesión ha caducado o el token no es válido. Por favor, identifícate de nuevo.' });
    }
};

