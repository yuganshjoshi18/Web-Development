export const SESSION_KEY = 'tandem.session';

export function readStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    if (parsed?.token && parsed?.user) {
      return parsed;
    }
  } catch {
    // Fall through and treat the session as missing.
  }

  return null;
}

export function writeStoredSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Storage may be unavailable; the in-memory session still works.
  }
}

export function clearStoredSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore storage access errors.
  }
}
