# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- **Complete** — Admin dashboard implemented, build passes, ready for testing

## Current Goal

- Run SQL migrations in Supabase Dashboard, test admin dashboard end-to-end, commit and deploy

## Completed

- Fresh Next.js 16 scaffold with Tailwind v4, React 19, TypeScript strict
- Supabase client utilities (client, server, middleware)
- Bilingual routing with next-intl (EN/AR, RTL/LTR)
- Dark/light theme with surface hierarchy design system
- All 6 public pages: home, about, projects, projects/[slug], experience, contact
- Server actions for all data operations (projects, testimonials, experiences, settings, contact)
- Contact form with Gmail SMTP email delivery via Nodemailer
- Contact form saves to Supabase `contacts` table (service role key bypasses RLS)
- Input validation with Zod, sanitization, honeypot spam prevention
- Fallback data in `data/temp.ts` for graceful degradation and `generateStaticParams`
- SEO: dynamic metadata per page/locale, JSON-LD (Person, Project), sitemap, robots.txt
- Responsive design (mobile, tablet, desktop)
- All styles polished: gradient effects, glass navbar, card hover animations, brand accent system
- Context files written: project-overview.md, architecture.md, code-standards.md, ui-context.md, ai-workflow-rules.md
- **Auth feature: Google Sign-In + Credentials (email/password) with NextAuth v5**
  - `lib/auth.ts` — NextAuth config with Google + Credentials providers, JWT sessions
  - `lib/auth-adapter.ts` — Custom Supabase adapter (service role key)
  - `lib/auth-types.ts` — Extended User and Session types with `is_admin`
  - `lib/validations/auth.ts` — Zod schemas for sign-in and sign-up
  - `app/api/auth/[...nextauth]/route.ts` — NextAuth API route handler
  - `app/actions/auth.ts` — Google, credentials, sign-up, sign-out server actions
  - `middleware.ts` — Combined i18n + auth middleware (protects `/admin/*` routes)
  - `components/providers/session-provider.tsx` — Client-side SessionProvider
  - `components/ui/user-menu.tsx` — Avatar dropdown with sign-out
  - `components/ui/google-button.tsx` — Google OAuth sign-in button
  - `components/ui/credentials-form.tsx` — Email/password sign-in form
  - `components/ui/signup-form.tsx` — Registration form
  - Sign-in page with email/password + Google, sign-up page with name/username/email/password
  - Auth error page, root-level redirects
  - Header with auth UI, i18n strings for EN + AR
  - `.env.local` with AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ADMIN_EMAIL
  - Password hashing with bcryptjs (12 salt rounds)
- **Admin Dashboard — full CRUD for all content**
  - `features/admin/services/admin-guard.ts` — `requireAdmin()` session verification
  - `app/(admin)/admin/layout.tsx` — Auth guard + sidebar + header shell
  - `app/(admin)/admin/page.tsx` — Dashboard overview with stats cards + recent messages
  - `components/admin/AdminSidebar.tsx` — Fixed sidebar with navigation + sign out
  - `components/admin/AdminHeader.tsx` — Top bar with page title + user info + mobile sidebar
  - `components/admin/StatsCard.tsx` — Stat card component
  - `components/admin/BilingualInput.tsx` — Side-by-side EN/AR input (text + textarea)
  - `components/admin/ImageUpload.tsx` — Drag-and-drop Supabase Storage upload
  - `components/admin/DeleteDialog.tsx` — Confirmation dialog for deletions
  - `components/admin/EmptyState.tsx` — Empty state with icon + message
  - `app/(admin)/admin/projects/page.tsx` — Projects CRUD with table, search, slide-over form, tech stack tags, image upload, featured toggle
  - `app/(admin)/admin/experiences/page.tsx` — Experiences CRUD with bilingual fields, date pickers, logo upload
  - `app/(admin)/admin/testimonials/page.tsx` — Testimonials CRUD with avatar upload
  - `app/(admin)/admin/contacts/page.tsx` — Contacts inbox with read/unread toggle, detail panel, reply via email
  - `app/(admin)/admin/settings/page.tsx` — Grouped settings editor (Hero, About, Social, Footer) with save per group
  - `app/api/admin/projects/` + `[id]/` — GET, POST, PUT, DELETE for projects
  - `app/api/admin/experiences/` + `[id]/` — GET, POST, PUT, DELETE for experiences
  - `app/api/admin/testimonials/` + `[id]/` — GET, POST, PUT, DELETE for testimonials
  - `app/api/admin/contacts/` + `[id]/` — GET, PATCH (read toggle), DELETE for contacts
  - `app/api/admin/settings/` — GET all, PUT by key
  - `app/api/admin/upload/` — POST image to Supabase Storage
  - `app/actions/admin-dashboard.ts` — Stats and recent contacts server actions
  - Validation schemas: `lib/validations/admin-project.ts`, `admin-experience.ts`, `admin-testimonial.ts`, `admin-settings.ts`
  - `npm run build` passes with zero errors — all 59 routes generated

## In Progress

- Waiting for user to: run SQL migrations in Supabase Dashboard

## Next Up

- Test admin dashboard end-to-end after Supabase tables are created
- Commit all changes and push to Vercel
- Verify production deployment
- Lighthouse audit (target: Performance >90, Accessibility >95, SEO >95)

## Open Questions

- Supabase SQL migrations (001-004) need to be run manually in Supabase Dashboard
- Supabase Storage bucket `portfolio-assets` needs to be created manually

## Architecture Decisions

1. **Server actions as data layer** — Pages call server actions, never Supabase directly.
2. **API routes for admin CRUD** — Admin pages use client-side fetch to API routes (valid since admin is a separate concern from public pages and needs client-side interactivity for forms/tables). API routes call `requireAdmin()` for auth.
3. **Service role key for all admin writes** — Admin mutations bypass RLS via service role key; auth is enforced at the application level by `requireAdmin()`.
4. **Fallback data for `generateStaticParams`** — Import from `data/temp.ts` directly.
5. **Named exports only** — No default exports.
6. **No component library** — Custom components with Tailwind.
7. **Auth via NextAuth v5 + custom Supabase adapter** — No third-party adapter dependency.
8. **JWT sessions** — Required for Credentials provider compatibility.
9. **Credentials + Google dual auth** — Users can sign up with email/password or Google OAuth.
10. **Admin detection by email** — `ADMIN_EMAIL` env var.
11. **Combined middleware** — Auth check before i18n routing.
12. **Admin as route group** — `app/(admin)/admin/` separate from `[locale]`, English-only, no i18n overhead.
13. **Admin uses API routes** — Admin CRUD pages are client components that fetch from API routes. This is the one case where API routes are justified for internal use — the admin pages need rich client-side interactivity (forms, modals, search, drag-drop). The API routes still enforce admin auth via `requireAdmin()`.

## Session Notes

- Windows case-sensitivity: files renamed via `git mv` to fix Vercel builds
- Gmail app password configured for contact form email delivery
- All Supabase SQL migrations need to be run manually in Dashboard
- NextAuth v5 beta.31 installed with @auth/core 0.41.2
- Nodemailer v8 caused peer dep conflict with @auth/core — resolved with `--legacy-peer-deps`
- Middleware convention deprecated in Next.js 16 (should use "proxy") — build still works, warning only
- `portfolio-assets` Storage bucket needs to be created in Supabase Dashboard
- Build passes with zero errors: all 59 routes generated including admin pages and API routes
