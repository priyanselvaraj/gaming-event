# 🎮 Gaming Event Ticketing and Registration Platform (Single Folder)

This single folder contains the complete, unified full-stack application:
- **Backend**: Spring Boot 3.3.4 (Java 21), Spring Data JPA, REST APIs
- **Frontend**: HTML5, CSS3, JavaScript (located in `src/main/resources/static/`)
- **Database**: MySQL 8.0 (`gaming`) or in-memory H2

---

## ⚡ Quick Start (One Command)

Open PowerShell inside this folder (`gaming-platform`):

```powershell
# Run with H2 In-Memory Database (No setup needed)
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=dev"

# OR Run with MySQL
.\mvnw.cmd spring-boot:run
```

---

## 🌐 Access the Application

Once started, open your browser at:
👉 **`http://localhost:8080`** (or `http://localhost:8080/index.html`)

### Default Logins:
- **Admin**: `admin@gaming.com` / `admin123`
- **Gamer**: `alex@gaming.com` / `alex123`
