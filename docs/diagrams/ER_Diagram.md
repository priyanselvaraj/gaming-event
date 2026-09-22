# Entity Relationship (ER) Diagram

This document describes the complete relational database entity model for the **Gaming Event Ticketing and Registration Platform**, detailing table attributes, data types, primary keys (PK), foreign keys (FK), and cardinality.

---

## Mermaid ER Diagram

```mermaid
erDiagram
    ROLES ||--o{ USERS : "assigns role to"
    GAMING_CATEGORIES ||--o{ EVENTS : "categorizes"
    USERS ||--o{ EVENTS : "organizes"
    EVENTS ||--o{ TOURNAMENTS : "contains"
    EVENTS ||--o{ TICKET_TYPES : "offers"
    USERS ||--o{ REGISTRATIONS : "enrolls in"
    EVENTS ||--o{ REGISTRATIONS : "receives"
    TOURNAMENTS ||--o{ REGISTRATIONS : "brackets"
    USERS ||--o{ TICKETS : "owns"
    EVENTS ||--o{ TICKETS : "issues for"
    TICKET_TYPES ||--o{ TICKETS : "tier of"
    USERS ||--o{ PAYMENTS : "initiates"
    EVENTS ||--o{ PAYMENTS : "receives payment for"
    TICKETS ||--o| PAYMENTS : "settles"

    ROLES {
        bigint id PK
        varchar_30 name UK
        varchar_255 description
    }

    USERS {
        bigint id PK
        varchar_100 full_name
        varchar_50 username UK
        varchar_100 email UK
        varchar_20 phone_number
        varchar_255 password
        bigint role_id FK
        varchar_20 status
        timestamp created_at
        timestamp updated_at
    }

    GAMING_CATEGORIES {
        bigint id PK
        varchar_100 name UK
        varchar_500 description
        timestamp created_at
    }

    EVENTS {
        bigint id PK
        varchar_150 event_name
        text description
        varchar_100 game_name
        bigint category_id FK
        varchar_20 event_type
        date event_date
        time start_time
        time end_time
        varchar_255 location
        varchar_500 online_event_link
        int maximum_capacity
        int current_capacity
        varchar_500 event_banner_url
        bigint organizer_id FK
        varchar_20 status
        timestamp created_at
        timestamp updated_at
    }

    TOURNAMENTS {
        bigint id PK
        varchar_150 tournament_name
        text description
        varchar_100 game_name
        bigint event_id FK
        int max_participants
        int current_participants
        datetime registration_start_date
        datetime registration_deadline
        decimal_10_2 entry_fee
        decimal_12_2 prize_pool
        text rules
        varchar_25 status
        timestamp created_at
        timestamp updated_at
    }

    TICKET_TYPES {
        bigint id PK
        varchar_100 ticket_name
        varchar_255 description
        decimal_10_2 price
        int quantity_available
        int quantity_sold
        bigint event_id FK
        varchar_20 status
        timestamp created_at
        timestamp updated_at
    }

    REGISTRATIONS {
        bigint id PK
        bigint gamer_id FK
        bigint event_id FK
        bigint tournament_id FK
        datetime registration_date
        varchar_20 status
        timestamp created_at
        timestamp updated_at
    }

    TICKETS {
        bigint id PK
        varchar_50 ticket_number UK
        bigint gamer_id FK
        bigint event_id FK
        bigint ticket_type_id FK
        datetime purchase_date
        varchar_20 status
        timestamp created_at
        timestamp updated_at
    }

    PAYMENTS {
        bigint id PK
        varchar_100 transaction_reference UK
        bigint user_id FK
        bigint event_id FK
        bigint ticket_id FK
        decimal_10_2 amount
        varchar_20 payment_method
        varchar_20 payment_status
        timestamp created_at
        timestamp updated_at
    }
```

---

## Cardinality & Key Rules Summary
1. **Users & Roles**: `1:N` — A user has exactly one assigned role (`ROLE_ADMIN`, `ROLE_ORGANIZER`, `ROLE_GAMER`).
2. **Events & Categories**: `1:N` — Each event belongs to one gaming category (FPS, MOBA, Battle Royale, etc.).
3. **Events & Organizers**: `1:N` — An organizer can manage many events; events reference their owner for authorization.
4. **Events & Tournaments**: `1:N` — An event can host multiple game stages/tournaments.
5. **Events & Ticket Types**: `1:N` — An event can have multiple ticket tiers (General, VIP, Early Bird).
6. **Registrations**: Composite unique constraint on `(gamer_id, event_id, tournament_id)` prevents accidental duplicate enrollments.
7. **Tickets**: Each ticket has a globally unique `ticket_number` (`GAME-2026-XXXXX`).
8. **Payments**: Tracks financial transactions with unique `transaction_reference` linked to the buyer and target event/ticket.
