
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if admin is authenticated
    const isAdmin = sessionStorage.getItem('adminAuthenticated') === 'true';
    setIsAuthenticated(isAdmin);
    setIsAuthenticating(false);
  }, []);

  if (isAuthenticating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pastel-900">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-pastel-500 border-r-2 rounded-full mx-auto mb-4"></div>
          <p className="text-pastel-200">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to admin login page if not authenticated
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
