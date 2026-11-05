# Full Stack Developer Assessment — Tandem task studio

A complete two-tier task application: an Express API with connectivity checking,
mock JWT login and protected task CRUD, plus a React client that verifies the
backend, authenticates, and lets a user add and delete tasks in a polished,
responsive interface.

| Tier | Folder | Local URL |
|---|---|---|
| API | `full-stack/backend/` | http://localhost:5001 |
| Client | `full-stack/frontend/` | http://localhost:5174 |

Demo account: **`admin` / `internware`**

## Features

### API

- `GET /ping` returns `{ "status": "ok" }` for the connectivity indicator.
- `POST /auth/login` mock login against a documented demo account.
- JWT-protected `GET /tasks`, `POST /tasks`, `DELETE /tasks/:id`.
- Validation with structured field errors; malformed JSON returns a JSON `400`.
- Centralised 404/error handling and request logging.
- CORS, environment-driven port and secret, `x-powered-by` disabled.
- In-memory task store seeded with three examples and reset on restart.

### Client

- **Connectivity status** checked on load and rechecked on browser `online`:
  "Checking backend", "Backend connected", "Backend disconnected".
- Prominent offline banner, disabled composer, and retry actions when the API is
  unreachable.
- Split-screen login with a real API call, field validation, error feedback,
  show/hide password and one-click demo credentials.
- Auth Context stores the session and attaches the JWT to every Axios request.
- Protected `/tasks` route; a `401` clears stale auth and returns to login.
- Create and delete tasks with validation, loading states and disabled controls.
- Native `<dialog>` delete confirmation (focus trap and Escape support for free).
- Success/error toasts, skeleton loading, empty state, error state with retry,
  refresh, live task count and greeting.
- Responsive layout: sidebar on desktop, compact sticky header on mobile.
- Accessible labels, focus-visible rings, `aria-live` regions and reduced motion.

## Stack

| Layer | Choice |
|---|---|
| API | Express 5 (ES modules), `jsonwebtoken`, `cors`, `dotenv` |
| Client | React 19 + Vite 7, React Router 7, Axios |
| State | Context providers for auth and connectivity |
| UI | Hand-written CSS, Lucide icons, Fontsource (Manrope + Instrument Serif) |
| Dev | `nodemon`, Vite dev server |

## Project structure

```text
full-stack/
├─ backend/
│  ├─ scripts/smoke-test.mjs
│  ├─ src/
│  │  ├─ controllers/       # auth + task handlers
│  │  ├─ data/              # demo user + in-memory tasks
│  │  ├─ middleware/        # JWT guard, logger, error handler
│  │  ├─ routes/            # /auth, /tasks
│  │  ├─ app.js             # entry point, port 5001
│  │  └─ config.js
│  ├─ .env.example
│  └─ package.json
└─ frontend/
   ├─ public/
   │  ├─ favicon.svg
   │  └─ images/forest.jpg
   ├─ src/
   │  ├─ assets/logo.svg
   │  ├─ components/        # sidebar, composer, cards, dialog, toast, badges…
   │  ├─ context/           # AuthContext, ConnectivityContext
   │  ├─ hooks/
   │  ├─ pages/             # Login, Tasks
   │  ├─ services/          # Axios client, auth, tasks
   │  ├─ utils/storage.js
   │  ├─ App.jsx
   │  ├─ index.css
   │  └─ main.jsx
   ├─ .env.example
   ├─ index.html
   └─ package.json
```

## Setup

Run the API first, then the client.

**Terminal 1 — API**

```powershell
cd full-stack/backend
npm install
Copy-Item .env.example .env   # optional; boots without it
npm start
```

**Terminal 2 — client**

```powershell
cd full-stack/frontend
npm install
Copy-Item .env.example .env   # optional; defaults to http://localhost:5001
npm run dev
```

Open http://localhost:5174 and sign in with `admin` / `internware`.

If you change the API port, set both `PORT` (backend `.env`) and `VITE_API_URL`
(frontend `.env`) to match, then restart both.

## Environment variables

### API (`full-stack/backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5001` | HTTP port |
| `CORS_ORIGIN` | `*` | Allowed origin(s) |
| `JWT_SECRET` | random per process | JWT signing secret |
| `JWT_EXPIRES_IN` | `8h` | Token lifetime |
| `DEMO_USERNAME` | `admin` | Mock login username |
| `DEMO_PASSWORD` | `internware` | Mock login password |

### Client (`full-stack/frontend/.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5001` | API base URL (no trailing slash) |

Vite only exposes variables prefixed with `VITE_`, and they are embedded at build
time — restart the dev server after changing `.env`.

## API reference

