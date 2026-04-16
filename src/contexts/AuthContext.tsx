import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api } from '@/services/api';
import { User, UserRole } from '@/types';
import { AUTH_INVALIDATED_EVENT } from '@/utils/authSession';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  refreshUser: () => Promise<User | null>;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function persistSession(user: User, token: string) {
  localStorage.setItem('azores_score_user', JSON.stringify(user));
  localStorage.setItem('azores_score_token', token);
}

function clearPersistedSession() {
  localStorage.removeItem('azores_score_user');
  localStorage.removeItem('azores_score_token');
}

function readPersistedUser(): User | null {
  const storedUser = localStorage.getItem('azores_score_user');

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch (_error) {
    clearPersistedSession();
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSessionState = useCallback(() => {
    setUser(null);
    setToken(null);
    clearPersistedSession();
  }, []);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    const activeToken = localStorage.getItem('azores_score_token');
    const persistedUser = readPersistedUser();

    if (!activeToken) {
      clearSessionState();
      return null;
    }

    try {
      const response = await api.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${activeToken}`
        }
      });

      const currentUser = response.data?.data?.user as User | undefined;

      if (!currentUser) {
        throw new Error('Invalid auth payload');
      }

      setUser(currentUser);
      setToken(activeToken);
      persistSession(currentUser, activeToken);
      return currentUser;
    } catch (error: any) {
      const statusCode = error?.response?.status;

      if (!statusCode && persistedUser) {
        setUser(persistedUser);
        setToken(activeToken);
        return persistedUser;
      }

      clearSessionState();
      return null;
    }
  }, [clearSessionState]);

  useEffect(() => {
    const handleSessionInvalidated = () => {
      clearSessionState();
      setIsLoading(false);
    };

    window.addEventListener(AUTH_INVALIDATED_EVENT, handleSessionInvalidated as EventListener);

    return () => {
      window.removeEventListener(AUTH_INVALIDATED_EVENT, handleSessionInvalidated as EventListener);
    };
  }, [clearSessionState]);

  // Restaurar sessão ao carregar a página
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      const storedToken = localStorage.getItem('azores_score_token');
      const storedUser = readPersistedUser();

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          setUser(storedUser);
        }

        const currentUser = await refreshUser();
        if (!cancelled && currentUser) {
          setUser(currentUser);
        }
      } else if (storedUser) {
        clearSessionState();
      }

      if (!cancelled) {
        setIsLoading(false);
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, [clearSessionState, refreshUser]);

  // ================= LOGIN =================
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;

      if (!data.success) {
        return false;
      }

      // Backend retorna { success: true, data: { user: {...}, token: "..." } }
      const userData = data.data?.user;
      const newToken = data.data?.token;

      if (!userData || !newToken) {
        return false;
      }

      setToken(newToken);
      persistSession(userData, newToken);
      setUser(userData);
      return true;
    } catch (_error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ================= REGISTER =================
  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', { email, password, name, role });
      const data = response.data;

      if (!data.success) {
        return false;
      }

      // Backend retorna { success: true, data: { user: {...}, token: "..." } } ou { success: true, user: {...}, token: "..." }
      const userData = data.data?.user || data.user;
      const newToken = data.data?.token || data.token;

      if (!userData || !newToken) {
        return false;
      }

      setToken(newToken);
      persistSession(userData, newToken);
      setUser(userData);
      return true;
    } catch (_error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    clearSessionState();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        refreshUser,
        logout,
        isAuthenticated: !!user,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
