# Problem Statement

## 1. Title
**Gaming Event Ticketing and Registration Platform**

## 2. Domain
**Gaming and Esports Event Management**

## 3. Who is the user?
1. **Admin**: System administrators responsible for platform governance, approving or rejecting event submissions, managing user statuses, managing official gaming categories, and analyzing platform-wide metrics.
2. **Event Organizer**: Esports organizations, gaming clubs, colleges, and tournament organizers who host online, offline, or hybrid gaming events, configure tournaments, set up tiered ticket types (Free, General, VIP), and track participant registrations.
3. **Gamer**: Casual players, collegiate gamers, and competitive esports athletes who discover gaming tournaments, view event schedules, register for competitions, purchase tickets, and track registrations/tickets in their personal dashboard.

## 4. What problem are we solving?
Gamers currently struggle with fragmented platforms when discovering local LAN tournaments, collegiate esports events, and online scrims. Registration often involves unstandardized forms (e.g., Google Forms), lack of transparent bracket/capacity updates, lost ticket receipts, and cumbersome payment tracking.

Conversely, event organizers struggle with manual participant verification, duplicate entries, ticket overselling, handling multiple ticketing tiers, and managing draft-to-publishing approval lifecycles.

The **Gaming Event Ticketing and Registration Platform** centralizes discovery, structured approval workflows, registration cap enforcement, ticket issuance with collision-free numbering, and dashboard analytics into a unified, secure system.

## 5. Proposed Solution
A full-stack, enterprise-grade web application built with a **React (Vite + Tailwind CSS)** frontend and a **Spring Boot 3 (Java 17+) REST API** backend backed by a **MySQL** relational database.

Key functional capabilities include:
- **Role-Based Access Control (RBAC)**: Secure JWT authentication for Admins, Organizers, and Gamers.
- **Event Lifecycle & Governance**: Organizers create drafts and submit for review; Admins inspect and approve/reject before public indexing.
- **Tournament Management**: Integrated tournament rules, registration windows, and participant capacity controls.
- **Ticketing & Anti-Overselling**: Real-time quota tracking, tiered pricing, and unique ticket generation (`GAME-2026-XXXXX`).
- **Mock Payment Architecture**: Extensible payment processing pipeline ready for Razorpay/Stripe webhooks.
- **Role-Specific Dashboards**: Real-time analytical counters, revenue metrics, and registration timelines.

## 6. Core Entities / Database Tables
1. `roles` - System role definitions (`ROLE_ADMIN`, `ROLE_ORGANIZER`, `ROLE_GAMER`).
2. `users` - User credentials, contact info, role associations, and lifecycle statuses.
3. `gaming_categories` - Categorization taxonomy (FPS, Battle Royale, MOBA, Fighting, etc.).
4. `events` - Event metadata, schedule, location, banner, capacity, and status.
5. `tournaments` - Competition brackets, rules, deadlines, entry fees, and prize pools.
6. `ticket_types` - Tiered ticket definitions with allocated inventory and pricing.
7. `registrations` - Gamer enrollments in events and tournaments.
8. `tickets` - Issued passes with unique identifiers.
9. `payments` - Transaction ledger tracking status and methods.

## 7. User Roles & Permissions
- **Admin**: Full platform oversight; approve/reject events; deactivate/activate users; manage categories; view platform analytics and revenue.
- **Organizer**: Create/edit events, submit events for review, configure tournaments and ticket types, view registered attendees and ticket buyers for owned events.
- **Gamer**: Search and filter approved events, enroll in tournaments, purchase tickets, cancel eligible registrations, download tickets, manage profile.

## 8. Success Criteria
- [x] Gamers can discover approved events using keyword search and category/type filters in < 200ms.
- [x] System strictly prevents duplicate registrations by the same gamer for the same event/tournament.
- [x] System prevents ticket overselling by verifying inventory constraints before confirming orders.
- [x] Only events approved by an Admin are visible to the public or searchable by gamers.
- [x] Passwords must be securely hashed with BCrypt (10 rounds) and validated against complexity rules.
- [x] Zero plain text secrets in code or repository (strict environment variable configuration).

## 9. Out of Scope (Phase 1 / MVP)
- Real payment gateway API credentials (handled via resilient Mock Payment pipeline).
- SMS gateway integration (prepared via asynchronous email/notification interface).
- Native mobile applications (handled via fully responsive mobile-first React web UI).
- Real-time live bracket tournament streaming (bracket/state tracking supported via data model).

## 10. Chosen Track
**Java — Spring Boot 3.x REST API + React.js + MySQL 8**
