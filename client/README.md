# # Client — Job Application Tracker

React + TypeScript + Vite + Tailwind CSS v4 frontend.

## Setup

```bash
npm install
cp .env.example .env
```

## Environment variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:4000/api` |

## Development

```bash
npm run dev
```

Runs at `http://localhost:5173` by default.

## Build

```bash
npm run build
```

Outputs static files to `dist/`. Preview the production build locally with:

```bash
npm run preview
```

## Key libraries

- **React Router** — client-side routing
- **Recharts** — analytics charts
- **@dnd-kit** — Kanban drag-and-drop
- **Sonner** — toast notifications
- **Axios** — HTTP client, with interceptors for JWT attachment and silent token refresh