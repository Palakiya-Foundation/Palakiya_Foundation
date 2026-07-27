import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Heart, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const AdminLogin = () => {
  const { login, admin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (admin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hero-grid px-5 py-10">
      {/* Background Effects */}
      <div className="pointer-events-none absolute -top-40 -right-24 h-[420px] w-[420px] rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-700/20" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-[320px] w-[320px] rounded-full bg-brand-100/50 blur-3xl dark:bg-brand-900/20" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link to="/" className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl dark:bg-gray-800">
              <img
                src="/favicon.svg"
                alt="Palakiya Foundation"
                className="h-10 w-10 object-contain"
              />
            </div>

            <div>
              <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">
                Palakiya Foundation
              </h1>

              <p className="text-sm text-ink-500 dark:text-gray-300">
                Admin Management Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-gray-200 bg-white/95 p-8 shadow-2xl backdrop-blur-md transition-all dark:border-gray-700 dark:bg-gray-900/90">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-ink-900 dark:text-white">
              Welcome Back
            </h2>

            <p className="mt-3 text-sm leading-6 text-ink-600 dark:text-gray-300">
              Sign in to securely access the administration dashboard and
              manage the Palakiya Foundation website.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Email */}
            <div>
              <label className="label dark:text-gray-200">
                Email Address
              </label>

              <div className="relative mt-2">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 dark:text-gray-400"
                />

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  required
                  placeholder="admin@palakiyafoundation.org"
                  className="input pl-11 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label dark:text-gray-200">
                Password
              </label>

              <div className="relative mt-2">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 dark:text-gray-400"
                />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  required
                  placeholder="••••••••"
                  className="input pl-11 pr-11 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition hover:text-ink-600 dark:text-gray-400 dark:hover:text-gray-200"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex w-full items-center justify-center gap-2 py-3 text-base font-semibold transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                'Signing In...'
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <Link
            to="/"
            className="text-sm font-medium text-ink-500 transition hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-400"
          >
            ← Back to Website
          </Link>

          <div className="border-t border-gray-200 pt-5 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Palakiya Foundation. All Rights Reserved.
            </p>

            <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
              Crafted with{' '}
              <Heart
                size={12}
                className="mx-1 inline text-red-500"
                fill="currentColor"
              />{' '}
              by{' '}
              <a
                href="https://devtri.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold tracking-wide text-brand-600 transition hover:text-brand-500 hover:underline"
              >
                DEVTRI
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;