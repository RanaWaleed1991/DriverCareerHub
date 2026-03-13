# CLAUDE.md — Driver Career Hub

> **Purpose:** Operational quick-start for AI agents. Read this before touching any code.
> **Rule:** Every agent MUST update this file when adding features, endpoints, schemas, or patterns.

---

## PROJECT QUICK START

**What this is:** A PWA for Melbourne gig-economy drivers to track earnings, share community tips, and manage their driving career.

### Tech Stack (Strict — Do Not Change)

| Layer          | Technology                          | Status       |
|----------------|-------------------------------------|--------------|
| Frontend       | Next.js 15 (App Router) + Tailwind CSS 4 + TypeScript | Scaffolded |
| PWA            | Serwist + @serwist/next             | Installed    |
| Hosting        | AWS Amplify                         | Not configured |
| Auth           | Amazon Cognito                      | Deployed ✓     |
| Database       | Supabase PostgreSQL                 | Not configured |
| Backend API    | FastAPI on Railway                   | Empty scaffold |
| Storage        | AWS S3                              | Deployed ✓     |
| Push Notifs    | AWS SNS                             | Not configured |

### Run Locally

```bash
cd driver-career-hub/frontend
npm install        # only needed first time
npm run dev        # starts on http://localhost:3000
npm run build      # production build (verify before pushing)
npm run lint       # ESLint check
```

Root `/` redirects to `/feed` automatically.

### Environment Variables

Copy the template and fill in values when services are configured:

```bash
cp .env.local.example .env.local
```

| Variable | Service | Status |
|----------|---------|--------|
| `NEXT_PUBLIC_API_URL` | FastAPI backend URL | Placeholder |
| `NEXT_PUBLIC_COGNITO_USER_POOL_ID` | Cognito auth | Placeholder |
| `NEXT_PUBLIC_COGNITO_CLIENT_ID` | Cognito auth | Placeholder |
| `NEXT_PUBLIC_COGNITO_REGION` | Cognito auth | Placeholder |
| `NEXT_PUBLIC_S3_BUCKET` | S3 media bucket name | `drivercareerhubstoragestack-mediabucketbcbb02ba-cwmjcse9tqst` |

<!-- AGENT: Add new env vars to this table AND to .env.local.example when introducing them -->

---

## CODEBASE STRUCTURE

```
driver-career-hub/
├── .gitignore                    # Root monorepo gitignore
├── frontend/                     # Next.js 15 PWA
│   ├── .env.local.example        # Env var template
│   ├── .gitignore                # Frontend-specific ignores
│   ├── eslint.config.mjs         # ESLint v9 flat config (core-web-vitals + typescript)
│   ├── next.config.ts            # Next.js config (currently empty — add Serwist here)
│   ├── package.json              # Dependencies and scripts
│   ├── postcss.config.mjs        # PostCSS with @tailwindcss/postcss
│   ├── tsconfig.json             # TypeScript strict mode, paths: @/* → ./src/*
│   ├── public/
│   │   └── manifest.json         # PWA manifest (standalone, theme #1A365D)
│   └── src/
│       ├── app/
│       │   ├── globals.css       # Tailwind imports + CSS variables
│       │   ├── layout.tsx        # ROOT LAYOUT — metadata, viewport, <html> wrapper
│       │   ├── page.tsx          # Root page — redirects to /feed
│       │   ├── (auth)/
│       │   │   ├── login/page.tsx      # Login page (placeholder)
│       │   │   └── register/page.tsx   # Register page (placeholder)
│       │   └── (main)/
│       │       ├── layout.tsx          # BOTTOM NAV LAYOUT — 3-tab navigation shell
│       │       ├── feed/page.tsx       # Feed page (placeholder)
│       │       ├── tracker/page.tsx    # Tracker page (placeholder)
│       │       └── profile/page.tsx    # Profile page (placeholder)
│       ├── components/
│       │   ├── ui/               # Shared UI components (empty)
│       │   ├── feed/             # Feed-specific components (empty)
│       │   ├── tracker/          # Tracker-specific components (empty)
│       │   └── profile/          # Profile-specific components (empty)
│       ├── hooks/                # Custom React hooks (empty)
│       ├── lib/                  # Utilities, API clients, helpers (empty)
│       └── types/                # TypeScript type definitions (empty)
├── backend/                      # FastAPI app (empty scaffold)
│   └── README.md
└── infrastructure/               # AWS CDK scripts
    ├── README.md
    ├── scripts/
    │   └── deploy-auth.sh        # One-command Cognito deploy helper
    └── cdk/                      # CDK TypeScript app
        ├── package.json          # CDK + constructs dependencies
        ├── tsconfig.json         # TypeScript (ES2020, commonjs, strict)
        ├── cdk.json              # CDK app config (ts-node entry point)
        ├── bin/
        │   └── app.ts            # CDK app entry — instantiates AuthStack
        └── lib/
            ├── auth-stack.ts     # DriverCareerHubAuthStack — Cognito User Pool + Client
            └── storage-stack.ts  # DriverCareerHubStorageStack — S3 media bucket + IAM policies
```

