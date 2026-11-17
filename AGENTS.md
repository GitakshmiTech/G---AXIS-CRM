# Agent Rules for g-axis suite

When working on this project, all agents must adhere to the following rules:

1. **Use Optimized Code**: Always write highly optimized, clean, and efficient code.
2. **Do Not Impact Existing Code**: Avoid modifying existing code whenever possible.
3. **Ask for Permission to Modify**: If a task requires modifying or impacting existing code, you MUST ask the user for explicit permission before making any changes. Do not proceed with the modification until the user has granted permission.
4. **Use Reusable Components**: Architect the code to use reusable components wherever possible.
5. **Maintain Directory Structure 100% (Strict Clean & Scalable CRM Architecture)**: You MUST strictly maintain and respect the established file and folder architecture:
   - **`constants/`**: Hardcoded data, dummy data, lookup tables, and mock arrays.
   - **`services/`**: API calls, endpoint integrations, and backend communication.
   - **`hooks/`**: Reusable complex stateful logic and custom React hooks.
   - **`utils/`**: Helper functions, formatters (dates, currency, numbers), validation, and export handlers.
   - **`routes/`**: Route definitions using `React.lazy()` for code splitting.
   - **`context/`**: Context APIs and Providers (never place context inside UI components).
   - **`pages/` (100% Flat Architecture)**: Every page MUST be a single, flat entry point directly inside `pages/` (e.g. `Dashboard.jsx`, `Leads.jsx`, `Clients.jsx`, `Contacts.jsx`, `Deals.jsx`, `Quotations.jsx`, `StaffManagement.jsx`, `CrmConfiguration.jsx`, `Settings.jsx`, `Login.jsx`). **Strictly NO subfolders** inside `pages/` (never create `pages/Admin/`, `pages/Sales/`, or `pages/Bde/`).
   - **`components/common/` (Global Reusable UI Shells)**: Universal, multi-panel reusable UI components organized strictly into dedicated subfolders:
     - `avatar/`: Reusable avatar and stakeholder stacks (`AvatarStack.jsx`, `ContactAvatarPlaceholder.jsx`).
     - `buttons/`: Global buttons (`Button.jsx`, `BackButton.jsx`, `DeleteButton.jsx`, `EditBtn.jsx`, `ViewBtn.jsx`, `ExportButton.jsx`, `ResetFilterButton.jsx`, `ViewModeToggle.jsx`).
     - `cards/`: Metric and stat cards (`StatCard.jsx`).
     - `charts/`: Visual analytics charts (`BarChart.jsx`).
     - `header/`: Main navigation headers (`TopHeader.jsx`, `MobilePageHeader.jsx`).
     - `icons/`: SVG icon primitives (`EditIcon.jsx`, `ViewIcon.jsx`, `ExportIcon.jsx`, `ImportIcon.jsx`, `LogoutIcon.jsx`, `SearchIcon.jsx`).
     - `inputs/`: Universal form controls (`TextInput.jsx`, `PasswordInput.jsx`, `DropdownInput.jsx`, `PhoneInput.jsx`, `PhoneNumber.jsx`, `IdInput.jsx`, `StatusRadioInput.jsx`, `GlobalSearch.jsx`, `UploadDropzone.jsx`).
     - `modals/`: Universal modal dialogues and confirmations.
     - `sidebar/`: Dynamic application navigation sidebars (`DynamicSidebar.jsx`, `SidebarNav.jsx`).
     - `Table/`: Global data table containers and filters (`DataTable.jsx`, `TableContainer.jsx`, `DataTableToolbar.jsx`, `TableFilterSelect.jsx`, `Pagination.jsx`).
   - **`components/modules/` (Domain-Specific / Non-Reusable Components)**: Page-exclusive drawers, modals, summary cards, and widgets MUST be placed in their respective domain module folder:
     - `components/modules/dashboard/`: Individual widgets and cards (`LeadStatusBreakdown.jsx`, `LeadOverviewCard.jsx`, `BdePerformanceTable.jsx`, `DealDistribution.jsx`, `Last5LeadsTable.jsx`, `LeadStageDistributionCard.jsx`, `LeadSourcePerformance.jsx`, `ExecutiveActivityCard.jsx`, `SystemHealthCard.jsx`).
     - `components/modules/leads/`: Lead-specific drawers and cards (`AddLeadDrawer.jsx`, `ConvertLeadDrawer.jsx`, `LeadActivityDrawer.jsx`, `LeadCommentsDrawer.jsx`, `ActivityCard.jsx`, `DocumentCard.jsx`, `LeadSummaryCard.jsx`).
     - `components/modules/deals/`: Deal-specific drawers (`EditDealDrawer.jsx`).
     - `components/modules/clients/`: Client-specific drawers (`EditClientDrawer.jsx`).
     - `components/modules/contacts/`: Contact-specific drawers (`EditContactDrawer.jsx`).
     - `components/modules/quotations/`: Quotation drawers and inputs (`CreateQuotationDrawer.jsx`, `TextAreaInput.jsx`).
     - `components/modules/configuration/`: CRM taxonomies and category tables (`leadSources/`, `dealStages/`, `industryTier/`, `leadStatuses/`, `lostReasons/`, `activityModalities/`).
     - `components/modules/team/`: Sales team drawers (`ViewMemberDrawer.jsx`).
     - `components/modules/auth/`: Authentication forms (`LoginForm.jsx`, `ForgotPasswordForm.jsx`, `NewPasswordForm.jsx`).
