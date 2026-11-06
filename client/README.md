# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

## Changelog & Security Updates

### [06/11/2026] Dependency Security Patch & Repository .gitignore Consolidation
- **Vulnerability Remediation**: Resolved 4 moderate severity vulnerabilities in `minimatch` (`GHSA-g3hv-75wg-m249` / `CVE-2026-118764`) by adding package `overrides` for `minimatch: "^11.0.1"` in `package.json`. Audited with `0 vulnerabilities`.
- **Centralized .gitignore**: Established a clean, unified root `.gitignore` covering frontend and backend dependencies (`node_modules`), secrets (`.env*`), build outputs (`dist`, `build`), caches, and editor metadata without altering existing application code.

