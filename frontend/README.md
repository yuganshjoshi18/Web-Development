# Frontend Developer Assessment — Northwind login & team dashboard

A standalone React 19 + Vite single-page app with a scenic glassmorphism login
and a responsive team directory. It is entirely self-contained: authentication is
mock-only and no backend is required.

Runs on **http://localhost:5173**.

## Features

### Login

- Full-screen `forest-day.jpg` photograph under the glass login card, with a
  subtle theme-aware scrim for readability.
- Username/password with accessible labels, show/hide password and inline errors.
- Real loading state (850 ms simulated request) with a spinner and disabled fields.
- **Remember me** persists the session in `localStorage`; without it the session
  lives in `sessionStorage` and ends when the tab closes.
- Remembers the last username when "Remember me" is used.
- One-click demo credentials (`admin` / `internware`) with a success notice.
- Keyboard-friendly, visible focus rings, and reduced-motion support.
- Theme toggle available before signing in; choice survives reloads.

### Dashboard

- Ten team members with name, role and email, rendered from `src/data/users.js`.
- Live search by name or role, with result counts and an empty state.
- "/" keyboard shortcut focuses the search field.
- Stats for teammate and discipline counts.
- Dark/light theme via React Context + `localStorage` (`northwind.theme`), applied
  before paint to avoid a flash.
- Logout clears both storage locations and returns to `/login`.
- Protected `/dashboard` route remembers the attempted destination.
- Responsive layout from 320 px up; cards reflow without horizontal scrolling.
- Mailto links for every teammate.

## Stack

| Concern | Choice |
|---|---|
| UI | React 19 + JSX |
| Build | Vite 7 |
| Routing | React Router 7 |
| State | React Context (`AuthContext`, `ThemeContext`) |
| Icons | `lucide-react` |
| Fonts | Fontsource — Manrope Variable + Instrument Serif |
| Styling | Hand-written CSS design system in `src/index.css` |

No UI framework or CSS-in-JS dependency is used.

## Project structure

```text
frontend/
├─ public/
│  ├─ favicon.svg
│  └─ images/
│     ├─ forest-night.jpg
│     └─ forest-day.jpg
├─ src/
│  ├─ assets/logo.svg
│  ├─ components/
│  │  ├─ AppBackground.jsx   # login photo + SVG ridges/pines + grain
│  │  ├─ Brand.jsx
│  │  ├─ EmptyState.jsx
│  │  ├─ ProtectedRoute.jsx
│  │  ├─ SearchBar.jsx
│  │  ├─ StatCard.jsx
│  │  ├─ ThemeToggle.jsx
│  │  └─ UserCard.jsx
│  ├─ context/
│  │  ├─ AuthContext.jsx
│  │  └─ ThemeContext.jsx
│  ├─ data/users.js          # 10 fictional teammates
│  ├─ hooks/useDocumentTitle.js
│  ├─ pages/
│  │  ├─ Login.jsx
│  │  └─ Dashboard.jsx
│  ├─ services/authService.js
│  ├─ utils/theme.js
│  ├─ App.jsx
│  ├─ index.css
│  └─ main.jsx
├─ index.html
├─ package.json
└─ vite.config.js
```

## Setup

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

### Demo credentials

| Username | Password |
|---|---|
| `admin` | `internware` |

The credentials are intentionally visible on the login screen.

### Production build

```powershell
npm run build
npm run preview
```

`npm run build` writes to `dist/`; `npm run preview` serves it on
http://localhost:4173 by default.

## Environment variables

This app requires **no environment variables**. The auth service is a local mock,
and all data is bundled. Vite's standard `import.meta.env` is available if you later
connect a real API.

## Routes

| Path | Access | Behaviour |
|---|---|---|
| `/login` | Public | Redirects authenticated users to `/dashboard` |
| `/dashboard` | Protected | Redirects guests to `/login` and remembers the target |
| `/` | Public | Sends users to the correct starting page |
| `*` | Public | Redirects to `/` |

## Authentication model

`src/services/authService.js` resolves after 850 ms and compares the entered
credentials with the exported `DEMO_CREDENTIALS`. On success it returns a token
and user profile. `AuthContext` stores the session and decides between
`localStorage` (remember me) and `sessionStorage` (this tab only). This is a UI
demo, not real security: the token is a timestamped string with no server
validation.

To connect a real backend, replace `services/authService.js` with a `fetch`/Axios
call and leave the context and pages unchanged.

## Theme

- Default: dark.
- Stored under `northwind.theme`.
- Inline script in `index.html` applies the stored theme before React mounts.
- Toggle available on both the login and dashboard screens.
- The login screen uses `forest-day.jpg` in both themes, with a light overlay in
  dark mode and a pale one in light mode. The dashboard uses a calm gradient
  instead of the photo, with the same SVG ridges/pines shifting with the palette.

## Accessibility notes

- Every field has a visible label; icon-only buttons have `aria-label` and `title`.
- Errors use `role="alert"`; loading state uses `aria-busy` and a status region.
- The search input is labelled, has a clear button, and supports the `/` shortcut.
- Focus rings use a high-contrast outline; all interactive targets are at least
  32 px.
- `prefers-reduced-motion` disables entrance and transition animations.
- Theme toggle announces the destination theme ("Switch to light mode").

## Testing

No test runner is configured for this assignment. Verify manually:

1. Sign in with the wrong password → inline error, no navigation.
2. Sign in with the demo account → spinner, then dashboard.
3. Reload → session persists (localStorage if remembered, sessionStorage otherwise).
4. Search `engineer` → two results; search nonsense → empty state with clear action.
5. Press `/` anywhere outside an input → search focuses.
6. Toggle theme, reload → theme persists.
7. Visit `/dashboard` while logged out → redirected to `/login`.
8. Log out → returned to login; protected route no longer accessible.
9. Resize to 360 px → no horizontal scrolling, cards stack.

Production build check:

```powershell
npm run build
```

Expected result: `dist/` is produced successfully (about 288 kB JS / 32 kB CSS
before gzip). An automated Chromium walkthrough of the flows above passed **38
checks with 0 failures** at 1440 px and 360 px widths.

## Image credits

The login screen uses `forest-day.jpg`; the dashboard uses a gradient. Both
photographs were downloaded from the Unsplash CDN and are used here for a
non-commercial assessment demo:

- Day (login background): `photo-1470071459604-3b5ec3a7fe05`
- Night (retained, currently unused): `photo-1519681393784-d120267933ba`

Photography © the respective Unsplash contributors. The SVG ridges, pine
silhouettes, grain and vignette are original CSS/SVG work in this repository.

## Limitations

- Authentication is mock-only; credentials are hardcoded and visible by design.
- Team data is static in `src/data/users.js`; there is no backend or persistence.
- The remembered username is stored unencrypted in `localStorage`.
- No production telemetry or error reporting is configured.
