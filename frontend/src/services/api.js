// api.js

// Determine base URL based on environment
const isProduction = import.meta.env.PROD;
export const API_URL = isProduction
  ? 'https://notes-app-20no.onrender.com/api'
  : import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper: handle all responses
const handleResponse = async (response) => {
  if (response.status === 204) return null;

  const isJSON = response.headers
    .get('content-type')
    ?.includes('application/json');

  const data = isJSON ? await response.json() : null;

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || response.statusText;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.response = data;
    throw error;
  }

  return data;
};

// In api.js, update fetchWithRetry function:
const fetchWithRetry = async (url, options = {}, retries = 3, delay = 1000) => {
  const config = {
    method: options.method || 'GET',
    headers: {
      Accept: 'application/json',
      ...(!(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    body: options.body instanceof FormData
      ? options.body
      : options.body
        ? JSON.stringify(options.body)
        : undefined,
    credentials: 'include',
    mode: 'cors',
  };

  try {
    console.log(`Attempting to fetch: ${API_URL}${url}`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const res = await fetch(`${API_URL}${url}`, { ...config, signal: controller.signal });
    clearTimeout(timeoutId);
    
    console.log(`Response status: ${res.status} for ${url}`);
    
    // Handle CORS errors specifically
    if (res.status === 0) {
      throw new Error('CORS error: Network failure or CORS blocked');
    }
    
    if (res.status === 401) throw new Error('Unauthorized');
    return await handleResponse(res);
  } catch (err) {
    console.error(`Fetch error for ${url}:`, err.message);
    
    if (retries > 0 && (err.message.includes('fetch') || err.message.includes('CORS') || err.message.includes('Failed'))) {
      console.warn(`Retrying request to ${url} (${retries} left)...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    console.error('API Error:', { url, error: err.message });
    throw err;
  }
};

// ---------- AUTH ----------
export const loginUser = (credentials) =>
  fetchWithRetry('/auth/login', { method: 'POST', body: credentials });

export const registerUser = (credentials) =>
  fetchWithRetry('/auth/register', { method: 'POST', body: credentials });

export const logoutUser = () =>
  fetchWithRetry('/auth/logout', { method: 'POST' });

export const getCurrentUser = () =>
  fetchWithRetry('/users/profile');

// ---------- NOTES ----------
export const getNotes = (category = 'all', search = '') => {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (search) params.append('search', search);
  return fetchWithRetry(`/notes?${params}`);
};

export const getNote = (id) =>
  fetchWithRetry(`/notes/${id}`);

export const createNote = (noteData) =>
  fetchWithRetry('/notes', { method: 'POST', body: noteData });

export const updateNote = (id, noteData) =>
  fetchWithRetry(`/notes/${id}`, { method: 'PUT', body: noteData });

export const deleteNote = (id) =>
  fetchWithRetry(`/notes/${id}`, { method: 'DELETE' });

export const shareNote = (noteId, email, permission) =>
  fetchWithRetry(`/notes/${noteId}/share`, {
    method: 'POST',
    body: { email, permission }
  });

export const getSharedNotes = () =>
  fetchWithRetry('/notes/shared');

// ---------- USERS ----------
export const getProfile = () =>
  fetchWithRetry('/users/profile');

export const updateProfile = (profileData) => {
  const isFormData = profileData instanceof FormData;
  return fetchWithRetry('/users/profile', {
    method: 'PUT',
    body: profileData,
    ...(isFormData ? { headers: {} } : {})
  });
};

// ---------- SOCIAL AUTH ----------
export const getGoogleAuthUrl = () =>
  `${API_URL}/auth/google`;

export const getAppleAuthUrl = () =>
  `${API_URL}/auth/apple`;
