import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function TaskError({ message, onRetry }) {
  return (
    <div className="task-error" role="alert">
      <span className="task-error__icon">
        <AlertTriangle size={23} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <div className="task-error__body">
        <h3>We couldn’t load your tasks</h3>
        <p>{message}</p>
        <button type="button" className="button button--secondary button--sm" onClick={onRetry}>
          <RefreshCw size={14} strokeWidth={2} aria-hidden="true" />
          Try again
        </button>
      </div>
    </div>
  );
}
