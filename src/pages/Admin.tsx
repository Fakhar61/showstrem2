import React from 'react';
import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const AdminContent: React.FC = () => {
  const { isAuthenticated } = useAdminAuth();
  
  if (isAuthenticated) {
    // Redirect to CMS after login
    window.location.href = '/admin/cms';
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-muted-foreground">Redirecting to CMS...</div>
    </div>;
  }
  
  return <AdminLogin />;
};

export default function Admin() {
  return (
    <AdminAuthProvider>
      <AdminContent />
    </AdminAuthProvider>
  );
}