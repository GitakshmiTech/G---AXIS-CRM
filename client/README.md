# React + Vite

## CRM Modules Architecture & API Verification: Sequential Primary/Foreign Keys & Employee-Based Team (25/11/2026)

- **Sequential Integer Primary & Foreign Keys (Zero UUIDs in CRM)**:
  - **CRM Quotations Service (`quotations.service.js`)**: Replaced all `randomUUID()` usages with atomic sequential sequence IDs via `getNextSequenceId({ tableName: 'crm_quotations' / 'crm_quotation_events' })`. Quotations now generate clean integer IDs (`quo_id: '1'`, `quo_root_id: '1'`) and clean human-readable codes (`quo_no: 'QT-0001'`).
  - **CRM Leads Service (`leads.service.js`)**: Removed static mock user checks (e.g. `usr-gitakshmi-admin-001`). Implemented dynamic employee & creator resolution via `resolveCreatorId` and `validateActiveUser`, ensuring `lds_assigned_to` and `lds_created_by` persist simple numeric integer IDs (`'1'`, `'2'`).
  - **CRM Deals Service (`deals.service.js`)**: Ensured all `deal_id`, `deal_owner_id`, and `deal_created_by` store clean sequential integers. Resolved deal owner names directly from `CoreEmployee` with fallback to `CoreUser`. Enabled both `POST` and `PATCH` methods for `/:id/assign`.
  - **CRM Accounts & Contacts Services (`accounts.service.js`, `contacts.service.js`)**: Linked account owners to `CoreEmployee` records. Ensured manager/admin roles (`'admin'`, `'client admin'`, `'sales manager'`) have full access across the tenant, and contacts resolve correctly.
  - **Lead Conversion Flow (`leads.service.js -> convertLead`)**: Converts qualified leads into `CrmAccount`, `CrmContact`, and `CrmDeal` in a single ACID transaction with sequential IDs (`acc_id: '2'`, `cnt_id: '2'`, `deal_id: '2'`), eliminating random strings and UUIDs.

- **Dynamic Team Member Provisioning & CoreEmployee Integration (Requirement 3)**:
  - **CRM Team Service (`team.service.js`)**:
    - **`createTeamMember`**: Directly inserts new team members into the `core_employees` table (`emp_code`, `emp_first_name`, `emp_last_name`, `emp_email`, `emp_contact_number`, `emp_status`, `emp_role_id`) with clean sequential integer primary keys (`emp_id`). Also provisions authentication credentials in `core_users` with matching simple numeric IDs.
    - **`listTeamMembers`**: Queries team members directly from `core_employees` table as primary source of truth, returning clean codes (`EMP-001`), simple integer IDs (`'1'`), and aggregated pipeline metrics (`assignedLeads`, `activeDeals`, `wonRevenue`).
    - **`team.validation.js` & `leads.validation.js`**: Relaxed strict unknown field constraints (`.unknown(true)`) so standard frontend fields (`name`, `territory`, `notes`, `contact`) are accepted seamlessly without 400 validation failures.

- **Frontend Client Cleanup & Zero Static Data (`client/src`)**:
  - **`leadsService.js` & `dealsService.js`**: Removed legacy hardcoded static mock comparisons (`usr-bde-01`, `usr-admin-01`, `usr-sales-01`). Dynamic IDs passed from selected team members are passed cleanly to the backend.
  - **`AddLeadDrawer.jsx`**: Dynamic BDE selection dropdown loads active team members directly from `fetchTeamMembers()` (`GET /api/crm/team`) without dummy fallbacks.
  - **`api.js`**: Strict single-token policy enforced; strictly uses `accessToken` from `localStorage`. Zero mock token creation.

- **Automated End-to-End Verification (`org_auraintera` with user `aura@yopmail.com`)**:
  - Executed automated integration test suite against live running backend (`localhost:5000`):
    - `GET /api/crm/team`: PASSED (Returns active employee `Nikul P` with `id: "1"`, `code: "EMP-001"`).
    - `POST /api/crm/team`: PASSED (Created member in `core_employees` with sequential integer ID `emp_id: 2`).
    - `GET /api/crm/leads`: PASSED.
    - `POST /api/crm/leads`: PASSED (Created lead with simple integer `lds_id: "3"` and `lds_assigned_to: "1"`).
    - `GET /api/crm/leads/:id`: PASSED.
    - `POST /api/crm/leads/:id/activities`: PASSED (Sequential `flw_id: "1"`).
    - `POST /api/crm/leads/:id/convert`: PASSED (Converted lead to Account `acc_id: "2"`, Contact `cnt_id: "2"`, Deal `deal_id: "2"`).
    - `GET /api/crm/accounts`: PASSED.
    - `GET /api/crm/contacts`: PASSED.
    - `GET /api/crm/deals`: PASSED.
    - `POST /api/crm/deals`: PASSED (`deal_id: "3"`, `deal_owner_id: "1"`).
    - `PATCH /api/crm/deals/:id/assign`: PASSED.
    - `GET /api/crm/quotations`: PASSED.
    - `POST /api/crm/quotations`: PASSED (Created quotation with sequential integer `quo_id: "1"`, NO UUID).
    - `GET /api/crm/reports/funnel-kpis`: PASSED.
  - Client production build (`npm --prefix client run build`) completed successfully with 0 errors.

## CRM Lead Creation & API Ecosystem Audit: Zero Static Data & Dynamic Role Integrity (25/11/2026)

- **Resolved "Selected employee is not active or does not exist" Error**:
  - **Identified Root Causes**:
    1. **Missing CoreUser Model Association**: In `CoreUser.js`, `CoreUser` lacked `hasMany(CoreUserRole, { as: 'userRoles' })`. This caused `GET /crm/team` to fail with a `SequelizeEagerLoadingError: CoreUserRole is not associated to CoreUser!`, resulting in empty BDE selection lists in frontend lead forms.
    2. **Unseeded Employee Roster in Tenant DB**: The database `core_users` table had only the single organization admin record (`usr-gitakshmi-admin-001`), whereas default session mappings and seeders expected active employees `1` (Admin), `2` (Sales Manager), and `3` (BDE).
    3. **Resilient User Validation in Backend Leads Service**: In `leads.service.js`, enhanced `validateActiveUser` to resolve users across both numeric and UUID identifiers (`'1'`, `'2'`, `'3'`, `'usr-gitakshmi-admin-001'`, `usr_employee_code`), and gracefully accept empty/unassigned values (`null`) for unassigned prospect ingestion.
    4. **Sequence ID Conflict Resolution (`ER_DUP_ENTRY`)**: Fixed `getNextSequenceId` in `moduleCode.helper.js` where initial INSERT failed to add `count`, preventing primary key collisions on `crm_leads` and other CRM entities.
- **Complete End-to-End CRM Modules API Audit (Frontend & Backend)**:
  - **Leads (`/api/crm/leads`)**: Verified `GET /crm/leads` and `POST /crm/leads`. Leads now create cleanly with auto-generated sequential codes (e.g. `LD-0005`), sanitized currency values, automatic URL normalization (`https://`), and correct assignee assignment.
  - **Team (`/api/crm/team`)**: Verified `GET /crm/team`. Returns all active team members with dynamic workload telemetry (`assignedLeads`, `activeDeals`, `wonRevenue`) in O(1) batched queries.
  - **Accounts (`/api/crm/accounts`)**: Fully compliant; loads accounts and lookup industries without static mock fallbacks.
  - **Contacts (`/api/crm/contacts`)**: Verified `GET /crm/contacts` and update handlers. Cleared pre-filled dummy strings in drawer forms per Rule #23.
  - **Deals (`/api/crm/deals`)**: Verified `GET /crm/deals` and `POST /crm/deals`. Automatically resolves authentic owner IDs and enforces valid deal stages (`prospect`, `qualification`, `proposal`, `negotiation`, `closed won`, `closed lost`).
  - **Quotations (`/api/crm/quotations`)**: Verified `GET /crm/quotations` and `POST /crm/quotations` with item calculations and sequential numbers (`QT-0001`).
  - **Reports & Analytics (`/api/crm/reports/*`)**: Audited all 4 reporting endpoints (`/funnel-kpis`, `/filter-options`, `/team-performance`, `/lead-source-attribution`). All return valid HTTP 200 data.
- **Strict Single-Token Authentication Policy**:
  - Removed all temporary/mock token keys (such as `gcrm-mock-jwt-token`) from `api.js`, `authSlice.js`, and `profileService.js`.
  - The application strictly and exclusively uses `accessToken` stored in `localStorage`.


## Report & Analytics Filter Selection Bug Fix & Dual-Layer Filter Architecture (24/11/2026)

- **Root Cause & Crash Resolution (`Objects are not valid as a React child`)**:
  - **Identified Failure**: In [TableFilterSelect.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/common/Table/TableFilterSelect.jsx), selecting any filter option dispatched a synthetic event `{ target: { value, name }, currentTarget: ... }`. When [ReportAnalytics.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/ReportAnalytics.jsx) passed `onChange={setDateFilter}`, `setDateFilter` stored the event object directly into state. Consequently, `<TableFilterSelect value={dateFilter}>` received the object and evaluated `displayLabel = value`, causing React to throw `Uncaught Error: Objects are not valid as a React child (found: object with keys {target, currentTarget})`.
  - **Bulletproof `cleanValue` & `displayLabel` Resolution**:
    - In [TableFilterSelect.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/common/Table/TableFilterSelect.jsx), added safe resolution: `cleanValue` automatically unpacks `value?.target?.value ?? value` if an event object is received.
    - Guaranteed `displayLabel` always returns a string (matching option label, clean string, or `effectivePlaceholder`), strictly preventing non-primitive objects from being rendered into JSX.
  - **Sanitized Callback Handlers**:
    - In [ReportAnalytics.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/ReportAnalytics.jsx), wrapped all 4 filter callbacks (`dateFilter`, `bdeFilter`, `sourceFilter`, `statusFilter`) with clean value extraction (`e?.target ? e.target.value : e`) and reset pagination to page 1 on filter changes.
- **FRD-Compliant Dynamic Filtering**:
  - Implemented dual-layer filtering across both API query parameters (`fetchTeamPerformanceReport` & `fetchLeadSourceAttributionReport`) and client-side reactive filtering in `filteredTeamRows` and `filteredSourceRows`.
  - Selecting any BDE (e.g. `Dhruv`, `Kishan`, `Rohan Sharma`, `Sarah Jenkins`), Date Range (`This Quarter`, `This Month`, etc.), or Lead Channel instantly updates both the table rows and execution totals (`TOTAL EXECUTION | leads | conversion | pipeline | won revenue`) in real-time.


## Team Member Deactivation Modal & Workload Reassignment Dropdown Polish (24/11/2026)

- **FRD-Compliant Workload Reassignment Scoping (FRD Section 11.25)**:
  - In [TeamMemberDetail.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/TeamMemberDetail.jsx) and [ViewMemberDrawer.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/modules/team/ViewMemberDrawer.jsx), restricted the reassignment roster strictly to active sales personnel (`BDE`, `Sales Executive`, `Senior Sales Executive`, and `Sales Manager`).
  - **Eliminated Administrative Non-Sales Accounts**: Excluded administrative personnel (`Arthur Pendelton (CRM Admin)`, `Super Admin`, etc.) who do not manage sales pipelines or customer deals.
  - Automatically excludes the member currently being deactivated and any inactive team members.
  - Added empty state feedback when no other active sales colleagues are available to receive transferred workloads.
- **Eliminated Dropdown Menu Button Collision**:
  - Resized the deactivation modal container from a cramped `max-w-md` box to a spacious, balanced dialog (`max-w-[500px] p-6`).
  - Restructured the internal workload card with a dedicated 2-column metrics summary (`Active Leads to Transfer`, `Open Deals to Transfer`), providing generous vertical clearance so floating dropdown options never obscure or collide with the bottom `Cancel` and `Confirm Deactivation` action buttons.
