import { ClipboardCheck, Plus } from 'lucide-react';

export default function EmptyTasks({ onAdd }) {
  return (
    <div className="empty-tasks" role="status">
      <span className="empty-tasks__icon">
        <ClipboardCheck size={26} strokeWidth={1.7} aria-hidden="true" />
      </span>
      <h3>A quiet slate</h3>
      <p>
        Nothing on the list yet. Add the first thing that would make today feel
        lighter.
      </p>
      <button type="button" className="button button--primary button--inline" onClick={onAdd}>
        <Plus size={16} strokeWidth={2.2} aria-hidden="true" />
        Add your first task
      </button>
    </div>
  );
}
