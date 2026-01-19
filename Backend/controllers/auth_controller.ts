/**
 * ARQUITECTURA DE SOFTWARE - SONORA V2
 * -------------------------------------------------------------------
 * Módulo: Controlador de Autenticación
 * Descripción: Gestiona el registro y login de usuarios.
 *              Implementa seguridad con Bcrypt y JWT.
 */

import { Request, Response } from 'express';
import db from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
 
dotenv.config();

/**
 * Generador de Tokens JWT
 * -------------------------------------------------------------------
 * Crea un JSON Web Token (JWT) firmado con una clave secreta.
 * @param usuario Objeto usuario que contiene la información a incluir en el payload.
 * @returns {string} El token JWT generado (string).
 */
const generarToken = (usuario: any) => {
    // Datos que queremos incluir en el token (Payload)
    const payload = {
        id: usuario.id_usuario,
        nombre_usuario: usuario.nombre_usuario,
        es_administrador: usuario.es_administrador
    };
    // Combinar el token con la clave secreta y definir la expiración
    const secret = process.env.SECRET_KEY || 'secreto_super_seguro'; // Fallback por seguridad
    return jwt.sign(
        payload,
        secret,
        { expiresIn: '1d' }    // El token valida por 24 horas
    );
};

// -----------------------------------------------------------------
// CONTROLADOR DE AUTENTICACIÓN
// -----------------------------------------------------------------

/**
 * Registro de Nuevo Usuario
 * ------------------------------------------------------------------
 * Endpoint: /api/usuarios/registro
 * Método: POST
 *
 * Responsabilidad:
 * 1. Validar que se reciban email, nombre_usuario y password.
 * 2. Verificar que el usuario no exista previamente en la base de datos.
 * 3. Hashear la contraseña usando bcryptjs para seguridad.
 * 4. Guardar el nuevo usuario en la base de datos MySQL.
 * 5. Generar un JWT inicial para que el usuario quede logueado automáticamente.
 *
 * @param req Objeto de solicitud (Express Request).
 * @param res Objeto de respuesta (Express Response).
 */
export const registro = async (req: Request, res: Response) => {
    const { nombre_usuario, email, password } = req.body;

    // 1. Validación de campos obligatorios
    if (!nombre_usuario || !email || !password) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios: nombre_usuario, email y password.' });
    }

    try {
        // 2. Verificar si el usuario ya existe (por email o nombre de usuario)
        const [existeUsuario]: any = await db.query(
            'SELECT id_usuario FROM Usuarios WHERE email = ? OR nombre_usuario = ?',
            [email, nombre_usuario]
        );

        if (existeUsuario.length > 0) {
            return res.status(409).json({ mensaje: 'El email o el nombre de usuario ya se encuentra en uso.' });
        }

        // 3. Cifrado (Hashing) de la contraseña
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 4. Inserción en Base de Datos
        const [resultado]: any = await db.query(
            'INSERT INTO Usuarios (nombre_usuario, email, password_hash, fecha_registro) VALUES (?, ?, ?, NOW())',
            [nombre_usuario, email, password_hash]
        );

        // --- Crear objeto de usuario para respuesta y token ---
        const nuevoUsuario = {
            id_usuario: resultado.insertId,
            nombre_usuario: nombre_usuario,
            es_administrador: 0
        };

        // 5. Generar Token JWT
        const token = generarToken(nuevoUsuario);

        // Respuesta Exitosa (201 Created)
        res.status(201).json({
            mensaje: 'Usuario registrado correctamente. Sesión iniciada.',
            token: token,
            usuario: nuevoUsuario,
            id_usuario: nuevoUsuario.id_usuario
        });

    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor al registrar el usuario.' });
    }
};

/**
 * Inicio de Sesión (Login)
 * ------------------------------------------------------------------
 * Endpoint: /api/usuarios/login
 * Método: POST
 *
 * Responsabilidad:
 * 1. Buscar al usuario por su email.
 * 2. Comparar la contraseña enviada con el hash almacenado usando bcrypt.compare.
 * 3. Si es correcto, actualizar la fecha de 'ultima_sesion'.
 * 4. Generar y devolver un token JWT para autenticación en futuras peticiones.
 *
 * @param req Objeto de solicitud (Express Request).
 * @param res Objeto de respuesta (Express Response).
 */
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios: email y password.' });
    }

    try {
        // 1. Buscar el usuario por email
        const [usuarios]: any = await db.query(
            'SELECT id_usuario, nombre_usuario, password_hash, es_administrador FROM Usuarios WHERE email = ?',
            [email]
        );

        const usuario = usuarios[0];

        // 2. Verificar si el usuario existe
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
        }

        // 3. Comparar contraseñas (Texto plano vs Hash)
        const esValida = await bcrypt.compare(password, usuario.password_hash);

        if (!esValida) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
        }

        // 4. Actualizar registro de sesión
        await db.query('UPDATE Usuarios SET ultima_sesion = NOW() WHERE id_usuario = ?', [usuario.id_usuario]);

        // 5. Generar Token JWT
        const token = generarToken(usuario);

        // Respuesta Exitosa
        res.status(200).json({
            mensaje: 'Login exitoso.',
            token: token, // IMPORTANTE: El frontend debe almacenar este token
            id_usuario: usuario.id_usuario,
            nombre_usuario: usuario.nombre_usuario
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor al iniciar sesión.' });
    }
};

