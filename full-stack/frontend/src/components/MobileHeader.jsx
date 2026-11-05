import { LogOut } from 'lucide-react';
import Brand from './Brand.jsx';
import ConnectivityBadge from './ConnectivityBadge.jsx';

export default function MobileHeader({ onLogout }) {
  return (
    <header className="mobile-header">
      <Brand compact />

      <div className="mobile-header__actions">
        <ConnectivityBadge />
        <button
          type="button"
          className="mobile-logout"
          onClick={onLogout}
          aria-label="Log out"
          title="Log out"
        >
          <LogOut size={17} strokeWidth={1.9} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
