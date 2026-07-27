import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ngo_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401 for admin routes
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem('ngo_token')) {
      localStorage.removeItem('ngo_token');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

// Resolve image paths: local uploads -> proxied, absolute URLs untouched
export const resolveImage = (src) => {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  return src;
};

export default api;
