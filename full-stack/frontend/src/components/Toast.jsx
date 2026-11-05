import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function Toast({ message, tone = 'success', onClose }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 4200);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`toast toast--${tone}`}
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      {tone === 'error' ? (
        <AlertCircle size={18} strokeWidth={1.9} aria-hidden="true" />
      ) : (
        <CheckCircle2 size={18} strokeWidth={1.9} aria-hidden="true" />
      )}
      <p>{message}</p>
      <button type="button" className="toast__close" onClick={onClose} aria-label="Dismiss notification">
        <X size={15} aria-hidden="true" />
      </button>
    </div>
  );
}

/**
 * Tiny helper so callers can generate a stable key for each toast.
 */
export function useToastState() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, tone = 'success') => {
    setToast({ message, tone, id: `${Date.now()}-${Math.random()}` });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  return { toast, showToast, dismissToast };
}
