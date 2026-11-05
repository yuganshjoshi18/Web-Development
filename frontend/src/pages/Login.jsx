import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Check,
  Eye,
  EyeOff,
  Info,
  LoaderCircle,
  LockKeyhole,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';
import AppBackground from '../components/AppBackground.jsx';
import Brand from '../components/Brand.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { DEMO_CREDENTIALS } from '../services/authService.js';

export default function Login() {
  const { login, rememberedUsername } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState(rememberedUsername ?? '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(Boolean(rememberedUsername));
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useDocumentTitle('Sign in · Northwind');

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timer = window.setTimeout(() => setNotice(''), 5200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const redirectTo = location.state?.from?.pathname || '/dashboard';

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError('');
    setNotice('');

    if (!username.trim() || !password) {
      setError('Enter your username and password to continue.');
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ username, password, remember });
      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : 'Unable to sign in right now. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function fillDemoCredentials() {
    setUsername(DEMO_CREDENTIALS.username);
    setPassword(DEMO_CREDENTIALS.password);
    setError('');
    setNotice('Demo credentials filled in. Select “Sign in” to continue.');
  }

  return (
    <div className="login-page">
      <AppBackground variant="login" />

      <header className="page-header">
        <Brand />
        <ThemeToggle />
      </header>

      <main className="login-main">
        <div className="login-card-wrap">
          <section className="login-card" aria-labelledby="login-heading">
            <div className="login-card__intro">
              <p className="eyebrow">
                <span className="eyebrow__dot" />
                Member access
              </p>
              <h1 id="login-heading" className="display login-title">
                Welcome <em>back</em>
              </h1>
              <p className="login-subtitle">
                Sign in to the Northwind studio workspace and pick up where you
                left off.
              </p>
            </div>

            <button
              type="button"
              className="demo-access"
              onClick={fillDemoCredentials}
              disabled={isSubmitting}
              aria-label={`Autofill demo credentials: username ${DEMO_CREDENTIALS.username}, password ${DEMO_CREDENTIALS.password}`}
            >
              <Sparkles size={16} strokeWidth={1.9} aria-hidden="true" />
              <span className="demo-access__copy">
                <strong>Demo access</strong>
                <span>
                  <code>{DEMO_CREDENTIALS.username}</code> ·{' '}
                  <code>{DEMO_CREDENTIALS.password}</code>
                </span>
              </span>
              <span className="demo-access__action">
                Autofill <ArrowUpRight size={14} aria-hidden="true" />
              </span>
            </button>

            <form
              className="login-form"
              onSubmit={handleSubmit}
              noValidate
              aria-busy={isSubmitting}
            >
              <div className="form-field">
                <label className="field-label" htmlFor="login-username">
                  Username
                </label>
                <div className="field-control">
                  <UserRound
                    className="field-icon"
                    size={18}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <input
                    id="login-username"
                    className="text-input"
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

              <div className="form-field">
                <label className="field-label" htmlFor="login-password">
                  Password
                </label>
                <div className="field-control">
                  <LockKeyhole
                    className="field-icon"
                    size={18}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <input
                    id="login-password"
                    className="text-input text-input--password"
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
                    className="field-action"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff size={18} strokeWidth={1.8} aria-hidden="true" />
                    ) : (
                      <Eye size={18} strokeWidth={1.8} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <div className="login-options">
                <label className="check">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    disabled={isSubmitting}
                  />
                  <span className="check__box" aria-hidden="true">
                    {remember && <Check size={13} strokeWidth={3} />}
                  </span>
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="text-link"
                  onClick={() =>
                    setNotice(
                      'Password reset is not enabled in this demo. Use the demo credentials above to explore the workspace.',
                    )
                  }
                  disabled={isSubmitting}
                >
                  Forgot password?
                </button>
              </div>

              {error && (
                <div id="login-error" className="form-alert" role="alert">
                  <AlertCircle size={17} strokeWidth={1.9} aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="button button--primary login-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="spinner" size={18} aria-hidden="true" />
                    Signing you in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <p className="login-switch">
              New to Northwind?{' '}
              <button
                type="button"
                className="text-link"
                onClick={() =>
                  setNotice(
                    'Registration is closed in this demo. Choose “Demo access” above to sign in with the sample account.',
                  )
                }
              >
                Create an account
              </button>
            </p>
          </section>

          <p className="login-footnote">
            <span>Private demo workspace</span>
            <span className="dot" aria-hidden="true" />
            <span>Nothing leaves your browser</span>
          </p>
        </div>
      </main>

      <footer className="page-footer">
        <span>© 2026 Northwind Studio</span>
        <span>Wilderness-inspired workspaces</span>
      </footer>

      {notice && (
        <div className="toast" role="status" aria-live="polite">
          <Info size={17} strokeWidth={1.9} aria-hidden="true" />
          <p>{notice}</p>
          <button
            type="button"
            className="toast__close"
            onClick={() => setNotice('')}
            aria-label="Dismiss message"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
