import { Link } from 'react-router-dom';
import { Calendar, ArrowUpRight } from 'lucide-react';
import { resolveImage } from '../api/client.js';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const ArticleCard = ({ article }) => (
  <Link to={`/articles/${article.slug}`} className="card-hover group flex flex-col overflow-hidden">
    <div className="relative h-52 overflow-hidden">
      {article.image ? (
        <img
          src={resolveImage(article.image)}
          alt={article.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-ocean-100 to-brand-100" />
      )}
      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ocean-700 backdrop-blur">
        {article.category}
      </span>
    </div>
      <div className="flex flex-1 flex-col p-5">
      <div className="flex items-center gap-2 text-xs text-ink-400">
        <Calendar size={14} />
        <span>{formatDate(article.createdAt)}</span>
        <span>•</span>
        <span>
          {Array.isArray(article.authors) && article.authors.length > 0
            ? (article.authors[0].author?.name || article.authors[0].name || 'Unknown author')
            : article.author}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-bold leading-snug text-ink-900 transition group-hover:text-brand-700 line-clamp-2">
        {article.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500 line-clamp-3">
        {article.excerpt}
      </p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
        Read article
        <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </div>
  </Link>
);

export default ArticleCard;
