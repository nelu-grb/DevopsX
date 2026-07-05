CREATE DATABASE IF NOT EXISTS videojuegos_db;
USE videojuegos_db;

CREATE TABLE IF NOT EXISTS videojuegos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  plataforma VARCHAR(100) NOT NULL,
  estado VARCHAR(50) NOT NULL
);

-- Inserción de datos iniciales (Seeding)
INSERT INTO videojuegos (titulo, plataforma, estado) VALUES
  ('Valorant', 'Riot Games', 'Jugando'),
  ('Cyberpunk 2077', 'Steam', 'Pendiente'),
  ('Assassin''s Creed Valhalla', 'Ubisoft', 'Completado'),
  ('Call of Duty: Warzone', 'Activision', 'Jugando'),
  ('Clash Royale', 'Supercell', 'Jugando'),
  ('Adopt Me!', 'Roblox', 'Pendiente'),
  ('Fortnite', 'Epic Games', 'Jugando'),
  ('Elden Ring', 'Steam', 'Completado');