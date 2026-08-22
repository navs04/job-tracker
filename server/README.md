# Server — Job Application Tracker API

Express + TypeScript + Prisma + PostgreSQL backend.

## Setup

```bash
npm install
cp .env.example .env
# fill in DATABASE_URL, JWT secrets (see below)
npx prisma migrate dev
npx prisma db seed   # optional demo data
```

## Environment variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server listens on | `4000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/job_tracker?schema=public` |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens | (long random string — generate below) |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens | (different long random string) |
| `ACCESS_TOKEN_EXPIRY` | Access token lifetime | `15m` |
| `REFRESH_TOKEN_EXPIRY` | Refresh token lifetime | `7d` |
| `CLIENT_URL` | Frontend origin, for CORS | `http://localhost:5173` |

Generate secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run twice — once for each JWT secret. **Never commit real secrets** — `.env` is gitignored; only `.env.example` (with placeholders) is tracked.

## Development

```bash
npm run dev
```

Runs at `http://localhost:4000`, using `tsx watch` for auto-restart on file changes.

## Database

```bash
npx prisma studio        # visual DB browser
npx prisma migrate dev   # create/apply a new migration
npx prisma db seed       # reset + reseed demo data
```

## Build

```bash
npm run build   # compiles TypeScript to dist/
npm start       # runs the compiled build
```

## API overview

All routes except `/api/auth/*` and `/api/health` require a valid `Authorization: Bearer <token>` header.

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/refresh` | Refresh access token (uses httpOnly cookie) |
| POST | `/api/auth/logout` | Log out, clears refresh cookie |
| GET/POST | `/api/applications` | List / create applications |
| GET/PATCH/DELETE | `/api/applications/:id` | Read / update / delete one application |
| POST | `/api/applications/:applicationId/interviews` | Add interview to an application |
| PATCH/DELETE | `/api/interviews/:id` | Update / delete an interview |
| GET | `/api/dashboard` | Dashboard summary |
| GET | `/api/analytics` | Analytics summary |
| GET | `/api/reminders` | Overdue + upcoming reminders |