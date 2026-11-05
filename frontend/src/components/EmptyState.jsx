import { SearchX } from 'lucide-react';

export default function EmptyState({ query, onClear }) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-state__icon">
        <SearchX size={25} strokeWidth={1.7} aria-hidden="true" />
      </span>
      <h3>No one found</h3>
      <p>
        Nothing in the directory matches “{query}”. Try a different name or
        role, or clear the search to see the whole team.
      </p>
      <button type="button" className="button button--secondary" onClick={onClear}>
        Clear search
      </button>
    </div>
  );
}
