# ☕ Equipment Rental Backend - Spring Boot API

Spring Boot 4.0.6 application with JWT Authentication, Role-Based Access Control (RBAC), Swagger UI documentation, MySQL
database integration, and Redis caching for the Equipment Rental System.

**Version:** 1.0.0 | **Java:** 21+ | **Spring Boot:** 4.0.6 | **Database:** MySQL 8.0+

## 🚀 Key Features

### Security & Authentication

- ✅ **JWT Authentication** - Secure token-based authentication with HS256 algorithm
- ✅ **Role-Based Access Control (RBAC)** - ADMIN, USER, GUEST roles with fine-grained permissions
- ✅ **Spring Security** - Stateless API with BCrypt password encoding (12 rounds)
- ✅ **Token Validation** - Automatic JWT token validation on protected endpoints
- ✅ **CORS Support** - Configured for cross-origin requests

### API & Documentation

- ✅ **Swagger UI / OpenAPI 3.0** - Interactive API documentation with Bearer token support
- ✅ **RESTful Endpoints** - Standard HTTP methods (GET, POST, PUT, DELETE)
- ✅ **Request Validation** - @Valid annotations for input validation
- ✅ **Error Handling** - Centralized exception handling with custom error responses

### Database & ORM

- ✅ **MySQL 8.0+** - Persistent data storage
- ✅ **JPA/Hibernate ORM** - Object-relational mapping
- ✅ **Automatic DDL** - Tables created/updated on startup
- ✅ **Database Migrations** - SQL seed scripts for initial data

### Caching & Performance

- ✅ **Redis Integration** - Session & token caching for improved performance
- ✅ **Spring Cache Abstraction** - Easy-to-use caching annotations
- ✅ **Connection Pooling** - HikariCP for MySQL connections

### Configuration & Utilities

- ✅ **Environment Variables** - .env file support via spring-dotenv
- ✅ **Conditional Configuration** - Profile-based configuration (dev, test, prod)
- ✅ **Logging** - SLF4J with configurable levels via application.yaml
- ✅ **MapStruct** - DTO ↔ Entity mapping with minimal boilerplate

### Business Features

- ✅ **User Management** - Registration, login, profile management
- ✅ **Equipment Catalog** - Equipment listing, search, and filtering
- ✅ **Rental Management** - Equipment rental requests and tracking
- ✅ **Order Management** - Order creation, tracking, and history
- ✅ **Cloudinary Integration** - Image upload and management for equipment
- ✅ **Email Notifications** - Automated emails for confirmations and notifications

## 📋 Prerequisites

- **Java 21+**
- **Maven 3.8+**
- **MySQL 8.0+** (or H2 in-memory for testing)

## 🛠️ Quick Setup

### Prerequisites

Ensure you have the following installed:

```bash
# Check Java version (require 21+)
java -version

# Check Maven (optional - project includes Maven wrapper)
mvn --version
```

### Step 1: Install Dependencies

```bash
# Navigate to backend directory
cd apps/backend

# Install all dependencies (recommended - uses Maven wrapper)
./mvnw clean install

# Or if Maven is installed globally
mvn clean install
```

### Step 2: Configure Environment Variables

Create `.env` file in the `apps/backend/` directory:

```env
# ============= DATABASE CONFIGURATION =============
DB_HOST=localhost
DB_PORT=3306
DB_NAME=demo_db
DB_USER=root
DB_PASSWORD=root

# ============= JWT CONFIGURATION =============
# IMPORTANT: Use a strong, random secret (min 32 characters)
JWT_SECRET=YourSuperSecretKeyMin32CharsLongPassword1234567890
JWT_EXPIRATION_MS=86400000

# ============= SERVER CONFIGURATION =============
SERVER_PORT=8080
LOG_LEVEL=INFO
APP_LOG_LEVEL=DEBUG

# ============= CLOUDINARY (Optional - for image upload) =============
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret

# ============= EMAIL CONFIGURATION (Optional) =============
# MAIL_HOST=smtp.gmail.com
# MAIL_PORT=587
# MAIL_USERNAME=your_email@gmail.com
# MAIL_PASSWORD=your_app_password
```

### Step 3: Create MySQL Database

**Option A: Using MySQL Client**

```bash
# Connect to MySQL
mysql -u root -p

# In MySQL prompt, execute:
CREATE DATABASE demo_db;
CREATE USER 'demo'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON demo_db.* TO 'demo'@'localhost';
FLUSH PRIVILEGES;
QUIT;
```

