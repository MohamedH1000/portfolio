# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- **In Progress** — Auth implementation complete, ready for testing and deployment

## Current Goal

- Run SQL migration in Supabase Dashboard, generate AUTH_SECRET, add Google OAuth credentials, test sign-in flow

## Completed

- Fresh Next.js 16 scaffold with Tailwind v4, React 19, TypeScript strict
- Supabase client utilities (client, server, middleware)
- Bilingual routing with next-intl (EN/AR, RTL/LTR)
- Dark/light theme with surface hierarchy design system
- All 6 pages: home, about, projects, projects/[slug], experience, contact
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
  - `lib/auth-adapter.ts` — Custom Supabase adapter (service role key, no third-party adapter dependency)
  - `lib/auth-types.ts` — Extended User and Session types with `is_admin`
  - `lib/validations/auth.ts` — Zod schemas for sign-in and sign-up
  - `app/api/auth/[...nextauth]/route.ts` — NextAuth API route handler
  - `app/actions/auth.ts` — `handleGoogleSignIn()`, `handleCredentialsSignIn()`, `handleSignUp()`, `handleSignOut()` server actions
  - `middleware.ts` — Combined i18n + auth middleware (protects `/admin/*` routes)
  - `components/providers/session-provider.tsx` — Client-side SessionProvider
  - `components/ui/user-menu.tsx` — Avatar dropdown with sign-out
  - `components/ui/google-button.tsx` — Google OAuth sign-in button
  - `components/ui/credentials-form.tsx` — Email/password sign-in form
  - `components/ui/signup-form.tsx` — Registration form with name, username, email, password
  - `app/[locale]/auth/signin/page.tsx` — Sign-in page with credentials form + Google + link to sign-up
  - `app/[locale]/auth/signup/page.tsx` — Sign-up page with registration form + Google + link to sign-in
  - `app/[locale]/auth/error/page.tsx` — Auth error page
  - `app/auth/signin/page.tsx`, `app/auth/signup/page.tsx`, `app/auth/error/page.tsx` — Root redirects to locale versions
  - Header updated with auth UI (link to sign-in page / user menu) in desktop and mobile nav
  - `messages/en.json` and `messages/ar.json` updated with full Auth strings (credentials, sign-up, etc.)
  - `.env.local` updated with AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ADMIN_EMAIL placeholders
  - `lib/env.ts` updated with auth env var validation
  - `supabase/migrations/004_auth_tables.sql` — Users (with username, password), accounts, sessions, verification_tokens tables
  - Password hashing with bcryptjs (12 salt rounds)
  - `npm run build` passes with zero errors

## In Progress

- Waiting for user to: run SQL migration in Supabase Dashboard, generate AUTH_SECRET, add Google OAuth credentials

## Next Up

- Test sign-in flow end-to-end after Supabase tables are created and env vars are set
- Commit all changes and push to Vercel
- Verify production deployment with all pages rendering
- Lighthouse audit (target: Performance >90, Accessibility >95, SEO >95)
- Future: Build admin dashboard at `/admin` (protected by auth middleware)

## Open Questions

- Google OAuth Client ID and Client Secret need to be created in Google Cloud Console
- AUTH_SECRET needs to be generated (run `npx auth secret`)

## Architecture Decisions

1. **Server actions as data layer** — Pages call server actions, never Supabase directly. This keeps the data layer centralized and makes future auth integration straightforward (add session checks in actions).
   - *Why:* Separation of concerns, testable data layer, easy to add auth guards later.

2. **API routes for third-party only** — No internal API routes. All internal data flows through server actions. Exception: NextAuth API route at `app/api/auth/[...nextauth]` for Google OAuth callback.
   - *Why:* Reduces surface area, simpler mental model, Next.js best practice for App Router.

3. **Service role key for contact form** — Anonymous users need to INSERT into `contacts` table. Service role key bypasses RLS.
   - *Why:* RLS public INSERT policy was insufficient; service role key is server-only and never exposed to client.

4. **Fallback data for `generateStaticParams`** — Import from `data/temp.ts` directly instead of calling server actions that use `cookies()`.
   - *Why:* `generateStaticParams` runs at build time and cannot access request-specific cookies.

5. **Named exports only** — No default exports for components or server actions.
   - *Why:* Consistent imports, better refactoring, avoids naming confusion.

6. **No component library (shadcn/ui, etc.)** — Custom components built with Tailwind and Framer Motion.
   - *Why:* Full control over styling, smaller bundle, matches the unique portfolio aesthetic.

7. **Auth via NextAuth v5 + custom Supabase adapter** — No dependency on `@auth/supabase-adapter`. Custom adapter talks directly to Supabase with service role key.
   - *Why:* Full control over auth data flow, no third-party adapter dependency that may become outdated, easy to debug.

8. **JWT sessions (not database)** — Sessions use JWT tokens, not database rows.
   - *Why:* Required for Credentials provider compatibility. The adapter still stores users in Supabase for Google OAuth. JWT avoids the dual-strategy complexity.

9. **Credentials + Google dual auth** — Users can sign up with email/password or Google OAuth.
   - *Why:* Flexibility. Google users get auto-created via adapter; credential users are created via `handleSignUp` server action with bcrypt hashed passwords.

10. **Admin detection by email** — User with email matching `ADMIN_EMAIL` env var gets `is_admin = true` on account creation.
    - *Why:* Simple, no admin UI needed. The portfolio owner's email is known in advance.

11. **Combined middleware** — Auth check runs before i18n routing in a single middleware file.
    - *Why:* Protected routes are enforced regardless of locale. Single source of truth for request handling.

## Session Notes

- Windows case-sensitivity: files renamed via `git mv` (e.g., `Spotlight.tsx` → `spotlight.tsx`) to fix Vercel builds
- Gmail app password configured for contact form email delivery
- Supabase auth tables created in migration 004 but need to be run manually in Dashboard
- NextAuth v5 beta.31 installed with @auth/core 0.41.2
- Nodemailer v8 caused peer dep conflict with @auth/core — resolved with `--legacy-peer-deps`
- Middleware convention deprecated in Next.js 16 (should use "proxy") — build still works, warning only
- Build passes with zero errors: all routes generated including auth pages
