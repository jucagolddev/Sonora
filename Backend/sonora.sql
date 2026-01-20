-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-01-2026 a las 11:38:54
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sonora`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `autor`
--

CREATE TABLE `autor` (
  `id_autor` int(11) NOT NULL COMMENT 'Identificador único del autor',
  `nombre_artistico` varchar(100) NOT NULL COMMENT 'Nombre público del artista',
  `id_usuario_fk` int(11) NOT NULL COMMENT 'Referencia al usuario dueño de este perfil'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `autor`
--

INSERT INTO `autor` (`id_autor`, `nombre_artistico`, `id_usuario_fk`) VALUES
(1, 'testuser_2026', 1),
(2, 'Antigravity', 1),
(3, 'JUCA', 1),
(4, 'Juanfran', 1),
(5, 'Hugo', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `canciones`
--

CREATE TABLE `canciones` (
  `id_cancion` int(11) NOT NULL COMMENT 'Identificador único de la canción',
  `titulo` varchar(150) NOT NULL COMMENT 'Título de la canción',
  `id_autor_fk` int(11) NOT NULL COMMENT 'Autor de la canción',
  `url_audio` varchar(255) NOT NULL COMMENT 'Ruta relativa o URL del archivo de audio',
  `fecha_catalogo` datetime DEFAULT current_timestamp() COMMENT 'Fecha de publicación',
  `reproducciones` int(11) DEFAULT 0 COMMENT 'Contador de reproducciones',
  `descargas` int(11) DEFAULT 0 COMMENT 'Contador de descargas',
  `id_licencia_fk` int(11) DEFAULT 1 COMMENT 'Tipo de licencia (FK)',
  `duracion` varchar(20) DEFAULT NULL COMMENT 'Duración en formato texto (ej: 3:45)',
  `categoria` varchar(50) DEFAULT NULL COMMENT 'Género o categoría musical',
  `formato` varchar(10) DEFAULT NULL COMMENT 'Extensión del archivo (mp3, wav)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `canciones`
--

INSERT INTO `canciones` (`id_cancion`, `titulo`, `id_autor_fk`, `url_audio`, `fecha_catalogo`, `reproducciones`, `descargas`, `id_licencia_fk`, `duracion`, `categoria`, `formato`) VALUES
(7, 'PAJARO 1', 3, '/archivos/1768903988734.mp3', '2026-01-20 11:13:08', 0, 0, 1, NULL, 'Naturaleza', NULL),
(8, 'Pajaro 2', 3, '/archivos/1768905282120.mp3', '2026-01-20 11:34:42', 0, 0, 1, NULL, 'Naturaleza', NULL),
(9, 'puerta coche', 4, '/archivos/1768905327602.mp3', '2026-01-20 11:35:27', 0, 0, 1, NULL, 'Coche', NULL),
(10, 'Motor arrancando', 5, '/archivos/1768905359922.mp3', '2026-01-20 11:35:59', 0, 0, 1, NULL, 'Motor', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL COMMENT 'Identificador único de la categoría',
  `nombre_categoria` varchar(50) NOT NULL COMMENT 'Nombre de la categoría'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre_categoria`) VALUES
(1, 'Naturaleza'),
(2, 'Instrumento'),
(3, 'Grito'),
(4, 'Musica'),
(5, 'Efectos'),
(6, 'Notificacion'),
(7, 'Transicion'),
(8, 'Silbido'),
(9, 'Coche'),
(10, 'Moto');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `canciones`
--

CREATE TABLE `canciones` (
  `id_cancion` int(11) NOT NULL COMMENT 'Identificador único de la canción',
  `titulo` varchar(150) NOT NULL COMMENT 'Título de la canción',
  `id_autor_fk` int(11) NOT NULL COMMENT 'Autor de la canción',
  `url_audio` varchar(255) NOT NULL COMMENT 'Ruta relativa o URL del archivo de audio',
  `fecha_catalogo` datetime DEFAULT current_timestamp() COMMENT 'Fecha de publicación',
  `reproducciones` int(11) DEFAULT 0 COMMENT 'Contador de reproducciones',
  `descargas` int(11) DEFAULT 0 COMMENT 'Contador de descargas',
  `id_licencia_fk` int(11) DEFAULT 1 COMMENT 'Tipo de licencia (FK)',
  `duracion` varchar(20) DEFAULT NULL COMMENT 'Duración en formato texto (ej: 3:45)',
  `categoria` varchar(50) DEFAULT NULL COMMENT 'Género o categoría musical',
  `formato` varchar(10) DEFAULT NULL COMMENT 'Extensión del archivo (mp3, wav)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `licencias`
--

INSERT INTO `licencias` (`id_licencia`, `nombre_licencia`) VALUES
(1, 'Licencia Estándar');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL COMMENT 'Identificador único del usuario',
  `nombre_usuario` varchar(50) NOT NULL COMMENT 'Nombre de usuario único para login',
  `email` varchar(100) NOT NULL COMMENT 'Correo electrónico único',
  `password_hash` varchar(255) NOT NULL COMMENT 'Contraseña encriptada con Bcrypt',
  `fecha_registro` datetime DEFAULT current_timestamp() COMMENT 'Fecha de creación de la cuenta',
  `ultima_sesion` datetime DEFAULT NULL COMMENT 'Fecha del último login exitoso',
  `es_administrador` tinyint(1) DEFAULT 0 COMMENT '0: Usuario normal, 1: Administrador'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre_usuario`, `email`, `password_hash`, `fecha_registro`, `ultima_sesion`, `es_administrador`) VALUES
(1, 'testuser_2026 Test', 'testuser_2026@example.com', '$2b$10$KuFy.qmN5Q0v0Lv/we2oKeDGc9pC4GHKVh2w97RC6RcLbURjXv7KG', '2026-01-20 09:59:10', '2026-01-20 10:01:02', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `autor`
--
ALTER TABLE `autor`
  ADD PRIMARY KEY (`id_autor`),
  ADD KEY `fk_autor_usuario` (`id_usuario_fk`);

--
-- Indices de la tabla `canciones`
--
ALTER TABLE `canciones`
  ADD PRIMARY KEY (`id_cancion`),
  ADD KEY `fk_cancion_autor` (`id_autor_fk`),
  ADD KEY `fk_cancion_licencia` (`id_licencia_fk`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `licencias`
--
ALTER TABLE `licencias`
  ADD PRIMARY KEY (`id_licencia`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `autor`
--
ALTER TABLE `autor`
  MODIFY `id_autor` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del autor', AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `canciones`
--
ALTER TABLE `canciones`
  MODIFY `id_cancion` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la canción', AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la categoría', AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `licencias`
--
ALTER TABLE `licencias`
  MODIFY `id_licencia` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la licencia', AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del usuario', AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `autor`
--
ALTER TABLE `autor`
  ADD CONSTRAINT `fk_autor_usuario` FOREIGN KEY (`id_usuario_fk`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `canciones`
--
ALTER TABLE `canciones`
  ADD CONSTRAINT `fk_cancion_autor` FOREIGN KEY (`id_autor_fk`) REFERENCES `autor` (`id_autor`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cancion_licencia` FOREIGN KEY (`id_licencia_fk`) REFERENCES `licencias` (`id_licencia`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