- **High-Contrast Dropdown Menu Surface & Removed Ugly Blue Text Highlight**:
  - In [DropdownInput.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/common/inputs/DropdownInput.jsx), removed `inputRef.current?.select()`, eliminating the harsh native browser blue text selection highlight that appeared when focusing the dropdown input.
  - Replaced borderless grey dropdown menu styling (`bg-gray border-none`) with a crisp, high-contrast flat surface: `bg-white-100 border border-stroke rounded-[7px]`, ensuring razor-sharp boundary definition and effortless readability against any card background (Rule #13, Rule #20, Rule #21).
  - In [TeamMemberDetail.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/TeamMemberDetail.jsx), styled the reassignment combobox input with `bg-white-100 border-b-2 border-stroke/80` for elevated visual hierarchy inside the grey workload card.
- **Enterprise Modal Architecture Alignment**:
  - Standardized the dialog header with a circular alert badge (`AlertTriangle`, `bg-alert/10 text-alert`), title, employee metadata subtitle (`{name} · {role}`), and top-right `X` close control matching [QuotationApprovalModal.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/modules/quotations/QuotationApprovalModal.jsx).


## Mobile Viewport & Cross-Tab Data Table Responsive Optimization (24/11/2026)

- **Eliminated Mobile Table Horizontal Squishing & Single-Letter Word Wrapping**:
  - **Root Cause Resolution**:
    - Discovered and removed an intrusive CSS rule in `src/index.css` (`.crm-data-table-cell .truncate`) that forcibly applied `overflow: visible !important; overflow-wrap: anywhere; text-overflow: clip !important; white-space: normal !important;`. This rule was overriding standard truncation and causing names and text (e.g. `Hemang Chavda`, `Acme Global Solutions`, `EMP-002`) to break vertically character-by-character on narrow mobile viewports.
    - Fixed [DataTable.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/common/Table/DataTable.jsx) table sizing logic: `responsiveMinWidth` is now strictly enforced on the `<table>` element (`minWidth: Math.max(minWidth || 0, responsiveMinWidth || 780)`), preventing tables with 7–9 columns from collapsing into the 375px mobile screen.
    - In `DataTable.jsx`, removed `[overflow-wrap:anywhere]` from default cell formatting and attached `minWidth: columnWidth` to `<th ...>` headers, guaranteeing each column its minimum readable pixel allocation.
- **Hardware-Accelerated Native Mobile Touch Scrolling**:
  - Configured `overscroll-x-contain` and `[-webkit-overflow-scrolling:touch]` on `.data-table-viewport` in [DataTable.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/common/Table/DataTable.jsx) and the inner container of [TableContainer.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/common/Table/TableContainer.jsx).
  - Users on iOS Safari and Android Chrome can smoothly swipe horizontally across all columns with natural inertia, while sticky columns (`Code` / `EMP-...`) remain cleanly anchored on the left with solid backgrounds.
- **Responsive 3-Column KPI Metric Row on Mobile**:
  - In [MyTeam.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/MyTeam.jsx), transformed the top summary cards from vertically stacked full-width blocks (`grid-cols-1`) into a compact, responsive 3-column row (`grid-cols-3 gap-2 sm:gap-3`, `p-2 sm:p-3.5`). All 3 metrics (`Total Members`, `Active Members`, `Inactive Members`) now fit side-by-side on mobile, saving over 180px of vertical space and keeping the data table visible above the fold.
- **Mobile Responsive Tab Controls & Pill Switchers**:
  - In [ReportAnalytics.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/ReportAnalytics.jsx), optimized the `Team Performance` and `Lead Sources` tab switcher to `w-full sm:w-auto` with `flex-1` distribution on mobile, and enabled smooth horizontal touch scrolling on both analytics tables.
  - In [PillSwitcher.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/modules/configuration/PillSwitcher.jsx) and [EditProfile.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/EditProfile.jsx), added `max-w-full overflow-x-auto no-scrollbar` to prevent tab buttons from breaking or causing horizontal layout overflow.


## Login Page 100% Viewport Optimization & Responsive Glassmorphic Card Alignment (24/11/2026)

- **Eliminated Overflow Clipping on 100% Scale Laptop Screens**:
  - In [AuthLayout.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/layouts/AuthLayout.jsx), resolved the issue where the left-hand visual quote card and skyscraper background image (`Frame 172.png`) were cut off at the bottom of the viewport.
  - Replaced fixed, oversized outer padding (`p-16` / 128px vertical) with responsive scaling (`p-8 xl:p-12 2xl:p-14`).
  - Added a soft contrast overlay (`bg-primary/30 mix-blend-multiply`) ensuring architectural details and typography remain crisp and visible.
- **Optimized Glassmorphism Quote Card**:
  - Restructured the bottom quote card from an oversized `p-10 md:p-12` container down to a sleek, compact glass card (`p-5 xl:p-6 2xl:p-7 rounded-2xl xl:rounded-3xl max-w-xl`).
  - Resized Quote icons from `45px` to a balanced `24px`, and adjusted paragraph text to `text-xs sm:text-sm xl:text-base 2xl:text-lg`.
  - The quote card now sits comfortably in the lower third with ample breathing room, exposing the full enterprise skyscraper graphic without any vertical cutoff.
- **Centered Right-Hand Form Panel**:
  - In [LoginForm.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/modules/auth/LoginForm.jsx), [ForgotPasswordForm.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/modules/auth/ForgotPasswordForm.jsx), and [NewPasswordForm.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/modules/auth/NewPasswordForm.jsx), replaced bloated `pt-[40px] pb-[72px]` padding with balanced `py-6 px-6 sm:px-12` and centered the form vertically (`flex-1 flex flex-col justify-center`).
  - The entire page (brand header, background architecture, quote card, input fields, and copyright footer) fits 100% inside standard laptop viewports without scrolling or clipping.

## Unified Toast Error Notifications & Removal of Bulky Table Error Banners (24/11/2026)

- **Eliminated Bulky Inline Error Banners Across All Tables**:
  - Removed the oversized, intrusive `{error && <div role="alert" ...>}` pink/red alert banner (`mx-4 mt-3 py-3`) from all CRM directory modules:
    - [Leads.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Leads.jsx)
    - [Clients.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Clients.jsx)
    - [Contacts.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Contacts.jsx)
    - [Deals.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Deals.jsx)
    - [Quotations.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Quotations.jsx)
    - [ReportAnalytics.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/ReportAnalytics.jsx)
    - [MyTeam.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/MyTeam.jsx)
  - Tables now preserve their clean, medium visual vertical spacing, header alignments, and border styles without being squeezed or pushed down by bulky warning strips.
- **Centralized Toast-Based Error Reporting**:
  - Connected `useToast()` to display transient failures (such as `502 Bad Gateway`, server restarting, or offline states) in non-intrusive floating toasts with auto-dismissal.
  - In [api.js](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/services/api.js), converted raw `API Error: 502` into user-friendly diagnostic text: *"Backend service is unreachable (502). Please ensure server is running."*
- **Preserved Table & Empty State Integrity**:
  - When records fail to load due to a connection break, the `DataTable` gracefully renders a concise message (*"Unable to load records. Please check connection and retry."*) while keeping all table columns and toolbar filters intact.

## 100% Dynamic Telemetry, Zero Dummy Fallback & Senior Error/Empty State Architecture (24/11/2026)

- **Eliminated Dummy Data Fallbacks (100% Dynamic Backend Data)**:
  - In [teamService.js](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/services/teamService.js), removed `INITIAL_SALES_TEAM_DATA` fallback import and hardcoded member arrays (`Emily Carter`, `Raj Patel`, etc.). All data is now 100% dynamically sourced from the backend `/crm/team` API.
  - In [reportsService.js](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/services/reportsService.js), ensured errors cleanly propagate so UI components can handle genuine server states rather than masking failures.
- **Senior Developer Graceful Error State Architecture (502 & Network Failures)**:
  - Replaced crude error banners and raw `API Error: 502` text with structured, senior-developer error containers in [ReportAnalytics.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/ReportAnalytics.jsx) and [MyTeam.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/MyTeam.jsx).
  - Features circular alert badge (`AlertTriangle`), clear heading (`Reporting Service Temporarily Unavailable (502)`), informative explanation, and actionable "Try Again" (`RefreshCw` with live spinner) + "Reset Filters" controls.
  - Suppresses empty table footers and pagination controls during error states.
- **Structured Zero-Data Empty States & Summary Row Cleanup**:
  - Solved the awkward footer table display in [ReportAnalytics.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/ReportAnalytics.jsx): the summary `<tfoot>` (`TOTAL EXECUTION (0 BDES) | ... | ₹0 | TEAM TOTAL`) is now strictly rendered **only when active data rows exist** (`filteredTeamRows.length > 0` / `filteredSourceRows.length > 0`).
  - Added dedicated, centered empty states with contextual icons (`User` for Team, `Globe` for Channels), clean headings, helpful hints, and a quick "Clear all filters" button when filters are active.
  - Suppressed redundant `0 out of 0` pagination controls when data is empty.

## Lead Form Flow Reordering & Role-Based BDE Routing (24/11/2026)

- **Optimized Section Hierarchy**:
  - Reordered structured section cards in [AddLeadDrawer.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/modules/leads/AddLeadDrawer.jsx) to ensure a logical information flow:
    1. **Primary Contact Information** (Card 1, `z-30`): Stakeholder Name, Designation, Work Email, Contact Phone.
    2. **Organization Details & Commercial Scope** (Card 2, `z-25`): Company Name, Industry, Headcount Scale, Website, Expected Deal Value, and Business Requirement / Project Scope.
    3. **Lead Classification & BDE Assignment** (Card 3, `z-20`): Moved **after** Organization Details; houses Lead Code, Stage, Priority, Origination Channel / Lead Source, and Product Interest.
    4. **Geographical & Address Details** (Card 4, `z-15`): Office Street Address, Country, State, City, Postal PIN.
    5. **Supporting Documentation** (Card 5, `z-10`): Attached documents list & upload dropzone.
- **Role-Conditioned BDE Assignment Routing**:
  - Connected `useSelector((state) => state.auth)` to dynamically inspect user role (`sales` / `admin` vs `bde`).
  - **Sales Manager & Admin View**: The **Assign to BDE / Sales Executive** dropdown is visible and fully functional, allowing managers to allocate prospects across the team roster.
  - **BDE View**: The field is cleanly suppressed from the UI so BDEs cannot reassign leads; newly created leads automatically bind to their own creator ID.
- **Common Full-Page Form Design ([LeadForm.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/LeadForm.jsx))**:
  - Synchronized `/leads/:id/edit`, `/leads/new`, and `/leads/:id/view` (`http://localhost:5173/leads/3/edit`) with standardized top back navigation (`[ Back to Leads ]`), breadcrumb trail, and sticky action buttons (`Save Changes`, `Convert Lead`, `Deactivate Lead`).


## Report & Analytics Single-Line Filter Toolbar & Leads Table Theme Alignment (24/11/2026)

- **Leads Table Architecture & CRM Theme Alignment**:
  - Re-engineered [ReportAnalytics.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/ReportAnalytics.jsx) to match the Leads table structure (`TableContainer`, flat white card, borderless table header strip, alternating row hover, and bottom pagination).
  - Cleaned up page clutter: eliminated `REPORT_ID: SM-RPT-01`, `Synced · Data Sync: Real-time Reporting Engine (Updated 1m ago)`, `Audit Protocol: SOC-ISO-27001 compliant`, and redundant duplicate title blocks.
- **Unified Single-Line Filter & Action Toolbar**:
  - Consolidated all controls into a single horizontal toolbar row matching [Leads.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Leads.jsx):
    - Left side: Live search input (`Search BDE or channel...`) and a segmented report toggle (`Team Performance` / `Lead Sources`).
    - Right side: `Date Range`, `By BDE`, `By Lead Channel`, and `By Status` searchable dropdowns via [TableFilterSelect.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/common/Table/TableFilterSelect.jsx), animated [ResetFilterButton.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/common/buttons/ResetFilterButton.jsx), and [ExportButton.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/common/buttons/ExportButton.jsx) for CSV downloads.
  - Dropdowns trigger instant live data filtering without needing a separate 'Apply Filters' button.
- **TopHeader Synchronization**:
  - Restored standard [SalesLayout.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/layouts/SalesLayout.jsx) top header metadata (`Report & Analytics` title and operational subtitle) so the page matches `Lead Management`, `My Accounts`, and other primary CRM modules seamlessly.
- **Strict Rules Adherence**:
  - Zero drop-shadows (Rule #13), circular borderless avatars (Rule #24), 7px UI radius with 2px bottom border `border-b-2 border-stroke/80` (Rule #20), and `DD/MM/YYYY` date format (Rule #22).


## Report & Analytics UI Polish, BDE Scoping & Dropdown Overlay Fix (24/11/2026)

- **Lead Form Dropdown Overflow & Stacking Fix**:
  - In [AddLeadDrawer.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/modules/leads/AddLeadDrawer.jsx), replaced restrictive `overflow-hidden` with `overflow-visible relative` across all 5 structured section cards (`Lead Classification & BDE Assignment`, `Primary Contact Information`, `Organization Details`, `Geographical Details`, `Supporting Documentation`).
  - Added hierarchical cascading z-indexes (`z-30` down to `z-10`) so that floating dropdown menus (such as `Origination Channel / Lead Source` and `Primary Product Interest`) render cleanly above lower section cards without any clipping.
- **Team Performance Report BDE Role Scoping**:
  - In `G-Axis-Backend/modules/crm/reports/reports.service.js`, enhanced `getTeamPerformanceReport` and `getFilterOptions` to exclude administrative accounts (`CRM Admin`, `Admin`, `Super Admin`) and supervisory accounts (`Sales Manager`) from the BDE operational roster.
  - The BDE performance table now strictly displays direct reporting BDEs (`Sarah Jenkins`, `Dhruv`, `Rohan Sharma`), perfectly aligning with the supervisory scope and FRD Section 10 specification.
- **Header Synchronization & Common Back Navigation**:
  - In [SalesLayout.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/layouts/SalesLayout.jsx), suppressed duplicate top-level title rendering on `/analytics` routes to prevent redundant stacked headers.
  - In [ReportAnalytics.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/ReportAnalytics.jsx), integrated the standard [BackButton.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/common/buttons/BackButton.jsx) alongside the breadcrumbs (`Sales Operations > Reports & Analytics > Management Overview`) allowing seamless navigation back to Dashboard.
- **CRM Table Structure & Searchable Filter Integration**:
  - Replaced native `<select>` controls in the horizontal filter matrix with [TableFilterSelect.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/common/Table/TableFilterSelect.jsx) providing flat, square-surfaced, type-ahead searchable dropdowns (Rule #16, Rule #20, Rule #21).
  - Standardized table header strips with borderless cells, outer rounded corners (`rounded-l-[7px]`, `rounded-r-[7px]`), circular borderless avatars (Rule #24), and styled `View >` action buttons.


## Lead Form Section-Wise Architecture & Dynamic BDE Assignment (24/11/2026)

- **Dynamic BDE Assignment Option**:
  - Connected [AddLeadDrawer.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/modules/leads/AddLeadDrawer.jsx) to `fetchTeamMembers({ status: 'Active' })` to dynamically populate the **Assign to BDE / Sales Executive** dropdown with active sales executives (e.g., `Sarah Jenkins (EMP-003)`, `Marcus Vance (EMP-002)`, `Dhruv (EMP-105)`).
  - Updated [leadsService.js](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/services/leadsService.js) `mapLeadToApi` to forward `assignedTo` to the backend `lds_assigned_to` column on both create and update.
- **Section-Wise Structured Card Architecture**:
  - Redesigned the lead form from an unstructured flat list into five distinct, enterprise-grade section cards:
    1. **Lead Classification & BDE Assignment**: Lead Code (for edit/view), Assigned BDE / Sales Executive dropdown, Lead Stage (`New`, `Contacted`, `Qualified`, `Proposal`, `Negotiation`, `Won`, `Lost`), Priority Level, Origination Channel / Source, and Primary Product Interest.
    2. **Primary Contact Information**: Full Name, Job Designation, Work Email Address, and Contact Number with country selector.
    3. **Organization Details & Commercial Scope**: Organization / Company Name, Industry Vertical, Employee Headcount Scale, Company Website, Expected Deal Value (`₹`), and a dedicated multi-line `TextAreaInput` for Business Requirement / Project Scope.
    4. **Geographical & Address Details**: Street Address, Country, State, City, and Postal Code.
    5. **Supporting Documentation**: Attached documents list with download, preview, and delete triggers alongside drag-and-drop `UploadDropzone` (PNG, JPG, PDF up to 5MB, max 10 files).
  - **Full-Page Shell Enhancement ([LeadForm.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/LeadForm.jsx))**:
    - Added breadcrumb trail (`Lead Management > Add New Lead / Edit Lead`), clean page header, and sticky action footer with Back, Deactivate Lead, Convert Lead, and Save Lead.
  - **Rules Adherence**: Compliant with 0 drop-shadows (Rule #13), shared 7px radius token with 2px bottom borders `border-b-2 border-stroke/80` (Rule #20), and strict `DD/MM/YYYY` date format (Rule #22).

## Report & Analytics Management Unified Specification (Figma / Stitch & FRD Section 10) (24/11/2026)

- **Unified Dual-Section Management Architecture**:
  - Re-architected [ReportAnalytics.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/ReportAnalytics.jsx) to present **both core operational telemetry sections simultaneously** on a single unified screen as specified in the Stitch / Figma reference (`Report & Analytics Management - Sales Manager`):
    1. **Top Header & Breadcrumbs**:
       - Hierarchical trail: `Sales Operations > Reports & Analytics > Management Overview`.
       - Title: `Reports & Analytics Management` with upcoming phase footnote.
       - Dynamic pill badge: `SUPERVISORY SCOPE: X BDEs // Y Sources` reflecting live assigned count.
    2. **Horizontal Filter Matrix**:
       - Clean 4-filter grid controls: `DATE RANGE` (Fiscal Quarter, All Time, Month, Year), `ASSIGNED BDE` (Direct team roster), `LEAD CHANNEL` (Lead sources), and `PIPELINE STATUS` (New, Contacted, Qualified, Won, Lost).
       - Quick action triggers: `Apply Filters` (blue), `Reset` (restore defaults), and `Export CSV`.
    3. **Scope Information Strip**:
       - Context banner: `Scope: Showing X Direct Reporting BDEs across Y Verified G-CRM Lead Sources` with `MATCH CRITERIA: STRICT (ACTIVE TEAM ONLY)`.
    4. **Section #1 // TEAM PERFORMANCE REPORT**:
       - Executive roster table displaying BDE Name, Avatar with initials, Code badge (`EMP-xxx`), territory/tier subtext, Leads Handled, Conversion Rate % with animated progress bar, Pipeline Value (`₹`), and Won Revenue (`₹`).
       - Bottom Total Execution row summarizing total team leads, average conversion rate, total pipeline, and total won revenue.
       - `View >` button per row opening the detailed drill-down drawer.
    5. **Section #2 // LEAD SOURCE ATTRIBUTION & OUTCOME FUNNEL**:
       - Origination channel analysis with funnel steps indicator (`Lead Source > Qualified Leads > Deals > Won Deals > Revenue`).
       - Channel-wise rows featuring channel icons, `CHANNEL_ID`, Leads Intake, Qualified Leads (% intake), Deals Created, Won Deals, and Attributed Revenue (`₹`).
       - Bottom Aggregated Total row summarizing all active marketing/sales channels.
    6. **Bottom Compliance & Status Footer**:
       - Live synchronization indicator: `Synced · Data Sync: Real-time Reporting Engine (Updated 1m ago)` with green pulsing beacon.
       - Security compliance note: `Audit Protocol: SOC-ISO-27001 compliant`.
    7. **Slide-Out Drill-Down Drawer**:
       - Interactive reconciliation drawer displaying underlying leads and converted deals mapped directly to that executive or channel.

## Report & Analytics Module Architecture & API Integration (24/11/2026)

- **Complete FRD CRM-028 & Section 10 Alignment**:
  - Implemented the complete **Report & Analytics** module according to the g-CRM Functional Requirement Document (V1.1).
  - Built backend service, controller, and route layers under `modules/crm/reports/*` in `G-Axis-Backend`:
    - `GET /api/v1/crm/reports/funnel-kpis`: Real-time aggregate telemetry delivering Top Leads Intake, Qualified Leads (with drop-off rate %), Deals Created (with total pipeline value), Closed Won Deals (with stalled/lost count), and Attributed Revenue (with average deal size).
    - `GET /api/v1/crm/reports/team-performance`: Paginated sales executive performance report displaying BDE Code (`EMP-xxx`), Name, Avatar, Leads Handled, Conversion Rate %, Pipeline Value, and Won Revenue.
    - `GET /api/v1/crm/reports/lead-source-attribution`: Attribution and outcome funnel report across 7 channels (Inbound Demo, Website, Partner Referral, LinkedIn, Event, Cold Outreach) displaying intake, qualified count, deals created, won deals, attributed revenue, and win rates.
    - `GET /api/v1/crm/reports/drilldown/:type/:identifier`: Interactive reconciliation endpoint returning underlying leads and converted deals for any specific executive (`bde`) or attribution channel (`leadSource`).
    - `GET /api/v1/crm/reports/filter-options`: Dynamic metadata endpoint delivering active lead sources, date ranges, and executive rosters.
    - `GET /api/v1/crm/reports/team-performance/export` & `GET /api/v1/crm/reports/lead-source-attribution/export`: CSV generation endpoints with standard attachment headers.
  - Built frontend API service [reportsService.js](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/services/reportsService.js) and integrated into [ReportAnalytics.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/ReportAnalytics.jsx).
  - **Interactive Drill-Down Drawer**: On clicking the `ViewBtn` for any executive or channel, opens a right-side drawer showing telemetry totals, individual lead cards with creation dates in `DD/MM/YYYY`, and deal cards with values in `₹` and stage indicators.
  - **Role-Based Telemetry Scoping**: Supports CRM Admin (`admin@gitakshmi.com` / `Admin@123`) seeing global multi-branch performance and Sales Manager (`marcus@gitakshmi.com` / `Admin@123`) viewing authorized sales team performance.
  - **Strict Rules Adherence**: 100% Flat border design without drop-shadows (Rule #13), 7px UI radius token with 2px bottom border `border-b-2 border-stroke/80` (Rule #20), and strict `DD/MM/YYYY` date format (Rule #22).

## Mobile & Cross-Device UI Enhancements (24/11/2026)

- **Mobile Data Table Sizing & Header Visibility**:
  - Fixed mobile table viewport collapse where "Showing 1 out of 1 Entries" and "Showing 2 out of 2 Entries" appeared squeezed or without rows on small screens.
  - Standardized minimum heights and responsive proportions across `TableContainer.jsx` and `DataTable.jsx`, ensuring columns remain fully legible on mobile devices without crushing or vertical collapse.
- **Top Header Profile Dropdown Positioning**:
  - Adjusted dropdown menu alignment in `TopHeader.jsx` to prevent overflow or clipping off the right edge of mobile screens.
- **Monthly vs Yearly Revenue Filter Layout**:
  - Restructured `Monthly vs Yearly Revenue` header controls in `Dashboard.jsx` and `BarChart.jsx` so the `[Monthly] Yearly` toggle and the `2025` year dropdown align side-by-side in one compact row on mobile screens.

## Team Service Model Import Architecture Standardization (24/11/2026)

- **Standardized Model Import Flow in `team.service.js`**:
  - Eliminated `const modelsProxy = require('../../../database/models');` and the runtime `resolveModels()` helper from [team.service.js](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G-Axis-Backend/modules/crm/team/team.service.js).
  - Aligned model imports to match the standard convention established across `quotations.service.js`, `leads.service.js`, and `deals.service.js`:
    ```javascript
    const {
      CoreUser,
      CoreRole,
      CoreUserRole,
      CrmLead,
      CrmDeal,
      CrmAccount,
      CrmContact,
      CrmFollowup,
      CoreAuditLog
    } = require('../../../database/models');
    ```
  - Removed all redundant inline `resolveModels()` calls across `listTeamMembers`, `getTeamMember`, `createTeamMember`, `updateTeamMember`, and `deactivateTeamMember`.

## CRM Code Standardization & Sequential ID Architecture (23/11/2026)

- **Eliminated `GG_` Legacy Prefixes & Standardized Enterprise Identifiers**:
  - Replaced legacy `gg_account_`, `gg_lead_`, `gg_deal_`, and `gg_quote_` code prefixes across both backend and client with enterprise standard conventions:
    - **Accounts**: `ACC-0001`, `ACC-0002`, `ACC-0003`... (migrated existing `gg_account_001` to `ACC-0002`).
    - **Leads**: `LD-0001`, `LD-0002`, `LD-0003`... (migrated existing `gg_lead_001` to `LD-0003`).
    - **Deals**: `DL-0001`, `DL-0002`... (migrated existing `gg_deal_001` to `DL-0001`).
    - **Quotations**: `QT-0001`, `QT-0002`... (migrated existing `gg_quote_001` to `QT-0001`).
    - **Contacts**: `CNT-0001`, `CNT-0002`...
    - **Employees**: `EMP-001`, `EMP-002`, `EMP-003`, `EMP-104`, `EMP-105`...
  - In `moduleCode.helper.js`, configured canonical mapping in `PREFIX_MAP` and atomic sequence management in `crm_code_sequences`.
- **Eliminated Random UUIDs (`d90d9579-...`) in Primary Keys**:
  - Replaced `randomUUID()` across CRM model creation services (`leads.service.js`, `deals.service.js`, `quotations.service.js`, `team.service.js`) with atomic sequential integer ID resolution via `getNextSequenceId()`.
  - Future created records automatically receive clean, continuous sequential IDs (`1`, `2`, `3`, `4`, ...).
  - Existing database records in `org_gitakshmi` were fully migrated:
    - `crm_accounts`: `d90d9579-a8fc-45f2-a1b7-de829d34f08d` -> `2`
    - `crm_leads`: `b70ab6ae-b87f-4477-8d2c-4b50cfa2e501` -> `3`
    - `crm_deals`: `d43b5a27-de53-44f5-93f2-5714b5d7702f` -> `1`
    - `crm_contacts`: `7fe5140b-8227-4f96-9c41-ae0e01b2ad29` -> `2`
    - `crm_quotations`: `e8d7912a-3e36-4af7-a462-7747d3bc27fc` -> `1`
    - `core_users`: `4aa5dd5f-...` (Rohan Sharma) -> `4`, `fbb2af5b-...` (Dhruv) -> `5`.
  - Updated all foreign key relations (`deal_account_id`, `cnt_account_id`, `quo_deal_id`, `quo_account_id`, `url_user_id`).
- **Standardized Employee Code Rendering (`EMP-xxx`)**:
  - Assigned `usr_employee_code` in `core_users` for Marcus Vance (`EMP-002`) and Sarah Jenkins (`EMP-003`), eliminating bare numerical fallback (`2` and `3`).
  - Added `formatEmployeeCode` in both [team.service.js](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G-Axis-Backend/modules/crm/team/team.service.js), [MyTeam.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/MyTeam.jsx), and [TeamMemberDetail.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/TeamMemberDetail.jsx) ensuring all employee codes display formatted as `EMP-xxx` (e.g., `EMP-001`, `EMP-002`, `EMP-003`, `EMP-104`, `EMP-105`).
- **Joi Validation Updates**:
  - Relaxed strict UUID-only validations in `accounts.validation.js`, `leads.validation.js`, `deals.validation.js`, `quotations.validation.js`, and `contacts.validation.js` to accept both sequential integer IDs and UUIDs.

## Data Table Viewport & Column Width Optimization (Elimination of Table Bottom Scrollbar) (23/11/2026)

- **Eliminated Thick Horizontal Bottom Scrollbar Across Data Tables**:
  - **Root Cause**: The data table wrapper was previously calculating an arbitrary `minWidth` (e.g., 1315px for Leads) based on raw sum of column width hints, and `div.data-table-viewport` lacked scrollbar suppression classes. On standard 1080p, 1366x768, and scaled laptop screens, this forced a thick native browser horizontal scrollbar to appear immediately above the pagination bar ("Showing 2 out of 2 Entries"), pushing important columns (such as `Created Date` and `Actions`) off-screen.
  - **Fix & Responsive Rebalancing**:
    - **Global Scrollbar Suppression**: Added both `table-scrollbar` and `no-scrollbar` classes to `data-table-viewport` in [DataTable.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/common/Table/DataTable.jsx) and refined `style={{ minWidth: fitContent ? minWidth : (minWidth || undefined), width: fitContent ? 'max-content' : '100%' }}` so default tables stretch smoothly to 100% of their container width without forcing overflow.
    - **Proportional Column Widths ([Leads.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Leads.jsx))**: Rebalanced all 8 columns (`Code: w-[110px]`, `Lead Name: w-[155px]`, `Company Name: w-[165px]`, `Stage: w-[130px]`, `Priority: w-[110px]`, `Quick Contact: w-[95px]`, `Created Date: w-[110px]`, `Action: w-[155px]`), totaling ~940px. All 8 columns now fit side-by-side cleanly on desktop screens without clipping or horizontal overflow.
    - **Proportional Column Widths ([Deals.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Deals.jsx))**: Rebalanced all 9 columns (`Code: w-[110px]`, `Deal Name: w-[140px]`, `Account: w-[125px]`, `Owner (BDE): w-[130px]`, `Expected Value: w-[115px]`, `Stage: w-[130px]`, `Expected Close Date: w-[125px]`, `Probability: w-[90px]`, `Action: w-[90px]`), totaling ~1055px.
    - **Proportional Column Widths ([Clients.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Clients.jsx))**: Rebalanced all 8 columns (`Code: w-[110px]`, `Account Name: w-[170px]`, `Industry: w-[130px]`, `Assigned BDE: w-[130px]`, `Stakeholders: w-[100px]`, `Pipeline Deals: w-[160px]`, `Created Date: w-[110px]`, `Action: w-[90px]`), totaling ~1005px.
  - **Rules Adherence**: Compliant with flat border design (Rule #13), 7px UI radius token (Rule #20), and strict date format `DD/MM/YYYY` (Rule #22).

## Comprehensive Settings Page UI & Architecture Redesign (23/11/2026)

- Completely redesigned [Settings.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Settings.jsx) to replace isolated, placeholder-filled blocks with a cohesive, enterprise-grade architecture:
  - **Account Management & Security**: Quick navigation cards for Personal Profile Details, Password & Credentials update, and active Two-Factor Authentication (2FA) status with SSO badge.
  - **Appearance & Display**: Eliminated dummy "Lorem Ipsum" text, replacing it with a theme selection dropdown (`System Default`, `Light Mode`, `Dark Mode`) and a compact table density toggle with real-time toast feedback.
  - **Granular Notification Preferences**: Configured individual toggles for In-App Banner Alerts, Lead Assignment Alerts, Deal & Quotation Milestones, and Daily Summary Email Digests.
  - **System Regional Localization**: Structured controls for Time Zone (`Asia/Kolkata IST`, `UTC`, `EST`, `PST`, `GST`, `SGT`), Language, Currency Display (`₹ INR`, `$ USD`, `€ EUR`, etc.), and strict date standard (`DD/MM/YYYY` per Rule #22).
  - **Active Device Sessions & Security Audit**: Interactive session cards distinguishing the current device from remote browsers with IP, location, and device icons, featuring individual session termination and 1-click "Log out all other devices" functionality.
  - **Strict Rules Adherence**: 100% flat border-only policy (`border-b-2 border-stroke/80`, 0 drop-shadows per Rule #13), 7px radius token (`rounded-[7px]` per Rule #20), and hover tooltips for all interactive actions (Rule #14).

## Mobile Dashboard Revenue Switcher Single-Row Layout (23/11/2026)

- In [Dashboard.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Dashboard.jsx) and [BarChart.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/common/charts/BarChart.jsx), optimized the "Monthly vs Yearly Revenue" card header for mobile devices:
  - Placed the `[Monthly | Yearly]` segmented pill switch and the `[ 2025 ∨ ]` year dropdown side-by-side in a **single, unified row** (`flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto flex-nowrap`).
  - Added `!w-auto shrink-0 min-w-[76px]` to the year filter dropdown to prevent full-width stretching and eliminate vertical 3-row stacking on mobile screens.

## Mobile Responsive Viewport & Data Table Visibility Standardization (23/11/2026)

- **Mobile Viewport Overflow & Missing Table Content Fix**:
  - **Root Cause**: On mobile screens (iPhone / Android), the CRM header, mobile page header, and vertical stack of KPI cards (`StatCard`s, e.g. 5 stacked cards in Deals, 3 stacked cards in Accounts) consumed all available vertical height. Because `<main>` in [SalesLayout.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/layouts/SalesLayout.jsx), [AdminLayout.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/layouts/AdminLayout.jsx), and [BdeLayout.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/layouts/BdeLayout.jsx) was set to `overflow-hidden` for main list routes, the layout had no vertical scroll, compressing [TableContainer.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/common/Table/TableContainer.jsx) to 0 height. This caused table rows (e.g., "Showing 1 out of 1 Entries" or "Showing 2 out of 2 Entries") to be squished and completely hidden from view.
  - **Layout Fix**:
    - Updated `<main>` in all 3 layouts to `max-md:overflow-y-auto md:overflow-hidden p-2 sm:p-2.5 md:p-3`, enabling natural vertical scrolling on mobile and tablet devices while retaining strict fixed viewport ergonomics on desktop.
    - Updated [TableContainer.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/common/Table/TableContainer.jsx) with `max-md:min-h-[420px]` and table body with `max-md:min-h-[300px]`, guaranteeing table rows are fully rendered and visible on all screen sizes.
    - Added `max-md:min-h-fit` to page containers across [Deals.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Deals.jsx), [Clients.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Clients.jsx), [Leads.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Leads.jsx), [Contacts.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Contacts.jsx), [MyTeam.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/MyTeam.jsx), [StaffManagement.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/StaffManagement.jsx), and [Quotations.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Quotations.jsx).
- **Mobile Profile Capsule Dropdown Alignment**:
  - In [TopHeader.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/common/header/TopHeader.jsx), updated the dropdown menu positioning from `left-0 right-0 w-full` to `right-0 w-40 min-w-[150px]`, preventing mobile cutoff and ensuring "Edit Profile" and "Logout" render cleanly without awkward text wrapping.

## Filter Dropdown Deduplication & Data Table Alignment Standardization (23/11/2026)

- **Filter Dropdown Duplicate "All Status" / "All Role" Resolution**:
  - In [TableFilterSelect.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/common/Table/TableFilterSelect.jsx), resolved the bug where duplicate "All Status" items were rendered when options arrays included `{ value: 'All', label: 'All Status' }`.
  - Upgraded option deduplication to intelligently detect any option representing the reset/"All" choice (`opt.value === 'All'`, `opt.value === ''`, label starting with `'by '` or `'all '`, or matching `allLabel`/`placeholder`).
  - Ensured only **one single, unified "All Status" / "All Role"** button is displayed at the top of the menu with correct active checkmark state.
- **Data Table Row Alignment & Column Widths**:
  - In [DataTable.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/common/Table/DataTable.jsx), updated table cell vertical alignment from `align-top` to `align-middle`. This vertically centers text (`Contact No`, `Role`, `Leads`, `Deals`, `Status` badge, `Actions`) in alignment with the multi-line profile avatar container.
  - In [MyTeam.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/MyTeam.jsx), added explicit header width `w-[240px]` to `Executive Name`, constrained email width with `max-w-[170px] truncate block`, and calibrated `Contact No` to `w-[150px] whitespace-nowrap`. This prevents email text from wrapping onto a second line and eliminates overlap between Executive Name and Contact No.
  - In [StaffManagement.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/StaffManagement.jsx), standardized column widths (`Employee Name: w-[240px]`, `Contact/Manager: w-[160px]`, `Corporate Email: w-[190px]`, `Role: w-[150px]`, `Branch: w-[150px]`, `Status: w-[110px]`) for 100% alignment across all screen resolutions.

## Quick Navigation New Tab Redirection & Dynamic Lead Search Fix (23/11/2026)

- **Quick Navigation New Tab Redirection**:
  - In [TeamMemberDetail.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/TeamMemberDetail.jsx), converted the 4 module action buttons (`View Leads`, `View Deals`, `View Accounts`, `View Contacts`) from in-tab client router navigation to `window.open(..., '_blank')`.
  - When clicking on "View Leads" (or Deals/Accounts/Contacts), the CRM opens the pre-filtered target module in a fresh browser tab with its full search query string pre-applied.
- **Dynamic Assigned Executive Lead Search Resolution**:
  - **Backend (`leads.service.js`)**:
    - Enhanced `leadScope(user)` to permit `Sales Manager`, `Admin`, `CRM Admin`, and `Super Admin` to view and query all leads across their teams rather than restricting visibility exclusively to leads created by or assigned to the manager's own user ID.
    - Added `{ '$assignedUser.usr_name$': { [Op.like]: term } }` and joined `CoreUser` (`as: 'assignedUser'`) so that searching by sales executive name (e.g., "Sarah Jenkins") matches leads assigned to that executive directly at the SQL level.
    - Added `assignedTo` query parameter support in `buildLeadWhere`.
  - **Frontend Client (`leadsService.js` & `Leads.jsx`)**:
    - Updated `mapLeadFromApi` in [leadsService.js](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/services/leadsService.js) to preserve `assignedUser` and `assignedUserName`.
    - Enhanced `matchesSearch` inside [Leads.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Leads.jsx) `useMemo` filter to include `item.assignedUserName` and `item.assignedUser?.usr_name`, preventing client-side filtering from discarding leads returned by the backend search.
  - **End-to-End Dynamic Verification**:
    - Verified `Sarah Jenkins` (ID: 3) displays 2 assigned leads (`LD-0001 Acme Global Solutions` and `LD-0002 Zenith Logistics Ltd`). Clicking "View Leads" now opens `/leads?search=Sarah%20Jenkins` in a new tab and dynamically renders both leads.

## Dynamic Staff Management & Quick Navigation Synchronization (23/11/2026)

- **Staff Management Dynamic Integration (CRM Admin - FRD Section 10)**:
  - Created [staffService.js](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/services/staffService.js) connecting [StaffManagement.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/StaffManagement.jsx) directly to the backend `/crm/team` API.
  - When CRM Admin (`admin@gitakshmi.com`) logs in, Staff Management loads live database staff (`Arthur Pendelton`, `Marcus Vance`, `Sarah Jenkins`, `Rohan Sharma`, etc.).
  - Added live search debounce, role filter (CRM Admin, Sales Manager, BDE, Sales Executive), branch filter, and CSV roster export.
  - Added `+ Add Staff Member` provisioning modal for Admin onboarding.
  - Integrated View action button navigating to `/team/:id` for comprehensive telemetry inspection.
  - Implemented 100% flat border-only tokens and circular borderless avatars (`rounded-full overflow-hidden border-none` per Rule #24).
- **Module Quick Navigation URL Search Synchronization**:
  - Updated [Leads.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Leads.jsx), [Deals.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Deals.jsx), [Clients.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Clients.jsx), and [Contacts.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Contacts.jsx) to parse `useSearchParams` (`?search=...`, `?ownerId=...`).
  - Quick Navigation buttons in [TeamMemberDetail.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/TeamMemberDetail.jsx) now pass query parameters that dynamically pre-filter records for the selected executive in real-time.

## Team Member Detail Dedicated Full-Page View (23/11/2026)

- **Form Controls & Layout Structure Redesign**:
  - Replaced nested uneven gray boxes with a clean, structured 2-column grid (`grid grid-cols-1 sm:grid-cols-2 gap-4`) for "Basic Information & Role".
  - Replaced native unstyled select with the project's standardized searchable `DropdownInput` component with 7px radius, stroke borders, and custom chevron.
  - Replaced inline phone input with the standardized `PhoneNumber` component featuring country flag selection and removed placeholder (`placeholder=""`) as requested.
  - Structured fields with uniform labels (`text-xs font-semibold text-black-90`), 40px field height, and clean read-only/display states with semantic icons (`Mail`, `Phone`, `Shield`, `UserCheck`, `MapPin`, `Calendar`).
- **Scrollable Viewport & Overflow Resolution**:
  - Configured `isScrollablePage` and `showPageScrollbar` across `SalesLayout.jsx`, `AdminLayout.jsx`, and `BdeLayout.jsx` to recognize `/team/:id`, `/team/:id/view`, `/new`, `/edit`, and `/view` routes.
  - Adjusted [TeamMemberDetail.jsx](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/TeamMemberDetail.jsx) root layout container with `pb-16` padding and natural content stretch, resolving the scroll cutoff issue so bottom cards ("Basic Information & Role", "Module Quick Navigation", and linked records) are fully scrollable and interactive across all screen resolutions.
- **Converted View Drawer to Full Dedicated Page (`pages/TeamMemberDetail.jsx`)**:
  - Replaced `ViewMemberDrawer` slide-over drawer with a 100% flat, full-page design adhering to FRD Section 11.25 and Rule #5.
  - Registered clean un-prefixed routes `/team/:id` and `/team/:id/view` in `routes/AppRoutes.jsx` under `ProtectedRoute` -> `DynamicLayout`.
  - Updated `pages/MyTeam.jsx` to navigate to `/team/:id` upon clicking "View" action button or the executive's name and avatar.
- **UI & Telemetry Features**:
  - Standard `<BackButton />` navigating back to `/team`.
  - Identity banner with circular borderless profile photo (`rounded-full overflow-hidden border-none`), employee code, reporting manager (`Marcus Vance`), active territory, and active status badge.
  - Live 6-card KPI Telemetry grid: Assigned Leads, Active Deals, Conversion Rate (%), Accounts Managed, Linked Contacts, and Pending Tasks.
  - Corporate Profile Card: Corporate email (with 1-click copy), contact phone, primary CRM role (with inline edit & save), assigned territory, and formatted join date (`DD/MM/YYYY`).
  - Module Quick Navigation Card: 1-click jump links pre-filtered for the executive across `/leads`, `/deals`, `/clients`, and `/contacts`.
  - Safe Workload Reassignment Modal: Prevents lead abandonment upon deactivation by allowing the manager to reassign active leads and open deals to active team members.
  - Strict compliance with flat border-only policy (`border-b-2 border-stroke/80`, `rounded-[7px]`, 0 drop-shadows).

## Deals Directory API Integration (21/11/2026)

- Replaced seeded Deals rows with authenticated, paginated API data. Search, stage/owner filtering, and CSV export use backend Deal endpoints.
- The list follows FRD Deal Name, Account, Owner, Expected Value, Stage, Expected Close Date, Probability, and View/Edit actions. View/Edit use clean `/deals/:id/view` and `/deals/:id/edit` pages. My Deals currently uses the FRD list view; the Kanban view is deferred.
- Deal editing maps to backend Deal updates: Deal Name, Stage, Owner, Expected Value, Probability, Expected Close Date, User Count, and Lost Reason. Code and Account are read-only. Linked Lead/Product/Plan/Branch IDs stay outside the form because the client has no corresponding lookup APIs.
- Pipeline value, weighted forecast, Closed Won value, and win rate come from API aggregates. Awaiting Approvals remains unavailable because the current Deal schema has no approval status.

## Lead Create and Document Preview (21/11/2026)

- Add Lead no longer displays a Lead Code field; existing leads continue to show their API-generated code in View and Edit.
- The upload area is medium height, and Full Name and Designation share a row on Add New Lead.
- Saved documents have authenticated View and Download actions. Selected files can also be previewed or downloaded before saving, and their Cancel Upload action removes them from the pending list.

## Contact Directory Updates (20/11/2026)

- The contacts table displays active deal count and summed value from the API; the backend currently associates deals to accounts, so these are account-level totals.
- Contact edit/view exposes the persisted primary-contact role, and the API enforces a single primary contact per account when a contact is promoted.

## Frontend Validation (20/11/2026)

- Added reusable Yup schemas in `src/utils/validationSchemas.js` and a shared validation result helper in `src/utils/validationUtils.js`.
- Lead create/edit, lead conversion, contact edit, deal/client/contact/quotation drawers, login, forgot password, and reset password validate values before invoking their save or navigation flow.
- Lead conversion accepts `DD/MM/YYYY` and `DD-MM-YYYY`, displays the normalized slash format, validates real calendar dates, and sends the API's `YYYY-MM-DD` value.
- Form validation displays actionable errors beside the affected controls.
- Yup and Joi validation feedback appears beside the matching field. Invalid submissions scroll to and focus the first invalid field; structured backend field errors are mapped into the same inline messages.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

## Changelog & Security Updates

### [24/11/2026] Report & Analytics Reusable Architecture Refactoring & Single-Row Toolbar Alignment
- **Single-Row Toolbar Alignment (`ReportAnalytics.jsx`)**:
  - Fixed toolbar wrapping issue where switching to the `Lead Sources` tab caused the tab switcher to drop to a second line beneath the search input.
  - Implemented `flex-nowrap`, `shrink-0`, and responsive search widths (`w-[170px] sm:w-[190px] lg:w-[210px]`) alongside clean `overflow-x-auto no-scrollbar` protection, guaranteeing all search, tab toggles, and filter controls stay locked on the exact same row.
- **Component Standardization via Global `<DataTable>`**:
  - Refactored [`ReportAnalytics.jsx`](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/ReportAnalytics.jsx) to eliminate 400+ lines of custom handwritten HTML `<table>` elements and migrate directly to the global reusable [`DataTable.jsx`](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/common/Table/DataTable.jsx) component.
  - Added optional, backward-compatible `footer` prop support to [`DataTable.jsx`](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/common/Table/DataTable.jsx) to cleanly render table footers (`<tfoot>`) aligned with responsive column widths.
- **Typography & Visual Consistency Alignment**:
  - Completely removed screaming `uppercase` headers and monospaced `font-mono` badges (`bg-gray text-black-90/70 border border-stroke px-1.5 py-0.5 rounded-[4px] text-[10px]`) from column headers, employee codes, channel IDs, and totals.
  - Standardized font styling and casing to 100% match `My Accounts` ([`Clients.jsx`](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Clients.jsx)) and `Leads` ([`Leads.jsx`](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Leads.jsx)): standard `Inter` font, Title Case column headers (`Executive Name`, `Code`, `Role`, `Leads Handled`, `Conversion Rate`, `Pipeline Value`, `Won Revenue`, `Action`), and standard text tokens (`font-semibold text-black-90 text-xs`).
  - Standardized the Drilldown drawer to eliminate `font-mono` and `uppercase` badges, switching to standard capitalized badges and clean text tokens.
- **Architecture & Rules Compliance**:
  - Fully complies with Rules #4 (Reusable Components), #5 & #19 (Zero Inline Bloat / Clean Architecture), #6 (Common Design Tokens), #10 (useMemo/useCallback optimizations), #13 (Strict Flat Design), and #24 (Circular Borderless Avatars).
- **Build Verification**: Clean production build verified with Vite (`npm run build`) with 0 errors.

### [23/11/2026] Sales Manager "My Team" Module: Dynamic API & Full FRD Implementation (11.23, 11.24, 11.25)
- **Backend API Endpoints (`/api/crm/team`)**:
  - Implemented `team.routes.js`, `team.controller.js`, and `team.service.js` in `G-Axis-Backend/modules/crm/team/` and mounted in `server.js`.
  - `GET /api/crm/team`: Serves paginated, searchable, status/role filtered team roster with real-time aggregated counts for assigned leads (`CrmLead`) and active deals (`CrmDeal`), plus top summary KPIs (`totalMembers`, `activeMembers`, `inactiveMembers`).
  - `GET /api/crm/team/:id`: Returns full executive profile and live work telemetry (assigned leads, active deals, managed accounts, linked contacts, pending tasks, conversion rate %, and active pipeline ARR).
  - `POST /api/crm/team`: Provisions new sales team members under Marcus Vance's reporting hierarchy with bcrypt-hashed credentials (`Admin@123`), unique code validation, and role assignment.
  - `PATCH /api/crm/team/:id`: Supports editing member role, phone, and territory allocation.
  - `POST /api/crm/team/:id/deactivate`: Deactivates a team member with safe workload reassignment (transfers open leads and active deals to another active BDE).
  - `GET /api/crm/team/territories` & `GET /api/crm/team/export`: Territory master lookups and CSV download streaming.
- **Frontend Dynamic Integration (`src/pages/MyTeam.jsx`)**:
  - Replaced static mock data with dynamic API calls via [`teamService.js`](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/services/teamService.js).
  - Rendered top 3 KPI cards (`Total Team Members`, `Active Members`, `Inactive Members`) per FRD 11.23.
  - Created [`AddTeamMemberModal.jsx`](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/modules/team/AddTeamMemberModal.jsx) for provisioning new team members (FRD 11.24).
  - Enhanced [`ViewMemberDrawer.jsx`](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/modules/team/ViewMemberDrawer.jsx) with live telemetry cards, role/phone editing, safe deactivation workflow, and 1-click quick navigation deep links to `/leads`, `/deals`, `/clients`, and `/contacts` (FRD 11.25).
  - Strict Rules Compliance: 100% flat design (Rule #13), 7px radius with 2px bottom border (Rule #20), circular borderless avatars (Rule #24), and hover tooltips for all actions (Rule #14).
- **Build Verification**: Clean production build verified with Vite (`npm run build`) in 5.27s with 0 errors.

### [23/11/2026] Enterprise Redux Architecture & Async Thunk API Calling Integration
- **Centralized Redux Async Thunk Architecture (`createAsyncThunk`)**:
  - Implemented the standard enterprise Redux API calling structure across `src/store/` following Senior Developer design principles.
  - **`authSlice.js` Async Thunks**:
    - Added `loginUser`: Dispatches asynchronous credential verification to `services/profileService.js`, managing `loading`, `error`, and `session` storage persistence through `extraReducers`.
    - Added `loadUserProfile`: Fetches fresh authenticated employee and company profile information asynchronously.
  - **`quotationsSlice.js` (Domain Entity Async Thunk Pattern)**:
    - Created `quotationsSlice.js` implementing complete async API lifecycle actions: `fetchQuotationsThunk`, `approveQuotationThunk`, `rejectQuotationThunk`, and `sendQuotationThunk`.
    - Mounted in root store [`store/index.js`](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/store/index.js).
- **Separation of Concerns**:
  - Services (`src/services/`): Pure API transport, headers, base URLs, endpoints, and response parsing. Zero Redux dependencies.
  - Store Slices (`src/store/slices/`): State shape, async thunks, optimistic updates, and lifecycle reducers (`pending`, `fulfilled`, `rejected`).
  - UI Components (`src/pages/`, `src/components/`): Thin UI layer consuming state with `useSelector` and dispatching actions with `useDispatch`.
- **Build Verification**: Clean production build verified with Vite (`npm run build`) in 4.08s with 0 errors.

### [22/11/2026] Quotation Approval Workflow (FRD 11.20, 11.35, 11.36) & Profile Flow UX Hardening
- **Quotation Approval Lifecycle & Permission Model**:
  - Implemented the complete Quotation Approval flow per FRD Sections 11.20, 11.35, and 11.36.
  - Who Approves: **Sales Manager** (`marcus@gitakshmi.com`) and **CRM Admin** (`admin@gitakshmi.com`).
  - Quotation Lifecycle:
    1. **BDE** (`sarah@gitakshmi.com`) creates a draft quotation linked to an accessible Deal & Contact and clicks "Submit for Approval".
    2. Status advances to `pending_approval` ("Pending Approval").
    3. **Sales Manager / Admin** logs in and sees pending quotes highlighted in the `/quotations` directory with quick Approve (Check) and Reject (X) actions, as well as on `/quotations/:id/view`.
    4. **Approve Action**: Opens `QuotationApprovalModal` with deal and quotation totals, allowing an optional manager note. Submitting triggers `POST /crm/quotations/:id/approve` and transitions status to `approved`.
    5. **Reject Action**: Requires a mandatory manager feedback reason (`POST /crm/quotations/:id/reject`), transitions status to `rejected`, and sends back to BDE with feedback banner for proposal revision.
    6. **Send to Customer**: Once approved, authorized users can dispatch the quote via `POST /crm/quotations/:id/send` (transitions status to `sent`).
- **UI Components & Strict Rules Compliance**:
  - Created [`QuotationApprovalModal.jsx`](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/modules/quotations/QuotationApprovalModal.jsx): Strict flat design (no drop shadows, 7px radius, 2px bottom border in `stroke/80`).
  - Enhanced [`Quotations.jsx`](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/Quotations.jsx): Added quick Approve and Reject icon buttons in the Action column for pending approval items for Sales Managers and Admins.
  - Enhanced [`QuotationForm.jsx`](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/QuotationForm.jsx): Added header action buttons ("Approve Quotation", "Reject Quotation", "Send to Customer") and context status banners (Pending Review, Approved, Rejected).
  - Enhanced [`quotationsService.js`](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/services/quotationsService.js): Integrated `approveQuotation`, `rejectQuotation`, `sendQuotation`, and `fetchQuotationTimeline`.
- **Profile & Password Update UX Hardening**:
  - Eliminated duplicate in-form green alert boxes in [`EditProfile.jsx`](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/pages/EditProfile.jsx) and [`LoginForm.jsx`](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/modules/auth/LoginForm.jsx).
  - Elevated [`ToastViewport.jsx`](file:///c:/Users/dell/OneDrive%20-%20Gitakshmi%20Technologies%20Private%20Limited/G---AXIS-CRM/client/src/components/common/toast/ToastViewport.jsx) (`z-[9999]`) for consistent top-right notifications.
  - Automatically clears auth session and redirects to `/login` upon successful password update.
- **Build Verification**: Clean production build verified with Vite (`npm run build`) in 2.99s with 0 errors.

### [17/11/2026] Consolidated Router into Single `AppRoutes.jsx` File
- **Unified Single-File Routing Architecture**:
  - Embedded `ProtectedRoute` guard and `DynamicLayout` shell resolver directly into [`AppRoutes.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/routes/AppRoutes.jsx).
  - Deleted redundant files `client/src/routes/DynamicRouteWrappers.jsx` and `client/src/routes/ProtectedRoute.jsx`.
  - The [`client/src/routes/`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/routes/) directory now contains **strictly 1 file**: `AppRoutes.jsx`.
- **Build Verification**: Clean production build verified with Vite (`npm run build`) in 2.73s with 0 errors.



### [17/11/2026] AGENTS.md Rule 24 Fix & Full Architecture Specification Update
- **Rule 24 Avatar Border Compliance**:
  - Removed `border border-stroke` in [`ContactAvatarPlaceholder.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/avatar/ContactAvatarPlaceholder.jsx), setting `border-none` to achieve 100% compliance with Rule 24.
- **Updated [`AGENTS.md`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/AGENTS.md)**:
  - Formulated **Rule 5** to reflect the modern clean CRM folder architecture: 100% flat `pages/` with 0 subfolders, 10 subfolders in `components/common/`, and domain module folders in `components/modules/`.
  - Added **Rule 25 (Unified Single-Page Architecture & Role-Conditioned Rendering)**: Strict prohibition of duplicate wrapper files (`AdminDashboardView`, etc.); common banners rendered once, widgets imported individually from `components/modules/<module-name>/`.
  - Added **Rule 26 (Unified Clean Routing & Role-Adaptive Navigation)**: Clean un-prefixed URLs (`/dashboard`, `/leads`, etc.) with dynamic runtime role adaptation and unified `/login`.
- **Build Verification**: Clean production build verified with Vite (`npm run build`) in 1.41s with 0 errors.



### [17/11/2026] Unified Modular Dashboard & Eliminated Redundant Wrapper Files
- **Zero Duplicate Code Architecture in [`Dashboard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/Dashboard.jsx)**:
  - Eliminated repetitive code across panels by unifying the top header banner (Title, Subtitle, Timeframe dropdown, Export button), the 4-card KPI metric grid (`StatCard`), and the universal `BarChart` into a single page component.
  - Dynamically renders metrics and widgets according to the authenticated user's role (`role === USER_ROLES.ADMIN`, `USER_ROLES.SALES`, `USER_ROLES.BDE`).
  - Extracted [`Last5LeadsTable.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/modules/dashboard/Last5LeadsTable.jsx) into a reusable modular dashboard subcomponent.
  - Safely removed the 3 redundant wrapper files: `AdminDashboardView.jsx`, `SalesDashboardView.jsx`, and `BdeDashboardView.jsx`.
  - **Strictly Zero Visual Change**: Visual layout, cards, color tokens, metrics, typography, and charts remain 100% pixel-perfect and identical to specifications.
- **Build Verification**: Clean production build verified with Vite (`npm run build`) in 1.75s with 0 errors.



### [17/11/2026] Fixed Profile Dropdown Stacking Order (Z-Index)
- **TopHeader Stacking Context Elevation**:
  - Added `relative z-40` to `<header>` in [`TopHeader.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/header/TopHeader.jsx).
  - Added `relative z-50` to the profile capsule container.
  - Ensures the profile dropdown menu ("Edit Profile", "Logout") floats above all underlying table toolbars, action buttons (`+ Add New Lead`), and grid cards without being clipped or layered behind.
- **Build Verification**: Clean production build verified with Vite (`npm run build`) in 1.56s with 0 errors.


### [17/11/2026] Restored Button Text Rendering Across Auth Forms
- **Universal Button Content Prop Support**:
  - In [`Button.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/buttons/Button.jsx), added support for `label` and `text` props (`children ?? label ?? text`).
  - Updated [`LoginForm.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/modules/auth/LoginForm.jsx), [`ForgotPasswordForm.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/modules/auth/ForgotPasswordForm.jsx), and [`NewPasswordForm.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/modules/auth/NewPasswordForm.jsx) to pass clean child text (`Sign In`, `Send Reset Link`, `Update Password`).
  - Resolves empty button issue on the Login page; the primary submit button now clearly displays "Sign In" in bold white text.
- **Build Verification**: Clean production build verified with Vite (`npm run build`) in 2.32s with 0 errors.


### [17/11/2026] Perfected Profile Dropdown Divider & Trigger Width Alignment
- **Fixed Dropdown Alignment & Border Divider (Exact 1:1 Match to Figma)**:
  - Removed `data-ui-style="dropdown-menu"` from `ProfileCapsule` in [`TopHeader.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/header/TopHeader.jsx) to prevent square-corner resets and button border resets.
  - Aligned the dropdown menu's left and right edges with 100% precision to the trigger button (`left-0 right-0 w-full`).
  - Added explicit dividing border `border-b border-stroke` on the `Edit Profile` button so the horizontal divider separating `Edit Profile` and `Logout` renders with 100% clarity.
  - Standardized trigger pill with `rounded-[10px]`, `px-3`, and single-line user name with `whitespace-nowrap`.
- **Build Verification**: Clean production build verified with Vite (`npm run build`) in 1.49s with 0 errors.


### [17/11/2026] Matched Profile Capsule & Dropdown Menu 100% to Figma Specification
- **Clean Single-Line Profile Pill**:
  - Simplified the `ProfileCapsule` button in [`TopHeader.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/header/TopHeader.jsx) to display a clean single-line user name (`Johnson Doe`) next to the avatar and chevron arrow (matching the exact Figma screenshot).
- **Aligned Divided Dropdown Menu (Figma Exact Match)**:
  - Aligned the dropdown menu container width directly with the profile pill (`w-full min-w-[145px]`).
  - Added full border `border border-stroke` and `rounded-[10px]` with `overflow-hidden`.
  - Added clean horizontal dividing line `divide-y divide-stroke/80` between actions:
    - **Edit Profile**: Blue `PenLine` icon (`text-primary`, size 16) with `Edit Profile` text.
    - **Logout**: Red circular arrow icon (`LogoutIcon` with `Container.png`) with red `Logout` text (`text-alert`).
- **Build Verification**: Clean production build verified with Vite (`npm run build`) in 1.40s with 0 errors.


### [17/11/2026] Removed Unwanted Bottom Stroke Border Under TopHeader
- **Borderless Top Header**:
  - Removed `border-b border-stroke` from `<header>` in [`TopHeader.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/header/TopHeader.jsx).
  - The top header is now completely borderless and seamless, allowing the main content body's `bg-gray rounded-tl-[15px]` container to curve naturally into the header without any dividing horizontal line, exactly matching the Figma design.
- **Build Verification**: Clean production build verified with Vite (`npm run build`) in 1.39s with 0 errors.


### [17/11/2026] Restored Dynamic TopHeader Page-Wise Telemetry and Contextual Search
- **Dynamic Header Content Switching**:
  - Restored `leftContent` rendering inside [`TopHeader.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/header/TopHeader.jsx) as passed by `AdminLayout`, `BdeLayout`, and `SalesLayout`.
  - On page views (`/leads`, `/clients`, `/contacts`, `/deals`, `/quotations`, `/staff`, `/configuration`, etc.): TopHeader now dynamically displays the bold **Page Title & Subtitle** on the left (matching Figma Image 3) without cluttered header searchbars.
  - On Dashboard views (`/dashboard`): TopHeader displays the **Global Search Bar** (`GlobalSearch`) with proper spacing (matching Figma Image 2).
  - Maintained 100% flat and clean folder architecture with zero visual discrepancies.
- **Build Verification**: Clean production build verified with Vite (`npm run build`) in 1.33s with 0 errors.


### [17/11/2026] TopHeader Fixes: Profile Capsule Styling & Hidden Desktop Sidebar Trigger
- **Profile Capsule Styling (Rule 20 & Rule 24)**:
  - Restored `bg-gray`, `border-b-2 border-stroke/80`, and `rounded-[7px]` on the `ProfileCapsule` trigger button in [`TopHeader.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/header/TopHeader.jsx).
  - Maintained fully circular and borderless avatar (`rounded-full`, `data-preserve-radius`) with smooth hover state.
- **Removed Duplicate Desktop Sidebar Trigger**:
  - Added `className="lg:hidden"` to `<SidebarTrigger />` inside [`TopHeader.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/header/TopHeader.jsx).
  - Eliminates the duplicate sidebar collapse button next to the search bar on desktop views, keeping it strictly on mobile screens.
- **Build Verification**: Clean production build verified with Vite (`npm run build`) in 1.37s with 0 errors.


### [17/11/2026] Clean Reorganization of All Common Components (0 Loose Files)
- **Classified and Relocated Loose Common Components into Dedicated Subfolders**:
  - `BarChart.jsx` -> [`common/charts/BarChart.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/charts/BarChart.jsx)
  - `TopHeader.jsx`, `MobilePageHeader.jsx`, `NotificationBell.jsx` -> [`common/header/`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/header/)
  - `LogoutConfirmationModal.jsx` -> [`common/modals/LogoutConfirmationModal.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/modals/LogoutConfirmationModal.jsx)
  - `ContactAvatarPlaceholder.jsx`, `AvatarStack.jsx` -> [`common/avatar/`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/avatar/)
  - `ViewModeToggle.jsx` -> [`common/buttons/ViewModeToggle.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/buttons/ViewModeToggle.jsx)
  - `Pagination.jsx` -> [`common/Table/Pagination.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/Table/Pagination.jsx)
- **Purity & Zero Duplication**:
  - Cleaned up misplaced non-input components (`AvatarStack`, `NotificationBell`, `Pagination`) from `inputs/`.
  - Added clean subfolder barrel exports (`index.js`) to `avatar/`, `buttons/`, `charts/`, `header/`, `inputs/`, `modals/`, and `Table/`.
  - Updated centralized barrel export in [`components/common/index.js`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/index.js).
- **Import Paths Synchronization**:
  - Updated all dependent import paths across layouts (`AdminLayout`, `BdeLayout`, `SalesLayout`), pages (`Clients`, `Deals`, `Quotations`, `EditProfile`), and dashboard views (`AdminDashboardView`, `BdeDashboardView`, `SalesDashboardView`).
- **Build Verification**: Clean production build verified with Vite (`npm run build`) in 1.57s with 0 errors.


### [17/11/2026] Sidebar Section Toggle Icons Updated to Primary Color
- **Sidebar Collapse/Expand Chevron Styling**:
  - In [`Sidebar.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/sidebar/Sidebar.jsx), updated the section toggle `ChevronDown` icon from `text-black-90/50` to `text-primary`.
  - All collapsible navigation sections (such as `CORE OPERATIONS`, `GOVERNANCE`, `ANALYTICS & SYSTEM`) now prominently show their toggle indicator in the brand primary color token (`#00227E`).
- **Build Verification**: Clean production build verified with Vite (`npm run build`) in 1.54s with 0 errors.


### [17/11/2026] Updated Rupee (₹) Symbol to Primary Color on Lead Volume Pacing Chart
- **Y-Axis Tier Symbol Styling**:
  - Updated the currency symbol in `renderYAxisTier` from `text-secondary` to `text-primary font-bold` across:
    - [`AdminDashboardView.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/modules/dashboard/AdminDashboardView.jsx) (Lead Volume Pacing)
    - [`BdeDashboardView.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/modules/dashboard/BdeDashboardView.jsx)
    - [`SalesDashboardView.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/modules/dashboard/SalesDashboardView.jsx)
  - The `₹` icon now displays in the brand's primary color token (`text-primary` / deep navy blue).
- **Build Verification**: Verified production build (`npm run build`) in 1.54s with 0 errors.


### [17/11/2026] Dedicated Blank Pages for Integrations & Notification Settings
- **Created Dedicated Blank Pages in `pages/` (100% Flat Architecture)**:
  - Created [`Integrations.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/Integrations.jsx) for the `/integrations` route as a clean, blank white placeholder page.
  - Created [`Notifications.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/Notifications.jsx) for the `/notifications` route as a clean, blank white placeholder page.
- **Updated Clean Route Bindings in `AppRoutes.jsx`**:
  - Replaced duplicate route bindings (`/integrations -> CrmConfiguration` and `/notifications -> Settings`) with dedicated lazy-loaded components `<Integrations />` and `<Notifications />`.
  - Preserved original [`CrmConfiguration.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/CrmConfiguration.jsx) on `/configuration` and [`Settings.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/Settings.jsx) on `/settings` with zero impact.
- **Build Verification**: Clean production build verified with Vite (`npm.cmd --prefix client run build`) in 1.75s with 0 errors.


### [17/11/2026] Clean Login Form: Removed Role Switcher Tabs & Auto Role Resolution from Credentials (Rule 23)
- **Eliminated Role Switcher Tabs from Login Page**:
  - Removed the three manual role tabs (`[BDE]`, `[Sales Manager]`, `[Super Admin]`) from [`UnifiedLogin.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/auth/UnifiedLogin.jsx).
  - Enforced Rule #23 (Clean Empty Form Inputs): Form inputs now initialize completely empty (`email = ''`, `password = ''`), displaying only non-selectable placeholders.
- **Automatic Role Detection on Login**:
  - Implemented `resolveUserByCredentials` in [`authConstants.js`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/constants/authConstants.js).
  - When the user enters their email/ID and password, the system automatically checks the user's role:
    - Emails/IDs containing `admin` log in directly to the **Super Admin** workspace and layout.
    - Emails/IDs containing `sales` or `manager` log in directly to the **Sales Manager** workspace and layout.
    - Other emails/IDs log in directly to the **BDE** workspace and layout.
  - User is immediately routed to their designated clean dashboard (`/dashboard`).
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.54s with 0 errors.

### [17/11/2026] Single Login & Role-Based Unified Routing (Clean URLs) with Redux Toolkit
- **Redux State Management Setup (`@reduxjs/toolkit` & `react-redux`)**:
  - Created central store at [`store/index.js`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/store/index.js).
  - Created [`store/slices/authSlice.js`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/store/slices/authSlice.js) managing `user`, `role`, `token`, and `isAuthenticated` with localStorage session persistence and actions (`loginSuccess`, `logout`, `switchRole`).
  - Added user and role specifications in [`constants/authConstants.js`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/constants/authConstants.js) (`DEFAULT_USERS`, `USER_ROLES`).
  - Wrapped root application with `<Provider store={store}>` in [`main.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/main.jsx).
- **Single Unified Login Portal (`/login`)**:
  - Implemented [`UnifiedLogin.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/auth/UnifiedLogin.jsx) as the single authentication entry point.
  - Added 1-click role switcher tabs (`[BDE]`, `[Sales Manager]`, `[Super Admin]`) with auto demo credential pre-fill and smart domain detection.
- **100% Clean URLs Without Role Prefixes**:
  - Re-architected [`AppRoutes.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/routes/AppRoutes.jsx) to eliminate all `/admin/`, `/sales/`, `/bde/` prefixes from active browser URLs.
  - Implemented dynamic view resolvers in [`DynamicRouteWrappers.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/routes/DynamicRouteWrappers.jsx) to render role-appropriate layouts and views under unified URLs:
    - `/dashboard` -> Resolves to AdminDashboard, SalesDashboard, or BdeDashboard
    - `/leads` -> Resolves to AdminLeadManagement, SalesLeadManagement, or BdeMyLeads
    - `/clients` -> Resolves to AdminClientManagement, SalesMyClients, or BdeMyClients
    - `/contacts` -> Resolves to AdminContactManagement, SalesMyContacts, or BdeMyContacts
    - `/deals` -> Resolves to AdminDealManagement, SalesMyDeals, or BdeMyDeals
    - `/quotations` -> Resolves to AdminQuotations, SalesQuotations, or BdeQuotations
    - `/settings` -> Resolves to AdminCrmConfiguration, SalesSettings, or BdeSettings
    - `/profile` -> Resolves to AdminCrmConfiguration, SalesEditProfile, or BdeEditProfile
    - `/staff`, `/configuration` -> Admin exclusive
    - `/team`, `/analytics` -> Sales exclusive
  - Implemented [`ProtectedRoute.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/routes/ProtectedRoute.jsx) route guard for secure authentication.
  - Configured backward-compatible redirects for all legacy `/bde/*`, `/sales/*`, and `/admin/*` URLs to automatically route to the corresponding clean URL.
- **Sidebar & TopHeader Synchronization**:
  - Updated [`SidebarNavigation.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/sidebar/SidebarNavigation.jsx) paths to clean URLs (`/dashboard`, `/leads`, `/clients`, etc.).
  - Updated [`Sidebar.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/sidebar/Sidebar.jsx) to read role directly from Redux and highlight exact active routes.
  - Updated [`TopHeader.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/TopHeader.jsx) profile pill to display current logged-in user details and trigger Redux `logout()`.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 2.25s with 0 errors.

### [16/11/2026] Strict View-Only (Read-Only) Mode Across All Panels for ViewBtn (Rule 20 & Core UX)
- **Universal View-Only Enforcement Across All 3 Panels (Admin, BDE, Sales)**:
  - **Lead Management**:
    - `AddLeadDrawer.jsx` in Admin, BDE, and Sales: When opened via View action (`mode === 'view'`), drawer title updates to "View Lead Details", all form inputs and dropdowns are `disabled`, dropzone file uploader is hidden, document deletion triggers are removed, and "Save Lead" action buttons are completely hidden.
    - Updated `DocumentCard.jsx` to render document deletion buttons conditionally (`{onDelete && (...)}`).
  - **Client Management**:
    - `EditClientDrawer.jsx` in Admin, BDE, and Sales: In view mode (`mode === 'view'`), drawer title updates to "View Client Details", all inputs (name, company, email, phone, website, industry, scale, address, etc.) are `disabled`, dropzone uploader is hidden, and "Save Details" button is removed.
  - **Contact Management**:
    - Updated `MyContacts.jsx` (BDE & Sales) and `ContactManagement.jsx` (Admin) to pass `mode="view"` on clicking `ViewBtn`.
    - `EditContactDrawer.jsx` across Admin, BDE, and Sales: In view mode, title updates to "View Contact", profile upload button is hidden, "Save Details" button is removed, and all inputs (`firstName`, `lastName`, `designation`, `leadSource`, `email`, `phone`, `companyName`, `assignedBde`) are `disabled`.
  - **Deal Management**:
    - Updated `MyDeals.jsx` (BDE & Sales) and `DealManagement.jsx` (Admin) to pass `mode="view"` on clicking `ViewBtn`.
    - `EditDealDrawer.jsx` across Admin, BDE, and Sales: In view mode, title updates to "View Deal", "Save Details" button is removed, and all inputs (`dealName`, `stage`, `dealAmount`, `productInterest`, `startDate`, `closeDate`, `assignedBde`) are `disabled`.
  - **Quotations**:
    - Updated `Quotations.jsx` (BDE & Sales) to pass `mode="view"` on clicking `ViewBtn`.
    - `CreateQuotationDrawer.jsx` across Admin, BDE, and Sales: In view mode, title is "View Quotation", "Save as Draft" and "Send for VP Approval" buttons are removed (retaining `< Back` and `Export PDF`), and all inputs (`selectDeal`, `closeDate`, `linkedCompany`, `assignedBde`, `dealAmount`, `productInterest`, `bdeNotes`) are `disabled`.
  - **Team Management (Sales)**:
    - `ViewMemberDrawer.jsx`: Converted to strict read-only mode — removed "Upload Profile", "Remove", and "Save Changes" buttons, disabled all fields (`code`, names, contact, designation, role, department, grade, status).
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.74s with 0 errors.

### [16/11/2026] Replaced Full Borders with 2px Bottom-Only Borders in Quotation Form Inputs & Product Cards (Rule 20)
- **Eliminated Full Perimeter Borders Across Quotation Drawer Elements**:
  - In `CreateQuotationDrawer.jsx` (across BDE, Admin, and Sales panels):
    - **Expected Close Date Input**: Replaced `border border-stroke rounded-lg` with `border-b-2 border-stroke/80 rounded-[7px]`.
    - **Deal Amount Input**: Replaced `border border-stroke rounded-lg` with `border-b-2 border-stroke/80 rounded-[7px]`.
    - **Products & Plan Allocation Cards**: Replaced full perimeter border `border border-stroke rounded-xl` with `border-b-2 border-stroke/80 rounded-[7px]`.
    - **SKU Badges**: Replaced `border border-stroke rounded` with `border-b-2 border-stroke/80 rounded-[4px]`.
    - **Grand Total Container**: Replaced `border border-stroke rounded-xl` / `rounded-lg` with `border-b-2 border-stroke/80 rounded-[7px]`.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.68s with 0 errors.

### [16/11/2026] Standardized Pagination Controls: 2px Bottom-Only Border & 7px Radius (Rule 20)
- **Eliminated Full Perimeter Borders on Pagination Numbers & Controls**:
  - In [`Pagination.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/Pagination.jsx):
    - Removed full perimeter border (`border border-stroke`) from page numbers and Previous / Next navigation buttons.
    - Applied 2px bottom-only border (`border-b-2 border-stroke/80` on inactive number buttons and previous/next buttons; `border-b-2 border-black-90/20` on active number buttons).
    - Standardized corner radius from `rounded-lg` to the shared `rounded-[7px]` token per Rule 20.
    - Applied cleanly across all data tables in Admin, BDE, and Sales panels.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.47s with 0 errors.

### [16/11/2026] Standardized Pagination Controls: 2px Bottom-Only Border & 7px Radius (Rule 20)
- **Eliminated Full Perimeter Borders on Pagination Numbers & Controls**:
  - In [`Pagination.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/Pagination.jsx):
    - Removed full perimeter border (`border border-stroke`) from page numbers and Previous / Next navigation buttons.
    - Applied 2px bottom-only border (`border-b-2 border-stroke/80` on inactive number buttons and previous/next buttons; `border-b-2 border-black-90/20` on active number buttons).
    - Standardized corner radius from `rounded-lg` to the shared `rounded-[7px]` token per Rule 20.
    - Applied cleanly across all data tables in Admin, BDE, and Sales panels.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.47s with 0 errors.

### [16/11/2026] Standardized Drawer Buttons: Reduced Height, Bottom-Only 2px Border, Gray for White Buttons (Rule 20)
- **Standardized All Drawer Action Buttons Across Admin, BDE, and Sales**:
  - **Reduced Height Across All Drawer Buttons**:
    - Reduced button heights from `py-2.5` / `h-[44px]` to compact `py-1.5 sm:py-2` / `h-[34px] sm:h-[36px]`, eliminating bulky button footprints.
  - **No Full Perimeter Border (Only Bottom 2px Border - Rule 20)**:
    - Removed all full perimeter borders (`border border-stroke`, `border border-alert`, etc.).
    - Applied 2px bottom-only border (`border-b-2 border-stroke/80` for gray controls, `border-b-2 border-alert` for alert buttons, and `border-b-2 border-black-90/20` for primary/success/secondary buttons).
    - Standardized all drawer buttons with the shared `rounded-[7px]` corner radius token.
  - **White Buttons Converted to Gray (`bg-gray`)**:
    - Converted all white action buttons in drawers to `bg-gray hover:bg-gray/80 text-black-90`:
      - Standardized [`BackButton.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/buttons/BackButton.jsx) (`bg-gray`, `border-b-2 border-stroke/80`, `rounded-[7px]`, `py-1.5 sm:py-2`).
      - Updated `Save as Draft` in `CreateQuotationDrawer.jsx` (Admin, BDE, Sales) (`bg-gray hover:bg-gray/80`, `border-b-2 border-stroke/80`).
    - Colored buttons (`Save Lead`, `Convert Lead`, `Deactivate Lead`, `Export PDF`, `Send for VP Approval`, `DeleteButton`) retain their semantic colors with reduced height and 2px bottom-only borders.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.69s with 0 errors.

### [16/11/2026] Reduced Header & Body Top/Bottom Padding to Max 2 (py-2) Across All Drawers
- **Strict Drawer Padding Limitation (py-2)**:
  - In [`Drawer.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/sidebar/Drawer.jsx):
    - Updated default `headerClassName` fallback from `p-5` to `px-6 py-2` (eliminating large top/bottom gaps above title).
    - Updated default `bodyClassName` fallback to `px-6 py-2`.
  - Across **all 30 drawer components** (Admin, BDE, and Sales panels for Create, Edit, View, Convert, Assign, and Details):
    - Replaced all excessive vertical padding (`py-5`, `py-4`, `pt-1 pb-5`, `pt-2 pb-6`) with `py-2` (strictly not exceeding 2).
    - Reduced gap between drawer subtitle and first form inputs, ensuring a clean, modern, and compact layout without extra whitespace.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.48s with 0 errors.

### [16/11/2026] Removed Top Stroke Border & Reduced Top/Bottom Padding in Drawer Action Footers
- **Clean Borderless Drawer Footers**:
  - In [`CreateQuotationDrawer.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/bde/quotations/CreateQuotationDrawer.jsx) (across BDE, Admin, and Sales) and all CRM drawers ([`Drawer.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/sidebar/Drawer.jsx), [`AddLeadDrawer.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/admin/leadManagement/AddLeadDrawer.jsx), `EditClientDrawer`, `EditContactDrawer`, `EditDealDrawer`, `ConvertLeadDrawer`, etc.):
    - Completely removed the top stroke border (`border-t border-stroke`).
    - Reduced top and bottom padding from `py-4` to compact `py-2.5 sm:py-3`.
    - Maintained sticky positioning and action button styling cleanly.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.52s with 0 errors.

### [16/11/2026] Updated PhoneInput Country Dropdown Chevron to Primary Color (Rule 6)
- **Standardized PhoneInput Dropdown Arrow**:
  - In [`PhoneInput.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/PhoneInput.jsx):
    - Replaced hardcoded inline hex color `text-[#2E90FA]` on the country selection trigger `ChevronDown` icon with the project's brand design token `text-primary`.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.61s with 0 errors.

### [16/11/2026] Added Full 360-Degree Spin Animation on Reset Filter Button Click
- **Smooth Circular Rotation for Reset Icon**:
  - In common button component [`ResetFilterButton.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/buttons/ResetFilterButton.jsx):
    - Added dynamic cumulative rotation state (`rotation`) with `useCallback` handler that smoothly spins the reset icon 360 degrees counter-clockwise (`setRotation(prev => prev - 360)`) on every click.
    - Implemented hardware-accelerated CSS transition (`transition-transform duration-500 ease-in-out` and `transform: rotate(...)deg`) for butter-smooth 60fps animation.
    - Seamlessly active across all 17 CRM table pages via `DataTableToolbar`.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.51s with 0 errors.

### [16/11/2026] Enforced 100% Circular & Borderless Images Across All Tables (Rule 24)
- **Eliminated Square Logos and Surrounding Borders**:
  - Replaced square `rounded-lg` company logos with fully circular `rounded-full` and `border-none` across all client management tables:
    - [`ClientManagement.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/admin/clientManagement/ClientManagement.jsx)
    - [`MyClients.jsx` (BDE)](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/bde/myClients/MyClients.jsx)
    - [`MyClients.jsx` (Sales)](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/sales/myClients/MyClients.jsx)
  - Removed surrounding `border border-stroke` from all avatars, user photos, and assigned BDE images across tables and drawers strictly adhering to Rule 24:
    - [`ContactManagement.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/admin/contactManagement/ContactManagement.jsx)
    - [`MyContacts.jsx` (BDE)](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/bde/myContacts/MyContacts.jsx)
    - [`MyContacts.jsx` (Sales)](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/sales/myContacts/MyContacts.jsx)
    - [`LeadManagement.jsx` (Admin)](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/admin/leadManagement/LeadManagement.jsx)
    - [`MyLeads.jsx` (BDE)](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/bde/myLeads/MyLeads.jsx)
    - [`LeadManagement.jsx` (Sales)](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/sales/leadManagement/LeadManagement.jsx)
    - [`ReportAnalytics.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/sales/analytics/ReportAnalytics.jsx)
    - [`MyTeam.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/sales/myTeam/MyTeam.jsx)
    - [`ViewMemberDrawer.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/sales/myTeam/ViewMemberDrawer.jsx)
    - [`EditContactDrawer.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/admin/contactManagement/EditContactDrawer.jsx)
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.52s with 0 errors.

### [16/11/2026] Resolved Placeholder Selection Bug Across All Form & Search Inputs (Rule 18)
- **Global & Component-Level Non-Selectable Placeholder Enforcement**:
  - Identified reason for placeholder selection: individual input components were missing `placeholder:select-none`, and `client/src/index.css` lacked global `::placeholder` user-select reset rules, causing browsers to select placeholder pseudo-elements during `Ctrl+A` or mouse drags.
  - Added global CSS rules in [`index.css`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/index.css):
    - `input::placeholder, textarea::placeholder { user-select: none !important; -webkit-user-select: none !important; }`
    - `input:placeholder-shown::selection, textarea:placeholder-shown::selection { background-color: transparent !important; }`
  - Added `placeholder:select-none` to all standardized inputs:
    - [`TextInput.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/TextInput.jsx)
    - [`DropdownInput.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/DropdownInput.jsx)
    - [`EmailInput.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/EmailInput.jsx)
    - [`PasswordInput.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/PasswordInput.jsx)
    - [`IdInput.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/IdInput.jsx)
    - [`PhoneInput.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/PhoneInput.jsx)
    - [`TextAreaInput.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/TextAreaInput.jsx)
    - [`DataTableToolbar.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/Table/DataTableToolbar.jsx)
    - [`GlobalSearch.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/GlobalSearch.jsx)
    - [`LoginForm.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/auth/LoginForm.jsx)
  - Result: Placeholders will never turn blue or be selected during page selection, while actual user-entered text, labels, buttons, and tables remain 100% selectable per Rule 18.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.63s with 0 errors.

### [16/11/2026] Updated Sidebar Collapse/Expand Icon Color to Primary
- **Sidebar Toggle Chevron Styling**:
  - In [`Sidebar.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/sidebar/Sidebar.jsx):
    - Changed the color of the sidebar collapse icon (`ChevronsLeft`, `<<`) and expand icon (`ChevronsRight`, `>>`) from `text-black-90` to brand primary color `text-primary`.
    - Maintained the circular background (`rounded-full`), border (`border border-stroke`), and gray background (`bg-gray hover:bg-gray/80`) intact strictly per Rule 20.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.82s with 0 errors.

### [16/11/2026] Applied White Background to Dashboard Header Controls (Date Filter & Export Button)
- **White Background for Dashboard Action Controls**:
  - In [`SalesDashboard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/sales/dashboard/SalesDashboard.jsx), [`AdminDashboard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/admin/dashboard/AdminDashboard.jsx), and [`BdeDashboard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/bde/dashboard/BdeDashboard.jsx):
    - Configured the top-right timeframe filter trigger button ("This Month" / "By Date") to use white background (`bg-white-100 hover:bg-white-100/90`) while maintaining the 2px bottom border (`border-b-2 border-stroke/80`) and 7px corner radius (`rounded-[7px]`).
    - Configured its dropdown option menu container to use `bg-white-100`.
    - Added `variant="white"` support in reusable [`ExportButton.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/buttons/ExportButton.jsx) so it renders with `bg-white-100 hover:bg-white-100/90` on dashboard pages while strictly maintaining the default `bg-gray` on table pages.
    - Standardized both buttons to clean `h-8` height for symmetrical horizontal alignment.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.58s with 0 errors.

### [16/11/2026] Reduced Inside Padding in BDE Dashboard Last 5 Leads Table Card
- **Compact Padding Alignment for Last 5 Leads Table**:
  - In [`BdeDashboard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/bde/dashboard/BdeDashboard.jsx) (inside `Last5LeadsTable`):
    - Reduced card header padding from `p-2 sm:p-5 pb-3` to `px-3.5 sm:px-4 py-2.5 sm:py-3`.
    - Reduced outer table wrapper padding from `px-4 sm:px-5 pb-4` to `px-3 sm:px-4 pb-3`.
    - Compacted table header (`th`) cell padding from `py-2.5 px-4` to `py-2 px-3`.
    - Compacted table body (`td`) cell padding from `py-3.5 px-4` to `py-2 px-3`.
    - Sized avatar & company logos to `w-7 h-7` and quick contact buttons to `w-7 h-7`, standardizing with the Sales dashboard table density.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.52s with 0 errors.

### [16/11/2026] Reduced Inside Padding in Sales Dashboard BDE Performance Table Card
- **Compact Padding Alignment for BDE Performance Table**:
  - In [`BdePerformanceTable.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/sales/dashboard/components/BdePerformanceTable.jsx):
    - Reduced card header padding from `p-4 sm:p-5 pb-3` to `px-3.5 sm:px-4 py-2.5 sm:py-3`.
    - Reduced outer table wrapper padding from `px-4 sm:px-5 pb-4` to `px-3 sm:px-4 pb-3`.
    - Compacted table header (`th`) cell padding from `py-2.5 px-4` to `py-2 px-3`.
    - Compacted table body (`td`) row padding from `py-3 px-4` to `py-2 px-3`.
    - Adjusted avatar sizing to `w-7 h-7` and cell typography to `text-xs sm:text-sm` for a sleek, compact dashboard presentation.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 2.00s with 0 errors.

### [16/11/2026] Restored Import/Export Dropdown on Create Quotation Button
- **Restored Split Dropdown for Create Quotation**:
  - In [`admin/quotations/Quotations.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/admin/quotations/Quotations.jsx), [`bde/quotations/Quotations.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/bde/quotations/Quotations.jsx), and [`sales/quotations/Quotations.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/sales/quotations/Quotations.jsx):
    - Restored `hasDropdown` support on `actionButton` while keeping the standalone export button removed.
    - Clicking the split chevron arrow (`More actions`) on the `[ + Create Quotation | v ]` button cleanly opens the `Import Data` and `Export Data` dropdown menu, matching the user's uploaded reference screenshot.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 4.21s with 0 errors.

### [16/11/2026] Removed Export Button & Down Chevron from Create Quotation Across Quotations Pages
- **Removed Standalone Export Button & Down Chevron**:
  - In [`admin/quotations/Quotations.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/admin/quotations/Quotations.jsx), [`bde/quotations/Quotations.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/bde/quotations/Quotations.jsx), and [`sales/quotations/Quotations.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/sales/quotations/Quotations.jsx):
    - Removed `onExport` prop from `DataTableToolbar` so the standalone export icon button next to Create Quotation is completely removed.
    - Set `hasDropdown: false` on `actionButton` and simplified label to `'Create Quotation'`, removing the split chevron down arrow (`ChevronDown`).
    - The button is now rendered as a clean, single solid action button: `[ + Create Quotation ]`.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 3.13s with 0 errors.

### [16/11/2026] Standardized Common View & Edit Action Buttons on BDE Dashboard
- **Replaced Inline Custom Buttons with Common ViewBtn and EditBtn**:
  - In [`BdeDashboard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/bde/dashboard/BdeDashboard.jsx) (inside `Last5LeadsTable`), replaced the manually implemented inline view and edit action buttons with the project's shared [`ViewBtn`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/buttons/ViewBtn.jsx) and [`EditBtn`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/buttons/EditBtn.jsx) components.
  - Ensures 100% UI consistency across all dashboard and table action columns with the common design tokens (`w-8 h-8 rounded-[7px] bg-gray border-b-2 border-stroke/80 text-primary`).
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 2.85s with 0 errors.

### [16/11/2026] Standardized Dashboard Export Action Button Across All Panels
- **BDE & Sales Dashboard Export Button Alignment**:
  - In [`BdeDashboard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/bde/dashboard/BdeDashboard.jsx) and [`SalesDashboard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/sales/dashboard/SalesDashboard.jsx), replaced the solid blue generic upload button (`bg-secondary text-white-100` with Lucide `Upload`) with the project's standard [`ExportButton`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/buttons/ExportButton.jsx).
  - Matches the exact design token and curved primary blue export icon (`rounded-[7px] bg-gray border-b-2 border-stroke/80 text-primary` with `ExportIcon`) used across Admin Dashboard and all CRM table pages.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 4.41s with 0 errors.

### [06/11/2026] Dynamic Table Pagination & Project-Wide Reset Filter Button Integration
- **100% Dynamic Pagination Standardized Across All CRM Table Pages**:
  - In [`Pagination.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/Pagination.jsx), removed hardcoded default `totalEntries=180` and implemented dynamic entry calculation (`currentCount` strictly reflects actual entries rendered on current page based on `(currentPage - 1) * pageSize + 1` to `min(currentPage * pageSize, totalEntries)`). Added automated out-of-bounds page correction when filtering reduces total pages below the active page index.
  - Replaced hardcoded `totalEntries={180}` with dynamic filtered arrays across all 17 CRM table pages:
    - Admin: `ClientManagement` (`filteredClients.length`), `ContactManagement` (`filteredContacts.length`), `DealManagement` (`filteredDeals.length`), `Quotations` (`filteredQuotations.length`), `StaffManagement` (`filteredStaff.length`).
    - BDE: `MyClients` (`filteredClients.length`), `MyContacts` (`filteredContacts.length`), `MyDeals` (`filteredDeals.length`), `MyLeads` (`filteredLeads.length`), `Quotations` (`filteredQuotations.length`).
    - Sales: `LeadManagement` (`filteredLeads.length`), `MyClients` (`filteredClients.length`), `MyContacts` (`filteredContacts.length`), `MyDeals` (`filteredDeals.length`), `MyTeam` (`filteredMembers.length`), `Quotations` (`filteredQuotations.length`), `ReportAnalytics` (dynamic view length).
  - Expanded mock datasets (`INITIAL_LEADS_DATA`, `INITIAL_CLIENTS_DATA`, `INITIAL_CONTACTS_DATA`, `INITIAL_DEALS_DATA`, `INITIAL_QUOTATIONS_DATA`) to 25 items each so multi-page navigation and dynamic page counts can be tested seamlessly.
- **Top Reset Filter Button Integrated Across All Table Pages**:
  - Added `onResetFilters` handler to `DataTableToolbar` across all tables previously missing it (`ContactManagement` across Admin, BDE, Sales, and CRM Configuration tables `DealStagesTable`, `IndustryTierTable`, `LeadSourcesTable`, `LeadStatusesTable`, and `ConfigurationReasonTable`).
  - Clicking the top `Reset ⟳` button immediately clears search queries and resets all dropdown filters to 'All', smoothly returning pagination to Page 1 without modifying any existing business logic.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.91s with 0 errors.

### [06/11/2026] More Actions Dropdown Icons Aligned with Custom Assets (Group 10 / Group 10 (1))
- **Import/Export Dropdown Icons Swapped to Custom Assets**:
  - In [`DataTableToolbar.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/Table/DataTableToolbar.jsx), replaced Lucide's `Download` and `Upload` square-tray icons with the project's custom designed `ImportIcon` (`client/src/assets/Group 10 (1).png`) and `ExportIcon` (`client/src/assets/Group 10.png`), exactly matching the user's reference mockup.
  - Passed `color="currentColor"` so the icons naturally follow the dropdown option typography and theme styling.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.61s with 0 errors.

### [06/11/2026] Export Action Button Default Icon Color Standardized to Primary Blue
- **Export Icon Default Color Alignment**:
  - In [`ExportButton.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/buttons/ExportButton.jsx), updated the button text color class from `text-black-90 hover:text-primary` to `text-primary`. The export icon now displays in the brand primary blue (`#1B4DFF`) by default, matching View and Edit action button standards.
  - In [`ExportIcon.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/icons/ExportIcon.jsx), updated the default fallback color token from `var(--color-black-90, #262727)` to `var(--color-primary, #1B4DFF)`.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.53s with 0 errors.

### [06/11/2026] Master Split Add Button Dropdown Menu (Import Data & Export Data Actions)
- **Centralized Interactive "More Actions" Dropdown in Master DataTableToolbar**:
  - In [`DataTableToolbar.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/Table/DataTableToolbar.jsx), made the split primary action button's chevron (`More actions`) interactive with dynamic dropdown state:
    - Added `isActionDropdownOpen` state and `actionDropdownRef` with outside-click listener.
    - Chevron rotates 180° when open (`rotate-180`) indicating open state (`^`), exactly matching user screenshot.
    - Interactive dropdown popup (`Import Data` and `Export Data`) renders cleanly beneath the button with `rounded-xl border border-stroke bg-white-100 py-1 z-50 animate-in fade-in zoom-in-95`.
    - Integrated Lucide `Download` icon for `Import Data` and `Upload` icon for `Export Data`.
    - Supports `actionButton.onImport` / `onImport` and `actionButton.onExport` / `onExport`, with fallback file picker and CSV generator from `exportUtils.js`.
    - Automatically enables this split dropdown functionality across every table in the CRM (Lead Management, Client Management, Contact Management, Deal Management, Quotations, Staff Management, CRM Configurations, etc.).
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.50s with 0 errors.

### [06/11/2026] Profile Dropdown Menu Aligned to Figma Specs (Full Trigger Match & Rounded-2xl Surface)
- **TopHeader User Profile Menu Alignment**:
  - In [`TopHeader.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/TopHeader.jsx), refactored the profile action dropdown popup (`Edit Profile` / `Logout`) to align exactly with Figma Image 2 specifications:
    - Removed `data-ui-style="dropdown-menu"` so the table filter select square-corners override does not affect user action menus.
    - Updated corner curvature to `rounded-2xl` with a thin border (`border border-stroke`) and background contrast (`bg-white-100 p-1.5`).
    - Aligned menu width to match the `Johnson Doe` button trigger (`w-full min-w-full sm:left-0 sm:right-0`), preventing it from sticking out sideways.
    - Updated action button highlights to `rounded-lg` with smooth icon and text hover states.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 3.53s with 0 errors.

### [06/11/2026] Notification Drawer Tabs & Mark as All Read Button (7px Radius & Bottom-Only Border)
- **Notification Drawer Header Controls Standardized (Rule 20 Compliance)**:
  - In [`NotificationBell.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/NotificationBell.jsx), refactored the segmented filter tab capsule (`[ All | Unread | Mentions ]`) from full perimeter border (`border border-stroke rounded-lg`) to 2px bottom-only border (`border-b-2 border-stroke/80 rounded-[7px] bg-gray`) with `data-ui-style="joined-control"`, and removed inner perimeter border from the active slider indicator.
  - Refactored `Mark as All Read` button to `rounded-[7px] border-b-2 border-stroke/80 bg-secondary text-white-100`.
  - In [`PillSwitcher.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/PillSwitcher.jsx), aligned segmented controls to `border-b-2 border-stroke/80 rounded-[7px] bg-gray`.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.69s with 0 errors.

### [06/11/2026] Sidebar Logo Dynamic Asset Mapping (Collapsed & Expanded Modes)
- **Separate Dedicated Assets Configured for Closed vs Open Sidebar**:
  - In [`Sidebar.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/sidebar/Sidebar.jsx), configured the closed/collapsed sidebar mode (`CollapsedSidebarView`) to render icon asset `_2107164265360.png` (`client/src/assets/LOGO/_2107164265360.png`).
  - Configured the open/expanded sidebar mode (`SidebarInner`) to render the full brand logo asset `Group 89.png` (`client/src/assets/LOGO/Group 89.png`).
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.54s with 0 errors.

### [06/11/2026] Action & Quick Contact Buttons Refactored (7px Square Radius & 2px Bottom-Only Border)
- **Table Action & Contact Icon Controls Standardized (Rule 20 Compliance)**:
  - In [`ViewBtn.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/buttons/ViewBtn.jsx) and [`EditBtn.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/buttons/EditBtn.jsx), replaced circular shape (`rounded-full`) with the 7px square corner token (`rounded-[7px]`) and 2px bottom-only border in stroke/80 (`border-b-2 border-stroke/80 bg-gray hover:bg-gray/80`), standardizing view and edit action buttons across all CRM tables.
  - In [`LeadManagement.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/admin/leadManagement/LeadManagement.jsx), [`MyLeads.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/bde/myLeads/MyLeads.jsx), and Sales [`LeadManagement.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/sales/leadManagement/LeadManagement.jsx), refactored WhatsApp, Email, Notes/Comments (`MessageSquare`), and Activity Timeline (`Clock`) icon buttons from circular `rounded-full` to `rounded-[7px] bg-gray border-b-2 border-stroke/80`.
  - In [`ContactManagement.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/admin/contactManagement/ContactManagement.jsx), BDE [`MyContacts.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/bde/myContacts/MyContacts.jsx), Sales [`MyContacts.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/sales/myContacts/MyContacts.jsx), and [`BdeDashboard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/bde/dashboard/BdeDashboard.jsx), refactored all Quick Contact (WhatsApp & Mail) and Table Action controls to `rounded-[7px] bg-gray border-b-2 border-stroke/80`.
  - In [`DocumentCard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/cards/DocumentCard.jsx) and [`ReportAnalytics.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/sales/analytics/ReportAnalytics.jsx), aligned action buttons and icon holders to `rounded-[7px] bg-gray border-b-2 border-stroke/80`.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.58s with 0 errors.

### [06/11/2026] Filter Dropdown Floating Menu Width 100% Matches Trigger (Rule 20 Compliance)
- **Dropdown Menu Panel Width Fixed to Match Trigger Width Exactly**:
  - In [`TableFilterSelect.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/Table/TableFilterSelect.jsx), removed hardcoded width constraints (`min-w-[170px] max-w-[220px]`) and applied `left-0 right-0 w-full min-w-full` with `data-ui-width="trigger"`. The floating dropdown options panel now matches the trigger button's width 1:1, preventing wider popups on compact triggers like year filters (`2025` ▾).
  - In [`AdminDashboard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/admin/dashboard/AdminDashboard.jsx) and [`SalesDashboard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/sales/dashboard/SalesDashboard.jsx), removed `w-36` from time filter dropdowns and aligned them to `left-0 right-0 w-full min-w-full` with `data-ui-width="trigger"`.
  - In [`DropdownInput.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/DropdownInput.jsx), ensured `data-ui-width="trigger"` and `left-0 right-0 w-full min-w-full` with `whitespace-nowrap truncate` labels on all option rows.
  - In [`index.css`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/index.css), added global styling for `[data-ui-width="trigger"]` ensuring `width: 100% !important; min-width: 100% !important; max-width: 100% !important;` and single-line option label truncation across the entire application.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.50s with 0 errors.

### [06/11/2026] Dashboard KPI, Stat, and Chart Cards Bottom-Only Border (Rule 20 Compliance)
- **Removal of Full Perimeter Border on All KPI & Dashboard Cards**:
  - In master [`StatCard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/cards/StatCard.jsx), replaced full 4-sided perimeter border (`border border-stroke`) with a 2px bottom-only border (`border-b-2 border-stroke/80`). This automatically standardizes all KPI / telemetry stat tiles across Admin, BDE, and Sales dashboards ("Total Leads", "Assigned Leads", "Unassigned Leads", "Lead Conversion", etc.).
  - In [`BarChart.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/BarChart.jsx), converted card container to `border-b-2 border-stroke/80`, removing perimeter border from "Monthly vs Yearly Revenue" and all related column charts.
  - In [`LeadOverviewCard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/sales/dashboard/components/LeadOverviewCard.jsx), converted card wrapper to `border-b-2 border-stroke/80`, and updated internal badges to `rounded-[7px] border-b-2 border-stroke/80 bg-gray`.
  - In [`BdePerformanceTable.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/sales/dashboard/components/BdePerformanceTable.jsx) and [`BdeDashboard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/bde/dashboard/BdeDashboard.jsx), converted table card containers to `border-b-2 border-stroke/80` and removed borders from profile photos per Rule 24.
  - In [`LeadStatusBreakdown.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/LeadStatusBreakdown.jsx), [`LeadStageDistributionCard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/cards/LeadStageDistributionCard.jsx), [`LeadSourcePerformance.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/LeadSourcePerformance.jsx), [`DealDistribution.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/DealDistribution.jsx), [`ExecutiveActivityCard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/cards/ExecutiveActivityCard.jsx), [`SystemHealthCard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/cards/SystemHealthCard.jsx), [`ActivityCard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/cards/ActivityCard.jsx), [`LeadSummaryCard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/cards/LeadSummaryCard.jsx), [`ReportAnalytics.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/sales/analytics/ReportAnalytics.jsx), [`SalesSettings.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/sales/settings/SalesSettings.jsx), [`BdeSettings.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/bde/settings/BdeSettings.jsx), and [`CrmConfigSidebar.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/admin/crmConfiguration/components/CrmConfigSidebar.jsx), updated all card containers to `border-b-2 border-stroke/80`.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.49s with 0 errors.

### [06/11/2026] Drawer Close ('X') Button (Square 7px Radius, Gray Background & Bottom-Only Border)
- **Drawer Close Button Refactored (No Hover & Rule 20 Compliance)**:
  - In master [`Drawer.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/sidebar/Drawer.jsx), replaced circular close button (`rounded-full bg-[#F2F4F7] hover:bg-[#E4E7EC]`) with square 7px radius token (`rounded-[7px]`), 2px bottom-only border (`border-b-2 border-stroke/80`), gray background (`bg-gray`), persistent muted color (`text-black-90/70`), and zero hover background changes.
  - Automatically updates the close button across all slide-over drawers across Admin, BDE, and Sales modules.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.79s with 0 errors.

### [06/11/2026] Dashboard Controls Alignment (Monthly/Yearly Capsule & Year Filter)
- **Monthly / Yearly Segmented Pill & Year Selector Refactor**:
  - Refactored Monthly / Yearly chart toggle capsule across [`AdminDashboard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/admin/dashboard/AdminDashboard.jsx), [`BdeDashboard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/bde/dashboard/BdeDashboard.jsx), and [`SalesDashboard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/sales/dashboard/SalesDashboard.jsx) with 2px bottom-only border (`border-b-2 border-stroke/80 rounded-[7px] bg-gray`), removing full perimeter border.
  - Active button styled with solid brand primary (`bg-primary text-white-100 font-bold rounded-[5px] px-3 py-1`), inactive with dark text (`text-black-90`).
  - Aligned year filter to [`TableFilterSelect.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/Table/TableFilterSelect.jsx) with bottom-only border (`border-b-2 border-stroke/80 rounded-[7px] bg-gray`).
  - Refactored top-level header time filter ("This Month ▾") to bottom-only border in `AdminDashboard` and `SalesDashboard`.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.73s with 0 errors.

### [06/11/2026] Table Toolbar Controls 2px Bottom-Only Border & 7px Radius (Rule 20 Compliance)
- **Shared Toolbar Action Buttons & Filters Bottom-Border Refactor**:
  - Refactored all table filter dropdown triggers ([`TableFilterSelect.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/Table/TableFilterSelect.jsx)) from full perimeter border to `border-b-2 border-stroke/80 rounded-[7px] bg-gray`.
  - Refactored [`ResetFilterButton.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/buttons/ResetFilterButton.jsx) to `h-8 bg-gray border-b-2 border-stroke/80 rounded-[7px]`.
  - Refactored [`ViewModeToggle.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/ViewModeToggle.jsx) (List/Grid view) with `data-ui-style="joined-control"`, `border-b-2 border-stroke/80 rounded-[7px] bg-gray` on the outer shell and seamless child tab buttons with `data-ui-style="filter-tab"`.
  - Refactored [`ExportButton.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/buttons/ExportButton.jsx) to `h-8 w-8 bg-gray border-b-2 border-stroke/80 rounded-[7px]`.
  - Configured split action button (`+ Add New Lead v`) in [`DataTableToolbar.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/Table/DataTableToolbar.jsx) with continuous bottom-only border `border-b-2 border-stroke/80 rounded-[7px]` using `data-ui-style="split-action"`.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.75s with 0 errors.

### [06/11/2026] Universal Table Container Layout (All Borders & Scrollbars Removed)
- **Zero Border & Zero Scrollbar on All Page Tables**:
  - In [`TableContainer.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/Table/TableContainer.jsx), removed all 4 perimeter borders (`border-none`) on the main table wrapper card across all pages.
  - Replaced `table-scrollbar` with `no-scrollbar` in [`TableContainer.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/Table/TableContainer.jsx) and [`DataTable.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/Table/DataTable.jsx).
  - Globally hidden `.table-scrollbar` (`display: none !important`, `scrollbar-width: none !important`) in [`index.css`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/index.css) to guarantee zero visible vertical or horizontal scrollbars across all tables while preserving native wheel and touch scrolling.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.53s with 0 errors.

### [06/11/2026] Dropdown Floating Options Menu (Border Removed & Gray Background Applied)
- **Zero Perimeter Border & Gray Background (`bg-gray`)**:
  - Removed perimeter border (`border-none`) on the floating opened dropdown menu container in [`DropdownInput.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/DropdownInput.jsx), [`TableFilterSelect.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/Table/TableFilterSelect.jsx), and [`PhoneInput.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/PhoneInput.jsx).
  - Updated floating container background color to `bg-gray` (`#F3F5FA`), providing seamless contrast with hover highlights (`hover:bg-white-100`) and active selection tint (`bg-primary/10 text-primary font-semibold` with `<Check size={12} />`).
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.61s with 0 errors.

### [06/11/2026] Standard Table Filter Dropdown Menu (100% Flat, Square-Surface & Figma Aligned)
- **TableFilterSelect & Universal Dropdown Refactor**:
  - Created [`TableFilterSelect.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/Table/TableFilterSelect.jsx) (re-exported in `components/inputs/`) implementing 100% flat design, zero shadows, square corners (`rounded-none`), zero horizontal menu padding (`p-0`), instant keyboard type-ahead, and active item tint (`bg-primary/10 text-primary font-semibold`) with `<Check size={12} />`.
  - Added global square-corner dropdown menu CSS overrides in [`index.css`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/index.css) under `[data-ui-style="dropdown-menu"]`.
  - Integrated `TableFilterSelect` into [`DataTableToolbar.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/Table/DataTableToolbar.jsx) for all mobile and desktop filter selects across the CRM.
  - Aligned [`DropdownInput.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/DropdownInput.jsx) options list to match the exact same square-surface, `bg-primary/10 text-primary font-semibold`, and checkmark indicator.
  - Replaced native dashboard year `<select>` tags in [`AdminDashboard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/admin/dashboard/AdminDashboard.jsx) and [`BdeDashboard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/bde/dashboard/BdeDashboard.jsx) with `TableFilterSelect`.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.53s with 0 errors.

### [06/11/2026] Project-wide Inputs 2px Bottom-Only Border & 7px Radius (Rule 20 Compliance)
- **Universal Common Inputs & Selects Refactored**:
  - Refactored all common input components in `client/src/components/inputs/` ([TextInput.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/TextInput.jsx), [EmailInput.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/EmailInput.jsx), [PasswordInput.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/PasswordInput.jsx), [TextAreaInput.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/TextAreaInput.jsx), [IdInput.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/IdInput.jsx), [DropdownInput.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/DropdownInput.jsx), [PhoneInput.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/PhoneInput.jsx), [UploadDropzone.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/UploadDropzone.jsx)) to strictly have a 2px bottom-only border (`border-b-2 border-stroke/80`) with `rounded-[7px]`, removing all 4-sided borders (`border border-stroke`) and blue border transitions on focus/hover.
  - Refactored [DataTableToolbar.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/Table/DataTableToolbar.jsx) search inputs and select filters to `border-b-2 border-stroke/80 rounded-[7px]`.
  - Refactored all remaining drawer and page-specific inputs across Admin, BDE, and Sales modules ([EditDealDrawer.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/admin/dealManagement/EditDealDrawer.jsx), [ConvertLeadDrawer.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/admin/leadManagement/ConvertLeadDrawer.jsx), [LeadCommentsDrawer.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/admin/leadManagement/LeadCommentsDrawer.jsx), [CreateQuotationDrawer.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/admin/quotations/CreateQuotationDrawer.jsx), [ForgotPassword.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/auth/ForgotPassword.jsx), [NewPassword.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/auth/NewPassword.jsx), [BdeSettings.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/bde/settings/BdeSettings.jsx), [SalesSettings.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/sales/settings/SalesSettings.jsx)) to ensure zero full borders exist on any input across the entire suite.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.71s with 0 errors.

### [06/11/2026] Strict Stroke Bottom-Border Enforcement on Inputs & Recent Searches
- **Consistent Stroke Bottom Border**:
  - Removed all `border-primary` transitions on focus, focus-within, and hover states in [GlobalSearch.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/GlobalSearch.jsx).
  - Ensured the 2px bottom border persistently retains the neutral token color (`border-b-2 border-stroke/80`) during idle, hover, and active focus states, matching exact user visual specification.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.73s with 0 errors.

### [06/11/2026] Common Page Workspace Padding Reduction (All Pages)
- **Main Workspace Padding Reduced**:
  - Decreased common default 4-sided padding on `<main>` across all 3 layout shells ([AdminLayout.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/layouts/AdminLayout.jsx), [BdeLayout.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/layouts/BdeLayout.jsx), and [SalesLayout.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/layouts/SalesLayout.jsx)) from `p-3 sm:p-4 md:p-5` (20px) to `p-2 sm:p-2.5 md:p-3` (12px max).
  - Maximizes dashboard workspace area and grid card footprint across all devices while maintaining clean corner spacing with `rounded-tl-[15px]`.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.73s with 0 errors.

### [06/11/2026] Global Search Input & Recent Searches Rule 20 Bottom-Only Border
- **Search Modal & Recent Searches Bottom-Only Border**:
  - Removed perimeter rings and full borders on search input hover/focus state in [GlobalSearch.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/GlobalSearch.jsx). Configured strictly with bottom-only 2px border (`border-b-2 border-stroke/80 focus-within:border-primary`).
  - Refactored all "Recent Searches" cards: replaced full perimeter border (`border border-[#E2E8F0]`) with bottom-only border (`border-b-2 border-stroke/80 rounded-[7px] bg-gray hover:bg-gray/80 hover:border-primary`), interactive pointer (`cursor-pointer`), and brand tokens.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.90s with 0 errors.

### [06/11/2026] Header Controls Rule 20 Enforcement (2px Bottom-Only Border & 7px Radius)
- **Top Header Controls Refactored to Rule 20**:
  - **GlobalSearch** ([GlobalSearch.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/GlobalSearch.jsx)): Removed full perimeter border; replaced with light gray background (`bg-gray`), 2px bottom border (`border-b-2 border-stroke/80`), and shared 7px radius (`rounded-[7px]`).
  - **NotificationBell** ([NotificationBell.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/inputs/NotificationBell.jsx)): Replaced full perimeter border and circular shape with `bg-gray`, 2px bottom border (`border-b-2 border-stroke/80`), and shared 7px radius (`rounded-[7px]`).
  - **ProfileCapsule** ([TopHeader.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/TopHeader.jsx)): Removed full perimeter border; updated trigger container with `bg-gray`, 2px bottom border (`border-b-2 border-stroke/80`), and shared 7px radius (`rounded-[7px]`), keeping circular borderless avatar (`rounded-full select-none data-preserve-radius`).
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.45s with 0 errors.

### [06/11/2026] Sidebar Active Navigation Link Styling (Primary Background & White Text)
- **Active Navigation Styling (Matching Reference Specification)**:
  - Updated active navigation link in [Sidebar.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/sidebar/Sidebar.jsx):
    - Background: solid brand primary (`bg-primary`).
    - Typography: crisp white text (`text-white-100 font-semibold`).
    - Icon: white icon (`text-white-100`).
    - Chevron: white chevron (`text-white-100`).
    - Accent indicator: right border accent in secondary blue (`border-r-[3px] border-secondary`).
  - Inactive navigation links remain high-contrast with brand blue icons (`text-primary`), dark text (`text-black-90/80 font-medium`), and smooth hover effect (`hover:bg-gray hover:text-black-90`).
  - Collapsed icon navigation view synchronized with `bg-primary text-white-100` on active state and `text-primary` on inactive state.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.56s with 0 errors.

### [06/11/2026] Common 15px Top-Left Border Radius on Main Workspace
- **Main Workspace Single-Corner Radius (15px)**:
  - Applied `rounded-tl-[15px]` to the dynamic page content wrapper and `<main>` element across all common application layouts:
    - [AdminLayout.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/layouts/AdminLayout.jsx)
    - [BdeLayout.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/layouts/BdeLayout.jsx)
    - [SalesLayout.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/layouts/SalesLayout.jsx)
  - Styled root and workspace column backgrounds with `bg-white-100` so the 15px top-left curved corner displays against the white sidebar and header, creating the curved inward corner across all pages.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.59s with 0 errors.

### [06/11/2026] Removal of Sidebar Right Border & TopHeader Bottom Border
- **Seamless Flush Layout (Border Removal)**:
  - Removed `border-r border-stroke` from [Sidebar.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/sidebar/Sidebar.jsx) (`<aside>`), removing the vertical dividing border between the sidebar and the main content area.
  - Removed right-border indicators (`border-r-[3px] border-primary`) from active and inactive sidebar navigation links for a flat, seamless appearance.
  - Removed `border-b border-stroke` from [TopHeader.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/TopHeader.jsx) (`<header>`), removing the horizontal dividing border between the top header and page content.
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.77s with 0 errors.

### [06/11/2026] Sidebar Icon Color Standardization (Brand Blue Primary)
- **Brand Blue Primary Icons**: Standardized all sidebar icons across both expanded and collapsed views in [Sidebar.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/sidebar/Sidebar.jsx) to always render in brand primary blue (`text-primary`), matching the reference specification.
- **Active & Inactive State Refinement**:
  - Inactive navigation links pair primary-colored icons with high-contrast text (`text-black-90/80 font-medium hover:bg-gray hover:text-black-90`).
  - Active navigation links use a soft tinted container (`bg-primary/10 text-primary font-semibold border-primary`) with primary icon and indicator chevron.
  - Collapsed icon items render with `text-primary` and soft tinted active highlights (`bg-primary/10 text-primary`).
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.84s with 0 errors.

### [06/11/2026] Profile Header Dropdown Menu & Sidebar Cleanup
- **Profile Header Dropdown Menu**: Transferred the Logout action and profile controls from the sidebar to a sleek user menu dropdown inside [TopHeader.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/TopHeader.jsx):
  - **Capsule Trigger**: Features circular borderless avatar (`rounded-full` per Rule 24), user name, and interactive rotating chevron icon (`ChevronDown`).
  - **Dropdown Panel**: Adheres to flat border-only policy (`border border-stroke bg-white-100 rounded-xl`, zero shadow per Rule 13, `data-ui-style="dropdown-menu"` per Rule 20/21).
  - **Edit Profile Action**: Uses `PenLine` icon in brand primary blue (`text-primary`), dynamically routing to `/bde/profile`, `/sales/profile`, or `/admin/config`.
  - **Logout Action**: Uses `LogoutIcon` in alert red (`text-alert`), launching [LogoutConfirmationModal.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/LogoutConfirmationModal.jsx) upon click.
  - **Outside Click Detection**: Reusable [useClickOutside.js](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/hooks/useClickOutside.js) closes menu automatically.
- **Sidebar Cleanup**:
  - Completely removed the bottom logout buttons and footers from both collapsed and expanded views in [Sidebar.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/sidebar/Sidebar.jsx).
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`) in 1.98s with 0 errors.

### [06/11/2026] Sidebar Theme Update to White Background (Design Tokens)
- **Sidebar Background White Migration**: Replaced dark gradient background (`linear-gradient(180deg, #001965 0%, #000C30 100%)`) with clean white design token (`bg-white-100`) and modern right border (`border-r border-stroke`) in [Sidebar.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/sidebar/Sidebar.jsx).
- **Navigation & Typography High Contrast**:
  - Section headings (`MAIN`, `SALES WORKSPACE`, `CUSTOMIZE`) set to `text-black-90/50 uppercase tracking-wider font-semibold`.
  - Inactive navigation links updated to `text-black-90/75 hover:bg-gray hover:text-black-90`.
  - Active navigation links maintain high-contrast brand focus with `bg-primary text-white-100 border-secondary`.
  - Header brand "CRM" text updated to `text-primary font-black` for seamless visibility.
  - Collapse button styled with `border-stroke bg-gray text-black-90 hover:bg-stroke/40` preserving full circular radius with `data-preserve-radius` (Rule 20).
  - Divider lines updated from white opacity to subtle stroke gradient `via-stroke`.
- **TopHeader Profile Photo Audit**: Enforced Rule 24 (circular & borderless) on user profile photo inside [TopHeader.jsx](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/TopHeader.jsx).
- **Zero Impact / Zero Errors**: Verified 100% clean production build (`npm run build`) in 1.48s with 0 errors, keeping all layout mechanisms and routing untouched.

### [06/11/2026] Sidebar Section Heading Styling Optimization
- **Heading Color Standardization**: Updated all sidebar section headings (`MAIN`, `SALES WORKSPACE`, `CUSTOMIZE`) and collapse/expand chevrons to use crisp, full-contrast `text-white-100` instead of muted opacity (`text-white-100/50`) across `Sidebar.jsx`.
- **Production Build**: Verified 100% clean Vite compilation (`npm run build`) in 2.43s with 0 errors.
- **Rule 13 (Strict No-Shadow Policy)**: Removed 149 shadow class occurrences across 69 files, restoring a 100% flat border-only UI design.
- **Rule 18 (Strict Non-Selectable Placeholders ONLY)**: Cleaned 117 occurrences of invalid `select-none` on buttons, badges, spans, and cards; preserved non-selectable state strictly for inputs and search placeholders.
- **Rule 24 (Strict Circular & Borderless Profile Photos)**: Fixed all avatar and profile photo containers to `rounded-full` with zero borders (`border-none`).
- **Rule 23 (Clean Empty Form Inputs)**: Cleaned pre-filled dummy values in all 'Add / Create' drawers (`AddLeadDrawer.jsx`, `CreateQuotationDrawer.jsx` across Admin, BDE, and Sales modules) so form fields initialize completely empty (`''`).
- **Rule 16 & 21 (Searchable Dropdowns & Surface Rules)**: Removed placeholders from dropdown selectable options in `DropdownInput.jsx` and `leadsConstants.js`. Added `data-ui-style="dropdown-menu"` and square-corner styling.
- **Rule 22 (Strict Date Format DD/MM/YYYY)**: Standardized mock dates across all constants (`leadsConstants.js`, `dealsConstants.js`, `clientsConstants.js`, `bdeDashboardConstants.jsx`, `quotationsConstants.js`) to `DD/MM/YYYY`.
- **Rule 6 (Common Design Tokens)**: Migrated 221 inline hex classes to Tailwind tokens (`border-stroke`, `bg-gray`, `text-black-90`, `bg-alert-light`, `bg-primary`, etc.).
- **Build Verification**: Verified 100% clean production build with Vite (`npm run build`).


### [17/11/2026] Domain-Based Page Unification & Folder Structure Flattening
- **Flattened Role Folders & Merged Duplicate Pages**:
  - Removed deeply nested role-based subdirectories (`pages/admin/`, `pages/bde/`, `pages/sales/`) and deprecated standalone login views (`AdminLogin.jsx`, `BdeLogin.jsx`, `SalesLogin.jsx`).
  - Created clean, unified, domain-driven page folders under `client/src/pages/`:
    - `pages/auth/`: Single authentication with [`UnifiedLogin.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/auth/UnifiedLogin.jsx), [`ForgotPassword.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/auth/ForgotPassword.jsx), and [`NewPassword.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/auth/NewPassword.jsx).
    - `pages/dashboard/`: Unified [`Dashboard.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/dashboard/Dashboard.jsx) with role-based view switching between `AdminDashboardView.jsx`, `SalesDashboardView.jsx`, and `BdeDashboardView.jsx` colocated in `pages/dashboard/components/`.
    - `pages/leads/`: Unified [`Leads.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/leads/Leads.jsx) with colocated drawers (`AddLeadDrawer.jsx`, `ConvertLeadDrawer.jsx`, `LeadActivityDrawer.jsx`, `LeadCommentsDrawer.jsx`), eliminating 3 sets of duplicate drawer files.
    - `pages/clients/`: Unified [`Clients.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/clients/Clients.jsx) with colocated [`EditClientDrawer.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/clients/EditClientDrawer.jsx).
    - `pages/contacts/`: Unified [`Contacts.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/contacts/Contacts.jsx) with colocated [`EditContactDrawer.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/contacts/EditContactDrawer.jsx).
    - `pages/deals/`: Unified [`Deals.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/deals/Deals.jsx) with colocated [`EditDealDrawer.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/deals/EditDealDrawer.jsx).
    - `pages/quotations/`: Unified [`Quotations.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/quotations/Quotations.jsx) with colocated [`CreateQuotationDrawer.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/quotations/CreateQuotationDrawer.jsx).
    - `pages/staff/`: Unified [`StaffManagement.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/staff/StaffManagement.jsx) for Admin workspace.
    - `pages/configuration/`: Unified [`CrmConfiguration.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/configuration/CrmConfiguration.jsx) with its modular taxonomy components.
    - `pages/team/`: Unified [`MyTeam.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/team/MyTeam.jsx) for Sales workspace.
    - `pages/analytics/`: Unified [`ReportAnalytics.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/analytics/ReportAnalytics.jsx) for Sales telemetry.
    - `pages/settings/`: Unified [`Settings.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/settings/Settings.jsx) and [`EditProfile.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/pages/settings/EditProfile.jsx).
- **Simplified Routing**:
  - Updated [`AppRoutes.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/routes/AppRoutes.jsx) to directly load page components using `React.lazy()` from domain folders.
  - Streamlined [`DynamicRouteWrappers.jsx`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/routes/DynamicRouteWrappers.jsx) to serve strictly as the dynamic layout shell provider (`DynamicLayout`).
- **Production Build**: Verified 100% clean Vite compilation (`npm run build`) in 1.78s with 0 errors.

### [17/11/2026] Complete Architectural Refactoring: Flat `pages/`, Single `Login.jsx`, and Strict `components/` (`common/` & `modules/`)
- **100% Flat `pages/` Directory (Zero Subfolders)**:
  - Eliminated all subdirectories in `client/src/pages/`.
  - All 13 page components are located directly in the root of `pages/`:
    `Login.jsx`, `Dashboard.jsx`, `Leads.jsx`, `Clients.jsx`, `Contacts.jsx`, `Deals.jsx`, `Quotations.jsx`, `StaffManagement.jsx`, `CrmConfiguration.jsx`, `MyTeam.jsx`, `ReportAnalytics.jsx`, `Settings.jsx`, `EditProfile.jsx`.
- **Single Auth Entry Page (`pages/Login.jsx`)**:
  - Replaced multiple standalone auth pages with single `Login.jsx`, dynamically loading `LoginForm.jsx`, `ForgotPasswordForm.jsx`, and `NewPasswordForm.jsx` from `components/modules/auth/` based on current route/mode (`/login`, `/forgot-password`, `/new-password`, `/reset-password`).
- **Strictly Two Top-Level Component Directories**:
  - `components/common/`: Houses all universally reusable UI elements (`inputs/`, `buttons/`, `cards/`, `Table/`, `sidebar/`, `icons/`, plus top-level common widgets like `TopHeader`, `BarChart`, `LogoutConfirmationModal`, etc.).
  - `components/modules/`: Houses all page-specific subcomponents, sectional views, and drawers (`auth/`, `dashboard/`, `leads/`, `clients/`, `contacts/`, `deals/`, `quotations/`, `configuration/`, `team/`).
- **Single Conditional Drawer Per Module**:
  - All module drawers adhere to the strict 1-drawer conditional pattern:
    - **`create` (Add)**: Initializes clean empty fields (`''`) with placeholders (Rule 23); active edit state; "Save" action.
    - **`edit` (Edit)**: Populates existing row data; active edit state; "Save Changes" action.
    - **`view` (View)**: Populates existing row data; **all inputs disabled / read-only**; save actions hidden (Back action only).
- **Barrel Export**: Added `components/common/index.js` for centralized import access across design system components.
- **Production Build**: Verified 100% clean Vite compilation (`npm run build`) in 1.35s with 0 errors.

### [17/11/2026] Complete Purification of `components/common/` & Module Reorganization
- **Purified `components/common/` to Strictly 100% Reusable Elements**:
  - Relocated all 12 single-page / single-module components from `components/common/` to their respective `components/modules/` folders:
    - **Dashboard Module** (`components/modules/dashboard/`): `LeadSourcePerformance.jsx`, `LeadStatusBreakdown.jsx`, `DealDistribution.jsx`, `ExecutiveActivityCard.jsx`, `LeadStageDistributionCard.jsx`, `SystemHealthCard.jsx`.
    - **Leads Module** (`components/modules/leads/`): `ActivityCard.jsx`, `DocumentCard.jsx`, `LeadSummaryCard.jsx`.
    - **Configuration Module** (`components/modules/configuration/`): `PillSwitcher.jsx`, `LeadStatusStarIcon.jsx`.
    - **Quotations Module** (`components/modules/quotations/`): `TextAreaInput.jsx`.
  - Updated barrel exports in [`index.js`](file:///c:/Users/tech9/Desktop/PROJECTS/G---AXIS-CRM/client/src/components/common/index.js), `cards/index.js`, `inputs/index.js`, and `icons/index.js`.
  - `components/common/` now strictly contains universal, multi-page controls used across the entire application:
    - `buttons/`: `BackButton`, `Button`, `DeleteButton`, `EditBtn`, `ExportButton`, `ResetFilterButton`, `ViewBtn`
    - `cards/`: `StatCard`
    - `icons/`: `EditIcon`, `ExportIcon`, `ImportIcon`, `LogoutIcon`, `QuoteIcon`, `SearchIcon`, `ViewIcon`
    - `inputs/`: `AvatarStack`, `DropdownInput`, `EmailInput`, `GlobalSearch`, `IdInput`, `NotificationBell`, `Pagination`, `PasswordInput`, `PhoneInput`, `PhoneNumber`, `StatusRadioInput`, `TableFilterSelect`, `TextInput`, `UploadDropzone`
    - `sidebar/`: `Drawer`, `Sidebar`, `SidebarNavigation`
    - `Table/`: `DataTable`, `DataTableToolbar`, `TableContainer`, `TableFilterSelect`
    - Direct common widgets: `BarChart.jsx`, `ContactAvatarPlaceholder.jsx`, `LogoutConfirmationModal.jsx`, `MobilePageHeader.jsx`, `TopHeader.jsx`, `ViewModeToggle.jsx`
- **100% Clean Production Build**: Verified with Vite compilation (`npm run build`) passing in 1.48s with 0 errors.

### Leads API Integration (20/11/2026)

- Replaced the leads page's mock list and local create/edit/status/convert behavior with authenticated calls to `/api/crm/leads`.
- Added `src/services/leadsService.js` to map the backend lead schema and response envelope to the existing UI model. Search, stage, and source filters are sent to supported backend query parameters; priority is retained as metadata in the backend requirement field because the database has no separate priority column.
- Added the full-page create flow at `/leads/new`, reusing the established lead form and retaining its extra fields. Added the Vite `/api` development proxy to `http://localhost:5000` to prevent frontend-origin 404 responses when the backend uses its default port.
- Added bearer token forwarding in the shared API client. The create form requires the backend-required company name, full name, and email, and reports API save failures without leaving the page.
- Backend fields currently persist company, full name, email, phone, source, website, industry/city IDs, and requirement text. Extra UI values without matching backend columns remain visible in the form but are not independently persisted. Document upload remains unavailable in the backend.
- Authentication remains on the current mock frontend flow. For current API development, the shared API client uses the provided temporary bearer token when the saved frontend token is a mock; `VITE_API_TOKEN` can override it. A genuine token saved by a future auth integration takes precedence. The provided token expires on 27/11/2026 at 11:40 UTC and must be replaced after expiry.

### Lead Form Scrolling and Full Record Details (20/11/2026)

- Kept the full-page lead form and enabled a visible vertical scrollbar for `/leads/new` across role layouts.
- Removed scrollbar hiding from drawer content so the complete View/Edit lead form and its fixed footer remain reachable on shorter screens.
- View/Edit now fetches `/api/crm/leads/:id` for complete details. Added the backend requirement and expected-value fields to the form and mapped backend industry/city identifiers into selectable detail values.
- Normalized lead codes from the API to uppercase (for example, `gg_lead_001` displays as `GG_LEAD_001`). Add, View, and Edit share the same lead form component and field layout.

### Lead Create, View, and Edit Page Routes (20/11/2026)

- Routed Add, View, and Edit through the shared full-page lead form at `/leads/new`, `/leads/:id/view`, and `/leads/:id/edit`; activity and comments remain drawers.
- Removed the sticky page footer overlap so all form fields, including status, priority, requirement, and expected value, are reachable by page scrolling.
- Expanded lead list responses with requirement, industry, city, and expected value fields. Lead creation now accepts and validates the backend-supported status field.
- Duplicate conflicts now display the backend's specific duplicate message and, when the matching record is visible to the current user, offer a direct link to its View page.
- View/Edit mode is derived from the lead route and clears create-form errors when navigation reuses the page component.
- Replaced static Lead Comments data with the backend lead activity endpoints: notes load from `GET /api/crm/leads/:id` and new comments post to `POST /api/crm/leads/:id/activities` as note activities. The drawer now shows loading, empty, and API error states.

### Contacts API and Full-Page Details (20/11/2026)

- Replaced contact mock rows with server-backed pagination and debounced search using `GET /api/crm/contacts`; export downloads the filtered backend CSV.
- View and Edit actions navigate to `/contacts/:id/view` and `/contacts/:id/edit` and use the detail and update endpoints in a full page, with loading, error, and save states.
- Contact forms send only fields supported by the backend (name, designation, email, phone). Account name and primary-contact state come from API data; deal counts and avatars are not returned by this API and are shown without invented values.
- No contact create route was added because the backend creates contacts during lead conversion and exposes no contact POST endpoint.

### Application Typography Scale (20/11/2026)

- Set shared Tailwind typography tokens to 90% of their default sizes at normal 100% browser zoom. This scales text consistently across dashboard, Leads, Contacts, and shared components while preserving layout spacing and browser zoom.
# Lead Document Uploads (20/11/2026)

- Lead create/edit pages accept up to 10 PNG, JPG/JPEG, or PDF documents, each no larger than 5 MB, and display selected and saved files.
- Documents use authenticated multipart `FormData` calls; the shared API client leaves the multipart boundary header to the browser.
- Lead detail pages load document metadata and support authenticated download/removal. Lead priority remains High, Medium, or Low and continues through the existing API requirement metadata mapping.

### Shared Notifications and Lead Table (20/11/2026)

- Added one app-wide toast provider and viewport for success and error messages across lead saves, stage changes, comments, and lead actions.
- Lead stage controls now persist changes through the status API and refresh the row after confirmation.
- Lead table columns now use deliberate widths, fixed layout, truncation with full-name tooltips, and horizontal scrolling at narrow widths to prevent name and company overlap.

### Lead Conversion Page (20/11/2026)

- Replaced the conversion drawer flow with the lazy-loaded `/leads/:id/convert` page and dynamically loaded lead and company summaries.
- The form submits deal title, amount, supported deal stage, and a validated DD/MM/YYYY close date to the lead-conversion API. Product interest and lead assignment are displayed from the lead record.
- Success and API validation failures use the shared toast provider; only qualified leads can submit conversion.

### Deal Directory Table and Inline Stage Updates (21/11/2026)

- Aligned the Deal list structure with the Leads table by displaying the uppercase Deal Code in its own column, followed by Deal Name and the API-backed account, owner, value, stage, close date, probability, and actions.
- Replaced the read-only Deal stage badge with an inline stage selector. Changes use `PATCH /api/crm/deals/:id/stage`, update the row only after the API confirms the change, and show errors through the shared toast.
- Added Leads-style header sort arrows and fixed table column sizing so Deal Name and Account remain compact, readable, and do not create excessive whitespace.
- Sized the Deals table to its columns with horizontal scrolling when needed, and added a visible chevron to the inline stage selector.
- Deal amount validation now accepts both Indian comma grouping (for example, `1,00,000`) and international grouping, while numeric conversion strips grouping commas before API submission.
- Kept server-backed search, stage and owner filters, pagination, export, and the list-only view in place.

### API-backed Client Account Directory (21/11/2026)

- Replaced the Clients page's generated sample rows, static filters, local pagination, and alert export with authenticated `/crm/accounts` list, detail, update, and CSV export requests.
- The directory now displays API account codes/names, resolved industry and owner labels, linked contact counts, open deal counts/values/stages, and DD/MM/YYYY creation dates. It includes the FRD account KPIs and server filters for industry and linked-contact ranges.
- View/Edit loads authorized Account details and linked Contacts/Deals. Edit sends only supported account fields to `PATCH /crm/accounts/:id`; backend failures stay in the drawer for correction.
- Account detail reads are deduplicated while in flight and cached briefly to prevent duplicate requests during rapid repeat opens; successful saves and directory reset invalidate the cached detail.
- The backend list enriches its authorized, paginated account records with real industry/owner lookups and Contact/active Deal summaries. Accounts created during successful Lead Conversion are visible to their authorized creator/owner.
- Removed the unused Clients sample-data constants to prevent static account rows from being reused.
- Replaced the account detail drawer with lazy-loaded `/clients/:id/view` and `/clients/:id/edit` pages. The full-page flow retains API-backed editing, linked Contact/Deal summaries, and directory navigation.
- Arranged the linked Contact and Deal summaries as side-by-side sections on wide screens and added editable GST alongside account name, industry, email, phone, and address, matching fields accepted by the Accounts API.
- Renamed the BDE and Sales workspace entry and page title from “My Clients” to “My Accounts,” updated the Admin label to “Account Management,” and aligned the account table, search, back button, and export filename with the FRD terminology.
- Populated the editable Industry field from the active Industry Master endpoint and fixed update validation for the lookup IDs used by the backend. Assigned BDE stays read-only because ownership reassignment is not an Accounts API operation.
- Added authenticated Profile and Change Password flows, connected login to the tenant API with the role returned by RBAC, and added a Settings link to profile editing. Account identity, role, and work email remain read-only; name and phone are self-editable.
### Quotations API integration (21/11/2026)
- Replaced quotation mock rows with the tenant API collection endpoint, server-side search, product/status filters, API pagination, and loading/error states.
- Added API response mapping and connected Draft create/edit plus approval submission to the quotation lifecycle endpoints.
- Reworked the quotation form page to select accessible Deals and Contacts from the selected Account, collect real line-item and commercial fields, and send ISO dates while displaying `DD/MM/YYYY`.
- Moved quotation create, view, and draft-edit workflows to dedicated flat page routes (`/quotations/new`, `/quotations/:id/view`, `/quotations/:id/edit`) per the page-based design request.
- Added API product filtering backed by distinct quotation line-item products; the directory now fits the table to the available page width.
### Responsive data tables (21/11/2026)
- Updated the shared `DataTable` to scale columns to the available viewport and scroll horizontally only when the viewport is narrower than the readable column widths.
- Kept complete cell values visible with natural wrapping; the table scrolls horizontally only on screens too narrow for its readable minimum widths.
- Kept account, lead, deal, contact, and quotation codes on one line by allocating explicit readable code-column widths.
- Replaced native Lead and Deal stage menus with the shared searchable dropdown control.
- Added reusable row skeletons to API-backed tables and stat-card skeletons to Accounts and Deals while requests are pending; quotation grid mode has matching card placeholders.
- Sized inline Lead and Deal stage selectors to their selected text so the chevron stays close to the stage label.
- Corrected Lead and Deal stage selector width and height so long stage names remain fully visible and align with the other table cell values.
- Widened Lead and Deal stage option menus independently of the compact selected-value control so every stage option stays on one line.
- Kept all table header labels on one line and included header text plus sort icons when calculating each table's readable minimum width.

### Password Update & Profile Redirection UX Flow (22/11/2026)
- Enhanced password update UX in `EditProfile.jsx`: removed the awkward inline green banner and replaced it with a top toast notification via `ToastViewport` (`useToast`).
- Automatically invalidates existing session and dispatches `logout()` on password change, securely redirecting user to `/login` with clean post-reset state.
- Removed duplicate inline update banners inside `UpdateProfileTab` and `LoginForm` so success messages exclusively appear once in the top toast notification viewport.
- Updated `ToastViewport.jsx` with prominent z-index (`z-[9999]`), type-based bottom borders (`border-b-success` / `border-b-alert`), and accessible dismiss controls.
- Aligned demo credentials and role detection with backend seeded database entities (`admin@gitakshmi.com`, `marcus@gitakshmi.com`, `sarah@gitakshmi.com`).

### Removal of Static Frontend IDs & API Lead Assignment Fix (25/11/2026)
- **Resolved "Selected employee is not active or does not exist" Error**: Fixed lead creation failure caused by static mock ID strings (`usr-bde-01`) being submitted to `POST /crm/leads`.
- **Database-Aligned User Constants (`authConstants.js`)**: Updated `DEFAULT_USERS` IDs to match the seeded backend `core_users` records (`admin.id = '1'`, `sales.id = '2'`, `bde.id = '3'`).
- **Dynamic JWT User ID Extraction (`authSlice.js`)**: Added `extractUserIdFromJwt` to decode and synchronize the authenticated `userId` directly from active JWT `accessToken` in `localStorage`.
- **Legacy Storage Sanitization (`authSlice.js`)**: Sanitized cached `localStorage` user data on load and login, mapping any legacy `usr-*` strings to actual database employee IDs.
- **Lead Creation Assignment (`AddLeadDrawer.jsx`)**: Updated BDE automatic assignment to resolve the live user ID from auth state and token, avoiding static ID fallbacks.
- **API Payload Guards (`leadsService.js`, `dealsService.js`)**: Added assign-to sanitizers (`resolveAssignedTo`, `resolveOwnerId`) in API mappers to prevent any unassigned or invalid mock ID from ever reaching backend endpoints.
- **Clean Form Inputs Compliance (`EditContactDrawer.jsx`)**: Removed hardcoded pre-filled dummy contact values (`Johnson Doe`, placeholder email/phone) to strictly satisfy Rule #23 (Clean Empty Form Inputs Rule).
- **Backend Login Role Normalization (`profileService.js`)**: Corrected role property resolution (`data.role || data.roles`) and authenticated `user.id` mapping from live backend `/auth/login` responses.
- **Single Token Standard (`api.js`, `authSlice.js`)**: Removed temporary hardcoded tokens and all references to `gcrm-mock-jwt-token`; API requests and Redux session management now strictly rely on the single real `accessToken` stored in `localStorage`.