**Option B: Using MySQL Workbench**

1. Create new schema: `demo_db`
2. Create new user: `demo` with password `root`
3. Grant all privileges to user

**Option C: Using Docker**

```bash
docker run -d \
  --name mysql-container \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=demo_db \
  -e MYSQL_USER=demo \
  -e MYSQL_PASSWORD=root \
  -p 3306:3306 \
  mysql:8.0
```

### Step 4: Build the Application

```bash
# Build without running tests
./mvnw clean package -DskipTests

# Build with tests
./mvnw clean package

# View the compiled JAR
ls -la target/demo-*.jar
```

### Step 5: Run the Application

**Option A: Using Maven (Development)**

```bash
# Run with hot-reload (best for development)
./mvnw spring-boot:run

# Or run from IDE (Spring Boot Run button)
```

**Option B: Using Compiled JAR**

```bash
# Run the built JAR
java -jar target/demo-0.0.1-SNAPSHOT.jar

# With custom JVM options
java -Xmx512m -Xms256m -jar target/demo-0.0.1-SNAPSHOT.jar
```

**Option C: Using Docker**

```bash
# Build Docker image
docker build -t equipment-rental-backend:latest .

# Run container
docker run -d \
  --name backend-container \
  -e DB_HOST=host.docker.internal \
  -e JWT_SECRET=your-secret-key \
  -p 8080:8080 \
  equipment-rental-backend:latest
```

### Verify Installation

Once the server is running, verify it's working:

```bash
# Check health endpoint
curl http://localhost:8080/actuator/health

# Access Swagger UI documentation
# Open in browser: http://localhost:8080/swagger-ui.html

# Check API availability
curl http://localhost:8080/api
```

**Expected output:**

```bash
✅ Server running at http://localhost:8080
✅ Swagger UI at http://localhost:8080/swagger-ui.html
✅ API ready for requests
```

---

## 📖 API Documentation

### Interactive API Testing

**Swagger UI** provides an interactive interface to explore and test all API endpoints:

```
📍 URL: http://localhost:8080/swagger-ui.html
```

### Authentication Endpoints

#### 1. Register New User

```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "john@example.com",
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

Response (Success - 201 Created):

```json
{
  "id": 1,
  "username": "john@example.com",
  "email": "john@example.com",
  "role": "USER",
  "createdAt": "2024-05-25T10:30:00Z"
}
```

#### 2. Login

```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "john@example.com",
  "password": "SecurePass@123"
}
```

Response (Success - 200 OK):

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400000,
  "username": "john@example.com",
  "role": "USER"
}
```

#### 3. Access Protected Endpoints

Include JWT token in Authorization header:

```bash
GET http://localhost:8080/api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Using Swagger UI with Bearer Token

**Step-by-step Guide:**

1. **Start the Application**
   ```bash
   ./mvnw spring-boot:run
   ```

2. **Open Swagger UI**
    - URL: `http://localhost:8080/swagger-ui.html`

3. **Authenticate with Bearer Token**
    - Click the **"Authorize"** button (top-right corner ⬆️)
    - Select **"Bearer"** scheme
    - Paste your JWT token (without "Bearer " prefix):
      ```
      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
      ```
    - Click **"Authorize"**

4. **Execute Requests**
    - All requests now include the Authorization header automatically
    - Click "Try it out" on any endpoint
    - All fields are pre-filled where applicable
    - Click "Execute"

### Common API Endpoints

| Method | Endpoint              | Description              | Auth |
|--------|-----------------------|--------------------------|------|
| `POST` | `/api/auth/register`  | Create new user          | ❌    |
| `POST` | `/api/auth/login`     | Authenticate user        | ❌    |
| `GET`  | `/api/users/profile`  | Get current user profile | ✅    |
| `PUT`  | `/api/users/profile`  | Update user profile      | ✅    |
| `GET`  | `/api/equipment`      | List all equipment       | ❌    |
| `GET`  | `/api/equipment/{id}` | Get equipment details    | ❌    |
| `POST` | `/api/orders`         | Create rental order      | ✅    |
| `GET`  | `/api/orders/{id}`    | Get order details        | ✅    |
| `GET`  | `/api/orders`         | List user orders         | ✅    |

### Testing with cURL

```bash
# 1. Register a new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@example.com",
    "password":"Password@123"
  }'

# 2. Login to get token
TOKEN=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Password@123"}' \
  | jq -r '.accessToken')

echo "Token: $TOKEN"

# 3. Access protected endpoint
curl -X GET http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Testing with Postman

1. **Create new request** → POST
2. **URL:** `http://localhost:8080/api/auth/login`
3. **Headers:**
    - `Content-Type: application/json`
