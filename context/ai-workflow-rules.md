# AI Workflow Rules

## Approach

Build this portfolio incrementally using a spec-driven workflow. Context files in `context/` define what to build, how to build it, and the current state of progress. Always read the relevant context files before implementing any feature or fix — do not infer or invent behavior from scratch.

## Before Starting Any Task

1. Read `context/project-overview.md` for feature scope and user flows
2. Read `context/architecture.md` for system boundaries and data layer conventions
3. Read `context/code-standards.md` for coding conventions
4. Read `context/ui-context.md` for design tokens and component patterns
5. Read `context/progress-tracker.md` for current state and open questions

## Scoping Rules

- Work on one feature unit at a time
- Prefer small, verifiable increments over large speculative changes
- Do not combine unrelated system boundaries in a single implementation step
- Every change should be verifiable with `npm run build` and visual inspection

## When to Split Work

Split an implementation step if it combines:

- UI changes and data layer changes (do data first, then UI)
- Multiple pages or routes (do one page at a time)
- Styling and logic (do logic first, then style)
- Backend and frontend concerns (keep them separate)

If a change cannot be verified end-to-end quickly, the scope is too broad — split it.

## Server Actions vs API Routes

- **Server actions** (`app/actions/`): ALL internal data operations — reads, writes, mutations
- **API routes** (`app/api/`): ONLY for third-party integrations — webhooks, OAuth, external service proxying
- When in doubt, use a server action

## Handling Missing Requirements

- Do not invent product behavior not defined in the context files
- If a requirement is ambiguous, resolve it in the relevant context file before implementing
- If a requirement is missing, add it as an open question in `progress-tracker.md` before continuing
- Ask the user for clarification rather than guessing

## Protected Files

Do not modify the following unless explicitly instructed:

- `.env.local` — contains secrets, user manages values
- `data/temp.ts` — fallback data, only update when project data changes
- `messages/en.json` and `messages/ar.json` — translation catalogs, update only when UI strings change
- `supabase/migrations/` — database schema, only modify with explicit approval

## Bilingual Considerations

- Every visible string must exist in both `en.json` and `ar.json`
- All content fields use `_en` and `_ar` suffixes in the database
- Test both locales after any UI change — check RTL layout doesn't break
- Use `rtl:` Tailwind prefix or logical properties for directional styling

## Keeping Docs in Sync

Update the relevant context file whenever implementation changes:

- New feature or page → update `project-overview.md` scope
- New dependency or library → update `architecture.md` stack table
- New component or pattern → update `ui-context.md` component library
- New coding convention → update `code-standards.md`
- Completed or started work → update `progress-tracker.md`

## Before Moving to the Next Unit

1. The current unit works end-to-end within its defined scope
2. No invariant defined in `architecture.md` was violated
3. `progress-tracker.md` reflects the completed work
4. `npm run build` passes with zero errors
5. Both locales (EN/AR) render correctly
6. Both themes (dark/light) look correct

## Error Recovery

- If `npm run build` fails, fix the build error before proceeding
- If a Vercel deployment fails, check case-sensitive filenames (Windows is case-insensitive, Linux is not)
- If Supabase returns RLS errors, ensure the correct client (anon vs service role) is being used
- If hydration mismatches occur, check for `suppressHydrationWarning` on `<html>` and `<body>`
