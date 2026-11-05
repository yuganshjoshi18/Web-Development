import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  UserRound,
  WifiOff,
} from 'lucide-react';
import Brand from '../components/Brand.jsx';
import ConnectivityBadge from '../components/ConnectivityBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useConnectivity } from '../context/ConnectivityContext.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { API_URL, getApiErrorMessage } from '../services/api.js';

const DEMO_CREDENTIALS = Object.freeze({
  username: 'admin',
  password: 'internware',
});

export default function Login() {
  const { login } = useAuth();
  const { status, check } = useConnectivity();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useDocumentTitle('Sign in · Tandem');

  const redirectTo = location.state?.from?.pathname || '/tasks';

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError('');

    if (!username.trim() || !password) {
      setError('Enter both your username and password to continue.');
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ username: username.trim(), password });
      check();
      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      setError(getApiErrorMessage(loginError, 'Unable to sign in. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  function fillDemoCredentials() {
    setUsername(DEMO_CREDENTIALS.username);
    setPassword(DEMO_CREDENTIALS.password);
    setError('');
  }

  return (
    <div className="auth-page">
      <aside className="auth-visual">
        <Brand inverted />

        <div className="auth-visual__content">
          <p className="eyebrow eyebrow--light">
            <span className="eyebrow__dot" />
            The studio desk
          </p>
          <blockquote className="auth-quote display">
            Make room for the work that <em>matters</em>.
          </blockquote>
          <p className="auth-visual__support">
            Tandem keeps the day’s tasks in one calm, shared place — so the next
            step is always the obvious one.
          </p>
        </div>

        <div className="auth-visual__footer">
          <span>Tandem — tasks, together</span>
          <span>Est. 2026</span>
        </div>
      </aside>

      <main className="auth-panel">
        <div className="auth-panel__top">
          <div className="auth-panel__brand">
            <Brand />
          </div>
          <ConnectivityBadge showRetry />
        </div>

        <div className="auth-panel__body">
          <div className="auth-form">
            <p className="eyebrow">
              <span className="eyebrow__dot" />
              Welcome back
            </p>
            <h1 className="display auth-form__title">
              Sign in to <em>Tandem</em>
            </h1>
            <p className="auth-form__sub">
              A clear view of the day’s tasks, served by a live Express API. Use
              the demo account to step inside.
            </p>

            <div className="demo-box">
              <span className="demo-box__icon" aria-hidden="true">
                <KeyRound size={17} strokeWidth={1.9} />
              </span>
              <span className="demo-box__copy">
                <strong>Demo account</strong>
                <span>
                  <code>{DEMO_CREDENTIALS.username}</code>
                  <span aria-hidden="true"> · </span>
                  <code>{DEMO_CREDENTIALS.password}</code>
                </span>
              </span>
              <button
                type="button"
                className="demo-box__action"
                onClick={fillDemoCredentials}
                disabled={isSubmitting}
              >
                Use credentials
              </button>
            </div>

            {status === 'disconnected' && (
              <div className="inline-alert inline-alert--warning" role="status">
                <WifiOff size={17} strokeWidth={1.9} aria-hidden="true" />
                <span className="inline-alert__copy">
                  <strong>Backend offline</strong>
                  <span>Start the API at {API_URL}, then retry the connection.</span>
                </span>
                <button type="button" className="inline-alert__action" onClick={check}>
                  <RefreshCw size={13} strokeWidth={2.1} aria-hidden="true" />
                  Retry
                </button>
              </div>
            )}

            <form
              className="auth-form__fields"
              onSubmit={handleSubmit}
              noValidate
              aria-busy={isSubmitting}
            >
              <div className="field">
                <label className="field__label" htmlFor="login-username">
                  Username
                </label>
                <div className="field__control">
                  <UserRound
                    className="field__icon"
                    size={17}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <input
                    id="login-username"
                    className="input input--icon"
                    type="text"
                    name="username"
                    value={username}
                    onChange={(event) => {
                      setUsername(event.target.value);
                      setError('');
                    }}
                    placeholder="Enter your username"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck="false"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? 'login-error' : undefined}
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="login-password">
                  Password
                </label>
                <div className="field__control">
                  <LockKeyhole
                    className="field__icon"
                    size={17}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <input
                    id="login-password"
                    className="input input--icon input--password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError('');
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? 'login-error' : undefined}
                  />
                  <button
                    type="button"
                    className="field__action"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff size={17} strokeWidth={1.8} aria-hidden="true" />
                    ) : (
                      <Eye size={17} strokeWidth={1.8} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div id="login-error" className="inline-alert inline-alert--error" role="alert">
                  <AlertCircle size={17} strokeWidth={1.9} aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="button button--primary auth-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="spinner" size={17} aria-hidden="true" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <p className="auth-note">
              <ShieldCheck size={14} strokeWidth={1.9} aria-hidden="true" />
              Mock authentication. The demo token is stored in this browser and
              sent to the protected task routes.
            </p>
          </div>
        </div>

        <footer className="auth-panel__footer">
          <span>© 2026 Tandem</span>
          <span>API · {API_URL}</span>
        </footer>
      </main>
    </div>
  );
}
