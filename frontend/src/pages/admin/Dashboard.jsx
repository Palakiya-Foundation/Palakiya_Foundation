import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Boxes, Newspaper, Images, Inbox, Trophy, UserPlus, Users2, ArrowUpRight, TrendingUp } from 'lucide-react';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';

const Dashboard = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState({
    programs: 0,
    articles: 0,
    gallery: 0,
    contacts: 0,
    unread: 0,
    reports: 0,
    volunteers: 0,
    pendingVolunteers: 0,
    team: 0,
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/programs'),
      api.get('/articles?includeUnpublished=true'),
      api.get('/gallery'),
      api.get('/contacts'),
      api.get('/reports'),
      api.get('/volunteers'),
      api.get('/team'),
    ])
      .then(([p, a, g, c, ach, v, t]) => {
        setStats({
          programs: p.data.length,
          articles: a.data.length,
          gallery: g.data.length,
          contacts: c.data.length,
          unread: c.data.filter((x) => !x.read).length,
          reports: ach.data.length,
          volunteers: v.data.length,
          pendingVolunteers: v.data.filter((x) => x.status === 'pending').length,
          team: t.data.length,
        });
        setRecent(c.data.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Programs', value: stats.programs, icon: Boxes, to: '/admin/programs', grad: 'from-brand-500 to-emerald-600' },
    { label: 'Articles', value: stats.articles, icon: Newspaper, to: '/admin/articles', grad: 'from-ocean-500 to-ocean-700' },
    { label: 'Team Members', value: stats.team, icon: Users2, to: '/admin/team', grad: 'from-teal-500 to-cyan-600' },
    { label: 'Gallery Images', value: stats.gallery, icon: Images, to: '/admin/gallery', grad: 'from-violet-500 to-purple-600' },
    { label: 'Reports', value: stats.reports, icon: Trophy, to: '/admin/reports', grad: 'from-amber-400 to-amber-600' },
    {
      label: stats.pendingVolunteers > 0 ? `Volunteers (${stats.pendingVolunteers} pending)` : 'Volunteers',
      value: stats.volunteers,
      icon: UserPlus,
      to: '/admin/volunteers',
      grad: 'from-rose-500 to-pink-600',
    },
    { label: 'Messages', value: stats.contacts, icon: Inbox, to: '/admin/contacts', grad: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900">
          Welcome back, {admin?.name?.split(' ')[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Here's an overview of your website content and activity.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="card-hover group relative overflow-hidden p-6"
          >
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${c.grad} opacity-10`} />
            <div className="flex items-center justify-between">
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.grad} text-white shadow-card`}>
                <c.icon size={22} />
              </span>
              <ArrowUpRight size={18} className="text-ink-300 transition group-hover:text-brand-600" />
            </div>
            <p className="mt-4 text-3xl font-extrabold text-ink-900">
              {loading ? '—' : c.value}
            </p>
            <p className="text-sm text-ink-500">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent messages + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-ink-900">Recent Messages</h2>
            <Link to="/admin/contacts" className="text-sm font-semibold text-brand-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 divide-y divide-ink-100">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton my-2 h-12 w-full" />
              ))
            ) : recent.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink-400">No messages yet.</p>
            ) : (
              recent.map((c) => (
                <div key={c.id} className="flex items-center gap-3 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                    {c.name?.charAt(0) ?? '?'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-900">{c.name}</p>
                    <p className="truncate text-xs text-ink-500">{c.message}</p>
                  </div>
                  {!c.read && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card flex flex-col justify-between bg-gradient-to-br from-brand-600 to-ocean-700 p-6 text-white">
          <div>
            <TrendingUp size={28} />
            <h2 className="mt-4 text-lg font-extrabold">Quick Actions</h2>
            <p className="mt-1 text-sm text-white/80">Manage your content in seconds.</p>
          </div>
          <div className="mt-6 space-y-2">
            {[
              ['Add a Program', '/admin/programs'],
              ['Write an Article', '/admin/articles'],
              ['Add a Report', '/admin/reports'],
              ['Review Volunteers', '/admin/volunteers'],
            ].map(([label, to]) => (
              <Link
                key={label}
                to={to}
                className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
              >
                {label}
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
