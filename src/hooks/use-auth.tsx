
import { apiFetch } from '@/lib/api';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  user_name: string;
  team_id: string;
  email: string;
  isAuthenticated: boolean;
  isEmailVerified?: boolean;
  spotifyConnected?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUserStatus: (updates: Partial<User>) => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(storedUser.isAuthenticated);
    }
  }, []);

  const getUser = (): User | null => {
    const storedUser = localStorage.getItem('musinova_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser) as User;
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        return null;
      }
    }
    return null;
  };

  const login = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
  
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', email);
      formData.append('password', password);
      formData.append('scope', '');
      formData.append('client_id', 'string');
      formData.append('client_secret', 'string');
    
      const response = await apiFetch('login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status} ${response.statusText}`);
      }
      const responseData = await response.json();

      console.log('Login response:', responseData);
  
      // Extract user data and token from the response
      const userData: User = {
        id: responseData.user.id,
        user_name: responseData.user.user_name,
        team_id: responseData.user.team_id,
        email: responseData.user.email,
        isAuthenticated: true,
        isEmailVerified: false,
        spotifyConnected: false,
      };
  
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('musinova_user', JSON.stringify(userData));
      localStorage.setItem('access_token', responseData.access_token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('musinova_user');
    localStorage.removeItem('access_token');
  };

  const updateUserStatus = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('musinova_user', JSON.stringify(updatedUser));
    }
  };

  // Request password reset
  const requestPasswordReset = async (email: string) => {
    const response = await apiFetch('forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      throw new Error('Failed to send reset email');
    }
  };

  // Reset password with token
  const resetPassword = async (token: string, new_password: string) => {
    const response = await apiFetch('reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, new_password }),
    });
    if (!response.ok) {
      throw new Error('Failed to reset password');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, updateUserStatus, requestPasswordReset, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return {
    ...context,
    getUser: () => {
      const storedUser = localStorage.getItem('musinova_user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser) as User;
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
          return null;
        }
      }
      return null;
    },
  };
};