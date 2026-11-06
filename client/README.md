# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

## Changelog & Security Updates

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

