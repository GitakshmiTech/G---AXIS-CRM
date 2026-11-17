//==================================================================================================================
//    REDUX AUTHENTICATION SLICE
//    Centralized authentication state management for G-CRM (Role, Token, User, Permissions)
//==================================================================================================================

import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_USERS, USER_ROLES } from '../../constants/authConstants';

// Helper to safely load initial session from localStorage
const getSavedRole = () => {
  try {
    const saved = localStorage.getItem('gcrm_role');
    if (saved && Object.values(USER_ROLES).includes(saved)) {
      return saved;
    }
  } catch {
    // Fallback if localStorage is inaccessible
  }
  return USER_ROLES.BDE; // Default role
};

const getSavedUser = (role) => {
  try {
    const saved = localStorage.getItem('gcrm_user');
    if (saved) return JSON.parse(saved);
  } catch {
    // Fallback if parsing fails
  }
  return DEFAULT_USERS[role] || DEFAULT_USERS.bde;
};

const initialRole = getSavedRole();
const initialUser = getSavedUser(initialRole);
const initialToken = localStorage.getItem('gcrm_token') || 'gcrm-mock-jwt-token';
const initialIsAuth = localStorage.getItem('gcrm_auth') !== 'false';

const initialState = {
  user: initialUser,
  role: initialRole,
  token: initialToken,
  isAuthenticated: initialIsAuth,
  loading: false,
  error: null,
};

//==================================================================================================================
//    AUTH SLICE DEFINITION
//==================================================================================================================
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { role, user, token } = action.payload;
      const targetRole = role || USER_ROLES.BDE;
      const targetUser = user || DEFAULT_USERS[targetRole] || DEFAULT_USERS.bde;
      const targetToken = token || 'gcrm-mock-jwt-token';

      state.role = targetRole;
      state.user = targetUser;
      state.token = targetToken;
      state.isAuthenticated = true;
      state.error = null;

      try {
        localStorage.setItem('gcrm_role', targetRole);
        localStorage.setItem('gcrm_user', JSON.stringify(targetUser));
        localStorage.setItem('gcrm_token', targetToken);
        localStorage.setItem('gcrm_auth', 'true');
        sessionStorage.setItem('last_login_type', targetRole);
      } catch {
        // Ignore storage write errors
      }
    },

    logout: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      try {
        localStorage.removeItem('gcrm_role');
        localStorage.removeItem('gcrm_user');
        localStorage.removeItem('gcrm_token');
        localStorage.setItem('gcrm_auth', 'false');
        sessionStorage.removeItem('last_login_type');
      } catch {
        // Ignore storage write errors
      }
    },

    switchRole: (state, action) => {
      const newRole = action.payload;
      if (Object.values(USER_ROLES).includes(newRole)) {
        state.role = newRole;
        state.user = DEFAULT_USERS[newRole];
        state.isAuthenticated = true;

        try {
          localStorage.setItem('gcrm_role', newRole);
          localStorage.setItem('gcrm_user', JSON.stringify(DEFAULT_USERS[newRole]));
          localStorage.setItem('gcrm_auth', 'true');
          sessionStorage.setItem('last_login_type', newRole);
        } catch {
          // Ignore storage write errors
        }
      }
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginSuccess, logout, switchRole, setError, clearError } = authSlice.actions;
export default authSlice.reducer;
