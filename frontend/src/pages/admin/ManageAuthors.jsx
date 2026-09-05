import { useEffect, useMemo, useState } from 'react';
import { Pencil, Trash2, ImageOff, Plus } from 'lucide-react';
import api, { resolveImage } from '../../api/client.js';
import PageTitle from '../../components/admin/PageTitle.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import ImageField from '../../components/admin/ImageField.jsx';
import { useToast } from '../../components/admin/Toast.jsx';

const empty = {
  name: '',
  designation: '',
  bio: '',
  photo: '',
};

const ManageAuthors = () => {
  const { push } = useToast();
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [image, setImage] = useState({ file: null, url: '' });

  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () =>
    api
      .get('/authors')
      .then((res) => setAuthors(res.data))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setImage({ file: null, url: '' });
    setModalOpen(true);
  };

  const openEdit = (a) => {
    setEditing(a);
    setForm({
      name: a.name || '',
      designation: a.designation || '',
      bio: a.bio || '',
      photo: a.photo || '',
    });
    setImage({ file: null, url: a.photo || '' });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));

      if (image.file) data.append('photo', image.file);
      else if (image.url !== undefined) data.append('photo', image.url);

      if (editing) {
        await api.put(`/authors/${editing.id}`, data);
        push('Author updated');
      } else {
        await api.post('/authors', data);
        push('Author created');
      }

      setModalOpen(false);
      load();
    } catch (err) {
      push(err.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm) return;
    setDeleting(true);
    try {
      await api.delete(`/authors/${confirm.id}`);
      push('Author deleted');
      setConfirm(null);
      load();
    } catch {
      push('Failed to delete', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const authorsSorted = useMemo(() => [...authors].sort((a, b) => (a.name || '').localeCompare(b.name || '')),[authors]);

  return (
    <div>
      <PageTitle
        title="Authors"
        subtitle="Manage author profiles shown in the article detail modal."
        actionLabel="Add Author"
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
          {authorsSorted.map((a) => (
            <div key={a.id} className="flex items-center gap-4 p-4">
              <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-ink-50">
                {a.photo ? (
                  <img src={resolveImage(a.photo)} alt={a.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink-300">
                    <ImageOff size={20} />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-bold text-ink-900">{a.name}</h3>
                {a.designation ? <p className="truncate text-xs text-ink-500">{a.designation}</p> : <p className="text-xs text-ink-400">No designation</p>}
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

          {authorsSorted.length === 0 && (
            <p className="py-10 text-center text-sm text-ink-400">No authors yet.</p>
          )}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Author' : 'New Author'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="label">Designation</label>
            <input
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="label">Short bio</label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="input resize-none"
              placeholder="A short bio shown in author modal"
            />
          </div>

          <ImageField
            label="Photo"
            value={image.url}
            onChange={setImage}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editing ? 'Update Author' : 'Create Author'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete "${confirm?.name}"? This cannot be undone.`}
      />
    </div>
  );
};

export default ManageAuthors;

