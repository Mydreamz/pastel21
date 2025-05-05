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
    // Use a stable, string-based cache key (avoid object/array references)
    return `${fnName}-${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join('-')}`;
  } catch (error) {
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
  const fnName = requestFn.name || 'anonymous-request';
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const cacheKey = createCacheKey(fnName, args);
    const now = Date.now();
    const cached = responseCache.get(cacheKey);
    if (cached && now - cached.timestamp < cacheTime) {
      // Remove or comment out logging in production
      // console.log(`Using cached result for ${cacheKey}`);
      return cached.data as ReturnType<T>;
    }
    if (cached?.promise) {
      // console.log(`Using pending request for ${cacheKey}`);
      return cached.promise as ReturnType<T>;
    }
    // console.log(`Making new request for ${cacheKey}`);
    const promise = requestFn(...args);
    responseCache.set(cacheKey, {
      data: null,
      timestamp: now,
      promise
    });
    try {
      const result = await promise;
      responseCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      return result;
    } catch (error) {
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
