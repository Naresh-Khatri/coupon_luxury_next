# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — Next.js dev server at http://localhost:3000
- `pnpm build` — production build (typechecks TS + lints)
- `pnpm start` — serve the production build
- `pnpm lint` — `next lint`
- `pnpm db:generate` / `pnpm db:migrate` / `pnpm db:push` — Drizzle migrations against Neon
- `pnpm db:studio` — Drizzle Studio
- `pnpm db:seed` — seed an admin user (reads `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME`)

No test runner is configured. Package manager is pnpm; do not use yarn/npm.

## Architecture

Single Next.js 14 **App Router** app in TypeScript. UI: Tailwind v4 + shadcn/ui, Framer Motion, lucide-react, sonner, Splide. Backend is integrated — **no separate API service**. Data layer: Drizzle ORM against Neon Postgres via `@neondatabase/serverless` (HTTP driver). Auth: **better-auth** (drizzle adapter, `admin` plugin, email/password). APIs for client interactions and all admin CRUD go through **tRPC**.

### Route groups

- `app/(site)/` — public pages (NavBar + Footer layout). `/`, `/stores`, `/stores/[slug]`, `/deals`, `/deals/[slug]`, `/categories`, `/categories/[slug]`, `/blogs`, `/blogs/[slug]`, `/about`, `/contact`, `/privacy-policy`, `/sitemap`.
- `app/admin/(dashboard)/` — better-auth-gated admin UI (sidebar + account). Dashboard at `/admin`; CRUD at `/admin/stores`, `/admin/offers`, `/admin/blogs`, `/admin/categories`, `/admin/subcategories`, `/admin/slides`, `/admin/subscribers`, `/admin/video`.
- `app/admin/login/` — better-auth signin form (outside the gated group).
- `app/api/auth/[...all]/` — better-auth catch-all handler via `toNextJsHandler`.
- `app/api/trpc/[trpc]/` — tRPC fetch handler.
- `app/sitemap.ts` — Next-native sitemap built from Drizzle.
- `app/not-found.tsx` — global 404.

### Data flow

**Public RSC pages → direct Drizzle** (no HTTP hop). All queries live in `server/db/queries/*.ts`, wrapped in `unstable_cache` with tags (see `server/db/cache.ts` — `CACHE_TAGS`). Admin mutations call `revalidate(...tags)` after writes so the public site refreshes instantly (no `revalidate: 60` TTL on pages).

**Client interactions → tRPC**. Providers in `lib/trpc/Provider.tsx` (mounted in root layout). Client hook: `import { trpc } from "@/lib/trpc/client"`. Router namespaces:
- `appRouter.public.*` — subscribe mutation, store/offer autocomplete.
- `appRouter.admin.*` — full CRUD for all resources, dashboard stats, ImageKit auth signature.

Procedures:
- `publicProcedure` — no auth.
- `protectedProcedure` — requires session.
- `adminProcedure` — requires session + `role === "admin"`.

### Auth (better-auth)

- `lib/auth.ts` — server instance. Drizzle adapter + `admin()` plugin + `nextCookies()`.
- `lib/auth-client.ts` — client instance with `adminClient()`.
- `app/admin/(dashboard)/layout.tsx` — server-side session + role check → redirect `/admin/login`.
- Seed via `pnpm db:seed`; see `scripts/seed-admin.ts`.
- `Session` type: `import { auth } from "@/lib/auth"; type S = typeof auth.$Infer.Session`.

### ImageKit

- Server key only in `lib/imagekit.ts`. `deleteImageByUrl` used on update/delete to clean old assets.
- Client-side presigned upload via `trpc.admin.imagekitAuth.fetch()` → POST to `https://upload.imagekit.io/api/v1/files/upload`. See `app/admin/(dashboard)/_components/ImageKitUpload.tsx`.
- `utils/imageKitLoader.ts` is the custom `next/image` loader.
- `utils/transformImagePath.ts` injects `tr:w-<n>/` transform.
- `ik.imagekit.io` is whitelisted in `next.config.js`.

### Drizzle schema

`db/schema.ts` — domain tables (`stores`, `offers`, `categories`, `subCategories`, `blogs`, `slides`, `subscribers`, `backgroundVideo`) mirror the legacy Prisma schema 1:1, plus better-auth tables (`user`, `session`, `account`, `verification`). Relations defined via `drizzle-orm`'s `relations()` so `db.query.*.findMany({ with: {...} })` works.

`db/index.ts` exports `db` (neon-http drizzle) and re-exports the schema as `s`.

### Styling / design tokens

`styles/globals.css` is the single source of truth. Tailwind v4 `@theme` block exposes brand tokens (`--color-gold`, `--color-navy`, `--color-teal`, `--color-brand-700/800/900/1000`, etc.). Decorative backgrounds (`hero-bg`, `banner-bg`, `subscribe-banner-bg`) and `.page-html` rich-text styles are plain CSS.

### Middleware

`middleware.js` — only the lowercase-redirect rule. The legacy sitemap rewrite is gone (served by `app/sitemap.ts`). API, static, and `_next` paths are excluded.

### Environment

Required: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`, `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`, `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`. Optional for seed: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`. See `.env.example`.

## Conventions

- TS strict. `jsx: preserve`. Path alias `@/*` → repo root.
- `"use client"` only on files that need it.
- Public RSC pages read via `server/db/queries/*`, never tRPC.
- Admin mutations always call `revalidate(CACHE_TAGS.*)` after writes.
- ImageKit upload URLs are stored in the DB directly; delete old URL in the update/delete mutation before replacing.
- Don't reintroduce Chakra, Emotion, FontAwesome, SCSS modules, Appwrite, Firebase, Prisma, Axios for data fetching.
- Light mode only.
