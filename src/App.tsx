import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/hooks/useTheme";
import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from '@supabase/supabase-js';
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreateContent from "./pages/CreateContent";
import ViewContent from "./pages/ViewContent";
import EditContent from "./pages/EditContent";
import Profile from "./pages/Profile";
import ContentSuccess from "./pages/ContentSuccess";
import NotFound from "./pages/NotFound";
import PreviewContent from "./pages/PreviewContent";
import Search from "./pages/Search";
import ForgotPassword from "./pages/ForgotPassword";
import Marketplace from "./pages/Marketplace";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

// Protected route component to handle authentication
interface ProtectedRouteProps {
  children: JSX.Element;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const ProtectedRoute = ({ children, isAuthenticated, isLoading }: ProtectedRouteProps) => {
  const location = useLocation();
  
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
  
  if (!isAuthenticated) {
    // Redirect to home page if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const hash = window.location.hash;
      
      if (hash && hash.includes('access_token')) {
        try {
          const { data } = await supabase.auth.getSession();
          
          if (data?.session) {
            console.log("Successfully authenticated from email confirmation");
            setSession(data.session);
            setUser(data.session.user);
            
            const authData = {
              isAuthenticated: true,
              token: data.session.access_token,
              user: data.session.user,
            };
            localStorage.setItem('auth', JSON.stringify(authData));
            
            window.location.hash = '';
          }
        } catch (error) {
          console.error("Failed to process email confirmation:", error);
        }
      }
    };
    
    handleEmailConfirmation();
  }, []);
  
  useEffect(() => {
    console.log("App: Setting up auth state management");
    
    const initializeAuth = async () => {
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            console.log("App: Auth state changed:", event, newSession?.user?.id || "no user");
            
            setSession(newSession);
            setUser(newSession?.user || null);
            
            if (newSession) {
              const authData = {
                isAuthenticated: true,
                token: newSession.access_token,
                user: newSession.user,
              };
              localStorage.setItem('auth', JSON.stringify(authData));
              console.log("App: Updated local storage with auth data");
            } else {
              localStorage.removeItem('auth');
              console.log("App: Removed auth data from local storage");
            }
          }
        );
        
        const { data } = await supabase.auth.getSession();
        console.log("App: Initial session check:", data.session ? `Session exists for ${data.session.user.id}` : "No session");
        
        setSession(data.session);
        setUser(data.session?.user || null);
        
        if (data.session) {
          const authData = {
            isAuthenticated: true,
            token: data.session.access_token,
            user: data.session.user,
          };
          localStorage.setItem('auth', JSON.stringify(authData));
          console.log("App: Updated local storage with initial session data");
        }
        
        setIsInitialized(true);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsInitialized(true);
      }
    };
    
    initializeAuth();
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
    <AuthContext.Provider value={{ session, user, isLoading: !isInitialized }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ThemeProvider>
            <NotificationProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={session ? <Navigate to="/dashboard" /> : <Index />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute isAuthenticated={!!session} isLoading={!isInitialized}>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/create" element={
                    <ProtectedRoute isAuthenticated={!!session} isLoading={!isInitialized}>
                      <CreateContent />
                    </ProtectedRoute>
                  } />
                  {/* Make view and preview routes public */}
                  <Route path="/view/:id" element={<ViewContent />} />
                  <Route path="/preview/:id" element={<PreviewContent />} />
                  <Route path="/edit/:id" element={
                    <ProtectedRoute isAuthenticated={!!session} isLoading={!isInitialized}>
                      <EditContent />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute isAuthenticated={!!session} isLoading={!isInitialized}>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/success" element={
                    <ProtectedRoute isAuthenticated={!!session} isLoading={!isInitialized}>
                      <ContentSuccess />
                    </ProtectedRoute>
                  } />
                  <Route path="/search" element={
                    <ProtectedRoute isAuthenticated={!!session} isLoading={!isInitialized}>
                      <Search />
                    </ProtectedRoute>
                  } />
                  <Route path="/marketplace" element={
                    <ProtectedRoute isAuthenticated={!!session} isLoading={!isInitialized}>
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
    </AuthContext.Provider>
  );
};

export default App;
