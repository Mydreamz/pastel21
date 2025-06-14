import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/hooks/useTheme";
import { useState, useEffect, lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ContentCacheProvider } from "@/contexts/ContentCacheContext";
import AdminRoute from "./components/admin/AdminRoute";
import MobileNavigation from "./components/navigation/MobileNavigation";

// Lazy-loaded components for better performance
const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateContent = lazy(() => import("./pages/CreateContent"));
const ViewContent = lazy(() => import("./pages/ViewContent"));
const EditContent = lazy(() => import("./pages/EditContent"));
const Profile = lazy(() => import("./pages/Profile"));
const ContentSuccess = lazy(() => import("./pages/ContentSuccess"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Search = lazy(() => import("./pages/Search"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

// Loading component for suspense fallback
const Loading = () => <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin h-8 w-8 border-t-2 border-pastel-500 border-r-2 rounded-full mx-auto mb-4"></div>
      <p>Loading...</p>
    </div>
  </div>;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60000,
      // 1 minute
      // Updated to use gcTime instead of cacheTime
      gcTime: 300000 // 5 minutes
    }
  }
});

// Protected route component to handle authentication
interface ProtectedRouteProps {
  children: JSX.Element;
}
const ProtectedRoute = ({
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const {
    isLoading,
    session
  } = useAuth();
  if (isLoading) {
    return <Loading />;
  }
  if (!session) {
    // Redirect to home page if not authenticated
    return <Navigate to="/" state={{
      from: location
    }} replace />;
  }
  return children;
};

// Component to handle home page redirection based on auth status
const HomePageRoute = () => {
  const {
    isLoading,
    session
  } = useAuth();
  if (isLoading) {
    return <Loading />;
  }

  // Redirect to dashboard if user is logged in, otherwise show the landing page
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Index />;
};
const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        setIsInitialized(true);
        window.location.hash = '';
      } else {
        setIsInitialized(true);
      }
    };
    handleEmailConfirmation();
  }, []);
  
  if (!isInitialized) {
    return <Loading />;
  }
  
  return (
    <AuthProvider>
      <ContentCacheProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <ThemeProvider>
              <NotificationProvider>
                <div className="min-h-screen bg-background">
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Suspense fallback={<Loading />}>
                      <Routes>
                        <Route path="/" element={<HomePageRoute />} />
                        <Route path="/dashboard" element={<ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>} />
                        <Route path="/create" element={<ProtectedRoute>
                            <CreateContent />
                          </ProtectedRoute>} />
                        {/* Make view route public */}
                        <Route path="/view/:id" element={<ViewContent />} />
                        <Route path="/edit/:id" element={<ProtectedRoute>
                            <EditContent />
                          </ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>} />
                        <Route path="/success" element={<ProtectedRoute>
                            <ContentSuccess />
                          </ProtectedRoute>} />
                        <Route path="/search" element={<ProtectedRoute>
                            <Search />
                          </ProtectedRoute>} />
                        <Route path="/marketplace" element={<ProtectedRoute>
                            <Marketplace />
                          </ProtectedRoute>} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        
                        {/* Admin Routes - keeping these routes but removing UI buttons */}
                        <Route path="/admin" element={<AdminLogin />} />
                        <Route path="/admin/dashboard" element={<AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>} />
                        
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                    <MobileNavigation />
                  </BrowserRouter>
                </div>
              </NotificationProvider>
            </ThemeProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ContentCacheProvider>
    </AuthProvider>
  );
};

export default App;
