// Define the API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
    credentials: 'include'
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  
  return response.json();
};

// Export all API functions
export {
  API_URL,
};

// Authentication API
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials),
    credentials: 'include'
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data.user;
};

export const registerUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials),
    credentials: 'include'
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data.user;
};

export const logoutUser = async () => {
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
  const response = await fetch(`${API_URL}/users/profile`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Not authenticated');
  }
  
  return response.json();
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
  return fetchWithAuth('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
};