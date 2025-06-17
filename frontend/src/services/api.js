// api.js
// Define the API base URL
export const API_URL = import.meta.env.VITE_API_URL || '/api';

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
      credentials: 'include',
      mode: 'cors' 
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Request failed');
    }
    
    if (response.status === 204) {
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authentication API
export const loginUser = async (credentials) => {
  return fetchWithAuth('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

export const registerUser = async (credentials) => {
  return fetchWithAuth('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

export const logoutUser = async () => {
  await fetchWithAuth('/api/auth/logout', {
    method: 'POST'
  });
  localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
  return fetchWithAuth('/api/users/profile');
};

// Notes API
export const getNotes = (category = 'all', search = '') => {
  return fetchWithAuth(`/api/notes?category=${category}&search=${search}`);
};

export const getNote = (id) => {
  return fetchWithAuth(`/api/notes/${id}`);
};

export const createNote = (noteData) => {
  return fetchWithAuth('/api/notes', {
    method: 'POST',
    body: JSON.stringify(noteData)
  });
};

export const updateNote = (id, noteData) => {
  return fetchWithAuth(`/api/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(noteData)
  });
};

export const deleteNote = (id) => {
  return fetchWithAuth(`/api/notes/${id}`, {
    method: 'DELETE'
  });
};

export const shareNote = (noteId, email, permission) => {
  return fetchWithAuth(`/api/notes/${noteId}/share`, {
    method: 'POST',
    body: JSON.stringify({ email, permission })
  });
};

export const getSharedNotes = () => {
  return fetchWithAuth('/api/notes/shared');
};

// User API
export const getProfile = () => {
  return fetchWithAuth('/api/users/profile');
};


export const updateProfile = (profileData) => {
  const token = localStorage.getItem('token');
  
  
  const headers = {
    'Authorization': `Bearer ${token}`
  };

  // Remove Content-Type header for FormData
  if (!(profileData instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  return fetch(`${API_URL}/api/users/profile`, {
    method: 'PUT',
    body: profileData,
    headers,
    credentials: 'include'
  }).then(async (response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || 'Request failed');
    }
    return response.json();
  });
};