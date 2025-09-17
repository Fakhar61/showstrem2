import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  adminUser: { email: string; name: string } | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    // Check for existing session
    const stored = localStorage.getItem('admin-session');
    if (stored) {
      const session = JSON.parse(stored);
      if (session.expiry > Date.now()) {
        setIsAuthenticated(true);
        setAdminUser(session.user);
      } else {
        localStorage.removeItem('admin-session');
      }
    }
  }, []);

  const login = async (email: string) => {
    // Mock authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = { email, name: 'Artist' };
    const session = {
      user,
      expiry: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    };
    
    localStorage.setItem('admin-session', JSON.stringify(session));
    setAdminUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('admin-session');
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, adminUser }}>
      {children}
    </AdminAuthContext.Provider>
  );
};