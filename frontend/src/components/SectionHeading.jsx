import Reveal from './Reveal.jsx';

const SectionHeading = ({ eyebrow, title, subtitle, center = true, light = false }) => (
  <Reveal>
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2
        className={`mt-3 text-3xl font-extrabold leading-tight sm:text-4xl ${
          light ? 'text-white' : 'text-ink-900'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed ${light ? 'text-white/80' : 'text-ink-500'}`}>
          {subtitle}
        </p>
      )}
    </div>
  </Reveal>
);

export default SectionHeading;