4. **Body (raw JSON):**
   ```json
   {
     "username": "testuser",
     "password": "Password@123"
   }
   ```
5. **Send** and copy the `accessToken` from response
6. **For authenticated requests:**
    - Go to **Authorization** tab
    - Select type: **Bearer Token**
    - Paste the token in the token field
    - Send request

---

## 📁 Project Structure

### Directory Layout

```bash
apps/backend/
├── src/
│   ├── main/
│   │   ├── java/com/example/demo/
│   │   │   ├── LuxrentalApplication.java           # Main Spring Boot entry point
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java        # Spring Security configuration
│   │   │   │   ├── OpenApiConfig.java         # Swagger/OpenAPI documentation
│   │   │   │   └── CacheConfig.java           # Redis cache configuration
│   │   │   │
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java        # Authentication endpoints (register, login)
│   │   │   │   ├── UserController.java        # User profile & management endpoints
│   │   │   │   ├── EquipmentController.java   # Equipment catalog endpoints
│   │   │   │   └── OrderController.java       # Order/rental endpoints
│   │   │   │
│   │   │   ├── security/
│   │   │   │   ├── JwtTokenProvider.java      # JWT token creation & validation
│   │   │   │   ├── JwtAuthenticationFilter.java # Bearer token extraction from requests
│   │   │   │   ├── CustomUserDetails.java     # Spring Security user wrapper
│   │   │   │   ├── CustomUserDetailsService.java # User loading from database
│   │   │   │   └── JwtAuthenticationEntryPoint.java # Unauthorized response handler
│   │   │   │
│   │   │   ├── entity/
│   │   │   │   ├── User.java                  # JPA User entity (@Entity, @Table)
│   │   │   │   ├── Equipment.java             # Equipment rental item entity
│   │   │   │   ├── Order.java                 # Rental order entity
│   │   │   │   └── Role.java                  # RBAC role enum (ADMIN, USER, GUEST)
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java        # User database queries
│   │   │   │   ├── EquipmentRepository.java   # Equipment queries with pagination & search
│   │   │   │   ├── OrderRepository.java       # Order queries
│   │   │   │   └── RoleRepository.java        # Role queries
│   │   │   │
│   │   │   ├── service/
│   │   │   │   ├── AuthService.java           # Business logic for auth (register, login)
│   │   │   │   ├── UserService.java           # User management business logic
│   │   │   │   ├── EquipmentService.java      # Equipment service logic
│   │   │   │   ├── OrderService.java          # Order/rental service logic
│   │   │   │   └── EmailService.java          # Email notification logic
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   ├── LoginRequest.java          # Login request DTO
│   │   │   │   ├── RegisterRequest.java       # Registration DTO
│   │   │   │   ├── JwtResponse.java           # JWT response DTO
│   │   │   │   ├── UserDTO.java               # User data transfer object
│   │   │   │   ├── EquipmentDTO.java          # Equipment DTO
│   │   │   │   └── OrderDTO.java              # Order DTO
│   │   │   │
│   │   │   ├── exception/
│   │   │   │   ├── GlobalExceptionHandler.java # Centralized exception handling
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   ├── UnauthorizedException.java
│   │   │   │   └── BadRequestException.java
│   │   │   │
│   │   │   ├── util/
│   │   │   │   ├── ValidationUtil.java        # Input validation utilities
│   │   │   │   └── PasswordUtil.java          # Password hashing & validation
│   │   │   │
│   │   │   └── mapper/
│   │   │       ├── UserMapper.java            # MapStruct mapper: User ↔ UserDTO
│   │   │       ├── EquipmentMapper.java       # Equipment entity ↔ DTO mapping
│   │   │       └── OrderMapper.java           # Order entity ↔ DTO mapping
│   │   │
│   │   └── resources/
│   │       ├── application.yaml               # Main Spring Boot configuration
│   │       ├── application-dev.yaml           # Development profile config
│   │       ├── application-prod.yaml          # Production profile config
│   │       ├── application-test.yaml          # Testing profile config
│   │       ├── messages.properties            # I18n English messages
│   │       ├── messages_vi.properties         # I18n Vietnamese messages
│   │       └── database/
│   │           ├── schema.sql                 # Database schema (DDL)
│   │           ├── seed_users.sql             # Initial user data
│   │           ├── seed_roles.sql             # Initial role data
│   │           ├── seed_products.sql          # Initial equipment data
│   │           └── seed_orders.sql            # Initial order data
│   │
│   └── test/
│       ├── java/com/example/demo/
│       │   ├── controller/
│       │   │   ├── AuthControllerTest.java    # Auth endpoint tests
│       │   │   └── UserControllerTest.java    # User endpoint tests
│       │   ├── service/
│       │   │   ├── AuthServiceTest.java       # Auth service tests
│       │   │   └── UserServiceTest.java       # User service tests
│       │   ├── security/
│       │   │   └── JwtTokenProviderTest.java  # JWT token tests
│       │   └── repository/
│       │       └── UserRepositoryTest.java    # User repository tests
│       └── resources/
│           └── application-test.yaml          # Test configuration
│
├── .env                                       # Environment variables (local development)
├── .env.example                               # .env template for team
├── .gitignore                                 # Git ignore rules
├── pom.xml                                    # Maven configuration & dependencies
├── mvnw                                       # Maven wrapper (Linux/Mac)
├── mvnw.cmd                                   # Maven wrapper (Windows)
├── Dockerfile                                 # Docker image definition
├── HELP.md                                    # Maven help
└── README.md                                  # This file
```

