# AGENTS.md

Compact guidance for agents working in this repository. Verify against configs before acting.

## Project

- NEXO (`nexo-cr-pg`): React 19 + TypeScript + Vite single-page app for a mentor/tutoring platform, in `nexo_CR_PG/`. Currently a UI shell; no router or state library yet — navigation uses hash anchors + local state. Not yet connected to the backend.
- Backend in `nexo-backend/`: Express 5 + Mongoose (MongoDB Atlas) + Socket.IO, JWT auth. Full API docs in `nexo-backend/README.md` (see "Backend" below).

Quiero que analices este proyecto antes de realizar cualquier modificación.

Identifica:
1. La arquitectura y la estructura de carpetas.
2. Las tecnologías y dependencias utilizadas.
3. Cómo funciona el flujo principal de la aplicación.
4. Cómo se conecta a la base de datos.
5. Los posibles errores, riesgos y problemas de organización.
6. Las pruebas existentes y cómo ejecutar el proyecto.

Por ahora, trabaja únicamente en modo de análisis. No modifiques archivos, no instales dependencias, no ejecutes migraciones ni cambies la base de datos.

Al terminar, dame un diagnóstico organizado y un plan de trabajo por prioridades.

## Commands

- `npm run dev` — Vite dev server with HMR (default http://localhost:5173)
- `npm run build` — `tsc -b && vite build` (typecheck runs via project references; there is no standalone typecheck script)
- `npm run lint` — oxlint
- `npm run preview` — serve production build
- No test script / test framework installed.

Verify frontend changes with `npm run lint` then `npm run build` (lint does not typecheck; the build does via `tsc -b`).

## Toolchain quirks

- TypeScript strict flags: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `noFallthroughCasesInSwitch`; `verbatimModuleSyntax` (use `import type` for type-only imports); `allowImportingTsExtensions` (imports may include `.ts` extension).
- oxlint via `.oxlintrc.json` (react/typescript/oxc); `react/rules-of-hooks` error, `react/only-export-components` warn (constant exports allowed). Not type-aware.
- React 19 + `@vitejs/plugin-react` (Oxc-based); React Compiler not enabled.
- Node `^20.19.0 || >=22.12.0` required (Vite 8).

## Conventions

- Plain CSS; design tokens as CSS variables in `src/index.css`; BEM-ish naming (`block__element--modifier`); component CSS colocated with component; responsive via `@media (max-width: 700px)`.
- UI copy and code comments are in Spanish — keep new strings/comments consistent.

## Backend (`nexo-backend/`)

- Commands (run inside `nexo-backend/`): `npm run dev`, `npm run seed`, `npm run crear-admin`, `npm run probar-api`, `npm run limpiar-pruebas`. Needs `nexo-backend/.env` (`MONGODB_URI`, `JWT_SECRET`); never commit it.
- Layers: routes → controllers (HTTP only) → services (business rules, throw `AppError(codigo, mensaje)`) → models. Roles enforced with `autenticar` + `permitir(...)`; a `tutor` also passes `permitir('estudiante')`.
- Dates are `AAAA-MM-DD`, hours `HH:mm` in Colombia time (UTC-5); see `src/utils/fechas.js`.
- Verify backend changes with `npm run probar-api` against a running server (runs `pruebas-api/NEXO.postman_collection.json`).
- Test users use `prueba.*` emails; demo data uses `demo.*`. Business rules live in `nexo-backend/README.md`.

## Gotchas

- `nexo_CR_PG/README.md` is Vite template boilerplate, not real project documentation.
- No router: navigation is hash anchors (`href="#..."`) with `useState` in the Sidebar.
- Build output goes to `dist/` (gitignored); no env vars or special env loading needed.
