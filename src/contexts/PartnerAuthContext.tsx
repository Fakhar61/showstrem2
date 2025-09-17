import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PartnerAuthContextType {
  isAuthenticated: boolean;
  email: string | null;
  login: (email: string) => void;
  logout: () => void;
}

const PartnerAuthContext = createContext<PartnerAuthContextType | undefined>(undefined);

interface PartnerAuthProviderProps {
  children: ReactNode;
}

export const PartnerAuthProvider = ({ children }: PartnerAuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const login = (userEmail: string) => {
    setEmail(userEmail);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setEmail(null);
    setIsAuthenticated(false);
  };

  return (
    <PartnerAuthContext.Provider value={{ isAuthenticated, email, login, logout }}>
      {children}
    </PartnerAuthContext.Provider>
  );
};

export const usePartnerAuth = () => {
  const context = useContext(PartnerAuthContext);
  if (context === undefined) {
    throw new Error('usePartnerAuth must be used within a PartnerAuthProvider');
  }
  return context;
};