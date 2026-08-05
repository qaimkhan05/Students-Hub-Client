import axios from 'axios';

const apiBaseUrl =
  import.meta.env.VITE_API_URL?.trim() ||
  (import.meta.env.DEV
    ? 'http://localhost:5000/api'
    : `${window.location.origin.replace(/\/$/, '')}/api`);

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000,
});

const getCache = new Map();
const CACHE_TTL_MS = 60 * 1000;

const isCacheable = (url) => url === '/products';

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.method !== 'get' && String(config.url || '').startsWith('/products')) {
      getCache.delete('/products');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.cachedGet = async (url, config = {}) => {
  if (!isCacheable(url)) {
    return api.get(url, config);
  }

  const hit = getCache.get(url);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return hit.res;
  }

  const res = await api.get(url, config);
  getCache.set(url, { at: Date.now(), res });
  return res;
};

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
