# Changelog

All notable changes to the **Gaming Event Ticketing and Registration Platform** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] - Day 60 Enhancement
### Planned
- 🤖 **AI-Powered Gaming Event Recommendation System**
  - Content-based event filtering based on past registrations and preferred gaming categories.
  - Collaborative similarity scoring for gamer tournament matching.
  - Recommendation REST API (`GET /api/v1/recommendations`).

---

## [1.0.0] - Day 41: Full Product Release
### Planned
- Complete React 18 + Vite frontend with Tailwind CSS.
- Role-based Gamer, Organizer, and Admin dashboards with interactive charts and tables.
- Comprehensive JUnit 5 & Mockito test suite covering all critical services.
- GitHub Actions CI/CD workflows for backend and frontend.
- Production deployment guides for Render/Railway and Vercel/Netlify.

---

## [0.1.0] - Day 11: Foundation & MVP Scaffolding
### Added
- Complete project multi-tier folder structure (`backend`, `frontend`, `docs`).
- Spring Boot 3.3.4 parent project configuration with Java 17+ and Maven.
- MySQL 8 and H2 development database configurations with environment variable support.
- 9 Core JPA Domain Entities: `Role`, `User`, `GamingCategory`, `Event`, `Tournament`, `TicketType`, `Registration`, `Ticket`, `Payment`.
- 9 Domain Enums supporting full lifecycle state machines: `RoleType`, `AccountStatus`, `EventType`, `EventStatus`, `TournamentStatus`, `RegistrationStatus`, `TicketTypeStatus`, `TicketStatus`, `PaymentMethod`, `PaymentStatus`.
- 9 Spring Data JPA Repositories with custom pagination, filtering, and aggregation queries.
- Standard generic API response envelopes (`ApiResponse<T>`) and error DTOs (`ErrorResponse`).
- Robust `@RestControllerAdvice` Global Exception Handler handling not found, bad request, duplicate conflict, capacity exceeded, validation, and security exceptions.
- OpenAPI 3.0 / Swagger UI documentation integration at `/swagger-ui.html`.
- System Health check endpoint at `GET /api/v1/health`.
- Comprehensive `Problem_Statement.md`, architecture documentation, database schema, and `.env.example`.
