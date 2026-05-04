# Ecommerce-Microservice

## API Gateway

The **API Gateway** serves as the central entry point for the **Ecommerce-Microservice** ecosystem. It is responsible for intercepting all incoming client requests and intelligently routing them to the appropriate backend microservices. By centralizing request handling, the Gateway manages cross-cutting concerns like security, request proxying, and identity propagation.

---

### Core Responsibilities

*   **Request Routing & Proxying:** Automatically maps and forwards client requests to the correct internal service (e.g., Product, Inventory, or Auth) based on the URI path.
*   **Authentication Middleware:** Intercepts protected routes to verify user identity using JWT before allowing the request to proceed.
*   **Identity Propagation:** Extracts user metadata from verified tokens and injects it into custom headers (e.g., `x-user-id`, `x-user-role`) so downstream services can remain stateless.
*   **Path Parameter Resolution:** Dynamically handles URL segments, such as resolving `:id` in `/products/:id`, ensuring the backend receives the correct resource identifier.
*   **Standardized API Versioning:** Provides a consistent base path (`/api/v1`) for all external communications.

---

### System Architecture

The Gateway acts as a reverse proxy for the following specialized services:

| Service | Port | Description |
| :--- | :--- | :--- |
| **Auth Service** | `:4003` | Manages registration, logins, and token validation. |
| **Product Service** | `:4001` | Handles the product catalog and CRUD operations. |
| **Inventory Service** | `:4002` | Tracks stock levels and inventory updates. |
| **User Service** | `:4004` | Manages user profiles and Role-Based Access Control (RBAC). |
| **Email Service** | `:4005` | Sends system-generated emails for Verify Email, Order Receipts |

---

### Endpoint Directory

Below is the routing table currently managed by the Gateway:

#### Auth Service
| Path | Method | Middleware | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/register` | `POST` | None | User account creation |
| `/api/v1/auth/login` | `POST` | None | Credential authentication |
| `/api/v1/auth/verify-email` | `POST` | None | Email Verification |
| `/api/v1/auth/verify-token` | `POST` | None | Session validation |


#### Product Service
| Path | Method | Middleware | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/v1/products` | `GET` | None | Browse all products |
| `/api/v1/products` | `POST` | `auth` | Create a new product (Admin) |
| `/api/v1/products/:id` | `GET` | None | View specific product info |

#### Inventory Service
| Path | Method | Middleware | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/v1/inventories/:id` | `PUT` | `auth` | Update stock counts |
| `/api/v1/inventories/:id/details` | `GET` | `auth` | View audit/stock details |

#### User Service
| Path | Method | Middleware | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/v1/users/:id` | `GET` | `auth` | Retrieve user profile |

---

## Services

### 1. Inventory
This service manages product stock and inventory levels.
- **Stock Validation:** Checks if a product is available in stock.
- **Inventory Updates:** Handles stock increments or decrements (e.g., after a purchase or restock).

### 2. Product
The core product information is handled by this service.
- **Product Management:** Manages product names, descriptions, and **SKUs** (Stock Keeping Units).
- **CRUD Operations:** Handles adding new products or updating existing product details.

### 3. User
Responsible for managing user profiles and related data.
- **Data Persistence:** Safely stores and manages user information.
- **Profile & Roles:** Handles profile updates and User Role Management (RBAC).

### 4. Auth Service
The security gateway for the application.
- **Identity Management:** Handles user registration, login, and multi-factor authentication (MFA).
- **Token Service:** Issues and verifies JWT tokens for secure inter-service communication.

### 5. Email Service
Handles all asynchronous communication with users.
- **Transactional Messaging:** Sends system-generated emails (e.g., Verify Email, Order Receipts).
- **Template Management:** Manages dynamic email templates for consistent branding.