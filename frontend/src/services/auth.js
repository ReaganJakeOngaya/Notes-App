// Import everything from api.js
import { 
  API_URL,
  loginUser as apiLogin,
  registerUser as apiRegister,
  logoutUser as apiLogout,
  getCurrentUser as apiGetCurrentUser
} from './api';

// Export the auth functions directly
export const loginUser = apiLogin;
export const registerUser = apiRegister;
export const logoutUser = apiLogout;
export const getCurrentUser = apiGetCurrentUser;

// Alternatively, you could just delete auth.js entirely and import directly from api.js
// since we've consolidated all the auth functions in api.js