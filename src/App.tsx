
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

// Create a new Query Client with proper settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Create auth context to manage auth state globally
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

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  // Handle access token in URL hash (for email confirmations)
  useEffect(() => {
    // This handles the redirect from email confirmation
    const handleEmailConfirmation = async () => {
      const hash = window.location.hash;
      
      if (hash && hash.includes('access_token')) {
        try {
          // Process the hash fragment containing the access token
          const { data } = await supabase.auth.getSession();
          
          if (data?.session) {
            console.log("Successfully authenticated from URL");
            setSession(data.session);
            setUser(data.session.user);
            
            // Store auth data in localStorage for backward compatibility
            const authData = {
              isAuthenticated: true,
              token: data.session.access_token,
              user: data.session.user,
            };
            localStorage.setItem('auth', JSON.stringify(authData));
            
            // Clear the hash fragment from the URL to avoid authentication on page refresh
            window.location.hash = '';
          }
        } catch (error) {
          console.error("Failed to process authentication URL:", error);
        }
      }
    };
    
    handleEmailConfirmation();
  }, []);
  
  // Initialize Supabase auth listener at application startup
  useEffect(() => {
    console.log("App: Setting up auth state management");
    
    const initializeAuth = async () => {
      try {
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            console.log("App: Auth state changed:", event, newSession?.user?.id || "no user");
            
            setSession(newSession);
            setUser(newSession?.user || null);
            
            // Update local storage for backward compatibility with existing code
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
        
        // Then check for existing session
        const { data } = await supabase.auth.getSession();
        console.log("App: Initial session check:", data.session ? `Session exists for ${data.session.user.id}` : "No session");
        
        // Update state with initial session
        setSession(data.session);
        setUser(data.session?.user || null);
        
        // Update local storage if session exists
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
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/create" element={<CreateContent />} />
                  <Route path="/view/:id" element={<ViewContent />} />
                  <Route path="/preview/:id" element={<PreviewContent />} />
                  <Route path="/edit/:id" element={<EditContent />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/success" element={<ContentSuccess />} />
                  <Route path="/search" element={<Search />} />
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
