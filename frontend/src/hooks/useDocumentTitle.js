import { useEffect } from 'react';

/**
 * Keeps the document title in sync with the active page.
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    if (!title) {
      return undefined;
    }

    const previous = document.title;
    document.title = title;

    return () => {
      document.title = previous;
    };
  }, [title]);
}
