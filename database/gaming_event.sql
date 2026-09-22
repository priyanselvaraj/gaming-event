-- Gaming Event Platform Database Schema
-- Note: with spring.jpa.hibernate.ddl-auto=update, Hibernate will create these
-- tables automatically on first run. This script is provided for manual setup
-- or reference, and includes sample seed data.

CREATE DATABASE IF NOT EXISTS gaming;
USE gaming;

-- ---------------------------------------------------------
-- Users
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,   -- BCrypt hash
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- Events
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(2000),
    game VARCHAR(100) NOT NULL,
    event_date DATETIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    seats_booked INT NOT NULL DEFAULT 0,
    price DOUBLE NOT NULL DEFAULT 0,
    image_url VARCHAR(500)
);

-- ---------------------------------------------------------
-- Bookings
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    seats_booked INT NOT NULL,
    total_price DOUBLE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
    booked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------
-- Seed data
-- ---------------------------------------------------------
INSERT INTO events (title, description, game, event_date, venue, capacity, seats_booked, price, image_url) VALUES
('Valorant Champions LAN', 'Regional LAN finals featuring the top 8 Valorant teams.', 'Valorant', '2026-09-12 18:00:00', 'City Esports Arena', 200, 0, 25.00, 'https://images.unsplash.com/photo-1542751371-adc38448a05e'),
('FIFA 26 Community Cup', 'Open bracket FIFA tournament, all skill levels welcome.', 'FIFA 26', '2026-09-20 14:00:00', 'Downtown Gaming Lounge', 64, 0, 10.00, 'https://images.unsplash.com/photo-1552667466-07770ae110d0'),
('CS2 Weekly Showdown', 'Weekly 5v5 Counter-Strike 2 competitive night.', 'Counter-Strike 2', '2026-09-05 19:00:00', 'The Bunker LAN Center', 40, 0, 5.00, 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc');
