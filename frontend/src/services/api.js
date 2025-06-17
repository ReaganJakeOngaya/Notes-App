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
  return fetchWithAuth(`/notes?category=${category}&search=${search}`);
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

  // Remove Content-Type header for FormData
  if (!(profileData instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  return fetch(`${API_URL}/users/profile`, {
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