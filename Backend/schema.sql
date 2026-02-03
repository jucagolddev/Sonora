-- ARQUITECTURA DE SOFTWARE - SONORA V2
-- Script de Creación de Base de Datos Consolidado
-- -------------------------------------------------------------------
-- Descripción: Inicializa la base de datos 'Sonora'.
--              Incluye tablas para Usuarios, Autores, Licencias, Categorías y Canciones.

-- 1. Creación de la base de datos
CREATE DATABASE IF NOT EXISTS Sonora CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Sonora;

-- 2. Tabla: Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del usuario',
    nombre_usuario VARCHAR(50) NOT NULL COMMENT 'Nombre de usuario único para login',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT 'Correo electrónico único',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Contraseña encriptada con Bcrypt',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación de la cuenta',
    ultima_sesion DATETIME DEFAULT NULL COMMENT 'Fecha del último login exitoso',
    es_administrador TINYINT(1) DEFAULT 0 COMMENT '0: Usuario normal, 1: Administrador'
) ENGINE=InnoDB;

-- 3. Tabla: Autor
CREATE TABLE IF NOT EXISTS autor (
    id_autor INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del autor',
    nombre_artistico VARCHAR(100) NOT NULL COMMENT 'Nombre público del artista',
    id_usuario_fk INT NOT NULL COMMENT 'Referencia al usuario dueño de este perfil',
    CONSTRAINT fk_autor_usuario
        FOREIGN KEY (id_usuario_fk) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 4. Tabla: Licencias
CREATE TABLE IF NOT EXISTS licencias (
    id_licencia INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de la licencia',
    nombre_licencia VARCHAR(50) NOT NULL COMMENT 'Ej: Estándar, Creative Commons, etc.'
) ENGINE=InnoDB;

-- Insertar licencia por defecto
INSERT INTO licencias (id_licencia, nombre_licencia)
SELECT 1, 'Licencia Estándar'
WHERE NOT EXISTS (SELECT 1 FROM licencias WHERE id_licencia = 1);

-- 5. Tabla: Categorias
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de la categoría',
    nombre_categoria VARCHAR(50) NOT NULL COMMENT 'Nombre de la categoría'
) ENGINE=InnoDB;

-- Insertar categorías base
INSERT INTO categorias (nombre_categoria) VALUES 
('Naturaleza'), ('Instrumento'), ('Grito'), ('Musica'), 
('Efectos'), ('Notificacion'), ('Transicion'), ('Silbido'), 
('Coche'), ('Moto'), ('Animales'), ('Ambiente'),
('Cine'), ('Deportes'), ('Electronica'), ('Foley'),
('Humor'), ('Industrial'), ('Juegos'), ('Lo-Fi'),
('Miedo'), ('Orquesta'), ('Percusion'), ('Relajacion'),
('Sci-Fi'), ('Tecnologia'), ('Urbano'), ('Voces'),
('Agua'), ('Fuego'), ('Viento'), ('Tierra'),
('Aventura'), ('Combate'), ('Magia'), ('Retro'), ('Minimal')
ON DUPLICATE KEY UPDATE nombre_categoria=VALUES(nombre_categoria);

-- 6. Tabla: Canciones
CREATE TABLE IF NOT EXISTS canciones (
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
        FOREIGN KEY (id_autor_fk) REFERENCES autor(id_autor)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
        
    CONSTRAINT fk_cancion_licencia
        FOREIGN KEY (id_licencia_fk) REFERENCES licencias(id_licencia)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;
