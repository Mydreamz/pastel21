import React, { createContext, useContext, useState, useCallback } from 'react';
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

  const getCachedContent = useCallback((contentId: string): Content | null => {
    return cachedContents[contentId] || null;
  }, [cachedContents]);

  const addToCache = useCallback((content: Content) => {
    if (!content || !content.id) return;
    
    setCachedContents(prev => ({
      ...prev,
      [content.id]: content
    }));
  }, []);

  const invalidateCache = useCallback((contentId?: string) => {
    if (contentId) {
      // Remove specific content
      setCachedContents(prev => {
        const newCache = { ...prev };
        delete newCache[contentId];
        return newCache;
      });
    } else {
      // Clear entire cache
      setCachedContents({});
    }
  }, []);

  const loadContent = useCallback(async (contentId: string): Promise<Content | null> => {
    if (!contentId) return null;

    // First check if content is already in cache
    if (cachedContents[contentId]) {
      console.log(`Using cached content for ${contentId}`);
      return cachedContents[contentId];
    }

    // Check if there's already a request in progress for this content
    if (pendingRequests.current[contentId]) {
      console.log(`Using pending request for ${contentId}`);
      return pendingRequests.current[contentId];
    }

    // Create a new request and store it
    const request = (async () => {
      try {
        console.log(`Loading content with ID: ${contentId}`);
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
        console.error("Error loading content:", e);
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
  }, [cachedContents, addToCache, toast]);

  const setPurchasedContentId = useCallback((contentId: string) => {
    setPurchasedContentIds(prev => {
      const newSet = new Set(prev);
      newSet.add(contentId);
      return newSet;
    });
  }, []);

  const checkPurchaseStatus = useCallback(async (contentId: string, userId: string): Promise<boolean> => {
    if (!contentId || !userId) return false;
    
    // If we already know it's purchased, return immediately
    if (purchasedContentIds.has(contentId)) {
      return true;
    }

    // Generate cache key for this check
    const cacheKey = `${contentId}-${userId}`;
    
    // If there's already a check in progress, return that
    if (pendingPurchaseChecks.current[cacheKey]) {
      return pendingPurchaseChecks.current[cacheKey];
    }
    
    // Create a new purchase check
    const checkPromise = (async () => {
      try {
        // Check if the user is the creator first (more efficient than querying transactions)
        const { data: content } = await supabase
          .from('contents')
          .select('creator_id')
          .eq('id', contentId)
          .single();
          
        if (content && content.creator_id === userId) {
          // User is the creator, automatically has access
          setPurchasedContentId(contentId);
          return true;
        }
        
        // Otherwise, check transactions
        const { data: transactions, error } = await supabase
          .from('transactions')
          .select('id')
          .eq('content_id', contentId)
          .eq('user_id', userId)
          .eq('is_deleted', false)
          .limit(1);
          
        if (error) {
          throw error;
        }
        
        const hasPurchased = transactions && transactions.length > 0;
        
        // If purchased, add to our cache
        if (hasPurchased) {
          setPurchasedContentId(contentId);
        }
        
        return hasPurchased;
      } catch (err) {
        console.error("Error checking purchase status:", err);
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
