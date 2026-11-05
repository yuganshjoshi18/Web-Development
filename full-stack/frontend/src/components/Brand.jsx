import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function Brand({ inverted = false, compact = false }) {
  return (
    <Link
      to="/"
      className={`brand${inverted ? ' brand--inverted' : ''}`}
      aria-label="Tandem — task studio home"
    >
      <img className="brand__mark" src={logo} width="40" height="40" alt="" />
      <span className="brand__copy">
        <span className="brand__name">Tandem</span>
        {!compact && <span className="brand__tagline">Task studio</span>}
      </span>
    </Link>
  );
}
