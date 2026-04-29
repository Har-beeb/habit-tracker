<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Habit Tracker PWA - AI Agent Guidelines

## 1. Tech Stack & Hard Constraints
- **Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS.
- **Testing:** Vitest (Unit), Playwright (E2E), React Testing Library. Do not swap these out.
- **CRITICAL:** DO NOT add a remote database or external authentication service. No Firebase, no Supabase, no Prisma. Persistence MUST remain local and deterministic using `localStorage`.

## 2. Persistence Contract (localStorage)
You must strictly use these exact local storage keys:
1. `habit-tracker-users` (Array of `User` objects)
2. `habit-tracker-session` (Object with `userId` and `email`, or `null`)
3. `habit-tracker-habits` (Array of `Habit` objects)

## 3. Naming Conventions & Structure
- **Components:** PascalCase (e.g., `LoginForm.tsx`) inside `src/components/`.
- **Utilities:** lowercase (e.g., `slug.ts`, `validators.ts`) inside `src/lib/`.
- **Types:** PascalCase inside `src/types/`.
- **Tests:** Must match the exact structure and titles required by the technical spec. Do not paraphrase test `describe` or `it`/`test` blocks.

## 4. Routing Contract
- `/` : Splash screen. Redirects to `/dashboard` if session exists, else `/login`.
- `/signup` : Creates user and session in localStorage, redirects to `/dashboard`.
- `/login` : Creates session in localStorage, redirects to `/dashboard`.
- `/dashboard` : Protected route. Renders only the logged-in user's habits.

## 5. Domain Logic Rules
- **Slugs:** Lowercase, trimmed, spaces replaced by single hyphens, no special characters.
- **Streaks:** Consecutive calendar days counting backwards from today. If today is not completed, streak is 0. 
- **Completions:** Only unique ISO dates (`YYYY-MM-DD`). No duplicates.