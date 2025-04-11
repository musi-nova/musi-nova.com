
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
  isEmailVerified?: boolean;
  spotifyConnected?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>; // Fixed signature
  logout: () => void;
  isAuthenticated: boolean;
  updateUserStatus: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('musinova_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(userData.isAuthenticated);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
  
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', email); // Ensure email is a string
      formData.append('password', password); // Ensure password is a string
      formData.append('scope', '');
      formData.append('client_id', 'string');
      formData.append('client_secret', 'string');
    
      const response = await fetch('https://mn-api.jms.rocks/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': 'application/json',
        },
        body: formData.toString(),
      });
  
      if (!response.ok) {
        throw new Error('Failed to log in');
      }
  
      const responseData = await response.json();

      console.log('Login response:', responseData);
  
      // Extract user data and token from the response
      const userData: User = {
        id: responseData.user.id,
        name: '', // Add name if available in the response
        email: responseData.user.email,
        isAuthenticated: true,
        isEmailVerified: false, // Adjust based on your API response
        spotifyConnected: false, // Adjust based on your API response
      };
  
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('musinova_user', JSON.stringify(userData));
      localStorage.setItem('access_token', responseData.access_token); // Store the token if needed
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('musinova_user');
  };

  const updateUserStatus = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('musinova_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, updateUserStatus }}>
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
