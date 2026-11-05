# Full-stack developer assessment — three independent applications

This workspace contains the three assessment submissions. Each one is a separate,
independently installable project with its own `package.json`, environment file and
README. Nothing is merged: you can run any project on its own.

| # | Assignment | Folder | Stack | Local URL | Demo sign-in |
|---|---|---|---|---|---|
| 1 | Backend API | [`backend/`](./backend) | Express 5, JWT, bcryptjs | http://localhost:5000 | `admin` / `internware` |
| 2 | React login + dashboard | [`frontend/`](./frontend) | React 19, Vite, React Router | http://localhost:5173 | `admin` / `internware` |
| 3 | Full-stack task app | [`full-stack/`](./full-stack) | React + Express + Axios | http://localhost:5174 | `admin` / `internware` |

The full-stack API runs on **port 5001** so it can run alongside the standalone
backend on **port 5000**.

## Quick start

Open four terminals from this directory.

**1. Standalone backend**

```powershell
cd backend
npm install
npm start
```

Check http://localhost:5000/ → `{ "message": "Server running" }`.

**2. Standalone frontend**

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 and sign in with `admin` / `internware`.

**3. Full-stack API**

```powershell
cd full-stack/backend
npm install
npm start
```

Check http://localhost:5001/ping → `{ "status": "ok" }`.

**4. Full-stack frontend**

```powershell
cd full-stack/frontend
npm install
npm run dev
```

Open http://localhost:5174 and sign in with `admin` / `internware`.

> The standalone frontend is fully self-contained and does **not** need the
> standalone backend. The full-stack frontend **does** need the full-stack API on
> port 5001.

## Repository layout

```text
Web Development/
├─ backend/                  # Assignment 1 — Express REST API
│  ├─ scripts/smoke-test.mjs
│  └─ src/
│     ├─ controllers/        # auth + task controllers
│     ├─ data/               # in-memory users and tasks
│     ├─ middleware/         # auth, logging, error handling
│     ├─ routes/             # /signup, /login, /tasks
│     ├─ utils/
│     ├─ app.js
│     └─ config.js
├─ frontend/                 # Assignment 2 — login and team dashboard
│  ├─ public/
│  └─ src/
│     ├─ components/
│     ├─ context/            # Auth + Theme providers
│     ├─ data/               # 10 team members
│     ├─ pages/              # Login, Dashboard
│     ├─ services/           # mock authentication
│     └─ utils/
├─ full-stack/               # Assignment 3 — task studio
│  ├─ backend/               # Express API on :5001
│  └─ frontend/              # React client on :5174
└─ .gitignore
```

## Environment variables

Both APIs use `dotenv` and ship with `.env.example` files:

| File | Purpose |
|---|---|
| `backend/.env.example` | Port, CORS, JWT secret/expiry, bcrypt rounds, demo token |
| `full-stack/backend/.env.example` | Port, CORS, JWT secret/expiry, mock credentials |
| `full-stack/frontend/.env.example` | `VITE_API_URL` (defaults to `http://localhost:5001`) |

Copy an example to `.env` when you want persistent values:

```powershell
cd backend
Copy-Item .env.example .env
```

Both servers start without a `.env`; if `JWT_SECRET` is missing they generate a
random process-local secret and print a warning. Tokens stop working after a
restart in that mode, so set a real secret for longer sessions.

## Automated checks

Each backend ships a dependency-free smoke test (Node's native `fetch`). Start the
matching API first, then in another terminal:

```powershell
cd backend
npm run test:smoke

cd full-stack/backend
npm run test:smoke
```

The scripts cover the health routes, validation, authentication failures, JWT
login, demo-token access, CRUD operations and 404 handling. They exit with code 1
if any assertion fails.

Verified locally on Node 24.7.0:

| Check | Result |
|---|---|
| `backend` → `npm run test:smoke` | **33 passed, 0 failed** |
| `full-stack/backend` → `npm run test:smoke` | **22 passed, 0 failed** |
| `frontend` → `npm run build` | **built successfully** |
| `full-stack/frontend` → `npm run build` | **built successfully** |
| Browser walkthrough (Chromium, 1440 px / 390 px / 360 px) | **84 checks, 0 failed** |

The browser walkthrough covered login success/failure, remember-me storage, theme
persistence, search, protected redirects, logout, task create/delete with dialog
and toasts, offline handling, image loading, console errors and horizontal
overflow. The script is a local verification aid rather than a committed test
suite.

Production builds for both frontends:

```powershell
cd frontend; npm run build
cd full-stack/frontend; npm run build
```

## Design and engineering notes

- **No database.** Both APIs use in-memory stores, as allowed by the briefs; data
  resets when the process restarts. The stores live in `src/data/` so they can be
  replaced by a real database without touching the controllers.
- **Authentication.** The standalone backend hashes passwords with bcrypt and
  issues JWTs; writes also accept the documented demo token for quick review. The
  full-stack API uses a deliberately mock account and protects every task route.
- **Input handling.** Both APIs validate payloads, return structured `details`
  arrays, reject malformed JSON, and centralise errors so clients always receive
  JSON. Request duration and status are logged for every call.
- **Frontends.** React 19 + Vite, React Router, Context for auth/theme/connectivity,
  Lucide icons, Manrope and Instrument Serif via Fontsource. Both layouts are
  responsive down to 320 px and include visible focus states, labels and
  reduced-motion support.
- **Images.** Landscape photography comes from Unsplash (see each frontend README).
  Both are demo projects; all data is fictional.

## Limitations

- Data is not persisted and resets on restart.
- Authentication is intentionally mock/demo in the frontends; this is not a
  production auth system.
- No automated browser test suite is committed; backend smoke tests and production
  builds are the reproducible checks. The interfaces were also exercised manually
  in Chromium.
- The apps are designed to run locally over HTTP. For deployment you would add a
  database, HTTPS, stricter CORS origins and a managed secret store.
