import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ping } from '../services/api.js';

const ConnectivityContext = createContext(null);

export function ConnectivityProvider({ children }) {
  const [status, setStatus] = useState('checking');
  const [lastChecked, setLastChecked] = useState(null);

  const check = useCallback(async () => {
    setStatus('checking');

    try {
      const response = await ping();
      setStatus(response?.status === 'ok' ? 'connected' : 'disconnected');
    } catch {
      setStatus('disconnected');
    } finally {
      setLastChecked(new Date());
    }
  }, []);

  // Check the backend as soon as the application loads.
  useEffect(() => {
    check();
  }, [check]);

  // Re-check automatically when the browser comes back online.
  useEffect(() => {
    function handleOnline() {
      check();
    }

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [check]);

  const value = useMemo(
    () => ({ status, lastChecked, check }),
    [status, lastChecked, check],
  );

  return (
    <ConnectivityContext.Provider value={value}>{children}</ConnectivityContext.Provider>
  );
}

export function useConnectivity() {
  const context = useContext(ConnectivityContext);

  if (!context) {
    throw new Error('useConnectivity must be used inside a ConnectivityProvider');
  }

  return context;
}
