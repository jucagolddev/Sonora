-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-02-2026 a las 12:45:26
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
  `id_autor` int(11) NOT NULL,
  `nombre_artistico` varchar(100) NOT NULL,
  `id_usuario_fk` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `autor`
--

INSERT INTO `autor` (`id_autor`, `nombre_artistico`, `id_usuario_fk`) VALUES
(1, 'testuser_2026', 1),
(2, 'Antigravity', 1),
(3, 'JUCA', 1),
(4, 'Juanfran', 1),
(5, 'Hugo', 1),
(6, 'juca', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `canciones`
--

CREATE TABLE `canciones` (
  `id_cancion` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `id_autor_fk` int(11) NOT NULL,
  `url_audio` varchar(255) NOT NULL,
  `fecha_catalogo` datetime DEFAULT current_timestamp(),
  `reproducciones` int(11) DEFAULT 0,
  `descargas` int(11) DEFAULT 0,
  `id_licencia_fk` int(11) DEFAULT 1,
  `duracion` varchar(20) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `formato` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `canciones`
--

INSERT INTO `canciones` (`id_cancion`, `titulo`, `id_autor_fk`, `url_audio`, `fecha_catalogo`, `reproducciones`, `descargas`, `id_licencia_fk`, `duracion`, `categoria`, `formato`) VALUES
(7, 'PAJARO 1', 3, '/archivos/1768903988734.mp3', '2026-01-20 11:13:08', 0, 0, 1, NULL, 'Naturaleza', NULL),
(8, 'Pajaro 2', 3, '/archivos/1768905282120.mp3', '2026-01-20 11:34:42', 0, 0, 1, NULL, 'Naturaleza', NULL),
(9, 'puerta coche', 4, '/archivos/1768905327602.mp3', '2026-01-20 11:35:27', 0, 0, 1, NULL, 'Coche', NULL),
(10, 'Motor arrancando', 5, '/archivos/1768905359922.mp3', '2026-01-20 11:35:59', 0, 0, 1, NULL, 'Motor', NULL),
(11, 'moto', 6, '/archivos/1770202800789.mp3', '2026-02-04 12:00:00', 0, 0, 1, NULL, 'Moto', NULL),
(12, 'Musica ambiente', 6, '/archivos/1770203117343.mp3', '2026-02-04 12:05:17', 0, 0, 1, NULL, 'Ambiente', NULL),
(13, 'Musica de fondo', 6, '/archivos/1770203153110.mp3', '2026-02-04 12:05:53', 0, 0, 1, NULL, 'Ambiente', NULL),
(14, 'perro', 6, '/archivos/1770203322928.mp3', '2026-02-04 12:08:42', 0, 0, 1, NULL, 'Animales', NULL),
(15, 'gato', 6, '/archivos/1770203342096.mp3', '2026-02-04 12:09:02', 0, 0, 1, NULL, 'Animales', NULL),
(16, 'proyector', 6, '/archivos/1770203866623.mp3', '2026-02-04 12:17:46', 0, 0, 1, NULL, 'Cine', NULL),
(17, 'boom cine', 6, '/archivos/1770204084985.mp3', '2026-02-04 12:21:24', 0, 0, 1, NULL, 'Cine', NULL),
(18, 'musca de fondo ciudad', 6, '/archivos/1770204234328.mp3', '2026-02-04 12:23:54', 0, 0, 1, NULL, 'Musica', NULL),
(19, 'whaterfone instrumento', 6, '/archivos/1770204275297.mp3', '2026-02-04 12:24:35', 0, 0, 1, NULL, 'Instrumento', NULL),
(20, 'desprendimiento', 6, '/archivos/1770204314672.mp3', '2026-02-04 12:25:14', 0, 0, 1, NULL, 'Tierra', NULL),
(21, 'electronica', 6, '/archivos/1770204353440.mp3', '2026-02-04 12:25:53', 0, 0, 1, NULL, 'Electronica', NULL),
(22, 'ciborg', 6, '/archivos/1770204383512.mp3', '2026-02-04 12:26:23', 0, 0, 1, NULL, 'Tecnologia', NULL),
(23, 'running', 6, '/archivos/1770204446375.mp3', '2026-02-04 12:27:26', 0, 0, 1, NULL, 'Deportes', NULL),
(24, 'pasos', 6, '/archivos/1770204461967.mp3', '2026-02-04 12:27:41', 0, 0, 1, NULL, 'Foley', NULL),
(25, 'llamas', 6, '/archivos/1770204530552.mp3', '2026-02-04 12:28:50', 0, 0, 1, NULL, 'Fuego', NULL),
(26, 'hombre gritando', 6, '/archivos/1770204656921.mp3', '2026-02-04 12:30:56', 0, 0, 1, NULL, 'Grito', NULL),
(27, 'lofi sound', 6, '/archivos/1770204727017.mp3', '2026-02-04 12:32:07', 0, 0, 1, NULL, 'Lo-Fi', NULL),
(28, 'sonido de magia', 6, '/archivos/1770204751472.mp3', '2026-02-04 12:32:31', 0, 0, 1, NULL, 'Magia', NULL),
(29, 'victoria', 6, '/archivos/1770204774385.mp3', '2026-02-04 12:32:54', 0, 0, 1, NULL, 'Juegos', NULL),
(30, 'notificacion 334', 6, '/archivos/1770204835121.mp3', '2026-02-04 12:33:55', 0, 0, 1, NULL, 'Notificacion', NULL),
(31, 'orquesta', 6, '/archivos/1770204858970.mp3', '2026-02-04 12:34:18', 0, 0, 1, NULL, 'Orquesta', NULL),
(32, 'epic transition', 6, '/archivos/1770204975833.mp3', '2026-02-04 12:36:15', 0, 0, 1, NULL, 'Transicion', NULL),
(33, 'urban clap', 6, '/archivos/1770204997394.mp3', '2026-02-04 12:36:37', 0, 0, 1, NULL, 'Urbano', NULL),
(34, 'lluvia', 6, '/archivos/1770205038833.mp3', '2026-02-04 12:37:18', 0, 0, 1, NULL, 'Agua', NULL),
(35, 'percusion', 6, '/archivos/1770205060905.mp3', '2026-02-04 12:37:40', 0, 0, 1, NULL, 'Percusion', NULL),
(36, 'tiros', 6, '/archivos/1770205161097.mp3', '2026-02-04 12:39:21', 0, 0, 1, NULL, 'Combate', NULL),
(37, 'relajo', 6, '/archivos/1770205377627.mp3', '2026-02-04 12:42:57', 0, 0, 1, NULL, 'Relajacion', NULL),
(38, 'ret', 6, '/archivos/1770205400043.mp3', '2026-02-04 12:43:20', 0, 0, 1, NULL, 'Retro', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL,
  `nombre_categoria` varchar(50) NOT NULL
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
(10, 'Moto'),
(21, 'Animales'),
(22, 'Ambiente'),
(23, 'Cine'),
(24, 'Deportes'),
(25, 'Electronica'),
(26, 'Foley'),
(27, 'Humor'),
(28, 'Industrial'),
(29, 'Juegos'),
(30, 'Lo-Fi'),
(31, 'Miedo'),
(32, 'Orquesta'),
(33, 'Percusion'),
(34, 'Relajacion'),
(35, 'Sci-Fi'),
(36, 'Tecnologia'),
(37, 'Urbano'),
(38, 'Voces'),
(39, 'Agua'),
(40, 'Fuego'),
(41, 'Viento'),
(42, 'Tierra'),
(43, 'Aventura'),
(44, 'Combate'),
(45, 'Magia'),
(46, 'Retro'),
(47, 'Minimal');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `licencias`
--

CREATE TABLE `licencias` (
  `id_licencia` int(11) NOT NULL,
  `nombre_licencia` varchar(50) NOT NULL
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
  `id_usuario` int(11) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `ultima_sesion` datetime DEFAULT NULL,
  `es_administrador` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre_usuario`, `email`, `password_hash`, `fecha_registro`, `ultima_sesion`, `es_administrador`) VALUES
(1, 'testuser_2026 Test', 'testuser_2026@example.com', '$2b$10$KuFy.qmN5Q0v0Lv/we2oKeDGc9pC4GHKVh2w97RC6RcLbURjXv7KG', '2026-01-20 09:59:10', '2026-01-20 10:01:02', 0),
(2, 'DebugUser_1770202632438', 'debug_1770202632438@example.com', '$2b$10$jkPCmg/9zYN0Oblb8HeFDu32YNoZJKOt9943EpdwBlenVVhwMoUZK', '2026-02-04 11:57:12', NULL, 0),
(3, 'Juan  Dorado ', 'jucagolddev@gmail.com', '$2b$10$n3NKfoY5yR3OWShvkHfer.IHDtbXL0kOJEtsb/rn5HNaffVCYQpmS', '2026-02-04 11:59:21', NULL, 0);

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
  MODIFY `id_autor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `canciones`
--
ALTER TABLE `canciones`
  MODIFY `id_cancion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT de la tabla `licencias`
--
ALTER TABLE `licencias`
  MODIFY `id_licencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
