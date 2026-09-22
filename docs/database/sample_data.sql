-- =============================================================================
-- GAMING EVENT TICKETING AND REGISTRATION PLATFORM - SEED & SAMPLE DATA
-- =============================================================================

USE `gaming`;

-- 1. Seed Roles
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'ROLE_ADMIN', 'System Administrator with platform-wide governance permissions'),
(2, 'ROLE_ORGANIZER', 'Event Organizer with event, tournament, and ticketing management permissions'),
(3, 'ROLE_GAMER', 'Platform Gamer with discovery, registration, and ticketing purchase permissions')
ON DUPLICATE KEY UPDATE `description` = VALUES(`description`);

-- 2. Seed Gaming Categories
INSERT INTO `gaming_categories` (`id`, `name`, `description`) VALUES
(1, 'FPS', 'First-Person Shooter games (Valorant, CS2, Overwatch 2, Apex Legends)'),
(2, 'Battle Royale', 'Battle Royale survival matches (Fortnite, PUBG, Warzone)'),
(3, 'MOBA', 'Multiplayer Online Battle Arena (League of Legends, Dota 2)'),
(4, 'Fighting', 'Competitive Fighting Games (Street Fighter 6, Tekken 8, Smash Bros)'),
(5, 'Racing', 'Sim & Arcade Racing Games (Forza Horizon, F1 24, Gran Turismo)'),
(6, 'Sports', 'Competitive Sports titles (EA FC 25, NBA 2K25, Rocket League)'),
(7, 'Strategy', 'Real-Time and Turn-Based Strategy (StarCraft II, Age of Empires, Chess)'),
(8, 'RPG', 'Role-Playing Game speedruns and community showcases'),
(9, 'Mobile Gaming', 'Mobile Esports (BGMI, Free Fire, Mobile Legends, COD Mobile)')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 3. Seed Initial Default Users
-- Default Passwords: Admin@123 / Organizer@123 / Gamer@123 (BCrypt encrypted: $2a$10$7R04Dqj2gJ6j1x6h4K.3vODbIqvQ9F.jRzD5g6s8Y1Ue0u7t4c7qK)
INSERT INTO `users` (`id`, `full_name`, `username`, `email`, `phone_number`, `password`, `role_id`, `status`) VALUES
(1, 'System Administrator', 'admin', 'admin@gamingplatform.com', '+1-555-0100', '$2a$10$7R04Dqj2gJ6j1x6h4K.3vODbIqvQ9F.jRzD5g6s8Y1Ue0u7t4c7qK', 1, 'ACTIVE'),
(2, 'Apex Esports Org', 'apex_organizer', 'organizer@apexevents.com', '+1-555-0200', '$2a$10$7R04Dqj2gJ6j1x6h4K.3vODbIqvQ9F.jRzD5g6s8Y1Ue0u7t4c7qK', 2, 'ACTIVE'),
(3, 'CyberNova Tournaments', 'cyber_nova', 'contact@cybernova.gg', '+1-555-0201', '$2a$10$7R04Dqj2gJ6j1x6h4K.3vODbIqvQ9F.jRzD5g6s8Y1Ue0u7t4c7qK', 2, 'ACTIVE'),
(4, 'Alex Mercer (Gamer)', 'shadow_ninja', 'alex@gamerhub.io', '+1-555-0300', '$2a$10$7R04Dqj2gJ6j1x6h4K.3vODbIqvQ9F.jRzD5g6s8Y1Ue0u7t4c7qK', 3, 'ACTIVE'),
(5, 'Samantha Ray', 'pixel_queen', 'sam@gamerhub.io', '+1-555-0301', '$2a$10$7R04Dqj2gJ6j1x6h4K.3vODbIqvQ9F.jRzD5g6s8Y1Ue0u7t4c7qK', 3, 'ACTIVE')
ON DUPLICATE KEY UPDATE `username` = VALUES(`username`);

