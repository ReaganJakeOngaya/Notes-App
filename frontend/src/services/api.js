// api.js
// Determine base URL based on environment
const isProduction = import.meta.env.PROD;
export const API_URL = isProduction
  ? 'https://notes-app-20no.onrender.com/api'
  : import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `Request failed with status ${response.status}`
    }));
    throw new Error(errorData.message || errorData.error || 'Request failed');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// Enhanced fetch function with retry logic
const fetchWithRetry = async (url, options = {}, retries = 3, delay = 1000) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers
  };

  const config = {
    ...options,
    headers,
    credentials: 'include',
    mode: 'cors'
  };

  try {
    const response = await fetch(`${API_URL}${url}`, config);
    
    // Handle 401 unauthorized
    if (response.status === 401) {
      // Handle token refresh or redirect to login
      throw new Error('Unauthorized');
    }
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `Request failed with status ${response.status}` };
      }
      
      if (response.status >= 500 && retries > 0) {
        console.warn(`Retrying (${retries} left)...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
      
      throw new Error(errorData.message || errorData.error || 'Request failed');
    }
    
    return response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch') && retries > 0) {
      console.warn(`Network error - retrying (${retries} left)...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    console.error('API Error:', { url, error: error.message });
    throw error;
  }
};

// Authentication API
export const loginUser = async (credentials) => {
  return fetchWithRetry('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

export const registerUser = async (credentials) => {
  return fetchWithRetry('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

export const logoutUser = async () => {
  return fetchWithRetry('/auth/logout', {
    method: 'POST'
  });
};

export const getCurrentUser = async () => {
  return fetchWithRetry('/users/profile');
};

// Notes API
export const getNotes = (category = 'all', search = '') => {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (search) params.append('search', search);
  
  return fetchWithRetry(`/notes?${params.toString()}`);
};

export const getNote = (id) => {
  return fetchWithRetry(`/notes/${id}`);
};

export const createNote = (noteData) => {
  return fetchWithRetry('/notes', {
    method: 'POST',
    body: JSON.stringify(noteData)
  });
};

export const updateNote = (id, noteData) => {
  return fetchWithRetry(`/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(noteData)
  });
};

export const deleteNote = (id) => {
  return fetchWithRetry(`/notes/${id}`, {
    method: 'DELETE'
  });
};

export const shareNote = (noteId, email, permission) => {
  return fetchWithRetry(`/notes/${noteId}/share`, {
    method: 'POST',
    body: JSON.stringify({ email, permission })
  });
};

export const getSharedNotes = () => {
  return fetchWithRetry('/notes/shared');
};

// User API
export const getProfile = () => {
  return fetchWithRetry('/users/profile');
};

export const updateProfile = (profileData) => {
  if (!(profileData instanceof FormData)) {
    return fetchWithRetry('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  return fetchWithRetry(`${API_URL}/users/profile`, {
    method: 'PUT',
    body: profileData,
    credentials: 'include'
  });
};

// Social Auth URLs
export const getGoogleAuthUrl = () => {
  return `${API_URL}/auth/google`;
};

export const getAppleAuthUrl = () => {
  return `${API_URL}/auth/apple`;
};