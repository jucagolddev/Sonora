/**
 * PROYECTO SONORA - ARQUITECTURA DE SOFTWARE
 * -------------------------------------------------------------------
 * Módulo: Configuración de Base de Datos
 * Descripción: En este módulo gestionamos la conexión con nuestro servidor MySQL.
 *              Hemos optado por utilizar un pool de conexiones para asegurar que nuestra
 *              aplicación sea escalable y maneje eficientemente múltiples peticiones.
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargamos las variables de entorno para no exponer credenciales sensibles en el código
dotenv.config();

/**
 * Pool de Conexiones MySQL
 * -------------------------------------------------------------------
 * Definimos la configuración de nuestro pool. Los datos de acceso se extraen
 * de nuestro archivo .env, siguiendo las mejores prácticas de seguridad
 * que hemos aprendido en la universidad.
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST,       // Dirección del servidor de la base de datos
    user: process.env.DB_USER,       // Usuario con permisos sobre el esquema 'sonora'
    password: process.env.DB_PASSWORD, // Contraseña del usuario
    database: process.env.DB_NAME,   // Nombre de la base de datos que hemos diseñado
    waitForConnections: true,        // Si el pool está lleno, las peticiones esperan
    connectionLimit: 10,             // Hemos limitado a 10 las conexiones simultáneas
    queueLimit: 0                    // Sin límite para la cola de espera
});

/**
 * Verificación de Conectividad
 * -------------------------------------------------------------------
 * Hemos implementado esta función autoejecutable para confirmar que la conexión
 * con MySQL es exitosa en el momento en que nuestro servidor arranca.
 */
async function testConnection() {
    try {
        await pool.getConnection(); // Intentamos obtener una conexión del pool
        console.log('✅ Hemos establecido la conexión con la base de datos MySQL correctamente.');
    } catch (error: any) {
        console.error('❌ No hemos podido conectar con la base de datos. Verifica tu configuración:', error);
        process.exit(1); // Detenemos el proceso si la base de datos no es accesible
    }
}

testConnection();

// Exportamos nuestro pool para que nosotros podamos realizar consultas desde los controladores
export default pool;