-- 4. Seed Sample Events
INSERT INTO `events` (`id`, `event_name`, `description`, `game_name`, `category_id`, `event_type`, `event_date`, `start_time`, `end_time`, `location`, `online_event_link`, `maximum_capacity`, `current_capacity`, `event_banner_url`, `organizer_id`, `status`) VALUES
(1, 'Valorant Champions Arena 2026', 'Premier 5v5 tactical shooter championship with regional teams competing for national glory.', 'Valorant', 1, 'HYBRID', '2026-10-15', '10:00:00', '20:00:00', 'Metro Esports Arena, Hall 4, Seattle WA', 'https://twitch.tv/valorant_champions_2026', 500, 2, 'https://images.unsplash.com/photo-1542751371-adc38448a05e', 2, 'APPROVED'),
(2, 'Apex Legends Global LAN Clash', 'Trios battle royale showcase featuring high-octane drops, custom lobbies, and community casters.', 'Apex Legends', 2, 'OFFLINE', '2026-11-05', '11:00:00', '19:00:00', 'Convention Center East Wing, Austin TX', NULL, 300, 1, 'https://images.unsplash.com/photo-1511512578047-dfb367046420', 2, 'APPROVED'),
(3, 'League of Legends Collegiate Scrims', 'Inter-collegiate summoners rift championship broadcast live with student shoutcasters.', 'League of Legends', 3, 'ONLINE', '2026-11-20', '14:00:00', '22:00:00', NULL, 'https://discord.gg/collegiate-league-2026', 256, 0, 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc', 3, 'PENDING')
ON DUPLICATE KEY UPDATE `event_name` = VALUES(`event_name`);

-- 5. Seed Tournaments
INSERT INTO `tournaments` (`id`, `tournament_name`, `description`, `game_name`, `event_id`, `max_participants`, `current_participants`, `registration_start_date`, `registration_deadline`, `entry_fee`, `prize_pool`, `rules`, `status`) VALUES
(1, 'Valorant 5v5 Tactical Championship', 'Single elimination bracket tournament. All standard VCT competitive rule sets apply.', 'Valorant', 1, 32, 2, '2026-09-01 00:00:00', '2026-10-10 23:59:59', 25.00, 5000.00, 'All players must be rank Diamond 1+. Teams must submit rosters 48 hours in advance.', 'REGISTRATION_OPEN'),
(2, 'Apex Trios Sudden Death Showdown', '6-round point-based custom lobby tournament.', 'Apex Legends', 2, 20, 1, '2026-09-15 00:00:00', '2026-11-01 23:59:59', 15.00, 2500.00, 'Official ALGS scoring system. No account sharing.', 'REGISTRATION_OPEN')
ON DUPLICATE KEY UPDATE `tournament_name` = VALUES(`tournament_name`);

-- 6. Seed Ticket Types
INSERT INTO `ticket_types` (`id`, `ticket_name`, `description`, `price`, `quantity_available`, `quantity_sold`, `event_id`, `status`) VALUES
(1, 'General Admission', 'Standard floor access to tournament viewing and community gaming booths', 15.00, 350, 2, 1, 'ACTIVE'),
(2, 'VIP Player Pass', 'Front-row stage seating, priority signing queue, exclusive player badge and goodie bag', 50.00, 50, 1, 1, 'ACTIVE'),
(3, 'Early Bird Attendee', 'Discounted early pass for offline LAN tournament access', 10.00, 100, 1, 2, 'ACTIVE')
ON DUPLICATE KEY UPDATE `ticket_name` = VALUES(`ticket_name`);

-- 7. Seed Registrations
INSERT INTO `registrations` (`id`, `gamer_id`, `event_id`, `tournament_id`, `registration_date`, `status`) VALUES
(1, 4, 1, 1, '2026-09-01 12:00:00', 'CONFIRMED'),
(2, 5, 1, NULL, '2026-09-01 14:30:00', 'CONFIRMED')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

-- 8. Seed Tickets
INSERT INTO `tickets` (`id`, `ticket_number`, `gamer_id`, `event_id`, `ticket_type_id`, `purchase_date`, `status`) VALUES
(1, 'GAME-2026-VAL001', 4, 1, 2, '2026-09-01 12:00:00', 'ACTIVE'),
(2, 'GAME-2026-VAL002', 5, 1, 1, '2026-09-01 14:30:00', 'ACTIVE')
ON DUPLICATE KEY UPDATE `ticket_number` = VALUES(`ticket_number`);

-- 9. Seed Payments
INSERT INTO `payments` (`id`, `transaction_reference`, `user_id`, `event_id`, `ticket_id`, `amount`, `payment_method`, `payment_status`) VALUES
(1, 'TXN-MOCK-20260901-0001', 4, 1, 1, 50.00, 'MOCK', 'SUCCESS'),
(2, 'TXN-MOCK-20260901-0002', 5, 1, 2, 15.00, 'CARD', 'SUCCESS')
ON DUPLICATE KEY UPDATE `transaction_reference` = VALUES(`transaction_reference`);
