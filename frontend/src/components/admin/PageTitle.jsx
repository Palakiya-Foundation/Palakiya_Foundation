import { Plus } from 'lucide-react';

// Standard admin page header with title + primary action
const PageTitle = ({ title, subtitle, actionLabel, onAction }) => (
  <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="text-2xl font-extrabold text-ink-900">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
    </div>
    {actionLabel && (
      <button onClick={onAction} className="btn-primary">
        <Plus size={18} /> {actionLabel}
      </button>
    )}
  </div>
);

export default PageTitle;
