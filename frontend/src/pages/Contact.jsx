import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import api from '../api/client.js';
import { useContent } from '../context/ContentContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Reveal from '../components/Reveal.jsx';

const Contact = () => {
  const { content } = useContent();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });
    try {
      await api.post('/contacts', form);
      setStatus({ loading: false, success: true, error: '' });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  const info = [
    { icon: MapPin, label: 'Visit Us', value: content.contact_address || 'New Delhi, India' },
    { icon: Mail, label: 'Email Us', value: content.contact_email || 'info@ngo.org', href: `mailto:${content.contact_email}` },
    { icon: Phone, label: 'Call Us', value: content.contact_phone || '+91 98765 43210', href: `tel:${content.contact_phone}` },
  ];

  const socials = [
    { icon: Facebook, url: content.social_facebook },
    { icon: Twitter, url: content.social_twitter },
    { icon: Instagram, url: content.social_instagram },
    { icon: Linkedin, url: content.social_linkedin },
  ].filter((s) => s.url);

  return (
    <>
      <PageHeader
        eyebrow="Get In Touch"
        title="We'd love to hear from you"
        subtitle="Whether you want to volunteer, partner, donate or simply learn more — reach out and let's create change together."
      />

      <section className="section pt-10">
        <div className="container-x grid gap-10 lg:grid-cols-5">
          {/* Info */}
          <div className="lg:col-span-2">
            <Reveal>
              <div className="space-y-4">
                {info.map((item) => (
                  <div key={item.label} className="card flex items-start gap-4 p-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <item.icon size={22} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-ink-500 hover:text-brand-600">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-ink-500">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}

                {socials.length > 0 && (
                  <div className="card p-5">
                    <p className="text-sm font-semibold text-ink-900">Follow Us</p>
                    <div className="mt-3 flex gap-2.5">
                      {socials.map(({ icon: Icon, url }, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-50 text-ink-600 transition hover:bg-brand-500 hover:text-white"
                        >
                          <Icon size={18} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <Reveal delay={0.1}>
              <div className="card p-7 sm:p-9">
                {status.success ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <CheckCircle2 size={56} className="text-brand-500" />
                    <h3 className="mt-4 text-2xl font-extrabold text-ink-900">Message sent!</h3>
                    <p className="mt-2 max-w-sm text-ink-500">
                      Thank you for reaching out. Our team will get back to you within 48 hours.
                    </p>
                    <button
                      onClick={() => setStatus({ loading: false, success: false, error: '' })}
                      className="btn-secondary mt-6"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h3 className="text-xl font-extrabold text-ink-900">Send us a message</h3>
                    {status.error && (
                      <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                        {status.error}
                      </p>
                    )}
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="label">Full Name *</label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="input"
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div>
                        <label className="label">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="input"
                          placeholder="jane@example.com"
                        />
                      </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="label">Phone</label>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          className="input"
                          placeholder="+91 ..."
                        />
                      </div>
                      <div>
                        <label className="label">Subject</label>
                        <input
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          className="input"
                          placeholder="How can we help?"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label">Message *</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="input resize-none"
                        placeholder="Tell us more..."
                      />
                    </div>
                    <button type="submit" disabled={status.loading} className="btn-primary w-full sm:w-auto">
                      {status.loading ? 'Sending...' : 'Send Message'}
                      {!status.loading && <Send size={16} />}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Map */}
        <div className="container-x mt-12">
          <Reveal>
            <div className="overflow-hidden rounded-3xl shadow-soft ring-1 ring-ink-100">
              <iframe
                title="Location map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.4425750077025!2d77.28451897543688!3d28.646464175657133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfb58a566c159%3A0xbe651106fbfe0b26!2sRadheyShyam%20park%2C%20Radhey%20Shyam%20Park%20Extension%2C%20Krishna%20Nagar%2C%20Delhi%2C%20110051!5e0!3m2!1sen!2sin!4v1784659974721!5m2!1sen!2sin"
                width="100%"
                height="380"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default Contact;
