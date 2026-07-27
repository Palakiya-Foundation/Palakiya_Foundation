import { useEffect, useState } from 'react';
import { Target, Eye, Award, Heart, Users2, Sprout, ArrowRight, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import { useContent } from '../context/ContentContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Reveal from '../components/Reveal.jsx';
import CountUp from '../components/CountUp.jsx';
import CTASection from '../components/CTASection.jsx';

const About = () => {
  const { content } = useContent();
  const { theme } = useTheme();
  const [team, setTeam] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    api.get('/team')
      .then((res) => setTeam(res.data))
      .catch(() => {})
      .finally(() => setLoadingTeam(false));
  }, []);

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

  const missionSectionStyle = getSectionBackgroundStyle('hero_img_2', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=70');
  const teamSectionStyle = getSectionBackgroundStyle('hero_img_3', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=70');

  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="A living story of change"
        subtitle="For over a decade we have partnered with marginalised communities to deliver lasting, dignified change."
      />

      {/* Story */}
      <section className="section">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <img
              src={content.about_page_image || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=900&q=80'}
              alt="Our journey"
              className="rounded-3xl object-cover shadow-soft"
            />
          </Reveal>
          <div>
            <SectionHeading
              center={false}
              eyebrow="Our Background"
              title="Built on hope, driven by community"
              subtitle={content.about_intro}
            />
            <p className="mt-5 text-ink-500 leading-relaxed">
              What began as a small group of volunteers has grown into a movement spanning
              thousands of villages. We believe that sustainable change is only possible when
              communities lead the way — we are the facilitators, they are the changemakers.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { v: content.stat_people, l: 'People reached' },
                { v: content.stat_villages, l: 'Villages covered' },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-brand-50 p-5">
                  <p className="text-2xl font-extrabold text-brand-700">
                    <CountUp value={s.v} suffix="+" />
                  </p>
                  <p className="text-sm text-ink-500">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section relative" style={missionSectionStyle}>
        <div className="container-x grid gap-6 md:grid-cols-2">
          {[
            { icon: Target, title: 'Our Mission', text: content.mission, grad: 'from-brand-500 to-emerald-600' },
            { icon: Eye, title: 'Our Vision', text: content.vision, grad: 'from-ocean-500 to-ocean-700' },
          ].map((m) => (
            <Reveal key={m.title}>
              <div className="card relative h-full overflow-hidden p-8">
                <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${m.grad} opacity-10`} />
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${m.grad} text-white shadow-glow`}>
                  <m.icon size={26} />
                </span>
                <h3 className="mt-5 text-2xl font-extrabold text-ink-900">{m.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-500">{m.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="What Drives Us"
            title="Our core values"
            subtitle="The principles that guide every decision and every program we run."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Heart, t: 'Compassion', d: 'Leading with empathy and dignity.' },
              { icon: Award, t: 'Integrity', d: 'Full transparency and accountability.' },
              { icon: Users2, t: 'Inclusion', d: 'Leaving absolutely no one behind.' },
              { icon: Sprout, t: 'Sustainability', d: 'Change that lasts for generations.' },
            ].map((v, i) => (
              <Reveal key={v.t} delay={i * 0.08}>
                <div className="card-hover h-full p-6 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <v.icon size={26} />
                  </span>
                  <h3 className="mt-4 font-bold text-ink-900">{v.t}</h3>
                  <p className="mt-2 text-sm text-ink-500">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section relative" style={teamSectionStyle}>
        <div className="container-x">
          <SectionHeading
            eyebrow="Our People"
            title="Meet the team behind the mission"
            subtitle="Dedicated individuals working tirelessly to create lasting impact."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loadingTeam ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-72 w-full rounded-2xl" />
              ))
            ) : team.length === 0 ? (
              <p className="col-span-full text-center text-sm text-ink-400">No team members yet.</p>
            ) : (
              team.map((m, i) => (
                <Reveal key={m.id} delay={i * 0.08}>
                  <div className="card-hover group overflow-hidden text-center">
                    <div className="relative h-72 overflow-hidden bg-ink-100">
                      {m.image ? (
                        <img
                          src={m.image}
                          alt={m.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageOff size={40} className="text-ink-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-ink-900">{m.name}</h3>
                      {m.role && <p className="text-sm text-brand-600">{m.role}</p>}
                      {m.bio && <p className="mt-2 text-xs text-ink-500 line-clamp-2">{m.bio}</p>}
                    </div>
                  </div>
                </Reveal>
              ))
            )}
          </div>
          <div className="mt-10 text-center">
            <Link to="/join-us" className="btn-primary">
              Join our team
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
};

export default About;
