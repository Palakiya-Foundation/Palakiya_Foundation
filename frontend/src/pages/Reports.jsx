import { useEffect, useState } from 'react';
import api from '../api/client.js';
import PageHeader from '../components/PageHeader.jsx';
import ReportCard from '../components/ReportCard.jsx';
import { SkeletonGrid } from '../components/Skeletons.jsx';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('All');

  useEffect(() => {
    api
      .get('/reports')
      .then((res) => setReports(res.data))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(reports.map((r) => r.category))];
  const filtered = active === 'All' ? reports : reports.filter((r) => r.category === active);

  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="Research, impact & programme reports"
        subtitle="In-depth analysis, needs assessments and outcome reports from our field teams."
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
          ) : filtered.length === 0 ? (
            <p className="text-center text-ink-500">No reports found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((r) => (
                <ReportCard key={r.id} report={r} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Reports;

