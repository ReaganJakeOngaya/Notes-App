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

// Enhanced fetch function with better error handling
const fetchWithAuth = async (url, options = {}) => {
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
    
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = 'Request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Request failed with status ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    return response.json();
  } catch (error) {
    console.error('API Error:', { url, error: error.message });
    throw error;
  }
};

// Authentication API
export const loginUser = async (credentials) => {
  return fetchWithAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

export const registerUser = async (credentials) => {
  return fetchWithAuth('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

export const logoutUser = async () => {
  return fetchWithAuth('/auth/logout', {
    method: 'POST'
  });
};

export const getCurrentUser = async () => {
  return fetchWithAuth('/users/profile');
};

// Notes API
export const getNotes = (category = 'all', search = '') => {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (search) params.append('search', search);
  
  return fetchWithAuth(`/notes?${params.toString()}`);
};

export const getNote = (id) => {
  return fetchWithAuth(`/notes/${id}`);
};

export const createNote = (noteData) => {
  return fetchWithAuth('/notes', {
    method: 'POST',
    body: JSON.stringify(noteData)
  });
};

export const updateNote = (id, noteData) => {
  return fetchWithAuth(`/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(noteData)
  });
};

export const deleteNote = (id) => {
  return fetchWithAuth(`/notes/${id}`, {
    method: 'DELETE'
  });
};

export const shareNote = (noteId, email, permission) => {
  return fetchWithAuth(`/notes/${noteId}/share`, {
    method: 'POST',
    body: JSON.stringify({ email, permission })
  });
};

export const getSharedNotes = () => {
  return fetchWithAuth('/notes/shared');
};

// User API
export const getProfile = () => {
  return fetchWithAuth('/users/profile');
};

export const updateProfile = (profileData) => {
  if (!(profileData instanceof FormData)) {
    return fetchWithAuth('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  return fetch(`${API_URL}/users/profile`, {
    method: 'PUT',
    body: profileData,
    credentials: 'include'
  }).then(handleResponse);
};

// Social Auth URLs
export const getGoogleAuthUrl = () => {
  return `${API_URL}/auth/google`;
};

export const getAppleAuthUrl = () => {
  return `${API_URL}/auth/apple`;
};