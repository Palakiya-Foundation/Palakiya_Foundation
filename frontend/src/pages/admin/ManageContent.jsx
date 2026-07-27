import { useEffect, useMemo, useState } from 'react';
import { Save, Quote, Trash2, Pencil, Plus, ImageOff } from 'lucide-react';
import api from '../../api/client.js';
import { useContent } from '../../context/ContentContext.jsx';
import PageTitle from '../../components/admin/PageTitle.jsx';
import { useToast } from '../../components/admin/Toast.jsx';
import Modal from '../../components/admin/Modal.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import ImageField from '../../components/admin/ImageField.jsx';


// Grouped editable fields
const groups = [
  {
    title: 'General',
    fields: [
      { key: 'org_name', label: 'Organisation Name' },
      { key: 'about_intro', label: 'About Intro', textarea: true },
    ],
  },
  {
    title: 'Hero Section',
    fields: [
      { key: 'hero_badge', label: 'Hero Badge' },
      { key: 'hero_title', label: 'Hero Title', textarea: true },
      { key: 'hero_subtitle', label: 'Hero Subtitle', textarea: true },
      { key: 'hero_cta_primary', label: 'Primary Button Text' },
      { key: 'hero_cta_secondary', label: 'Secondary Button Text' },
    ],
  },
  {
    title: 'Hero Images',
    visual: true,
    subsections: [
      {
        title: 'Landing Page Images',
        fields: [
          { key: 'hero_img_1', label: 'Landing Page Image 1', description: 'The first large image shown in the landing page hero section.' },
          { key: 'hero_img_2', label: 'Landing Page Image 2', description: 'The second image shown in the landing page hero section.' },
          { key: 'hero_img_3', label: 'Landing Page Image 3', description: 'The third image shown in the landing page hero section.' },
          { key: 'hero_img_4', label: 'Landing Page Image 4', description: 'The fourth image shown in the landing page hero section.' },
        ],
      },
      {
        title: 'Trustee Images',
        fields: [
          { key: 'hero_avatar_1', label: 'Trustee Image 1', description: 'The first small trustee/profile image shown near the hero section.' },
          { key: 'hero_avatar_2', label: 'Trustee Image 2', description: 'The second small trustee/profile image shown near the hero section.' },
          { key: 'hero_avatar_3', label: 'Trustee Image 3', description: 'The third small trustee/profile image shown near the hero section.' },
          { key: 'hero_avatar_4', label: 'Trustee Image 4', description: 'The fourth small trustee/profile image shown near the hero section.' },
        ],
      },
      {
        title: 'Who We Are Image',
        fields: [
          { key: 'home_intro_image', label: 'Who We Are Image', description: 'The image used in the “Who We Are” section on the landing page.' },
        ],
      },
      {
        title: 'Join Us CTA Images',
        fields: [
          { key: 'join_us_img_1', label: 'Join Us Image 1', description: 'The first image shown in the Join Us CTA section on the landing page.' },
          { key: 'join_us_img_2', label: 'Join Us Image 2', description: 'The second image shown in the Join Us CTA section on the landing page.' },
        ],
      },
      {
        title: 'About Background Image',
        fields: [
          { key: 'about_page_image', label: 'Our Background Image', description: 'The image used in the “Our Background” section on the About page.' },
        ],
      },
    ],
  },
  {
    title: 'Impact Statistics',
    fields: [
      { key: 'stat_people', label: 'People Reached (number)' },
      { key: 'stat_people_label', label: 'People Label' },
      { key: 'stat_villages', label: 'Villages (number)' },
      { key: 'stat_villages_label', label: 'Villages Label' },
      { key: 'stat_programs', label: 'Programs (number)' },
      { key: 'stat_programs_label', label: 'Programs Label' },
      { key: 'stat_volunteers', label: 'Volunteers (number)' },
      { key: 'stat_volunteers_label', label: 'Volunteers Label' },
      { key: 'stat_years', label: 'Years of Impact (number)' },
    ],
  },
  {
    title: 'Mission & Vision',
    fields: [
      { key: 'mission', label: 'Mission Statement', textarea: true },
      { key: 'vision', label: 'Vision Statement', textarea: true },
    ],
  },
  {
    title: 'Call To Action',
    fields: [
      { key: 'cta_title', label: 'CTA Title' },
      { key: 'cta_subtitle', label: 'CTA Subtitle', textarea: true },
    ],
  },
  {
    title: 'Contact & Social',
    fields: [
      { key: 'contact_address', label: 'Address', textarea: true },
      { key: 'contact_email', label: 'Email' },
      { key: 'contact_phone', label: 'Phone' },
      { key: 'social_facebook', label: 'Facebook URL' },
      { key: 'social_twitter', label: 'Twitter URL' },
      { key: 'social_instagram', label: 'Instagram URL' },
      { key: 'social_linkedin', label: 'LinkedIn URL' },
    ],
  },
];


