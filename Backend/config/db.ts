/**
 * ARQUITECTURA DE SOFTWARE - SONORA V2
 * -------------------------------------------------------------------
 * Módulo: Configuración de Base de Datos
 * Descripción: Establece la conexión con MySQL usando un pool de conexiones.
 *              Utiliza variables de entorno para credenciales seguras.
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Pool de Conexiones MySQL
 * -------------------------------------------------------------------
 * Configuración optimizada para alta concurrencia.
 * Utiliza variables de entorno para proteger credenciales sensibles.
/**
 * 
 * --------------------------------------
 * Crea un pool de conexiones para gestionar eficientemente las peticiones 
 * a la base de datos MySQL. Utiliza variables de entorno para seguridad.
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST,       // Servidor (ej. localhost)
    user: process.env.DB_USER,       // Usuario (ej. root)
    password: process.env.DB_PASSWORD, // Contraseña
    database: process.env.DB_NAME,   // Nombre de la BBDD
    waitForConnections: true,        // Esperar si no hay conexiones libres
    connectionLimit: 10,             // Máximo de conexiones simultáneas
    queueLimit: 0                    // Sin límite de cola de espera
});

/**
 * Función de Prueba de Conectividad
 * Verifica al arrancar la aplicación si las credenciales son correctas
 * y se puede alcanzar el servidor de base de datos.
 */
async function testConnection() {
    try {
        await pool.getConnection();
        console.log('✅ Conexión establecida correctamente con la base de datos MySQL.');
    } catch (error: any) {
        console.error('❌ Error crítico al conectar con la base de datos:', error);
        process.exit(1); // Detiene la aplicación si no hay base de datos
    }
}

testConnection();

// Exportamos el pool para usarlo en los controladores (ej. db.query(...))
export default pool;

