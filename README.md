# G-AXIS ERP - Multi-Tenant Architecture & Database Documentation

## Multi-Tenant Database Architecture Overview (v2.0)

The system uses an isolated multi-tenant architecture designed to scale seamlessly across organizations while maintaining complete data separation and centralized administrative control.

```
g_axis_main                     (Super Admin Control Plane DB - Single Instance)
      |
      +-- org_gitakshmi         (Gitakshmi's internal CRM DB - Organization 1)
      |
      +-- org_<code>            (Dedicated isolated DB provisioned for each new client)
```

---

## Strict Naming Conventions

### 1. Table Naming: `productName_tableName` / `layer_tableName`
- Platform tables: `gax_super_admins`, `gax_organisations`, `gax_products`, `gax_modules`, `gax_plans`, `gax_subscriptions`, `gax_licences`, `gax_tenant_users`, `gax_countries`, `gax_states`, `gax_cities`, `gax_org_types`, `gax_industries`, `gax_onboarding_requests`, `gax_audit_logs`
- Tenant Core tables: `core_settings`, `core_branches`, `core_departments`, `core_users`, `core_user_products`, `core_actions`, `core_org_modules`, `core_permissions`, `core_roles`, `core_role_permissions`, `core_user_roles`, `core_user_branches`, `core_user_permission_overrides`, `core_audit_logs`, `core_migrations`
- Tenant CRM tables: `crm_leads`, `crm_followups`, `crm_accounts`, `crm_contacts`, `crm_deals`, `crm_tasks`

### 2. Column / Field Naming: `tableInitials_fieldName`
Every field in every table starts with meaningful table initials (NO bare fields like `name`, `status`, `phone`, `id`):
- `crm_leads` &rarr; `lds_id`, `lds_lead_no`, `lds_company`, `lds_contact`, `lds_email`, `lds_phone`, `lds_source`, `lds_website`, `lds_industry_id`, `lds_city_id`, `lds_requirement`, `lds_exp_value`, `lds_status`, `lds_lost_reason`, `lds_branch_id`, `lds_assigned_to`, `lds_created_by`, `lds_updated_by`, `lds_created_at`, `lds_updated_at`
- `crm_contacts` &rarr; `cnt_id`, `cnt_account_id`, `cnt_name`, `cnt_designation`, `cnt_email`, `cnt_phone`, `cnt_is_primary`, `cnt_created_by`, `cnt_created_at`, `cnt_updated_at`
- `crm_accounts` &rarr; `acc_id`, `acc_no`, `acc_company`, `acc_industry_id`, `acc_email`, `acc_phone`, `acc_gst_no`, `acc_address`, `acc_country_id`, `acc_state_id`, `acc_city_id`, `acc_lead_id`, `acc_conv_org_id`, `acc_branch_id`, `acc_owner_id`, `acc_created_by`, `acc_created_at`, `acc_updated_at`
- `crm_deals` &rarr; `deal_id`, `deal_no`, `deal_title`, `deal_account_id`, `deal_lead_id`, `deal_product_id`, `deal_plan_id`, `deal_user_count`, `deal_value`, `deal_stage`, `deal_probability`, `deal_close_date`, `deal_closed_at`, `deal_lost_reason`, `deal_onboard_req_id`, `deal_branch_id`, `deal_owner_id`, `deal_created_by`, `deal_created_at`, `deal_updated_at`
- `crm_tasks` &rarr; `tsk_id`, `tsk_title`, `tsk_description`, `tsk_rel_type`, `tsk_rel_id`, `tsk_due_at`, `tsk_priority`, `tsk_status`, `tsk_assigned_to`, `tsk_created_by`, `tsk_created_at`, `tsk_updated_at`
- `crm_followups` &rarr; `flw_id`, `flw_lead_id`, `flw_deal_id`, `flw_type`, `flw_at`, `flw_notes`, `flw_outcome`, `flw_next_at`, `flw_status`, `flw_assigned_to`, `flw_created_by`, `flw_created_at`, `flw_updated_at`
- `core_users` &rarr; `usr_id`, `usr_employee_code`, `usr_name`, `usr_email`, `usr_phone`, `usr_password_hash`, `usr_department_id`, `usr_reporting_to`, `usr_status`, `usr_created_at`, `usr_updated_at`
- `core_user_products` &rarr; `cup_id`, `cup_user_id`, `cup_product_id`, `cup_status`, `cup_created_at`, `cup_updated_at`
- `core_roles` &rarr; `rol_id`, `rol_name`, `rol_description`, `rol_data_scope`, `rol_status`, `rol_created_by`, `rol_created_at`, `rol_updated_at`
- `gax_tenant_users` &rarr; `tnu_id`, `tnu_org_id`, `tnu_core_user_id`, `tnu_email`, `tnu_is_default`, `tnu_status`, `tnu_created_at`, `tnu_updated_at`
- `gax_super_admins` &rarr; `adm_id`, `adm_name`, `adm_email`, `adm_phone`, `adm_password_hash`, `adm_mfa_enabled`, `adm_mfa_secret`, `adm_status`, `adm_last_login_at`, `adm_created_at`, `adm_updated_at`
- `gax_organisations` &rarr; `org_id`, `org_code`, `org_name`, `org_legal_name`, `org_db_name`, `org_db_host`, `org_db_port`, `org_email`, `org_phone`, `org_website`, `org_gst_no`, `org_pan_no`, `org_address_line1`, `org_address_line2`, `org_country_id`, `org_state_id`, `org_city_id`, `org_pincode`, `org_logo_url`, `org_status`, `org_activated_at`, `org_suspended_at`, `org_remarks`, `org_created_by`, `org_created_at`, `org_updated_at`

