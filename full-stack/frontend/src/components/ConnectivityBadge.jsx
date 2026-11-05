import { LoaderCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useConnectivity } from '../context/ConnectivityContext.jsx';
import { API_URL } from '../services/api.js';

const LABELS = {
  checking: 'Checking backend',
  connected: 'Backend connected',
  disconnected: 'Backend disconnected',
};

export default function ConnectivityBadge({ inverted = false, showRetry = false }) {
  const { status, check } = useConnectivity();

  const Icon =
    status === 'connected' ? Wifi : status === 'disconnected' ? WifiOff : LoaderCircle;

  return (
    <div
      className={`connectivity connectivity--${status}${inverted ? ' connectivity--inverted' : ''}`}
      role="status"
      aria-live="polite"
      title={`Backend API: ${API_URL}`}
    >
      <Icon
        size={14}
        strokeWidth={2}
        className={status === 'checking' ? 'spinner' : undefined}
        aria-hidden="true"
      />
      <span>{LABELS[status]}</span>

      {showRetry && status === 'disconnected' && (
        <button
          type="button"
          className="connectivity__retry"
          onClick={check}
          aria-label="Retry backend connection"
          title="Retry connection"
        >
          <RefreshCw size={12} strokeWidth={2.2} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
