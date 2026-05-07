# UI Context

## Theme

Dark-first portfolio with full light mode support. Dark mode is the default. The design language uses deep navy backgrounds in dark mode and soft lavender whites in light mode, with a distinctive purple brand accent throughout. Layered surfaces create depth, and the brand purple (#CBACF9) is used sparingly for emphasis — headings, active states, CTAs, and accents.

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
| Brand accent      | `--brand`          | `#CBACF9` | `text-brand`, `bg-brand`     |
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

| Class              | Effect                                              |
| ------------------ | --------------------------------------------------- |
| `.glass`           | Frosted glass background with blur (dark + light)   |
| `.brand-gradient`  | Purple gradient background (dark + light variants)  |
| `.glow-brand`      | Subtle purple box-shadow glow                       |
| `.card-hover`      | Lift on hover with shadow (translateY -4px)         |
| `.ghost-border`    | 15% opacity brand outline                           |
| `.bg-blueprint`    | Subtle grid pattern background                      |

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
| `skeleton`       | Loading placeholder                       |

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
