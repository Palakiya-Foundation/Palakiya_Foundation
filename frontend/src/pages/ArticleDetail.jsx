import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import api, { resolveImage } from '../api/client.js';
import ArticleCard from '../components/ArticleCard.jsx';
import Reveal from '../components/Reveal.jsx';
import Modal from '../components/admin/Modal.jsx';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Ensure modal list always reflects the currently viewed article
  const [currentSlug, setCurrentSlug] = useState(slug);

  const [authorModalOpen, setAuthorModalOpen] = useState(false);

  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [selectedAuthorLoading, setSelectedAuthorLoading] = useState(false);
  const [selectedAuthorError, setSelectedAuthorError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setCurrentSlug(slug);
    api
      .get(`/articles/${slug}`)
      .then((res) => {
        setArticle(res.data);
        return api.get('/articles');
      })
      .then((res) => setRelated(res.data.filter((a) => a.slug !== slug).slice(0, 3)))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);



  if (loading) {
    return (
      <div className="container-x pt-40 pb-20">
        <div className="skeleton h-6 w-40" />
        <div className="skeleton mt-6 h-10 w-3/4" />
        <div className="skeleton mt-6 h-96 w-full" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container-x pt-40 pb-20 text-center">
        <h1 className="text-2xl font-bold text-ink-900">Article not found</h1>
        <Link to="/articles" className="btn-primary mt-6">
          Back to articles
        </Link>
      </div>
    );
  }

  return (
    <>
      <Modal
        open={authorModalOpen}
        onClose={() => {
          setAuthorModalOpen(false);
          setSelectedAuthor(null);
          setSelectedAuthorError(false);
        }}
        title={selectedAuthor?.name || 'Author'}
        size="md"
      >
        {selectedAuthorLoading ? (
          <div className="space-y-3">
            <div className="skeleton h-6 w-40" />
            <div className="skeleton h-24 w-24 rounded-full" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-full" />
          </div>
        ) : selectedAuthorError ? (
          <div className="py-6 text-center text-ink-500">Failed to load author.</div>
        ) : selectedAuthor ? (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              {selectedAuthor.photo ? (
                <img
                  src={resolveImage(selectedAuthor.photo)}
                  alt={selectedAuthor.name}
                  className="h-24 w-24 shrink-0 rounded-full object-cover shadow-soft"
                />
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-ink-50 text-ink-300">
                  <User size={28} />
                </div>
              )}
              <div>
                <div className="text-xl font-extrabold text-ink-900">{selectedAuthor.name}</div>
                {selectedAuthor.designation && (
                  <div className="mt-1 text-sm font-semibold text-ink-500">{selectedAuthor.designation}</div>
                )}
              </div>
            </div>

            {selectedAuthor.bio && <p className="text-ink-700">{selectedAuthor.bio}</p>}

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                {selectedAuthor.totalPublishedCount} published article(s)
              </span>
            </div>

            <div>
              <h4 className="text-base font-extrabold text-ink-900">Other Contributions</h4>

              <div className="mt-3 space-y-3">
                {Array.isArray(selectedAuthor.articles) && selectedAuthor.articles.length > 0 ? (
                  selectedAuthor.articles
                    .map((a) => (

                      <div key={a.id} className="flex gap-3 rounded-xl border border-ink-100 bg-white p-3">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-ink-50">
                          {a.image ? (
                            <img src={resolveImage(a.image)} alt={a.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-ink-300">—</div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/articles/${a.slug}`}
                            className="line-clamp-1 text-sm font-bold text-brand-700 hover:text-brand-800"
                            title={a.title}
                          >
                            {a.title}
                          </Link>
                          <div className="mt-1 line-clamp-2 text-xs text-ink-500">{a.excerpt}</div>
                          <div className="mt-2">
                            <Link
                              to={`/articles/${a.slug}`}
                              className="text-xs font-semibold text-brand-700 hover:text-brand-800"
                            >
                              Read More →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-ink-500">No other contributions available.</p>
                )}
              </div>
            </div>

          </div>
        ) : null}
      </Modal>

      <article className="pt-32 sm:pt-40">
        <div className="container-x max-w-3xl">
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-brand-600"
          >
            <ArrowLeft size={16} /> All articles
          </Link>
          <span className="chip mt-6">
            <Tag size={13} /> {article.category}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl">
            {article.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-ink-500">
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <User size={15} />



              {Array.isArray(article.authors) && article.authors.length > 0 ? (
                article.authors.map((a, idx) => {
                  const id = a.authorId ?? a.author?.id;

                  const authorName = a.author?.name ?? a.name ?? article.author;
                  if (!id) return null;
                  return (
                    <button
                      key={id ?? idx}
                      type="button"
                      className="text-brand-700 font-semibold hover:text-brand-800 underline underline-offset-4"
                      onClick={async () => {
                        setSelectedAuthorLoading(true);


                        setSelectedAuthorError(false);
                        setSelectedAuthor({ id, name: authorName });
                        setAuthorModalOpen(true);

                        try {
                          setSelectedAuthorLoading(true);
                          const res = await api.get(`/authors/${id}/published`, {
                            params: { excludeSlug: slug },
                          });
                          setSelectedAuthor(res.data);
                          setSelectedAuthorError(false);
                        } catch (err) {
                          setSelectedAuthorError(true);
                          // keep previous author data if already loaded
                          // and surface backend message in console
                          console.error('Failed to load author published articles', err?.response?.data || err);
                        } finally {
                          setSelectedAuthorLoading(false);
                        }



                      }}

                    >
                      {authorName}
                      {idx < article.authors.length - 1 ? ',' : ''}
                    </button>
                  );
                })
              ) : (
                <span>{article.author}</span>
              )}
            </span>


            <span className="flex items-center gap-1.5">
              <Calendar size={15} /> {formatDate(article.createdAt)}
            </span>
          </div>
        </div>

        {article.image && (
          <div className="container-x mt-8 max-w-4xl">
            <Reveal>
              <img
                src={resolveImage(article.image)}
                alt={article.title}
                className="h-[26rem] w-full rounded-3xl object-cover shadow-soft"
              />
            </Reveal>
          </div>
        )}

        <div className="container-x mt-10 max-w-3xl">
           <p className="border-l-4 border-brand-400 bg-brand-50/60 dark:bg-brand-900/20 px-5 py-4 text-lg font-medium italic text-ink-700 dark:text-gray-200">
            {article.excerpt}
          </p>
          <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-ink-600">
            {article.content.split('\n').filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start gap-3 rounded-2xl bg-brand-50/70 dark:bg-zinc-900 p-5 ring-1 ring-brand-100 dark:ring-zinc-700 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">
  Detailed version
</p>
              <p className="mt-1 text-sm text-ink-600 dark:text-gray-300">
  Access the complete full report from here.
</p>
            </div>
            <div>
              {article.driveLink ? (
                <a href={article.driveLink} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white transition-all hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400">
                  Open full report
                </a>
              ) : (
                <Link to={`/articles/${article.slug}`} className="inline-flex items-center rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white transition-all hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400">
                  Open full report
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-photo-soft section relative mt-12">
          <div className="container-x">
            <h2 className="text-2xl font-extrabold text-ink-900">Related articles</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ArticleDetail;

