
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pastel-900">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-pastel-500 border-r-2 rounded-full mx-auto mb-4"></div>
          <p className="text-pastel-200">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    // Redirect to home page if not admin
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
