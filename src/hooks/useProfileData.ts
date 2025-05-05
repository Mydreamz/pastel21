
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

// Define a ProfileData type to use throughout the application
export interface ProfileData {
  id: string;
  name?: string;
  bio?: string;
  location?: string;
  twitter_url?: string;
  linkedin_url?: string;
  github_url?: string;
  updated_at?: string;
}

export const useProfileData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, session, isLoading } = useAuth();
  const [userContents, setUserContents] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [fetchedData, setFetchedData] = useState(false);
  
  // Use a ref to track if a fetch is already in progress
  const fetchInProgress = useRef(false);

  // Use a memoized fetchUserData function to prevent multiple re-renders
  const fetchUserData = useCallback(async () => {
    if (!user || fetchInProgress.current) return;
    
    // Set flag to prevent concurrent fetches
    fetchInProgress.current = true;
    
    try {
      setIsLoadingData(true);
      
      // Get user contents from Supabase
      const { data: contents, error: contentsError } = await supabase
        .from('contents')
        .select('*')
        .eq('creator_id', user.id);
        
      if (contentsError) throw contentsError;
      setUserContents(contents || []);

      // Calculate balance from unlocked content (transactions)
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('creator_id', user.id);
        
      if (transactionsError) throw transactionsError;

      const userEarnings = (transactions || [])
        .reduce((sum: number, tx: any) => sum + parseFloat(tx.amount), 0);

      setBalance(userEarnings);
      
      // Fetch user profile data using Edge Function
      if (user.id && session?.access_token) {
        try {
          // Call the get-profile Edge Function with auth token
          const { data, error } = await supabase.functions.invoke('get-profile', {
            body: { action: 'get' },
            headers: {
              Authorization: `Bearer ${session.access_token}`
            }
          });
          
          if (error) {
            console.error("Error calling get-profile function:", error);
          } else if (data?.data) {
            setProfileData(data.data as ProfileData);
          }
        } catch (profileError) {
          console.error("Error in profile fetch:", profileError);
        }
      }
    } catch (e) {
      console.error("Error fetching user data:", e);
      toast({
        title: "Error loading profile data",
        description: "Failed to load your profile information",
        variant: "destructive"
      });
    } finally {
      setIsLoadingData(false);
      setFetchedData(true);
      // Reset the in-progress flag
      fetchInProgress.current = false;
    }
  }, [user, session, toast]);

  useEffect(() => {
    if (!isLoading && user && session && !fetchedData && !fetchInProgress.current) {
      fetchUserData();
    } else if (!isLoading && !session) {
      // Only redirect if we've checked auth status and user is not logged in
      redirectToHome();
    }
  }, [user, session, isLoading, fetchUserData, fetchedData]);
  
  const redirectToHome = () => {
    toast({
      title: "Authentication required",
      description: "Please sign in to access this page",
      variant: "destructive"
    });
    navigate('/');
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      
      // Clear any auth-related data from localStorage
      localStorage.removeItem('auth');
      
      toast({
        title: "Logged out successfully"
      });
      navigate('/');
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred while logging out",
        variant: "destructive"
      });
    }
  };
  
  const handleEditContent = (contentId: string) => {
    navigate(`/edit/${contentId}`);
  };
  
  const handleDeleteContent = async (contentId: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase.from('contents').delete().eq('id', contentId);
      if (error) throw error;

      setUserContents(prevContents => prevContents.filter(content => content.id !== contentId));

      toast({
        title: "Content deleted",
        description: "Your content has been successfully deleted."
      });
    } catch (error: any) {
      console.error("Error deleting content:", error);
      toast({
        title: "Delete failed",
        description: error.message || "An error occurred while deleting your content.",
        variant: "destructive"
      });
    }
  };
  
  // Use a ref to track in-progress profile updates
  const updateInProgress = useRef(false);
  
  const updateProfile = async (profileData: Partial<ProfileData>) => {
    if (!user || !session) return { error: new Error("User not authenticated") };
    if (updateInProgress.current) return { error: new Error("Update already in progress") };
    
    updateInProgress.current = true;
    
    try {
      // Call the Edge Function to update profile data
      const { data, error } = await supabase.functions.invoke('get-profile', {
        body: { 
          action: 'update', 
          profileData 
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Update local state instead of refetching
      setProfileData(prev => ({
        ...prev,
        ...profileData
      }) as ProfileData);
      
      return { success: true };
    } catch (error: any) {
      console.error("Profile update error:", error);
      return { error };
    } finally {
      updateInProgress.current = false;
    }
  };

  return {
    isAuthenticated: !!session,
    userData: user,
    userContents,
    balance,
    isLoading: isLoadingData,
    profileData,
    handleLogout,
    handleEditContent,
    handleDeleteContent,
    updateProfile
  };
};