6. **Common Design Tokens (Frontend)**: For the frontend, NEVER hardcode random hex colors, font weights, or custom typography styles inline. ALWAYS use the project's predefined common design tokens (e.g., Tailwind configuration) and global styles to ensure 100% consistency across the app.
7. **Add Comments**: Add clear and descriptive comments to each function and piece of logic.
8. **Write Understandable Code**: Write code that is clean, readable, and easy for everyone to understand.
9. **Comment Formatting**: You MUST format all section headers and major comments exactly as follows, using the appropriate comment syntax for the language (e.g., `//` for JS/TS, `#` for Env/Python, `<!--` for HTML):
   ```
   //===========================================================================================
   //    YOUR TEXT HERE 
   // ===========================================================================================
   ```
10. **Strict Performance & Short Code Rules**: The system must run fast and smooth without heavy load. Always use "Short Code" techniques:
    - ALWAYS use `useMemo` and `useCallback` when processing, filtering, or sorting arrays to prevent CPU overload during re-renders.
    - ALWAYS use `React.lazy()` for route-level code splitting so pages only load when requested.
    - Use `React.memo` for components that do not need to re-render.
    - Use CSS `content-visibility: auto;` or UI Virtualization (e.g. `react-window`) for long tables and lists.
11. **Minimal Code Rule**: Do not write extra, unnecessary logic. Rely on native React optimizations and short-code tricks to solve scaling issues.
12. **Data Loading & Hooks Rule**: When fetching API data or loading data in components, ALWAYS use the `useEffect` hook correctly. Ensure proper dependency arrays to prevent infinite loops, and include cleanup functions to avoid memory leaks. Show loaders/spinners during data fetch so the UI does not block.
13. **Strict No-Shadow Policy (100% Flat & Border-Only Design)**: NEVER apply drop-shadows or box-shadows anywhere in the project (`shadow`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `box-shadow`, etc. are strictly prohibited). Every component, card, modal, sidebar, header, button, and container MUST follow a clean, modern, flat design utilizing only defined borders (e.g. `border border-stroke`) and background color contrasts without any shadows.
14. **Hover Tooltips for All Icons**: Every icon throughout the project MUST have a descriptive `title` attribute or tooltip displayed on hover (`title="..."` and/or `aria-label`) so the user instantly understands its purpose or action when hovering.
15. **Strict Cursor-Pointer for All Clickable Elements**: Every interactive or clickable icon, button, link, tab, card, or element MUST explicitly have `cursor-pointer` applied, along with clear and smooth hover feedback (e.g., `transition-colors`, subtle background/border state changes).
16. **Searchable Dropdowns Rule**: All dropdowns, select menus, comboboxes, and filter selectors across the application MUST be searchable (supporting type-ahead / search filtering inside the dropdown) rather than static, unsearchable native select dropdowns.
    - **No Visible Searchbar**: Dropdowns must NOT display an extra, clunky search input field inside the dropdown menu (`showSearch: false` by default); search must work cleanly and instantly via native type-ahead keyboard navigation.
    - **No Placeholder in Options List**: Placeholders (such as 'Select...', 'Select Shift', 'Select Days', etc.) MUST NEVER appear as selectable options in the dropdown items list. The options list must strictly contain genuine, selectable data options only.
