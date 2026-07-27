import { useRef, useState } from 'react';
import { Upload, Link2, ImageIcon } from 'lucide-react';

// Image input supporting either file upload or pasted URL.
// Calls onChange({ file, url }) — only one will be set.
const ImageField = ({ label = 'Image', value, onChange }) => {
  const [mode, setMode] = useState('url'); // 'url' | 'file'
  const [preview, setPreview] = useState(value || '');
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange({ file, url: '' });
  };

  const handleUrl = (e) => {
    const url = e.target.value;
    setPreview(url);
    onChange({ file: null, url });
  };

  return (
    <div>
      <label className="label">{label}</label>
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            mode === 'url' ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600'
          }`}
        >
          <Link2 size={14} /> URL
        </button>
        <button
          type="button"
          onClick={() => setMode('file')}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            mode === 'file' ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600'
          }`}
        >
          <Upload size={14} /> Upload
        </button>
      </div>

      {mode === 'url' ? (
        <input
          type="url"
          defaultValue={value?.startsWith('http') ? value : ''}
          onChange={handleUrl}
          className="input"
          placeholder="https://images.unsplash.com/..."
        />
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-200 py-6 text-sm font-semibold text-ink-500 transition hover:border-brand-400 hover:text-brand-600"
        >
          <Upload size={18} /> Choose an image (max 5MB)
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </button>
      )}

      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="mt-3 h-32 w-full rounded-xl object-cover ring-1 ring-ink-100"
        />
      ) : (
        <div className="mt-3 flex h-32 w-full items-center justify-center rounded-xl bg-ink-50 text-ink-300">
          <ImageIcon size={28} />
        </div>
      )}
    </div>
  );
};

export default ImageField;
