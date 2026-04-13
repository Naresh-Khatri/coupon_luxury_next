# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — Next.js dev server at http://localhost:3000
- `pnpm build` — production build (typechecks TS + lints)
- `pnpm start` — serve the production build
- `pnpm lint` — `next lint`

No test runner is configured. Package manager is pnpm; do not use yarn/npm.

## Architecture

Next.js 14 **App Router** app written in TypeScript (`.tsx`). UI is **Tailwind v4 + shadcn/ui** (components live under `components/ui/`, added via `pnpm dlx shadcn@latest add <name>`). Animations via Framer Motion, icons via `lucide-react`, toasts via `sonner`, carousels via `@splidejs/react-splide`. No Chakra UI, no Emotion, no FontAwesome — these have been fully removed.

### Route groups

- `app/(site)/` — all public pages share a route-group layout (NavBar + Footer). Includes `/`, `/stores`, `/stores/[slug]`, `/deals`, `/deals/[slug]`, `/categories`, `/categories/[slug]`, `/blogs`, `/blogs/[slug]`, `/about`, `/contact`, `/privacy-policy`, `/sitemap`.
- `app/blogs/admin/` — Appwrite-gated admin console (outside the `(site)` group). Uses a client-side `AdminShell` for session check, SideBar, and AccountMenu.
- `app/blogs/login/` — Appwrite login.
- `app/not-found.tsx` — global 404.
- `app/layout.tsx` — root layout: fonts (`Cormorant_Garamond` → `--font-display`, `DM_Sans` → `--font-body`), GTM + AdSense scripts, global `<Toaster />`, favicons, and default Metadata.

### Data flow

Read-only frontend for `https://apiv2.couponluxury.com` (baseline from `process.env.domain`, set in `next.config.js`; also re-exported as `domain` from `lib/lib.ts`). All data fetches are RSC `fetch(..., { next: { revalidate: 60 } })`. Pages declare `export const revalidate = 60`. 404s are handled by `notFound()` when an upstream fetch fails.

Client-only interactivity (filters on store/category detail pages, reading progress bar on blog pages, deal CTA with confetti) is split into co-located `"use client"` components (`StoreFilter.tsx`, `CategoryFilter.tsx`, `ReadingProgress.tsx`, `DealCTA.tsx`).

### Styling / design tokens

`styles/globals.css` is the single source of truth. Uses Tailwind v4's `@theme` block to expose brand tokens as utility classes:
- `--color-gold`, `--color-gold-light`, `--color-navy`, `--color-navy-mid`, `--color-teal`, `--color-teal-dark`, `--color-cream` → usable as `bg-gold`, `text-navy`, etc.
- `--color-brand-700/800/900/1000` → legacy brand ramp (`bg-brand-900` is the primary CTA color).
- shadcn semantic tokens (`--color-primary`, `--color-background`, etc.) are also set here — no separate `tailwind.config.js`.

Decorative backgrounds (`ham-background`, `hero-bg`, `banner-bg`, `subscribe-banner-bg`) and the `.page-html` rich-text styles are plain CSS in `globals.css` because they use pseudo-elements / nested selectors that are easier outside Tailwind.

### Metadata / SEO

No more `SetMeta` util. Each route exports `metadata` (or `generateMetadata` for dynamic routes). Root layout sets defaults (`title.template`, OG, Twitter, icons, `metadataBase`). Dynamic routes fetch data once and pass the same result to both `generateMetadata` and the page body — Next dedupes the `fetch` via cache.

### Middleware

`middleware.js` (unchanged from before the migration) does two things: rewrite `/sitemap.xml` to the upstream API and 301-redirect any URL containing uppercase chars to its lowercase form. Keep internal links lowercase.

### Images

`utils/imageKitLoader.ts` is the custom `next/image` loader; only `ik.imagekit.io` is whitelisted in `next.config.js`. `utils/transformImagePath.ts` injects ImageKit's `tr:w-<n>/` transform into API-returned paths. Add new external image hosts to `next.config.js` `images.remotePatterns`.

### Blog admin specifics

- Auth: Appwrite (`appwrite/config.ts` → `account`). Login via `account.createEmailSession`, session check via `account.get()`, JWT for API writes via `account.createJWT()`.
- TinyMCE and react-advanced-cropper are dynamically imported with `ssr: false` from `app/blogs/admin/create/page.tsx`.
- The admin API endpoint is `https://apiv2.couponluxury.com/blogs/v2` (POST FormData + Bearer JWT).

### Toast / dialogs / dropdowns

- Toasts: `import { toast } from "sonner"`. `<Toaster />` is mounted once in the root layout.
- Modals, menus, tooltips, popovers come from `components/ui/*` (Radix via shadcn). When adding new primitives, use `pnpm dlx shadcn@latest add <name>` — don't hand-write them.

## Conventions

- TypeScript strict mode. `jsx: preserve`. Path alias `@/*` → repo root.
- `"use client"` only on files that actually need it (state, refs, effects, browser APIs, Framer Motion). Favor RSC.
- Don't reintroduce Chakra, Emotion, FontAwesome, or SCSS modules.
- Light mode only — the Chakra light-mode lock is preserved via not shipping `next-themes`.
