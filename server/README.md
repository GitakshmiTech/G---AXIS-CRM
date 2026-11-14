# g-CRM Enterprise Backend Documentation & Changelog

This document details the backend architecture, database schema, modular structure, and API endpoints for **g-CRM** (Gitakshmi Technologies Private Limited).

---

## 1. Architecture Overview

- **Runtime**: Node.js (CommonJS, Express 5)
- **Database**: MySQL 8.0 via Sequelize ORM 6
- **Architecture Pattern**: Domain-Driven Modular Layer (`modules/<domain>/`) with separation of concerns:
  - `models/`: Database schema and associations
  - `controllers/`: HTTP parsing, input validation, and standardized JSON responses
  - `services/`: Core business logic, atomic transactions, sequential code generation, and audit logging
  - `routes/`: Express endpoint mappings
  - `common/helpers/`: Cross-cutting helpers (responses, atomic code sequencing, DD/MM/YYYY date formatting)

---

## 2. Database Schema & Migrations

Two comprehensive migration scripts and one seeder script initialize 29 enterprise CRM tables:

### Migrations
1. `20261112000001-create-crm-core-masters.js`
   - Master reference tables: `roles`, `departments`, `branches`, `sales_territories`, `staff`, `code_sequences`, `lead_sources`, `lead_creation_methods`, `lead_statuses`, `deal_stages`, `industry_tiers`, `industries`, `account_types`, `products`, `product_plans`, `lost_reasons`, `activity_types`.
2. `20261112000002-create-crm-core-entities.js`
   - Core transactional tables: `leads`, `lead_product_interests`, `lead_status_history`, `accounts`, `contacts`, `deals`, `deal_stage_history`, `activities`, `notes`, `audit_logs`.

### Seeders
- `20261112000001-seed-initial-crm-data.js`
  - Staff members (Arthur Pendelton, Marcus Vance, Alex Rivera, Sarah Jenkins).
  - Pre-seeded sequence counters (`LD-`, `ACC-`, `CNT-`, `DL-`).
  - Master dropdown options (6 lead statuses, 6 lead sources, 9 deal stages, 3 products, industries).
  - Seeded initial leads (`LD-000001` Sarah Lin, `LD-000002` Elena Rostova).

---

## 3. Registered API Endpoints

All endpoints are prefixed with `/api`.

### A. Leads (`/api/leads`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/leads` | Paginated, searchable, and filtered leads (`page`, `limit`, `search`, `stage`, `priority`, `source`) |
| `POST` | `/api/leads` | Create new lead with collision-free sequential code (`LD-00000X`) |
| `POST` | `/api/leads/check-duplicate` | Real-time deduplication check by email and phone |
| `GET` | `/api/leads/:id` | Fetch full lead profile with owner, activities, notes, and converted account pointers |
| `PUT` | `/api/leads/:id` | Update lead fields with audit logging |
| `POST` | `/api/leads/:id/convert` | **Atomic Conversion**: Generates Account (`ACC-`), Contact (`CNT-`), and Deal (`DL-`), marks Lead as `Converted`, and writes audit trail in a single database transaction |
| `GET` | `/api/leads/:id/notes` | Get comments/notes for lead |
| `POST` | `/api/leads/:id/notes` | Add note/comment to lead |
| `GET` | `/api/leads/:id/activities` | Get activity timeline for lead |
| `POST` | `/api/leads/:id/activities` | Log new activity event for lead |

### B. Accounts (`/api/accounts`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/accounts` | Paginated list of client companies with contacts and deals count |
| `POST` | `/api/accounts` | Direct client company creation (`ACC-00000X`) |
| `GET` | `/api/accounts/:id` | Fetch account details, associated contacts, and linked deals |
| `PUT` | `/api/accounts/:id` | Update account information |

### C. Contacts (`/api/contacts`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/contacts` | Paginated list of contacts with parent account details |
| `POST` | `/api/contacts` | Create standalone contact (`CNT-00000X`) |
| `GET` | `/api/contacts/:id` | Fetch contact details with account relationship |
| `PUT` | `/api/contacts/:id` | Update contact information |

