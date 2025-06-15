
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>; // Add signOut method
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  isAdmin: false,
  refresh: async () => {},
  logout: async () => {},
  signOut: async () => {} // Add signOut to default context
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const isInitialized = useRef(false);

  // Function to refresh auth state manually if needed
  const refresh = async () => {
    if (isInitialized.current) {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);
      } catch (error) {
        console.error("Error refreshing session:", error);
      }
    }
  };

  // Function to logout user
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Add signOut method (same as logout)
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    if (isInitialized.current) return;
    
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
        
        // REMOVED insecure storage of auth data in localStorage
      }
    );
    
    // Check for existing session
    const initSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setIsLoading(false);
        isInitialized.current = true;
      }
    };

    initSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const { data, error } = await supabase.rpc('is_admin');
          if (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
          } else {
            setIsAdmin(data);
          }
        } catch (e) {
          console.error('Exception checking admin status', e);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    if (!isLoading) {
      checkAdminStatus();
    }
  }, [user, isLoading]);

  const value = {
    session,
    user,
    isLoading,
    isAdmin,
    refresh,
    logout,
    signOut // Include signOut in the context value
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// A simpler hook to replace the current useAuth in App.tsx
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
