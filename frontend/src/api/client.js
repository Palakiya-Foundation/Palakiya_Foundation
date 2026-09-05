import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
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

// Resolve image paths and convert Google Drive viewer links to image URLs.
export const resolveImage = (src) => {
  if (!src) return '';
  try {
    const parsed = new URL(src, window.location.origin);
    const host = parsed.hostname.toLowerCase();
    if (!['drive.google.com', 'drive.usercontent.google.com'].includes(host)) return src;

    const queryId = parsed.searchParams.get('id');
    const pathId = parsed.pathname.match(/^\/file\/d\/([a-zA-Z0-9_-]+)/i)?.[1];
    const driveId = queryId || pathId;
    if (driveId) {
      return `https://drive.google.com/uc?export=view&id=${encodeURIComponent(driveId)}`;
    }
  } catch {
    return src;
  }
  return src;
};

export default api;