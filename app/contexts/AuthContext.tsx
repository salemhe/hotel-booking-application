'use client'
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check localStorage for user and token
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('auth_user');
      const token = localStorage.getItem('auth_token');
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      // Store user data in localStorage for persistence
      localStorage.setItem('auth_user', JSON.stringify(userData));
      console.log('Auth context updated with user:', userData);
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout, 
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;