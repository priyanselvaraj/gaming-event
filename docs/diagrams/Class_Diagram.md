# Backend Class Diagram

This document describes the layered class structure of the Spring Boot application, detailing the entities, services, repositories, controllers, and exception hierarchies.

---

## Mermaid Class Diagram

```mermaid
classDiagram
    %% Model Entities
    class Role {
        +Long id
        +RoleType name
        +String description
    }

    class User {
        +Long id
        +String fullName
        +String username
        +String email
        +String phoneNumber
        +String password
        +Role role
        +AccountStatus status
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
    }

    class GamingCategory {
        +Long id
        +String name
        +String description
        +LocalDateTime createdAt
    }

    class Event {
        +Long id
        +String eventName
        +String description
        +String gameName
        +GamingCategory category
        +EventType eventType
        +LocalDate eventDate
        +LocalTime startTime
        +LocalTime endTime
        +String location
        +String onlineEventLink
        +Integer maximumCapacity
        +Integer currentCapacity
        +String eventBannerUrl
        +User organizer
        +EventStatus status
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
    }

    class Tournament {
        +Long id
        +String tournamentName
        +String description
        +String gameName
        +Event event
        +Integer maxParticipants
        +Integer currentParticipants
        +LocalDateTime registrationStartDate
        +LocalDateTime registrationDeadline
        +BigDecimal entryFee
        +BigDecimal prizePool
        +String rules
        +TournamentStatus status
    }

    class TicketType {
        +Long id
        +String ticketName
        +String description
        +BigDecimal price
        +Integer quantityAvailable
        +Integer quantitySold
        +Event event
        +TicketTypeStatus status
    }

    class Registration {
        +Long id
        +User gamer
        +Event event
        +Tournament tournament
        +LocalDateTime registrationDate
        +RegistrationStatus status
    }

    class Ticket {
        +Long id
        +String ticketNumber
        +User gamer
        +Event event
        +TicketType ticketType
        +LocalDateTime purchaseDate
        +TicketStatus status
    }

    class Payment {
        +Long id
        +String transactionReference
        +User user
        +Event event
        +Ticket ticket
        +BigDecimal amount
        +PaymentMethod paymentMethod
        +PaymentStatus paymentStatus
    }

    %% Repositories
    class UserRepository {
        <<interface>>
        +findByUsername(username)
        +findByEmail(email)
        +existsByUsername(username)
        +existsByEmail(email)
    }

    class EventRepository {
        <<interface>>
        +findByStatus(status, pageable)
        +findByOrganizerId(organizerId, pageable)
        +searchApprovedEvents(query, pageable)
        +filterApprovedEvents(categoryId, type, start, end, query, pageable)
    }

    class TournamentRepository {
        <<interface>>
        +findByEventId(eventId)
    }

    class RegistrationRepository {
        <<interface>>
        +findByGamerId(gamerId, pageable)
        +existsByGamerIdAndEventIdAndStatusNot(gamerId, eventId, status)
    }

    class TicketRepository {
        <<interface>>
        +findByTicketNumber(ticketNumber)
        +findByGamerId(gamerId, pageable)
    }

    class PaymentRepository {
        <<interface>>
        +findByTransactionReference(ref)
        +calculateTotalPlatformRevenue()
    }

    %% Controllers & Envelopes
    class ApiResponse~T~ {
        +boolean success
        +String message
        +T data
        +LocalDateTime timestamp
        +success(message, data)$
        +error(message, data)$
    }

    class GlobalExceptionHandler {
        +handleResourceNotFoundException()
        +handleBadRequestException()
        +handleDuplicateResourceException()
        +handleValidationException()
        +handleGlobalException()
    }

    %% Relationships
    User --> Role : has
    Event --> User : organized by
    Event --> GamingCategory : categorizes
    Tournament --> Event : part of
    TicketType --> Event : belongs to
    Registration --> User : gamer
    Registration --> Event : attends
    Registration --> Tournament : competes in
    Ticket --> User : attendee
    Ticket --> Event : for event
    Ticket --> TicketType : tier
    Payment --> User : buyer
    Payment --> Event : transaction for
    Payment --> Ticket : settles
```
