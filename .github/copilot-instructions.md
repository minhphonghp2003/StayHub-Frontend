<!-- Copilot / AI instructions for contributors and coding agents -->
# Repo-specific guidance for AI coding assistants

Keep this short, actionable and specific to this codebase.

- Project type: Next.js (App Router) + TypeScript + Tailwind + RTK + Axios.
- Dev commands: `npm run dev` (local), `npm run build`, `npm run start`, `npm run lint`.

Key architecture notes
- Routing & Layouts: the app uses the Next.js `app/` directory. Admin surfaces live under [app/(admin)](app/(admin)/layout.tsx). Each nested folder often contains `layout.tsx` and `page.tsx`.
- API surface: HTTP client is centralized at [src/core/http-client/AxiosClient.ts](src/core/http-client/AxiosClient.ts) with interceptors in [src/core/http-client/interceptor](src/core/http-client/interceptor). Use the existing `AxiosClient` for all network calls to inherit auth/refresh behavior.
- Domain layering: follow the existing service→repository→payload→model pattern under `src/core/`:
  - `src/core/payload/*` — request payload shapes
  - `src/core/repository/*` — low-level API call wrappers
  - `src/core/service/*` — orchestration and higher-level business calls
  - `src/core/model/*` — typed models and BaseModel helpers

Common change pattern (recommended)
- To add a new backend call or CRUD flow, update these in order: payload → repository → service → model → UI. Example: RBAC user features live under `src/core/*/RBAC/...` and pages under `src/app/(admin)/(RBAC)/user`.

Auth & tokens
- Environment keys: `NEXT_PUBLIC_API_URL` is the base API URL (see root `.env`). Tokens keys are `NEXT_PUBLIC_ACCESS_TOKEN` and `NEXT_PUBLIC_REFRESH_TOKEN` in this repo's .env example.
- Token handling and refresh flows run inside the Axios interceptors — inspect [src/core/http-client/interceptor](src/core/http-client/interceptor) before changing auth logic.

UI & components
- Reusable components live under `src/components/` (forms: `src/components/form`, UI atoms: `src/components/ui`). Follow existing prop patterns (e.g., `InputField.tsx`, `Select.tsx`) and prefer composition over copying markup.
- Styling: Tailwind is used globally (`src/app/globals.css`) — keep classnames consistent and use `class-variance-authority` utility where present.

State
- Redux Toolkit store is defined at [src/redux/store.ts](src/redux/store.ts). Feature slices are at `src/redux/features/*`. Prefer RTK patterns (createSlice, createAsyncThunk) for new state.

Client vs Server components
- The project uses Next.js App Router. If a component interacts with browser-only APIs (cookies, localStorage, event handlers), ensure it has `"use client"` at the top. Default `app/` files are server components unless marked otherwise.

Third-party / integrations
- UI libs: Radix UI, Lucide, ApexCharts, FullCalendar — check `package.json` for versions.
- Maps: `@react-jvectormap/*` is included; see components or pages that render maps for usage patterns.

Conventions & patterns to follow
- Keep domain logic in `src/core/*` not inside components.
- Follow existing folder parity: if you add a `service` for a domain, create matching `payload`, `repository`, and `model` folders.
- Use TS types from `src/core/model` and `zod` where present for validation.
- Prefer `AxiosClient.request(...)` wrappers instead of raw `axios` imports.

Files to inspect for context before large changes
- [src/core/http-client/AxiosClient.ts](src/core/http-client/AxiosClient.ts)
- [src/core/http-client/interceptor](src/core/http-client/interceptor)
- [src/core/service](src/core/service)
- [src/core/repository](src/core/repository)
- [src/app/(admin)/layout.tsx](src/app/(admin)/layout.tsx)
- [src/components/form/InputField.tsx](src/components/form/InputField.tsx)
- [src/redux/store.ts](src/redux/store.ts)

Why these choices matter
- Centralizing HTTP and domain layers reduces duplicated auth and typing mistakes and makes it easier to enforce paging, error handling and retries in one place.
- Keeping UI thin (logic in `service`/`repository`) preserves reusability across admin pages.

If you are an AI agent making edits
- Make minimal, well-scoped changes and run `npm run build` and `npm run lint` locally.
- When adding API calls follow the domain layering above and add unit/typing in `model` / `payload`.
- Ask for human review on any change that touches `AxiosClient` or auth interceptor logic.

Feedback
- If anything in this file is unclear or missing (scripts, custom build steps), tell me which area to expand.
