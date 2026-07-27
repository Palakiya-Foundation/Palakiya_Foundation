import fs from 'fs';

const content = `import { useEffect, useState } from 'react';
import { Users, Trash2, Check, X, Mail, Phone, Clock, CheckCircle2, XCircle, AlertTriangle, Download } from 'lucide-react';
import api from '../../api/client.js';
import PageTitle from '../../components/admin/PageTitle.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import { useToast } from '../../components/admin/Toast.jsx';

const filters = ['all', 'pending', 'approved', 'rejected'];

const statusStyles = {
  pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-700', icon: Clock },
  approved: { label: 'Approved', cls: 'bg-brand-50 text-brand-700', icon: CheckCircle2 },
  rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-600', icon: XCircle },
};

const StatusBadge = ({ status }) => {
  const s = statusStyles[status] || statusStyles.pending;
  return (
    <span className={\`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold \${s.cls}\`}>
      <s.icon size={12} /> {s.label}
    </span>
  );
};

const ManageVolunteers = () => {
  const { push } = useToast();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [action, setAction] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const load = () =>
    api.get('/volunteers').then((res) => setVolunteers(res.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const runAction = async () => {
    if (!action) return;
    setProcessing(true);
    const { volunteer, type } = action;
    try {
      const res = await api.put(\`/volunteers/\${volunteer.id}/\${type}\`);
      const emailSent = res.data?.emailSent;
      if (emailSent) {
        push(type === 'approve' ? 'Volunteer approved and email sent' : 'Volunteer rejected and email sent');
      } else {
        push(\`Volunteer \${type === 'approve' ? 'approved' : 'rejected'}, but the email could not be sent\`, 'error');
      }
      setAction(null);
      load();
    } catch (err) {
      push(err.response?.data?.message || 'Action failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(\`/volunteers/\${confirmDelete.id}\`);
      push('Volunteer deleted');
      setConfirmDelete(null);
      load();
    } catch {
      push('Failed to delete', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleDownloadExcel = () => {
    const token = localStorage.getItem('ngo_token');
    const baseUrl = import.meta.env.VITE_API_URL || '';
    const url = \`\${baseUrl}/api/volunteers/export\${filter !== 'all' ? \`?status=\${filter}\` : ''}\`;
    fetch(url, { headers: { Authorization: \`Bearer \${token}\` } })
      .then((response) => {
        if (!response.ok) throw new Error('Download failed');
        return response.blob();
      })
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = \`volunteers-\${new Date().toISOString().split('T')[0]}.xlsx\`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
        push('Volunteer list downloaded successfully');
      })
      .catch(() => {
        push('Failed to download volunteer list', 'error');
      });
  };

  const counts = {
    all: volunteers.length,
    pending: volunteers.filter((v) => v.status === 'pending').length,
    approved: volunteers.filter((v) => v.status === 'approved').length,
    rejected: volunteers.filter((v) => v.status === 'rejected').length,
  };

  const filtered = filter === 'all' ? volunteers : volunteers.filter((v) => v.status === filter);
  const approved = volunteers.filter((v) => v.status === 'approved');

  return React.createElement('div', null,
    React.createElement('div', { className: 'flex flex-wrap items-start justify-between gap-4' },
      React.createElement(PageTitle, { title: 'Volunteers', subtitle: \`\${counts.all} total \u2022 \${counts.pending} pending \u2022 \${counts.approved} approved\` }),
      React.createElement('button', { onClick: handleDownloadExcel, className: 'btn flex items-center gap-2 bg-brand-600 text-white hover:bg-brand-700' },
        React.createElement(Download, { size: 16 }),
        ' Download Excel'
      )
    ),
    React.createElement('div', { className: 'mb-6 flex flex-wrap gap-2' },
      filters.map((f) =>
        React.createElement('button', { key: f, onClick: () => setFilter(f), className: \`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition \${filter === f ? 'bg-brand-600 text-white' : 'bg-white text-ink-600 ring-1 ring-ink-200'}\` },
          f + ' (' + counts[f] + ')'
        )
      )
    ),
    loading
      ? React.createElement('div', { className: 'space-y-3' },
          Array.from({ length: 5 }).map((_, i) => React.createElement('div', { key: i, className: 'skeleton h-16 w-full' }))
        )
      : filtered.length === 0
        ? React.createElement('div', { className: 'card flex flex-col items-center py-16 text-ink-400' },
            React.createElement(Users, { size: 36 }),
            React.createElement('p', { className: 'mt-3 text-sm' }, 'No volunteer requests ' + (filter !== 'all' ? '(' + filter + ')' : '') + '.')
          )
        : React.createElement('div', { className: 'card overflow-x-auto' },
            React.createElement('table', { className: 'w-full min-w-[760px] text-left text-sm' },
              React.createElement('thead', null,
                React.createElement('tr', { className: 'border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400' },
                  React.createElement('th', { className: 'px-4 py-3 font-semibold' }, 'Name'),
                  React.createElement('th', { className: 'px-4 py-3 font-semibold' }, 'Email'),
                  React.createElement('th', { className: 'px-4 py-3 font-semibold' }, 'Phone'),
                  React.createElement('th', { className: 'px-4 py-3 font-semibold' }, 'Interest'),
                  React.createElement('th', { className: 'px-4 py-3 font-semibold' }, 'Status'),
                  React.createElement('th', { className: 'px-4 py-3 text-right font-semibold' }, 'Actions')
                )
              ),
              React.createElement('tbody', { className: 'divide-y divide-ink-100' },
                filtered.map((v) =>
                  React.createElement('tr', { key: v.id, className: 'align-middle transition hover:bg-ink-50/60' },
                    React.createElement('td', { className: 'px-4 py-3' },
                      React.createElement('div', { className: 'flex items-center gap-2.5' },
                        React.createElement('span', { className: 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-ocean-600 text-xs font-bold text-white' }, v.name.charAt(0)),
                        React.createElement('span', { className: 'font-semibold text-ink-900' }, v.name)
                      )
                    ),
                    React.createElement('td', { className: 'px-4 py-3' }, React.createElement('a', { href: \`mailto:\${v.email}\`, className: 'text-ink-600 hover:text-brand-600' }, v.email)),
                    React.createElement('td', { className: 'px-4 py-3 text-ink-600' }, v.phone),
                    React.createElement('td', { className: 'px-4 py-3 text-ink-600' }, v.interest || '\\u2014'),
                    React.createElement('td', { className: 'px-4 py-3' }, React.createElement(StatusBadge, { status: v.status })),
                    React.createElement('td', { className: 'px-4 py-3' },
                      React.createElement('div', { className: 'flex justify-end gap-2' },
                        React.createElement('button', { onClick: () => setSelectedVolunteer(v), title: 'View Details', className: 'flex h-8 w-8 items-center justify-center rounded-lg bg-ocean-50 text-ocean-700 transition hover:bg-ocean-100' }, React.createElement(Mail, { size: 15 })),
                        v.status !== 'approved' && React.createElement('button', { onClick: () => setAction({ volunteer: v, type: 'approve' }), title: 'Approve', className: 'flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition hover:bg-brand-100' }, React.createElement(Check, { size: 15 })),
                        v.status !== 'rejected' && React.createElement('button', { onClick: () => setAction({ volunteer: v, type: 'reject' }), title: 'Reject', className: 'flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 transition hover:bg-amber-100' }, React.createElement(X, { size: 15 })),
                        React.createElement('button', { onClick: () => setConfirmDelete(v), title: 'Delete', className: 'flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100' }, React.createElement(Trash2, { size: 15 }))
                      )
                    )
                  )
                )
              )
            )
          ),
    !loading && approved.length > 0 && React.createElement('div', { className: 'mt-10' },
      React.createElement('h2', { className: 'mb-4 flex items-center gap-2 text-lg font-extrabold text-ink-900' },
        React.createElement(CheckCircle2, { size: 20, className: 'text-brand-600' }),
        ' Approved Volunteers (' + approved.length + ')'
      ),
      React.createElement('div', { className: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' },
        approved.map((v) =>
          React.createElement('div', { key: v.id, className: 'card p-5' },
            React.createElement('div', { className: 'flex items-center gap-3' },
              React.createElement('span', { className: 'flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-ocean-600 font-bold text-white' }, v.name.charAt(0)),
              React.createElement('div', { className: 'min-w-0' },
                React.createElement('p', { className: 'truncate font-bold text-ink-900' }, v.name),
                v.interest && React.createElement('p', { className: 'truncate text-xs text-ink-500' }, v.interest)
              )
            ),
            React.createElement('div', { className: 'mt-4 space-y-1.5 text-sm text-ink-600' },
              React.createElement('a', { href: \`mailto:\${v.email}\`, className: 'flex items-center gap-2 hover:text-brand-600' }, React.createElement(Mail, { size: 14 }), ' ', v.email),
              React.createElement('a', { href: \`tel:\${v.phone}\`, className: 'flex items-center gap-2 hover:text-brand-600' }, React.createElement(Phone, { size: 14 }), ' ', v.phone)
            )
          )
        )
      )
    ),
    React.createElement(Modal, { open: !!action, onClose: () => setAction(null), title: action?.type === 'approve' ? 'Approve Volunteer' : 'Reject Volunteer', size: 'sm' },
      action && React.createElement(React.Fragment, null,
        React.createElement('div', { className: 'flex items-start gap-4' },
          React.createElement('span', { className: \`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl \${action.type === 'approve' ? 'bg-brand-50 text-brand-600' : 'bg-amber-50 text-amber-600'}\` },
            action.type === 'approve' ? React.createElement(Check, { size: 24 }) : React.createElement(AlertTriangle, { size: 24 })
          ),
          React.createElement('p', { className: 'text-sm leading-relaxed text-ink-600' },
            action.type === 'approve' ? \`Approve \${action.volunteer.name}'s application? An approval email will be sent to \${action.volunteer.email}.\` : \`Reject \${action.volunteer.name}'s application? A notification email will be sent to \${action.volunteer.email}.\`
          )
        ),
        React.createElement('div', { className: 'mt-6 flex justify-end gap-3' },
          React.createElement('button', { onClick: () => setAction(null), className: 'btn-secondary' }, 'Cancel'),
          React.createElement('button', { onClick: runAction, disabled: processing, className: \`btn text-white \${action.type === 'approve' ? 'bg-brand-600 hover:bg-brand-700' : 'bg-amber-500 hover:bg-amber-600'}\` },
            processing ? 'Processing...' : action.type === 'approve' ? 'Approve & Send Email' : 'Reject & Send Email'
          )
        )
      )
    ),
    React.createElement(Modal, { open: !!selectedVolunteer, onClose: () => setSelectedVolunteer(null), title: 'Volunteer Application Details' },
      selectedVolunteer && React.createElement('div', { className: 'space-y-4' },
        React.createElement('div', { className: 'flex items-center gap-3' },
          React.createElement('span', { className: 'flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-ocean-600 text-lg font-bold text-white' }, selectedVolunteer.name?.charAt(0) || 'U'),
          React.createElement('div', null,
            React.createElement('p', { className: 'font-extrabold text-ink-900' }, selectedVolunteer.name),
            React.createElement('p', { className: 'text-xs text-ink-400' },
              selectedVolunteer.createdAt ? new Date(selectedVolunteer.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : null
            )
          )
        ),
        React.createElement('div', { className: 'grid gap-3 rounded-xl bg-ink-50 p-4 text-sm sm:grid-cols-2' },
          React.createElement('a', { href: \`mailto:\${selectedVolunteer.email}\`, className: 'flex items-center gap-2 text-ink-600 hover:text-brand-600' }, React.createElement(Mail, { size: 16 }), ' ', selectedVolunteer.email),
          selectedVolunteer.phone && React.createElement('a', { href: \`tel:\${selectedVolunteer.phone}\`, className: 'flex items-center gap-2 text-ink-600 hover:text-brand-600' }, React.createElement(Phone, { size: 16 }), ' ', selectedVolunteer.phone)
        ),
        selectedVolunteer.interest && React.createElement('div', null,
          React.createElement('p', { className: 'label' }, 'Interest'),
          React.createElement('p', { className: 'text-sm font-semibold text-ink-900' }, selectedVolunteer.interest)
        ),
        React.createElement('div', null,
          React.createElement('p', { className: 'label' }, 'Message'),
          React.createElement('p', { className: 'whitespace-pre-line rounded-xl border border-ink-100 p-4 text-sm leading-relaxed text-ink-600' }, selectedVolunteer.message || selectedVolunteer.description || '\\u2014')
        ),
        React.createElement('div', { className: 'flex justify-end gap-3 pt-2' },
          React.createElement('a', { href: \`mailto:\${selectedVolunteer.email}\`, className: 'btn-secondary' }, React.createElement(Mail, { size: 16 }), ' Reply'),
          React.createElement('button', { onClick: () => setConfirmDelete(selectedVolunteer), className: 'btn !bg-red-50 text-red-600 hover:!bg-red-100' }, React.createElement(Trash2, { size: 16 }), ' Delete')
        )
      )
    ),
    React.createElement(ConfirmDialog, {
      open: !!confirmDelete,
      onClose: () => setConfirmDelete(null),
      onConfirm: handleDelete,
      loading: deleting,
      message: \`Delete \${confirmDelete?.name}'s application? This cannot be undone.\`
    })
  );
};

export default ManageVolunteers;
`;

const filePath = 'd:/HighRadius/NEW_PALAKIYA/Non-G/frontend/src/pages/admin/ManageVolunteers.jsx';
console.log('Writing file to:', filePath);
console.log('Content length:', content.length);
fs.writeFileSync(filePath, content, 'utf8');
console.log('File written successfully');
