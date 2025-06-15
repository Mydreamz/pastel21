import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfileCache } from './useProfileCache';
import { ProfileData } from '@/types/profile';

/**
 * Hook for fetching profile data from API
 */
export const useProfileFetch = (
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData | null>>,
  setBalance: React.Dispatch<React.SetStateAction<number>>,
  setUserContents: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const { 
    shouldRefreshProfileCache,
    shouldRefreshContentsCache,
    cacheProfile,
    cacheContents,
    getCachedProfile,
    getCachedContents,
    setProfileInFlight,
    setContentsInFlight,
    getProfileInFlight,
    getContentsInFlight,
    clearProfileInFlight,
    clearContentsInFlight,
    clearProfileCacheForUser
  } = useProfileCache();

  // Fetch user profile data from API or cache
  const fetchUserProfileData = useCallback(async (user: any, session: any) => {
    if (!user || !session) return null;
    
    const userId = user.id;
    console.log("Fetching profile data for user:", userId);
    
    // Check if we should use cache
    if (!shouldRefreshProfileCache(userId)) {
      const cachedProfile = getCachedProfile(userId);
      console.log("Using cached profile data:", cachedProfile);
      setProfileData(cachedProfile);
      
      // Set balance from cached profile data if available
      if (cachedProfile?.available_balance) {
        const cachedBalance = parseFloat(cachedProfile.available_balance);
        console.log("Setting balance from cached profile:", cachedBalance);
        setBalance(cachedBalance);
      }
      
      return cachedProfile;
    }
    
    // Check if there's an in-flight request
    const inFlightProfile = getProfileInFlight(userId);
    if (inFlightProfile) {
      console.log("Using in-flight profile request");
      const profileResult = await inFlightProfile;
      
      if (profileResult?.available_balance) {
        const profileBalance = parseFloat(profileResult.available_balance);
        console.log("Setting balance from in-flight profile:", profileBalance);
        setBalance(profileBalance);
      }
      
      return profileResult;
    }
    
    // Make a new request
    console.log("Fetching fresh profile data");
    const profilePromise = (async () => {
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
            const profileData = data.data as ProfileData;
            cacheProfile(userId, profileData);
            setProfileData(profileData);
            
            // Update balance from profile data
            if (profileData.available_balance) {
              const profileBalance = parseFloat(profileData.available_balance);
              console.log("Setting balance from fresh profile:", profileBalance);
              setBalance(profileBalance);
            }
            
            return profileData;
          }
        }
      } catch (e) { 
        console.error("Exception fetching profile:", e); 
      }
      return null;
    })();
    
    // Track the in-flight request
    setProfileInFlight(userId, profilePromise);
    
    // Wait for the request to complete
    const profileResult = await profilePromise;
    
    // Clear the in-flight request
    clearProfileInFlight(userId);
    
    return profileResult;
  }, [
    shouldRefreshProfileCache, 
    getCachedProfile, 
    getProfileInFlight, 
    setProfileInFlight, 
    clearProfileInFlight, 
    cacheProfile, 
    setProfileData, 
    setBalance
  ]);

  // Fetch user contents from API or cache
  const fetchUserContents = useCallback(async (userId: string) => {
    if (!userId) return [];
    
    console.log("Fetching contents for user:", userId);
    
    // Check if we should use cache
    if (!shouldRefreshContentsCache(userId)) {
      const cachedContents = getCachedContents(userId);
      console.log("Using cached contents:", cachedContents.length, "items");
      setUserContents(cachedContents);
      return cachedContents;
    }
    
    // Check if there's an in-flight request
    const inFlightContents = getContentsInFlight(userId);
    if (inFlightContents) {
      console.log("Using in-flight contents request");
      const contentsResult = await inFlightContents;
      setUserContents(contentsResult);
      return contentsResult;
    }
    
    // Make a new request
    console.log("Fetching fresh contents data");
    const contentsPromise = (async () => {
      const { data: contents, error } = await supabase
        .from('contents')
        .select('*')
        .eq('creator_id', userId);
        
      if (error) {
        console.error("Error fetching contents:", error);
        return [];
      }
      
      const result = contents || [];
      cacheContents(userId, result);
      setUserContents(result);
      return result;
    })();
    
    // Track the in-flight request
    setContentsInFlight(userId, contentsPromise);
    
    // Wait for the request to complete
    const contentsResult = await contentsPromise;
    
    // Clear the in-flight request
    clearContentsInFlight(userId);
    
    return contentsResult;
  }, [
    shouldRefreshContentsCache, 
    getCachedContents, 
    getContentsInFlight, 
    setContentsInFlight, 
    clearContentsInFlight, 
    cacheContents, 
    setUserContents
  ]);

  return {
    fetchUserProfileData,
    fetchUserContents,
    clearProfileCacheForUser
  };
};
