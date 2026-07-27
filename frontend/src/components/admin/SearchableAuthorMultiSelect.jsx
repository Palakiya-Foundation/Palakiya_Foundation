import { useMemo, useState } from 'react';

const normalize = (s) => (s ?? '').toString().toLowerCase().trim();

const SearchableAuthorMultiSelect = ({
  authors = [],
  value = [], // array of authorIds (numbers)
  onChange,
  label = 'Authors',
}) => {
  const [query, setQuery] = useState('');

  const selectedSet = useMemo(() => new Set((value || []).map((v) => Number(v)).filter(Boolean)), [value]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return authors;
    return authors.filter((a) => normalize(a.name).includes(q) || normalize(a.designation).includes(q));
  }, [authors, query]);

  const toggleAuthor = (authorId) => {
    const id = Number(authorId);
    const next = new Set(selectedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange?.(Array.from(next));
  };

  const selectedAuthors = useMemo(() => {
    if (!value?.length) return [];
    const map = new Map(authors.map((a) => [a.id, a]));
    return value.map((id) => map.get(Number(id))).filter(Boolean);
  }, [authors, value]);

  return (
    <div>
      <label className="label">{label}</label>

      <div className="rounded-xl border border-ink-100 bg-white p-3">
        <div className="flex flex-wrap gap-2">
          {selectedAuthors.length === 0 ? (
            <span className="text-sm text-ink-400">No authors selected.</span>
          ) : (
            selectedAuthors.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => toggleAuthor(a.id)}
                className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100 hover:bg-brand-100"
                title="Remove"
              >
                <span className="truncate max-w-[10rem]">{a.name}</span>
                <span className="text-ink-400">×</span>
              </button>
            ))
          )}
        </div>

        <div className="mt-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input"
            placeholder="Search authors..."
          />
        </div>

        <div className="mt-3 max-h-52 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-ink-400">No authors found.</div>
          ) : (
            <div className="grid gap-2">
              {filtered.map((a) => {
                const checked = selectedSet.has(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggleAuthor(a.id)}
                    className={`flex w-full items-start justify-between gap-3 rounded-xl border px-3 py-2 text-left transition ${
                      checked
                        ? 'border-brand-200 bg-brand-50'
                        : 'border-ink-100 bg-white hover:bg-ink-50'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold text-ink-900">{a.name}</div>
                      {a.designation && <div className="truncate text-xs text-ink-500">{a.designation}</div>}
                    </div>
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-xs font-extrabold ${
                        checked ? 'bg-brand-600 text-white' : 'border border-ink-200 text-ink-400'
                      }`}
                    >
                      {checked ? '✓' : ''}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchableAuthorMultiSelect;

