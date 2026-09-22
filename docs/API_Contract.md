# REST API Specification & Contract

Base URL: `/api/v1`

All responses follow the unified envelope:
```json
{
  "success": true,
  "message": "Human readable summary",
  "data": {},
  "timestamp": "2026-09-01T21:00:00"
}
```

---

## 1. System Health
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/health` | Public | System status and service health check |

---

## 2. Authentication Module (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Register a new user (`ADMIN`, `ORGANIZER`, `GAMER`) |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user and receive JWT Bearer token |
| `GET` | `/api/v1/auth/me` | Authenticated | Retrieve authenticated user profile |

---

## 3. Gaming Categories (`/api/v1/categories`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/categories` | Public | List all gaming categories |
| `POST` | `/api/v1/categories` | Admin | Create a new gaming category |
| `PUT` | `/api/v1/categories/{id}` | Admin | Update category name/description |
| `DELETE` | `/api/v1/categories/{id}` | Admin | Remove a category |

---

## 4. Events (`/api/v1/events`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/events` | Public | Browse/filter approved events with pagination |
| `GET` | `/api/v1/events/{id}` | Public | Get detailed event overview, tournaments, and tickets |
| `POST` | `/api/v1/events` | Organizer / Admin | Create a new event draft |
| `PUT` | `/api/v1/events/{id}` | Organizer / Admin | Update event details (owner only) |
| `DELETE` | `/api/v1/events/{id}` | Organizer / Admin | Delete event (owner only) |
| `POST` | `/api/v1/events/{id}/submit` | Organizer | Submit draft event for admin approval |
| `POST` | `/api/v1/events/{id}/approve` | Admin | Approve pending event for public visibility |
| `POST` | `/api/v1/events/{id}/reject` | Admin | Reject pending event with feedback |
| `GET` | `/api/v1/events/my-events` | Organizer | List all events created by logged-in organizer |

---

## 5. Tournaments (`/api/v1/tournaments`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/tournaments` | Public | List all active tournaments |
| `GET` | `/api/v1/tournaments/{id}` | Public | Get tournament details, rules, and participant list |
| `POST` | `/api/v1/tournaments` | Organizer | Create a tournament bracket under an event |
| `PUT` | `/api/v1/tournaments/{id}` | Organizer | Update tournament rules/deadlines |
| `DELETE` | `/api/v1/tournaments/{id}` | Organizer | Delete tournament |

---

## 6. Registrations (`/api/v1/registrations`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/registrations/event/{eventId}` | Gamer | Register for an event |
| `POST` | `/api/v1/registrations/tournament/{tournamentId}` | Gamer | Register for a tournament |
| `GET` | `/api/v1/registrations/my-registrations` | Gamer | List logged-in gamer's registrations |
| `DELETE` | `/api/v1/registrations/{id}` | Gamer / Admin | Cancel registration and restore capacity |

---

## 7. Ticketing (`/api/v1/tickets`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/tickets` | Admin | View all platform tickets |
| `GET` | `/api/v1/tickets/my-tickets` | Gamer | View tickets owned by logged-in gamer |
| `POST` | `/api/v1/tickets/purchase` | Gamer | Purchase ticket tier for an event |
| `GET` | `/api/v1/tickets/{id}` | Gamer / Organizer | View specific ticket pass details |

---

## 8. Payments (`/api/v1/payments`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/payments/mock` | Gamer | Execute mock payment and trigger ticket generation |
| `GET` | `/api/v1/payments/my-payments` | Gamer | View gamer transaction history |
| `GET` | `/api/v1/payments/{id}` | Gamer / Admin | View detailed transaction receipt |

---

## 9. Dashboards (`/api/v1/dashboard`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/dashboard/admin` | Admin | Global metrics, event statuses, users, revenue |
| `GET` | `/api/v1/dashboard/organizer` | Organizer | Organizer stats, tickets sold, participant counts |
| `GET` | `/api/v1/dashboard/gamer` | Gamer | Registered events, upcoming tournaments, tickets |
