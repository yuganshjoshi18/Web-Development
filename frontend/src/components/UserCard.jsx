import {
  BarChart3,
  ClipboardList,
  Cloud,
  Code2,
  Mail,
  Palette,
  PenTool,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

const ROLE_ICONS = {
  'Product Designer': PenTool,
  'Frontend Engineer': Code2,
  'Backend Engineer': Server,
  'Engineering Manager': Users,
  'UX Researcher': Search,
  'Data Analyst': BarChart3,
  'DevOps Engineer': Cloud,
  'Brand Strategist': Palette,
  'Product Manager': ClipboardList,
  'QA Engineer': ShieldCheck,
};

const AVATAR_PALETTES = [
  ['#426353', '#263F33'],
  ['#5E4A36', '#3B2C20'],
  ['#414E64', '#273243'],
  ['#5C4558', '#382A36'],
  ['#5B5534', '#39351F'],
  ['#365D5A', '#203B39'],
];

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function UserCard({ user, index }) {
  const RoleIcon = ROLE_ICONS[user.role] ?? Sparkles;
  const palette = AVATAR_PALETTES[index % AVATAR_PALETTES.length];

  return (
    <article
      className="user-card"
      style={{
        '--i': index,
        '--avatar-a': palette[0],
        '--avatar-b': palette[1],
      }}
      data-testid="user-card"
    >
      <div className="user-card__top">
        <span className="avatar" aria-hidden="true">
          {getInitials(user.name)}
        </span>
        <span className="role-pill">
          <RoleIcon size={12} strokeWidth={1.9} aria-hidden="true" />
          {user.role}
        </span>
      </div>

      <h3>{user.name}</h3>

      <a className="user-card__email" href={`mailto:${user.email}`}>
        <Mail size={15} strokeWidth={1.8} aria-hidden="true" />
        <span>{user.email}</span>
      </a>
    </article>
  );
}
