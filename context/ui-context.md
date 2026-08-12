# UI Context

## Theme

Dark-first portfolio with full light mode support. Dark mode is the default. The design language uses deep navy backgrounds in dark mode and soft lavender whites in light mode, with a distinctive purple brand accent throughout. Layered surfaces create depth, and the brand purple is used sparingly for emphasis — headings, active states, CTAs, and accents.

`--brand` is **theme-aware**: `#CBACF9` in dark mode, `#6c5196` in light mode.
`text-brand` / `bg-brand` / `border-brand` resolve through it, so the accent
stays legible on light backgrounds (`#CBACF9` on `#faf8ff` fails contrast).
Use `--brand-rgb` for alpha compositing, e.g. `rgba(var(--brand-rgb), 0.15)`.

## Colors

All components must use these semantic tokens — no hardcoded hex values in component files.

### Dark Mode (`:root`)

| Role              | CSS Variable       | Value     | Usage                        |
| ----------------- | ------------------ | --------- | ---------------------------- |
| Page background   | `--background`     | `#121222` | `bg-background`              |
| Primary text      | `--foreground`     | `#e3e0f8` | `text-foreground`            |
| Card background   | `--card`           | `#1a1a2b` | `bg-card`                    |
| Brand accent      | `--brand`          | `#CBACF9` | `text-brand`, `bg-brand`     |
| Secondary surface | `--secondary`      | `#29283a` | `bg-secondary`               |
| Muted text        | `--muted-foreground`| `#ccc4d1`| `text-muted-foreground`      |
| Border            | `--border`         | `#4a454f` | `border-border`              |
| Input background  | `--input`          | `#333345` | `bg-input`                   |
| Error             | `--destructive`    | `#ffb4ab` | Error states                 |

### Light Mode (`.light`)

| Role              | CSS Variable       | Value     | Usage                        |
| ----------------- | ------------------ | --------- | ---------------------------- |
| Page background   | `--background`     | `#faf8ff` | `bg-background`              |
| Primary text      | `--foreground`     | `#1c1b2e` | `text-foreground`            |
| Card background   | `--card`           | `#ffffff` | `bg-card`                    |
| Brand accent      | `--brand`          | `#6c5196` | `text-brand`, `bg-brand`     |
| Light brand       | `--primary`        | `#6c5196` | `text-primary` (light mode)  |
| Secondary surface | `--secondary`      | `#e8e0f5` | `bg-secondary`               |
| Muted text        | `--muted-foreground`| `#5a5670`| `text-muted-foreground`      |
| Border            | `--border`         | `#cbc4d7` | `border-border`              |

### Surface Hierarchy

Used for layering cards, panels, and sections to create visual depth.

| Level    | Dark Value | Light Value | Tailwind Class        |
| -------- | ---------- | ----------- | --------------------- |
| Dim      | `#121222`  | `#e3e0f8`   | `bg-surface-dim`      |
| Lowest   | `#0c0c1d`  | `#ffffff`   | `bg-surface-lowest`   |
| Low      | `#1a1a2b`  | `#f0ecf7`   | `bg-surface-low`      |
| Base     | `#1e1e2f`  | `#ebe5f3`   | `bg-surface`          |
| High     | `#29283a`  | `#e5dff0`   | `bg-surface-high`     |
| Highest  | `#333345`  | `#dfd9ea`   | `bg-surface-highest`  |
| Bright   | `#38374a`  | `#faf8ff`   | `bg-surface-bright`   |

### Brand Gradient

```
Dark:  linear-gradient(135deg, #CBACF9 → #9b7fd4)
Light: linear-gradient(135deg, #6c5196 → #8b6bb8)
```

Use `.brand-gradient` class. Applied to primary CTAs, active filter buttons, highlighted text.

## Typography

| Role         | Font               | CSS Variable                | Notes                        |
| ------------ | ------------------ | --------------------------- | ---------------------------- |
| English text | Inter              | `--font-inter`              | Latin subset, swap display   |
| Arabic text  | Noto Sans Arabic   | `--font-noto-sans-arabic`   | Arabic subset, swap display  |
| Sans stack   | Combined           | `--font-sans` / `--font-arabic` | Set via locale in layout |

- Arabic locale sets `fontFamily` to Noto Sans Arabic first, Inter as fallback
- English locale uses Inter only
- Section headings: `clamp(2rem, 5vw, 3.5rem)`, weight 700, tracking `-0.02em`
- Body text: default size, weight 400, line-height 1.6
- Brand gradient text: `bg-gradient-to-r from-brand to-purple-400 bg-clip-text text-transparent`

## Border Radius

| Context           | Class          | Notes                    |
| ----------------- | -------------- | ------------------------ |
| Small inline UI   | `rounded-lg`   | Tags, badges, inputs     |
| Cards / panels    | `rounded-xl`   | Project cards, forms     |
| Large containers  | `rounded-2xl`  | Hero cards, feature sections |
| Avatars / icons   | `rounded-full` | Profile images, icon buttons |
| Buttons           | `rounded-xl`   | Primary and secondary buttons |

## Utility Classes (defined in globals.css)

All custom classes live in Tailwind's `components` cascade layer, and base
element rules in the `base` layer. This is required: unlayered CSS beats
*every* Tailwind utility regardless of specificity, so unlayered custom
classes would silently override `ps-10`, `border-brand/20`, `rounded-xl`, etc.

