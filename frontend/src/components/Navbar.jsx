import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { useContent } from '../context/ContentContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programs' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reports', label: 'Reports' },
  { to: '/articles', label: 'Articles' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { content } = useContent();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 shadow-card backdrop-blur-lg dark:bg-ink-900/85'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex h-18 items-center justify-between py-3.5">
       <Link to="/" className="flex items-center gap-3">
  <img
    src="/favicon.svg"
    alt="Logo"
    className="h-20 w-20 object-contain"
  />
  <span className="font-display text-lg font-extrabold tracking-tight text-ink-900 dark:text-white">
    {content.org_name || 'Palakiya'}
  </span>
</Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                    : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900 dark:hover:bg-white/5'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Link to="/join-us" className="btn-primary">
            Get Involved
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-ink-800 ring-1 ring-ink-200 dark:bg-ink-800/80 dark:text-ink-100 dark:ring-ink-700"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden bg-white/95 backdrop-blur-lg transition-all duration-300 dark:bg-ink-900/95 lg:hidden ${
          open ? 'max-h-96 border-t border-ink-100 dark:border-ink-800' : 'max-h-0'
        }`}
      >
        <div className="container-x flex flex-col gap-1 py-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                    : 'text-ink-700 hover:bg-ink-50 dark:hover:bg-white/5'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/join-us" className="btn-primary mt-2">
            Get Involved
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

