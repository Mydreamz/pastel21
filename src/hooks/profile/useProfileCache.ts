
import { useCallback } from 'react';
import { ProfileData } from '@/types/profile';

// Global cache and in-flight request tracking
let globalProfileCache: Record<string, { data: ProfileData | null, timestamp: number }> = {};
let globalUserContentsCache: Record<string, { data: any[], timestamp: number }> = {};
const globalInFlightProfile: Record<string, Promise<ProfileData | null>> = {};
const globalInFlightContents: Record<string, Promise<any[]>> = {};
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

/**
 * Hook to manage profile data caching
 */
export const useProfileCache = () => {
  // Check if profile is in cache and valid
  const shouldRefreshProfileCache = useCallback((userId: string): boolean => {
    const profileCache = globalProfileCache[userId];
    const now = Date.now();
    return !profileCache || (now - profileCache.timestamp) >= CACHE_TIME;
  }, []);

  // Check if contents are in cache and valid
  const shouldRefreshContentsCache = useCallback((userId: string): boolean => {
    const contentsCache = globalUserContentsCache[userId];
    const now = Date.now();
    return !contentsCache || (now - contentsCache.timestamp) >= CACHE_TIME;
  }, []);

  // Store profile in cache
  const cacheProfile = useCallback((userId: string, profileData: ProfileData | null) => {
    globalProfileCache[userId] = { 
      data: profileData, 
      timestamp: Date.now() 
    };
  }, []);

  // Store contents in cache
  const cacheContents = useCallback((userId: string, contents: any[]) => {
    globalUserContentsCache[userId] = { 
      data: contents, 
      timestamp: Date.now() 
    };
  }, []);

  // Get profile from cache if available
  const getCachedProfile = useCallback((userId: string): ProfileData | null => {
    return globalProfileCache[userId]?.data || null;
  }, []);

  // Get contents from cache if available
  const getCachedContents = useCallback((userId: string): any[] => {
    return globalUserContentsCache[userId]?.data || [];
  }, []);

  // Track in-flight profile request
  const setProfileInFlight = useCallback((userId: string, promise: Promise<ProfileData | null>) => {
    globalInFlightProfile[userId] = promise;
    return promise;
  }, []);

  // Track in-flight contents request
  const setContentsInFlight = useCallback((userId: string, promise: Promise<any[]>) => {
    globalInFlightContents[userId] = promise;
    return promise;
  }, []);

  // Get in-flight profile request if exists
  const getProfileInFlight = useCallback((userId: string): Promise<ProfileData | null> | null => {
    return globalInFlightProfile[userId] || null;
  }, []);

  // Get in-flight contents request if exists
  const getContentsInFlight = useCallback((userId: string): Promise<any[]> | null => {
    return globalInFlightContents[userId] || null;
  }, []);

  // Clear in-flight profile request
  const clearProfileInFlight = useCallback((userId: string) => {
    delete globalInFlightProfile[userId];
  }, []);

  // Clear in-flight contents request
  const clearContentsInFlight = useCallback((userId: string) => {
    delete globalInFlightContents[userId];
  }, []);

  const clearProfileCacheForUser = useCallback((userId: string) => {
    if (globalProfileCache[userId]) {
      delete globalProfileCache[userId];
      console.log(`Profile cache cleared for user: ${userId}`);
    }
    if (globalUserContentsCache[userId]) {
      delete globalUserContentsCache[userId];
      console.log(`Contents cache cleared for user: ${userId}`);
    }
  }, []);

  const clearAllCaches = useCallback(() => {
    globalProfileCache = {};
    globalUserContentsCache = {};
    console.log("All profile and content caches have been cleared.");
  }, []);

  return {
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
    clearProfileCacheForUser,
    clearAllCaches,
  };
};
