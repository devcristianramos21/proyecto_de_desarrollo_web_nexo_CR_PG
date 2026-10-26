# AGENTS.md

Compact guidance for agents working in this repository. Verify against configs before acting.

## Project

- NEXO (`nexo-cr-pg`): React 19 + TypeScript + Vite single-page app for a mentor/tutoring platform. Currently a UI shell: `src/App.tsx` composes `src/components/Sidebar.tsx`; page content is placeholder. No backend, router, or state library yet — navigation uses hash anchors + local state.

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

## Gotchas

- `README.md` is Vite template boilerplate, not real project documentation.
- No router: navigation is hash anchors (`href="#..."`) with `useState` in the Sidebar.
- Build output goes to `dist/` (gitignored); no env vars or special env loading needed.
