import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { storage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For MVP, create a user if they don't exist (simplified auth)
    const mockUser: User = {
      id: `user_${Date.now()}`,
      email,
      username: email.split('@')[0],
      avgCycleLength: 28,
      avgPeriodLength: 5,
      createdAt: new Date()
    };
    
    storage.setCurrentUser(mockUser);
    setUser(mockUser);
    setIsLoading(false);
    
    return true;
  };
  
  const register = async (email: string, password: string, username: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      username,
      avgCycleLength: 28,
      avgPeriodLength: 5,
      createdAt: new Date()
    };
    
    storage.setCurrentUser(newUser);
    setUser(newUser);
    setIsLoading(false);
    
    return true;
  };
  
  const logout = () => {
    storage.clearCurrentUser();
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};