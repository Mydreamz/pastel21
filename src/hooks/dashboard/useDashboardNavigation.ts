
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useDashboardNavigation = () => {
  const navigate = useNavigate();
  
  // Use pure React state instead of URL-based navigation
  const [activeTab, setActiveTab] = useState<string>('my-content');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Optimized tab change handler - no URL updates
  const handleTabChange = useCallback((tabValue: string) => {
    setActiveTab(tabValue);
  }, []);

  const handleCreateContent = useCallback(() => {
    navigate('/create');
  }, [navigate]);

  return {
    activeTab,
    activeFilters,
    searchQuery,
    setActiveFilters,
    setSearchQuery,
    handleTabChange,
    handleCreateContent
  };
};
