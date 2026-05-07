# Architecture Context

## Stack

| Layer       | Technology                    | Role                                                |
| ----------- | ----------------------------- | --------------------------------------------------- |
| Framework   | Next.js 16 (App Router)       | SSR/ISR, server actions, API routes, Turbopack      |
| Language    | TypeScript (strict)           | Type safety across the entire codebase               |
| UI          | Tailwind CSS v4 + custom      | CSS-first config, `@theme inline`, no `tailwind.config` |
| Animation   | Framer Motion 12              | Scroll reveals, hover effects, page transitions      |
| Icons       | Lucide React                  | Stroke-based icons only, consistent style            |
| i18n        | next-intl v4                  | URL-based locale routing, message catalogs           |
| Theme       | next-themes                   | Dark (default) / light mode, class strategy          |
| Auth        | NextAuth v5 (Auth.js beta)    | Credentials + Google OAuth, Supabase adapter         |
| Database    | Supabase (PostgreSQL)         | Projects, testimonials, experiences, contacts, users |
| Storage     | Supabase Storage              | Project images, avatars (public bucket)               |
| Email       | Nodemailer + Gmail SMTP       | Contact form delivery to portfolio owner              |
| Validation  | Zod v4                        | Input schemas for forms and API boundaries            |
| Analytics   | Vercel Analytics              | Page views and web vitals                             |

---

## Project Structure — Feature-Based Architecture

