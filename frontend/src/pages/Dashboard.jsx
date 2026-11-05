import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, LogOut, Users } from 'lucide-react';
import AppBackground from '../components/AppBackground.jsx';
import Brand from '../components/Brand.jsx';
import EmptyState from '../components/EmptyState.jsx';
import SearchBar from '../components/SearchBar.jsx';
import StatCard from '../components/StatCard.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import UserCard from '../components/UserCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { users } from '../data/users.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

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

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useDocumentTitle('Team directory · Northwind');

  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const initials = user?.name ? getInitials(user.name) : 'NW';
  const disciplineCount = useMemo(() => new Set(users.map((member) => member.role)).size, []);

  const filteredUsers = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) {
      return users;
    }

    return users.filter(
      (member) =>
        member.name.toLowerCase().includes(term) || member.role.toLowerCase().includes(term),
    );
  }, [query]);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const resultLabel = query.trim()
    ? `${filteredUsers.length} ${filteredUsers.length === 1 ? 'match' : 'matches'} for “${query.trim()}”`
    : 'Everyone in the studio, in one place.';

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="dashboard-page">
      <AppBackground variant="dashboard" />

      <header className="app-header">
        <div className="app-header__inner">
          <Brand />

          <div className="app-header__actions">
            <ThemeToggle />

            <div className="user-chip" title={user?.email}>
              <span className="user-chip__avatar" aria-hidden="true">
                {initials}
              </span>
              <span className="user-chip__copy">
                <strong>{user?.name}</strong>
                <span>{user?.role}</span>
              </span>
            </div>

            <button
              type="button"
              className="button button--ghost button--sm logout-button"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={16} strokeWidth={1.9} aria-hidden="true" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard">
        <section className="dashboard__hero" aria-labelledby="welcome-heading">
          <div className="dashboard__intro">
            <p className="eyebrow">
              <span className="eyebrow__dot" />
              Team directory · {formattedDate}
            </p>
            <h1 id="welcome-heading" className="display">
              {getGreeting()}, <em>{firstName}</em>
            </h1>
            <p className="dashboard__lede">
              Welcome back to the studio. Here is everyone shaping Northwind this
              season — their craft, their roles, and how to reach them.
            </p>
          </div>

          <div className="stats" aria-label="Team statistics">
            <StatCard
              icon={Users}
              value={users.length}
              label="Teammates"
              testId="team-count"
            />
            <StatCard icon={Compass} value={disciplineCount} label="Disciplines" />
          </div>
        </section>

        <section className="directory" aria-labelledby="directory-heading">
          <div className="directory__bar">
            <div className="directory__title">
              <h2 id="directory-heading">People</h2>
              <p>{resultLabel}</p>
            </div>

            <SearchBar value={query} onChange={setQuery} />
          </div>

          <div className="directory__meta" aria-live="polite">
            <span>
              {filteredUsers.length} of {users.length} members
            </span>
            <span className="directory__rule" aria-hidden="true" />
            <span>{getGreeting() === 'Good evening' ? 'Studio lights on' : 'Studio open'}</span>
          </div>

          {filteredUsers.length > 0 ? (
            <div className="user-grid">
              {filteredUsers.map((member, index) => (
                <UserCard key={member.id} user={member} index={index} />
              ))}
            </div>
          ) : (
            <EmptyState query={query.trim()} onClear={() => setQuery('')} />
          )}
        </section>

        <footer className="app-footer">
          <span>Northwind Studio · {users.length} teammates</span>
          <span>© {new Date().getFullYear()} — crafted for quiet, ambitious work</span>
        </footer>
      </main>
    </div>
  );
}
