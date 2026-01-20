/**
 * ARQUITECTURA DE SOFTWARE - SONORA V2
 * -------------------------------------------------------------------
 * Módulo: Controlador de Audio (Canciones)
 * Descripción: Gestiona la recuperación y listado de canciones desde la base de datos.
 *              Sirve los metadatos necesarios para el reproductor del frontend.
 */

import { Request, Response } from "express";
import db from "../config/db";

/**
 * Obtener Todos los Audios
 * -------------------------------------------------------------------
 * Recupera el catálogo completo de canciones disponibles.
 *
 * @param {Request} req - Petición HTTP entrante.
 * @param {Response} res - Respuesta HTTP a enviar (JSON con array de canciones).
 * @returns {Promise<void>}
 */

/**
 * Obtener listado completo de canciones
 * @param req
 * @param res
 */
export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    // Consulta para obtener todas las canciones con su autor
    const [audios] = await db.query(`
            SELECT c.*, a.nombre_artistico as autor_nombre 
            FROM canciones c
            LEFT JOIN autor a ON c.id_autor_fk = a.id_autor
        `);

    res.status(200).json({
      mensaje: "Audios obtenidos correctamente",
      audios: audios,
    });
  } catch (error) {
    console.error("Error al obtener los audios:", error);
    res.status(500).json({
      mensaje: "Error al obtener los audios",
      error: error,
    });
  }
};
