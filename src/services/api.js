import axios from 'axios';

const API = axios.create({ baseURL: `${import.meta.env.VITE_API_BASE_URL}api` });

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

API.interceptors.response.use(
    (res) => res.data,
    (err) => {
        const msg = err.response?.data?.message || err.message || 'Something went wrong';
        if (err.response?.status === 401) {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            window.location.href = '/login';
        }
        return Promise.reject(new Error(msg));
    }
);

// ─── Auth ─────────────────────────────────────────────────────
export const authAPI = {
    login: (data) => API.post('/auth/login', data),
    me: () => API.get('/auth/me'),
};

// ─── Admin ────────────────────────────────────────────────────
export const adminAPI = {
    getStats: () => API.get('/admin/stats'),
    getAnalytics: () => API.get('/admin/analytics'),

    // Users
    getUsers: (params) => API.get('/admin/users', { params }),
    updateUserRole: (id, role) => API.put(`/admin/users/${id}/role`, { role }),
    deleteUser: (id) => API.delete(`/admin/users/${id}`),

    // Songs
    getSongs: (params) => API.get('/admin/songs', { params }),
    uploadSong: (formData) => API.post('/songs', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    updateSong: (id, data) => API.put(`/songs/${id}`, data),
    deleteSong: (id) => API.delete(`/songs/${id}`),
    toggleSongStatus: (id) => API.patch(`/admin/songs/${id}/toggle`),
};

export default API;
