import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor: Attach JWT ──────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('zaa_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor: Handle 401 ─────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('zaa_token');
      localStorage.removeItem('zaa_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ═══════════════════════════════════════════════════════════
// API ENDPOINT GROUPS
// ═══════════════════════════════════════════════════════════

// ─── Auth ───────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.get('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateDetails: (data) => api.put('/auth/updatedetails', data),
  updatePassword: (data) => api.put('/auth/updatepassword', data),
  forgotPassword: (email) => api.post('/auth/forgotpassword', { email }),
  resetPassword: (token, password) => api.put(`/auth/resetpassword/${token}`, { password }),
  verifyEmail: (token) => api.get(`/auth/verify/${token}`),
};

// ─── Packages ───────────────────────────────────────────────
export const packageAPI = {
  getAll: (params) => api.get('/packages', { params }),
  getFeatured: () => api.get('/packages/featured'),
  getOne: (slug) => api.get(`/packages/${slug}`),
  search: (q) => api.get('/packages/search', { params: { q } }),
  getCategoryStats: () => api.get('/packages/categories/stats'),
  create: (data) => api.post('/packages', data),
  update: (id, data) => api.put(`/packages/${id}`, data),
  delete: (id) => api.delete(`/packages/${id}`),
};

// ─── Bookings ───────────────────────────────────────────────
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMy: (params) => api.get('/bookings/my', { params }),
  getOne: (id) => api.get(`/bookings/${id}`),
  cancel: (id, reason) => api.patch(`/bookings/${id}/cancel`, { reason }),
  getAll: (params) => api.get('/bookings', { params }), // admin
  updateStatus: (id, data) => api.patch(`/bookings/${id}/status`, data), // admin
};

// ─── Payments ───────────────────────────────────────────────
export const paymentAPI = {
  createIntent: (data) => api.post('/payments/create-intent', data),
  confirm: (data) => api.post('/payments/confirm', data),
  getHistory: () => api.get('/payments/history'),
  refund: (data) => api.post('/payments/refund', data), // admin
};

// ─── Visa ───────────────────────────────────────────────────
export const visaAPI = {
  apply: (data) => api.post('/visa', data),
  getMy: () => api.get('/visa/my'),
  getAll: (params) => api.get('/visa', { params }), // admin
  updateStatus: (id, data) => api.patch(`/visa/${id}/status`, data), // admin
};

// ─── Hotels ─────────────────────────────────────────────────
export const hotelAPI = {
  getAll: (params) => api.get('/hotels', { params }),
  create: (data) => api.post('/hotels', data), // admin
};

// ─── Flights ────────────────────────────────────────────────
export const flightAPI = {
  request: (data) => api.post('/flights', data),
  getMy: () => api.get('/flights/my'),
};

// ─── Reviews ────────────────────────────────────────────────
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getByPackage: (packageId) => api.get(`/reviews/package/${packageId}`),
};

// ─── Notifications ──────────────────────────────────────────
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markAllRead: () => api.patch('/notifications/read-all'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
};

// ─── Contact ────────────────────────────────────────────────
export const contactAPI = {
  send: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'), // admin
};

// ─── Admin ──────────────────────────────────────────────────
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.patch(`/admin/users/${id}`, data),
  getRevenueReport: (params) => api.get('/admin/reports/revenue', { params }),
  getPendingReviews: () => api.get('/admin/reviews/pending'),
  approveReview: (id) => api.patch(`/admin/reviews/${id}/approve`),
  broadcast: (data) => api.post('/admin/notifications/broadcast', data),
};

// ─── Upload ─────────────────────────────────────────────────
export const uploadAPI = {
  image: (formData, folder) => api.post(`/upload/image?folder=${folder || 'zeno-africa'}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  document: (formData) => api.post('/upload/document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
