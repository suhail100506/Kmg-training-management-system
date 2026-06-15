import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import * as authApi from '../api/auth.api';

const AuthContext = createContext(null);

export const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => sessionStorage.getItem('token'));
  const [loading, setLoading] = useState(() => {
    return !!sessionStorage.getItem('token');
  });
  
  // Session Expiration States
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const warningTimerRef = useRef(null);

  // Load user profile on mount if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = sessionStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await authApi.getMe();
          const profile = response.data.data;
          setUser(profile);
          sessionStorage.setItem('user', JSON.stringify(profile));
        } catch (error) {
          console.error('Failed to restore session profile:', error);
          // logout on failures
          logoutLocal();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Monitor JWT expiration for the 5-minute warning banner
  useEffect(() => {
    if (!token) {
      setShowExpiryWarning(false);
      if (warningTimerRef.current) clearInterval(warningTimerRef.current);
      return;
    }

    const checkTokenExpiry = () => {
      const decoded = parseJwt(token);
      if (!decoded || !decoded.exp) return;

      const expiryTime = decoded.exp * 1000;
      const curTime = Date.now();
      const differenceMs = expiryTime - curTime;

      // 5 minutes warning limit (300 seconds)
      const warningThresholdMs = 5 * 60 * 1000;

      if (differenceMs <= 0) {
        // Session already expired
        logoutLocal();
        window.location.href = '/login?expired=true';
      } else if (differenceMs <= warningThresholdMs) {
        setShowExpiryWarning(true);
        setTimeLeft(Math.max(Math.round(differenceMs / 1000), 0));
      } else {
        setShowExpiryWarning(false);
      }
    };

    // Run check immediately, then check every 15 seconds
    checkTokenExpiry();
    warningTimerRef.current = setInterval(checkTokenExpiry, 15000);

    return () => {
      if (warningTimerRef.current) clearInterval(warningTimerRef.current);
    };
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      const { token: newCtxToken, user: userProfile } = response.data.data;
      
      setToken(newCtxToken);
      setUser(userProfile);
      sessionStorage.setItem('token', newCtxToken);
      sessionStorage.setItem('user', JSON.stringify(userProfile));
      
      setLoading(false);
      return userProfile;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const extendSession = async () => {
    try {
      const response = await authApi.refresh();
      const { token: newCtxToken } = response.data.data;
      setToken(newCtxToken);
      sessionStorage.setItem('token', newCtxToken);
      setShowExpiryWarning(false);
      return true;
    } catch (error) {
      console.error('Failed to extend session:', error);
      logoutLocal();
      return false;
    }
  };

  const logoutLocal = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setShowExpiryWarning(false);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Server logout fail:', error);
    } finally {
      logoutLocal();
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    extendSession,
    showExpiryWarning,
    timeLeft,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
