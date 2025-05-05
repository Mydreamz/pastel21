
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
 * Default cache time in milliseconds (30 minutes instead of 15)
 */
const DEFAULT_CACHE_TIME = 30 * 60 * 1000;

/**
 * Create consistent cache keys to ensure proper cache hit rate
 */
const createCacheKey = (fnName: string, args: any[]): string => {
  try {
    // Use a stable, string-based cache key (avoid object/array references)
    const argString = args.map(arg => {
      if (arg === null) return 'null';
      if (arg === undefined) return 'undefined';
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg);
        } catch (e) {
          return String(arg);
        }
      }
      return String(arg);
    }).join('::');
    
    return `${fnName}::${argString}`;
  } catch (error) {
    console.error('Error creating cache key:', error);
    return `${fnName}::${Date.now()}`;
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
  
  // Tracking info for debugging
  let cacheHits = 0;
  let cacheMisses = 0;
  let deduplications = 0;
  
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const cacheKey = createCacheKey(fnName, args);
    const now = Date.now();
    const cached = responseCache.get(cacheKey);
    
    // Return from cache if valid
    if (cached && now - cached.timestamp < cacheTime) {
      cacheHits++;
      console.log(`[Cache] HIT #${cacheHits} for ${cacheKey} (age: ${Math.round((now - cached.timestamp)/1000)}s)`);
      return cached.data as ReturnType<T>;
    }
    
    // Deduplicate in-flight requests
    if (cached?.promise) {
      deduplications++;
      console.log(`[Cache] DEDUP #${deduplications} for ${cacheKey} (reusing in-flight request)`);
      return cached.promise as ReturnType<T>;
    }
    
    // Cache miss - make new request
    cacheMisses++;
    console.log(`[Cache] MISS #${cacheMisses} for ${cacheKey}`);
    
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
      console.error(`[Cache] Error fetching ${cacheKey}:`, error);
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
    
    console.log(`[Cache] Invalidated ${invalidatedCount} entries matching ${keyPattern}`);
  }, []);
  
  /**
   * Clear the entire cache
   */
  const clearCache = useCallback(() => {
    const size = cacheRef.current.size;
    cacheRef.current.clear();
    console.log(`[Cache] Cleared entire cache (${size} entries)`);
  }, []);
  
  /**
   * Get cache size (for debugging)
   */
  const getCacheSize = useCallback(() => {
    return cacheRef.current.size;
  }, []);
  
  /**
   * Get a summary of the cache contents
   */
  const getCacheSummary = useCallback(() => {
    const categories: Record<string, number> = {};
    
    cacheRef.current.forEach((_, key) => {
      const category = key.split('::')[0];
      categories[category] = (categories[category] || 0) + 1;
    });
    
    console.log('[Cache] Summary:', categories);
    return categories;
  }, []);
  
  return {
    invalidateCache,
    clearCache,
    getCacheSize,
    getCacheSummary
  };
};