### D. Deals (`/api/deals`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/deals` | List deals with account, contact, and product associations |
| `GET` | `/api/deals/pipeline` | Pipeline summary grouped by stage with deal counts and total expected values |
| `GET` | `/api/deals/:id` | Fetch single deal details |
| `PUT` | `/api/deals/:id` | Update deal values, dates, or details |
| `PATCH` | `/api/deals/:id/stage` | Move deal through pipeline stages (updates probability, triggers Won/Lost status) |

### E. Authentication & Staff (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user credentials and return signed JWT session with role |
| `GET` | `/api/auth/me` | Fetch active authenticated user profile |
| `GET` | `/api/auth/staff` | Active staff directory for record assignment dropdowns |

### F. Masters & Options (`/api/masters`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/masters/lead-options` | Dynamic dropdown lists for stages, sources, industries, products, deal stages, and staff |

---

## 4. Changelog

### Version 1.1.0 (2026-11-13)
- **Role-Based Authentication & JWT Session**:
  - Implemented `server/modules/auth/` (`auth.service.js`, `auth.controller.js`, `auth.routes.js`).
  - Added `bcryptjs` password validation and `jsonwebtoken` token issuing (`POST /api/auth/login`, `GET /api/auth/me`).
  - Created `Role` model (`server/database/models/Role.js`) associated with `Staff`.
- **Row-Level Security & Data Scoping**:
  - Created centralized scope helper `server/common/helpers/scope.helper.js` (`buildRowScope`, `canAccessRecord`).
  - Integrated row-level scoping into `leads`, `deals`, `accounts`, and `contacts` services:
    - **`BDE`**: Strictly restricted to viewing and managing records assigned to their own staff ID.
    - **`SALES_MANAGER`**: Dynamically scopes queries to their own records plus all records owned by their direct/indirect reporting team members (`subordinateIds`).
    - **`SUPER_ADMIN`**: Full enterprise-wide visibility with unrestricted access across all records.
- **Security Middleware**:
  - Implemented `server/middlewares/auth.middleware.js` with `authenticate`, `optionalAuth`, and `authorizeRoles`.
  - Added smart development fallback (`x-staff-id` header or dev default) while enforcing strict JWT in production.
- **Frontend Integration**:
  - Created `client/src/services/authService.js`.
  - Updated `client/src/services/api.js` to automatically attach Bearer token to headers.
  - Connected `LoginForm.jsx` to live `POST /api/auth/login` endpoint with loading states and error feedback.

### Version 1.0.2 (2026-11-13)
- Refactored monolithic migrations into 10 clean, focused, single-domain migration files (`20261112000001` to `20261112000010`).
- Split seeders into modular files:
  - `20261112000001-seed-tenant-masters.js`: Base operational lookups, roles, statuses, and code sequences reusable by both primary and new tenant client databases.
  - `20261112000002-seed-internal-staff.js`: Gitakshmi internal team members (host CRM only).
  - `20261112000003-seed-sample-leads.js`: Initial sample prospect records.
- Re-verified complete database migration and seed pipeline with 100% test success.

### Version 1.0.1 (2026-11-13)
- Removed redundant `server/modules/leads/models/` folder and `leads.model.js`.
- Standardized `leads.service.js` model imports directly from centralized `server/database/models/index.js`, matching `accounts`, `contacts`, `deals`, and `masters` modules.
- Added flexible payload field normalization in `leads.controller.js` and `leads.service.js` supporting both camelCase and snake_case aliases.

### Version 1.0.0 (2026-11-12)
- Initialized core MySQL migrations and seeders for 29 enterprise CRM tables.
- Implemented Sequelize models for `Lead`, `Account`, `Contact`, `Deal`, `Staff`, `LeadStatus`, `LeadSource`, `Industry`, `Product`, `DealStage`, `Activity`, `Note`, and `AuditLog`.
- Created atomic code sequence generator helper using `SELECT ... FOR UPDATE` row locks.
- Implemented `leads`, `accounts`, `contacts`, `deals`, and `masters` modules with services, controllers, and routes.
- Added strict `DD/MM/YYYY` date parsing and formatting utility (`date.helper.js`).
- Wired all 5 modules into `server.js` with rate limiting, CORS support, and error handling.
- Conducted full automated end-to-end integration tests across all route endpoints.

