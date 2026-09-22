-- =============================================================================
-- GAMING EVENT TICKETING AND REGISTRATION PLATFORM - DATABASE SCHEMA
-- Target Database Engine: MySQL 8.0+ / MariaDB 10.5+
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `gaming`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `gaming`;

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS `roles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(30) NOT NULL UNIQUE,
    `description` VARCHAR(255),
    INDEX `idx_roles_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(100) NOT NULL,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `phone_number` VARCHAR(20),
    `password` VARCHAR(255) NOT NULL,
    `role_id` BIGINT NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT,
    INDEX `idx_users_username` (`username`),
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Gaming Categories Table
CREATE TABLE IF NOT EXISTS `gaming_categories` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `description` VARCHAR(500),
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_categories_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Events Table
CREATE TABLE IF NOT EXISTS `events` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `event_name` VARCHAR(150) NOT NULL,
    `description` TEXT,
    `game_name` VARCHAR(100) NOT NULL,
    `category_id` BIGINT NOT NULL,
    `event_type` VARCHAR(20) NOT NULL,
    `event_date` DATE NOT NULL,
    `start_time` TIME NOT NULL,
    `end_time` TIME,
    `location` VARCHAR(255),
    `online_event_link` VARCHAR(500),
    `maximum_capacity` INT NOT NULL,
    `current_capacity` INT NOT NULL DEFAULT 0,
    `event_banner_url` VARCHAR(500),
    `organizer_id` BIGINT NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_events_category` FOREIGN KEY (`category_id`) REFERENCES `gaming_categories` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_events_organizer` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_events_status` (`status`),
    INDEX `idx_events_date` (`event_date`),
    INDEX `idx_events_game` (`game_name`),
    INDEX `idx_events_organizer` (`organizer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tournaments Table
CREATE TABLE IF NOT EXISTS `tournaments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `tournament_name` VARCHAR(150) NOT NULL,
    `description` TEXT,
    `game_name` VARCHAR(100) NOT NULL,
    `event_id` BIGINT NOT NULL,
    `max_participants` INT NOT NULL,
    `current_participants` INT NOT NULL DEFAULT 0,
    `registration_start_date` DATETIME NOT NULL,
    `registration_deadline` DATETIME NOT NULL,
    `entry_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `prize_pool` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `rules` TEXT,
    `status` VARCHAR(25) NOT NULL DEFAULT 'UPCOMING',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_tournaments_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
    INDEX `idx_tournaments_event` (`event_id`),
    INDEX `idx_tournaments_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Ticket Types Table
CREATE TABLE IF NOT EXISTS `ticket_types` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `ticket_name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255),
    `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `quantity_available` INT NOT NULL,
    `quantity_sold` INT NOT NULL DEFAULT 0,
    `event_id` BIGINT NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ticket_types_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
    INDEX `idx_ticket_types_event` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Registrations Table
CREATE TABLE IF NOT EXISTS `registrations` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `gamer_id` BIGINT NOT NULL,
    `event_id` BIGINT NOT NULL,
    `tournament_id` BIGINT NULL,
    `registration_date` DATETIME NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_registrations_gamer` FOREIGN KEY (`gamer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_registrations_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_registrations_tournament` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE SET NULL,
    CONSTRAINT `uq_gamer_event_tournament` UNIQUE (`gamer_id`, `event_id`, `tournament_id`),
    INDEX `idx_registrations_gamer` (`gamer_id`),
    INDEX `idx_registrations_event` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Tickets Table
CREATE TABLE IF NOT EXISTS `tickets` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `ticket_number` VARCHAR(50) NOT NULL UNIQUE,
    `gamer_id` BIGINT NOT NULL,
    `event_id` BIGINT NOT NULL,
    `ticket_type_id` BIGINT NOT NULL,
    `purchase_date` DATETIME NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_tickets_gamer` FOREIGN KEY (`gamer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tickets_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tickets_ticket_type` FOREIGN KEY (`ticket_type_id`) REFERENCES `ticket_types` (`id`) ON DELETE RESTRICT,
    INDEX `idx_tickets_number` (`ticket_number`),
    INDEX `idx_tickets_gamer` (`gamer_id`),
    INDEX `idx_tickets_event` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Payments Table
CREATE TABLE IF NOT EXISTS `payments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `transaction_reference` VARCHAR(100) NOT NULL UNIQUE,
    `user_id` BIGINT NOT NULL,
    `event_id` BIGINT NOT NULL,
    `ticket_id` BIGINT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `payment_method` VARCHAR(20) NOT NULL DEFAULT 'MOCK',
    `payment_status` VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_payments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_payments_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_payments_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE SET NULL,
    INDEX `idx_payments_ref` (`transaction_reference`),
    INDEX `idx_payments_user` (`user_id`),
    INDEX `idx_payments_event` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
