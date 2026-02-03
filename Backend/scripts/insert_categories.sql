-- Script para insertar más de 30 categorías en la base de datos Sonora
USE Sonora;

INSERT INTO categorias (nombre_categoria) VALUES 
('Animales'), ('Ambiente'), ('Cine'), ('Deportes'), 
('Electronica'), ('Foley'), ('Humor'), ('Industrial'), 
('Juegos'), ('Lo-Fi'), ('Miedo'), ('Orquesta'), 
('Percusion'), ('Relajacion'), ('Sci-Fi'), ('Tecnologia'), 
('Urbano'), ('Voces'), ('Agua'), ('Fuego'), 
('Viento'), ('Tierra'), ('Aventura'), ('Combate'), 
('Magia'), ('Retro'), ('Minimal')
ON DUPLICATE KEY UPDATE nombre_categoria=VALUES(nombre_categoria);