### Frontend: Key Files

| File | Purpose | Type |
|------|---------|------|
| `src/app/layout.tsx` | Root layout. Sets metadata (title, description, manifest link), viewport for PWA, wraps all pages | Server Component |
| `src/app/page.tsx` | Entry redirect — `redirect("/feed")` via `next/navigation` | Server Component |
| `src/app/(main)/layout.tsx` | Bottom navigation shell. Fixed nav bar with Feed/Tracker/Profile tabs. Uses `usePathname()` for active state | Client Component (`"use client"`) |
| `src/app/(main)/feed/page.tsx` | Feed page placeholder | Server Component |
| `src/app/(main)/tracker/page.tsx` | Tracker page placeholder | Server Component |
| `src/app/(main)/profile/page.tsx` | Profile page placeholder | Server Component |
| `src/app/(auth)/login/page.tsx` | Login page placeholder | Server Component |
| `src/app/(auth)/register/page.tsx` | Register page placeholder | Server Component |
| `src/app/globals.css` | Tailwind v4 import, CSS custom properties for background/foreground, system fonts | — |
| `public/manifest.json` | PWA manifest: name "Driver Career Hub", start_url "/feed", standalone, theme #1A365D | — |

### Backend: API Endpoints

<!-- AGENT: Update this section as endpoints are added -->

| Method | Endpoint | Handler | Description | Status |
|--------|----------|---------|-------------|--------|
| — | — | — | No endpoints yet | Placeholder |

### Database: Schema Overview

<!-- AGENT: Update this section as tables/migrations are created -->

| Table | Purpose | Key Columns | Status |
|-------|---------|-------------|--------|
| — | — | — | Not configured |

### Configuration Files

| File | Purpose | Notes |
|------|---------|-------|
| `next.config.ts` | Next.js configuration | Empty — Serwist service worker config goes here |
| `tsconfig.json` | TypeScript config | Strict mode, `@/*` path alias maps to `./src/*` |
| `eslint.config.mjs` | ESLint v9 flat config | Uses `eslint-config-next/core-web-vitals` + `/typescript` |
| `postcss.config.mjs` | PostCSS plugins | `@tailwindcss/postcss` only |
| `public/manifest.json` | PWA manifest | Icons are placeholder paths — need actual icon files |

---

## CURRENT DEVELOPMENT STATUS

### Completed

- [x] Monorepo structure (frontend / backend / infrastructure)
- [x] Next.js 15 scaffold with App Router, TypeScript, Tailwind CSS 4
- [x] Serwist + @serwist/next installed
- [x] Route groups: `(auth)` for login/register, `(main)` for app pages
- [x] Mobile-first bottom navigation bar (Feed, Tracker, Profile)
- [x] PWA manifest.json
- [x] Root redirect to /feed
- [x] Environment variable template
- [x] AWS CDK (TypeScript) project scaffolded in `infrastructure/cdk/`
- [x] Cognito User Pool CDK stack (`DriverCareerHubAuthStack`) — pool + app client defined
- [x] S3 Storage CDK stack (`DriverCareerHubStorageStack`) — deployed, bucket `drivercareerhubstoragestack-mediabucketbcbb02ba-cwmjcse9tqst`
- [x] Cognito auth stack (`DriverCareerHubAuthStack`) — deployed, pool `ap-southeast-2_T0R1NbI5n`, client `7iisl2cv7e9im2l553hp0bfm84`

### In Progress

<!-- AGENT: Move items here when you start working on them -->

- [ ] Serwist service worker configuration (installed but not wired up in next.config.ts)

### Not Started