```
portfolio/
├── app/                              # Next.js App Router (routing layer only)
│   ├── [locale]/                     # Localized public pages
│   │   ├── layout.tsx                # Root layout: fonts, providers, metadata
│   │   ├── page.tsx                  # Homepage
│   │   ├── about/page.tsx            # About page
│   │   ├── contact/page.tsx          # Contact page
│   │   ├── experience/page.tsx       # Experience timeline page
│   │   ├── projects/
│   │   │   ├── page.tsx              # Projects listing
│   │   │   └── [slug]/page.tsx       # Individual project detail
│   │   └── auth/
│   │       ├── signin/page.tsx       # Sign in page
│   │       ├── signup/page.tsx       # Sign up page
│   │       └── error/page.tsx        # Auth error page
│   ├── auth/                         # Non-localized auth callback routes
│   ├── api/                          # API routes (third-party integration ONLY)
│   │   ├── auth/[...nextauth]/       # NextAuth route handler (OAuth callbacks)
│   │   ├── contact/                  # Contact form endpoint
│   │   └── projects/                 # Projects API (if needed for external consumers)
│   ├── actions/                      # Server actions — canonical data layer
│   │   ├── projects.ts               #   getProjects(), getFeaturedProjects(), getProjectBySlug()
│   │   ├── testimonials.ts           #   getTestimonials()
│   │   ├── experiences.ts            #   getExperiences()
│   │   ├── settings.ts               #   getSiteSettings()
│   │   ├── contact.ts                #   submitContactForm()
│   │   └── auth.ts                   #   signIn(), signUp(), signOut()
│   ├── layout.tsx                    # Root HTML shell
│   ├── robots.ts                     # SEO robots.txt
│   └── sitemap.ts                    # Dynamic sitemap
│
├── features/                         # Feature modules (domain logic)
│   ├── projects/
│   │   ├── components/               #   ProjectCard, ProjectGrid, FeaturedProjects
│   │   ├── hooks/                    #   useProjects(), useProject(slug)
│   │   ├── services/                 #   project queries, transforms, data mapping
│   │   ├── types/                    #   Project, ProjectFilters, etc.
│   │   └── validations/             #   project Zod schemas
│   ├── testimonials/
│   │   ├── components/               #   TestimonialsCarousel
│   │   ├── services/                 #   testimonial queries
│   │   └── types/                    #   Testimonial
│   ├── experience/
│   │   ├── components/               #   ExperienceHighlights, Timeline
│   │   ├── services/                 #   experience queries
│   │   └── types/                    #   Experience
│   ├── contact/
│   │   ├── components/               #   ContactForm
│   │   ├── services/                 #   email sending, rate limiting
│   │   ├── types/                    #   ContactFormData
│   │   └── validations/             #   contact form Zod schema
│   └── auth/
│       ├── components/               #   CredentialsForm, GoogleButton, SignupForm, UserMenu
│       ├── services/                 #   auth adapter, session management
│       ├── types/                    #   Auth types, session user
│       └── validations/             #   sign-in/sign-up Zod schemas
│
├── shared/                           # Cross-cutting shared code
│   ├── components/                   # Reusable UI primitives
│   │   ├── ui/                       #   MagicButton, SectionHeading, Skeleton, Spotlight
│   │   └── layout/                   #   Header, Footer, PageWrapper, LanguageSwitcher
│   ├── hooks/                        # Shared React hooks
│   │   └── (e.g., useScrollLock, useMediaQuery, useIntersectionObserver)
│   ├── lib/                          # Core utilities and configurations
│   │   ├── utils.ts                  #   cn() — clsx + tailwind-merge
│   │   ├── env.ts                    #   Zod-validated environment schema
│   │   ├── metadata.ts              #   SEO metadata and JSON-LD generators
│   │   ├── errors.ts                 #   Custom error classes
│   │   ├── api-response.ts          #   Response wrapper for API routes
│   │   ├── rate-limit.ts            #   IP-based rate limiting
│   │   └── sanitize.ts              #   Input sanitization helpers
│   ├── providers/                    # React context providers
│   │   ├── theme-provider.tsx       #   next-themes wrapper
│   │   └── session-provider.tsx     #   NextAuth session provider
│   ├── supabase/                     # Supabase client instances
│   │   ├── client.ts                #   Browser-side client
│   │   ├── server.ts                #   Server component client
│   │   └── middleware.ts            #   Middleware client
│   └── types/                        # Global TypeScript types
│       └── (shared interfaces, utility types)
│
├── data/                             # Fallback/Static Data
│   └── temp.ts                       #   Hardcoded fallback for generateStaticParams
│
├── i18n/                             # Internationalization config
│   ├── request.ts                    #   next-intl request configuration
│   ├── routing.ts                    #   Locale definitions and routing config
│   └── navigation.ts                #   Localized navigation helpers
│
├── messages/                         # i18n translation catalogs
│   ├── en.json                       #   All English UI strings
│   └── ar.json                       #   All Arabic UI strings (real human translations)
│
├── supabase/                         # Database migrations and seeds
│   ├── migrations/                   #   SQL migration files (ordered)
│   ├── seed.sql                      #   Development seed data
│   └── setup_all.sql                 #   Full setup script
│
├── middleware.ts                      # Next.js middleware (i18n routing + auth session)
├── next.config.ts                     # Next.js configuration
└── public/                           # Static assets (images, fonts, icons)
```

---

## System Boundaries

### `app/actions/` — Server Actions (Canonical Data Layer)

All reads and writes to the database go through server actions. Pages and components call server actions — never Supabase directly.

```
app/actions/
  projects.ts      → getProjects(), getFeaturedProjects(), getProjectBySlug()
  testimonials.ts  → getTestimonials()
  experiences.ts   → getExperiences()
  settings.ts      → getSiteSettings()
  contact.ts       → submitContactForm()
  auth.ts          → signIn(), signUp(), signOut()
```

**Rules:**
- Server actions are the ONLY way the app talks to Supabase internally
- Each action handles its own error cases and returns typed data
- Use `revalidate = <seconds>` for ISR caching at the page level, not inside actions
- Auth actions wrap NextAuth calls, not raw Supabase auth

### `app/api/` — API Routes (Third-Party Integration Only)

API routes exist exclusively for external/third-party integrations. They are NOT used for internal data flow.

