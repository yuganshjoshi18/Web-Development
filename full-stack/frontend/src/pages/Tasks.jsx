import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListTodo, PenLine, RefreshCw, WifiOff } from 'lucide-react';
import AppSidebar from '../components/AppSidebar.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyTasks from '../components/EmptyTasks.jsx';
import MobileHeader from '../components/MobileHeader.jsx';
import TaskCard from '../components/TaskCard.jsx';
import TaskError from '../components/TaskError.jsx';
import TaskForm from '../components/TaskForm.jsx';
import Toast, { useToastState } from '../components/Toast.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useConnectivity } from '../context/ConnectivityContext.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { API_URL, getApiErrorMessage } from '../services/api.js';
import { createTask, deleteTask, fetchTasks } from '../services/taskService.js';

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  }

  if (hour < 18) {
    return 'Good afternoon';
  }

  return 'Good evening';
}

function TaskSkeletons() {
  return (
    <div className="task-grid" aria-hidden="true">
      {[0, 1, 2].map((item) => (
        <div className="skeleton-card" key={item}>
          <span className="skeleton skeleton--pill" />
          <span className="skeleton skeleton--title" />
          <span className="skeleton skeleton--text" />
          <span className="skeleton skeleton--text skeleton--short" />
          <span className="skeleton skeleton--meta" />
        </div>
      ))}
    </div>
  );
}

export default function Tasks() {
  const { user, logout } = useAuth();
  const { status, check } = useConnectivity();
  const navigate = useNavigate();
  const { toast, showToast, dismissToast } = useToastState();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const titleInputRef = useRef(null);
  const composerRef = useRef(null);

  useDocumentTitle('Your tasks · Tandem');

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }).format(new Date()),
    [],
  );

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const nextTasks = await fetchTasks();
      setTasks(nextTasks);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, 'The task list could not be loaded.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAddTask = useCallback(
    async (payload) => {
      const created = await createTask(payload);
      setTasks((current) => [created, ...current]);
      setError('');
      showToast('Task added to your studio.');
      return created;
    },
    [showToast],
  );

  async function confirmDelete() {
    if (!taskToDelete) {
      return;
    }

    setDeleting(true);

    try {
      await deleteTask(taskToDelete.id);
      setTasks((current) => current.filter((task) => task.id !== taskToDelete.id));
      setTaskToDelete(null);
      showToast('Task deleted.');
    } catch (deleteError) {
      showToast(
        getApiErrorMessage(deleteError, 'The task could not be deleted.'),
        'error',
      );
    } finally {
      setDeleting(false);
    }
  }

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  function focusComposer() {
    composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    window.setTimeout(() => {
      titleInputRef.current?.focus({ preventScroll: true });
    }, 260);
  }

  function retryConnection() {
    check();
    loadTasks();
  }

  const listSummary = loading
    ? 'Syncing with the studio…'
    : error
      ? 'The latest tasks could not be fetched.'
      : tasks.length === 0
        ? 'A clear slate.'
        : `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'} in motion`;

  return (
    <>
      <div className="app-shell">
        <AppSidebar user={user} taskCount={tasks.length} onLogout={handleLogout} />

        <div className="main-shell">
          <MobileHeader onLogout={handleLogout} />

          <main className="tasks-main">
            <header className="tasks-header">
              <div>
                <p className="eyebrow">
                  <span className="eyebrow__dot" />
                  {formattedDate} · Studio desk
                </p>
                <h1 className="display tasks-header__title">
                  {getGreeting()}, <em>{firstName}</em>
                </h1>
                <p className="tasks-header__copy">
                  A clear view of what needs doing. Add a task below, then make
                  space for the work that matters.
                </p>
              </div>

              <div className="summary-card">
                <span className="summary-card__icon" aria-hidden="true">
                  <ListTodo size={20} strokeWidth={1.9} />
                </span>
                <span className="summary-card__body">
                  <span className="summary-card__value" data-testid="task-count">
                    {tasks.length}
                  </span>
                  <span className="summary-card__label">Open tasks</span>
                </span>
              </div>
            </header>

            {status === 'disconnected' && (
              <div className="offline-banner" role="status">
                <WifiOff size={18} strokeWidth={1.9} aria-hidden="true" />
                <p>
                  <strong>Backend disconnected.</strong> Start the API at{' '}
                  <code>{API_URL}</code> to add or manage tasks.
                </p>
                <button type="button" className="button button--secondary button--sm" onClick={retryConnection}>
                  <RefreshCw size={14} strokeWidth={2} aria-hidden="true" />
                  Retry
                </button>
              </div>
            )}

            <section className="composer-card" ref={composerRef} aria-labelledby="composer-heading">
              <div className="composer-card__header">
                <span className="composer-card__icon" aria-hidden="true">
                  <PenLine size={17} strokeWidth={1.9} />
                </span>
                <div>
                  <h2 id="composer-heading">Add a task</h2>
                  <p>One clear next step, held in one calm place.</p>
                </div>
              </div>

              <TaskForm
                onAdd={handleAddTask}
                disabled={status === 'disconnected'}
                titleInputRef={titleInputRef}
              />
            </section>

            <section className="task-list-section" aria-labelledby="task-list-heading">
              <div className="task-list__header">
                <div>
                  <h2 id="task-list-heading">Current tasks</h2>
                  <p>{listSummary}</p>
                </div>
                <button
                  type="button"
                  className="refresh-button"
                  onClick={loadTasks}
                  disabled={loading}
                  aria-label="Refresh tasks"
                  title="Refresh tasks"
                >
                  <RefreshCw
                    className={loading ? 'spinner' : undefined}
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </button>
              </div>

              {loading ? (
                <>
                  <p className="sr-only" role="status">
                    Loading tasks…
                  </p>
                  <TaskSkeletons />
                </>
              ) : error ? (
                <TaskError message={error} onRetry={loadTasks} />
              ) : tasks.length === 0 ? (
                <EmptyTasks onAdd={focusComposer} />
              ) : (
                <div className="task-grid">
                  {tasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      index={index}
                      onDelete={setTaskToDelete}
                    />
                  ))}
                </div>
              )}
            </section>

            <footer className="tasks-footer">
              <span>Tandem · React, Express &amp; Axios</span>
              <span>Protected by a mock JWT</span>
            </footer>
          </main>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(taskToDelete)}
        title="Delete this task?"
        description={
          taskToDelete
            ? `“${taskToDelete.title}” will be removed from the studio. This cannot be undone.`
            : ''
        }
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          if (!deleting) {
            setTaskToDelete(null);
          }
        }}
      />

      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          tone={toast.tone}
          onClose={dismissToast}
        />
      )}
    </>
  );
}