- [ ] Cognito authentication integration (CDK stack ready — needs deployment + frontend wiring)
- [ ] Supabase database setup and schema
- [ ] FastAPI backend scaffold (routes, models, services)
- [ ] S3 file upload integration (CDK stack ready — needs deployment + FastAPI presigned URL endpoint)
- [ ] SNS push notification setup
- [ ] AWS Amplify deployment config
- [ ] PWA icon assets (192x192, 512x512)
- [ ] Feed feature implementation
- [ ] Earnings tracker feature
- [ ] Profile management
- [ ] Offline support via Serwist

### Known Issues / Bugs

- Google Fonts (Geist) unavailable in build environment — replaced with system font stack. If deploying to an environment with internet access, consider re-adding Google Fonts.
- PWA icons referenced in manifest.json (`/icons/icon-192x192.png`, `/icons/icon-512x512.png`) do not exist yet.

### Immediate Next Priorities

1. Wire up Serwist service worker in `next.config.ts`
2. Set up Cognito auth flow (login/register pages)
3. Define Supabase schema and create initial migrations
4. Scaffold FastAPI backend with health check endpoint
5. Implement Feed page with community posts

---

## CODING PATTERNS TO FOLLOW

### Component Pattern

- **Server Components by default.** Only add `"use client"` when you need hooks, event handlers, or browser APIs.
- **Route groups** use parentheses: `(auth)` for unauthenticated pages, `(main)` for authenticated pages with bottom nav.
- **Layout nesting:** `(main)/layout.tsx` provides the bottom nav shell. All pages under `(main)/` automatically get it.

### File Naming

- Pages: `src/app/(group)/route-name/page.tsx`
- Layouts: `src/app/(group)/layout.tsx`
- Components: `src/components/{feature}/ComponentName.tsx` (PascalCase)
- Hooks: `src/hooks/useHookName.ts` (camelCase with `use` prefix)
- Utilities: `src/lib/utilName.ts`
- Types: `src/types/modelName.ts`

### How to Add a New Page

1. Create `src/app/(main)/your-route/page.tsx` (gets bottom nav automatically)
2. If it needs client interactivity, add `"use client"` at top
3. If it needs a new nav tab, update the `tabs` array in `src/app/(main)/layout.tsx`

### How to Add a New Component

1. Create `src/components/{feature}/ComponentName.tsx`
2. Import using `@/components/{feature}/ComponentName`
3. Keep components focused — one responsibility each

### How to Add an API Endpoint (Backend — when FastAPI is set up)

<!-- AGENT: Update this when FastAPI backend is scaffolded -->

1. Create route file in `backend/app/routes/`
2. Add service logic in `backend/app/services/`
3. Define Pydantic models in `backend/app/schemas/`
4. Register router in `backend/app/main.py`
5. Update the API Endpoints table in this file

### How to Add a New Practice Module

<!-- AGENT: Update this when the first practice module pattern is established -->

Placeholder — pattern not yet established.

### How to Modify AI Grading Prompts

<!-- AGENT: Update this when AI integration is added -->

Placeholder — no AI integration yet.

### Error Handling Conventions

<!-- AGENT: Update this when patterns are established -->

- Frontend: Use Next.js `error.tsx` boundary files per route segment
- Backend: Use FastAPI exception handlers with consistent JSON error responses
- Pattern not yet implemented — establish on first feature build

### Authentication Flow

<!-- AGENT: Update this when Cognito is integrated -->

- Auth pages live under `src/app/(auth)/`
- `(main)` routes will require authentication (middleware TBD)
- Cognito User Pool + Client ID configured via env vars
- Flow: Login → Cognito → JWT → stored client-side → sent with API requests

### Styling Conventions

- **Tailwind CSS 4** — use utility classes directly, no CSS modules
- **Primary colour:** `#1A365D` (navy) — used for active states, primary buttons
- **Mobile-first:** Design for 375px width, scale up
- **Dark mode:** CSS variables support it (`prefers-color-scheme: dark` in globals.css) but not actively designed yet
- **No component library** — build from scratch with Tailwind in `src/components/ui/`

---

## KEY FILES REFERENCE

Quick lookup for common modifications:

