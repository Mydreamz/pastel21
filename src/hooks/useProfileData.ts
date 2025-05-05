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
    // Profile cache
    const profileCache = globalProfileCache[userId];
    if (profileCache && Date.now() - profileCache.timestamp < CACHE_TIME) {
      setProfileData(profileCache.data);
    } else if (globalInFlightProfile[userId]) {
      setProfileData(await globalInFlightProfile[userId]);
    } else {
      globalInFlightProfile[userId] = (async () => {
        try {
          if (userId && session?.access_token) {
            const { data, error } = await supabase.functions.invoke('get-profile', {
              body: { action: 'get' },
              headers: { Authorization: `Bearer ${session.access_token}` }
            });
            if (!error && data?.data) {
              globalProfileCache[userId] = { data: data.data as ProfileData, timestamp: Date.now() };
              setProfileData(data.data as ProfileData);
              return data.data as ProfileData;
            }
          }
        } catch (e) { console.error(e); }
        return null;
      })();
      setProfileData(await globalInFlightProfile[userId]);
      delete globalInFlightProfile[userId];
    }
    // User contents cache
    const contentsCache = globalUserContentsCache[userId];
    if (contentsCache && Date.now() - contentsCache.timestamp < CACHE_TIME) {
      setUserContents(contentsCache.data);
    } else if (globalInFlightContents[userId]) {
      setUserContents(await globalInFlightContents[userId]);
    } else {
      globalInFlightContents[userId] = (async () => {
        const { data: contents, error } = await supabase.from('contents').select('*').eq('creator_id', userId);
        if (!error) {
          globalUserContentsCache[userId] = { data: contents || [], timestamp: Date.now() };
          setUserContents(contents || []);
          return contents || [];
        }
        return [];
      })();
      setUserContents(await globalInFlightContents[userId]);
      delete globalInFlightContents[userId];
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
    updateProfile,
    fetchedData,
    fetchUserData
  };
};