```
app/api/
  auth/[...nextauth]/   → NextAuth route handler (OAuth callbacks, session management)
  contact/              → Contact form endpoint (if external services need to post)
```

**When to add an API route:**
- Webhook receivers (e.g., Stripe, GitHub)
- OAuth callbacks from third-party services (e.g., NextAuth)
- Third-party API proxying

**When NOT to add an API route:**
- Reading from or writing to Supabase → use server actions
- Form submissions from the app itself → use server actions
- Any internal data flow → use server actions

### `features/` — Feature Modules

Each feature is a self-contained domain module. Features do NOT import from other features — they communicate through shared types and server actions.

**Structure of a feature module:**
```
features/<name>/
  components/     → UI components specific to this feature
  hooks/          → React hooks for this feature's data/behavior
  services/       → Data fetching logic, transforms, business rules
  types/          → TypeScript interfaces and types for this feature
  validations/    → Zod schemas for this feature's inputs
```

**Rules:**
- Features import from `shared/`, never from other features
- Feature components can be imported by `app/` pages and `shared/components/layout/`
- Feature services are used by `app/actions/` to keep actions thin
- Feature types are the source of truth for that domain

### `shared/` — Cross-Cutting Shared Code

Code used across multiple features and the app layer.

| Directory | Purpose |
|-----------|---------|
| `components/ui/` | Reusable primitives: MagicButton, SectionHeading, Skeleton, Spotlight |
| `components/layout/` | App shell: Header, Footer, PageWrapper, LanguageSwitcher |
| `hooks/` | Shared React hooks used by multiple features |
| `lib/` | Utilities: cn(), env validation, metadata, error classes, rate limiting, sanitization |
| `providers/` | React context providers: ThemeProvider, SessionProvider |
| `supabase/` | Client instances for browser, server, and middleware |
| `types/` | Global TypeScript types shared across features |

---

## Storage Model

### Supabase PostgreSQL

| Table           | Purpose                                    | RLS Policy              |
| --------------- | ------------------------------------------ | ----------------------- |
| `projects`      | Portfolio projects (bilingual)             | Public SELECT           |
| `testimonials`  | Client/colleague testimonials              | Public SELECT           |
| `experiences`   | Work experience timeline                   | Public SELECT           |
| `site_settings` | Key-value site configuration (bilingual)   | Public SELECT           |
| `contacts`      | Contact form submissions                   | Public INSERT only      |
| `users`         | Authenticated user accounts                | Auth-based access       |

- Public tables: `SELECT` RLS — anyone can read
- `contacts`: public `INSERT` only (submissions are private)
- `users`: auth-gated — only the owning user can read/write their row
- Service role key (`SUPABASE_SERVICE_ROLE_KEY`) bypasses RLS — used only server-side for operations where anonymous users need to write (contact inserts)
- Auth tables managed by Supabase Auth (NextAuth adapter maps to these)

### Supabase Storage

- `portfolio-assets` bucket — public read, authenticated write
- Stores project screenshots, company logos, avatars
- Images served via Supabase CDN with `next/image` optimization

---

## Auth Architecture

### Current State — NextAuth v5 + Supabase

```
lib/auth.ts          → NextAuth config with Supabase adapter
lib/auth-adapter.ts  → Custom adapter bridging NextAuth ↔ Supabase
lib/auth-types.ts    → Session user type, auth-related interfaces

middleware.ts        → Refreshes auth tokens on each request + i18n routing
```

**Flow:**
1. User signs in via Credentials or Google OAuth on `/[locale]/auth/signin`
2. NextAuth handles OAuth flow through `app/api/auth/[...nextauth]/`
3. Custom adapter stores/reads user data in Supabase
4. Session token stored in HTTP-only cookie
5. Middleware refreshes session on every request
6. `SessionProvider` wraps the app — components access session via `useSession()`

