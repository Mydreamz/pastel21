
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createCacheableRequest, useCacheUtils } from '@/utils/requestUtils';

// Trackable request counter for debugging
let requestCounter = 0;

// Cacheable function to fetch all user content in a single go with a stable function reference
const fetchAllUserContent = async (userId: string) => {
  if (!userId) {
    console.warn("Cannot fetch content: Missing user ID");
    return {
      publishedContents: [],
      purchasedContents: [],
      marketplaceContents: []
    };
  }
  
  try {
    // Track requests for debugging
    requestCounter++;
    console.log(`[Request ${requestCounter}] Fetching user content for ${userId}`);
    
    // Use Promise.all to parallelize requests
    const [publishedResult, transactionsResult, marketplaceResult] = await Promise.all([
      supabase
        .from('contents')
        .select('*')
        .eq('creator_id', userId),
        
      supabase
        .from('transactions')
        .select('*, contents(*)')
        .eq('user_id', userId),
        
      supabase
        .from('contents')
        .select('*')
        .neq('creator_id', userId)
        .eq('status', 'published')
        .limit(20) // Limit market content to reduce load
    ]);
    
    if (publishedResult.error) throw publishedResult.error;
    if (transactionsResult.error) throw transactionsResult.error;
    if (marketplaceResult.error) throw marketplaceResult.error;
    
    const purchased = transactionsResult.data?.map(tx => tx.contents).filter(Boolean) || [];
    
    return {
      publishedContents: publishedResult.data || [],
      purchasedContents: purchased,
      marketplaceContents: marketplaceResult.data || []
    };
  } catch (error) {
    console.error("Error in fetchAllUserContent:", error);
    return {
      publishedContents: [],
      purchasedContents: [],
      marketplaceContents: []
    };
  }
};

// Create a cached version of this function with a longer cache time (5 minutes instead of 3)
const getCachedUserContent = createCacheableRequest(fetchAllUserContent, 5 * 60 * 1000);

// Global in-flight request deduplication for dashboard content
const globalDashboardInFlight: Record<string, Promise<any>> = {};

export const useDashboardData = () => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [publishedContents, setPublishedContents] = useState<any[]>([]);
  const [purchasedContents, setPurchasedContents] = useState<any[]>([]);
  const [marketplaceContents, setMarketplaceContents] = useState<any[]>([]);
  const { invalidateCache } = useCacheUtils();
  
  // Use a stable reference for user ID with better null handling
  const userId = useMemo(() => user?.id || '', [user?.id]);

  // Add a ref to ensure we only fetch once per session/mount
  const hasFetchedRef = useRef(false);
  const previousUserIdRef = useRef<string | null>(null);

  // Memoized function to fetch content data with better dependency tracking
  const fetchUserContents = useCallback(async () => {
    if (!userId) return;
    if (globalDashboardInFlight[userId]) {
      console.log(`[Dashboard] Deduplicated fetch for user: ${userId}`);
      const results = await globalDashboardInFlight[userId];
      setPublishedContents(results.publishedContents);
      setPurchasedContents(results.purchasedContents);
      setMarketplaceContents(results.marketplaceContents);
      hasFetchedRef.current = true;
      return;
    }
    if (hasFetchedRef.current && userId === previousUserIdRef.current) return;
    console.log(`[Dashboard] Fetching content for user: ${userId}, previous: ${previousUserIdRef.current}`);
    previousUserIdRef.current = userId;
    setLoading(true);
    globalDashboardInFlight[userId] = getCachedUserContent(userId);
    try {
      const results = await globalDashboardInFlight[userId];
      if (results) {
        setPublishedContents(results.publishedContents);
        setPurchasedContents(results.purchasedContents);
        setMarketplaceContents(results.marketplaceContents);
        hasFetchedRef.current = true;
      }
    } catch (error) {
      console.error("[Dashboard] Error fetching content:", error);
      toast({
        title: "Failed to load content",
        description: "There was an error loading your content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      delete globalDashboardInFlight[userId];
    }
  }, [userId, toast]);

  useEffect(() => {
    if (userId && userId !== previousUserIdRef.current) {
      hasFetchedRef.current = false;
      fetchUserContents();
    }
    if (session === null) {
      navigate('/');
      toast({
        title: "Authentication required",
        description: "Please sign in to access your dashboard",
        variant: "destructive"
      });
    }
  }, [session, userId, navigate, toast, fetchUserContents]);

  return {
    loading,
    publishedContents,
    purchasedContents,
    marketplaceContents,
    fetchUserContents
  };
};
