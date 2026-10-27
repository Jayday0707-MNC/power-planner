import { NavLink } from 'react-router-dom';

function Icon({ children }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const tabs = [
  {
    to: '/',
    label: 'Today',
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </Icon>
    ),
  },
  {
    to: '/backup',
    label: 'Backup',
    icon: (
      <Icon>
        <rect x="2" y="7" width="17" height="10" rx="2" />
        <path d="M22 11v2M6 10v4M10 10v4" />
      </Icon>
    ),
  },
  {
    to: '/costs',
    label: 'Costs',
    icon: (
      <Icon>
        <path d="M3 7a2 2 0 0 1 2-2h13v4" />
        <path d="M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z" />
        <circle cx="16" cy="14.5" r="1" />
      </Icon>
    ),
  },
];

export default function TabBar() {
  return (
    <nav className="tabbar" aria-label="Main">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end
          className={({ isActive }) => `tab${isActive ? ' active' : ''}`}
        >
          {t.icon}
          <span>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}