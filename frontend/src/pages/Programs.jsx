import { useEffect, useState } from 'react';
import api from '../api/client.js';
import PageHeader from '../components/PageHeader.jsx';
import ProgramCard from '../components/ProgramCard.jsx';
import { SkeletonGrid } from '../components/Skeletons.jsx';
import CTASection from '../components/CTASection.jsx';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('All');

  useEffect(() => {
    api
      .get('/programs')
      .then((res) => setPrograms(res.data))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(programs.map((p) => p.category))];
  const filtered = active === 'All' ? programs : programs.filter((p) => p.category === active);

  return (
    <>
      <PageHeader
        eyebrow="Our Programs"
        title="Initiatives that create real impact"
        subtitle="Explore the diverse range of programs through which we serve communities across health, education and livelihood."
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
            <SkeletonGrid count={6} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProgramCard key={p.id} program={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
};

export default Programs;
