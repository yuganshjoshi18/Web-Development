import { CalendarDays, Trash2 } from 'lucide-react';

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

function formatCreatedAt(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'just now';
  }

  return DATE_FORMAT.format(date);
}

export default function TaskCard({ task, index, onDelete }) {
  return (
    <article
      className="task-card"
      style={{ '--i': index }}
      data-testid="task-card"
    >
      <div className="task-card__top">
        <span className="status-pill">
          <span className="status-dot" aria-hidden="true" />
          Open
        </span>

        <button
          type="button"
          className="delete-button"
          onClick={() => onDelete(task)}
          aria-label={`Delete task: ${task.title}`}
          title="Delete task"
        >
          <Trash2 size={15} strokeWidth={1.9} aria-hidden="true" />
        </button>
      </div>

      <h3>{task.title}</h3>

      <p
        className={`task-card__description${
          task.description ? '' : ' task-card__description--empty'
        }`}
      >
        {task.description || 'No description added.'}
      </p>

      <div className="task-card__meta">
        <CalendarDays size={13} strokeWidth={1.8} aria-hidden="true" />
        <span>Added {formatCreatedAt(task.createdAt)}</span>
        <span className="task-card__meta-dot" aria-hidden="true" />
        <span>#{String(task.id).slice(0, 6)}</span>
      </div>
    </article>
  );
}
