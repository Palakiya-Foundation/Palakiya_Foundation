import { useContent } from '../context/ContentContext.jsx';
import { resolveImage } from '../api/client.js';
import { useTheme } from '../context/ThemeContext.jsx';
import Reveal from './Reveal.jsx';

// Inner-page hero banner
const PageHeader = ({ eyebrow, title, subtitle }) => {
  const { content } = useContent();
  const { theme } = useTheme();
  const heroBackgroundImage = resolveImage(content?.hero_img_1 || 'https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=1600&q=70');
  const heroBackgroundStyle = {
    backgroundImage:
      theme === 'dark'
        ? `linear-gradient(to bottom, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.92) 55%, rgba(15, 23, 42, 0.97)), url(${heroBackgroundImage})`
        : `linear-gradient(to bottom, rgba(255, 255, 255, 0.88), rgba(240, 253, 244, 0.9) 55%, rgba(255, 255, 255, 0.97)), url(${heroBackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
  <section className="bg-photo-hero relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20" style={heroBackgroundStyle}>
    <div className="pointer-events-none absolute inset-0 bg-hero-grid" />
    <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-brand-200/30 blur-3xl" />
    <div className="pointer-events-none absolute top-20 -left-16 h-64 w-64 rounded-full bg-ocean-200/30 blur-3xl" />
    <div className="container-x relative text-center">
      <Reveal>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-ink-900 sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-500">{subtitle}</p>
        )}
      </Reveal>
    </div>
  </section>
  );
};

export default PageHeader;
