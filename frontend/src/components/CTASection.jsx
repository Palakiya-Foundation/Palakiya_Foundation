import { Link } from 'react-router-dom';
import { ArrowRight, HandHeart } from 'lucide-react';
import { useContent } from '../context/ContentContext.jsx';
import { resolveImage } from '../api/client.js';
import { useTheme } from '../context/ThemeContext.jsx';
import Reveal from './Reveal.jsx';

const CTASection = () => {
  const { content } = useContent();
  const { theme } = useTheme();
  const ctaImage = resolveImage(content?.hero_img_4 || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=70');
  const ctaBackgroundStyle = {
    backgroundImage:
      theme === 'dark'
        ? `linear-gradient(to bottom, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.94)), url(${ctaImage})`
        : `linear-gradient(to bottom, rgba(255, 255, 255, 0.82), rgba(240, 253, 244, 0.9)), url(${ctaImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };
  return (
    <section className="section">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-emerald-600 to-ocean-700 px-8 py-16 text-center shadow-glow sm:px-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
              style={ctaBackgroundStyle}
            />
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-ocean-400/20 blur-3xl" />
            <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
              <HandHeart size={28} />
            </span>
            <h2 className="relative mx-auto mt-6 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              {content.cta_title || 'Join us in creating lasting change'}
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/85">
              {content.cta_subtitle ||
                'Every contribution brings us closer to a healthier, more equitable world.'}
            </p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="btn bg-white text-brand-700 shadow-lg hover:-translate-y-0.5 hover:bg-ink-50"
              >
                Support Our Cause
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/programs"
                className="btn bg-white/10 text-white ring-1 ring-white/40 backdrop-blur hover:bg-white/20"
              >
                Explore Programs
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CTASection;
