
import { apiFetch } from '@/lib/api';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  confirmPasswordReset
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface User {
  id: string;
  user_name: string;
  team_id: string;
  team_name?: string;
  email: string;
  isAuthenticated: boolean;
  isEmailVerified?: boolean;
  spotifyConnected?: boolean;
  super_user?: boolean;
  plan_1_user?: boolean;
  plan_2_user?: boolean;
  plan_3_user?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
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
  const [loading, setLoading] = useState(true);

  const syncWithBackend = async (firebaseUser: FirebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      const response = await apiFetch('auth/firebase', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Backend sync failed');
      }

      const data = await response.json();
      const userData: User = {
        id: data.user.id,
        user_name: data.user.name,
        team_id: data.user.team_id,
        team_name: data.user.team_name,
        email: data.user.email,
        isAuthenticated: true,
        isEmailVerified: firebaseUser.emailVerified,
        spotifyConnected: false,
        super_user: data.user.super_user,
        plan_1_user: data.user.plan_1_user,
        plan_2_user: data.user.plan_2_user,
        plan_3_user: data.user.plan_3_user,
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('musinova_user', JSON.stringify(userData));
      localStorage.setItem('access_token', data.access_token);
    } catch (error) {
      console.error('Error syncing with backend:', error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('musinova_user');
      localStorage.removeItem('access_token');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        await syncWithBackend(firebaseUser);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('musinova_user');
        localStorage.removeItem('access_token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await syncWithBackend(userCredential.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await syncWithBackend(userCredential.user);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await syncWithBackend(userCredential.user);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const loginWithMicrosoft = async () => {
    try {
      const provider = new OAuthProvider('microsoft.com');
      const userCredential = await signInWithPopup(auth, provider);
      await syncWithBackend(userCredential.user);
    } catch (error) {
      console.error('Microsoft login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
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
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  // Reset password with token
  const resetPassword = async (token: string, new_password: string) => {
    try {
      await confirmPasswordReset(auth, token, new_password);
    } catch (error) {
      console.error('Confirm password reset error:', error);
      throw error;
    }
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register,
      loginWithGoogle, 
      loginWithMicrosoft,
      logout, 
      isAuthenticated, 
      updateUserStatus, 
      requestPasswordReset, 
      resetPassword 
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