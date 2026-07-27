import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../api/client.js';
import DynamicIcon from '../components/DynamicIcon.jsx';
import CTASection from '../components/CTASection.jsx';
import Reveal from '../components/Reveal.jsx';

const ProgramDetail = () => {
  const { slug } = useParams();
  const [program, setProgram] = useState(null);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/programs/${slug}`)
      .then((res) => {
        setProgram(res.data);
        return api.get('/programs');
      })
      .then((res) => setOthers(res.data.filter((p) => p.slug !== slug).slice(0, 3)))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container-x pt-40 pb-20">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton mt-6 h-80 w-full" />
        <div className="skeleton mt-6 h-4 w-full" />
        <div className="skeleton mt-2 h-4 w-3/4" />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="container-x pt-40 pb-20 text-center">
        <h1 className="text-2xl font-bold text-ink-900">Program not found</h1>
        <Link to="/programs" className="btn-primary mt-6">
          Back to programs
        </Link>
      </div>
    );
  }

  const highlights = [
    'Community-led implementation',
    'Trained local field workers',
    'Measurable, lasting impact',
    'Transparent reporting',
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-hero-grid pt-32 pb-12 sm:pt-40">
        <div className="container-x">
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-brand-600"
          >
            <ArrowLeft size={16} /> All programs
          </Link>
          <div className="mt-6 flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-ocean-600 text-white shadow-glow">
              <DynamicIcon name={program.icon} size={26} />
            </span>
            <span className="chip">{program.category}</span>
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-ink-900 sm:text-5xl">
            {program.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-500">{program.summary}</p>
        </div>
      </section>

      <section className="pb-8">
        <div className="container-x">
          {program.image && (
            <Reveal>
              <img
                src={program.image}
                alt={program.title}
                className="h-[28rem] w-full rounded-3xl object-cover shadow-soft"
              />
            </Reveal>
          )}
        </div>
      </section>

      <section className="section pt-10">
        <div className="container-x grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="prose-ngo space-y-5 text-[17px] leading-relaxed text-ink-600">
              {program.description.split('\n').filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-1">
            <div className="card sticky top-28 p-6">
              <h3 className="font-bold text-ink-900">Program highlights</h3>
              <ul className="mt-4 space-y-3">
                {highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-ink-600">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-500" />
                    {h}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="btn-primary mt-6 w-full">
                Support this program
                <ArrowRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {others.length > 0 && (
        <section className="bg-photo-soft section relative">
          <div className="container-x">
            <h2 className="text-2xl font-extrabold text-ink-900">More programs</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((p) => (
                <Link
                  key={p.id}
                  to={`/programs/${p.slug}`}
                  className="card-hover group overflow-hidden"
                >
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-40 w-full object-cover transition group-hover:scale-105"
                    />
                  )}
                  <div className="p-5">
                    <span className="text-xs font-semibold text-brand-600">{p.category}</span>
                    <h3 className="mt-1 font-bold text-ink-900 group-hover:text-brand-700">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
};

export default ProgramDetail;