---

## Directory Structure

```
server/
├── modules/
│   └── crm/                                        # CRM Product Modules
│       ├── leads/                                  # Leads Module
│       │   ├── leads.routes.js                     # GET /api/crm/leads
│       │   ├── leads.controller.js                 # getLeads controller
│       │   └── leads.service.js                    # getLeads service
│       ├── contacts/                               # Contacts Module (scaffolded)
│       │   ├── contacts.routes.js
│       │   ├── contacts.controller.js
│       │   └── contacts.service.js
│       └── deals/                                  # Deals Module (scaffolded)
│           ├── deals.routes.js
│           ├── deals.controller.js
│           └── deals.service.js
├── database/
│   ├── migrations/
│   │   ├── gaxis/                                  # Control plane migrations (g-axis-main)
│   │   │   ├── 001-create-gax-super-admins.js
│   │   │   ├── 002-create-gax-lookups.js
│   │   │   ├── 003-create-gax-products-modules.js
│   │   │   ├── 004-create-gax-organisations-subscriptions.js
│   │   │   ├── 005-create-gax-tenant-users.js
│   │   │   └── 006-create-gax-onboarding-audit.js
│   │   └── org/                                    # Tenant migrations template (org_gitakshmi, org_<code>)
│   │       ├── 001-create-core-settings-branches.js
│   │       ├── 002-create-core-users-actions.js
│   │       ├── 003-create-core-permissions-roles.js
│   │       ├── 004-create-core-audit-migrations.js
│   │       ├── 005-create-crm-leads-followups.js
│   │       ├── 006-create-crm-accounts-contacts.js
│   │       └── 007-create-crm-deals-tasks.js
│   ├── seeders/
│   │   ├── gaxis/                                  # Control plane seeders
│   │   │   ├── 001-seed-gax-super-admins.js
│   │   │   ├── 002-seed-gax-lookups.js
│   │   │   ├── 003-seed-gax-products-modules.js
│   │   │   └── 004-seed-gax-gitakshmi-org.js
│   │   └── org/                                    # Tenant seeders
│   │       ├── 001-seed-core-settings-branches.js
│   │       ├── 002-seed-core-actions-roles-permissions.js
│   │       ├── 003-seed-core-users.js
│   │       └── 004-seed-crm-initial-data.js
│   └── models/
│       ├── gaxis/                                  # Sequelize models for g_axis_main
│       │   ├── SuperAdmin.js
│       │   ├── Organisation.js
│       │   ├── Product.js
│       │   ├── Module.js
│       │   ├── Plan.js
│       │   ├── Subscription.js
│       │   ├── Licence.js
│       │   ├── TenantUser.js
│       │   ├── Lookups.js
│       │   ├── OnboardingRequest.js
│       │   └── AuditLog.js
│       ├── org/                                    # Sequelize models for org_<code>
│       │   ├── CoreSetting.js
│       │   ├── CoreBranch.js
│       │   ├── CoreDepartment.js
│       │   ├── CoreUser.js
│       │   ├── CoreUserProduct.js
│       │   ├── CoreAction.js
│       │   ├── CoreOrgModule.js
│       │   ├── CorePermission.js
│       │   ├── CoreRole.js
│       │   ├── CoreAuditLog.js
│       │   ├── CrmLead.js
│       │   ├── CrmFollowup.js
│       │   ├── CrmAccount.js
│       │   ├── CrmContact.js
│       │   ├── CrmDeal.js
│       │   └── CrmTask.js
│       └── index.js                                # Model factory (initGaxisModels, initOrgModels)
└── scripts/
    └── setup-databases.js                          # Provisioning, migration, and seeder automation script
```

---

## How to Provision and Migrate Local Databases

To create the databases, apply all migrations, and seed initial data:

```bash
cd server
node scripts/setup-databases.js
```

---

## Changelog & Cleanups

### Module Restructuring & Legacy Cleanup
- **Removed Legacy Modules:** Deleted deprecated flat folders (`server/modules/leads/`, `server/modules/accounts/`, `server/modules/auth/`, and `server/modules/masters/`).
- **Active CRM Architecture:** All CRM logic is cleanly organized under `server/modules/crm/`:
  - `server/modules/crm/leads/` (`leads.routes.js`, `leads.controller.js`, `leads.service.js`)
  - `server/modules/crm/contacts/` (`contacts.routes.js`, `contacts.controller.js`, `contacts.service.js`)
  - `server/modules/crm/deals/` (`deals.routes.js`, `deals.controller.js`, `deals.service.js`)
- **Server Entrypoint:** `server/server.js` mounts `app.use('/api/crm/leads', crmLeadsRoutes)` and alias `app.use('/api/leads', crmLeadsRoutes)`.

