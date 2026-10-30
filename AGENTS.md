# Agent Rules for g-axis suite

When working on this project, all agents must adhere to the following rules:

1. **Use Optimized Code**: Always write highly optimized, clean, and efficient code.
2. **Do Not Impact Existing Code**: Avoid modifying existing code whenever possible.
3. **Ask for Permission to Modify**: If a task requires modifying or impacting existing code, you MUST ask the user for explicit permission before making any changes. Do not proceed with the modification until the user has granted permission.
4. **Use Reusable Components**: Architect the code to use reusable components wherever possible.
5. **Maintain Directory Structure 100% (Strict Architecture)**: You MUST keep and respect the existing file and folder structure. It is strictly organized for a scalable ERP system. For both `client` (frontend) and `server` (backend), maintain strict separation of concerns:
   - Hardcoded data, dummy data, and mock arrays go to `constants/`
   - API calls and backend interactions go to `services/`
   - Reusable complex state logic goes to `hooks/`
   - Helper functions go to `utils/`
   - Route definitions go to `routes/` (and MUST use `React.lazy()`)
   - Context APIs and Providers MUST go to `context/` (DO NOT place context inside components).
   - UI Components go to `components/` and Pages go to `pages/`. Do NOT write monolithic components. Break them down.
6. **Common Design Tokens (Frontend)**: For the frontend, NEVER hardcode random hex colors, font weights, or custom typography styles inline. ALWAYS use the project's predefined common design tokens (e.g., Tailwind configuration) and global styles to ensure 100% consistency across the app.
7. **Add Comments**: Add clear and descriptive comments to each function and piece of logic.
8. **Write Understandable Code**: Write code that is clean, readable, and easy for everyone to understand.
9. **Comment Formatting**: You MUST format all section headers and major comments exactly as follows, using the appropriate comment syntax for the language (e.g., `//` for JS/TS, `#` for Env/Python, `<!--` for HTML):
   ```
   //==================================================================================================================
   //    YOUR TEXT HERE 
   // ==================================================================================================================
   ```
10. **Strict Performance & Short Code Rules**: The system must run fast and smooth without heavy load. Always use "Short Code" techniques:
    - ALWAYS use `useMemo` and `useCallback` when processing, filtering, or sorting arrays to prevent CPU overload during re-renders.
    - ALWAYS use `React.lazy()` for route-level code splitting so pages only load when requested.
    - Use `React.memo` for components that do not need to re-render.
    - Use CSS `content-visibility: auto;` or UI Virtualization (e.g. `react-window`) for long tables and lists.
11. **Minimal Code Rule**: Do not write extra, unnecessary logic. Rely on native React optimizations and short-code tricks to solve scaling issues.
12. **Data Loading & Hooks Rule**: When fetching API data or loading data in components, ALWAYS use the `useEffect` hook correctly. Ensure proper dependency arrays to prevent infinite loops, and include cleanup functions to avoid memory leaks. Show loaders/spinners during data fetch so the UI does not block.

---

### How to Use These Rules

You **do not** need to manually prompt the agent with these rules.
Because this file is named `AGENTS.md` and sits in the root of the project, **the AI automatically reads and enforces these rules** every time you ask it to do something in this workspace!
