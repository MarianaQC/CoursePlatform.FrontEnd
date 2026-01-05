import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types/api';
import { authService } from '@/services/auth-service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    if (authService.isAuthenticated()) {
      const storedUser = authService.getStoredUser();
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.data) {
        authService.storeAuthData(response.data);
        setUser({
          email: response.data.email,
          fullName: response.data.fullName,
          roles: response.data.roles,
        });
        return { success: true };
      }
      
      return { 
        success: false, 
        error: response.message || response.errors?.join(', ') || 'Error al iniciar sesión' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: 'No se pudo conectar con el servidor' 
      };
    }
  }, []);

  const register = useCallback(async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    try {
      const response = await authService.register(data);
      
      if (response.success && response.data) {
        authService.storeAuthData(response.data);
        setUser({
          email: response.data.email,
          fullName: response.data.fullName,
          roles: response.data.roles,
        });
        return { success: true };
      }
      
      return { 
        success: false, 
        error: response.message || response.errors?.join(', ') || 'Error al registrarse' 
      };
    } catch (error) {
      return { 
        success: false, 
        error: 'No se pudo conectar con el servidor' 
      };
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.roles?.includes('Admin') ?? false,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
