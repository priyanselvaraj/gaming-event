# System Architecture Diagram

This document illustrates the multi-tier architectural blueprint of the **Gaming Event Ticketing and Registration Platform**, showcasing client interaction, security boundaries, business service orchestration, relational persistence, and future microservice/external gateways.

---

## High-Level System Architecture

```mermaid
graph TD
    subgraph Client_Layer ["Frontend Client Layer (React + Vite)"]
        UI_Gamer["Gamer Portal (Discovery, Registration, Tickets)"]
        UI_Organizer["Organizer Dashboard (Events, Brackets, Sales)"]
        UI_Admin["Admin Management Console (Governance, Analytics)"]
    end

    subgraph API_Gateway ["REST API Gateway & Security Boundary"]
        ReverseProxy["CORS & Request Filter"]
        JWT_Auth["Spring Security + JWT Auth Filter"]
        Swagger["OpenAPI 3 / Swagger Docs (/swagger-ui.html)"]
    end

    subgraph Backend_Layer ["Spring Boot 3.3.4 Application Backend"]
        subgraph Controllers ["Controller Layer (REST Endpoints)"]
            AuthCtrl["AuthController (/api/v1/auth)"]
            EventCtrl["EventController (/api/v1/events)"]
            TournCtrl["TournamentController (/api/v1/tournaments)"]
            RegCtrl["RegistrationController (/api/v1/registrations)"]
            TicketCtrl["TicketController (/api/v1/tickets)"]
            PayCtrl["PaymentController (/api/v1/payments)"]
            DashCtrl["DashboardController (/api/v1/dashboard)"]
            HealthCtrl["HealthController (/api/v1/health)"]
        end

        subgraph Services ["Service Layer (Business Logic & Constraints)"]
            AuthService["AuthService (BCrypt, Token Issuance)"]
            EventService["EventService (Approval Workflow, Filters)"]
            TournService["TournamentService (Capacity, Deadlines)"]
            RegService["RegistrationService (Anti-Duplicate Check)"]
            TicketService["TicketService (Anti-Oversell Quota, Code Gen)"]
            PayService["PaymentService (Mock Pipeline / Ledger)"]
            DashService["DashboardService (Metrics, Aggregates)"]
        end

        subgraph Repositories ["Data Access Layer (Spring Data JPA)"]
            UserRepo["UserRepository"]
            EventRepo["EventRepository"]
            TournRepo["TournamentRepository"]
            RegRepo["RegistrationRepository"]
            TicketRepo["TicketRepository"]
            PayRepo["PaymentRepository"]
            CatRepo["GamingCategoryRepository"]
        end
    end

    subgraph Database_Layer ["Persistence Layer"]
        MySQL[("MySQL 8.0 / Railway Cloud DB")]
    end

    subgraph Future_Extensions ["External / Future Extension Gateways (Day 60)"]
        PaymentGateway["Payment Gateways (Razorpay / Stripe)"]
        MailService["Email & Discord Webhook Notification Engine"]
        AIRecEngine["AI Recommendation Engine (Event Matching)"]
    end

    %% Client to Security
    UI_Gamer -->|HTTP / JSON (Bearer JWT)| ReverseProxy
    UI_Organizer -->|HTTP / JSON (Bearer JWT)| ReverseProxy
    UI_Admin -->|HTTP / JSON (Bearer JWT)| ReverseProxy

    %% Security to Controllers
    ReverseProxy --> JWT_Auth
    JWT_Auth --> Controllers

    %% Controllers to Services
    AuthCtrl --> AuthService
    EventCtrl --> EventService
    TournCtrl --> TournService
    RegCtrl --> RegService
    TicketCtrl --> TicketService
    PayCtrl --> PayService
    DashCtrl --> DashService

    %% Services to Repositories
    AuthService --> UserRepo
    EventService --> EventRepo
    EventService --> CatRepo
    TournService --> TournRepo
    RegService --> RegRepo
    RegService --> EventRepo
    TicketService --> TicketRepo
    TicketService --> EventRepo
    PayService --> PayRepo
    DashService --> UserRepo
    DashService --> EventRepo
    DashService --> PayRepo

    %% Repositories to DB
    UserRepo --> MySQL
    EventRepo --> MySQL
    TournRepo --> MySQL
    RegRepo --> MySQL
    TicketRepo --> MySQL
    PayRepo --> MySQL
    CatRepo --> MySQL

    %% Services to Future Extensions
    PayService -.->|Pluggable Adapter| PaymentGateway
    RegService -.->|Async Event Dispatcher| MailService
    EventService -.->|Feature Extraction API| AIRecEngine
```

---

## Architectural Principles
1. **Separation of Concerns**: Controllers are strictly presentation-layer entry points; business rules and transaction boundaries reside entirely in the `@Service` layer.
2. **Stateless Security**: Zero HTTP session state on the backend; each request carries an immutable JWT token signed with HMAC-SHA256.
3. **Data Integrity & Concurrency Safety**: Registration quotas and ticket stock deductions use database-level uniqueness constraints and atomic increment/decrement queries to prevent race conditions.
4. **DTO Encapsulation**: Domain Entities are never returned raw in public APIs, avoiding circular JSON recursion and preventing sensitive data leakage (e.g., password hashes).
