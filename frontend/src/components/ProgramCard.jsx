import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import DynamicIcon from './DynamicIcon.jsx';

const ProgramCard = ({ program }) => (
  <Link
    to={`/programs/${program.slug}`}
    className="card-hover group flex flex-col overflow-hidden"
  >
    <div className="relative h-48 overflow-hidden">
      {program.image ? (
        <img
          src={program.image}
          alt={program.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-brand-100 to-ocean-100" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/40 to-transparent" />
      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 backdrop-blur">
        {program.category}
      </span>
      <div className="absolute -bottom-6 left-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand-600 shadow-card ring-1 ring-ink-100">
        <DynamicIcon name={program.icon} size={22} />
      </div>
    </div>
    <div className="flex flex-1 flex-col p-5 pt-8">
      <h3 className="text-lg font-bold text-ink-900 transition group-hover:text-brand-700">
        {program.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500 line-clamp-3">
        {program.summary}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
        Learn more
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </span>
    </div>
  </Link>
);

export default ProgramCard;
