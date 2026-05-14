# Admin Dashboard Feature Specification

## Overview

Build a protected admin dashboard at `/admin` that gives the portfolio owner (admin) full CRUD control over all content: projects, experiences, testimonials, site settings, and contact submissions. The dashboard is English-only, behind auth middleware, and accessible only to users with `is_admin = true`.

## Goals

1. Single-page CRUD for each content type — list, create, edit, delete
2. Bilingual fields edited side-by-side (EN + AR) in every form
3. Image uploads to Supabase Storage (project screenshots, logos, avatars)
4. Sortable/reorderable content via `sort_order` field
5. Contact submissions inbox with read/unread status
6. Dashboard overview with quick stats
7. All mutations go through server actions with admin session verification
8. Responsive but desktop-first — admin primarily uses this on desktop

## Architecture

### Route Structure

```
app/
  (admin)/                          ← Route group (no URL prefix)
    admin/
      layout.tsx                    ← Auth guard + admin sidebar + shell
      page.tsx                      ← Dashboard overview (stats cards)
      projects/
        page.tsx                    ← Projects list + create/edit modal
      experiences/
        page.tsx                    ← Experiences list + create/edit modal
      testimonials/
        page.tsx                    ← Testimonials list + create/edit modal
      contacts/
        page.tsx                    ← Contact submissions inbox
      settings/
        page.tsx                    ← Site settings editor
```

The `(admin)` route group is separate from `[locale]` — admin pages are English-only (no i18n routing overhead). The middleware already protects `/admin/*` paths.

### Feature Module Structure

```
features/admin/
  components/
    AdminSidebar.tsx                ← Navigation sidebar with active state
    AdminHeader.tsx                  ← Top bar with user info + sign out
    DataTable.tsx                    ← Reusable data table with sorting, search
    DeleteDialog.tsx                 ← Confirmation dialog for deletions
    ImageUpload.tsx                  ← Supabase Storage upload component
    BilingualInput.tsx              ← Side-by-side EN/AR text input
    StatsCard.tsx                    ← Dashboard stat card
    SortableRow.tsx                  ← Drag-to-reorder row (optional: manual sort_order)
  hooks/
    useAdminActions.ts              ← Hook wrapping admin server actions
  services/
    admin-guard.ts                  ← Server-side session check utility
  types/
    admin.ts                        ← Admin-specific types
  validations/
    project.ts                      ← Project create/update Zod schema
    experience.ts                   ← Experience create/update Zod schema
    testimonial.ts                  ← Testimonial create/update Zod schema
    settings.ts                     ← Site settings Zod schema
```

### Shared Admin Components

These live in `shared/components/admin/` since they're reusable across admin pages:

| Component | Purpose |
|-----------|---------|
| `DataTable` | Generic table with columns, search, pagination |
| `BilingualInput` | Side-by-side EN/AR input (text, textarea, rich text) |
| `ImageUpload` | Drag-and-drop upload to Supabase Storage with preview |
| `DeleteDialog` | Modal confirmation before delete |
| `StatsCard` | Number + label + trend indicator for dashboard |
| `EmptyState` | Shown when a table has no rows |
| `FormSkeleton` | Loading state for forms |

## Database Schema (existing — no new tables needed)

All tables already exist. Here's what the admin CRUD covers:

### `projects`

| Column | Type | CRUD | Notes |
|--------|------|------|-------|
| `id` | UUID | Auto | Generated |
| `slug` | TEXT UNIQUE | Create/Edit | URL-safe, auto-generated from `title_en` |
| `title_en` | TEXT | Create/Edit | Required |
| `title_ar` | TEXT | Create/Edit | Required |
| `description_en` | TEXT | Create/Edit | Long text (textarea) |
| `description_ar` | TEXT | Create/Edit | Long text (textarea) |
| `tech_stack` | TEXT[] | Create/Edit | Multi-select or comma-separated tags |
| `image_url` | TEXT | Create/Edit | Uploaded to Supabase Storage |
| `live_url` | TEXT | Create/Edit | Optional |
| `github_url` | TEXT | Create/Edit | Optional |
| `featured` | BOOLEAN | Create/Edit | Toggle |
| `sort_order` | INTEGER | Edit | Drag reorder or manual number |

