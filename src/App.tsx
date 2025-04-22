
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/hooks/useTheme";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
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

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize Supabase auth listener at application startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Set up auth state listener for entire app
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log("App: Auth state changed:", event, session?.user?.id || "no user");
            
            // Update local storage for backward compatibility with existing code
            if (session) {
              const authData = {
                isAuthenticated: true,
                token: session.access_token,
                user: session.user,
              };
              localStorage.setItem('auth', JSON.stringify(authData));
            } else {
              localStorage.removeItem('auth');
            }
          }
        );
        
        // Check for existing session on app start
        const { data } = await supabase.auth.getSession();
        console.log("App: Initial session check:", data.session ? "Session exists" : "No session");
        
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <NotificationProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
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
  );
};

export default App;