Base URL: `http://localhost:5001`

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/ping` | Public | Connectivity check → `{ "status": "ok" }` |
| `GET` | `/` | Public | API index/help |
| `POST` | `/auth/login` | Public | Mock login → JWT + demo user |
| `GET` | `/tasks` | Bearer JWT | List tasks |
| `POST` | `/tasks` | Bearer JWT | Create a task |
| `DELETE` | `/tasks/:id` | Bearer JWT | Delete a task |

### Login

```http
POST /auth/login
Content-Type: application/json

{ "username": "admin", "password": "internware" }
```

```json
{
  "message": "Login successful.",
  "tokenType": "Bearer",
  "expiresIn": "8h",
  "token": "eyJhbGciOi…",
  "user": {
    "id": "usr_demo_001",
    "username": "admin",
    "name": "Alex Morgan",
    "role": "Studio Administrator",
    "email": "admin@northwind.studio"
  }
}
```

Missing fields return `400` with `details`; wrong credentials return `401`
`{ "error": "Invalid username or password." }`.

### Create a task

```json
{ "title": "Write the launch note", "description": "Two short paragraphs." }
```

- `title` required, non-empty, max 120 characters.
- `description` optional string, max 500 characters.
- Returns `201` with the task, or `400` with field details.

### Delete a task

`DELETE /tasks/:id` with the bearer token returns:

```json
{
  "message": "Task deleted successfully.",
  "task": { "id": "…", "title": "Write the launch note" }
}
```

`404` if the id is unknown, `401` without a valid token.

### PowerShell examples

```powershell
# Connectivity
curl.exe http://localhost:5001/ping

# Login, keeping the token
$login = curl.exe -s -X POST http://localhost:5001/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"internware"}' | ConvertFrom-Json

# List
curl.exe http://localhost:5001/tasks -H "Authorization: Bearer $($login.token)"

# Create
curl.exe -X POST http://localhost:5001/tasks `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $($login.token)" `
  -d '{"title":"Review the launch note","description":"Check tone and links."}'
```

### Bash examples

```bash
TOKEN=$(curl -s -X POST http://localhost:5001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"internware"}' | jq -r .token)

curl http://localhost:5001/tasks -H "Authorization: Bearer $TOKEN"
```

## Authentication flow

1. The client checks `/ping` on load and shows the connection badge.
2. Login sends credentials to `/auth/login`; the API returns a JWT.
3. `AuthContext` stores `{ token, user }` under `tandem.session` in
   `localStorage`.
4. The Axios request interceptor adds `Authorization: Bearer <token>` to every
   request.
5. A `401` on an authenticated request dispatches `tandem:unauthorized`; the
   context clears the session and the route guard redirects to `/login`.
6. Logout clears storage and returns to the login screen.

This is mock authentication for the assessment: the user directory is hardcoded,
there is no registration or password hashing, and the token is only trusted by
this API.

## Testing

With the API running:

```powershell
cd full-stack/backend
npm run test:smoke
```

Override the target if needed:

```powershell
$env:API_URL = "http://localhost:5001"
npm run test:smoke
```

The smoke test covers health, login validation, rejected credentials, missing and
invalid tokens, protected reads, task creation/validation, deletion and 404s.
Expected result on a clean start: **22 passed, 0 failed**.

Client build:

```powershell
cd full-stack/frontend
npm run build
npm run preview
```

`preview` serves the production build on http://localhost:4174. The production
build completes successfully (about 351 kB JS / 36 kB CSS before gzip).

An automated Chromium pass through the UI checklist below reported **46 checks,
0 failures** across 1440 px and 390 px viewports, including the offline state.

### Manual UI checklist

1. API stopped → badge shows disconnected, login still renders, offline guidance.
2. API started → badge turns connected; retry works.
3. Wrong password → inline API error, spinner clears.
4. Demo credentials → redirect to `/tasks`; protected route works after refresh.
5. Add a task → appears at the top, toast confirms, count increments.
6. Empty title → inline validation; API errors surface near the button.
7. Delete → confirmation dialog; keep cancels; confirm removes and toasts.
8. Refresh → list reloads from the API.
9. Log out → login; `/tasks` redirects back to login.
10. Stop the API and reload tasks → error state with retry; no crash.
11. 360 px viewport → sidebar replaced by sticky header, no horizontal overflow.

## Image credit

The login landscape is from the Unsplash CDN (`photo-1470071459604-3b5ec3a7fe05`)
and is used for this non-commercial assessment demo. Photography © the respective
Unsplash contributor. All icons are Lucide; fonts are Fontsource packages.

## Limitations

- In-memory data resets when the API restarts.
- Mock login: no registration, password hashing, roles or refresh tokens.
- JWT is stored in `localStorage`, which is acceptable for a demo but should be
  replaced with an httpOnly cookie strategy in production.
- No automated browser tests are committed; the API smoke suite and production
  build are the reproducible checks, with the manual checklist above.
- Single-user task list: tasks are not scoped per account.
