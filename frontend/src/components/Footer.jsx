import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useContent } from '../context/ContentContext.jsx';

const Footer = () => {
  const { content } = useContent();

  const socials = [
    { icon: Facebook, url: content.social_facebook },
    { icon: Twitter, url: content.social_twitter },
    { icon: Instagram, url: content.social_instagram },
    { icon: Linkedin, url: content.social_linkedin },
  ].filter((s) => s.url);

  return (
    <footer className="relative mt-20 overflow-hidden bg-ink-900 text-ink-200">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="container-x relative grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10">
              <img src="/favicon.svg" alt="Palakiya logo" className="h-20 w-20 object-contain" />
            </span>
            <span className="font-display text-lg font-extrabold text-white">
              {content.org_name || 'Palakiya'}
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-ink-400">
            {content.about_intro?.slice(0, 113) ||
              'Empowering communities through health, education and social development.'}
          </p>
          <div className="mt-5 flex gap-2.5">
            {socials.map(({ icon: Icon, url }, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-ink-300 transition hover:bg-brand-500 hover:text-white"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ['Home', '/'],
              ['About Us', '/about'],
              ['Our Programs', '/programs'],
              ['Gallery', '/gallery'],
              ['Reports', '/reports'],
            ].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="text-ink-400 transition hover:text-brand-400">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Resources</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ['Articles', '/articles'],
              ['Contact', '/contact'],
              ['Join Us', '/join-us'],
              ['Admin', '/admin/login'],
            ].map(([label, to]) => (
              <li key={label}>
                <Link to={to} className="text-ink-400 transition hover:text-brand-400">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Get in touch</h4>
          <ul className="mt-4 space-y-3 text-sm text-ink-400">
            <li className="flex gap-2.5">
              <MapPin size={17} className="mt-0.5 shrink-0 text-brand-400" />
              <span>{content.contact_address || '7A Third Floor, Radhey Shyam Park, 110051 New Delhi, India'}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={17} className="shrink-0 text-brand-400" />
              <a href={`mailto:${content.contact_email}`} className="hover:text-brand-400">
                {content.contact_email || 'admin@palakiyafoundation.org'}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={17} className="shrink-0 text-brand-400" />
              <a href={`tel:${content.contact_phone}`} className="hover:text-brand-400">
                {content.contact_phone || '+91 9873757278'}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-sm text-ink-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {content.org_name || 'Palakiya Foundation'}. All rights
            reserved.
          </p>
          <p className="flex items-center gap-1.5">
            Made with <Heart size={15} className="inline text-brand-400" fill="currentColor" /> by
            DEVTRI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

