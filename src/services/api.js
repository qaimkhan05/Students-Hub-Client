import axios from 'axios';

const apiBaseUrl =
  import.meta.env.VITE_API_URL?.trim() ||
  (import.meta.env.DEV
    ? 'http://localhost:5000/api'
    : `${window.location.origin.replace(/\/$/, '')}/api`);

const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const backendOrigin = apiBaseUrl.replace(/\/api\/?$/, '');

export const assetUrl = (url) => {
  if (!url) {
    return '';
  }
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  if (url.startsWith('/uploads/') || url.startsWith('/samples/')) {
    return backendOrigin + url;
  }
  return url;
};

export default api;