### Key Directories Explained

| Directory     | Purpose                            | Key Files                        |
|---------------|------------------------------------|----------------------------------|
| `config/`     | Spring & application configuration | Security, OpenAPI, Cache configs |
| `controller/` | REST API endpoints                 | HTTP request handlers            |
| `service/`    | Business logic layer               | Complex operations, validations  |
| `entity/`     | JPA database models                | @Entity annotated classes        |
| `repository/` | Data access layer                  | Spring Data JPA interfaces       |
| `dto/`        | Data transfer objects              | Request/Response DTOs            |
| `security/`   | Authorization & authentication     | JWT, Spring Security             |
| `exception/`  | Custom exception classes           | Error handling                   |
| `mapper/`     | Entity ↔ DTO mapping               | MapStruct mappers                |
| `util/`       | Utility functions                  | Helpers, validators              |

---

## 🔒 Security Features

### Password Security

- **Encoding Algorithm:** BCrypt with 12 rounds (adaptive)
- **Rainbow Table Safe:** BCrypt includes salt automatically
- **Validation:** Password stored securely, never transmitted plaintext
- **Hashing Loop:** Each password takes ~500ms to verify (intentional for security)

### JWT Token Security

| Property       | Value                                     | Description                          |
|----------------|-------------------------------------------|--------------------------------------|
| **Algorithm**  | HS256 (HMAC-SHA256)                       | Symmetric key signing                |
| **Secret**     | 32+ characters                            | Strong random key from `.env`        |
| **Expiration** | 24 hours default                          | Configurable via `JWT_EXPIRATION_MS` |
| **Claims**     | username, role, email                     | User identification & authorization  |
| **Validation** | Token signature verified on every request | Protection against tampering         |

### Authorization & Access Control

| Feature           | Description                           | Example                             |
|-------------------|---------------------------------------|-------------------------------------|
| **Stateless**     | No server-side session storage        | API-first, scalable design          |
| **Bearer Token**  | Token in HTTP `Authorization` header  | `Authorization: Bearer <token>`     |
| **RBAC**          | Role-Based Access Control             | ADMIN, USER, GUEST roles            |
| **Method-Level:** | Fine-grained endpoint protection      | `@PreAuthorize("hasRole('ADMIN')")` |
| **CORS**          | Cross-Origin Resource Sharing enabled | Frontend can access API safely      |

### HTTPS & Transport Security

For production, ensure:

- ✅ HTTPS enabled (TLS 1.3+)
- ✅ Secure cookies (HttpOnly, Secure flags)
- ✅ HSTS headers configured
- ✅ Certificate pinning (optional)

### Request Validation

- ✅ Input validation via `@Valid` annotations
- ✅ Sanitization of user inputs
- ✅ Protection against SQL injection (JPA parameterized queries)
- ✅ XSS protection via response headers

### Protection Mechanisms

| Threat                  | Protection                    | Implementation                       |
|-------------------------|-------------------------------|--------------------------------------|
| **Unauthorized Access** | JWT token validation          | JwtAuthenticationFilter              |
| **Token Tampering**     | HS256 signature verification  | Token validation on every request    |
| **Brute Force**         | Rate limiting (optional)      | Can add Spring Security rate limiter |
| **SQL Injection**       | Parameterized queries         | Spring Data JPA                      |
| **CSRF**                | CSRF disabled (stateless API) | No cookies used                      |
| **CORS Attacks**        | CORS configuration            | Restricted origins                   |