| Class                     | Effect                                                        |
| ------------------------- | ------------------------------------------------------------- |
| `.glass`                  | Frosted glass background with blur (dark + light)             |
| `.glass-panel`            | Glass + hairline border + elevation + inner top highlight     |
| `.surface-card`           | Card surface: hairline border, elevation, top-edge sheen      |
| `.border-gradient`        | Masked gradient hairline ring, fades in on hover/group-hover  |
| `.border-gradient-static` | Same ring, always visible (hero/feature panels)               |
| `.brand-gradient`         | Purple gradient background (dark + light variants)            |
| `.brand-gradient-animated`| Slowly panning brand gradient                                 |
| `.text-gradient-brand`    | Theme-aware gradient text (stays legible in light mode)       |
| `.glow-brand`             | Subtle purple box-shadow glow                                 |
| `.glow-brand-strong`      | Brand ring + larger brand glow                                |
| `.card-hover`             | Lift on hover with elevation (translateY -6px)                |
| `.lift-sm`                | Gentler lift for dense UI (admin tables, list rows)           |
| `.press`                  | Scale-down feedback on `:active`                              |
| `.sheen-hover`            | Light sweep across the element on hover                       |
| `.shimmer`                | Animated loading placeholder                                  |
| `.field`                  | Shared input/textarea/select styling with focus ring          |
| `.link-underline`         | Underline that wipes in from the leading edge                 |
| `.divider-gradient`       | Hairline divider fading out at both ends                      |
| `.ghost-border`           | 15% opacity brand outline                                     |
| `.bg-blueprint`           | Subtle grid pattern background                                |
| `.bg-blueprint-fade`      | Radial mask so the grid dissolves at the edges                |
| `.bg-grain`               | Fine noise overlay (via `::after`)                            |

### Design Tokens

Beyond colors, `globals.css` exposes motion and elevation tokens:

- **Easing**: `--ease-out-expo`, `--ease-out-quart`, `--ease-in-out-soft`, `--ease-spring`
- **Duration**: `--dur-fast` (160ms), `--dur-base` (260ms), `--dur-slow` (420ms), `--dur-slower` (640ms)
- **Elevation**: `--shadow-1` … `--shadow-5`, plus `--shadow-brand`
- **Surfaces**: `--glass-bg`, `--glass-border`, `--hairline`, `--sheen`, `--scrim`
- **Brand**: `--brand`, `--brand-strong`, `--brand-contrast`, `--brand-rgb`

Prefer these over hardcoded rgba/shadow values so both themes stay in sync.

> **Vendor prefixes**: when pairing `-webkit-backdrop-filter` with
> `backdrop-filter`, write the **prefixed one first**. The build minifier
> merges the pair and keeps only the last-seen prefix, which otherwise
> drops the standard property and silently disables the blur in Chrome.

## Component Library

Custom components built with Tailwind and Framer Motion. Located in `components/ui/`.

| Component        | Purpose                                   |
| ---------------- | ----------------------------------------- |
| `spotlight`      | Animated gradient spotlight effect        |
| `project-card`   | Project showcase card with hover effects  |
| `magic-button`   | Gradient CTA button                       |
| `tech-tag`       | Colored pill for tech stack items         |
| `section-heading`| Gradient-accented section title           |
| `text-generate`  | Typewriter text reveal effect             |
| `skeleton`       | Loading placeholder (shimmer)             |

### Admin Primitives (`components/admin/`)

| Component            | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| `AdminNav`           | Sidebar contents shared by desktop rail + drawer  |
| `AdminSidebar`       | Desktop-only fixed rail                          |
| `AdminHeader`        | Top bar + animated mobile drawer                 |
| `AdminPageTransition`| Route-change fade for the admin shell            |
| `AdminPanel`         | Elevated container with optional header row      |
| `AdminButton`        | Button with primary/secondary/ghost/danger        |
| `SlideOver`          | Animated edge panel for create/edit forms        |
| `SearchInput`        | Search field with icon + clear button            |
| `FormField`          | Label + hint wrapper for form controls           |
| `TableSkeleton`      | Shimmering placeholder rows                      |
| `ErrorState`         | Error message with retry                         |
| `EmptyState`         | Empty state with icon, message, optional action  |
| `StatsCard`          | Stat card with count-up animation                |
| `DeleteDialog`       | Animated confirmation dialog                     |

Do not add shadcn/ui or other component libraries. Build custom components following existing patterns.

## Layout Patterns

- **Navbar**: Fixed top, glass-effect, bottom border, brand logo `M<span>H</span>`, locale switcher, theme toggle
- **Pages**: Max-width container (`max-w-6xl mx-auto`) with generous vertical padding (`py-20`)
- **Cards**: `bg-card` with `card-hover`, `rounded-xl`, subtle border `border-border/40`
- **Sections**: Alternating between `bg-background` and `bg-surface` for visual separation
- **Footer**: Dark surface with social icon circles and bilingual copyright

## Icons

Lucide React only. Stroke-based, consistent 1.5px weight.

- Inline icons: `h-4 w-4`
- Button icons: `h-5 w-5`
- Decorative/hero icons: `h-6 w-6` to `h-8 w-8`
- Icon buttons: `h-9 w-9 rounded-full` circle containers

## Animation

Framer Motion for all interactive animations:

- **Scroll reveal**: `whileInView` with `viewport={{ once: true }}`, staggered children
- **Hover**: `whileHover={{ scale: 1.02 }}` or `whileHover={{ y: -4 }}`
- **Page transitions**: `AnimatePresence` with fade/slide variants
- **Duration**: 0.3s–0.5s for most transitions, `ease: "easeOut"`

## Responsive Breakpoints

| Breakpoint | Width    | Layout Changes                     |
| ---------- | -------- | ---------------------------------- |
| Mobile     | < 640px  | Single column, stacked sections    |
| Tablet     | 640–768px| Two-column grids begin             |
| Desktop    | 768–1024px| Full layouts, sidebars           |
| Wide       | > 1024px | Max-width container, generous spacing |