17. **Continuous README Documentation & Changelog Rule**: For any changes, new features, component additions, or bug fixes developed across `client` and `server`, you MUST document them in a clear, structured, and user-friendly manner in the respective `README.md` (or root `README.md`). Each prompt's development progress, components created, configurations altered, and architectural updates must be logged so any developer or team member can immediately understand what was done and how it works.
18. **Strict Non-Selectable Placeholders ONLY Rule**: Across the entire project, `select-none` (`user-select: none`) MUST ONLY be applied to placeholders inside inputs, textareas, and search fields (`placeholder:select-none` or CSS `::placeholder`). Any other text, buttons, table data, cards, and UI elements across the project MUST REMAIN 100% SELECTABLE by the user. NEVER apply `select-none` to buttons, labels, cards, text containers, or general UI elements.
19. **Strict Folder Structure Utilization & Zero Inline Bloat (Short Code in Components)**: Every agent MUST strictly utilize the established directory structure without writing monolithic inline logic:
    - ALL helper functions, formatting logic (dates, times, numbers), export utilities (CSV, JSON, Excel, PDF), and validation functions MUST be placed in `utils/` and imported into components. NEVER write repetitive helper functions, file download handlers, or complex data formatters inline inside components.
    - Components (`components/`, `pages/`) MUST remain clean, short, and focused strictly on UI rendering and user interactions ("Short Code" principle).
    - If logic can be abstracted into a utility (`utils/`), hook (`hooks/`), or constant (`constants/`), it is strictly required to do so rather than duplicating or inlining it.
