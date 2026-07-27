import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => (
  <section className="flex min-h-[70vh] items-center justify-center bg-hero-grid pt-20">
    <div className="container-x text-center">
      <p className="text-8xl font-extrabold gradient-text sm:text-9xl">404</p>
      <h1 className="mt-4 text-2xl font-extrabold text-ink-900 sm:text-3xl">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-ink-500">
        The page you are looking for might have been moved or no longer exists.
      </p>
      <Link to="/" className="btn-primary mt-8">
        <Home size={18} /> Back to home
      </Link>
    </div>
  </section>
);

export default NotFound;
