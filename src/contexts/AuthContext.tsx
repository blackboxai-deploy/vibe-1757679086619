'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/chat';
import { saveUser, getStoredUser, removeStoredUser, generateAvatarUrl, generateId } from '@/lib/storage';

const AuthContext = createContext<AuthState | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for stored user on component mount
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (username: string) => {
    if (!username.trim()) {
      throw new Error('Username cannot be empty');
    }

    const newUser: User = {
      id: generateId(),
      username: username.trim(),
      avatar: generateAvatarUrl(username.trim()),
      isOnline: true,
      lastSeen: new Date(),
    };

    setUser(newUser);
    setIsAuthenticated(true);
    saveUser(newUser);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    removeStoredUser();
  };

  const value: AuthState = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;