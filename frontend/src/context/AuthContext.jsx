import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest } from '../services/authService.js';

const AuthContext = createContext(null);
const SESSION_KEY = 'northwind.session';
const REMEMBERED_USERNAME_KEY = 'northwind.rememberedUsername';

function readStoredSession() {
  const storages = [window.localStorage, window.sessionStorage];

  for (const storage of storages) {
    try {
      const raw = storage.getItem(SESSION_KEY);

      if (!raw) {
        continue;
      }

      const parsed = JSON.parse(raw);

      if (parsed?.token && parsed?.user) {
        return parsed;
      }

      storage.removeItem(SESSION_KEY);
    } catch {
      try {
        storage.removeItem(SESSION_KEY);
      } catch {
        // Ignore storage access errors.
      }
    }
  }

  return null;
}

function readRememberedUsername() {
  try {
    return localStorage.getItem(REMEMBERED_USERNAME_KEY) ?? '';
  } catch {
    return '';
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const [rememberedUsername, setRememberedUsername] = useState(readRememberedUsername);

  const login = useCallback(async ({ username, password, remember }) => {
    const result = await loginRequest({ username, password });
    const payload = { ...result, remember: Boolean(remember) };

    try {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);

      const target = remember ? localStorage : sessionStorage;
      target.setItem(SESSION_KEY, JSON.stringify(payload));

      if (remember) {
        localStorage.setItem(REMEMBERED_USERNAME_KEY, username.trim());
        setRememberedUsername(username.trim());
      } else {
        localStorage.removeItem(REMEMBERED_USERNAME_KEY);
        setRememberedUsername('');
      }
    } catch {
      // The session still works for this tab if storage is unavailable.
    }

    setSession(payload);
    return payload.user;
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignore storage access errors.
    }

    setSession(null);
  }, []);

  // Keep tabs in sync when a session is created or removed elsewhere.
  useEffect(() => {
    function handleStorage(event) {
      if (event.key === SESSION_KEY) {
        setSession(readStoredSession());
      }
    }

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      remember: Boolean(session?.remember),
      rememberedUsername,
      login,
      logout,
    }),
    [session, rememberedUsername, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }

  return context;
}
