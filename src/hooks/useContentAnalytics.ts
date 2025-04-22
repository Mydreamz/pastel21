
import { useState, useEffect } from 'react';

interface ViewData {
  contentId: string;
  timestamp: number;
}

interface ContentAnalytics {
  totalViews: number;
  uniqueViews: number;
  revenue: number;
  viewsOverTime: { date: string; views: number }[];
}

export const useContentAnalytics = (contentId?: string) => {
  const [analytics, setAnalytics] = useState<ContentAnalytics>({
    totalViews: 0,
    uniqueViews: 0,
    revenue: 0,
    viewsOverTime: []
  });

  useEffect(() => {
    const calculateAnalytics = () => {
      // Get all content views from localStorage
      const views: ViewData[] = JSON.parse(localStorage.getItem('contentViews') || '[]');
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      
      // Filter views for specific content if contentId provided
      const contentViews = contentId 
        ? views.filter(view => view.contentId === contentId)
        : views;

      // Calculate unique views by counting unique timestamps
      const uniqueViewsCount = new Set(contentViews.map(view => view.timestamp)).size;
      
      // Calculate revenue
      const contentRevenue = transactions.reduce((sum: number, tx: any) => {
        if (!contentId || tx.contentId === contentId) {
          return sum + parseFloat(tx.amount);
        }
        return sum;
      }, 0);

      // Group views by date for the chart
      const viewsByDate = contentViews.reduce((acc: {[key: string]: number}, view) => {
        const date = new Date(view.timestamp).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const last7Days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const viewsOverTime = last7Days.map(date => ({
        date,
        views: viewsByDate[date] || 0
      }));

      setAnalytics({
        totalViews: contentViews.length,
        uniqueViews: uniqueViewsCount,
        revenue: contentRevenue,
        viewsOverTime
      });
    };

    calculateAnalytics();
  }, [contentId]);

  return analytics;
};
