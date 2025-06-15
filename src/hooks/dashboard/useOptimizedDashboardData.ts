
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Simple in-memory cache with TTL
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const useOptimizedDashboardData = () => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [publishedContents, setPublishedContents] = useState<any[]>([]);
  const [purchasedContents, setPurchasedContents] = useState<any[]>([]);
  const [marketplaceContents, setMarketplaceContents] = useState<any[]>([]);
  
  const userId = useMemo(() => user?.id || '', [user?.id]);
  const hasFetchedRef = useRef(false);

  // Optimized fetch function with better error handling and proper sorting
  const fetchUserContents = useCallback(async () => {
    if (!userId || hasFetchedRef.current) return;
    
    const cacheKey = `dashboard_${userId}`;
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      setPublishedContents(cachedData.publishedContents);
      setPurchasedContents(cachedData.purchasedContents);
      setMarketplaceContents(cachedData.marketplaceContents);
      setLoading(false);
      hasFetchedRef.current = true;
      return;
    }

    setLoading(true);

    try {
      // Fetch only essential data first - sorted by created_at descending (latest first)
      const [publishedResult, transactionsResult] = await Promise.all([
        supabase
          .from('contents')
          .select('id, title, teaser, price, content_type, creator_name, created_at, status, views')
          .eq('creator_id', userId)
          .order('created_at', { ascending: false }),
          
        supabase
          .from('transactions')
          .select('content_id, contents(id, title, teaser, price, content_type, creator_name, created_at)')
          .eq('user_id', userId)
      ]);
      
      if (publishedResult.error) throw publishedResult.error;
      if (transactionsResult.error) throw transactionsResult.error;
      
      const purchased = transactionsResult.data?.map(tx => tx.contents).filter(Boolean) || [];
      
      // Fetch marketplace data separately and limit it - sorted by created_at descending
      const marketplaceResult = await supabase
        .from('contents')
        .select('id, title, teaser, price, content_type, creator_name, created_at')
        .neq('creator_id', userId)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(12); // Reduce initial load
      
      const data = {
        publishedContents: publishedResult.data || [],
        purchasedContents: purchased,
        marketplaceContents: marketplaceResult.data || []
      };
      
      // Cache the results
      setCachedData(cacheKey, data);
      
      setPublishedContents(data.publishedContents);
      setPurchasedContents(data.purchasedContents);
      setMarketplaceContents(data.marketplaceContents);
      hasFetchedRef.current = true;
      
    } catch (error) {
      console.error("Error fetching dashboard content:", error);
      toast({
        title: "Failed to load content",
        description: "There was an error loading your content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  // Function to invalidate cache and refetch data
  const invalidateCache = useCallback(() => {
    const cacheKey = `dashboard_${userId}`;
    cache.delete(cacheKey);
    hasFetchedRef.current = false;
    if (userId) {
      fetchUserContents();
    }
  }, [userId, fetchUserContents]);

  useEffect(() => {
    if (userId) {
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

  // Reset when user changes
  useEffect(() => {
    hasFetchedRef.current = false;
  }, [userId]);

  return {
    loading,
    publishedContents,
    purchasedContents,
    marketplaceContents,
    fetchUserContents,
    invalidateCache
  };
};
