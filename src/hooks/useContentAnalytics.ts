
import { useState, useEffect, useMemo } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface ViewData {
  contentId: string;
  timestamp: number;
}

interface ContentAnalytics {
  totalViews: number;
  uniqueViews: number;
  revenue: number;
  viewsOverTime: { date: string; views: number }[];
  popularContent: { title: string; views: number }[];
}

export const useContentAnalytics = (timeRange: '7d' | '30d' | 'all' = '7d', contentId?: string) => {
  const [analytics, setAnalytics] = useState<ContentAnalytics>({
    totalViews: 0,
    uniqueViews: 0,
    revenue: 0,
    viewsOverTime: [],
    popularContent: []
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateAnalytics = async () => {
      setIsLoading(true);
      try {
        // Simulate API call for more efficient loading
        setTimeout(() => {
          // Get local storage data (in real app this would be from database)
          const views: ViewData[] = JSON.parse(localStorage.getItem('contentViews') || '[]');
          const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
          const contents = JSON.parse(localStorage.getItem('contents') || '[]');
          
          // Filter views for specific content if contentId provided
          const contentViews = contentId 
            ? views.filter(view => view.contentId === contentId)
            : views;
          
          // Apply time range filter
          const now = new Date().getTime();
          const filteredViews = timeRange === 'all' 
            ? contentViews 
            : contentViews.filter(view => {
                const days = timeRange === '7d' ? 7 : 30;
                const cutoff = now - (days * 24 * 60 * 60 * 1000);
                return view.timestamp >= cutoff;
              });
          
          // Calculate unique views by counting unique timestamps
          const uniqueViewsCount = new Set(filteredViews.map(view => view.timestamp)).size;
          
          // Calculate revenue within timeframe
          const cutoffDate = timeRange === 'all' 
            ? new Date(0) 
            : new Date(Date.now() - (timeRange === '7d' ? 7 : 30) * 24 * 60 * 60 * 1000);
          
          const contentRevenue = transactions.reduce((sum: number, tx: any) => {
            const txDate = new Date(tx.timestamp);
            if (
              (timeRange === 'all' || txDate >= cutoffDate) && 
              (!contentId || tx.contentId === contentId)
            ) {
              return sum + parseFloat(tx.amount);
            }
            return sum;
          }, 0);
          
          // Group views by date for the chart
          const viewsByDate = filteredViews.reduce((acc: {[key: string]: number}, view) => {
            const date = new Date(view.timestamp).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          }, {});
          
          // Create date range based on selected timeframe
          const daysToShow = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 7;
          const dateRange = [...Array(daysToShow)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (daysToShow - 1 - i));
            return date.toISOString().split('T')[0];
          });
          
          const viewsOverTime = dateRange.map(date => ({
            date,
            views: viewsByDate[date] || 0
          }));
          
          // Calculate popular content - group views by content
          const viewsByContent = filteredViews.reduce((acc: {[key: string]: number}, view) => {
            acc[view.contentId] = (acc[view.contentId] || 0) + 1;
            return acc;
          }, {});
          
          // Map content IDs to titles and sort by views
          const popularContentList = Object.entries(viewsByContent)
            .map(([contentId, views]) => {
              const content = contents.find((c: any) => c.id === contentId);
              return {
                title: content?.title || 'Unknown content',
                views
              };
            })
            .sort((a, b) => b.views - a.views)
            .slice(0, 5);
          
          setAnalytics({
            totalViews: filteredViews.length,
            uniqueViews: uniqueViewsCount,
            revenue: contentRevenue,
            viewsOverTime,
            popularContent: popularContentList
          });
        }, 100); // Small timeout to prevent UI freezing
      } catch (error) {
        console.error("Error calculating analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    calculateAnalytics();
  }, [contentId, timeRange]);

  return { ...analytics, isLoading };
};