---

## 📊 Database Schema

### Core Tables

```sql
-- Users Table
CREATE TABLE users
(
    id         BIGINT PRIMARY KEY AUTO_INCREMENT,
    username   VARCHAR(255) UNIQUE NOT NULL,
    password   VARCHAR(255)        NOT NULL COMMENT 'BCrypt hashed password',
    email      VARCHAR(255) UNIQUE NOT NULL,
    phone      VARCHAR(20),
    first_name VARCHAR(100),
    last_name  VARCHAR(100),
    role       ENUM('ADMIN', 'USER', 'GUEST') NOT NULL DEFAULT 'USER',
    enabled    BOOLEAN             NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP                    DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP                    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX      idx_username (username),
    INDEX      idx_email (email)
);

-- Equipment Table
CREATE TABLE equipment
(
    id                   BIGINT PRIMARY KEY AUTO_INCREMENT,
    name                 VARCHAR(255)   NOT NULL,
    description          TEXT,
    category             VARCHAR(100)   NOT NULL,
    rental_price_per_day DECIMAL(15, 2) NOT NULL,
    quantity_available   INT            NOT NULL DEFAULT 0,
    image_url            VARCHAR(500),
    created_at           TIMESTAMP               DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP               DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX                idx_category (category)
);

-- Orders/Rentals Table
CREATE TABLE orders
(
    id                BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id           BIGINT         NOT NULL,
    equipment_id      BIGINT         NOT NULL,
    rental_start_date DATE           NOT NULL,
    rental_end_date   DATE           NOT NULL,
    total_price       DECIMAL(15, 2) NOT NULL,
    status            ENUM('PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (equipment_id) REFERENCES equipment (id),
    INDEX             idx_user_id (user_id),
    INDEX             idx_status (status)
);

-- Reviews Table
CREATE TABLE reviews
(
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id      BIGINT NOT NULL,
    equipment_id BIGINT NOT NULL,
    rating       INT    NOT NULL COMMENT 'Rating 1-5',
    comment      TEXT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (equipment_id) REFERENCES equipment (id) ON DELETE CASCADE
);
```

### Database Relationships

```
users (1) ──── (N) orders (N) ──── (1) equipment
  │                                    │
  └──────── (N) reviews (N) ──────────┘
```

### Automatic Schema Generation

Hibernate automatically creates tables on startup:

```yaml
# application.yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update  # Options: validate, update, create, create-drop
```

- **validate:** Check schema only (no changes)
- **update:** Update schema if needed (recommended for dev)
- **create:** Create fresh schema (drops existing)
- **create-drop:** Create on startup, drop on shutdown
- **none:** Do nothing (manual migrations)

---

## 🧪 Testing

### Unit Tests (with Maven)

```bash
mvn test
```

### Manual Testing (with cURL)

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Password@123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Password@123"}' | jq '.token'

# Access with token
TOKEN="<your-jwt-token>"
curl http://localhost:8080/api/protected/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Postman Collection

(To be added - can be generated from Swagger UI)

---

## 🔧 Configuration

### Environment Variables (.env)

```env
# JWT
JWT_SECRET=MinimumOf32CharactersForHS256SecurityKey123
JWT_EXPIRATION_MS=86400000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=demo_db
DB_USER=root
DB_PASSWORD=root

# Server
SERVER_PORT=8080

# Logging
LOG_LEVEL=INFO
APP_LOG_LEVEL=DEBUG
```

### Spring Properties

- **JPA Auto-Update**: `ddl-auto: update` (creates/updates tables)
- **Hibernate Dialect**: `MySQL8Dialect`
- **Session Management**: `STATELESS` (no cookies)
- **CSRF**: Disabled (stateless API)

---

## 🐛 Troubleshooting

### "Database connection refused"

- Check MySQL is running: `mysql -u root -p`
- Verify `.env` database credentials
- Create database: `mysql -u root -p -e "CREATE DATABASE demo_db;"`

### "JWT token expired"

- Default expiration: 24 hours
- Adjust `JWT_EXPIRATION_MS` in `.env`

### "Invalid token"

- Ensure token is in `Authorization: Bearer <token>` format
- Verify `JWT_SECRET` matches in `.env`

### Swagger UI not loading

