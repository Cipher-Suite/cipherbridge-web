// src/auth/AuthContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../api/client';
import { createUser, getMe } from '../api/endpoints';

const AuthContext = createContext(null);
const STORAGE_KEY = 'tonpo_session_v1';

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount — restore session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.apiKey && parsed?.userId) {
          api.setApiKey(parsed.apiKey);
          setUser(parsed);
          // Re-fetch /me in background to refresh isAdmin + userId
          getMe()
            .then(me => {
              const updated = {
                ...parsed,
                userId:  me.user_id  || parsed.userId,
                isAdmin: me.is_admin || false,
              };
              setUser(updated);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            })
            .catch(() => {}); // silently ignore — use cached value
        }
      }
    } catch {}
    setLoading(false);
  }, []);

  // Login with existing API key — validates + fetches user profile
  const login = useCallback(async (apiKey) => {
    api.setApiKey(apiKey.trim());
    try {
      const me = await getMe();
      const session = {
        apiKey:      apiKey.trim(),
        userId:      me.user_id,
        isAdmin:     me.is_admin || false,
        loggedInAt:  Date.now(),
      };
      setUser(session);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return { success: true };
    } catch (err) {
      api.clearApiKey();
      return { success: false, error: err.message };
    }
  }, []);

  // Register — creates a new user
  const register = useCallback(async () => {
    try {
      const data = await createUser();
      api.setApiKey(data.api_key || data.apiKey);
      const session = {
        apiKey:     data.api_key || data.apiKey,
        userId:     data.user_id || data.userId,
        isAdmin:    false,
        loggedInAt: Date.now(),
      };
      setUser(session);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return { success: true, data: { ...data, apiKey: session.apiKey, userId: session.userId } };
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
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.isAdmin || false,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
