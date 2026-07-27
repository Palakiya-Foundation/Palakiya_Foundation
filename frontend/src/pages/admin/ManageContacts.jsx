import { useEffect, useState } from 'react';
import {
  Trash2,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  Inbox,
  Calendar,
  User,
  Reply,
  Clock,
} from 'lucide-react';
import api from '../../api/client.js';
import PageTitle from '../../components/admin/PageTitle.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import { useToast } from '../../components/admin/Toast.jsx';

const formatDate = (d) =>
  new Date(d).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatShortDate = (d) =>
  new Date(d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

const ManageContacts = () => {
  const { push } = useToast();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState('all');

  const load = () =>
    api
      .get('/contacts')
      .then((res) => setContacts(res.data))
      .catch(() => push('Failed to load messages', 'error'))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const open = async (c) => {
    setSelected(c);

    if (!c.read) {
      try {
        await api.patch(`/contacts/${c.id}/read`);

        setContacts((list) =>
          list.map((x) =>
            x.id === c.id ? { ...x, read: true } : x
          )
        );
      } catch {
        push('Failed to mark message as read', 'error');
      }
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await api.delete(`/contacts/${confirm.id}`);

      push('Message deleted');

      setConfirm(null);
      setSelected(null);

      load();
    } catch {
      push('Failed to delete', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filters = ['all', 'unread'];
  const filtered =
    filter === 'all'
      ? contacts
      : contacts.filter((c) => !c.read);
  const unread = contacts.filter((c) => !c.read).length;
  const counts = { all: contacts.length, unread };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle
          title="Messages"
          subtitle={`${contacts.length} total • ${unread} unread`}
        />
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition ${
              filter === f
                ? 'bg-brand-600 text-white'
                : 'bg-white text-ink-600 ring-1 ring-ink-200 dark:bg-ink-800 dark:text-ink-300 dark:ring-ink-700'
            }`}
          >
            {f}
            <span className="ml-1.5 text-xs opacity-70">
              ({counts[f]})
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-20 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center py-20 text-ink-400 dark:text-gray-400">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-50 dark:bg-ink-800">
            <Inbox size={32} />
          </div>
          <p className="mt-4 text-sm font-semibold">
            {filter === 'unread'
              ? 'No unread messages'
              : 'No messages yet'}
          </p>
          <p className="mt-1 text-xs text-ink-400">
            Messages from the contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="card divide-y divide-ink-100 overflow-hidden dark:divide-gray-700">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => open(c)}
              className={`group flex w-full items-start gap-4 p-5 text-left transition-all duration-200 hover:bg-ink-50 dark:hover:bg-gray-800 ${
                !c.read
                  ? 'bg-brand-50/40 dark:bg-brand-900/10'
                  : ''
              }`}
            >
              {/* Read indicator + Avatar column */}
              <div className="flex shrink-0 flex-col items-center gap-2">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-ocean-600 text-sm font-bold text-white shadow-sm">
                  {c.name.charAt(0)}
                </span>
                <span className="shrink-0">
                  {c.read ? (
                    <CheckCircle2
                      size={14}
                      className="text-ink-300 dark:text-gray-500"
                    />
                  ) : (
                    <span className="flex h-3.5 w-3.5 rounded-full bg-brand-500" />
                  )}
                </span>
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <p
                    className={`min-w-0 flex-1 truncate ${
                      !c.read
                        ? 'font-extrabold'
                        : 'font-semibold'
                    } text-ink-900 dark:text-white`}
                  >
                    {c.name}
                  </p>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-ink-400 dark:text-gray-500">
                    <Calendar size={12} />
                    {formatShortDate(c.createdAt)}
                  </span>
                </div>

                <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-2">
                  {c.subject && (
                    <span className="inline-flex items-center rounded-md bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                      {c.subject}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs text-ink-400 dark:text-gray-500">
                    <Mail size={11} />
                    {c.email}
                  </span>
                </div>

                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500 dark:text-gray-400">
                  {c.message}
                </p>
              </div>

              {/* Arrow indicator */}
              <div className="mt-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                <svg
                  className="h-5 w-5 text-ink-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={null}
        size="lg"
      >
        {selected && (
          <div className="-mx-6 -mt-4">
            {/* Message header with gradient banner */}
            <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-brand-600 to-ocean-700 px-8 pb-10 pt-8 text-white">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
              <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-white/5" />
              <div className="relative flex items-center gap-5">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl font-bold text-white shadow-lg backdrop-blur-sm">
                  {selected.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xl font-extrabold text-white">
                    {selected.name}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-white/70">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {formatDate(selected.createdAt)}
                    </span>
                    {selected.read ? (
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 size={14} />
                        Read
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-6 px-8 pb-8 pt-6">
              {/* Contact Info */}
              <div className="grid gap-4 rounded-2xl bg-ink-50 p-5 dark:bg-gray-800 sm:grid-cols-2">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                    <User size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-ink-400 dark:text-gray-500">
                      Name
                    </p>
                    <p className="truncate text-sm font-semibold text-ink-900 dark:text-white">
                      {selected.name}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-ink-400 dark:text-gray-500">
                      Email
                    </p>
                    <a
                      href={`mailto:${selected.email}`}
                      className="block truncate text-sm font-semibold text-ink-900 transition hover:text-brand-600 dark:text-white dark:hover:text-brand-400"
                    >
                      {selected.email}
                    </a>
                  </div>
                </div>

                {selected.phone && (
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                      <Phone size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-ink-400 dark:text-gray-500">
                        Phone
                      </p>
                      <a
                        href={`tel:${selected.phone}`}
                        className="block truncate text-sm font-semibold text-ink-900 transition hover:text-brand-600 dark:text-white dark:hover:text-brand-400"
                      >
                        {selected.phone}
                      </a>
                    </div>
                  </div>
                )}

                {selected.subject && (
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                      <MessageSquare size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-ink-400 dark:text-gray-500">
                        Subject
                      </p>
                      <p className="truncate text-sm font-semibold text-ink-900 dark:text-white">
                        {selected.subject}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Message */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <MessageSquare size={16} className="text-ink-400" />
                  <p className="text-sm font-bold text-ink-800 dark:text-gray-200">
                    Message
                  </p>
                </div>
                <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
                  <p className="whitespace-pre-wrap break-words text-sm leading-7 text-ink-700 dark:text-gray-200 [overflow-wrap:anywhere]">
                    {selected.message}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-5 dark:border-gray-700">
                <p className="text-xs text-ink-400 dark:text-gray-500">
                  Message ID: #{selected.id}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your Message'}`}
                    className="btn-primary"
                  >
                    <Reply size={16} />
                    Reply via Email
                  </a>
                  <button
                    onClick={() => setConfirm(selected)}
                    className="btn bg-white text-red-600 ring-1 ring-red-200 transition hover:bg-red-50 hover:ring-red-300 dark:bg-red-900/20 dark:text-red-300 dark:ring-red-900/30 dark:hover:bg-red-900/40"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete message from ${confirm?.name}? This cannot be undone.`}
      />
    </div>
  );
};

export default ManageContacts;
