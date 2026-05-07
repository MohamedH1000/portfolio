# Code Standards

## General

- Keep modules small and single-purpose — one responsibility per file
- Fix root causes, never layer workarounds
- Do not mix unrelated concerns in one component or route
- Prefer editing existing files over creating new ones
- No dead code, no unused imports, no placeholder comments

## TypeScript

- Strict mode is enabled — no implicit `any`, no `@ts-ignore` without explanation
- Use explicit interfaces for data shapes (Project, Testimonial, Experience)
- Validate unknown external input at system boundaries with Zod before trusting it
- Use `unknown` over `any` when type is genuinely uncertain
- Prefer `type` for simple unions/intersections, `interface` for object shapes

## Next.js (App Router)

- Default to server components — only add `"use client"` when browser interactivity is needed
- Server actions (`"use server"`) are the internal data layer — pages call actions, not Supabase directly
- `generateStaticParams` must never call server actions that use `cookies()` — import from `data/temp.ts` directly
- Named exports only for components and server actions — no default exports
- Use `revalidate` export at page level for ISR (not inside server actions)
- Keep route handlers in `app/api/` for third-party integrations only
- Use `notFound()` for missing resources, never return empty pages

## Styling

- Tailwind CSS v4 with `@theme inline` in `globals.css` — no `tailwind.config.ts`
- Use CSS custom property tokens (`bg-background`, `text-foreground`, `border-brand`) — no hardcoded hex in components
- Use the surface hierarchy system: `bg-surface-dim` through `bg-surface-bright`
- Use utility classes: `glass`, `brand-gradient`, `glow-brand`, `card-hover`, `ghost-border`
- Brand color is `#CBACF9` (dark) / `#6c5196` (light) — reference via `text-brand`, `bg-brand`, `border-brand`
- Border radius: `rounded-xl` for cards, `rounded-2xl` for large containers, `rounded-full` for avatars and icons
- RTL: use logical CSS properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) or Tailwind's `rtl:` prefix

## Server Actions

- All database reads/writes go through server actions in `app/actions/`
- Each action returns typed data — no raw Supabase responses leak to components
- Use the server-side Supabase client from `lib/supabase/server.ts` for reads
- Use service role key (via dynamic `import()`) for anonymous writes (e.g., contact form)
- Wrap external service calls in try/catch — never let them crash the page
- Best-effort side effects (DB insert on contact form) should not block the primary action (email send)

## API Routes

- Only for third-party integrations (webhooks, OAuth, external API proxying)
- Validate and parse request input with Zod before any logic runs
- Return consistent response shapes using `lib/api-response.ts`
- Never use API routes for internal data that should go through server actions

## Security

- All user input is sanitized via `lib/sanitize.ts` before storage or email
- Rate limiting on contact form via `lib/rate-limit.ts` (3 req/15 min per IP)
- Honeypot field on contact form for bot detection
- Service role key is server-only — never imported in client components
- Zod validation at every system boundary (forms, API routes)
- `SUPABASE_SERVICE_ROLE_KEY` accessed via dynamic `import()` to prevent client bundling

## File Organization

```
app/
  [locale]/          → Bilingual pages (home, about, projects, experience, contact)
  actions/           → Server actions (internal data layer)
  api/               → API routes (third-party integrations only)
  globals.css        → Theme tokens, utility classes, keyframes
components/
  layout/            → Header, Footer, PageWrapper, LanguageSwitcher
  sections/          → Page-specific section components
  ui/                → Reusable UI primitives
  providers/         → React context providers
context/             → Project reference docs (this folder)
data/
  temp.ts            → Fallback data for graceful degradation and generateStaticParams
i18n/
  request.ts         → next-intl request config
  routing.ts         → Locale routing definitions
lib/
  supabase/          → Supabase client utilities (client, server, middleware)
  validations/       → Zod schemas
  utils.ts           → cn() and shared helpers
  env.ts             → Environment variable validation
  metadata.ts        → SEO metadata generators
  rate-limit.ts      → IP rate limiter
  sanitize.ts        → Input sanitization
  errors.ts          → Custom error classes
  api-response.ts    → API response wrapper
messages/
  en.json            → English translations
  ar.json            → Arabic translations
public/              → Static assets (images, icons, SVGs)
supabase/
  migrations/        → SQL migration files
  seed.sql           → Seed data
```
