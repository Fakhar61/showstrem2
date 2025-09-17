import React from 'react';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import AdminDashboard from './AdminDashboard';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const ArtistDashboard: React.FC = () => {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1">
          <AdminDashboard />
        </main>
        <Footer />
      </div>
    </AdminAuthProvider>
  );
};

export default ArtistDashboard;