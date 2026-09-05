import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Users, ImageOff } from 'lucide-react';
import api, { resolveImage } from '../../api/client.js';
import PageTitle from '../../components/admin/PageTitle.jsx';
import { useToast } from '../../components/admin/Toast.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import ImageField from '../../components/admin/ImageField.jsx';

const ManageTeam = () => {
  const { push } = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({ name: '', role: '', bio: '', order: 0 });
  const [image, setImage] = useState({ file: null, url: '' });

  const load = () =>
    api.get('/team')
      .then((res) => setMembers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', role: '', bio: '', order: 0 });
    setImage({ file: null, url: '' });
    setModalOpen(true);
  };

  const openEdit = (m) => {
    setEditing(m);
    setForm({ name: m.name || '', role: m.role || '', bio: m.bio || '', order: m.order ?? 0 });
    setImage({ file: null, url: m.image || '' });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append('name', form.name.trim());
      data.append('role', form.role?.trim() || '');
      data.append('bio', form.bio?.trim() || '');
      data.append('order', String(Number(form.order) || 0));
      if (image.file) data.append('image', image.file);
      else if (image.url !== undefined) data.append('image', image.url);

      if (editing) {
        await api.put(`/team/${editing.id}`, data);
        push('Team member updated');
      } else {
        await api.post('/team', data);
        push('Team member added');
      }
      setModalOpen(false);
      setEditing(null);
      setImage({ file: null, url: '' });
      setForm({ name: '', role: '', bio: '', order: 0 });
      load();
    } catch (err) {
      push(err.response?.data?.message || 'Failed to save team member', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/team/${confirmDelete.id}`);
      push('Team member deleted');
      setConfirmDelete(null);
      load();
    } catch { push('Failed to delete', 'error'); }
    finally { setDeleting(false); }
  };

  const sorted = useMemo(() => [...members].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)), [members]);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <PageTitle title="Team Members" subtitle="Manage the team shown on the About page." />
        <button onClick={openNew} className="btn-primary">
          <Plus size={18} /> Add Member
        </button>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-56 w-full" />)
        ) : sorted.length === 0 ? (
          <div className="card col-span-full flex flex-col items-center py-12 text-ink-400">
            <Users size={38} />
            <p className="mt-3 text-sm">No team members yet.</p>
          </div>
        ) : (
          sorted.map((m) => (
            <div key={m.id} className="card overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-ink-100">
                {m.image ? (
                  <img src={resolveImage(m.image)} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageOff size={32} className="text-ink-300" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-ink-900">{m.name}</h3>
                    {m.role && <p className="truncate text-xs text-ink-500">{m.role}</p>}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => openEdit(m)} className="btn-secondary !px-3 !py-2">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setConfirmDelete(m)} className="btn !bg-red-50 !px-3 !py-2 text-red-600 hover:!bg-red-100">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                {m.bio && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-600">{m.bio}</p>}
                <div className="mt-3">
                  <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-500">Order: {m.order ?? 0}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Team Member' : 'New Team Member'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Full name" />
            </div>
            <div>
              <label className="label">Role</label>
              <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input" placeholder="e.g. Executive Director" />
            </div>
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input resize-none" placeholder="Brief biography..." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Display order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="input" />
            </div>
            <div>
              <ImageField label="Photo (optional)" value={image.url} onChange={setImage} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editing ? 'Update' : 'Add Member'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete "${confirmDelete?.name}" from the team? This cannot be undone.`}
      />
    </div>
  );
};

export default ManageTeam;
