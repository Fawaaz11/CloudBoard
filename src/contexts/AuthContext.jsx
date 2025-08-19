import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('cloudboard_token');
    const userData = localStorage.getItem('cloudboard_user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      } catch (error) {
        localStorage.removeItem('cloudboard_token');
        localStorage.removeItem('cloudboard_user');
      }
    }
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('cloudboard_token', response.data.token);
      localStorage.setItem('cloudboard_user', JSON.stringify(response.data.user));
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: response.data.user, token: response.data.token } 
      });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const register = async (email, password, name) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authAPI.register(email, password, name);
      localStorage.setItem('cloudboard_token', response.data.token);
      localStorage.setItem('cloudboard_user', JSON.stringify(response.data.user));
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: response.data.user, token: response.data.token } 
      });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('cloudboard_token');
    localStorage.removeItem('cloudboard_user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('cloudboard_user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};