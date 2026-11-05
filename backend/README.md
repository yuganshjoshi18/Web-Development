# Backend Developer Assessment — Express Task API

A standalone Express 5 REST API with task CRUD, validation, request logging,
bcrypt-backed signup/login and JWT authentication. It also accepts a documented
demo token on protected routes for quick reviewer access.

Runs on **http://localhost:5000**.

## Features

- `GET /` returns exactly `{ "message": "Server running" }`.
- Full task CRUD: list, create, update and delete.
- Bonus `GET /tasks/done` returns completed tasks.
- Payload validation with structured, per-field error details.
- Malformed JSON is rejected with a helpful `400` response.
- Request logging with method, URL, status code and duration.
- Centralised 404 and error handling; every response is JSON.
- `POST /signup` hashes passwords with bcrypt (10 rounds by default).
- `POST /login` verifies the hash and returns a signed JWT.
- Protected writes accept a valid JWT **or** the hardcoded demo token.
- Demo account seeded on boot: **`admin` / `internware`**.
- CORS, `x-powered-by` disabled, environment-based configuration.

## Stack

| Concern | Choice |
|---|---|
| Runtime | Node.js 18+ (tested on Node 24) |
| Framework | Express 5 (ES modules) |
| Auth | `jsonwebtoken`, `bcryptjs` |
| Config | `dotenv` |
| CORS | `cors` |
| Dev reload | `nodemon` |

## Project structure

```text
backend/
├─ scripts/
│  └─ smoke-test.mjs         # 30+ endpoint assertions
├─ src/
│  ├─ controllers/
│  │  ├─ authController.js   # signup + login
│  │  └─ taskController.js   # task CRUD + /done
│  ├─ data/
│  │  ├─ users.js            # in-memory users, seeded admin
│  │  └─ tasks.js            # in-memory tasks, seeded examples
│  ├─ middleware/
│  │  ├─ authMiddleware.js   # JWT / demo-token guard
│  │  ├─ errorHandler.js     # 404 + central error handler
│  │  └─ logger.js           # request timing logger
│  ├─ routes/
│  │  ├─ authRoutes.js
│  │  └─ taskRoutes.js
│  ├─ utils/asyncHandler.js
│  ├─ app.js                 # entry point and wiring
│  └─ config.js              # env-based configuration
├─ .env.example
└─ package.json
```

## Setup

```powershell
cd backend
npm install
Copy-Item .env.example .env   # optional; the server boots without it
npm start
```

Development mode with automatic restarts:

```powershell
npm run dev
```

If port `5000` is busy, set `PORT` in `.env` and update `API_URL` when running the
smoke test.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | HTTP port |
| `CORS_ORIGIN` | `*` | Allowed origin(s) |
| `JWT_SECRET` | random per process | JWT signing secret; set this for stable tokens |
| `JWT_EXPIRES_IN` | `2h` | JWT lifetime |
| `BCRYPT_ROUNDS` | `10` | Password hashing cost |
| `DEMO_TOKEN` | `demo-token-internware-2026` | Bearer token accepted on protected writes |

Generate a strong secret:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Without `JWT_SECRET`, the server prints a warning and uses a random secret that
changes on restart, invalidating previously issued JWTs.

## API reference

Base URL: `http://localhost:5000`

### `GET /`

```json
{ "message": "Server running" }
```

### `GET /tasks` — public

Returns the full task array.

```json
[
  {
    "id": "5f0c…",
    "title": "Review the API specification",
    "description": "Walk through the endpoint contract and flag any missing edge cases.",
    "completed": true,
    "createdAt": "2026-10-27T09:15:00.000Z"
  }
]
```

### `GET /tasks/done` — public (bonus)

Returns only tasks where `completed === true`.

### `POST /tasks` — protected

Request:

```json
{
  "title": "Ship the release notes",
  "description": "Cover the new endpoints.",
  "completed": false
}
```

- `title` required, non-empty, max 120 characters.
- `description` optional string, max 1000 characters.
- `completed` optional boolean.

Responses: `201` with the created task, `400` for validation errors, `401` without
valid credentials.

### `PUT /tasks/:id` — protected

Partial update. Supply one or more of `title`, `description`, `completed`.
Unknown and immutable fields are ignored.

- `200` with the updated task.
- `400` if no updatable field is supplied or validation fails.
- `404` if the id does not exist.

### `DELETE /tasks/:id` — protected

Returns the deleted task:

```json
{
  "message": "Task deleted successfully.",
  "task": { "id": "5f0c…", "title": "Ship the release notes" }
}
```

- `404` if the id does not exist.

### `POST /signup` — public

```json
{
  "username": "jordan",
  "password": "secret123",
  "fullname": "Jordan Lee"
}
```

- Username: 3–32 characters, letters/numbers/dots/dashes/underscores.
- Password: 6–72 characters.
- Full name: required, max 80 characters.
- Returns `201` with the public user (never the hash) or `409` if taken.

### `POST /login` — public

```json
{ "username": "admin", "password": "internware" }
```

Response:

```json
{
  "message": "Login successful.",
  "tokenType": "Bearer",
  "expiresIn": "2h",
  "token": "eyJhbGciOi…",
  "user": {
    "id": "…",
    "username": "admin",
    "fullname": "Alex Morgan",
    "createdAt": "2026-10-20T10:00:00.000Z"
  }
}
```

Wrong credentials return the same `401` message whether the username exists or
not, so account names are not revealed.

## Quick examples

```powershell
# Health
curl.exe http://localhost:5000/

# Public reads
curl.exe http://localhost:5000/tasks
curl.exe http://localhost:5000/tasks/done

# Create with the demo token
curl.exe -X POST http://localhost:5000/tasks `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer demo-token-internware-2026" `
  -d '{"title":"Review the PR","description":"Check validation paths"}'

# Login and use the JWT
$login = curl.exe -s -X POST http://localhost:5000/login `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"internware"}' | ConvertFrom-Json

curl.exe -X DELETE "http://localhost:5000/tasks/<id>" `
  -H "Authorization: Bearer $($login.token)"
```

In bash/zsh the equivalent is:

```bash
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-token-internware-2026" \
  -d '{"title":"Review the PR"}'
```

## Testing

With the server running:

```powershell
npm run test:smoke
```

Optional overrides:

```powershell
$env:API_URL = "http://localhost:5000"
$env:DEMO_TOKEN = "demo-token-internware-2026"
npm run test:smoke
```

The suite covers:

- root message and 404 JSON handling
- public task list and `/tasks/done`
- missing, malformed and invalid credentials
- demo-token and JWT access
- create/validate/update/delete lifecycle
- invalid JSON and unknown routes

Expected result on a clean start: **33 passed, 0 failed**.

## Design notes

- Controllers are separated from routing and data access.
- `asyncHandler` forwards rejected promises to Express 5's error handler.
- `config.js` freezes configuration and never ships a hardcoded JWT secret.
- The seeded admin password is hashed at boot, never stored in plaintext.
- The in-memory array is intentionally simple; swapping in a database only
  requires replacing `src/data/*.js` behind the same controller interface.

## Limitations

- In-memory storage resets on every restart.
- The demo token is a convenience for assessment review, not a security pattern.
- No rate limiting, refresh tokens or account lockout; JWT is accepted until expiry.
- The demo account's password is documented and therefore not secret.
