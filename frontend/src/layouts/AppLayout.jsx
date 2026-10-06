import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { formatRole } from '../utils/format.js';
import peopleosMark from '../assets/peopleos-mark.svg';
import NotificationBell from '../components/NotificationBell.jsx';

const roles = ['ADMIN', 'HR', 'FINANCE', 'TEAM_MANAGER', 'EMPLOYEE'];
const links = [
  { label: 'Dashboard', path: '/dashboard', mark: 'DB', roles },
  { label: 'My profile', path: '/profile', mark: 'ME', roles },
  { label: 'Employees', path: '/employees', mark: 'EM', roles: ['ADMIN', 'HR', 'TEAM_MANAGER'] },
  { label: 'Employee access', path: '/users', mark: 'EA', roles: ['ADMIN'] },
  { label: 'Departments', path: '/departments', mark: 'DP', roles: ['ADMIN', 'HR'] },
  { label: 'Leaves', path: '/leaves', mark: 'LV', roles },
  { label: 'Pending leaves', path: '/leaves/pending', mark: 'PL', roles: ['TEAM_MANAGER'] },
  { label: 'Payroll', path: '/payroll', mark: 'PY', roles: ['ADMIN', 'FINANCE'] },
  { label: 'Attendance', path: '/attendance', mark: 'AT', roles },
  { label: 'Notifications', path: '/notifications', mark: 'NT', roles },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const current = links.find((item) => item.path === location.pathname) || links.find((item) => location.pathname.startsWith(`${item.path}/`)) || links[0];
  const visibleLinks = links.filter((item) => !user || item.roles.includes(user.role));
  return <div className="workspace">
    <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
      <Link className="brand-lockup sidebar-brand" to="/dashboard" onClick={() => setMenuOpen(false)}><img className="brand-mark-img" src={peopleosMark} alt="" /><span>PeopleOS</span></Link>
      <div className="workspace-label">YOUR WORKSPACE</div>
      <nav className="nav-list" aria-label="Main navigation">{visibleLinks.map((item) => <NavLink key={item.path} to={item.path} end={item.path === '/dashboard'} onClick={() => setMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}><span className="nav-mark">{item.mark}</span><span>{item.label}</span></NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-note"><span className="pulse-dot" /> API base <strong>Configured</strong></div><div className="user-card"><div className="avatar">{user?.username?.slice(0, 1).toUpperCase() || 'G'}</div><div className="user-meta"><strong>{user?.username || 'Guest preview'}</strong><span>{user ? formatRole(user.role) : 'Phase 1'}</span></div>{user && <button className="icon-button signout-button" type="button" title="Sign out" aria-label="Sign out" onClick={logout}>↗</button>}</div></div>
    </aside>
    <div className="main-column"><header className="topbar"><button className="mobile-menu" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation">☰</button><div className="breadcrumb"><span>PEOPLE OPERATIONS</span><b>/</b>{current.label.toUpperCase()}</div><div className="topbar-right"><span className="today-label">{new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date())}</span><NotificationBell /><span className="profile-chip">{user ? formatRole(user.role) : 'Not signed in'}</span></div></header><main className="page-content"><Outlet /></main><footer className="page-footer"><span>PEOPLEOS WORKSPACE</span><span>Role-aware shell <i>·</i> Spring Boot remains the authority</span></footer></div>
  </div>;
}