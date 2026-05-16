import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = token;
    return config;
});

// Auth
export const register = (data: { userId: string; name: string; phone: string; password: string; role: string; adminSecret?: string }) =>
    api.post('/auth/register', data);

export const login = (data: { userId: string; password: string }) =>
    api.post('/auth/login', data);

// Categories
export const getCategories = () =>
    api.get('/user/categories');

export const getSubCategories = (category_id: string) =>
    api.get(`/user/subcategories/${category_id}`);

// Prompts
export const sendPrompt = (data: { category_id: string; sub_category_id: string; prompt: string }) =>
    api.post('/user/prompts', data);

export const getMyHistory = () =>
    api.get('/user/prompts/my-history');

// Admin
export const getAdminUsers = (page = 1, limit = 8) =>
    api.get(`/admin/users?page=${page}&limit=${limit}`);

export const getAdminPrompts = (page = 1, limit = 6) =>
    api.get(`/admin/prompts?page=${page}&limit=${limit}`);

export const getAdminPromptsByUser = (user_id: string) =>
    api.get(`/admin/prompts/${user_id}`);

export const createCategory = (name: string) =>
    api.post('/admin/categories', { name });

export const createSubCategory = (name: string, category_id: string) =>
    api.post('/admin/subcategories', { name, category_id });

export default api;
