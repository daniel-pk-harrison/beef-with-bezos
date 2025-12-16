# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Beef with Bezos" - a Next.js 14 web app that publicly tracks Amazon missed deliveries. Users can view a counter showing total missed deliveries, and authenticated admins can report new incidents.

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Architecture

### Data Flow

1. **Storage**: Upstash Redis in production, in-memory store for local development
2. **Auth**: Cookie-based admin authentication via `ADMIN_PASSWORD` env var (`lib/auth.ts`)
3. **API Routes**: All under `app/api/` - public `GET /api/misses`, protected admin routes under `/api/admin/`

### KV Storage Abstraction

The project uses a KV abstraction layer (`lib/kv/`) to allow swapping storage providers:

- `lib/kv/interface.ts` - KVStore interface definition
- `lib/kv/upstash.ts` - Upstash Redis implementation
- `lib/kv/memory.ts` - In-memory implementation for local dev
- `lib/kv/index.ts` - Factory that returns the configured provider

To add a new KV provider, implement the `KVStore` interface and update `lib/kv/index.ts`.

### Key Patterns

- **Server/Client Split**: Home page (`app/page.tsx`) fetches data server-side, passes to `HomeContent` client component
- **Admin Panel**: Fully client-side with auth check, login flow, and CRUD operations (`app/admin/page.tsx`)
- **Path Aliases**: Use `@/` for imports from root (e.g., `@/lib/kv`, `@/components/Counter`)

### Styling

- Tailwind CSS with custom `rage` color palette (red tones in `tailwind.config.ts`)
- Framer Motion for animations throughout UI components

### Environment Variables

See `.env.example`:
- `KV_REST_API_URL` / `KV_REST_API_TOKEN` - KV store credentials (optional for local dev)
- `ADMIN_PASSWORD` - Password for admin access (defaults to "bezos123" locally)
