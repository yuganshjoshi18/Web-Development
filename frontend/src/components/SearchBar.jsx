import { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Search field with a clear action and a "/" keyboard shortcut.
 * Filtering itself stays in the page so the component remains reusable.
 */
export default function SearchBar({ value, onChange, placeholder = 'Search people or roles…' }) {
  const inputRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const target = event.target;
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;

      if (isTyping) {
        return;
      }

      event.preventDefault();
      inputRef.current?.focus();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="search-field" role="search">
      <Search className="search-field__icon" size={18} aria-hidden="true" />
      <label className="sr-only" htmlFor="team-search">
        Search team members by name or role
      </label>
      <input
        ref={inputRef}
        id="team-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck="false"
        enterKeyHint="search"
      />
      {value ? (
        <button
          type="button"
          className="search-field__clear"
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
        >
          <X size={15} aria-hidden="true" />
        </button>
      ) : (
        <kbd aria-hidden="true">/</kbd>
      )}
    </div>
  );
}
