import { useState } from 'react';
import { AlertCircle, LoaderCircle, Plus } from 'lucide-react';
import { getApiErrorMessage } from '../services/api.js';

const TITLE_LIMIT = 120;
const DESCRIPTION_LIMIT = 500;

/**
 * Controlled composer. The page owns the API call and list state; this
 * component owns field state, validation and the submit lifecycle.
 */
export default function TaskForm({ onAdd, disabled = false, titleInputRef }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (disabled || isSubmitting) {
      return;
    }

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setError('Give your task a short title so it has a name.');
      titleInputRef?.current?.focus();
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onAdd({
        title: cleanTitle,
        description: description.trim(),
      });
      setTitle('');
      setDescription('');
      titleInputRef?.current?.focus();
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, 'The task could not be created.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
      <div className="task-form__grid">
        <div className="field">
          <div className="field__head">
            <label className="field__label" htmlFor="task-title">
              Task title <span aria-hidden="true">*</span>
            </label>
            <span className="field__count">
              {title.length}/{TITLE_LIMIT}
            </span>
          </div>
          <input
            ref={titleInputRef}
            id="task-title"
            className="input"
            type="text"
            name="title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setError('');
            }}
            placeholder="e.g. Review the release notes"
            maxLength={TITLE_LIMIT}
            autoComplete="off"
            disabled={isSubmitting}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'task-form-error' : undefined}
          />
        </div>

        <div className="field">
          <div className="field__head">
            <label className="field__label" htmlFor="task-description">
              Description <span className="field__optional">optional</span>
            </label>
            <span className="field__count">
              {description.length}/{DESCRIPTION_LIMIT}
            </span>
          </div>
          <textarea
            id="task-description"
            className="input textarea"
            name="description"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add a little context, a next step, or a definition of done."
            maxLength={DESCRIPTION_LIMIT}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {error && (
        <div id="task-form-error" className="inline-alert inline-alert--error" role="alert">
          <AlertCircle size={16} strokeWidth={1.9} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <div className="task-form__footer">
        <p className={`form-hint${disabled ? ' form-hint--warning' : ''}`}>
          {disabled
            ? 'The backend is offline. Reconnect before adding a task.'
            : 'Saved to the Express API. Visible after a refresh.'}
        </p>

        <button
          type="submit"
          className="button button--primary"
          disabled={isSubmitting || disabled}
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="spinner" size={17} aria-hidden="true" />
              Adding task…
            </>
          ) : (
            <>
              <Plus size={17} strokeWidth={2.2} aria-hidden="true" />
              Add task
            </>
          )}
        </button>
      </div>
    </form>
  );
}
