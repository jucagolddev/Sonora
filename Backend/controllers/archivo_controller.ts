/**
 * PROYECTO SONORA - ARQUITECTURA DE SOFTWARE
 * -------------------------------------------------------------------
 * Módulo: Controlador de Archivos (Subidas)
 * Descripción: Este módulo es el encargado de gestionar la recepción y el 
 *              almacenamiento de los archivos multimedia (audio y video) 
 *              que los usuarios comparten en Sonora.
 *              Validamos los formatos y registramos la información necesaria 
 *              en nuestra base de datos para que el catálogo se actualice.
 */

import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import db from "../config/db";

/**
 * Interfaz personalizada para peticiones con archivos
 * -------------------------------------------------------------------
 * Nos permite trabajar de forma tipada con el objeto 'file' que Multer 
 * añade a la petición de Express tras procesar el archivo.
 */
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

/**
 * Configuración de Almacenamiento (Multer)
 * ------------------------------------------------------------------
 * Hemos decidido guardar los archivos físicamente en la carpeta 'archivos/'.
 * Para evitar colisiones de nombres, renombramos cada archivo utilizando
 * la marca de tiempo actual (timestamp) manteniendo su extensión original.
 */
const storage = multer.diskStorage({
  destination: "archivos/", // Carpeta de destino en nuestro servidor
  filename: (req: any, file: any, cb: any) => {
    // Generamos un nombre único: ejemplo 1712345678.mp3
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

/**
 * Filtro de Seguridad de Archivos
 * ------------------------------------------------------------------
 * Como medida de seguridad, solo permitimos que nuestra aplicación acepte
 * archivos de audio y video específicos.
 */
const fileFilter = (req: any, file: any, cb: any) => {
  // Expresión regular con las extensiones que nosotros autorizamos
  const allowedTypes = /mp3|mpeg|mp4|wav|ogg/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Error: El formato de archivo no es compatible. Por favor, sube audio o video (mp3, mp4, wav, ogg).",
      ),
    );
  }
};

// Configuramos la instancia de Multer para gestionar subidas individuales
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("archivo"); // El campo del formulario debe llamarse 'archivo'

/**
 * Endpoint de Subida y Registro
 * ------------------------------------------------------------------
 * En esta función coordinamos dos grandes tareas:
 * 1. La subida física del archivo mediante la lógica de Multer.
 * 2. El registro de los metadatos y la vinculación con el autor en MySQL.
 */
export const subirArchivo = (req: Request, res: Response) => {
  // Procesamos la subida
  upload(req, res, async (err: any) => {
    // Si Multer devuelve un error (ej. formato no válido)
    if (err) {
      console.error("Error en nuestra gestión de subida:", err);
      return res.status(500).json({
        mensaje: "No hemos podido procesar la subida del archivo físico.",
        detalle: err.message,
      });
    }

    const reqFiles = req as MulterRequest;
    if (!reqFiles.file) {
      return res.status(400).json({ mensaje: "No hemos recibido ningún archivo válido." });
    }

    // Extraemos la información del cuerpo de la petición y del archivo procesado
    const { titulo, autor, id_usuario_fk, categoria } = req.body;
    const { filename } = reqFiles.file;
    const url_audio = `/archivos/${filename}`; // Generamos la URL relativa para el frontend

    // Validamos que nosotros tengamos los datos mínimos obligatorios
    if (!titulo || !autor || !id_usuario_fk) {
      return res.status(400).json({
        mensaje: "Datos insuficientes: faltan título, autor o identificación de usuario.",
      });
    }

    try {
      /**
       * GESTIÓN DE AUTOR Y CANCIÓN EN LA BD
       * --------------------------------------------------------------
       * Primero buscamos si el autor ya existe para este usuario, 
       * si no, lo creamos dinámicamente.
       */
      let [autorDb]: any = await db.query(
        "SELECT id_autor FROM autor WHERE nombre_artistico = ? AND id_usuario_fk = ?",
        [autor, id_usuario_fk],
      );

      let id_autor_final;

      if (autorDb && autorDb.length > 0) {
        id_autor_final = autorDb[0].id_autor;
      } else {
        // Creamos la entrada para el nuevo autor
        const [nuevoAutor]: any = await db.query(
          "INSERT INTO autor (nombre_artistico, id_usuario_fk) VALUES (?, ?)",
          [autor, id_usuario_fk],
        );
        id_autor_final = nuevoAutor.insertId;
      }

      // Finalmente, registramos la canción en nuestra colección principal
      const categoriaFinal = categoria || null;

      const sqlCancion = `
                INSERT INTO canciones 
                (titulo, id_autor_fk, url_audio, fecha_catalogo, reproducciones, descargas, id_licencia_fk, categoria) 
                VALUES (?, ?, ?, NOW(), 0, 0, 1, ?)
            `;

      await db.query(sqlCancion, [
        titulo,
        id_autor_final,
        url_audio,
        categoriaFinal,
      ]);

      // Notificamos al frontend que todo ha salido bien
      res.status(200).json({
        mensaje: "¡Excelente! Hemos subido tu archivo y ya está disponible en el catálogo de Sonora.",
      });
    } catch (error: any) {
      console.error("Error en nuestra base de datos al subir:", error);
      res.status(500).json({
        mensaje: "Hemos tenido un problema al guardar la información del sonido.",
        detalle: error.message,
      });
    }
  });
};

