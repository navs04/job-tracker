# Deployment

This app has three deployable pieces: the Postgres database, the Express API, and the static React build.

## 1. Database

Any managed PostgreSQL provider works (the app has no provider-specific dependencies — plain Prisma + `pg`). After provisioning, run migrations against it once:

```bash
DATABASE_URL="<your production connection string>" npx prisma migrate deploy
```

Note: use `migrate deploy` (not `migrate dev`) in production — it applies existing migrations without prompting or generating new ones.

## 2. Server (Express API)

Any Node hosting platform that supports a persistent Node process works. Requirements:
- Node 20+
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment variables: all of those listed in `server/README.md`, with production values — especially `DATABASE_URL` pointed at your production database, real random `JWT_ACCESS_SECRET`/`JWT_REFRESH_SECRET` (never reuse your local dev secrets), and `CLIENT_URL` set to your deployed frontend's real URL (required for CORS + cookies to work)

## 3. Client (static React build)

Any static hosting platform works, since `npm run build` produces plain static files in `client/dist/`. Requirements:
- Build command: `npm install && npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL` pointed at your deployed server's URL (e.g. `https://your-api.example.com/api`)

## Post-deploy checklist

- [ ] Visit the deployed frontend URL — confirm it loads
- [ ] Register a new account — confirms the frontend can reach the API and the API can reach the database
- [ ] Log out and back in — confirms the httpOnly refresh cookie works cross-origin (this is the step most likely to break — if it fails, double check `CLIENT_URL` on the server matches your frontend's exact deployed origin, and that cookies are configured with `secure: true` in production, which the app's auth controller already does automatically via `NODE_ENV === "production"`)
- [ ] Create, edit, delete an application — confirms full CRUD against the production database
- [ ] Check browser devtools for any CORS errors in the console — if present, `CLIENT_URL` mismatch is almost always the cause

## Current recommendations for finding a host

Rather than naming specific platforms here (offerings and pricing change), search for "\[platform\] Node.js Express deployment" and "\[platform\] PostgreSQL" for your preferred provider, or ask an AI assistant with web search enabled for current recommendations at the time you're deploying — this avoids the documentation going stale.