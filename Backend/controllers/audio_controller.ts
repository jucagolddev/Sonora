/**
 * PROYECTO SONORA - ARQUITECTURA DE SOFTWARE
 * -------------------------------------------------------------------
 * Módulo: Controlador de Audio (Catálogo de Canciones)
 * Descripción: En este módulo gestionamos la recuperación de los sonidos
 *              y las categorías almacenadas en nuestra base de datos.
 *              Proporcionamos los metadatos necesarios para que el reproductor
 *              de nuestra aplicación frontend funcione correctamente.
 */

import { Request, Response } from "express";
import db from "../config/db";

/**
 * Obtener el Catálogo de Audios
 * -------------------------------------------------------------------
 * Esta función se encarga de consultar nuestra base de datos para obtener
 * el listado de canciones. Hemos incluido la capacidad de filtrar por
 * categoría para facilitar la navegación del usuario.
 */
export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const { categoria } = req.query; // Capturamos el filtro si existe
    
    // Diseñamos una consulta con un JOIN para obtener también el nombre del autor
    let query = `
            SELECT c.*, a.nombre_artistico as autor_nombre 
            FROM canciones c
            LEFT JOIN autor a ON c.id_autor_fk = a.id_autor
        `;
    const params: any[] = [];

    // Si el usuario ha seleccionado una categoría, filtramos los resultados
    if (categoria) {
      query += ` WHERE c.categoria = ?`;
      params.push(categoria);
    }

    // Ejecutamos la consulta en nuestro pool de conexiones
    const [audios] = await db.query(query, params);

    // Devolvemos la lista de sonidos a nuestro frontend
    res.status(200).json({
      mensaje: "Hemos recuperado los sonidos del catálogo correctamente.",
      audios: audios,
    });
  } catch (error) {
    console.error("Error al obtener los audios en nuestro controlador:", error);
    res.status(500).json({
      mensaje: "No hemos podido recuperar la lista de sonidos en este momento.",
      error: error,
    });
  }
};

/**
 * Obtener Listado de Categorías
 * -------------------------------------------------------------------
 * Recupera todas las categorías disponibles en nuestra plataforma para
 * rellenar los filtros y menús de navegación.
 */
export const obtenerCategorias = async (req: Request, res: Response) => {
  try {
    // Consultamos nuestra tabla de categorías ordenada alfabéticamente
    const [categorias] = await db.query(`
      SELECT nombre_categoria FROM categorias ORDER BY nombre_categoria ASC
    `);

    // Transformamos el resultado para enviar un array simple de nombres
    res.status(200).json({
      mensaje: "Hemos obtenido el listado de categorías con éxito.",
      categorias: (categorias as any[]).map((c) => c.nombre_categoria),
    });
  } catch (error) {
    console.error("Error al recuperar las categorías:", error);
    res.status(500).json({
      mensaje: "Ha ocurrido un problema al consultar nuestras categorías.",
      error: error,
    });
  }
};

