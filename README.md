# Mohamed Hesham - Portfolio

A modern, bilingual portfolio built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **i18n**: next-intl (English + Arabic, RTL support)
- **Animations**: Framer Motion
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. Run the SQL migrations in `supabase/migrations/` against your Supabase database
5. Run the seed data in `supabase/seed.sql`

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to your preferred language.

### Build

```bash
npm run build
```

## Routes

| Route | Description |
|-------|-------------|
| `/en` | English home page |
| `/ar` | Arabic home page (RTL) |
| `/[locale]/about` | About page |
| `/[locale]/projects` | Projects grid with filtering |
| `/[locale]/projects/[slug]` | Project detail |
| `/[locale]/experience` | Work experience timeline |
| `/[locale]/contact` | Contact form |

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/projects` | GET | All projects |
| `/api/projects/[slug]` | GET | Single project |
| `/api/contact` | POST | Submit contact form |

## Project Structure

```
app/
  [locale]/          # Locale-based pages
    layout.tsx       # Root locale layout (fonts, providers, header/footer)
    page.tsx         # Home
    about/           # About page
    projects/        # Projects + [slug] detail
    experience/      # Experience timeline
    contact/         # Contact form
  actions/           # Server actions
  api/               # API routes
components/
  layout/            # Header, Footer, PageWrapper
  sections/          # Page sections (Hero, Projects, etc.)
  ui/                # Reusable UI components
  providers/         # Theme provider
lib/                 # Utilities, validations, Supabase clients
i18n/                # next-intl config and routing
messages/            # Translation files (en.json, ar.json)
supabase/            # SQL migrations and seed data
```

## Deployment

Deploy to Vercel:

```bash
npm run deploy
```
