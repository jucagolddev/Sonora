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
/**
 * Obtener listado completo de canciones
 * @param req
 * @param res
 */
export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const { categoria } = req.query;
    let query = `
            SELECT c.*, a.nombre_artistico as autor_nombre 
            FROM canciones c
            LEFT JOIN autor a ON c.id_autor_fk = a.id_autor
        `;
    const params: any[] = [];

    if (categoria) {
      query += ` WHERE c.categoria = ?`;
      params.push(categoria);
    }

    // Consulta para obtener todas las canciones con su autor
    const [audios] = await db.query(query, params);

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

/**
 * Obtener Categorías
 * -------------------------------------------------------------------
 * Recupera el listado de categorías disponibles desde la tabla `categorias`.
 */
export const obtenerCategorias = async (req: Request, res: Response) => {
  try {
    const [categorias] = await db.query(`
      SELECT nombre_categoria FROM categorias ORDER BY nombre_categoria ASC
    `);

    res.status(200).json({
      mensaje: "Categorías obtenidas correctamente",
      categorias: (categorias as any[]).map((c) => c.nombre_categoria),
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({
      mensaje: "Error al obtener categorías",
      error: error,
    });
  }
};
