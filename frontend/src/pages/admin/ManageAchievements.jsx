import { useEffect, useState } from 'react';
import { Pencil, Trash2, ImageOff, Trophy, Calendar } from 'lucide-react';
import api from '../../api/client.js';
import PageTitle from '../../components/admin/PageTitle.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import ImageField from '../../components/admin/ImageField.jsx';
import { useToast } from '../../components/admin/Toast.jsx';

const empty = { title: '', description: '' };

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const ManageAchievements = () => {
  const { push } = useToast();
  const [achievements, setAchievements] = useState([]);
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
      .get('/achievements')
      .then((res) => setAchievements(res.data))
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

  const openEdit = (a) => {
    setEditing(a);
    setForm({ title: a.title, description: a.description });
    setImage({ file: null, url: a.image || '' });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('description', form.description);
      if (image.file) data.append('image', image.file);
      else if (image.url) data.append('image', image.url);
      else data.append('image', '');

      if (editing) await api.put(`/achievements/${editing.id}`, data);
      else await api.post('/achievements', data);

      push(editing ? 'Achievement updated' : 'Achievement added');
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
      await api.delete(`/achievements/${confirm.id}`);
      push('Achievement deleted');
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
        title="Achievements"
        subtitle="Showcase your organisation's key accomplishments."
        actionLabel="New Achievement"
        onAction={openNew}
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-20 w-full" />
          ))}
        </div>
      ) : (
        <div className="card divide-y divide-ink-100 overflow-hidden">
          {achievements.map((a) => (
            <div key={a.id} className="flex items-center gap-4 p-4">
              <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-ink-50">
                {a.image ? (
                  <img src={a.image} alt={a.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink-300">
                    <Trophy size={20} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-ink-400">
                  <Calendar size={13} />
                  {formatDate(a.createdAt)}
                </div>
                <h3 className="mt-1 truncate font-bold text-ink-900">{a.title}</h3>
                <p className="truncate text-xs text-ink-500">{a.description}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => openEdit(a)} className="btn-secondary !px-3 !py-2">
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setConfirm(a)}
                  className="btn !bg-red-50 !px-3 !py-2 text-red-600 hover:!bg-red-100"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          {achievements.length === 0 && (
            <div className="flex flex-col items-center py-12 text-ink-400">
              <ImageOff size={32} />
              <p className="mt-3 text-sm">No achievements yet.</p>
            </div>
          )}
        </div>
      )}

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? 'Edit Achievement' : 'New Achievement'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
              placeholder="Reached 1 million beneficiaries"
            />
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input resize-none"
              placeholder="Describe the accomplishment..."
            />
          </div>
          <ImageField value={image.url} onChange={setImage} label="Image (optional)" />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editing ? 'Update Achievement' : 'Add Achievement'}
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

export default ManageAchievements;
