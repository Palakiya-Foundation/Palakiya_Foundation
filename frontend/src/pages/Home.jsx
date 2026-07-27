import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Quote,
  ShieldCheck,
  HeartHandshake,
  Globe2,
  Star,
  Trophy,
  HandHeart,
} from 'lucide-react';
import api from '../api/client.js';
import { useContent } from '../context/ContentContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import CountUp from '../components/CountUp.jsx';
import ProgramCard from '../components/ProgramCard.jsx';
import ArticleCard from '../components/ArticleCard.jsx';
import ReportCard from '../components/ReportCard.jsx';
import CTASection from '../components/CTASection.jsx';
import { SkeletonGrid } from '../components/Skeletons.jsx';

const Home = () => {
  const { content } = useContent();
  const { theme } = useTheme();
  const [programs, setPrograms] = useState([]);
  const [articles, setArticles] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/programs?featured=true'),
      api.get('/articles'),
      api.get('/testimonials'),
      api.get('/reports'),
    ])
      .then(([p, a, t, ach]) => {
        setPrograms(p.data.slice(0, 3));
        setArticles(a.data.slice(0, 3));
        setTestimonials(t.data);
        setReports(ach.data.slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { value: content.stat_people, label: content.stat_people_label || 'People Reached' },
    { value: content.stat_villages, label: content.stat_villages_label || 'Villages Covered' },
    { value: content.stat_programs, label: content.stat_programs_label || 'Programs Conducted' },
    { value: content.stat_volunteers, label: content.stat_volunteers_label || 'Active Volunteers' },
  ];

  const values = [
    { icon: ShieldCheck, title: 'Transparency', desc: 'Every rupee is tracked and reported with full accountability.' },
    { icon: HeartHandshake, title: 'Compassion', desc: 'We lead with empathy and dignity in everything we do.' },
    { icon: Globe2, title: 'Sustainability', desc: 'We build lasting change that communities can sustain.' },
  ];

  const getSectionBackgroundStyle = (imageKey, fallback) => {
    const image = content?.[imageKey] || fallback;
    return {
      backgroundImage:
        theme === 'dark'
          ? `linear-gradient(to bottom, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.94)), url(${image})`
          : `linear-gradient(to bottom, rgba(255, 255, 255, 0.88), rgba(248, 250, 252, 0.95)), url(${image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  };

  const heroBackgroundStyle = getSectionBackgroundStyle('hero_img_1', 'https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=1600&q=70');
  const programsSectionStyle = getSectionBackgroundStyle('hero_img_2', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=70');
  const articlesSectionStyle = getSectionBackgroundStyle('hero_img_3', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=70');

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="bg-photo-hero relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28" style={heroBackgroundStyle}>
        <div className="pointer-events-none absolute inset-0 bg-hero-grid" />
        <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -left-20 h-72 w-72 rounded-full bg-ocean-200/40 blur-3xl" />

        <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="chip"
            >
              <Sparkles size={14} />
              {content.hero_badge || 'Hope in Action'}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-5 text-4xl font-extrabold leading-[1.1] text-ink-900 sm:text-5xl lg:text-6xl"
            >
              {content.hero_title || 'Empowering Communities for a Healthier Tomorrow'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-ink-500"
            >
              {content.hero_subtitle ||
                'We build healthier, more equitable and self-reliant communities — leaving no one behind.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/contact" className="btn-primary">
                {content.hero_cta_primary || 'Support Our Cause'}
                <ArrowRight size={18} />
              </Link>
              <Link to="/programs" className="btn-secondary">
                {content.hero_cta_secondary || 'Explore Programs'}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex items-center gap-4"
            >
              <div className="flex -space-x-3">
                {[
                  content.hero_avatar_1 || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
                  content.hero_avatar_2 || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
                  content.hero_avatar_3 || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80',
                  content.hero_avatar_4 || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Volunteer"
                    className="h-10 w-10 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="font-semibold text-ink-700">
                  Trusted by {Number(content.stat_volunteers || 5000).toLocaleString()}+ volunteers & donors
                </p>
              </div>
            </motion.div>
          </div>

          {/* Hero image collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src={content.hero_img_1 || 'https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=600&q=80'}
                  alt="Community"
                  className="h-48 w-full rounded-2xl object-cover shadow-card sm:h-56"
                />
                <img
                  src={content.hero_img_2 || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80'}
                  alt="Women empowerment"
                  className="h-36 w-full rounded-2xl object-cover shadow-card"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img
                  src={content.hero_img_3 || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80'}
                  alt="Education"
                  className="h-36 w-full rounded-2xl object-cover shadow-card"
                />
                <img
                  src={content.hero_img_4 || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80'}
                  alt="Health"
                  className="h-48 w-full rounded-2xl object-cover shadow-card sm:h-56"
                />
              </div>
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink-100"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                <HeartHandshake size={22} />
              </span>
              <div>
                <p className="text-xl font-extrabold text-ink-900">
                  <CountUp value={content.stat_people || 750000} suffix="+" />
                </p>
                <p className="text-xs font-medium text-ink-500">Lives impacted</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="relative -mt-6 pb-4">
        <div className="container-x">
          <Reveal>
            <div className="grid gap-px overflow-hidden rounded-3xl bg-ink-100 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-white px-6 py-8 text-center">
                  <p className="text-3xl font-extrabold gradient-text sm:text-4xl">
                    <CountUp value={s.value} suffix="+" />
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-ink-500">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== INTRO / VALUES ===== */}
      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <img
                src={content.home_intro_image || 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=80'}
                alt="Our work"
                className="rounded-3xl object-cover shadow-soft"
              />
              <div className="absolute -right-4 -top-4 hidden rounded-2xl bg-gradient-to-br from-brand-500 to-ocean-600 p-5 text-white shadow-glow sm:block">
                <p className="text-3xl font-extrabold">{Number(content.stat_years || 10)}+</p>
                <p className="text-xs">Years of impact</p>
              </div>
            </div>
          </Reveal>
          <div>
            <SectionHeading
              center={false}
              eyebrow="Who We Are"
              title="A living story of change, written by communities"
              subtitle={content.about_intro}
            />
            <div className="mt-8 space-y-4">
              {values.map((v) => (
                <Reveal key={v.title}>
                 <div className="group flex items-start gap-4 rounded-2xl p-4 transition-all duration-300 hover:bg-brand-50 dark:hover:bg-white/5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-ocean-600 text-white">
                      <v.icon size={22} />
                    </span>
                    <div>
                      <h3 className="font-bold text-ink-900 transition-colors duration-300 group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-400">
  {v.title}
</h3>
                      <p className="mt-0.5 text-sm text-ink-500">{v.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROGRAMS ===== */}
      <section className="section relative" style={programsSectionStyle}>
        <div className="container-x">
          <SectionHeading
            eyebrow="Our Initiatives"
            title="Programs that transform lives"
            subtitle="From public health to education, our initiatives address the root causes of inequality."
          />
          <div className="mt-12">
            {loading ? (
              <SkeletonGrid count={3} />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {programs.map((p) => (
                  <ProgramCard key={p.id} program={p} />
                ))}
              </div>
            )}
          </div>
          <div className="mt-10 text-center">
            <Link to="/programs" className="btn-dark">
              View all programs
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      {testimonials.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeading
              eyebrow="Success Stories"
              title="Voices from the communities we serve"
              subtitle="Real stories of resilience, hope and transformation."
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={t.id} delay={i * 0.1}>
                  <figure className="card-hover flex h-full flex-col p-7">
                    <Quote size={32} className="text-brand-200" />
                    <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-600">
                      “{t.quote}”
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3 border-t border-ink-100 pt-5">
                      {t.image ? (
                        <img
                          src={t.image}
                          alt={t.name}
                          className="h-11 w-11 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                          {t.name.charAt(0)}
                        </span>
                      )}
                      <div>
                        <p className="font-bold text-ink-900">{t.name}</p>
                        {t.role && <p className="text-xs text-ink-500">{t.role}</p>}
                      </div>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== REPORTS ===== */}
      {reports.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeading
              eyebrow="Our Reports"
              title="Research, impact & programme reports"
              subtitle="In-depth analysis, needs assessments and outcome reports from our field teams."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((r) => (
                <ReportCard key={r.id} report={r} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link to="/reports" className="btn-dark">
                View all reports
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== LATEST ARTICLES ===== */}
      <section className="section relative" style={articlesSectionStyle}>
        <div className="container-x">
          <SectionHeading
            eyebrow="From the Blog"
            title="Insights, awareness & impact stories"
            subtitle="Stay informed with the latest from our field teams and health experts."
          />
          <div className="mt-12">
            {loading ? (
              <SkeletonGrid count={3} />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            )}
          </div>
          <div className="mt-10 text-center">
            <Link to="/articles" className="btn-dark">
              Read all articles
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== JOIN US CTA ===== */}
      <section className="section pt-0">
        <div className="container-x">
          <Reveal>
            <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-ink-900 p-8 sm:p-12 lg:grid-cols-2">
              <div>
                <span className="chip !bg-white/10 !text-white">
                  <HandHeart size={14} /> Join Us
                </span>
                <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                  Volunteer with us and be the change
                </h2>
                <p className="mt-4 max-w-md leading-relaxed text-ink-300">
                  Give your time and skills to causes that matter. Apply to join our growing
                  community of volunteers making a real difference every day.
                </p>
                <div className="mt-7 flex flex-wrap gap-4">
                  <Link to="/join-us" className="btn bg-white text-ink-900 hover:-translate-y-0.5 hover:bg-ink-20">
                    Become a Volunteer
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/reports"
                    className="btn bg-white/10 text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/20"
                  >
                    <Trophy size={16} /> Our Reports
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src={content.join_us_img_1 || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=600&q=80'}
                  alt="Volunteers at work"
                  className="h-44 w-full rounded-2xl object-cover sm:h-56"
                />
                <img
                  src={content.join_us_img_2 || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80'}
                  alt="Community gathering"
                  className="mt-6 h-44 w-full rounded-2xl object-cover sm:h-56"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
};

export default Home;