| What you want to change | File to modify |
|--------------------------|----------------|
| App metadata (title, description) | `src/app/layout.tsx` (metadata export) |
| Bottom navigation tabs | `src/app/(main)/layout.tsx` (tabs array, line 6) |
| PWA config (name, theme, start URL) | `public/manifest.json` |
| Global styles / CSS variables | `src/app/globals.css` |
| TypeScript path aliases | `tsconfig.json` (paths) |
| Next.js build config / Serwist | `next.config.ts` |
| ESLint rules | `eslint.config.mjs` |
| Environment variables | `.env.local.example` + this file's env table |
| Add a new (main) page | `src/app/(main)/{route}/page.tsx` |
| Add a new auth page | `src/app/(auth)/{route}/page.tsx` |
| Shared UI components | `src/components/ui/` |
| Feature-specific components | `src/components/{feed,tracker,profile}/` |
| Custom hooks | `src/hooks/` |
| Utility functions / API clients | `src/lib/` |
| TypeScript interfaces | `src/types/` |

---

## CRITICAL CONTEXT

### Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| Monorepo with separate `frontend/` and `backend/` dirs | Keeps deploy targets isolated — frontend to Amplify, backend to Railway — while sharing a single repo. |
| Next.js App Router with route groups | `(auth)` and `(main)` groups share different layouts without polluting URL paths. |
| Inline SVG icons instead of icon library | Zero dependency overhead for 3 icons. Switch to `lucide-react` if icon count grows past ~10. |
| System fonts instead of Google Fonts | Build environment lacks internet access to Google Fonts. Revisit when deploying with full network access. |
| Tailwind CSS 4 with `@tailwindcss/postcss` | Latest Tailwind with CSS-first config. No `tailwind.config.js` needed — uses `@theme` directive in CSS. |
| Serwist over next-pwa | Serwist is the actively maintained successor to next-pwa, purpose-built for Next.js App Router. |
| CDK TypeScript over Terraform/CloudFormation | Type-safe infra with IDE autocomplete; constructs match our TS frontend stack. Auth-only stack first; S3/SNS stacks added separately. |
| Cognito default email sender for MVP | Avoids SES sandbox approval delay. Switch to SES custom domain before launch for branded emails. |
| SRP auth flow primary, password flow also enabled | SRP never sends plain-text passwords. Password flow retained for server-side backend calls and Postman testing during dev. |

### Melbourne Driver Context

- Target users are Uber, DiDi, Ola, and delivery drivers in Melbourne, Australia
- Content and features should use Australian English and AUD currency
- Timezone: AEST/AEDT (Australia/Melbourne)

### Rate Limits and Quotas

<!-- AGENT: Update this as services are integrated -->

| Service | Limit | Notes |
|---------|-------|-------|
| Cognito | 40 sign-ups/sec default | Request increase before launch |
| Supabase Free | 500MB DB, 1GB storage | Upgrade plan for production |
| S3 | 5TB storage default | Standard pricing applies |
| SNS | 1M free mobile pushes/month | Monitor usage |

### Third-Party Integrations

<!-- AGENT: Update this as integrations are added -->

| Integration | Config Location | API Key Env Var | Status |
|-------------|-----------------|-----------------|--------|
| Amazon Cognito | `infrastructure/cdk/lib/auth-stack.ts` | `NEXT_PUBLIC_COGNITO_*` | Deployed — pool `ap-southeast-2_T0R1NbI5n` |
| Supabase | TBD | TBD | Not configured |
| AWS S3 | `infrastructure/cdk/lib/storage-stack.ts` | `NEXT_PUBLIC_S3_BUCKET` | Deployed — bucket `drivercareerhubstoragestack-mediabucketbcbb02ba-cwmjcse9tqst` |
| AWS SNS | TBD | TBD | Not configured |

---

## COMMON TASKS CHEATSHEET

### "I need to add a new tab to the bottom nav"
1. Edit `src/app/(main)/layout.tsx`
2. Add entry to the `tabs` array (line 6) with `name`, `href`, and `icon` function
3. Create the page at `src/app/(main)/{route}/page.tsx`