### `experiences`

| Column | Type | CRUD | Notes |
|--------|------|------|-------|
| `id` | UUID | Auto | Generated |
| `role_en` | TEXT | Create/Edit | Required |
| `role_ar` | TEXT | Create/Edit | Required |
| `company` | TEXT | Create/Edit | Required (not bilingual) |
| `company_logo_url` | TEXT | Create/Edit | Uploaded to Supabase Storage |
| `description_en` | TEXT | Create/Edit | Long text |
| `description_ar` | TEXT | Create/Edit | Long text |
| `start_date` | DATE | Create/Edit | Required |
| `end_date` | DATE | Create/Edit | Null = present |
| `sort_order` | INTEGER | Edit | Drag reorder or manual number |

### `testimonials`

| Column | Type | CRUD | Notes |
|--------|------|------|-------|
| `id` | UUID | Auto | Generated |
| `name_en` | TEXT | Create/Edit | Required |
| `name_ar` | TEXT | Create/Edit | Required |
| `title_en` | TEXT | Create/Edit | Person's title/role |
| `title_ar` | TEXT | Create/Edit | Person's title/role |
| `message_en` | TEXT | Create/Edit | Long text |
| `message_ar` | TEXT | Create/Edit | Long text |
| `avatar_url` | TEXT | Create/Edit | Uploaded to Supabase Storage |
| `sort_order` | INTEGER | Edit | Drag reorder or manual number |

### `site_settings`

| Column | Type | CRUD | Notes |
|--------|------|------|-------|
| `id` | UUID | Auto | Generated |
| `key` | TEXT UNIQUE | Create/Edit | Setting identifier |
| `value_en` | TEXT | Create/Edit | English value |
| `value_ar` | TEXT | Create/Edit | Arabic value |

Pre-populated settings to manage:
- `hero_title_en` / `hero_title_ar`
- `hero_subtitle_en` / `hero_subtitle_ar`
- `hero_description_en` / `hero_description_ar`
- `hero_cta_en` / `hero_cta_ar`
- `about_bio_en` / `about_bio_ar`
- `social_github`, `social_linkedin`, `social_twitter`
- `footer_text_en` / `footer_text_ar`

### `contacts` (read-only + mark as read)

| Column | Type | CRUD | Notes |
|--------|------|------|-------|
| `id` | UUID | Read only | |
| `name` | TEXT | Read only | |
| `email` | TEXT | Read only | |
| `subject` | TEXT | Read only | |
| `message` | TEXT | Read only | |
| `read` | BOOLEAN | Toggle | Mark as read/unread |
| `created_at` | TIMESTAMPTZ | Read only | |

CRUD: List, view detail, mark read/unread, delete (no edit).

## Server Actions

Each entity gets its own set of CRUD server actions. Every mutation verifies the user is an admin before proceeding.

### Admin Guard Utility

```
features/admin/services/admin-guard.ts
```

```typescript
import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: not signed in");
  }
  if (!session.user.is_admin) {
    throw new Error("Forbidden: not an admin");
  }
  return session;
}
```

Every admin server action calls `requireAdmin()` as its first line.

### `app/actions/admin-projects.ts`

```
getAdminProjects()           → All projects (not just featured), with sort_order
createProject(data)          → Insert new project (auto-generate slug)
updateProject(id, data)      → Update project by ID
deleteProject(id)            → Delete project by ID
updateProjectOrder(orders)   → Batch update sort_order for reordering
```

### `app/actions/admin-experiences.ts`

