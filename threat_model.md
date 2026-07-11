# Threat Model

## Project Overview

Wildpixels is a publicly deployed photography portfolio built as a pnpm monorepo. The production surface is centered on an Express 5 API (`artifacts/api-server`) backed by PostgreSQL via Drizzle, plus a React/Vite web client (`artifacts/wildpixels`) and an Expo mobile client that consume the same API. The site exposes public read endpoints for trips, photos, articles, comments, reactions, contact, subscription, analytics, and settings, while administrative content changes rely on a cookie-based admin session.

Production assumptions for this scan:
- The primary deployment is public (`https://photo-journey--vadirajbk.replit.app`).
- `NODE_ENV=production` in production.
- Mockup sandbox artifacts are dev-only and out of scope unless the API explicitly exposes them.
- TLS is platform-managed.

## Assets

- **Admin account and session** — the single admin login controls trip creation, article publishing, homepage/contact settings, and dashboard access. Compromise gives full content-management control.
- **Unpublished editorial content** — draft articles and unpublished content are business-sensitive until intentionally published.
- **Subscriber and contact data** — subscriber email addresses, unsubscribe tokens, and contact submissions contain personal data and should not be exposed or misused.
- **Server-side network reachability** — any backend fetch capability can access resources not reachable from the public browser, including internal services or private URLs.
- **Site integrity and public content** — trips, articles, settings, and slide-related artifacts affect what visitors see and trust.
- **Application secrets** — `SESSION_SECRET`, admin credentials, database credentials, and Gmail credentials must never be exposed or indirectly abused.

## Trust Boundaries

- **Browser/mobile client → API** — all request data from visitors and mobile clients is untrusted and must be validated server-side.
- **Public visitor → admin-only mutation endpoints** — the API allows broad public reads but privileged writes must be enforced on the server for every protected route.
- **API → PostgreSQL** — SQL execution occurs with application privileges; injection or overly broad reads would expose or modify site data.
- **API → external URLs/services** — routes that fetch album URLs or send mail cross into third-party and network resources; user-controlled destinations are especially sensitive.
- **Deployed app → local filesystem/workspace** — any route that reads or writes workspace files crosses into a highly trusted boundary and must be tightly controlled.
- **Public site → unpublished/private content** — draft or admin-facing data must not leak through public GET endpoints just because the frontend hides it.

## Scan Anchors

- **Production entry points**: `artifacts/api-server/src/index.ts`, `artifacts/api-server/src/app.ts`, `artifacts/wildpixels/src/App.tsx`.
- **Highest-risk API areas**: `src/routes/auth.ts`, `src/middlewares/requireAuth.ts`, `src/routes/settings.ts`, `src/routes/articles.ts`, `src/routes/trips.ts`, `src/routes/contact.ts`, `src/routes/slides.ts`.
- **Public surfaces**: trips, photos, articles, comments, reactions, settings GETs, contact, subscribe/unsubscribe, analytics.
- **Authenticated/admin surfaces**: trip/article/settings mutations and dashboard; protection currently depends on the `admin_session` signed cookie.
- **Usually dev-only / lower-priority artifacts**: `artifacts/mockup-sandbox`, slide/video/countdown artifacts, unless they are reachable through the main API or deployment.

## Threat Categories

### Spoofing

Administrative access is protected by a single cookie-backed admin login. The system must resist credential guessing and must only accept authenticated admin sessions that were issued by the server under a strong secret. Public endpoints must never become de facto admin capability just because the frontend is the only intended caller.

Required guarantees:
- Admin login endpoints must resist online brute-force and credential-stuffing attempts.
- Protected routes must validate the signed admin session on every request.
- Session material and auth cookies must not be forgeable, replayable across unrelated contexts, or exposed in logs.

### Tampering

The admin can change trips, articles, landing settings, and slide-related assets, so any route that writes to the database or filesystem is a tampering target. Client-side UI intent is not a control; every state-changing action must be enforced server-side.

Required guarantees:
- Every content mutation route must require admin authorization server-side.
- File-writing routes must be treated as privileged operations and constrained to safe paths and safe inputs.
- User-controlled fields stored in the database must not allow unreviewed modification of sensitive system state.

### Information Disclosure

The application stores subscriber/contact data and supports draft editorial content. Public APIs must not leak unpublished articles, subscriber data, internal dashboard data, or other admin-only information merely because the frontend filters it after fetching.

Required guarantees:
- Public article endpoints must expose only published content.
- Admin/dashboard data and subscriber-related details must remain unavailable to unauthenticated users.
- Error handling and logs must avoid leaking secrets, cookies, or internal implementation details.

### Denial of Service

Public endpoints include login, comments, reactions, contact, analytics, and server-side fetch flows. Attackers can use these to exhaust resources, force outbound requests, or amplify expensive work.

Required guarantees:
- Admin login and other abuse-prone public endpoints must have effective request throttling.
- Public server-side fetch flows must constrain destinations, response sizes, and execution cost.
- Public write endpoints should avoid unbounded memory, CPU, mail fan-out, or database growth from unauthenticated traffic.

### Elevation of Privilege

The most serious escalation paths in this project are admin auth weaknesses, public endpoints that reach privileged data, and server-side fetch or file-write behavior that crosses trust boundaries. The system must ensure that public visitors cannot turn benign routes into admin-level control or internal network access.

Required guarantees:
- Public routes must not expose draft/admin-only data or sensitive capabilities.
- User-controlled URLs fetched by the server must be allowlisted or otherwise constrained to prevent SSRF.
- Any route capable of writing to local files or triggering privileged side effects must be authenticated and narrowly scoped.