20. **Shared UI Border and Radius Rule**: Across shared frontend controls and cards, use a 2px bottom-only border in the `stroke/80` token color; never show a full perimeter border. Use the shared 7px radius token for UI corners, including buttons and icon controls. Circular button/icon shapes are not allowed in general UI except for: sidebar collapse/expand controls (`<<` and `>>`), which use a fully rounded circle (`rounded-full`) with a stroke border (`border border-stroke`) and light gray contrast background (`bg-gray`), common image-upload previews, and standalone profile photos (all marked with `data-preserve-radius`). Profile photos must always be fully circular (`rounded-full`) and must not have a surrounding border (Rule #24). Small decorative frames such as country flags may preserve their own thin full outline and corner radius with `data-ui-style="decorative-frame"`. The PhoneInput country menu should be narrow, square-cornered, show only flags, and attach directly below its trigger; the selected calling code should appear as a prefix inside the phone-number input, not beside the trigger flag. Sidebar navigation keeps its dedicated active-state border treatment and is excluded from the shared bottom-border override. Data table header cells must be borderless; only the outer left and right corners of the header strip may be rounded, with square corners on intermediate cells. The reusable Edit and View action buttons use the shared 7px radius token with a 2px bottom-only border in stroke/80 (no full perimeter border) and a subtle hover state. Buttons used as dropdown list items have no border and should be inside a menu marked with `data-ui-style="dropdown-menu"`. Segmented filter tabs and List/Grid view buttons may use `data-ui-style="filter-tab"` to remove the shared bottom border while preserving their active-state colors. Combined split-action controls must place one continuous shared bottom border on the group using `data-ui-style="split-action"` and remove borders from child buttons using `data-ui-style="split-action-part"`. Joint input groups must use one continuous bottom border on the outer control marked with `data-ui-style="joined-input"`; nested inputs/buttons must be borderless, and overlay input actions may use `data-ui-style="input-addon"`. Any other segmented control must put its single continuous bottom border on a parent marked with `data-ui-style="joined-control"` and remove borders from its child controls. Filter dropdown menus must open directly below their trigger, match its width exactly, and use the `data-ui-width="trigger"` marker. Filter option labels must remain on one line; filter dropdown panels should not add outer padding.
21. **Dropdown List Surface Rule**: Every dropdown option list must use square corners and zero left/right padding on the panel; option rows use 4px left/right padding in all states. Hovered or selected option highlights must remain square-cornered (border-radius: 0; no rounded corners). Mark option-list containers with `data-ui-style="dropdown-menu"`; do not apply that marker to an entire date/time picker when only its option sublists need the rule.
22. **Strict Project-wide Date Format Rule (DD/MM/YYYY)**: Across the entire application (including tables, form inputs, date filters, drawers, cards, and tooltips), dates MUST strictly follow the `DD/MM/YYYY` format (day/month/year). No MM/DD/YYYY or alternative date formats are permitted in UI display values. Date pickers and date input components must never render an in-input clear ('x') button; date selection must remain clean, persistent, and consistent.
23. **Strict Clean Empty Form Inputs Rule (No Pre-filled Defaults)**: Across the entire application, all form inputs in 'Add / Create' drawers, dialogs, and pages MUST strictly initialize empty (`''`), displaying ONLY their clean `placeholder`. Form inputs must NEVER be pre-filled with default dummy values such as `'0'`, `0`, or placeholder text as actual values. The user must always see clean, non-selectable placeholders until they intentionally type or select their own value.
24. **Strict Circular & Borderless Profile Photos Rule**: Across the entire project (including tables, directories, drawers, detail cards, headers, form upload previews, and grid cards), all profile photos, user avatars, placeholder avatars, employee images, and company/organization logos MUST ALWAYS be rendered in a fully circular shape (`rounded-full` with `overflow-hidden`) and MUST NEVER have any surrounding border (`border-none` / zero border). Any square or rounded-corner avatar (`rounded-lg`, `rounded-md`, `rounded-xl`, etc.) or surrounding border (`border border-stroke`, `border`, etc.) on profile/avatar containers is strictly prohibited (with the sole exception of overlapping visual cutout borders inside multi-avatar clusters like `AvatarStack`).
25. **Unified Single-Page Architecture & Role-Conditioned Rendering (Zero Duplicate Wrapper Code)**:
    - Every domain page that is accessible across multiple roles (such as `Dashboard`, `Leads`, `Deals`, `Clients`, `Contacts`, `Quotations`) MUST exist as **exactly ONE single page file** inside `pages/` (e.g. `pages/Dashboard.jsx`).
    - **Never Create Duplicate Wrapper View Files**: Creating duplicate role-specific page wrapper files (e.g. `AdminDashboardView.jsx`, `SalesDashboardView.jsx`, `BdeDashboardView.jsx`, `AdminLeadsView.jsx`, etc.) is strictly prohibited.
    - **Single Header & Common Metrics**: Universal headers, title banners, timeframe selectors, export buttons, and universal KPI metric rows (`StatCard`) must be rendered ONCE at the top level of the page.
    - **Modular Widget Imports**: All child widgets, cards, and sub-tables must be individually imported from `components/modules/<module-name>/` and conditionally mounted inside the single page based on `state.auth.role`.
26. **Unified Clean Routing & Role-Adaptive Navigation (Zero Role URL Prefixes)**:
    - All routes in `routes/AppRoutes.jsx` MUST be clean and un-prefixed (e.g. `/dashboard`, `/leads`, `/deals`, `/clients`, `/quotations`). Never expose role-prefixed URLs like `/admin/dashboard`, `/sales/leads`, or `/bde/deals`.
    - Single unified authentication entry point at `/login`.
    - Navigation menus, sidebars, and permitted actions must adapt dynamically at runtime based on the authenticated user's role without requiring separate router trees or duplicated layouts.

---

### How to Use These Rules

You **do not** need to manually prompt the agent with these rules.
Because this file is named `AGENTS.md` and sits in the root of the project, **the AI automatically reads and enforces these rules** every time you ask it to do something in this workspace!