```
getAdminExperiences()        → All experiences sorted by sort_order
createExperience(data)       → Insert new experience
updateExperience(id, data)   → Update experience by ID
deleteExperience(id)         → Delete experience by ID
updateExperienceOrder(orders) → Batch update sort_order
```

### `app/actions/admin-testimonials.ts`

```
getAdminTestimonials()       → All testimonials sorted by sort_order
createTestimonial(data)      → Insert new testimonial
updateTestimonial(id, data)  → Update testimonial by ID
deleteTestimonial(id)        → Delete testimonial by ID
updateTestimonialOrder(orders) → Batch update sort_order
```

### `app/actions/admin-contacts.ts`

```
getAdminContacts()           → All contacts, newest first
getAdminContact(id)          → Single contact detail
markContactRead(id)          → Set read = true
markContactUnread(id)        → Set read = false
deleteContact(id)            → Delete contact
```

### `app/actions/admin-settings.ts`

```
getAdminSettings()           → All site settings
updateSetting(key, data)     → Update value_en and value_ar by key
```

### `app/actions/admin-upload.ts`

```
uploadImage(file, folder)    → Upload to Supabase Storage, return public URL
deleteImage(path)            → Delete from Supabase Storage
```

## Validation Schemas

### Project Schema

```typescript
const projectSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  title_en: z.string().min(1, "English title is required").max(200),
  title_ar: z.string().min(1, "Arabic title is required").max(200),
  description_en: z.string().min(10, "English description must be at least 10 characters"),
  description_ar: z.string().min(10, "Arabic description must be at least 10 characters"),
  tech_stack: z.array(z.string()).min(1, "At least one technology is required"),
  image_url: z.string().url().optional().or(z.literal("")),
  live_url: z.string().url().optional().or(z.literal("")),
  github_url: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  sort_order: z.number().int().min(0).default(0),
});
```

### Experience Schema

```typescript
const experienceSchema = z.object({
  role_en: z.string().min(1, "English role is required"),
  role_ar: z.string().min(1, "Arabic role is required"),
  company: z.string().min(1, "Company name is required"),
  company_logo_url: z.string().url().optional().or(z.literal("")),
  description_en: z.string().min(10, "English description is required"),
  description_ar: z.string().min(10, "Arabic description is required"),
  start_date: z.string().min(1, "Start date is required"), // ISO date string
  end_date: z.string().nullable(), // null = present
  sort_order: z.number().int().min(0).default(0),
});
```

### Testimonial Schema

```typescript
const testimonialSchema = z.object({
  name_en: z.string().min(1, "English name is required"),
  name_ar: z.string().min(1, "Arabic name is required"),
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  message_en: z.string().min(10, "English message is required"),
  message_ar: z.string().min(10, "Arabic message is required"),
  avatar_url: z.string().url().optional().or(z.literal("")),
  sort_order: z.number().int().min(0).default(0),
});
```

### Settings Schema

```typescript
const settingSchema = z.object({
  key: z.string().min(1),
  value_en: z.string().min(1, "English value is required"),
  value_ar: z.string().min(1, "Arabic value is required"),
});
```

## Page Designs

### Dashboard Overview (`/admin`)

Stats cards across the top:
- Total Projects (count)
- Total Experiences (count)
- Total Testimonials (count)
- Unread Messages (count from contacts where read = false)

Recent activity below:
- 5 most recent contact submissions (clickable to detail)

### Projects Page (`/admin/projects`)

- **Table columns**: Image thumbnail, Title (EN), Tech Stack (pills), Featured (badge), Sort Order, Actions
- **Actions**: Edit (opens modal/form), Delete (confirmation dialog), Toggle featured
- **Top bar**: Search input + "New Project" button
- **Create/Edit form** (slide-over panel or modal):
  - BilingualInput for title (EN + AR side by side)
  - BilingualInput for description (textareas)
  - Tech stack: multi-select tag input (add/remove tags)
  - Image upload: drag-and-drop with preview
  - Live URL, GitHub URL: text inputs
  - Featured: toggle switch
  - Slug: auto-generated from English title, editable
  - Sort order: number input

