/**
 * ARQUITECTURA DE SOFTWARE - SONORA V2
 * -------------------------------------------------------------------
 * Módulo: Controlador de Archivos
 * Descripción: Gestiona la subida de archivos multimedia (Audio/Video).
 *              Valida tipos de archivo y guarda metadatos en la BD.
 */

import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import db from "../config/db";

/**
 * Interfaz Extendida para Request
 * -------------------------------------------------------------------
 * Permite tipar correctamente el objeto `file` inyectado por Multer.
 */
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

/**
 * Configuración de Multer
 * ------------------------------------------------------------------
 * Define dónde y cómo se guardarán los archivos subidos.
 * - 'destination': Carpeta 'archivos/' en la raíz del backend.
 * - 'filename': Genera un nombre único usando Date.now() + extensión original.
 */
const storage = multer.diskStorage({
  destination: "archivos/",
  filename: (req: any, file: any, cb: any) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filtro de tipos de archivo
const fileFilter = (req: any, file: any, cb: any) => {
  // Tipos MIME permitidos
  const allowedTypes = /mp3|mpeg|mp4|wav|ogg/;

  // Verificación de extensión y tipo MIME
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Error: Tipo de archivo no soportado. Solo se permiten archivos de audio y video (mp3, mp4, wav, ogg).",
      ),
    );
  }
};

// Middleware de subida para un solo archivo con el campo 'archivo'
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("archivo");

/**
 * Controlador: Subir Archivo
 * ------------------------------------------------------------------
 * Endpoint: /api/archivos/subir
 * Método: POST
 *
 * Responsabilidad:
 * 1. Gestionar la subida física del archivo al servidor usando 'multer'.
 * 2. Verificar o crear el 'Autor' asociado a la canción en la BBDD.
 * 3. Registrar los metadatos de la 'Canción' en la tabla correspondiente,
 *    incluyendo la URL local del archivo subido.
 *
 * @param req Objeto Request (incluye req.file y req.body)
 * @param res Objeto Response
 */
export const subirArchivo = (req: Request, res: Response) => {
  upload(req, res, async (err: any) => {
    // Manejo de errores de Multer
    if (err) {
      console.error("[Upload] Error Multer:", err);
      return res
        .status(500)
        .json({
          mensaje: "Error al subir archivo físico al servidor.",
          detalle: err.message,
        });
    }

    const reqFiles = req as MulterRequest;
    if (!reqFiles.file) {
      console.warn("[Upload] No file received");
      return res
        .status(400)
        .json({ mensaje: "No se ha proporcionado ningún archivo." });
    }

    console.log("[Upload] Body recibido:", req.body);
    console.log("[Upload] Archivo recibido:", reqFiles.file);

    // Datos recibidos desde el formulario de Angular
    const { titulo, autor, id_usuario_fk } = req.body;
    const { filename } = reqFiles.file;
    const url_audio = `/archivos/${filename}`; // Ruta relativa para acceso público

    // Validación básica de campos requeridos
    if (!titulo || !autor || !id_usuario_fk) {
      console.error("[Upload] Missing fields:", {
        titulo,
        autor,
        id_usuario_fk,
      });
      return res
        .status(400)
        .json({
          mensaje: "Faltan campos requeridos (titulo, autor, id_usuario_fk).",
        });
    }

    try {
      // TRANSACCIÓN LÓGICA: AUTOR -> CANCIÓN

      // 1. Búsqueda de autor existente
      let [autorDb]: any = await db.query(
        "SELECT id_autor FROM autor WHERE nombre_artistico = ? AND id_usuario_fk = ?",
        [autor, id_usuario_fk],
      );

      let id_autor_final;

      if (autorDb && autorDb.length > 0) {
        // Autor existente
        id_autor_final = autorDb[0].id_autor;
        console.log("[Upload] Autor encontrado ID:", id_autor_final);
      } else {
        // 2. Creación de nuevo autor
        console.log("[Upload] Creando nuevo autor:", autor);
        const [nuevoAutor]: any = await db.query(
          "INSERT INTO autor (nombre_artistico, id_usuario_fk) VALUES (?, ?)",
          [autor, id_usuario_fk],
        );
        id_autor_final = nuevoAutor.insertId;
        console.log("[Upload] Nuevo autor creado ID:", id_autor_final);
      }

      // 3. Inserción de registro de canción
      const categoriaFinal = req.body.categoria || null;

      const sqlCancion = `
                INSERT INTO canciones 
                (titulo, id_autor_fk, url_audio, fecha_catalogo, reproducciones, descargas, id_licencia_fk, categoria) 
                VALUES (?, ?, ?, NOW(), 0, 0, 1, ?)
            `;

      console.log("[Upload] Insertando canción para autor FK:", id_autor_final);

      await db.query(sqlCancion, [
        titulo,
        id_autor_final,
        url_audio,
        categoriaFinal,
      ]);

      console.log("[Upload] Canción registrada exitosamente");
      res.status(200).json({
        mensaje: "Archivo subido y metadatos registrados correctamente.",
      });
    } catch (error: any) {
      console.error("Error en base de datos al subir archivo:", error);
      res.status(500).json({
        mensaje: "Error al guardar información en la base de datos.",
        detalle: error.message,
        sqlError: error.sqlMessage, // Enviar detalle si es posible (en dev)
      });
    }
  });
};
