
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useDashboardNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get initial tab from URL or default to 'my-content'
  const getInitialTab = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('tab') || 'my-content';
  };
  
  const [activeTab, setActiveTab] = useState<string>(getInitialTab());
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Update tab when URL changes
  useEffect(() => {
    const currentTab = getInitialTab();
    if (currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [location.search, activeTab]);

  // Update URL when tab changes and handle mobile navigation
  const handleTabChange = useCallback((tabValue: string) => {
    setActiveTab(tabValue);
    
    // Update URL with tab parameter
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', tabValue);
    navigate(`/dashboard?${searchParams.toString()}`, { replace: true });
  }, [navigate, location.search]);

  const handleCreateContent = () => {
    navigate('/create');
  };

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