### Experiences Page (`/admin/experiences`)

- **Table columns**: Company, Role (EN), Period (start - end), Sort Order, Actions
- **Create/Edit form**:
  - BilingualInput for role
  - Company name (single field, not bilingual)
  - Company logo upload
  - BilingualInput for description
  - Start date, End date (date pickers, null = "Present")
  - Sort order

### Testimonials Page (`/admin/testimonials`)

- **Table columns**: Avatar, Name (EN), Title (EN), Sort Order, Actions
- **Create/Edit form**:
  - BilingualInput for name
  - BilingualInput for title/role
  - BilingualInput for message (textareas)
  - Avatar upload
  - Sort order

### Contacts Page (`/admin/contacts`)

- **Table columns**: Name, Email, Subject, Date, Read status (dot icon), Actions
- **Actions**: View (opens detail panel), Mark read/unread, Delete
- **Filters**: All / Unread / Read
- **Detail panel** (slide-over): Full message, sender info, reply link (mailto)
- No create/edit — contacts come from the public contact form

### Settings Page (`/admin/settings`)

- Grouped settings: Hero, About, Social Links, Footer
- Each setting: key (read-only label) + BilingualInput for value_en and value_ar
- Save button per group (or per setting)
- No delete — settings are always present

## Admin Layout

### Sidebar Navigation

```
┌──────────────────┐
│  M H  Portfolio   │
│                   │
│  ● Dashboard      │
│  ○ Projects       │
│  ○ Experience     │
│  ○ Testimonials   │
│  ○ Messages       │
│  ○ Settings       │
│                   │
│  ─────────────── │
│  ○ View Site →    │
│  ○ Sign Out       │
└──────────────────┘
```

- Fixed left sidebar, 240px wide
- Brand logo at top
- Active item highlighted with brand color
- "View Site" link opens public portfolio in new tab
- Sign out at bottom
- Collapses to icon-only on smaller screens

### Top Header

```
┌─────────────────────────────────────────┐
│  [Sidebar Toggle]  Page Title    [User]  │
└─────────────────────────────────────────┘
```

- Breadcrumb or page title
- User avatar + name dropdown

## Image Upload Flow

1. Admin drags/drops or clicks to select image
2. Client validates: max 5MB, jpg/png/webp only
3. Client uploads to Supabase Storage `portfolio-assets` bucket
4. Server action `uploadImage()` generates a unique filename (`{folder}/{uuid}.{ext}`)
5. Returns the public URL
6. URL stored in the database field (image_url, company_logo_url, avatar_url)
7. `deleteImage()` removes from storage when replacing or deleting

Supabase Storage folder structure:
```
portfolio-assets/
  projects/      ← project screenshots
  logos/         ← company logos
  avatars/       ← testimonial avatars
```

## Security

1. **Admin guard on every mutation** — `requireAdmin()` checks `session.user.is_admin`
2. **Middleware protection** — `/admin/*` redirects to sign-in if not authenticated, redirects to home if not admin
3. **CSRF** — Server actions are POST-only with Next.js built-in CSRF protection
4. **Input validation** — Zod schemas on all create/update operations
5. **Image validation** — File type and size checked before upload
6. **No public admin routes** — Admin pages are never cached by ISR, always server-rendered with fresh session check
7. **RLS** — Admin actions use service role key (bypasses RLS) since the guard is done at the application level

## New RLS Policies Needed

The current RLS policies only allow public SELECT on content tables and public INSERT on contacts. Admin mutations need service role access (already available). No new RLS policies needed — the service role key handles all admin writes.

However, add RLS for Supabase Storage uploads:

```sql
-- Portfolio assets bucket: public read, authenticated upload
CREATE POLICY "Public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated');
```

## i18n

Admin pages are English-only. No translation files needed for the admin dashboard. The bilingual content (EN/AR) is managed through the BilingualInput component within each form.

