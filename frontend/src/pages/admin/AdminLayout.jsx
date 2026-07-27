import { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  Newspaper,
  Images,
  Trophy,
  UserPlus,
  Users2,
  Inbox,
  Settings2,
  LogOut,
  Heart,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import ThemeToggle from '../../components/ThemeToggle.jsx';

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/programs', label: 'Programs', icon: Boxes },
  { to: '/admin/articles', label: 'Articles', icon: Newspaper },
  { to: '/admin/authors', label: 'Authors', icon: UserPlus },
  { to: '/admin/team', label: 'Team', icon: Users2 },
  { to: '/admin/gallery', label: 'Gallery', icon: Images },
  { to: '/admin/reports', label: 'Reports', icon: Trophy },
  { to: '/admin/volunteers', label: 'Volunteers', icon: UserPlus },
  { to: '/admin/contacts', label: 'Messages', icon: Inbox },
  { to: '/admin/content', label: 'Site Content', icon: Settings2 },
];

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <>
      <Link to="/admin" className="flex items-center gap-3 px-2 py-1">
  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-md dark:bg-ink-800">
    <img
      src="/favicon.svg"
      alt="Logo"
      className="h-20 w-20 object-contain"
    />
  </div>
  <div>
    <p className="font-display text-base font-extrabold text-white">Palakiya</p>
    <p className="text-[11px] text-ink-400">Admin Panel</p>
  </div>
</Link>

      <nav className="mt-8 flex-1 space-y-1">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? 'bg-brand-500/15 text-brand-300'
                  : 'text-ink-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon size={19} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 pt-4">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-ink-400 transition hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={19} /> View Site
        </a>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
        >
          <LogOut size={19} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-ink-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-ink-900 p-5 lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-ink-900 p-5">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-ink-100 bg-white/80 px-5 backdrop-blur dark:border-ink-800 dark:bg-ink-900/80 lg:px-8">
          <button
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-ink-200 dark:ring-ink-700 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="text-right">
              <p className="text-sm font-semibold text-ink-900">{admin?.name}</p>
              <p className="text-xs text-ink-400">{admin?.email}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md dark:bg-ink-800">
              <img
                src="/favicon.svg"
                alt="Admin"
                className="h-16 w-16 object-contain"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
