import { useEffect, useState } from 'react';
import { Pencil, Trash2, Star, ImageOff } from 'lucide-react';
import api from '../../api/client.js';
import { useContent } from '../../context/ContentContext.jsx';
import PageTitle from '../../components/admin/PageTitle.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import ImageField from '../../components/admin/ImageField.jsx';
import { useToast } from '../../components/admin/Toast.jsx';

const empty = {
  title: '',
  summary: '',
  description: '',
  category: 'Community',
  icon: 'HeartHandshake',
  featured: false,
  order: 0,
};

const ManagePrograms = () => {
  const { push } = useToast();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [image, setImage] = useState({ file: null, url: '' });
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () =>
    api
      .get('/programs')
      .then((res) => setPrograms(res.data))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setImage({ file: null, url: '' });
    setModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      title: p.title,
      summary: p.summary,
      description: p.description,
      category: p.category,
      icon: p.icon || 'HeartHandshake',
      featured: p.featured,
      order: p.order,
    });
    setImage({ file: null, url: p.image || '' });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (image.file) data.append('image', image.file);
      else if (image.url) data.append('image', image.url);

      if (editing) await api.put(`/programs/${editing.id}`, data);
      else await api.post('/programs', data);

      push(editing ? 'Program updated' : 'Program created');
      setModal(false);
      load();
    } catch (err) {
      push(err.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/programs/${confirm.id}`);
      push('Program deleted');
      setConfirm(null);
      load();
    } catch {
      push('Failed to delete', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageTitle
        title="Programs"
        subtitle="Create and manage your organisation's initiatives."
        actionLabel="Add Program"
        onAction={openNew}
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-56 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => (
            <div key={p.id} className="card overflow-hidden">
              <div className="relative h-36">
                {p.image ? (
                  <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-ink-50 text-ink-300">
                    <ImageOff size={28} />
                  </div>
                )}
                {p.featured && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-white">
                    <Star size={11} fill="currentColor" /> Featured
                  </span>
                )}
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold text-brand-600">{p.category}</span>
                <h3 className="mt-1 truncate font-bold text-ink-900">{p.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-ink-500">{p.summary}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => openEdit(p)} className="btn-secondary flex-1 !py-2 !text-xs">
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => setConfirm(p)}
                    className="btn !bg-red-50 !py-2 !text-xs text-red-600 hover:!bg-red-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Program' : 'New Program'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
              placeholder="Public Health Awareness"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input"
                placeholder="Health"
              />
            </div>
            <div>
              <label className="label">Icon (Lucide name)</label>
              <input
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="input"
                placeholder="Stethoscope"
              />
            </div>
          </div>
          <div>
            <label className="label">Summary *</label>
            <input
              required
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="input"
              placeholder="Short one-line summary"
            />
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea
              required
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input resize-none"
              placeholder="Full description. Use new lines for paragraphs."
            />
          </div>
          <ImageField value={image.url} onChange={setImage} />
          <div className="grid grid-cols-2 items-center gap-4">
            <div>
              <label className="label">Display order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="input"
              />
            </div>
            <label className="mt-6 flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="h-5 w-5 rounded accent-brand-600"
              />
              <span className="text-sm font-semibold text-ink-700">Show on homepage</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editing ? 'Update Program' : 'Create Program'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete "${confirm?.title}"? This cannot be undone.`}
      />
    </div>
  );
};

export default ManagePrograms;
