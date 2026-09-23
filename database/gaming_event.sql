-- Gaming Event Platform Database Schema & Sample Seed Data
-- Database Engine: MySQL 8.0+ / MariaDB 10.5+

CREATE DATABASE IF NOT EXISTS gaming;
USE gaming;

-- ---------------------------------------------------------
-- 1. Users Table
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER'
);

-- ---------------------------------------------------------
-- 2. Events Table
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    game VARCHAR(100) NOT NULL,
    description VARCHAR(2000),
    date VARCHAR(50) NOT NULL,
    time VARCHAR(50) NOT NULL,
    venue VARCHAR(255) NOT NULL,
    ticket_price DOUBLE NOT NULL DEFAULT 0,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL
);

-- ---------------------------------------------------------
-- 3. Bookings Table
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    user_name VARCHAR(255),
    event_name VARCHAR(255),
    tickets INT NOT NULL,
    total_amount DOUBLE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED'
);

-- ---------------------------------------------------------
-- 4. Sample Seed Users
-- ---------------------------------------------------------
INSERT INTO users (id, name, email, password, role) VALUES
(1, 'Admin Director', 'admin@gaming.com', 'admin123', 'ADMIN'),
(2, 'Alex Gamer', 'alex@gaming.com', 'alex123', 'USER'),
(3, 'Sarah Pro', 'sarah@gaming.com', 'sarah123', 'USER'),
(4, 'Vikram Esports', 'vikram@gaming.com', 'vikram123', 'USER'),
(5, 'Marcus Phoenix', 'marcus@gaming.com', 'marcus123', 'USER')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ---------------------------------------------------------
-- 5. Sample Seed Tournaments (8 Events)
-- ---------------------------------------------------------
INSERT INTO events (id, name, game, description, date, time, venue, ticket_price, total_seats, available_seats) VALUES
(1, 'Valorant Champions LAN 2026', 'Valorant', '5v5 Tactical Shooter national championship featuring top esports teams and live crowd finals.', '2026-10-15', '18:00', 'Esports Arena, Hall 1, Mumbai', 499.00, 150, 148),
(2, 'CS2 Masters Premier Tournament', 'Counter-Strike 2', 'Premier CS2 major qualifier with live casting, pro player meetups, and exclusive gaming loot.', '2026-10-22', '17:00', 'CyberHub Gaming Dome, Bangalore', 799.00, 200, 199),
(3, 'EA Sports FC 25 Showdown', 'EA Sports FC 25', 'Fast-paced 1v1 console soccer showdown with dynamic leaderboard brackets and grand trophy.', '2026-11-05', '15:00', 'TechZone Arena, Hyderabad', 299.00, 100, 99),
(4, 'Apex Legends Battle Royale Clash', 'Apex Legends', 'Trios tournament battle across 6 drop matches to determine the Apex Champions.', '2026-11-18', '16:30', 'Nexus Esports Lounge, Delhi NCR', 399.00, 120, 120),
(5, 'BGMI Pro Invitational 2026', 'BGMI', 'High-stakes squad mobile battle royale championship with 24 invited franchised teams.', '2026-11-25', '14:00', 'Shivaji Stadium Dome, Pune', 349.00, 250, 247),
(6, 'Tekken 8 Iron Fist Championship', 'Tekken 8', 'Double-elimination fighting game arena tournament with high-refresh monitors and arcade sticks.', '2026-12-02', '16:00', 'Phoenix Gaming Hub, Chennai', 249.00, 80, 79),
(7, 'Rocket League Super Cup', 'Rocket League', 'High-flying 3v3 vehicular soccer championship with live grand finals and merchandise giveaways.', '2026-12-10', '18:00', 'Metropolis Arena, Kolkata', 199.00, 90, 90),
(8, 'Dota 2 Aegis Champions League', 'Dota 2', 'Intense 5v5 MOBA LAN bracket featuring the country''s most strategic competitive rosters.', '2026-12-18', '17:30', 'Indiranagar LAN Center, Bengaluru', 599.00, 160, 160)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ---------------------------------------------------------
-- 6. Sample Seed Bookings
-- ---------------------------------------------------------
INSERT INTO bookings (id, user_id, event_id, user_name, event_name, tickets, total_amount, status) VALUES
(1, 2, 1, 'Alex Gamer', 'Valorant Champions LAN 2026', 2, 998.00, 'CONFIRMED'),
(2, 3, 2, 'Sarah Pro', 'CS2 Masters Premier Tournament', 1, 799.00, 'CONFIRMED'),
(3, 5, 3, 'Marcus Phoenix', 'EA Sports FC 25 Showdown', 1, 299.00, 'CONFIRMED'),
(4, 4, 5, 'Vikram Esports', 'BGMI Pro Invitational 2026', 3, 1047.00, 'CONFIRMED'),
(5, 2, 6, 'Alex Gamer', 'Tekken 8 Iron Fist Championship', 1, 249.00, 'CONFIRMED')
ON DUPLICATE KEY UPDATE status=VALUES(status);