- Check: <http://localhost:8080/swagger-ui.html>
- Verify `springdoc` dependency in `pom.xml`
- Check logs for errors

---

## 📦 Dependencies

### Core Dependencies

| Dependency            | Version | Purpose                             | Scope   |
|-----------------------|---------|-------------------------------------|---------|
| **Spring Boot**       | 4.0.6   | Web framework & auto-configuration  | compile |
| **Spring Web**        | Latest  | REST API & HTTP support             | compile |
| **Spring Security**   | Latest  | Authentication & authorization      | compile |
| **Spring Data JPA**   | Latest  | Database abstraction layer          | compile |
| **Spring Validation** | Latest  | Input validation (@Valid, @NotNull) | compile |

### Security Dependencies

| Dependency       | Version | Purpose            | Scope   |
|------------------|---------|--------------------|---------|
| **JJWT API**     | 0.13.0  | JWT token creation | compile |
| **JJWT Impl**    | 0.13.0  | JWT implementation | runtime |
| **JJWT Jackson** | 0.13.0  | JWT JSON support   | runtime |

### Database Dependencies

| Dependency          | Version                  | Purpose                        | Scope   |
|---------------------|--------------------------|--------------------------------|---------|
| **MySQL Connector** | Latest                   | MySQL JDBC driver              | runtime |
| **H2 Database**     | Latest                   | In-memory database for testing | runtime |
| **Hibernate**       | Latest (via Spring Boot) | ORM engine                     | compile |

### Caching Dependencies

| Dependency            | Version | Purpose                     | Scope   |
|-----------------------|---------|-----------------------------|---------|
| **Spring Data Redis** | Latest  | Redis integration & caching | compile |

### Documentation & API Dependencies

| Dependency            | Version | Purpose                   | Scope   |
|-----------------------|---------|---------------------------|---------|
| **SpringDoc OpenAPI** | 3.0.2   | Swagger UI & OpenAPI docs | compile |

### Utility Dependencies

| Dependency        | Version | Purpose                               | Scope              |
|-------------------|---------|---------------------------------------|--------------------|
| **Lombok**        | Latest  | Reduce boilerplate (@Getter, @Setter) | compile (optional) |
| **MapStruct**     | 1.6.3   | Entity ↔ DTO mapping                  | compile            |
| **Spring Dotenv** | 5.1.0   | .env file support                     | compile            |
| **Spring Mail**   | Latest  | Email notifications                   | compile            |
| **Cloudinary**    | 2.3.2   | Image upload & management             | compile            |

### Development Tools

| Dependency               | Version | Purpose                | Scope   |
|--------------------------|---------|------------------------|---------|
| **Spring Boot DevTools** | Latest  | Hot reload & debugging | runtime |

### Testing Dependencies

| Dependency           | Version | Purpose                  | Scope |
|----------------------|---------|--------------------------|-------|
| **Spring Boot Test** | Latest  | Unit & integration tests | test  |
| **Embedded Redis**   | 1.4.3   | Mock Redis for testing   | test  |
| **JUnit**            | 5+      | Test runner              | test  |
| **Mockito**          | Latest  | Mocking framework        | test  |

### Check Installed Versions

```bash
# View dependency tree
./mvnw dependency:tree

# Show only direct dependencies
./mvnw dependency:tree -Dverbose=false

# Check for updates
./mvnw versions:display-dependency-updates
```

---

## 🚀 Deployment

### Docker

```dockerfile
FROM openjdk:21-slim
WORKDIR /app
COPY target/demo-0.0.1-SNAPSHOT.jar app.jar
ENV JWT_SECRET=prod-secret-key-here
ENV DB_HOST=db.example.com
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Build & Run

```bash
docker build -t demo-api:latest .
docker run -e JWT_SECRET=prod-key -e DB_HOST=db-host -p 8080:8080 demo-api:latest
```

---

## 📝 Future Enhancements

- [ ] Email verification flow
- [ ] Password reset endpoint
- [ ] Refresh token rotation
- [ ] Rate limiting
- [ ] API versioning
- [ ] Audit logging
- [ ] Two-factor authentication (2FA)
- [ ] OAuth2 integration

---

## 📞 Support

For issues or questions:

1. Check Swagger documentation: <http://localhost:8080/swagger-ui.html>
2. Review logs in console
3. Check `.env` configuration

---

## 📄 License

Apache License 2.0 - See LICENSE file

---

**Last Updated**: April 13, 2026
**Version**: 1.0.0
