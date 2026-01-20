-- ARQUITECTURA DE SOFTWARE - SONORA V2
-- Script de Creación de Base de Datos
-- -------------------------------------------------------------------
-- Descripción: Script para inicializar la base de datos 'Sonora'.
--              Incluye tablas para Usuarios, Autores, Licencias y Canciones.
--              Diseñado para soportar la lógica del backend existente.

-- 1. Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS Sonora CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Sonora;

-- 2. Tabla: Usuarios
-- Almacena la información de autenticación y perfil básico.
CREATE TABLE IF NOT EXISTS Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del usuario',
    nombre_usuario VARCHAR(50) NOT NULL COMMENT 'Nombre de usuario único para login',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT 'Correo electrónico único',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Contraseña encriptada con Bcrypt',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación de la cuenta',
    ultima_sesion DATETIME DEFAULT NULL COMMENT 'Fecha del último login exitoso',
    es_administrador TINYINT(1) DEFAULT 0 COMMENT '0: Usuario normal, 1: Administrador'
) ENGINE=InnoDB;

-- 3. Tabla: Autor
-- Vincula a un usuario con su perfil de artista.
CREATE TABLE IF NOT EXISTS Autor (
    id_autor INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del autor',
    nombre_artistico VARCHAR(100) NOT NULL COMMENT 'Nombre público del artista',
    id_usuario_fk INT NOT NULL COMMENT 'Referencia al usuario dueño de este perfil',
    CONSTRAINT fk_autor_usuario
        FOREIGN KEY (id_usuario_fk) REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 4. Tabla: Licencias
-- Define los tipos de licencias disponibles para las canciones.
CREATE TABLE IF NOT EXISTS Licencias (
    id_licencia INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de la licencia',
    nombre_licencia VARCHAR(50) NOT NULL COMMENT 'Ej: Estándar, Creative Commons, etc.'
) ENGINE=InnoDB;

-- Insertar licencia por defecto si no existe (ID 1)
-- Esto es crítico porque el código backend asume id_licencia_fk = 1
INSERT INTO Licencias (id_licencia, nombre_licencia)
SELECT 1, 'Licencia Estándar'
WHERE NOT EXISTS (SELECT 1 FROM Licencias WHERE id_licencia = 1);

-- 5. Tabla: Canciones
-- Metadatos de los archivos de audio subidos.
CREATE TABLE IF NOT EXISTS Canciones (
    id_cancion INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de la canción',
    titulo VARCHAR(150) NOT NULL COMMENT 'Título de la canción',
    id_autor_fk INT NOT NULL COMMENT 'Autor de la canción',
    url_audio VARCHAR(255) NOT NULL COMMENT 'Ruta relativa o URL del archivo de audio',
    fecha_catalogo DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de publicación',
    reproducciones INT DEFAULT 0 COMMENT 'Contador de reproducciones',
    descargas INT DEFAULT 0 COMMENT 'Contador de descargas',
    id_licencia_fk INT DEFAULT 1 COMMENT 'Tipo de licencia (FK)',
    duracion VARCHAR(20) DEFAULT NULL COMMENT 'Duración en formato texto (ej: 3:45)',
    categoria VARCHAR(50) DEFAULT NULL COMMENT 'Género o categoría musical',
    formato VARCHAR(10) DEFAULT NULL COMMENT 'Extensión del archivo (mp3, wav)',
    
    CONSTRAINT fk_cancion_autor
        FOREIGN KEY (id_autor_fk) REFERENCES Autor(id_autor)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
        
    CONSTRAINT fk_cancion_licencia
        FOREIGN KEY (id_licencia_fk) REFERENCES Licencias(id_licencia)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Fin del script
