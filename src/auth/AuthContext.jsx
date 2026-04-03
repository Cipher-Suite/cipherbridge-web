// src/auth/AuthContext.jsx — authentication state management
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../api/client';
import { createUser } from '../api/endpoints';

const AuthContext = createContext(null);

const STORAGE_KEY = 'ciphertrade_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.apiKey && parsed.userId) {
          api.setApiKey(parsed.apiKey);
          setUser(parsed);
        }
      }
    } catch {}
    setLoading(false);
  }, []);

  const login = useCallback(async (apiKey) => {
    // User provides an existing API key
    api.setApiKey(apiKey);
    try {
      // Validate key by listing accounts
      await api.get('/api/accounts');
      const session = { apiKey, userId: 'existing', loggedInAt: Date.now() };
      setUser(session);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return { success: true };
    } catch (err) {
      api.clearApiKey();
      return { success: false, error: err.message };
    }
  }, []);

  const register = useCallback(async () => {
    try {
      const data = await createUser();
      api.setApiKey(data.apiKey);
      const session = {
        apiKey: data.apiKey,
        userId: data.userId,
        token: data.token,
        loggedInAt: Date.now(),
      };
      setUser(session);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const logout = useCallback(() => {
    api.clearApiKey();
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
