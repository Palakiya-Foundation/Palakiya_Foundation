import { useState } from 'react';
import { Send, CheckCircle2, HandHeart, Users, Sparkles, HeartHandshake } from 'lucide-react';
import api from '../api/client.js';
import PageHeader from '../components/PageHeader.jsx';
import Reveal from '../components/Reveal.jsx';

const interests = [
  'Health & Medical Camps',
  'Education & Teaching',
  'Community Outreach',
  'Women Empowerment',
  'Environment & Climate',
  'Fundraising & Events',
  'Other',
];

const perks = [
  { icon: HeartHandshake, title: 'Make a real impact', desc: 'Contribute directly to programs that transform lives.' },
  { icon: Users, title: 'Join a community', desc: 'Work alongside passionate, like-minded changemakers.' },
  { icon: Sparkles, title: 'Grow your skills', desc: 'Gain hands-on experience and lifelong memories.' },
];

const JoinUs = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', interest: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });
    try {
      await api.post('/volunteers/apply', form);
      setStatus({ loading: false, success: true, error: '' });
      setForm({ name: '', email: '', phone: '', interest: '', message: '' });
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Join Us"
        title="Become a volunteer, become the change"
        subtitle="Lend your time, skills and heart to our mission. Fill out the form below and our team will review your application."
      />

      <section className="section pt-10">
        <div className="container-x grid gap-10 lg:grid-cols-5">
          {/* Perks */}
          <div className="lg:col-span-2">
            <Reveal>
              <div className="space-y-4">
                {perks.map((p) => (
                  <div key={p.title} className="card flex items-start gap-4 p-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-ocean-600 text-white">
                      <p.icon size={22} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-ink-900">{p.title}</p>
                      <p className="mt-0.5 text-sm text-ink-500">{p.desc}</p>
                    </div>
                  </div>
                ))}
                <div className="card flex items-center gap-4 from-brand-50 to-ocean-50 p-5">
                  <HandHeart size={28} className="shrink-0 text-brand-600" />
                  <p className="text-sm font-medium text-ink-600">
                    Over 5,000 volunteers already power our mission. Your contribution matters.
                  </p>
                </div>
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
                    <h3 className="mt-4 text-2xl font-extrabold text-ink-900">
                      Your request has been submitted for approval
                    </h3>
                    <p className="mt-2 max-w-sm text-ink-500">
                      Thank you for your interest in volunteering. Our team will review your
                      application and notify you by email.
                    </p>
                    <button
                      onClick={() => setStatus({ loading: false, success: false, error: '' })}
                      className="btn-secondary mt-6"
                    >
                      Submit another application
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h3 className="text-xl font-extrabold text-ink-900">Volunteer application</h3>
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
                        <label className="label">Phone *</label>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          required
                          className="input"
                          placeholder="+91 ..."
                        />
                      </div>
                      <div>
                        <label className="label">Area of Interest</label>
                        <select
                          name="interest"
                          value={form.interest}
                          onChange={handleChange}
                          className="input"
                        >
                          <option value="">Select an area (optional)</option>
                          {interests.map((i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="label">Message / Motivation *</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="input resize-none"
                        placeholder="Tell us why you'd like to volunteer with us..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status.loading}
                      className="btn-primary w-full sm:w-auto"
                    >
                      {status.loading ? 'Submitting...' : 'Submit Application'}
                      {!status.loading && <Send size={16} />}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
};

export default JoinUs;
