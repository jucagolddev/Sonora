/**
 * PROYECTO SONORA - ARQUITECTURA DE SOFTWARE
 * -------------------------------------------------------------------
 * Módulo: Controlador de Autenticación
 * Descripción: En este módulo hemos desarrollado la lógica para gestionar el ciclo
 *              de vida de los usuarios, incluyendo su registro y el inicio de sesión.
 *              Para garantizar la seguridad, implementamos el cifrado de contraseñas
 *              con Bcrypt y la gestión de sesiones mediante JSON Web Tokens (JWT).
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
 * Hemos diseñado esta función para crear un token de acceso seguro que nuestra
 * aplicación utilizará para identificar al usuario en peticiones futuras.
 * @param usuario Objeto con la información básica que queremos incluir en el token.
 * @returns {string} El token JWT firmado.
 */
const generarToken = (usuario: any) => {
    // Definimos el payload con los datos identificativos del usuario
    const payload = {
        id: usuario.id_usuario,
        nombre_usuario: usuario.nombre_usuario,
        es_administrador: usuario.es_administrador
    };
    
    // Obtenemos nuestra clave secreta desde el entorno para mayor seguridad
    const secret = process.env.SECRET_KEY || 'secreto_universitario_sonora';
    
    // Firmamos el token con una expiración de un día
    return jwt.sign(
        payload,
        secret,
        { expiresIn: '1d' }
    );
};

// -----------------------------------------------------------------
// OPERACIONES DE USUARIO
// -----------------------------------------------------------------

/**
 * Registro de Nuevos Usuarios
 * ------------------------------------------------------------------
 * Endpoint: /api/usuarios/registro
 * Método: POST
 *
 * En este proceso seguimos los siguientes pasos:
 * 1. Validamos que nosotros recibamos todos los campos necesarios.
 * 2. Comprobamos en nuestra base de datos que el usuario no exista previamente.
 * 3. Aplicamos un hash seguro a la contraseña para que nunca se guarde en texto plano.
 * 4. Insertamos los datos en la tabla 'Usuarios' de nuestro esquema.
 * 5. Devolvemos un token para que el usuario pueda empezar a usar la app de inmediato.
 */
export const registro = async (req: Request, res: Response) => {
    const { nombre_usuario, email, password } = req.body;

    // Validación: Nos aseguramos de tener nombre, email y contraseña
    if (!nombre_usuario || !email || !password) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios para el registro.' });
    }

    try {
        // Consultamos si el usuario ya está en nuestro sistema
        const [existeUsuario]: any = await db.query(
            'SELECT id_usuario FROM Usuarios WHERE email = ? OR nombre_usuario = ?',
            [email, nombre_usuario]
        );

        if (existeUsuario.length > 0) {
            return res.status(409).json({ mensaje: 'Lo sentimos, este usuario o email ya está en uso.' });
        }

        // Proceso de cifrado: Generamos un salt y hasheamos la clave
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Guardado en la base de datos
        const [resultado]: any = await db.query(
            'INSERT INTO Usuarios (nombre_usuario, email, password_hash, fecha_registro) VALUES (?, ?, ?, NOW())',
            [nombre_usuario, email, password_hash]
        );

        // Creamos el perfil temporal para la respuesta
        const nuevoUsuario = {
            id_usuario: resultado.insertId,
            nombre_usuario: nombre_usuario,
            es_administrador: 0
        };

        // Generamos el token de bienvenida
        const token = generarToken(nuevoUsuario);

        // Informamos del éxito y enviamos el token
        res.status(201).json({
            mensaje: '¡Te has unido a Sonora correctamente! Tu sesión ha comenzado.',
            token: token,
            usuario: nuevoUsuario
        });

    } catch (error) {
        console.error('Error durante el proceso de registro de nuestro equipo:', error);
        res.status(500).json({ mensaje: 'Hubo un error interno en nuestro servidor al tramitar tu registro.' });
    }
};

/**
 * Inicio de Sesión (Login)
 * ------------------------------------------------------------------
 * Endpoint: /api/usuarios/login
 * Método: POST
 *
 * Pasos que seguimos para autenticar:
 * 1. Recuperamos el usuario registrado mediante su dirección de correo.
 * 2. Comparamos la contraseña enviada con nuestro hash guardado.
 * 3. Si coinciden, registramos el momento de la sesión.
 * 4. Entregamos un nuevo JWT para autorizar sus acciones en la plataforma.
 */
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Verificamos que se han enviado las credenciales
    if (!email || !password) {
        return res.status(400).json({ mensaje: 'Por favor, introduce tu email y contraseña.' });
    }

    try {
        // Buscamos el registro en nuestra tabla Usuarios
        const [usuarios]: any = await db.query(
            'SELECT id_usuario, nombre_usuario, password_hash, es_administrador FROM Usuarios WHERE email = ?',
            [email]
        );

        const usuario = usuarios[0];

        // Validamos la existencia del usuario y la integridad de la contraseña
        if (!usuario || !(await bcrypt.compare(password, usuario.password_hash))) {
            return res.status(401).json({ mensaje: 'Las credenciales que has introducido no son correctas.' });
        }

        // Actualizamos la fecha de su última entrada a Sonora
        await db.query('UPDATE Usuarios SET ultima_sesion = NOW() WHERE id_usuario = ?', [usuario.id_usuario]);

        // Generamos el token de sesión activa
        const token = generarToken(usuario);

        // Enviamos la respuesta positiva con los datos necesarios para el frontend
        res.status(200).json({
            mensaje: 'Has iniciado sesión correctamente en Sonora.',
            token: token,
            id_usuario: usuario.id_usuario,
            nombre_usuario: usuario.nombre_usuario
        });

    } catch (error) {
        console.error('Error en el proceso de login de nuestra app:', error);
        res.status(500).json({ mensaje: 'Nuestro servidor ha tenido un problema al procesar tu acceso.' });
    }
};


