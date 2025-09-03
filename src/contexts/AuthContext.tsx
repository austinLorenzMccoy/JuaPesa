import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  provider?: 'email' | 'google' | 'github' | 'wallet';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithWallet: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('jua_pesa_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      provider: 'email'
    };
    
    setUser(mockUser);
    localStorage.setItem('jua_pesa_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      email,
      name,
      provider: 'email'
    };
    
    setUser(mockUser);
    localStorage.setItem('jua_pesa_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jua_pesa_user');
  };

  const resetPassword = async (email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password reset email sent to:', email);
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '2',
      email: 'user@gmail.com',
      name: 'Google User',
      provider: 'google'
    };
    
    setUser(mockUser);
    localStorage.setItem('jua_pesa_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const loginWithGithub = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '3',
      email: 'user@github.com',
      name: 'GitHub User',
      provider: 'github'
    };
    
    setUser(mockUser);
    localStorage.setItem('jua_pesa_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const loginWithWallet = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '4',
      name: 'Wallet User',
      provider: 'wallet'
    };
    
    setUser(mockUser);
    localStorage.setItem('jua_pesa_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('jua_pesa_user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    resetPassword,
    loginWithGoogle,
    loginWithGithub,
    loginWithWallet,
    updateProfile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};