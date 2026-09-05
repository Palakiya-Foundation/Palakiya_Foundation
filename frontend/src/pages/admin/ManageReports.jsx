import { useEffect, useState } from 'react';
import { Pencil, Trash2, ImageOff, Eye, EyeOff, User } from 'lucide-react';


import api, { resolveImage } from '../../api/client.js';
import PageTitle from '../../components/admin/PageTitle.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import ImageField from '../../components/admin/ImageField.jsx';
import { useToast } from '../../components/admin/Toast.jsx';
import SearchableAuthorMultiSelect from '../../components/admin/SearchableAuthorMultiSelect.jsx';

const empty = {

  title: '',
  excerpt: '',
  content: '',
  category: 'Awareness',
  // legacy (still present in backend schema)
  author: 'NGO Team',
  // new many-to-many author relationship
  authorIds: [],
  published: true,
  driveLink: '',
};


const ManageReports = () => {
  const { push } = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [image, setImage] = useState({ file: null, url: '' });
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [authors, setAuthors] = useState([]);

  // Admin author popup
  const [authorModalOpen, setAuthorModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [selectedAuthorLoading, setSelectedAuthorLoading] = useState(false);
  const [selectedAuthorError, setSelectedAuthorError] = useState(false);
  const [authorFormName, setAuthorFormName] = useState('');
  const [authorFormDesignation, setAuthorFormDesignation] = useState('');
  const [authorFormBio, setAuthorFormBio] = useState('');
  const [authorSaving, setAuthorSaving] = useState(false);
  const [authorImage, setAuthorImage] = useState({ file: null, url: '' });


  const load = () =>
    Promise.all([
      api.get('/reports?includeUnpublished=true'),
      api.get('/authors'),
    ])
      .then(([reportsRes, authorsRes]) => {
        setReports(reportsRes.data);
        setAuthors(authorsRes.data);
      })
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

  const openEdit = (r) => {
    setEditing(r);

    const existingAuthorIds = Array.isArray(r.authors)
      ? r.authors.map((x) => Number(x.authorId || x.id)).filter(Boolean)
      : [];

    setForm({
      title: r.title,
      excerpt: r.excerpt,
      content: r.content,
      category: r.category,
      author: r.author,
      authorIds: existingAuthorIds,
      published: r.published,
      driveLink: r.driveLink || '',
    });

    setImage({ file: null, url: r.image || '' });
    setModal(true);
  };


  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'authorIds') {
          data.append(k, JSON.stringify(v || []));
        } else {
          data.append(k, v);
        }
      });


      if (image.file) data.append('image', image.file);
      else if (image.url) data.append('image', image.url);

      if (editing) await api.put(`/reports/${editing.id}`, data);
      else await api.post('/reports', data);

      push(editing ? 'Report updated' : 'Report published');
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
      await api.delete(`/reports/${confirm.id}`);
      push('Report deleted');
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
        title="Reports"
        subtitle="Publish and manage reports and publications."
        actionLabel="New Report"
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
          {reports.map((r) => (
            <div key={r.id} className="flex items-center gap-4 p-4">
              <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-ink-50">
                {r.image ? (
                  <img src={resolveImage(r.image)} alt={r.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink-300">
                    <ImageOff size={20} />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-ocean-50 px-2 py-0.5 text-xs font-semibold text-ocean-700">
                    {r.category}
                  </span>
                  {r.published ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
                      <Eye size={12} /> Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-400">
                      <EyeOff size={12} /> Draft
                    </span>
                  )}
                </div>
                <h3 className="mt-1 truncate font-bold text-ink-900">{r.title}</h3>
                <p className="truncate text-xs text-ink-500">{r.excerpt}</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {Array.isArray(r.authors) && r.authors.length > 0 ? (
                    r.authors.map((x, idx) => {
                      const id = Number(x.authorId || x.author?.id);
                      const name = x.author?.name || x.name || x.author;
                      return (
                        <button
                          key={id || idx}
                          type="button"
                          onClick={() => {
                            if (!id) return;
                            setSelectedAuthor(null);
                            setSelectedAuthorError(false);
                            setSelectedAuthorLoading(true);
                            setAuthorFormName('');
                            setAuthorFormDesignation('');
                            setAuthorFormBio('');
                            setAuthorImage({ file: null, url: '' });

                            api
                              .get(`/authors/${id}/published`)
                              .then((res) => {
                                setSelectedAuthor(res.data);
                                setAuthorFormName(res.data.name || '');
                                setAuthorFormDesignation(res.data.designation || '');
                                setAuthorFormBio(res.data.bio || '');
                                setAuthorImage({ file: null, url: res.data.photo || '' });
                              })
                              .catch(() => setSelectedAuthorError(true))
                              .finally(() => {
                                setSelectedAuthorLoading(false);
                                setAuthorModalOpen(true);
                              });
                          }}
                          className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                        >
                          <User size={12} className="mr-1" />
                          {name}
                        </button>
                      );
                    })
                  ) : (
                    <span className="text-xs text-ink-400">No authors</span>
                  )}
                </div>
              </div>


              <div className="flex shrink-0 gap-2">
                <button onClick={() => openEdit(r)} className="btn-secondary !px-3 !py-2">
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setConfirm(r)}
                  className="btn !bg-red-50 !px-3 !py-2 text-red-600 hover:!bg-red-100"
                >
                  <Trash2 size={15} />
                </button>
              </div>

            </div>
          ))}

          {reports.length === 0 && (
            <p className="py-10 text-center text-sm text-ink-400">No reports yet.</p>
          )}
        </div>
      )}

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? 'Edit Report' : 'New Report'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input"
              />
            </div>
            <div className="sm:col-span-2">
              <SearchableAuthorMultiSelect
                label="Authors"
                authors={authors}
                value={form.authorIds}
                onChange={(ids) => setForm({ ...form, authorIds: ids })}
              />
            </div>

          </div>

          <div>
            <label className="label">Excerpt *</label>
            <textarea
              required
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="input resize-none"
              placeholder="A short teaser shown on cards"
            />
          </div>

          <div>
            <label className="label">Content *</label>
            <textarea
              required
              rows={8}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="input resize-none"
              placeholder="Full report body. Separate paragraphs with new lines."
            />
          </div>

          <ImageField value={image.url} onChange={setImage} label="Cover Image" />

          <div>
            <label className="label">Drive / Detailed URL</label>
            <input
              type="url"
              value={form.driveLink}
              onChange={(e) => setForm({ ...form, driveLink: e.target.value })}
              className="input"
              placeholder="https://drive.google.com/..."
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="h-5 w-5 rounded accent-brand-600"
            />
            <span className="text-sm font-semibold text-ink-700">Published (visible on site)</span>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editing ? 'Update Report' : 'Publish Report'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={authorModalOpen}
        onClose={() => {
          setAuthorModalOpen(false);
          setSelectedAuthor(null);
          setSelectedAuthorError(false);
        }}
        title={selectedAuthor?.name || 'Author'}
        size="lg"
      >
        {selectedAuthorLoading ? (
          <div className="space-y-3">
            <div className="skeleton h-6 w-40" />
            <div className="skeleton h-24 w-24 rounded-full" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-full" />
          </div>
        ) : selectedAuthorError || !selectedAuthor ? (
          <div className="py-6 text-center text-ink-500">Failed to load author.</div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-ink-50">
                {authorImage?.url ? (
                  <img src={authorImage.url} alt={authorFormName || selectedAuthor.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="text-ink-300"> <User size={28} /> </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="grid gap-3">
                  <div>
                    <label className="label">Author name *</label>
                    <input
                      required
                      value={authorFormName}
                      onChange={(e) => setAuthorFormName(e.target.value)}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Designation</label>
                    <input
                      value={authorFormDesignation}
                      onChange={(e) => setAuthorFormDesignation(e.target.value)}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Bio</label>
                    <textarea
                      rows={4}
                      value={authorFormBio}
                      onChange={(e) => setAuthorFormBio(e.target.value)}
                      className="input resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-ink-500">
                {selectedAuthor.articles?.length ? (
                  <span>
                    {selectedAuthor.articles.length} article(s)
                  </span>
                ) : (
                  <span>No articles found for this author.</span>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAuthorFormName(selectedAuthor.name || '');
                    setAuthorFormDesignation(selectedAuthor.designation || '');
                    setAuthorFormBio(selectedAuthor.bio || '');
                    setAuthorImage({ file: null, url: selectedAuthor.photo || '' });
                  }}
                  className="btn-secondary"
                >
                  Reset
                </button>
                <button
                  type="button"
                  disabled={authorSaving}
                  onClick={async () => {
                    setAuthorSaving(true);
                    try {
                      const data = new FormData();
                      data.append('name', (authorFormName || '').trim());
                      data.append('designation', authorFormDesignation || '');
                      data.append('bio', authorFormBio || '');

                      await api.put(`/authors/${selectedAuthor.id}`, data);
                      const res = await api.get(`/authors/${selectedAuthor.id}`);
                      setSelectedAuthor(res.data);
                      setAuthorFormName(res.data.name || '');
                      setAuthorFormDesignation(res.data.designation || '');
                      setAuthorFormBio(res.data.bio || '');
                      setAuthorImage({ file: null, url: res.data.photo || '' });
                      push('Author updated');
                    } catch (err) {
                      push(err.response?.data?.message || 'Failed to update author', 'error');
                    } finally {
                      setAuthorSaving(false);
                    }
                  }}
                  className="btn-primary"
                >
                  {authorSaving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-base font-extrabold text-ink-900">Articles by this author</h4>
              <div className="mt-4 space-y-3">
                {Array.isArray(selectedAuthor.articles) && selectedAuthor.articles.length > 0 ? (
                  selectedAuthor.articles.map((a) => (
                    <div key={a.id} className="rounded-xl border border-ink-100 bg-white p-3">
                      <div className="text-sm font-bold text-brand-700">{a.title}</div>
                      {a.excerpt && <div className="mt-1 line-clamp-2 text-xs text-ink-500">{a.excerpt}</div>}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-ink-500">No other contributions available.</p>
                )}
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
        message={`Delete "${confirm?.title}"? This cannot be undone.`}
      />

    </div>
  );
};

export default ManageReports;

