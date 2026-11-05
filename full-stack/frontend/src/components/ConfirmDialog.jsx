import { useEffect, useRef } from 'react';
import { AlertTriangle, LoaderCircle, Trash2 } from 'lucide-react';

/**
 * Native <dialog> keeps focus trapping and the Escape key accessible without a
 * third-party modal dependency.
 */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete task',
  busy = false,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function handleCancel(event) {
    event.preventDefault();

    if (!busy) {
      onCancel();
    }
  }

  function handleBackdropClick(event) {
    if (event.target === dialogRef.current && !busy) {
      onCancel();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby="confirm-dialog-title"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      onClose={() => {
        if (open && !busy) {
          onCancel();
        }
      }}
    >
      <div className="confirm-dialog__icon">
        <AlertTriangle size={22} strokeWidth={1.8} aria-hidden="true" />
      </div>
      <h2 id="confirm-dialog-title">{title}</h2>
      <p>{description}</p>

      <div className="confirm-dialog__actions">
        <button
          type="button"
          className="button button--secondary"
          onClick={onCancel}
          disabled={busy}
        >
          Keep task
        </button>
        <button
          type="button"
          className="button button--danger"
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? (
            <>
              <LoaderCircle className="spinner" size={16} aria-hidden="true" />
              Deleting…
            </>
          ) : (
            <>
              <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
              {confirmLabel}
            </>
          )}
        </button>
      </div>
    </dialog>
  );
}
