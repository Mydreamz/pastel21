import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { PaymentDistributionService } from '@/services/payment/PaymentDistributionService';

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
  total_earnings?: string;
  available_balance?: string;
}

// Global cache and in-flight request tracking
const globalProfileCache: Record<string, { data: ProfileData | null, timestamp: number }> = {};
const globalUserContentsCache: Record<string, { data: any[], timestamp: number }> = {};
const globalInFlightProfile: Record<string, Promise<ProfileData | null>> = {};
const globalInFlightContents: Record<string, Promise<any[]>> = {};
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export const useProfileData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, session, isLoading } = useAuth();
  const [userContents, setUserContents] = useState<any[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [fetchedData, setFetchedData] = useState(false);
  
  // Use refs to track request state
  const fetchInProgress = useRef(false);
  const hasFetchedRef = useRef(false);
  const lastFetchTime = useRef<number>(0);

  const fetchUserData = useCallback(async () => {
    if (!user) return;
    const userId = user.id;
    
    console.log("Fetching user data for userId:", userId);
    setIsLoadingData(true);
    
    try {
      // Profile cache
      const profileCache = globalProfileCache[userId];
      const now = Date.now();
      const shouldRefreshCache = !profileCache || (now - profileCache.timestamp) >= CACHE_TIME;
      
      console.log("Should refresh profile cache:", shouldRefreshCache);
      
      if (!shouldRefreshCache && profileCache) {
        console.log("Using cached profile data");
        setProfileData(profileCache.data);
        
        // Set balance from cached profile data if available
        if (profileCache.data?.available_balance) {
          const cachedBalance = parseFloat(profileCache.data.available_balance);
          console.log("Setting balance from cached profile:", cachedBalance);
          setBalance(cachedBalance);
        }
      } else if (globalInFlightProfile[userId]) {
        console.log("Using in-flight profile request");
        const profileResult = await globalInFlightProfile[userId];
        setProfileData(profileResult);
        
        // Set balance from profile if available
        if (profileResult?.available_balance) {
          const profileBalance = parseFloat(profileResult.available_balance);
          console.log("Setting balance from in-flight profile:", profileBalance);
          setBalance(profileBalance);
        }
      } else {
        console.log("Fetching fresh profile data");
        globalInFlightProfile[userId] = (async () => {
          try {
            if (userId && session?.access_token) {
              console.log("Invoking get-profile function");
              const { data, error } = await supabase.functions.invoke('get-profile', {
                body: { action: 'get' },
                headers: { Authorization: `Bearer ${session.access_token}` }
              });
              
              if (error) {
                console.error("Error fetching profile:", error);
                return null;
              }
              
              if (data?.data) {
                console.log("Profile data received:", data.data);
                globalProfileCache[userId] = { data: data.data as ProfileData, timestamp: now };
                setProfileData(data.data as ProfileData);
                
                // Update balance from profile data
                if (data.data.available_balance) {
                  const profileBalance = parseFloat(data.data.available_balance);
                  console.log("Setting balance from fresh profile:", profileBalance);
                  setBalance(profileBalance);
                }
                
                return data.data as ProfileData;
              }
            }
          } catch (e) { 
            console.error("Exception fetching profile:", e); 
          }
          return null;
        })();
        
        const profileResult = await globalInFlightProfile[userId];
        setProfileData(profileResult);
        delete globalInFlightProfile[userId];
      }
      
      // Always fetch the latest earnings summary to get the most accurate balance
      try {
        if (userId) {
          console.log("Fetching earnings summary");
          const earningsSummary = await PaymentDistributionService.getCreatorEarningsSummary(userId);
          if (earningsSummary) {
            console.log("Earnings summary received:", earningsSummary);
            // Update balance from earnings summary as it's the most accurate
            console.log("Setting balance from earnings summary:", earningsSummary.available_balance);
            setBalance(earningsSummary.available_balance);
          } else {
            console.log("No earnings summary received");
          }
        }
      } catch (e) {
        console.error("Error fetching earnings summary:", e);
      }
      
      // User contents cache
      const contentsCache = globalUserContentsCache[userId];
      if (contentsCache && (now - contentsCache.timestamp) < CACHE_TIME) {
        setUserContents(contentsCache.data);
      } else if (globalInFlightContents[userId]) {
        setUserContents(await globalInFlightContents[userId]);
      } else {
        globalInFlightContents[userId] = (async () => {
          const { data: contents, error } = await supabase.from('contents').select('*').eq('creator_id', userId);
          if (!error) {
            globalUserContentsCache[userId] = { data: contents || [], timestamp: now };
            setUserContents(contents || []);
            return contents || [];
          }
          return [];
        })();
        setUserContents(await globalInFlightContents[userId]);
        delete globalInFlightContents[userId];
      }
      
      setFetchedData(true);
      hasFetchedRef.current = true;
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoadingData(false);
    }
  }, [user, session]);

  useEffect(() => {
    if (!isLoading && user && session && !hasFetchedRef.current) {
      fetchUserData();
    } else if (!isLoading && !session) {
      // Only redirect if we've checked auth status and user is not logged in
      redirectToHome();
    }
  }, [user, session, isLoading, fetchUserData]);
  
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
      // localStorage.removeItem('auth');
      
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
    updateProfile,
    fetchedData,
    fetchUserData
  };
};
