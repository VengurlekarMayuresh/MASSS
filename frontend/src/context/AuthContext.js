import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth as fbAuth, db } from '../utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

// Backend API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // API call helper with authentication
  const apiCall = async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      ...options
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  };

  // Load user profile from token
  const loadUserProfile = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiCall('/users/profile');
      if (response.success) {
        setCurrentUser(response.user);
        setUserProfile(response.user);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      localStorage.removeItem('token');
      setToken(null);
      setCurrentUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await apiCall('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (response.success) {
        localStorage.setItem('token', response.token);
        setToken(response.token);
        setCurrentUser(response.user);
        setUserProfile(response.user);
        return { success: true, user: response.user };
      }
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await apiCall('/users/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      if (response.success) {
        // Also create corresponding Firebase Auth user and Firestore profile
        try {
          const cred = await createUserWithEmailAndPassword(fbAuth, userData.email, userData.password);
          const uid = cred.user.uid;
          await setDoc(doc(db, 'users', uid), {
            email: userData.email.toLowerCase(),
            role: userData.role || 'patient',
            profile: {
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              phone: userData.phone || '',
              dateOfBirth: userData.dateOfBirth || '',
              gender: userData.gender || '',
              address: userData.address || {}
            },
            createdAt: new Date().toISOString()
          });
        } catch (fbErr) {
          console.error('Firebase signup failed:', fbErr);
        }
        // Do NOT auto-login after registration. Require explicit sign-in.
        return { success: true, user: response.user };
      }
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const response = await apiCall('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });

      if (response.success) {
        setUserProfile(response.user);
        setCurrentUser(response.user);
        return { success: true, user: response.user };
      }
    } catch (error) {
      throw new Error(error.message || 'Profile update failed');
    }
  };

  // Logout function
  const logout = async () => {
    try {
      localStorage.removeItem('token');
      setToken(null);
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    token,
    login,
    register,
    updateProfile,
    logout,
    apiCall
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
