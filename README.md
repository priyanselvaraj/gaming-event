# 🎮 Gaming Event Ticketing and Registration Platform

> **A modern, full-stack esports and gaming tournament discovery, registration, and ticketing platform.**

[![Backend CI](https://github.com/gaming-event-platform/platform/actions/workflows/backend.yml/badge.svg)](https://github.com)
[![Frontend CI](https://github.com/gaming-event-platform/platform/actions/workflows/frontend.yml/badge.svg)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)

---

## 📖 1. Overview
The **Gaming Event Ticketing and Registration Platform** is an enterprise-grade full-stack web application designed for the gaming and esports community. It connects competitive players, collegiate gaming clubs, and professional esports tournament organizers under a secure, unified ecosystem.

Gamers can discover upcoming LAN parties, online tournaments, and major esports conventions, complete secure registrations with automated capacity checks, purchase tiered admission tickets, and manage event schedules. Event organizers benefit from a draft-to-publish approval lifecycle, tournament bracket configuration, real-time ticket quota management, and participant monitoring. Platform Administrators maintain oversight through moderation controls, category taxonomy curation, and revenue analytics.

---

## 🎯 2. Problem Being Solved
Traditional gaming event management is highly fragmented:
- **Gamers** face scattered announcements across Discord channels, social feeds, and unstandardized Google Forms, leading to lost tickets and lack of real-time seat availability.
- **Organizers** struggle with manual registration verifications, duplicate player entries, accidental ticket overselling, and disjointed payment tracking.
- **Administrators** lack centralized moderation tools to prevent fraudulent tournament listings.

This platform resolves these pain points by enforcing database-level integrity constraints, role-based workflows, unique ticket collision prevention, and instant transactional feedback.

---

## 🏛️ 3. Architecture Diagram

```mermaid
graph TD
    subgraph Client_Layer ["Frontend Client Layer (React 18 + Vite)"]
        UI_Gamer["Gamer Portal (Discovery, Registration, Tickets)"]
        UI_Organizer["Organizer Dashboard (Events, Tournaments, Sales)"]
        UI_Admin["Admin Management Console (Governance, Analytics)"]
    end

    subgraph API_Gateway ["REST API Gateway & Security Boundary"]
        ReverseProxy["CORS & Request Filter"]
        JWT_Auth["Spring Security 6 + JWT Auth Filter"]
        Swagger["OpenAPI 3 / Swagger UI (/swagger-ui.html)"]
    end

    subgraph Backend_Layer ["Spring Boot 3.3.4 Application Backend"]
        Controllers["Controller Layer (REST Endpoints)"]
        Services["Service Layer (Business Logic & Validation)"]
        Repositories["Repository Layer (Spring Data JPA)"]
    end

    subgraph Database_Layer ["Persistence Layer"]
        MySQL[("MySQL 8.0 Relational Database")]
    end

    UI_Gamer -->|HTTP / JSON (Bearer JWT)| ReverseProxy
    UI_Organizer -->|HTTP / JSON (Bearer JWT)| ReverseProxy
    UI_Admin -->|HTTP / JSON (Bearer JWT)| ReverseProxy

    ReverseProxy --> JWT_Auth
    JWT_Auth --> Controllers
    Controllers --> Services
    Services --> Repositories
    Repositories --> MySQL
```

---

## 💻 4. Technology Stack

### Backend
- **Language**: Java 17 / Java 21 / Java 25
- **Framework**: Spring Boot 3.3.4
- **Security**: Spring Security 6, JWT (io.jsonwebtoken 0.12.6), BCrypt Password Encoder
- **Persistence**: Spring Data JPA, Hibernate 6
- **Database**: MySQL 8.0 / H2 In-Memory (Dev Profile)
- **API Documentation**: Springdoc OpenAPI / Swagger UI 3.0
- **Validation**: Jakarta Bean Validation (`@Valid`, `@NotNull`, `@Size`)
- **Build Tool**: Apache Maven

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM 6
- **Styling**: Tailwind CSS, Lucide Icons
- **HTTP Client**: Axios (with centralized JWT interceptor)
- **Data Visualization**: Recharts / Chart.js

### DevOps & Infrastructure
- **CI/CD**: GitHub Actions
- **Container / Cloud Deployment**: Render / Railway (Backend + MySQL), Vercel (Frontend)

---

## ⚡ 5. Features

### 🛡️ Role-Based Access Control (RBAC)
- **Admin**: Approve/reject pending events, suspend/activate user accounts, manage game categories, inspect all ticket transactions, view system revenue.
- **Organizer**: Create events, manage tournament brackets, allocate tiered ticket pools, view attendee rosters and revenue breakdowns.
- **Gamer**: Browse approved events, search/filter games, register for tournaments, purchase tickets, view pass barcode numbers.

### 🎮 Event & Tournament Management
- Draft, submit, and approve event lifecycle state machine.
- Strict registration capacity enforcement preventing duplicate registrations.
- Registration window deadlines and dynamic participant tracking.

### 🎟️ Ticketing & Mock Payment System
- Tiered ticket inventory (General, VIP, Early Bird) with anti-overselling guards.
- Collision-free ticket serial generation (`GAME-2026-XXXXX`).
- Resilient mock payment processing engine ready for Razorpay/Stripe webhooks.

---

## 📸 6. Screenshots Section
*(UI Mockups and Screenshots will be captured and placed in `docs/screenshots/` upon completing the frontend module)*

| Event Discovery Page | Organizer Dashboard | Gamer Ticket Pass |
|---|---|---|
| `[Browse Events Screenshot]` | `[Organizer Analytics Screenshot]` | `[Digital Ticket Pass Screenshot]` |

---

## 🚀 7. Installation Instructions & Setup

### Prerequisites
- **Java**: JDK 17 or higher (`java -version`)
- **Node.js**: Node 18+ and npm 9+ (`node -v`, `npm -v`)
- **MySQL**: MySQL 8.0 Server running on port 3306

---

### 🗄️ Database Setup
1. Start your local MySQL service.
2. Create the database schema and load sample seed data:
```bash
mysql -u root -p < docs/database/database_schema.sql
mysql -u root -p < docs/database/sample_data.sql
```

---

### ⚙️ Backend Setup
1. Navigate to the backend directory:
```powershell
cd backend
```
2. Configure environment variables in `.env` (or pass via command line):
```properties
DB_URL=jdbc:mysql://localhost:3306/gaming?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION=86400000
PORT=8080
```
3. Build and run the Spring Boot backend:
```bash
mvn clean spring-boot:run
```
*(Or run with in-memory H2 dev profile without MySQL installed)*:
```bash
mvn clean spring-boot:run -Dspring-boot.run.profiles=dev
```

4. Verify backend is running:
- Health check: `http://localhost:8080/api/v1/health`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

---

### 🎨 Frontend Setup
1. Navigate to the frontend directory:
```powershell
cd frontend
```
2. Install npm dependencies:
```bash
npm install
```
3. Start the Vite development server:
```bash
npm run dev
```
4. Access the web application at `http://localhost:5173`.

---

## 🧪 8. Running Tests
Execute unit and integration test suites:
```bash
# Backend Test Suite (JUnit 5 + Mockito)
cd backend
mvn clean test

# Verification Build
mvn clean verify
```

---

## 📁 9. Folder Structure

```
gaming-event-platform/
├── .github/
│   └── workflows/
│       ├── backend.yml
│       └── frontend.yml
├── docs/
│   ├── API_Contract.md
│   ├── diagrams/
│   │   ├── Architecture_Diagram.md
│   │   ├── ER_Diagram.md
│   │   └── Class_Diagram.md
│   └── database/
│       ├── database_schema.sql
│       └── sample_data.sql
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/gamingevent/platform/
│       │   │   ├── GamingEventPlatformApplication.java
│       │   │   ├── config/
│       │   │   ├── controller/
│       │   │   ├── dto/
│       │   │   ├── exception/
│       │   │   ├── model/
│       │   │   │   ├── entity/
│       │   │   │   └── enums/
│       │   │   ├── repository/
│       │   │   ├── security/
│       │   │   ├── service/
│       │   │   └── util/
│       │   └── resources/
│       │       ├── application.properties
│       │       └── application-dev.properties
│       └── test/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── .env.example
├── .gitignore
├── CHANGELOG.md
├── LICENSE
├── Problem_Statement.md
└── README.md
```

---

## 🔮 10. Future Enhancements (Day 60)
- 🤖 **AI-Powered Gaming Event Recommendation Engine**: Content-based filtering matching gamer preferences with upcoming tournaments.
- 💳 **Live Payment Gateways**: Direct integration with Stripe and Razorpay checkout webhooks.
- 🔔 **Real-Time Tournament Notifications**: WebSockets and Discord bot webhooks for live match alerts.

---

## 📄 11. License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 12. Author
**Semester 5 Capstone Project Team**
- Domain: Gaming and Esports Event Management
- Stack: Spring Boot + React + MySQL

---

## 🔐 Login with Email OTP + Login Notification

Login is now 2-step:

1. `POST /api/users/login` – email + password → server emails a 6-digit OTP (valid 5 min, max 5 wrong tries, resend after 30 s).
2. `POST /api/users/verify-otp` – `{ "email": "...", "otp": "123456" }` → logged in, and a **"New login to your account"** email (time, IP, device) is sent.
3. `POST /api/users/resend-otp` – `{ "email": "..." }` → sends a new OTP.

### Email setup (Gmail example)
Create a Gmail **App Password** (Google Account → Security → 2-Step Verification → App passwords), then set env variables before starting the backend:

```bash
# Windows PowerShell
$env:MAIL_USERNAME="yourname@gmail.com"
$env:MAIL_PASSWORD="your-16-char-app-password"
# optional: real inboxes for the seeded demo accounts
$env:SEED_ADMIN_EMAIL="yourname@gmail.com"
$env:SEED_USER_EMAIL="friend@gmail.com"

# Linux / macOS
export MAIL_USERNAME=yourname@gmail.com MAIL_PASSWORD=your-app-password
```

If `MAIL_USERNAME` is empty, no email is sent and the OTP is printed in the backend console (dev mode).
Other SMTP providers: set `MAIL_HOST`, `MAIL_PORT`, `MAIL_FROM`.
