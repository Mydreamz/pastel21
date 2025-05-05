
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Content } from '@/types/content';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { supabaseToContent } from '@/hooks/content/useContentMapping';

interface ContentCacheContextType {
  cachedContents: Record<string, Content>;
  getCachedContent: (contentId: string) => Content | null;
  addToCache: (content: Content) => void;
  loadContent: (contentId: string) => Promise<Content | null>;
  invalidateCache: (contentId?: string) => void;
  purchasedContentIds: Set<string>;
  setPurchasedContentId: (contentId: string) => void;
  checkPurchaseStatus: (contentId: string, userId: string) => Promise<boolean>;
}

const ContentCacheContext = createContext<ContentCacheContextType>({
  cachedContents: {},
  getCachedContent: () => null,
  addToCache: () => {},
  loadContent: async () => null,
  invalidateCache: () => {},
  purchasedContentIds: new Set(),
  setPurchasedContentId: () => {},
  checkPurchaseStatus: async () => false,
});

export const useContentCache = () => useContext(ContentCacheContext);

// Dramatically increased cache duration to 1 hour to reduce requests
const CONTENT_CACHE_DURATION = 60 * 60 * 1000;
const PURCHASE_CACHE_DURATION = 60 * 60 * 1000;

export const ContentCacheProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { toast } = useToast();
  const [cachedContents, setCachedContents] = useState<Record<string, Content>>({});
  // Track purchased content IDs to avoid redundant checks
  const [purchasedContentIds, setPurchasedContentIds] = useState<Set<string>>(new Set());
  // Track pending content requests to prevent duplicate in-flight requests
  const pendingRequests = React.useRef<Record<string, Promise<Content | null>>>({});
  // Track pending purchase checks to prevent duplicate database queries
  const pendingPurchaseChecks = React.useRef<Record<string, Promise<boolean>>>({});
  // Track cache timestamps to implement expiration
  const cacheTimestamps = React.useRef<Record<string, number>>({});
  // Track purchase check timestamps
  const purchaseCheckTimestamps = React.useRef<Record<string, number>>({});
  
  // Stats for monitoring
  const cacheStatsRef = React.useRef({
    hits: 0,
    misses: 0,
    deduplicated: 0,
    purchaseHits: 0,
    purchaseMisses: 0
  });

  // Log cache stats periodically (reduced frequency to every 5 minutes)
  useEffect(() => {
    const logStats = () => {
      console.log('[ContentCache] Stats:', {
        cacheSize: Object.keys(cachedContents).length,
        purchasedIdsSize: purchasedContentIds.size,
        pendingRequestsSize: Object.keys(pendingRequests.current).length,
        pendingPurchaseChecksSize: Object.keys(pendingPurchaseChecks.current).length,
        hits: cacheStatsRef.current.hits,
        misses: cacheStatsRef.current.misses,
        deduplicated: cacheStatsRef.current.deduplicated,
        purchaseHits: cacheStatsRef.current.purchaseHits,
        purchaseMisses: cacheStatsRef.current.purchaseMisses
      });
    };
    
    const interval = setInterval(logStats, 5 * 60 * 1000); // Log every 5 minutes
    return () => clearInterval(interval);
  }, [cachedContents, purchasedContentIds]);

  // Get content from cache with expiration check
  const getCachedContent = useCallback((contentId: string): Content | null => {
    if (!contentId) return null;
    
    const content = cachedContents[contentId];
    const timestamp = cacheTimestamps.current[contentId];
    
    // Check if content exists and is not expired
    if (content && timestamp && (Date.now() - timestamp < CONTENT_CACHE_DURATION)) {
      cacheStatsRef.current.hits++;
      console.log(`[ContentCache] HIT for content ${contentId} (hit #${cacheStatsRef.current.hits})`);
      return content;
    }
    
    return null;
  }, [cachedContents]);

  // Add content to cache with timestamp
  const addToCache = useCallback((content: Content) => {
    if (!content || !content.id) return;
    
    setCachedContents(prev => {
      if (prev[content.id]) return prev; // No change if already cached
      
      // Set cache timestamp
      cacheTimestamps.current[content.id] = Date.now();
      
      return { ...prev, [content.id]: content };
    });
  }, []);

  // Clear specific content or all content from cache
  const invalidateCache = useCallback((contentId?: string) => {
    if (contentId) {
      // Remove specific content
      setCachedContents(prev => {
        const newCache = { ...prev };
        delete newCache[contentId];
        delete cacheTimestamps.current[contentId];
        console.log(`[ContentCache] Invalidated content: ${contentId}`);
        return newCache;
      });
    } else {
      // Clear entire cache
      console.log('[ContentCache] Cleared entire cache');
      setCachedContents({});
      cacheTimestamps.current = {};
    }
  }, []);

  // Load content with improved caching and deduplication
  const loadContent = useCallback(async (contentId: string): Promise<Content | null> => {
    if (!contentId) return null;

    // First check if content is already in cache and not expired
    const cachedContent = getCachedContent(contentId);
    if (cachedContent) {
      return cachedContent;
    }

    // Check if there's already a request in progress for this content
    if (pendingRequests.current[contentId]) {
      cacheStatsRef.current.deduplicated++;
      console.log(`[ContentCache] DEDUP for content ${contentId} (dedup #${cacheStatsRef.current.deduplicated})`);
      return pendingRequests.current[contentId];
    }

    // Create a new request and store it
    cacheStatsRef.current.misses++;
    console.log(`[ContentCache] MISS for content ${contentId} (miss #${cacheStatsRef.current.misses})`);
    
    const request = (async () => {
      try {
        const { data: foundContent, error: contentError } = await supabase
          .from('contents')
          .select('*')
          .eq('id', contentId)
          .maybeSingle();

        if (contentError) {
          throw contentError;
        }

        if (!foundContent) {
          return null;
        }

        const mapped = supabaseToContent(foundContent);
        
        // Cache the results
        addToCache(mapped);
        return mapped;
      } catch (e: any) {
        console.error("[ContentCache] Error loading content:", e);
        toast({
          title: "Error",
          description: e.message || "Failed to load content",
          variant: "destructive",
        });
        return null;
      } finally {
        // Remove from pending requests regardless of outcome
        delete pendingRequests.current[contentId];
      }
    })();

    // Store the promise
    pendingRequests.current[contentId] = request;
    return request;
  }, [getCachedContent, addToCache, toast]);

  // Set purchased content ID with validation
  const setPurchasedContentId = useCallback((contentId: string) => {
    if (!contentId) return;
    
    setPurchasedContentIds(prev => {
      if (prev.has(contentId)) return prev; // No change if already in set
      
      const newSet = new Set(prev);
      newSet.add(contentId);
      console.log(`[ContentCache] Added purchased content: ${contentId}`);
      return newSet;
    });
  }, []);

  // Check purchase status with improved caching and deduplication
  const checkPurchaseStatus = useCallback(async (contentId: string, userId: string): Promise<boolean> => {
    if (!contentId || !userId) return false;
    
    // If we already know it's purchased, return immediately
    if (purchasedContentIds.has(contentId)) {
      cacheStatsRef.current.purchaseHits++;
      console.log(`[ContentCache] Already know ${contentId} is purchased (hit #${cacheStatsRef.current.purchaseHits})`);
      return true;
    }

    // Generate cache key for this check
    const cacheKey = `${contentId}-${userId}`;
    
    // Check timestamp for this purchase check
    const timestamp = purchaseCheckTimestamps.current[cacheKey];
    if (timestamp && (Date.now() - timestamp < PURCHASE_CACHE_DURATION)) {
      // We previously checked this and confirmed not purchased within the cache period
      console.log(`[ContentCache] Using cached negative purchase status for ${cacheKey}`);
      return false;
    }
    
    // If there's already a check in progress, return that
    if (pendingPurchaseChecks.current[cacheKey]) {
      console.log(`[ContentCache] Reusing in-flight purchase check for ${cacheKey}`);
      return pendingPurchaseChecks.current[cacheKey];
    }
    
    cacheStatsRef.current.purchaseMisses++;
    console.log(`[ContentCache] Checking purchase status for ${cacheKey} (miss #${cacheStatsRef.current.purchaseMisses})`);
    
    // Create a new purchase check
    const checkPromise = (async () => {
      try {
        // Efficient check using Supabase's database function instead of multiple queries
        const { data: hasAccess, error: accessError } = await supabase
          .rpc('has_purchased_content', {
            user_id_param: userId,
            content_id_param: contentId
          });
          
        if (accessError) {
          throw accessError;
        }
        
        console.log(`[ContentCache] Purchase check result for ${cacheKey}: ${hasAccess}`);
        
        // Cache the result (positive or negative)
        purchaseCheckTimestamps.current[cacheKey] = Date.now();
        
        // If purchased, add to our cache
        if (hasAccess) {
          setPurchasedContentId(contentId);
        }
        
        return !!hasAccess;
      } catch (err) {
        console.error("[ContentCache] Error checking purchase status:", err);
        return false;
      } finally {
        // Remove from pending checks
        delete pendingPurchaseChecks.current[cacheKey];
      }
    })();
    
    // Store the promise
    pendingPurchaseChecks.current[cacheKey] = checkPromise;
    return checkPromise;
  }, [purchasedContentIds, setPurchasedContentId]);

  const contextValue = {
    cachedContents,
    getCachedContent,
    addToCache,
    loadContent,
    invalidateCache,
    purchasedContentIds,
    setPurchasedContentId,
    checkPurchaseStatus,
  };

  return (
    <ContentCacheContext.Provider value={contextValue}>
      {children}
    </ContentCacheContext.Provider>
  );
};