## Implementation Order

```
Phase 1 — Shell
1. features/admin/services/admin-guard.ts (session verification utility)
2. features/admin/components/AdminSidebar.tsx
3. features/admin/components/AdminHeader.tsx
4. app/(admin)/admin/layout.tsx (auth guard + sidebar + header shell)
5. app/(admin)/admin/page.tsx (dashboard overview with stats)

Phase 2 — Reusable Components
6. shared/components/admin/DataTable.tsx
7. shared/components/admin/BilingualInput.tsx
8. shared/components/admin/ImageUpload.tsx
9. shared/components/admin/DeleteDialog.tsx
10. shared/components/admin/StatsCard.tsx
11. shared/components/admin/EmptyState.tsx

Phase 3 — Projects CRUD
12. features/admin/validations/project.ts (Zod schema)
13. app/actions/admin-projects.ts (CRUD server actions)
14. app/(admin)/admin/projects/page.tsx (list + create/edit form)

Phase 4 — Experiences CRUD
15. features/admin/validations/experience.ts
16. app/actions/admin-experiences.ts
17. app/(admin)/admin/experiences/page.tsx

Phase 5 — Testimonials CRUD
18. features/admin/validations/testimonial.ts
19. app/actions/admin-testimonials.ts
20. app/(admin)/admin/testimonials/page.tsx

Phase 6 — Contacts Inbox
21. app/actions/admin-contacts.ts
22. app/(admin)/admin/contacts/page.tsx

Phase 7 — Settings
23. features/admin/validations/settings.ts
24. app/actions/admin-settings.ts
25. app/(admin)/admin/settings/page.tsx

Phase 8 — Image Upload
26. app/actions/admin-upload.ts (Supabase Storage upload)
27. Wire ImageUpload component into all forms

Phase 9 — Polish
28. Sort order reordering (drag or manual)
29. Search and filtering on all tables
30. Loading skeletons and error states
31. Toast notifications for success/error on mutations
32. npm run build verification
```

## Testing Checklist

- [ ] Visiting `/admin` while not signed in redirects to sign-in
- [ ] Visiting `/admin` as non-admin redirects to home
- [ ] Dashboard shows correct stat counts
- [ ] Can create a new project with bilingual fields
- [ ] Can edit an existing project — changes reflect on public site after revalidation
- [ ] Can delete a project with confirmation dialog
- [ ] Can toggle featured status on a project
- [ ] Can create/edit/delete experiences with bilingual fields
- [ ] Can create/edit/delete testimonials with bilingual fields
- [ ] Contact submissions appear in the inbox
- [ ] Can mark contacts as read/unread
- [ ] Can delete a contact submission
- [ ] Settings changes save and reflect on public site
- [ ] Image upload works and preview displays
- [ ] Replacing an image deletes the old one from storage
- [ ] All forms validate required fields (Zod)
- [ ] `npm run build` passes with zero errors
- [ ] No console errors in admin pages

## File Structure Summary

```
New files (~30+):
  features/admin/
    components/    → AdminSidebar, AdminHeader, SortableRow
    hooks/         → useAdminActions
    services/      → admin-guard.ts
    types/         → admin.ts
    validations/   → project.ts, experience.ts, testimonial.ts, settings.ts

  shared/components/admin/
    DataTable.tsx
    BilingualInput.tsx
    ImageUpload.tsx
    DeleteDialog.tsx
    StatsCard.tsx
    EmptyState.tsx
    FormSkeleton.tsx

  app/(admin)/admin/
    layout.tsx
    page.tsx
    projects/page.tsx
    experiences/page.tsx
    testimonials/page.tsx
    contacts/page.tsx
    settings/page.tsx

  app/actions/
    admin-projects.ts
    admin-experiences.ts
    admin-testimonials.ts
    admin-contacts.ts
    admin-settings.ts
    admin-upload.ts
```