### "I need to add a protected API call from the frontend"
1. Create a fetch wrapper in `src/lib/api.ts` (doesn't exist yet — create it)
2. Use `NEXT_PUBLIC_API_URL` as the base URL
3. Attach the Cognito JWT token in Authorization header
4. Call from components or server actions

### "I need to add a new environment variable"
1. Add it to `frontend/.env.local.example` with empty value
2. Add it to the Environment Variables table in this CLAUDE.md
3. Access in code: `process.env.NEXT_PUBLIC_VAR_NAME` (client) or `process.env.VAR_NAME` (server only)

### "I need to set up Serwist service worker"
1. Edit `next.config.ts` to wrap config with `withSerwist()` from `@serwist/next`
2. Create `src/app/sw.ts` for the service worker entry
3. Register the service worker in root layout or a client component
4. See: https://serwist.pages.dev/docs/next/getting-started

### "I need to add Supabase"
1. `npm install @supabase/supabase-js` in `frontend/`
2. Create `src/lib/supabase.ts` with client initialization
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to env
4. Update this CLAUDE.md with schema and env var details

### "I need to deploy the Cognito auth stack"
```bash
# One-liner (from repo root):
./driver-career-hub/infrastructure/scripts/deploy-auth.sh

# With explicit region/profile:
./driver-career-hub/infrastructure/scripts/deploy-auth.sh --region ap-southeast-2 --profile myprofile

# Manual CDK commands:
cd driver-career-hub/infrastructure/cdk
npm install
npx cdk bootstrap          # only needed once per AWS account+region
npx cdk deploy DriverCareerHubAuthStack --require-approval never
```
After deploy, copy `UserPoolId`, `UserPoolClientId`, and `Region` outputs into `frontend/.env.local`.

### "I need to scaffold the FastAPI backend"
1. In `backend/`, create: `requirements.txt`, `app/main.py`, `app/routes/`, `app/services/`, `app/schemas/`
2. Add a `/health` endpoint as the first route
3. Update the Backend API Endpoints table in this CLAUDE.md
4. Document the run command in the Run Locally section

### "I need to verify my changes work"
```bash
cd driver-career-hub/frontend
npm run build    # Must pass with zero errors
npm run lint     # Must pass with zero warnings
npm run dev      # Manual check at http://localhost:3000
```

---

## WORKFLOW RULES FOR AGENTS

### 1. Plan First

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan — don't keep pushing
- Write detailed specs upfront to reduce ambiguity

### 2. Verification Before Done

- Never mark a task complete without proving it works
- Run `npm run build` after frontend changes
- Run tests when they exist — check logs, demonstrate correctness
- Ask yourself: "Would a staff engineer approve this?"

### 3. Self-Improvement Loop

- After ANY correction from the user, update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Review lessons at session start

### 4. Demand Elegance (Balanced)

- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes — don't over-engineer

### 5. Autonomous Bug Fixing

- When given a bug report: just fix it, don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user

### 6. Task Management

1. **Plan First:** Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan:** Check in before starting implementation
3. **Track Progress:** Mark items complete as you go
4. **Explain Changes:** High-level summary at each step
5. **Document Results:** Add review section to `tasks/todo.md`
6. **Capture Lessons:** Update `tasks/lessons.md` after corrections

### Core Principles

- **Simplicity First:** Make every change as simple as possible. Minimal code impact.
- **No Laziness:** Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact:** Changes should only touch what's necessary. Avoid introducing bugs.
- **Update CLAUDE.md:** If you add a feature, endpoint, schema, env var, or pattern — update this file.

---

## VERSION LOG

<!-- AGENT: Add an entry here every time you make a significant change to this file -->

| Date | Agent/Session | Change |
|------|---------------|--------|
| 2026-03-12 | Initial scaffold | Created CLAUDE.md with full project structure, patterns, and workflow rules |
| 2026-03-12 | CDK auth setup | Added `infrastructure/cdk/` CDK TypeScript project with `DriverCareerHubAuthStack` (Cognito User Pool + App Client) and `infrastructure/scripts/deploy-auth.sh` |
| 2026-03-12 | CDK S3 storage | Added `DriverCareerHubStorageStack` in `lib/storage-stack.ts` — S3 media bucket (CORS, IA lifecycle, block-public-access), backend CRUD policy, frontend presigned-upload policy, and `infrastructure/scripts/deploy-storage.sh` |
| 2026-03-13 | Infra deployed | Deployed `DriverCareerHubAuthStack` (Cognito pool `ap-southeast-2_T0R1NbI5n`) and `DriverCareerHubStorageStack` (S3 bucket `drivercareerhubstoragestack-mediabucketbcbb02ba-cwmjcse9tqst`) to `ap-southeast-2` |