**Credentials (email/password):**
- Sign-up validates with Zod (`lib/validations/auth.ts`)
- Password hashed by NextAuth/Supabase Auth
- Email verification flow available

**Google OAuth:**
- One-click sign-in via Google provider
- Account linked in Supabase via adapter

### Protected Routes (Future)

- `app/(admin)/` route group — admin pages behind auth
- Middleware checks session for `/admin/*` paths
- Server actions for admin operations verify `session.user` before mutating

---

## Data Flow Diagrams

### Public Page Render (SSR/ISR)

```
User Request
  → middleware.ts (i18n routing + session refresh)
  → app/[locale]/page.tsx (server component)
  → app/actions/<feature>.ts (server action)
  → shared/supabase/server.ts (Supabase client)
  → Supabase PostgreSQL
  → Return typed data
  → Render page with feature components
```

### Contact Form Submission

```
User fills form
  → features/contact/validations/ (Zod validation)
  → features/contact/components/ContactForm (client component)
  → app/actions/contact.ts (server action)
  → shared/lib/rate-limit.ts (IP check)
  → shared/lib/sanitize.ts (input sanitization)
  → shared/supabase/server.ts (insert to contacts table)
  → shared/lib/errors.ts (error handling)
  → Nodemailer (send email notification)
  → Return success/error to client
```

### Auth Flow

```
User clicks sign in
  → features/auth/components/CredentialsForm or GoogleButton
  → app/api/auth/[...nextauth]/route.ts (NextAuth handler)
  → lib/auth-adapter.ts (bridge to Supabase)
  → Supabase Auth (verify credentials/OAuth)
  → HTTP-only cookie set with session token
  → middleware.ts (refresh session on subsequent requests)
  → shared/providers/session-provider.tsx (expose to client components)
```

---

## Key Architectural Patterns

### Server Component vs Client Component

| Pattern | Server Component | Client Component |
|---------|-----------------|------------------|
| When | Data fetching, static rendering, SEO | Interactivity, hooks, browser APIs, animations |
| Where | `app/` pages, `features/*/components/` page-level | `features/*/components/` interactive parts, `shared/components/ui/` |
| Data | Calls server actions directly | Receives data via props from server parent |
| Mark | Default (no directive) | Must include `"use client"` |

### Error Handling Strategy

```
shared/lib/errors.ts     → Custom error classes (AppError, ValidationError, RateLimitError)
app/actions/             → Catch and return typed error results
features/*/components/   → Display user-friendly error states
shared/components/ui/    → Error boundaries and fallback UI
```

### Caching Strategy

- **ISR**: Pages use `revalidate = <seconds>` at the route level
- **Server actions**: No caching inside actions — let the route control revalidation
- **Static params**: `generateStaticParams` reads from `data/temp.ts` (cannot use `cookies()`)
- **Supabase queries**: No client-side caching — server actions are always fresh on request

---

## Invariants

1. **Server actions are the data layer** — pages/components never import Supabase directly; they call server actions
2. **API routes are for third-party only** — internal data flows through server actions, never API routes
3. **Features are isolated** — features import from `shared/` only, never from other features
4. **`generateStaticParams` never uses `cookies()``** — import fallback data from `data/temp.ts` directly
5. **All user input is validated with Zod** — at system boundaries (forms, API routes), before any processing
6. **Named exports only** — no default exports for components or server actions
7. **Service role key never reaches the client** — only used in server-side code
8. **Bilingual-first** — all content fields have `_en` and `_ar` variants; translation files cover all UI strings
9. **Graceful degradation** — if Supabase is down, pages render with fallback data from `data/temp.ts`
10. **RTL respected** — Arabic locale sets `dir="rtl"` on `<html>`; components use logical properties (`start`/`end`, `ps`/`pe`)
11. **Auth is additive** — public portfolio works without auth; protected routes are behind middleware checks
12. **Type safety end-to-end** — database types → server actions → components, all TypeScript strict
