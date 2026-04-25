# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

- **straycare** (web, react-vite, mounted at `/`) — Community web app for reporting stray dogs. Public report submission with optional photo upload, public report detail pages, and an admin dashboard for triaging cases (status changes: reported → in_progress → rescued, delete).
- **api-server** (api, express, mounted at `/api`) — Shared backend serving `/api/reports` (CRUD + `/stats/summary`, `/recent`) and `/api/storage` endpoints (presigned upload URLs + public/private object serving).

### StrayCare data model

`reports` table (`lib/db/src/schema/reports.ts`): `id`, `location` (text), `description` (text), `imagePath` (nullable text — points at `/objects/...`), `status` (`reported` | `in_progress` | `rescued`), `createdAt`. Image upload uses object storage; `imagePath` is the normalized object path returned by `POST /api/storage/uploads/request-url`. Display images via `<img src={`/api/storage${imagePath}`} />`.
