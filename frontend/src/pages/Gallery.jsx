import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/client.js';
import PageHeader from '../components/PageHeader.jsx';
import { SkeletonImage } from '../components/Skeletons.jsx';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('All');
  const [lightbox, setLightbox] = useState(null); // index

  useEffect(() => {
    api
      .get('/gallery')
      .then((res) => setImages(res.data))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(images.map((i) => i.category))];
  const filtered = active === 'All' ? images : images.filter((i) => i.category === active);

  const close = useCallback(() => setLightbox(null), []);
  const next = useCallback(
    () => setLightbox((i) => (i + 1) % filtered.length),
    [filtered.length]
  );
  const prev = useCallback(
    () => setLightbox((i) => (i - 1 + filtered.length) % filtered.length),
    [filtered.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, close, next, prev]);

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Moments of impact, captured"
        subtitle="A glimpse into our events, campaigns and field work across communities."
      />

      <section className="section">
        <div className="container-x">
          {!loading && (
            <div className="mb-10 flex flex-wrap justify-center gap-3">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    active === c
                      ? 'bg-brand-600 text-white shadow-glow'
                      : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:ring-brand-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <SkeletonImage key={i} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((img, i) => (
                <motion.button
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setLightbox(i)}
                  className="group relative overflow-hidden rounded-2xl shadow-card aspect-[3/2]"
                >
                  <img
                    src={img.image}
                    alt={img.title || 'Gallery'}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink-900/70 to-transparent opacity-0 transition group-hover:opacity-100">
                    <div className="p-4 text-left">
                      <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                        {img.category}
                      </span>
                      {img.title && (
                        <p className="mt-2 text-sm font-semibold text-white">{img.title}</p>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/95 p-4"
            onClick={close}
          >
            <button className="absolute right-5 top-5 text-white/80 hover:text-white" onClick={close}>
              <X size={30} />
            </button>
            <button
              className="absolute left-4 text-white/80 hover:text-white sm:left-8"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
            >
              <ChevronLeft size={40} />
            </button>
            <motion.img
              key={filtered[lightbox].id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={filtered[lightbox].image}
              alt={filtered[lightbox].title || 'Gallery'}
              className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-4 text-white/80 hover:text-white sm:right-8"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
            >
              <ChevronRight size={40} />
            </button>
            {filtered[lightbox].title && (
              <p className="absolute bottom-6 text-center text-sm text-white/80">
                {filtered[lightbox].title}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;
