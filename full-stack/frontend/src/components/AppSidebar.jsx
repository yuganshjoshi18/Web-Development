import { NavLink } from 'react-router-dom';
import { ListTodo, LogOut } from 'lucide-react';
import Brand from './Brand.jsx';
import ConnectivityBadge from './ConnectivityBadge.jsx';
import { API_URL } from '../services/api.js';

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function AppSidebar({ user, taskCount, onLogout }) {
  return (
    <aside className="sidebar">
      <Brand inverted />

      <nav className="sidebar__nav" aria-label="Primary navigation">
        <p className="nav-label">Workspace</p>
        <NavLink
          to="/tasks"
          className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`}
        >
          <ListTodo size={18} strokeWidth={1.9} aria-hidden="true" />
          <span>Tasks</span>
          <span className="nav-count">{taskCount}</span>
        </NavLink>
      </nav>

      <div className="sidebar__spacer" />

      <div className="sidebar__status">
        <p className="sidebar__status-title">Studio status</p>
        <ConnectivityBadge inverted showRetry />
        <p className="sidebar__endpoint" title={API_URL}>
          {API_URL}
        </p>
      </div>

      <div className="sidebar__user">
        <span className="sidebar__avatar" aria-hidden="true">
          {getInitials(user?.name)}
        </span>
        <span className="sidebar__user-copy">
          <strong>{user?.name}</strong>
          <span>{user?.role}</span>
        </span>
        <button
          type="button"
          className="sidebar__logout"
          onClick={onLogout}
          aria-label="Log out"
          title="Log out"
        >
          <LogOut size={16} strokeWidth={1.9} aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
