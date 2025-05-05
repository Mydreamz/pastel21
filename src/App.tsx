
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/hooks/useTheme";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ContentCacheProvider } from "@/contexts/ContentCacheContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreateContent from "./pages/CreateContent";
import ViewContent from "./pages/ViewContent";
import EditContent from "./pages/EditContent";
import Profile from "./pages/Profile";
import ContentSuccess from "./pages/ContentSuccess";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import ForgotPassword from "./pages/ForgotPassword";
import Marketplace from "./pages/Marketplace";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // Add stale time to reduce redundant refetches
      staleTime: 60000, // 1 minute
    },
  },
});

// Protected route component to handle authentication
interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isLoading, session } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-emerald-500 border-r-2 rounded-full mx-auto mb-4"></div>
          <p>Authenticating...</p>
        </div>
      </div>
    );
  }
  
  if (!session) {
    // Redirect to home page if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

// Component to handle home page redirection based on auth status
const HomePageRoute = () => {
  const { isLoading, session } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-emerald-500 border-r-2 rounded-full mx-auto mb-4"></div>
          <p>Authenticating...</p>
        </div>
      </div>
    );
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
    // Handle email confirmation from hash
    const handleEmailConfirmation = async () => {
      const hash = window.location.hash;
      
      if (hash && hash.includes('access_token')) {
        setIsInitialized(true);  // Will be handled by AuthProvider
        window.location.hash = '';
      } else {
        setIsInitialized(true);
      }
    };
    
    handleEmailConfirmation();
  }, []);
  
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-emerald-500 border-r-2 rounded-full mx-auto mb-4"></div>
          <p>Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <ContentCacheProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <ThemeProvider>
              <NotificationProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<HomePageRoute />} />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/create" element={
                      <ProtectedRoute>
                        <CreateContent />
                      </ProtectedRoute>
                    } />
                    {/* Make view route public */}
                    <Route path="/view/:id" element={<ViewContent />} />
                    <Route path="/edit/:id" element={
                      <ProtectedRoute>
                        <EditContent />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/success" element={
                      <ProtectedRoute>
                        <ContentSuccess />
                      </ProtectedRoute>
                    } />
                    <Route path="/search" element={
                      <ProtectedRoute>
                        <Search />
                      </ProtectedRoute>
                    } />
                    <Route path="/marketplace" element={
                      <ProtectedRoute>
                        <Marketplace />
                      </ProtectedRoute>
                    } />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </NotificationProvider>
            </ThemeProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ContentCacheProvider>
    </AuthProvider>
  );
};

export default App;
