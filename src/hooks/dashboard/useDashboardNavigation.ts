
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const useDashboardNavigation = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize tab from URL parameters or default to 'my-content'
  const getInitialTab = () => {
    const tabFromUrl = searchParams.get('tab');
    return ['my-content', 'purchased', 'marketplace'].includes(tabFromUrl || '') 
      ? tabFromUrl! 
      : 'my-content';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab());
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Update URL when tab changes (for bookmarking/sharing)
  const handleTabChange = useCallback((tabValue: string) => {
    setActiveTab(tabValue);
    setSearchParams({ tab: tabValue });
  }, [setSearchParams]);

  // Sync state with URL changes (browser back/forward)
  useEffect(() => {
    const tabFromUrl = getInitialTab();
    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

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