const ManageTestimonialsSection = () => {

  const { push } = useToast();

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    role: '',
    quote: '',
    order: 0,
  });
  const [image, setImage] = useState({ file: null, url: '' });

  const load = () =>
    api
      .get('/testimonials')
      .then((res) => setTestimonials(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', role: '', quote: '', order: 0 });
    setImage({ file: null, url: '' });
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({
      name: t.name || '',
      role: t.role || '',
      quote: t.quote || '',
      order: t.order ?? 0,
    });
    setImage({ file: null, url: t.image || '' });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append('name', form.name.trim());
      data.append('role', form.role?.trim() || '');
      data.append('quote', form.quote.trim());
      data.append('order', String(Number(form.order) || 0));

      if (image.file) data.append('image', image.file);
      else if (image.url !== undefined) data.append('image', image.url);

      if (editing) {
        await api.put(`/testimonials/${editing.id}`, data);
        push('Testimonial updated');
      } else {
        await api.post('/testimonials', data);
        push('Testimonial added');
      }

      setModalOpen(false);
      setEditing(null);
      setImage({ file: null, url: '' });
      setForm({ name: '', role: '', quote: '', order: 0 });
      load();
    } catch (err) {
      push(err.response?.data?.message || 'Failed to save testimonial', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/testimonials/${confirmDelete.id}`);
      push('Testimonial deleted');
      setConfirmDelete(null);
      load();
    } catch {
      push('Failed to delete', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const sorted = useMemo(() => [...testimonials].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)), [testimonials]);

  return (
    <div className="mt-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-ink-900">Testimonials</h2>
          <p className="mt-1 text-sm text-ink-500">Add, edit, reorder and delete homepage testimonials.</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      <div className="mt-6 grid gap-5">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-40 w-full" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="card flex flex-col items-center py-12 text-ink-400">
            <Quote size={38} />
            <p className="mt-3 text-sm">No testimonials yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((t) => (
              <div key={t.id} className="card overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        {t.image ? (
                          <img
                            src={t.image}
                            alt={t.name}
                            className="h-11 w-11 rounded-full object-cover ring-1 ring-ink-100"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-ink-100">
                            <span className="text-sm font-extrabold">{(t.name || 'T').charAt(0)}</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-bold text-ink-900">{t.name}</p>
                          {t.role ? <p className="truncate text-xs text-ink-500">{t.role}</p> : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button onClick={() => openEdit(t)} className="btn-secondary !px-3 !py-2">
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(t)}
                        className="btn !bg-red-50 !px-3 !py-2 text-red-600 hover:!bg-red-100"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-ink-600">“{t.quote}”</p>

                  <div className="mt-4">
                    <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-500 ring-1 ring-ink-100">
                      Order: {t.order ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Testimonial' : 'New Testimonial'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                placeholder="e.g. Volunteer / Donor Name"
              />
            </div>
            <div>
              <label className="label">Role (optional)</label>
              <input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="input"
                placeholder="e.g. Community member"
              />
            </div>
          </div>

          <div>
            <label className="label">Quote *</label>
            <textarea
              required
              rows={4}
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
              className="input resize-none"
              placeholder="Write the testimonial quote..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Display order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="input"
              />
            </div>
            <div>
              <ImageField label="Image (optional)" value={image.url} onChange={setImage} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editing ? 'Update Testimonial' : 'Add Testimonial'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete testimonial from "${confirmDelete?.name}"? This cannot be undone.`}
      />
    </div>
  );
};

