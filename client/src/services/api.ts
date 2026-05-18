import axios from 'axios';

// ─── CREATE AXIOS INSTANCE ────────────────────────────────────
// Instead of writing full URL every time, we set base URL once
// All requests automatically start with http://localhost:5000/api
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// ─── REQUEST INTERCEPTOR ──────────────────────────────────────
// Runs BEFORE every request is sent
// Automatically adds JWT token to Authorization header
// So you never forget to add it manually

API.interceptors.request.use((config) => {
  // Get token from localStorage (saved during login)
  const token = localStorage.getItem('token');

  if (token) {
    // Add token to request header
    // Backend's authMiddleware checks this header
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config; // Send the request with the token
});

// ─── AUTH API CALLS ───────────────────────────────────────────

// POST /api/auth/signup
// Sends name, email, password to backend
export const signupAPI = (data: {
  name: string;
  email: string;
  password: string;
}) => API.post('/auth/signup', data);

// POST /api/auth/login
// Sends email, password to backend
export const loginAPI = (data: {
  email: string;
  password: string;
}) => API.post('/auth/login', data);

// ─── REVIEW API CALLS ─────────────────────────────────────────

// POST /api/review/analyze
// Sends code + language, gets AI feedback back
export const analyzeCodeAPI = (data: {
  code: string;
  language: string;
}) => API.post('/review/analyze', data);

// GET /api/review/history
// Gets all past reviews for logged-in user
export const getHistoryAPI = () =>
  API.get('/review/history');

// DELETE /api/review/:id
// Deletes a specific review by ID
export const deleteReviewAPI = (id: string) =>
  API.delete(`/review/${id}`);