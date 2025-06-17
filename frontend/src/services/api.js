// api.js
// Determine base URL based on environment
const isProduction = import.meta.env.PROD;
export const API_URL = isProduction
  ? 'https://notes-app-20no.onrender.com/api'
  : import.meta.env.VITE_API_URL || '/api';

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

// Main fetch function with authentication
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Determine the full URL
  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
      credentials: 'include',
      mode: 'cors'
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('API request failed:', {
      url: fullUrl,
      error: error.message
    });
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
  await fetchWithAuth('/auth/logout', {
    method: 'POST'
  });
  localStorage.removeItem('token');
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
  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`
  };

  // Handle FormData differently
  if (!(profileData instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    profileData = JSON.stringify(profileData);
  }

  return fetch(`${API_URL}/users/profile`, {
    method: 'PUT',
    body: profileData,
    headers,
    credentials: 'include'
  }).then(handleResponse);
};

// Social Auth URLs (for OAuth flows)
export const getGoogleAuthUrl = () => {
  return `${API_URL}/auth/google`;
};

export const getAppleAuthUrl = () => {
  return `${API_URL}/auth/apple`;
};