const ManageContent = () => {
  const { content, loading, refresh } = useContent();
  const { push } = useToast();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [activeGroup, setActiveGroup] = useState(0);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && Object.keys(content).length > 0) {
      setForm(content);
      setInitialized(true);
    }
  }, [content, initialized]);

  // Re-sync form if user explicitly triggers refresh (e.g. after save)
  const handleRefreshFromServer = async () => {
    try {
      const data = await refresh();
      setForm(data);
      setInitialized(true);
    } catch {
      // silent — context already keeps stale data
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/content', form);
      // Use the API response directly to update form state
      setForm(res.data);
      setInitialized(true);
      // Also update the context so other components using useContent() get fresh data
      await refresh();
      push('Content saved successfully');
    } catch (err) {
      push(err.response?.data?.message || 'Failed to save content', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageTitle title="Site Content" subtitle="Edit homepage text, statistics and contact details." />
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Group nav */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24 p-2">
            {groups.map((g, i) => (
              <button
                key={g.title}
                onClick={() => setActiveGroup(i)}
                className={`block w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-all duration-300 ${
  activeGroup === i
    ? 'bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-300'
    : 'text-ink-600 hover:bg-green-50 hover:text-green-700 dark:text-gray-300 dark:hover:bg-green-500/10 dark:hover:text-green-400'
}`}
              >
                {g.title}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="card p-6">
            <h2 className="mb-5 text-lg font-extrabold text-ink-900">{groups[activeGroup].title}</h2>
            {groups[activeGroup].visual ? (
              <div>
                <div className="mb-5 rounded-2xl border border-brand-100 bg-brand-50/70 p-4 text-sm text-ink-600">
                  <p className="font-semibold text-brand-700">Update the images used on the landing and about pages.</p>
                  <p className="mt-1">Paste an image URL for each slot below. Use clear, bright photos that match the section purpose.</p>
                </div>

                {groups[activeGroup].subsections ? (
                  <div className="space-y-6">
                    {groups[activeGroup].subsections.map((section) => (
                      <div key={section.title} className="rounded-2xl border border-ink-200 bg-ink-50/50 p-4">
                        <h3 className="text-sm font-extrabold text-ink-900">{section.title}</h3>
                        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                          {section.fields.map((f) => (
                            <div key={f.key} className="group relative overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm">
                              <div className="aspect-[4/3] overflow-hidden bg-ink-100">
                                {form[f.key] ? (
                                  <img
                                    src={form[f.key]}
                                    alt={f.label}
                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-ink-300">
                                    <ImageOff size={28} />
                                  </div>
                                )}
                              </div>
                              <div className="p-4">
                                <p className="text-sm font-semibold text-ink-900">{f.label}</p>
                                {f.description ? <p className="mt-1 text-xs leading-relaxed text-ink-500">{f.description}</p> : null}
                                <input
                                  value={form[f.key] || ''}
                                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                                  className="mt-3 w-full rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-700 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                                  placeholder="Paste image URL here..."
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {groups[activeGroup].fields.map((f) => (
                      <div key={f.key} className="group relative overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm">
                        <div className="aspect-[4/3] overflow-hidden bg-ink-100">
                          {form[f.key] ? (
                            <img
                              src={form[f.key]}
                              alt={f.label}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-ink-300">
                              <ImageOff size={28} />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <p className="text-sm font-semibold text-ink-900">{f.label}</p>
                          {f.description ? <p className="mt-1 text-xs leading-relaxed text-ink-500">{f.description}</p> : null}
                          <input
                            value={form[f.key] || ''}
                            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                            className="mt-3 w-full rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-sm text-ink-700 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                            placeholder="Paste image URL here..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {groups[activeGroup].fields.map((f) => (
                  <div key={f.key} className={f.textarea ? 'sm:col-span-2' : ''}>
                    <label className="label">{f.label}</label>
                    {f.textarea ? (
                      <textarea
                        rows={3}
                        value={form[f.key] || ''}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        className="input resize-none"
                      />
                    ) : (
                      <input
                        value={form[f.key] || ''}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        className="input"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          <ManageTestimonialsSection />
        </div>
      </div>
    </div>
  );
};

export default ManageContent;

