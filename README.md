# g-CRM Enterprise Suite

Enterprise Multi-Tenant Customer Relationship Management (CRM) platform engineered for **Gitakshmi Technologies Private Limited**.

---

## Workspace Structure

```
G---AXIS-CRM/
├── client/                 # React 19 + Tailwind CSS frontend application (untouched)
├── server/                 # Express + MySQL 8.0 + Sequelize ORM backend
│   ├── common/
│   │   └── helpers/        # Response formatters, code sequences, DD/MM/YYYY date utilities
│   ├── config/             # Database, server, and environment configuration
│   ├── database/
│   │   ├── migrations/     # Sequelize migrations (29 enterprise CRM tables)
│   │   ├── seeders/        # Master reference and initial staff/leads seeders
│   │   └── models/         # Central Sequelize models with relational associations
│   ├── middlewares/        # Rate limiting, CORS
│   └── modules/            # Modular domain services, controllers, and routes
│       ├── leads/          # Leads lifecycle, deduplication, conversion
│       ├── accounts/       # Client company accounts
│       ├── contacts/       # Client contact persons
│       ├── deals/          # Deals & sales pipeline
│       └── masters/        # Reference drop-downs and lookup options
└── server/README.md        # Comprehensive backend API documentation & changelog
```

---

## Getting Started (Backend)

```bash
# 1. Install dependencies
cd server
npm install

# 2. Database migrations & seeding (MySQL running on 127.0.0.1:3306)
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

# 3. Start development server
npm run dev
```

The backend server runs on `http://localhost:5000/api`.
For detailed API documentation, please refer to [server/README.md](file:///c:/Users/DELL/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/Projects/G---AXIS-CRM/server/README.md).

