import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Definimos una interfaz para el Request extendido para que TS reconozca req.usuario
export interface AuthRequest extends Request {
    usuario?: any;
}

/**
 * Middleware de Autenticación (verificarToken)
 * ------------------------------------------------------------------
 * Este middleware intercepta las peticiones HTTP y verifica si vienen
 * acompañadas de un token JWT válido en la cabecera 'Authorization'.
 *
 * Si el token es válido:
 * - Decodifica el payload (datos del usuario).
 * - Lo adjunta al objeto `req` como `req.usuario`.
 * - Permite llamar a `next()` para pasar al controlador correspondiente.
 *
 * Si el token NO es válido o no existe:
 * - Retorna una respuesta de error 401 (No autorizado) o 403 (Prohibido).
 */
export const verificarToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. Obtener el token de la cabecera (Formato esperado: "Bearer <token>")
    const authHeader = req.headers['authorization'];
    // Extraemos solo el token si existe el header
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó un token de autenticación.' });
    }

    try {
        // 2. Verificar la firma del token con nuestra CLAVE SECRETA
        const secret = process.env.SECRET_KEY || 'secreto_super_seguro';
        const decodificado = jwt.verify(token, secret);

        // 3. Adjuntar los datos decodificados al request
        req.usuario = decodificado;

        // 4. Continuar al siguiente middleware o controlador
        next();

    } catch (error) {
        return res.status(403).json({ mensaje: 'Token inválido o expirado.' });
    }
};
