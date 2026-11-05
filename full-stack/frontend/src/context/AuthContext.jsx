import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest } from '../services/authService.js';
import {
  clearStoredSession,
  readStoredSession,
  writeStoredSession,
} from '../utils/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  const login = useCallback(async (credentials) => {
    const response = await loginRequest(credentials);
    const nextSession = { token: response.token, user: response.user };
    writeStoredSession(nextSession);
    setSession(nextSession);
    return response.user;
  }, []);

  const logout = useCallback(() => {
    clearStoredSession();
    setSession(null);
  }, []);

  // The API client fires this event when an authenticated request receives 401.
  useEffect(() => {
    function handleUnauthorized() {
      clearStoredSession();
      setSession(null);
    }

    window.addEventListener('tandem:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('tandem:unauthorized', handleUnauthorized);
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      login,
      logout,
    }),
    [session, login, logout],
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
