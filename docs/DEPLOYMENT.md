# Deployment

This app is deployed across three separate platforms — a database host, an API host, and a static frontend host. This document reflects the actual stack used for this project's live deployment.

## Stack used

| Piece | Platform | Why |
|---|---|---|
| Database | [Neon](https://neon.tech) | Free-tier PostgreSQL with no expiry, works with plain Prisma + `pg`, no code changes needed |
| Server (Express API) | [Render](https://render.com) | Free tier runs a real persistent Node process — required, since this is a traditional Express app, not serverless functions |
| Client (React static build) | [Vercel](https://vercel.com) | Clean fit for a Vite static build, automatic HTTPS, deploys on git push |

## 1. Database (Neon)

1. Sign up, create a project, copy the connection string (includes `?sslmode=require`).
2. Run migrations against it from your local machine, once:
```bash
   cd server
   DATABASE_URL="<neon connection string>" npx prisma migrate deploy
   DATABASE_URL="<neon connection string>" npx prisma db seed   # optional
```
   **Must be run from inside `server/`** — Prisma looks for `prisma/schema.prisma` relative to the current directory.

## 2. Server (Render)

1. Push the repo to GitHub.
2. Create a new Web Service on Render, connect the repo:
   - **Root directory:** `server`
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
3. Environment variables (Render dashboard → Environment tab):
   - `DATABASE_URL` — the Neon connection string
   - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — generate fresh values, don't reuse local dev secrets:
```bash
     node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
   - `CLIENT_URL` — your deployed Vercel URL, **no trailing slash** (see CORS gotcha below)
4. Deploy, then verify with `https://your-app.onrender.com/api/health`.

**Free tier note:** Render's free plan spins the server down after inactivity. The first request after idle can take 30–60 seconds while it cold-starts — this is expected, not a bug.

## 3. Client (Vercel)

1. Import the same repo:
   - **Root directory:** `client`
   - **Build command:** `npm run build` (default)
   - **Output directory:** `dist` (default)
2. Environment variable: `VITE_API_URL` → `https://your-app.onrender.com/api`
3. **Env var changes require a fresh deploy to take effect** — Vercel does not hot-apply them to an existing build. Trigger a redeploy after adding/changing any environment variable.
4. `client/vercel.json` must exist in the repo (rewrites all paths to `index.html`) — required for client-side routing (React Router) to work on refresh/direct URL access. Without it, refreshing on any route other than `/` returns a 404.

## 4. Close the loop

Once both are deployed, go back to Render and set `CLIENT_URL` to your actual Vercel production URL, then redeploy the server.

---

## Gotchas encountered during this deployment (and fixes)

These are worth knowing before you deploy, since they're easy to hit and not obvious from the error messages alone.

### CORS: trailing slash mismatch

CORS origin matching is exact, byte-for-byte. `CLIENT_URL=https://your-app.vercel.app/` (with a trailing slash) will **not** match the `Origin` header the browser sends (`https://your-app.vercel.app`, no slash) — every request gets blocked with a CORS error even though the domain is "correct." Double-check `CLIENT_URL` has no trailing slash.

### Cross-site cookies: `SameSite=Lax` silently fails

The client (Vercel) and server (Render) are on different domains — this makes the refresh-token cookie a **cross-site** cookie, not just cross-origin. A `SameSite=Lax` cookie (this project's original local-dev default) is **not sent** on JS-initiated cross-site requests (fetch/XHR with `withCredentials: true`) — only on top-level navigations like clicking a link. This causes a confusing symptom: login/register work fine (they don't depend on an existing cookie), but the silent refresh-on-page-load fails with a 401, so refreshing the page always bounces you back to `/login`.

**Fix:** the refresh-token cookie must be set with `sameSite: "none"` and `secure: true` for cross-site production use (see `server/src/controllers/auth.controller.ts`). Note this requires HTTPS — won't work over plain HTTP.

### SPA 404 on refresh

Vercel (and most static hosts) serve real files by default. React Router handles routes like `/dashboard` entirely client-side — there's no real file at that path. A browser refresh on any non-root route makes a fresh request straight to Vercel, which 404s since no such file exists. Fixed via `client/vercel.json`'s rewrite rule (see above) — routes everything to `index.html`, letting React Router take over once the JS loads.

### TypeScript strictness differs between local dev and CI build

Local `npm run dev` (Vite's esbuild-based dev server) is more lenient about type-only imports than a full `tsc -b` production build. Several files that worked fine locally failed on Vercel/Render's fresh build with `verbatimModuleSyntax` errors (e.g. `'ReactNode' is a type and must be imported using a type-only import`). Run `npx tsc -b` (client) / `npm run build` (server) locally before pushing to catch these before a deploy fails on it.

## Post-deploy checklist

- [ ] Visit the deployed frontend — confirm it loads
- [ ] Register a new account — confirms frontend → API → database connectivity
- [ ] Log out, log back in, then **refresh the page** — confirms the cross-site cookie is actually working (this is the step most likely to silently fail; see gotcha above)
- [ ] Create, edit, delete an application — confirms full CRUD against production data
- [ ] Test the Kanban board (drag a card) — confirms writes plus the status-history side effect
- [ ] Check browser devtools console for CORS errors — if present, check `CLIENT_URL` for a trailing slash first
- [ ] Refresh on a non-root route (e.g. `/dashboard`) directly — confirms `vercel.json` rewrite is working, not 404ing