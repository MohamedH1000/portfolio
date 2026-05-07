# Mohamed Hesham — Portfolio

## Overview

A modern, bilingual (English/Arabic) developer portfolio built with Next.js 16, TypeScript, Tailwind CSS v4, and Supabase. Showcases projects, work experience, testimonials, and provides a contact form that sends emails via Gmail SMTP. Designed for Vercel deployment with ISR for optimal performance.

## Goals

1. Present Mohamed Hesham as a Full Stack Developer specializing in Next.js, React, TypeScript, and modern web technologies
2. Support English and Arabic (RTL) seamlessly with next-intl
3. Fetch all content from Supabase (not hardcoded) with graceful fallbacks
4. Deliver Lighthouse scores >90 across all categories
5. Maintain dark/light theme with a cohesive design system

## Core User Flow

1. Visitor lands on `/` → middleware redirects to `/en` or `/ar` based on browser preference
2. Homepage loads: Hero → Featured Projects → Testimonials → Experience → About preview
3. Visitor browses projects grid with search and tech-stack filtering
4. Visitor views project detail with bilingual description, tech stack, and live/source links
5. Visitor explores about page (bio, skills, approach) or experience timeline
6. Visitor submits contact form → email sent to mohammedhisham115@gmail.com + saved to Supabase

## Features

### Internationalization

- URL-based locale routing: `/en/...` and `/ar/...`
- RTL/LTR switching via `dir` attribute and CSS logical properties
- Separate translation files: `messages/en.json`, `messages/ar.json`
- Inter font for English, Noto Sans Arabic for Arabic

### Projects

- 11 projects with bilingual titles, descriptions, tech stacks, screenshots, and live URLs
- Featured projects on homepage, full grid on `/projects` with search + tech filter
- Individual detail pages at `/projects/[slug]` with JSON-LD structured data
- Tech stack shown as branded pill tags

### Contact

- Form with name, email, subject, message
- Server-side Zod validation and input sanitization
- Rate limiting (3 requests per 15 min per IP)
- Honeypot field for spam prevention
- Sends HTML email via Gmail SMTP (Nodemailer)
- Saves to Supabase `contacts` table via service role key

### SEO

- Dynamic metadata per page/locale with JSON-LD (Person, Project schemas)
- Auto-generated `sitemap.xml` and `robots.txt`
- Canonical URLs and hreflang alternate links

### Theme

- Dark mode (default) and light mode via next-themes
- Surface hierarchy system for consistent layering
- Gradient text effects, glass-effect navbar, card hover animations

## Scope

### In Scope

- Bilingual portfolio pages (home, about, projects, experience, contact)
- Supabase-backed content with SSR/ISR
- Contact form with email delivery
- SEO optimization (metadata, sitemap, structured data)
- Dark/light theme
- Responsive design (mobile, tablet, desktop)

### Out of Scope

- Admin dashboard for content management
- User authentication
- Blog/CMS
- Three.js or WebGL effects
- Error tracking (Sentry)
- Real-time features

## Success Criteria

1. All routes render correctly in both English and Arabic
2. Contact form sends email and saves to database
3. Lighthouse: Performance >90, Accessibility >95, SEO >95
4. `npm run build` passes with zero errors
5. Both themes (dark/light) look polished and consistent
