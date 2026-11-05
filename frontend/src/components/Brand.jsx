import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

/**
 * The Northwind lock-up. Used on the login screen and in the dashboard header.
 */
export default function Brand({ showSubtitle = true }) {
  return (
    <Link to="/" className="brand" aria-label="Northwind workspace home">
      <span className="brand__mark">
        <img src={logo} alt="" width="42" height="42" />
      </span>
      <span className="brand__text">
        <span className="brand__name">Northwind</span>
        {showSubtitle && <span className="brand__sub">Studio workspace</span>}
      </span>
    </Link>
  );
}
