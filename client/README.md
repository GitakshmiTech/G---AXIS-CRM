# React + Vite

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
