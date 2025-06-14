
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  NavigationItem, 
  createDashboardNavigation, 
  createAuthenticatedNavigation, 
  createGuestNavigation 
} from './navigationConfig';

interface UseNavigationLogicProps {
  openAuthDialog: (tab: 'login' | 'signup') => void;
  onDashboardTabChange?: (tab: string) => void;
  activeDashboardTab?: string;
}

export const useNavigationLogic = ({
  openAuthDialog,
  onDashboardTabChange,
  activeDashboardTab
}: UseNavigationLogicProps) => {
  const location = useLocation();
  const { session } = useAuth();
  const isAuthenticated = !!session;
  const isDashboardPage = location.pathname === '/dashboard';

  const getNavigation = (): NavigationItem[] => {
    if (!isAuthenticated) return createGuestNavigation(openAuthDialog);
    if (isDashboardPage) return createDashboardNavigation(onDashboardTabChange);
    return createAuthenticatedNavigation();
  };

  const isActive = (item: NavigationItem): boolean => {
    // For dashboard tabs, check against activeDashboardTab
    if (item.isDashboardTab && isDashboardPage) {
      return activeDashboardTab === item.tabValue;
    }
    
    // For regular navigation
    if (item.href) {
      if (item.href === '/') {
        return location.pathname === '/';
      }
      if (item.href === '/dashboard') {
        return location.pathname === '/dashboard';
      }
      return location.pathname === item.href;
    }
    
    return false;
  };

  return {
    navigation: getNavigation(),
    isActive
  };
};
