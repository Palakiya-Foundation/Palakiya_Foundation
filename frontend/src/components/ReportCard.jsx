import { Link } from 'react-router-dom';
import { Calendar, ArrowUpRight } from 'lucide-react';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const ReportCard = ({ report }) => (
  <Link to={`/reports/${report.slug}`} className="card-hover group flex flex-col overflow-hidden">
    <div className="relative h-52 overflow-hidden">
      {report.image ? (
        <img
          src={report.image}
          alt={report.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-ocean-100 to-brand-100" />
      )}
      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ocean-700 backdrop-blur">
        {report.category}
      </span>
    </div>
      <div className="flex flex-1 flex-col p-5">
      <div className="flex items-center gap-2 text-xs text-ink-400">
        <Calendar size={14} />
        <span>{formatDate(report.createdAt)}</span>
        <span>•</span>
        <span>
          {Array.isArray(report.authors) && report.authors.length > 0
            ? (report.authors[0].author?.name || report.authors[0].name || 'Unknown author')
            : report.author}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-bold leading-snug text-ink-900 transition group-hover:text-brand-700 line-clamp-2">
        {report.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500 line-clamp-3">
        {report.excerpt}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
        Read report
        <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </div>
  </Link>
);

export default ReportCard;

