import axios from 'axios';
import { logout } from '../context/AuthContext'; // Note: Requires direct context access or prop passing

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Error:', error.response?.data?.message || error.message);
    if (error.response?.status === 401) {
      // Trigger logout on unauthorized errors (e.g., token expired)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('logout')); // Custom event for AuthProvider
    }
    return Promise.reject(error.response?.data || { message: 'An error occurred' });
  }
);

// Auth API methods
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);
export const getProfile = () => API.get('/auth/profile');

// Group API methods
export const getUserGroups = () => API.get('/groups');
export const createGroup = (groupData) => API.post('/groups', groupData);
export const getGroup = (id) => API.get(`/groups/${id}`);

// Expense API methods
export const getGroupExpenses = (groupId) => API.get(`/expenses/${groupId}`);
export const addExpense = (expenseData) => API.post('/expenses', expenseData);
export const getBalances = (groupId) => API.get(`/expenses/${groupId}/balances`);

export default API;