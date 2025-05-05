
import { useRef, useCallback } from 'react';

/**
 * Cache store for API responses with improved key management and longer default cache time
 */
const responseCache = new Map<string, {
  data: any;
  timestamp: number;
  promise?: Promise<any>;
}>();

/**
 * Default cache time in milliseconds (15 minutes instead of 5)
 */
const DEFAULT_CACHE_TIME = 15 * 60 * 1000;

/**
 * Create consistent cache keys to ensure proper cache hit rate
 */
const createCacheKey = (fnName: string, args: any[]): string => {
  try {
    // Stable serialization to ensure consistent cache keys
    return `${fnName}-${JSON.stringify(args)}`;
  } catch (error) {
    // If JSON stringify fails (circular references), use a simpler approach
    return `${fnName}-${new Date().getTime()}`;
  }
};

/**
 * Utility to create a cacheable request function with improved deduplication
 * @param requestFn The original request function
 * @param cacheTime How long to cache the response (in milliseconds)
 * @returns A cached version of the request function
 */
export const createCacheableRequest = <T extends (...args: any[]) => Promise<any>>(
  requestFn: T,
  cacheTime: number = DEFAULT_CACHE_TIME
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  // Store the function name for better cache keys
  const fnName = requestFn.name || 'anonymous-request';
  
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    // Create a cache key based on the function name and arguments
    const cacheKey = createCacheKey(fnName, args);
    
    const now = Date.now();
    const cached = responseCache.get(cacheKey);
    
    // If we have a valid cache entry, return it
    if (cached && now - cached.timestamp < cacheTime) {
      console.log(`Using cached result for ${cacheKey}`);
      return cached.data as ReturnType<T>;
    }
    
    // If there's already a request in flight, return that promise
    if (cached?.promise) {
      console.log(`Using pending request for ${cacheKey}`);
      return cached.promise as ReturnType<T>;
    }
    
    // Otherwise, make the request and cache the promise
    console.log(`Making new request for ${cacheKey}`);
    const promise = requestFn(...args);
    
    // Store the promise in cache to deduplicate in-flight requests
    responseCache.set(cacheKey, {
      data: null,
      timestamp: now,
      promise
    });
    
    try {
      // Wait for the request to complete
      const result = await promise;
      
      // Update the cache with the result and reset the promise
      responseCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
    } catch (error) {
      // If the request fails, remove it from cache
      responseCache.delete(cacheKey);
      throw error;
    }
  };
};

/**
 * Hook for cache invalidation with improved debugging
 * @returns Functions to manage the cache
 */
export const useCacheUtils = () => {
  // Use a ref to prevent unnecessary rerenders
  const cacheRef = useRef(responseCache);
  
  /**
   * Invalidate specific cache entries by key pattern
   */
  const invalidateCache = useCallback((keyPattern: string | RegExp) => {
    const pattern = typeof keyPattern === 'string' 
      ? new RegExp(keyPattern)
      : keyPattern;
    
    let invalidatedCount = 0;
    
    cacheRef.current.forEach((_, key) => {
      if (pattern.test(key)) {
        cacheRef.current.delete(key);
        invalidatedCount++;
      }
    });
    
    console.log(`Invalidated ${invalidatedCount} cache entries matching ${keyPattern}`);
  }, []);
  
  /**
   * Clear the entire cache
   */
  const clearCache = useCallback(() => {
    const size = cacheRef.current.size;
    cacheRef.current.clear();
    console.log(`Cleared entire cache (${size} entries)`);
  }, []);
  
  /**
   * Get cache size (for debugging)
   */
  const getCacheSize = useCallback(() => {
    return cacheRef.current.size;
  }, []);
  
  return {
    invalidateCache,
    clearCache,
    getCacheSize
  };
};
